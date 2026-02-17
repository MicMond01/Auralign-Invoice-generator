import User from "../models/User.model";
import config from "../config";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from "../utils/errors";
import { IUser, IUserPayload } from "../types";
import jwt, { SignOptions } from "jsonwebtoken";

class AuthService {
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ user: IUser; token: string }> {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> {
    const { email, password } = credentials;

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    user.password = undefined as any;

    return { user, token };
  }

  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async updateProfile(
    userId: string,
    updates: Partial<Pick<IUser, "firstName" | "lastName" | "email">>,
  ): Promise<IUser> {
    // Check if email is being updated and already exists
    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new ConflictError("Email already in use");
      }
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestError("Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();
  }

  async registerAdmin(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ user: IUser; token: string }> {
    // ✅ Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      throw new ConflictError("Admin already exists");
    }
    const user = await User.create({
      ...userData,
      role: "admin",
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  private generateToken(user: IUser): string {
    const payload: IUserPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn,
    };

    return jwt.sign(payload, config.jwt.secret, options);
  }

  verifyToken(token: string): IUserPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as IUserPayload;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }
}

export default new AuthService();

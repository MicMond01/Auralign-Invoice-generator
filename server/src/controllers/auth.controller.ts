import { Response } from "express";
import authService from "../services/auth.service";
import { AuthRequest } from "../types";
import { ResponseUtil } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { UnauthorizedError } from "../utils/errors";

class AuthController {
  register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    const result = await authService.register({
      email,
      password,
      firstName,
      lastName,
    });

    return ResponseUtil.created(res, result, "User registered successfully");
  });

  login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    return ResponseUtil.success(res, result, "Login successful");
  });

  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const user = await authService.getProfile(userId);

    return ResponseUtil.success(
      res,
      { user },
      "Profile retrieved successfully",
    );
  });

  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const updates = req.body;

    const user = await authService.updateProfile(userId, updates);

    return ResponseUtil.success(res, { user }, "Profile updated successfully");
  });

  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(userId, currentPassword, newPassword);

    return ResponseUtil.success(res, null, "Password changed successfully");
  });

  registerAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName, adminSecret } = req.body;

    // ✅ Check admin secret key
    const ADMIN_SECRET = process.env.ADMIN_SECRET || "your-super-secret-key";

    if (adminSecret !== ADMIN_SECRET) {
      throw new UnauthorizedError("Invalid admin secret key");
    }

    const result = await authService.registerAdmin({
      email,
      password,
      firstName,
      lastName,
    });

    return ResponseUtil.created(res, result, "Admin registered successfully");
  });
}

export default new AuthController();

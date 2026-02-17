import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { AuthRequest, IUserPayload } from "../types";
import { UnauthorizedError } from "../utils/errors";
import User from "../models/User.model";

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = jwt.verify(token, config.jwt.secret) as IUserPayload;

    // Verify user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("User no longer exists or is inactive");
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(new UnauthorizedError("Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      next(new UnauthorizedError("Token expired"));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError("Not authenticated"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new UnauthorizedError("Not authorized to access this resource"),
      );
    }

    next();
  };
};

const extractToken = (req: AuthRequest): string | null => {
  // Check Authorization header
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.substring(7);
  }

  // Check cookie
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  return null;
};

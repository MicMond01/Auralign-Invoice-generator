import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { ResponseUtil } from "../utils/response";
import logger from "../utils/logger";

interface MongoError extends Error {
  code?: number;
  keyValue?: any;
  errors?: any;
}

export const errorHandler = (
  err: Error | AppError | MongoError,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  let error = { ...err } as AppError;
  error.message = err.message;

  // Log error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if ((err as MongoError).code === 11000) {
    const field = Object.keys((err as MongoError).keyValue || {})[0];
    const message = `Duplicate field value: ${field}. Please use another value`;
    error = new AppError(message, 409);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values((err as MongoError).errors || {}).map(
      (e: any) => e.message,
    );
    const message = "Validation Error";
    error = new AppError(message, 400);
    return ResponseUtil.error(res, message, 400, errors);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new AppError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new AppError(message, 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  return ResponseUtil.error(res, message, statusCode);
};

export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

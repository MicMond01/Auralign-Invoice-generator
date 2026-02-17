import { Response } from "express";
import { ApiResponse, PaginatedResponse } from "../types";

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200,
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = "Resource created successfully",
  ): Response {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response, message: string = "No content"): Response {
    const response: ApiResponse = {
      success: true,
      message,
    };
    return res.status(204).json(response);
  }

  static error(
    res: Response,
    message: string = "An error occurred",
    statusCode: number = 500,
    errors?: any[],
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T,
    page: number,
    limit: number,
    total: number,
    message: string = "Success",
  ): Response {
    const response: PaginatedResponse<T> = {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
    return res.status(200).json(response);
  }

  static notFound(
    res: Response,
    message: string = "Resource not found",
  ): Response {
    return this.error(res, message, 404);
  }

  static badRequest(
    res: Response,
    message: string = "Bad request",
    errors?: any[],
  ): Response {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(
    res: Response,
    message: string = "Unauthorized",
  ): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = "Forbidden"): Response {
    return this.error(res, message, 403);
  }

  static conflict(res: Response, message: string = "Conflict"): Response {
    return this.error(res, message, 409);
  }

  static internalError(
    res: Response,
    message: string = "Internal server error",
  ): Response {
    return this.error(res, message, 500);
  }
}

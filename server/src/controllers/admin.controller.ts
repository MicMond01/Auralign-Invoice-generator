import { Response } from "express";
import adminService from "../services/admin.service";
import { AuthRequest } from "../types";
import { ResponseUtil } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";

class AdminController {
  createCompanyWithUser = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const data = req.body;

      const result = await adminService.createCompanyWithUser(data);

      return ResponseUtil.created(
        res,
        {
          company: result.company,
          user: result.user,
          temporaryPassword: result.temporaryPassword,
        },
        "Company and user account created successfully. Please share the temporary password with the user.",
      );
    },
  );

  getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await adminService.getAllUsers(page, limit);

    return ResponseUtil.paginated(
      res,
      result.users,
      result.page,
      limit,
      result.total,
      "Users retrieved successfully",
    );
  });

  getAllCompanies = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await adminService.getAllCompanies(page, limit);

    return ResponseUtil.paginated(
      res,
      result.companies,
      result.page,
      limit,
      result.total,
      "All companies retrieved successfully",
    );
  });

  deactivateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;

    await adminService.deactivateUser(userId);

    return ResponseUtil.success(res, null, "User deactivated successfully");
  });

  activateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;

    await adminService.activateUser(userId);

    return ResponseUtil.success(res, null, "User activated successfully");
  });

  resetUserPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;

    const newPassword = await adminService.resetUserPassword(userId);

    return ResponseUtil.success(
      res,
      { temporaryPassword: newPassword },
      "Password reset successfully. Please share this temporary password with the user.",
    );
  });

  deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;

    await adminService.deleteUser(userId);

    return ResponseUtil.success(
      res,
      null,
      "User and all associated data deleted successfully",
    );
  });
}

export default new AdminController();

import { Response } from "express";
import companyService from "../services/company.service";
import { AuthRequest } from "../types";
import { ResponseUtil } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";

class CompanyController {
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const companyData = req.body;

    const company = await companyService.create(userId, companyData);

    return ResponseUtil.created(
      res,
      { company },
      "Company created successfully",
    );
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const company = await companyService.getById(id, userId);

    return ResponseUtil.success(
      res,
      { company },
      "Company retrieved successfully",
    );
  });

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await companyService.getAll(userId, page, limit);

    return ResponseUtil.paginated(
      res,
      result.companies,
      result.page,
      limit,
      result.total,
      "Companies retrieved successfully",
    );
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updates = req.body;

    const company = await companyService.update(id, userId, updates);

    return ResponseUtil.success(
      res,
      { company },
      "Company updated successfully",
    );
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    await companyService.delete(id, userId);

    return ResponseUtil.success(res, null, "Company deleted successfully");
  });

  uploadLogo = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!req.file) {
      return ResponseUtil.badRequest(res, "No file uploaded");
    }

    const logoPath = `/uploads/${req.file.filename}`;
    const company = await companyService.uploadLogo(id, userId, logoPath);

    return ResponseUtil.success(res, { company }, "Logo uploaded successfully");
  });

  uploadSignature = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!req.file) {
      return ResponseUtil.badRequest(res, "No file uploaded");
    }

    const signaturePath = `/uploads/${req.file.filename}`;
    const company = await companyService.uploadSignature(
      id,
      userId,
      signaturePath,
    );

    return ResponseUtil.success(
      res,
      { company },
      "Signature uploaded successfully",
    );
  });

  updateAccountDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updates = req.body;

    const company = await companyService.updateAccountDetails(id, userId, updates);

    return ResponseUtil.success(
      res,
      { company },
      "Account details updated successfully",
    );
  });
}

export default new CompanyController();

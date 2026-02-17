import { Response } from "express";
import customerService from "../services/customer.service";
import { AuthRequest } from "../types";
import { ResponseUtil } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";

class CustomerController {
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const customerData = req.body;

    const customer = await customerService.create(userId, customerData);

    return ResponseUtil.created(
      res,
      { customer },
      "Customer created successfully",
    );
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const customer = await customerService.getById(id, userId);

    return ResponseUtil.success(
      res,
      { customer },
      "Customer retrieved successfully",
    );
  });

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const query = req.query;

    const result = await customerService.getAll(userId, query);

    return ResponseUtil.paginated(
      res,
      result.customers,
      result.page,
      query.limit ? parseInt(query.limit as string) : 10,
      result.total,
      "Customers retrieved successfully",
    );
  });

  getByCompany = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { companyId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await customerService.getByCompany(
      companyId,
      userId,
      page,
      limit,
    );

    return ResponseUtil.paginated(
      res,
      result.customers,
      result.page,
      limit,
      result.total,
      "Customers retrieved successfully",
    );
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updates = req.body;

    const customer = await customerService.update(id, userId, updates);

    return ResponseUtil.success(
      res,
      { customer },
      "Customer updated successfully",
    );
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    await customerService.delete(id, userId);

    return ResponseUtil.success(res, null, "Customer deleted successfully");
  });

  search = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { q, companyId } = req.query;

    if (!q) {
      return ResponseUtil.badRequest(res, "Search query is required");
    }

    const customers = await customerService.search(
      userId,
      q as string,
      companyId as string,
    );

    return ResponseUtil.success(
      res,
      { customers },
      "Search completed successfully",
    );
  });
}

export default new CustomerController();

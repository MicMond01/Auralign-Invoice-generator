import { Response } from "express";
import invoiceService from "../services/invoice.service";
import pdfService from "../services/pdf.service";
import { AuthRequest } from "../types";
import { ResponseUtil } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";

class InvoiceController {
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const invoiceData = req.body;

    const invoice = await invoiceService.create(userId, invoiceData);

    return ResponseUtil.created(
      res,
      { invoice },
      "Invoice created successfully",
    );
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const invoice = await invoiceService.getById(id, userId);

    return ResponseUtil.success(
      res,
      { invoice },
      "Invoice retrieved successfully",
    );
  });

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const query = req.query;

    const result = await invoiceService.getAll(userId, query);

    return ResponseUtil.paginated(
      res,
      result.invoices,
      result.page,
      query.limit ? parseInt(query.limit as string) : 10,
      result.total,
      "Invoices retrieved successfully",
    );
  });

  getByCustomer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { customerId } = req.params;

    const invoices = await invoiceService.getByCustomer(customerId, userId);

    return ResponseUtil.success(
      res,
      { invoices },
      "Customer invoices retrieved successfully",
    );
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updates = req.body;

    const invoice = await invoiceService.update(id, userId, updates);

    return ResponseUtil.success(
      res,
      { invoice },
      "Invoice updated successfully",
    );
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    await invoiceService.delete(id, userId);

    return ResponseUtil.success(res, null, "Invoice deleted successfully");
  });

  markAsPaid = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { amountPaid } = req.body;

    const invoice = await invoiceService.markAsPaid(id, userId, amountPaid);

    return ResponseUtil.success(res, { invoice }, "Invoice marked as paid");
  });

  updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { status } = req.body;

    const invoice = await invoiceService.updateStatus(id, userId, status);

    return ResponseUtil.success(res, { invoice }, "Invoice status updated");
  });

  getDrafts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const invoices = await invoiceService.getDrafts(userId);

    return ResponseUtil.success(res, { invoices }, "Draft invoices retrieved");
  });

  finalizeDraft = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const invoice = await invoiceService.finalizeDraft(id, userId);

    return ResponseUtil.success(
      res,
      { invoice },
      "Draft finalized successfully",
    );
  });

  generatePDF = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const invoice = await invoiceService.getById(id, userId);

    // Generate PDF
    const pdfPath = await pdfService.generatePDF({
      invoice: invoice as any,
      company: invoice.companyId as any,
      customer: invoice.customerId as any,
    });

    // Update invoice with PDF path
    await invoiceService.update(id, userId, { pdfPath });

    // Send file for download
    res.download(pdfPath);
  });

  getStatistics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { companyId } = req.query;

    const stats = await invoiceService.getStatistics(
      userId,
      companyId as string | undefined,
    );

    return ResponseUtil.success(
      res,
      { stats },
      "Statistics retrieved successfully",
    );
  });
}

export default new InvoiceController();

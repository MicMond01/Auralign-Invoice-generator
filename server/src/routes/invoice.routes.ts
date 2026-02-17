import { Router } from "express";
import invoiceController from "../controllers/invoice.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createInvoiceValidation,
  updateInvoiceValidation,
  getInvoiceValidation,
  deleteInvoiceValidation,
  listInvoicesValidation,
} from "../validations/invoice.validation";
import { createLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Invoice CRUD
router.post(
  "/",
  createLimiter,
  validate(createInvoiceValidation),
  invoiceController.create,
);
router.get("/", validate(listInvoicesValidation), invoiceController.getAll);
router.get("/drafts", invoiceController.getDrafts);
router.get("/statistics", invoiceController.getStatistics);
router.get("/customer/:customerId", invoiceController.getByCustomer);
router.get("/:id", validate(getInvoiceValidation), invoiceController.getById);
router.put("/:id", validate(updateInvoiceValidation), invoiceController.update);
router.delete(
  "/:id",
  validate(deleteInvoiceValidation),
  invoiceController.delete,
);

// Invoice actions
router.post("/:id/finalize", invoiceController.finalizeDraft);
router.post("/:id/mark-paid", invoiceController.markAsPaid);
router.put("/:id/status", invoiceController.updateStatus);
router.get("/:id/pdf", invoiceController.generatePDF);

export default router;

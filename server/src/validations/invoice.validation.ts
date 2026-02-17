import { body, param, query } from "express-validator";

export const createInvoiceValidation = [
  body("companyId").isMongoId().withMessage("Invalid company ID"),
  body("customerId").isMongoId().withMessage("Invalid customer ID"),
  body("invoiceType")
    .isIn(["invoice", "proforma"])
    .withMessage("Invoice type must be either invoice or proforma"),
  body("invoiceDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("items.*.description")
    .trim()
    .notEmpty()
    .withMessage("Item description is required"),
  body("items.*.quantity")
    .isFloat({ min: 0 })
    .withMessage("Quantity must be a positive number"),
  body("items.*.unitPrice")
    .isFloat({ min: 0 })
    .withMessage("Unit price must be a positive number"),
  body("additionalCharges")
    .optional()
    .isArray()
    .withMessage("Additional charges must be an array"),
  body("additionalCharges.*.type")
    .optional()
    .isIn([
      "vat",
      "tax",
      "shipping",
      "transportation",
      "fuel",
      "flight",
      "discount",
      "other",
    ])
    .withMessage("Invalid charge type"),
  body("additionalCharges.*.label")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Charge label is required"),
  body("additionalCharges.*.value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Charge value must be a positive number"),
  body("additionalCharges.*.isPercentage")
    .optional()
    .isBoolean()
    .withMessage("isPercentage must be a boolean"),
  body("outstandingBill")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Outstanding bill must be a positive number"),
  body("amountPaid")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount paid must be a positive number"),
  body("notes").optional().trim(),
  body("termsAndConditions").optional().trim(),
  body("isDraft").optional().isBoolean(),
];

export const updateInvoiceValidation = [
  param("id").isMongoId().withMessage("Invalid invoice ID"),
  body("invoiceType")
    .optional()
    .isIn(["invoice", "proforma"])
    .withMessage("Invoice type must be either invoice or proforma"),
  body("invoiceDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date"),
  body("items")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("items.*.description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Item description is required"),
  body("items.*.quantity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Quantity must be a positive number"),
  body("items.*.unitPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Unit price must be a positive number"),
  body("additionalCharges")
    .optional()
    .isArray()
    .withMessage("Additional charges must be an array"),
  body("outstandingBill")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Outstanding bill must be a positive number"),
  body("amountPaid")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount paid must be a positive number"),
  body("status")
    .optional()
    .isIn(["draft", "sent", "paid", "cancelled", "overdue"])
    .withMessage("Invalid status"),
  body("notes").optional().trim(),
  body("termsAndConditions").optional().trim(),
  body("isDraft").optional().isBoolean(),
];

export const getInvoiceValidation = [
  param("id").isMongoId().withMessage("Invalid invoice ID"),
];

export const deleteInvoiceValidation = [
  param("id").isMongoId().withMessage("Invalid invoice ID"),
];

export const listInvoicesValidation = [
  query("companyId").optional().isMongoId().withMessage("Invalid company ID"),
  query("customerId").optional().isMongoId().withMessage("Invalid customer ID"),
  query("invoiceType")
    .optional()
    .isIn(["invoice", "proforma"])
    .withMessage("Invalid invoice type"),
  query("status")
    .optional()
    .isIn(["draft", "sent", "paid", "cancelled", "overdue"])
    .withMessage("Invalid status"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search").optional().trim(),
  query("startDate").optional().isISO8601().withMessage("Invalid start date"),
  query("endDate").optional().isISO8601().withMessage("Invalid end date"),
];

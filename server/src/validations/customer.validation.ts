import { body, param, query } from "express-validator";

export const createCustomerValidation = [
  body("companyId").isMongoId().withMessage("Invalid company ID"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Customer name must be between 2 and 100 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phone").optional().trim(),
  body("address").optional().trim(),
  body("city").optional().trim(),
  body("state").optional().trim(),
  body("country").optional().trim(),
  body("taxId").optional().trim(),
  body("notes").optional().trim(),
];

export const updateCustomerValidation = [
  param("id").isMongoId().withMessage("Invalid customer ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Customer name must be between 2 and 100 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phone").optional().trim(),
  body("address").optional().trim(),
  body("city").optional().trim(),
  body("state").optional().trim(),
  body("country").optional().trim(),
  body("taxId").optional().trim(),
  body("notes").optional().trim(),
];

export const getCustomerValidation = [
  param("id").isMongoId().withMessage("Invalid customer ID"),
];

export const deleteCustomerValidation = [
  param("id").isMongoId().withMessage("Invalid customer ID"),
];

export const listCustomersValidation = [
  query("companyId").optional().isMongoId().withMessage("Invalid company ID"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search").optional().trim(),
];

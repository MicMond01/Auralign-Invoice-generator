import { body, param } from "express-validator";

export const createCompanyValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),
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
  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Please provide a valid URL"),
  body("primaryColor")
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Please provide a valid hex color"),
  body("accountDetails")
    .isArray({ min: 1 })
    .withMessage("At least one account detail is required"),
  body("accountDetails.*.bankName")
    .trim()
    .notEmpty()
    .withMessage("Bank name is required"),
  body("accountDetails.*.accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required"),
  body("accountDetails.*.accountName")
    .trim()
    .notEmpty()
    .withMessage("Account name is required"),
  body("accountDetails.*.isPrimary").optional().isBoolean(),
];

export const updateCompanyValidation = [
  param("id").isMongoId().withMessage("Invalid company ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),
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
  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Please provide a valid URL"),
  body("primaryColor")
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Please provide a valid hex color"),
  body("accountDetails")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one account detail is required"),
];

export const getCompanyValidation = [
  param("id").isMongoId().withMessage("Invalid company ID"),
];

export const deleteCompanyValidation = [
  param("id").isMongoId().withMessage("Invalid company ID"),
];

import { Router } from "express";
import adminController from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { body } from "express-validator";

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize("admin"));

// Validation for creating company with user
const createCompanyWithUserValidation = [
  body("companyName").trim().notEmpty().withMessage("Company name is required"),
  body("accountDetails")
    .isArray({ min: 1 })
    .withMessage("At least one account is required"),
  body("userFirstName")
    .trim()
    .notEmpty()
    .withMessage("User first name is required"),
  body("userLastName")
    .trim()
    .notEmpty()
    .withMessage("User last name is required"),
  body("userEmail").isEmail().withMessage("Valid user email is required"),
];

// Create company with user account
router.post(
  "/create-company-user",
  validate(createCompanyWithUserValidation),
  adminController.createCompanyWithUser,
);

// User management
router.get("/users", adminController.getAllUsers);
router.post("/users/:userId/deactivate", adminController.deactivateUser);
router.post("/users/:userId/activate", adminController.activateUser);
router.post("/users/:userId/reset-password", adminController.resetUserPassword);
router.delete("/users/:userId", adminController.deleteUser);

// Company management
router.get("/companies", adminController.getAllCompanies);

export default router;

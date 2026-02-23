import { Router } from "express";
import multer from "multer";
import path from "path";
import companyController from "../controllers/company.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createCompanyValidation,
  updateCompanyValidation,
  getCompanyValidation,
  deleteCompanyValidation,
} from "../validations/company.validation";
import { createLimiter } from "../middleware/rateLimiter.middleware";
import config from "../config";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.upload.uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (_req, file, cb) => {
    if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
});

// All routes require authentication
router.use(authenticate);

// Company CRUD
router.post(
  "/",
  createLimiter,
  validate(createCompanyValidation),
  authorize("admin"),
  companyController.create,
);
router.get("/", companyController.getAll);
router.get("/:id", validate(getCompanyValidation), companyController.getById);
router.put("/:id", validate(updateCompanyValidation), companyController.update);
router.delete(
  "/:id",
  validate(deleteCompanyValidation),
  companyController.delete,
);

// File uploads
router.post("/:id/logo", upload.single("logo"), companyController.uploadLogo);
router.post(
  "/:id/signature",
  upload.single("signature"),
  companyController.uploadSignature,
);

router.put("/:id/account-details", companyController.updateAccountDetails);

export default router;

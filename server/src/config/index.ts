import dotenv from "dotenv";
import path from "path";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not defined");
}

if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
  throw new Error("MONGODB_URI must be defined in production");
}

interface Config {
  env: string;
  port: number;
  apiVersion: string;
  mongodb: {
    uri: string;
    testUri: string;
  };
  jwt: {
    secret: string;
    expiresIn: SignOptions["expiresIn"];
    refreshSecret: string;
    refreshExpiresIn: SignOptions["expiresIn"];
  };
  cors: {
    allowedOrigins: string[];
  };
  upload: {
    maxFileSize: number;
    uploadPath: string;
    allowedMimeTypes: string[];
  };
  pdf: {
    storagePath: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  logging: {
    level: string;
    filePath: string;
  };
  company: {
    defaultCurrency: string;
    defaultCurrencySymbol: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  apiVersion: process.env.API_VERSION || "v1",

  mongodb: {
    uri:
      process.env.MONGODB_URI || "mongodb://localhost:27017/invoice_generator",
    testUri:
      process.env.MONGODB_TEST_URI ||
      "mongodb://localhost:27017/invoice_generator_test",
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: (process.env.JWT_EXPIRE as SignOptions["expiresIn"]) || "7d",
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRE as SignOptions["expiresIn"]) || "30d",
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
    uploadPath:
      process.env.UPLOAD_PATH || path.join(__dirname, "../../uploads"),
    allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  },

  pdf: {
    storagePath:
      process.env.PDF_STORAGE_PATH ||
      path.join(__dirname, "../../storage/pdfs"),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    filePath: process.env.LOG_FILE_PATH || path.join(__dirname, "../../logs"),
  },

  company: {
    defaultCurrency: process.env.DEFAULT_CURRENCY || "NGN",
    defaultCurrencySymbol: process.env.DEFAULT_CURRENCY_SYMBOL || "₦",
  },
};

export default config;

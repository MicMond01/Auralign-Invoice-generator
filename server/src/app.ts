import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import config from "./config";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/error.middleware";
// import { apiLimiter } from "./middleware/rateLimiter.middleware";
import logger from "./utils/logger";

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
  }),
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Static files
app.use("/uploads", express.static(config.upload.uploadPath));
app.use("/pdfs", express.static(config.pdf.storagePath));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Rate limiting
// app.use("/api", apiLimiter);

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "Invoice Generator API",
    version: config.apiVersion,
    status: "running",
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;

import { Router } from "express";
import authRoutes from "./auth.routes";
import companyRoutes from "./company.routes";
import customerRoutes from "./customer.routes";
import invoiceRoutes from "./invoice.routes";
import adminRoutes from "./admin.routes";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount routes
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/companies", companyRoutes);
router.use("/customers", customerRoutes);
router.use("/invoices", invoiceRoutes);

export default router;

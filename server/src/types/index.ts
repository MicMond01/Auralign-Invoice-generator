import { Request } from "express";
import { Document, Types } from "mongoose";

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPayload {
  userId: string;
  email: string;
  role: string;
}

// Company Types
export interface ICompany extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  primaryColor: string;
  secondaryColor?: string;
  accountDetails: IAccountDetail[];
  signature?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccountDetail {
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary?: boolean;
}

// Customer Types
export interface ICustomer extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  companyId: Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice Item Types
export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Additional Charge Types
export interface IAdditionalCharge {
  type:
    | "vat"
    | "tax"
    | "shipping"
    | "transportation"
    | "fuel"
    | "flight"
    | "discount"
    | "other";
  label: string;
  value: number;
  isPercentage: boolean;
  amount: number;
}

// Invoice/Receipt Types
export interface IInvoice extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  companyId: Types.ObjectId;
  customerId: Types.ObjectId;
  invoiceNumber: string;
  invoiceType: "invoice" | "proforma";
  invoiceDate: Date;
  dueDate?: Date;
  status: "draft" | "sent" | "paid" | "cancelled" | "overdue";
  items: IInvoiceItem[];
  subtotal: number;
  additionalCharges: IAdditionalCharge[];
  outstandingBill?: number;
  grandTotal: number;
  amountPaid?: number;
  balance?: number;
  notes?: string;
  termsAndConditions?: string;
  pdfPath?: string;
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Counter for Auto-increment
export interface ICounter extends Document {
  _id: Types.ObjectId;
  seq: number;
}

// Request Extensions
export interface AuthRequest extends Request {
  user?: IUserPayload;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Query Parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  companyId?: string;
  customerId?: string;
}

// PDF Generation Options
export interface PDFOptions {
  invoice: IInvoice;
  company: ICompany;
  customer: ICustomer;
}

// Email Options
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

// Statistics Types
export interface IInvoiceStats {
  totalInvoices: number;
  totalProformas: number;
  totalRevenue: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  outstandingAmount: number;
}

export interface IDashboardStats {
  invoiceStats: IInvoiceStats;
  recentInvoices: IInvoice[];
  topCustomers: Array<{
    customer: ICustomer;
    totalAmount: number;
    invoiceCount: number;
  }>;
}

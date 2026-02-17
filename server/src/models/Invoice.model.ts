import mongoose, { Schema } from "mongoose";
import { IInvoice, IInvoiceItem, IAdditionalCharge } from "../types";
import Counter from "./Counter.model";

const invoiceItemSchema = new Schema<IInvoiceItem>(
  {
    description: {
      type: String,
      required: [true, "Item description is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: [0, "Unit price cannot be negative"],
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const additionalChargeSchema = new Schema<IAdditionalCharge>(
  {
    type: {
      type: String,
      enum: [
        "vat",
        "tax",
        "shipping",
        "transportation",
        "fuel",
        "flight",
        "discount",
        "other",
      ],
      required: true,
    },
    label: {
      type: String,
      required: [true, "Charge label is required"],
      trim: true,
    },
    value: {
      type: Number,
      required: [true, "Charge value is required"],
    },
    isPercentage: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const invoiceSchema = new Schema<IInvoice>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company ID is required"],
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer ID is required"],
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    invoiceType: {
      type: String,
      enum: ["invoice", "proforma"],
      default: "invoice",
      required: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "cancelled", "overdue"],
      default: "draft",
    },
    items: {
      type: [invoiceItemSchema],
      validate: [
        {
          validator: function (v: IInvoiceItem[]) {
            return v.length > 0;
          },
          message: "At least one item is required",
        },
      ],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    additionalCharges: {
      type: [additionalChargeSchema],
      default: [],
    },
    outstandingBill: {
      type: Number,
      min: 0,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      min: 0,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    termsAndConditions: {
      type: String,
      trim: true,
    },
    pdfPath: {
      type: String,
      trim: true,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Auto-generate invoice number
invoiceSchema.pre("save", async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "invoiceNumber" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );

      const paddedNumber = String(counter.seq).padStart(6, "0");
      this.invoiceNumber = paddedNumber;
    } catch (error: any) {
      return next(error);
    }
  }

  // Calculate balance
  this.balance = this.grandTotal - (this.amountPaid || 0);

  next();
});

// Update status based on payment and date
invoiceSchema.pre("save", function (next) {
  if (!this.isDraft) {
    if (this.balance === 0 && (this.amountPaid || 0) > 0) {
      this.status = "paid";
    } else if (
      this.dueDate &&
      new Date() > new Date(this.dueDate) &&
      (this.balance ?? 0) > 0
    ) {
      this.status = "overdue";
    } else if (this.status === "draft") {
      this.status = "sent";
    }
  }
  next();
});

// Indexes for better query performance
invoiceSchema.index({ userId: 1, companyId: 1 });
invoiceSchema.index({ customerId: 1 });
invoiceSchema.index({ invoiceType: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ invoiceDate: -1 });
invoiceSchema.index({ isDraft: 1 });
invoiceSchema.index({ createdAt: -1 });

// Compound indexes for common queries
invoiceSchema.index({ userId: 1, status: 1, invoiceDate: -1 });
invoiceSchema.index({ companyId: 1, customerId: 1, invoiceDate: -1 });

export default mongoose.model<IInvoice>("Invoice", invoiceSchema);

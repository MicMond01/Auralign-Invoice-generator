import Invoice from "../models/Invoice.model";
import companyService from "./company.service";
import customerService from "./customer.service";
import {
  IInvoice,
  IInvoiceItem,
  IAdditionalCharge,
  QueryParams,
} from "../types";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { Types } from "mongoose";

class InvoiceService {
  async create(
    userId: string,
    invoiceData: Partial<IInvoice> & {
      companyId: string;
      customerId: string;
      items: IInvoiceItem[];
    },
  ): Promise<IInvoice> {
    // Verify company and customer ownership
    await Promise.all([
      companyService.verifyOwnership(invoiceData.companyId, userId),
      customerService.getById(invoiceData.customerId, userId),
    ]);

    // Calculate totals
    const calculatedData = this.calculateInvoiceTotals(
      invoiceData.items,
      invoiceData.additionalCharges || [],
      invoiceData.outstandingBill || 0,
    );

    const invoice = await Invoice.create({
      ...invoiceData,
      userId: new Types.ObjectId(userId),
      companyId: new Types.ObjectId(invoiceData.companyId),
      customerId: new Types.ObjectId(invoiceData.customerId),
      ...calculatedData,
    });

    return await this.getById(invoice._id.toString(), userId);
  }

  async getById(invoiceId: string, userId: string): Promise<IInvoice> {
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      userId,
    })
      .populate("companyId")
      .populate("customerId");

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    return invoice;
  }

  async getAll(
    userId: string,
    query: QueryParams,
  ): Promise<{
    invoices: IInvoice[];
    total: number;
    page: number;
    pages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { userId };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.type) {
      filter.invoiceType = query.type;
    }

    if (query.companyId) {
      filter.companyId = query.companyId;
    }

    if (query.customerId) {
      filter.customerId = query.customerId;
    }

    if (query.search) {
      filter.$or = [
        { invoiceNumber: { $regex: query.search, $options: "i" } },
        { notes: { $regex: query.search, $options: "i" } },
      ];
    }

    if (query.startDate || query.endDate) {
      filter.invoiceDate = {};
      if (query.startDate) {
        filter.invoiceDate.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        filter.invoiceDate.$lte = new Date(query.endDate);
      }
    }

    // Sorting
    let sort: any = { createdAt: -1 };
    if (query.sort) {
      const sortField = query.sort.startsWith("-")
        ? query.sort.substring(1)
        : query.sort;
      const sortOrder = query.sort.startsWith("-") ? -1 : 1;
      sort = { [sortField]: sortOrder };
    }

    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate("companyId")
        .populate("customerId")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Invoice.countDocuments(filter),
    ]);

    return {
      invoices,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getByCustomer(customerId: string, userId: string): Promise<IInvoice[]> {
    // Verify customer ownership
    await customerService.getById(customerId, userId);

    return await Invoice.find({
      customerId,
      userId,
    })
      .populate("companyId")
      .sort({ createdAt: -1 });
  }

  async update(
    invoiceId: string,
    userId: string,
    updates: Partial<IInvoice>,
  ): Promise<IInvoice> {
    const invoice = await Invoice.findOne({ _id: invoiceId, userId });

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    // Prevent updating paid or cancelled invoices
    if (invoice.status === "paid" && updates.items) {
      throw new BadRequestError("Cannot modify items of a paid invoice");
    }

    // Recalculate totals if items or charges changed
    if (updates.items || updates.additionalCharges !== undefined) {
      const items = updates.items || invoice.items;
      const charges =
        updates.additionalCharges !== undefined
          ? updates.additionalCharges
          : invoice.additionalCharges;
      const outstanding =
        updates.outstandingBill !== undefined
          ? updates.outstandingBill
          : invoice.outstandingBill || 0;

      const calculatedData = this.calculateInvoiceTotals(
        items,
        charges,
        outstanding,
      );
      Object.assign(updates, calculatedData);
    }

    Object.assign(invoice, updates);
    await invoice.save();

    return await this.getById(invoiceId, userId);
  }
  async delete(invoiceId: string, userId: string): Promise<void> {
    const invoice = await Invoice.findOne({ _id: invoiceId, userId });

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    // Prevent deleting paid invoices
    if (invoice.status === "paid") {
      throw new BadRequestError("Cannot delete a paid invoice");
    }

    await invoice.deleteOne();
  }

  async markAsPaid(
    invoiceId: string,
    userId: string,
    amountPaid: number,
  ): Promise<IInvoice> {
    const invoice = await this.getById(invoiceId, userId);

    invoice.amountPaid = (invoice.amountPaid || 0) + amountPaid;
    invoice.balance = invoice.grandTotal - invoice.amountPaid;

    if (invoice.balance <= 0) {
      invoice.status = "paid";
      invoice.balance = 0;
    }

    await invoice.save();
    return invoice;
  }

  async updateStatus(
    invoiceId: string,
    userId: string,
    status: IInvoice["status"],
  ): Promise<IInvoice> {
    const invoice = await this.getById(invoiceId, userId);
    invoice.status = status;
    await invoice.save();
    return invoice;
  }

  async getDrafts(userId: string): Promise<IInvoice[]> {
    return await Invoice.find({
      userId,
      isDraft: true,
    })
      .populate("companyId")
      .populate("customerId")
      .sort({ updatedAt: -1 });
  }

  async finalizeDraft(invoiceId: string, userId: string): Promise<IInvoice> {
    const invoice = await this.getById(invoiceId, userId);

    if (!invoice.isDraft) {
      throw new BadRequestError("Invoice is not a draft");
    }

    invoice.isDraft = false;
    invoice.status = "sent";
    await invoice.save();

    return invoice;
  }

  private calculateInvoiceTotals(
    items: IInvoiceItem[],
    additionalCharges: IAdditionalCharge[],
    outstandingBill: number,
  ): {
    items: IInvoiceItem[];
    subtotal: number;
    additionalCharges: IAdditionalCharge[];
    grandTotal: number;
  } {
    // Calculate item totals
    const processedItems = items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    // Calculate subtotal
    const subtotal = processedItems.reduce((sum, item) => sum + item.total, 0);

    // Calculate additional charges
    const processedCharges = additionalCharges.map((charge) => {
      const amount = charge.isPercentage
        ? (subtotal * charge.value) / 100
        : charge.value;
      return {
        ...charge,
        amount,
      };
    });

    // Calculate grand total
    const chargesTotal = processedCharges.reduce(
      (sum, charge) => sum + charge.amount,
      0,
    );
    const grandTotal = subtotal + chargesTotal + outstandingBill;

    return {
      items: processedItems,
      subtotal,
      additionalCharges: processedCharges,
      grandTotal,
    };
  }

  async getStatistics(userId: string, companyId?: string): Promise<any> {
    const filter: any = { userId };
    if (companyId) {
      filter.companyId = companyId;
    }

    const [
      totalInvoices,
      totalProformas,
      paidInvoices,
      unpaidInvoices,
      overdueInvoices,
    ] = await Promise.all([
      Invoice.countDocuments({ ...filter, invoiceType: "invoice" }),
      Invoice.countDocuments({ ...filter, invoiceType: "proforma" }),
      Invoice.countDocuments({ ...filter, status: "paid" }),
      Invoice.countDocuments({
        ...filter,
        status: { $in: ["sent", "draft"] },
      }),
      Invoice.countDocuments({ ...filter, status: "overdue" }),
    ]);

    // Calculate revenue
    const revenueData = await Invoice.aggregate([
      { $match: { ...filter, status: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$grandTotal" },
        },
      },
    ]);

    // Calculate outstanding amount
    const outstandingData = await Invoice.aggregate([
      {
        $match: {
          ...filter,
          status: { $in: ["sent", "overdue"] },
        },
      },
      {
        $group: {
          _id: null,
          outstandingAmount: { $sum: "$balance" },
        },
      },
    ]);

    return {
      totalInvoices,
      totalProformas,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      paidInvoices,
      unpaidInvoices,
      overdueInvoices,
      outstandingAmount: outstandingData[0]?.outstandingAmount || 0,
    };
  }
}

export default new InvoiceService();

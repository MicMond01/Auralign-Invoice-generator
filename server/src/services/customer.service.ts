import Customer from '../models/Customer.model';
import companyService from './company.service';
import { ICustomer, QueryParams } from '../types';
import { NotFoundError } from '../utils/errors';
import { Types } from 'mongoose';

class CustomerService {
  async create(
    userId: string,
    customerData: Partial<ICustomer> & { companyId: string }
  ): Promise<ICustomer> {
    // Verify company ownership
    await companyService.verifyOwnership(customerData.companyId, userId);

    const customer = await Customer.create({
      ...customerData,
      userId: new Types.ObjectId(userId),
      companyId: new Types.ObjectId(customerData.companyId),
    });

    return customer;
  }

  async getById(customerId: string, userId: string): Promise<ICustomer> {
    const customer = await Customer.findOne({
      _id: customerId,
      userId,
      isActive: true,
    }).populate('companyId');

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    return customer;
  }

  async getAll(
    userId: string,
    query: QueryParams
  ): Promise<{
    customers: ICustomer[];
    total: number;
    page: number;
    pages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { userId, isActive: true };

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
      ];
    }

    // If companyId is provided, filter by it
    if (query.companyId) {
      filter.companyId = query.companyId;
    }

    const [customers, total] = await Promise.all([
      Customer.find(filter)
        .populate('companyId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Customer.countDocuments(filter),
    ]);

    return {
      customers,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getByCompany(
    companyId: string,
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    customers: ICustomer[];
    total: number;
    page: number;
    pages: number;
  }> {
    // Verify company ownership
    await companyService.verifyOwnership(companyId, userId);

    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      Customer.find({ companyId, userId, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Customer.countDocuments({ companyId, userId, isActive: true }),
    ]);

    return {
      customers,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async update(
    customerId: string,
    userId: string,
    updates: Partial<ICustomer>
  ): Promise<ICustomer> {
    const customer = await this.getById(customerId, userId);

    Object.assign(customer, updates);
    await customer.save();

    return customer;
  }

  async delete(customerId: string, userId: string): Promise<void> {
    const customer = await this.getById(customerId, userId);

    // Soft delete
    customer.isActive = false;
    await customer.save();
  }

  async search(
    userId: string,
    searchTerm: string,
    companyId?: string
  ): Promise<ICustomer[]> {
    const filter: any = {
      userId,
      isActive: true,
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } },
      ],
    };

    if (companyId) {
      filter.companyId = companyId;
    }

    return await Customer.find(filter).limit(10).sort({ name: 1 });
  }
}

export default new CustomerService();
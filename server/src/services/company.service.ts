import Company from '../models/Company.model';
import { ICompany } from '../types';
import { NotFoundError } from '../utils/errors';
import { Types } from 'mongoose';

class CompanyService {
  async create(userId: string, companyData: Partial<ICompany>): Promise<ICompany> {
    const company = await Company.create({
      ...companyData,
      userId: new Types.ObjectId(userId),
    });

    return company;
  }

  async getById(companyId: string, userId: string): Promise<ICompany> {
    const company = await Company.findOne({
      _id: companyId,
      userId,
      isActive: true,
    });

    if (!company) {
      throw new NotFoundError('Company not found');
    }

    return company;
  }

  async getAll(userId: string, page: number = 1, limit: number = 10): Promise<{
    companies: ICompany[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      Company.find({ userId, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Company.countDocuments({ userId, isActive: true }),
    ]);

    return {
      companies,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async update(
    companyId: string,
    userId: string,
    updates: Partial<ICompany>
  ): Promise<ICompany> {
    // Verify ownership
    const company = await this.getById(companyId, userId);

    // Update company
    Object.assign(company, updates);
    await company.save();

    return company;
  }

  async delete(companyId: string, userId: string): Promise<void> {
    const company = await this.getById(companyId, userId);

    // Soft delete
    company.isActive = false;
    await company.save();
  }

  async verifyOwnership(companyId: string, userId: string): Promise<boolean> {
    const company = await Company.findOne({
      _id: companyId,
      userId,
      isActive: true,
    });

    return !!company;
  }

  async uploadLogo(companyId: string, userId: string, logoPath: string): Promise<ICompany> {
    const company = await this.getById(companyId, userId);
    company.logo = logoPath;
    await company.save();
    return company;
  }

  async uploadSignature(
    companyId: string,
    userId: string,
    signaturePath: string
  ): Promise<ICompany> {
    const company = await this.getById(companyId, userId);
    company.signature = signaturePath;
    await company.save();
    return company;
  }
}

export default new CompanyService();
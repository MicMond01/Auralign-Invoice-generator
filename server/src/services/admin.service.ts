import User from '../models/User.model';
import Company from '../models/Company.model';
import { IUser, ICompany } from '../types';
import { ConflictError, NotFoundError } from '../utils/errors';
import { Types } from 'mongoose';
import crypto from 'crypto';

class AdminService {
  /**
   * Generate a random secure password
   */
  private generatePassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    
    return password;
  }

  /**
   * Admin creates a company WITH a user account
   */
  async createCompanyWithUser(data: {
    // Company info
    companyName: string;
    companyEmail?: string;
    companyPhone?: string;
    companyAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    primaryColor?: string;
    accountDetails: Array<{
      bankName: string;
      accountNumber: string;
      accountName: string;
      isPrimary?: boolean;
    }>;
    
    // User info
    userFirstName: string;
    userLastName: string;
    userEmail: string;
  }): Promise<{
    company: ICompany;
    user: IUser;
    temporaryPassword: string;
  }> {
    // Check if user email already exists
    const existingUser = await User.findOne({ email: data.userEmail });
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Generate temporary password
    const temporaryPassword = this.generatePassword();

    // Create user account
    const user = await User.create({
      email: data.userEmail,
      password: temporaryPassword,
      firstName: data.userFirstName,
      lastName: data.userLastName,
      role: 'user',
      isActive: true,
    });

    // Create company linked to this user
    const company = await Company.create({
      userId: user._id,
      name: data.companyName,
      email: data.companyEmail,
      phone: data.companyPhone,
      address: data.companyAddress,
      city: data.city,
      state: data.state,
      country: data.country || 'Nigeria',
      primaryColor: data.primaryColor || '#10b981',
      accountDetails: data.accountDetails,
      isActive: true,
    });

    return {
      company,
      user,
      temporaryPassword, // Return this to show to admin (send to client via email)
    };
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    users: IUser[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({ role: 'user' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments({ role: 'user' }),
    ]);

    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all companies (admin only - across all users)
   */
  async getAllCompanies(page: number = 1, limit: number = 10): Promise<{
    companies: ICompany[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      Company.find()
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Company.countDocuments(),
    ]);

    return {
      companies,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getCompanyById(companyId: string): Promise<ICompany> {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company not found');
    }

    return company;
  }

  /**
   * Deactivate a user account (soft delete)
   */
  async deactivateUser(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.isActive = false;
    await user.save();

    // Also deactivate their companies
    await Company.updateMany(
      { userId: new Types.ObjectId(userId) },
      { isActive: false }
    );
  }

  /**
   * Activate a user account
   */
  async activateUser(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.isActive = true;
    await user.save();
  }

  /**
   * Reset user password (admin action)
   */
  async resetUserPassword(userId: string): Promise<string> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const newPassword = this.generatePassword();
    user.password = newPassword;
    await user.save();

    return newPassword; // Return to admin to send to user
  }

  /**
   * Delete user and all their data (hard delete - dangerous!)
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Delete all companies
    await Company.deleteMany({ userId: new Types.ObjectId(userId) });

    // Delete all customers
    const Customer = require('../models/Customer.model').default;
    await Customer.deleteMany({ userId: new Types.ObjectId(userId) });

    // Delete all invoices
    const Invoice = require('../models/Invoice.model').default;
    await Invoice.deleteMany({ userId: new Types.ObjectId(userId) });

    // Delete user
    await user.deleteOne();
  }
}

export default new AdminService();
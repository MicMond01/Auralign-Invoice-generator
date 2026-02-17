import mongoose, { Schema } from 'mongoose';
import { ICompany, IAccountDetail } from '../types';

const accountDetailSchema = new Schema<IAccountDetail>(
  {
    bankName: {
      type: String,
      required: [true, 'Bank name is required'],
      trim: true,
    },
    accountNumber: {
      type: String,
      required: [true, 'Account number is required'],
      trim: true,
    },
    accountName: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const companySchema = new Schema<ICompany>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'Nigeria',
    },
    website: {
      type: String,
      trim: true,
    },
    primaryColor: {
      type: String,
      default: '#10b981',
      trim: true,
    },
    secondaryColor: {
      type: String,
      trim: true,
    },
    accountDetails: {
      type: [accountDetailSchema],
      validate: [
        {
          validator: function (v: IAccountDetail[]) {
            return v.length > 0;
          },
          message: 'At least one account detail is required',
        },
      ],
    },
    signature: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure only one primary account
companySchema.pre('save', function (next) {
  if (this.accountDetails && this.accountDetails.length > 0) {
    const primaryAccounts = this.accountDetails.filter((acc) => acc.isPrimary);
    if (primaryAccounts.length === 0) {
      this.accountDetails[0].isPrimary = true;
    } else if (primaryAccounts.length > 1) {
      // Keep only the first primary
      let foundPrimary = false;
      this.accountDetails.forEach((acc) => {
        if (acc.isPrimary && !foundPrimary) {
          foundPrimary = true;
        } else if (acc.isPrimary) {
          acc.isPrimary = false;
        }
      });
    }
  }
  next();
});

// Indexes
companySchema.index({ userId: 1, name: 1 });
companySchema.index({ isActive: 1 });

export default mongoose.model<ICompany>('Company', companySchema);
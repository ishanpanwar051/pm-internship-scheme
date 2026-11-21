const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      default: '',
      trim: true,
    },
    sector: {
      type: String,
      required: [true, 'Industry sector is required'],
      trim: true,
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    employeeCount: {
      type: String,
      enum: ['<50', '50-200', '200-500', '500-1000', '1000+', ''],
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    contactPerson: {
      name: { type: String, default: '' },
      designation: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);

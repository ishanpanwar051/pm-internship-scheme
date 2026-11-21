const mongoose = require('mongoose');

const InternshipSlotSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    domain: {
      type: String,
      required: [true, 'Internship domain is required'],
      trim: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    location: {
      city: { type: String, default: '' },
      state: { type: String, required: true },
      isRemote: { type: Boolean, default: false },
    },
    stipend: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: '3 Months',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats must be specified'],
      min: [1, 'Must have at least 1 seat'],
      default: 5,
    },
    filledSeats: {
      type: Number,
      default: 0,
      min: 0,
    },
    eligibility: {
      minCGPA: { type: Number, default: 0 },
      streams: { type: [String], default: [] },
      categories: { type: [String], default: [] },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for high performance search and filtering
InternshipSlotSchema.index({ domain: 1, isActive: 1, 'location.state': 1 });

module.exports = mongoose.model('InternshipSlot', InternshipSlotSchema);

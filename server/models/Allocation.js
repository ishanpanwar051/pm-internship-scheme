const mongoose = require('mongoose');

const AllocationSchema = new mongoose.Schema(
  {
    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InternProfile',
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InternshipSlot',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile',
      required: true,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 1,
      required: true,
    },
    matchReason: {
      skillScore: { type: Number, default: 0 },
      locationScore: { type: Number, default: 0 },
      academicScore: { type: Number, default: 0 },
      domainScore: { type: Number, default: 0 },
      quotaCategory: { type: String, default: 'General' },
      matchedSkills: { type: [String], default: [] },
      explanation: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: [
        'Allocated',
        'Accepted by Company',
        'Rejected by Company',
        'Accepted by Intern',
        'Declined by Intern',
        'Completed',
      ],
      default: 'Allocated',
    },
    allocatedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    companyFeedback: {
      type: String,
      default: '',
    },
    internFeedback: {
      type: String,
      default: '',
    },
    internRating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Index for rapid queries and duplicate prevention
AllocationSchema.index({ internId: 1, slotId: 1 }, { unique: true });

module.exports = mongoose.model('Allocation', AllocationSchema);

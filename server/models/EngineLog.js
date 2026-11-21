const mongoose = require('mongoose');

const EngineLogSchema = new mongoose.Schema(
  {
    runBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    runAt: {
      type: Date,
      default: Date.now,
    },
    totalInterns: {
      type: Number,
      default: 0,
    },
    totalSlots: {
      type: Number,
      default: 0,
    },
    totalAllocated: {
      type: Number,
      default: 0,
    },
    averageMatchScore: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Running', 'Success', 'Failed'],
      default: 'Running',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    currentStep: {
      type: Number,
      default: 1,
    },
    totalSteps: {
      type: Number,
      default: 8,
    },
    stepMessage: {
      type: String,
      default: 'Initializing matching engine...',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EngineLog', EngineLogSchema);

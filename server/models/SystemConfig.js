const mongoose = require('mongoose');

const WeightDefaults = {
  location: 0.2,
  homeState: 0.08,
  domain: 0.12,
  cgpaHigh: 0.1,
  cgpaMid: 0.07,
  cgpaLow: 0.05,
  penaltyGate: -999,
};

const QuotaDefaults = {
  SC: 0.15,
  ST: 0.075,
  OBC: 0.27,
  PH: 0.04,
};

const SystemConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
      required: true,
    },
    weights: {
      location: { type: Number, default: WeightDefaults.location },
      homeState: { type: Number, default: WeightDefaults.homeState },
      domain: { type: Number, default: WeightDefaults.domain },
      cgpaHigh: { type: Number, default: WeightDefaults.cgpaHigh },
      cgpaMid: { type: Number, default: WeightDefaults.cgpaMid },
      cgpaLow: { type: Number, default: WeightDefaults.cgpaLow },
      penaltyGate: { type: Number, default: WeightDefaults.penaltyGate },
    },
    quotas: {
      SC: { type: Number, default: QuotaDefaults.SC },
      ST: { type: Number, default: QuotaDefaults.ST },
      OBC: { type: Number, default: QuotaDefaults.OBC },
      PH: { type: Number, default: QuotaDefaults.PH },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

SystemConfigSchema.statics.getConfig = async function () {
  const existing = await this.findOne({ key: 'main' });
  if (!existing) {
    return this.create({ key: 'main' });
  }
  return existing;
};

module.exports = mongoose.model('SystemConfig', SystemConfigSchema);
module.exports.WeightDefaults = WeightDefaults;
module.exports.QuotaDefaults = QuotaDefaults;
const mongoose = require('mongoose');

const InternProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    personalInfo: {
      dob: { type: Date },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: '',
      },
      fatherName: { type: String, default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      district: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    aadharLast4: {
      type: String,
      maxlength: 4,
      default: '',
    },
    aadharHash: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'PH'],
      default: 'General',
      required: true,
    },
    isPH: {
      type: Boolean,
      default: false,
    },
    academic: {
      institutionName: { type: String, default: '' },
      institutionType: {
        type: String,
        enum: [
          'IIT',
          'NIT',
          'Central University',
          'State University',
          'Private University',
          'College',
          'Polytechnic',
          'Other',
          '',
        ],
        default: '',
      },
      stream: {
        type: String,
        enum: [
          'Engineering',
          'Medical',
          'Commerce',
          'Arts',
          'Science',
          'Law',
          'Management',
          'Agriculture',
          'Other',
          '',
        ],
        default: '',
      },
      specialization: { type: String, default: '' },
      cgpa: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },
      passingYear: { type: Number },
      tenthPercent: { type: Number, default: 0 },
      twelfthPercent: { type: Number, default: 0 },
    },
    skills: {
      type: [String],
      default: [],
    },
    domainInterest: {
      type: [String],
      default: [],
    },
    locationPreference: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: ['English', 'Hindi'],
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeOriginalName: {
      type: String,
      default: '',
    },
    resumeParsedSkills: {
      type: [String],
      default: [],
    },
    profileCompletionPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    allocationStatus: {
      type: String,
      enum: ['Not Applied', 'Pending', 'Allocated', 'Accepted', 'Rejected', 'Completed'],
      default: 'Not Applied',
    },
  },
  {
    timestamps: true,
  }
);

// Method to compute profile completion percentage
InternProfileSchema.methods.calculateCompletion = function () {
  let score = 0;
  if (this.personalInfo?.dob && this.personalInfo?.gender && this.personalInfo?.city) score += 20;
  if (this.academic?.institutionName && this.academic?.cgpa > 0 && this.academic?.stream) score += 25;
  if (this.skills && this.skills.length >= 3) score += 25;
  if (this.locationPreference && this.locationPreference.length > 0) score += 15;
  if (this.resumeUrl) score += 15;
  this.profileCompletionPercent = score;
  return score;
};

module.exports = mongoose.model('InternProfile', InternProfileSchema);

const path = require('path');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const CompanyProfile = require('../models/CompanyProfile');
const InternshipSlot = require('../models/InternshipSlot');
const Allocation = require('../models/Allocation');
const InternProfile = require('../models/InternProfile');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendAcceptanceConfirmedEmail, sendRejectionEmail } = require('../services/emailService');

// @route   GET /api/v1/company/profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await CompanyProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await CompanyProfile.create({
        userId: req.user.id,
        companyName: req.user.name || 'Organization',
        sector: 'General',
      });
    }
    res.status(200).json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/v1/company/profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      companyName,
      registrationNumber,
      sector,
      website,
      description,
      employeeCount,
      address,
      contactPerson,
    } = req.body;

    let profile = await CompanyProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new CompanyProfile({ userId: req.user.id });
    }

    if (companyName) profile.companyName = companyName;
    if (registrationNumber) profile.registrationNumber = registrationNumber;
    if (sector) profile.sector = sector;
    if (website) profile.website = website;
    if (description) profile.description = description;
    if (employeeCount) profile.employeeCount = employeeCount;
    if (address) profile.address = { ...profile.address, ...address };
    if (contactPerson) profile.contactPerson = { ...profile.contactPerson, ...contactPerson };
    if (req.file) profile.logo = `/uploads/${req.file.filename}`;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      profile,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/v1/company/slots
exports.createSlot = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    const slotData = {
      ...req.body,
      companyId: profile._id,
    };

    const slot = await InternshipSlot.create(slotData);

    res.status(201).json({
      success: true,
      message: 'Internship slot published successfully',
      slot,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/company/slots
exports.getSlots = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    const slots = await InternshipSlot.find({ companyId: profile._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: slots.length,
      slots,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/company/slots/:id
exports.getSlotById = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    const slot = await InternshipSlot.findOne({ _id: req.params.id, companyId: profile._id });

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Internship slot not found' });
    }

    res.status(200).json({ success: true, slot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/company/slots/:id
exports.updateSlot = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    const slot = await InternshipSlot.findOneAndUpdate(
      { _id: req.params.id, companyId: profile._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Slot updated successfully', slot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   DELETE /api/v1/company/slots/:id
exports.deleteSlot = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    const slot = await InternshipSlot.findOne({ _id: req.params.id, companyId: profile._id });

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found or unauthorized' });
    }

    // Check if slot has active allocations
    const activeAllocations = await Allocation.countDocuments({
      slotId: slot._id,
      status: { $in: ['Allocated', 'Accepted by Company', 'Accepted by Intern'] },
    });

    if (activeAllocations > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete slot with existing accepted or pending candidate matches.',
      });
    }

    await slot.deleteOne();

    res.status(200).json({ success: true, message: 'Slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/company/matches
exports.getAllMatches = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(200).json({ success: true, matches: [], slots: [] });
    }
    const slots = await InternshipSlot.find({ companyId: profile._id });
    const matches = await Allocation.find({ companyId: profile._id })
      .populate({
        path: 'internId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .populate('slotId')
      .sort({ matchScore: -1 });

    res.status(200).json({
      success: true,
      slots,
      matches,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/company/slots/:id/matches
exports.getSlotMatches = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    const slot = await InternshipSlot.findOne({ _id: req.params.id, companyId: profile._id });

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    const matches = await Allocation.find({ slotId: slot._id })
      .populate({
        path: 'internId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .sort({ matchScore: -1 });

    res.status(200).json({
      success: true,
      slot,
      matches,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/company/allocations/:id/accept
exports.acceptIntern = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    const allocation = await Allocation.findOne({
      _id: req.params.id,
      companyId: profile._id,
    }).populate('slotId internId');

    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation match not found' });
    }

    allocation.status = 'Accepted by Company';
    allocation.acceptedAt = Date.now();
    await allocation.save();

    // Increment filled seats
    await InternshipSlot.findByIdAndUpdate(allocation.slotId._id, {
      $inc: { filledSeats: 1 },
    });

    // Notify intern
    const internUser = await User.findById(allocation.internId.userId);
    if (internUser) {
      await Notification.create({
        userId: internUser._id,
        title: 'Application Accepted by Company!',
        message: `${profile.companyName} has officially approved your placement for '${allocation.slotId.title}'.`,
        type: 'success',
        link: '/intern/allocation',
      });

      sendAcceptanceConfirmedEmail(
        internUser,
        profile.companyName,
        allocation.slotId.title,
        allocation.slotId.startDate
      );
    }

    res.status(200).json({
      success: true,
      message: 'Intern candidate successfully accepted for placement',
      allocation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/company/allocations/:id/reject
exports.rejectIntern = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    const allocation = await Allocation.findOne({
      _id: req.params.id,
      companyId: profile._id,
    }).populate('slotId internId');

    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation match not found' });
    }

    allocation.status = 'Rejected by Company';
    allocation.companyFeedback = reason;
    await allocation.save();

    // Reset intern profile status so they remain eligible in subsequent runs
    await InternProfile.findByIdAndUpdate(allocation.internId._id, {
      allocationStatus: 'Pending',
    });

    const internUser = await User.findById(allocation.internId.userId);
    if (internUser) {
      await Notification.create({
        userId: internUser._id,
        title: 'Application Update',
        message: `Your match for ${allocation.slotId.title} was not confirmed. Your profile remains active for future matching runs.`,
        type: 'info',
        link: '/intern/explore',
      });

      sendRejectionEmail(internUser, allocation.slotId.title, reason);
    }

    res.status(200).json({
      success: true,
      message: 'Candidate application rejected',
      allocation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/company/accepted-interns
exports.getAcceptedInterns = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const allocations = await Allocation.find({
      companyId: profile._id,
      status: { $in: ['Accepted by Company', 'Accepted by Intern', 'Completed'] },
    })
      .populate('slotId')
      .populate({
        path: 'internId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .sort({ acceptedAt: -1 });

    res.status(200).json({ success: true, allocations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/company/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const slots = await InternshipSlot.find({ companyId: profile._id });
    const totalSlots = slots.length;
    const totalSeats = slots.reduce((acc, s) => acc + s.totalSeats, 0);
    const filledSeats = slots.reduce((acc, s) => acc + s.filledSeats, 0);

    const pendingMatches = await Allocation.countDocuments({
      companyId: profile._id,
      status: 'Allocated',
    });

    const recentAllocations = await Allocation.find({ companyId: profile._id })
      .populate('slotId', 'title')
      .populate({
        path: 'internId',
        populate: { path: 'userId', select: 'name avatar' },
      })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      totalSlots,
      totalSeats,
      filledSeats,
      pendingMatches,
      recentAllocations,
      slotsSummary: slots.map((s) => ({
        title: s.title,
        filled: s.filledSeats,
        total: s.totalSeats,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/v1/company/intern/:id/feedback
exports.submitInternFeedback = async (req, res) => {
  try {
    const { feedback, rating, markCompleted } = req.body;
    const profile = await CompanyProfile.findOne({ userId: req.user.id });

    const allocation = await Allocation.findOne({
      _id: req.params.id,
      companyId: profile._id,
    });

    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation record not found' });
    }

    if (feedback) allocation.companyFeedback = feedback;
    if (rating) allocation.internRating = rating;
    if (markCompleted) {
      allocation.status = 'Completed';
      allocation.completedAt = Date.now();
      await InternProfile.findByIdAndUpdate(allocation.internId, {
        allocationStatus: 'Completed',
      });
    }

    await allocation.save();

    res.status(200).json({ success: true, message: 'Feedback recorded successfully', allocation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/company/report/download
exports.downloadAcceptedCsv = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    const allocations = await Allocation.find({
      companyId: profile._id,
      status: { $in: ['Accepted by Company', 'Accepted by Intern', 'Completed'] },
    })
      .populate('slotId')
      .populate({
        path: 'internId',
        populate: { path: 'userId' },
      });

    const tempFilePath = path.join(__dirname, `../uploads/accepted_interns_${Date.now()}.csv`);
    const csvWriter = createCsvWriter({
      path: tempFilePath,
      header: [
        { id: 'name', title: 'INTERN NAME' },
        { id: 'email', title: 'EMAIL' },
        { id: 'phone', title: 'PHONE' },
        { id: 'slot', title: 'POSITION' },
        { id: 'score', title: 'MATCH SCORE (%)' },
        { id: 'category', title: 'CATEGORY' },
        { id: 'status', title: 'STATUS' },
      ],
    });

    const records = allocations.map((a) => ({
      name: a.internId?.userId?.name || 'N/A',
      email: a.internId?.userId?.email || 'N/A',
      phone: a.internId?.userId?.phone || 'N/A',
      slot: a.slotId?.title || 'N/A',
      score: `${Math.round(a.matchScore * 100)}%`,
      category: a.internId?.category || 'General',
      status: a.status,
    }));

    await csvWriter.writeRecords(records);

    res.download(tempFilePath, 'Accepted_Interns_Report.csv', (err) => {
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/company/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/company/notifications/:id/read
exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true }
    );
    res.status(200).json({ success: true, message: 'Notification marked read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/company/notifications/read-all
exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

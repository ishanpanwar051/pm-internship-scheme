const crypto = require('crypto');
const path = require('path');
const InternProfile = require('../models/InternProfile');
const InternshipSlot = require('../models/InternshipSlot');
const Allocation = require('../models/Allocation');
const Notification = require('../models/Notification');
const { parseResume } = require('../services/aiService');

// @route   GET /api/v1/intern/profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await InternProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await InternProfile.create({ userId: req.user.id });
    }
    res.status(200).json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/v1/intern/profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      personalInfo,
      aadhar,
      category,
      isPH,
      academic,
      skills,
      domainInterest,
      locationPreference,
      languages,
      allocationStatus,
    } = req.body;

    let profile = await InternProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new InternProfile({ userId: req.user.id });
    }

    if (personalInfo) profile.personalInfo = { ...profile.personalInfo, ...personalInfo };
    if (category) profile.category = category;
    if (typeof isPH === 'boolean') profile.isPH = isPH;
    if (academic) profile.academic = { ...profile.academic, ...academic };
    if (skills) profile.skills = Array.from(new Set(skills));
    if (domainInterest) profile.domainInterest = domainInterest;
    if (locationPreference) profile.locationPreference = locationPreference;
    if (languages) profile.languages = languages;

    // Secure Aadhar handling (last 4 + SHA-256 hash)
    if (aadhar && aadhar.length >= 4) {
      profile.aadharLast4 = aadhar.slice(-4);
      profile.aadharHash = crypto.createHash('sha256').update(aadhar).digest('hex');
    }

    // Set to Pending if profile is sufficiently filled
    if (allocationStatus) {
      profile.allocationStatus = allocationStatus;
    } else if (profile.allocationStatus === 'Not Applied' && profile.skills.length >= 3) {
      profile.allocationStatus = 'Pending';
    }

    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/v1/intern/resume/upload
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    const filePath = req.file.path;
    const profile = await InternProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.resumeUrl = `/uploads/${req.file.filename}`;
    profile.resumeOriginalName = req.file.originalname;

    // Extract skills using Python AI Microservice
    let parsedSkills = [];
    try {
      const parseResult = await parseResume(filePath);
      if (parseResult && parseResult.skills) {
        parsedSkills = parseResult.skills;
        profile.resumeParsedSkills = parsedSkills;
        // Merge with existing skills (case insensitive deduplication)
        const currentLower = profile.skills.map((s) => s.toLowerCase());
        parsedSkills.forEach((skill) => {
          if (!currentLower.includes(skill.toLowerCase())) {
            profile.skills.push(skill);
          }
        });
      }
    } catch (aiErr) {
      console.warn(`[Resume Parser] AI microservice call notice: ${aiErr.message}`);
    }

    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and skills analyzed successfully',
      resumeUrl: profile.resumeUrl,
      parsedSkills,
      profile,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/intern/allocation
exports.getAllocation = async (req, res) => {
  try {
    const profile = await InternProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const allocation = await Allocation.findOne({ internId: profile._id })
      .populate('slotId')
      .populate('companyId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      allocation,
      allocationStatus: profile.allocationStatus,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/intern/allocation/accept
exports.acceptAllocation = async (req, res) => {
  try {
    const profile = await InternProfile.findOne({ userId: req.user.id });
    const allocation = await Allocation.findOne({ internId: profile._id });

    if (!allocation) {
      return res.status(404).json({ success: false, message: 'No allocation found to accept' });
    }

    allocation.status = 'Accepted by Intern';
    allocation.acceptedAt = Date.now();
    await allocation.save();

    profile.allocationStatus = 'Accepted';
    await profile.save();

    // Notify student
    await Notification.create({
      userId: req.user.id,
      title: 'Allocation Accepted',
      message: 'You have formally accepted your internship allocation. Contact your host organization for onboarding details.',
      type: 'success',
      link: '/intern/allocation',
    });

    res.status(200).json({
      success: true,
      message: 'Internship allocation accepted successfully',
      allocation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/intern/allocation/decline
exports.declineAllocation = async (req, res) => {
  try {
    const profile = await InternProfile.findOne({ userId: req.user.id });
    const allocation = await Allocation.findOne({ internId: profile._id });

    if (!allocation) {
      return res.status(404).json({ success: false, message: 'No allocation found' });
    }

    allocation.status = 'Declined by Intern';
    await allocation.save();

    profile.allocationStatus = 'Pending';
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Internship allocation declined. Your profile remains active for subsequent matching runs.',
      allocation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/intern/slots
exports.getSlots = async (req, res) => {
  try {
    const { search, domain, state, isRemote, minStipend, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (domain) query.domain = domain;
    if (state) query['location.state'] = state;
    if (isRemote === 'true') query['location.isRemote'] = true;
    if (minStipend) query.stipend = { $gte: Number(minStipend) };

    const total = await InternshipSlot.countDocuments(query);
    const slots = await InternshipSlot.find(query)
      .populate('companyId', 'companyName sector logo')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: slots.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      slots,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/intern/slots/:id
exports.getSlotById = async (req, res) => {
  try {
    const slot = await InternshipSlot.findById(req.params.id).populate('companyId');
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Internship slot not found' });
    }
    res.status(200).json({ success: true, slot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/intern/notifications
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

// @route   PUT /api/v1/intern/notifications/:id/read
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

// @route   PUT /api/v1/intern/notifications/read-all
exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/intern/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const profile = await InternProfile.findOne({ userId: req.user.id });
    const unreadNotifications = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });
    const allocation = profile
      ? await Allocation.findOne({ internId: profile._id })
          .populate('slotId')
          .populate('companyId')
      : null;

    const daysSinceReg = Math.floor(
      (Date.now() - new Date(req.user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    res.status(200).json({
      success: true,
      profileCompletionPercent: profile?.profileCompletionPercent || 0,
      allocationStatus: profile?.allocationStatus || 'Not Applied',
      skillsCount: profile?.skills?.length || 0,
      daysSinceReg,
      unreadNotifications,
      allocation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const path = require('path');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const User = require('../models/User');
const InternProfile = require('../models/InternProfile');
const CompanyProfile = require('../models/CompanyProfile');
const InternshipSlot = require('../models/InternshipSlot');
const Allocation = require('../models/Allocation');
const Notification = require('../models/Notification');
const EngineLog = require('../models/EngineLog');
const SystemConfig = require('../models/SystemConfig');
const AuditLog = require('../models/AuditLog');
const { triggerMatching } = require('../services/aiService');
const { auditAction } = require('../services/auditService');
const { sendAllocationReadyEmail, sendCompanyMatchesReadyEmail } = require('../services/emailService');

// @route   GET /api/v1/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalInterns = await InternProfile.countDocuments();
    const totalCompanies = await CompanyProfile.countDocuments();
    const verifiedCompanies = await CompanyProfile.countDocuments({ isVerified: true });
    const activeSlots = await InternshipSlot.countDocuments({ isActive: true });
    const totalAllocated = await Allocation.countDocuments({
      status: { $in: ['Allocated', 'Accepted by Company', 'Accepted by Intern', 'Completed'] },
    });
    const engineRuns = await EngineLog.countDocuments({ status: 'Success' });

    const allocationRate = totalInterns > 0 ? Math.round((totalAllocated / totalInterns) * 100) : 0;

    const allocations = await Allocation.find().select('matchScore');
    const avgScore =
      allocations.length > 0
        ? Math.round(
            (allocations.reduce((acc, a) => acc + (a.matchScore || 0), 0) / allocations.length) * 100
          )
        : 0;

    // --- Chart 1: Registrations over last 30 days ---
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usersLast30Days = await User.find({ createdAt: { $gte: thirtyDaysAgo } }).select(
      'role createdAt'
    );

    const dateMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().split('T')[0];
      dateMap[key] = { date: key, interns: 0, companies: 0 };
    }

    usersLast30Days.forEach((u) => {
      const key = new Date(u.createdAt).toISOString().split('T')[0];
      if (dateMap[key]) {
        if (u.role === 'intern') dateMap[key].interns += 1;
        if (u.role === 'company') dateMap[key].companies += 1;
      }
    });

    const registrations30d = Object.values(dateMap);

    // --- Chart 2: Domain Demand vs Supply ---
    const slots = await InternshipSlot.find().select('domain totalSeats filledSeats');
    const domainMap = {};
    slots.forEach((s) => {
      if (!domainMap[s.domain]) {
        domainMap[s.domain] = { domain: s.domain, totalSeats: 0, filledSeats: 0 };
      }
      domainMap[s.domain].totalSeats += s.totalSeats || 0;
      domainMap[s.domain].filledSeats += s.filledSeats || 0;
    });
    const domainDemandSupply = Object.values(domainMap);

    // --- Chart 3: Category Breakdown ---
    const categories = ['General', 'OBC', 'SC', 'ST', 'PH'];
    const categoryBreakdown = await Promise.all(
      categories.map(async (cat) => {
        const count = await InternProfile.countDocuments({ category: cat });
        const allocatedCount = await Allocation.countDocuments({
          'matchReason.quotaCategory': cat,
        });
        return { category: cat, total: count, allocated: allocatedCount };
      })
    );

    // --- Chart 4: Score Distribution (10 Buckets) ---
    const scoreBuckets = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10}-${(i + 1) * 10}%`,
      count: 0,
    }));

    allocations.forEach((a) => {
      const bucketIdx = Math.min(Math.floor((a.matchScore || 0) * 10), 9);
      scoreBuckets[bucketIdx].count += 1;
    });

    // --- Chart 5: State-wise Distribution ---
    const stateProfiles = await InternProfile.aggregate([
      { $group: { _id: '$personalInfo.state', count: { $sum: 1 } } },
      { $match: { _id: { $nin: [null, ''] } } },
      { $sort: { count: -1 } },
    ]);

    const stateWiseCount = stateProfiles.map((s) => ({
      state: s._id,
      count: s.count,
    }));

    // Recent engine runs & activity
    const recentLogs = await EngineLog.find().sort({ runAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      kpis: {
        totalInterns,
        totalCompanies,
        activeSlots,
        totalAllocated,
        allocationRate,
        avgScore,
        verifiedCompanies,
        engineRuns,
      },
      charts: {
        registrations30d,
        domainDemandSupply,
        categoryBreakdown,
        scoreDistribution: scoreBuckets,
        stateWiseCount,
      },
      recentLogs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { role, isBlocked, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (typeof isBlocked === 'string') query.isBlocked = isBlocked === 'true';
    if (search) {
      const safeSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/admin/users/:id/block
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin' || user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Administrator accounts cannot be blocked.' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    auditAction({ user: req.user, req }, user.isBlocked ? 'user.blocked' : 'user.unblocked', {
      entity: 'User',
      entityId: user._id,
      details: { email: user.email, role: user.role },
    });

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'suspended' : 're-activated'} successfully`,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   DELETE /api/v1/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin' || user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Administrator accounts cannot be deleted.' });
    }

    // Cascade deletion of dependent documents
    if (user.role === 'intern') {
      const profile = await InternProfile.findOne({ userId: user._id });
      if (profile) {
        await Allocation.deleteMany({ internId: profile._id });
        await profile.deleteOne();
      }
    } else if (user.role === 'company') {
      const profile = await CompanyProfile.findOne({ userId: user._id });
      if (profile) {
        await InternshipSlot.deleteMany({ companyId: profile._id });
        await Allocation.deleteMany({ companyId: profile._id });
        await profile.deleteOne();
      }
    }

    await Notification.deleteMany({ userId: user._id });
    await user.deleteOne();

    auditAction({ user: req.user, req }, 'user.deleted', {
      entity: 'User',
      entityId: req.params.id,
      details: { email: user.email, role: user.role },
    });

    res.status(200).json({ success: true, message: 'User and all associated data deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/admin/companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await CompanyProfile.find().populate('userId', 'name email isBlocked createdAt');
    res.status(200).json({ success: true, count: companies.length, companies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/admin/companies/:id/verify
exports.toggleVerifyCompany = async (req, res) => {
  try {
    const company = await CompanyProfile.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    company.isVerified = !company.isVerified;
    if (company.isVerified) company.verifiedAt = Date.now();
    await company.save();

    auditAction({ user: req.user, req }, company.isVerified ? 'company.verified' : 'company.unverified', {
      entity: 'CompanyProfile',
      entityId: company._id,
      details: { companyName: company.companyName },
    });

    res.status(200).json({
      success: true,
      message: `Company verification status updated to: ${company.isVerified}`,
      company,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/admin/interns
exports.getInterns = async (req, res) => {
  try {
    const { category, state, status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (state) query['personalInfo.state'] = state;
    if (status) query.allocationStatus = status;

    const total = await InternProfile.countDocuments(query);
    const interns = await InternProfile.find(query)
      .populate('userId', 'name email phone createdAt isBlocked')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total, interns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/admin/slots
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await InternshipSlot.find().populate('companyId', 'companyName sector logo isVerified');
    res.status(200).json({ success: true, count: slots.length, slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/admin/allocations
exports.getAllAllocations = async (req, res) => {
  try {
    const { status, category, companyId, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query['matchReason.quotaCategory'] = category;
    if (companyId) query.companyId = companyId;

    const total = await Allocation.countDocuments(query);
    const allocations = await Allocation.find(query)
      .populate({
        path: 'internId',
        populate: { path: 'userId', select: 'name email phone' },
      })
      .populate('slotId')
      .populate('companyId')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      allocations,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/admin/allocations/:id/override
exports.overrideAllocation = async (req, res) => {
  try {
    const { slotId, status } = req.body;
    const allocation = await Allocation.findById(req.params.id);

    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation record not found' });
    }

    if (slotId) {
      const slot = await InternshipSlot.findById(slotId);
      if (slot) {
        allocation.slotId = slot._id;
        allocation.companyId = slot.companyId;
      }
    }
    if (status) allocation.status = status;

    await allocation.save();

    auditAction({ user: req.user, req }, 'allocation.overridden', {
      entity: 'Allocation',
      entityId: allocation._id,
      details: { status },
    });

    res.status(200).json({
      success: true,
      message: 'Allocation override applied successfully',
      allocation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/v1/admin/engine/run
// Recomputes each slot's filledSeats from authoritative live allocations.
// Keeps reruns capacity-safe and frees seats when a match is released, resetting slots with 0 active allocations.
const recalculateFilledSeats = async () => {
  const activeCounts = await Allocation.aggregate([
    {
      $match: {
        status: { $in: ['Allocated', 'Accepted by Company', 'Accepted by Intern', 'Completed'] },
      },
    },
    { $group: { _id: '$slotId', count: { $sum: 1 } } },
  ]);

  const activeMap = new Map();
  activeCounts.forEach((group) => {
    if (group._id) {
      activeMap.set(group._id.toString(), group.count);
    }
  });

  const allSlots = await InternshipSlot.find({}, '_id filledSeats');
  for (const slot of allSlots) {
    const trueCount = activeMap.get(slot._id.toString()) || 0;
    if (slot.filledSeats !== trueCount) {
      await InternshipSlot.findByIdAndUpdate(slot._id, { filledSeats: trueCount });
    }
  }
};

// Shared engine pipeline used by both first-run and re-allocation modes
const executeEngineRunPipeline = async ({ engineLog, userId, startTime, mode }) => {
  try {
    const label = mode === 'reallocation' ? 'Re-allocating freed capacity' : 'Fetching unallocated profiles';
    // Step 1: Recompute authoritative seat capacity
    await recalculateFilledSeats();

    const interns = await InternProfile.find({
      allocationStatus: { $in: ['Pending', 'Not Applied'] },
    }).lean();

    await EngineLog.findByIdAndUpdate(engineLog._id, {
      currentStep: 2,
      stepMessage: `Step 2/8: ${label}. ${interns.length} candidate profile(s) in the pool...`,
    });

    // Step 2: Slots (capacity-safe)
    const slots = await InternshipSlot.find({
      isActive: true,
      $expr: { $lt: ['$filledSeats', '$totalSeats'] },
    }).lean();

    await EngineLog.findByIdAndUpdate(engineLog._id, {
      currentStep: 3,
      stepMessage: `Step 3/8: Loaded ${slots.length} available slots. Formatting skill matrices...`,
    });

    // Format candidate payloads for AI microservice
    const formattedInterns = interns.map((i) => ({
      id: i._id.toString(),
      skills: i.skills || [],
      locationPreference: i.locationPreference || [],
      domainInterest: i.domainInterest || [],
      state: i.personalInfo?.state || '',
      cgpa: i.academic?.cgpa || 0,
      category: i.category || 'General',
      isPH: i.isPH || false,
      allocationStatus: 'Pending',
    }));

    const formattedSlots = slots.map((s) => ({
      id: s._id.toString(),
      companyId: s.companyId.toString(),
      title: s.title,
      requiredSkills: s.requiredSkills || [],
      preferredSkills: s.preferredSkills || [],
      domain: s.domain,
      location: s.location || {},
      totalSeats: s.totalSeats,
      filledSeats: s.filledSeats || 0,
      eligibility: s.eligibility || {},
    }));

    await EngineLog.findByIdAndUpdate(engineLog._id, {
      currentStep: 4,
      stepMessage: 'Step 4/6: Matching candidates based on skills, location, and norms...',
    });

    // Step 4 & 5 & 6: Trigger Matching Service with configurable weights
    const systemConfig = await SystemConfig.getConfig();
    const aiResponse = await triggerMatching(
      formattedInterns,
      formattedSlots,
      {
        location: systemConfig.weights.location,
        homeState: systemConfig.weights.homeState,
        domain: systemConfig.weights.domain,
        cgpaHigh: systemConfig.weights.cgpaHigh,
        cgpaMid: systemConfig.weights.cgpaMid,
        cgpaLow: systemConfig.weights.cgpaLow,
        penaltyGate: systemConfig.weights.penaltyGate,
        quotas: systemConfig.quotas,
      }
    );

    await EngineLog.findByIdAndUpdate(engineLog._id, {
      currentStep: 5,
      stepMessage: 'Step 5/6: Applying reservation norms as per Government of India guidelines...',
    });

    const newAllocations = aiResponse.allocations || [];

    await EngineLog.findByIdAndUpdate(engineLog._id, {
      currentStep: 6,
      stepMessage: `Step 6/6: Saving ${newAllocations.length} recommendations...`,
    });

    // Step 7: Save allocations to DB
    let totalScoreSum = 0;
    for (const item of newAllocations) {
      totalScoreSum += item.matchScore;

      await Allocation.findOneAndUpdate(
        { internId: item.internId, slotId: item.slotId },
        {
          internId: item.internId,
          slotId: item.slotId,
          companyId: item.companyId,
          matchScore: item.matchScore,
          matchReason: item.matchReason,
          status: 'Allocated',
          allocatedAt: Date.now(),
        },
        { upsert: true, new: true }
      );

      await InternProfile.findByIdAndUpdate(item.internId, {
        allocationStatus: 'Allocated',
      });
    }

    await recalculateFilledSeats();

    await EngineLog.findByIdAndUpdate(engineLog._id, {
      currentStep: 8,
      stepMessage: 'Step 8/8: Dispatching notification alerts to matched participants...',
    });

    // Step 8: Send alerts to candidates (non-blocking)
    for (const alloc of newAllocations.slice(0, 50)) {
      try {
        const internProfile = await InternProfile.findById(alloc.internId).populate('userId');
        const slot = await InternshipSlot.findById(alloc.slotId).populate('companyId');
        if (internProfile?.userId && slot) {
          await Notification.create({
            userId: internProfile.userId._id,
            title: 'Internship Recommendation Ready',
            message: `You have been matched with ${slot.title} at ${slot.companyId?.companyName || 'Host Enterprise'}.`,
            type: 'success',
            link: '/intern/allocation',
          });

          sendAllocationReadyEmail(internProfile.userId, {
            slotTitle: slot.title,
            companyName: slot.companyId?.companyName || 'Host Enterprise',
            matchScore: alloc.matchScore,
          });
        }
      } catch (e) {
        // Safe continue
      }
    }

    // Notify companies about ready candidates
    const distinctCompanyIds = [...new Set(newAllocations.map((a) => a.companyId?.toString()).filter(Boolean))];
    for (const compId of distinctCompanyIds) {
      try {
        const comp = await CompanyProfile.findById(compId).populate('userId');
        if (comp?.userId) {
          const matchCount = newAllocations.filter((a) => a.companyId?.toString() === compId).length;
          await Notification.create({
            userId: comp.userId._id,
            title: 'Candidate Recommendations Available',
            message: `${matchCount} candidate match(es) have been prepared for your internship openings.`,
            type: 'success',
            link: '/company/matches',
          });
          sendCompanyMatchesReadyEmail(comp.userId, comp.companyName, matchCount);
        }
      } catch (e) {
        // Safe continue
      }
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    const avgScore = newAllocations.length > 0 ? totalScoreSum / newAllocations.length : 0;

    await EngineLog.findByIdAndUpdate(engineLog._id, {
      status: 'Success',
      currentStep: 6,
      stepMessage: `Matching completed in ${duration}s. Recommended ${newAllocations.length} candidate(s).`,
      totalInterns: interns.length,
      totalSlots: slots.length,
      totalAllocated: newAllocations.length,
      averageMatchScore: avgScore,
      duration,
    });

    auditAction({ user: { id: userId, role: 'admin' } }, mode === 'reallocation' ? 'engine.reallocation_completed' : 'engine.run_completed', {
      entity: 'EngineLog',
      entityId: engineLog._id,
      details: { totalAllocated: newAllocations.length, duration },
    });

    console.log(`[Matching] ${mode === 'reallocation' ? 'Re-allocation' : 'Matching'} completed: ${newAllocations.length} matched in ${duration}s`);
  } catch (runErr) {
    console.error(`[Matching Error] Failure: ${runErr.message}`);
    await EngineLog.findByIdAndUpdate(engineLog._id, {
      status: 'Failed',
      errorMessage: runErr.message,
      stepMessage: 'Matching process stopped unexpectedly.',
    });
  }
};

// Shared runner that guards concurrent runs with stale job recovery
const launchEngine = (mode) => async (req, res) => {
  try {
    const runningJob = await EngineLog.findOne({ status: 'Running' });
    if (runningJob) {
      const jobAge = Date.now() - new Date(runningJob.createdAt || runningJob.runAt).getTime();
      if (jobAge > 5 * 60 * 1000) {
        // Stale run from previous crash - auto-recover
        runningJob.status = 'Failed';
        runningJob.errorMessage = 'Previous run timed out or was interrupted.';
        runningJob.stepMessage = 'Matching process stopped. You can now start a new run.';
        await runningJob.save();
      } else {
        return res.status(409).json({
          success: false,
          message: 'Matching is currently in progress. Please wait for it to complete.',
          logId: runningJob._id,
        });
      }
    }

    const engineLog = await EngineLog.create({
      runBy: req.user.id,
      status: 'Running',
      currentStep: 1,
      totalSteps: 6,
      stepMessage: mode === 'reallocation'
        ? 'Step 1 of 6: Re-checking available capacity across applicant profiles...'
        : 'Step 1 of 6: Checking candidate profiles and preferences...',
    });

    auditAction({ user: req.user, req }, mode === 'reallocation' ? 'engine.reallocation_initiated' : 'engine.run_initiated', {
      entity: 'EngineLog',
      entityId: engineLog._id,
      details: { logId: engineLog._id },
    });

    res.status(202).json({
      success: true,
      message: mode === 'reallocation' ? 'Re-allocation engine initiated' : 'Smart Allocation Engine initiated',
      logId: engineLog._id,
    });

    const startTime = Date.now();
    executeEngineRunPipeline({ engineLog, userId: req.user.id, startTime, mode });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/v1/admin/engine/run
exports.runEngine = launchEngine('first');

// @route   POST /api/v1/admin/engine/realloc
exports.reallocateEngine = launchEngine('reallocation');

// Scheduled re-allocation entrypoint for node-cron (no HTTP context)
exports.triggerScheduledReallocation = async () => {
  const runningJob = await EngineLog.findOne({ status: 'Running' });
  if (runningJob) {
    return { success: false, message: 'Engine busy' };
  }
  const admin = await User.findOne({ role: 'admin' }).lean();
  if (!admin) {
    return { success: false, message: 'No admin account available' };
  }

  const engineLog = await EngineLog.create({
    runBy: admin._id,
    status: 'Running',
    currentStep: 1,
    totalSteps: 8,
    stepMessage: 'Step 1/8: Automatic re-allocation of freed capacity across unallocated profiles...',
  });

  auditAction({ user: { id: admin._id, role: 'admin' } }, 'engine.scheduled_realloc_initiated', {
    entity: 'EngineLog',
    entityId: engineLog._id,
    details: { logId: engineLog._id },
  });

  executeEngineRunPipeline({ engineLog, userId: admin._id, startTime: Date.now(), mode: 'reallocation' });

  return { success: true };
};

// @route   GET /api/v1/admin/engine/status
exports.getEngineStatus = async (req, res) => {
  try {
    const latestLog = await EngineLog.findOne().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      log: latestLog,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/admin/engine/logs
exports.getEngineLogs = async (req, res) => {
  try {
    const logs = await EngineLog.find().sort({ runAt: -1 }).limit(50);
    const successRuns = logs.filter((l) => l.status === 'Success');
    const stats = {
      totalRuns: successRuns.length,
      totalAllocated: successRuns.reduce((acc, l) => acc + (l.totalAllocated || 0), 0),
      totalInternsProcessed: successRuns.reduce((acc, l) => acc + (l.totalInterns || 0), 0),
      avgMatchScore: successRuns.length
        ? successRuns.reduce((acc, l) => acc + (l.averageMatchScore || 0), 0) / successRuns.length
        : 0,
    };
    res.status(200).json({ success: true, count: logs.length, logs, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/admin/audit-logs
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      logs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   DELETE /api/v1/admin/audit-logs
exports.clearAuditLogs = async (req, res) => {
  try {
    const result = await AuditLog.deleteMany({});
    auditAction({ user: req.user, req }, 'audit.clear', {
      entity: 'AuditLog',
      details: { deleted: result.deletedCount },
    });
    res.status(200).json({ success: true, message: `Cleared ${result.deletedCount} audit entries` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/admin/system-config
exports.getSystemConfig = async (req, res) => {
  try {
    const config = await SystemConfig.getConfig();
    res.status(200).json({ success: true, config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/v1/admin/system-config
exports.updateSystemConfig = async (req, res) => {
  try {
    const { weights, quotas } = req.body;

    const update = { updatedBy: req.user.id };
    if (weights && typeof weights === 'object') {
      const w = {};
      for (const key of ['location', 'homeState', 'domain', 'cgpaHigh', 'cgpaMid', 'cgpaLow', 'penaltyGate']) {
        const val = parseFloat(weights[key]);
        if (!isNaN(val)) w[key] = val;
      }
      if (Object.keys(w).length) update.weights = w;
    }
    if (quotas && typeof quotas === 'object') {
      const q = {};
      for (const key of ['SC', 'ST', 'OBC', 'PH']) {
        const val = parseFloat(quotas[key]);
        if (!isNaN(val)) q[key] = Math.min(Math.max(val, 0), 1);
      }
      if (Object.keys(q).length) update.quotas = q;
    }

    const config = await SystemConfig.findOneAndUpdate({ key: 'main' }, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    auditAction({ user: req.user, req }, 'system_config.updated', {
      entity: 'SystemConfig',
      entityId: config._id,
      details: { weights: update.weights, quotas: update.quotas },
    });

    res.status(200).json({
      success: true,
      message: 'System configuration updated. Tuned parameters will apply to the next engine run.',
      config,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/v1/admin/notifications/broadcast
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, type = 'info', targetRole = 'all' } = req.body;

    const query = {};
    if (targetRole !== 'all') {
      query.role = targetRole;
    }

    const users = await User.find(query).select('_id');

    const notificationDocs = users.map((u) => ({
      userId: u._id,
      title,
      message,
      type,
      link: '/dashboard',
    }));

    await Notification.insertMany(notificationDocs);

    auditAction({ user: req.user, req }, 'notification.broadcast', {
      entity: 'Notification',
      details: { title, targetRole, recipients: users.length },
    });

    res.status(200).json({
      success: true,
      message: `Broadcast message delivered to ${users.length} user accounts.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/v1/admin/reports/csv
exports.downloadAllocationsCsv = async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate({
        path: 'internId',
        populate: { path: 'userId' },
      })
      .populate('slotId')
      .populate('companyId');

    const tempFilePath = path.join(__dirname, `../uploads/all_allocations_${Date.now()}.csv`);
    const csvWriter = createCsvWriter({
      path: tempFilePath,
      header: [
        { id: 'internName', title: 'CANDIDATE NAME' },
        { id: 'internEmail', title: 'EMAIL' },
        { id: 'category', title: 'CATEGORY' },
        { id: 'company', title: 'COMPANY' },
        { id: 'slot', title: 'POSITION' },
        { id: 'score', title: 'MATCH %' },
        { id: 'status', title: 'STATUS' },
        { id: 'allocatedAt', title: 'DATE' },
      ],
    });

    const records = allocations.map((a) => ({
      internName: a.internId?.userId?.name || 'N/A',
      internEmail: a.internId?.userId?.email || 'N/A',
      category: a.matchReason?.quotaCategory || a.internId?.category || 'General',
      company: a.companyId?.companyName || 'N/A',
      slot: a.slotId?.title || 'N/A',
      score: `${Math.round((a.matchScore || 0) * 100)}%`,
      status: a.status,
      allocatedAt: a.allocatedAt ? new Date(a.allocatedAt).toLocaleDateString('en-IN') : 'N/A',
    }));

    await csvWriter.writeRecords(records);

    res.download(tempFilePath, 'PM_Internship_Allocations.csv', (err) => {
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports.recalculateFilledSeats = recalculateFilledSeats;

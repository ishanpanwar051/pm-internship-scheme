const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InternProfile = require('../models/InternProfile');
const CompanyProfile = require('../models/CompanyProfile');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

// Helper to generate and attach JWT as httpOnly cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'pm_internship_super_secret_jwt_key_2024_secure',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 1;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token, // Provided for Authorization header support
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      isVerified: user.isVerified,
    },
  });
};

// @route   POST /api/v1/auth/register
// @desc    Register new Candidate or Company account (Admin registration is strictly forbidden)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, companyName, sector } = req.body;

    // 1. Strict Type & Parameter Validation (prevents NoSQL injection)
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid name, email, and password.',
      });
    }

    // 2. Strict Privilege Escalation Guard
    if (role === 'admin' || req.body.isAdmin || req.body.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be created via public registration.',
      });
    }

    // 3. Enforce Strong Password Policy (Minimum 8 chars)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    // 4. Sanitize and Verify Email Uniqueness
    const sanitizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // 5. Assign Role - Only 'intern' or 'company' allowed
    const assignedRole = role === 'company' ? 'company' : 'intern';

    // 6. Create User in MongoDB (Pre-save hook hashes password using bcrypt with 12 rounds)
    const user = await User.create({
      name: name.trim(),
      email: sanitizedEmail,
      password,
      role: assignedRole,
      phone: typeof phone === 'string' ? phone.trim() : '',
    });

    // 7. Scaffold associated profile document
    if (user.role === 'intern') {
      await InternProfile.create({
        userId: user._id,
        category: 'General',
        personalInfo: { state: 'Delhi' },
      });
    } else if (user.role === 'company') {
      await CompanyProfile.create({
        userId: user._id,
        companyName: typeof companyName === 'string' && companyName.trim() ? companyName.trim() : `${name.trim()} Corp`,
        sector: typeof sector === 'string' && sector.trim() ? sector.trim() : 'Technology',
      });
    }

    // 8. Send Welcome Email asynchronously
    sendWelcomeEmail(user);

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Registration failed: ${err.message}`,
    });
  }
};

// @route   POST /api/v1/auth/login
// @desc    Authenticate user against backend database credentials
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Strict Type Validation (Prevent NoSQL injection queries like { $ne: null })
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // 2. Fetch user from MongoDB by email including password hash
    const user = await User.findOne({ email: sanitizedEmail }).select('+password');

    // Generic error to prevent User Enumeration
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 3. Verify Account Status
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Account access has been suspended. Please contact portal administrator.',
      });
    }

    // 4. Enforce Role Consistency if specified (prevent portal mismatch without revealing existence)
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 5. Compare Password Hash using bcrypt.compare
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 6. Record last login timestamp
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // 7. Issue secure token and session cookie
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Login failed: ${err.message}`,
    });
  }
};

// @route   POST /api/v1/auth/logout
// @desc    Clear session cookie and invalidate authentication
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    success: true,
    message: 'User successfully logged out.',
  });
};

// @route   GET /api/v1/auth/me
// @desc    Retrieve authenticated user profile based on server-verified session
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User record not found.',
      });
    }

    let profile = null;
    if (user.role === 'intern') {
      profile = await InternProfile.findOne({ userId: user._id });
    } else if (user.role === 'company') {
      profile = await CompanyProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @route   POST /api/v1/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Valid email address required.',
      });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: sanitizedEmail });

    // Generic response to prevent user enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been dispatched.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been dispatched.',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @route   POST /api/v1/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or has expired.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @route   PUT /api/v1/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      newPassword.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password does not match records.',
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @route   PUT /api/v1/auth/update-profile
// @desc    Safely update user's name or phone. Privilege escalation (changing role) is strictly prevented.
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};
    if (typeof name === 'string' && name.trim()) updateData.name = name.trim();
    if (typeof phone === 'string') updateData.phone = phone.trim();
    if (req.file) updateData.avatar = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

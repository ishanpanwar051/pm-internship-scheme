const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Primary Authentication Middleware.
 * Extracts and verifies JWT from httpOnly cookie or Bearer Authorization header.
 * Validates against database to ensure account exists and is not blocked.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in httpOnly cookie first, then Bearer Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Reject unauthenticated requests
  if (!token || token === 'none') {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to continue.',
    });
  }

  try {
    // 3. Verify JWT signature & expiration
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'pm_internship_super_secret_jwt_key_2024_secure'
    );

    // 4. Fetch user from database to ensure fresh state
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user session is invalid. User record no longer exists.',
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact administrator.',
      });
    }

    // Attach validated user to request object
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session invalid or expired. Please log in again.',
    });
  }
};

// Aliases for RBAC standards
const authenticateUser = protect;

module.exports = {
  protect,
  authenticateUser,
};

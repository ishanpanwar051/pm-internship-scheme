/**
 * Role-Based Access Control (RBAC) Authorization Middleware.
 * Strictly verifies that the authenticated user's database role matches
 * one of the allowed roles for the endpoint.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to permission checking.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

// Standardized role authorization helpers
const authorizeAdmin = authorize('admin');
const authorizeUser = authorize('intern', 'company');
const authorizeCompany = authorize('company');
const authorizeIntern = authorize('intern');

module.exports = {
  authorize,
  authorizeAdmin,
  authorizeUser,
  authorizeCompany,
  authorizeIntern,
};

const AuditLog = require('../models/AuditLog');

/**
 * Records an auditable administrative action. Fire-and-forget; never throws.
 * @param {{user: {id: string, role: string}, req?: {ip?: string}}} ctx
 * @param {string} action
 * @param {{entity?: string, entityId?: string, details?: object}} opts
 */
const auditAction = async (ctx, action, opts = {}) => {
  try {
    await AuditLog.create({
      userId: ctx.user.id,
      role: ctx.user.role,
      action,
      entity: opts.entity || '',
      entityId: opts.entityId || null,
      details: opts.details || {},
      ip: (ctx.req && (ctx.req.ip || (ctx.req.headers && ctx.req.headers['x-forwarded-for']))) || '',
    });
  } catch (err) {
    console.warn(`[Audit] Failed to record '${action}': ${err.message}`);
  }
};

module.exports = { auditAction };
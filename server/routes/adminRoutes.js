const express = require('express');
const { body } = require('express-validator');
const {
  getDashboard,
  getUsers,
  toggleBlockUser,
  deleteUser,
  getCompanies,
  toggleVerifyCompany,
  getInterns,
  getAllSlots,
  getAllAllocations,
  overrideAllocation,
  runEngine,
  reallocateEngine,
  getEngineStatus,
  getEngineLogs,
  getSystemConfig,
  updateSystemConfig,
  getAuditLogs,
  clearAuditLogs,
  broadcastNotification,
  downloadAllocationsCsv,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);

router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

router.get('/companies', getCompanies);
router.put('/companies/:id/verify', toggleVerifyCompany);

router.get('/interns', getInterns);
router.get('/slots', getAllSlots);

router.get('/allocations', getAllAllocations);
router.put('/allocations/:id/override', overrideAllocation);

router.post('/engine/run', runEngine);
router.post('/engine/realloc', reallocateEngine);
router.get('/engine/status', getEngineStatus);
router.get('/engine/logs', getEngineLogs);

router.get('/system-config', getSystemConfig);
router.put(
  '/system-config',
  [
    body('weights').optional().isObject().withMessage('Weights must be an object'),
    body('quotas').optional().isObject().withMessage('Quotas must be an object'),
    validate,
  ],
  updateSystemConfig
);

router.get('/audit-logs', getAuditLogs);
router.delete('/audit-logs', clearAuditLogs);

router.post(
  '/notifications/broadcast',
  [
    body('title').trim().notEmpty().withMessage('Notification title is required'),
    body('message').trim().notEmpty().withMessage('Notification message is required'),
    validate,
  ],
  broadcastNotification
);
router.get('/reports/csv', downloadAllocationsCsv);

module.exports = router;

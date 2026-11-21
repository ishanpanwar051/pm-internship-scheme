const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadResume,
  getAllocation,
  acceptAllocation,
  declineAllocation,
  getSlots,
  getSlotById,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getDashboard,
} = require('../controllers/internController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const upload = require('../middleware/upload');

const router = express.Router();

// Apply auth and intern-role guard
router.use(protect);
router.use(authorize('intern'));

router.get('/profile', getProfile);
router.post('/profile', updateProfile);
router.post('/resume/upload', upload.single('file'), uploadResume);

router.get('/allocation', getAllocation);
router.put('/allocation/accept', acceptAllocation);
router.put('/allocation/decline', declineAllocation);

router.get('/slots', getSlots);
router.get('/slots/:id', getSlotById);

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.put('/notifications/read-all', markAllNotificationsRead);

router.get('/dashboard', getDashboard);

module.exports = router;

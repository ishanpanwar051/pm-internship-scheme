const express = require('express');
const {
  getProfile,
  updateProfile,
  createSlot,
  getSlots,
  getSlotById,
  updateSlot,
  deleteSlot,
  getAllMatches,
  getSlotMatches,
  acceptIntern,
  rejectIntern,
  getAcceptedInterns,
  getDashboard,
  submitInternFeedback,
  downloadAcceptedCsv,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require('../controllers/companyController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);
router.use(authorize('company'));

router.get('/profile', getProfile);
router.post('/profile', upload.single('logo'), updateProfile);

router.post('/slots', createSlot);
router.get('/slots', getSlots);
router.get('/slots/:id', getSlotById);
router.put('/slots/:id', updateSlot);
router.delete('/slots/:id', deleteSlot);

router.get('/matches', getAllMatches);
router.get('/slots/:id/matches', getSlotMatches);
router.put('/allocations/:id/accept', acceptIntern);
router.put('/allocations/:id/reject', rejectIntern);

router.get('/accepted-interns', getAcceptedInterns);
router.get('/dashboard', getDashboard);
router.post('/intern/:id/feedback', submitInternFeedback);
router.get('/report/download', downloadAcceptedCsv);

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.put('/notifications/read-all', markAllNotificationsRead);

module.exports = router;

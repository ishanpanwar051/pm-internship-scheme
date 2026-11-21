const express = require('express');
const { body } = require('express-validator');
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
const { validate } = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);
router.use(authorize('company'));

router.get('/profile', getProfile);
router.post('/profile', upload.single('logo'), updateProfile);

router.post(
  '/slots',
  [
    body('title').trim().notEmpty().withMessage('Internship title is required'),
    body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
    body('domain').optional().trim(),
    validate,
  ],
  createSlot
);
router.get('/slots', getSlots);
router.get('/slots/:id', getSlotById);
router.put(
  '/slots/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('totalSeats').optional().isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
    validate,
  ],
  updateSlot
);
router.delete('/slots/:id', deleteSlot);

router.get('/matches', getAllMatches);
router.get('/slots/:id/matches', getSlotMatches);
router.put('/allocations/:id/accept', acceptIntern);
router.put(
  '/allocations/:id/reject',
  [
    body('reason').trim().notEmpty().withMessage('Rejection reason is required'),
    validate,
  ],
  rejectIntern
);

router.get('/accepted-interns', getAcceptedInterns);
router.get('/dashboard', getDashboard);
router.post('/intern/:id/feedback', submitInternFeedback);
router.get('/report/download', downloadAcceptedCsv);

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.put('/notifications/read-all', markAllNotificationsRead);

module.exports = router;

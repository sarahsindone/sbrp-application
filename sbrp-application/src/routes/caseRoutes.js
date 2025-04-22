const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware.protect);

// Get all cases with filtering, sorting, and pagination
router.get('/', caseController.getAllCases);

// Get case statistics
router.get('/stats', caseController.getCaseStats);

// Get single case by ID
router.get('/:id', caseController.getCaseById);

// Create new case
router.post('/', caseController.createCase);

// Update case
router.put('/:id', caseController.updateCase);

// Update case status
router.patch('/:id/status', caseController.updateCaseStatus);

// Delete case - restrict to admin only
router.delete('/:id', authMiddleware.restrictTo('admin'), caseController.deleteCase);

module.exports = router;

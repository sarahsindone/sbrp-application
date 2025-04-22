const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createDataCollection,
  getDataCollections,
  getDataCollectionById,
  getDataCollectionByCaseId,
  updateDataCollection,
  updateDataCollectionSection,
  completeDataCollection,
  deleteDataCollection
} = require('../controllers/dataCollectionController');

// Base routes
router.route('/')
  .post(protect, createDataCollection)
  .get(protect, getDataCollections);

// Case-specific route
router.route('/case/:caseId')
  .get(protect, getDataCollectionByCaseId);

// Section update route
router.route('/:id/section/:section')
  .patch(protect, updateDataCollectionSection);

// Complete data collection route
router.route('/:id/complete')
  .patch(protect, completeDataCollection);

// ID-specific routes
router.route('/:id')
  .get(protect, getDataCollectionById)
  .put(protect, updateDataCollection)
  .delete(protect, deleteDataCollection);

module.exports = router;

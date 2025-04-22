const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createReportTemplate,
  getReportTemplates,
  getReportTemplateById,
  updateReportTemplate,
  deleteReportTemplate,
  generateReport,
  getReports,
  getReportById,
  updateReport,
  updateReportSection,
  setReportReviewStatus,
  finalizeReport,
  publishReport,
  deleteReport
} = require('../controllers/reportController');

// Template routes
router.route('/templates')
  .post(protect, createReportTemplate)
  .get(protect, getReportTemplates);

router.route('/templates/:id')
  .get(protect, getReportTemplateById)
  .put(protect, updateReportTemplate)
  .delete(protect, deleteReportTemplate);

// Report routes
router.route('/')
  .post(protect, generateReport)
  .get(protect, getReports);

router.route('/:id')
  .get(protect, getReportById)
  .put(protect, updateReport)
  .delete(protect, deleteReport);

// Section update route
router.route('/:id/section/:sectionIndex')
  .patch(protect, updateReportSection);

// Status update routes
router.route('/:id/review')
  .patch(protect, setReportReviewStatus);

router.route('/:id/finalize')
  .patch(protect, finalizeReport);

router.route('/:id/publish')
  .patch(protect, publishReport);

module.exports = router;

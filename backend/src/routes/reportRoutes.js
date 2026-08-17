const express = require('express');
const router = express.Router();
const {
  uploadReport,
  reanalyzeReport,
  getReports,
  getReportById,
  deleteReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect); // All report routes are protected

router.route('/')
  .get(getReports)
  .post(upload.single('file'), uploadReport);

router.route('/:id')
  .get(getReportById)
  .delete(deleteReport);

router.post('/:id/analyze', reanalyzeReport);

module.exports = router;

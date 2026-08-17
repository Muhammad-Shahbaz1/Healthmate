const express = require('express');
const router = express.Router();
const { addVital, getVitals, deleteVital } = require('../controllers/vitalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(addVital)
  .get(getVitals);

router.route('/:id')
  .delete(deleteVital);

module.exports = router;

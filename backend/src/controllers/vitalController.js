const Vital = require('../models/Vital');

// @desc    Add manual health vital (BP, Sugar, Weight, etc.)
// @route   POST /api/vitals
// @access  Private
const addVital = async (req, res) => {
  try {
    const {
      date,
      systolicBP,
      diastolicBP,
      bloodSugar,
      sugarType,
      weight,
      heartRate,
      temperature,
      notes,
    } = req.body;

    const vital = await Vital.create({
      user: req.user._id,
      date: date ? new Date(date) : new Date(),
      systolicBP: systolicBP ? Number(systolicBP) : undefined,
      diastolicBP: diastolicBP ? Number(diastolicBP) : undefined,
      bloodSugar: bloodSugar ? Number(bloodSugar) : undefined,
      sugarType: sugarType || 'Not Specified',
      weight: weight ? Number(weight) : undefined,
      heartRate: heartRate ? Number(heartRate) : undefined,
      temperature: temperature ? Number(temperature) : undefined,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Health vital recorded successfully',
      vital,
    });
  } catch (error) {
    console.error('Add vital error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error saving vital entry',
    });
  }
};

// @desc    Get user's recorded vitals
// @route   GET /api/vitals
// @access  Private
const getVitals = async (req, res) => {
  try {
    const vitals = await Vital.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: vitals.length,
      vitals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a vital entry
// @route   DELETE /api/vitals/:id
// @access  Private
const deleteVital = async (req, res) => {
  try {
    const vital = await Vital.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!vital) {
      return res.status(404).json({ success: false, message: 'Vital entry not found' });
    }

    await vital.deleteOne();

    res.json({
      success: true,
      message: 'Vital entry deleted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addVital,
  getVitals,
  deleteVital,
};

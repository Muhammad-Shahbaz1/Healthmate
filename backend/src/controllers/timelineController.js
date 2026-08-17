const Report = require('../models/Report');
const Vital = require('../models/Vital');

// @desc    Get complete medical timeline (Reports + Manual Vitals)
// @route   GET /api/timeline
// @access  Private
const getTimeline = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch reports and vitals in parallel
    const [reports, vitals] = await Promise.all([
      Report.find({ user: userId }).populate('aiInsight').lean(),
      Vital.find({ user: userId }).lean(),
    ]);

    // Format reports into timeline event items
    const reportEvents = reports.map((r) => ({
      id: r._id,
      type: 'report',
      date: r.reportDate || r.createdAt,
      title: r.title,
      category: r.reportType,
      doctorName: r.doctorName,
      hospitalName: r.hospitalName,
      fileUrl: r.fileUrl,
      fileType: r.fileType,
      aiStatus: r.aiStatus,
      aiInsight: r.aiInsight,
      createdAt: r.createdAt,
    }));

    // Format vitals into timeline event items
    const vitalEvents = vitals.map((v) => ({
      id: v._id,
      type: 'vital',
      date: v.date || v.createdAt,
      title: 'Health Vitals Logged',
      systolicBP: v.systolicBP,
      diastolicBP: v.diastolicBP,
      bloodSugar: v.bloodSugar,
      sugarType: v.sugarType,
      weight: v.weight,
      heartRate: v.heartRate,
      temperature: v.temperature,
      notes: v.notes,
      createdAt: v.createdAt,
    }));

    // Combine and sort chronologically descending (newest first)
    const combinedTimeline = [...reportEvents, ...vitalEvents].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    res.json({
      success: true,
      count: combinedTimeline.length,
      timeline: combinedTimeline,
    });
  } catch (error) {
    console.error('Timeline error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTimeline };

const Report = require('../models/Report');
const AiInsight = require('../models/AiInsight');
const cloudinary = require('../config/cloudinary');
const { analyzeMedicalReport } = require('../services/geminiService');

// Helper function to upload buffer to Cloudinary or create Data URL fallback
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    // If Cloudinary environment variables are not set or default placeholder
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name'
    ) {
      // Fallback: Return data URI so testing works even without Cloudinary API keys
      const base64 = buffer.toString('base64');
      const dataUri = `data:${mimetype};base64,${base64}`;
      return resolve({
        secure_url: dataUri,
        public_id: `local_${Date.now()}`,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'healthmate_reports',
        resource_type: mimetype.includes('pdf') ? 'raw' : 'auto',
      },
      (error, result) => {
        if (error) {
          console.warn('Cloudinary upload warning:', error.message);
          // Fallback to data URI if Cloudinary fails
          const base64 = buffer.toString('base64');
          return resolve({
            secure_url: `data:${mimetype};base64,${base64}`,
            public_id: `fallback_${Date.now()}`,
          });
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

// @desc    Upload report & run Gemini AI analysis
// @route   POST /api/reports/upload
// @access  Private
const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a medical report file (PDF or image) to upload',
      });
    }

    const { title, reportType, reportDate, doctorName, hospitalName } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Report title is required',
      });
    }

    // 1. Upload to storage
    const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    // 2. Create initial Report record
    const report = await Report.create({
      user: req.user._id,
      title,
      reportType: reportType || 'General Medical Report',
      reportDate: reportDate ? new Date(reportDate) : new Date(),
      doctorName: doctorName || '',
      hospitalName: hospitalName || '',
      fileUrl: uploadResult.secure_url,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      cloudinaryPublicId: uploadResult.public_id,
      aiStatus: 'processing',
    });

    // 3. Trigger Gemini Multimodal Analysis
    let aiInsightRecord = null;
    try {
      const aiResponse = await analyzeMedicalReport(
        req.file.buffer,
        req.file.mimetype,
        { title, reportType }
      );

      if (aiResponse.success) {
        aiInsightRecord = await AiInsight.create({
          report: report._id,
          user: req.user._id,
          summaryEnglish: aiResponse.data.summaryEnglish,
          summaryRomanUrdu: aiResponse.data.summaryRomanUrdu,
          keyFindings: aiResponse.data.keyFindings || [],
          abnormalValues: aiResponse.data.abnormalValues || [],
          doctorQuestions: aiResponse.data.doctorQuestions || [],
          foodsToEat: aiResponse.data.foodsToEat || [],
          foodsToAvoid: aiResponse.data.foodsToAvoid || [],
          homeRemedies: aiResponse.data.homeRemedies || [],
          suggestedFollowUp: aiResponse.data.suggestedFollowUp || '',
          disclaimer:
            aiResponse.data.disclaimer ||
            'Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.',
          rawModelResponse: aiResponse.rawResponse,
        });

        report.aiStatus = 'completed';
        report.aiInsight = aiInsightRecord._id;
        await report.save();
      }
    } catch (aiErr) {
      console.error('AI Analysis failed during upload:', aiErr.message);
      report.aiStatus = 'failed';
      await report.save();
    }

    const populatedReport = await Report.findById(report._id).populate('aiInsight');

    res.status(201).json({
      success: true,
      message: 'Report uploaded and analyzed successfully',
      report: populatedReport,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during report upload',
    });
  }
};

// @desc    Get all reports for user
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const { type, search } = req.query;
    const query = { user: req.user._id };

    if (type && type !== 'All') {
      query.reportType = type;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const reports = await Report.find(query)
      .populate('aiInsight')
      .sort({ reportDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('aiInsight');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or unauthorized access',
      });
    }

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Delete associated AI insight
    await AiInsight.deleteMany({ report: report._id });

    // Delete Cloudinary asset if applicable
    if (report.cloudinaryPublicId && !report.cloudinaryPublicId.startsWith('local_')) {
      try {
        await cloudinary.uploader.destroy(report.cloudinaryPublicId);
      } catch (cErr) {
        console.warn('Cloudinary delete warning:', cErr.message);
      }
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadReport,
  getReports,
  getReportById,
  deleteReport,
};

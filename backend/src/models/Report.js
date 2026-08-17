const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a report title'],
      trim: true,
    },
    reportType: {
      type: String,
      required: true,
      enum: [
        'Blood Test (CBC, LFT, KFT, Lipid)',
        'X-Ray',
        'Ultrasound / MRI / CT Scan',
        'Doctor Prescription',
        'Urine / Stool Test',
        'ECG / Cardiology',
        'General Medical Report',
        'Other'
      ],
      default: 'General Medical Report',
    },
    reportDate: {
      type: Date,
      default: Date.now,
    },
    doctorName: {
      type: String,
      trim: true,
    },
    hospitalName: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileType: {
      type: String, // 'application/pdf', 'image/jpeg', 'image/png', etc.
      required: true,
    },
    fileSize: {
      type: Number,
    },
    cloudinaryPublicId: {
      type: String,
    },
    aiStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    aiInsight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AiInsight',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', ReportSchema);

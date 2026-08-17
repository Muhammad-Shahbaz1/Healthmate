const mongoose = require('mongoose');

const AbnormalValueSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  observedValue: { type: String, required: true },
  normalRange: { type: String, default: 'N/A' },
  status: { type: String, enum: ['High', 'Low', 'Abnormal', 'Borderline', 'Normal'], default: 'Abnormal' },
  severity: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], default: 'Moderate' },
  explanation: { type: String },
  explanationUrdu: { type: String }
});

const AiInsightSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    summaryEnglish: {
      type: String,
      required: true,
    },
    summaryRomanUrdu: {
      type: String,
      required: true,
    },
    keyFindings: {
      type: [String],
      default: [],
    },
    abnormalValues: [AbnormalValueSchema],
    doctorQuestions: {
      type: [String],
      default: [],
    },
    foodsToEat: {
      type: [String],
      default: [],
    },
    foodsToAvoid: {
      type: [String],
      default: [],
    },
    homeRemedies: {
      type: [String],
      default: [],
    },
    suggestedFollowUp: {
      type: String,
      default: '',
    },
    disclaimer: {
      type: String,
      default:
        'AI is for educational and understanding purposes only, not a substitute for professional medical advice, diagnosis, or treatment. Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.',
    },
    rawModelResponse: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiInsight', AiInsightSchema);

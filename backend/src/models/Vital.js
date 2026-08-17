const mongoose = require('mongoose');

const VitalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    systolicBP: {
      type: Number, // e.g. 120
      min: 50,
      max: 300,
    },
    diastolicBP: {
      type: Number, // e.g. 80
      min: 30,
      max: 200,
    },
    bloodSugar: {
      type: Number, // e.g. 95 (mg/dL)
      min: 20,
      max: 800,
    },
    sugarType: {
      type: String,
      enum: ['Fasting', 'Random', 'Post-Meal', 'HbA1c', 'Not Specified'],
      default: 'Not Specified',
    },
    weight: {
      type: Number, // in kg
      min: 1,
      max: 500,
    },
    heartRate: {
      type: Number, // bpm
      min: 30,
      max: 250,
    },
    temperature: {
      type: Number, // in Fahrenheit
      min: 90,
      max: 110,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vital', VitalSchema);

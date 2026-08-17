'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../lib/api';
import { format } from 'date-fns';
import {
  Activity,
  HeartPulse,
  Scale,
  Calendar,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function VitalsPage() {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    systolicBP: '',
    diastolicBP: '',
    bloodSugar: '',
    sugarType: 'Fasting',
    weight: '',
    heartRate: '',
    temperature: '',
    notes: '',
  });

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vitals');
      if (res.data.success) {
        setVitals(res.data.vitals);
      }
    } catch (err) {
      console.error('Failed to load vitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await api.post('/vitals', formData);
      if (res.data.success) {
        setSuccess('Health vitals saved successfully!');
        setFormData({
          date: new Date().toISOString().split('T')[0],
          systolicBP: '',
          diastolicBP: '',
          bloodSugar: '',
          sugarType: 'Fasting',
          weight: '',
          heartRate: '',
          temperature: '',
          notes: '',
        });
        fetchVitals();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vitals entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vital reading?')) return;
    try {
      await api.delete(`/vitals/${id}`);
      fetchVitals();
    } catch (err) {
      alert('Failed to delete reading');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Manual Health Vitals
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Log BP, Sugar, and Weight regularly without needing a lab test report.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form to Log Vitals (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Log New Reading</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Blood Pressure */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                  <span>Blood Pressure (Systolic / Diastolic)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="systolicBP"
                    placeholder="Sys (e.g. 120)"
                    value={formData.systolicBP}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                  <input
                    type="number"
                    name="diastolicBP"
                    placeholder="Dia (e.g. 80)"
                    value={formData.diastolicBP}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Blood Sugar */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Blood Sugar (mg/dL)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="bloodSugar"
                    placeholder="e.g. 95"
                    value={formData.bloodSugar}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                  <select
                    name="sugarType"
                    value={formData.sugarType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Fasting">Fasting (Nahar Mu)</option>
                    <option value="Random">Random</option>
                    <option value="Post-Meal">Post-Meal (Khane ke baad)</option>
                    <option value="HbA1c">HbA1c</option>
                  </select>
                </div>
              </div>

              {/* Weight & Heart Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    step="0.1"
                    placeholder="e.g. 72.5"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    name="heartRate"
                    placeholder="e.g. 75"
                    value={formData.heartRate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="e.g. Felt a little dizzy in morning"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-600/20 transition-all"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Save Health Vitals</span>
                )}
              </button>
            </form>
          </div>

          {/* Vitals History List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Recorded History ({vitals.length})</span>
            </h2>

            {loading ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading vitals history...</p>
              </div>
            ) : vitals.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No vitals logged yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Use the form on the left to track your BP, sugar, and weight over time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {vitals.map((item) => (
                  <div
                    key={item._id}
                    className="health-card p-4 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs pt-1">
                        {item.systolicBP && item.diastolicBP && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border border-rose-100 dark:border-rose-800/80">
                            BP: {item.systolicBP}/{item.diastolicBP} mmHg
                          </span>
                        )}

                        {item.bloodSugar && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-100 dark:border-emerald-800/80">
                            Sugar: {item.bloodSugar} mg/dL ({item.sugarType})
                          </span>
                        )}

                        {item.weight && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            Weight: {item.weight} kg
                          </span>
                        )}

                        {item.heartRate && (
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
                            Pulse: {item.heartRate} bpm
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1">
                          &ldquo;{item.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

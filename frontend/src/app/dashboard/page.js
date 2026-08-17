'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import ReportCard from '../../components/ReportCard';
import api from '../../lib/api';
import {
  FileUp,
  Activity,
  Search,
  Filter,
  AlertTriangle,
  FileText,
  HeartPulse,
  Plus,
  Loader2,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const reportCategories = [
    'All',
    'Blood Test (CBC, LFT, KFT, Lipid)',
    'Doctor Prescription',
    'X-Ray',
    'Ultrasound / MRI / CT Scan',
    'General Medical Report',
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, selectedType]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const queryParam = selectedType !== 'All' ? `?type=${encodeURIComponent(selectedType)}` : '';
      const [reportsRes, vitalsRes] = await Promise.all([
        api.get(`/reports${queryParam}`),
        api.get('/vitals'),
      ]);

      if (reportsRes.data.success) {
        setReports(reportsRes.data.reports);
      }
      if (vitalsRes.data.success) {
        setVitals(vitalsRes.data.vitals);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const abnormalReportsCount = reports.filter(
    (r) => r.aiInsight?.abnormalValues?.length > 0
  ).length;

  const latestVital = vitals.length > 0 ? vitals[0] : null;

  if (authLoading || (!user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Assalam-o-Alaikum, {user?.name || 'Friend'} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your AI-powered personal health vault is up to date.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/upload"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
            >
              <FileUp className="w-4 h-4" />
              <span>Upload Report</span>
            </Link>

            <Link
              href="/vitals"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Log Vitals</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Reports */}
          <div className="health-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Reports
              </span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {reports.length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Analyzed by Gemini AI</p>
          </div>

          {/* Card 2: Attention Flags */}
          <div className="health-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Reports with Flags
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
              {abnormalReportsCount}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Requires follow-up</p>
          </div>

          {/* Card 3: Latest BP */}
          <div className="health-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Latest BP Reading
              </span>
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <HeartPulse className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {latestVital?.systolicBP && latestVital?.diastolicBP
                ? `${latestVital.systolicBP}/${latestVital.diastolicBP}`
                : 'Not Logged'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {latestVital?.systolicBP ? 'mmHg' : 'Track daily blood pressure'}
            </p>
          </div>

          {/* Card 4: Latest Blood Sugar */}
          <div className="health-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Latest Blood Sugar
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {latestVital?.bloodSugar ? `${latestVital.bloodSugar}` : 'Not Logged'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {latestVital?.bloodSugar ? `${latestVital.sugarType || 'mg/dL'}` : 'Track fasting/random'}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search reports by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm text-slate-900 dark:text-white transition-colors"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 hidden sm:inline" />
            {reportCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedType(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedType === cat
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'All' ? 'All Types' : cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Medical Reports ({filteredReports.length})
            </h2>
            <Link
              href="/timeline"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View Full Timeline →
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading your medical files...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 space-y-4 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <FileUp className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No reports found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You haven&apos;t uploaded any reports in this category yet. Upload a lab report or prescription to get AI summaries.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Upload First Report</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReports.map((report) => (
                <ReportCard key={report._id} report={report} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

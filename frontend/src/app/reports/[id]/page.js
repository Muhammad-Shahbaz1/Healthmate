'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import LanguageToggle from '../../../components/LanguageToggle';
import api from '../../../lib/api';
import { format } from 'date-fns';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Stethoscope,
  Building,
  HelpCircle,
  Apple,
  Ban,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('romanUrdu'); // 'romanUrdu' | 'english'
  const [deleting, setDeleting] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/${id}`);
      if (res.data.success) {
        setReport(res.data.report);
      }
    } catch (err) {
      console.error('Failed to fetch report details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async () => {
    setReanalyzing(true);
    setErrorMsg('');
    try {
      const res = await api.post(`/reports/${id}/analyze`);
      if (res.data.success) {
        setReport(res.data.report);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to analyze report with Gemini AI. Please try again.');
    } finally {
      setReanalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this medical report?')) {
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/reports/${id}`);
      router.push('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <div className="flex-1 p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">Report not found.</p>
          <Link href="/dashboard" className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mt-2 inline-block">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const insight = report.aiInsight;
  const isPdf = report.fileType === 'application/pdf' || (report.fileUrl && report.fileUrl.endsWith('.pdf'));
  const abnormalValues = insight?.abnormalValues || [];
  const hasInsight = !!insight && (!!insight.summaryRomanUrdu || !!insight.summaryEnglish);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleReanalyze}
              disabled={reanalyzing}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {reanalyzing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>{reanalyzing ? 'Analyzing with AI...' : 'Re-Analyze with Gemini AI'}</span>
            </button>

            <LanguageToggle language={language} setLanguage={setLanguage} />

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-all"
              title="Delete Report"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="font-bold ml-2">✕</button>
          </div>
        )}

        {/* Report Overview Banner */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                {report.reportType}
              </span>
              {report.aiStatus === 'completed' && abnormalValues.length > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
                  {abnormalValues.length} Attention Items
                </span>
              )}
              {report.aiStatus === 'processing' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
                  AI Analyzing...
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>
                  {report.reportDate
                    ? format(new Date(report.reportDate), 'MMMM dd, yyyy')
                    : 'Recent'}
                </span>
              </div>

              {report.doctorName && (
                <div className="flex items-center space-x-1">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Dr. {report.doctorName}</span>
                </div>
              )}

              {report.hospitalName && (
                <div className="flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{report.hospitalName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <a
              href={report.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Original File</span>
            </a>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: AI INSIGHTS & EXPLANATIONS (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Summary Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-base">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h2>AI Summary ({language === 'romanUrdu' ? 'Roman Urdu' : 'English'})</h2>
                </div>

                {!hasInsight && (
                  <button
                    onClick={handleReanalyze}
                    disabled={reanalyzing}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Run AI Analysis</span>
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {hasInsight ? (
                  language === 'romanUrdu'
                    ? (insight.summaryRomanUrdu || insight.summaryEnglish)
                    : (insight.summaryEnglish || insight.summaryRomanUrdu)
                ) : (
                  <div className="space-y-3 py-2 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      AI analysis is ready to run on this document.
                    </p>
                    <button
                      onClick={handleReanalyze}
                      disabled={reanalyzing}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      {reanalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      <span>{reanalyzing ? 'Analyzing with Gemini AI...' : 'Click to Generate AI Summary'}</span>
                    </button>
                  </div>
                )}
              </div>

              {insight?.keyFindings?.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Key Takeaways
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {insight.keyFindings.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Abnormal Values Alert */}
            {abnormalValues.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
                <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-base">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h2>Prescribed Medicines / Flagged Values ({abnormalValues.length})</h2>
                </div>

                <div className="space-y-3">
                  {abnormalValues.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {item.testName}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Dosage / Normal: <span className="font-medium">{item.normalRange}</span>
                          </p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'High' || item.status === 'Critical'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : item.status === 'Prescribed'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {item.observedValue} ({item.status})
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {language === 'romanUrdu' ? 'Wazahat (Meaning): ' : 'Explanation: '}
                        </span>
                        {language === 'romanUrdu'
                          ? (item.explanationUrdu || item.explanation)
                          : item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Questions to Ask Your Doctor */}
            {insight?.doctorQuestions?.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
                <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300 font-bold text-base">
                  <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2>
                    {language === 'romanUrdu'
                      ? 'Doctor Se Puchne Wale Sawalat'
                      : 'Questions to Ask Your Doctor'}
                  </h2>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {insight.doctorQuestions.map((q, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800/40 flex items-start space-x-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Diet Advice & Home Remedies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Foods to Eat */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 transition-colors">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {language === 'romanUrdu' ? 'Khorak (Kya Khayein)' : 'Foods to Eat'}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {insight?.foodsToEat?.length > 0 ? (
                    insight.foodsToEat.map((food, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                        <span>{food}</span>
                      </li>
                    ))
                  ) : (
                    <li>Maintain a balanced, nutritious diet with plenty of water.</li>
                  )}
                </ul>
              </div>

              {/* Foods to Avoid */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 transition-colors">
                <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
                  <Ban className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>
                    {language === 'romanUrdu' ? 'Parhaiz (Kin Cheezon Se Bachein)' : 'Foods to Avoid'}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {insight?.foodsToAvoid?.length > 0 ? (
                    insight.foodsToAvoid.map((food, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                        <span>{food}</span>
                      </li>
                    ))
                  ) : (
                    <li>Avoid excessive processed sugars and high saturated fats.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 5. Medical Disclaimer Alert */}
            <div className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-800 text-slate-200 text-xs flex items-start space-x-3 shadow-sm border border-slate-800 dark:border-slate-700">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-white">Medical Disclaimer</p>
                <p className="text-slate-300 leading-relaxed">
                  {insight?.disclaimer ||
                    'Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi. Hamesha apne doctor se mashwara karein.'}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: ORIGINAL DOCUMENT VIEWER (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm h-full flex flex-col transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Original Document Preview</span>
                </h3>
              </div>

              <div className="flex-1 bg-slate-100 dark:bg-slate-850 rounded-xl overflow-hidden min-h-[450px] flex items-center justify-center border border-slate-200 dark:border-slate-800">
                {isPdf ? (
                  <iframe
                    src={report.fileUrl}
                    className="w-full h-full min-h-[500px] rounded-xl"
                    title="PDF Viewer"
                  />
                ) : (
                  <img
                    src={report.fileUrl}
                    alt={report.title}
                    className="w-full h-auto max-h-[600px] object-contain rounded-xl"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

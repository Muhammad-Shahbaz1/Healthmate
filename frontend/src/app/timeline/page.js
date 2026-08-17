'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import api from '../../lib/api';
import { format } from 'date-fns';
import {
  History,
  FileText,
  Activity,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Loader2,
  Stethoscope,
  Info,
} from 'lucide-react';

export default function TimelinePage() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await api.get('/timeline');
      if (res.data.success) {
        setTimeline(res.data.timeline);
      }
    } catch (err) {
      console.error('Failed to load timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Medical Timeline
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                A complete chronological record of all your medical reports and vital entries.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Stream */}
        {loading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading your medical timeline...</p>
          </div>
        ) : timeline.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
            <Info className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Timeline is empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Upload your first lab test report or log health vitals to see your chronological health timeline.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
            >
              <span>Upload Report</span>
            </Link>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-200/80 dark:border-emerald-800/80 space-y-8 my-4 ml-3">
            {timeline.map((event, idx) => {
              const isReport = event.type === 'report';
              const hasFlags = event.aiInsight?.abnormalValues?.length > 0;

              return (
                <div key={event.id || idx} className="relative group">
                  {/* Timeline dot/badge */}
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center text-white shadow-sm ${
                      isReport ? 'bg-emerald-600' : 'bg-teal-500'
                    }`}
                  >
                    {isReport ? (
                      <FileText className="w-3.5 h-3.5" />
                    ) : (
                      <Activity className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="health-card p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {event.date
                              ? format(new Date(event.date), 'MMMM dd, yyyy')
                              : 'Recent'}
                          </span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {isReport ? (event.category || 'Medical Report') : 'Health Vitals Log'}
                        </span>
                      </div>

                      {isReport && hasFlags && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Attention Flags</span>
                        </span>
                      )}
                    </div>

                    {isReport ? (
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                          {event.title}
                        </h3>

                        {event.doctorName && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 mb-2">
                            <Stethoscope className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span>Dr. {event.doctorName}</span>
                          </p>
                        )}

                        {event.aiInsight?.summaryRomanUrdu && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mb-3">
                            <strong className="text-emerald-700 dark:text-emerald-400">Summary: </strong>
                            {event.aiInsight.summaryRomanUrdu}
                          </p>
                        )}

                        <Link
                          href={`/reports/${event.id}`}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                        >
                          <span>View Full AI Breakdown</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {event.systolicBP && event.diastolicBP && (
                            <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border border-rose-100 dark:border-rose-800/80">
                              BP: {event.systolicBP}/{event.diastolicBP} mmHg
                            </span>
                          )}

                          {event.bloodSugar && (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-100 dark:border-emerald-800/80">
                              Sugar: {event.bloodSugar} mg/dL ({event.sugarType})
                            </span>
                          )}

                          {event.weight && (
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                              Weight: {event.weight} kg
                            </span>
                          )}

                          {event.heartRate && (
                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
                              Pulse: {event.heartRate} bpm
                            </span>
                          )}
                        </div>

                        {event.notes && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                            Note: &ldquo;{event.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

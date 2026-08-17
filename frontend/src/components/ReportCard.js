'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FileText, AlertTriangle, CheckCircle2, ChevronRight, Calendar, Stethoscope } from 'lucide-react';

export default function ReportCard({ report }) {
  const hasAbnormal = report.aiInsight?.abnormalValues?.length > 0;
  const abnormalCount = report.aiInsight?.abnormalValues?.length || 0;

  return (
    <div className="health-card p-5 group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          
          {/* Status Badge */}
          {report.aiStatus === 'completed' ? (
            hasAbnormal ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{abnormalCount} Attention Flags</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All Clear / Normal</span>
              </span>
            )
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {report.aiStatus === 'processing' ? 'AI Analyzing...' : 'Pending'}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-1 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {report.title}
        </h3>

        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-4">
          <div className="flex items-center space-x-1.5">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300">
              {report.reportType}
            </span>
          </div>
          
          <div className="flex items-center space-x-1.5 pt-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>
              {report.reportDate
                ? format(new Date(report.reportDate), 'MMM dd, yyyy')
                : 'Recent'}
            </span>
          </div>

          {report.doctorName && (
            <div className="flex items-center space-x-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Dr. {report.doctorName}</span>
            </div>
          )}
        </div>

        {/* Short Summary Snippet */}
        {report.aiInsight?.summaryRomanUrdu && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 mb-4">
            <span className="font-medium text-emerald-700 dark:text-emerald-400">Roman Urdu: </span>
            {report.aiInsight.summaryRomanUrdu}
          </p>
        )}
      </div>

      <Link
        href={`/reports/${report._id}`}
        className="w-full mt-2 inline-flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-colors"
      >
        <span>View Full AI Insights</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

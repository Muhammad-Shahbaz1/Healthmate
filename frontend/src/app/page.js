'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse, FileText, Activity, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Powered by Gemini Multimodal AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              HealthMate – <span className="text-emerald-600 dark:text-emerald-400">Sehat ka Smart Dost</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Upload all your medical lab tests, prescriptions, and reports. Let Gemini explain complex medical jargon in crystal-clear <span className="font-semibold text-slate-800 dark:text-slate-100">English & Roman Urdu</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={user ? "/dashboard" : "/register"}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
              >
                <span>{user ? "Go to Dashboard" : "Get Started Free"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href={user ? "/upload" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Upload Report</span>
              </Link>
            </div>

            {/* Real Life Quote from Guide */}
            <div className="mt-8 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-xl mx-auto text-left flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
                  &ldquo;Jab doctor kehta hai, <strong>&lsquo;Pichli reports laao,&rsquo;</strong> hum WhatsApp ya purani files dhoondte reh jaate hain. HealthMate aapki saari health history ek jagah rakhta hai.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Why HealthMate?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Simple, secure, and made for real families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Manual OCR Needed</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Directly upload PDFs, photos, or scanned lab reports. Gemini reads the image directly and highlights abnormal values (WBC, Sugar, Hemoglobin).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bilingual Explanations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Get reports explained in conversational Roman Urdu and plain English. Includes doctor questions, foods to avoid, and safe home remedies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Timeline & Vitals Tracker</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Log daily BP, Sugar, and Weight readings. Keep every prescription and lab test sorted chronologically in your personal health timeline.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

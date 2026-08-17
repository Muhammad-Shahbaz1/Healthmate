import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import { Heart, Github, Linkedin, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'HealthMate – Sehat ka Smart Dost | AI Health Vault',
  description: 'AI-powered personal health companion app using Gemini for reading, organizing, and explaining medical reports in English & Roman Urdu.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            
            {/* Enhanced Footer with Muhammad Shahbaz's Name and Exact Links */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
                  
                  {/* Brand & Creator Credit */}
                  <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 text-center sm:text-left">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      HealthMate – Sehat ka Smart Dost
                    </span>
                    <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center space-x-1">
                      <span>Designed & Developed with</span>
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
                      <span>by <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Muhammad Shahbaz</strong></span>
                    </span>
                  </div>

                  {/* Social & Contact Links */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href="https://github.com/Muhammad-Shahbaz1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>

                    <a
                      href="https://www.linkedin.com/in/muhammad-shahbaz-a74ba5249"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>

                    <a
                      href="https://wa.me/923417570902"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Disclaimer note */}
                <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500">
                  Disclaimer: AI is for understanding and education only, not a substitute for professional medical advice.
                </div>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

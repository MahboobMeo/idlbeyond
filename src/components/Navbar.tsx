import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Menu,
  X,
  ArrowUpRight,
  Cpu,
  Compass,
  PhoneCall,
  GraduationCap,
  Mail,
  CheckSquare,
  BookOpen,
  HardDrive,
  Users,
  User as UserIcon,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { PageView } from '../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView, hash?: string) => void;
  onOpenContact: () => void;
  onOpenBlueprint: () => void;
  onOpenGmailHub: () => void;
  onOpenClassroomHub: () => void;
  onOpenTasksHub: () => void;
  onOpenDriveHub: () => void;
  onOpenContactsHub: () => void;
  currentUser: User | null;
  onGoogleSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenContact,
  onOpenBlueprint,
  onOpenGmailHub,
  onOpenClassroomHub,
  onOpenTasksHub,
  onOpenDriveHub,
  onOpenContactsHub,
  currentUser,
  onGoogleSignIn,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: PageView, hash?: string) => {
    onNavigate(page, hash);
    setMobileMenuOpen(false);
    if (hash && typeof window !== 'undefined') {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090d16]/85 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/40 py-2.5'
          : 'bg-transparent py-3.5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
            aria-label="IDLTech Home"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  IDLTech
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  Studio
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block font-mono">
                idltech.idlmatch.com
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleNavClick('home', '#solutions')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'text-slate-200 hover:text-white hover:bg-white/5'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Services
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', '#showcase')}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Interactive Showcase
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', '#process')}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Roadmap
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', '#pricing')}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Pricing
            </button>

            {/* Bootcamp highlighted nav link */}
            <button
              type="button"
              onClick={() => handleNavClick('bootcamp')}
              className={`relative px-3 py-1.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentPage === 'bootcamp'
                  ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-200 hover:text-cyan-300 hover:bg-white/5'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Bootcamp</span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
              </span>
            </button>
          </nav>

          {/* Google Workspace Action Chips (Gmail, Classroom, Tasks) */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            {/* Gmail Hub */}
            <button
              type="button"
              onClick={onOpenGmailHub}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Open Gmail Hub"
            >
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              <span>Gmail</span>
            </button>

            {/* Classroom Hub */}
            <button
              type="button"
              onClick={onOpenClassroomHub}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Open Google Classroom Hub"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Classroom</span>
            </button>

            {/* Tasks Hub */}
            <button
              type="button"
              onClick={onOpenTasksHub}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Open Google Tasks Hub"
            >
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tasks</span>
            </button>

            {/* Drive Hub */}
            <button
              type="button"
              onClick={onOpenDriveHub}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Open Google Drive Hub"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span>Drive</span>
            </button>

            {/* Contacts Hub */}
            <button
              type="button"
              onClick={onOpenContactsHub}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Open Google Contacts Hub"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Contacts</span>
            </button>

            {/* User status or Sign In */}
            {currentUser ? (
              <div className="pl-2 border-l border-slate-800 flex items-center gap-2">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-6 h-6 rounded-full border border-cyan-400"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-cyan-300 flex items-center justify-center text-[10px]">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
                <span className="text-[11px] font-mono text-emerald-400 font-semibold hidden lg:inline">
                  Google Linked
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onGoogleSignIn}
                className="ml-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>Sign in</span>
              </button>
            )}
          </div>

          {/* Desktop Right CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenContact}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500 rounded-xl transition-all flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
              <span>Contact</span>
            </button>

            <button
              type="button"
              onClick={onOpenBlueprint}
              className="relative px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Blueprint</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onOpenGmailHub}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30"
              title="Gmail"
            >
              <Mail className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('bootcamp')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Bootcamp</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#090d16]/98 backdrop-blur-2xl border-b border-white/10 px-5 py-6 shadow-2xl transition-all max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`text-left px-4 py-2.5 rounded-xl font-medium ${
                currentPage === 'home' ? 'bg-indigo-600/20 text-cyan-300' : 'text-slate-300'
              }`}
            >
              Home &amp; Solutions
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', '#showcase')}
              className="text-left px-4 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-white/5"
            >
              Interactive App Showcase
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', '#process')}
              className="text-left px-4 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-white/5"
            >
              Delivery Timeline
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', '#pricing')}
              className="text-left px-4 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-white/5"
            >
              Pricing (from Rs. 19,999)
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('bootcamp')}
              className="text-left px-4 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>No-Code Automation Bootcamp</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.2 rounded bg-cyan-400/20 text-cyan-300">
                LIVE
              </span>
            </button>

            {/* Google Workspace Apps Row in Drawer */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 font-bold">
                Google Workspace Tools
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGmailHub();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-1 hover:border-rose-500/50"
                >
                  <Mail className="w-4 h-4 text-rose-400" />
                  <span className="text-[11px] font-semibold text-slate-200">Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenClassroomHub();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-1 hover:border-emerald-500/50"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-semibold text-slate-200">Classroom</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTasksHub();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-1 hover:border-cyan-500/50"
                >
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-semibold text-slate-200">Tasks</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDriveHub();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-1 hover:border-amber-500/50"
                >
                  <HardDrive className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-semibold text-slate-200">Drive</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenContactsHub();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-1 hover:border-blue-500/50"
                >
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-[11px] font-semibold text-slate-200">Contacts</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBlueprint();
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center gap-2 text-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Get Free AI App Blueprint</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-slate-300 border border-slate-700 flex items-center justify-center gap-2 text-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
                <span>Contact Engineering</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

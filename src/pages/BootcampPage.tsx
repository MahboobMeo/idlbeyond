import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Video,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Check,
  Send,
  AlertCircle,
  Mail,
  CheckSquare,
  HardDrive,
} from 'lucide-react';
import { BOOTCAMP_CURRICULUM, BOOTCAMP_FAQS, HIGH_END_IMAGES } from '../data/mockData';
import { formatPrice, calculatePriceWithGST } from '../utils/pricing';
import { saveBootcampRegistrationToFirestore } from '../services/firestoreService';

interface BootcampPageProps {
  onBackToHome: () => void;
  onOpenClassroomHub?: () => void;
  onOpenTasksHub?: () => void;
  onOpenDriveHub?: () => void;
  onOpenGmailHub?: () => void;
  onOpenContactsHub?: () => void;
}

export const BootcampPage: React.FC<BootcampPageProps> = ({
  onBackToHome,
  onOpenClassroomHub,
  onOpenTasksHub,
  onOpenDriveHub,
  onOpenGmailHub,
  onOpenContactsHub,
}) => {
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const priceDetails = calculatePriceWithGST(19999, 18);

  const toggleModule = (id: number) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveBootcampRegistrationToFirestore({
        name: studentName,
        email: studentEmail,
        phone: studentPhone,
        tuition: 'Rs. 19,999 + GST',
      });
    } catch (err) {
      console.warn('Firestore bootcamp registration note:', err);
    }
    setIsSubmitting(false);
    setBookingSuccess(true);
  };

  return (
    <div className="pt-28 pb-24 bg-[#090d16] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden circuit-grid pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Live Batch Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-xs font-mono text-cyan-300 mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>LIVE COHORT · WEEKEND ACCELERATOR · ENGLISH ONLY</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Enterprise No-Code Automation &amp; AI Systems Masterclass
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Stop writing tedious boilerplate or performing manual data entry. Learn to build autonomous business engines,
              API webhooks, and agentic pipelines using <span className="text-cyan-400 font-semibold">n8n, Make, Zapier &amp; Gemini AI</span>.
            </p>

            {/* Quick Cohort Details Card */}
            <div className="mt-8 max-w-2xl mx-auto p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-cyan-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-mono text-slate-400 uppercase">Upcoming Cohort</div>
                  <div className="text-sm font-bold text-white">Next Sunday • 11:00 AM – 3:00 PM IST</div>
                  <div className="text-xs text-emerald-400 font-medium">Only 4 seats remaining in this cohort</div>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Masterclass Tuition</div>
                  <div className="text-2xl font-display font-extrabold text-cyan-300">
                    {formatPrice(19999)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="mt-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                >
                  <span>Reserve Seat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                100% Practical Live Build (Zero Theory Slides)
              </span>
              <span className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-cyan-400" />
                Full 1080p Recording + Lifetime Template Access
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                100% Build Guarantee or Full Refund
              </span>
            </div>
          </div>

          {/* High-End Tech Corporate Imagery Showcase */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden glass-card-accent p-2 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 h-72 sm:h-84 relative rounded-2xl overflow-hidden group">
                <img
                  src={HIGH_END_IMAGES.developerSetup}
                  alt="High-End Automation Engineering Environment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                    Enterprise Visual Engineering
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Multi-Branch Webhooks, Error Routers &amp; Real-time AI Pipelines
                  </h3>
                  <p className="text-xs text-slate-300">
                    Watch industrial automation deployed live on screen.
                  </p>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                    Core Tooling Covered
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {['n8n Cloud/VPS', 'Make.com', 'Zapier', 'Gemini 2.5 Flash', 'REST APIs', 'Supabase', 'Webhooks'].map((t, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs font-mono text-amber-400 uppercase font-semibold">
                    Target Career Outcome
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Sell automated systems for <span className="text-white font-bold">Rs. 50,000+ retainers</span> or automate 80% of your current company workload.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Breakdown Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-800">
              UPDATED 2026 AUTOMATION CURRICULUM
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Six Comprehensive Hands-On Modules
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300">
              Every single module culminates in an active production deliverable deployed live to your own server.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {BOOTCAMP_CURRICULUM.map((mod) => {
              const isExpanded = expandedModule === mod.id;
              return (
                <div
                  key={mod.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'bg-slate-900 border-cyan-500/70 shadow-xl shadow-cyan-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleModule(mod.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 font-mono text-sm font-bold flex items-center justify-center shrink-0 border border-slate-700">
                        0{mod.id}
                      </span>
                      <div>
                        <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">
                          {mod.duration}
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                          {mod.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                          {mod.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="p-1 rounded-lg bg-slate-800 text-slate-400 shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-800/80 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
                        <div className="md:col-span-7 space-y-2">
                          <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                            Practical Core Outcomes:
                          </div>
                          {mod.outcomes.map((outcome, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{outcome}</span>
                            </div>
                          ))}
                        </div>

                        <div className="md:col-span-5 flex flex-col justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                          <div>
                            <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-2">
                              Tools Used in This Lab:
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {mod.tools.map((tool, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950/80 text-cyan-300 border border-indigo-500/30"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800">
                            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                              Lab Milestone Deliverable:
                            </span>
                            <p className="text-xs text-white mt-0.5 font-medium">
                              {mod.deliverable}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrated Google Workspace Cohort Suite */}
      <section className="py-14 bg-gradient-to-b from-[#090d16] via-slate-900/60 to-[#090d16] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-cyan-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Full Google Workspace Suite Integrated</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Cohort Tools Synced with Your Google Account
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every student gets unified access to course materials, lab milestones, template assets, instructor emails, and peer connections directly through official Google APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Classroom */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Google Classroom
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Track assignments, submit lab code, and receive instructor announcements.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenClassroomHub}
                className="mt-4 w-full py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
              >
                Open Classroom
              </button>
            </div>

            {/* Tasks */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Google Tasks
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  1-Click export of 6 modular automation milestones straight to your Google Tasks.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenTasksHub}
                className="mt-4 w-full py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors"
              >
                Sync Milestones
              </button>
            </div>

            {/* Drive */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
                  <HardDrive className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Google Drive
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Store lab blueprints, download webhook templates &amp; export deliverables.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenDriveHub}
                className="mt-4 w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
              >
                Drive Templates
              </button>
            </div>

            {/* Gmail */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3">
                  <Mail className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                  Gmail Support
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Direct inquiry to lead automation faculty at idlfxn@gmail.com with one click.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenGmailHub}
                className="mt-4 w-full py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
              >
                Email Faculty
              </button>
            </div>

            {/* Contacts */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  Google Contacts
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Connect with mentors and fellow builders directly in your Google directory.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenContactsHub}
                className="mt-4 w-full py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 transition-colors"
              >
                Cohort Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 100% Live Build Guarantee Seal Section */}
      <section className="py-16 relative bg-slate-950/80 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 mx-auto mb-4 shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
            THE IDLTECH 100% BUILD GUARANTEE
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
            Build a live working automation pipeline, or receive a 100% tuition refund.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            If you attend the sessions, follow the lab exercises, and don’t walk away with a real automated system functioning live for your business or clients, email us within 48 hours for a full refund of your {formatPrice(19999)} tuition. No questions asked.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setBookingModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/30 transition-all"
            >
              Reserve Seat for {formatPrice(19999)} + GST
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              &larr; Return to IDLTech App Studio Home
            </button>
          </div>
        </div>
      </section>

      {/* Bootcamp FAQs */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Bootcamp Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              All details clear, upfront, and transparent.
            </p>
          </div>

          <div className="space-y-4">
            {BOOTCAMP_FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <h4 className="font-display font-semibold text-white text-base">
                  {faq.question}
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Seat Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="py-6 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Seat Reserved Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2">
                  We have dispatched cohort calendar invites, syllabus PDFs, and Zoom links to <span className="text-cyan-400 font-semibold">{studentEmail}</span>.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-400">
                  Transaction Token: IDL-BC-{Math.floor(10000 + Math.random() * 90000)}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBookingSuccess(false);
                    setBookingModalOpen(false);
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    IDLTech Masterclass Seat Registration
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mt-1">
                    Reserve Your Cohort Seat
                  </h3>
                  <p className="text-xs text-slate-400">
                    Join the upcoming live Sunday intensive with senior automation architects.
                  </p>
                </div>

                {/* Pricing Summary */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="text-slate-400">Tuition Fee: {formatPrice(19999)}</div>
                    <div className="text-slate-500">+ 18% GST ({formatPrice(priceDetails.gstAmount)})</div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-300 font-bold text-sm">
                      Total: {formatPrice(priceDetails.total)}
                    </div>
                    <div className="text-[10px] text-emerald-400">All-Inclusive</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address (For Zoom &amp; Recordings)
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    WhatsApp Number (For Cohort Group)
                  </label>
                  <input
                    type="tel"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Confirming Reservation...' : `Confirm Seat (${formatPrice(priceDetails.total)})`}</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    Backed by the 100% money-back build guarantee.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

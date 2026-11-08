import React, { useState } from 'react';
import { MessageSquare, PhoneCall, AlertTriangle, FileSpreadsheet, CheckCircle, Smartphone, ArrowRight, Zap, BellRing, Sparkles } from 'lucide-react';

export const ChaosVsOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'solution'>('comparison');

  return (
    <section id="solutions" className="py-24 relative overflow-hidden bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/60">
            The Digital Friction Problem
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Does your typical business day look anything like this?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            When you manage customers across random WhatsApp chats, phone calls, and manual spreadsheets, orders fall through the cracks.
          </p>
        </div>

        {/* Side-by-side comparison cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: Fragmented Business Day (The Chaos) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-rose-500/20 relative group hover:border-rose-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  FRAGMENTED CHANNELS
                </span>
                <span className="text-xs text-rose-300 font-medium">Without a Dedicated App</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white">
                Every customer arrives from a different direction.
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                You spend 4+ hours every day copying information between apps instead of serving customers.
              </p>

              <div className="mt-6 space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Unstructured WhatsApp Enquiries</p>
                    <p className="text-xs text-slate-400">"Is 4 PM open?", "Send menu photos", "What is the UPI ID?". You answer the exact same 5 questions 40 times a day.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3">
                  <PhoneCall className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Calls During Active Work Hours</p>
                    <p className="text-xs text-slate-400">You have to drop whatever you're doing to check handwritten registers or confirm bank account screenshots.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Manual Excel or Paper Record Keeping</p>
                    <p className="text-xs text-slate-400">Double bookings, forgotten customer orders, and zero automated retention when a client doesn't return.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="text-rose-400 font-medium">Result: Lost revenue &amp; chronic exhaustion</span>
              <span className="font-mono text-slate-500">Manual Overhead: High</span>
            </div>
          </div>

          {/* Right Column: IDLTech Unified Path (The Streamlined Order) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-900/90 border border-indigo-500/30 relative group hover:border-cyan-400/50 transition-all flex flex-col justify-between shadow-xl shadow-indigo-950/20">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  IDLTECH UNIFIED APP
                </span>
                <span className="text-xs text-emerald-400 font-semibold">Self-Operating Engine</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white">
                One customer. One simple path. Zero business-day juggling.
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Every useful action has one obvious home right on your customer's home screen.
              </p>

              <div className="mt-6 space-y-3">
                <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Self-Serve Digital Experience</p>
                    <p className="text-xs text-slate-300">Customers browse, choose their preferred slot or product, and pay in under 45 seconds on their own phone.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Automated UPI / Card Payment Lock</p>
                    <p className="text-xs text-slate-300">No fake screenshots. The app verifies receipt immediately and triggers your backend workflow.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-start gap-3">
                  <BellRing className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Instant WhatsApp &amp; Push Confirmations</p>
                    <p className="text-xs text-slate-300">Automated reminders sent 2 hours before appointments or delivery milestones. No-shows drop by 80%+.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-500/20 flex items-center justify-between text-xs text-slate-300">
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Delivered in 5-7 days from Rs. 19,999
              </span>
              <span className="font-mono text-emerald-400">100% Automated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

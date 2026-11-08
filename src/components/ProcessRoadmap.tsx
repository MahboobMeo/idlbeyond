import React, { useState } from 'react';
import { Compass, Eye, Hammer, Rocket, Check, ArrowRight } from 'lucide-react';

export const ProcessRoadmap: React.FC<{ onOpenContact: () => void }> = ({ onOpenContact }) => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      name: 'Map',
      tagline: 'Define & Blueprint',
      timeline: 'Day 1',
      icon: Compass,
      color: 'from-cyan-500 to-blue-500',
      description: 'You share your idea or business flow in everyday words. We map every screen, user state, database table, and external integration.',
      details: [
        'Detailed user journey diagram (Visitor -> Lead -> Customer)',
        'Database architecture and schema definition',
        'Payment gateway & WhatsApp API credential verification',
        'Fixed-price quote and locked delivery timeline',
      ],
    },
    {
      name: 'See',
      tagline: 'Visual Prototype Review',
      timeline: 'Days 2 - 3',
      icon: Eye,
      color: 'from-indigo-500 to-cyan-500',
      description: 'Before writing the production backend, we render high-fidelity interactive screens customized with your brand colors, logos, and typography.',
      details: [
        'Interactive prototype clickable directly on your smartphone',
        'Direct feedback loop for styling and UX adjustments',
        'Final sign-off on screen transitions and button actions',
        'No surprise layouts or mismatched expectations',
      ],
    },
    {
      name: 'Build',
      tagline: 'Native Engineering & Integrations',
      timeline: 'Days 3 - 6',
      icon: Hammer,
      color: 'from-purple-500 to-indigo-600',
      description: 'Our senior developers assemble native Android and iOS components, wire real-time cloud databases, configure UPI checkout, and set up automated push notifications.',
      details: [
        'Native performance with zero laggy webview wrappers',
        'Secure API authentication and encrypted user session tokens',
        'Webhook automation (instant WhatsApp messages & CRM sync)',
        'Admin dashboard for real-time inventory and booking control',
      ],
    },
    {
      name: 'Launch',
      tagline: 'Store Publishing & Go-Live',
      timeline: 'Day 7',
      icon: Rocket,
      color: 'from-emerald-500 to-teal-500',
      description: 'We generate production binaries, complete developer console listings, configure privacy policies, and submit to Google Play and Apple App Store.',
      details: [
        'Google Play Store AAB binary generation & compliance audit',
        'Apple App Store TestFlight and review preparation',
        'Full DNS and custom domain setup (e.g. idltech.idlmatch.com)',
        '30-day post-launch technical warranty begins',
      ],
    },
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-slate-950/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/70 px-3 py-1 rounded-full border border-indigo-800">
            THE 7-DAY DELIVERY ROADMAP
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            What happens after you say, <br className="hidden sm:inline" />
            <span className="text-cyan-400">“This is the app I need.”</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            A battle-tested 4-step framework that turns concepts into revenue-generating native applications in days.
          </p>
        </div>

        {/* 4 Interactive Stage Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isSelected = activeStage === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`p-4 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    STAGE 0{idx + 1}
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {stg.timeline}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${stg.color} flex items-center justify-center text-white shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-display font-bold text-base text-white">
                    {stg.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Breakdown Box */}
        {(() => {
          const current = stages[activeStage];
          const Icon = current.icon;
          return (
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 relative shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${current.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                        Stage 0{activeStage + 1} • {current.timeline}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                        {current.tagline}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-slate-300 text-base leading-relaxed">
                    {current.description}
                  </p>

                  <div className="mt-6 space-y-2.5">
                    {current.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onOpenContact}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 flex items-center gap-2"
                    >
                      <span>Start Your Map</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-slate-400">
                      Free initial blueprint with zero commitment
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold mb-3">
                    Stage Deliverable Checklist
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
                      <span>Status</span>
                      <span className="text-emerald-400 font-bold">Milestone Verified</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
                      <span>Code Ownership</span>
                      <span className="text-cyan-400 font-bold">100% Client Owned</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
                      <span>Communication</span>
                      <span className="text-white font-bold">WhatsApp + Email Sync</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
};

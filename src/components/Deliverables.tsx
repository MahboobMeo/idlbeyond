import React from 'react';
import { Compass, Smartphone, CheckCircle, ShieldAlert, UploadCloud, ArrowRight } from 'lucide-react';
import { HIGH_END_IMAGES } from '../data/mockData';

export const Deliverables: React.FC<{ onOpenContact: () => void }> = ({ onOpenContact }) => {
  const pillars = [
    {
      step: '01',
      title: 'Interactive Blueprint',
      tagline: 'See the complete system before building',
      description: 'We map out every single customer tap, database relation, API hook, and security rule in plain English.',
      icon: Compass,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      step: '02',
      title: 'High-Fidelity Screens',
      tagline: 'Tailored to your specific brand identity',
      description: 'No generic low-effort templates. Custom color schemes, typography, and responsive micro-interactions.',
      icon: Smartphone,
      color: 'from-indigo-500 to-cyan-500',
    },
    {
      step: '03',
      title: 'Dual Native Binaries',
      tagline: 'Android APK / AAB + iOS IPA',
      description: 'One cohesive codebase optimized for both major mobile ecosystems with native hardware speed.',
      icon: CheckCircle,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      step: '04',
      title: 'Stress-Tested Flows',
      tagline: 'End-to-end payment & edge-case validation',
      description: 'We test checkout failure handling, slow network dropouts, and multi-session concurrency before launch.',
      icon: ShieldAlert,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      step: '05',
      title: 'Store Submission Ready',
      tagline: 'Google Play & Apple App Store compliant',
      description: 'Privacy policies, store listing graphics, developer console setup, and review guidelines addressed.',
      icon: UploadCloud,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-800">
            PROVEN DELIVERABLES
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Your idea moves toward the stores — not into a forgotten folder.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Every step is visible, documented, and delivered on an agreed schedule. You are never left wondering what comes next.
          </p>
        </div>

        {/* 5 Deliverable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl p-6 bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                      {pillar.step}
                    </span>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center p-2 text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-300 mt-1 mb-2">
                    {pillar.tagline}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Guaranteed Deliverable</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Studio Craft Banner with Tech Imagery */}
        <div className="mt-12 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="md:col-span-7 p-6 sm:p-10">
            <span className="text-xs font-mono font-bold uppercase text-indigo-400">
              ENGINEERED BY IDLTECH
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
              No junior contractors. No outsourced surprises.
            </h3>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Our core engineering studio maintains dedicated quality control over every build.
              You get direct communication with the engineers building your software, backed by a 30-day bug-free warranty.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenContact}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 transition-all flex items-center gap-2"
              >
                <span>Discuss Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400 font-mono">
                Direct engineer consultation • Zero sales pressure
              </span>
            </div>
          </div>
          <div className="md:col-span-5 h-64 sm:h-full min-h-[220px] relative">
            <img
              src={HIGH_END_IMAGES.aiEngineeringStudio}
              alt="IDLTech High-End Engineering Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent md:block hidden" />
          </div>
        </div>
      </div>
    </section>
  );
};

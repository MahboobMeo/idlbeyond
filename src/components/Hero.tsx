import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers, Play, Clock, Code2 } from 'lucide-react';
import { formatPrice } from '../utils/pricing';
import { HIGH_END_IMAGES } from '../data/mockData';

interface HeroProps {
  onOpenBlueprint: (initialIdea?: string) => void;
  onOpenContact: () => void;
  onExploreBootcamp: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBlueprint,
  onOpenContact,
  onExploreBootcamp,
}) => {
  const [quickIdea, setQuickIdea] = useState('');

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBlueprint(quickIdea || 'Salon booking and commerce app');
  };

  const sampleIdeas = [
    'Salon & spa appointment booking app with UPI deposit',
    'D2C boutique store with 1-click checkout and live dispatch',
    'Automated n8n webhook pipeline syncing CRM, billing & WhatsApp',
    'Fitness coach membership app with protected video lessons',
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden circuit-grid">
      {/* Ambient background glow spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-indigo-600/25 via-cyan-500/20 to-purple-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-200">
              IDLTech Studio Rebrand • Hosted at <span className="text-cyan-400 font-mono">idltech.idlmatch.com</span>
            </span>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="hidden sm:inline-block text-xs font-medium text-indigo-300">
              Apps from {formatPrice(19999)}
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            We build your native mobile app &amp; automation pipeline for a{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              transparent fixed price.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Done-for-you Android &amp; iOS app development and high-throughput no-code automation systems.
            Shipped to Google Play &amp; Apple App Store in days, not months.
          </p>

          {/* Interactive Blueprint Generator Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form
              onSubmit={handleSubmitIdea}
              className="relative p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2 group focus-within:border-cyan-400/80 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all"
            >
              <div className="flex items-center gap-3 w-full px-3 py-2">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
                <input
                  type="text"
                  value={quickIdea}
                  onChange={(e) => setQuickIdea(e.target.value)}
                  placeholder="Describe your app idea (e.g., Salon booking or D2C store)..."
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-indigo-600/30 active:scale-95 shrink-0"
              >
                <span>Get Free Blueprint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
              <span className="text-slate-500">Try asking for:</span>
              {sampleIdeas.slice(0, 2).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuickIdea(item);
                    onOpenBlueprint(item);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-left truncate max-w-[280px]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Trust Badges */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Starts at {formatPrice(19999)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>5 - 7 Day Turnaround</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>100% App Ownership</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Play Store &amp; iOS Ready</span>
            </div>
          </div>
        </div>

        {/* Corporate Tech Hero Visual Showcase */}
        <div className="mt-16 max-w-5xl mx-auto relative">
          <div className="relative rounded-3xl overflow-hidden glass-card-accent p-2 sm:p-4 shadow-2xl">
            {/* Top window chrome */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 mb-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-400">IDLTech Architecture Studio</span>
              </div>
              <span className="text-cyan-400 hidden sm:inline">status: production_live</span>
            </div>

            {/* Grid of high-end imagery and live metrics */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left visual: High-end tech office & mobile mockups */}
              <div className="md:col-span-7 relative rounded-2xl overflow-hidden h-72 sm:h-80 group">
                <img
                  src={HIGH_END_IMAGES.heroWorkspace}
                  alt="IDLTech High-End Studio Engineering"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      IDLTech Studio
                    </span>
                    <h3 className="font-display font-bold text-white text-lg mt-1">
                      Enterprise-Grade Native Code &amp; Visual Logic
                    </h3>
                    <p className="text-xs text-slate-300">
                      Zero technical overhead for your business.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={onOpenContact}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
                    >
                      View Live Build
                    </button>
                  </div>
                </div>
              </div>

              {/* Right panel: Active live deliverables tracker */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono text-cyan-400">PHASE 01 : BLUEPRINT</span>
                    <span className="text-emerald-400 font-semibold">Done in 10 mins</span>
                  </div>
                  <p className="text-sm font-semibold text-white">Full Screen Architecture &amp; Database Map</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Structured user journeys, API contract, and store compliance.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono text-indigo-400">PHASE 02 : APP BUILD</span>
                    <span className="text-amber-400 font-semibold">5-7 Days</span>
                  </div>
                  <p className="text-sm font-semibold text-white">Native Android &amp; iOS Binaries</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Integrated UPI payments, real-time push, and WhatsApp triggers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                      No-Code Automation Masterclass
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Want to build internal tools yourself?
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onExploreBootcamp}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

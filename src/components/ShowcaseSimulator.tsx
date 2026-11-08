import React, { useState } from 'react';
import { SHOWCASE_APPS } from '../data/mockData';
import { Smartphone, CheckCircle2, ArrowRight, ShieldCheck, Star, Wifi, Battery, Clock, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/pricing';

interface ShowcaseSimulatorProps {
  onSelectCategory: (categoryTitle: string) => void;
}

export const ShowcaseSimulator: React.FC<ShowcaseSimulatorProps> = ({ onSelectCategory }) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(SHOWCASE_APPS[0].id);
  const [currentScreenIndex, setCurrentScreenIndex] = useState<number>(0);
  const [interactiveState, setInteractiveState] = useState<string>('idle');

  const currentApp = SHOWCASE_APPS.find((app) => app.id === selectedAppId) || SHOWCASE_APPS[0];

  const handleTabChange = (appId: string) => {
    setSelectedAppId(appId);
    setCurrentScreenIndex(0);
    setInteractiveState('idle');
  };

  const handleSimulateClick = () => {
    setInteractiveState('processing');
    setTimeout(() => {
      setInteractiveState('success');
      if (currentApp.mockupScreens.length > 1) {
        setCurrentScreenIndex((prev) => (prev + 1) % currentApp.mockupScreens.length);
      }
    }, 400);
  };

  return (
    <section id="showcase" className="py-24 relative overflow-hidden bg-slate-950/70 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-400 border border-cyan-800 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            INTERACTIVE DEMO STUDIO
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Choose your business. See the app in action.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Real customer user journeys designed to eliminate human bottlenecks and convert visitors into paying clients.
          </p>

          {/* Business Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {SHOWCASE_APPS.map((app) => {
              const isActive = app.id === selectedAppId;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => handleTabChange(app.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30 scale-105'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{app.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Phone & Feature Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Info Breakdown (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-block">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800">
                {currentApp.category} Case Study
              </span>
            </div>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              {currentApp.tagline}
            </h3>
            <p className="mt-4 text-slate-300 text-base leading-relaxed">
              {currentApp.description}
            </p>

            {/* Performance Metrics */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {currentApp.metrics.map((metric, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-cyan-400">
                    {metric.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Checklist */}
            <div className="mt-8 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Standard Inclusions In This App Flow:
              </div>
              {currentApp.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA bar */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => onSelectCategory(currentApp.title)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Build Similar App ({formatPrice(19999)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400">
                Shipped to Android &amp; iOS in 5-7 business days
              </span>
            </div>
          </div>

          {/* Right / Interactive Phone Shell (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
              {/* Outer phone frame */}
              <div className="relative rounded-[44px] bg-slate-900 p-3.5 shadow-2xl shadow-indigo-950/60 border-4 border-slate-700/80">
                {/* Hardware notch / speaker pill */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-800 rounded-full" />
                  <div className="w-2 h-2 ml-2 rounded-full bg-slate-800" />
                </div>

                {/* Inner phone screen */}
                <div className="relative rounded-[32px] overflow-hidden bg-slate-950 min-h-[520px] flex flex-col justify-between border border-slate-800 p-4 pt-7 text-white font-sans">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-4 px-1">
                    <span>9:41 AM</span>
                    <div className="flex items-center gap-1.5">
                      <Wifi className="w-3 h-3 text-slate-300" />
                      <Battery className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>

                  {/* App Brand Header inside screen */}
                  <div className="border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                          {currentApp.category}
                        </div>
                        <h4 className="font-display font-bold text-white text-base">
                          {currentApp.title}
                        </h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Live Demo
                      </span>
                    </div>
                  </div>

                  {/* Active Screen Content */}
                  <div className="flex-1 flex flex-col justify-between py-2">
                    {(() => {
                      const screen =
                        currentApp.mockupScreens[currentScreenIndex] || currentApp.mockupScreens[0];
                      return (
                        <div className="space-y-3 animate-fade-in">
                          <div className="text-xs text-slate-400 font-medium">
                            {screen.title}
                          </div>

                          {screen.elements.map((el, i) => {
                            if (el.type === 'header') {
                              return (
                                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                  <div className="text-sm font-bold text-white">{el.text}</div>
                                  {el.subtext && (
                                    <div className="text-[11px] text-slate-400 mt-0.5">{el.subtext}</div>
                                  )}
                                </div>
                              );
                            }
                            if (el.type === 'stat') {
                              return (
                                <div key={i} className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                                  <div>
                                    <div className="text-base font-extrabold text-cyan-300">{el.text}</div>
                                    <div className="text-[10px] text-slate-300">{el.subtext}</div>
                                  </div>
                                  <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                                    Instant UPI
                                  </span>
                                </div>
                              );
                            }
                            if (el.type === 'badge') {
                              return (
                                <div key={i} className="inline-block px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                                  ★ {el.text}
                                </div>
                              );
                            }
                            if (el.type === 'list') {
                              return (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span>{el.text}</span>
                                </div>
                              );
                            }
                            if (el.type === 'button') {
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={handleSimulateClick}
                                  className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 active:scale-95 transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                                >
                                  {interactiveState === 'processing' ? (
                                    <span>Processing UPI Payment...</span>
                                  ) : (
                                    <span>{el.text}</span>
                                  )}
                                </button>
                              );
                            }
                            return null;
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Simulator Bottom Controls */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      Screen {currentScreenIndex + 1} of {currentApp.mockupScreens.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentScreenIndex(
                          (prev) => (prev + 1) % currentApp.mockupScreens.length
                        )
                      }
                      className="text-cyan-400 hover:underline font-medium"
                    >
                      Next Screen &rarr;
                    </button>
                  </div>

                  {/* Phone Home Indicator Bar */}
                  <div className="mt-2 w-28 h-1 bg-slate-700 rounded-full mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

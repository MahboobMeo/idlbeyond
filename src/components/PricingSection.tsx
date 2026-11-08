import React, { useState } from 'react';
import { PRICING_PLANS } from '../data/mockData';
import { PricingPlan } from '../types';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { calculatePriceWithGST } from '../utils/pricing';

interface PricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [includeGSTView, setIncludeGSTView] = useState(false);

  const decisions = [
    {
      question: '“I am not technical.”',
      answer: 'You do not need to write a single line of code or know what an API is. We guide you through everything in plain English.',
    },
    {
      question: '“My business is still small.”',
      answer: `Our Launch Tier is engineered specifically for lean businesses at a fixed ${PRICING_PLANS[0].priceFormatted}. Start focused, get paying customers, then expand.`,
    },
    {
      question: '“What if I dislike the direction?”',
      answer: 'You inspect and approve the interactive clickable prototype during Stage 2 before the final production code is built.',
    },
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-slate-950/70 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-800">
            TRANSPARENT FIXED TIERS
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Simple, fixed pricing. No runaway hourly billing.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Know exactly what you will invest before we begin. Full IP ownership and store submission readiness included.
          </p>

          {/* Tax Toggle */}
          <div className="mt-6 inline-flex items-center gap-3 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setIncludeGSTView(false)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                !includeGSTView ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Base Price (excl. GST)
            </button>
            <button
              type="button"
              onClick={() => setIncludeGSTView(true)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                includeGSTView ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              With 18% GST Breakdown
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const tax = calculatePriceWithGST(plan.price);
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-950/60 via-slate-900/90 to-slate-900/90 border-2 border-cyan-400/80 shadow-2xl shadow-indigo-950/50 scale-105 z-10'
                    : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Most Popular Tier</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-bold text-white">
                      {plan.name}
                    </h3>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                      {plan.timeline}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 min-h-[36px]">
                    {plan.tagline}
                  </p>

                  {/* Price Block (Strictly Rs.) */}
                  <div className="mt-6 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl sm:text-5xl font-bold text-white">
                        {includeGSTView ? `Rs. ${tax.total.toLocaleString('en-IN')}` : plan.priceFormatted}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {includeGSTView ? 'total with GST' : 'one-time'}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      {includeGSTView ? (
                        <span className="text-cyan-400 font-mono">
                          Base {plan.priceFormatted} + 18% GST (Rs. {tax.gstAmount.toLocaleString('en-IN')})
                        </span>
                      ) : (
                        <span>{plan.gstNote}</span>
                      )}
                    </p>

                    <div className="mt-3 text-xs text-indigo-300 font-medium">
                      Ideal for: {plan.idealFor}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mt-6 space-y-3">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Everything Included:
                    </div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA button */}
                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan)}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Includes 30-day bug warranty &amp; full IP transfer
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decision Path Section ("See it. Understand it. Then decide.") */}
        <div className="mt-20 pt-16 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase text-indigo-400">
              FIRST DECISION PATH
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
              See it. Understand it. Then decide.
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Addressing common questions before you invest a single rupee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {decisions.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <HelpCircle className="w-4 h-4" />
                  <h4 className="font-display font-bold text-base text-white">
                    {item.question}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

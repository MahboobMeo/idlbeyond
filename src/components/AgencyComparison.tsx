import React from 'react';
import { Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/pricing';

export const AgencyComparison: React.FC = () => {
  const criteria = [
    {
      feature: 'Delivery Timeline',
      idltech: '5 - 7 Business Days',
      agency: '3 to 6 Months',
      diy: 'Endless weekends & tutorials',
    },
    {
      feature: 'Pricing Model',
      idltech: `Fixed from ${formatPrice(19999)}`,
      agency: 'Rs. 1,50,000+ (plus hourly billing)',
      diy: 'Rs. 2,500/mo + plugin fees forever',
    },
    {
      feature: 'Your Time & Effort',
      idltech: 'Done-for-you (you share requirements)',
      agency: 'High (weekly steering meetings)',
      diy: '100% on you (you build everything)',
    },
    {
      feature: 'Platforms Supported',
      idltech: 'Native Android + iOS binaries',
      agency: 'Separate bill for each OS',
      diy: 'Usually web-only responsive wrapper',
    },
    {
      feature: 'Payment & UPI Integration',
      idltech: 'Included natively in baseline tier',
      agency: 'Custom billing add-on',
      diy: 'Requires complex webhooks & keys',
    },
    {
      feature: 'Code & IP Ownership',
      idltech: '100% Yours (no proprietary lock-in)',
      agency: 'Often held as collateral for retainer',
      diy: 'Tied to SaaS platform database',
    },
    {
      feature: 'Maintenance & Care Plans',
      idltech: 'Transparent from Rs. 1,499/mo',
      agency: 'Rs. 25,000/mo minimum retainer',
      diy: 'You troubleshoot broken plugins alone',
    },
  ];

  return (
    <section id="comparison" className="py-24 relative overflow-hidden bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-800">
            THE TIMELINE SHOULD LOOK DIFFERENT
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            IDLTech vs. a traditional agency vs. doing it yourself
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Why growing companies choose IDLTech over sluggish corporate agencies and fragile no-code DIY attempts.
          </p>
        </div>

        {/* Responsive Comparison Table Container */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[760px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/70 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-5 text-sm font-semibold text-slate-400 w-1/4">
                    Comparison Criteria
                  </th>
                  <th className="p-5 text-sm font-bold text-white bg-indigo-950/60 border-x border-indigo-500/30 w-1/3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>IDLTech Studio</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300">
                        RECOMMENDED
                      </span>
                    </div>
                  </th>
                  <th className="p-5 text-sm font-semibold text-slate-400 w-1/5">
                    Traditional Agency
                  </th>
                  <th className="p-5 text-sm font-semibold text-slate-400 w-1/5">
                    DIY No-Code Tools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {criteria.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-5 font-medium text-slate-300">
                      {row.feature}
                    </td>

                    {/* IDLTech Column (Highlighted) */}
                    <td className="p-5 font-semibold text-cyan-300 bg-indigo-950/40 border-x border-indigo-500/30">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{row.idltech}</span>
                      </div>
                    </td>

                    {/* Traditional Agency */}
                    <td className="p-5 text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 font-bold shrink-0">✕</span>
                        <span>{row.agency}</span>
                      </div>
                    </td>

                    {/* DIY */}
                    <td className="p-5 text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold shrink-0">✕</span>
                        <span>{row.diy}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Small reassurance strip */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              All IDLTech projects include a written scope, locked pricing agreement, and zero surprise fees.
            </span>
          </div>
          <span className="font-mono text-cyan-400">
            Rebranded for idltech.idlmatch.com
          </span>
        </div>
      </div>
    </section>
  );
};

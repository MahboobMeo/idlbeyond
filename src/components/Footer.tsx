import React from 'react';
import { Cpu, Mail, Phone, MapPin, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate: (page: PageView, hash?: string) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContact }) => {
  return (
    <footer className="bg-[#060910] border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-display text-xl font-bold text-white tracking-tight">
                IDLTech
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier AI-powered mobile app development studio and no-code automation agency.
              We build, test, and ship production-ready Android &amp; iOS applications and automated pipelines at transparent fixed prices.
            </p>

            <div className="pt-2 text-xs font-mono text-cyan-400">
              Official Hub: <span className="text-white">idltech.idlmatch.com</span>
            </div>
          </div>

          {/* Quick Nav (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Services &amp; Solutions
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', '#solutions')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Done-for-You Mobile Apps (from Rs. 19,999)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', '#showcase')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Interactive Industry Showcase
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('bootcamp')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-cyan-300 font-medium"
                >
                  <span>No-Code Automation Masterclass</span>
                  <span className="text-[10px] bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                    LIVE
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', '#process')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  7-Day Delivery Timeline
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', '#pricing')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Transparent Fixed Tiers
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Studio Communication
            </div>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href="mailto:contact@idltech.idlmatch.com"
                  className="hover:text-cyan-300 transition-colors font-mono"
                >
                  contact@idltech.idlmatch.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 84486 47644 (Call / WhatsApp)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Greater Noida West, Delhi-NCR / Global Remote</span>
              </li>
            </ul>
          </div>

          {/* Trust Pillar (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              IDLTech Guarantee
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% IP Ownership</span>
              </div>
              <p className="text-[11px] text-slate-400">
                You own all source assets, database records, and store accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} IDLTech Inc. All rights reserved. Rebranded for{' '}
            <span className="text-cyan-400 font-mono">idltech.idlmatch.com</span>.
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={onOpenContact} className="hover:text-slate-300">
              Privacy Policy
            </button>
            <span>•</span>
            <button type="button" onClick={onOpenContact} className="hover:text-slate-300">
              Terms of Service
            </button>
            <span>•</span>
            <button type="button" onClick={onOpenContact} className="hover:text-slate-300">
              Security
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

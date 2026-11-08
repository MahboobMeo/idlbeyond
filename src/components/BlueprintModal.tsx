import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Mail, Phone, Send } from 'lucide-react';
import { generateQuickBlueprint, formatPrice } from '../utils/pricing';

interface BlueprintModalProps {
  initialIdea: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenContactWithDetails: (details: string) => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  initialIdea,
  isOpen,
  onClose,
  onOpenContactWithDetails,
}) => {
  const [ideaText, setIdeaText] = useState(initialIdea || 'Custom appointment booking & store app');
  const [activeTab, setActiveTab] = useState<'blueprint' | 'request'>('blueprint');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isRequested, setIsRequested] = useState(false);

  if (!isOpen) return null;

  const blueprint = generateQuickBlueprint(ideaText);

  const handleSendToEngineering = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequested(true);
    setTimeout(() => {
      onOpenContactWithDetails(`Blueprint Concept: ${blueprint.category}\nInput: ${ideaText}\nClient: ${contactEmail} / ${contactPhone}`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            IDLTech AI Blueprint Engine
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold text-white">
          System Blueprint: {blueprint.category}
        </h3>

        {/* Idea prompt re-editor */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder="Type your idea to regenerate blueprint..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded shrink-0">
            Live Analysis
          </span>
        </div>

        {/* Blueprint Specifications */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Estimated Build</div>
              <div className="text-sm font-bold text-white mt-0.5">{blueprint.timeline}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Fixed Tier</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">{formatPrice(blueprint.basePrice)}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Platforms</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">Android + iOS</div>
            </div>
          </div>

          {/* Recommended Tech Stack */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
              Recommended Production Stack:
            </div>
            <div className="flex flex-wrap gap-2">
              {blueprint.recommendedStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Core Feature Matrix */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
              Planned Capabilities:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {blueprint.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Send to Engineering */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          {isRequested ? (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center animate-fade-in">
              <Check className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">Blueprint Sent to IDLTech Engineering</p>
              <p className="text-xs text-slate-300 mt-1">
                Routing details to contact@idltech.idlmatch.com...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendToEngineering} className="space-y-3">
              <div className="text-xs text-slate-300 font-medium">
                Want this full architecture document sent to your inbox?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="WhatsApp / Phone Number"
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Receive Full Architecture &amp; Quote (Free)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

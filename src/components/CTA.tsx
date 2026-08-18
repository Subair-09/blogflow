import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { subscribeEmailToMongo } from '../lib/api';

interface CTAProps {
  onStartWriting: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onStartWriting }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await subscribeEmailToMongo(email.trim(), 'cta-section');
      setSubscribed(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
      });
      setTimeout(() => {
        onStartWriting();
      }, 1200);
    }
  };

  return (
    <section
      id="writer-cta"
      className="py-20 md:py-28 bg-[#faf9f6] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-950 p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-2xl border border-slate-800">
          {/* Ambient Lighting Circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-stone-800/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-950/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            {/* Tag */}
            <div
              id="cta-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-indigo-300 text-xs font-semibold uppercase tracking-widest text-[11px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Join the Future of Publishing</span>
            </div>

            {/* Headline */}
            <h2
              id="cta-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-white leading-tight"
            >
              Ready to Share Your{' '}
              <span className="italic underline decoration-stone-400 decoration-1 underline-offset-8">
                Ideas
              </span>
              ?
            </h2>

            {/* Subheadline */}
            <p
              id="cta-subheading"
              className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal font-sans"
            >
              Join thousands of writers creating meaningful content with BlogFlow.
              Launch your publication in less than 60 seconds.
            </p>

            {/* Interactive Email/Action Form */}
            {subscribed ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl max-w-md mx-auto text-emerald-300 flex items-center justify-center gap-2 text-sm font-semibold animate-in fade-in font-sans">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Subscribed in MongoDB! Launching your creator space...</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-md mx-auto pt-2"
              >
                <input
                  id="cta-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email..."
                  className="px-4.5 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-400 focus:border-transparent shadow-inner flex-1 font-sans"
                />
                <button
                  id="cta-start-writing-btn"
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-slate-950 text-sm font-semibold px-6 py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap font-sans"
                >
                  <span>Start Writing Today</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </form>
            )}

            {/* Trust Bullets */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400 font-sans">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>MongoDB Stored</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Enterprise Security</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant setup</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


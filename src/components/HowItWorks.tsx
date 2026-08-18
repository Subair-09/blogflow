import React, { useState } from 'react';
import {
  Edit3,
  Send,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Share2,
  Globe2,
  BarChart2,
  Terminal,
} from 'lucide-react';
import { HOW_IT_WORKS_DATA } from '../data/mockData';

interface HowItWorksProps {
  onStartWriting: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartWriting }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Edit3':
        return <Edit3 className="w-5 h-5 text-indigo-600" />;
      case 'Send':
        return <Send className="w-5 h-5 text-violet-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 bg-white relative overflow-hidden border-b border-stone-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div
            id="how-it-works-tag"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-slate-800 text-xs font-semibold uppercase tracking-widest text-[11px] shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Effortless 3-Step Workflow</span>
          </div>

          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-slate-900 tracking-tight"
          >
            How BlogFlow Works
          </h2>

          <p
            id="how-it-works-subheading"
            className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          >
            From drafting your first paragraph to reaching tens of thousands of subscribers,
            we removed all publishing friction.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {HOW_IT_WORKS_DATA.map((step, idx) => (
            <div
              key={step.number}
              id={`step-card-${step.number}`}
              onClick={() => setActiveStepIndex(idx)}
              className={`rounded-2xl p-8 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative ${
                activeStepIndex === idx
                  ? 'bg-slate-950 text-white border-slate-800 shadow-xl ring-1 ring-slate-700'
                  : 'bg-[#faf9f6] hover:bg-white text-slate-900 border-stone-200 hover:shadow-md'
              }`}
            >
              <div>
                {/* Step Top Header: Step Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`text-3xl font-serif font-bold tracking-wider ${
                      activeStepIndex === idx ? 'text-indigo-300' : 'text-stone-400'
                    }`}
                  >
                    {step.number}
                  </span>

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      activeStepIndex === idx
                        ? 'bg-white/10 text-indigo-300'
                        : 'bg-white text-slate-700 shadow-2xs border border-stone-200'
                    }`}
                  >
                    {getStepIcon(step.iconName)}
                  </div>
                </div>

                {/* Step Title */}
                <h3
                  className={`text-2xl font-serif font-bold mb-3 ${
                    activeStepIndex === idx ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {step.title}
                </h3>

                {/* Step Short Description */}
                <p
                  className={`text-base font-medium mb-4 ${
                    activeStepIndex === idx ? 'text-indigo-200' : 'text-slate-700'
                  }`}
                >
                  {step.description}
                </p>

                {/* Step Detail Explanation */}
                <p
                  className={`text-sm leading-relaxed font-sans ${
                    activeStepIndex === idx ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {step.detail}
                </p>
              </div>

              {/* Step Interactive Visual Widget */}
              <div className="mt-8 pt-6 border-t border-stone-200/40 dark:border-slate-800">
                {idx === 0 && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-mono flex flex-col gap-2 ${
                      activeStepIndex === idx ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-white text-slate-600 border border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Terminal className="w-3 h-3 text-indigo-400" />
                      <span>Markdown + AI Autocomplete</span>
                    </div>
                    <div className="font-semibold text-indigo-400"># Next-Gen Frontend Systems</div>
                    <div className="text-[11px] opacity-80">&gt; Live auto-save synced to cloud</div>
                  </div>
                )}

                {idx === 1 && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex flex-col gap-2 ${
                      activeStepIndex === idx ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-white text-slate-600 border border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1">
                        <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Edge Global CDN</span>
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">Latency: 18ms</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] opacity-85">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>OpenGraph & RSS Feed generated</span>
                    </div>
                  </div>
                )}

                {idx === 2 && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex flex-col gap-2 ${
                      activeStepIndex === idx ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-white text-slate-600 border border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1">
                        <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Audience Growth</span>
                      </span>
                      <span className="text-indigo-400 font-bold font-mono">+38% Retention</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-400 to-emerald-400 h-full w-4/5 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onStartWriting}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-indigo-600 bg-stone-100 hover:bg-stone-200/80 px-6 py-3 rounded-xl transition-colors cursor-pointer border border-stone-200 font-sans"
          >
            <span>Experience the Live Editor Experience</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

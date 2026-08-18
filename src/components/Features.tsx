import React, { useState } from 'react';
import {
  PenTool,
  Zap,
  MessageSquare,
  Search,
  BarChart3,
  Users,
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { FEATURES_DATA } from '../data/mockData';

interface FeaturesProps {
  onExploreFeature?: (featureId: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onExploreFeature }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'PenTool':
        return <PenTool className="w-6 h-6 text-indigo-600" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-violet-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 text-blue-600" />;
      case 'Search':
        return <Search className="w-6 h-6 text-amber-600" />;
      case 'BarChart3':
        return <BarChart3 className="w-6 h-6 text-emerald-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-rose-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <section
      id="features"
      className="py-20 md:py-28 bg-[#faf9f6] relative overflow-hidden border-b border-stone-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div
            id="features-eyebrow"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-slate-800 text-xs font-semibold uppercase tracking-widest text-[11px] shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Built for High Performance</span>
          </div>

          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-slate-900 tracking-tight"
          >
            Everything You Need to Run Your Publication
          </h2>

          <p
            id="features-subheading"
            className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          >
            Designed from the ground up for modern writers, digital creators, and publishing teams.
            Scale without worrying about infrastructure, plugins, or broken themes.
          </p>
        </div>

        {/* 6 Modern Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES_DATA.map((feature) => (
            <div
              key={feature.id}
              id={`feature-card-${feature.id}`}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-white rounded-2xl p-7 border border-stone-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Icon & Badge Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-stone-100/80 border border-stone-200/80 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    {getFeatureIcon(feature.iconName)}
                  </div>
                  {feature.badge && (
                    <span className="text-[11px] font-semibold text-slate-600 bg-stone-100 px-2.5 py-1 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors border border-stone-200/60">
                      {feature.badge}
                    </span>
                  )}
                </div>

                {/* Feature Title */}
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-2.5 group-hover:text-indigo-900 transition-colors">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Interactive Feature Micro-Detail */}
              <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-indigo-900">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Production Ready</span>
                </span>
                <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all flex items-center gap-1">
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Banner Bar */}
        <div className="mt-14 bg-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-indigo-300 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold">Need custom branding or multi-team workspaces?</h4>
              <p className="text-sm text-slate-400">
                Connect custom domains, custom fonts, and configure automated weekly email digests.
              </p>
            </div>
          </div>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-slate-950 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0 font-sans"
          >
            <span>See How It Works</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

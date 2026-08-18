import React, { useState, useEffect } from 'react';
import { FileText, Users, Globe, ShieldCheck } from 'lucide-react';
import { STATS_DATA } from '../data/mockData';
import { StatItem } from '../types';
import { fetchLiveStats } from '../lib/api';

export const Stats: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>(STATS_DATA);

  useEffect(() => {
    fetchLiveStats().then((data) => {
      if (data && data.length > 0) {
        setStats(data);
      }
    });
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-violet-600" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-blue-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <section
      id="stats-section"
      className="py-12 bg-white border-y border-stone-200/90 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/80">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              id={`stat-card-${idx}`}
              className="flex flex-col items-start sm:items-center text-left sm:text-center p-4 rounded-xl hover:bg-stone-50/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100/90 border border-stone-200/70 flex items-center justify-center mb-3">
                {getIcon(stat.iconName)}
              </div>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-800 mt-1 font-sans">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 max-w-[200px]">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


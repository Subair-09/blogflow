import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Eye,
  Bold,
  Italic,
  Code,
  Image as ImageIcon,
  Send,
  Clock,
  Check,
  Database,
  Server,
  Activity,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RECENT_DASHBOARD_POSTS } from '../data/mockData';
import { MongoDbStatus } from '../types';

interface HeroProps {
  onStartWriting: () => void;
  onExploreBlogs: () => void;
  dbStatus?: MongoDbStatus | null;
  onOpenDbInspector?: () => void;
  onRefreshDbStatus?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartWriting,
  onExploreBlogs,
  dbStatus,
  onOpenDbInspector,
}) => {
  const [isPublished, setIsPublished] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'analytics'>('editor');
  const [editorTitle, setEditorTitle] = useState('The Architecture of Scalable UI Systems in 2026');
  const [publishToast, setPublishToast] = useState<string | null>(null);

  const handleMockPublish = () => {
    setIsPublished(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#7c3aed', '#06b6d4', '#10b981'],
    });
    setPublishToast('Article deployed to global CDN edge in 42ms!');
    setTimeout(() => {
      setPublishToast(null);
    }, 4000);
  };

  const isMongoLive = dbStatus?.connected === true;

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#faf9f6]/90 border-b border-stone-200/80"
    >
      {/* Background Subtle Editorial Warmth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-stone-200/40 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-indigo-50/50 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            {/* MongoDB Live Status Connection Banner & Tag */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Main MongoDB Live Indicator Badge */}
              <button
                type="button"
                id="hero-mongodb-status-badge"
                onClick={onOpenDbInspector}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs border transition-all cursor-pointer group ${
                  isMongoLive
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100/80 hover:border-emerald-400'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100/80 hover:border-amber-400'
                }`}
                title="Click to inspect real-time MongoDB database connection"
              >
                <span className="flex h-2.5 w-2.5 relative">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isMongoLive ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isMongoLive ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                  />
                </span>

                <Database className={`w-3.5 h-3.5 ${isMongoLive ? 'text-emerald-700' : 'text-amber-700'}`} />

                <span className="font-mono font-bold tracking-tight">
                  {isMongoLive ? 'MongoDB Atlas Connected' : 'MongoDB Local Cache (Fallback)'}
                </span>

                {isMongoLive && dbStatus?.pingMs && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                    <Zap className="w-2.5 h-2.5" />
                    {dbStatus.pingMs}ms
                  </span>
                )}

                <span className="text-[10px] font-sans underline underline-offset-2 opacity-70 group-hover:opacity-100">
                  Inspect
                </span>
              </button>

              {/* Tag Badge */}
              <div
                id="hero-tag-badge"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-slate-800 text-xs font-semibold shadow-2xs"
              >
                <span className="font-serif italic font-normal text-slate-700">Next-Gen Publishing Engine</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-headline"
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-900 tracking-tight leading-[1.12]"
            >
              Your Ideas Deserve a{' '}
              <span className="italic font-normal text-indigo-900 underline decoration-stone-300 decoration-1 underline-offset-8">
                Better Place
              </span>{' '}
              to Live.
            </h1>

            {/* Subheadline */}
            <p
              id="hero-subheadline"
              className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl font-normal"
            >
              Create, publish, and manage beautiful blog posts while building a community
              around your ideas with intelligent analytics, rich typography, and instant edge CDN delivery.
            </p>

            {/* MongoDB Connection Callout Bar */}
            <div
              id="hero-mongodb-details-box"
              onClick={onOpenDbInspector}
              className={`w-full p-3 rounded-2xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                isMongoLive
                  ? 'bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-50 text-emerald-950 shadow-2xs'
                  : 'bg-white border-stone-200/80 hover:border-stone-300 text-slate-800 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isMongoLive ? 'bg-emerald-600 text-white shadow-xs' : 'bg-stone-100 text-slate-600'
                  }`}
                >
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>
                      {isMongoLive
                        ? 'Connected to MongoDB Atlas Cluster'
                        : 'MongoDB Ready (Waiting for MONGODB_URI)'}
                    </span>
                    {isMongoLive && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full font-bold">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Truly Live
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs sm:max-w-sm">
                    {isMongoLive
                      ? `db: ${dbStatus?.databaseName || 'blogflow'} • ${dbStatus?.collections.posts ?? 0} posts • ${dbStatus?.collections.comments ?? 0} comments`
                      : 'Add your connection string in Settings to sync live with Atlas'}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-800 shrink-0 font-sans">
                {isMongoLive ? 'View Collections →' : 'Connection Guide →'}
              </div>
            </div>

            {/* Hero Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <button
                id="hero-start-writing-btn"
                type="button"
                onClick={onStartWriting}
                className="inline-flex items-center justify-center gap-2.5 bg-slate-950 hover:bg-slate-800 text-white text-base font-semibold px-7 py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border border-slate-800"
              >
                <span>Start Writing</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-explore-blogs-btn"
                type="button"
                onClick={onExploreBlogs}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-slate-800 text-base font-semibold px-6 py-3.5 rounded-xl border border-stone-300 shadow-2xs hover:border-stone-400 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Compass className="w-5 h-5 text-indigo-600" />
                <span>Explore Blogs</span>
              </button>
            </div>

            {/* Writer Avatars & Social Proof */}
            <div className="flex items-center gap-4 pt-4 border-t border-stone-200/90 w-full">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Writer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Writer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="Writer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Writer"
                />
              </div>
              <div className="text-xs text-slate-600 font-sans">
                <span className="font-bold text-slate-900">5,000+ writers</span> already publishing
                with <span className="font-semibold text-indigo-700 font-mono">99.9% uptime</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Blog Editor & Dashboard Mockup with Floating UI Badges */}
          <div className="lg:col-span-6 relative w-full">
            {/* Top-Left Floating Badge: Views */}
            <div
              id="floating-badge-views"
              className="absolute -top-5 -left-4 sm:-left-8 z-30 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 flex items-center gap-3 animate-float"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">Total Reads</div>
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>1,248 Views</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" /> +24%
                  </span>
                </div>
              </div>
            </div>

            {/* Top-Right Floating Badge: MongoDB Live Connection Status */}
            <div
              id="floating-badge-mongodb"
              onClick={onOpenDbInspector}
              className={`absolute -top-4 -right-3 sm:-right-6 z-30 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border flex items-center gap-2 animate-float-delayed cursor-pointer transition-transform hover:scale-105 ${
                isMongoLive
                  ? 'bg-white/95 border-emerald-200/80 shadow-emerald-100/50'
                  : 'bg-white/95 border-slate-100 shadow-slate-200/80'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-xs ${
                  isMongoLive ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1 font-mono">
                  <span>{isMongoLive ? 'MongoDB Live' : 'MongoDB Cache'}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isMongoLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isMongoLive ? `${dbStatus?.collections.posts ?? 0} docs indexed` : 'In-memory fallback'}
                </div>
              </div>
            </div>

            {/* Bottom-Left Floating Badge: Comments */}
            <div
              id="floating-badge-comments"
              className="absolute -bottom-5 -left-3 sm:-left-6 z-30 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 flex items-center gap-3 animate-float-delayed"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {dbStatus?.collections.comments ?? 32} MongoDB Comments
                </div>
                <div className="text-[11px] text-slate-500">Live discussion collections</div>
              </div>
            </div>

            {/* Main Mockup Container Card */}
            <div
              id="dashboard-editor-mockup"
              className="relative rounded-2xl bg-white border border-stone-200/90 shadow-xl overflow-hidden"
            >
              {/* Window Title Bar */}
              <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-medium text-slate-400 font-mono">
                    blogflow.app/editor/ui-systems-2026
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    onClick={onOpenDbInspector}
                    className="cursor-pointer inline-flex text-[11px] text-emerald-400 items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/50 font-mono"
                  >
                    <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>{isMongoLive ? 'MongoDB Atlas' : 'MongoDB Ready'}</span>
                  </span>
                  <span className="hidden sm:inline-flex text-[11px] text-slate-400 items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Auto-saved</span>
                  </span>
                </div>
              </div>

              {/* Mockup Sub-Header Bar */}
              <div className="px-4 py-2.5 bg-stone-50/90 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveTab('editor')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      activeTab === 'editor'
                        ? 'bg-slate-950 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-slate-950 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      activeTab === 'analytics'
                        ? 'bg-slate-950 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Insights
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMockPublish}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer ${
                      isPublished
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-slate-950 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isPublished ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Published</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Toast Notification for Mock Publish */}
              {publishToast && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 flex items-center justify-between animate-in fade-in">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    {publishToast}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-mono">Persisted in MongoDB</span>
                </div>
              )}

              {/* Tab Content 1: Editor View */}
              {activeTab === 'editor' && (
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left: Editor Canvas (8 cols) */}
                  <div className="md:col-span-8 flex flex-col space-y-3">
                    {/* Title Input */}
                    <div>
                      <input
                        type="text"
                        value={editorTitle}
                        onChange={(e) => setEditorTitle(e.target.value)}
                        className="w-full text-base sm:text-lg font-serif font-bold text-slate-900 bg-transparent border-0 focus:outline-hidden focus:ring-0 placeholder:text-slate-400 p-0"
                        placeholder="Article Title..."
                      />
                    </div>

                    {/* Featured Image Graphic */}
                    <div className="relative rounded-xl overflow-hidden h-36 sm:h-40 border border-stone-200 group">
                      <img
                        src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                        alt="Featured Post Graphic"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-xs text-[11px] font-medium text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3 text-indigo-300" />
                        <span>Featured Header Image</span>
                      </div>
                    </div>

                    {/* Editor Toolbar */}
                    <div className="flex items-center gap-1 py-1.5 px-2 bg-stone-100/90 rounded-lg text-slate-600 text-xs">
                      <span className="p-1 hover:bg-white rounded hover:text-slate-900 cursor-pointer">
                        <Bold className="w-3.5 h-3.5" />
                      </span>
                      <span className="p-1 hover:bg-white rounded hover:text-slate-900 cursor-pointer">
                        <Italic className="w-3.5 h-3.5" />
                      </span>
                      <span className="p-1 hover:bg-white rounded hover:text-slate-900 cursor-pointer font-serif font-bold">
                        H
                      </span>
                      <span className="p-1 hover:bg-white rounded hover:text-slate-900 cursor-pointer">
                        <Code className="w-3.5 h-3.5" />
                      </span>
                      <div className="h-3 w-px bg-stone-300 mx-1" />
                      <span className="text-[11px] font-medium text-slate-500 ml-auto font-mono">
                        840 words • 4 min read
                      </span>
                    </div>

                    {/* Body Text Mockup */}
                    <p className="text-xs text-slate-600 leading-relaxed font-serif">
                      Modern user interfaces transition effortlessly when backed by intent-aware physics.
                      By orchestrating fluid micro-interactions and resilient state channels, engineering
                      teams create memorable reader experiences...
                    </p>
                  </div>

                  {/* Right: Recent Posts Mini Drawer (4 cols) */}
                  <div className="md:col-span-4 bg-stone-50 rounded-xl p-3 border border-stone-200 flex flex-col space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-widest text-[10px]">
                        Recent Posts
                      </span>
                      <span className="text-[10px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-stone-200 font-mono">
                        {dbStatus?.collections.posts ?? 3} Posts
                      </span>
                    </div>

                    <div className="space-y-2">
                      {RECENT_DASHBOARD_POSTS.map((post) => (
                        <div
                          key={post.id}
                          className="bg-white p-2.5 rounded-lg border border-stone-200 hover:border-slate-400 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                                post.status === 'Published'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : post.status === 'Scheduled'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-stone-100 text-slate-700'
                              }`}
                            >
                              {post.status}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">{post.date}</span>
                          </div>
                          <h4 className="text-[11px] font-serif font-medium text-slate-800 line-clamp-1 group-hover:text-indigo-600">
                            {post.title}
                          </h4>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={onStartWriting}
                        className="w-full text-center text-[11px] font-semibold text-slate-800 hover:text-indigo-600 bg-white hover:bg-stone-100 py-1.5 rounded-lg transition-colors border border-stone-200"
                      >
                        + Create New Post
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 2: Live Preview */}
              {activeTab === 'preview' && (
                <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto">
                  <div className="border-b border-stone-200 pb-3">
                    <span className="text-xs font-semibold text-indigo-700 uppercase tracking-widest text-[10px]">
                      Technology • 5 min read
                    </span>
                    <h3 className="text-lg font-serif font-bold text-slate-900 mt-1">{editorTitle}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        className="w-6 h-6 rounded-full object-cover"
                        alt="Elena"
                      />
                      <span className="text-xs font-medium text-slate-700">Elena Vance</span>
                      <span className="text-xs text-slate-400 font-mono">• Just now</span>
                    </div>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                    alt="Cover"
                    className="w-full h-36 object-cover rounded-xl"
                  />
                  <p className="text-xs text-slate-700 leading-relaxed font-serif">
                    Explore how fluid physics, predictive micro-interactions, and modern design tokens
                    combine to produce unprecedented responsive velocity for software blogs.
                  </p>
                </div>
              )}

              {/* Tab Content 3: Analytics Mockup */}
              {activeTab === 'analytics' && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="text-[11px] text-slate-500 font-medium">Article Reads</div>
                      <div className="text-lg font-serif font-bold text-slate-900 mt-0.5">1,248</div>
                      <div className="text-[10px] text-emerald-700 font-semibold font-mono">+18% this week</div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="text-[11px] text-slate-500 font-medium">Avg. Read Time</div>
                      <div className="text-lg font-serif font-bold text-slate-900 mt-0.5">3m 42s</div>
                      <div className="text-[10px] text-indigo-700 font-semibold font-mono">82% completion</div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="text-[11px] text-slate-500 font-medium">Shares & Claps</div>
                      <div className="text-lg font-serif font-bold text-slate-900 mt-0.5">342</div>
                      <div className="text-[10px] text-emerald-700 font-semibold font-mono">4.9/5 rating</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      <span className="text-xs font-semibold text-slate-800">
                        Top referral: Hacker News & X
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200 font-mono">
                      782 direct clicks
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


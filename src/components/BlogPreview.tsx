import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  Heart,
  Bookmark,
  Search,
  BookOpen,
  RefreshCw,
  Database,
} from 'lucide-react';
import { BlogPost } from '../types';
import { fetchPosts, likePostInMongo } from '../lib/api';

interface BlogPreviewProps {
  onReadArticle: (post: BlogPost) => void;
  posts?: BlogPost[];
  onRefresh?: () => void;
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({ onReadArticle, posts: propPosts, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [internalPosts, setInternalPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Technology', 'Business', 'Lifestyle'];

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts({
        category: selectedCategory,
        query: searchQuery,
      });
      setInternalPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, searchQuery]);

  // Synchronize when propPosts updates
  useEffect(() => {
    if (propPosts && propPosts.length > 0) {
      setInternalPosts(propPosts);
    }
  }, [propPosts]);

  const activePosts = internalPosts;

  const toggleLike = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    const currentLiked = !!likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !currentLiked }));

    // Optimistic UI update
    setInternalPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + (currentLiked ? -1 : 1) } : p))
    );

    // Persist like to MongoDB
    if (!currentLiked) {
      await likePostInMongo(postId);
    }
  };

  const toggleBookmark = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'Business':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Lifestyle':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <section
      id="blogs"
      className="py-20 md:py-28 bg-[#faf9f6] relative overflow-hidden border-b border-stone-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <div
              id="blogs-tag"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-slate-800 text-xs font-semibold uppercase tracking-widest text-[11px] shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>MongoDB Feed • Editorial Spotlight</span>
            </div>
            <h2
              id="blogs-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-slate-900 tracking-tight"
            >
              Discover Fresh Ideas
            </h2>
            <p className="text-base text-slate-600 font-normal">
              Explore insightful pieces queried directly from MongoDB collections with instant search and indexing.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="blog-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search MongoDB articles..."
                className="pl-9.5 pr-4 py-2 text-xs sm:text-sm bg-white rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 w-full sm:w-60 shadow-2xs placeholder:text-slate-400"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`cat-filter-${cat.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Manual Refresh Trigger */}
            <button
              type="button"
              onClick={loadPosts}
              title="Sync from MongoDB"
              className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-slate-900' : ''}`} />
            </button>
          </div>
        </div>

        {/* 3 Blog Cards Grid */}
        {activePosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activePosts.map((post) => {
              const isLiked = likedPosts[post.id];
              const isBookmarked = bookmarkedPosts[post.id];

              return (
                <article
                  key={post.id || post._id}
                  id={`blog-card-${post.id}`}
                  onClick={() => onReadArticle(post)}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Large Featured Image */}
                    <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-stone-100">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Category Badge Floating on Image */}
                      <div className="absolute top-3.5 left-3.5">
                        <span
                          className={`text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-md border shadow-2xs ${getCategoryColor(
                            post.category
                          )}`}
                        >
                          {post.category}
                        </span>
                      </div>

                      {/* Bookmark Icon Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(e, post.id)}
                        className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-colors ${
                          isBookmarked
                            ? 'bg-slate-950 text-white'
                            : 'bg-white/90 hover:bg-white text-slate-700'
                        }`}
                        title={isBookmarked ? 'Bookmarked' : 'Save for later'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Post Content Details */}
                    <div className="p-6">
                      {/* Meta Info: Date & Read Time */}
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2.5 font-mono">
                        <span>{post.publishedAt}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-sans">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {post.readTime}
                        </span>
                        <span className="ml-auto text-[10px] text-slate-400 flex items-center gap-1">
                          <Database className="w-3 h-3 text-emerald-600" />
                          MongoDB
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-2 mb-2.5 leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt Description */}
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-sans font-normal">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Author & Read Article Action */}
                  <div className="px-6 pb-6 pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-100"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">
                          {post.author.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium line-clamp-1">
                          {post.author.role}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Likes & Read Article */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => toggleLike(e, post.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                          isLiked
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-white hover:bg-stone-50 text-slate-600 border-stone-200'
                        }`}
                        title="Like in MongoDB"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReadArticle(post);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 bg-stone-100 group-hover:bg-slate-950 group-hover:text-white px-3 py-2 rounded-xl transition-all shadow-2xs border border-stone-200/80 cursor-pointer"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-lg font-serif font-bold text-slate-800">No articles matched your criteria in MongoDB</h4>
            <p className="text-sm text-slate-500 mt-1">Try resetting the category filter or clear your search term.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-stone-100 text-slate-900 text-xs font-bold rounded-lg hover:bg-stone-200 border border-stone-200 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};


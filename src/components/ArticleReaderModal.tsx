import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Heart,
  Share2,
  MessageSquare,
  Send,
  Check,
  Database,
} from 'lucide-react';
import { BlogPost, CommentItem } from '../types';
import { fetchCommentsFromMongo, addCommentToMongo, likePostInMongo } from '../lib/api';

interface ArticleReaderModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onPostUpdated?: (updatedPost: BlogPost) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  post,
  onClose,
  onPostUpdated,
}) => {
  const [likes, setLikes] = useState<number>(post?.likes || 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setLikes(post.likes || 0);
      // Fetch live comments from MongoDB
      fetchCommentsFromMongo(post.id).then((fetchedComments) => {
        if (fetchedComments && fetchedComments.length > 0) {
          setComments(fetchedComments);
        } else {
          setComments([
            {
              id: 'c1',
              author: 'Alex Rivera',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
              timeAgo: '2 hours ago',
              content: 'This breakdown is exceptionally clear. The perspective on micro-interactions reducing cognitive friction is spot on.',
            },
            {
              id: 'c2',
              author: 'Sarah Jenkins',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
              timeAgo: '5 hours ago',
              content: 'Bookmarked for our team architectural review next Monday. Loving the typography on BlogFlow too!',
            },
          ]);
        }
      });
    }
  }, [post]);

  if (!post) return null;

  const handleLike = async () => {
    if (hasLiked) {
      setLikes((l) => l - 1);
      setHasLiked(false);
    } else {
      setLikes((l) => l + 1);
      setHasLiked(true);
      const resLikes = await likePostInMongo(post.id);
      if (resLikes !== null && onPostUpdated) {
        onPostUpdated({ ...post, likes: resLikes });
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await addCommentToMongo(post.id, newComment.trim(), 'You (Guest Author)');
      if (created) {
        setComments([created, ...comments]);
      } else {
        const fallbackComment: CommentItem = {
          id: `c-${Date.now()}`,
          author: 'You (Guest Reader)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          timeAgo: 'Just now',
          content: newComment.trim(),
        };
        setComments([fallbackComment, ...comments]);
      }
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="article-reader-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full">
            <span>{post.category}</span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-700 flex items-center gap-1 text-[11px] font-mono">
              <Database className="w-3 h-3" />
              MongoDB Document
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-700 hover:bg-stone-100 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-stone-200/60 cursor-pointer"
              title="Copy Article Link"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="close-reader-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body Container */}
        <div className="p-6 sm:p-10 space-y-6">
          {/* Title & Author Info */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-stone-100"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">{post.author.name}</div>
                  <div className="text-xs text-slate-500">{post.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span>{post.publishedAt}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-sans">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-stone-200 max-h-80">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Formatted Content */}
          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-4 text-base font-serif">
            <p className="text-lg font-medium text-slate-900 leading-relaxed italic border-l-2 border-slate-900 pl-4 py-1">
              {post.excerpt}
            </p>

            <div className="whitespace-pre-line text-base leading-relaxed text-slate-700 font-serif">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-200">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-stone-100 text-xs font-semibold text-slate-700 hover:bg-stone-200 transition-colors font-sans"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Engagement Bar: Claps & Comments Count */}
          <div className="py-4 px-5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                hasLiked
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-stone-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{likes} Likes in MongoDB</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 font-sans">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>{comments.length} MongoDB Comments</span>
            </div>
          </div>

          {/* Comment Thread */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span>Discussion Thread</span>
              <span className="text-xs text-slate-700 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full font-bold">
                {comments.length}
              </span>
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment to store in MongoDB comments collection..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 bg-stone-50/50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-950 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Saving...' : 'Post'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Comment List */}
            <div className="space-y-3 pt-2">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3"
                >
                  <img
                    src={c.avatar}
                    alt={c.author}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-200 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{c.author}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{c.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


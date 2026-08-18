import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  Database,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createPostInMongo } from '../lib/api';
import { AuthUser } from '../types';
import { ImageUploader } from './ImageUploader';

interface WritePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostPublished: (postTitle: string) => void;
  currentUser?: AuthUser | null;
}

export const WritePostModal: React.FC<WritePostModalProps> = ({
  isOpen,
  onClose,
  onPostPublished,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Technology' | 'Business' | 'Lifestyle'>('Technology');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tags, setTags] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Please provide both a title and article body content.');
      return;
    }

    setIsPublishing(true);
    setErrorMessage(null);

    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await createPostInMongo({
        title: title.trim(),
        content: content.trim(),
        category,
        featuredImage: featuredImage.trim() || undefined,
        tags: parsedTags.length > 0 ? parsedTags : ['Technology'],
        excerpt: content.trim().substring(0, 150) + '...',
        author: currentUser
          ? {
              name: currentUser.name,
              role: currentUser.role === 'admin' ? 'Admin' : 'Author',
              avatar: currentUser.avatar,
            }
          : undefined,
      });

      setIsPublishing(false);
      setPublishSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#7c3aed', '#06b6d4', '#10b981'],
      });

      onPostPublished(title);

      setTimeout(() => {
        setPublishSuccess(false);
        setTitle('');
        setContent('');
        setFeaturedImage('');
        onClose();
      }, 2000);
    } catch (err: any) {
      setIsPublishing(false);
      setErrorMessage(err.message || 'Failed to save post to MongoDB');
    }
  };

  return (
    <div
      id="write-post-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 text-slate-900 relative my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-300" />
            <span className="font-serif font-bold text-sm tracking-tight">BlogFlow Post Creator</span>
            {currentUser && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-full text-slate-300">
                <img src={currentUser.avatar} alt="" className="w-3.5 h-3.5 rounded-full" />
                <span>{currentUser.name}</span>
              </span>
            )}
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Database className="w-3 h-3" /> MongoDB
            </span>
          </div>
          <button
            type="button"
            id="close-writer-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {publishSuccess ? (
          <div className="p-10 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">Document Created in MongoDB!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto font-sans">
              Your article &ldquo;{title}&rdquo; has been written directly to the MongoDB <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-slate-800">posts</code> collection.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-widest text-slate-800 mb-1.5 text-[11px]">
                Article Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Why Modern Systems Favor Intent-Driven Architectures"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-base font-serif font-semibold focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-widest text-slate-800 mb-1.5 text-[11px]">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as 'Technology' | 'Business' | 'Lifestyle')
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 bg-white"
                >
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-widest text-slate-800 mb-1.5 text-[11px]">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Design, Tech, Strategy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 placeholder:text-slate-400 font-sans"
                />
              </div>
            </div>

            {/* Cloudinary Cover Image Upload */}
            <div className="border-t border-stone-100 pt-2">
              <ImageUploader
                id="modal-writer-image-uploader"
                value={featuredImage}
                onChange={setFeaturedImage}
                label="Article Cover Photo (Cloudinary Upload)"
                description="Upload an image file from your device directly to Cloudinary storage."
              />
            </div>

            {/* Editor Toolbar & Text Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-serif font-bold uppercase tracking-widest text-slate-800 text-[11px]">
                  Article Content (Markdown supported)
                </label>
                <span className="text-[11px] text-slate-500 font-mono">Persists to MongoDB collection</span>
              </div>

              <div className="border border-stone-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900/20 focus-within:border-slate-900">
                <div className="flex items-center gap-1 bg-stone-100 px-3 py-2 border-b border-stone-200 text-slate-700 text-xs">
                  <span className="p-1 hover:bg-white rounded cursor-pointer font-bold">B</span>
                  <span className="p-1 hover:bg-white rounded cursor-pointer italic font-serif">I</span>
                  <span className="p-1 hover:bg-white rounded cursor-pointer font-serif font-bold">H1</span>
                  <span className="p-1 hover:bg-white rounded cursor-pointer font-mono">&lt;&gt;</span>
                  <div className="h-3 w-px bg-stone-300 mx-1" />
                  <span className="text-[11px] text-slate-500 font-mono">Real-time validation</span>
                </div>

                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft your introduction and core ideas here..."
                  className="w-full p-4 text-sm text-slate-800 focus:outline-hidden resize-none placeholder:text-slate-400 font-serif"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-sans">
                Saved instantly to MongoDB
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer font-sans"
                >
                  {isPublishing ? (
                    <span>Writing to MongoDB...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish to MongoDB</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import {
  FilePlus,
  FileText,
  Edit3,
  Trash2,
  Send,
  Eye,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  Filter,
  Check,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  Database,
  Lock,
  User,
  Heart,
  MessageSquare,
  BarChart3,
  Calendar,
  Tag,
  Image as ImageIcon,
  Key,
  LogOut,
  ArrowRight,
  Mail,
  Cloud,
} from 'lucide-react';
import { BlogPost, AuthUser, MongoDbStatus } from '../types';
import {
  fetchAdminPosts,
  createPostInMongo,
  updatePostInMongo,
  deletePostFromMongo,
  togglePostPublishStatus,
  loginUser,
  fetchCloudinaryStatus,
} from '../lib/api';
import { ImageUploader } from './ImageUploader';

export type AdminTab = 'view' | 'create' | 'edit' | 'delete' | 'publish';

interface AdminDashboardProps {
  currentUser: AuthUser | null;
  onExitToBlog: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onAdminLoginSuccess?: (user: AuthUser) => void;
  onSignOut?: () => void;
  onViewPostInReader: (post: BlogPost) => void;
  dbStatus: MongoDbStatus | null;
  onRefreshDb: () => void;
  initialTab?: AdminTab;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onExitToBlog,
  onOpenAuth,
  onAdminLoginSuccess,
  onSignOut,
  onViewPostInReader,
  dbStatus,
  onRefreshDb,
  initialTab = 'view',
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [actionNotice, setActionNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Cloudinary storage status indicator state
  const [cloudinaryStatus, setCloudinaryStatus] = useState<{
    configured: boolean;
    cloudName: string | null;
    provider: string;
  } | null>(null);
  const [isCheckingCloudinary, setIsCheckingCloudinary] = useState(false);

  const refreshCloudinary = async () => {
    setIsCheckingCloudinary(true);
    try {
      const res = await fetchCloudinaryStatus();
      setCloudinaryStatus({
        configured: res.configured,
        cloudName: res.cloudName,
        provider: res.provider,
      });
    } catch (e) {
      console.error('Failed to fetch Cloudinary status:', e);
    } finally {
      setIsCheckingCloudinary(false);
    }
  };

  useEffect(() => {
    refreshCloudinary();
  }, []);

  // Dedicated Admin Gatekeeper Form State
  const [loginEmail, setLoginEmail] = useState('nuddywale@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Selected post for Edit or Delete tabs
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State for Create / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Technology' | 'Business' | 'Lifestyle'>('Technology');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formFeaturedImage, setFormFeaturedImage] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState<'write' | 'preview'>('write');

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminPosts({
        query: searchQuery,
        category: selectedCategory,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setPosts(data);
    } catch (e) {
      console.error('Error fetching admin posts:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [searchQuery, selectedCategory, statusFilter]);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setActionNotice({ text, type });
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  // Switch to Edit tab with preloaded post data
  const handleSelectPostForEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setFormTitle(post.title);
    setFormCategory(post.category);
    setFormExcerpt(post.excerpt || '');
    setFormContent(post.content);
    setFormFeaturedImage(post.featuredImage || '');
    setFormTags((post.tags || []).join(', '));
    setFormStatus(post.status || 'published');
    setActiveTab('edit');
    setPreviewMode('write');
  };

  // Reset Create Form
  const resetCreateForm = () => {
    setFormTitle('');
    setFormCategory('Technology');
    setFormExcerpt('');
    setFormContent('');
    setFormFeaturedImage('');
    setFormTags('');
    setFormStatus('published');
    setPreviewMode('write');
  };

  // Handle Create Post Submit
  const handleCreateSubmit = async (e: React.FormEvent, targetStatus: 'published' | 'draft') => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showNotice('Please provide an article title', 'error');
      return;
    }
    if (!formContent.trim()) {
      showNotice('Article content cannot be empty', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = formTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const created = await createPostInMongo({
        title: formTitle.trim(),
        category: formCategory,
        excerpt: formExcerpt.trim() || formContent.trim().substring(0, 150) + '...',
        content: formContent.trim(),
        featuredImage: formFeaturedImage.trim(),
        tags: parsedTags.length > 0 ? parsedTags : [formCategory],
        status: targetStatus,
        author: currentUser
          ? {
              name: currentUser.name || 'nuddywale',
              role: currentUser.role === 'admin' ? 'Platform Admin' : 'Staff Author',
              avatar: currentUser.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=nuddywale',
            }
          : {
              name: 'nuddywale',
              role: 'Platform Admin',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nuddywale',
            },
      });

      showNotice(
        `Article "${created.title.substring(0, 30)}..." saved as ${targetStatus} in MongoDB!`,
        'success'
      );
      resetCreateForm();
      loadPosts();
      setActiveTab('view');
    } catch (err: any) {
      showNotice(err.message || 'Failed to create post in MongoDB', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Post Submit
  const handleEditSubmit = async (e: React.FormEvent, targetStatus?: 'published' | 'draft') => {
    e.preventDefault();
    if (!editingPostId) return;

    if (!formTitle.trim()) {
      showNotice('Title cannot be empty', 'error');
      return;
    }
    if (!formContent.trim()) {
      showNotice('Content cannot be empty', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = formTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await updatePostInMongo(editingPostId, {
        title: formTitle.trim(),
        category: formCategory,
        excerpt: formExcerpt.trim(),
        content: formContent.trim(),
        featuredImage: formFeaturedImage,
        tags: parsedTags,
        status: targetStatus || formStatus,
      });

      if (res.success && res.post) {
        showNotice(`Post "${res.post.title.substring(0, 30)}..." updated successfully in MongoDB!`, 'success');
        loadPosts();
        setActiveTab('view');
      } else {
        showNotice(res.error || 'Failed to update post', 'error');
      }
    } catch (err: any) {
      showNotice(err.message || 'Failed to update post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick Status Toggle (Publish / Unpublish)
  const handleTogglePublish = async (post: BlogPost) => {
    const nextStatus = (post.status || 'published') === 'published' ? 'draft' : 'published';
    try {
      const res = await togglePostPublishStatus(post.id, nextStatus);
      if (res.success) {
        showNotice(
          `Post "${post.title.substring(0, 25)}..." is now ${nextStatus.toUpperCase()}`,
          'success'
        );
        loadPosts();
      } else {
        showNotice(res.error || 'Status toggle failed', 'error');
      }
    } catch (err: any) {
      showNotice(err.message || 'Status toggle error', 'error');
    }
  };

  // Handle Delete Confirmation
  const handleDeletePost = async () => {
    if (!deleteConfirmPost) return;
    setIsDeleting(true);
    try {
      const res = await deletePostFromMongo(deleteConfirmPost.id);
      if (res.success) {
        showNotice(`Post "${deleteConfirmPost.title}" was permanently deleted from MongoDB`, 'success');
        setDeleteConfirmPost(null);
        if (editingPostId === deleteConfirmPost.id) {
          setEditingPostId(null);
        }
        loadPosts();
      } else {
        showNotice(res.error || 'Failed to delete post', 'error');
      }
    } catch (err: any) {
      showNotice(err.message || 'Delete error occurred', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Compute stats
  const totalPostsCount = posts.length;
  const publishedCount = posts.filter((p) => (p.status || 'published') === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const totalViewsSum = posts.reduce((acc, p) => acc + (p.views || 0), 0);

  // If not authenticated as the sole system administrator (nuddywale@gmail.com), render the Admin Login Gatekeeper!
  if (currentUser?.email !== 'nuddywale@gmail.com') {
    const handleAdminLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginLoading(true);
      setLoginError(null);
      try {
        if (!loginEmail.trim()) {
          throw new Error('Please enter your administrator email address.');
        }
        if (!loginPassword) {
          throw new Error('Please enter the administrator password.');
        }

        const res = await loginUser(loginEmail, loginPassword);
        if (!res.success || !res.user) {
          throw new Error(res.error || 'Authentication failed. Please verify credentials.');
        }

        if (res.user.email !== 'nuddywale@gmail.com') {
          throw new Error(
            'Access Denied: Only the sole system administrator (nuddywale@gmail.com) can access this dashboard.'
          );
        }

        if (onAdminLoginSuccess) {
          onAdminLoginSuccess(res.user);
        }
        showNotice(`Welcome, Administrator ${res.user.name}!`, 'success');
      } catch (err: any) {
        setLoginError(err.message || 'Login failed. Please check credentials.');
      } finally {
        setLoginLoading(false);
      }
    };

    const handleFillAdmin = () => {
      setLoginEmail('nuddywale@gmail.com');
      setLoginPassword('subair_@09');
      setLoginError(null);
    };

    return (
      <div id="admin-login-gatekeeper" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-slate-950">
        {/* Top Minimal Navbar */}
        <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              type="button"
              id="gatekeeper-back-btn"
              onClick={onExitToBlog}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Blog</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-sm tracking-tight text-white">BlogFlow Administrator Portal</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              {/* Cloudinary Status */}
              <div
                id="gatekeeper-cloudinary-indicator"
                className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-slate-300"
                title={
                  cloudinaryStatus?.configured
                    ? `Cloudinary Connected (Cloud: ${cloudinaryStatus.cloudName})`
                    : 'Cloudinary Ready'
                }
              >
                <Cloud className={`w-3.5 h-3.5 ${cloudinaryStatus?.configured ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className={`w-2 h-2 rounded-full ${cloudinaryStatus?.configured ? 'bg-sky-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="hidden sm:inline text-slate-400">Cloudinary:</span>
                <span className={cloudinaryStatus?.configured ? 'text-sky-300 font-semibold' : 'text-slate-300'}>
                  {cloudinaryStatus?.configured ? (cloudinaryStatus.cloudName || 'Connected') : 'Ready'}
                </span>
              </div>

              {/* MongoDB Status */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-slate-300">
                <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="hidden sm:inline text-slate-400">DB:</span>
                <span className={dbStatus?.connected ? 'text-emerald-300' : 'text-slate-300'}>
                  {dbStatus?.connected ? 'Live' : 'Protected'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Center Admin Login Gatekeeper Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative overflow-hidden">
            {/* Ambient subtle glow effects */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Lock Icon */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
                <Shield className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
                Admin Authentication
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Please sign in with administrator credentials to view and manage the 5-tab editorial dashboard.
              </p>
            </div>

            {/* If currently signed in as a non-admin account */}
            {currentUser && currentUser.email !== 'nuddywale@gmail.com' && (
              <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Access Restricted:</span> Signed in as{' '}
                  <span className="font-semibold text-white">{currentUser.name}</span> ({currentUser.email} - {currentUser.role}).
                  Only <span className="text-amber-300 font-mono font-bold">nuddywale@gmail.com</span> can access the admin dashboard.
                </div>
              </div>
            )}

            {/* 1-Click Credential Fill Helper Card */}
            <div className="mb-5 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Key className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-200 text-[11px]">System Administrator</div>
                  <div className="text-[10px] text-amber-400 font-mono">nuddywale@gmail.com</div>
                </div>
              </div>
              <button
                type="button"
                id="gatekeeper-fill-admin-btn"
                onClick={handleFillAdmin}
                className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-[11px] transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Fill Admin
              </button>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-5 p-3.5 bg-rose-900/40 border border-rose-700/60 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Admin Login Form */}
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-300 uppercase tracking-widest mb-1.5 text-[11px]">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    id="admin-login-email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nuddywale@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-700 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 font-medium placeholder:text-slate-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-serif font-bold text-slate-300 uppercase tracking-widest text-[11px]">
                    Admin Password
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    PBKDF2 Verified
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    id="admin-login-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-700 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 font-medium placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="admin-login-submit-btn"
                disabled={loginLoading}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loginLoading ? (
                  <span>Authenticating Admin...</span>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Unlock Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={onExitToBlog}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Return to Public Blog
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
          BlogFlow MongoDB Administrator Gate • Sole Admin Access Control
        </footer>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-page" className="min-h-screen bg-stone-100 text-slate-900 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-slate-950 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="admin-exit-btn"
              onClick={onExitToBlog}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Blog</span>
            </button>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm tracking-tight text-white">Admin Control Center</span>
                  <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
                    Sole Admin
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Items & User Status */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Cloudinary Image Storage Indicator Pill */}
            <div
              id="admin-header-cloudinary-indicator"
              className="flex items-center gap-1.5 text-[11px] font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300 shadow-2xs"
              title={
                cloudinaryStatus?.configured
                  ? `Cloudinary Connected (Cloud: ${cloudinaryStatus.cloudName})`
                  : 'Cloudinary Ready (Local storage fallback active)'
              }
            >
              <Cloud className={`w-3.5 h-3.5 ${cloudinaryStatus?.configured ? 'text-sky-400' : 'text-slate-400'}`} />
              <span
                className={`w-2 h-2 rounded-full ${
                  cloudinaryStatus?.configured ? 'bg-sky-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="hidden sm:inline text-slate-400">Cloudinary:</span>
              <span
                className={`font-semibold ${
                  cloudinaryStatus?.configured ? 'text-sky-300' : 'text-slate-300'
                }`}
              >
                {cloudinaryStatus?.configured
                  ? (cloudinaryStatus.cloudName || 'Connected')
                  : 'Ready'}
              </span>
              <button
                type="button"
                onClick={refreshCloudinary}
                disabled={isCheckingCloudinary}
                title="Refresh Cloudinary connection status"
                className="hover:text-white ml-0.5 text-slate-400 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isCheckingCloudinary ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* MongoDB Connection Status Pill */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300">
              <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{dbStatus?.connected ? 'MongoDB Live' : 'In-Memory Store'}</span>
              <button
                type="button"
                onClick={onRefreshDb}
                title="Refresh DB status"
                className="hover:text-white ml-1 text-slate-400 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs text-slate-200">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full ring-1 ring-emerald-400/40"
                  />
                  <span className="font-medium hidden sm:inline">{currentUser.name}</span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    Admin
                  </span>
                </div>

                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="p-1.5 bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Sign out of Administrator account"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Primary 5-Tab Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto">
          <nav className="flex space-x-1 sm:space-x-2 py-2" aria-label="Admin Tabs">
            {/* 1. Create Post */}
            <button
              type="button"
              id="admin-tab-create"
              onClick={() => {
                resetCreateForm();
                setActiveTab('create');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FilePlus className="w-4 h-4" />
              <span>Create Post</span>
            </button>

            {/* 2. View Posts */}
            <button
              type="button"
              id="admin-tab-view"
              onClick={() => setActiveTab('view')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'view'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>View Posts ({totalPostsCount})</span>
            </button>

            {/* 3. Edit Post */}
            <button
              type="button"
              id="admin-tab-edit"
              onClick={() => {
                if (!editingPostId && posts.length > 0) {
                  handleSelectPostForEdit(posts[0]);
                }
                setActiveTab('edit');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Post</span>
            </button>

            {/* 4. Delete Post */}
            <button
              type="button"
              id="admin-tab-delete"
              onClick={() => setActiveTab('delete')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'delete'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Post</span>
            </button>

            {/* 5. Publish Post */}
            <button
              type="button"
              id="admin-tab-publish"
              onClick={() => setActiveTab('publish')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'publish'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Publish Post</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Floating Action Notice */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-medium ${
              actionNotice.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-700'
                : 'bg-rose-950 text-rose-100 border-rose-700'
            }`}
          >
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{actionNotice.text}</span>
          </div>
        </div>
      )}

      {/* Quick Summary Metrics Bar */}
      <div className="bg-white border-b border-stone-200 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200">
            <Layers className="w-4 h-4 text-slate-700 shrink-0" />
            <div>
              <div className="text-slate-500 font-mono text-[10px] uppercase">Total In Database</div>
              <div className="font-serif font-bold text-slate-900 text-sm">{totalPostsCount} Articles</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-emerald-700 font-mono text-[10px] uppercase">Published Live</div>
              <div className="font-serif font-bold text-emerald-900 text-sm">{publishedCount} Live</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="text-amber-700 font-mono text-[10px] uppercase">Drafts & Staging</div>
              <div className="font-serif font-bold text-amber-900 text-sm">{draftCount} In Draft</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <BarChart3 className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <div className="text-slate-500 font-mono text-[10px] uppercase">Accumulated Views</div>
              <div className="font-serif font-bold text-slate-900 text-sm">{totalViewsSum.toLocaleString()} Reads</div>
            </div>
          </div>
          {/* Cloudinary Storage Metric Card */}
          <div
            id="admin-cloudinary-metric-card"
            className={`col-span-2 sm:col-span-1 flex items-center gap-2.5 p-2 rounded-xl border transition-colors ${
              cloudinaryStatus?.configured
                ? 'bg-sky-50/80 border-sky-200 text-sky-950'
                : 'bg-stone-50 border-stone-200 text-slate-800'
            }`}
          >
            <Cloud className={`w-4 h-4 shrink-0 ${cloudinaryStatus?.configured ? 'text-sky-600' : 'text-slate-600'}`} />
            <div className="min-w-0">
              <div className="text-slate-500 font-mono text-[10px] uppercase flex items-center gap-1">
                <span>Cloudinary CDN</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    cloudinaryStatus?.configured ? 'bg-sky-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
              </div>
              <div className="font-serif font-bold text-slate-900 text-sm truncate">
                {cloudinaryStatus?.configured
                  ? (cloudinaryStatus.cloudName ? `${cloudinaryStatus.cloudName}` : 'Connected')
                  : 'Ready (Direct Upload)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Sole Admin Access Banner */}
        <div className="p-4 rounded-3xl border bg-emerald-50/80 border-emerald-200 text-emerald-950 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm">Authenticated Sole Administrator</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-200 text-emerald-900">
                  nuddywale@gmail.com
                </span>
                {/* Cloudinary connection pill in banner */}
                <span
                  id="banner-cloudinary-status-badge"
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                    cloudinaryStatus?.configured
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-stone-100 text-slate-700 border-stone-300'
                  }`}
                >
                  <Cloud className="w-3 h-3 text-sky-600" />
                  <span>
                    Cloudinary: {cloudinaryStatus?.configured ? `${cloudinaryStatus.cloudName || 'Connected'}` : 'Ready'}
                  </span>
                </span>
              </div>
              <p className="text-xs opacity-80 mt-0.5">
                Full administrative privileges unlocked. You can create, inspect, edit, delete, upload media, and publish articles across the system.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshCloudinary}
              disabled={isCheckingCloudinary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-slate-800 border border-stone-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Refresh Cloudinary storage status"
            >
              <Cloud className="w-3 h-3 text-sky-600" />
              <span>{isCheckingCloudinary ? 'Checking...' : 'Check Media Storage'}</span>
            </button>
            <button
              type="button"
              onClick={loadPosts}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Refresh post data from MongoDB"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync Posts</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: VIEW POSTS */}
        {/* ========================================================================= */}
        {activeTab === 'view' && (
          <div className="space-y-6">
            {/* Header with Search & Filter Controls */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900">Manage All Blog Posts</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  View, filter, edit, and moderate all articles reading directly from MongoDB.
                </p>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, tag..."
                    className="w-full pl-9 pr-3 py-1.5 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Drafts Only</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    resetCreateForm();
                    setActiveTab('create');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer ml-auto"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>New Post</span>
                </button>
              </div>
            </div>

            {/* Posts Management Table / List */}
            {isLoading ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                <p className="text-xs font-mono">Querying MongoDB posts collection...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
                <FileText className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="font-serif font-bold text-slate-800">No articles matched your criteria</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search query or create a fresh article using the Create Post tab.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Create First Post
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-stone-50 text-slate-500 uppercase tracking-wider font-mono text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="px-5 py-3.5">Article & Author</th>
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">Engagement</th>
                        <th className="px-4 py-3.5">Date</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-start gap-3">
                              {post.featuredImage ? (
                                <img
                                  src={post.featuredImage}
                                  alt=""
                                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-slate-400 shrink-0">
                                  <ImageIcon className="w-5 h-5" />
                                </div>
                              )}
                              <div className="space-y-1">
                                <h4 className="font-serif font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                                  {post.title}
                                </h4>
                                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                                  <span>By {post.author.name}</span>
                                  <span>•</span>
                                  <span className="font-mono text-[10px]">{post.readTime}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 text-slate-700 border border-stone-200">
                              {post.category}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                (post.status || 'published') === 'published'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  (post.status || 'published') === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                              />
                              {post.status || 'published'}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-slate-500 font-mono text-[11px]">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                {post.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5 text-rose-400" />
                                {post.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                                {post.commentsCount}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {post.publishedAt || 'Recent'}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {/* View in Reader */}
                              <button
                                type="button"
                                title="View in Blog Reader"
                                onClick={() => onViewPostInReader(post)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>

                              {/* Quick Publish / Unpublish Toggle */}
                              <button
                                type="button"
                                title={(post.status || 'published') === 'published' ? 'Unpublish to Draft' : 'Publish Article Live'}
                                onClick={() => handleTogglePublish(post)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  (post.status || 'published') === 'published'
                                    ? 'text-amber-600 hover:bg-amber-50'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Post */}
                              <button
                                type="button"
                                title="Edit Post"
                                onClick={() => handleSelectPostForEdit(post)}
                                className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Post */}
                              <button
                                type="button"
                                title="Delete Post"
                                onClick={() => setDeleteConfirmPost(post)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CREATE POST */}
        {/* ========================================================================= */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <FilePlus className="w-5 h-5 text-emerald-600" />
                  <span>Create New Blog Post</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Draft a comprehensive editorial piece and write directly into MongoDB database collections.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(previewMode === 'write' ? 'preview' : 'write')}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-slate-700 hover:bg-stone-50 cursor-pointer"
                >
                  {previewMode === 'write' ? 'Show Markdown Preview' : 'Back to Editor'}
                </button>
              </div>
            </div>

            {previewMode === 'preview' ? (
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <span className="text-[11px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {formCategory}
                </span>
                <h1 className="text-3xl font-serif font-bold text-slate-900">{formTitle || 'Untitled Article'}</h1>
                <p className="text-sm text-slate-600 italic">{formExcerpt || 'No excerpt provided.'}</p>
                {formFeaturedImage && (
                  <img src={formFeaturedImage} alt="" className="w-full max-h-80 object-cover rounded-2xl border" />
                )}
                <div className="prose max-w-none text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed pt-4 border-t">
                  {formContent || 'Start writing your content...'}
                </div>
              </div>
            ) : (
              <form className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Architecting Distributed Systems with MongoDB & Node"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-base font-serif font-bold focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                {/* Category & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="e.g. MongoDB, Cloud, Architecture"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* Featured Image - Cloudinary Direct Upload */}
                <div>
                  <ImageUploader
                    id="admin-create-image-uploader"
                    value={formFeaturedImage}
                    onChange={setFormFeaturedImage}
                    label="Article Featured Cover Image"
                    description="Upload an image file directly to Cloudinary CDN storage, or select from curated presets."
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Summary / SEO Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="A concise, engaging teaser shown on the card feed..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs leading-relaxed focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                {/* Markdown Content */}
                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Article Body (Markdown Supported) *
                  </label>
                  <textarea
                    rows={12}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Write your article body here... Use ## for subheadings, - for lists, and ``` for code snippets."
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-sm font-sans leading-relaxed focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                {/* Buttons: Save as Draft vs. Publish */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={(e) => handleCreateSubmit(e, 'draft')}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl border border-stone-300 text-slate-700 hover:bg-stone-50 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCreateSubmit(e, 'published')}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Writing to MongoDB...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Article Live</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EDIT POST */}
        {/* ========================================================================= */}
        {activeTab === 'edit' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  <span>Edit Existing Blog Post</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Modify article metadata, content, and publishing status in MongoDB.
                </p>
              </div>

              {/* Selector for post to edit */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Select Article:</span>
                <select
                  value={editingPostId || ''}
                  onChange={(e) => {
                    const target = posts.find((p) => p.id === e.target.value);
                    if (target) handleSelectPostForEdit(target);
                  }}
                  className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium max-w-xs cursor-pointer"
                >
                  {posts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title.substring(0, 40)}... ({p.status || 'published'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!editingPostId ? (
              <div className="p-12 text-center text-slate-500">
                <Edit3 className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs">No article selected for editing. Pick an article from the dropdown or the View Posts tab.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleEditSubmit(e)} className="space-y-6">
                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-base font-serif font-bold focus:ring-2 focus:ring-indigo-900/10 focus:border-indigo-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium bg-white"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Publishing Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium bg-white"
                    >
                      <option value="published">Published Live</option>
                      <option value="draft">Draft / Staging</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Featured Cover Image - Cloudinary Direct Upload */}
                <div>
                  <ImageUploader
                    id="admin-edit-image-uploader"
                    value={formFeaturedImage}
                    onChange={setFormFeaturedImage}
                    label="Featured Cover Image"
                    description="Upload an image to replace the current cover, or edit the image URL directly."
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Summary / Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Content (Markdown) *
                  </label>
                  <textarea
                    rows={12}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-sm font-sans leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      const postToDelete = posts.find((p) => p.id === editingPostId);
                      if (postToDelete) setDeleteConfirmPost(postToDelete);
                    }}
                    className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Delete this article
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('view')}
                      className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-medium text-slate-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving to MongoDB...' : 'Save & Update Post'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DELETE POST */}
        {/* ========================================================================= */}
        {activeTab === 'delete' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-xl font-serif font-bold text-rose-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <span>Delete Blog Posts</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Safely remove unwanted articles, drafts, and associated discussion threads from MongoDB.
              </p>
            </div>

            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-rose-300 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-slate-400 shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif font-bold text-slate-900 text-sm">{post.title}</h4>
                      <p className="text-xs text-slate-500">
                        {post.category} • {post.views} views • Status: <span className="font-bold">{post.status || 'published'}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmPost(post)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Article</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PUBLISH POST */}
        {/* ========================================================================= */}
        {activeTab === 'publish' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-600" />
                <span>Publishing & Staging Manager</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Instantly toggle between Draft and Live Published states for all articles in MongoDB.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => {
                const isPublished = (post.status || 'published') === 'published';
                return (
                  <div
                    key={post.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      isPublished ? 'bg-emerald-50/40 border-emerald-200' : 'bg-amber-50/40 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isPublished
                            ? 'bg-emerald-200/60 text-emerald-900'
                            : 'bg-amber-200/60 text-amber-900'
                        }`}
                      >
                        {isPublished ? 'Live on Site' : 'Draft / Private'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{post.category}</span>
                    </div>

                    <h4 className="font-serif font-bold text-slate-900 text-sm line-clamp-2">{post.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{post.excerpt}</p>

                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">By {post.author.name}</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(post)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isPublished
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isPublished ? 'Unpublish to Draft' : 'Publish Article Live'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-rose-200 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-lg text-slate-900">Delete Post Permanently?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <span className="font-bold text-slate-800">"{deleteConfirmPost.title}"</span>? This will permanently delete the post document and all its comments from MongoDB.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmPost(null)}
                className="flex-1 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? <span>Deleting...</span> : <span>Yes, Delete Post</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

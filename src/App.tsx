/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { BlogPreview } from './components/BlogPreview';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { WritePostModal } from './components/WritePostModal';
import { AuthModal } from './components/AuthModal';
import { MongoStatusModal } from './components/MongoStatusModal';
import { AdminDashboard, AdminTab } from './components/AdminDashboard';
import { BlogPost, MongoDbStatus, AuthUser } from './types';
import { fetchDatabaseStatus } from './lib/api';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'blog' | 'admin'>(() => {
    return window.location.hash === '#admin' ? 'admin' : 'blog';
  });
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab>('view');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [isWriterOpen, setIsWriterOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<MongoDbStatus | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('blogflow_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email === 'elena@blogflow.io' || parsed.id === 'usr-1') {
          localStorage.removeItem('blogflow_current_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    mode: 'login',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadDbStatus = async () => {
    try {
      const status = await fetchDatabaseStatus();
      if (status) {
        setDbStatus(status);
      }
    } catch (e) {
      console.error('Failed to load database status:', e);
    }
  };

  useEffect(() => {
    loadDbStatus();
    // Poll DB status every 30 seconds for live latency & health updates
    const interval = setInterval(loadDbStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '#create-post') {
        setCurrentView('admin');
        setAdminInitialTab('create');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('blogflow_current_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save user to localStorage', e);
    }
    showToast(`Authenticated as ${user.name} (${user.email})`);
    loadDbStatus();
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('blogflow_current_user');
    } catch (e) {
      console.warn('Could not clear user from localStorage', e);
    }
    showToast('You have signed out successfully.');
  };

  const handleOpenLogin = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  const handleOpenRegister = () => {
    setAuthModal({ isOpen: true, mode: 'register' });
  };

  const handleOpenWriter = () => {
    setIsWriterOpen(true);
  };

  const handleOpenAdmin = (tab: AdminTab = 'view') => {
    setAdminInitialTab(tab);
    setCurrentView('admin');
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitAdminToBlog = () => {
    setCurrentView('blog');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewPostInReader = (post: BlogPost) => {
    setCurrentView('blog');
    window.location.hash = '';
    setSelectedArticle(post);
  };

  const handleExploreBlogs = () => {
    const el = document.getElementById('blogs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePostPublished = (postTitle: string) => {
    showToast(`"${postTitle}" published and distributed to edge CDN!`);
    loadDbStatus();
  };

  if (currentView === 'admin') {
    return (
      <>
        {/* Global Toast Notification */}
        {toastMessage && (
          <div
            id="global-toast"
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold">{toastMessage}</div>
          </div>
        )}

        <AdminDashboard
          currentUser={currentUser}
          onExitToBlog={handleExitAdminToBlog}
          onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
          onAdminLoginSuccess={handleAuthSuccess}
          onSignOut={handleSignOut}
          onViewPostInReader={handleViewPostInReader}
          dbStatus={dbStatus}
          onRefreshDb={loadDbStatus}
          initialTab={adminInitialTab}
        />

        <AuthModal
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onSuccess={handleAuthSuccess}
          onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })}
        />

        <ArticleReaderModal
          post={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-indigo-600 selection:text-white font-sans">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* 1. Navbar */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenWriter={handleOpenWriter}
        onOpenAdmin={handleOpenAdmin}
        dbStatus={dbStatus}
        onOpenDbInspector={() => setIsDbModalOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section with Mockup & Floating Badges */}
        <Hero
          onStartWriting={handleOpenWriter}
          onExploreBlogs={handleExploreBlogs}
          dbStatus={dbStatus}
          onOpenDbInspector={() => setIsDbModalOpen(true)}
        />

        {/* 3. Trust & Statistics Section */}
        <Stats />

        {/* 4. Features Section (6 modern cards) */}
        <Features />

        {/* 5. How It Works Section (01 Create, 02 Publish, 03 Grow) */}
        <HowItWorks onStartWriting={handleOpenWriter} />

        {/* 6. Blog Preview Section (Fresh Ideas) */}
        <BlogPreview onReadArticle={(post) => setSelectedArticle(post)} />

        {/* 7. Writer CTA Section */}
        <CTA onStartWriting={handleOpenWriter} />
      </main>

      {/* 8. Footer */}
      <Footer onOpenWriter={handleOpenWriter} onOpenAdmin={() => handleOpenAdmin('view')} />

      {/* Modals */}
      <ArticleReaderModal
        post={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <WritePostModal
        isOpen={isWriterOpen}
        onClose={() => setIsWriterOpen(false)}
        onPostPublished={handlePostPublished}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSuccess={handleAuthSuccess}
        onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })}
      />

      <MongoStatusModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        status={dbStatus}
        onRefresh={loadDbStatus}
      />
    </div>
  );
}



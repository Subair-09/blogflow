import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowRight, PenLine, LogIn, Database, LogOut, UserCheck, Shield } from 'lucide-react';
import { MongoDbStatus, AuthUser } from '../types';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenWriter: () => void;
  onOpenAdmin: (tab?: 'view' | 'create' | 'edit' | 'delete' | 'publish') => void;
  dbStatus?: MongoDbStatus | null;
  onOpenDbInspector?: () => void;
  currentUser?: AuthUser | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenWriter,
  onOpenAdmin,
  dbStatus,
  onOpenDbInspector,
  currentUser,
  onSignOut,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check section in view
      const sections = ['features', 'how-it-works', 'blogs', 'about'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Blogs', href: '#blogs' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              id="brand-logo"
              className="flex items-center gap-3 group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold tracking-tight text-slate-900 flex items-center gap-1">
                  Blog<span className="text-indigo-600 italic">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-500 -mt-1">
                  Editorial Platform
                </span>
              </div>
            </a>

            {/* MongoDB Live Status Pill */}
            {onOpenDbInspector && (
              <button
                type="button"
                id="mongo-db-indicator-btn"
                onClick={onOpenDbInspector}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all bg-white border border-stone-200 hover:border-stone-400 shadow-2xs cursor-pointer ml-2"
                title="Click to view MongoDB status & collections"
              >
                <span className={`w-2 h-2 rounded-full ${
                  dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-600'
                }`} />
                <Database className="w-3 h-3 text-slate-600" />
                <span className="text-slate-700 font-semibold">MongoDB</span>
                <span className="text-slate-400 text-[10px]">
                  ({dbStatus?.collections.posts ?? 3} posts)
                </span>
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-full border border-stone-200/80 backdrop-blur-xs">
            {navLinks.map((link) => {
              const isActive =
                (link.href === '#' && activeSection === 'home') ||
                link.href === `#${activeSection}`;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right Side CTA Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-quick-write-btn"
              onClick={onOpenWriter}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-stone-50 rounded-lg transition-colors border border-stone-200 shadow-2xs cursor-pointer"
              title="Test Live Post Editor"
            >
              <PenLine className="w-3.5 h-3.5 text-indigo-600" />
              <span>Write Post</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-1">
                <button
                  type="button"
                  onClick={currentUser.email === 'nuddywale@gmail.com' ? () => onOpenAdmin('view') : undefined}
                  className={`flex items-center gap-2 bg-stone-100/90 py-1.5 px-3 rounded-full border border-stone-200 text-xs text-left ${
                    currentUser.email === 'nuddywale@gmail.com' ? 'hover:bg-amber-100/80 hover:border-amber-300 transition-colors cursor-pointer' : ''
                  }`}
                  title={currentUser.email === 'nuddywale@gmail.com' ? 'Click to open Admin Dashboard' : undefined}
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full bg-slate-200 object-cover"
                  />
                  <span className="font-semibold text-slate-800 max-w-[110px] truncate">{currentUser.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                    currentUser.email === 'nuddywale@gmail.com'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {currentUser.role}
                  </span>
                </button>

                <button
                  id="nav-logout-btn"
                  onClick={onSignOut}
                  type="button"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Sign out of account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  id="nav-login-btn"
                  onClick={onOpenLogin}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Login</span>
                </button>

                <button
                  id="nav-get-started-btn"
                  onClick={onOpenRegister}
                  type="button"
                  className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold px-4.5 py-2.5 rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-slate-800"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>


          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {onOpenDbInspector && (
              <button
                type="button"
                onClick={onOpenDbInspector}
                className="p-2 rounded-xl text-slate-700 hover:bg-stone-100 border border-stone-200"
                title="MongoDB Status"
              >
                <Database className="w-4 h-4 text-emerald-600" />
              </button>
            )}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-slate-100 focus:outline-hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 pt-3 pb-6 mt-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-base font-medium text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2.5">
              {currentUser ? (
                <div className="flex items-center justify-between p-3 bg-stone-100 rounded-xl border border-stone-200">
                  <div
                    onClick={currentUser.email === 'nuddywale@gmail.com' ? () => {
                      setMobileMenuOpen(false);
                      onOpenAdmin('view');
                    } : undefined}
                    className={`flex items-center gap-2.5 ${
                      currentUser.email === 'nuddywale@gmail.com' ? 'cursor-pointer' : ''
                    }`}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full bg-slate-200 object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{currentUser.name}</span>
                        {currentUser.email === 'nuddywale@gmail.com' && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut?.();
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWriter();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-800 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <PenLine className="w-4 h-4 text-indigo-600" />
                <span>Write Post</span>
              </button>

              {!currentUser && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-slate-500" />
                    <span>Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-slate-950 text-white shadow-md border border-slate-800"
                  >
                    <span>Create Account Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};


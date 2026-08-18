import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Lock, Mail, User, CheckCircle2, Database, AlertCircle, UserPlus, Shield, Key } from 'lucide-react';
import { AuthUser } from '../types';
import { loginUser, registerUserAccount } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
  initialEmail?: string;
  initialPassword?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSuccess,
  onSwitchMode,
  initialEmail,
  initialPassword,
}) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState(initialPassword || '');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successUser, setSuccessUser] = useState<AuthUser | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isNotRegistered, setIsNotRegistered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setIsNotRegistered(false);
      setSuccessUser(null);
      if (initialEmail) setEmail(initialEmail);
      if (initialPassword) setPassword(initialPassword);
    }
  }, [isOpen, mode, initialEmail, initialPassword]);

  if (!isOpen) return null;

  const handleFillAdminCredentials = () => {
    setEmail('nuddywale@gmail.com');
    setPassword('subair_@09');
    setErrorMsg(null);
    setIsNotRegistered(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setIsNotRegistered(false);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Please enter a valid email address.');
        }
        if (password.length < 4) {
          throw new Error('Password must be at least 4 characters long.');
        }

        const res = await registerUserAccount(name, email, password);
        if (!res.success || !res.user) {
          throw new Error(res.error || 'Registration failed in MongoDB');
        }

        setSuccessUser(res.user);
        setLoading(false);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 1200);
      } else {
        if (!email.trim()) {
          throw new Error('Please enter your email address.');
        }
        if (!password) {
          throw new Error('Please enter your password.');
        }

        const res = await loginUser(email, password);
        if (!res.success || !res.user) {
          if (res.error?.includes('Only signed-up users') || res.error?.includes('No account found')) {
            setIsNotRegistered(true);
          }
          throw new Error(res.error || 'Invalid login credentials');
        }

        setSuccessUser(res.user);
        setLoading(false);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Authentication error');
    }
  };

  return (
    <div
      id="auth-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 text-slate-900 relative my-auto p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          id="close-auth-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo / Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-md mb-1 border border-slate-800">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Sign In to BlogFlow' : 'Create an Account'}
          </h3>
          <p className="text-xs text-slate-500 font-sans flex items-center justify-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>MongoDB Authentication & Users Collection</span>
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex rounded-xl bg-stone-100 p-1 mb-4 border border-stone-200">
          <button
            type="button"
            onClick={() => onSwitchMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Dedicated Admin Credentials Quick-Fill Banner */}
        {mode === 'login' && (
          <div className="mb-4 p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-900 shrink-0">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-amber-950 text-[11px]">System Admin Login</div>
                <div className="text-[10px] text-amber-800 font-mono">nuddywale@gmail.com</div>
              </div>
            </div>
            <button
              type="button"
              id="fill-admin-creds-btn"
              onClick={handleFillAdminCredentials}
              className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-[11px] transition-colors cursor-pointer shrink-0 shadow-2xs"
              title="Auto-fill nuddywale@gmail.com credentials"
            >
              Fill Admin
            </button>
          </div>
        )}

        {/* Error Alert with Sign Up Quick CTA if unregistered */}
        {errorMsg && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex flex-col space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            {isNotRegistered && mode === 'login' && (
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className="mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer self-start"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account with {email || 'this email'}</span>
              </button>
            )}
          </div>
        )}

        {successUser ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-serif font-bold text-slate-900">
              {mode === 'login' ? `Welcome back, ${successUser.name}!` : `Account created for ${successUser.name}!`}
            </h4>
            <p className="text-xs text-slate-500 font-mono">Authenticated via MongoDB users collection...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 uppercase tracking-widest mb-1 text-[11px]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nurudeen Subair"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 font-medium placeholder:text-stone-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-serif font-bold text-slate-800 uppercase tracking-widest mb-1 text-[11px]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 font-medium placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-serif font-bold text-slate-800 uppercase tracking-widest text-[11px]">
                  Password
                </label>
                {mode === 'login' && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    Must match registered account
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Choose a password (min 4 chars)' : 'Enter your password'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 font-medium placeholder:text-stone-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50"
            >
              {loading ? (
                <span>Checking MongoDB...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to System' : 'Create & Register Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch Mode Toggle */}
            <div className="text-center pt-2 text-xs text-slate-600 border-t border-stone-100 mt-3">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('register')}
                    className="font-bold text-slate-950 hover:underline cursor-pointer"
                  >
                    Sign up here
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('login')}
                    className="font-bold text-slate-950 hover:underline cursor-pointer"
                  >
                    Log in here
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};



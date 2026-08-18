import React from 'react';
import {
  Sparkles,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  ArrowUp,
  Heart,
} from 'lucide-react';

interface FooterProps {
  onOpenPricing?: () => void;
  onOpenWriter?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPricing, onOpenWriter, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-950 shadow-md">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight text-white">
                BlogFlow
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-sans">
              Create. Publish. Connect. The modern blog management system engineered for authors,
              engineering teams, and digital media companies.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                id="social-instagram"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:bg-white hover:text-slate-950 flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                id="social-x"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:bg-white hover:text-slate-950 flex items-center justify-center text-slate-400 transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                id="social-linkedin"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:bg-white hover:text-slate-950 flex items-center justify-center text-slate-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                id="social-facebook"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:bg-white hover:text-slate-950 flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-widest text-[11px]">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#blogs" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Company */}
          <div id="about" className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-widest text-[11px]">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#main-footer" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#main-footer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Careers</span>
                  <span className="text-[10px] bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 px-1.5 py-0.5 rounded-full font-bold">
                    Hiring
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-widest text-[11px]">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#blogs" className="hover:text-white transition-colors">
                  Community
                </a>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    id="footer-admin-link"
                    className="hover:text-amber-400 transition-colors text-slate-400 text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Admin Portal</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-mono">auth</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Scroll-to-top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 BlogFlow. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Security
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              id="scroll-to-top-btn"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

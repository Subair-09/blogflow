import React, { useState, useEffect } from 'react';
import { Database, Server, CheckCircle2, AlertCircle, RefreshCw, X, HardDrive, Layers, Sparkles, Cloud } from 'lucide-react';
import { MongoDbStatus } from '../types';
import { reseedMongoData, fetchCloudinaryStatus } from '../lib/api';

interface MongoStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: MongoDbStatus | null;
  onRefresh: () => void;
}

export const MongoStatusModal: React.FC<MongoStatusModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefresh,
}) => {
  const [isReseeding, setIsReseeding] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [cloudinaryInfo, setCloudinaryInfo] = useState<{ configured: boolean; cloudName: string | null } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCloudinaryStatus().then((res) => {
        setCloudinaryInfo({ configured: res.configured, cloudName: res.cloudName });
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReseed = async () => {
    setIsReseeding(true);
    setActionMessage(null);
    try {
      const res = await reseedMongoData();
      setActionMessage(res.message || 'Database successfully reseeded!');
      onRefresh();
    } catch (e: any) {
      setActionMessage('Failed to reseed: ' + e.message);
    } finally {
      setIsReseeding(false);
    }
  };

  return (
    <div
      id="mongo-status-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="mongo-status-modal-content"
        className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-white">MongoDB Integration Status</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  status?.connected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {status?.connected ? 'Cluster Live' : 'Active (Local DB Fallback)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Native MongoDB Driver v7 • Full-Stack Express Server Architecture
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Connection Overview Banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            status?.connected
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-stone-50 border-stone-200 text-slate-900'
          }`}>
            {status?.connected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Server className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-bold text-sm font-serif">
                {status?.connected
                  ? 'Connected to MongoDB Cluster'
                  : 'MongoDB Engine Ready (Local In-Memory Cache Active)'}
              </div>
              <p className="text-slate-600 leading-relaxed font-sans">
                {status?.connected
                  ? `All blog posts, comments, likes, and subscribers are reading and writing directly to MongoDB database "${status.databaseName}".`
                  : 'The application backend is configured with native MongoDB collections. When MONGODB_URI is provided in secrets/environment, it automatically switches live persistence to your cluster with zero downtime.'}
              </p>
            </div>
          </div>

          {/* Database Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-slate-400 uppercase tracking-wider font-mono text-[10px] mb-1">Database Name</div>
              <div className="font-mono font-bold text-slate-900">{status?.databaseName || 'blogflow'}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-slate-400 uppercase tracking-wider font-mono text-[10px] mb-1">Database Driver</div>
              <div className="font-mono font-bold text-slate-900">{status?.driver || 'MongoDB Native v7'}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-slate-400 uppercase tracking-wider font-mono text-[10px] mb-1">Image Storage</div>
              <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-sky-600" />
                <span>{cloudinaryInfo?.configured ? `Cloudinary (${cloudinaryInfo.cloudName || 'Active'})` : 'Cloudinary Ready'}</span>
              </div>
            </div>
          </div>

          {/* MongoDB Collections & Document Counts */}
          <div>
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-slate-800 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Active MongoDB Collections</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl border border-stone-200 bg-white text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-mono">posts</div>
                <div className="text-xl font-serif font-bold text-slate-900 mt-0.5">
                  {status?.collections.posts ?? 0}
                </div>
                <div className="text-[10px] text-slate-400">articles</div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-white text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-mono">comments</div>
                <div className="text-xl font-serif font-bold text-slate-900 mt-0.5">
                  {status?.collections.comments ?? 0}
                </div>
                <div className="text-[10px] text-slate-400">discussions</div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-white text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-mono">users</div>
                <div className="text-xl font-serif font-bold text-slate-900 mt-0.5">
                  {status?.collections.users ?? 0}
                </div>
                <div className="text-[10px] text-slate-400">authors</div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-white text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-mono">subscribers</div>
                <div className="text-xl font-serif font-bold text-slate-900 mt-0.5">
                  {status?.collections.subscribers ?? 0}
                </div>
                <div className="text-[10px] text-slate-400">emails</div>
              </div>
            </div>
          </div>

          {/* Action Message Feedback */}
          {actionMessage && (
            <div className="p-3 rounded-xl bg-slate-900 text-white text-xs flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{actionMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-stone-200">
            <button
              type="button"
              onClick={handleReseed}
              disabled={isReseeding}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-stone-200"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
              <span>{isReseeding ? 'Reseeding...' : 'Reseed Sample Posts'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-stone-50 px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-stone-200 shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Status</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

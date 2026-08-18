import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Copy,
  Check,
  Link as LinkIcon,
  Sparkles,
  Cloud,
  FileImage,
} from 'lucide-react';
import { uploadImageToCloudinary, fetchCloudinaryStatus, CloudinaryUploadResponse } from '../lib/api';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  id?: string;
  folder?: string;
  aspectRatio?: 'landscape' | 'square' | 'video';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  label = 'Cover Image',
  description = 'Upload a photo from your computer directly to Cloudinary storage, or provide an image URL.',
  id = 'image-uploader',
  folder = 'blogflow_posts',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastUploadMeta, setLastUploadMeta] = useState<CloudinaryUploadResponse | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value);
  const [copied, setCopied] = useState(false);
  const [cloudinaryStatus, setCloudinaryStatus] = useState<{ configured: boolean; cloudName: string | null } | null>(null);

  useEffect(() => {
    setManualUrl(value);
  }, [value]);

  useEffect(() => {
    fetchCloudinaryStatus().then((res) => {
      setCloudinaryStatus({ configured: res.configured, cloudName: res.cloudName });
    });
  }, []);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (.jpg, .png, .webp, .gif, .avif, .svg)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Image size exceeds 20MB limit. Please choose a smaller image.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(15);

    try {
      // Read file as base64 Data URL
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file from disk'));
        reader.readAsDataURL(file);
      });

      setUploadProgress(50);

      const result = await uploadImageToCloudinary(dataUri, {
        folder,
        tags: ['blogflow', 'post_cover'],
      });

      setUploadProgress(100);
      setLastUploadMeta(result);
      onChange(result.url);
      setManualUrl(result.url);
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    onChange('');
    setManualUrl('');
    setLastUploadMeta(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isCloudinaryUrl = value.includes('cloudinary.com') || value.includes('res.cloudinary');

  return (
    <div id={id} className="space-y-3 font-sans">
      {/* Header & Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-serif font-bold uppercase tracking-wider text-slate-800">
            {label}
          </label>
          {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          {cloudinaryStatus?.configured ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 font-mono font-medium"
              title="Cloudinary Cloud Storage Active"
            >
              <Cloud className="w-3 h-3 text-sky-600 animate-pulse" />
              <span>Cloudinary Active {cloudinaryStatus.cloudName ? `(${cloudinaryStatus.cloudName})` : ''}</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-mono font-medium"
              title="Cloudinary Ready: Set credentials in Settings to enable direct cloud uploads"
            >
              <Cloud className="w-3 h-3 text-slate-400" />
              <span>Cloudinary Uploads Ready</span>
            </span>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/avif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Upload / Preview Area */}
      {value ? (
        /* Image Preview State */
        <div className="relative rounded-2xl border-2 border-stone-200 bg-stone-50 overflow-hidden group shadow-xs">
          <div className="relative max-h-72 w-full bg-slate-950/5 flex items-center justify-center overflow-hidden">
            <img
              src={value}
              alt="Uploaded cover preview"
              className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-101"
            />
            {/* Overlay Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-mono font-bold shadow-md">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {isCloudinaryUrl ? 'Cloudinary Hosted CDN' : 'Image Attached'}
              </span>
              {lastUploadMeta?.format && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-mono uppercase font-bold shadow-xs">
                  {lastUploadMeta.format}
                </span>
              )}
            </div>

            {/* Overlay Action Buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleCopyUrl}
                title="Copy Image URL"
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload & Replace Image"
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleClear}
                title="Remove Image"
                className="p-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Card Info Bar */}
          <div className="p-3 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 truncate max-w-sm">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono text-[11px] truncate">{value}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New File</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-stone-100 rounded-lg text-xs transition-colors cursor-pointer"
              >
                {showUrlInput ? 'Hide URL' : 'Edit URL'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Dropzone State */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-sky-500 bg-sky-50/80 scale-[1.01]'
              : 'border-stone-300 hover:border-slate-400 bg-stone-50/60 hover:bg-stone-50'
          }`}
        >
          {isUploading ? (
            /* Upload Progress State */
            <div className="space-y-4 py-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-inner">
                <RefreshCw className="w-7 h-7 animate-spin text-sky-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-slate-900 text-sm">
                  Uploading Image to Cloudinary...
                </h4>
                <p className="text-xs text-slate-500">
                  Optimizing and generating high-speed CDN delivery URL.
                </p>
              </div>
              {/* Progress bar */}
              <div className="w-48 max-w-full mx-auto bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            /* Normal Dropzone UI */
            <div className="space-y-3 py-2">
              <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 text-slate-700 flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                <UploadCloud className="w-7 h-7 text-sky-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-slate-900 text-sm">
                  Drag and drop your image here, or{' '}
                  <span className="text-sky-600 underline font-semibold">browse files</span>
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Supports PNG, JPG, WEBP, GIF, SVG up to 20MB. Uploads directly to Cloudinary storage.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <FileImage className="w-3.5 h-3.5 text-slate-400" /> Direct File Upload
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5 text-sky-500" /> Cloudinary CDN
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="ml-auto text-rose-500 hover:text-rose-700 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Collapsible Manual URL Input */}
      {(showUrlInput || !value) && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? 'Hide URL Input' : 'Or paste an existing image URL directly'}</span>
            </button>
          </div>

          {showUrlInput && (
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://... direct image URL"
                  className="flex-1 px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (manualUrl.trim()) {
                      onChange(manualUrl.trim());
                    }
                  }}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

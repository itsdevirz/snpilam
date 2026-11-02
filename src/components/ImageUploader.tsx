import React, { useState, useRef } from 'react';
import { Upload, X, Star, Link, Image as ImageIcon, Trash2, Plus } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  imageUrl?: string;
  onChange: (images: string[], primaryUrl?: string) => void;
  maxFiles?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  imageUrl,
  onChange,
  maxFiles = 10,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if primary is set
  const primaryImage = imageUrl || images[0] || '';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [...images];
    let processed = 0;
    const targetCount = Math.min(files.length, maxFiles - images.length);

    if (targetCount <= 0) return;

    Array.from(files).slice(0, targetCount).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        processed++;
        if (processed === targetCount) {
          const updatedPrimary = primaryImage || newImages[0] || '';
          onChange(newImages, updatedPrimary);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const trimmed = urlInput.trim();
    const updatedList = [...images, trimmed];
    const updatedPrimary = primaryImage || trimmed;
    onChange(updatedList, updatedPrimary);
    setUrlInput('');
    setShowUrlField(false);
  };

  const handleRemove = (index: number) => {
    const targetUrl = images[index];
    const updatedList = images.filter((_, i) => i !== index);
    let updatedPrimary = primaryImage;

    if (targetUrl === primaryImage) {
      updatedPrimary = updatedList[0] || '';
    }
    onChange(updatedList, updatedPrimary);
  };

  const handleSetPrimary = (url: string) => {
    onChange(images, url);
  };

  return (
    <div className="space-y-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-[#2463A6]" />
          <span>تصاویر خبر / اطلاعیه (آپلود از سیستم یا تصویر اینترنتی)</span>
        </label>
        <span className="text-[11px] text-slate-500 font-sans">
          {images.length} از {maxFiles} تصویر
        </span>
      </div>

      {/* Upload Zone & URL Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-dashed border-[#2463A6] text-[#2463A6] hover:bg-blue-50/50 rounded-lg transition-colors font-medium text-xs shadow-2xs"
        >
          <Upload className="w-4 h-4" />
          <span>انتخاب و آپلود عکس از سیستم</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          multiple
          className="hidden"
        />

        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium text-xs shadow-2xs"
        >
          <Link className="w-4 h-4 text-slate-500" />
          <span>{showUrlField ? 'بستن ورودی لینک' : 'افزودن با آدرس اینترنتی (URL)'}</span>
        </button>
      </div>

      {/* URL Input Box */}
      {showUrlField && (
        <div className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-lg">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="flex-1 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-sans dir-ltr text-left"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="bg-[#2463A6] text-white hover:bg-[#17365D] px-3 py-1.5 rounded text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>افزودن</span>
          </button>
        </div>
      )}

      {/* Images List / Thumbnails Gallery */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-1">
          {images.map((img, idx) => {
            const isPrimary = img === primaryImage;
            return (
              <div
                key={idx}
                className={`relative group aspect-video rounded-lg overflow-hidden border-2 bg-slate-900 shadow-2xs transition-all ${
                  isPrimary ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-slate-200'
                }`}
              >
                <img
                  src={img}
                  alt={`تصویر ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img)}
                    title={isPrimary ? 'تصویر اصلی' : 'تنظیم به عنوان تصویر اصلی (کاور)'}
                    className={`p-1 rounded-md transition-colors ${
                      isPrimary ? 'bg-amber-500 text-white' : 'bg-white/80 hover:bg-amber-500 hover:text-white text-slate-800'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    title="حذف این عکس"
                    className="p-1 rounded-md bg-white/80 hover:bg-rose-600 hover:text-white text-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Tag */}
                {isPrimary && (
                  <span className="absolute bottom-1 right-1 bg-amber-500 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    کاور اصلی
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg bg-white/50">
          هیچ تصوری ثبت نشده است. می‌توانید یک یا چند عکس از سیستم انتخاب نمایید.
        </div>
      )}
    </div>
  );
};

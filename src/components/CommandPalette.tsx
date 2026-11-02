import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, Bell, FileText, Award, Building2, GraduationCap, X, ArrowLeft, Command } from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import { NavigationTab, Physician, Announcement, NewsItem, ServiceItem } from '../types';

import { sanitizeSearchQuery } from '../utils/security';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenAnnouncement?: (ann: Announcement) => void;
  onOpenNews?: (news: NewsItem) => void;
  onOpenService?: (service: ServiceItem) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenAnnouncement,
  onOpenNews,
  onOpenService,
}) => {
  const { physicians, announcements, newsItems, services, regulations, facilities, educationEvents } = useDataContext();
  const [query, setQuery] = useState('');

  // Keyboard listener for Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent or key handler
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = sanitizeSearchQuery(query);
  const trimmed = cleanQuery.toLowerCase();

  const filteredPhysicians = physicians.filter(
    (p) => !trimmed || p.name.toLowerCase().includes(trimmed) || p.specialty.toLowerCase().includes(trimmed) || p.medicalRegNo.includes(trimmed)
  ).slice(0, 3);

  const filteredAnnouncements = announcements.filter(
    (a) => !trimmed || a.title.toLowerCase().includes(trimmed) || a.category.toLowerCase().includes(trimmed)
  ).slice(0, 3);

  const filteredNews = newsItems.filter(
    (n) => !trimmed || n.title.toLowerCase().includes(trimmed) || n.category.toLowerCase().includes(trimmed)
  ).slice(0, 3);

  const filteredServices = services.filter(
    (s) => !trimmed || s.title.toLowerCase().includes(trimmed) || s.category.toLowerCase().includes(trimmed)
  ).slice(0, 3);

  const totalResults =
    filteredPhysicians.length + filteredAnnouncements.length + filteredNews.length + filteredServices.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Command Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="relative bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-2xl w-full overflow-hidden text-xs z-10"
        >
          {/* Top Search Input Bar */}
          <div className="relative flex items-center border-b border-slate-200 px-4 py-3 bg-slate-50/50">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی سریع پزشک، اطلاعیه، قوانین یا خدمات (⌘K)..."
              className="w-full bg-transparent px-3 py-1 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-200/80 rounded border border-slate-300">
                <Command className="w-3 h-3" /> K
              </kbd>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Results Content */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-4">
            {/* 1. Physicians Results */}
            {filteredPhysicians.length > 0 && (
              <div className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                  <span>پزشکان و اعضا</span>
                  <span className="font-mono text-[10px]">{filteredPhysicians.length} مورد</span>
                </div>
                {filteredPhysicians.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectTab('physicians');
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-[#EFF6FC] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#2463A6]/10 text-[#2463A6] flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold text-xs">{p.name}</strong>
                        <span className="text-slate-500 text-[11px]">{p.specialty} · کد نظام: {p.medicalRegNo}</span>
                      </div>
                    </div>
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* 2. Announcements Results */}
            {filteredAnnouncements.length > 0 && (
              <div className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                  <span>اطلاعیه‌های رسمی</span>
                  <span className="font-mono text-[10px]">{filteredAnnouncements.length} مورد</span>
                </div>
                {filteredAnnouncements.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      if (onOpenAnnouncement) onOpenAnnouncement(a);
                      else onSelectTab('news');
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-[#FCECEF] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#C83E4D]/10 text-[#C83E4D] flex items-center justify-center shrink-0">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold text-xs line-clamp-1">{a.title}</strong>
                        <span className="text-slate-500 text-[11px]">{a.category} · {a.date}</span>
                      </div>
                    </div>
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* 3. Services Results */}
            {filteredServices.length > 0 && (
              <div className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                  <span>خدمات اعضا</span>
                  <span className="font-mono text-[10px]">{filteredServices.length} مورد</span>
                </div>
                {filteredServices.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (onOpenService) onOpenService(s);
                      else onSelectTab('services');
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-[#EAF6EE] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#24845B]/10 text-[#24845B] flex items-center justify-center shrink-0">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold text-xs">{s.title}</strong>
                        <span className="text-slate-500 text-[11px]">{s.category} · واحد {s.department}</span>
                      </div>
                    </div>
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Empty State */}
            {totalResults === 0 && (
              <div className="text-center py-8 text-slate-400 space-y-1">
                <Search className="w-6 h-6 mx-auto text-slate-300" />
                <p className="font-medium">نتیجه‌ای متناسب با عبارت «{query}» یافت نشد.</p>
                <p className="text-[11px] text-slate-400">عبارت دیگری را امتحان کنید یا با شماره نظام پزشکی جستجو نمایید.</p>
              </div>
            )}
          </div>

          {/* Quick Shortcuts Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-2.5 px-4 text-[11px] text-slate-400 flex items-center justify-between">
            <span>سازمان نظام پزشکی استان ایلام</span>
            <div className="flex items-center gap-3">
              <span>برای جابه‌جایی <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↑↓</kbd></span>
              <span>بستن <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">Esc</kbd></span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

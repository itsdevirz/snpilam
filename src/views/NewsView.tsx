import React, { useState } from 'react';
import { NewsItem, Announcement } from '../types';
import { useDataContext } from '../context/DataContext';
import {
  Bell,
  Calendar,
  Clock,
  ChevronLeft,
  AlertTriangle,
  FileText,
  Search,
  X,
  Share2,
} from 'lucide-react';

interface NewsViewProps {
  initialNewsId?: string;
  initialAnnouncementId?: string;
}

import { sanitizeSearchQuery } from '../utils/security';

export const NewsView: React.FC<NewsViewProps> = ({
  initialNewsId,
  initialAnnouncementId,
}) => {
  const { announcements, newsItems } = useDataContext();
  const [activeTab, setActiveTab] = useState<'all' | 'announcements' | 'news'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(() => {
    if (initialNewsId) {
      return newsItems.find((n) => n.id === initialNewsId) || null;
    }
    return null;
  });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(() => {
    if (initialAnnouncementId) {
      return announcements.find((a) => a.id === initialAnnouncementId) || null;
    }
    return null;
  });

  const filteredNews = newsItems.filter((item) => {
    if (activeTab === 'announcements') return false;
    const cleanSearch = sanitizeSearchQuery(searchQuery);
    if (!cleanSearch) return true;
    return (
      item.title.includes(cleanSearch) ||
      item.summary.includes(cleanSearch) ||
      item.category.includes(cleanSearch)
    );
  });

  const filteredAnnouncements = announcements.filter((item) => {
    if (activeTab === 'news') return false;
    const cleanSearch = sanitizeSearchQuery(searchQuery);
    if (!cleanSearch) return true;
    return (
      item.title.includes(cleanSearch) ||
      item.summary.includes(cleanSearch) ||
      item.category.includes(cleanSearch)
    );
  });

  return (
    <div className="w-full space-y-6">
      {/* Title Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <Bell className="w-4 h-4 text-[#FF9D50]" />
              <span>پایگاه اطلاع‌رسانی و روابط عمومی سازمان نظام پزشکی استان ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              اخبار، اطلاعیه‌های رسمی و ابلاغیه‌ها
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              آرشیو کامل تصمیمات هیئت مدیره، اطلاعیه‌های تمدید پروانه‌ها، هشدارهای انتظامی و رویدادهای
              جامعه پزشکی استان ایلام.
            </p>
          </div>

          <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-2xl p-4 text-xs shrink-0">
            <span className="text-brand-muted block text-[11px]">مجموع اطلاعیه‌ها و اخبار:</span>
            <span className="text-brand-dark font-sans font-bold text-base tabular-nums">
              {announcements.length + newsItems.length} مورد
            </span>
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-brand-dark text-white'
                : 'bg-white text-brand-dark hover:bg-[#F7F8F7] border border-brand-border'
            }`}
          >
            همه موارد
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'announcements'
                ? 'bg-[#FF9D50] text-white'
                : 'bg-white text-brand-dark hover:bg-[#F7F8F7] border border-brand-border'
            }`}
          >
            اطلاعیه‌های مهم و فوری ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'news'
                ? 'bg-[#1DCED8] text-white'
                : 'bg-white text-brand-dark hover:bg-[#F7F8F7] border border-brand-border'
            }`}
          >
            اخبار و رویدادها ({newsItems.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در اخبار و اطلاعیه‌ها..."
            className="w-full text-xs bg-[#F7F8F7] border border-brand-border rounded-xl pr-10 pl-3 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
          />
          <Search className="w-4 h-4 text-brand-muted absolute right-3.5 top-3" />
        </div>
      </div>

      {/* Announcements Section (if tab is all or announcements) */}
      {(activeTab === 'all' || activeTab === 'announcements') && filteredAnnouncements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF9D50]" />
            <span>اطلاعیه‌های رسمی و ابلاغیه‌های دارای مهلت:</span>
          </h3>

          <div className="space-y-3">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => setSelectedAnnouncement(ann)}
                className={`bg-white border rounded-2xl p-6 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                  ann.isUrgent ? 'border-[#FF9D50]/50 hover:border-[#FF9D50]' : 'border-brand-border hover:border-[#1DCED8]'
                }`}
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-brand-muted">
                    <span className="font-semibold text-brand-dark">
                      {ann.priority}
                    </span>
                    <span>·</span>
                    <span>{ann.category}</span>
                    <span>·</span>
                    <span>تاریخ: <span className="tabular-nums">{ann.date}</span></span>
                    {ann.expirationDate && (
                      <>
                        <span>·</span>
                        <span className="text-[#FF9D50] font-medium">مهلت: <span className="tabular-nums">{ann.expirationDate}</span></span>
                      </>
                    )}
                    {ann.docNumber && (
                      <span className="font-mono text-[11px] tabular-nums">
                        (شماره {ann.docNumber})
                      </span>
                    )}
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-brand-dark group-hover:text-[#FF9D50] transition-colors leading-snug">
                    {ann.title}
                  </h4>

                  <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                    {ann.summary}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#FF9D50] group-hover:text-[#e0843a] transition-colors">
                  <span>مشاهده متن ابلاغیه</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* News Items Section */}
      {(activeTab === 'all' || activeTab === 'news') && filteredNews.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1DCED8]" />
            <span>اخبار و گزارش‌های سازمانی:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="bg-white border border-brand-border hover:border-[#1DCED8] rounded-2xl p-6 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-brand-muted">
                    <span className="font-semibold text-brand-dark">{item.category}</span>
                    <span>·</span>
                    <span className="tabular-nums">{item.date}</span>
                    <span>·</span>
                    <span>{item.readTime}</span>
                  </div>

                  <h4 className="text-base font-bold text-brand-dark group-hover:text-[#1DCED8] transition-colors leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border mt-5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-brand-muted">منبع: {item.source}</span>
                  <span className="font-bold text-[#1DCED8] flex items-center gap-1">
                    <span>ادامه مطلب</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-brand-border">
            <div className="flex items-start justify-between pb-4 border-b border-brand-border">
              <div>
                <span className="text-xs font-semibold text-brand-muted">
                  {selectedAnnouncement.priority} · {selectedAnnouncement.category}
                </span>
                <h3 className="text-lg font-bold text-brand-dark mt-1 leading-snug">
                  {selectedAnnouncement.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-brand-muted mt-2 font-sans tabular-nums">
                  <span>تاریخ ابلاغ: {selectedAnnouncement.date}</span>
                  {selectedAnnouncement.expirationDate && (
                    <span>مهلت اقدام: {selectedAnnouncement.expirationDate}</span>
                  )}
                  {selectedAnnouncement.docNumber && (
                    <span>شماره: {selectedAnnouncement.docNumber}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-[#F7F8F7]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-brand-dark leading-relaxed space-y-3 bg-[#F7F8F7] p-5 rounded-2xl border border-brand-border whitespace-pre-line">
              {selectedAnnouncement.content}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-brand-border text-xs">
              <span className="text-brand-muted">دبیرخانه نظام پزشکی استان ایلام</span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="bg-[#F7F8F7] hover:bg-slate-200 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-brand-border">
            <div className="flex items-start justify-between pb-4 border-b border-brand-border">
              <div>
                <span className="text-xs font-semibold text-brand-muted">
                  {selectedNews.category}
                </span>
                <h3 className="text-lg font-bold text-brand-dark mt-1 leading-snug">
                  {selectedNews.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-brand-muted mt-2 font-sans tabular-nums">
                  <span>تاریخ: {selectedNews.date}</span>
                  <span>زمان مطالعه: {selectedNews.readTime}</span>
                  <span>منبع: {selectedNews.source}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNews(null)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-[#F7F8F7]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-brand-dark leading-relaxed space-y-3 bg-[#F7F8F7] p-5 rounded-2xl border border-brand-border whitespace-pre-line">
              {selectedNews.content}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-brand-border text-xs">
              <span className="text-brand-muted">روابط عمومی نظام پزشکی ایلام</span>
              <button
                onClick={() => setSelectedNews(null)}
                className="bg-[#FF9D50] hover:bg-[#e0843a] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

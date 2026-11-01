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
    return (
      item.title.includes(searchQuery) ||
      item.summary.includes(searchQuery) ||
      item.category.includes(searchQuery)
    );
  });

  const filteredAnnouncements = announcements.filter((item) => {
    if (activeTab === 'news') return false;
    return (
      item.title.includes(searchQuery) ||
      item.summary.includes(searchQuery) ||
      item.category.includes(searchQuery)
    );
  });

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-semibold">
              <Bell className="w-4 h-4" />
              <span>پایگاه اطلاع‌رسانی و روابط عمومی سازمان</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              اخبار، اطلاعیه‌های رسمی و ابلاغیه‌های نظام پزشکی ایلام
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              آرشیو کامل تصمیمات هیئت مدیره، اطلاعیه‌های تمدید پروانه‌ها، هشدارهای انتظامی و رویدادهای
              جامعه پزشکی استان.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-slate-500">
              مجموع اطلاعیه‌ها و اخبار: {announcements.length + newsItems.length} مورد
            </span>
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-xs px-4 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'all'
                ? 'bg-[#17365D] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            همه موارد
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`text-xs px-4 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'announcements'
                ? 'bg-[#C83E4D] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            اطلاعیه‌های مهم و فوری ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`text-xs px-4 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'news'
                ? 'bg-[#2463A6] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            اخبار و رویدادها ({newsItems.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در اخبار و اطلاعیه‌ها..."
            className="w-full text-xs bg-white border border-[#E2E8F0] rounded-lg pr-8 pl-3 py-2 text-slate-800 focus:outline-none focus:border-[#2463A6]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
        </div>
      </div>

      {/* Announcements Section (if tab is all or announcements) */}
      {(activeTab === 'all' || activeTab === 'announcements') && filteredAnnouncements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#C83E4D] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>اطلاعیه‌های رسمی و ابلاغیه‌های دارای مهلت:</span>
          </h3>

          <div className="space-y-3">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => setSelectedAnnouncement(ann)}
                className={`bg-white border rounded-xl p-5 shadow-xs transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  ann.isUrgent ? 'border-[#C83E4D]/40 hover:border-[#C83E4D]' : 'border-[#E2E8F0] hover:border-[#2463A6]'
                }`}
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        ann.isUrgent ? 'bg-red-50 text-[#C83E4D]' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-slate-500">{ann.category}</span>
                    <span>·</span>
                    <span className="text-slate-500 font-sans">تاریخ: {ann.date}</span>
                    {ann.expirationDate && (
                      <>
                        <span>·</span>
                        <span className="text-amber-800 font-medium">مهلت: {ann.expirationDate}</span>
                      </>
                    )}
                    {ann.docNumber && (
                      <span className="text-slate-400 font-mono text-[11px]">
                        (ش. {ann.docNumber})
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-[#17365D] group-hover:text-[#C83E4D] transition-colors leading-snug">
                    {ann.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.summary}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[#C83E4D]">
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
          <h3 className="text-sm font-bold text-[#17365D] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2463A6]" />
            <span>اخبار و گزارش‌های سازمانی:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-[#2463A6]">{item.category}</span>
                    <span>·</span>
                    <span className="font-sans">{item.date}</span>
                    <span>·</span>
                    <span>{item.readTime}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#17365D] group-hover:text-[#2463A6] transition-colors leading-snug mb-2.5">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">منبع: {item.source}</span>
                  <span className="font-semibold text-[#2463A6] flex items-center gap-1">
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#C83E4D] bg-[#FCECEF] px-2.5 py-0.5 rounded">
                  {selectedAnnouncement.priority} - {selectedAnnouncement.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#17365D] mt-2 leading-snug">
                  {selectedAnnouncement.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-sans">
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
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 whitespace-pre-line">
              {selectedAnnouncement.content}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-400">دبیرخانه نظام پزشکی استان ایلام</span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-lg"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#2463A6] bg-[#EFF6FC] px-2.5 py-0.5 rounded">
                  {selectedNews.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#17365D] mt-2 leading-snug">
                  {selectedNews.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-sans">
                  <span>تاریخ: {selectedNews.date}</span>
                  <span>زمان مطالعه: {selectedNews.readTime}</span>
                  <span>منبع: {selectedNews.source}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNews(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 whitespace-pre-line">
              {selectedNews.content}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-400">روابط عمومی نظام پزشکی ایلام</span>
              <button
                onClick={() => setSelectedNews(null)}
                className="bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2 rounded-lg"
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

import React, { useState } from 'react';
import { NavigationTab, Announcement, NewsItem, EducationalEvent, ServiceItem, ClassifiedItem } from '../types';
import { PriorityActions } from '../components/PriorityActions';
import { COUNCIL_INFO, NATIONAL_SYSTEMS } from '../data/councilData';
import { useDataContext } from '../context/DataContext';
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ArrowLeft,
  Search,
  ExternalLink,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Building,
  GraduationCap,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface HomeViewProps {
  onSelectTab: (tab: NavigationTab) => void;
  onOpenAnnouncement?: (announcement: Announcement) => void;
  onOpenNews?: (news: NewsItem) => void;
  onOpenService?: (service: ServiceItem) => void;
  onOpenClassified?: (classified: ClassifiedItem) => void;
  onQuickPhysicianSearch?: (query: string, specialty: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  onOpenAnnouncement,
  onOpenNews,
  onOpenService,
  onOpenClassified,
  onQuickPhysicianSearch,
}) => {
  const { announcements, newsItems, services, educationEvents, classifieds } = useDataContext();
  const [quickSearchTerm, setQuickSearchTerm] = useState('');
  const [quickSpecialty, setQuickSpecialty] = useState('');

  const urgentAnnouncements = announcements.filter((a) => a.isUrgent);
  const featuredNews = newsItems.find((n) => n.isFeatured) || newsItems[0] || {
    id: 'empty',
    title: 'خبر یافت نشد',
    date: '---',
    category: 'اطلاعیه',
    summary: '',
    content: '',
    readTime: '۱ دقیقه',
    source: 'روابط عمومی',
  };
  const secondaryNews = newsItems.filter((n) => n.id !== featuredNews.id).slice(0, 3);
  const upcomingEvents = educationEvents.slice(0, 3);
  const activeClassifieds = classifieds.filter((c) => c.status === 'active').slice(0, 3);
  const topServices = services.slice(0, 6);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onQuickPhysicianSearch) {
      onQuickPhysicianSearch(quickSearchTerm, quickSpecialty);
    } else {
      onSelectTab('physicians');
    }
  };

  return (
    <div className="w-full space-y-10 sm:space-y-12">
      {/* A. Institutional Introduction & Welcome Section (Minimal & sleek hero) */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1.5 h-full bg-[#2463A6]"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#2463A6] bg-[#EFF6FC] px-2.5 py-1 rounded-md border border-[#2463A6]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2463A6]"></span>
              <span>پورتال خدمات الکترونیک سازمان نظام پزشکی استان ایلام</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D] tracking-tight">
              سامانه جامع خدمات اعضا و استعلام پروانه پزشکی
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              مرجع رسمی صدور و تمدید پروانه مطب، استعلام اصالت اعضا، برنامه‌های بازآموزی CME و خدمات دیجیتال جامعه پزشکی استان ایلام.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0 border-t md:border-t-0 md:border-r border-slate-100 pt-4 md:pt-0 md:pr-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#24845B]" />
                <span>استعلام آنلاین اصالت پروانه</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Building className="w-4 h-4 text-[#2463A6]" />
                <span>پوشش کلیه شهرستان‌های استان</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. Four Priority Actions Panel (Mandatory prominent section) */}
      <PriorityActions
        onSelectAction={onSelectTab}
        urgentCount={urgentAnnouncements.length}
      />

      {/* C. Urgent Official Announcements (High-priority indicators, distinct, non-alarming) */}
      {urgentAnnouncements.length > 0 && (
        <section aria-labelledby="urgent-announcements-heading" className="w-full">
          <div className="bg-[#FFF8F8] border border-[#F5C2C7] rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#F5C2C7]/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C83E4D] text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="urgent-announcements-heading"
                    className="text-base font-bold text-[#C83E4D]"
                  >
                    اطلاعیه‌های مهم و ابلاغیه‌های فوری
                  </h3>
                  <p className="text-xs text-slate-600">
                    الزامات قانونی دارای مهلت اقدام ویژه اعضا و مراکز درمانی استان
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectTab('news')}
                className="text-xs font-medium text-[#C83E4D] hover:underline flex items-center gap-1"
              >
                <span>آرشیو همه</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {urgentAnnouncements.length === 0 ? (
                <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 text-center text-xs text-slate-500">
                  در حال حاضر اطلاعیه فوری جدیدی ثبت نشده است.
                </div>
              ) : (
                urgentAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => onOpenAnnouncement && onOpenAnnouncement(ann)}
                    className="bg-white border border-[#E2E8F0] hover:border-[#C83E4D] rounded-lg p-4 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-semibold text-[#C83E4D]">[{ann.priority}]</span>
                        <span className="text-slate-500">{ann.category}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500 font-sans">تاریخ: {ann.date}</span>
                        {ann.expirationDate && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-amber-700 font-medium">
                              مهلت: {ann.expirationDate}
                            </span>
                          </>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#17365D] group-hover:text-[#C83E4D] transition-colors">
                        {ann.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                        {ann.summary}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[#C83E4D] group-hover:translate-x-[-2px] transition-transform">
                      <span>مشاهده ابلاغیه</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* D. News & Official Updates (Editorial portal style: 1 featured + compact list) */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-lg font-bold text-[#17365D]">اخبار و رویدادهای سازمانی</h3>
            <p className="text-xs text-slate-500">
              آخرین تصمیمات، گزارش جلسات و اخبار صنفی جامعه پزشکی استان ایلام
            </p>
          </div>
          <button
            onClick={() => onSelectTab('news')}
            className="text-xs font-semibold text-[#2463A6] hover:underline flex items-center gap-1"
          >
            <span>مشاهده همه اخبار</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {newsItems.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center text-xs text-slate-500">
            در حال حاضر خبر یا رویداد جدیدی منتشر نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured News Item (7 cols) */}
            <div
              onClick={() => onOpenNews && onOpenNews(featuredNews)}
              className="lg:col-span-7 bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-5 sm:p-6 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                  <span className="font-semibold text-[#2463A6]">{featuredNews.category}</span>
                  <span>·</span>
                  <span className="font-sans">{featuredNews.date}</span>
                  <span>·</span>
                  <span>{featuredNews.readTime} زمان مطالعه</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#17365D] group-hover:text-[#2463A6] transition-colors leading-snug mb-3">
                  {featuredNews.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {featuredNews.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">منبع: {featuredNews.source}</span>
                <span className="font-semibold text-[#2463A6] flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
                  <span>متن کامل خبر</span>
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Secondary News List (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {secondaryNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenNews && onOpenNews(item)}
                  className="bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
                      <span className="text-[#2463A6] font-medium">{item.category}</span>
                      <span>·</span>
                      <span className="font-sans">{item.date}</span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#17365D] group-hover:text-[#2463A6] transition-colors line-clamp-2 leading-relaxed">
                      {item.title}
                    </h5>
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-[11px] text-slate-400 group-hover:text-[#2463A6] font-medium inline-flex items-center gap-1">
                      <span>ادامه مطلب</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* G. Medical Professional Search Quick Entry Point (Direct search jump) */}
      <section className="bg-white border border-[#24845B]/30 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#24845B] font-semibold mb-1">
                <Search className="w-4 h-4" />
                <span>سامانه جستجوی پزشکان و پیراپزشکان استان ایلام</span>
              </div>
              <h3 className="text-lg font-bold text-[#17365D]">
                استعلام شماره نظام پزشکی، اطلاعات مطب و تخصص
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                امکان جستجو بر اساس نام پزشک، گروه تخصصی، شهرستان و نوع خدمات پزشکی
              </p>
            </div>
            <button
              onClick={() => onSelectTab('physicians')}
              className="text-xs font-semibold text-[#24845B] border border-[#24845B] hover:bg-[#24845B] hover:text-white px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
            >
              بانک کامل پزشکان و دندانپزشکان
            </button>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <input
                type="text"
                value={quickSearchTerm}
                onChange={(e) => setQuickSearchTerm(e.target.value)}
                placeholder="نام پزشک، شماره نظام یا درمانگاه..."
                className="w-full text-xs bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-[#202B38] focus:bg-white focus:outline-none focus:border-[#24845B]"
              />
            </div>
            <div className="sm:col-span-4">
              <select
                value={quickSpecialty}
                onChange={(e) => setQuickSpecialty(e.target.value)}
                className="w-full text-xs bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-[#202B38] focus:bg-white focus:outline-none focus:border-[#24845B]"
              >
                <option value="">همه تخصص‌ها و گروه‌ها</option>
                <option value="پزشک عمومی">پزشک عمومی</option>
                <option value="متخصص داخلی">متخصص داخلی و فوق تخصص</option>
                <option value="جراحی">جراحی عمومی و تخصصی</option>
                <option value="دندانپزشکی">دندانپزشک</option>
                <option value="داروسازی">داروساز / داروخانه</option>
                <option value="زنان و زایمان">زنان، زایمان و نازایی</option>
                <option value="کودکان">کودکان و نوزادان</option>
                <option value="قلب و عروق">قلب و عروق</option>
                <option value="ارتوپدی">ارتوپدی و مفاصل</option>
                <option value="چشم‌پزشکی">چشم‌پزشکی</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full h-full text-xs bg-[#24845B] hover:bg-[#1b6746] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>جستجو</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* F. Frequently Used Member Services (Direct access to most needed tasks) */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-lg font-bold text-[#17365D]">خدمات پرکاربرد اعضا</h3>
            <p className="text-xs text-slate-500">
              راهنمای صدور و تمدید پروانه مطب، مدارک مورد نیاز و فرآیندهای اداری
            </p>
          </div>
          <button
            onClick={() => onSelectTab('services')}
            className="text-xs font-semibold text-[#2463A6] hover:underline flex items-center gap-1"
          >
            <span>مشاهده همه خدمات (۱۲ خدمت)</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {topServices.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center text-xs text-slate-500">
            در حال حاضر خدمتی در سامانه ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topServices.map((svc) => (
              <div
                key={svc.id}
                onClick={() => onOpenService && onOpenService(svc)}
                className="bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-4 sm:p-5 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                    <span className="font-medium text-[#2463A6] bg-[#EFF6FC] px-2 py-0.5 rounded">
                      {svc.category}
                    </span>
                    <span>{svc.processingTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#17365D] group-hover:text-[#2463A6] transition-colors mb-2">
                    {svc.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {svc.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{svc.department}</span>
                  <span className="font-semibold text-[#2463A6] flex items-center gap-1">
                    <span>راهنما و مدارک</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* E. Upcoming Events (CME & Scientific Conferences) */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-lg font-bold text-[#17365D]">برنامه‌های آموزش مداوم و بازآموزی</h3>
            <p className="text-xs text-slate-500">
              کارگاه‌های عملی، وبینارهای کشوری و کنفرانس‌های دارای امتیاز بازآموزی
            </p>
          </div>
          <button
            onClick={() => onSelectTab('education')}
            className="text-xs font-semibold text-[#2463A6] hover:underline flex items-center gap-1"
          >
            <span>تقویم کامل دوره‌ها</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center text-xs text-slate-500">
            در حال حاضر برنامه آموزشی جدیدی ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectTab('education')}
                className="bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-5 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500">{evt.type}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {evt.cmeCredits} امتیاز بازآموزی
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#17365D] group-hover:text-[#2463A6] transition-colors mb-2 leading-snug">
                    {evt.title}
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>تاریخ: {evt.date} ({evt.time})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="line-clamp-1">{evt.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">کد سامانه: {evt.officialSystemCode}</span>
                  <span className="font-semibold text-[#2463A6] flex items-center gap-1">
                    <span>جزئیات و ثبت‌نام</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* H. Community Medical Opportunities (Classifieds) */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-lg font-bold text-[#17365D]">نیازمندی‌های جامعه پزشکی استان</h3>
            <p className="text-xs text-slate-500">
              دعوت به همکاری، مسئول فنی، واگذاری مطب و تجهیزات درمانی استان ایلام
            </p>
          </div>
          <button
            onClick={() => onSelectTab('classifieds')}
            className="text-xs font-semibold text-[#C77920] hover:underline flex items-center gap-1"
          >
            <span>مشاهده همه آگهی‌ها</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {activeClassifieds.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center text-xs text-slate-500">
            در حال حاضر آگهی نیازمندی فعال ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeClassifieds.map((cls) => (
              <div
                key={cls.id}
                onClick={() => onOpenClassified && onOpenClassified(cls)}
                className="bg-white border border-[#E2E8F0] hover:border-[#C77920] rounded-xl p-5 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#C77920] font-semibold bg-[#FDF4E7] px-2 py-0.5 rounded">
                      {cls.category}
                    </span>
                    <span className="text-slate-500">شهرستان: {cls.county}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#17365D] group-hover:text-[#C77920] transition-colors mb-2 leading-snug">
                    {cls.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {cls.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-sans">ثبت: {cls.publishDate}</span>
                  <span className="font-semibold text-[#C77920] flex items-center gap-1">
                    <span>اطلاعات تماس</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>



      {/* I. National Systems & Verified Links */}
      <section className="w-full">
        <div className="mb-4 pb-2 border-b border-[#E2E8F0]">
          <h3 className="text-lg font-bold text-[#17365D]">سامانه‌های ملی و درگاه‌های رسمی کشور</h3>
          <p className="text-xs text-slate-500">
            دسترسی سریع به سامانه‌های ستادی وزارت بهداشت، سازمان کل و امور مالیاتی
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {NATIONAL_SYSTEMS.map((sys) => (
            <a
              key={sys.url}
              href={sys.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-3.5 text-center flex flex-col items-center justify-between gap-2 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FC] text-[#2463A6] flex items-center justify-center group-hover:bg-[#2463A6] group-hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#17365D] group-hover:text-[#2463A6] transition-colors leading-tight mb-1">
                  {sys.title}
                </h5>
                <p className="text-[10px] text-slate-500 line-clamp-1">{sys.badge}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* J. Council Information & Working Hours Summary */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <h5 className="font-bold text-sm text-[#17365D] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#2463A6]" />
              <span>نشانی ساختمان مرکزی</span>
            </h5>
            <p className="text-slate-600 leading-relaxed">{COUNCIL_INFO.address}</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-sm text-[#17365D] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#2463A6]" />
              <span>ساعات پذیرش مراجعین</span>
            </h5>
            <p className="text-slate-600">{COUNCIL_INFO.workingDays}</p>
            <p className="text-slate-600">{COUNCIL_INFO.workingHours}</p>
            <p className="text-slate-500">{COUNCIL_INFO.thursdayHours}</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-sm text-[#17365D] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#2463A6]" />
              <span>پاسخگویی تلفنی و داخلی‌ها</span>
            </h5>
            <p className="text-slate-600">مرکز تلفن: {COUNCIL_INFO.phoneCentral}</p>
            <button
              onClick={() => onSelectTab('contact')}
              className="text-[#2463A6] hover:underline font-semibold"
            >
              مشاهده راهنمای شماره داخلی تمامی واحدها ←
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

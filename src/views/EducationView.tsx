import React, { useState } from 'react';
import { EducationalEvent } from '../types';
import { useDataContext } from '../context/DataContext';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  User,
  ExternalLink,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const EducationView: React.FC = () => {
  const { educationEvents } = useDataContext();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'archive'>('upcoming');
  const [filterType, setFilterType] = useState('همه');
  const [selectedEvent, setSelectedEvent] = useState<EducationalEvent | null>(null);

  const upcomingEvents = educationEvents.filter((e) => e.registrationStatus !== 'completed');
  const pastEvents = educationEvents.filter((e) => e.registrationStatus === 'completed');

  const displayedList = (activeTab === 'upcoming' ? upcomingEvents : pastEvents).filter((e) => {
    if (filterType === 'همه') return true;
    return e.type === filterType;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>کمیسیون آموزش و پژوهش مداوم پزشکی</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              آموزش مداوم و بازآموزی جامعه پزشکی استان ایلام
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              برگزاری دوره‌های بازآموزی، سمینارهای علمی، کارگاه‌های مهارتی بالینی و وبینارهای
              کشوری با اعطای امتیاز بازآموزی رسمی در سامانه آموزش مداوم.
            </p>
          </div>

          <a
            href="https://cme.irimc.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs bg-[#2463A6] text-white hover:bg-[#17365D] font-bold px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <span>ورود به سامانه جامع آموزش مداوم (CME)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* CME Requirements Notice Box */}
      <div className="bg-[#EFF6FC] border border-[#2463A6]/30 rounded-xl p-4 sm:p-5 text-xs text-slate-800 space-y-2">
        <div className="flex items-center gap-2 font-bold text-[#17365D] text-sm">
          <Award className="w-4 h-4 text-[#2463A6]" />
          <span>قانون امتیازات بازآموزی تمدید ۵ ساله پروانه مطب:</span>
        </div>
        <p className="leading-relaxed">
          بر اساس مصوبات شورای عالی انقلاب فرهنگی و وزارت بهداشت، تمامی پزشکان، دندانپزشکان و
          داروسازان موظف به کسب حداقل <strong>۲۵ امتیاز سالانه (مجموعاً ۱۲۵ امتیاز برای دوره ۵ ساله)</strong>{' '}
          می‌باشند. کارنامه امتیازات به صورت مستقیم و برخط به سامانه پروانه‌های نظام پزشکی ایلام
          متصل است.
        </p>
      </div>

      {/* Tabs & Type Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`text-xs px-4 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-[#17365D] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            دوره‌های پیش‌رو و در حال ثبت‌نام ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`text-xs px-4 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'archive'
                ? 'bg-[#17365D] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            آرشیو دوره‌های برگزارشده ({pastEvents.length})
          </button>
        </div>

        {/* Type select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">نوع برنامه:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:border-[#2463A6]"
          >
            <option value="همه">همه قالب‌ها</option>
            <option value="کارگاه عملی حضوری">کارگاه عملی حضوری</option>
            <option value="وبینار برخط">وبینار برخط</option>
            <option value="کنفرانس علمی">کنفرانس علمی</option>
          </select>
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedList.map((evt) => (
          <div
            key={evt.id}
            className="bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded font-medium">
                  {evt.type}
                </span>

                <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{evt.cmeCredits} امتیاز بازآموزی</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-[#17365D] mb-3 leading-snug">
                {evt.title}
              </h3>

              {/* Key metadata */}
              <div className="space-y-2 text-xs text-slate-700 mb-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>تاریخ برگزاری: <strong>{evt.date}</strong> ساعت {evt.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>مدرس / دبیر علمی: {evt.instructor}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed line-clamp-1">{evt.venue}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    ظرفیت: {evt.capacity} نفر (ثبت‌نام شده: {evt.registeredCount} نفر)
                  </span>
                </div>
              </div>

              {/* Target audience */}
              <div className="mb-4">
                <span className="text-[11px] text-slate-500 block mb-1">گروه‌های هدف:</span>
                <div className="flex flex-wrap gap-1">
                  {evt.targetAudience.map((aud, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {aud}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-mono">
                شناسه سامانه: {evt.officialSystemCode}
              </span>

              {evt.registrationStatus === 'completed' ? (
                <span className="text-slate-400 font-medium">دوره پایان یافته است</span>
              ) : (
                <a
                  href="https://cme.irimc.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#2463A6] hover:underline flex items-center gap-1"
                >
                  <span>ثبت‌نام در سامانه کشوری</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

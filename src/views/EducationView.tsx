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

  const upcomingEvents = educationEvents.filter((e) => e.registrationStatus !== 'completed');
  const pastEvents = educationEvents.filter((e) => e.registrationStatus === 'completed');

  const displayedList = (activeTab === 'upcoming' ? upcomingEvents : pastEvents).filter((e) => {
    if (filterType === 'همه') return true;
    return e.type === filterType;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <GraduationCap className="w-4 h-4 text-[#FF9D50]" />
              <span>کمیسیون آموزش و پژوهش مداوم پزشکی استان ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              آموزش مداوم و بازآموزی جامعه پزشکی
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              برگزاری دوره‌های بازآموزی، سمینارهای علمی، کارگاه‌های مهارتی بالینی و وبینارهای
              کشوری با اعطای امتیاز بازآموزی رسمی در سامانه آموزش مداوم.
            </p>
          </div>

          <a
            href="https://cme.irimc.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs bg-[#FF9D50] hover:bg-[#e0843a] text-white font-bold px-5 py-3 rounded-xl transition-all shadow-xs shrink-0"
          >
            <span>ورود به سامانه جامع آموزش مداوم (CME)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* CME Notice Box */}
      <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-2xl p-5 sm:p-6 text-xs text-brand-dark space-y-2">
        <div className="flex items-center gap-2 font-bold text-brand-dark text-sm">
          <Award className="w-4 h-4 text-[#FF9D50]" />
          <span>قانون امتیازات بازآموزی تمدید ۵ ساله پروانه مطب:</span>
        </div>
        <p className="leading-relaxed text-brand-muted">
          بر اساس مصوبات شورای عالی انقلاب فرهنگی و وزارت بهداشت، تمامی پزشکان، دندانپزشکان و
          داروسازان موظف به کسب حداقل <strong className="text-brand-dark font-sans tabular-nums">۲۵ امتیاز سالانه (مجموعاً ۱۲۵ امتیاز برای دوره ۵ ساله)</strong>{' '}
          می‌باشند. کارنامه امتیازات به صورت مستقیم و برخط به سامانه پروانه‌های نظام پزشکی ایلام
          متصل است.
        </p>
      </div>

      {/* Tabs & Type Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-brand-dark text-white'
                : 'bg-white text-brand-dark hover:bg-[#F7F8F7] border border-brand-border'
            }`}
          >
            دوره‌های پیش‌رو و در حال ثبت‌نام ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'archive'
                ? 'bg-brand-dark text-white'
                : 'bg-white text-brand-dark hover:bg-[#F7F8F7] border border-brand-border'
            }`}
          >
            آرشیو دوره‌های برگزارشده ({pastEvents.length})
          </button>
        </div>

        {/* Type select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-brand-muted">نوع برنامه:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#F7F8F7] border border-brand-border rounded-xl px-3.5 py-2 text-brand-dark focus:outline-none focus:border-[#FF9D50]"
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
            className="bg-white border border-brand-border hover:border-[#FF9D50]/50 rounded-2xl p-6 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-brand-border">
                <span className="text-brand-muted font-medium">
                  {evt.type}
                </span>

                <span className="font-bold text-[#55E07E] bg-[#55E07E]/10 px-3 py-1 rounded-lg border border-[#55E07E]/20 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#55E07E]" />
                  <span className="tabular-nums">{evt.cmeCredits} امتیاز بازآموزی</span>
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-brand-dark group-hover:text-[#FF9D50] transition-colors leading-snug">
                {evt.title}
              </h3>

              {/* Key metadata */}
              <div className="space-y-2.5 text-xs text-brand-dark bg-[#F7F8F7] p-4 rounded-xl border border-brand-border">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF9D50] shrink-0" />
                  <span>تاریخ برگزاری: <strong className="tabular-nums">{evt.date}</strong> ساعت <span className="tabular-nums">{evt.time}</span></span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1DCED8] shrink-0" />
                  <span>مدرس / دبیر علمی: <strong>{evt.instructor}</strong></span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-muted shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{evt.venue}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-muted shrink-0" />
                  <span>
                    ظرفیت: <strong className="tabular-nums">{evt.capacity}</strong> نفر (ثبت‌نام شده: <strong className="tabular-nums">{evt.registeredCount}</strong> نفر)
                  </span>
                </div>
              </div>

              {/* Target audience */}
              <div>
                <span className="text-[11px] text-brand-muted block mb-1.5">گروه‌های هدف:</span>
                <div className="flex flex-wrap gap-1.5">
                  {evt.targetAudience.map((aud, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-[#F7F8F7] text-brand-muted border border-brand-border px-2.5 py-0.5 rounded-lg"
                    >
                      {aud}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-4 border-t border-brand-border mt-5 flex items-center justify-between text-xs">
              <span className="text-[11px] text-brand-muted font-mono tabular-nums">
                شناسه سامانه: {evt.officialSystemCode}
              </span>

              {evt.registrationStatus === 'completed' ? (
                <span className="text-brand-muted font-medium">دوره پایان یافته است</span>
              ) : (
                <a
                  href="https://cme.irimc.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#FF9D50] hover:text-[#e0843a] flex items-center gap-1.5 transition-colors"
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

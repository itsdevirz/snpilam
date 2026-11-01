import React from 'react';
import { NavigationTab } from '../types';
import { UserCheck, Search, Briefcase, AlertCircle, ArrowLeft } from 'lucide-react';

interface PriorityActionsProps {
  onSelectAction: (tab: NavigationTab) => void;
  urgentCount?: number;
}

export const PriorityActions: React.FC<PriorityActionsProps> = ({
  onSelectAction,
  urgentCount = 2,
}) => {
  return (
    <section aria-label="اقدامات دارای اولویت" className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* ۱. خدمات اعضا (Blue) */}
        <button
          onClick={() => onSelectAction('services')}
          className="group relative flex flex-col justify-between p-3.5 sm:p-5 rounded-xl border border-[#2463A6]/30 bg-white hover:bg-[#EFF6FC]/70 hover:border-[#2463A6] transition-all text-right shadow-xs hover:shadow-md cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between w-full mb-2.5 sm:mb-3 gap-1.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-[#EFF6FC] text-[#2463A6] flex items-center justify-center shrink-0 group-hover:bg-[#2463A6] group-hover:text-white transition-colors">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-[#2463A6] bg-[#EFF6FC] px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap shrink-0">
              <span className="hidden sm:inline">سامانه </span>اعضا
            </span>
          </div>

          <div>
            <h3 className="text-sm sm:text-lg font-bold text-[#17365D] group-hover:text-[#2463A6] transition-colors mb-1">
              خدمات اعضا
            </h3>
            <p className="text-[11px] sm:text-xs text-[#667085] leading-relaxed line-clamp-2">
              تمدید پروانه مطب، صدور گواهی، امور عضویت، پایانه‌های مالیاتی و فرم‌ها
            </p>
          </div>

          <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#2463A6]">
            <span className="truncate">ورود به میز خدمات</span>
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:-translate-x-1 transition-transform shrink-0" />
          </div>
        </button>

        {/* ۲. جستجوی پزشک (Green) */}
        <button
          onClick={() => onSelectAction('physicians')}
          className="group relative flex flex-col justify-between p-3.5 sm:p-5 rounded-xl border border-[#24845B]/30 bg-white hover:bg-[#EAF6EE]/70 hover:border-[#24845B] transition-all text-right shadow-xs hover:shadow-md cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between w-full mb-2.5 sm:mb-3 gap-1.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-[#EAF6EE] text-[#24845B] flex items-center justify-center shrink-0 group-hover:bg-[#24845B] group-hover:text-white transition-colors">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-[#24845B] bg-[#EAF6EE] px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap shrink-0">
              <span className="hidden sm:inline">سامانه </span>استعلام
            </span>
          </div>

          <div>
            <h3 className="text-sm sm:text-lg font-bold text-[#17365D] group-hover:text-[#24845B] transition-colors mb-1">
              جستجوی پزشک
            </h3>
            <p className="text-[11px] sm:text-xs text-[#667085] leading-relaxed line-clamp-2">
              بانک اطلاعات پزشکان، دندانپزشکان، داروسازان و استعلام اصالت پروانه طبابت
            </p>
          </div>

          <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#24845B]">
            <span className="truncate">جستجو در بانک اعضا</span>
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:-translate-x-1 transition-transform shrink-0" />
          </div>
        </button>

        {/* ۳. نیازمندی‌ها (Orange) */}
        <button
          onClick={() => onSelectAction('classifieds')}
          className="group relative flex flex-col justify-between p-3.5 sm:p-5 rounded-xl border border-[#C77920]/30 bg-white hover:bg-[#FDF4E7]/70 hover:border-[#C77920] transition-all text-right shadow-xs hover:shadow-md cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between w-full mb-2.5 sm:mb-3 gap-1.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-[#FDF4E7] text-[#C77920] flex items-center justify-center shrink-0 group-hover:bg-[#C77920] group-hover:text-white transition-colors">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-[#C77920] bg-[#FDF4E7] px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap shrink-0">
              <span className="hidden sm:inline">فرصت‌های </span>شغلی
            </span>
          </div>

          <div>
            <h3 className="text-sm sm:text-lg font-bold text-[#17365D] group-hover:text-[#C77920] transition-colors mb-1">
              نیازمندی‌ها
            </h3>
            <p className="text-[11px] sm:text-xs text-[#667085] leading-relaxed line-clamp-2">
              استخدام پزشک و داروساز، واگذاری مطب، مسئول فنی و تجهیزات پزشکی استان
            </p>
          </div>

          <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#C77920]">
            <span className="truncate">مشاهده و ثبت آگهی</span>
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:-translate-x-1 transition-transform shrink-0" />
          </div>
        </button>

        {/* ۴. اطلاعیه‌های مهم (Red) */}
        <button
          onClick={() => onSelectAction('news')}
          className="group relative flex flex-col justify-between p-3.5 sm:p-5 rounded-xl border border-[#C83E4D]/30 bg-white hover:bg-[#FCECEF]/70 hover:border-[#C83E4D] transition-all text-right shadow-xs hover:shadow-md cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between w-full mb-2.5 sm:mb-3 gap-1.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-[#FCECEF] text-[#C83E4D] flex items-center justify-center shrink-0 group-hover:bg-[#C83E4D] group-hover:text-white transition-colors">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            {urgentCount > 0 && (
              <span className="text-[10px] sm:text-[11px] font-medium text-[#C83E4D] bg-[#FCECEF] px-1.5 sm:px-2 py-0.5 rounded flex items-center gap-1 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C83E4D] animate-pulse shrink-0"></span>
                <span>{urgentCount} <span className="hidden sm:inline">اطلاعیه </span>فوری</span>
              </span>
            )}
          </div>

          <div>
            <h3 className="text-sm sm:text-lg font-bold text-[#17365D] group-hover:text-[#C83E4D] transition-colors mb-1">
              اطلاعیه‌های مهم
            </h3>
            <p className="text-[11px] sm:text-xs text-[#667085] leading-relaxed line-clamp-2">
              ابلاغیه‌های فوری پروانه‌ها، هشدارهای انتظامی، مهلت‌های مالیاتی و بخشنامه‌ها
            </p>
          </div>

          <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#C83E4D]">
            <span className="truncate">مشاهده همه اطلاعیه‌ها</span>
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:-translate-x-1 transition-transform shrink-0" />
          </div>
        </button>
      </div>
    </section>
  );
};

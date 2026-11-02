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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ۱. خدمات اعضا */}
        <button
          onClick={() => onSelectAction('services')}
          className="group text-right p-5 rounded-xl border border-[#E9ECEF] bg-white hover:border-[#FF9D50] hover:bg-[#F7F8F7] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF9D8] text-[#20242A] flex items-center justify-center shrink-0 group-hover:bg-[#FF9D50] group-hover:text-white transition-colors">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-[#777F87]">
                سامانه اعضا
              </span>
            </div>

            <h3 className="text-base font-bold text-[#20242A] group-hover:text-[#FF9D50] transition-colors mb-1.5">
              خدمات اعضا
            </h3>
            <p className="text-xs text-[#777F87] leading-relaxed line-clamp-2">
              تمدید پروانه مطب، صدور گواهی، امور عضویت، پایانه‌های مالیاتی و فرم‌ها
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E9ECEF] flex items-center justify-between text-xs font-bold text-[#20242A] group-hover:text-[#FF9D50]">
            <span>ورود به میز خدمات</span>
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>

        {/* ۲. استعلام پروانه و پزشکان */}
        <button
          onClick={() => onSelectAction('physicians')}
          className="group text-right p-5 rounded-xl border border-[#E9ECEF] bg-white hover:border-[#1DCED8] hover:bg-[#F7F8F7] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F7F8F7] text-[#20242A] flex items-center justify-center shrink-0 group-hover:bg-[#1DCED8] group-hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-[#777F87]">
                استعلام رسمی
              </span>
            </div>

            <h3 className="text-base font-bold text-[#20242A] group-hover:text-[#1DCED8] transition-colors mb-1.5">
              جستجوی پزشک
            </h3>
            <p className="text-xs text-[#777F87] leading-relaxed line-clamp-2">
              بانک اطلاعات پزشکان، دندانپزشکان، داروسازان و استعلام اصالت پروانه طبابت
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E9ECEF] flex items-center justify-between text-xs font-bold text-[#20242A] group-hover:text-[#1DCED8]">
            <span>جستجو در بانک اعضا</span>
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>

        {/* ۳. فرصت‌های شغلی و نیازمندی‌ها */}
        <button
          onClick={() => onSelectAction('classifieds')}
          className="group text-right p-5 rounded-xl border border-[#E9ECEF] bg-white hover:border-[#FF9D50] hover:bg-[#F7F8F7] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF9D8] text-[#20242A] flex items-center justify-center shrink-0 group-hover:bg-[#FF9D50] group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-[#777F87]">
                فرصت‌های شغلی
              </span>
            </div>

            <h3 className="text-base font-bold text-[#20242A] group-hover:text-[#FF9D50] transition-colors mb-1.5">
              نیازمندی‌ها
            </h3>
            <p className="text-xs text-[#777F87] leading-relaxed line-clamp-2">
              استخدام پزشک و داروساز، واگذاری مطب، مسئول فنی و تجهیزات پزشکی استان
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E9ECEF] flex items-center justify-between text-xs font-bold text-[#20242A] group-hover:text-[#FF9D50]">
            <span>مشاهده و ثبت آگهی</span>
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>

        {/* ۴. اطلاعیه‌های مهم */}
        <button
          onClick={() => onSelectAction('news')}
          className="group text-right p-5 rounded-xl border border-[#E9ECEF] bg-white hover:border-[#E5484D] hover:bg-[#F7F8F7] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F7F8F7] text-[#20242A] flex items-center justify-center shrink-0 group-hover:bg-[#E5484D] group-hover:text-white transition-colors">
                <AlertCircle className="w-5 h-5" />
              </div>
              {urgentCount > 0 && (
                <span className="text-[11px] font-medium text-[#E5484D]">
                  {urgentCount} اطلاعیه فوری
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-[#20242A] group-hover:text-[#E5484D] transition-colors mb-1.5">
              اطلاعیه‌های مهم
            </h3>
            <p className="text-xs text-[#777F87] leading-relaxed line-clamp-2">
              ابلاغیه‌های فوری پروانه‌ها، هشدارهای انتظامی، مهلت‌های مالیاتی و بخشنامه‌ها
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E9ECEF] flex items-center justify-between text-xs font-bold text-[#20242A] group-hover:text-[#E5484D]">
            <span>مشاهده همه اطلاعیه‌ها</span>
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </section>
  );
};

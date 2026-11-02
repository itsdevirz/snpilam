import React from 'react';
import { CouncilEmblem } from './CouncilEmblem';
import { NavigationTab } from '../types';
import { COUNCIL_INFO } from '../data/councilData';
import { useDataContext } from '../context/DataContext';
import {
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const { sitePhone } = useDataContext();

  const navigate = (tab: NavigationTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#20242A] text-[#777F87] border-t-2 border-[#FF9D50] pt-12 pb-8 mt-20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#2E353D]">
          
          {/* Col 1: Institutional Identity (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                <CouncilEmblem size={36} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm tracking-tight">
                  سازمان نظام پزشکی استان ایلام
                </h4>
                <p className="text-[11px] text-[#777F87] mt-0.5">
                  پورتال رسمی خدمات دیجیتال و امور صنفی جامعه پزشکی
                </p>
              </div>
            </div>

            <p className="text-[#E9ECEF]/80 leading-relaxed text-xs max-w-md">
              مرجع رسمی نظارت، ساماندهی، صدور پروانه‌های مطب و خدمات الکترونیک کادر درمان، دندانپزشکان، داروسازان و پیراپزشکان استان ایلام.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#55E07E] bg-[#2E353D] px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>پورتال تاییدشده و متصل به سامانه جامع سازمان کل</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider pb-2 border-b border-[#2E353D]">
              میانبرهای خدمات
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <button
                onClick={() => navigate('physicians')}
                className="hover:text-[#FF9D50] transition-colors text-right flex items-center gap-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#1DCED8]" />
                <span>بانک استعلام پزشکان</span>
              </button>

              <button
                onClick={() => navigate('services')}
                className="hover:text-[#FF9D50] transition-colors text-right flex items-center gap-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#1DCED8]" />
                <span>میز خدمات اعضا</span>
              </button>

              <button
                onClick={() => navigate('facilities')}
                className="hover:text-[#FF9D50] transition-colors text-right flex items-center gap-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#1DCED8]" />
                <span>جستجوی مراکز درمانی</span>
              </button>

              <button
                onClick={() => navigate('education')}
                className="hover:text-[#FF9D50] transition-colors text-right flex items-center gap-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#1DCED8]" />
                <span>برنامه‌های آموزش مداوم CME</span>
              </button>

              <button
                onClick={() => navigate('classifieds')}
                className="hover:text-[#FF9D50] transition-colors text-right flex items-center gap-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#1DCED8]" />
                <span>نیازمندی‌ها و فرصت‌های شغلی</span>
              </button>

              <button
                onClick={() => navigate('contact')}
                className="hover:text-[#FF9D50] transition-colors text-right flex items-center gap-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#1DCED8]" />
                <span>ارتباط و میز پاسخگویی</span>
              </button>
            </div>
          </div>

          {/* Col 3: Institutional Contact (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider pb-2 border-b border-[#2E353D]">
              ارتباط مستقیم با سازمان
            </h4>

            <div className="space-y-2.5 text-xs text-[#E9ECEF]/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF9D50] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{COUNCIL_INFO.address}</span>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-[#55E07E] shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-[#777F87]">مرکز پاسخگویی:</span>
                  <a
                    href={`tel:${sitePhone.replace(/[^\d]/g, '')}`}
                    className="text-white font-bold font-sans text-sm hover:text-[#FF9D50] transition-colors"
                  >
                    {sitePhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Mail className="w-4 h-4 text-[#1DCED8] shrink-0" />
                <span className="font-mono text-xs text-[#E9ECEF]">{COUNCIL_INFO.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Unboxed Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#777F87] text-[11px]">
          <p>© کلیه حقوق مادی و معنوی متعلق به سازمان نظام پزشکی استان ایلام می‌باشد.</p>

          <div className="flex items-center gap-2 text-[#777F87]">
            <button
              onClick={() => navigate('about')}
              className="hover:text-white transition-colors"
            >
              معرفی سازمان
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigate('contact')}
              className="hover:text-white transition-colors"
            >
              شکواییه‌ها و پیگیری
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

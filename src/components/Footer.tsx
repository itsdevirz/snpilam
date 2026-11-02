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
    <footer className="w-full bg-[#17365D] text-slate-300 border-t-4 border-[#2463A6] pt-10 pb-6 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-700/80">
          {/* Column 1: Organization Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CouncilEmblem size={40} className="bg-white rounded-full p-1 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">سازمان نظام پزشکی استان ایلام</h4>
                <p className="text-[11px] text-slate-400">پورتال رسمی خدمات دیجیتال و امور صنفی</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              مرجع رسمی ساماندهی و صدور پروانه‌های حرفه‌ای جامعه پزشکی، دندانپزشکی، داروسازی و پیراپزشکی استان ایلام.
            </p>
          </div>

          {/* Column 2: Quick Nav Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 pb-1 border-b border-slate-700/80">
              دسترسی سریع
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => navigate('services')}
                className="hover:text-white transition-colors flex items-center gap-1 text-right"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6] shrink-0" />
                <span>میز خدمات اعضا</span>
              </button>
              <button
                onClick={() => navigate('physicians')}
                className="hover:text-white transition-colors flex items-center gap-1 text-right"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6] shrink-0" />
                <span>جستجوی پزشکان</span>
              </button>
              <button
                onClick={() => navigate('facilities')}
                className="hover:text-white transition-colors flex items-center gap-1 text-right"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6] shrink-0" />
                <span>مراکز درمانی</span>
              </button>
              <button
                onClick={() => navigate('education')}
                className="hover:text-white transition-colors flex items-center gap-1 text-right"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6] shrink-0" />
                <span>آموزش مداوم</span>
              </button>
              <button
                onClick={() => navigate('classifieds')}
                className="hover:text-white transition-colors flex items-center gap-1 text-right"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6] shrink-0" />
                <span>نیازمندی‌ها</span>
              </button>
              <button
                onClick={() => navigate('contact')}
                className="hover:text-white transition-colors flex items-center gap-1 text-right"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6] shrink-0" />
                <span>تماس و نشانی</span>
              </button>
            </div>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm mb-3 pb-1 border-b border-slate-700/80">
              ارتباط با سازمان
            </h4>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed text-slate-300">{COUNCIL_INFO.address}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-slate-400">تلفن پاسخگویی:</span>
                <a href={`tel:${sitePhone.replace(/[^\d]/g, '')}`} className="text-white font-bold font-sans text-sm hover:text-emerald-400">
                  {sitePhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300 font-mono text-xs">{COUNCIL_INFO.email}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px] pt-2">
          <p>© کلیه حقوق متعلق به سازمان نظام پزشکی استان ایلام می‌باشد.</p>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('about')} className="hover:text-white transition-colors">
              درباره سازمان
            </button>
            <span>·</span>
            <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
              میز خدمت
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

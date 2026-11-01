import React from 'react';
import { CouncilEmblem } from './CouncilEmblem';
import { NavigationTab } from '../types';
import { COUNCIL_INFO, NATIONAL_SYSTEMS } from '../data/councilData';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const navigate = (tab: NavigationTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#17365D] text-slate-300 border-t-4 border-[#2463A6] pt-12 pb-8 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-700">
          {/* Column 1: Organization Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CouncilEmblem size={44} className="bg-white rounded-full p-1" />
              <div>
                <h4 className="font-bold text-white text-sm">نظام پزشکی استان ایلام</h4>
                <p className="text-[11px] text-slate-400">جمهوری اسلامی ایران</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              سازمان نظام پزشکی استان ایلام به عنوان نهاد قانونی و مستقل صنفی، متولی ساماندهی امور
              حرفه‌ای، صدور پروانه‌ها، حفظ حقوق بیماران و صیانت از جایگاه والای جامعه پزشکی در استان
              می‌باشد.
            </p>
            <div className="pt-2 flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-[11px]">پورتال رسمی و دارای گواهی امنیتی دولت الکترونیک</span>
            </div>
          </div>

          {/* Column 2: Quick Links to Major Sections */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 pb-1.5 border-b border-slate-700/80 flex items-center gap-2">
              <span>بخش‌های اصلی پورتال</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-right w-full"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6]" />
                  <span>میز خدمات اعضا و پروانه‌ها</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('physicians')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-right w-full"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6]" />
                  <span>بانک جستجوی پزشکان و پیراپزشکان</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('facilities')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-right w-full"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6]" />
                  <span>فهرست بیمارستان‌ها و مراکز درمانی</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('classifieds')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-right w-full"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6]" />
                  <span>نیازمندی‌ها و فرصت‌های شغلی پزشکی</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('education')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-right w-full"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6]" />
                  <span>سامانه بازآموزی و کنفرانس‌های علمی</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('regulations')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-right w-full"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6]" />
                  <span>کتابخانه قوانین، تعرفه‌ها و بخشنامه‌ها</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('departments')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-right w-full"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#2463A6]" />
                  <span>کمیسیون‌ها، دادسرا و واحدهای سازمان</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: National Systems (Verified Links) */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 pb-1.5 border-b border-slate-700/80">
              سامانه‌های ملی سلامت
            </h4>
            <ul className="space-y-2.5">
              {NATIONAL_SYSTEMS.slice(0, 5).map((sys) => (
                <li key={sys.url}>
                  <a
                    href={sys.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span className="group-hover:underline text-[12px]">{sys.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Office Hours */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm mb-4 pb-1.5 border-b border-slate-700/80">
              اطلاعات تماس و نشانی
            </h4>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#EFF6FC] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-slate-300">{COUNCIL_INFO.address}</p>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#EFF6FC] shrink-0" />
              <div className="flex flex-col">
                <span className="text-white font-sans">{COUNCIL_INFO.phoneCentral}</span>
                <span className="text-[11px] text-slate-400 font-sans">
                  خط مستقیم: {COUNCIL_INFO.phoneDirect}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#EFF6FC] shrink-0" />
              <span className="text-slate-300 font-mono text-[11px]">{COUNCIL_INFO.email}</span>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <Clock className="w-4 h-4 text-[#EFF6FC] shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-400">
                <p>{COUNCIL_INFO.workingDays}: {COUNCIL_INFO.workingHours}</p>
                <p>{COUNCIL_INFO.thursdayHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Institutional Notice */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <p>© کلیه حقوق مادی و معنوی این پایگاه متعلق به سازمان نظام پزشکی استان ایلام می‌باشد.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('about')} className="hover:text-white transition-colors">
              درباره نظام پزشکی
            </button>
            <span>·</span>
            <button onClick={() => navigate('advertising')} className="hover:text-white transition-colors">
              ضوابط تبلیغات
            </button>
            <span>·</span>
            <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
              میز خدمت الکترونیک
            </button>
            <span>·</span>
            <button onClick={() => navigate('admin')} className="text-amber-300 hover:text-amber-200 font-bold transition-colors">
              پنل مدیریت سامانه
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

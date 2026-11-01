import React, { useState } from 'react';
import { CouncilEmblem } from './CouncilEmblem';
import { NavigationTab } from '../types';
import { COUNCIL_INFO } from '../data/councilData';
import {
  Search,
  Phone,
  Menu,
  X,
  ChevronDown,
  Building2,
  FileText,
  UserCheck,
  GraduationCap,
  Scale,
  Briefcase,
  ShieldCheck,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onSearchGlobal?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onSearchGlobal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearchGlobal) {
      onSearchGlobal(searchQuery.trim());
    }
  };

  const navigateTo = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
      {/* 1. Top Institutional Utility Bar */}
      <div className="bg-[#17365D] text-white text-xs py-2 px-4 sm:px-8 border-b border-[#2463A6]/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Right side (Persian start): Official identity & Date */}
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <span className="font-medium text-slate-200">
              پورتال رسمی سازمان نظام پزشکی جمهوری اسلامی ایران
            </span>
          </div>

          {/* Left side (Persian end): Central phone & emergency access */}
          <div className="flex items-center gap-4 text-slate-200 text-xs">
            <a
              href={`tel:${COUNCIL_INFO.phoneCentral.replace(/-/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-sans">مرکز تلفن: {COUNCIL_INFO.phoneCentral}</span>
            </a>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => navigateTo('contact')}
              className="hover:text-white transition-colors text-slate-300 hover:underline"
            >
              ثبت شکایات و نظرات
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => navigateTo('admin')}
              className="hover:text-amber-300 transition-colors text-amber-200 font-bold flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              <span>پنل مدیریت</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Identity & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Organization Branding */}
        <div
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3.5 cursor-pointer select-none group"
        >
          <CouncilEmblem size={52} className="shrink-0 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#2463A6] tracking-wide">
              سازمان نظام پزشکی جمهوری اسلامی ایران
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#17365D] tracking-tight">
              سازمان نظام پزشکی استان ایلام
            </h1>
            <span className="text-[11px] text-[#667085] hidden sm:block">
              سامانه اطلاع‌رسانی، امور صنفی و خدمات دیجیتال جامعه پزشکی
            </span>
          </div>
        </div>

        {/* Global Search Input & Quick Contact */}
        <div className="hidden lg:flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در پزشکان، خدمات، قوانین یا آگهی‌ها..."
              className="w-full text-xs bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg pr-9 pl-4 py-2 text-[#202B38] placeholder-[#667085] focus:outline-none focus:border-[#2463A6] focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-[#667085] absolute right-3 top-2.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute left-1.5 top-1.5 text-[11px] bg-[#2463A6] text-white px-2.5 py-1 rounded hover:bg-[#17365D] transition-colors"
            >
              بیاب
            </button>
          </form>

          <button
            onClick={() => navigateTo('contact')}
            className="flex items-center gap-1.5 text-xs font-medium text-[#17365D] border border-[#CBD5E1] hover:border-[#17365D] px-3.5 py-2 rounded-lg bg-white hover:bg-[#F5F7FA] transition-colors"
          >
            <span>میز خدمت و تماس</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#17365D] hover:bg-[#F5F7FA] border border-[#E2E8F0] focus:outline-none"
            aria-label="باز کردن منو"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Primary Navigation Bar */}
      <nav className="hidden lg:block bg-white border-t border-[#E2E8F0] text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* خانه */}
            <button
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-3 transition-colors border-b-2 font-medium ${
                currentTab === 'home'
                  ? 'border-[#2463A6] text-[#2463A6] font-semibold'
                  : 'border-transparent text-[#202B38] hover:text-[#2463A6] hover:border-slate-300'
              }`}
            >
              خانه
            </button>

            {/* اخبار و اطلاعیه‌ها */}
            <button
              onClick={() => navigateTo('news')}
              className={`px-3.5 py-3 transition-colors border-b-2 ${
                currentTab === 'news'
                  ? 'border-[#2463A6] text-[#2463A6] font-semibold'
                  : 'border-transparent text-[#202B38] hover:text-[#2463A6] hover:border-slate-300'
              }`}
            >
              اخبار و اطلاعیه‌ها
            </button>

            {/* خدمات اعضا */}
            <button
              onClick={() => navigateTo('services')}
              className={`px-3.5 py-3 transition-colors border-b-2 flex items-center gap-1 ${
                currentTab === 'services'
                  ? 'border-[#2463A6] text-[#2463A6] font-semibold'
                  : 'border-transparent text-[#202B38] hover:text-[#2463A6] hover:border-slate-300'
              }`}
            >
              <span>خدمات اعضا</span>
              <span className="text-[10px] bg-[#EFF6FC] text-[#2463A6] px-1.5 py-0.5 rounded font-normal">
                پرمراجعه
              </span>
            </button>

            {/* جستجوی پزشکان */}
            <button
              onClick={() => navigateTo('physicians')}
              className={`px-3.5 py-3 transition-colors border-b-2 ${
                currentTab === 'physicians'
                  ? 'border-[#24845B] text-[#24845B] font-semibold'
                  : 'border-transparent text-[#202B38] hover:text-[#24845B] hover:border-slate-300'
              }`}
            >
              جستجوی پزشکان
            </button>

            {/* مراکز درمانی */}
            <button
              onClick={() => navigateTo('facilities')}
              className={`px-3.5 py-3 transition-colors border-b-2 ${
                currentTab === 'facilities'
                  ? 'border-[#2463A6] text-[#2463A6] font-semibold'
                  : 'border-transparent text-[#202B38] hover:text-[#2463A6] hover:border-slate-300'
              }`}
            >
              مراکز درمانی
            </button>

            {/* نیازمندی‌ها */}
            <button
              onClick={() => navigateTo('classifieds')}
              className={`px-3.5 py-3 transition-colors border-b-2 ${
                currentTab === 'classifieds'
                  ? 'border-[#C77920] text-[#C77920] font-semibold'
                  : 'border-transparent text-[#202B38] hover:text-[#C77920] hover:border-slate-300'
              }`}
            >
              نیازمندی‌های پزشکی
            </button>

            {/* آموزش و بازآموزی */}
            <button
              onClick={() => navigateTo('education')}
              className={`px-3.5 py-3 transition-colors border-b-2 ${
                currentTab === 'education'
                  ? 'border-[#2463A6] text-[#2463A6] font-semibold'
                  : 'border-transparent text-[#202B38] hover:text-[#2463A6] hover:border-slate-300'
              }`}
            >
              آموزش و بازآموزی
            </button>

            {/* قوانین و بخشنامه‌ها */}
            <button
              onClick={() => navigateTo('regulations')}
              className={`px-3.5 py-3 transition-colors border-b-2 ${
                currentTab === 'regulations'
                  ? 'border-[#2463A6] text-[#2463A6] font-semibold'
                  : 'border-transparent text-[#202B38] hover:text-[#2463A6] hover:border-slate-300'
              }`}
            >
              قوانین و تعرفه‌ها
            </button>

            {/* منوی چندبخشی: امور تخصصی */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('specialized')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`px-3.5 py-3 transition-colors border-b-2 flex items-center gap-1 ${
                  ['licenses', 'tax', 'advertising', 'welfare'].includes(currentTab)
                    ? 'border-[#2463A6] text-[#2463A6] font-semibold'
                    : 'border-transparent text-[#202B38] hover:text-[#2463A6]'
                }`}
              >
                <span>امور تخصصی</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
              </button>

              {openDropdown === 'specialized' && (
                <div className="absolute right-0 top-full w-56 bg-white border border-[#E2E8F0] rounded-b-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => navigateTo('licenses')}
                    className="w-full text-right px-4 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-slate-800"
                  >
                    <UserCheck className="w-4 h-4 text-[#2463A6]" />
                    <span>امور پروانه‌ها و مطب</span>
                  </button>
                  <button
                    onClick={() => navigateTo('tax')}
                    className="w-full text-right px-4 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-slate-800"
                  >
                    <Scale className="w-4 h-4 text-[#2463A6]" />
                    <span>امور مالیاتی پزشکان</span>
                  </button>
                  <button
                    onClick={() => navigateTo('advertising')}
                    className="w-full text-right px-4 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-slate-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2463A6]" />
                    <span>ضوابط و مجوز تبلیغات</span>
                  </button>
                  <button
                    onClick={() => navigateTo('welfare')}
                    className="w-full text-right px-4 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-slate-800"
                  >
                    <Briefcase className="w-4 h-4 text-[#2463A6]" />
                    <span>رفاه و خدمات اعضا</span>
                  </button>
                </div>
              )}
            </div>

            {/* منوی چندبخشی: سازمان */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('org')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`px-3.5 py-3 transition-colors border-b-2 flex items-center gap-1 ${
                  ['departments', 'about', 'contact'].includes(currentTab)
                    ? 'border-[#2463A6] text-[#2463A6] font-semibold'
                    : 'border-transparent text-[#202B38] hover:text-[#2463A6]'
                }`}
              >
                <span>درباره و ساختار</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
              </button>

              {openDropdown === 'org' && (
                <div className="absolute right-0 top-full w-56 bg-white border border-[#E2E8F0] rounded-b-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => navigateTo('departments')}
                    className="w-full text-right px-4 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-slate-800"
                  >
                    <Building2 className="w-4 h-4 text-[#2463A6]" />
                    <span>کمیسیون‌ها و واحدها</span>
                  </button>
                  <button
                    onClick={() => navigateTo('about')}
                    className="w-full text-right px-4 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-slate-800"
                  >
                    <Info className="w-4 h-4 text-[#2463A6]" />
                    <span>معرفی و هیئت مدیره</span>
                  </button>
                  <button
                    onClick={() => navigateTo('contact')}
                    className="w-full text-right px-4 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-slate-800"
                  >
                    <Phone className="w-4 h-4 text-[#2463A6]" />
                    <span>ارتباط و نشانی</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* عضویت / پیگیری سریع / مدیریت */}
          <div className="flex items-center gap-2 py-2">
            <button
              onClick={() => navigateTo('services')}
              className="text-[#2463A6] hover:bg-[#EFF6FC] px-3 py-1.5 rounded border border-[#2463A6]/30 font-medium transition-colors"
            >
              پیگیری درخواست‌ها
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className="bg-[#17365D] hover:bg-[#2463A6] text-white px-3 py-1.5 rounded font-bold transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              <span>پنل مدیریت</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E2E8F0] px-4 py-4 space-y-3 shadow-xl">
          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در پزشکان، خدمات و قوانین..."
              className="w-full text-sm bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg pr-9 pl-4 py-2.5 text-[#202B38]"
            />
            <Search className="w-4 h-4 text-[#667085] absolute right-3 top-3.5" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => navigateTo('home')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'home' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              صفحه اصلی
            </button>
            <button
              onClick={() => navigateTo('services')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'services' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              خدمات اعضا
            </button>
            <button
              onClick={() => navigateTo('physicians')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'physicians' ? 'bg-[#EAF6EE] text-[#24845B] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              جستجوی پزشکان
            </button>
            <button
              onClick={() => navigateTo('facilities')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'facilities' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              مراکز درمانی
            </button>
            <button
              onClick={() => navigateTo('classifieds')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'classifieds' ? 'bg-[#FDF4E7] text-[#C77920] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              نیازمندی‌ها
            </button>
            <button
              onClick={() => navigateTo('news')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'news' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              اخبار و اطلاعیه‌ها
            </button>
            <button
              onClick={() => navigateTo('education')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'education' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              آموزش و بازآموزی
            </button>
            <button
              onClick={() => navigateTo('regulations')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'regulations' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              قوانین و تعرفه‌ها
            </button>
            <button
              onClick={() => navigateTo('licenses')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'licenses' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              امور پروانه‌ها
            </button>
            <button
              onClick={() => navigateTo('tax')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'tax' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              امور مالیاتی
            </button>
            <button
              onClick={() => navigateTo('advertising')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'advertising' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              تبلیغات پزشکی
            </button>
            <button
              onClick={() => navigateTo('welfare')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'welfare' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              خدمات رفاهی
            </button>
            <button
              onClick={() => navigateTo('departments')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'departments' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              کمیسیون‌ها
            </button>
            <button
              onClick={() => navigateTo('about')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'about' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              درباره سازمان
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className={`p-2.5 rounded-lg text-right ${
                currentTab === 'contact' ? 'bg-[#EFF6FC] text-[#2463A6] font-bold' : 'hover:bg-[#F5F7FA]'
              }`}
            >
              تماس با سازمان
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className={`p-2.5 rounded-lg text-right font-bold text-amber-800 bg-amber-50 border border-amber-200 ${
                currentTab === 'admin' ? 'bg-amber-100' : ''
              }`}
            >
              ⚙️ پنل مدیریت ارشد
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

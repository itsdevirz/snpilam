import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CouncilEmblem } from './CouncilEmblem';
import { NavigationTab } from '../types';
import {
  Search,
  Phone,
  Menu,
  X,
  ChevronDown,
  Building2,
  FileText,
  UserCheck,
  Scale,
  Briefcase,
  ShieldCheck,
  Info,
  Home,
  Award,
  Bell,
  GraduationCap,
} from 'lucide-react';
import { sanitizeSearchQuery } from '../utils/security';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onSearchGlobal?: (query: string) => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onSearchGlobal,
  onOpenCommandPalette,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = sanitizeSearchQuery(searchQuery);
    if (cleaned && onSearchGlobal) {
      onSearchGlobal(cleaned);
    }
  };

  const navigateTo = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full bg-white border-b border-[#E9ECEF] sticky top-0 z-40 transition-all">
      {/* Swiss Editorial Top Bar (3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Element Brand Wordmark */}
        <a
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFF9D8] border border-[#FF9D50]/30 flex items-center justify-center text-[#20242A] shrink-0 group-hover:bg-[#FF9D50] group-hover:text-white transition-all shadow-2xs">
            <CouncilEmblem size={28} className="shrink-0" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-[#777F87] tracking-tight">
              پورتال رسمی خدمات دیجیتال
            </span>
            <span className="text-base sm:text-lg font-black text-[#20242A] tracking-tight whitespace-nowrap">
              سازمان نظام پزشکی استان ایلام
            </span>
          </div>
        </a>

        {/* Zone 2: Clean 4-5 Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-[#20242A]">
          <button
            onClick={() => navigateTo('home')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'home'
                ? 'bg-[#F7F8F7] text-[#20242A] font-bold border-b-2 border-[#FF9D50]'
                : 'hover:text-[#1DCED8] hover:bg-[#F7F8F7]'
            }`}
          >
            صفحه اصلی
          </button>

          <button
            onClick={() => navigateTo('physicians')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'physicians'
                ? 'bg-[#F7F8F7] text-[#20242A] font-bold border-b-2 border-[#FF9D50]'
                : 'hover:text-[#1DCED8] hover:bg-[#F7F8F7]'
            }`}
          >
            بانک پزشکان
          </button>

          <button
            onClick={() => navigateTo('services')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'services'
                ? 'bg-[#F7F8F7] text-[#20242A] font-bold border-b-2 border-[#FF9D50]'
                : 'hover:text-[#1DCED8] hover:bg-[#F7F8F7]'
            }`}
          >
            خدمات اعضا
          </button>

          <button
            onClick={() => navigateTo('facilities')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'facilities'
                ? 'bg-[#F7F8F7] text-[#20242A] font-bold border-b-2 border-[#FF9D50]'
                : 'hover:text-[#1DCED8] hover:bg-[#F7F8F7]'
            }`}
          >
            مراکز درمانی
          </button>

          <button
            onClick={() => navigateTo('news')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'news'
                ? 'bg-[#F7F8F7] text-[#20242A] font-bold border-b-2 border-[#FF9D50]'
                : 'hover:text-[#1DCED8] hover:bg-[#F7F8F7]'
            }`}
          >
            اخبار و ابلاغیه‌ها
          </button>

          {/* Dropdown 1: امور تخصصی */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('specialized')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                ['licenses', 'tax', 'advertising', 'welfare', 'classifieds', 'education', 'regulations'].includes(
                  currentTab
                )
                  ? 'bg-[#F7F8F7] text-[#20242A] font-bold border-b-2 border-[#FF9D50]'
                  : 'hover:text-[#1DCED8] hover:bg-[#F7F8F7]'
              }`}
            >
              <span>امور تخصصی و صنفی</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#777F87]" />
            </button>

            {openDropdown === 'specialized' && (
              <div className="absolute right-0 top-full w-60 bg-white border border-[#E9ECEF] rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => navigateTo('licenses')}
                  className="w-full text-right px-4 py-2 hover:bg-[#F7F8F7] flex items-center gap-2.5 text-xs text-[#20242A]"
                >
                  <UserCheck className="w-4 h-4 text-[#FF9D50]" />
                  <span>امور پروانه‌ها و مطب</span>
                </button>
                <button
                  onClick={() => navigateTo('tax')}
                  className="w-full text-right px-4 py-2 hover:bg-[#F7F8F7] flex items-center gap-2.5 text-xs text-[#20242A]"
                >
                  <Scale className="w-4 h-4 text-[#FF9D50]" />
                  <span>امور مالیاتی پزشکان</span>
                </button>
                <button
                  onClick={() => navigateTo('advertising')}
                  className="w-full text-right px-4 py-2 hover:bg-[#F7F8F7] flex items-center gap-2.5 text-xs text-[#20242A]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FF9D50]" />
                  <span>ضوابط و مجوز تبلیغات</span>
                </button>
                <button
                  onClick={() => navigateTo('education')}
                  className="w-full text-right px-4 py-2 hover:bg-[#F7F8F7] flex items-center gap-2.5 text-xs text-[#20242A]"
                >
                  <GraduationCap className="w-4 h-4 text-[#FF9D50]" />
                  <span>آموزش مداوم CME</span>
                </button>
                <button
                  onClick={() => navigateTo('regulations')}
                  className="w-full text-right px-4 py-2 hover:bg-[#F7F8F7] flex items-center gap-2.5 text-xs text-[#20242A]"
                >
                  <FileText className="w-4 h-4 text-[#FF9D50]" />
                  <span>قوانین و تعرفه‌ها</span>
                </button>
                <button
                  onClick={() => navigateTo('classifieds')}
                  className="w-full text-right px-4 py-2 hover:bg-[#F7F8F7] flex items-center gap-2.5 text-xs text-[#20242A]"
                >
                  <Briefcase className="w-4 h-4 text-[#FF9D50]" />
                  <span>نیازمندی‌ها و فرصت‌ها</span>
                </button>
              </div>
            )}
          </div>

          {/* Dropdown 2: ساختار سازمان */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('org')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                ['departments', 'about', 'contact'].includes(currentTab)
                  ? 'bg-[#F7F8F7] text-[#20242A] font-bold border-b-2 border-[#FF9D50]'
                  : 'hover:text-[#1DCED8] hover:bg-[#F7F8F7]'
              }`}
            >
              <span>درباره و ساختار</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#777F87]" />
            </button>

            {openDropdown === 'org' && (
              <div className="absolute right-0 top-full w-52 bg-white border border-[#E9ECEF] rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => navigateTo('departments')}
                  className="w-full text-right px-4 py-2 hover:bg-[#F7F8F7] flex items-center gap-2.5 text-xs text-[#20242A]"
                >
                  <Building2 className="w-4 h-4 text-[#FF9D50]" />
                  <span>کمیسیون‌ها و واحدها</span>
                </button>
                <button
                  onClick={() => navigateTo('about')}
                  className="w-full text-right px-4 py-2 hover:bg-[#F7F8F7] flex items-center gap-2.5 text-xs text-[#20242A]"
                >
                  <Info className="w-4 h-4 text-[#FF9D50]" />
                  <span>معرفی و هیئت مدیره</span>
                </button>
                <button
                  onClick={() => navigateTo('contact')}
                  className="w-full text-right px-4 py-2 hover:bg-[#F7F8F7] flex items-center gap-2.5 text-xs text-[#20242A]"
                >
                  <Phone className="w-4 h-4 text-[#FF9D50]" />
                  <span>ارتباط و نشانی</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: 1 Primary Action + Command Palette Search Trigger */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 text-xs bg-[#F7F8F7] hover:bg-[#E9ECEF] border border-[#E9ECEF] px-3 py-2 rounded-xl text-[#20242A] transition-all font-medium group"
              title="جستجوی سریع با کیبورد (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#777F87] group-hover:text-[#FF9D50] transition-colors" />
              <span className="hidden sm:inline">جستجو</span>
              <kbd className="text-[10px] bg-white border border-[#E9ECEF] font-mono text-[#777F87] px-1.5 py-0.5 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>
          )}

          <button
            onClick={() => navigateTo('contact')}
            className="flex items-center gap-2 text-xs font-bold text-[#20242A] bg-[#FF9D50] hover:bg-[#ff8f38] px-4 py-2 rounded-xl shadow-2xs transition-all whitespace-nowrap shrink-0"
          >
            <span>میز خدمت و استعلام</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#20242A] bg-[#F7F8F7] border border-[#E9ECEF] focus:outline-none"
            aria-label="باز کردن منو"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Modern Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[100] lg:hidden"
            />

            {/* Sliding Drawer Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-xs bg-white z-[101] lg:hidden shadow-2xl flex flex-col justify-between p-5 space-y-4 overflow-y-auto"
            >
              <div className="space-y-4">
                {/* Header in Drawer */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E9ECEF]">
                  <div className="flex items-center gap-2">
                    <CouncilEmblem size={36} />
                    <span className="font-bold text-xs text-[#20242A]">سازمان نظام پزشکی ایلام</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجوی سریع در پزشکان، خدمات و قوانین..."
                    className="w-full text-xs bg-[#F7F8F7] border border-[#E9ECEF] rounded-xl pr-9 pl-4 py-2.5 text-[#20242A] placeholder-[#777F87] focus:outline-none focus:border-[#FF9D50] focus:bg-white transition-all"
                  />
                  <Search className="w-4 h-4 text-[#777F87] absolute right-3 top-3" />
                </form>

                <div className="grid grid-cols-1 gap-1.5 text-xs font-medium">
                  <button
                    onClick={() => navigateTo('home')}
                    className={`p-3 rounded-xl text-right flex items-center justify-between transition-all ${
                      currentTab === 'home'
                        ? 'bg-[#20242A] text-white font-bold'
                        : 'bg-[#F7F8F7] text-[#20242A] hover:bg-[#E9ECEF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Home className="w-4 h-4 text-[#FF9D50]" />
                      <span>صفحه اصلی</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('physicians')}
                    className={`p-3 rounded-xl text-right flex items-center justify-between transition-all ${
                      currentTab === 'physicians'
                        ? 'bg-[#20242A] text-white font-bold'
                        : 'bg-[#F7F8F7] text-[#20242A] hover:bg-[#E9ECEF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 text-[#55E07E]" />
                      <span>جستجوی پزشکان</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('services')}
                    className={`p-3 rounded-xl text-right flex items-center justify-between transition-all ${
                      currentTab === 'services'
                        ? 'bg-[#20242A] text-white font-bold'
                        : 'bg-[#F7F8F7] text-[#20242A] hover:bg-[#E9ECEF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-[#1DCED8]" />
                      <span>خدمات اعضا</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('facilities')}
                    className={`p-3 rounded-xl text-right flex items-center justify-between transition-all ${
                      currentTab === 'facilities'
                        ? 'bg-[#20242A] text-white font-bold'
                        : 'bg-[#F7F8F7] text-[#20242A] hover:bg-[#E9ECEF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-[#777F87]" />
                      <span>مراکز درمانی</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('news')}
                    className={`p-3 rounded-xl text-right flex items-center justify-between transition-all ${
                      currentTab === 'news'
                        ? 'bg-[#20242A] text-white font-bold'
                        : 'bg-[#F7F8F7] text-[#20242A] hover:bg-[#E9ECEF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-[#FF9D50]" />
                      <span>اخبار و ابلاغیه‌ها</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('education')}
                    className={`p-3 rounded-xl text-right flex items-center justify-between transition-all ${
                      currentTab === 'education'
                        ? 'bg-[#20242A] text-white font-bold'
                        : 'bg-[#F7F8F7] text-[#20242A] hover:bg-[#E9ECEF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-[#1DCED8]" />
                      <span>آموزش CME</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('regulations')}
                    className={`p-3 rounded-xl text-right flex items-center justify-between transition-all ${
                      currentTab === 'regulations'
                        ? 'bg-[#20242A] text-white font-bold'
                        : 'bg-[#F7F8F7] text-[#20242A] hover:bg-[#E9ECEF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#777F87]" />
                      <span>قوانین و تعرفه‌ها</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('classifieds')}
                    className={`p-3 rounded-xl text-right flex items-center justify-between transition-all ${
                      currentTab === 'classifieds'
                        ? 'bg-[#20242A] text-white font-bold'
                        : 'bg-[#F7F8F7] text-[#20242A] hover:bg-[#E9ECEF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-[#FF9D50]" />
                      <span>نیازمندی‌ها</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E9ECEF] space-y-2">
                <button
                  onClick={() => navigateTo('contact')}
                  className="w-full bg-[#FF9D50] hover:bg-[#ff8f38] text-[#20242A] font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>ارتباط و میز خدمت سازمان</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

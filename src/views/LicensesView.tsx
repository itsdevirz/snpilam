import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle,
  FileText,
  AlertCircle,
  Calendar,
  Building,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

export const LicensesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'renewal' | 'issuance' | 'transfer' | 'office'>('renewal');

  return (
    <div className="w-full space-y-6">
      {/* Title Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <UserCheck className="w-4 h-4 text-[#FF9D50]" />
              <span>کمیسیون ماده ۵ امور پروانه‌های استان ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              راهنمای صدور، تمدید و نقل و انتقال پروانه مطب
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              دستورالعمل‌ها و ضوابط قانونی احراز صلاحیت اشتغال به طبابت و تاسیس مطب در شهرها و
              مناطق مختلف استان ایلام.
            </p>
          </div>

          <a
            href="https://irimc.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs bg-[#FF9D50] hover:bg-[#e0843a] text-white font-bold px-5 py-3 rounded-xl transition-all shadow-xs shrink-0"
          >
            <span>ورود به سامانه پروانه‌ها (مپ)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('renewal')}
          className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'renewal'
              ? 'bg-brand-dark text-white'
              : 'bg-white text-brand-dark hover:bg-[#F7F8F7] border border-brand-border'
          }`}
        >
          تمدید ۵ ساله پروانه مطب
        </button>
        <button
          onClick={() => setActiveTab('issuance')}
          className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'issuance'
              ? 'bg-brand-dark text-white'
              : 'bg-white text-brand-dark hover:bg-[#F7F8F7] border border-brand-border'
          }`}
        >
          صدور پروانه برای اعضای جدید
        </button>
        <button
          onClick={() => setActiveTab('transfer')}
          className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'transfer'
              ? 'bg-brand-dark text-white'
              : 'bg-white text-brand-dark hover:bg-[#F7F8F7] border border-brand-border'
          }`}
        >
          انتقال به / از استان ایلام
        </button>
        <button
          onClick={() => setActiveTab('office')}
          className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'office'
              ? 'bg-brand-dark text-white'
              : 'bg-white text-brand-dark hover:bg-[#F7F8F7] border border-brand-border'
          }`}
        >
          استانداردهای فیزیکی مطب
        </button>
      </div>

      {/* Content based on Tab */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-brand-dark">
        {activeTab === 'renewal' && (
          <div className="space-y-6">
            <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-2xl p-5 text-xs">
              <h4 className="font-bold text-brand-dark mb-1 text-sm">الزامات تمدید ۵ ساله پروانه:</h4>
              <p className="leading-relaxed text-brand-muted">
                پروانه مطب به مدت ۵ سال صادر می‌شود. همکاران محترم موظف هستند ۳۰ روز قبل از پایان
                مهلت اعتبار، از طریق سامانه مپ نسبت به ثبت تقاضای تمدید اقدام نمایند. فعالیت پس از
                تاریخ انقضا تخلف قانونی محسوب می‌گردد.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-brand-dark text-base mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#55E07E]" />
                <span>مدارک مورد نیاز جهت بارگذاری در سامانه:</span>
              </h4>
              <ul className="space-y-2.5 text-xs list-disc list-inside text-brand-muted leading-relaxed">
                <li>کارنامه امتیازات بازآموزی تاییدشده (حداقل ۱۲۵ امتیاز برای دوره ۵ ساله)</li>
                <li>گواهی تسویه‌حساب مالیاتی عملکرد سال گذشته موضوع ماده ۱۸۶ قانون مالیات‌های مستقیم</li>
                <li>تسویه‌حساب کامل حق عضویت سالانه نظام پزشکی ایلام تا سال جاری</li>
                <li>تصویر پروانه مطب قبلی</li>
                <li>تاییدیه قرارداد پسماندهای عفونی و نظارت بهداشت محیط</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-brand-dark text-base mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FF9D50]" />
                <span>برنامه زمان‌بندی جلسات کمیسیون پروانه‌ها:</span>
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                جلسات کمیسیون ماده ۵ امور پروانه‌های نظام پزشکی ایلام روزهای سه‌شنبه هر هفته تشکیل
                می‌گردد. در صورت تکمیل مدارک تا پایان وقت اداری دوشنبه، پروانه همان هفته صادر خواهد
                شد.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'issuance' && (
          <div className="space-y-4">
            <h4 className="font-bold text-brand-dark text-base">شرایط صدور پروانه اولیه مطب:</h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              پزشکانی که دوره خدمت قانونی (طرح نیروی انسانی یا خدمت سربازی) را به پایان رسانده‌اند
              یا دارای معافیت قانونی می‌باشند، مجاز به ثبت درخواست اخذ پروانه مطب در شهرستان‌های استان
              ایلام خواهند بود.
            </p>
            <div className="bg-[#F7F8F7] p-5 rounded-2xl border border-brand-border space-y-3 text-xs">
              <p><strong className="text-brand-dark">۱. احراز امتیاز شهر مورد تقاضا:</strong> هر یک از شهرستان‌های استان ایلام دارای امتیاز ورودی مشخصی بر اساس ضوابط وزارت بهداشت است.</p>
              <p><strong className="text-brand-dark">۲. تاییدیه دانشنامه تخصصی:</strong> برای متخصصین، تاییدیه دانشنامه توسط معاونت آموزشی وزارت بهداشت الزامی است.</p>
              <p><strong className="text-brand-dark">۳. عدم منع اشتغال همزمان:</strong> پزشکان عضو هیئت علمی تمام‌وقت جغرافیایی مجاز به اخذ پروانه مطب خصوصی نمی‌باشند.</p>
            </div>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="space-y-4">
            <h4 className="font-bold text-brand-dark text-base">مراحل انتقال سهمیه به استان ایلام:</h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              همکارانی که در شهرستان‌های سایر استان‌ها دارای پروانه معتبر بوده‌اند و قصد انتقال به شهر
              ایلام یا سایر شهرستان‌های استان را دارند، باید ابتدا فرم تسویه‌حساب و ابطال پروانه قبلی
              را از نظام پزشکی مبدا اخذ نموده و در دبیرخانه ایلام ثبت نمایند.
            </p>
            <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 p-4 rounded-2xl text-xs text-brand-dark">
              توجه: انتقال پروانه به مرکز استان (شهر ایلام) منوط به احراز امتیاز شهری ایلام یا وجود
              سهمیه تخصصی مصوب کمیسیون می‌باشد.
            </div>
          </div>
        )}

        {activeTab === 'office' && (
          <div className="space-y-4">
            <h4 className="font-bold text-brand-dark text-base">چک‌لیست استانداردهای فیزیکی و بهداشتی مطب:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="border border-brand-border p-4 rounded-xl space-y-1.5 bg-[#F7F8F7]">
                <strong className="text-brand-dark block text-xs">فضای عمومی و سالن انتظار:</strong>
                <p className="text-brand-muted leading-relaxed">حداقل مساحت مناسب متناسب با تعداد مراجعین، تهویه استاندارد، صندلی‌های ارگونومیک، سرویس بهداشتی تمیز و مجزا.</p>
              </div>
              <div className="border border-brand-border p-4 rounded-xl space-y-1.5 bg-[#F7F8F7]">
                <strong className="text-brand-dark block text-xs">اتاق معاینه و درمان:</strong>
                <p className="text-brand-muted leading-relaxed">وجود تخت معاینه با ملحفه یک‌بار مصرف، سینک شستشوی دست با شیر اهرمی یا چشمی، ترالی اورژانس و کپسول اکسیژن.</p>
              </div>
              <div className="border border-brand-border p-4 rounded-xl space-y-1.5 bg-[#F7F8F7]">
                <strong className="text-brand-dark block text-xs">مدیریت پسماندهای عفونی:</strong>
                <p className="text-brand-muted leading-relaxed">وجود جعبه ایمنی اجسام نوک‌تیز (Safety Box)، سطل‌های پدالی زرد رنگ پسماند عفونی و قرارداد امحا با پیمانکار شهرداری.</p>
              </div>
              <div className="border border-brand-border p-4 rounded-xl space-y-1.5 bg-[#F7F8F7]">
                <strong className="text-brand-dark block text-xs">پایانه پرداخت الکترونیک:</strong>
                <p className="text-brand-muted leading-relaxed">استقرار دستگاه کارتخوان متصل به درگاه امور مالیاتی در محل پیشخوان منشی جهت رفاه حال بیماران.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact box */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-brand-dark text-sm block">واحد امور پروانه‌های نظام پزشکی ایلام</span>
          <span className="text-brand-muted mt-0.5 block">پاسخگویی حضوری: شنبه تا چهارشنبه <span className="tabular-nums">۷:۳۰</span> الی <span className="tabular-nums">۱۴:۰۰</span> | تلفن داخلی: <span className="tabular-nums">۱۰۴</span> و <span className="tabular-nums">۱۰۵</span></span>
        </div>
        <a
          href="tel:08432224560"
          className="text-[#FF9D50] border border-[#FF9D50] hover:bg-[#FF9D50] hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all tabular-nums shrink-0"
        >
          تماس با واحد پروانه‌ها
        </a>
      </div>
    </div>
  );
};

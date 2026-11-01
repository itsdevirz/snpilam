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
      {/* Title */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-semibold">
              <UserCheck className="w-4 h-4" />
              <span>کمیسیون ماده ۵ امور پروانه‌های استان ایلام</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              راهنمای صدور، تمدید و نقل و انتقال پروانه مطب
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              دستورالعمل‌ها و ضوابط قانونی احراز صلاحیت اشتغال به طبابت و تاسیس مطب در شهرها و
              مناطق مختلف استان ایلام
            </p>
          </div>

          <a
            href="https://irimc.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs bg-[#2463A6] text-white hover:bg-[#17365D] font-bold px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <span>ورود به سامانه پروانه‌ها (مپ)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('renewal')}
          className={`text-xs px-4 py-2.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
            activeTab === 'renewal'
              ? 'bg-[#17365D] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          تمدید ۵ ساله پروانه مطب
        </button>
        <button
          onClick={() => setActiveTab('issuance')}
          className={`text-xs px-4 py-2.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
            activeTab === 'issuance'
              ? 'bg-[#17365D] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          صدور پروانه برای اعضای جدید
        </button>
        <button
          onClick={() => setActiveTab('transfer')}
          className={`text-xs px-4 py-2.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
            activeTab === 'transfer'
              ? 'bg-[#17365D] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          انتقال به / از استان ایلام
        </button>
        <button
          onClick={() => setActiveTab('office')}
          className={`text-xs px-4 py-2.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
            activeTab === 'office'
              ? 'bg-[#17365D] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          استانداردهای فیزیکی مطب
        </button>
      </div>

      {/* Content based on Tab */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700">
        {activeTab === 'renewal' && (
          <div className="space-y-6">
            <div className="bg-[#EFF6FC] border border-[#2463A6]/20 rounded-xl p-4 text-xs">
              <h4 className="font-bold text-[#17365D] mb-1">الزامات تمدید ۵ ساله پروانه:</h4>
              <p className="leading-relaxed text-slate-700">
                پروانه مطب به مدت ۵ سال صادر می‌شود. همکاران محترم موظف هستند ۳۰ روز قبل از پایان
                مهلت اعتبار، از طریق سامانه مپ نسبت به ثبت تقاضای تمدید اقدام نمایند. فعالیت پس از
                تاریخ انقضا تخلف قانونی محسوب می‌گردد.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#17365D] text-sm mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#24845B]" />
                <span>مدارک مورد نیاز جهت بارگذاری در سامانه:</span>
              </h4>
              <ul className="space-y-2 text-xs list-disc list-inside text-slate-700">
                <li>کارنامه امتیازات بازآموزی تاییدشده (حداقل ۱۲۵ امتیاز برای دوره ۵ ساله)</li>
                <li>گواهی تسویه‌حساب مالیاتی عملکرد سال گذشته موضوع ماده ۱۸۶ قانون مالیات‌های مستقیم</li>
                <li>تسویه‌حساب کامل حق عضویت سالانه نظام پزشکی ایلام تا سال جاری</li>
                <li>تصویر پروانه مطب قبلی</li>
                <li>تاییدیه قرارداد پسماندهای عفونی و نظارت بهداشت محیط</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#17365D] text-sm mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2463A6]" />
                <span>برنامه زمان‌بندی جلسات کمیسیون پروانه‌ها:</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                جلسات کمیسیون ماده ۵ امور پروانه‌های نظام پزشکی ایلام روزهای سه‌شنبه هر هفته تشکیل
                می‌گردد. در صورت تکمیل مدارک تا پایان وقت اداری دوشنبه، پروانه همان هفته صادر خواهد
                شد.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'issuance' && (
          <div className="space-y-4">
            <h4 className="font-bold text-[#17365D] text-sm">شرایط صدور پروانه اولیه مطب:</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              پزشکانی که دوره خدمت قانونی (طرح نیروی انسانی یا خدمت سربازی) را به پایان رسانده‌اند
              یا دارای معافیت قانونی می‌باشند، مجاز به ثبت درخواست اخذ پروانه مطب در شهرستان‌های استان
              ایلام خواهند بود.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <p><strong>۱. احراز امتیاز شهر مورد تقاضا:</strong> هر یک از شهرستان‌های استان ایلام دارای امتیاز ورودی مشخصی بر اساس ضوابط وزارت بهداشت است.</p>
              <p><strong>۲. تاییدیه دانشنامه تخصصی:</strong> برای متخصصین، تاییدیه دانشنامه توسط معاونت آموزشی وزارت بهداشت الزامی است.</p>
              <p><strong>۳. عدم منع اشتغال همزمان:</strong> پزشکان عضو هیئت علمی تمام‌وقت جغرافیایی مجاز به اخذ پروانه مطب خصوصی نمی‌باشند.</p>
            </div>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="space-y-4">
            <h4 className="font-bold text-[#17365D] text-sm">مراحل انتقال سهمیه به استان ایلام:</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              همکارانی که در شهرستان‌های سایر استان‌ها دارای پروانه معتبر بوده‌اند و قصد انتقال به شهر
              ایلام یا سایر شهرستان‌های استان را دارند، باید ابتدا فرم تسویه‌حساب و ابطال پروانه قبلی
              را از نظام پزشکی مبدا اخذ نموده و در دبیرخانه ایلام ثبت نمایند.
            </p>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900">
              توجه: انتقال پروانه به مرکز استان (شهر ایلام) منوط به احراز امتیاز شهری ایلام یا وجود
              سهمیه تخصصی مصوب کمیسیون می‌باشد.
            </div>
          </div>
        )}

        {activeTab === 'office' && (
          <div className="space-y-4">
            <h4 className="font-bold text-[#17365D] text-sm">چک‌لیست استانداردهای فیزیکی و بهداشتی مطب:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 p-3.5 rounded-lg space-y-1.5">
                <strong className="text-slate-900 block">فضای عمومی و سالن انتظار:</strong>
                <p className="text-slate-600">حداقل مساحت مناسب متناسب با تعداد مراجعین، تهویه استاندارد، صندلی‌های ارگونومیک، سرویس بهداشتی تمیز و مجزا.</p>
              </div>
              <div className="border border-slate-200 p-3.5 rounded-lg space-y-1.5">
                <strong className="text-slate-900 block">اتاق معاینه و درمان:</strong>
                <p className="text-slate-600">وجود تخت معاینه با ملحفه یک‌بار مصرف، سینک شستشوی دست با شیر اهرمی یا چشمی، ترالی اورژانس و کپسول اکسیژن.</p>
              </div>
              <div className="border border-slate-200 p-3.5 rounded-lg space-y-1.5">
                <strong className="text-slate-900 block">مدیریت پسماندهای عفونی:</strong>
                <p className="text-slate-600">وجود جعبه ایمنی اجسام نوک‌تیز (Safety Box)، سطل‌های پدالی زرد رنگ پسماند عفونی و قرارداد امحا با پیمانکار شهرداری.</p>
              </div>
              <div className="border border-slate-200 p-3.5 rounded-lg space-y-1.5">
                <strong className="text-slate-900 block">پایانه پرداخت الکترونیک:</strong>
                <p className="text-slate-600">استقرار دستگاه کارتخوان متصل به درگاه امور مالیاتی در محل پیشخوان منشی جهت رفاه حال بیماران.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact box */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-[#17365D] block">واحد امور پروانه‌های نظام پزشکی ایلام</span>
          <span className="text-slate-500">پاسخگویی حضوری: شنبه تا چهارشنبه ۷:۳۰ الی ۱۴:۰۰ | تلفن داخلی: ۱۰۴ و ۱۰۵</span>
        </div>
        <a
          href="tel:08432224560"
          className="text-[#2463A6] border border-[#2463A6] hover:bg-[#2463A6] hover:text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          تماس با واحد پروانه‌ها
        </a>
      </div>
    </div>
  );
};

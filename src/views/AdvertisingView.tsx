import React from 'react';
import { ADVERTISING_RULES } from '../data/advertisingData';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  Download,
  Phone,
} from 'lucide-react';

export const AdvertisingView: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>کمیسیون تخصصی تبلیغات و تابلوهای پزشکی استان ایلام</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              ضوابط قانونی تبلیغات پزشکی، تابلوها و فضای مجازی
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              راهنمای اخذ مجوز انتشار آگهی، استانداردهای تابلوی مطب، ضوابط سرنسخه و پیشگیری از
              تبلیغات غیرمجاز و مداخله‌گرایانه در امور پزشکی.
            </p>
          </div>

          <div className="text-left bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            <span className="font-bold block">ماده ۲۴ آیین‌نامه انتظامی:</span>
            <span>هرگونه تبلیغ درمانی بدون مجوز کتبی تخلف محسوب می‌شود.</span>
          </div>
        </div>
      </div>

      {/* 4 Steps Application Flow */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#17365D]">
          مراحل ۴ گانه اخذ مجوز تبلیغات و تابلوی مطب در نظام پزشکی ایلام
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADVERTISING_RULES.permitSteps.map((st) => (
            <div
              key={st.step}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 relative"
            >
              <div className="w-7 h-7 rounded-full bg-[#17365D] text-white font-bold flex items-center justify-center text-xs">
                {st.step}
              </div>
              <h4 className="font-bold text-[#17365D]">{st.title}</h4>
              <p className="text-slate-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Permitted vs Prohibited Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Permitted (Green) */}
        <div className="bg-white border border-emerald-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-emerald-900">
              مصادیق مجاز در تبلیغات و اطلاع‌رسانی
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {ADVERTISING_RULES.permittedExamples.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prohibited (Red) */}
        <div className="bg-white border border-red-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-red-100">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-red-900">
              مصادیق ممنوع و تخلفات تبلیغاتی
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {ADVERTISING_RULES.prohibitedExamples.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Standards for signage */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 text-xs space-y-3">
        <h4 className="font-bold text-[#17365D] text-sm">
          استانداردهای ابعاد و عناوین تابلوی مطب در معابر شهری استان ایلام:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong>ابعاد مجاز تابلو:</strong> ۷۰ در ۵۰ سانتی‌متر یا ۹۰ در ۶۰ سانتی‌متر برای معابر اصلی
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong>رنگ زمینه و متن:</strong> پس‌زمینه سفید با نوشتار مشکی یا سرمه‌ای، بدون فلاش یا رقص نور
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong>عناوین مجاز:</strong> فقط نام، نام خانوادگی، شماره نظام پزشکی و تخصص مندرج در پروانه
          </div>
        </div>
      </div>

      {/* Contact box */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-[#17365D] block">دبیرخانه کمیسیون تبلیغات نظام پزشکی ایلام</span>
          <span className="text-slate-500">پاسخگویی: یکشنبه و سه‌شنبه ۹:۰۰ الی ۱۳:۰۰ | شماره داخلی: ۱۰۷</span>
        </div>
        <a
          href="tel:08432224560"
          className="text-[#2463A6] border border-[#2463A6] hover:bg-[#2463A6] hover:text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          درخواست بررسی طرح تابلو و آگهی
        </a>
      </div>
    </div>
  );
};

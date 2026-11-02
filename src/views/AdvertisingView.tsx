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
      {/* Title Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4 text-[#FF9D50]" />
              <span>کمیسیون تخصصی تبلیغات و تابلوهای پزشکی استان ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              ضوابط قانونی تبلیغات پزشکی، تابلوها و فضای مجازی
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              راهنمای اخذ مجوز انتشار آگهی، استانداردهای تابلوی مطب، ضوابط سرنسخه و پیشگیری از
              تبلیغات غیرمجاز و مداخله‌گرایانه در امور پزشکی.
            </p>
          </div>

          <div className="text-left bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-2xl p-4 text-xs text-brand-dark shrink-0">
            <span className="font-bold block text-sm">ماده ۲۴ آیین‌نامه انتظامی:</span>
            <span className="text-brand-muted">هرگونه تبلیغ درمانی بدون مجوز کتبی تخلف محسوب می‌شود.</span>
          </div>
        </div>
      </div>

      {/* 4 Steps Application Flow */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="text-lg font-bold text-brand-dark">
          مراحل ۴ گانه اخذ مجوز تبلیغات و تابلوی مطب در نظام پزشکی ایلام
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADVERTISING_RULES.permitSteps.map((st) => (
            <div
              key={st.step}
              className="bg-[#F7F8F7] border border-brand-border rounded-xl p-5 text-xs space-y-3 relative"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-dark text-white font-bold flex items-center justify-center text-xs font-mono tabular-nums">
                {st.step}
              </div>
              <h4 className="font-bold text-brand-dark text-sm">{st.title}</h4>
              <p className="text-brand-muted leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Permitted vs Prohibited Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Permitted (Green) */}
        <div className="bg-white border border-[#55E07E]/40 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-[#55E07E]/30">
            <CheckCircle2 className="w-5 h-5 text-[#55E07E]" />
            <h3 className="text-lg font-bold text-brand-dark">
              مصادیق مجاز در تبلیغات و اطلاع‌رسانی
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-brand-dark">
            {ADVERTISING_RULES.permittedExamples.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#55E07E] shrink-0 mt-1.5"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prohibited (Red) */}
        <div className="bg-white border border-red-200 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-red-100">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-brand-dark">
              مصادیق ممنوع و تخلفات تبلیغاتی
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-brand-dark">
            {ADVERTISING_RULES.prohibitedExamples.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Standards for signage */}
      <div className="bg-[#F7F8F7] border border-brand-border rounded-2xl p-6 text-xs space-y-4">
        <h4 className="font-bold text-brand-dark text-base">
          استانداردهای ابعاد و عناوین تابلوی مطب در معابر شهری استان ایلام:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-brand-dark">
          <div className="bg-white p-4 rounded-xl border border-brand-border space-y-1">
            <strong className="block text-brand-dark text-xs">ابعاد مجاز تابلو:</strong>
            <p className="text-brand-muted leading-relaxed"><span className="tabular-nums">۷۰</span> در <span className="tabular-nums">۵۰</span> سانتی‌متر یا <span className="tabular-nums">۹۰</span> در <span className="tabular-nums">۶۰</span> سانتی‌متر برای معابر اصلی</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-border space-y-1">
            <strong className="block text-brand-dark text-xs">رنگ زمینه و متن:</strong>
            <p className="text-brand-muted leading-relaxed">پس‌زمینه سفید با نوشتار مشکی یا سرمه‌ای، بدون فلاش یا رقص نور</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-border space-y-1">
            <strong className="block text-brand-dark text-xs">عناوین مجاز:</strong>
            <p className="text-brand-muted leading-relaxed">فقط نام، نام خانوادگی، شماره نظام پزشکی و تخصص مندرج در پروانه</p>
          </div>
        </div>
      </div>

      {/* Contact box */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-brand-dark text-sm block">دبیرخانه کمیسیون تبلیغات نظام پزشکی ایلام</span>
          <span className="text-brand-muted mt-0.5 block">پاسخگویی: یکشنبه و سه‌شنبه <span className="tabular-nums">۹:۰۰</span> الی <span className="tabular-nums">۱۳:۰۰</span> | شماره داخلی: <span className="tabular-nums">۱۰۷</span></span>
        </div>
        <a
          href="tel:08432224560"
          className="text-[#FF9D50] border border-[#FF9D50] hover:bg-[#FF9D50] hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all tabular-nums shrink-0"
        >
          درخواست بررسی طرح تابلو و آگهی
        </a>
      </div>
    </div>
  );
};

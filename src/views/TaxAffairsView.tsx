import React, { useState } from 'react';
import { TAX_TOPICS, TAX_CALENDAR, TAX_FAQS } from '../data/taxData';
import {
  Scale,
  Calendar,
  HelpCircle,
  ExternalLink,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';

export const TaxAffairsView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full space-y-6">
      {/* Title Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <Scale className="w-4 h-4 text-[#FF9D50]" />
              <span>کمیسیون امور مالیاتی نظام پزشکی استان ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              راهنمای جامع مالیات بر درآمد پزشکان و صاحبان مطب
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              راهنمای قوانین تبصره ماده ۱۰۰، پایانه‌های فروشگاهی متصل، گواهی ماده ۱۸۶ و پاسخ به
              ابهامات مالیاتی جامعه پزشکی استان ایلام.
            </p>
          </div>

          <a
            href="https://my.tax.gov.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs bg-[#FF9D50] hover:bg-[#e0843a] text-white font-bold px-5 py-3 rounded-xl transition-all shadow-xs shrink-0"
          >
            <span>ورود به درگاه مایتکس (my.tax.gov.ir)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Institutional Legal Disclaimer */}
      <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-2xl p-5 text-xs text-brand-dark flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#FF9D50] shrink-0 mt-0.5" />
        <p className="leading-relaxed text-brand-muted">
          <strong className="text-brand-dark">سلب مسئولیت صنفی:</strong> اطلاعات مندرج در این صفحه صرفاً جهت راهنمایی کلی و
          اطلاع‌رسانی عمومی از قوانین جاری است و جایگزین مشاوره تخصصی حقوقی یا مالیاتی برای
          پرونده‌های خاص نمی‌باشد. اعضای محترم می‌توانند جهت پرونده‌های اختلافی با مشاور مالیاتی
          سازمان (داخلی <span className="tabular-nums">۱۰۸</span>) تعیین وقت فرمایند.
        </p>
      </div>

      {/* Tax Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TAX_TOPICS.map((top) => (
          <div
            key={top.id}
            className="bg-white border border-brand-border hover:border-[#FF9D50]/50 rounded-2xl p-6 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <span className="text-xs font-semibold text-brand-muted">
                قوانین و تکالیف
              </span>
              <h3 className="text-base sm:text-lg font-bold text-brand-dark group-hover:text-[#FF9D50] transition-colors leading-snug">
                {top.title}
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                {top.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-brand-border mt-4 text-xs text-brand-dark leading-relaxed bg-[#F7F8F7] p-4 rounded-xl border border-brand-border">
              <p className="whitespace-pre-line text-xs">{top.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Annual Tax Calendar */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#FF9D50]" />
          <span>تقویم مواعد مهم مالیاتی جامعه پزشکی در طول سال</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TAX_CALENDAR.map((cal, idx) => (
            <div
              key={idx}
              className="bg-[#F7F8F7] border border-brand-border rounded-xl p-5 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#FF9D50] text-sm">{cal.month}</span>
                <span className="text-[11px] text-brand-muted font-medium">
                  {cal.status}
                </span>
              </div>
              <h4 className="font-bold text-brand-dark text-sm">{cal.title}</h4>
              <p className="text-brand-muted leading-relaxed">{cal.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#1DCED8]" />
          <span>پرسش‌های متداول مالیاتی پزشکان و دندانپزشکان</span>
        </h3>

        <div className="space-y-3">
          {TAX_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="border border-brand-border rounded-xl overflow-hidden text-xs transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-right p-4 sm:p-5 bg-[#F7F8F7] hover:bg-slate-200/50 font-bold text-brand-dark flex items-center justify-between transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-brand-muted shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brand-muted shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="p-4 sm:p-5 bg-white text-brand-dark leading-relaxed border-t border-brand-border text-xs">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

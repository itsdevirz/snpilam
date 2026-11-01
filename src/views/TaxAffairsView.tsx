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
      {/* Title */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-semibold">
              <Scale className="w-4 h-4" />
              <span>کمیسیون امور مالیاتی نظام پزشکی استان ایلام</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              راهنمای جامع مالیات بر درآمد پزشکان و صاحبان مطب
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              راهنمای قوانین تبصره ماده ۱۰۰، پایانه‌های فروشگاهی متصل، گواهی ماده ۱۸۶ و پاسخ به
              ابهامات مالیاتی جامعه پزشکی استان ایلام
            </p>
          </div>

          <a
            href="https://my.tax.gov.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs bg-[#2463A6] text-white hover:bg-[#17365D] font-bold px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <span>ورود به درگاه مایتکس (my.tax.gov.ir)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Institutional Legal Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>سلب مسئولیت صنفی:</strong> اطلاعات مندرج در این صفحه صرفاً جهت راهنمایی کلی و
          اطلاع‌رسانی عمومی از قوانین جاری است و جایگزین مشاوره تخصصی حقوقی یا مالیاتی برای
          پرونده‌های خاص نمی‌باشد. اعضای محترم می‌توانند جهت پرونده‌های اختلافی با مشاور مالیاتی
          سازمان (داخلی ۱۰۸) تعیین وقت فرمایند.
        </p>
      </div>

      {/* Tax Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TAX_TOPICS.map((top) => (
          <div
            key={top.id}
            className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold text-[#2463A6] bg-[#EFF6FC] px-2.5 py-0.5 rounded">
                قوانین و تکالیف
              </span>
              <h3 className="text-base font-bold text-[#17365D] mt-2 mb-2 leading-snug">
                {top.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {top.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">
              <p className="whitespace-pre-line text-[11px]">{top.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Annual Tax Calendar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#17365D] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#2463A6]" />
          <span>تقویم مواعد مهم مالیاتی جامعه پزشکی در طول سال</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TAX_CALENDAR.map((cal, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2463A6]">{cal.month}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  {cal.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900">{cal.title}</h4>
              <p className="text-slate-600 leading-relaxed">{cal.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#17365D] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#2463A6]" />
          <span>پرسش‌های متداول مالیاتی پزشکان و دندانپزشکان</span>
        </h3>

        <div className="space-y-3">
          {TAX_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl overflow-hidden text-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-right p-4 bg-slate-50 hover:bg-slate-100 font-bold text-[#17365D] flex items-center justify-between transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {openFaq === idx && (
                <div className="p-4 bg-white text-slate-700 leading-relaxed border-t border-slate-200">
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

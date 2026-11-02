import React, { useState } from 'react';
import { WELFARE_SERVICES } from '../data/welfareData';
import {
  Briefcase,
  ShieldCheck,
  Building,
  Plane,
  Heart,
  Scale,
  Phone,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export const WelfareView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');

  const categories = [
    'همه',
    'بیمه درمان تکمیلی',
    'تسهیلات بانکی',
    'اقامتی و سیاحتی',
    'مراکز ورزشی و رفاهی',
    'خدمات حقوقی و مشاوره',
  ];

  const filteredList = WELFARE_SERVICES.filter((item) => {
    if (selectedCategory === 'همه') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="w-full space-y-6">
      {/* Title Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <Briefcase className="w-4 h-4 text-[#FF9D50]" />
              <span>کمیسیون رفاه و تعاون اعضای نظام پزشکی ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              خدمات رفاهی، بیمه تکمیلی و تسهیلات بانکی
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              ارائه بسته‌های جامع بیمه درمان تکمیلی و مسئولیت حرفه‌ای، وام‌های تجهیز مطب، اقامتگاه‌های
              رفاهی مشهد و شمال و تفاهم‌نامه‌های تخفیفاتی طرف قرارداد سازمان.
            </p>
          </div>

          <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-2xl p-4 text-xs shrink-0">
            <span className="text-brand-muted block text-[11px]">واحد رفاه و اعتبارات:</span>
            <span className="text-brand-dark font-sans font-bold text-base tabular-nums">
              داخلی ۱۰۳ (ساختمان مرکزی)
            </span>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-brand-border">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === c
                ? 'bg-brand-dark text-white'
                : 'bg-white text-brand-dark hover:bg-[#F7F8F7] border border-brand-border'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Welfare Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-brand-border hover:border-[#FF9D50]/50 rounded-2xl p-6 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-brand-border">
                <span className="font-medium text-brand-dark">
                  {item.category}
                </span>

                <span className="font-bold text-[#55E07E] bg-[#55E07E]/10 px-3 py-1 rounded-lg border border-[#55E07E]/20">
                  {item.discountRate}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-brand-dark group-hover:text-[#FF9D50] transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-brand-muted">طرف قرارداد: <strong className="text-brand-dark">{item.partnerName}</strong></p>

              <p className="text-xs text-brand-muted leading-relaxed">{item.description}</p>

              {/* Terms */}
              <div className="bg-[#F7F8F7] p-4 rounded-xl border border-brand-border text-xs space-y-2">
                <span className="font-bold text-brand-dark block text-xs">شرایط بهره‌مندی:</span>
                <ul className="space-y-1.5 text-brand-muted list-disc list-inside leading-relaxed text-xs">
                  {item.terms.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border mt-5 flex items-center justify-between text-xs">
              <a
                href={`tel:${item.contactPhone.replace(/[- ]/g, '')}`}
                className="text-[#FF9D50] hover:text-[#e0843a] flex items-center gap-1.5 font-bold font-sans tabular-nums"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{item.contactPhone}</span>
              </a>

              <span className="text-[11px] text-brand-muted">تفاهم‌نامه رسمی نظام پزشکی</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

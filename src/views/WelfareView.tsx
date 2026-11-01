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
      {/* Title */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-semibold">
              <Briefcase className="w-4 h-4" />
              <span>کمیسیون رفاه و تعاون اعضای نظام پزشکی ایلام</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              خدمات رفاهی، بیمه تکمیلی و تسهیلات بانکی جامعه پزشکی
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              ارائه بسته‌های جامع بیمه درمان تکمیلی و مسئولیت حرفه‌ای، وام‌های تجهیز مطب، اقامتگاه‌های
              رفاهی مشهد و شمال و تفاهم‌نامه‌های تخفیفاتی طرف قرارداد سازمان.
            </p>
          </div>

          <div className="bg-[#EFF6FC] border border-[#2463A6]/30 rounded-xl p-3 text-xs text-left">
            <span className="text-[#2463A6] font-bold block">واحد رفاه و اعتبارات:</span>
            <span className="text-slate-800 font-sans font-bold text-sm">
              داخلی ۱۰۳ (ساختمان مرکزی)
            </span>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E2E8F0]">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`text-xs px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${
              selectedCategory === c
                ? 'bg-[#17365D] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
            className="bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-semibold text-[#2463A6] bg-[#EFF6FC] px-2.5 py-0.5 rounded">
                  {item.category}
                </span>

                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {item.discountRate}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#17365D] mb-1.5 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 mb-3">طرف قرارداد: {item.partnerName}</p>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.description}</p>

              {/* Terms */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs mb-4">
                <span className="font-bold text-slate-800 block mb-1.5">شرایط بهره‌مندی:</span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {item.terms.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1 font-sans">
                <Phone className="w-3.5 h-3.5 text-[#2463A6]" />
                <span>{item.contactPhone}</span>
              </span>

              <span className="text-[11px] text-slate-400">تفاهم‌نامه رسمی نظام پزشکی</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

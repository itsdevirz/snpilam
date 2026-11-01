import React, { useState, useMemo } from 'react';
import { Facility } from '../types';
import { COUNCIL_INFO } from '../data/councilData';
import { useDataContext } from '../context/DataContext';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const FacilitiesView: React.FC = () => {
  const { facilities } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');

  const facilityTypes = [
    'همه انواع مراکز',
    'بیمارستان',
    'درمانگاه شبانه‌روزی',
    'مرکز جراحی محدود',
    'مرکز تصویربرداری و ام‌آر‌آی',
    'کلینیک دندانپزشکی',
    'آزمایشگاه تشخیص طبی',
  ];

  const counties = ['همه شهرستان‌ها', ...COUNCIL_INFO.jurisdictionCounties];

  const filteredFacilities = useMemo(() => {
    return facilities.filter((f) => {
      const matchSearch =
        !searchTerm.trim() ||
        f.name.includes(searchTerm) ||
        f.address.includes(searchTerm) ||
        f.manager.includes(searchTerm) ||
        f.services.some((s) => s.includes(searchTerm));

      const matchType =
        !selectedType || selectedType === 'همه انواع مراکز' || f.type === selectedType;

      const matchCounty =
        !selectedCounty || selectedCounty === 'همه شهرستان‌ها' || f.county === selectedCounty;

      return matchSearch && matchType && matchCounty;
    });
  }, [searchTerm, selectedType, selectedCounty]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-semibold">
              <Building2 className="w-4 h-4" />
              <span>پورتال نظارت بر موسسات درمانی استان ایلام</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              جستجوی مراکز درمانی، بیمارستان‌ها و کلینیک‌های استان
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              بانک اطلاعات بیمارستان‌های دولتی و خصوصی، مراکز جراحی محدود، درمانگاه‌های شبانه‌روزی،
              مراکز تصویربرداری، آزمایشگاه‌ها و کلینیک‌های دندانپزشکی دارای پروانه بهره‌برداری
              معتبر.
            </p>
          </div>

          <div className="bg-[#EFF6FC] border border-[#2463A6]/30 rounded-xl p-3 text-xs text-left">
            <span className="text-[#2463A6] font-bold block">مراکز فعال تاییدشده:</span>
            <span className="text-slate-800 font-sans font-bold text-sm">
              {facilities.length} مرکز درمانی
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="نام مرکز درمانی، بخش‌ها، خدمات یا نشانی..."
              className="w-full text-xs sm:text-sm bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg pr-9 pl-3 py-2.5 text-[#202B38] focus:bg-white focus:outline-none focus:border-[#2463A6]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#2463A6]"
            >
              {facilityTypes.map((t) => (
                <option key={t} value={t === 'همه انواع مراکز' ? '' : t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#2463A6]"
            >
              {counties.map((c) => (
                <option key={c} value={c === 'همه شهرستان‌ها' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-600">
            تعداد نتایج: <strong className="text-[#2463A6] font-sans">{filteredFacilities.length}</strong> مرکز
          </span>
          {(searchTerm || selectedType || selectedCounty) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('');
                setSelectedCounty('');
              }}
              className="text-[#C83E4D] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>پاکسازی فیلترها</span>
            </button>
          )}
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFacilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold text-[#2463A6] bg-[#EFF6FC] px-2 py-0.5 rounded">
                    {fac.type}
                  </span>
                  <h3 className="text-base font-bold text-[#17365D] mt-1.5">{fac.name}</h3>
                  <p className="text-xs text-slate-500">
                    شهرستان {fac.county} ({fac.city})
                  </p>
                </div>

                <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                  {fac.licenseStatus}
                </span>
              </div>

              <div className="py-3 space-y-2 text-xs text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <p>ریاست / مدیریت: <strong>{fac.manager}</strong></p>
                  <p>مسئول فنی: <strong>{fac.technicalSupervisor}</strong></p>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed line-clamp-2">{fac.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>پذیرش: {fac.workingHours}</span>
                </div>
              </div>

              {/* Service tags */}
              <div className="pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {fac.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
              <a
                href={`tel:${fac.phone.replace(/-/g, '')}`}
                className="font-bold text-[#2463A6] font-sans flex items-center gap-1.5 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{fac.phone}</span>
              </a>

              <span className="text-[11px] text-slate-400">تحت نظارت نظام پزشکی و معاونت درمان</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

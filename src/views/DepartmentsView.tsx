import React, { useState } from 'react';
import { DepartmentInfo } from '../types';
import { DEPARTMENTS_DATA } from '../data/departmentsData';
import {
  Building2,
  User,
  Phone,
  Mail,
  Clock,
  MapPin,
  CheckCircle,
  FileText,
  ChevronLeft,
} from 'lucide-react';

export const DepartmentsView: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<DepartmentInfo>(DEPARTMENTS_DATA[0]);

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-semibold">
              <Building2 className="w-4 h-4" />
              <span>ساختار سازمانی و کمیسیون‌های تخصصی</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              کمیسیون‌ها، دادسرا و واحدهای اجرایی نظام پزشکی ایلام
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              معرفی شرح وظایف قانونی، مسئولین واحدها، خدمات قابل ارائه، ساعات پاسخگویی حضوری و
              شماره‌های تماس داخلی هر بخش.
            </p>
          </div>

          <div className="bg-[#EFF6FC] border border-[#2463A6]/30 rounded-xl p-3 text-xs text-left">
            <span className="text-[#2463A6] font-bold block">مجموع کمیسیون‌ها و واحدها:</span>
            <span className="text-slate-800 font-sans font-bold text-sm">
              {DEPARTMENTS_DATA.length} واحد تخصصی
            </span>
          </div>
        </div>
      </div>

      {/* 2-column layout: List on right (desktop), details on left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {DEPARTMENTS_DATA.map((dept) => {
            const isSelected = dept.id === selectedDept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept)}
                className={`w-full text-right p-4 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#17365D] text-white border-[#17365D] shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-[#E2E8F0]'
                }`}
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold leading-snug">{dept.title}</h4>
                  <p className={`text-[11px] mt-1 ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                    مسئول: {dept.director}
                  </p>
                </div>
                <ChevronLeft className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Detailed Department Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-7 shadow-xs space-y-6">
          {/* Header */}
          <div className="pb-4 border-b border-slate-200">
            <span className="text-xs font-semibold text-[#2463A6] bg-[#EFF6FC] px-2.5 py-0.5 rounded">
              واحد اداری / کمیسیون تخصصی
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#17365D] mt-2">
              {selectedDept.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              مسئول واحد: <strong className="text-slate-900">{selectedDept.director}</strong> ({selectedDept.role})
            </p>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
            {selectedDept.description}
          </div>

          {/* Responsibilities */}
          <div>
            <h4 className="text-sm font-bold text-[#17365D] mb-2.5 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#24845B]" />
              <span>شرح وظایف و ماموریت‌های قانونی واحد</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
              {selectedDept.responsibilities.map((r, idx) => (
                <li key={idx} className="leading-relaxed">
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold text-[#17365D] mb-2.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#2463A6]" />
              <span>خدمات قابل ارائه به مراجعین و همکاران</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedDept.services.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="bg-[#EFF6FC] border border-[#2463A6]/20 rounded-xl p-4 text-xs space-y-2.5">
            <h4 className="font-bold text-[#17365D] text-xs">اطلاعات دسترسی و پاسخگویی مستقیم:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2463A6]" />
                <span>مرکز تلفن: {selectedDept.phone} (<strong>{selectedDept.extension}</strong>)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2463A6]" />
                <span className="font-mono text-[11px]">{selectedDept.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2463A6]" />
                <span>ساعات کار: {selectedDept.officeHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2463A6]" />
                <span className="line-clamp-1">{selectedDept.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

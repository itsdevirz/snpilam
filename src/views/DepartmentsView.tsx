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
      {/* Title Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <Building2 className="w-4 h-4 text-[#FF9D50]" />
              <span>ساختار سازمانی و کمیسیون‌های تخصصی استان ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              کمیسیون‌ها، دادسرا و واحدهای اجرایی نظام پزشکی
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              معرفی شرح وظایف قانونی، مسئولین واحدها، خدمات قابل ارائه، ساعات پاسخگویی حضوری و
              شماره‌های تماس داخلی هر بخش.
            </p>
          </div>

          <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-2xl p-4 text-xs shrink-0">
            <span className="text-brand-muted block text-[11px]">مجموع کمیسیون‌ها و واحدها:</span>
            <span className="text-brand-dark font-sans font-bold text-base tabular-nums">
              {DEPARTMENTS_DATA.length} واحد تخصصی
            </span>
          </div>
        </div>
      </div>

      {/* 2-column layout: List on right (desktop), details on left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar List (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          {DEPARTMENTS_DATA.map((dept) => {
            const isSelected = dept.id === selectedDept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept)}
                className={`w-full text-right p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-brand-dark text-white border-brand-dark shadow-xs'
                    : 'bg-white hover:bg-[#F7F8F7] text-brand-dark border-brand-border'
                }`}
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold leading-snug">{dept.title}</h4>
                  <p className={`text-[11px] mt-1 ${isSelected ? 'text-slate-300' : 'text-brand-muted'}`}>
                    مسئول: {dept.director}
                  </p>
                </div>
                <ChevronLeft className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#FF9D50]' : 'text-brand-muted'}`} />
              </button>
            );
          })}
        </div>

        {/* Detailed Department Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="pb-4 border-b border-brand-border space-y-2">
            <span className="text-xs font-semibold text-brand-muted">
              واحد اداری / کمیسیون تخصصی
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-brand-dark">
              {selectedDept.title}
            </h3>
            <p className="text-xs text-brand-muted">
              مسئول واحد: <strong className="text-brand-dark">{selectedDept.director}</strong> ({selectedDept.role})
            </p>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-brand-dark leading-relaxed bg-[#F7F8F7] p-5 rounded-2xl border border-brand-border">
            {selectedDept.description}
          </div>

          {/* Responsibilities */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-brand-dark flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#55E07E]" />
              <span>شرح وظایف و ماموریت‌های قانونی واحد</span>
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted list-disc list-inside leading-relaxed">
              {selectedDept.responsibilities.map((r, idx) => (
                <li key={idx}>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-brand-dark flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1DCED8]" />
              <span>خدمات قابل ارائه به مراجعین و همکاران</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {selectedDept.services.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-[#F7F8F7] border border-brand-border rounded-xl p-3 text-brand-dark"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-2xl p-5 text-xs space-y-3">
            <h4 className="font-bold text-brand-dark text-xs sm:text-sm">اطلاعات دسترسی و پاسخگویی مستقیم:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-brand-dark">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF9D50]" />
                <span>مرکز تلفن: <span className="tabular-nums">{selectedDept.phone}</span> (داخلی <strong className="tabular-nums">{selectedDept.extension}</strong>)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1DCED8]" />
                <span className="font-mono text-[11px]">{selectedDept.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-muted" />
                <span>ساعات کار: <span className="tabular-nums">{selectedDept.officeHours}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-muted" />
                <span>{selectedDept.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

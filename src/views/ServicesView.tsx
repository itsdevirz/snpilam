import React, { useState } from 'react';
import { ServiceItem } from '../types';
import { useDataContext } from '../context/DataContext';
import {
  FileText,
  Clock,
  Phone,
  CheckCircle,
  Download,
  Search,
  ExternalLink,
  ChevronLeft,
  X,
  ClipboardList,
  ArrowLeft,
} from 'lucide-react';

interface ServicesViewProps {
  initialServiceId?: string;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ initialServiceId }) => {
  const { services, messages } = useDataContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeService, setActiveService] = useState<ServiceItem | null>(() => {
    if (initialServiceId) {
      return services.find((s) => s.id === initialServiceId) || null;
    }
    return null;
  });

  // Tracking state
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<{
    code: string;
    department: string;
    subject: string;
    applicant: string;
    phone: string;
    statusText: string;
    statusType: 'new' | 'investigating' | 'resolved';
    date: string;
    messageText: string;
    adminReply?: string;
  } | null>(null);
  const [trackingError, setTrackingError] = useState('');

  const categories = [
    'همه',
    'پروانه‌ها و مجوزها',
    'عضویت و مدارک',
    'مالیات و تعرفه',
    'تبلیغات و نظارت',
  ];

  const filteredServices = services.filter((svc) => {
    const matchesCategory =
      selectedCategory === 'همه' || svc.category === selectedCategory;
    const matchesSearch =
      svc.title.includes(searchQuery) ||
      svc.summary.includes(searchQuery) ||
      svc.department.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleTrackRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingCode.trim().toLowerCase();
    if (!query) {
      setTrackingError('لطفاً کد رهگیری درخواست را وارد نمایید.');
      setTrackingResult(null);
      return;
    }

    setTrackingError('');
    const found = messages.find(
      (m) =>
        (m.trackingCode && m.trackingCode.toLowerCase() === query) ||
        m.id.toLowerCase() === query ||
        m.phone === query
    );

    if (found) {
      const statusText =
        found.status === 'resolved'
          ? 'پاسخ داده شده و مختومه'
          : found.status === 'investigating'
          ? 'در حال بررسی کارشناسی در واحد مربوطه'
          : 'ثبت جدید - در نوبت ارجاع';

      setTrackingResult({
        code: found.trackingCode || found.id,
        department: found.department,
        subject: found.subject,
        applicant: found.fullName,
        phone: found.phone,
        statusText,
        statusType: found.status,
        date: found.date,
        messageText: found.message,
        adminReply: found.adminReply,
      });
    } else {
      setTrackingResult(null);
      setTrackingError(
        'هیچ پرونده، شکایت یا درخواستی با این کد رهگیری در دیتابیس یافت نشد. لطفاً کد رهگیری ارسالی (مانند IR-1405-87654321) را به دقت بررسی نمایید.'
      );
    }
  };

  return (
    <div className="w-full space-y-10">
      {/* Header and Breadcrumb */}
      <div className="bg-white border border-[#E9ECEF] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#777F87] mb-1">
              <span>میز خدمات دیجیتال</span>
              <span aria-hidden="true">/</span>
              <span>راهنمای اداری و مدارک</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#20242A]">
              خدمات الکترونیک و امور صنفی اعضا
            </h1>
            <p className="text-xs sm:text-sm text-[#777F87] mt-1 max-w-2xl leading-relaxed">
              راهنمای جامع مراحل اداری، مدارک الزامی، فرم‌های دانلودی و پیگیری کلیه درخواست‌های پروانه‌ها، عضویت و مشاوره‌های تخصصی نظام پزشکی استان ایلام
            </p>
          </div>
        </div>
      </div>

      {/* Online Request Tracking Box */}
      <div className="bg-[#FFF9D8]/50 border border-[#FF9D50]/40 rounded-2xl p-6">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-base font-bold text-[#20242A] flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#FF9D50]" />
            <span>سامانه استعلام و پیگیری وضعیت پرونده‌های ثبتی</span>
          </h2>
          <p className="text-xs text-[#777F87]">
            کد رهگیری دریافت شده از دبیرخانه نظام پزشکی ایلام یا سامانه الکترونیک را جهت مشاهده آخرین وضعیت وارد نمایید.
          </p>

          <form onSubmit={handleTrackRequest} className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="مثال: IR-1405-87654321 یا شماره درخواست..."
              className="flex-1 text-xs bg-white border border-[#E9ECEF] rounded-xl px-4 py-3 text-[#20242A] focus:outline-none focus:border-[#FF9D50]"
            />
            <button
              type="submit"
              className="text-xs bg-[#20242A] hover:bg-[#20242A]/90 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              استعلام وضعیت
            </button>
          </form>

          {trackingError && (
            <p className="text-xs text-[#E5484D] font-medium pt-1">{trackingError}</p>
          )}

          {trackingResult && (
            <div className="mt-4 bg-white border border-[#E9ECEF] rounded-xl p-5 text-xs space-y-3 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9ECEF] flex-wrap gap-2">
                <span className="font-bold text-[#20242A]">
                  کد رهگیری: <span className="font-mono text-[#FF9D50] bg-[#FFF9D8] px-2 py-0.5 rounded dir-ltr inline-block">{trackingResult.code}</span>
                </span>
                <span className="font-bold text-[#20242A]">
                  وضعیت پرونده: {trackingResult.statusText}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#777F87]">
                <p>عنوان موضوع: <strong className="text-[#20242A]">{trackingResult.subject}</strong></p>
                <p>متقاضی: <strong className="text-[#20242A]">{trackingResult.applicant}</strong> ({trackingResult.phone})</p>
                <p>تاریخ ثبت: <span className="font-sans tabular-nums">{trackingResult.date}</span></p>
                <p>واحد ارجاع: <strong className="text-[#20242A]">{trackingResult.department}</strong></p>
              </div>

              <div className="bg-[#F7F8F7] p-3 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-[#20242A] block">شرح درخواست ارسالی:</span>
                <p className="text-[#777F87] leading-relaxed text-[11px]">{trackingResult.messageText}</p>
              </div>

              {trackingResult.adminReply ? (
                <div className="bg-[#55E07E]/10 border border-[#55E07E]/30 p-3 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-[#20242A] block">پاسخ رسمی کارشناس/دبیرخانه:</span>
                  <p className="text-[#20242A] leading-relaxed font-medium">{trackingResult.adminReply}</p>
                </div>
              ) : (
                <p className="text-[#FF9D50] bg-[#FFF9D8]/80 p-2.5 rounded-xl text-[11px]">
                  درخواست شما ثبت شده و در صف بررسی کارشناسی مسئولین واحد {trackingResult.department} قرار دارد.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#20242A] text-white'
                  : 'bg-white border border-[#E9ECEF] text-[#777F87] hover:text-[#20242A] hover:bg-[#F7F8F7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی عنوان خدمت یا واحد..."
            className="w-full text-xs bg-white border border-[#E9ECEF] rounded-xl pr-9 pl-3 py-2.5 text-[#20242A] focus:outline-none focus:border-[#FF9D50]"
          />
          <Search className="w-4 h-4 text-[#777F87] absolute right-3 top-3" />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            className="bg-white border border-[#E9ECEF] hover:border-[#1DCED8] rounded-2xl p-6 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#777F87] mb-3">
                <span className="font-bold text-[#1DCED8]">
                  {svc.category}
                </span>
                <span className="flex items-center gap-1 font-sans tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{svc.processingTime}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-[#20242A] group-hover:text-[#1DCED8] transition-colors mb-2 leading-snug">
                {svc.title}
              </h3>

              <p className="text-xs text-[#777F87] line-clamp-3 leading-relaxed mb-4">
                {svc.summary}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#E9ECEF]">
              <div className="text-[11px] text-[#777F87] flex items-center justify-between">
                <span>واحد مجری: {svc.department}</span>
                <span>تلفن: {svc.phoneExtension}</span>
              </div>

              <button
                onClick={() => setActiveService(svc)}
                className="w-full text-xs font-bold bg-[#F7F8F7] hover:bg-[#1DCED8] text-[#20242A] hover:text-white py-2.5 px-3 rounded-xl border border-[#E9ECEF] hover:border-[#1DCED8] transition-all flex items-center justify-center gap-1.5"
              >
                <span>مشاهده مراحل و چک‌لیست مدارک</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Detail Modal */}
      {activeService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E9ECEF]">
              <div>
                <span className="text-xs font-bold text-[#1DCED8]">
                  {activeService.category}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#20242A] mt-1">
                  {activeService.title}
                </h2>
                <p className="text-xs text-[#777F87] mt-1">
                  واحد مسئول: {activeService.department} | پاسخگویی: {activeService.phoneExtension}
                </p>
              </div>
              <button
                onClick={() => setActiveService(null)}
                className="p-2 rounded-xl text-[#777F87] hover:text-[#20242A] hover:bg-[#F7F8F7] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-[#777F87] leading-relaxed bg-[#F7F8F7] p-4 rounded-xl border border-[#E9ECEF]">
              {activeService.description}
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#20242A] mb-2.5 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#55E07E]" />
                <span>شرایط و پیش‌نیازهای احراز</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-[#777F87] list-disc list-inside">
                {activeService.prerequisites.map((p, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#20242A] mb-2.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#FF9D50]" />
                <span>مدارک مورد نیاز جهت ارائه</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-[#777F87] list-disc list-inside">
                {activeService.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#20242A] mb-2.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#1DCED8]" />
                <span>مراحل گام‌به‌گام انجام فرایند</span>
              </h3>
              <ol className="space-y-2 text-xs text-[#777F87]">
                {activeService.steps.map((st, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-lg bg-[#F7F8F7] text-[#20242A] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 font-sans">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{st}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-[#FFF9D8]/50 border border-[#FF9D50]/30 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#20242A]">
                <p>زمان انجام: <strong>{activeService.processingTime}</strong></p>
                <p>تعرفه قانونی: <strong>{activeService.feeInfo}</strong></p>
              </div>

              {activeService.downloadableForms.length > 0 && (
                <div className="pt-2 border-t border-[#FF9D50]/30">
                  <h4 className="text-xs font-bold text-[#20242A] mb-2">
                    فرم‌های رسمی قابل دانلود:
                  </h4>
                  <div className="space-y-2">
                    {activeService.downloadableForms.map((frm, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white border border-[#E9ECEF] rounded-xl p-3 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#FF9D50]" />
                          <span className="font-bold text-[#20242A]">{frm.title}</span>
                          <span className="text-[10px] text-[#777F87]">({frm.format} - {frm.size})</span>
                        </div>
                        <a
                          href="#download"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`درخواست دانلود «${frm.title}». این سند به صورت پیش‌نمایش در سامانه موجود است.`);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#FF9D50] hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>دانلود</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E9ECEF]">
              <a
                href="https://irimc.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs bg-[#FF9D50] hover:bg-[#ff8f38] text-[#20242A] font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                <span>شروع ثبت درخواست در پرتال مرکزی (IRIMC)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setActiveService(null)}
                className="text-xs text-[#777F87] hover:text-[#20242A] px-4 py-2"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

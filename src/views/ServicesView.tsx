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
  ShieldAlert,
  ArrowRight,
  ClipboardList,
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
    // Real search in database messages
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
    <div className="w-full space-y-8">
      {/* Header and Breadcrumb */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-medium">
              <span>میز خدمات دیجیتال</span>
              <span>/</span>
              <span>راهنمای اداری و مدارک</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              خدمات الکترونیک و امور صنفی اعضا
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              راهنمای جامع مراحل اداری، مدارک الزامی، فرم‌های دانلودی و پیگیری کلیه درخواست‌های
              پروانه‌ها، عضویت و مشاوره‌های تخصصی نظام پزشکی استان ایلام
            </p>
          </div>

        </div>
      </div>

      {/* Online Request Tracking Box */}
      <div className="bg-[#EFF6FC] border border-[#2463A6]/30 rounded-xl p-5 sm:p-6">
        <div className="max-w-3xl">
          <h3 className="text-base font-bold text-[#17365D] mb-1 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#2463A6]" />
            <span>سامانه استعلام و پیگیری وضعیت پرونده‌های ثبتی</span>
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            کد رهگیری دریافت شده از دبیرخانه نظام پزشکی ایلام یا سامانه الکترونیک را جهت مشاهده آخرین
            وضعیت وارد نمایید.
          </p>

          <form onSubmit={handleTrackRequest} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="مثال: IR-1405-87654321 یا شماره درخواست..."
              className="flex-1 text-xs bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2.5 text-[#202B38] focus:outline-none focus:border-[#2463A6]"
            />
            <button
              type="submit"
              className="text-xs bg-[#2463A6] hover:bg-[#17365D] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              استعلام وضعیت
            </button>
          </form>

          {trackingError && (
            <p className="text-xs text-[#C83E4D] mt-2 font-medium">{trackingError}</p>
          )}

          {trackingResult && (
            <div className="mt-4 bg-white border border-[#2463A6]/40 rounded-lg p-4 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                <span className="font-bold text-[#17365D]">
                  کد رهگیری: <span className="font-mono text-[#2463A6] bg-[#EFF6FC] px-2 py-0.5 rounded dir-ltr inline-block">{trackingResult.code}</span>
                </span>
                <span
                  className={`font-medium px-2.5 py-1 rounded text-[11px] ${
                    trackingResult.statusType === 'resolved'
                      ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                      : trackingResult.statusType === 'investigating'
                      ? 'text-amber-800 bg-amber-50 border border-amber-200'
                      : 'text-sky-800 bg-sky-50 border border-sky-200'
                  }`}
                >
                  وضعیت پرونده: {trackingResult.statusText}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <p>عنوان موضوع/شکواییه: <strong className="text-slate-900">{trackingResult.subject}</strong></p>
                <p>متقاضی / فرستنده: <strong className="text-slate-900">{trackingResult.applicant}</strong> ({trackingResult.phone})</p>
                <p>تاریخ ثبت در دیتابیس: <span className="font-sans">{trackingResult.date}</span></p>
                <p>واحد ارجاع‌شونده: <strong>{trackingResult.department}</strong></p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">شرح درخواست ارسالی:</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">{trackingResult.messageText}</p>
              </div>

              {trackingResult.adminReply ? (
                <div className="bg-emerald-50 p-3 rounded border border-emerald-200 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                    <span>پاسخ رسمی کارشناس/دبیرخانه:</span>
                  </span>
                  <p className="text-emerald-800 leading-relaxed font-medium">{trackingResult.adminReply}</p>
                </div>
              ) : (
                <p className="text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 text-[11px]">
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
              className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#17365D] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-slate-700 hover:bg-[#F5F7FA]'
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
            className="w-full text-xs bg-white border border-[#E2E8F0] rounded-lg pr-9 pl-3 py-2 text-[#202B38] focus:outline-none focus:border-[#2463A6]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            className="bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                <span className="font-semibold text-[#2463A6] bg-[#EFF6FC] px-2 py-0.5 rounded">
                  {svc.category}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{svc.processingTime}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-[#17365D] mb-2 leading-snug">
                {svc.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                {svc.summary}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>واحد مجری: {svc.department}</span>
                <span>تلفن: {svc.phoneExtension}</span>
              </div>

              <button
                onClick={() => setActiveService(svc)}
                className="w-full text-xs font-semibold bg-[#F5F7FA] hover:bg-[#2463A6] text-[#17365D] hover:text-white py-2.5 px-3 rounded-lg border border-[#E2E8F0] hover:border-[#2463A6] transition-all flex items-center justify-center gap-1.5"
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
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#2463A6] bg-[#EFF6FC] px-2.5 py-1 rounded">
                  {activeService.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#17365D] mt-2">
                  {activeService.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  واحد مسئول: {activeService.department} | پاسخگویی تلفنی: {activeService.phoneExtension}
                </p>
              </div>
              <button
                onClick={() => setActiveService(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="بستن پنجره"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
              {activeService.description}
            </div>

            {/* Prerequisites */}
            <div>
              <h4 className="text-sm font-bold text-[#17365D] mb-2.5 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#24845B]" />
                <span>شرایط و پیش‌نیازهای احراز</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {activeService.prerequisites.map((p, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div>
              <h4 className="text-sm font-bold text-[#17365D] mb-2.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#2463A6]" />
                <span>مدارک مورد نیاز جهت بارگذاری یا ارائه حضوری</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {activeService.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps Workflow */}
            <div>
              <h4 className="text-sm font-bold text-[#17365D] mb-2.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C77920]" />
                <span>مراحل گام‌به‌گام انجام فرایند</span>
              </h4>
              <ol className="space-y-2 text-xs text-slate-700">
                {activeService.steps.map((st, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#EFF6FC] text-[#2463A6] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{st}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Meta & Downloadable Forms */}
            <div className="bg-[#EFF6FC]/60 border border-[#2463A6]/20 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <p>زمان تقریبی انجام: <strong className="text-slate-900">{activeService.processingTime}</strong></p>
                <p>هزینه و تعرفه قانونی: <strong className="text-slate-900">{activeService.feeInfo}</strong></p>
              </div>

              {activeService.downloadableForms.length > 0 && (
                <div className="pt-2 border-t border-[#2463A6]/20">
                  <h5 className="text-xs font-bold text-[#17365D] mb-2">
                    فرم‌های رسمی قابل دانلود (نسخه مصوب):
                  </h5>
                  <div className="space-y-2">
                    {activeService.downloadableForms.map((frm, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white border border-[#CBD5E1] rounded-lg p-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#2463A6]" />
                          <span className="font-medium text-slate-800">{frm.title}</span>
                          <span className="text-[10px] text-slate-400">({frm.format} - {frm.size})</span>
                        </div>
                        <a
                          href="#download"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`درخواست دانلود «${frm.title}». این سند به صورت پیش‌نمایش در سامانه موجود است.`);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2463A6] hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>دانلود فرم</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <a
                href="https://irimc.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs bg-[#2463A6] text-white hover:bg-[#17365D] font-bold px-4 py-2.5 rounded-lg transition-colors"
              >
                <span>شروع ثبت درخواست در پرتال مرکزی (IRIMC)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setActiveService(null)}
                className="text-xs text-slate-600 hover:text-slate-900 px-4 py-2"
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

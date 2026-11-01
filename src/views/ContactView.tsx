import React, { useState } from 'react';
import { COUNCIL_INFO } from '../data/councilData';
import { DEPARTMENTS_DATA } from '../data/departmentsData';
import { useDataContext } from '../context/DataContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Building,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { addMessage } = useDataContext();
  const [formType, setFormType] = useState<'inquiry' | 'suggestion' | 'complaint'>('inquiry');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    department: 'دبیرخانه مرکزی',
    nationalCode: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.message) {
      setErrorMsg('لطفاً نام، شماره تماس و متن پیام را تکمیل نمایید.');
      return;
    }
    setErrorMsg('');

    addMessage({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      department: formData.department,
      subject: formData.subject || (formType === 'complaint' ? 'شکایت انتظامی' : 'درخواست اداری'),
      message: formData.message,
      type: formType,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="w-full space-y-8">
      {/* Title */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-semibold">
              <Phone className="w-4 h-4" />
              <span>پاسخگویی، میز خدمت و راهنمای مراجعین</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              تماس با سازمان نظام پزشکی استان ایلام
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              ارتباط مستقیم با ریاست، دادسرای انتظامی، واحد امور پروانه‌ها، آموزش مداوم و ارسال
              درخواست‌ها و شکایات رسمی.
            </p>
          </div>

          <div className="bg-[#EFF6FC] border border-[#2463A6]/30 rounded-xl p-3 text-xs text-left">
            <span className="text-[#2463A6] font-bold block">مرکز تلفن سراسری:</span>
            <span className="text-slate-800 font-sans font-bold text-sm">
              {COUNCIL_INFO.phoneCentral}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Contact Cards & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info & Map (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Address & Hours Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#17365D] pb-2 border-b border-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2463A6]" />
              <span>موقعیت مکانی و ساعات پذیرش</span>
            </h3>

            <div className="space-y-3 text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">نشانی ساختمان مرکزی:</strong>
                  <p className="leading-relaxed text-slate-600">{COUNCIL_INFO.address}</p>
                  <p className="text-slate-400 font-sans mt-0.5">کد پستی: {COUNCIL_INFO.postalCode}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">ساعات پاسخگویی اداری:</strong>
                  <p className="text-slate-600">{COUNCIL_INFO.workingDays}: {COUNCIL_INFO.workingHours}</p>
                  <p className="text-slate-500">{COUNCIL_INFO.thursdayHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">تلفن‌های ارتباطی:</strong>
                  <p className="text-slate-600 font-sans">مرکز تلفن: {COUNCIL_INFO.phoneCentral}</p>
                  <p className="text-slate-600 font-sans">خط مستقیم دبیرخانه: {COUNCIL_INFO.phoneDirect}</p>
                  <p className="text-slate-500 font-sans">نمابر (فکس): {COUNCIL_INFO.fax}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">پست الکترونیک رسمی:</strong>
                  <p className="text-slate-600 font-mono text-[11px]">{COUNCIL_INFO.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stylized Visual Map Placeholder (Professional institutional map preview) */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-[#17365D] flex items-center justify-between">
              <span>نقشه دسترسی به سازمان (بلوار دانشجو ایلام)</span>
              <span className="text-[10px] text-slate-400 font-sans">۳۳.۶۳۷۴° N, ۴۶.۴۲۲۷° E</span>
            </h4>
            <div className="w-full h-48 bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden flex items-center justify-center p-4 text-center">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#17365D] text-white flex items-center justify-center mx-auto shadow-md">
                  <Building className="w-5 h-5 text-sky-200" />
                </div>
                <div>
                  <span className="font-bold text-xs text-[#17365D] block">
                    ساختمان سازمان نظام پزشکی استان ایلام
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    بلوار دانشجو، نبش خیابان پیام (دسترسی مناسب، پارکینگ مراجعین)
                  </span>
                </div>
                <a
                  href="https://maps.google.com/?q=Ilam+Medical+Council"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[11px] text-[#2463A6] font-semibold hover:underline"
                >
                  مشاهده در مسیریاب نشان و گوگل مپ ←
                </a>
              </div>
            </div>
          </div>

          {/* Department Direct Extensions Directory */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-[#17365D] pb-2 border-b border-slate-100">
              راهنمای شماره داخلی بخش‌ها:
            </h4>
            <div className="space-y-1.5 text-slate-700">
              {DEPARTMENTS_DATA.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span>{d.shortTitle}:</span>
                  <span className="font-bold text-[#2463A6] font-sans">{d.extension}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Contact & Complaint Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#17365D]">
              ارسال پیام، پیشنهادات یا طرح شکایت
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              پیام‌های ارسالی مستقیماً به واحد مربوطه ارجاع داده شده و کد رهگیری به شماره همراه شما
              پیامک خواهد شد.
            </p>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setFormType('inquiry')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                formType === 'inquiry' ? 'bg-white text-[#17365D] shadow-xs' : 'text-slate-600'
              }`}
            >
              درخواست اداری و سوالات
            </button>
            <button
              onClick={() => setFormType('suggestion')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                formType === 'suggestion' ? 'bg-white text-[#17365D] shadow-xs' : 'text-slate-600'
              }`}
            >
              پیشنهادات و انتقادات
            </button>
            <button
              onClick={() => setFormType('complaint')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                formType === 'complaint' ? 'bg-white text-[#C83E4D] shadow-xs' : 'text-slate-600'
              }`}
            >
              ثبت شکایت در دادسرا
            </button>
          </div>

          {isSubmitted ? (
            <div className="bg-[#EAF6EE] border border-[#24845B]/40 rounded-xl p-6 text-center space-y-3 text-xs">
              <CheckCircle className="w-12 h-12 text-[#24845B] mx-auto" />
              <h4 className="text-base font-bold text-[#24845B]">
                پیام شما با موفقیت در سامانه ثبت گردید
              </h4>
              <p className="text-slate-700 leading-relaxed max-w-md mx-auto">
                کد رهگیری پیام: <strong className="font-mono text-slate-900">MSG-ILM-1405-9201</strong>.
                کارشناسان دبیرخانه نظام پزشکی ایلام در ساعات اداری پیام شما را بررسی نموده و نتیجه را
                اطلاع خواهند داد.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    fullName: '',
                    phone: '',
                    email: '',
                    department: 'دبیرخانه مرکزی',
                    nationalCode: '',
                    subject: '',
                    message: '',
                  });
                }}
                className="bg-[#24845B] text-white px-5 py-2 rounded-lg font-bold mt-2"
              >
                ارسال پیام جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    نام و نام خانوادگی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="مثال: رضا صادقی"
                    className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#2463A6]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    شماره تلفن همراه <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="مثال: ۰۹۱۸۱۲۳۴۵۶۷"
                    className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#2463A6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">واحد دریافت‌کننده</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#2463A6]"
                  >
                    <option value="دبیرخانه مرکزی">دبیرخانه و روابط عمومی</option>
                    <option value="دادسرای انتظامی">دادسرای انتظامی و شکایات</option>
                    <option value="امور پروانه‌ها">امور پروانه‌ها و مطب</option>
                    <option value="آموزش مداوم">آموزش مداوم و بازآموزی</option>
                    <option value="امور مالیاتی">واحد مشاوره مالیاتی</option>
                    <option value="کمیسیون رفاه">کمیسیون رفاهی و تسهیلات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">موضوع پیام</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="عنوان خلاصه پیام..."
                    className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#2463A6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  متن پیام یا شکواییه <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="شرح کامل درخواست، مشخصات پزشک یا مرکز در صورت شکایت..."
                  className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#2463A6]"
                />
              </div>

              {formType === 'complaint' && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 text-[11px] leading-relaxed">
                  نکته انتظامی: جهت ثبت رسمی پرونده کیفری در دادسرا، پس از ارسال فرم اینترنتی، ارائه
                  اصل مدارک درمانی و امضای شکواییه کتبی در محل دادسرا الزامی است.
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>ارسال پیام و ثبت در دبیرخانه</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

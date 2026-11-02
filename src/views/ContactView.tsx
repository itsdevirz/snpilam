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

import { isValidIranianPhone, formatPhoneInput } from '../utils/phoneUtils';
import { sanitizeTextInput } from '../utils/security';

export const ContactView: React.FC = () => {
  const { addMessage, sitePhone } = useDataContext();
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
  const [submittedCode, setSubmittedCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.message) {
      setErrorMsg('لطفاً نام، شماره تماس و متن پیام را تکمیل نمایید.');
      return;
    }
    if (!isValidIranianPhone(formData.phone)) {
      setErrorMsg('شماره تلفن وارد شده معتبر نیست. شماره تلفن باید ۱۱ رقمی و با ۰ شروع شود (مثال: 09181234567 یا 08433340000).');
      return;
    }
    setErrorMsg('');

    const cleanName = sanitizeTextInput(formData.fullName);
    const cleanEmail = sanitizeTextInput(formData.email);
    const cleanDept = sanitizeTextInput(formData.department);
    const cleanSubject = sanitizeTextInput(formData.subject || (formType === 'complaint' ? 'شکایت انتظامی' : 'درخواست اداری'));
    const cleanMsg = sanitizeTextInput(formData.message);

    const code = addMessage({
      fullName: cleanName,
      phone: formData.phone.trim(),
      email: cleanEmail,
      department: cleanDept,
      subject: cleanSubject,
      message: cleanMsg,
      type: formType,
    });

    setSubmittedCode(code);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full space-y-8">
      {/* Title Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <Phone className="w-4 h-4 text-[#FF9D50]" />
              <span>پاسخگویی، میز خدمت و راهنمای مراجعین استان ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              تماس با سازمان نظام پزشکی استان ایلام
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              ارتباط مستقیم با ریاست، دادسرای انتظامی، واحد امور پروانه‌ها، آموزش مداوم و ارسال
              درخواست‌ها و شکایات رسمی.
            </p>
          </div>

          <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-2xl p-4 text-xs shrink-0">
            <span className="text-brand-muted block text-[11px]">مرکز تلفن پاسخگویی:</span>
            <span className="text-brand-dark font-sans font-bold text-base tabular-nums">
              {sitePhone}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Contact Cards & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info & Map (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Address & Hours Card */}
          <div className="bg-white border border-brand-border rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-brand-dark pb-3 border-b border-brand-border flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF9D50]" />
              <span>موقعیت مکانی و ساعات پذیرش</span>
            </h3>

            <div className="space-y-3.5 text-brand-dark">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF9D50] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-dark">نشانی ساختمان مرکزی:</strong>
                  <p className="leading-relaxed text-brand-muted mt-0.5">{COUNCIL_INFO.address}</p>
                  <p className="text-brand-muted font-sans mt-0.5 tabular-nums">کد پستی: {COUNCIL_INFO.postalCode}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-brand-border">
                <Clock className="w-4 h-4 text-[#1DCED8] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-dark">ساعات پاسخگویی اداری:</strong>
                  <p className="text-brand-muted mt-0.5">{COUNCIL_INFO.workingDays}: <span className="tabular-nums">{COUNCIL_INFO.workingHours}</span></p>
                  <p className="text-brand-muted text-xs"><span className="tabular-nums">{COUNCIL_INFO.thursdayHours}</span></p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-brand-border">
                <Phone className="w-4 h-4 text-brand-muted shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-dark">تلفن‌های ارتباطی:</strong>
                  <p className="text-brand-muted font-sans tabular-nums mt-0.5">مرکز تلفن: {sitePhone}</p>
                  <p className="text-brand-muted font-sans tabular-nums">خط مستقیم دبیرخانه: {COUNCIL_INFO.phoneDirect}</p>
                  <p className="text-brand-muted font-sans tabular-nums">نمابر (فکس): {COUNCIL_INFO.fax}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-brand-border">
                <Mail className="w-4 h-4 text-brand-muted shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-dark">پست الکترونیک رسمی:</strong>
                  <p className="text-brand-muted font-mono text-[11px] mt-0.5">{COUNCIL_INFO.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stylized Visual Map Placeholder */}
          <div className="bg-white border border-brand-border rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-brand-dark flex items-center justify-between">
              <span>نقشه دسترسی به سازمان (بلوار دانشجو ایلام)</span>
              <span className="text-[10px] text-brand-muted font-sans tabular-nums">۳۳.۶۳۷۴° N, ۴۶.۴۲۲۷° E</span>
            </h4>
            <div className="w-full h-48 bg-[#F7F8F7] rounded-xl border border-brand-border relative overflow-hidden flex items-center justify-center p-4 text-center">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-brand-dark text-white flex items-center justify-center mx-auto shadow-xs">
                  <Building className="w-5 h-5 text-[#FF9D50]" />
                </div>
                <div>
                  <span className="font-bold text-xs text-brand-dark block">
                    ساختمان سازمان نظام پزشکی استان ایلام
                  </span>
                  <span className="text-[11px] text-brand-muted block mt-0.5">
                    بلوار دانشجو، نبش خیابان پیام (دسترسی مناسب، پارکینگ مراجعین)
                  </span>
                </div>
                <a
                  href="https://maps.google.com/?q=Ilam+Medical+Council"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[11px] text-[#FF9D50] font-bold hover:underline"
                >
                  مشاهده در مسیریاب نشان و گوگل مپ ←
                </a>
              </div>
            </div>
          </div>

          {/* Department Direct Extensions Directory */}
          <div className="bg-white border border-brand-border rounded-2xl p-5 space-y-3 text-xs">
            <h4 className="font-bold text-brand-dark pb-2 border-b border-brand-border">
              راهنمای شماره داخلی بخش‌ها:
            </h4>
            <div className="space-y-2 text-brand-dark">
              {DEPARTMENTS_DATA.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-1 border-b border-brand-border/50">
                  <span>{d.shortTitle}:</span>
                  <span className="font-bold text-[#FF9D50] font-sans tabular-nums">{d.extension}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Contact & Complaint Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-dark">
              ارسال پیام، پیشنهادات یا طرح شکایت
            </h3>
            <p className="text-xs text-brand-muted">
              پیام‌های ارسالی مستقیماً به واحد مربوطه ارجاع داده شده و کد رهگیری به شماره همراه شما
              پیامک خواهد شد.
            </p>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-[#F7F8F7] rounded-xl text-xs font-semibold border border-brand-border">
            <button
              onClick={() => setFormType('inquiry')}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                formType === 'inquiry' ? 'bg-white text-brand-dark shadow-xs' : 'text-brand-muted'
              }`}
            >
              درخواست اداری و سوالات
            </button>
            <button
              onClick={() => setFormType('suggestion')}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                formType === 'suggestion' ? 'bg-white text-brand-dark shadow-xs' : 'text-brand-muted'
              }`}
            >
              پیشنهادات و انتقادات
            </button>
            <button
              onClick={() => setFormType('complaint')}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                formType === 'complaint' ? 'bg-white text-red-600 shadow-xs' : 'text-brand-muted'
              }`}
            >
              ثبت شکایت در دادسرا
            </button>
          </div>

          {isSubmitted ? (
            <div className="bg-[#55E07E]/10 border border-[#55E07E]/30 rounded-2xl p-6 sm:p-8 text-center space-y-4 text-xs">
              <CheckCircle className="w-12 h-12 text-[#55E07E] mx-auto" />
              <h4 className="text-base font-bold text-brand-dark">
                پیام شما با موفقیت در دیتابیس سامانه ثبت گردید
              </h4>
              <div className="bg-white border border-[#55E07E]/30 p-4 rounded-xl max-w-md mx-auto space-y-1.5 shadow-xs">
                <span className="text-brand-muted text-[11px] block">کد رهگیری اختصاصی درخواست:</span>
                <span className="font-mono text-lg font-bold text-brand-dark tracking-wider dir-ltr inline-block tabular-nums">
                  {submittedCode}
                </span>
                <p className="text-[11px] text-brand-muted pt-1">
                  می‌توانید با وارد کردن این کد در منوی «خدمات الکترونیک - پیگیری و استعلام»، وضعیت پرونده را به صورت زنده پیگیری نمایید.
                </p>
              </div>
              <p className="text-brand-muted leading-relaxed max-w-md mx-auto text-xs">
                کارشناسان دبیرخانه نظام پزشکی ایلام در ساعات اداری پیام شما را بررسی نموده و در صورت لزوم تماس خواهند گرفت.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSubmittedCode('');
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
                className="bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold mt-2 hover:bg-black transition-colors"
              >
                ارسال پیام جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-dark font-semibold mb-1">
                    نام و نام خانوادگی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="مثال: رضا صادقی"
                    className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                  />
                </div>

                <div>
                  <label className="block text-brand-dark font-semibold mb-1">
                    شماره تلفن همراه <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhoneInput(e.target.value) })}
                    placeholder="مثال: 09181234567"
                    className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50] font-mono text-left dir-ltr"
                  />
                  <span className="text-[10px] text-brand-muted mt-1 block">شماره تلفن ۱۱ رقمی همراه با پیش‌شماره (مثال: ۰۹۱۸۱۲۳۴۵۶۷)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-dark font-semibold mb-1">واحد دریافت‌کننده</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
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
                  <label className="block text-brand-dark font-semibold mb-1">موضوع پیام</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="عنوان خلاصه پیام..."
                    className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-dark font-semibold mb-1">
                  متن پیام یا شکواییه <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="شرح کامل درخواست، مشخصات پزشک یا مرکز در صورت شکایت..."
                  className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                />
              </div>

              {formType === 'complaint' && (
                <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 p-4 rounded-xl text-brand-dark text-xs leading-relaxed">
                  نکته انتظامی: جهت ثبت رسمی پرونده کیفری در دادسرا، پس از ارسال فرم اینترنتی، ارائه
                  اصل مدارک درمانی و امضای شکواییه کتبی در محل دادسرا الزامی است.
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#FF9D50] hover:bg-[#e0843a] text-white font-bold px-7 py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
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

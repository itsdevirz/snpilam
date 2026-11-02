import React, { useState, useMemo } from 'react';
import { ClassifiedItem } from '../types';
import { COUNCIL_INFO } from '../data/councilData';
import { useDataContext } from '../context/DataContext';
import {
  Briefcase,
  Search,
  Filter,
  PlusCircle,
  Phone,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  X,
  CheckCircle,
  ChevronLeft,
} from 'lucide-react';
import { isValidIranianPhone, formatPhoneInput } from '../utils/phoneUtils';
import { sanitizeSearchQuery, sanitizeTextInput } from '../utils/security';

export const ClassifiedsView: React.FC = () => {
  const { classifieds, addClassified } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [showExpired, setShowExpired] = useState(false);
  const [activeItem, setActiveItem] = useState<ClassifiedItem | null>(null);

  // New ad submission modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    title: '',
    category: 'استخدام پزشک' as ClassifiedItem['category'],
    county: 'ایلام',
    city: 'ایلام',
    specialtyGroup: '',
    description: '',
    contactName: '',
    contactPhone: '',
    compensation: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const categories = [
    'همه دسته‌ها',
    'استخدام پزشک',
    'استخدام دندانپزشک',
    'مسئول فنی',
    'اجاره و واگذاری مطب',
    'فروش تجهیزات پزشکی',
  ];

  const counties = ['همه شهرستان‌ها', ...COUNCIL_INFO.jurisdictionCounties];

  const filteredClassifieds = useMemo(() => {
    const cleanSearch = sanitizeSearchQuery(searchTerm);
    return classifieds.filter((c) => {
      if (!showExpired && c.status === 'expired') return false;

      const matchSearch =
        !cleanSearch ||
        c.title.includes(cleanSearch) ||
        c.description.includes(cleanSearch) ||
        c.contactName.includes(cleanSearch);

      const matchCategory =
        !selectedCategory ||
        selectedCategory === 'همه دسته‌ها' ||
        c.category === selectedCategory;

      const matchCounty =
        !selectedCounty ||
        selectedCounty === 'همه شهرستان‌ها' ||
        c.county === selectedCounty;

      return matchSearch && matchCategory && matchCounty;
    });
  }, [classifieds, searchTerm, selectedCategory, selectedCounty, showExpired]);

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitForm.title || !submitForm.contactPhone || !submitForm.description) {
      setErrorMsg('لطفاً عنوان، شماره تماس و شرح آگهی را تکمیل فرمایید.');
      return;
    }
    if (!isValidIranianPhone(submitForm.contactPhone)) {
      setErrorMsg('شماره تلفن وارد شده معتبر نیست. شماره تلفن باید ۱۱ رقمی و با ۰ شروع شود (مثال: 09181234567 یا 08433340000).');
      return;
    }
    setErrorMsg('');
    const today = new Date().toLocaleDateString('fa-IR');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    const expDate = futureDate.toLocaleDateString('fa-IR');

    addClassified({
      title: sanitizeTextInput(submitForm.title),
      category: submitForm.category,
      county: sanitizeTextInput(submitForm.county),
      city: sanitizeTextInput(submitForm.city || submitForm.county),
      specialtyGroup: sanitizeTextInput(submitForm.specialtyGroup || 'عمومی'),
      description: sanitizeTextInput(submitForm.description),
      publishDate: today,
      expirationDate: expDate,
      contactName: sanitizeTextInput(submitForm.contactName),
      contactPhone: submitForm.contactPhone.trim(),
      compensation: sanitizeTextInput(submitForm.compensation),
    });

    setFormSubmitted(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Title & Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#C77920] mb-1 font-semibold">
              <Briefcase className="w-4 h-4" />
              <span>فرصت‌های حرفه‌ای و صنفی استان ایلام</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              نیازمندی‌های جامعه پزشکی و مراکز درمانی
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              بستر رسمی انتشار آگهی‌های استخدام پزشک و داروساز، واگذاری مطب، جذب مسئول فنی و
              خرید و فروش تجهیزات معتبر پزشکی در سطح استان.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => {
                setFormSubmitted(false);
                setIsSubmitModalOpen(true);
              }}
              className="text-xs bg-[#C77920] hover:bg-[#a66215] text-white font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ثبت رایگان آگهی جدید</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در عنوان، شرح یا تخصص مورد نیاز..."
              className="w-full text-xs sm:text-sm bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg pr-9 pl-3 py-2.5 text-[#202B38] focus:bg-white focus:outline-none focus:border-[#C77920]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#C77920]"
            >
              {categories.map((c) => (
                <option key={c} value={c === 'همه دسته‌ها' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#C77920]"
            >
              {counties.map((c) => (
                <option key={c} value={c === 'همه شهرستان‌ها' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showExpired}
                onChange={(e) => setShowExpired(e.target.checked)}
                className="rounded border-slate-300 text-[#C77920] focus:ring-[#C77920]"
              />
              <span>نمایش منقضی‌شده‌ها</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-600">
            تعداد آگهی‌های فعال: <strong className="text-[#C77920] font-sans">{filteredClassifieds.length}</strong> مورد
          </span>

          <span className="text-[11px] text-slate-400">
            کلیه آگهی‌ها پیش از انتشار توسط کمیسیون نظارت نظام پزشکی بررسی می‌شوند.
          </span>
        </div>
      </div>

      {/* Classifieds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClassifieds.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between ${
              item.status === 'expired'
                ? 'border-slate-200 opacity-60 bg-slate-50'
                : 'border-[#E2E8F0] hover:border-[#C77920]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-semibold text-[#C77920] bg-[#FDF4E7] px-2 py-0.5 rounded">
                  {item.category}
                </span>

                {item.status === 'expired' ? (
                  <span className="text-[11px] text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    منقضی‌شده
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    فعال تا {item.expirationDate}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-[#17365D] mb-2 leading-snug">
                {item.title}
              </h3>

              <div className="text-xs text-slate-500 flex items-center gap-3 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>شهرستان {item.county}</span>
                </span>
                <span>·</span>
                <span>رسته: {item.specialtyGroup}</span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              {item.compensation && (
                <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                  شرایط مالی: <strong>{item.compensation}</strong>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans text-[11px]">
                  انتشار: {item.publishDate}
                </span>
                <button
                  onClick={() => setActiveItem(item)}
                  className="font-semibold text-[#C77920] hover:underline flex items-center gap-1"
                >
                  <span>اطلاعات تماس</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Classified Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#C77920] bg-[#FDF4E7] px-2.5 py-1 rounded">
                  {activeItem.category}
                </span>
                <h3 className="text-base font-bold text-[#17365D] mt-2 leading-snug">
                  {activeItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-2 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
              <p>{activeItem.description}</p>
              {activeItem.compensation && (
                <p className="pt-2 border-t border-slate-200 text-[#C77920] font-semibold">
                  شرایط همکاری و مالی: {activeItem.compensation}
                </p>
              )}
            </div>

            <div className="bg-[#FDF4E7] border border-[#C77920]/30 rounded-xl p-4 text-xs space-y-2">
              <h4 className="font-bold text-[#17365D]">اطلاعات تماس و هماهنگی:</h4>
              <div className="flex items-center justify-between">
                <span>طرف تماس: <strong>{activeItem.contactName}</strong></span>
                <a
                  href={`tel:${activeItem.contactPhone.replace(/[- ]/g, '')}`}
                  className="font-bold text-[#C77920] font-sans flex items-center gap-1 text-sm hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>{activeItem.contactPhone}</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-400">
                تاریخ انقضا: <span className="font-sans">{activeItem.expirationDate}</span>
              </span>
              <button
                onClick={() => setActiveItem(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-lg"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit New Classified Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-[#17365D]">ثبت آگهی نیازمندی‌های پزشکی</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ویژه اعضای نظام پزشکی و مدیران مراکز درمانی استان ایلام
                </p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {formSubmitted ? (
              <div className="bg-[#EAF6EE] border border-[#24845B]/40 rounded-xl p-6 text-center space-y-3 text-xs">
                <CheckCircle className="w-12 h-12 text-[#24845B] mx-auto" />
                <h4 className="text-base font-bold text-[#24845B]">
                  آگهی شما با موفقیت در صف بررسی ثبت گردید
                </h4>
                <p className="text-slate-700 leading-relaxed max-w-md mx-auto">
                  کد پیگیری موقت: <strong className="font-mono text-slate-900">REQ-CLS-1405-441</strong>.
                  آگهی پس از تطبیق مشخصات و احراز هویت صنفی توسط کارشناس روابط عمومی ظرف ۲۴ ساعت در
                  سایت منتشر خواهد شد.
                </p>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="bg-[#24845B] text-white px-5 py-2 rounded-lg font-bold mt-2"
                >
                  متوجه شدم
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitAd} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      عنوان آگهی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={submitForm.title}
                      onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                      placeholder="مثال: دعوت به همکاری از پزشک عمومی شیفت عصر"
                      className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#C77920]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">دسته‌بندی موضوعی</label>
                    <select
                      value={submitForm.category}
                      onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value as ClassifiedItem['category'] })}
                      className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#C77920]"
                    >
                      <option value="استخدام پزشک">استخدام پزشک</option>
                      <option value="استخدام دندانپزشک">استخدام دندانپزشک</option>
                      <option value="مسئول فنی">مسئول فنی</option>
                      <option value="اجاره و واگذاری مطب">اجاره و واگذاری مطب</option>
                      <option value="فروش تجهیزات پزشکی">فروش تجهیزات پزشکی</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">شهرستان مربوطه</label>
                    <select
                      value={submitForm.county}
                      onChange={(e) => setSubmitForm({ ...submitForm, county: e.target.value })}
                      className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#C77920]"
                    >
                      {COUNCIL_INFO.jurisdictionCounties.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">رسته / تخصص مخاطب</label>
                    <input
                      type="text"
                      value={submitForm.specialtyGroup}
                      onChange={(e) =>
                        setSubmitForm({ ...submitForm, specialtyGroup: e.target.value })
                      }
                      placeholder="مثال: پزشک عمومی، دندانپزشک، داروساز"
                      className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#C77920]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    شرح کامل موقعیت و شرایط همکاری <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={submitForm.description}
                    onChange={(e) =>
                      setSubmitForm({ ...submitForm, description: e.target.value })
                    }
                    placeholder="شرح کامل شرایط کاری، تجهیزات موجود، پروانه مورد نیاز..."
                    className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#C77920]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">نام شخص یا مرکز آگهی‌دهنده</label>
                    <input
                      type="text"
                      required
                      value={submitForm.contactName}
                      onChange={(e) =>
                        setSubmitForm({ ...submitForm, contactName: e.target.value })
                      }
                      placeholder="مثال: دکتر حسینی / مدیریت درمانگاه"
                      className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#C77920]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      شماره تماس مستقیم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      value={submitForm.contactPhone}
                      onChange={(e) =>
                        setSubmitForm({ ...submitForm, contactPhone: formatPhoneInput(e.target.value) })
                      }
                      placeholder="مثال: 09181234567"
                      className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#C77920] font-mono text-left dir-ltr"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                  <p>
                    توجه: درج هرگونه آگهی استخدام غیرپزشکان برای امور درمانی یا آگهی‌های فاقد اصالت
                    ممنوع بوده و پیگرد قانونی دارد.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <button
                    type="submit"
                    className="bg-[#C77920] hover:bg-[#a66215] text-white font-bold px-5 py-2 rounded-lg transition-colors"
                  >
                    ارسال جهت تایید و انتشار
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

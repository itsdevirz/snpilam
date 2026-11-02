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
      {/* Title & Editorial Banner */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <Briefcase className="w-4 h-4 text-[#FF9D50]" />
              <span>فرصت‌های شغلی، همکاری و نیازمندی‌های صنفی ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              نیازمندی‌های جامعه پزشکی و مراکز درمانی
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              بستر رسمی انتشار آگهی‌های استخدام پزشک و داروساز، واگذاری مطب، جذب مسئول فنی و
              خرید و فروش تجهیزات معتبر پزشکی در سطح استان ایلام.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => {
                setFormSubmitted(false);
                setIsSubmitModalOpen(true);
              }}
              className="bg-[#FF9D50] hover:bg-[#e0843a] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ثبت رایگان آگهی جدید</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white border border-brand-border rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در عنوان، شرح یا تخصص مورد نیاز..."
              className="w-full text-xs sm:text-sm bg-[#F7F8F7] border border-brand-border rounded-xl pr-10 pl-3 py-2.5 text-brand-dark placeholder:text-brand-muted focus:bg-white focus:outline-none focus:border-[#FF9D50]"
            />
            <Search className="w-4 h-4 text-brand-muted absolute right-3.5 top-3" />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:outline-none focus:border-[#FF9D50]"
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
              className="w-full text-xs bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:outline-none focus:border-[#FF9D50]"
            >
              {counties.map((c) => (
                <option key={c} value={c === 'همه شهرستان‌ها' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center">
            <label className="flex items-center gap-2 text-xs text-brand-dark cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showExpired}
                onChange={(e) => setShowExpired(e.target.checked)}
                className="rounded border-brand-border text-[#FF9D50] focus:ring-[#FF9D50]"
              />
              <span>نمایش منقضی‌شده‌ها</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brand-border text-xs">
          <span className="text-brand-muted">
            تعداد آگهی‌های فعال: <strong className="text-brand-dark font-sans tabular-nums">{filteredClassifieds.length}</strong> مورد
          </span>

          <span className="text-[11px] text-brand-muted">
            کلیه آگهی‌ها پیش از انتشار توسط کمیسیون نظارت نظام پزشکی بررسی می‌شوند.
          </span>
        </div>
      </div>

      {/* Classifieds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClassifieds.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-2xl p-6 transition-all flex flex-col justify-between group ${
              item.status === 'expired'
                ? 'border-brand-border opacity-60 bg-[#F7F8F7]'
                : 'border-brand-border hover:border-[#FF9D50]/50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-brand-border">
                <span className="font-medium text-brand-dark">
                  {item.category}
                </span>

                {item.status === 'expired' ? (
                  <span className="text-[11px] text-red-600 font-medium">
                    منقضی‌شده
                  </span>
                ) : (
                  <span className="text-[11px] text-[#55E07E] font-medium">
                    فعال تا <span className="tabular-nums">{item.expirationDate}</span>
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-brand-dark group-hover:text-[#FF9D50] transition-colors leading-snug">
                {item.title}
              </h3>

              <div className="text-xs text-brand-muted flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF9D50]" />
                  <span>شهرستان {item.county}</span>
                </span>
                <span>·</span>
                <span>رسته: {item.specialtyGroup}</span>
              </div>

              <p className="text-xs text-brand-muted line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-brand-border mt-4">
              {item.compensation && (
                <div className="text-xs text-brand-dark bg-[#FFF9D8]/50 p-2.5 rounded-xl border border-[#FF9D50]/20">
                  شرایط مالی: <strong className="font-semibold">{item.compensation}</strong>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-brand-muted font-sans text-[11px] tabular-nums">
                  انتشار: {item.publishDate}
                </span>
                <button
                  onClick={() => setActiveItem(item)}
                  className="font-bold text-[#FF9D50] hover:text-[#e0843a] flex items-center gap-1 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-brand-border">
            <div className="flex items-start justify-between pb-4 border-b border-brand-border">
              <div>
                <span className="text-xs font-semibold text-brand-muted">
                  {activeItem.category}
                </span>
                <h3 className="text-lg font-bold text-brand-dark mt-1 leading-snug">
                  {activeItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-[#F7F8F7]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-xs text-brand-dark space-y-3 leading-relaxed bg-[#F7F8F7] p-5 rounded-2xl border border-brand-border">
              <p>{activeItem.description}</p>
              {activeItem.compensation && (
                <p className="pt-3 border-t border-brand-border text-[#FF9D50] font-semibold">
                  شرایط همکاری و مالی: {activeItem.compensation}
                </p>
              )}
            </div>

            <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-2xl p-5 text-xs space-y-2">
              <h4 className="font-bold text-brand-dark text-sm">اطلاعات تماس و هماهنگی:</h4>
              <div className="flex items-center justify-between pt-1">
                <span>طرف تماس: <strong className="text-brand-dark">{activeItem.contactName}</strong></span>
                <a
                  href={`tel:${activeItem.contactPhone.replace(/[- ]/g, '')}`}
                  className="font-bold text-[#FF9D50] hover:text-[#e0843a] font-sans flex items-center gap-1.5 text-sm tabular-nums"
                >
                  <Phone className="w-4 h-4" />
                  <span>{activeItem.contactPhone}</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-brand-border text-xs">
              <span className="text-brand-muted">
                تاریخ انقضا: <span className="font-sans tabular-nums text-brand-dark">{activeItem.expirationDate}</span>
              </span>
              <button
                onClick={() => setActiveItem(null)}
                className="bg-[#F7F8F7] hover:bg-slate-200 text-brand-dark font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit New Classified Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-brand-border">
            <div className="flex items-start justify-between pb-4 border-b border-brand-border">
              <div>
                <h3 className="text-xl font-bold text-brand-dark">ثبت آگهی نیازمندی‌های پزشکی</h3>
                <p className="text-xs text-brand-muted mt-1">
                  ویژه اعضای نظام پزشکی و مدیران مراکز درمانی استان ایلام
                </p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-[#F7F8F7]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {formSubmitted ? (
              <div className="bg-[#55E07E]/10 border border-[#55E07E]/30 rounded-2xl p-6 text-center space-y-3 text-xs">
                <CheckCircle className="w-12 h-12 text-[#55E07E] mx-auto" />
                <h4 className="text-base font-bold text-brand-dark">
                  آگهی شما با موفقیت در صف بررسی ثبت گردید
                </h4>
                <p className="text-brand-muted leading-relaxed max-w-md mx-auto">
                  کد پیگیری موقت: <strong className="font-mono text-brand-dark">REQ-CLS-1405-441</strong>.
                  آگهی پس از تطبیق مشخصات و احراز هویت صنفی توسط کارشناس روابط عمومی ظرف ۲۴ ساعت در
                  سایت منتشر خواهد شد.
                </p>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold mt-2 hover:bg-black transition-colors"
                >
                  متوجه شدم
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitAd} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-brand-dark font-semibold mb-1">
                      عنوان آگهی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={submitForm.title}
                      onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                      placeholder="مثال: دعوت به همکاری از پزشک عمومی شیفت عصر"
                      className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-dark font-semibold mb-1">دسته‌بندی موضوعی</label>
                    <select
                      value={submitForm.category}
                      onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value as ClassifiedItem['category'] })}
                      className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                    >
                      <option value="استخدام پزشک">استخدام پزشک</option>
                      <option value="استخدام دندانپزشک">استخدام دندانپزشک</option>
                      <option value="مسئول فنی">مسئول فنی</option>
                      <option value="اجاره و واگذاری مطب">اجاره و واگذاری مطب</option>
                      <option value="فروش تجهیزات پزشکی">فروش تجهیزات پزشکی</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-brand-dark font-semibold mb-1">شهرستان مربوطه</label>
                    <select
                      value={submitForm.county}
                      onChange={(e) => setSubmitForm({ ...submitForm, county: e.target.value })}
                      className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                    >
                      {COUNCIL_INFO.jurisdictionCounties.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-brand-dark font-semibold mb-1">رسته / تخصص مخاطب</label>
                    <input
                      type="text"
                      value={submitForm.specialtyGroup}
                      onChange={(e) =>
                        setSubmitForm({ ...submitForm, specialtyGroup: e.target.value })
                      }
                      placeholder="مثال: پزشک عمومی، دندانپزشک، داروساز"
                      className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-brand-dark font-semibold mb-1">
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
                    className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-brand-dark font-semibold mb-1">نام شخص یا مرکز آگهی‌دهنده</label>
                    <input
                      type="text"
                      required
                      value={submitForm.contactName}
                      onChange={(e) =>
                        setSubmitForm({ ...submitForm, contactName: e.target.value })
                      }
                      placeholder="مثال: دکتر حسینی / مدیریت درمانگاه"
                      className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-dark font-semibold mb-1">
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
                      className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50] font-mono text-left dir-ltr"
                    />
                  </div>
                </div>

                <div className="bg-[#FFF9D8]/50 p-3.5 rounded-xl border border-[#FF9D50]/20 text-xs text-brand-muted">
                  <p>
                    توجه: درج هرگونه آگهی استخدام غیرپزشکان برای امور درمانی یا آگهی‌های فاقد اصالت
                    ممنوع بوده و پیگرد قانونی دارد.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                  <button
                    type="submit"
                    className="bg-[#FF9D50] hover:bg-[#e0843a] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    ارسال جهت تایید و انتشار
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="text-brand-muted hover:text-brand-dark font-medium"
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

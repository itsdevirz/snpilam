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
  Plus,
  Send,
  X,
  AlertCircle,
} from 'lucide-react';
import { isValidIranianPhone, formatPhoneInput } from '../utils/phoneUtils';
import { sanitizeTextInput, sanitizeSearchQuery } from '../utils/security';

export const FacilitiesView: React.FC = () => {
  const { facilities, requestFacilityRegistration } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');

  // Self Registration Modal
  const [showRegModal, setShowRegModal] = useState(false);
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

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

  // Filter only approved facilities for public display
  const approvedFacilities = useMemo(() => {
    return facilities.filter((f) => !f.status || f.status === 'approved');
  }, [facilities]);

  const filteredFacilities = useMemo(() => {
    const cleanSearch = sanitizeSearchQuery(searchTerm);
    return approvedFacilities.filter((f) => {
      const matchSearch =
        !cleanSearch ||
        f.name.includes(cleanSearch) ||
        f.address.includes(cleanSearch) ||
        f.manager.includes(cleanSearch) ||
        f.services.some((s) => s.includes(cleanSearch));

      const matchType =
        !selectedType || selectedType === 'همه انواع مراکز' || f.type === selectedType;

      const matchCounty =
        !selectedCounty || selectedCounty === 'همه شهرستان‌ها' || f.county === selectedCounty;

      return matchSearch && matchType && matchCounty;
    });
  }, [approvedFacilities, searchTerm, selectedType, selectedCounty]);

  return (
    <div className="w-full space-y-6">
      {/* Editorial Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <Building2 className="w-4 h-4 text-[#FF9D50]" />
              <span>پورتال نظارت بر موسسات و مراکز درمانی استان ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              بانک جامع مراکز درمانی، بیمارستان‌ها و کلینیک‌ها
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              بانک اطلاعات رسمی بیمارستان‌های دولتی و خصوصی، مراکز جراحی محدود، درمانگاه‌های شبانه‌روزی،
              مراکز تصویربرداری، آزمایشگاه‌ها و کلینیک‌های دندانپزشکی دارای پروانه بهره‌برداری معتبر.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setShowRegModal(true)}
              className="bg-[#FF9D50] hover:bg-[#e0843a] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>درخواست ثبت مرکز درمانی</span>
            </button>

            <div className="bg-[#FFF9D8]/60 border border-[#FF9D50]/30 rounded-xl p-3 px-4 text-xs">
              <span className="text-brand-muted block text-[11px]">مراکز تاییدشده:</span>
              <span className="text-brand-dark font-sans font-bold text-base tabular-nums">
                {approvedFacilities.length} مرکز درمانی
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white border border-brand-border rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="نام مرکز درمانی، بخش‌ها، خدمات یا نشانی..."
              className="w-full text-xs sm:text-sm bg-[#F7F8F7] border border-brand-border rounded-xl pr-10 pl-3 py-2.5 text-brand-dark placeholder:text-brand-muted focus:bg-white focus:outline-none focus:border-[#FF9D50]"
            />
            <Search className="w-4 h-4 text-brand-muted absolute right-3.5 top-3" />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:outline-none focus:border-[#FF9D50]"
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
              className="w-full text-xs bg-[#F7F8F7] border border-brand-border rounded-xl px-3 py-2.5 text-brand-dark focus:outline-none focus:border-[#FF9D50]"
            >
              {counties.map((c) => (
                <option key={c} value={c === 'همه شهرستان‌ها' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brand-border text-xs">
          <span className="text-brand-muted">
            تعداد نتایج: <strong className="text-brand-dark font-sans tabular-nums">{filteredFacilities.length}</strong> مرکز
          </span>
          {(searchTerm || selectedType || selectedCounty) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('');
                setSelectedCounty('');
              }}
              className="text-[#1DCED8] font-medium hover:underline flex items-center gap-1"
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
            className="bg-white border border-brand-border hover:border-[#FF9D50]/50 rounded-2xl p-6 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-brand-border">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
                    <span>{fac.type}</span>
                    <span>·</span>
                    <span>شهرستان {fac.county} ({fac.city})</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark mt-1 group-hover:text-[#FF9D50] transition-colors">{fac.name}</h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#55E07E] font-medium bg-[#55E07E]/10 px-2.5 py-1 rounded-lg border border-[#55E07E]/20 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{fac.licenseStatus}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-brand-dark">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-muted">
                  <p>ریاست / مدیریت: <strong className="text-brand-dark">{fac.manager}</strong></p>
                  <p>مسئول فنی: <strong className="text-brand-dark">{fac.technicalSupervisor}</strong></p>
                </div>

                <div className="flex items-start gap-2 pt-1 text-brand-muted">
                  <MapPin className="w-3.5 h-3.5 text-[#FF9D50] shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-brand-dark">{fac.address}</span>
                </div>

                <div className="flex items-center gap-2 text-brand-muted">
                  <Clock className="w-3.5 h-3.5 text-[#1DCED8] shrink-0" />
                  <span>پذیرش: {fac.workingHours}</span>
                </div>
              </div>

              {/* Service tags */}
              <div className="pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {fac.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-[#F7F8F7] text-brand-muted border border-brand-border px-2.5 py-0.5 rounded-lg"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border mt-5 flex items-center justify-between text-xs">
              <a
                href={`tel:${fac.phone.replace(/-/g, '')}`}
                className="font-bold text-[#FF9D50] hover:text-[#e0843a] font-sans flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="tabular-nums">{fac.phone}</span>
              </a>

              <span className="text-[11px] text-brand-muted">تحت نظارت نظام پزشکی و معاونت درمان</span>
            </div>
          </div>
        ))}
      </div>

      {/* Facility Self Registration Modal */}
      {showRegModal && (
        <FacilityRegistrationModal
          onClose={() => {
            setShowRegModal(false);
            setRegSuccessMsg('');
          }}
          onSubmit={(data) => {
            requestFacilityRegistration(data);
            setRegSuccessMsg(
              'درخواست ثبت و صدور مجوز مرکز درمانی با موفقیت در سامانه ثبت گردید. پس از استعلام نظارت بر درمان و تایید توسط هیئت مدیره نظام پزشکی ایلام، مرکز در لیست رسمی قرار خواهد گرفت.'
            );
          }}
          successMsg={regSuccessMsg}
        />
      )}
    </div>
  );
};

// ==========================================
// FACILITY SELF-REGISTRATION MODAL
// ==========================================
const FacilityRegistrationModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: Omit<Facility, 'id'>) => void;
  successMsg: string;
}> = ({ onClose, onSubmit, successMsg }) => {
  const [form, setForm] = useState({
    name: '',
    type: 'درمانگاه شبانه‌روزی' as const,
    manager: '',
    technicalSupervisor: '',
    licenseStatus: 'دارای پروانه بهره‌برداری معتبر' as const,
    county: 'ایلام',
    city: 'ایلام',
    address: '',
    phone: '',
    workingHours: 'شبانه‌روزی (۲۴ ساعته)',
    servicesStr: 'اورژانس، ویزیت پزشک عمومی، تزریقات و پانسمان',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIranianPhone(form.phone)) {
      setErrorMsg('شماره تلفن وارد شده معتبر نیست. شماره تلفن باید ۱۱ رقمی و با ۰ شروع شود (مثال: 08432220000 یا 09181234567).');
      return;
    }
    setErrorMsg('');
    const services = form.servicesStr.split(',').map((s) => sanitizeTextInput(s)).filter(Boolean);
    onSubmit({
      name: sanitizeTextInput(form.name),
      type: form.type,
      manager: sanitizeTextInput(form.manager),
      technicalSupervisor: sanitizeTextInput(form.technicalSupervisor),
      licenseStatus: form.licenseStatus,
      county: sanitizeTextInput(form.county),
      city: sanitizeTextInput(form.city),
      address: sanitizeTextInput(form.address),
      phone: form.phone.trim(),
      workingHours: sanitizeTextInput(form.workingHours),
      services,
      status: 'pending',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-xs max-h-[90vh] overflow-y-auto border border-brand-border">
        <div className="flex items-center justify-between pb-4 border-b border-brand-border">
          <div className="flex items-center gap-2 text-brand-dark">
            <Building2 className="w-5 h-5 text-[#FF9D50]" />
            <h3 className="font-bold text-base text-brand-dark">
              فرم ثبت‌نام و درخواست مجوز مرکز درمانی / کلینیک در استان ایلام
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-[#F7F8F7]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="bg-[#55E07E]/10 border border-[#55E07E]/30 text-brand-dark p-6 rounded-2xl space-y-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#55E07E] mx-auto" />
            <h4 className="font-bold text-base">درخواست مرکز درمانی ثبت گردید</h4>
            <p className="text-xs text-brand-muted leading-relaxed">{successMsg}</p>
            <button
              onClick={onClose}
              className="bg-brand-dark text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-black transition-colors"
            >
              متوجه شدم و بستن
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 text-brand-dark p-3.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#FF9D50]" />
              <span>
                توجه: اطلاعات مرکز پس از استعلام پروانه بهره‌برداری و تایید معاونت درمان / نظام پزشکی ایلام در پورتال قرار خواهد گرفت.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">نام دقیق مرکز درمانی *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: درمانگاه شبانه‌روزی شفابخش"
                  className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl p-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-brand-dark">نوع موسسه درمانی *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl p-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                >
                  <option value="بیمارستان">بیمارستان</option>
                  <option value="درمانگاه شبانه‌روزی">درمانگاه شبانه‌روزی</option>
                  <option value="مرکز جراحی محدود">مرکز جراحی محدود</option>
                  <option value="مرکز تصویربرداری و ام‌آر‌آی">مرکز تصویربرداری و ام‌آر‌آی</option>
                  <option value="کلینیک دندانپزشکی">کلینیک دندانپزشکی</option>
                  <option value="آزمایشگاه تشخیص طبی">آزمایشگاه تشخیص طبی</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">نام ریاست / مدیریت مرکز *</label>
                <input
                  type="text"
                  required
                  value={form.manager}
                  onChange={(e) => setForm({ ...form, manager: e.target.value })}
                  placeholder="مثال: دکتر مهدی حیدری"
                  className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl p-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-brand-dark">مسئول فنی موسسه *</label>
                <input
                  type="text"
                  required
                  value={form.technicalSupervisor}
                  onChange={(e) => setForm({ ...form, technicalSupervisor: e.target.value })}
                  placeholder="مثال: دکتر سارا کیانی"
                  className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl p-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-brand-dark">شهرستان فعالیت *</label>
              <select
                value={form.county}
                onChange={(e) => setForm({ ...form, county: e.target.value, city: e.target.value })}
                className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl p-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
              >
                {COUNCIL_INFO.jurisdictionCounties.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">تلفن تماس مرکز *</label>
                <input
                  type="tel"
                  required
                  maxLength={11}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhoneInput(e.target.value) })}
                  placeholder="مثال: 08432220000 یا 09181234567"
                  className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl p-2.5 font-mono text-left dir-ltr text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-brand-dark">ساعات فعالیت و پذیرش *</label>
                <input
                  type="text"
                  required
                  value={form.workingHours}
                  onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                  placeholder="مثال: شبانه‌روزی (۲۴ ساعته)"
                  className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl p-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-brand-dark">نشانی دقیق موسسه *</label>
              <textarea
                required
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="ایلام، میدان شهید کشوری..."
                className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl p-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-brand-dark">خدمات و بخش‌های فعال (با کاما جدا کنید)</label>
              <input
                type="text"
                value={form.servicesStr}
                onChange={(e) => setForm({ ...form, servicesStr: e.target.value })}
                placeholder="اورژانس، سونوگرافی، آزمايشگاه، داروخانه"
                className="w-full bg-[#F7F8F7] border border-brand-border rounded-xl p-2.5 text-brand-dark focus:bg-white focus:outline-none focus:border-[#FF9D50]"
              />
            </div>

            <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-brand-border text-brand-dark hover:bg-[#F7F8F7] font-medium"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="bg-[#FF9D50] hover:bg-[#e0843a] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ارسال درخواست مجوز مرکز</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

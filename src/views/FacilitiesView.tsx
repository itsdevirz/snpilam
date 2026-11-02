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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => setShowRegModal(true)}
              className="bg-[#2463A6] hover:bg-[#17365D] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>درخواست ثبت مرکز درمانی</span>
            </button>

            <div className="bg-[#EFF6FC] border border-[#2463A6]/30 rounded-xl p-3 text-xs text-left shrink-0">
              <span className="text-[#2463A6] font-bold block">مراکز تاییدشده:</span>
              <span className="text-slate-800 font-sans font-bold text-sm">
                {approvedFacilities.length} مرکز درمانی
              </span>
            </div>
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[#2463A6]">
            <Building2 className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#17365D]">
              فرم ثبت‌نام و درخواست مجوز مرکز درمانی / کلینیک در استان ایلام
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-5 rounded-xl space-y-3 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm">درخواست مرکز درمانی ثبت گردید</h4>
            <p className="text-xs leading-relaxed">{successMsg}</p>
            <button
              onClick={onClose}
              className="bg-[#2463A6] text-white font-bold px-5 py-2 rounded-lg text-xs hover:bg-[#17365D]"
            >
              متوجه شدم و بستن
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                توجه: اطلاعات مرکز پس از استعلام پروانه بهره‌برداری و تایید معاونت درمان / نظام پزشکی ایلام در پورتال قرار خواهد گرفت.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">نام دقیق مرکز درمانی *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: درمانگاه شبانه‌روزی شفابخش"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">نوع موسسه درمانی *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">نام ریاست / مدیریت مرکز *</label>
                <input
                  type="text"
                  required
                  value={form.manager}
                  onChange={(e) => setForm({ ...form, manager: e.target.value })}
                  placeholder="مثال: دکتر مهدی حیدری"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">مسئول فنی موسسه *</label>
                <input
                  type="text"
                  required
                  value={form.technicalSupervisor}
                  onChange={(e) => setForm({ ...form, technicalSupervisor: e.target.value })}
                  placeholder="مثال: دکتر سارا کیانی"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">شهرستان فعالیت *</label>
              <select
                value={form.county}
                onChange={(e) => setForm({ ...form, county: e.target.value, city: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              >
                {COUNCIL_INFO.jurisdictionCounties.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">تلفن تماس مرکز *</label>
                <input
                  type="tel"
                  required
                  maxLength={11}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhoneInput(e.target.value) })}
                  placeholder="مثال: 08432220000 یا 09181234567"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-mono text-left dir-ltr"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">ساعات فعالیت و پذیرش *</label>
                <input
                  type="text"
                  required
                  value={form.workingHours}
                  onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                  placeholder="مثال: شبانه‌روزی (۲۴ ساعته)"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">نشانی دقیق موسسه *</label>
              <textarea
                required
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="ایلام، میدان شهید کشوری..."
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">خدمات و بخش‌های فعال (با کاما جدا کنید)</label>
              <input
                type="text"
                value={form.servicesStr}
                onChange={(e) => setForm({ ...form, servicesStr: e.target.value })}
                placeholder="اورژانس، سونوگرافی، آزمايشگاه، داروخانه"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
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

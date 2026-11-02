import React, { useState, useMemo } from 'react';
import { Physician } from '../types';
import { COUNCIL_INFO } from '../data/councilData';
import { useDataContext } from '../context/DataContext';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  RotateCcw,
  X,
  ShieldCheck,
  UserCheck,
  Building,
  Plus,
  Send,
  AlertCircle,
} from 'lucide-react';
import { isValidIranianPhone, formatPhoneInput } from '../utils/phoneUtils';
import { sanitizeTextInput, sanitizeSearchQuery } from '../utils/security';

interface PhysiciansViewProps {
  initialSearchQuery?: string;
  initialSpecialty?: string;
}

const SPECIALTY_GROUPS_LIST = [
  'همه گروه‌ها',
  'پزشک عمومی',
  'متخصص داخلی',
  'جراحی',
  'قلب و عروق',
  'زنان و زایمان',
  'کودکان',
  'دندانپزشکی',
  'داروسازی',
  'ارتوپدی',
  'چشم‌پزشکی',
  'روانپزشکی',
  'مأمایی و پیراپزشکی',
];

export const PhysiciansView: React.FC<PhysiciansViewProps> = ({
  initialSearchQuery = '',
  initialSpecialty = '',
}) => {
  const { physicians, requestPhysicianRegistration } = useDataContext();
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedSpecialtyGroup, setSelectedSpecialtyGroup] = useState(initialSpecialty);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedLicenseStatus, setSelectedLicenseStatus] = useState('');
  const [selectedPhysician, setSelectedPhysician] = useState<Physician | null>(null);

  // Self Registration Modal
  const [showRegModal, setShowRegModal] = useState(false);
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  const specialtyGroups = SPECIALTY_GROUPS_LIST;
  const counties = ['همه شهرستان‌ها', ...COUNCIL_INFO.jurisdictionCounties];

  const approvedPhysicians = useMemo(() => {
    return physicians.filter((p) => !p.status || p.status === 'approved');
  }, [physicians]);

  const filteredPhysicians = useMemo(() => {
    const cleanSearch = sanitizeSearchQuery(searchTerm);
    return approvedPhysicians.filter((p) => {
      const matchSearch =
        !cleanSearch ||
        p.name.includes(cleanSearch) ||
        p.medicalRegNo.includes(cleanSearch) ||
        p.specialty.includes(cleanSearch) ||
        p.clinicName.includes(cleanSearch) ||
        p.address.includes(cleanSearch) ||
        p.services.some((s) => s.includes(cleanSearch));

      const matchSpecialty =
        !selectedSpecialtyGroup ||
        selectedSpecialtyGroup === 'همه گروه‌ها' ||
        p.specialtyGroup === selectedSpecialtyGroup;

      const matchCounty =
        !selectedCounty ||
        selectedCounty === 'همه شهرستان‌ها' ||
        p.county === selectedCounty;

      const matchStatus =
        !selectedLicenseStatus || p.licenseStatus === selectedLicenseStatus;

      return matchSearch && matchSpecialty && matchCounty && matchStatus;
    });
  }, [approvedPhysicians, searchTerm, selectedSpecialtyGroup, selectedCounty, selectedLicenseStatus]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialtyGroup('');
    setSelectedCounty('');
    setSelectedLicenseStatus('');
  };

  return (
    <div className="w-full space-y-8">
      {/* Title & Banner */}
      <div className="bg-white border border-[#E9ECEF] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#55E07E] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#20242A]" />
              <span>سامانه استعلام رسمی اعضای دارای پروانه</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#20242A]">
              بانک جستجوی پزشکان و پیراپزشکان استان ایلام
            </h1>
            <p className="text-xs sm:text-sm text-[#777F87] mt-1 max-w-2xl leading-relaxed">
              استعلام اعتبار پروانه مطب، شماره نظام پزشکی، آدرس مطب و ساعات ویزیت در شهرستان‌های استان ایلام.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => setShowRegModal(true)}
              className="bg-[#FF9D50] hover:bg-[#ff8f38] text-[#20242A] text-xs font-bold px-4 py-3 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>درخواست ثبت و عضویت پزشک</span>
            </button>

            <div className="text-left bg-[#FFF9D8] border border-[#FF9D50]/30 rounded-xl p-3 text-xs">
              <span className="text-[#777F87] block text-[10px]">شاغلین تاییدشده:</span>
              <span className="text-[#20242A] font-sans text-sm font-bold tabular-nums">
                {approvedPhysicians.length} عضو فعال
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-[#F7F8F7] border border-[#E9ECEF] rounded-2xl p-5 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو بر اساس نام پزشک، شماره نظام پزشکی، نوع خدمت یا نام مجتمع پزشکی..."
            className="w-full text-xs sm:text-sm bg-white border border-[#E9ECEF] rounded-xl pr-10 pl-4 py-3 text-[#20242A] focus:outline-none focus:border-[#1DCED8] transition-all"
          />
          <Search className="w-5 h-5 text-[#777F87] absolute right-3.5 top-3.5 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-3 text-[#777F87] hover:text-[#20242A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-[#777F87] mb-1">
              گروه تخصصی / رسته پزشکی
            </label>
            <select
              value={selectedSpecialtyGroup}
              onChange={(e) => setSelectedSpecialtyGroup(e.target.value)}
              className="w-full text-xs bg-white border border-[#E9ECEF] rounded-xl px-3 py-2.5 text-[#20242A] focus:outline-none focus:border-[#1DCED8]"
            >
              {specialtyGroups.map((g) => (
                <option key={g} value={g === 'همه گروه‌ها' ? '' : g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#777F87] mb-1">
              شهرستان محل فعالیت
            </label>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full text-xs bg-white border border-[#E9ECEF] rounded-xl px-3 py-2.5 text-[#20242A] focus:outline-none focus:border-[#1DCED8]"
            >
              {counties.map((c) => (
                <option key={c} value={c === 'همه شهرستان‌ها' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#777F87] mb-1">
              وضعیت پروانه مطب
            </label>
            <select
              value={selectedLicenseStatus}
              onChange={(e) => setSelectedLicenseStatus(e.target.value)}
              className="w-full text-xs bg-white border border-[#E9ECEF] rounded-xl px-3 py-2.5 text-[#20242A] focus:outline-none focus:border-[#1DCED8]"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="دارای پروانه مطب معتبر">دارای پروانه مطب معتبر</option>
              <option value="در حال تمدید">در حال تمدید</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E9ECEF] text-xs">
          <span className="text-[#777F87]">
            تعداد نتایج: <strong className="text-[#20242A] font-sans tabular-nums">{filteredPhysicians.length}</strong> مورد
          </span>

          {(searchTerm || selectedSpecialtyGroup || selectedCounty || selectedLicenseStatus) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[#E5484D] hover:underline font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>پاکسازی فیلترها</span>
            </button>
          )}
        </div>
      </div>

      {/* Results List */}
      {filteredPhysicians.length === 0 ? (
        <div className="bg-white border border-[#E9ECEF] rounded-2xl p-12 text-center space-y-3">
          <Search className="w-8 h-8 text-[#777F87] mx-auto" />
          <h3 className="text-base font-bold text-[#20242A]">پزشکی با معیارهای انتخابی یافت نشد</h3>
          <p className="text-xs text-[#777F87] max-w-md mx-auto">
            لطفاً املای نام را بررسی نمایید، یا با تغییر فیلتر شهرستان و تخصص، جستجوی گسترده‌تری انجام دهید.
          </p>
          <button
            onClick={handleResetFilters}
            className="text-xs bg-[#20242A] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#20242A]/90 transition-all"
          >
            مشاهده همه اعضا
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPhysicians.map((phy) => (
            <div
              key={phy.id}
              className="bg-white border border-[#E9ECEF] hover:border-[#1DCED8] rounded-2xl p-6 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E9ECEF]">
                  <div>
                    <h3 className="text-base font-extrabold text-[#20242A] group-hover:text-[#1DCED8] transition-colors">
                      {phy.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#777F87] mt-1">
                      <span className="font-bold text-[#1DCED8]">{phy.specialty}</span>
                      {phy.subSpecialty && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{phy.subSpecialty}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-[10px] text-[#777F87] block">کد نظام:</span>
                    <span className="text-xs font-bold text-[#20242A] font-sans tabular-nums">
                      {phy.medicalRegNo}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#777F87]">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-[#20242A] shrink-0" />
                    <span>مطب/مرکز: <strong className="text-[#20242A]">{phy.clinicName}</strong></span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#20242A] shrink-0 mt-0.5" />
                    <span className="leading-relaxed line-clamp-1">{phy.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#20242A] shrink-0" />
                    <span>ایام ویزیت: {phy.consultationDays} ({phy.consultationHours})</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9ECEF] mt-4 flex items-center justify-between text-xs">
                <span className="text-[#55E07E] font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{phy.licenseStatus}</span>
                </span>

                <button
                  onClick={() => setSelectedPhysician(phy)}
                  className="text-xs font-bold text-[#20242A] hover:text-[#1DCED8] transition-colors"
                >
                  مشاهده پروفایل کامل ←
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Physician Profile Modal */}
      {selectedPhysician && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E9ECEF]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF9D8] text-[#FF9D50] flex items-center justify-center font-bold text-lg">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#20242A]">{selectedPhysician.name}</h2>
                  <p className="text-xs text-[#777F87] font-semibold mt-0.5">
                    {selectedPhysician.specialty} · کد نظام: <span className="font-sans tabular-nums">{selectedPhysician.medicalRegNo}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPhysician(null)}
                className="p-2 rounded-xl text-[#777F87] hover:text-[#20242A] hover:bg-[#F7F8F7]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-[#55E07E]/10 border border-[#55E07E]/30 rounded-xl p-3.5 text-xs text-[#20242A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#20242A] shrink-0" />
              <div>
                <strong>تاییدیه اصالت حرفه‌ای:</strong> این پروانه توسط کمیسیون ماده ۵ سازمان نظام پزشکی استان ایلام تایید گردیده و دارای صلاحیت طبابت در شهرستان {selectedPhysician.county} می‌باشد.
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#777F87] bg-[#F7F8F7] p-4 rounded-xl border border-[#E9ECEF]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <p>مطب/مرکز: <strong className="text-[#20242A]">{selectedPhysician.clinicName}</strong></p>
                <p>شهرستان: <strong className="text-[#20242A]">{selectedPhysician.county}</strong> ({selectedPhysician.city})</p>
              </div>

              <div className="pt-2 border-t border-[#E9ECEF]">
                <p className="mb-0.5 text-[#777F87]">نشانی دقیق:</p>
                <p className="font-bold text-[#20242A] leading-relaxed">{selectedPhysician.address}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E9ECEF]">
                <div>
                  <span className="text-[#777F87] block mb-0.5">تلفن نوبت‌دهی:</span>
                  <a
                    href={`tel:${selectedPhysician.phone.replace(/-/g, '')}`}
                    className="font-bold text-[#20242A] font-sans tabular-nums flex items-center gap-1 hover:text-[#FF9D50]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedPhysician.phone}</span>
                  </a>
                </div>
                <div>
                  <span className="text-[#777F87] block mb-0.5">ساعات حضور:</span>
                  <span className="font-bold text-[#20242A]">
                    {selectedPhysician.consultationDays} {selectedPhysician.consultationHours}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#20242A] mb-2">
                خدمات تشخیصی و درمانی قابل ارائه:
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedPhysician.services.map((srv, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-[#F7F8F7] text-[#20242A] px-3 py-1 rounded-lg border border-[#E9ECEF]"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E9ECEF] text-xs">
              <a
                href={`tel:${selectedPhysician.phone.replace(/-/g, '')}`}
                className="bg-[#FF9D50] hover:bg-[#ff8f38] text-[#20242A] font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>تماس با مطب ({selectedPhysician.phone})</span>
              </a>

              <button
                onClick={() => setSelectedPhysician(null)}
                className="text-[#777F87] hover:text-[#20242A] px-3 py-2"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Public Self-Registration Modal */}
      {showRegModal && (
        <PhysicianRegistrationModal
          onClose={() => {
            setShowRegModal(false);
            setRegSuccessMsg('');
          }}
          onSubmit={(data) => {
            requestPhysicianRegistration(data);
            setRegSuccessMsg(
              'درخواست عضویت و ثبت اطلاعات شما با موفقیت در سامانه ثبت گردید. پس از بررسی صلاحیت حرفه‌ای توسط هیئت مدیره نظام پزشکی ایلام، پروانه شما در بانک اطلاعات عمومی منتشر خواهد شد.'
            );
          }}
          successMsg={regSuccessMsg}
        />
      )}
    </div>
  );
};

// ==========================================
// PHYSICIAN SELF-REGISTRATION MODAL
// ==========================================
const PhysicianRegistrationModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: Omit<Physician, 'id'>) => void;
  successMsg: string;
}> = ({ onClose, onSubmit, successMsg }) => {
  const [form, setForm] = useState({
    name: '',
    medicalRegNo: '',
    specialtyGroup: 'پزشک عمومی' as const,
    specialty: '',
    subSpecialty: '',
    county: 'ایلام',
    city: 'ایلام',
    clinicName: '',
    address: '',
    phone: '',
    licenseStatus: 'دارای پروانه مطب معتبر' as const,
    consultationDays: 'شنبه تا چهارشنبه',
    consultationHours: '۱۶:۰۰ الی ۲۰:۰۰',
    servicesStr: 'معاینات پزشکی, مشاوره درمانی',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIranianPhone(form.phone)) {
      setErrorMsg('شماره تلفن وارد شده معتبر نیست. شماره تلفن باید ۱۱ رقمی و با ۰ شروع شود (مثال: 08433340000 یا 09181234567).');
      return;
    }
    setErrorMsg('');
    const services = form.servicesStr.split(',').map((s) => sanitizeTextInput(s)).filter(Boolean);
    onSubmit({
      name: sanitizeTextInput(form.name),
      medicalRegNo: sanitizeTextInput(form.medicalRegNo),
      specialtyGroup: form.specialtyGroup,
      specialty: sanitizeTextInput(form.specialty),
      subSpecialty: sanitizeTextInput(form.subSpecialty),
      county: sanitizeTextInput(form.county),
      city: sanitizeTextInput(form.city),
      clinicName: sanitizeTextInput(form.clinicName),
      address: sanitizeTextInput(form.address),
      phone: form.phone.trim(),
      licenseStatus: form.licenseStatus,
      consultationDays: sanitizeTextInput(form.consultationDays),
      consultationHours: sanitizeTextInput(form.consultationHours),
      services,
      status: 'pending',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9ECEF]">
          <div className="flex items-center gap-2 text-[#20242A]">
            <UserCheck className="w-5 h-5 text-[#FF9D50]" />
            <h2 className="font-extrabold text-sm text-[#20242A]">
              فرم درخواست عضویت و پروانه پزشکان استان ایلام
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-[#777F87] hover:text-[#20242A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="bg-[#55E07E]/10 border border-[#55E07E]/40 text-[#20242A] p-6 rounded-2xl space-y-3 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#55E07E] mx-auto" />
            <h3 className="font-extrabold text-base">درخواست شما ثبـت گردید</h3>
            <p className="text-xs leading-relaxed">{successMsg}</p>
            <button
              onClick={onClose}
              className="bg-[#20242A] text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#20242A]/90 transition-all"
            >
              متوجه شدم و بستن
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {errorMsg && (
              <div className="bg-[#E5484D]/10 border border-[#E5484D]/30 text-[#E5484D] p-3 rounded-xl flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1 text-[#20242A]">نام و نام خانوادگی *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: دکتر علیرضا امیری"
                  className="w-full bg-[#F7F8F7] border border-[#E9ECEF] rounded-xl p-2.5 text-[#20242A] focus:outline-none focus:border-[#FF9D50]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#20242A]">شماره نظام پزشکی *</label>
                <input
                  type="text"
                  required
                  value={form.medicalRegNo}
                  onChange={(e) => setForm({ ...form, medicalRegNo: e.target.value })}
                  placeholder="مثال: ۴۹۸۱۲"
                  className="w-full bg-[#F7F8F7] border border-[#E9ECEF] rounded-xl p-2.5 font-sans tabular-nums text-[#20242A] focus:outline-none focus:border-[#FF9D50]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1 text-[#20242A]">رسته/گروه تخصصی *</label>
                <select
                  value={form.specialtyGroup}
                  onChange={(e) => setForm({ ...form, specialtyGroup: e.target.value as any })}
                  className="w-full bg-[#F7F8F7] border border-[#E9ECEF] rounded-xl p-2.5 text-[#20242A] focus:outline-none focus:border-[#FF9D50]"
                >
                  {SPECIALTY_GROUPS_LIST.filter((g: string) => g !== 'همه گروه‌ها').map((g: string) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#20242A]">عنوان تخصص *</label>
                <input
                  type="text"
                  required
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  placeholder="مثال: متخصص بیماری‌های قلب و عروق"
                  className="w-full bg-[#F7F8F7] border border-[#E9ECEF] rounded-xl p-2.5 text-[#20242A] focus:outline-none focus:border-[#FF9D50]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1 text-[#20242A]">نام مطب / کلینیک *</label>
                <input
                  type="text"
                  required
                  value={form.clinicName}
                  onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                  placeholder="مثال: مطب دکتر امیری"
                  className="w-full bg-[#F7F8F7] border border-[#E9ECEF] rounded-xl p-2.5 text-[#20242A] focus:outline-none focus:border-[#FF9D50]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#20242A]">تلفن تماس مطب *</label>
                <input
                  type="tel"
                  required
                  maxLength={11}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhoneInput(e.target.value) })}
                  placeholder="مثال: 08433340000"
                  className="w-full bg-[#F7F8F7] border border-[#E9ECEF] rounded-xl p-2.5 font-sans tabular-nums text-left dir-ltr text-[#20242A] focus:outline-none focus:border-[#FF9D50]"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#20242A]">نشانی دقیق مطب *</label>
              <textarea
                required
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="ایلام، خیابان سعدی..."
                className="w-full bg-[#F7F8F7] border border-[#E9ECEF] rounded-xl p-2.5 text-[#20242A] focus:outline-none focus:border-[#FF9D50]"
              />
            </div>

            <div className="pt-3 border-t border-[#E9ECEF] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#E9ECEF] text-[#777F87] hover:bg-[#F7F8F7]"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="bg-[#FF9D50] hover:bg-[#ff8f38] text-[#20242A] font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>ارسال درخواست جهت تایید</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Physician } from '../types';
import { COUNCIL_INFO } from '../data/councilData';
import { useDataContext } from '../context/DataContext';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  RotateCcw,
  X,
  ShieldCheck,
  UserCheck,
  Calendar,
  Building,
  Plus,
  Send,
  AlertCircle,
} from 'lucide-react';

interface PhysiciansViewProps {
  initialSearchQuery?: string;
  initialSpecialty?: string;
}

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

  const specialtyGroups = [
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

  const counties = ['همه شهرستان‌ها', ...COUNCIL_INFO.jurisdictionCounties];

  // Filter only approved physicians for public display
  const approvedPhysicians = useMemo(() => {
    return physicians.filter((p) => !p.status || p.status === 'approved');
  }, [physicians]);

  // Filtering logic
  const filteredPhysicians = useMemo(() => {
    return approvedPhysicians.filter((p) => {
      const matchSearch =
        !searchTerm.trim() ||
        p.name.includes(searchTerm) ||
        p.medicalRegNo.includes(searchTerm) ||
        p.specialty.includes(searchTerm) ||
        p.clinicName.includes(searchTerm) ||
        p.address.includes(searchTerm) ||
        p.services.some((s) => s.includes(searchTerm));

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
    <div className="w-full space-y-6">
      {/* Title & Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#24845B] mb-1 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>سامانه استعلام رسمی اعضای دارای پروانه</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              بانک جستجوی پزشکان، دندانپزشکان و پیراپزشکان استان ایلام
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              استعلام اعتبار پروانه مطب، بررسی صلاحیت حرفه‌ای، شماره نظام پزشکی، آدرس مطب و ساعات
              ویزیت در تمامی شهرستان‌های استان ایلام.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => setShowRegModal(true)}
              className="bg-[#24845B] hover:bg-[#1b6746] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>درخواست ثبت و عضویت پزشک</span>
            </button>

            <div className="text-left bg-[#EAF6EE] border border-[#24845B]/30 rounded-xl p-3 text-xs">
              <span className="text-[#24845B] font-bold block">شاغلین تاییدشده:</span>
              <span className="text-slate-700 font-sans text-sm font-bold">
                {approvedPhysicians.length} عضو فعال
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        {/* Main Text Search */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو بر اساس نام پزشک، شماره نظام پزشکی (مثلاً ۴۸۹۲۱)، نوع خدمت یا نام مجتمع پزشکی..."
            className="w-full text-xs sm:text-sm bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg pr-10 pl-4 py-3 text-[#202B38] focus:bg-white focus:outline-none focus:border-[#24845B] transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Specialty group */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              گروه تخصصی / رسته پزشکی
            </label>
            <select
              value={selectedSpecialtyGroup}
              onChange={(e) => setSelectedSpecialtyGroup(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#24845B]"
            >
              {specialtyGroups.map((g) => (
                <option key={g} value={g === 'همه گروه‌ها' ? '' : g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* County */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              شهرستان محل فعالیت در استان ایلام
            </label>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#24845B]"
            >
              {counties.map((c) => (
                <option key={c} value={c === 'همه شهرستان‌ها' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* License Status */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              وضعیت پروانه مطب
            </label>
            <select
              value={selectedLicenseStatus}
              onChange={(e) => setSelectedLicenseStatus(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#24845B]"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="دارای پروانه مطب معتبر">دارای پروانه مطب معتبر</option>
              <option value="در حال تمدید">در حال تمدید</option>
            </select>
          </div>
        </div>

        {/* Results bar & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-600">
            تعداد نتایج یافت‌شده: <strong className="text-[#24845B] font-sans">{filteredPhysicians.length}</strong> پزشک / درمانگر
          </span>

          {(searchTerm || selectedSpecialtyGroup || selectedCounty || selectedLicenseStatus) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[#C83E4D] hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>پاکسازی فیلترها</span>
            </button>
          )}
        </div>
      </div>

      {/* Physician Results List / Cards */}
      {filteredPhysicians.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">پزشکی با معیارهای انتخابی یافت نشد</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            لطفاً املای نام را بررسی نمایید، یا با تغییر فیلتر شهرستان و تخصص، جستجوی گسترده‌تری
            انجام دهید.
          </p>
          <button
            onClick={handleResetFilters}
            className="text-xs bg-[#24845B] text-white px-4 py-2 rounded-lg hover:bg-[#1b6746] transition-colors"
          >
            مشاهده همه اعضا
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPhysicians.map((phy) => (
            <div
              key={phy.id}
              className="bg-white border border-[#E2E8F0] hover:border-[#24845B] rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Name and Medical Reg No */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-[#17365D] hover:text-[#24845B] transition-colors">
                      {phy.name}
                    </h3>
                    <p className="text-xs text-[#24845B] font-semibold mt-0.5">{phy.specialty}</p>
                    {phy.subSpecialty && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{phy.subSpecialty}</p>
                    )}
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-[11px] font-sans text-slate-400 block">ش. نظام پزشکی:</span>
                    <span className="text-xs font-bold text-slate-800 font-sans bg-slate-100 px-2 py-0.5 rounded">
                      {phy.medicalRegNo}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 py-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>مرکز / مطب: <strong>{phy.clinicName}</strong></span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed line-clamp-1">{phy.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>ایام ویزیت: {phy.consultationDays} ({phy.consultationHours})</span>
                  </div>
                </div>
              </div>

              {/* Status and Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{phy.licenseStatus}</span>
                </span>

                <button
                  onClick={() => setSelectedPhysician(phy)}
                  className="text-xs font-semibold text-[#24845B] hover:bg-[#EAF6EE] px-3 py-1.5 rounded-lg border border-[#24845B]/40 transition-colors"
                >
                  مشاهده پروفایل کامل
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
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#EAF6EE] text-[#24845B] flex items-center justify-center font-bold text-lg">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#17365D]">{selectedPhysician.name}</h3>
                  <p className="text-xs text-[#24845B] font-semibold">
                    {selectedPhysician.specialty}
                  </p>
                  <p className="text-[11px] text-slate-500 font-sans">
                    شماره نظام پزشکی: {selectedPhysician.medicalRegNo} | رسته: {selectedPhysician.specialtyGroup}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPhysician(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Verification Notice */}
            <div className="bg-[#EAF6EE] border border-[#24845B]/30 rounded-xl p-3.5 text-xs text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#24845B] shrink-0" />
              <div>
                <strong>تاییدیه اصالت حرفه‌ای:</strong> این پروانه توسط کمیسیون ماده ۵ سازمان نظام
                پزشکی استان ایلام بررسی و تایید گردیده و دارای صلاحیت رسمی طبابت در شهرستان{' '}
                {selectedPhysician.county} می‌باشد.
              </div>
            </div>

            {/* Clinic & Schedule Details */}
            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <p>
                  نام مطب / مرکز: <strong>{selectedPhysician.clinicName}</strong>
                </p>
                <p>
                  شهرستان: <strong>{selectedPhysician.county}</strong> ({selectedPhysician.city})
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <p className="mb-1 text-slate-500">نشانی دقیق محل ویزیت:</p>
                <p className="font-medium text-slate-900 leading-relaxed">
                  {selectedPhysician.address}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block mb-0.5">تلفن نوبت‌دهی و مطب:</span>
                  <a
                    href={`tel:${selectedPhysician.phone.replace(/-/g, '')}`}
                    className="font-bold text-[#24845B] font-sans flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedPhysician.phone}</span>
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">ساعات حضور:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedPhysician.consultationDays} ساعت {selectedPhysician.consultationHours}
                  </span>
                </div>
              </div>
            </div>

            {/* Services provided */}
            <div>
              <h4 className="text-xs font-bold text-[#17365D] mb-2">
                خدمات تشخیصی و درمانی قابل ارائه:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedPhysician.services.map((srv, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
              <a
                href={`tel:${selectedPhysician.phone.replace(/-/g, '')}`}
                className="bg-[#24845B] hover:bg-[#1b6746] text-white font-bold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>تماس با مطب ({selectedPhysician.phone})</span>
              </a>

              <button
                onClick={() => setSelectedPhysician(null)}
                className="text-slate-500 hover:text-slate-800 px-3 py-2"
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
              'درخواست عضویت و ثبت اطلاعات شما با موفقیت در سامانه ثبت گردید. پس از بررسی صلاحیت حرفه‌ای و تایید توسط هیئت مدیره نظام پزشکی ایلام، پروانه شما در بانک اطلاعات عمومی منتشر خواهد شد.'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const services = form.servicesStr.split(',').map((s) => s.trim()).filter(Boolean);
    onSubmit({
      name: form.name,
      medicalRegNo: form.medicalRegNo,
      specialtyGroup: form.specialtyGroup,
      specialty: form.specialty,
      subSpecialty: form.subSpecialty,
      county: form.county,
      city: form.city,
      clinicName: form.clinicName,
      address: form.address,
      phone: form.phone,
      licenseStatus: form.licenseStatus,
      consultationDays: form.consultationDays,
      consultationHours: form.consultationHours,
      services,
      status: 'pending',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[#24845B]">
            <UserCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#17365D]">
              فرم خودکار ثبت‌نام و درخواست پروانه پزشکان استان ایلام
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-5 rounded-xl space-y-3 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm">درخواست شما ثبـت گردید</h4>
            <p className="text-xs leading-relaxed">{successMsg}</p>
            <button
              onClick={onClose}
              className="bg-[#24845B] text-white font-bold px-5 py-2 rounded-lg text-xs hover:bg-[#1b6746]"
            >
              متوجه شدم و بستن
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                توجه: اطلاعات ثبت‌شده پس از بررسی و تایید هیئت مدیره نظام پزشکی استان ایلام در بانک جستجوی عمومی منتشر خواهد شد.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">نام و نام خانوادگی *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: دکتر علیرضا امیری"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">شماره نظام پزشکی *</label>
                <input
                  type="text"
                  required
                  value={form.medicalRegNo}
                  onChange={(e) => setForm({ ...form, medicalRegNo: e.target.value })}
                  placeholder="مثال: ۴۹۸۱۲"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">رسته/گروه تخصصی *</label>
                <select
                  value={form.specialtyGroup}
                  onChange={(e) => setForm({ ...form, specialtyGroup: e.target.value as any })}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                >
                  <option value="پزشک عمومی">پزشک عمومی</option>
                  <option value="متخصص داخلی">متخصص داخلی</option>
                  <option value="جراحی">جراحی</option>
                  <option value="قلب و عروق">قلب و عروق</option>
                  <option value="زنان و زایمان">زنان و زایمان</option>
                  <option value="کودکان">کودکان</option>
                  <option value="دندانپزشکی">دندانپزشکی</option>
                  <option value="داروسازی">داروسازی</option>
                  <option value="ارتوپدی">ارتوپدی</option>
                  <option value="چشم‌پزشکی">چشم‌پزشکی</option>
                  <option value="روانپزشکی">روانپزشکی</option>
                  <option value="مأمایی و پیراپزشکی">مأمایی و پیراپزشکی</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">عنوان تخصص دقیق *</label>
                <input
                  type="text"
                  required
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  placeholder="مثال: متخصص بیماری‌های قلب و عروق"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">فوق تخصص / فلوشیپ (اختیاری)</label>
                <input
                  type="text"
                  value={form.subSpecialty}
                  onChange={(e) => setForm({ ...form, subSpecialty: e.target.value })}
                  placeholder="مثال: فلوشیپ آنژیوپلاستی"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                />
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">نام مطب / کلینیک *</label>
                <input
                  type="text"
                  required
                  value={form.clinicName}
                  onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                  placeholder="مثال: مطب دکتر امیری"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">تلفن تماس مطب *</label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="مثال: ۰۸۴۳۳۳۴۰۰۰۰"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">نشانی دقیق مطب *</label>
              <textarea
                required
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="ایلام، خیابان سعدی، ساختمان پزشکان..."
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">روزهای ویزیت *</label>
                <input
                  type="text"
                  required
                  value={form.consultationDays}
                  onChange={(e) => setForm({ ...form, consultationDays: e.target.value })}
                  placeholder="شنبه تا چهارشنبه"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">ساعات ویزیت *</label>
                <input
                  type="text"
                  required
                  value={form.consultationHours}
                  onChange={(e) => setForm({ ...form, consultationHours: e.target.value })}
                  placeholder="۱۶:۰۰ الی ۲۰:۰۰"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">خدمات درمانی (با کاما جدا کنید)</label>
              <input
                type="text"
                value={form.servicesStr}
                onChange={(e) => setForm({ ...form, servicesStr: e.target.value })}
                placeholder="معاینات، مشاوره، اکوکاردیوگرافی"
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
                className="bg-[#24845B] hover:bg-[#1b6746] text-white font-bold px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>ارسال درخواست جهت بررسی و تایید</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

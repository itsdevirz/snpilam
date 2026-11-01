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
} from 'lucide-react';

interface PhysiciansViewProps {
  initialSearchQuery?: string;
  initialSpecialty?: string;
}

export const PhysiciansView: React.FC<PhysiciansViewProps> = ({
  initialSearchQuery = '',
  initialSpecialty = '',
}) => {
  const { physicians } = useDataContext();
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedSpecialtyGroup, setSelectedSpecialtyGroup] = useState(initialSpecialty);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedLicenseStatus, setSelectedLicenseStatus] = useState('');
  const [selectedPhysician, setSelectedPhysician] = useState<Physician | null>(null);

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

  // Filtering logic
  const filteredPhysicians = useMemo(() => {
    return physicians.filter((p) => {
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
  }, [searchTerm, selectedSpecialtyGroup, selectedCounty, selectedLicenseStatus]);

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

          <div className="text-left bg-[#EAF6EE] border border-[#24845B]/30 rounded-xl p-3 text-xs">
            <span className="text-[#24845B] font-bold block">مجموع شاغلین ثبت‌شده:</span>
            <span className="text-slate-700 font-sans text-sm font-bold">
              {physicians.length} عضو ثبت‌شده فعال
            </span>
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
    </div>
  );
};

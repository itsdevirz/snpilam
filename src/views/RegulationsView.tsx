import React, { useState, useMemo } from 'react';
import { RegulationDoc } from '../types';
import { useDataContext } from '../context/DataContext';
import {
  FileText,
  Search,
  Download,
  Filter,
  Calendar,
  Building,
  RotateCcw,
  Eye,
  X,
  FileCheck,
} from 'lucide-react';

export const RegulationsView: React.FC = () => {
  const { regulations } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeDoc, setActiveDoc] = useState<RegulationDoc | null>(null);

  const categories = [
    'همه دسته‌ها',
    'تعرفه‌های تشخیصی درمانی',
    'آیین‌نامه‌های انتظامی',
    'دستورالعمل پروانه مطب',
    'قوانین مالیاتی',
    'ضوابط تبلیغات پزشکی',
  ];

  const filteredDocs = useMemo(() => {
    return regulations.filter((d) => {
      const matchSearch =
        !searchTerm.trim() ||
        d.title.includes(searchTerm) ||
        d.docNumber.includes(searchTerm) ||
        d.description.includes(searchTerm);

      const matchCategory =
        !selectedCategory ||
        selectedCategory === 'همه دسته‌ها' ||
        d.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2463A6] mb-1 font-semibold">
              <FileText className="w-4 h-4" />
              <span>پایگاه اسناد و مقررات رسمی حوزه سلامت</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              کتابخانه قوانین، تعرفه‌ها و بخشنامه‌های نظام پزشکی
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              مرجع استناد قانونی تعرفه‌های درمانی مصوب هیئت وزیران، آیین‌نامه رسیدگی به تخلفات
              انتظامی، ضوابط تاسیس مطب و دستورالعمل‌های مالیاتی استان ایلام.
            </p>
          </div>

          <div className="bg-[#EFF6FC] border border-[#2463A6]/30 rounded-xl p-3 text-xs text-left">
            <span className="text-[#2463A6] font-bold block">تعداد اسناد معتبر:</span>
            <span className="text-slate-800 font-sans font-bold text-sm">
              {regulations.length} سند رسمی مصوب
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در عنوان بخشنامه، شماره ابلاغیه یا متن..."
              className="w-full text-xs sm:text-sm bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg pr-9 pl-3 py-2.5 text-[#202B38] focus:bg-white focus:outline-none focus:border-[#2463A6]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#2463A6]"
            >
              {categories.map((c) => (
                <option key={c} value={c === 'همه دسته‌ها' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-600">
            تعداد اسناد یافت‌شده: <strong className="text-[#2463A6] font-sans">{filteredDocs.length}</strong>
          </span>

          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="text-[#C83E4D] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>پاکسازی فیلترها</span>
            </button>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-[#E2E8F0] hover:border-[#2463A6] rounded-xl p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                <span className="font-semibold text-[#2463A6] bg-[#EFF6FC] px-2.5 py-0.5 rounded">
                  {doc.category}
                </span>
                <span>·</span>
                <span>مرجع صدور: {doc.issuingBody}</span>
                <span>·</span>
                <span className="font-sans">تاریخ ابلاغ: {doc.date}</span>
                <span>·</span>
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                  شماره: {doc.docNumber}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[#17365D] leading-snug">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {doc.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                onClick={() => setActiveDoc(doc)}
                className="text-xs font-semibold bg-[#F5F7FA] hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-slate-600" />
                <span>مشاهده چکیده</span>
              </button>

              <button
                onClick={() => {
                  alert(
                    `دانلود نسخه رسمی پی‌دی‌اف «${doc.title}» (${doc.fileSize}).\nفایل مستقیماً از مخزن رسمی دریافت خواهد شد.`
                  );
                }}
                className="text-xs font-semibold bg-[#2463A6] hover:bg-[#17365D] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>دریافت فایل ({doc.fileFormat} - {doc.fileSize})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Doc Preview Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#2463A6] bg-[#EFF6FC] px-2.5 py-1 rounded">
                  {activeDoc.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#17365D] mt-2 leading-snug">
                  {activeDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200">
                <p>شماره نامه / سند: <strong className="font-mono text-slate-900">{activeDoc.docNumber}</strong></p>
                <p>تاریخ تصویب: <strong className="font-sans">{activeDoc.date}</strong></p>
                <p>مرجع تصویب‌کننده: <strong>{activeDoc.issuingBody}</strong></p>
                <p>حجم فایل: <strong className="font-sans">{activeDoc.fileSize}</strong></p>
              </div>
              <p className="leading-relaxed pt-1 text-slate-800">
                {activeDoc.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
              <button
                onClick={() => {
                  alert(`دانلود فایل «${activeDoc.title}»`);
                  setActiveDoc(null);
                }}
                className="bg-[#2463A6] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#17365D] flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>دریافت نسخه کامل PDF</span>
              </button>

              <button
                onClick={() => setActiveDoc(null)}
                className="text-slate-500 hover:text-slate-800"
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

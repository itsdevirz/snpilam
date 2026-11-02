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
      {/* Title Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark uppercase tracking-wide">
              <FileText className="w-4 h-4 text-[#FF9D50]" />
              <span>پایگاه اسناد و مقررات رسمی حوزه سلامت استان ایلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              کتابخانه قوانین، تعرفه‌ها و بخشنامه‌های نظام پزشکی
            </h2>
            <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">
              مرجع استناد قانونی تعرفه‌های درمانی مصوب هیئت وزیران، آیین‌نامه رسیدگی به تخلفات
              انتظامی، ضوابط تاسیس مطب و دستورالعمل‌های مالیاتی استان ایلام.
            </p>
          </div>

          <div className="bg-[#FFF9D8]/70 border border-[#FF9D50]/30 rounded-xl p-4 text-xs shrink-0">
            <span className="text-brand-muted block text-[11px]">تعداد اسناد معتبر:</span>
            <span className="text-brand-dark font-sans font-bold text-base tabular-nums">
              {regulations.length} سند رسمی مصوب
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-brand-border rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در عنوان بخشنامه، شماره ابلاغیه یا متن..."
              className="w-full text-xs sm:text-sm bg-[#F7F8F7] border border-brand-border rounded-xl pr-10 pl-3 py-2.5 text-brand-dark placeholder:text-brand-muted focus:bg-white focus:outline-none focus:border-[#FF9D50]"
            />
            <Search className="w-4 h-4 text-brand-muted absolute right-3.5 top-3" />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-[#F7F8F7] border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-dark focus:outline-none focus:border-[#FF9D50]"
            >
              {categories.map((c) => (
                <option key={c} value={c === 'همه دسته‌ها' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brand-border text-xs">
          <span className="text-brand-muted">
            تعداد اسناد یافت‌شده: <strong className="text-brand-dark font-sans tabular-nums">{filteredDocs.length}</strong>
          </span>

          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="text-[#1DCED8] font-medium hover:underline flex items-center gap-1"
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
            className="bg-white border border-brand-border hover:border-[#FF9D50]/50 rounded-2xl p-6 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap text-xs text-brand-muted">
                <span className="font-semibold text-brand-dark">
                  {doc.category}
                </span>
                <span>·</span>
                <span>مرجع صدور: {doc.issuingBody}</span>
                <span>·</span>
                <span>تاریخ ابلاغ: <span className="tabular-nums">{doc.date}</span></span>
                <span>·</span>
                <span className="font-mono tabular-nums">
                  شماره: {doc.docNumber}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-brand-dark group-hover:text-[#FF9D50] transition-colors leading-snug">
                {doc.title}
              </h3>

              <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                {doc.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-brand-border">
              <button
                onClick={() => setActiveDoc(doc)}
                className="text-xs font-semibold bg-[#F7F8F7] hover:bg-slate-200 text-brand-dark px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-brand-muted" />
                <span>مشاهده چکیده</span>
              </button>

              <button
                onClick={() => {
                  alert(
                    `دانلود نسخه رسمی پی‌دی‌اف «${doc.title}» (${doc.fileSize}).\nفایل مستقیماً از مخزن رسمی دریافت خواهد شد.`
                  );
                }}
                className="text-xs font-bold bg-[#FF9D50] hover:bg-[#e0843a] text-white px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>دریافت فایل ({doc.fileFormat} - <span className="tabular-nums">{doc.fileSize}</span>)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Doc Preview Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-brand-border">
            <div className="flex items-start justify-between pb-4 border-b border-brand-border">
              <div>
                <span className="text-xs font-semibold text-brand-muted">
                  {activeDoc.category}
                </span>
                <h3 className="text-lg font-bold text-brand-dark mt-1 leading-snug">
                  {activeDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-[#F7F8F7]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-[#F7F8F7] p-5 rounded-2xl border border-brand-border space-y-3 text-xs text-brand-dark">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-brand-border">
                <p>شماره نامه / سند: <strong className="font-mono tabular-nums text-brand-dark">{activeDoc.docNumber}</strong></p>
                <p>تاریخ تصویب: <strong className="font-sans tabular-nums text-brand-dark">{activeDoc.date}</strong></p>
                <p>مرجع تصویب‌کننده: <strong className="text-brand-dark">{activeDoc.issuingBody}</strong></p>
                <p>حجم فایل: <strong className="font-sans tabular-nums text-brand-dark">{activeDoc.fileSize}</strong></p>
              </div>
              <p className="leading-relaxed pt-1 text-brand-dark">
                {activeDoc.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-brand-border text-xs">
              <button
                onClick={() => {
                  alert(`دانلود فایل «${activeDoc.title}»`);
                  setActiveDoc(null);
                }}
                className="bg-[#FF9D50] hover:bg-[#e0843a] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>دریافت نسخه کامل PDF</span>
              </button>

              <button
                onClick={() => setActiveDoc(null)}
                className="text-brand-muted hover:text-brand-dark font-medium"
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

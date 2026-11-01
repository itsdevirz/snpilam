import React from 'react';
import { CouncilEmblem } from '../components/CouncilEmblem';
import { COUNCIL_INFO } from '../data/councilData';
import {
  ShieldCheck,
  Award,
  Users,
  Building,
  CheckCircle,
  FileText,
  Clock,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const boardMembers = [
    { name: 'دکتر علیرضا محمدی‌فر', role: 'رئیس سازمان نظام پزشکی استان ایلام', specialty: 'متخصص جراحی عمومی' },
    { name: 'دکتر مریم شمس‌اللهی', role: 'نایب رئیس و مسئول امور پروانه‌ها', specialty: 'متخصص بیماری‌های داخلی' },
    { name: 'دکتر محمدرضا صادقی', role: 'دادستان انتظامی نظام پزشکی', specialty: 'پزشک عمومی و پژوهشگر حقوق پزشکی' },
    { name: 'دکتر کاوه احمدی', role: 'دبیر کمیسیون آموزش مداوم و پژوهش', specialty: 'متخصص چشم‌پزشکی' },
    { name: 'دکتر پیمان مرادی', role: 'رئیس کمیسیون رفاه و اعتبارات', specialty: 'متخصص ارتوپدی' },
    { name: 'دکتر فرزانه نوری', role: 'عضو هیئت مدیره و نماینده دندانپزشکان', specialty: 'دندانپزشک' },
    { name: 'دکتر سارا غلامی', role: 'عضو هیئت مدیره و نماینده داروسازان', specialty: 'دکترای داروسازی' },
    { name: 'زهرا کاظمی', role: 'عضو هیئت مدیره و نماینده گروه مامایی', specialty: 'کارشناس ارشد مامایی' },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Title */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <CouncilEmblem size={80} className="shrink-0" />
          <div>
            <span className="text-xs font-semibold text-[#2463A6] bg-[#EFF6FC] px-2.5 py-0.5 rounded">
              معرفی سازمان و جایگاه قانونی
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D] mt-2">
              درباره سازمان نظام پزشکی شهرستان و استان ایلام
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              نهاد مستقل صنفی و حرفه‌ای کادر پزشکی دارای شخصیت حقوقی مستقل بر اساس قانون مصوب
              مجلس شورای اسلامی و مجمع تشخیص مصلحت نظام.
            </p>
          </div>
        </div>
      </div>

      {/* President Message */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="w-12 h-12 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-lg">
            د.م
          </div>
          <div>
            <h3 className="text-base font-bold text-[#17365D]">{COUNCIL_INFO.president.name}</h3>
            <p className="text-xs text-[#2463A6] font-semibold">{COUNCIL_INFO.president.title}</p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-[#F8FAFC] p-5 rounded-xl border border-slate-200">
          <p className="font-bold text-[#17365D]">
            پیام ریاست سازمان نظام پزشکی استان ایلام به جامعه پزشکی و هم‌استانی‌های ارجمند:
          </p>
          <p>
            حفظ سلامت و کرامت انسان‌ها والاترین رسالتی است که پروردگار متعال بر عهده جامعه پزشکی نهاده
            است. استان مرزی و قهرمان‌پرور ایلام در تمام برهه‌های تاریخی به ویژه در دوران دفاع مقدس
            شاهد ایثارگری‌ها و خدمات بی‌دریغ کادر درمان بوده است.
          </p>
          <p>
            نظام پزشکی ایلام در دوره جدید، محور فعالیت‌های خود را بر سه اصل بنیادین استوار ساخته است:
            <strong> ارتقای سطح علمی از طریق بازآموزی‌های مدرن</strong>،{' '}
            <strong>صیانت قاطع از حقوق صنفی و رفاهی همکاران</strong> و{' '}
            <strong>نظارت مستمر بر موازین اخلاقی و دفاع از حقوق حقه بیماران و مراجعین</strong>.
          </p>
          <p>
            امید است با گسترش خدمات الکترونیک و شفافیت اداری، گامی موثر در جهت اعتلای جایگاه سلامت در
            استان ایلام برداریم.
          </p>
        </div>
      </div>

      {/* Organizational Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#EFF6FC] text-[#2463A6] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#17365D]">صیانت از حقوق حرفه‌ای</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            دفاع از استقلال علمی و جایگاه صنفی پزشکان در برابر تصمیمات غیرکارشناسی، پیگیری مطالبات
            بیمه‌ای و حل اختلافات حقوقی.
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#EAF6EE] text-[#24845B] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#17365D]">اخلاق پزشکی و دادگاه انتظامی</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            رسیدگی دقیق، عادلانه و بی‌طرفانه به شکایات مراجعین و قصورات احتمالی از طریق قضات و
            کارشناسان رسمی معتمد دادسرای انتظامی.
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#FDF4E7] text-[#C77920] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#17365D]">پوشش فراگیر در ۱۲ شهرستان</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            نظارت و ارائه خدمات صدور پروانه به تمامی شهرستان‌های ایلام، ایوان، دهلران، مهران، دره‌شهر،
            آبدانان، چرداول، بدره، سیروان، ملکشاهی، چوار و هلیلان.
          </p>
        </div>
      </div>

      {/* Board of Directors */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#17365D] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#2463A6]" />
          <span>اعضای هیئت مدیره سازمان نظام پزشکی استان ایلام (دوره ششم)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {boardMembers.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5"
            >
              <h4 className="font-bold text-[#17365D] text-sm">{m.name}</h4>
              <p className="text-[#2463A6] font-medium text-[11px]">{m.role}</p>
              <p className="text-slate-500 text-[11px]">{m.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

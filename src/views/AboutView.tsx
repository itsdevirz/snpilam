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
      {/* Title Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <CouncilEmblem size={80} className="shrink-0" />
          <div className="space-y-2">
            <span className="text-xs font-semibold text-brand-dark uppercase tracking-wide">
              معرفی سازمان و جایگاه قانونی
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              درباره سازمان نظام پزشکی استان ایلام
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              نهاد مستقل صنفی و حرفه‌ای کادر پزشکی دارای شخصیت حقوقی مستقل بر اساس قانون مصوب
              مجلس شورای اسلامی و مجمع تشخیص مصلحت نظام.
            </p>
          </div>
        </div>
      </div>

      {/* President Message */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-brand-border">
          <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-bold text-lg">
            د.م
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-dark">{COUNCIL_INFO.president.name}</h3>
            <p className="text-xs text-[#FF9D50] font-semibold mt-0.5">{COUNCIL_INFO.president.title}</p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-brand-dark leading-relaxed space-y-3 bg-[#F7F8F7] p-6 rounded-2xl border border-brand-border">
          <p className="font-bold text-brand-dark text-sm">
            پیام ریاست سازمان نظام پزشکی استان ایلام به جامعه پزشکی و هم‌استانی‌های ارجمند:
          </p>
          <p>
            حفظ سلامت و کرامت انسان‌ها والاترین رسالتی است که پروردگار متعال بر عهده جامعه پزشکی نهاده
            است. استان مرزی و قهرمان‌پرور ایلام در تمام برهه‌های تاریخی به ویژه در دوران دفاع مقدس
            شاهد ایثارگری‌ها و خدمات بی‌دریغ کادر درمان بوده است.
          </p>
          <p>
            نظام پزشکی ایلام در دوره جدید، محور فعالیت‌های خود را بر سه اصل بنیادین استوار ساخته است:
            <strong className="text-brand-dark"> ارتقای سطح علمی از طریق بازآموزی‌های مدرن</strong>،{' '}
            <strong className="text-brand-dark">صیانت قاطع از حقوق صنفی و رفاهی همکاران</strong> و{' '}
            <strong className="text-brand-dark">نظارت مستمر بر موازین اخلاقی و دفاع از حقوق حقه بیماران و مراجعین</strong>.
          </p>
          <p>
            امید است با گسترش خدمات الکترونیک و شفافیت اداری، گامی موثر در جهت اعتلای جایگاه سلامت در
            استان ایلام برداریم.
          </p>
        </div>
      </div>

      {/* Organizational Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-brand-border rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF9D8] text-[#FF9D50] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-brand-dark">صیانت از حقوق حرفه‌ای</h4>
          <p className="text-xs text-brand-muted leading-relaxed">
            دفاع از استقلال علمی و جایگاه صنفی پزشکان در برابر تصمیمات غیرکارشناسی، پیگیری مطالبات
            بیمه‌ای و حل اختلافات حقوقی.
          </p>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#55E07E]/10 text-[#55E07E] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-brand-dark">اخلاق پزشکی و دادگاه انتظامی</h4>
          <p className="text-xs text-brand-muted leading-relaxed">
            رسیدگی دقیق، عادلانه و بی‌طرفانه به شکایات مراجعین و قصورات احتمالی از طریق قضات و
            کارشناسان رسمی معتمد دادسرای انتظامی.
          </p>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#1DCED8]/10 text-[#1DCED8] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-brand-dark">پوشش فراگیر در ۱۲ شهرستان</h4>
          <p className="text-xs text-brand-muted leading-relaxed">
            نظارت و ارائه خدمات صدور پروانه به تمامی شهرستان‌های ایلام، ایوان، دهلران، مهران، دره‌شهر،
            آبدانان، چرداول، بدره، سیروان، ملکشاهی، چوار و هلیلان.
          </p>
        </div>
      </div>

      {/* Board of Directors */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
          <Users className="w-5 h-5 text-[#FF9D50]" />
          <span>اعضای هیئت مدیره سازمان نظام پزشکی استان ایلام (دوره ششم)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {boardMembers.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#F7F8F7] border border-brand-border rounded-xl p-5 text-xs space-y-2"
            >
              <h4 className="font-bold text-brand-dark text-sm">{m.name}</h4>
              <p className="text-[#FF9D50] font-semibold text-xs">{m.role}</p>
              <p className="text-brand-muted text-xs">{m.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

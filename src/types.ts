export type NavigationTab =
  | 'home'
  | 'news'
  | 'services'
  | 'physicians'
  | 'facilities'
  | 'classifieds'
  | 'education'
  | 'regulations'
  | 'licenses'
  | 'tax'
  | 'advertising'
  | 'welfare'
  | 'departments'
  | 'about'
  | 'contact'
  | 'admin';

export interface ContactMessage {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  department: string;
  subject: string;
  message: string;
  date: string;
  type: 'inquiry' | 'suggestion' | 'complaint';
  status: 'new' | 'investigating' | 'resolved';
  adminReply?: string;
  trackingCode?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  user: string;
  type: 'create' | 'update' | 'delete' | 'status';
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'امور پروانه‌ها' | 'آموزش مداوم' | 'مالیاتی' | 'انتظامی' | 'رفاهی' | 'عمومی';
  isUrgent: boolean;
  priority: 'فوری' | 'مهم' | 'عادی';
  summary: string;
  content: string;
  expirationDate?: string;
  docNumber?: string;
  imageUrl?: string;
  images?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
  imageUrl?: string;
  images?: string[];
  isFeatured?: boolean;
  source: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'پروانه‌ها و مجوزها' | 'عضویت و مدارک' | 'مالیات و تعرفه' | 'تبلیغات و نظارت';
  summary: string;
  description: string;
  prerequisites: string[];
  requiredDocuments: string[];
  steps: string[];
  department: string;
  phoneExtension: string;
  processingTime: string;
  feeInfo: string;
  downloadableForms: { title: string; format: string; size: string }[];
}

export interface Physician {
  id: string;
  name: string;
  medicalRegNo: string;
  specialtyGroup: 'پزشک عمومی' | 'متخصص داخلی' | 'جراحی' | 'دندانپزشکی' | 'داروسازی' | 'زنان و زایمان' | 'کودکان' | 'چشم‌پزشکی' | 'قلب و عروق' | 'ارتوپدی' | 'روانپزشکی' | 'مأمایی و پیراپزشکی';
  specialty: string;
  subSpecialty?: string;
  city: string;
  county: string;
  clinicName: string;
  address: string;
  phone: string;
  licenseStatus: 'دارای پروانه مطب معتبر' | 'در حال تمدید' | 'پروانه ستادی / بیمارستانی';
  consultationDays: string;
  consultationHours: string;
  services: string[];
  status?: 'approved' | 'pending' | 'rejected';
}

export interface Facility {
  id: string;
  name: string;
  type: 'بیمارستان' | 'درمانگاه شبانه‌روزی' | 'مرکز جراحی محدود' | 'کلینیک دندانپزشکی' | 'آزمایشگاه تشخیص طبی' | 'مرکز تصویربرداری و ام‌آر‌آی' | 'داروخانه شبانه‌روزی';
  county: string;
  city: string;
  manager: string;
  technicalSupervisor: string;
  address: string;
  phone: string;
  workingHours: string;
  licenseStatus: 'دارای پروانه بهره‌برداری معتبر' | 'در حال تمدید';
  services: string[];
  status?: 'approved' | 'pending' | 'rejected';
}

export interface ClassifiedItem {
  id: string;
  title: string;
  category: 'استخدام پزشک' | 'استخدام دندانپزشک' | 'استخدام داروساز' | 'مسئول فنی' | 'اجاره و واگذاری مطب' | 'فروش تجهیزات پزشکی' | 'مشارکت کلینیک';
  county: string;
  city: string;
  specialtyGroup: string;
  description: string;
  publishDate: string;
  expirationDate: string;
  contactName: string;
  contactPhone: string;
  status: 'active' | 'expired';
  compensation?: string;
}

export interface EducationalEvent {
  id: string;
  title: string;
  type: 'وبینار برخط' | 'کارگاه عملی حضوری' | 'کنفرانس علمی' | 'دوره بازآموزی جامع';
  cmeCredits: number;
  date: string;
  time: string;
  venue: string;
  instructor: string;
  targetAudience: string[];
  capacity: number;
  registeredCount: number;
  registrationStatus: 'open' | 'closing-soon' | 'completed';
  fee: string;
  officialSystemCode: string;
}

export interface RegulationDoc {
  id: string;
  title: string;
  docNumber: string;
  date: string;
  issuingBody: 'سازمان کل نظام پزشکی' | 'وزارت بهداشت، درمان و آموزش پزشکی' | 'سازمان امور مالیاتی' | 'نظام پزشکی استان ایلام';
  category: 'تعرفه‌های تشخیصی درمانی' | 'آیین‌نامه‌های انتظامی' | 'دستورالعمل پروانه مطب' | 'قوانین مالیاتی' | 'ضوابط تبلیغات پزشکی';
  description: string;
  fileSize: string;
  fileFormat: string;
}

export interface DepartmentInfo {
  id: string;
  title: string;
  shortTitle: string;
  director: string;
  role: string;
  description: string;
  responsibilities: string[];
  services: string[];
  phone: string;
  extension: string;
  email: string;
  officeHours: string;
  location: string;
}

export interface WelfareService {
  id: string;
  category: 'بیمه درمان تکمیلی' | 'تسهیلات بانکی' | 'اقامتی و سیاحتی' | 'مراکز ورزشی و رفاهی' | 'خدمات حقوقی و مشاوره';
  title: string;
  partnerName: string;
  discountRate: string;
  description: string;
  terms: string[];
  contactPhone: string;
  address?: string;
}

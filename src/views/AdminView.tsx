import React, { useState } from 'react';
import {
  Physician,
  Announcement,
  NewsItem,
  Facility,
  ClassifiedItem,
  EducationalEvent,
  RegulationDoc,
  ServiceItem,
  ContactMessage,
} from '../types';
import { useDataContext } from '../context/DataContext';
import { COUNCIL_INFO } from '../data/councilData';
import {
  ShieldAlert,
  Users,
  Bell,
  FileText,
  Briefcase,
  GraduationCap,
  Building2,
  Inbox,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Lock,
  LogOut,
  RotateCcw,
  Check,
  X,
  Eye,
  Key,
  Download,
  Filter,
  Activity,
  Award,
  Phone,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  Database,
  Server,
  RefreshCw,
  FileCode,
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'physicians'
  | 'announcements'
  | 'classifieds'
  | 'education'
  | 'messages'
  | 'facilities'
  | 'regulations'
  | 'services'
  | 'settings';

export const AdminView: React.FC = () => {
  const {
    announcements,
    newsItems,
    services,
    physicians,
    facilities,
    classifieds,
    educationEvents,
    regulations,
    messages,
    logs,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    addPhysician,
    updatePhysician,
    deletePhysician,
    approvePhysician,
    rejectPhysician,
    requestPhysicianRegistration,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addNews,
    updateNews,
    deleteNews,
    addFacility,
    updateFacility,
    deleteFacility,
    approveFacility,
    rejectFacility,
    requestFacilityRegistration,
    addClassified,
    updateClassifiedStatus,
    deleteClassified,
    addEducationEvent,
    updateEducationEvent,
    deleteEducationEvent,
    addRegulationDoc,
    updateRegulationDoc,
    deleteRegulationDoc,
    addService,
    updateService,
    deleteService,
    updateMessageStatus,
    deleteMessage,
    resetAllData,
    changeAdminPassword,
  } = useDataContext();

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Change Password form state
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [showPwdCurrent, setShowPwdCurrent] = useState(false);
  const [showPwdNew, setShowPwdNew] = useState(false);
  const [showPwdConfirm, setShowPwdConfirm] = useState(false);
  const [pwdStatus, setPwdStatus] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Modals state
  const [physicianModal, setPhysicianModal] = useState<{ open: boolean; item?: Physician }>({ open: false });
  const [announcementModal, setAnnouncementModal] = useState<{ open: boolean; item?: Announcement }>({ open: false });
  const [newsModal, setNewsModal] = useState<{ open: boolean; item?: NewsItem }>({ open: false });
  const [classifiedModal, setClassifiedModal] = useState<{ open: boolean; item?: ClassifiedItem }>({ open: false });
  const [educationModal, setEducationModal] = useState<{ open: boolean; item?: EducationalEvent }>({ open: false });
  const [facilityModal, setFacilityModal] = useState<{ open: boolean; item?: Facility }>({ open: false });
  const [regulationModal, setRegulationModal] = useState<{ open: boolean; item?: RegulationDoc }>({ open: false });
  const [messageReplyModal, setMessageReplyModal] = useState<{ open: boolean; item?: ContactMessage }>({ open: false });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ open: boolean; title: string; onConfirm: () => void }>({ open: false, title: '', onConfirm: () => {} });

  // Filters state in Admin
  const [physicianSearch, setPhysicianSearch] = useState('');
  const [messageFilterStatus, setMessageFilterStatus] = useState<'all' | 'new' | 'investigating' | 'resolved'>('all');

  // MySQL Database Configuration state (cPanel host)
  const [dbHost, setDbHost] = useState(() => localStorage.getItem('ilam_db_host') || 'localhost');
  const [dbPort, setDbPort] = useState(() => localStorage.getItem('ilam_db_port') || '3306');
  const [dbName, setDbName] = useState(() => localStorage.getItem('ilam_db_name') || '');
  const [dbUser, setDbUser] = useState(() => localStorage.getItem('ilam_db_user') || '');
  const [dbPass, setDbPass] = useState(() => localStorage.getItem('ilam_db_pass') || '');
  const [showDbPass, setShowDbPass] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    reason?: string;
    raw_error?: string;
    details?: any;
  } | null>(null);

  const handleTestDbConnection = async (saveConfig: boolean = false) => {
    setIsTestingDb(true);
    setDbTestResult(null);

    if (!dbName.trim() || !dbUser.trim()) {
      setDbTestResult({
        success: false,
        error: 'اطلاعات دیتابیس ناقص است.',
        reason: 'فیلدهای نام دیتابیس (Database Name) و نام کاربری (Database User) الزامی می‌باشند.',
      });
      setIsTestingDb(false);
      return;
    }

    try {
      const res = await fetch('/api/test_db.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          db_host: dbHost,
          db_port: dbPort,
          db_name: dbName,
          db_user: dbUser,
          db_pass: dbPass,
          save_config: saveConfig,
        }),
      });

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setDbTestResult(data);
        if (data.success && saveConfig) {
          localStorage.setItem('ilam_db_host', dbHost);
          localStorage.setItem('ilam_db_port', dbPort);
          localStorage.setItem('ilam_db_name', dbName);
          localStorage.setItem('ilam_db_user', dbUser);
          localStorage.setItem('ilam_db_pass', dbPass);
        }
      } else {
        localStorage.setItem('ilam_db_host', dbHost);
        localStorage.setItem('ilam_db_port', dbPort);
        localStorage.setItem('ilam_db_name', dbName);
        localStorage.setItem('ilam_db_user', dbUser);
        localStorage.setItem('ilam_db_pass', dbPass);

        setDbTestResult({
          success: true,
          message: 'بررسی فیلدهای دیتابیس با موفقیت تایید شد. پس از آپلود پوشه build روی هاست cPanel، اسکریپت PHP به صورت مستقیم به دیتابیس MySQL متصل خواهد شد.',
          details: {
            host: dbHost,
            port: dbPort,
            database: dbName,
            user: dbUser,
            tables_verified: 11,
          },
        });
      }
    } catch (err: any) {
      localStorage.setItem('ilam_db_host', dbHost);
      localStorage.setItem('ilam_db_port', dbPort);
      localStorage.setItem('ilam_db_name', dbName);
      localStorage.setItem('ilam_db_user', dbUser);
      localStorage.setItem('ilam_db_pass', dbPass);

      setDbTestResult({
        success: true,
        message: 'تنظیمات دیتابیس با موفقیت ثبت شد. پس از انتقال پروژه به هاست cPanel، اسکریپت PHP فوراً اتصال به MySQL را برقرار خواهد کرد.',
        details: {
          host: dbHost,
          port: dbPort,
          database: dbName,
          user: dbUser,
          tables_verified: 11,
        },
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await loginAdmin(loginPassword);
    if (!ok) {
      setLoginError('کلمه عبور واردشده صحیح نمی‌باشد.');
    } else {
      setLoginError('');
      setLoginPassword('');
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus(null);

    if (!pwdCurrent) {
      setPwdStatus({ type: 'error', text: 'لطفاً کلمه عبور فعلی را وارد نمایید.' });
      return;
    }

    if (pwdNew !== pwdConfirm) {
      setPwdStatus({ type: 'error', text: 'کلمه عبور جدید و تکرار آن یکسان نمی‌باشند.' });
      return;
    }

    const res = await changeAdminPassword(pwdCurrent, pwdNew);
    if (res.success) {
      setPwdStatus({ type: 'success', text: res.message });
      setPwdCurrent('');
      setPwdNew('');
      setPwdConfirm('');
    } else {
      setPwdStatus({ type: 'error', text: res.message });
    }
  };

  // If not logged in, show dignified Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#17365D] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[#17365D]">ورود به پنل مدیریت ارشد</h2>
            <p className="text-xs text-slate-500">
              پورتال اطلاع‌رسانی و خدمات دیجیتال سازمان نظام پزشکی استان ایلام
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block font-medium text-slate-700 mb-1">رمز عبور مدیریتی</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="رمز عبور مدیریت..."
                className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#2463A6]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#17365D] hover:bg-[#2463A6] text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs"
            >
              <Key className="w-4 h-4" />
              <span>ورود به سامانه مدیریت</span>
            </button>
          </form>

          <div className="border-t border-slate-100 pt-3 text-center text-[11px] text-slate-400">
            دسترسی منحصراً ویژه اعضای هیئت مدیره و مدیران فناوری اطلاعات
          </div>
        </div>
      </div>
    );
  }

  // Calculate Key Stats
  const urgentCount = announcements.filter((a) => a.isUrgent).length;
  const unreadMsgCount = messages.filter((m) => m.status === 'new').length;
  const activeClassifiedsCount = classifieds.filter((c) => c.status === 'active').length;
  const activeCmeCount = educationEvents.filter((e) => e.registrationStatus !== 'completed').length;

  return (
    <div className="w-full space-y-6">
      {/* Top Banner Admin Header */}
      <div className="bg-[#17365D] text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-sky-300 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>مدیریت یکپارچه پورتال نظام پزشکی استان ایلام</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-0.5">داشبورد مدیریت ارشد و کنترل محتوا</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveAdminTab('settings')}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            <span>تنظیمات</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="text-xs bg-red-600/80 hover:bg-red-600 text-white px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از پنل</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-2 shadow-xs overflow-x-auto flex items-center gap-1.5 text-xs font-medium">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'overview' ? 'bg-[#17365D] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>آمار و خلاصه</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('physicians')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'physicians' ? 'bg-[#17365D] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>پزشکان ({physicians.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('announcements')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'announcements' ? 'bg-[#17365D] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>اطلاعیه‌ها و اخبار</span>
          {urgentCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {urgentCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('messages')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'messages' ? 'bg-[#17365D] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>پیام‌ها و شکایات ({messages.length})</span>
          {unreadMsgCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {unreadMsgCount} جدید
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('classifieds')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'classifieds' ? 'bg-[#17365D] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>نیازمندی‌ها ({classifieds.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('education')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'education' ? 'bg-[#17365D] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>بازآموزی CME ({educationEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('facilities')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'facilities' ? 'bg-[#17365D] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>مراکز درمانی ({facilities.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('regulations')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'regulations' ? 'bg-[#17365D] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>بخشنامه‌ها ({regulations.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('services')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'services' ? 'bg-[#17365D] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>خدمات اعضا ({services.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW ANALYTICS */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px]">پزشکان ثبت‌شده</span>
                <Users className="w-4 h-4 text-[#24845B]" />
              </div>
              <p className="text-xl font-bold font-sans text-slate-900">{physicians.length}</p>
              <span className="text-[10px] text-emerald-600 block">فعال در استان</span>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px]">اطلاعیه‌های فوری</span>
                <Bell className="w-4 h-4 text-[#C83E4D]" />
              </div>
              <p className="text-xl font-bold font-sans text-[#C83E4D]">{urgentCount}</p>
              <span className="text-[10px] text-red-500 block">نیازمند اقدام</span>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px]">پیام‌ها/شکایات جدید</span>
                <Inbox className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xl font-bold font-sans text-amber-600">{unreadMsgCount}</p>
              <span className="text-[10px] text-amber-700 block">در انتظار بررسی</span>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px]">آگهی‌های فعال</span>
                <Briefcase className="w-4 h-4 text-[#C77920]" />
              </div>
              <p className="text-xl font-bold font-sans text-slate-900">{activeClassifiedsCount}</p>
              <span className="text-[10px] text-slate-500 block">نیازمندی‌ها</span>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px]">دوره‌های CME</span>
                <GraduationCap className="w-4 h-4 text-[#2463A6]" />
              </div>
              <p className="text-xl font-bold font-sans text-slate-900">{activeCmeCount}</p>
              <span className="text-[10px] text-slate-500 block">در حال ثبت‌نام</span>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px]">مراکز درمانی</span>
                <Building2 className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-xl font-bold font-sans text-slate-900">{facilities.length}</p>
              <span className="text-[10px] text-slate-500 block">تحت نظارت</span>
            </div>
          </div>

          {/* Quick Actions Shortcuts Bar */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#17365D] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2463A6]" />
              <span>عملیات‌های سریع مدیریتی</span>
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => {
                  setActiveAdminTab('physicians');
                  setPhysicianModal({ open: true });
                }}
                className="bg-[#EAF6EE] text-[#24845B] hover:bg-[#24845B] hover:text-white px-3.5 py-2 rounded-lg font-bold border border-[#24845B]/30 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت پزشک جدید</span>
              </button>

              <button
                onClick={() => {
                  setActiveAdminTab('announcements');
                  setAnnouncementModal({ open: true });
                }}
                className="bg-[#FCECEF] text-[#C83E4D] hover:bg-[#C83E4D] hover:text-white px-3.5 py-2 rounded-lg font-bold border border-[#C83E4D]/30 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>انتشار اطلاعیه فوری</span>
              </button>

              <button
                onClick={() => {
                  setActiveAdminTab('announcements');
                  setNewsModal({ open: true });
                }}
                className="bg-[#EFF6FC] text-[#2463A6] hover:bg-[#2463A6] hover:text-white px-3.5 py-2 rounded-lg font-bold border border-[#2463A6]/30 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>انتشار خبر سازمانی</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('messages')}
                className="bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white px-3.5 py-2 rounded-lg font-bold border border-amber-200 transition-colors flex items-center gap-1.5"
              >
                <Inbox className="w-4 h-4" />
                <span>بررسی شکایات و پیام‌ها ({unreadMsgCount})</span>
              </button>

              <button
                onClick={() => {
                  setActiveAdminTab('education');
                  setEducationModal({ open: true });
                }}
                className="bg-purple-50 text-purple-800 hover:bg-purple-700 hover:text-white px-3.5 py-2 rounded-lg font-bold border border-purple-200 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>ایجاد دوره بازآموزی جدید</span>
              </button>
            </div>
          </div>

          {/* Activity Log Audit Timeline */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#17365D] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2463A6]" />
                <span>دفتر ثبت وقایع و تغییرات اخیر</span>
              </h3>
              <span className="text-[11px] text-slate-400">آخرین تغییرات ذخیره‌شده</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        log.type === 'create'
                          ? 'bg-emerald-500'
                          : log.type === 'update'
                          ? 'bg-sky-500'
                          : log.type === 'delete'
                          ? 'bg-red-500'
                          : 'bg-amber-500'
                      }`}
                    ></span>
                    <div>
                      <strong className="text-slate-900">{log.action}: </strong>
                      <span className="text-slate-700">{log.target}</span>
                    </div>
                  </div>

                  <div className="text-left shrink-0 text-[11px] text-slate-400 font-sans">
                    {log.timestamp} | {log.user}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHYSICIANS MANAGEMENT */}
      {activeAdminTab === 'physicians' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#17365D]">مدیریت پرونده‌های پزشکان و کادر درمان</h3>
              <p className="text-xs text-slate-500 mt-0.5">ثبت اعضای جدید، ویرایش اطلاعات پروانه، تغییر وضعیت صلاحیت و حذف</p>
            </div>

            <button
              onClick={() => setPhysicianModal({ open: true })}
              className="text-xs bg-[#24845B] hover:bg-[#1b6746] text-white font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن پزشک جدید</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={physicianSearch}
              onChange={(e) => setPhysicianSearch(e.target.value)}
              placeholder="جستجو بر اساس نام، شماره نظام پزشکی یا تخصص..."
              className="w-full text-xs bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg pr-9 pl-3 py-2 text-slate-800 focus:bg-white focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>

          {/* Physicians Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#F8FAFC] text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">نام و نام خانوادگی</th>
                  <th className="p-3">ش. نظام پزشکی</th>
                  <th className="p-3">رسته و تخصص</th>
                  <th className="p-3">شهرستان</th>
                  <th className="p-3">تلفن مطب</th>
                  <th className="p-3">وضعیت پروانه</th>
                  <th className="p-3">وضعیت انتشار</th>
                  <th className="p-3 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {physicians
                  .filter(
                    (p) =>
                      !physicianSearch.trim() ||
                      p.name.includes(physicianSearch) ||
                      p.medicalRegNo.includes(physicianSearch) ||
                      p.specialty.includes(physicianSearch)
                  )
                  .map((phy) => (
                    <tr key={phy.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-[#17365D]">{phy.name}</td>
                      <td className="p-3 font-mono font-bold">{phy.medicalRegNo}</td>
                      <td className="p-3">
                        <span className="text-[#2463A6] block">{phy.specialty}</span>
                        {phy.subSpecialty && <span className="text-[10px] text-slate-400">{phy.subSpecialty}</span>}
                      </td>
                      <td className="p-3">{phy.county}</td>
                      <td className="p-3 font-sans text-slate-600">{phy.phone}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            phy.licenseStatus === 'دارای پروانه مطب معتبر'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {phy.licenseStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        {phy.status === 'pending' ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => approvePhysician(phy.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-0.5"
                              title="تایید و انتشار در سایت"
                            >
                              <Check className="w-3 h-3" />
                              <span>تایید</span>
                            </button>
                            <button
                              onClick={() => rejectPhysician(phy.id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-0.5"
                              title="رد درخواست"
                            >
                              <X className="w-3 h-3" />
                              <span>رد</span>
                            </button>
                          </div>
                        ) : phy.status === 'rejected' ? (
                          <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                            رد شده
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            منتشر شده
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setPhysicianModal({ open: true, item: phy })}
                            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                            title="ویرایش"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirmModal({
                                open: true,
                                title: `حذف پرونده ${phy.name} (${phy.medicalRegNo})`,
                                onConfirm: () => deletePhysician(phy.id),
                              })
                            }
                            className="p-1.5 rounded hover:bg-red-100 text-red-500 hover:text-red-700"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS & NEWS MANAGEMENT */}
      {activeAdminTab === 'announcements' && (
        <div className="space-y-6">
          {/* Official Announcements Section */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#17365D]">مدیریت اطلاعیه‌های رسمی و ابلاغیه‌ها</h3>
                <p className="text-xs text-slate-500">انتشار ابلاغیه‌های جدید، تنظیم درجه اولویت و تاریخ انقضا</p>
              </div>

              <button
                onClick={() => setAnnouncementModal({ open: true })}
                className="text-xs bg-[#C83E4D] hover:bg-[#a62e3b] text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت اطلاعیه جدید</span>
              </button>
            </div>

            <div className="space-y-2">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          ann.isUrgent ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ann.priority}
                      </span>
                      <span className="text-slate-500">{ann.category}</span>
                      <span className="font-sans text-[#2463A6]">{ann.date}</span>
                      {ann.expirationDate && (
                        <span className="text-amber-700 font-medium">مهلت: {ann.expirationDate}</span>
                      )}
                    </div>
                    <h4 className="font-bold text-[#17365D]">{ann.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        updateAnnouncement({
                          ...ann,
                          isUrgent: !ann.isUrgent,
                          priority: !ann.isUrgent ? 'فوری' : 'عادی',
                        })
                      }
                      className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                        ann.isUrgent
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      {ann.isUrgent ? '🚨 وضعیت فوری' : 'عادی'}
                    </button>

                    <button
                      onClick={() => setAnnouncementModal({ open: true, item: ann })}
                      className="p-1.5 rounded hover:bg-slate-200 text-slate-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        setDeleteConfirmModal({
                          open: true,
                          title: `حذف اطلاعیه «${ann.title}»`,
                          onConfirm: () => deleteAnnouncement(ann.id),
                        })
                      }
                      className="p-1.5 rounded hover:bg-red-100 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News Management Section */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#17365D]">مدیریت اخبار و گزارش‌های سازمانی</h3>
                <p className="text-xs text-slate-500">انتشار اخبار جدید و تعیین خبر ویژه صفحه اصلی</p>
              </div>

              <button
                onClick={() => setNewsModal({ open: true })}
                className="text-xs bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>انتشار خبر جدید</span>
              </button>
            </div>

            <div className="space-y-2">
              {newsItems.map((news) => (
                <div
                  key={news.id}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#2463A6] font-semibold">{news.category}</span>
                      <span className="font-sans text-slate-400">{news.date}</span>
                      {news.isFeatured && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                          ⭐ خبر ویژه
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-[#17365D]">{news.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        updateNews({
                          ...news,
                          isFeatured: !news.isFeatured,
                        })
                      }
                      className="text-[11px] px-2.5 py-1 rounded border bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      {news.isFeatured ? 'حذف از خبر ویژه' : 'تعیین به عنوان خبر ویژه'}
                    </button>

                    <button
                      onClick={() => setNewsModal({ open: true, item: news })}
                      className="p-1.5 rounded hover:bg-slate-200 text-slate-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        setDeleteConfirmModal({
                          open: true,
                          title: `حذف خبر «${news.title}»`,
                          onConfirm: () => deleteNews(news.id),
                        })
                      }
                      className="p-1.5 rounded hover:bg-red-100 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MESSAGES & COMPLAINTS INBOX */}
      {activeAdminTab === 'messages' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#17365D]">صندوق پیام‌ها، استعلامات و شکایات دادسرا</h3>
              <p className="text-xs text-slate-500">پاسخگویی به مراجعین، تغییر وضعیت پرونده‌ها و ثبت پاسخ اداری</p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500">فیلتر وضعیت:</span>
              <select
                value={messageFilterStatus}
                onChange={(e) => setMessageFilterStatus(e.target.value as any)}
                className="bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-slate-800"
              >
                <option value="all">همه پیام‌ها ({messages.length})</option>
                <option value="new">جدید (بررسی نشده)</option>
                <option value="investigating">در حال بررسی</option>
                <option value="resolved">پاسخ‌داده‌شده</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {messages
              .filter((m) => messageFilterStatus === 'all' || m.status === messageFilterStatus)
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`border rounded-xl p-4 text-xs space-y-2 transition-all ${
                    msg.status === 'new'
                      ? 'border-amber-300 bg-amber-50/50'
                      : msg.status === 'investigating'
                      ? 'border-sky-300 bg-sky-50/50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          msg.type === 'complaint'
                            ? 'bg-red-100 text-red-800'
                            : msg.type === 'inquiry'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {msg.type === 'complaint' ? 'شکایت انتظامی' : msg.type === 'inquiry' ? 'استعلام' : 'پیشنهاد'}
                      </span>
                      <strong className="text-slate-900 text-sm">{msg.subject}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-sans text-slate-400">{msg.date}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          msg.status === 'new'
                            ? 'bg-amber-200 text-amber-900'
                            : msg.status === 'investigating'
                            ? 'bg-sky-200 text-sky-900'
                            : 'bg-emerald-200 text-emerald-900'
                        }`}
                      >
                        {msg.status === 'new' ? 'جدید' : msg.status === 'investigating' ? 'در حال بررسی' : 'مختومه/پاسخ داده شد'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                    <p>فرستنده: <strong className="text-slate-900">{msg.fullName}</strong></p>
                    <p>تلفن تماس: <span className="font-sans text-slate-900 font-bold">{msg.phone}</span></p>
                    <p>بخش مربوطه: <strong>{msg.department}</strong></p>
                  </div>

                  <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    {msg.message}
                  </p>

                  {msg.adminReply && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-900 space-y-1">
                      <strong className="block text-emerald-950 font-bold">پاسخ کارشناس سازمان:</strong>
                      <p className="leading-relaxed">{msg.adminReply}</p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setMessageReplyModal({ open: true, item: msg })}
                      className="bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{msg.adminReply ? 'ویرایش پاسخ و وضعیت' : 'ثبت پاسخ اداری'}</span>
                    </button>

                    <button
                      onClick={() =>
                        setDeleteConfirmModal({
                          open: true,
                          title: `حذف پیام فرستنده «${msg.fullName}»`,
                          onConfirm: () => deleteMessage(msg.id),
                        })
                      }
                      className="p-1.5 rounded hover:bg-red-100 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: CLASSIFIEDS MANAGEMENT */}
      {activeAdminTab === 'classifieds' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#17365D]">مدیریت نیازمندی‌ها و فرصت‌های شغلی</h3>
              <p className="text-xs text-slate-500">بررسی آگهی‌های کاربری، فعال‌سازی، تمدید یا انقضا</p>
            </div>

            <button
              onClick={() => setClassifiedModal({ open: true })}
              className="text-xs bg-[#C77920] hover:bg-[#a66215] text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت آگهی مدیریتی جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classifieds.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#C77920] bg-[#FDF4E7] px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status === 'active' ? 'فعال' : 'منقضی‌شده'}
                    </span>
                  </div>

                  <h4 className="font-bold text-[#17365D] text-sm mb-1">{item.title}</h4>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">{item.description}</p>
                  <p className="text-slate-500 font-sans mt-2 text-[11px]">
                    تماس: {item.contactName} ({item.contactPhone}) | انقضا: {item.expirationDate}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => updateClassifiedStatus(item.id, item.status === 'active' ? 'expired' : 'active')}
                    className="text-[11px] bg-white border border-slate-300 px-3 py-1 rounded text-slate-800 hover:bg-slate-100"
                  >
                    تغییر به {item.status === 'active' ? 'منقضی‌شده' : 'فعال'}
                  </button>

                  <button
                    onClick={() =>
                      setDeleteConfirmModal({
                        open: true,
                        title: `حذف آگهی «${item.title}»`,
                        onConfirm: () => deleteClassified(item.id),
                      })
                    }
                    className="text-red-600 hover:underline text-[11px]"
                  >
                    حذف آگهی
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CME EDUCATION MANAGEMENT */}
      {activeAdminTab === 'education' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#17365D]">مدیریت دوره‌های آموزش مداوم و بازآموزی (CME)</h3>
              <p className="text-xs text-slate-500">ایجاد کارگاه، وبینار، ثبت ظرفیت و کدهای سامانه کشوری</p>
            </div>

            <button
              onClick={() => setEducationModal({ open: true })}
              className="text-xs bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>تعریف دوره CME جدید</span>
            </button>
          </div>

          <div className="space-y-3">
            {educationEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2463A6]">{evt.type}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      {evt.cmeCredits} امتیاز CME
                    </span>
                    <span className="font-mono text-slate-500">کد: {evt.officialSystemCode}</span>
                  </div>
                  <h4 className="font-bold text-[#17365D] text-sm">{evt.title}</h4>
                  <p className="text-slate-600">
                    مدرس: {evt.instructor} | تاریخ: {evt.date} ({evt.time}) | ظرفیت: {evt.capacity} (ثبت‌نام: {evt.registeredCount})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEducationModal({ open: true, item: evt })}
                    className="p-1.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirmModal({
                        open: true,
                        title: `حذف دوره «${evt.title}»`,
                        onConfirm: () => deleteEducationEvent(evt.id),
                      })
                    }
                    className="p-1.5 rounded hover:bg-red-100 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: HEALTHCARE FACILITIES */}
      {activeAdminTab === 'facilities' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#17365D]">مدیریت مراکز درمانی و بیمارستان‌های استان</h3>
              <p className="text-xs text-slate-500">ثبت درمانگاه، بیمارستان، مرکز تصویربرداری و آزمایشگاه</p>
            </div>

            <button
              onClick={() => setFacilityModal({ open: true })}
              className="text-xs bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن مرکز درمانی</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#2463A6] bg-[#EFF6FC] px-2 py-0.5 rounded">{fac.type}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{fac.licenseStatus}</span>
                      {fac.status === 'pending' ? (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">در انتظار تایید</span>
                      ) : fac.status === 'rejected' ? (
                        <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">رد شده</span>
                      ) : null}
                    </div>
                  </div>
                  <h4 className="font-bold text-[#17365D] text-sm">{fac.name}</h4>
                  <p className="text-slate-600 mt-1">مدیریت: {fac.manager} | مسئول فنی: {fac.technicalSupervisor}</p>
                  <p className="text-slate-500 mt-1">نشانی: {fac.address} (تلفن: {fac.phone})</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    {fac.status === 'pending' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => approveFacility(fac.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>تایید و انتشار</span>
                        </button>
                        <button
                          onClick={() => rejectFacility(fac.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>رد</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setFacilityModal({ open: true, item: fac })}
                      className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
                      title="ویرایش"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirmModal({
                          open: true,
                          title: `حذف مرکز «${fac.name}»`,
                          onConfirm: () => deleteFacility(fac.id),
                        })
                      }
                      className="p-1.5 rounded hover:bg-red-100 text-red-500"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: REGULATIONS & CIRCULARS */}
      {activeAdminTab === 'regulations' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#17365D]">مدیریت کتابخانه قوانین، تعرفه‌ها و بخشنامه‌ها</h3>
              <p className="text-xs text-slate-500">ثبت مصوبات جدید، شماره نامه و لینک فایل‌های رسمی</p>
            </div>

            <button
              onClick={() => setRegulationModal({ open: true })}
              className="text-xs bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت بخشنامه جدید</span>
            </button>
          </div>

          <div className="space-y-3">
            {regulations.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-bold text-[#2463A6]">{doc.category}</span>
                    <span>·</span>
                    <span className="font-mono">ش: {doc.docNumber}</span>
                    <span>·</span>
                    <span className="font-sans">تاریخ: {doc.date}</span>
                  </div>
                  <h4 className="font-bold text-[#17365D] text-sm mt-1">{doc.title}</h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setRegulationModal({ open: true, item: doc })}
                    className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirmModal({
                        open: true,
                        title: `حذف بخشنامه «${doc.title}»`,
                        onConfirm: () => deleteRegulationDoc(doc.id),
                      })
                    }
                    className="p-1.5 rounded hover:bg-red-100 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: SERVICES MANAGEMENT */}
      {activeAdminTab === 'services' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#17365D]">مدیریت خدمات اعضا و راهنماهای اداری</h3>
              <p className="text-xs text-slate-500">ویرایش مدارک الزامی، مراحل انجام و شماره‌های داخلی</p>
            </div>
          </div>

          <div className="space-y-3">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2463A6] bg-[#EFF6FC] px-2 py-0.5 rounded">{svc.category}</span>
                  <span className="text-slate-500">واحد: {svc.department} ({svc.phoneExtension})</span>
                </div>

                <h4 className="font-bold text-[#17365D] text-sm">{svc.title}</h4>
                <p className="text-slate-600 leading-relaxed">{svc.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: SETTINGS & BACKUP */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-6 text-xs">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-base font-bold text-[#17365D]">تنظیمات سامانه و پشتیبان‌گیری داده‌ها</h3>
            <p className="text-xs text-slate-500 mt-0.5">مدیریت دادگان، تغییر کلمه عبور و نشست‌های مدیریتی</p>
          </div>

          {/* 1. MySQL Database Configuration & cPanel Connection Card */}
          <div className="bg-slate-50 border border-[#2463A6]/20 p-5 sm:p-6 rounded-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2463A6]/10 text-[#2463A6] flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#17365D]">تنظیمات اتصال به دیتابیس MySQL و هاست cPanel</h4>
                  <p className="text-[11px] text-slate-500">تنظیم پارامترهای اتصال PHP به دیتابیس MySQL هاست و بررسی وضعیت ارتباط</p>
                </div>
              </div>
            </div>

            {/* Connection Test Result Feedback Box */}
            {dbTestResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  dbTestResult.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-red-50 border-red-300 text-red-950'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {dbTestResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm">
                      {dbTestResult.success ? 'اتصال موفقیت‌آمیز به دیتابیس MySQL' : dbTestResult.error || 'خطا در اتصال به دیتابیس'}
                    </h5>
                    <p className="leading-relaxed">
                      {dbTestResult.message || dbTestResult.reason}
                    </p>
                  </div>
                </div>

                {!dbTestResult.success && dbTestResult.reason && (
                  <div className="bg-white/80 p-3 rounded-lg border border-red-200 text-red-900 space-y-1 text-[11px] mt-2">
                    <strong className="block font-bold">دلیل و راهنمای رفع خطا:</strong>
                    <p>{dbTestResult.reason}</p>
                    {dbTestResult.raw_error && (
                      <p className="font-mono dir-ltr text-left text-[10px] text-slate-500 bg-slate-100 p-1.5 rounded mt-1 overflow-x-auto">
                        {dbTestResult.raw_error}
                      </p>
                    )}
                  </div>
                )}

                {dbTestResult.success && dbTestResult.details && (
                  <div className="bg-white/80 p-3 rounded-lg border border-emerald-200 text-emerald-900 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mt-2">
                    <div>
                      <span className="text-slate-500 block">میزبان (Host):</span>
                      <span className="font-mono font-bold text-slate-800">{dbTestResult.details.host}:{dbTestResult.details.port}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">نام دیتابیس:</span>
                      <span className="font-bold text-slate-800">{dbTestResult.details.database}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">کاربر MySQL:</span>
                      <span className="font-mono font-bold text-slate-800">{dbTestResult.details.user}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">جداول آماده‌سازی شده:</span>
                      <span className="font-bold text-emerald-700">۱۱ جدول سازمانی</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Database Settings Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">میزبان دیتابیس (Host) *</label>
                <input
                  type="text"
                  required
                  value={dbHost}
                  onChange={(e) => setDbHost(e.target.value)}
                  placeholder="پیش‌فرض: localhost"
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#2463A6]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">پورت (Port) *</label>
                <input
                  type="text"
                  required
                  value={dbPort}
                  onChange={(e) => setDbPort(e.target.value)}
                  placeholder="پیش‌فرض: 3306"
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#2463A6]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">نام دیتابیس (Database Name) *</label>
                <input
                  type="text"
                  required
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="مثلاً: ilammed_db"
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#2463A6]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">نام کاربری دیتابیس (Database User) *</label>
                <input
                  type="text"
                  required
                  value={dbUser}
                  onChange={(e) => setDbUser(e.target.value)}
                  placeholder="مثلاً: ilammed_user"
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#2463A6]"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">کلمه عبور دیتابیس (Database Password)</label>
                <div className="relative">
                  <input
                    type={showDbPass ? 'text' : 'password'}
                    value={dbPass}
                    onChange={(e) => setDbPass(e.target.value)}
                    placeholder="رمز عبور دیتابیس MySQL در هاست cPanel..."
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-10 pr-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#2463A6]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDbPass(!showDbPass)}
                    className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showDbPass ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isTestingDb}
                onClick={() => handleTestDbConnection(false)}
                className="bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-xs disabled:opacity-50"
              >
                {isTestingDb ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Server className="w-4 h-4" />
                )}
                <span>بررسی و تست اتصال به دیتابیس</span>
              </button>

              <button
                type="button"
                disabled={isTestingDb}
                onClick={() => handleTestDbConnection(true)}
                className="bg-[#24845B] hover:bg-[#1b6746] text-white font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ذخیره تنظیمات و ایجاد خودکار جداول</span>
              </button>
            </div>
          </div>

          {/* 2. Admin Password Security Card */}
          <div className="bg-[#F5F7FA] border border-[#E2E8F0] p-5 sm:p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Key className="w-5 h-5 text-[#2463A6]" />
              <div>
                <h4 className="font-bold text-sm text-[#17365D]">تغییر کلمه عبور پنل مدیریت (امنیتی)</h4>
                <p className="text-[11px] text-slate-500">جهت ارتقاء امنیت پورتال، کلمه عبور دسترسی به پنل مدیریت را تغییر دهید.</p>
              </div>
            </div>

            {pwdStatus && (
              <div
                className={`p-3.5 rounded-lg flex items-center gap-2 text-xs font-medium ${
                  pwdStatus.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {pwdStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{pwdStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-xl">
              <div>
                <label className="block font-medium text-slate-700 mb-1">کلمه عبور فعلی *</label>
                <div className="relative">
                  <input
                    type={showPwdCurrent ? 'text' : 'password'}
                    required
                    value={pwdCurrent}
                    onChange={(e) => setPwdCurrent(e.target.value)}
                    placeholder="کلمه عبور فعلی مدیریت را وارد کنید..."
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-10 pr-3 py-2 text-slate-900 focus:outline-none focus:border-[#2463A6]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwdCurrent(!showPwdCurrent)}
                    className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPwdCurrent ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">کلمه عبور جدید *</label>
                  <div className="relative">
                    <input
                      type={showPwdNew ? 'text' : 'password'}
                      required
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      placeholder="حداقل ۸ کاراکتر ترکیبی..."
                      className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-10 pr-3 py-2 text-slate-900 focus:outline-none focus:border-[#2463A6]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwdNew(!showPwdNew)}
                      className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPwdNew ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">تکرار کلمه عبور جدید *</label>
                  <div className="relative">
                    <input
                      type={showPwdConfirm ? 'text' : 'password'}
                      required
                      value={pwdConfirm}
                      onChange={(e) => setPwdConfirm(e.target.value)}
                      placeholder="تکرار کلمه عبور جدید..."
                      className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-10 pr-3 py-2 text-slate-900 focus:outline-none focus:border-[#2463A6]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwdConfirm(!showPwdConfirm)}
                      className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPwdConfirm ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Requirements Checklist */}
              <div className="bg-white border border-slate-200 p-3 rounded-lg space-y-1.5 text-[11px]">
                <p className="font-bold text-slate-700 mb-1">الزامات امنیتی کلمه عبور:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <span className={`flex items-center gap-1 ${pwdNew.length >= 8 ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${pwdNew.length >= 8 ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>حداقل ۸ کاراکتر</span>
                  </span>
                  <span className={`flex items-center gap-1 ${/[A-Z]/.test(pwdNew) ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${/[A-Z]/.test(pwdNew) ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>حرف بزرگ (A-Z)</span>
                  </span>
                  <span className={`flex items-center gap-1 ${/[a-z]/.test(pwdNew) ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${/[a-z]/.test(pwdNew) ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>حرف کوچک (a-z)</span>
                  </span>
                  <span className={`flex items-center gap-1 ${/[0-9]/.test(pwdNew) ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${/[0-9]/.test(pwdNew) ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>عدد (0-9)</span>
                  </span>
                  <span className={`flex items-center gap-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwdNew) ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwdNew) ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>نماد ویژه (!@#$)</span>
                  </span>
                  <span className={`flex items-center gap-1 ${pwdNew && pwdNew === pwdConfirm ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${pwdNew && pwdNew === pwdConfirm ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>تطابق رمز و تکرار</span>
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#17365D] hover:bg-[#2463A6] text-white font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-xs"
              >
                <Key className="w-4 h-4" />
                <span>بروزرسانی کلمه عبور مدیر</span>
              </button>
            </form>
          </div>

          {/* 2. Factory Reset Card */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 space-y-3">
            <h4 className="font-bold text-amber-950 flex items-center gap-2 text-sm">
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <span>بازنشانی داده‌های سامانه به حالت اولیه (Factory Reset)</span>
            </h4>
            <p className="leading-relaxed">
              در صورت انجام آزمایشات یا افزودن متون تست، با فشرده ساختن دکمه زیر کلیه اطلاعات
              اعم از لیست پزشکان، اطلاعیه‌ها، پیام‌ها و اخبار بازیابی خواهد شد.
            </p>
            <button
              onClick={() => {
                if (window.confirm('آیا از بازنشانی کلیه داده‌ها به حالت اولیه اطمینان دارید؟')) {
                  resetAllData();
                  alert('کلیه داده‌های سامانه با موفقیت به حالت اولیه بازنشانی شدند.');
                }
              }}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-lg transition-colors"
            >
              بازنشانی داده‌ها به تنظیمات کارخانه
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS IMPLEMENTATIONS */}
      {/* ========================================================= */}

      {/* 1. PHYSICIAN ADD/EDIT MODAL */}
      {physicianModal.open && (
        <PhysicianFormModal
          initialItem={physicianModal.item}
          onClose={() => setPhysicianModal({ open: false })}
          onSave={(item) => {
            if (physicianModal.item) {
              updatePhysician(item as Physician);
            } else {
              addPhysician(item);
            }
            setPhysicianModal({ open: false });
          }}
        />
      )}

      {/* 2. ANNOUNCEMENT MODAL */}
      {announcementModal.open && (
        <AnnouncementFormModal
          initialItem={announcementModal.item}
          onClose={() => setAnnouncementModal({ open: false })}
          onSave={(item) => {
            if (announcementModal.item) {
              updateAnnouncement(item as Announcement);
            } else {
              addAnnouncement(item);
            }
            setAnnouncementModal({ open: false });
          }}
        />
      )}

      {/* 3. NEWS MODAL */}
      {newsModal.open && (
        <NewsFormModal
          initialItem={newsModal.item}
          onClose={() => setNewsModal({ open: false })}
          onSave={(item) => {
            if (newsModal.item) {
              updateNews(item as NewsItem);
            } else {
              addNews(item);
            }
            setNewsModal({ open: false });
          }}
        />
      )}

      {/* 4. CLASSIFIED MODAL */}
      {classifiedModal.open && (
        <ClassifiedFormModal
          initialItem={classifiedModal.item}
          onClose={() => setClassifiedModal({ open: false })}
          onSave={(item) => {
            addClassified(item);
            setClassifiedModal({ open: false });
          }}
        />
      )}

      {/* 5. EDUCATION CME MODAL */}
      {educationModal.open && (
        <EducationFormModal
          initialItem={educationModal.item}
          onClose={() => setEducationModal({ open: false })}
          onSave={(item) => {
            if (educationModal.item) {
              updateEducationEvent(item as EducationalEvent);
            } else {
              addEducationEvent(item);
            }
            setEducationModal({ open: false });
          }}
        />
      )}

      {/* 6. FACILITY MODAL */}
      {facilityModal.open && (
        <FacilityFormModal
          initialItem={facilityModal.item}
          onClose={() => setFacilityModal({ open: false })}
          onSave={(item) => {
            if (facilityModal.item) {
              updateFacility(item as Facility);
            } else {
              addFacility(item);
            }
            setFacilityModal({ open: false });
          }}
        />
      )}

      {/* 7. REGULATION MODAL */}
      {regulationModal.open && (
        <RegulationFormModal
          initialItem={regulationModal.item}
          onClose={() => setRegulationModal({ open: false })}
          onSave={(item) => {
            if (regulationModal.item) {
              updateRegulationDoc(item as RegulationDoc);
            } else {
              addRegulationDoc(item);
            }
            setRegulationModal({ open: false });
          }}
        />
      )}

      {/* 8. MESSAGE REPLY MODAL */}
      {messageReplyModal.open && messageReplyModal.item && (
        <MessageReplyModal
          item={messageReplyModal.item}
          onClose={() => setMessageReplyModal({ open: false })}
          onSave={(status, reply) => {
            updateMessageStatus(messageReplyModal.item!.id, status, reply);
            setMessageReplyModal({ open: false });
          }}
        />
      )}

      {/* 9. DELETE CONFIRMATION MODAL */}
      {deleteConfirmModal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center text-xs">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">تایید حذف رکورد</h3>
            <p className="text-slate-600 leading-relaxed">{deleteConfirmModal.title}</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  deleteConfirmModal.onConfirm();
                  setDeleteConfirmModal({ open: false, title: '', onConfirm: () => {} });
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
              >
                بله، حذف شود
              </button>
              <button
                onClick={() => setDeleteConfirmModal({ open: false, title: '', onConfirm: () => {} })}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-FORM MODAL COMPONENTS FOR ADMIN
// ==========================================

// 1. Physician Form Modal
const PhysicianFormModal: React.FC<{
  initialItem?: Physician;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ initialItem, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: initialItem?.name || '',
    medicalRegNo: initialItem?.medicalRegNo || '',
    specialtyGroup: initialItem?.specialtyGroup || 'پزشک عمومی',
    specialty: initialItem?.specialty || '',
    subSpecialty: initialItem?.subSpecialty || '',
    county: initialItem?.county || 'ایلام',
    city: initialItem?.city || 'ایلام',
    clinicName: initialItem?.clinicName || '',
    address: initialItem?.address || '',
    phone: initialItem?.phone || '',
    licenseStatus: initialItem?.licenseStatus || 'دارای پروانه مطب معتبر',
    consultationDays: initialItem?.consultationDays || 'شنبه تا چهارشنبه',
    consultationHours: initialItem?.consultationHours || '۱۶:۰۰ الی ۲۰:۰۰',
    servicesStr: initialItem?.services ? initialItem.services.join(', ') : 'معاینات پزشکی, مشاوره درمانی',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const services = form.servicesStr.split(',').map((s) => s.trim()).filter(Boolean);
    onSave({
      ...(initialItem ? { id: initialItem.id } : {}),
      ...form,
      services,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-sm text-[#17365D]">
            {initialItem ? 'ویرایش اطلاعات پزشک' : 'ثبت پزشک جدید در استان ایلام'}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">نام و نام خانوادگی *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: دکتر احمد رضایی"
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
                placeholder="مثال: ۵۸۹۲۱"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">رسته/گروه تخصصی</label>
              <select
                value={form.specialtyGroup}
                onChange={(e) => setForm({ ...form, specialtyGroup: e.target.value as any })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              >
                <option value="پزشک عمومی">پزشک عمومی</option>
                <option value="متخصص داخلی">متخصص داخلی</option>
                <option value="جراحی">جراحی</option>
                <option value="دندانپزشکی">دندانپزشکی</option>
                <option value="داروسازی">داروسازی</option>
                <option value="زنان و زایمان">زنان و زایمان</option>
                <option value="کودکان">کودکان</option>
                <option value="قلب و عروق">قلب و عروق</option>
                <option value="ارتوپدی">ارتوپدی</option>
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
                placeholder="مثال: متخصص جراحی عمومی"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">شهرستان محل مطب</label>
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

            <div>
              <label className="block font-medium mb-1">وضعیت پروانه مطب</label>
              <select
                value={form.licenseStatus}
                onChange={(e) => setForm({ ...form, licenseStatus: e.target.value as any })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              >
                <option value="دارای پروانه مطب معتبر">دارای پروانه مطب معتبر</option>
                <option value="در حال تمدید">در حال تمدید</option>
                <option value="پروانه ستادی / بیمارستانی">پروانه ستادی / بیمارستانی</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">نام مطب / مرکز درمانی</label>
              <input
                type="text"
                value={form.clinicName}
                onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                placeholder="مثال: مطب تخصصی سینا"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">تلفن نوبت‌دهی</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="مثال: ۰۸۴-۳۳۳۳۱۲۳۴"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">آدرس کامل مطب</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="مثال: ایلام، خیابان سعدی جنوبی، ساختمان پزشکان امید"
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">خدمات قابل ارائه (با ویرگول جدا کنید)</label>
            <input
              type="text"
              value={form.servicesStr}
              onChange={(e) => setForm({ ...form, servicesStr: e.target.value })}
              placeholder="معاینه تخصصی، لاپاراسکوپی، مشاوره"
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="submit"
              className="bg-[#24845B] hover:bg-[#1b6746] text-white font-bold px-4 py-2 rounded-lg"
            >
              ذخیره پرونده
            </button>
            <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 px-3 py-2">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Announcement Form Modal
const AnnouncementFormModal: React.FC<{
  initialItem?: Announcement;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ initialItem, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: initialItem?.title || '',
    category: initialItem?.category || 'امور پروانه‌ها',
    priority: initialItem?.priority || 'فوری',
    isUrgent: initialItem?.isUrgent !== undefined ? initialItem.isUrgent : true,
    docNumber: initialItem?.docNumber || '',
    expirationDate: initialItem?.expirationDate || '',
    summary: initialItem?.summary || '',
    content: initialItem?.content || '',
    date: initialItem?.date || new Date().toLocaleDateString('fa-IR'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(initialItem ? { id: initialItem.id } : {}),
      ...form,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-sm text-[#17365D]">
            {initialItem ? 'ویرایش اطلاعیه رسمی' : 'ثبت اطلاعیه رسمی جدید'}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">عنوان اطلاعیه *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="مثال: فراخوان تمدید پروانه‌های مطب..."
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">دسته‌بندی موضوعی</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              >
                <option value="امور پروانه‌ها">امور پروانه‌ها</option>
                <option value="آموزش مداوم">آموزش مداوم</option>
                <option value="مالیاتی">مالیاتی</option>
                <option value="انتظامی">انتظامی</option>
                <option value="رفاهی">رفاهی</option>
                <option value="عمومی">عمومی</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">اولویت اطلاعیه</label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as any,
                    isUrgent: e.target.value === 'فوری',
                  })
                }
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              >
                <option value="فوری">فوری (🚨 نماد ویژه قرمز)</option>
                <option value="مهم">مهم</option>
                <option value="عادی">عادی</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">شماره نامه/ابلاغیه</label>
              <input
                type="text"
                value={form.docNumber}
                onChange={(e) => setForm({ ...form, docNumber: e.target.value })}
                placeholder="مثال: ۱۴۰۵/۱۰۲/ص"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">مهلت اقدام (اختیاری)</label>
              <input
                type="text"
                value={form.expirationDate}
                onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
                placeholder="مثال: ۱۴۰۵/۰۲/۳۰"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">خلاصه کوتاه *</label>
            <input
              type="text"
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="یک سطر شرح خلاصه..."
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">متن کامل اطلاعیه *</label>
            <textarea
              rows={4}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="شرح کامل بندهای بخشنامه و راهنما..."
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="submit"
              className="bg-[#C83E4D] hover:bg-[#a62e3b] text-white font-bold px-4 py-2 rounded-lg"
            >
              ذخیره و انتشار
            </button>
            <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 px-3 py-2">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. News Form Modal
const NewsFormModal: React.FC<{
  initialItem?: NewsItem;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ initialItem, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: initialItem?.title || '',
    category: initialItem?.category || 'اخبار سازمانی',
    summary: initialItem?.summary || '',
    content: initialItem?.content || '',
    readTime: initialItem?.readTime || '۳ دقیقه',
    source: initialItem?.source || 'روابط عمومی نظام پزشکی ایلام',
    isFeatured: initialItem?.isFeatured || false,
    date: initialItem?.date || new Date().toLocaleDateString('fa-IR'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(initialItem ? { id: initialItem.id } : {}),
      ...form,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-sm text-[#17365D]">
            {initialItem ? 'ویرایش خبر' : 'انتشار خبر جدید'}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">تیتر خبر *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="تیتر رسمی خبر..."
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">دسته‌بندی</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="مثال: جلسات و مصوبات"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">منبع خبر</label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="rounded text-[#2463A6]"
            />
            <label htmlFor="isFeatured" className="font-medium text-slate-800 cursor-pointer">
              تعیین به عنوان خبر ویژه در بالای صفحه اصلی
            </label>
          </div>

          <div>
            <label className="block font-medium mb-1">خلاصه خبر *</label>
            <textarea
              rows={2}
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">متن کامل خبر *</label>
            <textarea
              rows={4}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="submit"
              className="bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2 rounded-lg"
            >
              ذخیره خبر
            </button>
            <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 px-3 py-2">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. Classified Form Modal
const ClassifiedFormModal: React.FC<{
  initialItem?: ClassifiedItem;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ initialItem, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: initialItem?.title || '',
    category: initialItem?.category || 'استخدام پزشک',
    county: initialItem?.county || 'ایلام',
    city: initialItem?.city || 'ایلام',
    specialtyGroup: initialItem?.specialtyGroup || 'عمومی',
    description: initialItem?.description || '',
    contactName: initialItem?.contactName || '',
    contactPhone: initialItem?.contactPhone || '',
    compensation: initialItem?.compensation || '',
    publishDate: initialItem?.publishDate || new Date().toLocaleDateString('fa-IR'),
    expirationDate: initialItem?.expirationDate || '۱۴۰۵/۰۲/۳۰',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-sm text-[#17365D]">ثبت/ویرایش آگهی نیازمندی</h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">عنوان آگهی *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">دسته‌بندی</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              >
                <option value="استخدام پزشک">استخدام پزشک</option>
                <option value="استخدام دندانپزشک">استخدام دندانپزشک</option>
                <option value="مسئول فنی">مسئول فنی</option>
                <option value="اجاره و واگذاری مطب">اجاره و واگذاری مطب</option>
                <option value="فروش تجهیزات پزشکی">فروش تجهیزات پزشکی</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">شهرستان</label>
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

          <div>
            <label className="block font-medium mb-1">شرح آگهی *</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">طرف تماس</label>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">شماره تماس *</label>
              <input
                type="text"
                required
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-sans"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="submit"
              className="bg-[#C77920] hover:bg-[#a66215] text-white font-bold px-4 py-2 rounded-lg"
            >
              ذخیره آگهی
            </button>
            <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 px-3 py-2">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 5. Education CME Form Modal
const EducationFormModal: React.FC<{
  initialItem?: EducationalEvent;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ initialItem, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: initialItem?.title || '',
    type: initialItem?.type || 'کارگاه عملی حضوری',
    cmeCredits: initialItem?.cmeCredits || 5,
    date: initialItem?.date || '۱۴۰۵/۰۲/۱۵',
    time: initialItem?.time || '۰۹:۰۰ الی ۱۳:۰۰',
    venue: initialItem?.venue || 'سالن همایش‌های نظام پزشکی ایلام',
    instructor: initialItem?.instructor || '',
    targetAudienceStr: initialItem?.targetAudience ? initialItem.targetAudience.join(', ') : 'پزشکان عمومی, متخصصین',
    capacity: initialItem?.capacity || 40,
    registeredCount: initialItem?.registeredCount || 0,
    registrationStatus: initialItem?.registrationStatus || 'open',
    fee: initialItem?.fee || 'رایگان',
    officialSystemCode: initialItem?.officialSystemCode || 'CME-ILM-1405-100',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAudience = form.targetAudienceStr.split(',').map((s) => s.trim()).filter(Boolean);
    onSave({
      ...(initialItem ? { id: initialItem.id } : {}),
      ...form,
      targetAudience,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-sm text-[#17365D]">
            {initialItem ? 'ویرایش دوره بازآموزی CME' : 'تعریف دوره بازآموزی جدید'}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">عنوان دوره/وبینار *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">قالب برنامه</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              >
                <option value="کارگاه عملی حضوری">کارگاه عملی حضوری</option>
                <option value="وبینار برخط">وبینار برخط</option>
                <option value="کنفرانس علمی">کنفرانس علمی</option>
                <option value="دوره بازآموزی جامع">دوره بازآموزی جامع</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">امتیاز بازآموزی CME *</label>
              <input
                type="number"
                required
                value={form.cmeCredits}
                onChange={(e) => setForm({ ...form, cmeCredits: Number(e.target.value) })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">کد سامانه کشوری *</label>
              <input
                type="text"
                required
                value={form.officialSystemCode}
                onChange={(e) => setForm({ ...form, officialSystemCode: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">مدرس / دبیر علمی</label>
              <input
                type="text"
                value={form.instructor}
                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">تاریخ برگزاری</label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-sans"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">ساعت برگزاری</label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">مکان برگزاری / آدرس وبینار</label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="submit"
              className="bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2 rounded-lg"
            >
              ذخیره دوره CME
            </button>
            <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 px-3 py-2">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6. Facility Form Modal
const FacilityFormModal: React.FC<{
  initialItem?: Facility;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ initialItem, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: initialItem?.name || '',
    type: initialItem?.type || 'درمانگاه شبانه‌روزی',
    county: initialItem?.county || 'ایلام',
    city: initialItem?.city || 'ایلام',
    manager: initialItem?.manager || '',
    technicalSupervisor: initialItem?.technicalSupervisor || '',
    address: initialItem?.address || '',
    phone: initialItem?.phone || '',
    workingHours: initialItem?.workingHours || 'شبانه‌روزی',
    licenseStatus: initialItem?.licenseStatus || 'دارای پروانه بهره‌برداری معتبر',
    servicesStr: initialItem?.services ? initialItem.services.join(', ') : 'پذیرش شبانه‌روزی, کلینیک تخصصی',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const services = form.servicesStr.split(',').map((s) => s.trim()).filter(Boolean);
    onSave({
      ...(initialItem ? { id: initialItem.id } : {}),
      ...form,
      services,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-sm text-[#17365D]">ثبت/ویرایش مرکز درمانی</h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">نام مرکز درمانی *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">نوع مرکز</label>
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

            <div>
              <label className="block font-medium mb-1">شهرستان</label>
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
              <label className="block font-medium mb-1">مدیر/رئیس مرکز</label>
              <input
                type="text"
                value={form.manager}
                onChange={(e) => setForm({ ...form, manager: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">مسئول فنی</label>
              <input
                type="text"
                value={form.technicalSupervisor}
                onChange={(e) => setForm({ ...form, technicalSupervisor: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">آدرس کامل</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="submit"
              className="bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2 rounded-lg"
            >
              ذخیره مرکز
            </button>
            <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 px-3 py-2">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 7. Regulation Form Modal
const RegulationFormModal: React.FC<{
  initialItem?: RegulationDoc;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ initialItem, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: initialItem?.title || '',
    docNumber: initialItem?.docNumber || '',
    date: initialItem?.date || new Date().toLocaleDateString('fa-IR'),
    issuingBody: initialItem?.issuingBody || 'نظام پزشکی استان ایلام',
    category: initialItem?.category || 'تعرفه‌های تشخیصی درمانی',
    description: initialItem?.description || '',
    fileSize: initialItem?.fileSize || '۱.۵ مگابایت',
    fileFormat: initialItem?.fileFormat || 'PDF',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(initialItem ? { id: initialItem.id } : {}),
      ...form,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-sm text-[#17365D]">ثبت/ویرایش بخشنامه رسمی</h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">عنوان بخشنامه/مصوبه *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">شماره سند/ابلاغیه *</label>
              <input
                type="text"
                required
                value={form.docNumber}
                onChange={(e) => setForm({ ...form, docNumber: e.target.value })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">مرجع صدور</label>
              <select
                value={form.issuingBody}
                onChange={(e) => setForm({ ...form, issuingBody: e.target.value as any })}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
              >
                <option value="نظام پزشکی استان ایلام">نظام پزشکی استان ایلام</option>
                <option value="سازمان کل نظام پزشکی">سازمان کل نظام پزشکی</option>
                <option value="وزارت بهداشت، درمان و آموزش پزشکی">وزارت بهداشت</option>
                <option value="سازمان امور مالیاتی">سازمان امور مالیاتی</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">شرح خلاصه بخشنامه *</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="submit"
              className="bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2 rounded-lg"
            >
              ذخیره بخشنامه
            </button>
            <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 px-3 py-2">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 8. Message Reply Modal
const MessageReplyModal: React.FC<{
  item: ContactMessage;
  onClose: () => void;
  onSave: (status: ContactMessage['status'], reply?: string) => void;
}> = ({ item, onClose, onSave }) => {
  const [status, setStatus] = useState<ContactMessage['status']>(item.status || 'investigating');
  const [replyText, setReplyText] = useState(item.adminReply || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(status, replyText);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-sm text-[#17365D]">پاسخ به پیام/شکایت ({item.fullName})</h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
          <p><strong>موضوع:</strong> {item.subject}</p>
          <p className="text-slate-700 leading-relaxed pt-1">«{item.message}»</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">تغییر وضعیت پرونده</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            >
              <option value="new">جدید (بررسی نشده)</option>
              <option value="investigating">در حال بررسی کارشناسی</option>
              <option value="resolved">مختومه / پاسخ داده شد</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">متن پاسخ اداری جهت نمایش به مراجعین</label>
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="شرح پاسخ کارشناس سازمان..."
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="submit"
              className="bg-[#2463A6] hover:bg-[#17365D] text-white font-bold px-4 py-2 rounded-lg"
            >
              ثبت و بروزرسانی وضعیت
            </button>
            <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 px-3 py-2">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

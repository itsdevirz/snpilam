import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Announcement,
  NewsItem,
  ServiceItem,
  Physician,
  Facility,
  ClassifiedItem,
  EducationalEvent,
  RegulationDoc,
  ContactMessage,
  ActivityLog,
} from '../types';
import { sanitizeObject, sanitizeTextInput } from '../utils/security';
import { calculateReadingTime } from '../utils/readingTime';

import { ANNOUNCEMENTS as defaultAnnouncements } from '../data/announcementsData';
import { NEWS_ITEMS as defaultNews } from '../data/newsData';
import { MEMBER_SERVICES as defaultServices } from '../data/servicesData';
import { PHYSICIANS_DIRECTORY as defaultPhysicians } from '../data/physiciansData';
import { HEALTHCARE_FACILITIES as defaultFacilities } from '../data/facilitiesData';
import { CLASSIFIEDS_DATA as defaultClassifieds } from '../data/classifiedsData';
import { EDUCATIONAL_EVENTS as defaultEducation } from '../data/educationData';
import { REGULATIONS_DATA as defaultRegulations } from '../data/regulationsData';

const defaultMessages: ContactMessage[] = [];
const defaultLogs: ActivityLog[] = [];

// SHA-256 hashing helper
async function sha256Hex(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Dynamic Shamsi/Jalali year calculation helper
export function getCurrentShamsiYear(): number {
  try {
    const formatted = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { year: 'numeric' }).format(new Date());
    const yearNum = parseInt(formatted, 10);
    if (!isNaN(yearNum) && yearNum > 1300 && yearNum < 1600) {
      return yearNum;
    }
  } catch (e) {}

  const now = new Date();
  const gYear = now.getFullYear();
  const gMonth = now.getMonth() + 1;
  const gDay = now.getDate();
  if (gMonth > 3 || (gMonth === 3 && gDay >= 21)) {
    return gYear - 621;
  } else {
    return gYear - 622;
  }
}

// Generate unique tracking code in format IR-[SHAMSI_YEAR]-[8_DIGITS]
export function generateTrackingCode(): string {
  const shamsiYear = getCurrentShamsiYear();
  const random8Digits = Math.floor(10000000 + Math.random() * 90000000);
  return `IR-${shamsiYear}-${random8Digits}`;
}

// Default "Aa@123456" SHA-256 hash
const DEFAULT_ADMIN_HASH = '8c084fbe711b7d5f0e137bc67a7522ff61d9a2444c2049d562423306db7ef755';

interface DataContextType {
  announcements: Announcement[];
  newsItems: NewsItem[];
  services: ServiceItem[];
  physicians: Physician[];
  facilities: Facility[];
  classifieds: ClassifiedItem[];
  educationEvents: EducationalEvent[];
  regulations: RegulationDoc[];
  messages: ContactMessage[];
  logs: ActivityLog[];
  isAdminLoggedIn: boolean;

  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;

  // Physician CRUD & Approval
  addPhysician: (phy: Omit<Physician, 'id'>) => void;
  requestPhysicianRegistration: (phy: Omit<Physician, 'id' | 'status'>) => void;
  approvePhysician: (id: string) => void;
  rejectPhysician: (id: string) => void;
  updatePhysician: (phy: Physician) => void;
  deletePhysician: (id: string) => void;

  // Facility CRUD & Approval
  addFacility: (fac: Omit<Facility, 'id'>) => void;
  requestFacilityRegistration: (fac: Omit<Facility, 'id' | 'status'>) => void;
  approveFacility: (id: string) => void;
  rejectFacility: (id: string) => void;
  updateFacility: (fac: Facility) => void;
  deleteFacility: (id: string) => void;

  // Announcement CRUD
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (ann: Announcement) => void;
  deleteAnnouncement: (id: string) => void;

  // News CRUD
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (id: string) => void;

  // Classified CRUD
  addClassified: (cls: Omit<ClassifiedItem, 'id' | 'status'>) => void;
  updateClassifiedStatus: (id: string, status: 'active' | 'expired') => void;
  deleteClassified: (id: string) => void;

  // CME Education CRUD
  addEducationEvent: (evt: Omit<EducationalEvent, 'id'>) => void;
  updateEducationEvent: (evt: EducationalEvent) => void;
  deleteEducationEvent: (id: string) => void;

  // Regulation CRUD
  addRegulationDoc: (doc: Omit<RegulationDoc, 'id'>) => void;
  updateRegulationDoc: (doc: RegulationDoc) => void;
  deleteRegulationDoc: (id: string) => void;

  // Service CRUD
  addService: (svc: Omit<ServiceItem, 'id'>) => void;
  updateService: (svc: ServiceItem) => void;
  deleteService: (id: string) => void;

  // Messages
  addMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'> & { trackingCode?: string }) => string;
  updateMessageStatus: (id: string, status: ContactMessage['status'], reply?: string) => void;
  deleteMessage: (id: string) => void;

  // System
  sitePhone: string;
  updateSitePhone: (phone: string) => void;
  resetAllData: () => void;
  changeAdminPassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Purge legacy local storage items to ensure no database entities are cached in localStorage
  if (typeof window !== 'undefined' && localStorage.getItem('ilam_purged_v5') !== 'true') {
    localStorage.removeItem('ilam_announcements');
    localStorage.removeItem('ilam_news');
    localStorage.removeItem('ilam_services');
    localStorage.removeItem('ilam_physicians');
    localStorage.removeItem('ilam_facilities');
    localStorage.removeItem('ilam_classifieds');
    localStorage.removeItem('ilam_education');
    localStorage.removeItem('ilam_regulations');
    localStorage.removeItem('ilam_messages');
    localStorage.removeItem('ilam_logs');
    localStorage.removeItem('ilam_admin_password');
    localStorage.setItem('ilam_purged_v5', 'true');
  }

  // Pure memory states (Initialized with default empty/initial templates, updated directly from MySQL)
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(defaultNews);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [physicians, setPhysicians] = useState<Physician[]>(defaultPhysicians);
  const [facilities, setFacilities] = useState<Facility[]>(defaultFacilities);
  const [classifieds, setClassifieds] = useState<ClassifiedItem[]>(defaultClassifieds);
  const [educationEvents, setEducationEvents] = useState<EducationalEvent[]>(defaultEducation);
  const [regulations, setRegulations] = useState<RegulationDoc[]>(defaultRegulations);
  const [messages, setMessages] = useState<ContactMessage[]>(defaultMessages);
  const [logs, setLogs] = useState<ActivityLog[]>(defaultLogs);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminPasswordHash, setAdminPasswordHash] = useState<string>(DEFAULT_ADMIN_HASH);
  const [sitePhone, setSitePhone] = useState<string>('۰۸۴-۳۲۲۲۴۵۶۰');

  // MySQL REST API calls (Direct server persistence with sanitized payloads)
  const apiSaveItem = (table: string, item: any) => {
    const cleanItem = sanitizeObject(item);
    fetch('/api/data.php?action=save_item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, item: cleanItem }),
    }).catch(() => {});
  };

  const apiApproveItem = (table: string, id: string, status: 'approved' | 'rejected') => {
    fetch('/api/data.php?action=approve_item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, id, status }),
    }).catch(() => {});
  };

  const apiDeleteItem = (table: string, id: string) => {
    fetch('/api/data.php?action=delete_item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, id }),
    }).catch(() => {});
  };

  // Initial Data Fetch from PHP MySQL API on mount
  useEffect(() => {
    let isMounted = true;
    const loadFromMysql = async () => {
      try {
        const res = await fetch('/api/data.php?action=get_all');
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const result = await res.json();
            if (result.success && result.data && isMounted) {
              const d = result.data;
              if (Array.isArray(d.physicians)) setPhysicians(d.physicians);
              if (Array.isArray(d.announcements)) setAnnouncements(d.announcements);
              if (Array.isArray(d.news)) setNewsItems(d.news);
              if (Array.isArray(d.facilities)) setFacilities(d.facilities);
              if (Array.isArray(d.classifieds)) setClassifieds(d.classifieds);
              if (Array.isArray(d.education)) setEducationEvents(d.education);
              if (Array.isArray(d.regulations)) setRegulations(d.regulations);
              if (Array.isArray(d.services)) setServices(d.services);
              if (Array.isArray(d.messages)) setMessages(d.messages);
              if (Array.isArray(d.logs)) setLogs(d.logs);
              if (d.settings) {
                if (d.settings.admin_password_hash) {
                  setAdminPasswordHash(d.settings.admin_password_hash);
                }
                if (d.settings.site_phone) {
                  setSitePhone(d.settings.site_phone);
                }
              }
            }
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    };

    loadFromMysql();
    return () => { isMounted = false; };
  }, []);

  const updateSitePhone = (newPhone: string) => {
    setSitePhone(newPhone);
    fetch('/api/data.php?action=save_setting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'site_phone', value: newPhone }),
    }).catch(() => {});
    addLog('بروزرسانی شماره تماس اصلی پورتال', newPhone, 'update');
  };

  const addLog = (action: string, target: string, type: ActivityLog['type']) => {
    const now = new Date();
    const jalaliDate = `${now.toLocaleDateString('fa-IR')} - ${now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      target,
      timestamp: jalaliDate,
      user: 'مدیر ارشد سامانه',
      type,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    apiSaveItem('logs', newLog);
  };

  const loginAdmin = async (password: string): Promise<boolean> => {
    const passwordHash = await sha256Hex(password);
    try {
      const res = await fetch('/api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password_hash: passwordHash }),
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setIsAdminLoggedIn(true);
          addLog('ورود به پنل مدیریت', 'احراز هویت هش با موفقیت انجام شد', 'status');
          return true;
        }
      }
    } catch (e) {}

    // Fallback hash check
    if (passwordHash === adminPasswordHash) {
      setIsAdminLoggedIn(true);
      addLog('ورود به پنل مدیریت', 'نشست فعال گردید', 'status');
      return true;
    }
    return false;
  };

  const changeAdminPassword = async (currentPass: string, newPass: string) => {
    const currentHash = await sha256Hex(currentPass);
    const newHash = await sha256Hex(newPass);

    if (newPass.length < 8) {
      return { success: false, message: 'کلمه عبور جدید باید حداقل دارای ۸ کاراکتر باشد.' };
    }

    const hasUpper = /[A-Z]/.test(newPass);
    const hasLower = /[a-z]/.test(newPass);
    const hasNum = /[0-9]/.test(newPass);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPass);

    if (!hasUpper || !hasLower || !hasNum || !hasSpecial) {
      return {
        success: false,
        message: 'کلمه عبور جدید باید ترکیبی از حروف بزرگ انگلیسی، حروف کوچک، اعداد و کاراکترهای ویژه باشد.',
      };
    }

    try {
      const res = await fetch('/api/auth.php?action=change_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_hash: currentHash, new_hash: newHash }),
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!data.success) {
          return { success: false, message: data.error };
        }
      }
    } catch (e) {}

    setAdminPasswordHash(newHash);
    addLog('تغییر کلمه عبور مدیریت', 'کلمه عبور با الگوریتم SHA-256 بروزرسانی شد', 'update');
    return { success: true, message: 'کلمه عبور پنل مدیریت با موفقیت رمزنگاری و بروزرسانی شد.' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    addLog('خروج از پنل مدیریت', 'نشست پایان یافت', 'status');
  };

  // Physician CRUD & Approval
  const addPhysician = (data: Omit<Physician, 'id'>) => {
    const id = `phy-${Date.now()}`;
    const newItem: Physician = { id, ...data, status: data.status || 'approved' };
    setPhysicians((prev) => [newItem, ...prev]);
    apiSaveItem('physicians', newItem);
    addLog('افزودن پزشک جدید', `${data.name} (${data.medicalRegNo})`, 'create');
  };

  const requestPhysicianRegistration = (data: Omit<Physician, 'id' | 'status'>) => {
    const id = `phy-${Date.now()}`;
    const newItem: Physician = { id, ...data, status: 'pending' };
    setPhysicians((prev) => [newItem, ...prev]);
    apiSaveItem('physicians', newItem);
    addLog('درخواست ثبت‌نام پزشک جدید', `${data.name} (در انتظار تایید)`, 'create');
  };

  const approvePhysician = (id: string) => {
    setPhysicians((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p)));
    apiApproveItem('physicians', id, 'approved');
    addLog('تایید پرونده پزشک', `شناسه: ${id}`, 'update');
  };

  const rejectPhysician = (id: string) => {
    setPhysicians((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p)));
    apiApproveItem('physicians', id, 'rejected');
    addLog('رد درخواست ثبت‌نام پزشک', `شناسه: ${id}`, 'update');
  };

  const updatePhysician = (phy: Physician) => {
    setPhysicians((prev) => prev.map((p) => (p.id === phy.id ? phy : p)));
    apiSaveItem('physicians', phy);
    addLog('ویرایش اطلاعات پزشک', `${phy.name} (${phy.medicalRegNo})`, 'update');
  };

  const deletePhysician = (id: string) => {
    const target = physicians.find((p) => p.id === id);
    setPhysicians((prev) => prev.filter((p) => p.id !== id));
    apiDeleteItem('physicians', id);
    addLog('حذف پرونده پزشک', target ? target.name : id, 'delete');
  };

  // Facility CRUD & Approval
  const addFacility = (data: Omit<Facility, 'id'>) => {
    const id = `fac-${Date.now()}`;
    const newItem: Facility = { id, ...data, status: data.status || 'approved' };
    setFacilities((prev) => [newItem, ...prev]);
    apiSaveItem('facilities', newItem);
    addLog('افزودن مرکز درمانی', data.name, 'create');
  };

  const requestFacilityRegistration = (data: Omit<Facility, 'id' | 'status'>) => {
    const id = `fac-${Date.now()}`;
    const newItem: Facility = { id, ...data, status: 'pending' };
    setFacilities((prev) => [newItem, ...prev]);
    apiSaveItem('facilities', newItem);
    addLog('درخواست ثبت مرکز درمانی جدید', `${data.name} (در انتظار تایید)`, 'create');
  };

  const approveFacility = (id: string) => {
    setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'approved' } : f)));
    apiApproveItem('facilities', id, 'approved');
    addLog('تایید مرکز درمانی', `شناسه: ${id}`, 'update');
  };

  const rejectFacility = (id: string) => {
    setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'rejected' } : f)));
    apiApproveItem('facilities', id, 'rejected');
    addLog('رد مرکز درمانی', `شناسه: ${id}`, 'update');
  };

  const updateFacility = (fac: Facility) => {
    setFacilities((prev) => prev.map((f) => (f.id === fac.id ? fac : f)));
    apiSaveItem('facilities', fac);
    addLog('ویرایش اطلاعات مرکز درمانی', fac.name, 'update');
  };

  const deleteFacility = (id: string) => {
    const target = facilities.find((f) => f.id === id);
    setFacilities((prev) => prev.filter((f) => f.id !== id));
    apiDeleteItem('facilities', id);
    addLog('حذف مرکز درمانی', target ? target.name : id, 'delete');
  };

  // Announcement CRUD
  const addAnnouncement = (data: Omit<Announcement, 'id'>) => {
    const id = `ann-${Date.now()}`;
    const date = data.date || new Date().toLocaleDateString('fa-IR');
    const newItem = { id, ...data, date };
    setAnnouncements((prev) => [newItem, ...prev]);
    apiSaveItem('announcements', newItem);
    addLog('ثبت اطلاعیه جدید', data.title, 'create');
  };

  const updateAnnouncement = (ann: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === ann.id ? ann : a)));
    apiSaveItem('announcements', ann);
    addLog('ویرایش اطلاعیه', ann.title, 'update');
  };

  const deleteAnnouncement = (id: string) => {
    const target = announcements.find((a) => a.id === id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    apiDeleteItem('announcements', id);
    addLog('حذف اطلاعیه', target ? target.title : id, 'delete');
  };

  // News CRUD
  const addNews = (data: Omit<NewsItem, 'id'>) => {
    const id = `news-${Date.now()}`;
    const date = data.date || new Date().toLocaleDateString('fa-IR');
    const readTime = data.readTime || calculateReadingTime(data.content, data.summary);
    const newItem: NewsItem = { id, ...data, date, readTime };
    setNewsItems((prev) => [newItem, ...prev]);
    apiSaveItem('news', newItem);
    addLog('انتشار خبر جدید', data.title, 'create');
  };

  const updateNews = (news: NewsItem) => {
    const readTime = news.readTime || calculateReadingTime(news.content, news.summary);
    const updated = { ...news, readTime };
    setNewsItems((prev) => prev.map((n) => (n.id === news.id ? updated : n)));
    apiSaveItem('news', updated);
    addLog('ویرایش خبر', news.title, 'update');
  };

  const deleteNews = (id: string) => {
    const target = newsItems.find((n) => n.id === id);
    setNewsItems((prev) => prev.filter((n) => n.id !== id));
    apiDeleteItem('news', id);
    addLog('حذف خبر', target ? target.title : id, 'delete');
  };

  // Classified CRUD
  const addClassified = (data: Omit<ClassifiedItem, 'id' | 'status'>) => {
    const id = `cls-${Date.now()}`;
    const newItem: ClassifiedItem = { id, ...data, status: 'active' };
    setClassifieds((prev) => [newItem, ...prev]);
    apiSaveItem('classifieds', newItem);
    addLog('ثبت آگهی نیازمندی', data.title, 'create');
  };

  const updateClassifiedStatus = (id: string, status: 'active' | 'expired') => {
    const target = classifieds.find((c) => c.id === id);
    if (!target) return;
    const updated = { ...target, status };
    setClassifieds((prev) => prev.map((c) => (c.id === id ? updated : c)));
    apiSaveItem('classifieds', updated);
    addLog('تغییر وضعیت آگهی', `شناسه: ${id} -> ${status === 'active' ? 'فعال' : 'منقضی'}`, 'update');
  };

  const deleteClassified = (id: string) => {
    const target = classifieds.find((c) => c.id === id);
    setClassifieds((prev) => prev.filter((c) => c.id !== id));
    apiDeleteItem('classifieds', id);
    addLog('حذف آگهی', target ? target.title : id, 'delete');
  };

  // CME CRUD
  const addEducationEvent = (data: Omit<EducationalEvent, 'id'>) => {
    const id = `cme-${Date.now()}`;
    const newItem = { id, ...data };
    setEducationEvents((prev) => [newItem, ...prev]);
    apiSaveItem('education', newItem);
    addLog('ایجاد دوره بازآموزی', data.title, 'create');
  };

  const updateEducationEvent = (evt: EducationalEvent) => {
    setEducationEvents((prev) => prev.map((e) => (e.id === evt.id ? evt : e)));
    apiSaveItem('education', evt);
    addLog('ویرایش دوره بازآموزی', evt.title, 'update');
  };

  const deleteEducationEvent = (id: string) => {
    const target = educationEvents.find((e) => e.id === id);
    setEducationEvents((prev) => prev.filter((e) => e.id !== id));
    apiDeleteItem('education', id);
    addLog('حذف دوره بازآموزی', target ? target.title : id, 'delete');
  };

  // Regulations CRUD
  const addRegulationDoc = (data: Omit<RegulationDoc, 'id'>) => {
    const id = `reg-${Date.now()}`;
    const newItem = { id, ...data };
    setRegulations((prev) => [newItem, ...prev]);
    apiSaveItem('regulations', newItem);
    addLog('افزودن بخشنامه/قانون', data.title, 'create');
  };

  const updateRegulationDoc = (doc: RegulationDoc) => {
    setRegulations((prev) => prev.map((r) => (r.id === doc.id ? doc : r)));
    apiSaveItem('regulations', doc);
    addLog('ویرایش بخشنامه', doc.title, 'update');
  };

  const deleteRegulationDoc = (id: string) => {
    const target = regulations.find((r) => r.id === id);
    setRegulations((prev) => prev.filter((r) => r.id !== id));
    apiDeleteItem('regulations', id);
    addLog('حذف بخشنامه', target ? target.title : id, 'delete');
  };

  // Service CRUD
  const addService = (data: Omit<ServiceItem, 'id'>) => {
    const id = `srv-${Date.now()}`;
    const newItem = { id, ...data };
    setServices((prev) => [newItem, ...prev]);
    apiSaveItem('services', newItem);
    addLog('تعریف خدمت جدید', data.title, 'create');
  };

  const updateService = (svc: ServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === svc.id ? svc : s)));
    apiSaveItem('services', svc);
    addLog('ویرایش راهنمای خدمت', svc.title, 'update');
  };

  const deleteService = (id: string) => {
    const target = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    apiDeleteItem('services', id);
    addLog('حذف خدمت', target ? target.title : id, 'delete');
  };

  // Messages
  const addMessage = (data: Omit<ContactMessage, 'id' | 'date' | 'status'> & { trackingCode?: string }) => {
    const now = new Date();
    const date = now.toLocaleDateString('fa-IR');
    const id = `msg-${Date.now()}`;
    const trackingCode = data.trackingCode || generateTrackingCode();
    const newItem: ContactMessage = {
      id,
      ...data,
      trackingCode,
      date,
      status: 'new',
    };
    setMessages((prev) => [newItem, ...prev]);
    apiSaveItem('messages', newItem);
    return trackingCode;
  };

  const updateMessageStatus = (id: string, status: ContactMessage['status'], reply?: string) => {
    const target = messages.find((m) => m.id === id);
    if (!target) return;
    const updated = {
      ...target,
      status,
      adminReply: reply !== undefined ? reply : target.adminReply,
    };
    setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
    apiSaveItem('messages', updated);
    addLog('بررسی و پاسخ به پیام', `شناسه پیام: ${id}`, 'status');
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    apiDeleteItem('messages', id);
    addLog('حذف پیام', id, 'delete');
  };

  const resetAllData = () => {
    setAnnouncements(defaultAnnouncements);
    setNewsItems(defaultNews);
    setServices(defaultServices);
    setPhysicians(defaultPhysicians);
    setFacilities(defaultFacilities);
    setClassifieds(defaultClassifieds);
    setEducationEvents(defaultEducation);
    setRegulations(defaultRegulations);
    setMessages(defaultMessages);
    setLogs(defaultLogs);
    addLog('بازنشانی داده‌ها', 'اطلاعات اولیه بازیابی شد', 'status');
  };

  return (
    <DataContext.Provider
      value={{
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
        requestPhysicianRegistration,
        approvePhysician,
        rejectPhysician,
        updatePhysician,
        deletePhysician,
        addFacility,
        requestFacilityRegistration,
        approveFacility,
        rejectFacility,
        updateFacility,
        deleteFacility,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        addNews,
        updateNews,
        deleteNews,
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
        addMessage,
        updateMessageStatus,
        deleteMessage,
        sitePhone,
        updateSitePhone,
        resetAllData,
        changeAdminPassword,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

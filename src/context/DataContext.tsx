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

  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Physician CRUD
  addPhysician: (phy: Omit<Physician, 'id'>) => void;
  updatePhysician: (phy: Physician) => void;
  deletePhysician: (id: string) => void;

  // Announcement CRUD
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (ann: Announcement) => void;
  deleteAnnouncement: (id: string) => void;

  // News CRUD
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (id: string) => void;

  // Facility CRUD
  addFacility: (fac: Omit<Facility, 'id'>) => void;
  updateFacility: (fac: Facility) => void;
  deleteFacility: (id: string) => void;

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
  addMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => void;
  updateMessageStatus: (id: string, status: ContactMessage['status'], reply?: string) => void;
  deleteMessage: (id: string) => void;

  // System
  resetAllData: () => void;
  changeAdminPassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Purge old mock data from localStorage if not already purged
  if (typeof window !== 'undefined' && localStorage.getItem('ilam_v4_purged') !== 'true') {
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
    localStorage.setItem('ilam_v4_purged', 'true');
  }

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('ilam_announcements');
    return saved ? JSON.parse(saved) : defaultAnnouncements;
  });

  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('ilam_news');
    return saved ? JSON.parse(saved) : defaultNews;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('ilam_services');
    return saved ? JSON.parse(saved) : defaultServices;
  });

  const [physicians, setPhysicians] = useState<Physician[]>(() => {
    const saved = localStorage.getItem('ilam_physicians');
    return saved ? JSON.parse(saved) : defaultPhysicians;
  });

  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const saved = localStorage.getItem('ilam_facilities');
    return saved ? JSON.parse(saved) : defaultFacilities;
  });

  const [classifieds, setClassifieds] = useState<ClassifiedItem[]>(() => {
    const saved = localStorage.getItem('ilam_classifieds');
    return saved ? JSON.parse(saved) : defaultClassifieds;
  });

  const [educationEvents, setEducationEvents] = useState<EducationalEvent[]>(() => {
    const saved = localStorage.getItem('ilam_education');
    return saved ? JSON.parse(saved) : defaultEducation;
  });

  const [regulations, setRegulations] = useState<RegulationDoc[]>(() => {
    const saved = localStorage.getItem('ilam_regulations');
    return saved ? JSON.parse(saved) : defaultRegulations;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('ilam_messages');
    return saved ? JSON.parse(saved) : defaultMessages;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('ilam_logs');
    return saved ? JSON.parse(saved) : defaultLogs;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('ilam_admin_session') === 'true';
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ilam_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('ilam_news', JSON.stringify(newsItems));
  }, [newsItems]);

  useEffect(() => {
    localStorage.setItem('ilam_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('ilam_physicians', JSON.stringify(physicians));
  }, [physicians]);

  useEffect(() => {
    localStorage.setItem('ilam_facilities', JSON.stringify(facilities));
  }, [facilities]);

  useEffect(() => {
    localStorage.setItem('ilam_classifieds', JSON.stringify(classifieds));
  }, [classifieds]);

  useEffect(() => {
    localStorage.setItem('ilam_education', JSON.stringify(educationEvents));
  }, [educationEvents]);

  useEffect(() => {
    localStorage.setItem('ilam_regulations', JSON.stringify(regulations));
  }, [regulations]);

  useEffect(() => {
    localStorage.setItem('ilam_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ilam_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('ilam_admin_session', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  const DEFAULT_ADMIN_PASSWORD = 'Aa@123456';

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('ilam_admin_password') || DEFAULT_ADMIN_PASSWORD;
  });

  useEffect(() => {
    localStorage.setItem('ilam_admin_password', adminPassword);
  }, [adminPassword]);

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
  };

  const loginAdmin = (password: string) => {
    if (password === adminPassword) {
      setIsAdminLoggedIn(true);
      addLog('ورود به پنل مدیریت', 'نشست مدیریتی با موفقیت فعال شد', 'status');
      return true;
    }
    return false;
  };

  const changeAdminPassword = (currentPass: string, newPass: string) => {
    if (currentPass !== adminPassword) {
      return { success: false, message: 'کلمه عبور فعلی واردشده نادرست می‌باشد.' };
    }

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
        message: 'کلمه عبور جدید باید ترکیبی از حروف بزرگ انگلیسی، حروف کوچک، اعداد و کاراکترهای ویژه (مانند @,#,$) باشد.',
      };
    }

    setAdminPassword(newPass);
    localStorage.setItem('ilam_admin_password', newPass);
    addLog('تغییر کلمه عبور مدیریت', 'کلمه عبور پنل مدیریت با موفقیت تغییر یافت', 'update');
    return { success: true, message: 'کلمه عبور پنل مدیریت با موفقیت بروزرسانی شد.' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    addLog('خروج از پنل مدیریت', 'نشست پایان یافت', 'status');
  };

  // Physician CRUD
  const addPhysician = (data: Omit<Physician, 'id'>) => {
    const id = `phy-${Date.now()}`;
    const newItem = { id, ...data };
    setPhysicians((prev) => [newItem, ...prev]);
    addLog('افزودن پزشک جدید', `${data.name} (${data.medicalRegNo})`, 'create');
  };

  const updatePhysician = (phy: Physician) => {
    setPhysicians((prev) => prev.map((p) => (p.id === phy.id ? phy : p)));
    addLog('ویرایش اطلاعات پزشک', `${phy.name} (${phy.medicalRegNo})`, 'update');
  };

  const deletePhysician = (id: string) => {
    const target = physicians.find((p) => p.id === id);
    setPhysicians((prev) => prev.filter((p) => p.id !== id));
    addLog('حذف پرونده پزشک', target ? target.name : id, 'delete');
  };

  // Announcement CRUD
  const addAnnouncement = (data: Omit<Announcement, 'id'>) => {
    const id = `ann-${Date.now()}`;
    const newItem = { id, ...data };
    setAnnouncements((prev) => [newItem, ...prev]);
    addLog('ثبت اطلاعیه جدید', data.title, 'create');
  };

  const updateAnnouncement = (ann: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === ann.id ? ann : a)));
    addLog('ویرایش اطلاعیه', ann.title, 'update');
  };

  const deleteAnnouncement = (id: string) => {
    const target = announcements.find((a) => a.id === id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addLog('حذف اطلاعیه', target ? target.title : id, 'delete');
  };

  // News CRUD
  const addNews = (data: Omit<NewsItem, 'id'>) => {
    const id = `news-${Date.now()}`;
    const newItem = { id, ...data };
    setNewsItems((prev) => [newItem, ...prev]);
    addLog('انتشار خبر جدید', data.title, 'create');
  };

  const updateNews = (news: NewsItem) => {
    setNewsItems((prev) => prev.map((n) => (n.id === news.id ? news : n)));
    addLog('ویرایش خبر', news.title, 'update');
  };

  const deleteNews = (id: string) => {
    const target = newsItems.find((n) => n.id === id);
    setNewsItems((prev) => prev.filter((n) => n.id !== id));
    addLog('حذف خبر', target ? target.title : id, 'delete');
  };

  // Facility CRUD
  const addFacility = (data: Omit<Facility, 'id'>) => {
    const id = `fac-${Date.now()}`;
    const newItem = { id, ...data };
    setFacilities((prev) => [newItem, ...prev]);
    addLog('افزودن مرکز درمانی', data.name, 'create');
  };

  const updateFacility = (fac: Facility) => {
    setFacilities((prev) => prev.map((f) => (f.id === fac.id ? fac : f)));
    addLog('ویرایش اطلاعات مرکز درمانی', fac.name, 'update');
  };

  const deleteFacility = (id: string) => {
    const target = facilities.find((f) => f.id === id);
    setFacilities((prev) => prev.filter((f) => f.id !== id));
    addLog('حذف مرکز درمانی', target ? target.name : id, 'delete');
  };

  // Classified CRUD
  const addClassified = (data: Omit<ClassifiedItem, 'id' | 'status'>) => {
    const id = `cls-${Date.now()}`;
    const newItem: ClassifiedItem = { id, ...data, status: 'active' };
    setClassifieds((prev) => [newItem, ...prev]);
    addLog('ثبت آگهی نیازمندی', data.title, 'create');
  };

  const updateClassifiedStatus = (id: string, status: 'active' | 'expired') => {
    setClassifieds((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    addLog('تغییر وضعیت آگهی', `شناسه: ${id} -> ${status === 'active' ? 'فعال' : 'منقضی'}`, 'update');
  };

  const deleteClassified = (id: string) => {
    const target = classifieds.find((c) => c.id === id);
    setClassifieds((prev) => prev.filter((c) => c.id !== id));
    addLog('حذف آگهی', target ? target.title : id, 'delete');
  };

  // CME CRUD
  const addEducationEvent = (data: Omit<EducationalEvent, 'id'>) => {
    const id = `cme-${Date.now()}`;
    const newItem = { id, ...data };
    setEducationEvents((prev) => [newItem, ...prev]);
    addLog('ایجاد دوره بازآموزی', data.title, 'create');
  };

  const updateEducationEvent = (evt: EducationalEvent) => {
    setEducationEvents((prev) => prev.map((e) => (e.id === evt.id ? evt : e)));
    addLog('ویرایش دوره بازآموزی', evt.title, 'update');
  };

  const deleteEducationEvent = (id: string) => {
    const target = educationEvents.find((e) => e.id === id);
    setEducationEvents((prev) => prev.filter((e) => e.id !== id));
    addLog('حذف دوره بازآموزی', target ? target.title : id, 'delete');
  };

  // Regulations CRUD
  const addRegulationDoc = (data: Omit<RegulationDoc, 'id'>) => {
    const id = `reg-${Date.now()}`;
    const newItem = { id, ...data };
    setRegulations((prev) => [newItem, ...prev]);
    addLog('افزودن بخشنامه/قانون', data.title, 'create');
  };

  const updateRegulationDoc = (doc: RegulationDoc) => {
    setRegulations((prev) => prev.map((r) => (r.id === doc.id ? doc : r)));
    addLog('ویرایش بخشنامه', doc.title, 'update');
  };

  const deleteRegulationDoc = (id: string) => {
    const target = regulations.find((r) => r.id === id);
    setRegulations((prev) => prev.filter((r) => r.id !== id));
    addLog('حذف بخشنامه', target ? target.title : id, 'delete');
  };

  // Service CRUD
  const addService = (data: Omit<ServiceItem, 'id'>) => {
    const id = `srv-${Date.now()}`;
    const newItem = { id, ...data };
    setServices((prev) => [newItem, ...prev]);
    addLog('تعریف خدمت جدید', data.title, 'create');
  };

  const updateService = (svc: ServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === svc.id ? svc : s)));
    addLog('ویرایش راهنمای خدمت', svc.title, 'update');
  };

  const deleteService = (id: string) => {
    const target = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    addLog('حذف خدمت', target ? target.title : id, 'delete');
  };

  // Messages
  const addMessage = (data: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const now = new Date();
    const date = now.toLocaleDateString('fa-IR');
    const id = `msg-${Date.now()}`;
    const newItem: ContactMessage = {
      id,
      ...data,
      date,
      status: 'new',
    };
    setMessages((prev) => [newItem, ...prev]);
  };

  const updateMessageStatus = (id: string, status: ContactMessage['status'], reply?: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status, adminReply: reply !== undefined ? reply : m.adminReply } : m
      )
    );
    addLog('بررسی و پاسخ به پیام', `شناسه پیام: ${id}`, 'status');
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
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
    localStorage.clear();
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
        updatePhysician,
        deletePhysician,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        addNews,
        updateNews,
        deleteNews,
        addFacility,
        updateFacility,
        deleteFacility,
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

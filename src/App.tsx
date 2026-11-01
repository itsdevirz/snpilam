import React, { useState } from 'react';
import { NavigationTab, Announcement, NewsItem, ServiceItem } from './types';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './components/Toast';
import { CommandPalette } from './components/CommandPalette';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { PhysiciansView } from './views/PhysiciansView';
import { FacilitiesView } from './views/FacilitiesView';
import { ClassifiedsView } from './views/ClassifiedsView';
import { EducationView } from './views/EducationView';
import { RegulationsView } from './views/RegulationsView';
import { LicensesView } from './views/LicensesView';
import { TaxAffairsView } from './views/TaxAffairsView';
import { AdvertisingView } from './views/AdvertisingView';
import { WelfareView } from './views/WelfareView';
import { DepartmentsView } from './views/DepartmentsView';
import { NewsView } from './views/NewsView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');

  // Deep-link / navigation parameters
  const [physicianSearchQuery, setPhysicianSearchQuery] = useState('');
  const [physicianSpecialty, setPhysicianSpecialty] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [selectedNewsId, setSelectedNewsId] = useState<string | undefined>();
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | undefined>();

  React.useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path === '/admin/' || hash === '#admin') {
        setCurrentTab('admin');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    if (tab === 'admin') {
      try {
        window.history.pushState({}, '', '/admin');
      } catch (e) {}
    } else if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
      try {
        window.history.pushState({}, '', '/');
      } catch (e) {}
    }
    // Reset specific item targets when changing tab manually
    setSelectedServiceId(undefined);
    setSelectedNewsId(undefined);
    setSelectedAnnouncementId(undefined);
  };

  const handleQuickPhysicianSearch = (query: string, specialty: string) => {
    setPhysicianSearchQuery(query);
    setPhysicianSpecialty(specialty);
    setCurrentTab('physicians');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAnnouncement = (ann: Announcement) => {
    setSelectedAnnouncementId(ann.id);
    setSelectedNewsId(undefined);
    setCurrentTab('news');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNews = (news: NewsItem) => {
    setSelectedNewsId(news.id);
    setSelectedAnnouncementId(undefined);
    setCurrentTab('news');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenService = (service: ServiceItem) => {
    setSelectedServiceId(service.id);
    setCurrentTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const handleGlobalSearch = (query: string) => {
    setPhysicianSearchQuery(query);
    setCurrentTab('physicians');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DataProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#202B38] font-sans antialiased selection:bg-[#2463A6] selection:text-white">
          {/* Institutional Top & Main Header */}
          <Header
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            onSearchGlobal={handleGlobalSearch}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* Emil Kowalski Cmd+K Command Palette */}
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onSelectTab={handleSelectTab}
            onOpenAnnouncement={handleOpenAnnouncement}
            onOpenNews={handleOpenNews}
            onOpenService={handleOpenService}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
            {currentTab === 'home' && (
              <HomeView
                onSelectTab={handleSelectTab}
                onOpenAnnouncement={handleOpenAnnouncement}
                onOpenNews={handleOpenNews}
                onOpenService={handleOpenService}
                onQuickPhysicianSearch={handleQuickPhysicianSearch}
              />
            )}

            {currentTab === 'services' && (
              <ServicesView initialServiceId={selectedServiceId} />
            )}

            {currentTab === 'physicians' && (
              <PhysiciansView
                initialSearchQuery={physicianSearchQuery}
                initialSpecialty={physicianSpecialty}
              />
            )}

            {currentTab === 'facilities' && <FacilitiesView />}

            {currentTab === 'classifieds' && <ClassifiedsView />}

            {currentTab === 'education' && <EducationView />}

            {currentTab === 'regulations' && <RegulationsView />}

            {currentTab === 'licenses' && <LicensesView />}

            {currentTab === 'tax' && <TaxAffairsView />}

            {currentTab === 'advertising' && <AdvertisingView />}

            {currentTab === 'welfare' && <WelfareView />}

            {currentTab === 'departments' && <DepartmentsView />}

            {currentTab === 'news' && (
              <NewsView
                initialNewsId={selectedNewsId}
                initialAnnouncementId={selectedAnnouncementId}
              />
            )}

            {currentTab === 'about' && <AboutView />}

            {currentTab === 'contact' && <ContactView />}

            {currentTab === 'admin' && <AdminView />}
          </main>

          {/* Institutional Footer */}
          <Footer onSelectTab={handleSelectTab} />
        </div>
      </ToastProvider>
    </DataProvider>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CSCService, 
  CSCApplication, 
  CSCCenterSettings, 
  Appointment, 
  ApplicationStatus, 
  PaymentStatus, 
  PaymentMethod,
  Language 
} from '../types/csc';
import { INITIAL_SERVICES, INITIAL_APPLICATIONS, INITIAL_CENTER_SETTINGS } from '../data/initialData';

interface CSCContextType {
  // Navigation & Mode
  viewMode: 'customer' | 'admin';
  setViewMode: (mode: 'customer' | 'admin') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Admin Authentication & Security
  isAdminAuthenticated: boolean;
  isAdminLoginModalOpen: boolean;
  openAdminLoginModal: () => void;
  closeAdminLoginModal: () => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPin: (oldPin: string, newPin: string) => boolean;
  adminPin: string;

  // Data
  services: CSCService[];
  applications: CSCApplication[];
  centerSettings: CSCCenterSettings;
  appointments: Appointment[];
  
  // Customer Actions
  submitApplication: (data: Omit<CSCApplication, 'id' | 'submittedDate' | 'status' | 'timeline'>) => CSCApplication;
  bookAppointment: (data: Omit<Appointment, 'id' | 'tokenNumber' | 'status' | 'createdAt'>) => Appointment;
  
  // Admin Management Actions
  updateApplicationStatus: (
    id: string, 
    status: ApplicationStatus, 
    remarks?: string, 
    govtApplicationNo?: string,
    certFile?: { name: string; url: string }
  ) => void;
  updateApplicationPayment: (id: string, status: PaymentStatus, method?: PaymentMethod) => void;
  deleteApplication: (id: string) => void;
  
  // Service Management
  updateService: (service: CSCService) => void;
  addService: (service: Omit<CSCService, 'id'>) => void;
  toggleServiceStatus: (id: string) => void;
  
  // Center Settings
  updateCenterSettings: (settings: CSCCenterSettings) => void;
  
  // Print & Receipt State
  activeReceiptApplication: CSCApplication | null;
  setActiveReceiptApplication: (app: CSCApplication | null) => void;
  
  // Reset Data to Defaults
  resetDataToDefaults: () => void;
}

const CSCContext = createContext<CSCContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SERVICES: 'csc_portal_services_v1',
  APPLICATIONS: 'csc_portal_applications_v1',
  SETTINGS: 'csc_portal_settings_v1',
  APPOINTMENTS: 'csc_portal_appointments_v1',
  VIEW_MODE: 'csc_portal_view_mode_v1',
  LANG: 'csc_portal_lang_v1',
  ADMIN_PIN: 'csc_portal_admin_pin_v1',
  ADMIN_AUTH: 'csc_portal_admin_auth_v1',
};

export const CSCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const checkIsAdminRoute = () => {
    return window.location.hash.toLowerCase().includes('admin') || 
           window.location.pathname.toLowerCase().endsWith('/admin');
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || '1234';
  });

  const [viewMode, setViewModeState] = useState<'customer' | 'admin'>(() => {
    return checkIsAdminRoute() ? 'admin' : 'customer';
  });
  
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'gu';
  });

  // Listen to browser URL changes (e.g. user types #admin or clicks back)
  useEffect(() => {
    const handleUrlChange = () => {
      const isAdm = checkIsAdminRoute();
      setViewModeState(isAdm ? 'admin' : 'customer');
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const [services, setServices] = useState<CSCService[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_SERVICES;
  });

  const [applications, setApplications] = useState<CSCApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_APPLICATIONS;
  });

  const [centerSettings, setCenterSettings] = useState<CSCCenterSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CENTER_SETTINGS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'APT-1',
        tokenNumber: 'T-01',
        customerName: 'દિનેશભાઈ સોલંકી',
        mobile: '98790 12345',
        serviceId: 'income-cert',
        serviceName: 'આવકનો દાખલો',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '11:00 AM - 11:30 AM',
        status: 'booked',
        createdAt: '2026-10-31 09:00 AM',
      }
    ];
  });

  const [activeReceiptApplication, setActiveReceiptApplication] = useState<CSCApplication | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(centerSettings));
  }, [centerSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, adminPin);
  }, [adminPin]);

  const setViewMode = (mode: 'customer' | 'admin') => {
    if (mode === 'admin') {
      window.location.hash = 'admin';
    } else {
      window.location.hash = '';
    }
    setViewModeState(mode);
  };

  const loginAdmin = (pin: string): boolean => {
    if (pin.trim() === adminPin.trim()) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      setViewMode('admin');
      setIsAdminLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setViewMode('customer');
  };

  const changeAdminPin = (oldPin: string, newPin: string): boolean => {
    if (oldPin === adminPin && newPin.length >= 4) {
      setAdminPin(newPin);
      return true;
    }
    return false;
  };

  const openAdminLoginModal = () => setIsAdminLoginModalOpen(true);
  const closeAdminLoginModal = () => setIsAdminLoginModalOpen(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  // Submit Application (from Customer Portal or Walk-in Counter)
  const submitApplication = (
    data: Omit<CSCApplication, 'id' | 'submittedDate' | 'status' | 'timeline'>
  ): CSCApplication => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `CSC-GJ-2026-${randomSuffix}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newApp: CSCApplication = {
      ...data,
      id: newId,
      submittedDate: dateStr,
      status: 'submitted',
      timeline: [
        {
          status: 'submitted',
          titleGu: 'અરજી સફળતાપૂર્વક નોંધાઈ',
          titleEn: 'Application Successfully Registered',
          descriptionGu: 'ગ્રાહક દ્વારા ડિજિટલ સેવા પોર્ટલ મારફતે વિગતો સબમિટ કરાઈ',
          descriptionEn: 'Details & documents submitted through portal',
          timestamp: dateStr,
          updatedBy: viewMode === 'admin' ? 'VLE Counter' : 'Citizen Online',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  // Book Appointment / Queue Token
  const bookAppointment = (
    data: Omit<Appointment, 'id' | 'tokenNumber' | 'status' | 'createdAt'>
  ): Appointment => {
    const tokenNo = `T-${String(appointments.length + 1).padStart(2, '0')}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const newApt: Appointment = {
      ...data,
      id: `APT-${Date.now()}`,
      tokenNumber: tokenNo,
      status: 'booked',
      createdAt: dateStr,
    };

    setAppointments((prev) => [newApt, ...prev]);
    return newApt;
  };

  // Update Status & Timeline by Admin
  const updateApplicationStatus = (
    id: string,
    status: ApplicationStatus,
    remarks?: string,
    govtApplicationNo?: string,
    certFile?: { name: string; url: string }
  ) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const statusTitleMap: Record<ApplicationStatus, { gu: string; en: string }> = {
      submitted: { gu: 'અરજી પુનઃ સબમિટ થઈ', en: 'Application Resubmitted' },
      verified: { gu: 'દસ્તાવેજો ચકાસીને મંજૂર કર્યા', en: 'Documents Verified' },
      processing: { gu: 'સરકારી પોર્ટલ પર પ્રોસેસિંગ હેઠળ', en: 'Processing at Govt Department' },
      approved: { gu: 'પ્રમાણપત્ર / સેવા તૈયાર થઈ ગયેલ', en: 'Certificate Ready / Approved' },
      rejected: { gu: 'અરજી અસ્વીકાર (દસ્તાવેજ ખૂટે છે)', en: 'Application Rejected' },
    };

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        const newEvent = {
          status,
          titleGu: statusTitleMap[status].gu,
          titleEn: statusTitleMap[status].en,
          descriptionGu: remarks || `સ્ટેટસ બદલાઈને ${statusTitleMap[status].gu} થયું.`,
          descriptionEn: remarks || `Status changed to ${statusTitleMap[status].en}.`,
          timestamp: dateStr,
          updatedBy: 'VLE Operator',
        };

        return {
          ...app,
          status,
          remarks: remarks || app.remarks,
          govtApplicationNo: govtApplicationNo !== undefined ? govtApplicationNo : app.govtApplicationNo,
          approvedCertificateUrl: certFile?.url || app.approvedCertificateUrl,
          approvedCertificateName: certFile?.name || app.approvedCertificateName,
          timeline: [...app.timeline, newEvent],
        };
      })
    );
  };

  // Update Payment Status
  const updateApplicationPayment = (id: string, status: PaymentStatus, method?: PaymentMethod) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, paymentStatus: status, paymentMethod: method || app.paymentMethod } : app))
    );
  };

  // Delete Application
  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  // Service Management
  const updateService = (updated: CSCService) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const addService = (newService: Omit<CSCService, 'id'>) => {
    const id = `service-${Date.now()}`;
    setServices((prev) => [...prev, { ...newService, id }]);
  };

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Center Settings
  const updateCenterSettings = (settings: CSCCenterSettings) => {
    setCenterSettings(settings);
  };

  // Reset to Factory Samples
  const resetDataToDefaults = () => {
    setServices(INITIAL_SERVICES);
    setApplications(INITIAL_APPLICATIONS);
    setCenterSettings(INITIAL_CENTER_SETTINGS);
    setAdminPin('1234');
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_PIN);
  };

  return (
    <CSCContext.Provider
      value={{
        viewMode,
        setViewMode,
        language,
        setLanguage,
        isAdminAuthenticated,
        isAdminLoginModalOpen,
        openAdminLoginModal,
        closeAdminLoginModal,
        loginAdmin,
        logoutAdmin,
        changeAdminPin,
        adminPin,
        services,
        applications,
        centerSettings,
        appointments,
        submitApplication,
        bookAppointment,
        updateApplicationStatus,
        updateApplicationPayment,
        deleteApplication,
        updateService,
        addService,
        toggleServiceStatus,
        updateCenterSettings,
        activeReceiptApplication,
        setActiveReceiptApplication,
        resetDataToDefaults,
      }}
    >
      {children}
    </CSCContext.Provider>
  );
};

export const useCSC = () => {
  const context = useContext(CSCContext);
  if (!context) {
    throw new Error('useCSC must be used within a CSCProvider');
  }
  return context;
};

import React from 'react';
import { useCSC } from '../context/CSCContext';
import { ShieldCheck, Globe, Search, ExternalLink, LogOut, LayoutDashboard, Plus } from 'lucide-react';

interface HeaderProps {
  onOpenTracker?: () => void;
  onOpenWalkInModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTracker, onOpenWalkInModal }) => {
  const { 
    viewMode, 
    setViewMode, 
    language, 
    setLanguage, 
    centerSettings, 
    isAdminAuthenticated, 
    logoutAdmin 
  } = useCSC();

  const isGu = language === 'gu';

  // -------------------------------------------------------------
  // 1. DEDICATED SEPARATE ADMIN HEADER (When operator is on /#admin)
  // -------------------------------------------------------------
  if (viewMode === 'admin') {
    return (
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3">
          {/* Admin Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>{isGu ? 'VLE સંચાલક કંટ્રોલ રૂમ' : 'VLE Operator Control Room'}</span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  ADMIN
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {centerSettings.centerName} · VLE: {centerSettings.vleId}
              </div>
            </div>
          </div>

          {/* Admin Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#admin-overview" className="hover:text-white transition-colors">
              {isGu ? 'ઓવરવ્યુ' : 'Overview'}
            </a>
            <a href="#admin-applications" className="hover:text-white transition-colors">
              {isGu ? 'અરજીઓનું સંચાલન' : 'Applications'}
            </a>
            <a href="#admin-services" className="hover:text-white transition-colors">
              {isGu ? 'સેવાઓ & ફી' : 'Services & Fees'}
            </a>
            <a href="#admin-customers" className="hover:text-white transition-colors">
              {isGu ? 'ગ્રાહકોની યાદી' : 'Customers'}
            </a>
          </nav>

          {/* Admin Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Fast walk-in entry button */}
            <button
              onClick={onOpenWalkInModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isGu ? '+ કાઉન્ટર એન્ટ્રી' : '+ Walk-in'}</span>
            </button>

            {/* Language */}
            <button
              onClick={() => setLanguage(language === 'gu' ? 'en' : 'gu')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <span className="font-semibold">{language === 'gu' ? 'EN' : 'ગુજરાતી'}</span>
            </button>

            {/* Back to Public Customer Portal */}
            <button
              onClick={() => setViewMode('customer')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              title="નાગરિક પોર્ટલ ખોલો"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isGu ? 'નાગરિક પોર્ટલ' : 'Public Portal'}</span>
            </button>

            {/* Logout */}
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isGu ? 'સાઇન આઉટ' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // -------------------------------------------------------------
  // 2. PURE CITIZEN / CUSTOMER HEADER (No Admin controls visible!)
  // -------------------------------------------------------------
  return (
    <>
      {/* Official Top Announcement Notice */}
      {centerSettings.isAnnouncementActive && (
        <div className="bg-amber-600 text-white text-xs py-1.5 px-4 text-center font-medium shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <span className="truncate">
              {isGu ? centerSettings.announcementTextGu : centerSettings.announcementTextEn}
            </span>
            <span className="hidden sm:inline-block font-mono text-amber-100 text-[11px] shrink-0">
              {centerSettings.workingHours}
            </span>
          </div>
        </div>
      )}

      {/* Clean Public Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-white to-emerald-600 p-[2px] shadow-xs flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap leading-tight">
                {isGu ? centerSettings.centerName : centerSettings.centerNameEn}
              </div>
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                <span>CSC E-Governance Digital India</span>
                <span>·</span>
                <span>ગુજરાત જન સેવા</span>
              </div>
            </div>
          </div>

          {/* Citizen Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#services-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              {isGu ? 'સરકારી સેવાઓ' : 'All Services'}
            </a>
            <a href="#tracker-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              {isGu ? 'અરજી ટ્રેકિંગ' : 'Track Application'}
            </a>
            <a href="#utility-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              {isGu ? 'વીજળી બિલ' : 'Electricity Bill'}
            </a>
            <a href="#token-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              {isGu ? 'ટોકન બુકિંગ' : 'Queue Token'}
            </a>
            <a href="#center-info" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              {isGu ? 'કેન્દ્ર સંપર્ક' : 'Contact Center'}
            </a>
          </nav>

          {/* Citizen Actions (Completely Clean - No Admin buttons!) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Track Status shortcut */}
            <button
              onClick={onOpenTracker}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-amber-700" />
              <span>{isGu ? 'સ્ટેટસ ટ્રેક' : 'Track Status'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'gu' ? 'en' : 'gu')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-600" />
              <span>{language === 'gu' ? 'EN' : 'ગુજરાતી'}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

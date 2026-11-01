import React, { useState } from 'react';
import { CSCProvider, useCSC } from './context/CSCContext';
import { Header } from './components/Header';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { PrintReceiptModal } from './components/common/PrintReceiptModal';
import { WalkInEntryModal } from './components/admin/WalkInEntryModal';
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Package } from 'lucide-react';
import { downloadProjectZip } from './utils/projectDownloader';

const StandaloneAdminLogin: React.FC = () => {
  const { loginAdmin, centerSettings, language, setViewMode } = useCSC();
  const isGu = language === 'gu';

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = loginAdmin(pin);
    if (!ok) {
      setError(isGu ? 'ખોટો સિક્યોરિટી પિન! (ડિફોલ્ટ પિન: 1234)' : 'Incorrect security PIN! (Default: 1234)');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
              CSC VLE E-GOVERNANCE
            </span>
            <h2 className="text-lg font-bold text-white">
              {isGu ? 'સંચાલક મેનેજમેન્ટ પેનલ (Admin)' : 'CSC VLE Admin Console'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {centerSettings.centerName} · {centerSettings.vleId}
          </p>
        </div>

        {/* Security Warning */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            {isGu
              ? 'આ પેનલ માત્ર અધિકૃત CSC સંચાલક માટે છે.'
              : 'Authorized operator access only.'}
          </span>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              {isGu ? 'સંચાલક સિક્યોરિટી પિન દાખલ કરો *' : 'Enter Operator Security PIN *'}
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                required
                maxLength={8}
                placeholder="****"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-base font-mono tracking-widest text-center px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>ડિફોલ્ટ પિન: <strong className="text-slate-900 font-bold">1234</strong></span>
              <span>{centerSettings.cscId}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>{isGu ? 'એડમિન પેનલમાં પ્રવેશ કરો' : 'Login to Admin Panel'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('customer')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              {isGu ? '← ગ્રાહક પોર્ટલ પર પાછા જાઓ' : '← Back to Citizen Portal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    centerSettings, 
    isAdminAuthenticated 
  } = useCSC();

  const [isWalkInOpen, setIsWalkInOpen] = useState(false);

  const scrollToTracker = () => {
    const el = document.getElementById('tracker-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Header (Renders dedicated Admin header or dedicated Citizen header) */}
      <Header
        onOpenTracker={scrollToTracker}
        onOpenWalkInModal={() => setIsWalkInOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {viewMode === 'admin' ? (
          isAdminAuthenticated ? (
            <AdminPortal />
          ) : (
            <StandaloneAdminLogin />
          )
        ) : (
          <CustomerPortal />
        )}
      </main>

      {/* Global Printable Receipt Modal */}
      <PrintReceiptModal />

      {/* Walk-in Counter Modal */}
      {isWalkInOpen && (
        <WalkInEntryModal
          onClose={() => setIsWalkInOpen(false)}
          onSuccess={() => setIsWalkInOpen(false)}
        />
      )}

      {/* Footer (Clean Citizen Footer with discrete Admin route link) */}
      <footer className="no-print bg-slate-900 text-white border-t border-slate-800 py-8 px-4 sm:px-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm">{centerSettings.centerName}</span>
              <span className="text-slate-400 text-[11px] font-mono">({centerSettings.cscId})</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {centerSettings.addressGu} · {centerSettings.workingHours}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-slate-400 text-xs">
            {/* 1-Click Code Download Button */}
            <button
              onClick={downloadProjectZip}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
              title="Download full project code as ZIP file"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>કોડ ડાઉનલોડ (.ZIP)</span>
            </button>

            <span>© 2026 ગુજરાત જન સેવા કેન્દ્ર</span>
            <span>·</span>
            {/* Discrete operator gateway link for the center owner */}
            <button
              onClick={() => setViewMode(viewMode === 'customer' ? 'admin' : 'customer')}
              className="text-slate-500 hover:text-amber-400 transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
              title="VLE Operator Console (/admin)"
            >
              <Lock className="w-3 h-3" />
              <span>{viewMode === 'customer' ? 'સંચાલક લોગિન (#admin)' : 'ગ્રાહક પોર્ટલ'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CSCProvider>
      <AppContent />
    </CSCProvider>
  );
}

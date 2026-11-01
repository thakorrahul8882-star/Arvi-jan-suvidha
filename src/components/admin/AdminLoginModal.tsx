import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { Lock, Eye, EyeOff, ShieldCheck, X, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { 
    isAdminLoginModalOpen, 
    closeAdminLoginModal, 
    loginAdmin, 
    centerSettings, 
    language,
    adminPin 
  } = useCSC();

  const isGu = language === 'gu';
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin.trim()) {
      setError(isGu ? 'કૃપા કરીને સંચાલક સિક્યોરિટી પિન દાખલ કરો.' : 'Please enter security PIN.');
      return;
    }

    const success = loginAdmin(pin);
    if (!success) {
      setError(isGu ? 'ખોટો સિક્યોરિટી પિન! (ડિફોલ્ટ પિન: 1234)' : 'Incorrect security PIN! (Default PIN: 1234)');
    } else {
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                {isGu ? 'સુરક્ષિત સંચાલક પ્રવેશ' : 'Operator Authentication'}
              </span>
              <h3 className="text-base sm:text-lg font-bold">
                {isGu ? 'VLE સંચાલક લોગિન' : 'VLE Admin Login'}
              </h3>
            </div>
          </div>
          <button
            onClick={closeAdminLoginModal}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Info Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 text-xs text-slate-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {isGu
              ? 'આ પેનલ માત્ર અધિકૃત CSC સંચાલક માટે છે. નાગરિકો માટે ગ્રાહક પોર્ટલ ઉપલબ્ધ છે.'
              : 'Restricted area for authorized VLE operators only.'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* VLE Credentials Summary */}
          <div className="p-3 rounded-lg bg-slate-100/70 border border-slate-200 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>{isGu ? 'કેન્દ્રનું નામ:' : 'Center:'}</span>
              <strong className="text-slate-900 font-sans">{centerSettings.centerName}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>VLE ID:</span>
              <strong className="text-slate-900">{centerSettings.vleId}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>CSC ID:</span>
              <strong className="text-slate-900">{centerSettings.cscId}</strong>
            </div>
          </div>

          {/* Security PIN Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              {isGu ? 'સંચાલક સિક્યોરિટી પિન (Security PIN) *' : 'Operator Security PIN *'}
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                required
                maxLength={8}
                placeholder={isGu ? 'સિક્યોરિટી પિન દાખલ કરો' : 'Enter 4-digit PIN'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-sm font-mono tracking-widest px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>{isGu ? 'ડેમો પિન:' : 'Demo PIN:'} <strong className="font-mono text-slate-800 font-bold">1234</strong></span>
              <span className="text-slate-400">{isGu ? 'સેટિંગ્સમાંથી બદલી શકાય છે' : 'Configurable in settings'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={closeAdminLoginModal}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              {isGu ? 'પાછા જાઓ (ગ્રાહક પોર્ટલ)' : 'Back to Citizen Portal'}
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <span>{isGu ? 'સંચાલક લોગિન કરો' : 'Authorize & Log In'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { Settings, X, Save, AlertCircle } from 'lucide-react';
import { CSCCenterSettings } from '../../types/csc';

interface CenterSettingsModalProps {
  onClose: () => void;
}

export const CenterSettingsModal: React.FC<CenterSettingsModalProps> = ({ onClose }) => {
  const { centerSettings, updateCenterSettings, language, resetDataToDefaults, adminPin, changeAdminPin } = useCSC();
  const isGu = language === 'gu';

  const [form, setForm] = useState<CSCCenterSettings>({ ...centerSettings });
  const [formPin, setFormPin] = useState(adminPin);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCenterSettings(form);
    if (formPin && formPin !== adminPin) {
      changeAdminPin(adminPin, formPin);
    }
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    if (confirm(isGu ? 'શું તમે ડિફોલ્ટ સેમ્પલ ડેટા રીસેટ કરવા માંગો છો?' : 'Reset to factory sample data?')) {
      resetDataToDefaults();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">
              {isGu ? 'કેન્દ્ર સેટિંગ્સ અને પ્રોફાઇલ' : 'Center Profile & Settings'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success && (
          <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-medium">
            ✓ {isGu ? 'સેટિંગ્સ સફળતાપૂર્વક સાચવવામાં આવી!' : 'Settings updated successfully!'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isGu ? 'કેન્દ્રનું નામ (ગુજરાતી)' : 'Center Name (Gujarati)'}
            </label>
            <input
              type="text"
              required
              value={form.centerName}
              onChange={(e) => setForm({ ...form, centerName: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isGu ? 'સંચાલકનું નામ (VLE Operator)' : 'VLE Operator Name'}
              </label>
              <input
                type="text"
                required
                value={form.vleName}
                onChange={(e) => setForm({ ...form, vleName: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isGu ? 'મોબાઇલ નંબર' : 'Center Mobile Number'}
              </label>
              <input
                type="tel"
                required
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">VLE ID</label>
              <input
                type="text"
                value={form.vleId}
                onChange={(e) => setForm({ ...form, vleId: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">CSC E-Gov ID</label>
              <input
                type="text"
                value={form.cscId}
                onChange={(e) => setForm({ ...form, cscId: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isGu ? 'કેન્દ્રનું પૂરું સરનામું (રસીદ પર પ્રિન્ટ થશે)' : 'Center Address'}
            </label>
            <input
              type="text"
              value={form.addressGu}
              onChange={(e) => setForm({ ...form, addressGu: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isGu ? 'કામકાજના કલાકો' : 'Working Hours'}
              </label>
              <input
                type="text"
                value={form.workingHours}
                onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isGu ? 'UPI ID (QR કોડ પેમેન્ટ માટે)' : 'UPI ID for QR'}
              </label>
              <input
                type="text"
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Announcement Banner Setup */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-amber-950 flex items-center gap-1.5">
                <span>{isGu ? 'ટોચની સૂચના પટ્ટી (Top Notice Banner)' : 'Notice Banner'}</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAnnouncementActive}
                  onChange={(e) => setForm({ ...form, isAnnouncementActive: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold text-amber-900">{isGu ? 'દર્શાવો' : 'Active'}</span>
              </label>
            </div>
            <textarea
              rows={2}
              value={form.announcementTextGu}
              onChange={(e) => setForm({ ...form, announcementTextGu: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-amber-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-600"
            />
          </div>

          {/* Operator Security PIN change */}
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">
              {isGu ? 'સંચાલક લોગિન સિક્યોરિટી પિન (Security PIN)' : 'Operator Security PIN'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={6}
                value={formPin}
                onChange={(e) => setFormPin(e.target.value.replace(/\D/g, ''))}
                className="w-32 text-xs font-mono font-bold px-3 py-1.5 border border-slate-300 rounded bg-white text-center"
              />
              <span className="text-[11px] text-slate-500">
                {isGu ? 'એડમિન પેનલમાં પ્રવેશવા માટે આ પિન જરૂરી રહેશે.' : 'Required for operator login.'}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
            >
              {isGu ? 'ડિફોલ્ટ રીસેટ' : 'Reset Defaults'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
              >
                {isGu ? 'રદ કરો' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>{isGu ? 'સાચવો' : 'Save'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

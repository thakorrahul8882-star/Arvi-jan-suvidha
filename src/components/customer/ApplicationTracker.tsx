import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { Search, CheckCircle2, Clock, AlertTriangle, FileText, Download, Printer, ArrowRight, ShieldCheck } from 'lucide-react';
import { ApplicationStatus, CSCApplication } from '../../types/csc';

interface ApplicationTrackerProps {
  initialSearchId?: string;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ initialSearchId = '' }) => {
  const { applications, setActiveReceiptApplication, language } = useCSC();
  const [searchTerm, setSearchTerm] = useState(initialSearchId);
  const [selectedApp, setSelectedApp] = useState<CSCApplication | null>(() => {
    if (initialSearchId) {
      return applications.find(a => a.id.toLowerCase() === initialSearchId.toLowerCase()) || null;
    }
    return applications[0] || null;
  });

  const isGu = language === 'gu';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const term = searchTerm.trim().toLowerCase();
    const found = applications.find(
      (a) => a.id.toLowerCase().includes(term) || a.mobile.replace(/\s+/g, '').includes(term.replace(/\s+/g, ''))
    );
    setSelectedApp(found || null);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return {
          label: isGu ? 'અરજી સબમિટ થઈ' : 'Submitted',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'verified':
        return {
          label: isGu ? 'દસ્તાવેજ ચકાસ્યા' : 'Verified',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'processing':
        return {
          label: isGu ? 'સરકારી પોર્ટલ પર પ્રોસેસમાં' : 'Under Processing',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'approved':
        return {
          label: isGu ? 'મંજૂર થયેલ / તૈયાર' : 'Approved / Ready',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'rejected':
        return {
          label: isGu ? 'અસ્વીકાર થયેલ' : 'Rejected',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
        };
    }
  };

  const steps: { key: ApplicationStatus; labelGu: string; labelEn: string }[] = [
    { key: 'submitted', labelGu: '૧. અરજી સબમિટ', labelEn: '1. Submitted' },
    { key: 'verified', labelGu: '૨. દસ્તાવેજ ચકાસણી', labelEn: '2. Verified' },
    { key: 'processing', labelGu: '૩. પોર્ટલ પ્રોસેસિંગ', labelEn: '3. In-Processing' },
    { key: 'approved', labelGu: '૪. પ્રમાણપત્ર તૈયાર', labelEn: '4. Ready / Approved' },
  ];

  const getStepState = (stepIndex: number, currentStatus: ApplicationStatus) => {
    const statusOrder: Record<ApplicationStatus, number> = {
      submitted: 0,
      verified: 1,
      processing: 2,
      approved: 3,
      rejected: -1,
    };

    if (currentStatus === 'rejected') return 'rejected';
    const currentOrder = statusOrder[currentStatus];
    if (stepIndex < currentOrder) return 'completed';
    if (stepIndex === currentOrder) return 'current';
    return 'upcoming';
  };

  return (
    <div id="tracker-section" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-600" />
            <span>{isGu ? 'અરજીનું લાઈવ સ્ટેટસ ટ્રેક કરો' : 'Live Application Status Tracker'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isGu
              ? 'તમારો એપ્લિકેશન નંબર (દા.ત. CSC-GJ-2026-1042) અથવા મોબાઈલ નંબર નાખીને સ્થિતિ જાણો'
              : 'Enter Application ID (e.g. CSC-GJ-2026-1042) or 10-digit mobile number'}
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={isGu ? 'CSC ID અથવા મોબાઇલ નંબર...' : 'CSC-GJ-2026-XXXX or Mobile...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-mono pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-slate-50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            {isGu ? 'શોધો' : 'Track'}
          </button>
        </form>
      </div>

      {/* Selected Application Card */}
      {selectedApp ? (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="bg-slate-50 rounded-lg p-4 sm:p-5 border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                  <span>ID: <strong className="text-slate-900">{selectedApp.id}</strong></span>
                  <span>·</span>
                  <span>સબમિટ: {selectedApp.submittedDate}</span>
                  {selectedApp.govtApplicationNo && (
                    <>
                      <span>·</span>
                      <span>સરકારી Ref: {selectedApp.govtApplicationNo}</span>
                    </>
                  )}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  {isGu ? selectedApp.serviceTitleGu : selectedApp.serviceTitleEn}
                </h4>
                <div className="text-xs text-slate-600 mt-1">
                  અરજદાર: <strong className="text-slate-900">{selectedApp.customerName}</strong> ({selectedApp.address.village}, {selectedApp.address.taluka}) · ફોન: <span className="font-mono">{selectedApp.mobile}</span>
                </div>
              </div>

              {/* Status Badge & Receipt Action */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                    getStatusBadge(selectedApp.status).color
                  }`}
                >
                  {getStatusBadge(selectedApp.status).label}
                </span>

                <button
                  onClick={() => setActiveReceiptApplication(selectedApp)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-medium text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isGu ? 'પહોંચ (Receipt)' : 'Receipt'}</span>
                </button>
              </div>
            </div>

            {/* Visual Step Progress Tracker */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {steps.map((step, idx) => {
                  const state = getStepState(idx, selectedApp.status);
                  return (
                    <div key={step.key} className="relative">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                            state === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : state === 'current'
                              ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                              : state === 'rejected'
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {state === 'completed' ? '✓' : idx + 1}
                        </div>
                        <span
                          className={`text-xs font-semibold truncate ${
                            state === 'completed' || state === 'current'
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {isGu ? step.labelGu : step.labelEn}
                        </span>
                      </div>
                      <div
                        className={`h-1.5 rounded-full ${
                          state === 'completed'
                            ? 'bg-emerald-500'
                            : state === 'current'
                            ? 'bg-amber-400'
                            : 'bg-slate-200'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Approved Certificate Download Banner */}
            {selectedApp.status === 'approved' && (
              <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950">
                      {isGu ? 'અભિનંદન! તમારું પ્રમાણપત્ર તૈયાર થઈ ગયું છે' : 'Certificate Approved & Ready!'}
                    </h5>
                    <p className="text-[11px] text-emerald-800">
                      {selectedApp.remarks || (isGu ? 'તમે ડિજિટલ સહી વાળું પ્રમાણપત્ર અહીંથી ડાઉનલોડ કરી શકો છો અથવા કેન્દ્ર પરથી મેળવી શકો છો.' : 'Download digitally signed certificate.')}
                    </p>
                  </div>
                </div>
                <a
                  href={`#cert-${selectedApp.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(isGu ? `પ્રમાણપત્ર [${selectedApp.approvedCertificateName || 'Official_Certificate.pdf'}] ડાઉનલોડ થઈ રહ્યું છે!` : 'Downloading official certificate PDF!');
                  }}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGu ? 'પ્રમાણપત્ર ડાઉનલોડ કરો (PDF)' : 'Download Certificate'}</span>
                </a>
              </div>
            )}

            {/* Rejected Info Banner */}
            {selectedApp.status === 'rejected' && (
              <div className="mt-5 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-rose-950">
                    {isGu ? 'અરજી અસ્વીકાર / પુનઃ ચકાસણી જરૂરી' : 'Application Needs Correction'}
                  </h5>
                  <p className="text-[11px] text-rose-800 mt-0.5">
                    {selectedApp.remarks || (isGu ? 'અધૂરા દસ્તાવેજને કારણે અરજી અટકેલ છે. કૃપા કરીને સુધારેલા કાગળો સાથે કેન્દ્રનો સંપર્ક કરો.' : 'Please visit center with correct documents.')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Timeline History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {isGu ? 'વિગતવાર પ્રોસેસિંગ હિસ્ટ્રી' : 'Application Audit & Timeline'}
            </h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {selectedApp.timeline.map((event, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-slate-900 ring-4 ring-white" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-slate-900">
                      {isGu ? event.titleGu : event.titleEn}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{event.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {isGu ? event.descriptionGu : event.descriptionEn}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    અપડેટ દ્વારા: {event.updatedBy}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <p className="text-xs font-medium">
            {isGu ? 'કોઈ અરજી મળી નથી. સાચો અરજી નંબર અથવા ૧૦ આંકડાનો મોબાઈલ નંબર દાખલ કરો.' : 'No application found. Please check application ID or mobile number.'}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-slate-400">{isGu ? 'સેમ્પલ ID ટ્રાય કરો:' : 'Try sample ID:'}</span>
            {applications.slice(0, 3).map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setSearchTerm(a.id);
                  setSelectedApp(a);
                }}
                className="text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer"
              >
                {a.id}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

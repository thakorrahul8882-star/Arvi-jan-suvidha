import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { CSCApplication, ApplicationStatus, PaymentStatus, PaymentMethod } from '../../types/csc';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Printer, 
  MessageSquare, 
  Upload, 
  FileCheck, 
  ArrowRight, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';

interface ApplicationDetailModalProps {
  application: CSCApplication | null;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({ application, onClose }) => {
  const { 
    updateApplicationStatus, 
    updateApplicationPayment, 
    deleteApplication, 
    setActiveReceiptApplication, 
    language,
    centerSettings 
  } = useCSC();
  const isGu = language === 'gu';

  if (!application) return null;

  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(application.status);
  const [remarks, setRemarks] = useState(application.remarks || '');
  const [govtRef, setGovtRef] = useState(application.govtApplicationNo || '');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(application.paymentStatus);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(application.paymentMethod || 'cash');
  const [certFileName, setCertFileName] = useState(application.approvedCertificateName || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleStatusSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplicationStatus(
      application.id,
      currentStatus,
      remarks.trim(),
      govtRef.trim() || undefined,
      certFileName ? { name: certFileName, url: `#cert-${application.id}` } : undefined
    );
    updateApplicationPayment(application.id, paymentStatus, paymentMethod);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(isGu ? 'શું તમે આ અરજી ખરેખર ડિલીટ કરવા માંગો છો?' : 'Are you sure you want to delete this application?')) {
      deleteApplication(application.id);
      onClose();
    }
  };

  // WhatsApp Alert Generator
  const getWhatsAppLink = () => {
    const statusTextGu = {
      submitted: 'સબમિટ થયેલ છે અને ચકાસણી હેઠળ છે',
      verified: 'દસ્તાવેજો ચકાસાઈ ગયા છે અને આગળ મોકલાયેલ છે',
      processing: 'સરકારી પોર્ટલ પર પ્રોસેસિંગમાં છે',
      approved: 'મંજૂર થઈ ગયેલ છે અને ડાઉનલોડ કરવા તૈયાર છે',
      rejected: 'અધૂરા કાગળને કારણે અટકેલ છે, કૃપા કરીને સંપર્ક કરો',
    }[currentStatus];

    const message = `નમસ્તે ${application.customerName}જી,\nતમારી ${application.serviceTitleGu} માટેની અરજી (ID: ${application.id}) નું સ્ટેટસ હાલમાં "${statusTextGu}".\nનોંધ: ${remarks || 'કોઈ વધારાની નોંધ નથી.'}\n- ${centerSettings.centerName} (ફોન: ${centerSettings.mobile})`;

    return `https://wa.me/91${application.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-amber-400 font-bold">{application.id}</span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-300">{application.submittedDate}</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg">
              {isGu ? application.serviceTitleGu : application.serviceTitleEn}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Notice */}
        {isSavedNotice && (
          <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-medium">
            ✓ {isGu ? 'અરજી સફળતાપૂર્વક અપડેટ થઈ ગઈ છે!' : 'Application updated successfully!'}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Customer Profile Summary */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              {isGu ? 'અરજદારની વિગતો' : 'Applicant Information'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-700">
              <div>
                <span className="text-slate-500 block text-[10px]">{isGu ? 'પૂરું નામ:' : 'Full Name:'}</span>
                <strong className="text-slate-900">{application.customerName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">{isGu ? 'પિતા / પતિ:' : 'Father/Husband:'}</span>
                <span>{application.fatherOrHusbandName || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">{isGu ? 'મોબાઇલ:' : 'Mobile:'}</span>
                <span className="font-mono font-semibold">{application.mobile}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">{isGu ? 'સરનામું:' : 'Address:'}</span>
                <span>{application.address.village}, {application.address.taluka}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">{isGu ? 'આધાર અંક:' : 'Aadhaar:'}</span>
                <span className="font-mono">XXXX-{application.aadhaarLast4 || 'NA'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">{isGu ? 'અપેક્ષિત તારીખ:' : 'Target Date:'}</span>
                <span className="font-mono">{application.expectedDate}</span>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <span className="text-slate-500 block text-[10px] mb-1">
                {isGu ? 'જમા કરેલા દસ્તાવેજો:' : 'Submitted Documents:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {application.attachedDocuments.map((doc, idx) => (
                  <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-700">
                    ✓ {doc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Status & Processing Form */}
          <form onSubmit={handleStatusSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  {isGu ? 'અરજીની સ્થિતિ (Application Status) *' : 'Application Status *'}
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as ApplicationStatus)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="submitted">{isGu ? '૧. અરજી સબમિટ (Submitted)' : '1. Submitted'}</option>
                  <option value="verified">{isGu ? '૨. દસ્તાવેજ ચકાસ્યા (Verified)' : '2. Verified'}</option>
                  <option value="processing">{isGu ? '૩. પોર્ટલ પ્રોસેસિંગમાં (Processing)' : '3. Processing'}</option>
                  <option value="approved">{isGu ? '૪. પ્રમાણપત્ર તૈયાર / મંજૂર (Approved)' : '4. Approved / Ready'}</option>
                  <option value="rejected">{isGu ? '૫. અસ્વીકાર / રદ (Rejected)' : '5. Rejected'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  {isGu ? 'સરકારી એપ્લિકેશન રેફરન્સ નંબર' : 'Govt Portal Reference No.'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. MAM/KALOL/2026/INC/4921"
                  value={govtRef}
                  onChange={(e) => setGovtRef(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Operator Remarks */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                {isGu ? 'સંચાલકની નોંધ / ગ્રાહકને સંદેશ (Customer Remarks)' : 'Operator Remarks / Notes to Customer'}
              </label>
              <textarea
                rows={2}
                placeholder={isGu ? 'દા.ત. પ્રમાણપત્ર મંજૂર થઈ ગયું છે. કેન્દ્ર પરથી મેળવી લેવું.' : 'Enter status remarks...'}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Certificate Upload Field (if status is approved) */}
            {currentStatus === 'approved' && (
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  {isGu ? 'તૈયાર પ્રમાણપત્ર ફાઈલ (Certificate Attachment)' : 'Approved Certificate Attachment'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Income_Certificate_2026.pdf"
                    value={certFileName || `${application.serviceId}_${application.id}.pdf`}
                    onChange={(e) => setCertFileName(e.target.value)}
                    className="flex-1 text-xs font-mono px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-emerald-900"
                  />
                  <span className="text-[11px] text-emerald-800 font-medium">
                    {isGu ? 'ગ્રાહક ટ્રેકરમાં ડાઉનલોડ થશે' : 'Available for customer download'}
                  </span>
                </div>
              </div>
            )}

            {/* Payment Record */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  {isGu ? 'પેમેન્ટ સ્થિતિ અને ફી' : 'Payment Status & Fees'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">
                  કુલ: ₹{application.amount}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">{isGu ? 'સ્થિતિ:' : 'Status:'}</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="paid">{isGu ? 'ચૂકવી દીધી (Paid)' : 'Paid'}</option>
                    <option value="unpaid">{isGu ? 'બાકી છે (Unpaid)' : 'Unpaid'}</option>
                    <option value="refunded">{isGu ? 'રિફંડ (Refunded)' : 'Refunded'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">{isGu ? 'પદ્ધતિ:' : 'Method:'}</label>
                  <select
                    value={paymentMethod}
                    disabled={paymentStatus !== 'paid'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white disabled:opacity-50"
                  >
                    <option value="cash">{isGu ? 'રોકડ (Cash)' : 'Cash'}</option>
                    <option value="upi">{isGu ? 'UPI / QR' : 'UPI'}</option>
                    <option value="online">{isGu ? 'ઓનલાઇન' : 'Online'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                {/* Print Receipt Button */}
                <button
                  type="button"
                  onClick={() => setActiveReceiptApplication(application)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isGu ? 'પહોંચ પ્રિન્ટ' : 'Print Receipt'}</span>
                </button>

                {/* WhatsApp Alert Button */}
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isGu ? 'વોટ્સએપ અપડેટ મોકલો' : 'WhatsApp Alert'}</span>
                </a>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  {isGu ? 'બંધ કરો' : 'Close'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isGu ? 'સેવ કરો (Save Changes)' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { X, CheckCircle2, FileText, ArrowRight, Printer } from 'lucide-react';
import { PaymentMethod } from '../../types/csc';

interface WalkInEntryModalProps {
  onClose: () => void;
  onSuccess: (appId: string) => void;
}

export const WalkInEntryModal: React.FC<WalkInEntryModalProps> = ({ onClose, onSuccess }) => {
  const { services, submitApplication, language, setActiveReceiptApplication } = useCSC();
  const isGu = language === 'gu';

  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'income-cert');
  const [customerName, setCustomerName] = useState('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [village, setVillage] = useState('કલોલ');
  const [taluka, setTaluka] = useState('કલોલ');
  const [district, setDistrict] = useState('ગાંધીનગર');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('paid');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [operatorNotes, setOperatorNotes] = useState('');

  const currentService = services.find(s => s.id === selectedServiceId) || services[0];
  const standardFee = currentService ? (currentService.govtFee + currentService.cscCharge) : 50;
  const finalFee = customAmount !== null ? customAmount : standardFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !mobile) return;

    const now = new Date();
    const expected = new Date(now.getTime() + (currentService?.deliveryDays || 3) * 24 * 60 * 60 * 1000);

    const newApp = submitApplication({
      serviceId: currentService.id,
      serviceTitleGu: currentService.titleGu,
      serviceTitleEn: currentService.titleEn,
      customerName: customerName.trim(),
      fatherOrHusbandName: fatherOrHusbandName.trim() || undefined,
      mobile: mobile.trim(),
      aadhaarLast4: aadhaarLast4.trim() || undefined,
      address: {
        village: village.trim(),
        taluka: taluka.trim(),
        district: district.trim(),
        pincode: '382721',
      },
      expectedDate: expected.toISOString().split('T')[0],
      paymentStatus,
      paymentMethod: paymentStatus === 'paid' ? paymentMethod : undefined,
      amount: finalFee,
      remarks: operatorNotes.trim() || (isGu ? 'કાઉન્ટર પર રૂબરૂ નોંધણી થઈ' : 'Counter Walk-in Registration'),
      attachedDocuments: currentService.documents.map(d => d.nameGu),
    });

    onSuccess(newApp.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 block">
                {isGu ? 'VLE કાઉન્ટર એન્ટ્રી' : 'VLE Fast Walk-in Entry'}
              </span>
              <h3 className="font-bold text-base">
                {isGu ? 'રૂબરૂ આવેલ નાગરિકની નવી અરજી' : 'New Walk-in Application'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isGu ? 'સરકારી સેવા પસંદ કરો *' : 'Select Service *'}
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => {
                setSelectedServiceId(e.target.value);
                setCustomAmount(null);
              }}
              className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {isGu ? s.titleGu : s.titleEn} (₹{s.govtFee + s.cscCharge})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isGu ? 'અરજદારનું પૂરું નામ *' : 'Applicant Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={isGu ? 'દા.ત. રમેશભાઈ પટેલ' : 'Ramesh Patel'}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isGu ? 'પિતા / પતિનું નામ' : 'Father / Husband Name'}
              </label>
              <input
                type="text"
                placeholder={isGu ? 'બાબુભાઈ પટેલ' : 'Babubhai Patel'}
                value={fatherOrHusbandName}
                onChange={(e) => setFatherOrHusbandName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isGu ? 'મોબાઇલ નંબર *' : 'Mobile Number *'}
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isGu ? 'આધાર કાર્ડ છેલ્લા ૪ આંકડા' : 'Aadhaar Last 4'}
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="XXXX-1234"
                value={aadhaarLast4}
                onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-slate-600 mb-1">{isGu ? 'ગામ' : 'Village'}</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">{isGu ? 'તાલુકો' : 'Taluka'}</label>
              <input
                type="text"
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">{isGu ? 'જિલ્લો' : 'District'}</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {isGu ? 'ફી કલેક્શન (Payment Collection)' : 'Payment Collection'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{isGu ? 'રકમ:' : 'Amount:'}</span>
                <input
                  type="number"
                  value={finalFee}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-20 text-xs font-mono font-bold px-2 py-1 border border-slate-300 rounded bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">{isGu ? 'સ્થિતિ' : 'Status'}</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as 'paid' | 'unpaid')}
                  className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="paid">{isGu ? 'ચૂકવી દીધી (Paid)' : 'Paid'}</option>
                  <option value="unpaid">{isGu ? 'બાકી છે (Unpaid)' : 'Unpaid'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">{isGu ? 'પદ્ધતિ' : 'Method'}</label>
                <select
                  value={paymentMethod}
                  disabled={paymentStatus !== 'paid'}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white disabled:opacity-50"
                >
                  <option value="cash">{isGu ? 'રોકડ (Cash)' : 'Cash'}</option>
                  <option value="upi">{isGu ? 'UPI / QR' : 'UPI / QR'}</option>
                  <option value="online">{isGu ? 'ઓનલાઇન' : 'Online'}</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">
              {isGu ? 'સંચાલકની નોંધ (ઓપ્શનલ)' : 'Operator Notes'}
            </label>
            <input
              type="text"
              placeholder={isGu ? 'દા.ત. અસલ ડોક્યુમેન્ટ જોઈને ફોર્મ ભર્યું' : 'Optional internal notes'}
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-600 font-semibold hover:text-slate-900"
            >
              {isGu ? 'રદ કરો' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{isGu ? 'અરજી બનાવો અને પહોંચ આપો' : 'Create & Issue Receipt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

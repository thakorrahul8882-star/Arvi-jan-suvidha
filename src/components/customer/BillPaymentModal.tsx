import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { Zap, X, CheckCircle2, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface BillPaymentModalProps {
  onClose: () => void;
  onSuccess: (appId: string) => void;
}

export const BillPaymentModal: React.FC<BillPaymentModalProps> = ({ onClose, onSuccess }) => {
  const { submitApplication, language } = useCSC();
  const isGu = language === 'gu';

  const [provider, setProvider] = useState('UGVCL');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const providers = [
    { id: 'UGVCL', name: 'UGVCL - ઉત્તર ગુજરાત વીજ કંપની' },
    { id: 'PGVCL', name: 'PGVCL - પશ્ચિમ ગુજરાત વીજ કંપની' },
    { id: 'DGVCL', name: 'DGVCL - દક્ષિણ ગુજરાત વીજ કંપની' },
    { id: 'MGVCL', name: 'MGVCL - મધ્ય ગુજરાત વીજ કંપની' },
    { id: 'TORRENT', name: 'ટોરેન્ટ પાવર (અમદાવાદ/સુરત)' },
    { id: 'GUJGAS', name: 'ગુજરાત ગેસ / અદાણી ગેસ લિમિટેડ' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerNumber.trim()) {
      setError(isGu ? 'ગ્રાહક નંબર (Consumer No.) દાખલ કરો.' : 'Please enter consumer number.');
      return;
    }
    if (!customerName.trim()) {
      setError(isGu ? 'ગ્રાહકનું નામ દાખલ કરો.' : 'Please enter customer name.');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setError(isGu ? 'માન્ય ૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો.' : 'Please enter 10-digit mobile number.');
      return;
    }
    const amt = parseFloat(billAmount);
    if (isNaN(amt) || amt <= 0) {
      setError(isGu ? 'માન્ય બિલ રકમ દાખલ કરો.' : 'Please enter valid bill amount.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newApp = submitApplication({
        serviceId: 'utility-bill-pay',
        serviceTitleGu: `${provider} વીજળી બિલ ભરપાઈ (${consumerNumber})`,
        serviceTitleEn: `${provider} Electricity Bill Payment (${consumerNumber})`,
        customerName: customerName.trim(),
        mobile: mobile.trim(),
        address: {
          village: 'કલોલ',
          taluka: 'કલોલ',
          district: 'ગાંધીનગર',
          pincode: '382721',
        },
        expectedDate: new Date().toISOString().split('T')[0],
        paymentStatus: 'paid',
        paymentMethod: paymentMode,
        amount: amt + 15, // Bill amount + 15 CSC convenience charge
        remarks: `બિલ નંબર: ${consumerNumber} સફળતાપૂર્વક ભરપાઈ થયું. ટ્રાન્ઝેક્શન રેફરન્સ જનરેટ થયો.`,
        attachedDocuments: [`વીજળી બિલ: ${consumerNumber}`],
        govtApplicationNo: `BBPS/${provider}/${Date.now().toString().slice(-8)}`,
      });

      setIsSubmitting(false);
      onSuccess(newApp.id);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">
              {isGu ? 'વીજળી / ગેસ બિલ ભરપાઈ (BBPS)' : 'Electricity & Gas Bill Payment'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isGu ? 'વીજ કંપની અથવા ગેસ કંપની પસંદ કરો *' : 'Select Provider *'}
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isGu ? 'ગ્રાહક નંબર / Consumer No. (બિલ પરથી જુઓ) *' : 'Consumer Number (11 Digits) *'}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 10293847561"
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full text-sm font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isGu ? 'ગ્રાહકનું નામ *' : 'Customer Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={isGu ? 'દા.ત. રમેશભાઈ પટેલ' : 'Ramesh Patel'}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
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
                className="w-full text-sm font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isGu ? 'ભરવાની બિલ રકમ (₹) *' : 'Bill Amount (₹) *'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-slate-400 font-mono">₹</span>
              <input
                type="number"
                required
                min="10"
                step="1"
                placeholder="750"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="w-full text-sm font-mono pl-7 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              + ₹૧૫ CSC ડિજિટલ સેવા કન્વીનિયન્સ ચાર્જ ઉમેરાશે.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isGu ? 'ચુકવણી પદ્ધતિ' : 'Payment Mode'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('upi')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center ${
                  paymentMode === 'upi'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                UPI / QR સ્કેન
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('cash')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center ${
                  paymentMode === 'cash'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                રોકડ (Cash Counter)
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-600 font-semibold hover:text-slate-900"
            >
              {isGu ? 'રદ કરો' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <span>{isSubmitting ? (isGu ? 'પ્રોસેસિંગ...' : 'Processing...') : (isGu ? 'બિલ ભરો અને રસીદ લો' : 'Pay & Get Receipt')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

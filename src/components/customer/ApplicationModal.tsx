import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { CSCService, PaymentMethod, PaymentStatus } from '../../types/csc';
import { 
  X, 
  CheckCircle2, 
  Upload, 
  FileText, 
  AlertCircle, 
  ArrowRight, 
  QrCode, 
  CreditCard, 
  Banknote, 
  ShieldCheck 
} from 'lucide-react';

interface ApplicationModalProps {
  service: CSCService | null;
  onClose: () => void;
  onSuccess: (appId: string) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ service, onClose, onSuccess }) => {
  const { submitApplication, language, centerSettings } = useCSC();
  const isGu = language === 'gu';

  // Personal Info
  const [customerName, setCustomerName] = useState('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('');

  // Address
  const [village, setVillage] = useState('');
  const [taluka, setTaluka] = useState('કલોલ');
  const [district, setDistrict] = useState('ગાંધીનગર');
  const [pincode, setPincode] = useState('382721');

  // Documents
  const [selectedDocs, setSelectedDocs] = useState<string[]>(
    service?.documents.filter(d => d.mandatory).map(d => d.nameGu) || []
  );
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([]);

  // Payment Options
  const [paymentChoice, setPaymentChoice] = useState<'upi' | 'online' | 'cash'>('upi');
  const [upiUtr, setUpiUtr] = useState('');
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(true);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!service) return null;

  const totalFee = service.govtFee + service.cscCharge;

  const toggleDoc = (docName: string) => {
    setSelectedDocs(prev => 
      prev.includes(docName) ? prev.filter(d => d !== docName) : [...prev, docName]
    );
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.type || 'document/pdf'
      }));
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError(isGu ? 'કૃપા કરીને અરજદારનું પૂરું નામ દાખલ કરો.' : 'Please enter applicant name.');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setError(isGu ? 'કૃપા કરીને માન્ય ૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો.' : 'Please enter valid 10-digit mobile number.');
      return;
    }
    if (!village.trim()) {
      setError(isGu ? 'કૃપા કરીને ગામ/શહેરનું નામ દાખલ કરો.' : 'Please enter village or city.');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const expected = new Date(now.getTime() + service.deliveryDays * 24 * 60 * 60 * 1000);
    const expectedDateStr = expected.toISOString().split('T')[0];

    // Determine payment status based on chosen option
    let finalPaymentStatus: PaymentStatus = 'unpaid';
    let finalPaymentMethod: PaymentMethod = 'cash';

    if (paymentChoice === 'upi') {
      finalPaymentStatus = isPaymentCompleted ? 'paid' : 'unpaid';
      finalPaymentMethod = 'upi';
    } else if (paymentChoice === 'online') {
      finalPaymentStatus = 'paid';
      finalPaymentMethod = 'online';
    } else {
      finalPaymentStatus = 'unpaid';
      finalPaymentMethod = 'cash';
    }

    const paymentRemark = upiUtr.trim() ? ` [UPI Ref: ${upiUtr.trim()}]` : '';
    const fullRemarks = (notes.trim() ? `${notes.trim()}` : '') + paymentRemark;

    setTimeout(() => {
      const newApp = submitApplication({
        serviceId: service.id,
        serviceTitleGu: service.titleGu,
        serviceTitleEn: service.titleEn,
        customerName: customerName.trim(),
        fatherOrHusbandName: fatherOrHusbandName.trim() || undefined,
        mobile: mobile.trim(),
        email: email.trim() || undefined,
        aadhaarLast4: aadhaarLast4.trim() || undefined,
        address: {
          village: village.trim(),
          taluka: taluka.trim(),
          district: district.trim(),
          pincode: pincode.trim(),
        },
        expectedDate: expectedDateStr,
        paymentStatus: finalPaymentStatus,
        paymentMethod: finalPaymentMethod,
        amount: totalFee,
        remarks: fullRemarks || undefined,
        attachedDocuments: selectedDocs,
        uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });

      setIsSubmitting(false);
      onSuccess(newApp.id);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block">
              {isGu ? 'ઓનલાઇન સેવા અરજી & પેમેન્ટ' : 'Service Application & Payment'}
            </span>
            <h3 className="font-bold text-base sm:text-lg">
              {isGu ? service.titleGu : service.titleEn}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing & Delivery Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500">{isGu ? 'સરકારી ફી:' : 'Govt Fee:'} </span>
              <strong className="font-mono text-slate-800">₹{service.govtFee}</strong>
            </div>
            <div>
              <span className="text-slate-500">{isGu ? 'સેવા ચાર્જ:' : 'CSC Fee:'} </span>
              <strong className="font-mono text-slate-800">₹{service.cscCharge}</strong>
            </div>
            <div>
              <span className="text-slate-500">{isGu ? 'કુલ રકમ:' : 'Total:'} </span>
              <strong className="font-mono text-emerald-700 font-bold text-sm">₹{totalFee}</strong>
            </div>
          </div>
          <div className="font-mono text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
            ⏱️ {isGu ? `અપેક્ષિત સમય: ${service.deliveryDays} દિવસ` : `Estimated: ${service.deliveryDays} days`}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Personal Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {isGu ? '૧. અરજદારની વ્યક્તિગત માહિતી' : '1. Applicant Personal Details'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isGu ? 'અરજદારનું પૂરું નામ *' : 'Applicant Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isGu ? 'દા.ત. રમેશભાઈ બાબુભાઈ પટેલ' : 'e.g. Ramesh Patel'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isGu ? 'પિતા / પતિનું નામ' : "Father / Husband Name"}
                </label>
                <input
                  type="text"
                  placeholder={isGu ? 'દા.ત. બાબુભાઈ પટેલ' : "e.g. Babubhai Patel"}
                  value={fatherOrHusbandName}
                  onChange={(e) => setFatherOrHusbandName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isGu ? 'મોબાઇલ નંબર (વોટ્સએપ અપડેટ માટે) *' : 'Mobile Number (for updates) *'}
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-sm px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isGu ? 'આધાર કાર્ડના છેલ્લા ૪ આંકડા' : 'Aadhaar Last 4 Digits'}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="XXXX-XXXX-1234"
                  value={aadhaarLast4}
                  onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-sm px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Address */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {isGu ? '૨. રહેઠાણનું સરનામું' : '2. Residential Address'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">{isGu ? 'ગામ / શહેર *' : 'Village/City *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isGu ? 'કલોલ' : 'Kalol'}
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full text-sm px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">{isGu ? 'તાલુકો' : 'Taluka'}</label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full text-sm px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">{isGu ? 'જિલ્લો' : 'District'}</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-sm px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">{isGu ? 'પીનકોડ' : 'Pincode'}</label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-sm px-3 py-1.5 font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Document Checklist & Upload */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {isGu ? '૩. જરૂરી કાગળોની ચેકલિસ્ટ' : '3. Required Documents'}
            </h4>
            <div className="space-y-2 mb-3">
              {service.documents.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.nameGu)}
                    onChange={() => toggleDoc(doc.nameGu)}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                  />
                  <span className="font-medium text-slate-800">
                    {isGu ? doc.nameGu : doc.nameEn}
                  </span>
                  {doc.mandatory && (
                    <span className="text-[10px] text-red-600 font-semibold uppercase ml-auto">
                      {isGu ? 'ફરજિયાત' : 'Mandatory'}
                    </span>
                  )}
                </label>
              ))}
            </div>

            {/* Simulated File Attachment */}
            <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50/50">
              <label className="cursor-pointer flex flex-col items-center">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-700 font-medium">
                  {isGu ? 'કાગળોનો ફોટો / PDF અપલોડ કરો (ઓપ્શનલ)' : 'Attach Photo or PDF (Optional)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isGu ? 'અથવા તમે રૂબરૂ કેન્દ્ર પર પણ કાગળો જમા કરાવી શકો છો.' : 'Or bring physical copies to center.'}
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleSimulatedFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedFiles.length > 0 && (
                <div className="mt-2 text-left space-y-1">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="text-[11px] text-slate-700 flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200 font-mono">
                      <span>📄 {f.name}</span>
                      <span className="text-slate-400">{f.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Extra Remarks */}
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              {isGu ? 'વિશેષ નોંધ અથવા પ્રશ્ન (ઓપ્શનલ)' : 'Any Additional Remark / Note'}
            </label>
            <textarea
              rows={2}
              placeholder={isGu ? 'દા.ત. કોલેજ સ્કોલરશીપ માટે તાકીદે દાખલો જરૂરી છે...' : 'e.g. Urgent requirement for admission...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Section 5: PAYMENT OPTION & FEE COLLECTION (નવું પેમેન્ટ સેક્શન) */}
          <div className="p-4 bg-gradient-to-br from-amber-50/50 via-slate-50 to-emerald-50/40 rounded-xl border-2 border-slate-300 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>{isGu ? '૪. ફી ચુકવણી પદ્ધતિ (Select Payment Option) *' : '4. Payment Method *'}</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isGu ? 'સરકારી ફી અને CSC પ્રોસેસિંગ ચાર્જ ભરવાનો વિકલ્પ પસંદ કરો' : 'Choose your payment method'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">{isGu ? 'ચૂકવવાપાત્ર રકમ' : 'Amount Due'}</span>
                <span className="text-lg font-mono font-bold text-slate-950">₹{totalFee}.00</span>
              </div>
            </div>

            {/* Payment Choice Tabs */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {/* Option 1: UPI QR */}
              <button
                type="button"
                onClick={() => setPaymentChoice('upi')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  paymentChoice === 'upi'
                    ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>UPI / QR કોડ</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  GPay, PhonePe, Paytm
                </div>
              </button>

              {/* Option 2: Online */}
              <button
                type="button"
                onClick={() => setPaymentChoice('online')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  paymentChoice === 'online'
                    ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>ઓનલાઇન કાર્ડ / નેટ</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Net Banking, Cards
                </div>
              </button>

              {/* Option 3: Cash at Center */}
              <button
                type="button"
                onClick={() => setPaymentChoice('cash')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  paymentChoice === 'cash'
                    ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold">
                  <Banknote className="w-4 h-4 text-amber-600" />
                  <span>રૂબરૂ રોકડ (Cash)</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  કેન્દ્ર પર મુલાકાત વખતે
                </div>
              </button>
            </div>

            {/* UPI QR Display Card */}
            {paymentChoice === 'upi' && (
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Visual QR Code Box */}
                  <div className="w-28 h-28 border-2 border-slate-900 rounded-lg p-2 bg-white flex flex-col justify-between shrink-0 shadow-xs">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 bg-slate-900 rounded-xs"></div>
                      <div className="w-6 h-6 bg-slate-900 rounded-xs"></div>
                    </div>
                    <div className="text-[8px] font-mono text-center font-bold text-slate-900 tracking-wider">
                      ₹{totalFee} UPI
                    </div>
                    <div className="flex justify-between">
                      <div className="w-6 h-6 bg-slate-900 rounded-xs"></div>
                      <div className="w-3 h-3 bg-slate-900 rounded-xs"></div>
                    </div>
                  </div>

                  {/* QR Details */}
                  <div className="text-xs space-y-1.5 flex-1 text-center sm:text-left">
                    <div className="text-slate-800 font-bold">
                      {isGu ? 'કોઈપણ UPI એપ (GPay/PhonePe/Paytm) થી સ્કેન કરો' : 'Scan via Any UPI App'}
                    </div>
                    <div className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block">
                      UPI ID: <strong className="text-slate-900">{centerSettings.upiId}</strong>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      ✓ ચુકવણી રકમ: ₹{totalFee}.00
                    </div>
                  </div>
                </div>

                {/* UTR Input and Paid confirmation */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:flex-1">
                    <input
                      type="text"
                      placeholder={isGu ? 'UPI ટ્રાન્ઝેક્શન / UTR નં. (ઓપ્શનલ)' : 'Optional UPI UTR / Ref No.'}
                      value={upiUtr}
                      onChange={(e) => setUpiUtr(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800 shrink-0">
                    <input
                      type="checkbox"
                      checked={isPaymentCompleted}
                      onChange={(e) => setIsPaymentCompleted(e.target.checked)}
                      className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span>{isGu ? 'પેમેન્ટ પૂર્ણ કર્યું છે (Mark Paid)' : 'Payment Completed'}</span>
                  </label>
                </div>
              </div>
            )}

            {/* Online Gateway Simulated Card */}
            {paymentChoice === 'online' && (
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isGu ? 'ડિજિટલ પેમેન્ટ ગેટવે સુરક્ષિત છે' : 'Secured 256-bit Digital Gateway'}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {isGu
                    ? `રૂ. ${totalFee} ની રકમ ડેબિટ કાર્ડ, ક્રેડિટ કાર્ડ અથવા નેટ બેંકિંગ દ્વારા સફળતાપૂર્વક ચૂકવાશે અને પહોંચ જનરેટ થશે.`
                    : `Amount ₹${totalFee} will be charged and instant acknowledgement receipt issued.`}
                </p>
              </div>
            )}

            {/* Cash at Center Notice */}
            {paymentChoice === 'cash' && (
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-slate-800">
                  {isGu ? 'કેન્દ્ર પર મુલાકાત વખતે રોકડ ચૂકવણી' : 'Pay Cash at Center Counter'}
                </div>
                <p className="text-slate-600 text-[11px]">
                  {isGu
                    ? `તમારી અરજી નોંધાઈ જશે. તમે જ્યારે કેન્દ્ર પર અસલ કાગળો બતાવવા આવો ત્યારે રૂ. ${totalFee} રોકડ જમા કરાવી શકો છો.`
                    : `Application will be registered as Unpaid. You can pay ₹${totalFee} in cash upon visiting the center.`}
                </p>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              {isGu ? 'રદ કરો' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <span>
                {isSubmitting
                  ? (isGu ? 'પ્રોસેસ થઈ રહ્યું છે...' : 'Processing...')
                  : (isGu ? `₹${totalFee} ભરો અને અરજી સબમિટ કરો` : `Pay ₹${totalFee} & Submit`)}
              </span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

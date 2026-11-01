import React from 'react';
import { useCSC } from '../../context/CSCContext';
import { Printer, X, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

export const PrintReceiptModal: React.FC = () => {
  const { activeReceiptApplication, setActiveReceiptApplication, centerSettings, language } = useCSC();

  if (!activeReceiptApplication) return null;

  const app = activeReceiptApplication;
  const isGu = language === 'gu';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Action Header - Not Printed */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-base">
              {isGu ? 'ડિજિટલ સેવા પહોંચ / સ્વીકૃતિ પાવતી' : 'Official CSC Acknowledgement Receipt'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isGu ? 'પ્રિન્ટ કરો (Ctrl+P)' : 'Print Receipt'}</span>
            </button>
            <button
              onClick={() => setActiveReceiptApplication(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-white text-slate-900 font-sans">
          {/* Header Block with Emblems */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-md flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold uppercase tracking-tight text-slate-900">
                    {centerSettings.centerName}
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    {centerSettings.addressGu}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ફોન: {centerSettings.mobile} | Email: {centerSettings.email}
                  </p>
                </div>
              </div>

              {/* VLE Credentials Box */}
              <div className="text-right text-xs font-mono border border-slate-300 rounded p-2 bg-slate-50 shrink-0">
                <div className="font-bold text-slate-800">CSC E-GOVERNANCE</div>
                <div>VLE: {centerSettings.vleId}</div>
                <div>CSC ID: {centerSettings.cscId}</div>
                <div className="text-emerald-700 font-bold">DIGITAL SEVA KENDRA</div>
              </div>
            </div>

            <div className="mt-3 py-1 text-center bg-slate-100 rounded text-xs font-bold uppercase tracking-wider text-slate-800 border border-slate-200">
              નાગરિક સેવા સ્વીકૃતિ પાવતી / CITIZEN SERVICE RECEIPT & ACKNOWLEDGEMENT
            </div>
          </div>

          {/* Acknowledgement Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-5 border-b border-slate-200 pb-4">
            <div>
              <span className="text-slate-500 block text-[11px]">અરજી ક્રમાંક (Application ID):</span>
              <span className="font-mono font-bold text-sm text-slate-900">{app.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">તારીખ અને સમય (Submitted At):</span>
              <span className="font-mono text-slate-800">{app.submittedDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">સરકારી રેફરન્સ નં:</span>
              <span className="font-mono font-semibold text-slate-800">
                {app.govtApplicationNo || 'પ્રોસેસિંગ હેઠળ'}
              </span>
            </div>
          </div>

          {/* Citizen Details */}
          <div className="mb-5 text-xs">
            <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>૧. અરજદારની વિગત (Applicant Details)</span>
              <span className="font-mono text-slate-500">આધાર: XXXX-XXXX-{app.aadhaarLast4 || 'NA'}</span>
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-700">
              <div><strong className="text-slate-900">અરજદારનું પૂરું નામ:</strong> {app.customerName}</div>
              <div><strong className="text-slate-900">પિતા / પતિનું નામ:</strong> {app.fatherOrHusbandName || '-'}</div>
              <div><strong className="text-slate-900">મોબાઇલ નંબર:</strong> <span className="font-mono">{app.mobile}</span></div>
              <div><strong className="text-slate-900">ગામ / સરનામું:</strong> {app.address.village}, {app.address.taluka}, {app.address.district}</div>
            </div>
          </div>

          {/* Service Details & Fee Breakdown */}
          <div className="mb-5 text-xs">
            <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">
              ૨. સેવાની વિગત અને ફી ની પહોંચ (Service & Fee Details)
            </h4>
            <table className="w-full text-left border border-slate-300 rounded">
              <thead className="bg-slate-100 text-slate-800 text-[11px]">
                <tr>
                  <th className="p-2 border-b border-slate-300">સેવાનું નામ (Service Description)</th>
                  <th className="p-2 border-b border-slate-300">અપેક્ષિત નિકાલ તારીખ</th>
                  <th className="p-2 border-b border-slate-300">પેમેન્ટ સ્થિતિ</th>
                  <th className="p-2 border-b border-slate-300 text-right">રકમ (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-medium text-slate-900">
                    {app.serviceTitleGu}
                    <div className="text-[10px] text-slate-500 font-mono">{app.serviceTitleEn}</div>
                  </td>
                  <td className="p-2 font-mono text-slate-700">{app.expectedDate}</td>
                  <td className="p-2">
                    <span className="font-semibold text-emerald-700">
                      {app.paymentStatus === 'paid' ? `ચૂકવેલ (${app.paymentMethod?.toUpperCase() || 'PAID'})` : 'બાકી (Unpaid)'}
                    </span>
                  </td>
                  <td className="p-2 font-mono text-right font-bold text-slate-900">₹{app.amount}.00</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={3} className="p-2 text-right">કુલ પ્રાપ્ત રકમ (Total Paid Amount):</td>
                  <td className="p-2 font-mono text-right text-slate-950">₹{app.amount}.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Submitted Documents Checklist */}
          <div className="mb-5 text-xs">
            <h4 className="font-bold text-slate-900 mb-1">૩. જમા કરેલા દસ્તાવેજો:</h4>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-700">
              {app.attachedDocuments.length > 0 ? (
                app.attachedDocuments.map((doc, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {doc}
                  </span>
                ))
              ) : (
                <span className="text-slate-500">બાયોમેટ્રિક / ઓનલાઇન આધાર ચકાસણી</span>
              )}
            </div>
          </div>

          {/* Operator Remarks if any */}
          {app.remarks && (
            <div className="mb-5 p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
              <strong className="text-slate-800">સંચાલકની નોંધ (Operator Remarks):</strong> {app.remarks}
            </div>
          )}

          {/* Footer Signature & QR Block */}
          <div className="border-t border-slate-300 pt-4 mt-6 flex items-end justify-between text-xs">
            {/* Visual QR Code Mock */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border border-slate-300 p-1 bg-white rounded flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-3 h-3 bg-slate-900"></div>
                  <div className="w-3 h-3 bg-slate-900"></div>
                </div>
                <div className="text-[7px] font-mono text-center text-slate-600 tracking-tighter">CSC VERIFY</div>
                <div className="flex justify-between">
                  <div className="w-3 h-3 bg-slate-900"></div>
                  <div className="w-1.5 h-1.5 bg-slate-900"></div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 max-w-xs">
                આ સ્લિપ કમ્પ્યુટર જનરેટેડ છે. અસલ પ્રમાણપત્ર મેળવતી વખતે આ સ્લિપ અથવા Application ID રજૂ કરવું જરૂરી રહેશે.
              </div>
            </div>

            <div className="text-center font-mono">
              <div className="font-script text-slate-400 text-sm mb-1 italic">VLE Authorized Seal</div>
              <div className="w-40 border-t border-dashed border-slate-400 pt-1 text-[11px] font-bold text-slate-800">
                {centerSettings.vleName}
              </div>
              <div className="text-[10px] text-slate-500">સંચાલક / VLE ડિજિટલ સેવા કેન્દ્ર</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            {isGu ? 'આ રસીદ ગ્રાહકને વોટ્સએપ પર પણ મોકલી શકો છો.' : 'You can print or save this receipt.'}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveReceiptApplication(null)}
              className="px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {isGu ? 'બંધ કરો' : 'Close'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isGu ? 'પ્રિન્ટ / PDF ડાઉનલોડ' : 'Print / Download'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { Users, Search, Phone, MessageSquare, Plus, FileText } from 'lucide-react';
import { CSCApplication } from '../../types/csc';

interface CustomerDirectoryProps {
  onSelectCustomerForApp: (customer: { name: string; mobile: string; village: string; father: string }) => void;
}

export const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({ onSelectCustomerForApp }) => {
  const { applications, language, centerSettings } = useCSC();
  const isGu = language === 'gu';

  const [search, setSearch] = useState('');

  // Group applications by mobile number to build customer records
  const customerMap: Record<string, {
    name: string;
    mobile: string;
    father: string;
    village: string;
    taluka: string;
    apps: CSCApplication[];
    totalPaid: number;
    lastActive: string;
  }> = {};

  applications.forEach((app) => {
    const key = app.mobile.replace(/\D/g, '');
    if (!customerMap[key]) {
      customerMap[key] = {
        name: app.customerName,
        mobile: app.mobile,
        father: app.fatherOrHusbandName || '',
        village: app.address.village,
        taluka: app.address.taluka,
        apps: [],
        totalPaid: 0,
        lastActive: app.submittedDate,
      };
    }
    customerMap[key].apps.push(app);
    if (app.paymentStatus === 'paid') {
      customerMap[key].totalPaid += app.amount;
    }
  });

  const customerList = Object.values(customerMap).filter((c) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.village.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>{isGu ? 'ગ્રાહકોની યાદી અને સંપર્ક ડેટાબેઝ' : 'Customer Directory & CRM'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isGu
              ? `કુલ ${customerList.length} નાગરિકો નોંધાયેલા છે. તેમના તમામ કેસ હિસ્ટ્રી અને સંપર્ક અહીં ઉપલબ્ધ છે.`
              : `${customerList.length} registered citizens with full service history`}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder={isGu ? 'નામ, મોબાઇલ અથવા ગામથી શોધો...' : 'Search by name, phone or village...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs px-3 pl-9 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">ગ્રાહકનું પૂરું નામ</th>
              <th className="py-2.5 px-3">મોબાઇલ નંબર</th>
              <th className="py-2.5 px-3">ગામ / સરનામું</th>
              <th className="py-2.5 px-3 text-center">કુલ અરજીઓ</th>
              <th className="py-2.5 px-3 text-right">ચૂકવેલ ફી (₹)</th>
              <th className="py-2.5 px-3 text-right">સંપર્ક / ક્રિયા</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {customerList.map((c) => (
              <tr key={c.mobile} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">{c.name}</div>
                  {c.father && (
                    <div className="text-[11px] text-slate-400">પિતા: {c.father}</div>
                  )}
                </td>

                <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                  {c.mobile}
                </td>

                <td className="py-3 px-3">
                  <span>{c.village}, {c.taluka}</span>
                </td>

                <td className="py-3 px-3 text-center">
                  <span className="font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                    {c.apps.length}
                  </span>
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                  ₹{c.totalPaid}
                </td>

                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Call shortcut */}
                    <a
                      href={`tel:${c.mobile.replace(/\D/g, '')}`}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                      title="Call Citizen"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    {/* WhatsApp shortcut */}
                    <a
                      href={`https://wa.me/91${c.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(`નમસ્તે ${c.name}જી, આપના CSC કેન્દ્ર સંબંધિત કામકાજ માટે સંપર્ક કર્યો છે.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition-colors"
                      title="WhatsApp Chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>

                    {/* New application shortcut */}
                    <button
                      onClick={() => onSelectCustomerForApp({
                        name: c.name,
                        mobile: c.mobile,
                        village: c.village,
                        father: c.father,
                      })}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                      title="Create Application"
                    >
                      <Plus className="w-3 h-3 text-amber-400" />
                      <span>{isGu ? 'નવી અરજી' : 'New App'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {customerList.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-xs">
          {isGu ? 'કોઈ ગ્રાહક મળ્યા નથી.' : 'No customer records found.'}
        </div>
      )}
    </div>
  );
};

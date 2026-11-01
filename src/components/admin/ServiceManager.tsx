import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { CSCService, ServiceCategory } from '../../types/csc';
import { Plus, Edit2, Check, X, Shield, Clock } from 'lucide-react';

export const ServiceManager: React.FC = () => {
  const { services, updateService, addService, toggleServiceStatus, language } = useCSC();
  const isGu = language === 'gu';

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit State
  const [editGovtFee, setEditGovtFee] = useState(0);
  const [editCscCharge, setEditCscCharge] = useState(0);
  const [editDeliveryDays, setEditDeliveryDays] = useState(3);

  // New Service State
  const [newTitleGu, setNewTitleGu] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newCategory, setNewCategory] = useState<ServiceCategory>('certificates');
  const [newDescGu, setNewDescGu] = useState('');
  const [newGovtFee, setNewGovtFee] = useState(20);
  const [newCscCharge, setNewCscCharge] = useState(50);
  const [newDays, setNewDays] = useState(3);
  const [newDocs, setNewDocs] = useState('આધાર કાર્ડ, રેશન કાર્ડ');

  const startEdit = (s: CSCService) => {
    setEditingServiceId(s.id);
    setEditGovtFee(s.govtFee);
    setEditCscCharge(s.cscCharge);
    setEditDeliveryDays(s.deliveryDays);
  };

  const saveEdit = (s: CSCService) => {
    updateService({
      ...s,
      govtFee: editGovtFee,
      cscCharge: editCscCharge,
      deliveryDays: editDeliveryDays,
    });
    setEditingServiceId(null);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleGu) return;

    const docItems = newDocs.split(',').map((d, i) => ({
      id: `doc-${Date.now()}-${i}`,
      nameGu: d.trim(),
      nameEn: d.trim(),
      mandatory: true,
    }));

    addService({
      code: `CSC-NEW-${Date.now().toString().slice(-4)}`,
      titleGu: newTitleGu.trim(),
      titleEn: newTitleEn.trim() || newTitleGu.trim(),
      category: newCategory,
      descriptionGu: newDescGu.trim() || 'નાગરિક સેવા',
      descriptionEn: newTitleEn.trim() || 'Citizen Service',
      govtFee: newGovtFee,
      cscCharge: newCscCharge,
      deliveryDays: newDays,
      documents: docItems,
      isActive: true,
      iconName: 'FileText',
    });

    setIsAddModalOpen(false);
    setNewTitleGu('');
    setNewTitleEn('');
    setNewDescGu('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {isGu ? 'સરકારી સેવાઓ અને ફી નું સંચાલન' : 'CSC Service Catalog & Fees Management'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isGu
              ? 'દરેક સેવાનો સરકારી ચાર્જ, CSC કમિશન અને સમયગાળો અહીંથી બદલો અથવા નવી સેવા ઉમેરો'
              : 'Configure government fees, center charges, delivery days or add new services'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{isGu ? '+ નવી સેવા ઉમેરો' : '+ Add New Service'}</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">સેવાનું નામ (Service)</th>
              <th className="py-2.5 px-3">કેટેગરી</th>
              <th className="py-2.5 px-3 text-right">સરકારી ફી (₹)</th>
              <th className="py-2.5 px-3 text-right">CSC ચાર્જ (₹)</th>
              <th className="py-2.5 px-3 text-right">કુલ ફી (₹)</th>
              <th className="py-2.5 px-3 text-center">સમય (દિવસ)</th>
              <th className="py-2.5 px-3 text-center">સ્થિતિ</th>
              <th className="py-2.5 px-3 text-right">ક્રિયા</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {services.map((s) => {
              const isEditing = editingServiceId === s.id;
              const total = isEditing
                ? editGovtFee + editCscCharge
                : s.govtFee + s.cscCharge;

              return (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{s.titleGu}</div>
                    <div className="text-[11px] font-mono text-slate-400">{s.code} · {s.titleEn}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] text-slate-600 uppercase">
                      {s.category}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editGovtFee}
                        onChange={(e) => setEditGovtFee(Number(e.target.value))}
                        className="w-16 text-right px-1.5 py-0.5 border border-slate-300 rounded font-mono text-xs"
                      />
                    ) : (
                      `₹${s.govtFee}`
                    )}
                  </td>

                  <td className="py-3 px-3 text-right font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editCscCharge}
                        onChange={(e) => setEditCscCharge(Number(e.target.value))}
                        className="w-16 text-right px-1.5 py-0.5 border border-slate-300 rounded font-mono text-xs"
                      />
                    ) : (
                      `₹${s.cscCharge}`
                    )}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ₹{total}
                  </td>

                  <td className="py-3 px-3 text-center font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editDeliveryDays}
                        onChange={(e) => setEditDeliveryDays(Number(e.target.value))}
                        className="w-14 text-center px-1 py-0.5 border border-slate-300 rounded font-mono text-xs"
                      />
                    ) : (
                      `${s.deliveryDays} d`
                    )}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => toggleServiceStatus(s.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                        s.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {s.isActive ? (isGu ? 'સક્રિય' : 'Active') : (isGu ? 'બંધ' : 'Disabled')}
                    </button>
                  </td>

                  <td className="py-3 px-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => saveEdit(s)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingServiceId(null)}
                          className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(s)}
                        className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                        title="Edit Fee & Time"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add New Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {isGu ? 'નવી સરકારી સેવા ઉમેરો' : 'Add New Citizen Service'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isGu ? 'સેવાનું નામ (ગુજરાતીમાં) *' : 'Service Title (Gujarati) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. વિધવા સહાય યોજના અરજી"
                  value={newTitleGu}
                  onChange={(e) => setNewTitleGu(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isGu ? 'સેવાનું નામ (English)' : 'Service Title (English)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Widow Pension Scheme"
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">{isGu ? 'કેટેગરી' : 'Category'}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="certificates">પ્રમાણપત્રો (Certificates)</option>
                    <option value="identity">ઓળખપત્ર (Identity)</option>
                    <option value="schemes">યોજના (Schemes)</option>
                    <option value="revenue">મહેસૂલ (Revenue)</option>
                    <option value="utility">લાઈટ બિલ (Utility)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">{isGu ? 'સમયગાળો (દિવસ)' : 'Delivery Days'}</label>
                  <input
                    type="number"
                    min="1"
                    value={newDays}
                    onChange={(e) => setNewDays(Number(e.target.value))}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">{isGu ? 'સરકારી ફી (₹)' : 'Govt Fee (₹)'}</label>
                  <input
                    type="number"
                    value={newGovtFee}
                    onChange={(e) => setNewGovtFee(Number(e.target.value))}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">{isGu ? 'CSC ચાર્જ (₹)' : 'CSC Commission (₹)'}</label>
                  <input
                    type="number"
                    value={newCscCharge}
                    onChange={(e) => setNewCscCharge(Number(e.target.value))}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">
                  {isGu ? 'જરૂરી કાગળો (અલ્પવિરામથી અલગ કરો)' : 'Required Documents (comma separated)'}
                </label>
                <input
                  type="text"
                  value={newDocs}
                  onChange={(e) => setNewDocs(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
                >
                  {isGu ? 'રદ કરો' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800"
                >
                  {isGu ? 'સેવા ઉમેરો' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

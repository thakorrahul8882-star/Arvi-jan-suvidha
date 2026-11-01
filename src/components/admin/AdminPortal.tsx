import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { CSCApplication, ApplicationStatus } from '../../types/csc';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Printer, 
  Plus, 
  Download, 
  Settings, 
  Users, 
  Sliders, 
  Filter, 
  MessageSquare, 
  Eye, 
  Layers, 
  TrendingUp, 
  Calendar,
  Ticket,
  DollarSign,
  Package
} from 'lucide-react';
import { downloadProjectZip } from '../../utils/projectDownloader';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { WalkInEntryModal } from './WalkInEntryModal';
import { ServiceManager } from './ServiceManager';
import { CustomerDirectory } from './CustomerDirectory';
import { CenterSettingsModal } from './CenterSettingsModal';

export const AdminPortal: React.FC = () => {
  const { 
    applications, 
    services, 
    appointments, 
    centerSettings, 
    language, 
    setActiveReceiptApplication,
    updateApplicationStatus 
  } = useCSC();
  const isGu = language === 'gu';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'applications' | 'services' | 'customers' | 'tokens'>('applications');

  // Search & Filters for Applications
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Modals
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<CSCApplication | null>(null);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Stats
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => a.status === 'submitted').length;
  const verifiedApps = applications.filter(a => a.status === 'verified').length;
  const processingApps = applications.filter(a => a.status === 'processing').length;
  const approvedApps = applications.filter(a => a.status === 'approved').length;
  const totalRevenue = applications
    .filter(a => a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.amount, 0);

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      app.customerName.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q) ||
      app.mobile.includes(q) ||
      app.serviceTitleGu.toLowerCase().includes(q) ||
      app.address.village.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchPayment = paymentFilter === 'all' || app.paymentStatus === paymentFilter;

    return matchSearch && matchStatus && matchPayment;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return <span className="inline-flex items-center text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-200">{isGu ? 'સબમિટ' : 'Submitted'}</span>;
      case 'verified':
        return <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200">{isGu ? 'ચકાસાયેલ' : 'Verified'}</span>;
      case 'processing':
        return <span className="inline-flex items-center text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-purple-200">{isGu ? 'પ્રોસેસિંગ' : 'Processing'}</span>;
      case 'approved':
        return <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">{isGu ? 'મંજૂર / તૈયાર' : 'Approved'}</span>;
      case 'rejected':
        return <span className="inline-flex items-center text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-rose-200">{isGu ? 'અસ્વીકાર' : 'Rejected'}</span>;
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Application ID', 'Customer Name', 'Mobile', 'Village', 'Service', 'Submitted Date', 'Status', 'Payment', 'Amount'];
    const rows = applications.map(a => [
      a.id,
      `"${a.customerName}"`,
      a.mobile,
      `"${a.address.village}"`,
      `"${a.serviceTitleGu}"`,
      a.submittedDate,
      a.status,
      a.paymentStatus,
      a.amount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CSC_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner / Operator Status Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/60 uppercase">
                {isGu ? 'સંચાલક મેનેજમેન્ટ પેનલ (VLE Admin Console)' : 'VLE Operator Control Center'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {centerSettings.centerName}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              સંચાલક: {centerSettings.vleName} · VLE ID: {centerSettings.vleId} · CSC ID: {centerSettings.cscId}
            </p>
          </div>

          {/* Quick Counter Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsWalkInModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-100" />
              <span>{isGu ? '+ નવી અરજી (કાઉન્ટર એન્ટ્રી)' : '+ Counter Entry'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>{isGu ? 'CSV એક્સપોર્ટ' : 'Export CSV'}</span>
            </button>

            <button
              onClick={downloadProjectZip}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
              title="Download Complete Source Code as ZIP file"
            >
              <Package className="w-4 h-4 text-slate-950" />
              <span>{isGu ? 'કોડ ડાઉનલોડ (.ZIP)' : 'Download Code (.ZIP)'}</span>
            </button>

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>{isGu ? 'કેન્દ્ર સેટિંગ્સ' : 'Settings'}</span>
            </button>
          </div>
        </div>

        {/* High Density Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">{isGu ? 'કુલ અરજીઓ' : 'Total Cases'}</span>
            <span className="text-xl font-bold font-mono text-white tabular-nums">{totalApps}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-blue-300 block">{isGu ? 'નવી / પેન્ડિંગ' : 'Pending Review'}</span>
            <span className="text-xl font-bold font-mono text-blue-400 tabular-nums">{pendingApps}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-amber-300 block">{isGu ? 'ચકાસાયેલ' : 'Verified'}</span>
            <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">{verifiedApps}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-purple-300 block">{isGu ? 'પ્રોસેસિંગ' : 'Processing'}</span>
            <span className="text-xl font-bold font-mono text-purple-400 tabular-nums">{processingApps}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-emerald-300 block">{isGu ? 'પૂર્ણ / મંજૂર' : 'Completed'}</span>
            <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">{approvedApps}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">{isGu ? 'કુલ આવક' : 'Revenue'}</span>
            <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">₹{totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isGu ? `અરજીઓનું સંચાલન (${applications.length})` : `Applications (${applications.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'services'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{isGu ? `સેવાઓ અને ફી (${services.length})` : `Service Catalog (${services.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'customers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isGu ? 'ગ્રાહકોની ડિરેક્ટરી' : 'Customer Directory'}</span>
        </button>

        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'tokens'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>{isGu ? `મુલાકાતી ટોકન્સ (${appointments.length})` : `Queue Tokens (${appointments.length})`}</span>
        </button>
      </div>

      {/* Tab 1: Applications Management View */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder={isGu ? 'અરજદારનું નામ, મોબાઇલ, ID અથવા ગામ શોધો...' : 'Search applicant, phone, ID, village...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-slate-50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Segmented Status Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold uppercase mr-1">{isGu ? 'સ્ટેટસ:' : 'Status:'}</span>
              {[
                { id: 'all', label: isGu ? 'બધી' : 'All' },
                { id: 'submitted', label: isGu ? 'સબમિટ' : 'Submitted' },
                { id: 'verified', label: isGu ? 'ચકાસાયેલ' : 'Verified' },
                { id: 'processing', label: isGu ? 'પ્રોસેસિંગ' : 'Processing' },
                { id: 'approved', label: isGu ? 'મંજૂર' : 'Approved' },
                { id: 'rejected', label: isGu ? 'અસ્વીકાર' : 'Rejected' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    statusFilter === s.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
            >
              <option value="all">{isGu ? 'તમામ પેમેન્ટ' : 'All Payments'}</option>
              <option value="paid">{isGu ? 'માત્ર ચૂકવેલ (Paid)' : 'Paid Only'}</option>
              <option value="unpaid">{isGu ? 'માત્ર બાકી (Unpaid)' : 'Unpaid Only'}</option>
            </select>
          </div>

          {/* High-Density Data Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/50">
                  <th className="py-2.5 px-3">અરજી ID / તારીખ</th>
                  <th className="py-2.5 px-3">અરજદારનું નામ</th>
                  <th className="py-2.5 px-3">મોબાઇલ / ગામ</th>
                  <th className="py-2.5 px-3">સેવાનું નામ</th>
                  <th className="py-2.5 px-3 text-right">ફી (₹)</th>
                  <th className="py-2.5 px-3 text-center">પેમેન્ટ</th>
                  <th className="py-2.5 px-3 text-center">સ્થિતિ (Status)</th>
                  <th className="py-2.5 px-3 text-right">ક્રિયા / સંચાલન</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    {/* ID & Date */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900">{app.id}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{app.submittedDate}</div>
                    </td>

                    {/* Applicant */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{app.customerName}</div>
                      {app.fatherOrHusbandName && (
                        <div className="text-[11px] text-slate-400">વાયા: {app.fatherOrHusbandName}</div>
                      )}
                    </td>

                    {/* Contact & Village */}
                    <td className="py-3 px-3 font-mono">
                      <div>{app.mobile}</div>
                      <div className="text-[11px] text-slate-500 font-sans">{app.address.village}</div>
                    </td>

                    {/* Service */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900">{app.serviceTitleGu}</div>
                      {app.govtApplicationNo && (
                        <div className="text-[10px] text-slate-500 font-mono">Ref: {app.govtApplicationNo}</div>
                      )}
                    </td>

                    {/* Fee */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{app.amount}
                    </td>

                    {/* Payment status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          app.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {app.paymentStatus === 'paid' ? `PAID (${app.paymentMethod || 'CASH'})` : 'UNPAID'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Manage / Update button */}
                        <button
                          onClick={() => setSelectedAppForDetail(app)}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] rounded transition-colors cursor-pointer"
                          title="Manage & Update Status"
                        >
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>{isGu ? 'મેનેજ' : 'Manage'}</span>
                        </button>

                        {/* Print Receipt button */}
                        <button
                          onClick={() => setActiveReceiptApplication(app)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                          title="Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* WhatsApp alert shortcut */}
                        <a
                          href={`https://wa.me/91${app.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(`નમસ્તે ${app.customerName}જી, આપની ${app.serviceTitleGu} ની અરજી (ID: ${app.id}) નું સ્ટેટસ અદ્યતન છે. સંપર્ક: ${centerSettings.mobile}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition-colors"
                          title="Send WhatsApp Alert"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApps.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              {isGu ? 'કોઈ અરજી મળી નથી.' : 'No applications found matching filters.'}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Service Catalog Management */}
      {activeTab === 'services' && <ServiceManager />}

      {/* Tab 3: Customer Directory */}
      {activeTab === 'customers' && (
        <CustomerDirectory
          onSelectCustomerForApp={(cust) => {
            setIsWalkInModalOpen(true);
          }}
        />
      )}

      {/* Tab 4: Queue Tokens */}
      {activeTab === 'tokens' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {isGu ? 'નાગરિક મુલાકાતી ટોકન્સ (Token Queue)' : 'Citizen Queue Tokens'}
              </h3>
              <p className="text-xs text-slate-500">
                {isGu ? 'કેન્દ્ર પર લાઈનમાં ઉભા રહેવાને બદલે ઓનલાઇન બુક કરેલા ટોકન' : 'Scheduled visit tokens for counter assistance'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {apt.tokenNumber}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                    {apt.status}
                  </span>
                </div>
                <div>
                  <strong className="text-slate-900 text-sm block">{apt.customerName}</strong>
                  <span className="font-mono text-slate-600">{apt.mobile}</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <div><strong>સેવા:</strong> {apt.serviceName}</div>
                  <div><strong>તારીખ:</strong> {apt.date} ({apt.timeSlot})</div>
                </div>
              </div>
            ))}
          </div>

          {appointments.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              {isGu ? 'કોઈ ટોકન બુકિંગ નથી.' : 'No appointment tokens scheduled.'}
            </div>
          )}
        </div>
      )}

      {/* Application Detail & Status Updater Modal */}
      {selectedAppForDetail && (
        <ApplicationDetailModal
          application={selectedAppForDetail}
          onClose={() => setSelectedAppForDetail(null)}
        />
      )}

      {/* Walk-in Entry Modal */}
      {isWalkInModalOpen && (
        <WalkInEntryModal
          onClose={() => setIsWalkInModalOpen(false)}
          onSuccess={(appId) => {
            setIsWalkInModalOpen(false);
            const created = applications.find(a => a.id === appId);
            if (created) setActiveReceiptApplication(created);
          }}
        />
      )}

      {/* Center Settings Modal */}
      {isSettingsModalOpen && (
        <CenterSettingsModal onClose={() => setIsSettingsModalOpen(false)} />
      )}
    </div>
  );
};

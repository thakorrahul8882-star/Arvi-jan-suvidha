import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { CSCService, ServiceCategory } from '../../types/csc';
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Zap, 
  Calendar, 
  Phone, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Award, 
  BadgeCheck, 
  CreditCard, 
  HeartPulse, 
  Landmark, 
  Users, 
  Sprout, 
  HardHat, 
  Vote, 
  Car 
} from 'lucide-react';
import { ApplicationModal } from './ApplicationModal';
import { ApplicationTracker } from './ApplicationTracker';
import { BillPaymentModal } from './BillPaymentModal';
import { AppointmentModal } from './AppointmentModal';

export const CustomerPortal: React.FC = () => {
  const { services, centerSettings, language, applications, setActiveReceiptApplication } = useCSC();
  const isGu = language === 'gu';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDocServiceId, setExpandedDocServiceId] = useState<string | null>(null);
  
  // Modals
  const [applyingService, setApplyingService] = useState<CSCService | null>(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [trackerSearchId, setTrackerSearchId] = useState('');
  const [successModalAppId, setSuccessModalAppId] = useState<string | null>(null);

  // Icon Map Helper
  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'FileText': return <FileText className="w-5 h-5 text-amber-600" />;
      case 'Award': return <Award className="w-5 h-5 text-indigo-600" />;
      case 'BadgeCheck': return <BadgeCheck className="w-5 h-5 text-purple-600" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-emerald-600" />;
      case 'Users': return <Users className="w-5 h-5 text-orange-600" />;
      case 'Sprout': return <Sprout className="w-5 h-5 text-green-600" />;
      case 'HardHat': return <HardHat className="w-5 h-5 text-amber-700" />;
      case 'Vote': return <Vote className="w-5 h-5 text-cyan-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Car': return <Car className="w-5 h-5 text-sky-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  const categories = [
    { id: 'all', labelGu: 'બધી સેવાઓ', labelEn: 'All Services' },
    { id: 'certificates', labelGu: 'પ્રમાણપત્રો (આવક/જાતિ/NCL)', labelEn: 'Certificates' },
    { id: 'identity', labelGu: 'ઓળખપત્ર (પાન/આધાર/ચૂંટણી)', labelEn: 'Identity & Cards' },
    { id: 'schemes', labelGu: 'ખેડૂત અને શ્રમિક યોજના', labelEn: 'Schemes & Farmers' },
    { id: 'revenue', labelGu: 'જમીન રેકોર્ડ્સ (૭/૧૨)', labelEn: 'Land Records' },
    { id: 'utility', labelGu: 'લાઈટ બિલ / રિચાર્જ', labelEn: 'Utility Bills' },
  ];

  // Filtering
  const filteredServices = services.filter((s) => {
    if (!s.isActive) return false;
    const matchCategory = activeCategory === 'all' || s.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      s.titleGu.toLowerCase().includes(q) ||
      s.titleEn.toLowerCase().includes(q) ||
      s.descriptionGu.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const toggleDocs = (id: string) => {
    setExpandedDocServiceId(prev => prev === id ? null : id);
  };

  const handleApplicationSuccess = (appId: string) => {
    setApplyingService(null);
    setIsBillModalOpen(false);
    setSuccessModalAppId(appId);
    setTrackerSearchId(appId);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Presentation Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-8 pb-12 px-4 sm:px-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>{isGu ? 'સરકાર માન્ય ડિજિટલ સેવા કેન્દ્ર (CSC - Digital India)' : 'Authorized Common Service Center'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white text-balance leading-tight">
            {isGu
              ? 'તમામ સરકારી સેવાઓ અને પ્રમાણપત્રો હવે એક જ સ્થળે'
              : 'All Citizen & Government Services Under One Roof'}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isGu
              ? 'આવકનો દાખલો, જાતિનો દાખલો, પાન કાર્ડ, આયુષ્માન ભારત, ૭/૧૨ ઉતારા, રેશન કાર્ડ અને લાઈટ બિલ - ઘરબેઠા ઓનલાઇન અરજી કરો અથવા કેન્દ્ર પર મુલાકાત લો.'
              : 'Apply online for Income Certificate, Caste, PAN Card, Ayushman Card, Land Records, and Utility Bills with real-time tracking.'}
          </p>

          {/* Quick Action Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#services-section"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <span>{isGu ? 'ઓનલાઇન અરજી કરો' : 'Apply For Services'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#tracker-section"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>{isGu ? 'અરજી સ્ટેટસ ચેક કરો' : 'Track Status'}</span>
            </a>

            <button
              onClick={() => setIsBillModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{isGu ? 'વીજળી બિલ ભરો' : 'Pay Electricity Bill'}</span>
            </button>

            <button
              onClick={() => setIsTokenModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-medium text-xs rounded-lg border border-emerald-700/60 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>{isGu ? 'ટોકન બુક કરો' : 'Queue Token'}</span>
            </button>
          </div>

          {/* Stat Badges Row */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left border-t border-slate-800/80">
            <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[11px] block">{isGu ? 'કુલ સેવાઓ' : 'Available Services'}</span>
              <span className="font-mono font-bold text-base text-white">{services.length}+</span>
            </div>
            <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[11px] block">{isGu ? 'મંજૂર અરજીઓ' : 'Completed Cases'}</span>
              <span className="font-mono font-bold text-base text-emerald-400">
                {applications.filter(a => a.status === 'approved').length + 840}
              </span>
            </div>
            <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[11px] block">{isGu ? 'સરેરાશ સમય' : 'Avg Turnaround'}</span>
              <span className="font-mono font-bold text-base text-amber-400">૧ - ૩ દિવસ</span>
            </div>
            <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[11px] block">{isGu ? 'રેટિંગ' : 'Customer Rating'}</span>
              <span className="font-mono font-bold text-base text-white">★ ૪.૯ / ૫</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Application Tracker Block */}
      <ApplicationTracker initialSearchId={trackerSearchId} />

      {/* Services Catalog Section */}
      <section id="services-section" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-600 font-bold">
              {isGu ? 'સરકારી સેવાઓની યાદી' : 'Citizen Services Catalog'}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {isGu ? 'જે સેવા જોઈએ તેની વિગત જુઓ અને ઓનલાઇન અરજી કરો' : 'Explore Services & Apply Online'}
            </h2>
          </div>

          {/* Search Box in Catalog */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder={isGu ? 'સેવાનું નામ શોધો (દા.ત. આવક, પાન)...' : 'Search service name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-3 pl-9 py-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {isGu ? cat.labelGu : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const isDocOpen = expandedDocServiceId === service.id;
            const totalFee = service.govtFee + service.cscCharge;

            return (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-slate-500 block">
                        {isGu ? 'કુલ ખર્ચ' : 'Total Fee'}
                      </span>
                      <span className="text-base font-bold font-mono text-slate-900">
                        ₹{totalFee}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {isGu ? service.titleGu : service.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {isGu ? service.descriptionGu : service.descriptionEn}
                  </p>

                  {/* Pricing Breakdown & Delivery */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>સરકારી ફી: ₹{service.govtFee} + સેવા: ₹{service.cscCharge}</span>
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {service.deliveryDays} {isGu ? 'દિવસ' : 'days'}
                    </span>
                  </div>

                  {/* Required Documents Toggle */}
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => toggleDocs(service.id)}
                      className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-600 hover:text-slate-900 py-1 cursor-pointer"
                    >
                      <span>
                        {isGu
                          ? `જરૂરી કાગળો (${service.documents.length})`
                          : `Required Documents (${service.documents.length})`}
                      </span>
                      {isDocOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isDocOpen && (
                      <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                        {service.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="flex-1">{isGu ? doc.nameGu : doc.nameEn}</span>
                            {doc.mandatory && (
                              <span className="text-[9px] text-red-600 font-bold uppercase">ફરજિયાત</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setApplyingService(service)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{isGu ? 'ઓનલાઇન અરજી કરો' : 'Apply Online'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
            <p className="text-xs">
              {isGu ? 'કોઈ સેવા મળી નથી. કૃપા કરીને અન્ય કીવર્ડથી શોધો.' : 'No services found matching your search.'}
            </p>
          </div>
        )}
      </section>

      {/* Center Details & Operator Contact Card */}
      <section id="center-info" className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{centerSettings.centerName}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {isGu ? 'કેન્દ્રની રૂબરૂ મુલાકાત માટે વિગત અને સંપર્ક' : 'Visit Center or Contact VLE Operator'}
            </h3>
            <p className="text-xs text-slate-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>{isGu ? centerSettings.addressGu : centerSettings.addressEn}</span>
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-700 pt-1">
              <span><strong>સંચાલક:</strong> {centerSettings.vleName}</span>
              <span>·</span>
              <span><strong>સમય:</strong> {centerSettings.workingHours}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <a
              href={`tel:${centerSettings.mobile.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{isGu ? `ફોન કરો: ${centerSettings.mobile}` : `Call: ${centerSettings.mobile}`}</span>
            </a>

            <a
              href={`https://wa.me/91${centerSettings.mobile.replace(/\D/g, '')}?text=${encodeURIComponent('નમસ્તે, મારે CSC કેન્દ્ર સેવા વિશે પૂછપરછ કરવી છે.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isGu ? 'વોટ્સએપ પર વાત કરો' : 'Chat on WhatsApp'}</span>
            </a>

            <button
              onClick={() => setIsTokenModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-slate-300"
            >
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>{isGu ? 'મુલાકાત માટે ટોકન લો' : 'Book Center Token'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Success Notification Modal when new app submitted */}
      {successModalAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center space-y-4 border border-slate-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isGu ? 'અરજી સફળતાપૂર્વક નોંધાઈ ગઈ છે!' : 'Application Successfully Submitted!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isGu ? 'તમારો અરજી નંબર સાચવી રાખો:' : 'Your Application ID:'}
              </p>
              <div className="text-xl font-mono font-bold text-slate-900 bg-slate-100 py-1.5 px-3 rounded-lg mt-2 inline-block">
                {successModalAppId}
              </div>
            </div>
            <p className="text-xs text-slate-600">
              {isGu
                ? 'સંચાલક દ્વારા તમારા દસ્તાવેજો ચકાસવામાં આવશે. આપ લાઇવ સ્ટેટસ ટ્રેક કરી શકો છો.'
                : 'VLE Operator will verify your documents. You can track status online.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const created = applications.find(a => a.id === successModalAppId);
                  if (created) setActiveReceiptApplication(created);
                }}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {isGu ? 'પહોંચ (Receipt) જુઓ' : 'View Receipt'}
              </button>
              <button
                onClick={() => setSuccessModalAppId(null)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {isGu ? 'ઠીક છે' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Online Application Modal */}
      {applyingService && (
        <ApplicationModal
          service={applyingService}
          onClose={() => setApplyingService(null)}
          onSuccess={handleApplicationSuccess}
        />
      )}

      {/* Bill Modal */}
      {isBillModalOpen && (
        <BillPaymentModal
          onClose={() => setIsBillModalOpen(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}

      {/* Token Modal */}
      {isTokenModalOpen && (
        <AppointmentModal onClose={() => setIsTokenModalOpen(false)} />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useCSC } from '../../context/CSCContext';
import { Calendar, Clock, X, CheckCircle2, Ticket } from 'lucide-react';

interface AppointmentModalProps {
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ onClose }) => {
  const { services, bookAppointment, language } = useCSC();
  const isGu = language === 'gu';

  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || 'income-cert');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [bookedToken, setBookedToken] = useState<string | null>(null);

  const slots = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '02:30 PM - 03:30 PM',
    '03:30 PM - 04:30 PM',
    '05:00 PM - 06:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !mobile) return;

    const selectedService = services.find(s => s.id === serviceId);
    const apt = bookAppointment({
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      serviceId,
      serviceName: isGu ? (selectedService?.titleGu || '') : (selectedService?.titleEn || ''),
      date,
      timeSlot,
    });

    setBookedToken(apt.tokenNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden my-6">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">
              {isGu ? 'કેન્દ્ર મુલાકાત માટે ટોકન બુક કરો' : 'Book Center Visit Token'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookedToken ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                {isGu ? 'ટોકન સફળતાપૂર્વક જનરેટ થયું' : 'Token Successfully Generated'}
              </span>
              <div className="text-3xl font-mono font-black text-slate-900 mt-1">
                {bookedToken}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
              <div><strong>તારીખ:</strong> {date}</div>
              <div><strong>સમય સ્લોટ:</strong> {timeSlot}</div>
              <div><strong>અરજદાર:</strong> {customerName} ({mobile})</div>
            </div>
            <p className="text-[11px] text-slate-500">
              {isGu
                ? 'કૃપા કરીને આપેલા સમયે અસલ કાગળો સાથે કેન્દ્ર પર હાજર રહેશો. આપને કતારમાં ઉભા રહેવું નહીં પડે.'
                : 'Please arrive at the selected time with original documents.'}
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors"
            >
              {isGu ? 'ઠીક છે (Done)' : 'Done'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isGu ? 'નામ *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={isGu ? 'દા.ત. મહેશભાઈ પટેલ' : 'Mahesh Patel'}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
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
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isGu ? 'કઈ સેવા માટે મુલાકાત લેવાની છે?' : 'Service Required'}
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {isGu ? s.titleGu : s.titleEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isGu ? 'તારીખ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs px-2 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isGu ? 'સમય સ્લોટ' : 'Time Slot'}
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs px-2 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  {slots.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
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
                className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors"
              >
                {isGu ? 'ટોકન કન્ફર્મ કરો' : 'Confirm Token'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

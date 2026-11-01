export type Language = 'gu' | 'en';

export type ServiceCategory = 
  | 'certificates' // દસ્તાવેજ અને પ્રમાણપત્ર
  | 'identity'     // ઓળખપત્ર (Aadhaar, PAN, Voter, Ayushman)
  | 'schemes'      // સરકારી યોજના અને પેન્શન
  | 'revenue'      // જમીન અને મહેસૂલ (7/12, 8A)
  | 'transport'    // RTO અને લાયસન્સ
  | 'utility';     // લાઈટ બિલ અને રિચાર્જ

export type ApplicationStatus = 
  | 'submitted'      // અરજી સબમિટ થઈ
  | 'verified'       // દસ્તાવેજ ચકાસ્યા
  | 'processing'     // પોર્ટલ પર પ્રોસેસમાં
  | 'approved'       // મંજૂર / તૈયાર
  | 'rejected';      // અસ્વીકાર

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PaymentMethod = 'cash' | 'upi' | 'online' | 'bank_transfer';

export interface RequiredDocument {
  id: string;
  nameGu: string;
  nameEn: string;
  mandatory: boolean;
}

export interface CSCService {
  id: string;
  code: string;
  titleGu: string;
  titleEn: string;
  category: ServiceCategory;
  descriptionGu: string;
  descriptionEn: string;
  govtFee: number;
  cscCharge: number;
  deliveryDays: number;
  documents: RequiredDocument[];
  isActive: boolean;
  popular?: boolean;
  iconName: string;
}

export interface AttachedFile {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface TimelineEvent {
  status: ApplicationStatus;
  titleGu: string;
  titleEn: string;
  descriptionGu: string;
  descriptionEn: string;
  timestamp: string;
  updatedBy: string;
}

export interface CSCApplication {
  id: string; // e.g. CSC-GJ-2026-1042
  serviceId: string;
  serviceTitleGu: string;
  serviceTitleEn: string;
  customerName: string;
  fatherOrHusbandName?: string;
  mobile: string;
  email?: string;
  aadhaarLast4?: string;
  address: {
    village: string;
    taluka: string;
    district: string;
    pincode: string;
  };
  submittedDate: string;
  expectedDate: string;
  status: ApplicationStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  amount: number;
  remarks?: string;
  attachedDocuments: string[]; // document names provided
  uploadedFiles?: AttachedFile[];
  approvedCertificateUrl?: string;
  approvedCertificateName?: string;
  govtApplicationNo?: string; // Reference number from Digital Gujarat / UTI / UIDAI
  timeline: TimelineEvent[];
}

export interface Appointment {
  id: string;
  tokenNumber: string; // e.g. T-14
  customerName: string;
  mobile: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  status: 'booked' | 'served' | 'cancelled';
  createdAt: string;
}

export interface CSCCenterSettings {
  centerName: string;
  centerNameEn: string;
  vleName: string;
  vleId: string;
  cscId: string;
  mobile: string;
  altPhone?: string;
  email: string;
  addressGu: string;
  addressEn: string;
  district: string;
  taluka: string;
  workingHours: string;
  upiId: string;
  announcementTextGu: string;
  announcementTextEn: string;
  isAnnouncementActive: boolean;
}

export interface TranslationRequest {
  id: string;
  userId: string;
  originalDocument: File;
  originalFilename: string;
  originalLanguage: string;
  targetLanguage: string;
  documentType: DocumentType;
  numberOfPages: number;
  pricePerPage: number;
  totalPrice: number;
  currency: string;
  status: TranslationStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  translatedDocumentUrl?: string;
  translatedFilename?: string;
  notes?: string;
  deliveryDate?: Date;
}

export type TranslationStatus = 
  | 'awaiting_payment'
  | 'pending' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export type DocumentType = 
  | 'academic_certificate'
  | 'diploma'
  | 'transcript'
  | 'birth_certificate'
  | 'passport'
  | 'identity_card'
  | 'medical_certificate'
  | 'bank_statement'
  | 'employment_certificate'
  | 'recommendation_letter'
  | 'motivation_letter'
  | 'cv_resume'
  | 'other';

export interface LanguagePair {
  code: string;
  name: string;
  nameFr: string;
}

export interface TranslationPricing {
  languagePair: string;
  pricePerPage: number;
  currency: string;
  turnaroundDays: number;
}

export const SUPPORTED_LANGUAGES: LanguagePair[] = [
  { code: 'ar', name: 'Arabic', nameFr: 'Arabe' },
  { code: 'fr', name: 'French', nameFr: 'Français' },
  { code: 'en', name: 'English', nameFr: 'Anglais' },
  { code: 'es', name: 'Spanish', nameFr: 'Espagnol' },
  { code: 'de', name: 'German', nameFr: 'Allemand' },
  { code: 'it', name: 'Italian', nameFr: 'Italien' },
  { code: 'pt', name: 'Portuguese', nameFr: 'Portugais' },
  { code: 'nl', name: 'Dutch', nameFr: 'Néerlandais' },
  { code: 'ru', name: 'Russian', nameFr: 'Russe' },
  { code: 'zh', name: 'Chinese', nameFr: 'Chinois' },
  { code: 'ja', name: 'Japanese', nameFr: 'Japonais' },
  { code: 'ko', name: 'Korean', nameFr: 'Coréen' }
];

export const DOCUMENT_TYPES = [
  { 
    id: 'academic_certificate', 
    name: 'Academic Certificate', 
    nameFr: 'Certificat Académique',
    basePrice: 60,
    description: 'University diplomas, certificates, degrees',
    descriptionFr: 'Diplômes universitaires, certificats, diplômes'
  },
  { 
    id: 'diploma', 
    name: 'Diploma', 
    nameFr: 'Diplôme',
    basePrice: 70,
    description: 'High school, university diplomas',
    descriptionFr: 'Diplômes de lycée, université'
  },
  { 
    id: 'transcript', 
    name: 'Transcript', 
    nameFr: 'Relevé de Notes',
    basePrice: 50,
    description: 'Academic transcripts, grade reports',
    descriptionFr: 'Relevés de notes, bulletins'
  },
  { 
    id: 'birth_certificate', 
    name: 'Birth Certificate', 
    nameFr: 'Acte de Naissance',
    basePrice: 40,
    description: 'Birth certificates, civil status documents',
    descriptionFr: 'Actes de naissance, documents d\'état civil'
  },
  { 
    id: 'passport', 
    name: 'Passport', 
    nameFr: 'Passeport',
    basePrice: 35,
    description: 'Passport, travel documents',
    descriptionFr: 'Passeport, documents de voyage'
  },
  { 
    id: 'identity_card', 
    name: 'Identity Card', 
    nameFr: 'Carte d\'Identité',
    basePrice: 30,
    description: 'National ID cards, driver\'s license',
    descriptionFr: 'Cartes d\'identité, permis de conduire'
  },
  { 
    id: 'medical_certificate', 
    name: 'Medical Certificate', 
    nameFr: 'Certificat Médical',
    basePrice: 45,
    description: 'Medical reports, health certificates',
    descriptionFr: 'Rapports médicaux, certificats de santé'
  },
  { 
    id: 'bank_statement', 
    name: 'Bank Statement', 
    nameFr: 'Relevé Bancaire',
    basePrice: 25,
    description: 'Bank statements, financial documents',
    descriptionFr: 'Relevés bancaires, documents financiers'
  },
  { 
    id: 'employment_certificate', 
    name: 'Employment Certificate', 
    nameFr: 'Certificat de Travail',
    basePrice: 40,
    description: 'Work certificates, employment letters',
    descriptionFr: 'Certificats de travail, lettres d\'emploi'
  },
  { 
    id: 'recommendation_letter', 
    name: 'Recommendation Letter', 
    nameFr: 'Lettre de Recommandation',
    basePrice: 80,
    description: 'Letters of recommendation, references',
    descriptionFr: 'Lettres de recommandation, références'
  },
  { 
    id: 'motivation_letter', 
    name: 'Motivation Letter', 
    nameFr: 'Lettre de Motivation',
    basePrice: 100,
    description: 'Personal statements, motivation letters',
    descriptionFr: 'Déclarations personnelles, lettres de motivation'
  },
  { 
    id: 'cv_resume', 
    name: 'CV/Resume', 
    nameFr: 'CV/Curriculum Vitae',
    basePrice: 90,
    description: 'Curriculum vitae, resumes',
    descriptionFr: 'Curriculum vitae, CV'
  },
  { 
    id: 'other', 
    name: 'Other Document', 
    nameFr: 'Autre Document',
    basePrice: 50,
    description: 'Other official documents',
    descriptionFr: 'Autres documents officiels'
  }
];

export const TRANSLATION_PRICING: TranslationPricing[] = [
  // Arabic to other languages
  { languagePair: 'ar-fr', pricePerPage: 50, currency: 'MAD', turnaroundDays: 3 },
  { languagePair: 'ar-en', pricePerPage: 50, currency: 'MAD', turnaroundDays: 3 },
  { languagePair: 'ar-es', pricePerPage: 60, currency: 'MAD', turnaroundDays: 4 },
  { languagePair: 'ar-de', pricePerPage: 60, currency: 'MAD', turnaroundDays: 4 },
  { languagePair: 'ar-it', pricePerPage: 60, currency: 'MAD', turnaroundDays: 4 },
  { languagePair: 'ar-pt', pricePerPage: 60, currency: 'MAD', turnaroundDays: 4 },
  
  // French to other languages
  { languagePair: 'fr-ar', pricePerPage: 50, currency: 'MAD', turnaroundDays: 3 },
  { languagePair: 'fr-en', pricePerPage: 40, currency: 'MAD', turnaroundDays: 2 },
  { languagePair: 'fr-es', pricePerPage: 45, currency: 'MAD', turnaroundDays: 3 },
  { languagePair: 'fr-de', pricePerPage: 45, currency: 'MAD', turnaroundDays: 3 },
  { languagePair: 'fr-it', pricePerPage: 45, currency: 'MAD', turnaroundDays: 3 },
  { languagePair: 'fr-pt', pricePerPage: 45, currency: 'MAD', turnaroundDays: 3 },
  
  // English to other languages
  { languagePair: 'en-ar', pricePerPage: 50, currency: 'MAD', turnaroundDays: 3 },
  { languagePair: 'en-fr', pricePerPage: 40, currency: 'MAD', turnaroundDays: 2 },
  { languagePair: 'en-es', pricePerPage: 40, currency: 'MAD', turnaroundDays: 2 },
  { languagePair: 'en-de', pricePerPage: 40, currency: 'MAD', turnaroundDays: 2 },
  { languagePair: 'en-it', pricePerPage: 40, currency: 'MAD', turnaroundDays: 2 },
  { languagePair: 'en-pt', pricePerPage: 40, currency: 'MAD', turnaroundDays: 2 },
  
  // Other common pairs
  { languagePair: 'es-fr', pricePerPage: 45, currency: 'MAD', turnaroundDays: 3 },
  { languagePair: 'de-fr', pricePerPage: 45, currency: 'MAD', turnaroundDays: 3 },
  { languagePair: 'it-fr', pricePerPage: 45, currency: 'MAD', turnaroundDays: 3 },
  { languagePair: 'pt-fr', pricePerPage: 45, currency: 'MAD', turnaroundDays: 3 }
];

export const getTranslationStatus = (status: TranslationStatus, language: string = 'en') => {
  const statusMap = {
    awaiting_payment: {
      en: 'Awaiting Payment',
      fr: 'En Attente de Paiement',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    pending: {
      en: 'Pending',
      fr: 'En Attente',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    in_progress: {
      en: 'In Progress',
      fr: 'En Cours',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    completed: {
      en: 'Completed',
      fr: 'Terminé',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    cancelled: {
      en: 'Cancelled',
      fr: 'Annulé',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  };
  
  return statusMap[status];
};

export const getPaymentStatus = (status: PaymentStatus, language: string = 'en') => {
  const statusMap = {
    pending: {
      en: 'Payment Pending',
      fr: 'Paiement en Attente',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    paid: {
      en: 'Paid',
      fr: 'Payé',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    failed: {
      en: 'Payment Failed',
      fr: 'Paiement Échoué',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    refunded: {
      en: 'Refunded',
      fr: 'Remboursé',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  };
  
  return statusMap[status];
};

export const getLanguageName = (code: string, language: string = 'en'): string => {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
  return lang ? (language === 'en' ? lang.name : lang.nameFr) : code;
};

export const getTranslationPrice = (fromLang: string, toLang: string): TranslationPricing | null => {
  const pair = `${fromLang}-${toLang}`;
  return TRANSLATION_PRICING.find(p => p.languagePair === pair) || null;
};

export const getDocumentType = (typeId: string) => {
  return DOCUMENT_TYPES.find(t => t.id === typeId);
};

export const calculateTranslationPrice = (
  documentType: string, 
  fromLang: string, 
  toLang: string, 
  numberOfPages: number
): { pricePerPage: number; totalPrice: number; currency: string } => {
  const docType = getDocumentType(documentType);
  const langPricing = getTranslationPrice(fromLang, toLang);
  
  if (!docType || !langPricing) {
    return { pricePerPage: 0, totalPrice: 0, currency: 'MAD' };
  }
  
  // Base price from document type + language complexity factor
  const basePrice = docType.basePrice;
  const languageFactor = langPricing.pricePerPage / 50; // Normalize to base 50 MAD
  const pricePerPage = Math.round(basePrice * languageFactor);
  const totalPrice = pricePerPage * numberOfPages;
  
  return { pricePerPage, totalPrice, currency: 'MAD' };
};

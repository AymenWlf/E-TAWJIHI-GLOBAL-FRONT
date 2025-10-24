export interface Service {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  price: number;
  currency: string;
  category: ServiceCategory;
  targetCountries: string[]; // Pays compatibles avec ce service
  features: string[];
  featuresFr: string[];
  icon: string;
  color: string;
  isPopular?: boolean;
  isNew?: boolean;
  exampleReportUrl?: string;
  mobileApp?: boolean;
  duration?: string;
  durationFr?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  descriptionFr: string;
  isAvailable: boolean;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'diagnostic',
    name: 'Diagnostic & Assessment',
    nameFr: 'Diagnostic & Évaluation',
    icon: '🔍',
    color: 'bg-blue-500'
  },
  {
    id: 'morocco',
    name: 'Morocco Services',
    nameFr: 'Services Maroc',
    icon: '🇲🇦',
    color: 'bg-red-500'
  },
  {
    id: 'france',
    name: 'France Services',
    nameFr: 'Services France',
    icon: '🇫🇷',
    color: 'bg-blue-600'
  },
  {
    id: 'international',
    name: 'International Services',
    nameFr: 'Services Internationaux',
    icon: '🌍',
    color: 'bg-green-500'
  },
  {
    id: 'translation',
    name: 'Translation Services',
    nameFr: 'Services de Traduction',
    icon: '📝',
    color: 'bg-purple-500'
  }
];

export const SERVICES: Service[] = [
  // Diagnostic System
  {
    id: 'diagnostic_system',
    name: 'Complete Diagnostic System',
    nameFr: 'Système de Diagnostic Complet',
    description: 'Comprehensive assessment of your academic profile, career goals, and study abroad readiness',
    descriptionFr: 'Évaluation complète de votre profil académique, objectifs de carrière et préparation aux études à l\'étranger',
    price: 50,
    currency: 'USD',
    category: SERVICE_CATEGORIES[0],
    targetCountries: ['ALL'], // Available for all countries
    features: [
      'Academic Profile Analysis',
      'Career Path Recommendations',
      'Study Abroad Readiness Assessment',
      'Personalized Action Plan',
      'Detailed Report (PDF)',
      '1-on-1 Consultation (30 min)'
    ],
    featuresFr: [
      'Analyse du Profil Académique',
      'Recommandations de Parcours de Carrière',
      'Évaluation de Préparation aux Études à l\'Étranger',
      'Plan d\'Action Personnalisé',
      'Rapport Détaillé (PDF)',
      'Consultation Individuelle (30 min)'
    ],
    icon: '🔍',
    color: 'bg-blue-500',
    isPopular: true,
    exampleReportUrl: '/examples/diagnostic-report-sample.pdf',
    duration: '2-3 business days',
    durationFr: '2-3 jours ouvrables'
  },

  // TASSJIL Services
  {
    id: 'tassjil',
    name: 'TASSJIL Service',
    nameFr: 'Service TASSJIL',
    description: 'Complete assistance for registration in Moroccan public, private, and semi-public schools',
    descriptionFr: 'Assistance complète pour l\'inscription dans les écoles marocaines publiques, privées et semi-publiques',
    price: 2300,
    currency: 'MAD',
    category: SERVICE_CATEGORIES[1],
    targetCountries: ['Morocco'],
    features: [
      'School Selection Guidance',
      'Application Form Assistance',
      'Document Preparation',
      'Submission Support',
      'Follow-up & Updates',
      'Mobile App Access'
    ],
    featuresFr: [
      'Conseil en Sélection d\'École',
      'Assistance Formulaire de Candidature',
      'Préparation des Documents',
      'Support de Soumission',
      'Suivi & Mises à Jour',
      'Accès Application Mobile'
    ],
    icon: '📚',
    color: 'bg-red-500',
    mobileApp: true,
    duration: 'Throughout application period',
    durationFr: 'Pendant toute la période de candidature'
  },

  {
    id: 'tassjil_top15',
    name: 'TASSJIL TOP 15',
    nameFr: 'TASSJIL TOP 15',
    description: 'Premium service for top 15 Moroccan universities and schools',
    descriptionFr: 'Service premium pour les 15 meilleures universités et écoles marocaines',
    price: 1800,
    currency: 'MAD',
    category: SERVICE_CATEGORIES[1],
    targetCountries: ['Morocco'],
    features: [
      'Top 15 Schools Priority',
      'Exclusive Application Support',
      'Priority Processing',
      'Enhanced Success Rate',
      'Premium Consultation',
      'Mobile App Premium Features'
    ],
    featuresFr: [
      'Priorité Top 15 Écoles',
      'Support de Candidature Exclusif',
      'Traitement Prioritaire',
      'Taux de Réussite Amélioré',
      'Consultation Premium',
      'Fonctionnalités Premium App Mobile'
    ],
    icon: '🏆',
    color: 'bg-yellow-500',
    isPopular: true,
    mobileApp: true,
    duration: 'Throughout application period',
    durationFr: 'Pendant toute la période de candidature'
  },

  // TAWJIH PLUS
  {
    id: 'tawjih_plus',
    name: 'TAWJIH PLUS',
    nameFr: 'TAWJIH PLUS',
    description: 'Mobile app with notifications for opportunities and scholarships in Morocco and internationally',
    descriptionFr: 'Application mobile avec notifications pour les opportunités et bourses au Maroc et à l\'international',
    price: 500,
    currency: 'MAD',
    category: SERVICE_CATEGORIES[1],
    targetCountries: ['Morocco'],
    features: [
      'Real-time Notifications',
      'Morocco Opportunities',
      'International Scholarships',
      'Bac to PhD Coverage',
      'Exclusive Opportunities',
      'Mobile App Access'
    ],
    featuresFr: [
      'Notifications en Temps Réel',
      'Opportunités Maroc',
      'Bourses Internationales',
      'Couverture Bac au Doctorat',
      'Opportunités Exclusives',
      'Accès Application Mobile'
    ],
    icon: '📱',
    color: 'bg-green-500',
    mobileApp: true,
    duration: '1 year subscription',
    durationFr: 'Abonnement 1 an'
  },

  // Campus France
  {
    id: 'campus_france',
    name: 'Campus France Service',
    nameFr: 'Service Campus France',
    description: 'Complete assistance for French public school applications through Campus France procedure',
    descriptionFr: 'Assistance complète pour les candidatures dans les écoles publiques françaises via la procédure Campus France',
    price: 3500,
    currency: 'MAD',
    category: SERVICE_CATEGORIES[2],
    targetCountries: ['Morocco', 'Algeria', 'Tunisia', 'Senegal', 'Ivory Coast', 'Cameroon', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Madagascar', 'Mauritius', 'Lebanon', 'Syria', 'Jordan', 'Egypt', 'Libya'],
    features: [
      'Campus France Procedure',
      'Application Preparation',
      'Document Translation',
      'Interview Preparation',
      'Visa Support',
      'University Selection'
    ],
    featuresFr: [
      'Procédure Campus France',
      'Préparation de Candidature',
      'Traduction de Documents',
      'Préparation d\'Entretien',
      'Support Visa',
      'Sélection d\'Université'
    ],
    icon: '🇫🇷',
    color: 'bg-blue-600',
    duration: '3-6 months',
    durationFr: '3-6 mois'
  },

  // Parcoursup
  {
    id: 'parcoursup',
    name: 'Parcoursup Service',
    nameFr: 'Service Parcoursup',
    description: 'Assistance for CPGE and BTS applications in France through Parcoursup platform',
    descriptionFr: 'Assistance pour les candidatures CPGE et BTS en France via la plateforme Parcoursup',
    price: 2500,
    currency: 'MAD',
    category: SERVICE_CATEGORIES[2],
    targetCountries: ['Morocco', 'Algeria', 'Tunisia', 'Senegal', 'Ivory Coast', 'Cameroon', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Madagascar', 'Mauritius', 'Lebanon', 'Syria', 'Jordan', 'Egypt', 'Libya'],
    features: [
      'Parcoursup Platform Support',
      'CPGE Applications',
      'BTS Applications',
      'Wish List Optimization',
      'Document Preparation',
      'Application Follow-up'
    ],
    featuresFr: [
      'Support Plateforme Parcoursup',
      'Candidatures CPGE',
      'Candidatures BTS',
      'Optimisation Liste de Vœux',
      'Préparation de Documents',
      'Suivi de Candidature'
    ],
    icon: '🎓',
    color: 'bg-purple-500',
    duration: 'Application period',
    durationFr: 'Période de candidature'
  },

  // Student Visa Support
  {
    id: 'student_visa',
    name: 'Student Visa Support',
    nameFr: 'Accompagnement Visa Étudiant',
    description: 'Complete visa assistance for study abroad in any destination',
    descriptionFr: 'Assistance complète pour visa étudiant pour toute destination d\'étude',
    price: 4000,
    currency: 'MAD',
    category: SERVICE_CATEGORIES[3],
    targetCountries: ['ALL'],
    features: [
      'Visa Application Support',
      'Document Preparation',
      'Interview Preparation',
      'Embassy Liaison',
      'Application Tracking',
      'Success Guarantee'
    ],
    featuresFr: [
      'Support Candidature Visa',
      'Préparation de Documents',
      'Préparation d\'Entretien',
      'Liaison Ambassade',
      'Suivi de Candidature',
      'Garantie de Réussite'
    ],
    icon: '✈️',
    color: 'bg-indigo-500',
    isPopular: true,
    duration: '2-4 months',
    durationFr: '2-4 mois'
  },

  // Housing & Guarantor Service
  {
    id: 'housing_guarantor',
    name: 'Housing & Guarantor Service',
    nameFr: 'Service Logement & Garant',
    description: 'We help you find suitable accommodation and provide guarantor services according to your study country',
    descriptionFr: 'Nous vous aidons à trouver un logement adapté et fournissons des services de garant selon votre pays d\'étude',
    price: 4000,
    currency: 'MAD',
    category: SERVICE_CATEGORIES[3],
    targetCountries: ['ALL'],
    features: [
      'Housing Search Assistance',
      'Guarantor Services',
      'Document Preparation',
      'Landlord Liaison',
      'Contract Review',
      'Ongoing Support'
    ],
    featuresFr: [
      'Assistance Recherche Logement',
      'Services de Garant',
      'Préparation de Documents',
      'Liaison Propriétaire',
      'Révision de Contrat',
      'Support Continu'
    ],
    icon: '🏠',
    color: 'bg-orange-500',
    isPopular: true,
    duration: '1-3 months',
    durationFr: '1-3 mois'
  },

  // Official Document Translation Service
  {
    id: 'document_translation',
    name: 'Official Document Translation',
    nameFr: 'Traduction de Documents Officiels',
    description: 'Professional translation of official documents for study abroad applications. Variable pricing based on document type and language pair.',
    descriptionFr: 'Traduction professionnelle de documents officiels pour les candidatures d\'études à l\'étranger. Prix variable selon le type de document et la paire de langues.',
    price: 0, // Variable pricing - will be calculated based on document type
    currency: 'MAD',
    category: SERVICE_CATEGORIES[3],
    targetCountries: ['ALL'],
    features: [
      'Professional Translation',
      'Certified Translators',
      'Variable Pricing by Document Type',
      'Multiple Language Pairs',
      '48h Business Days Delivery',
      'Quality Guarantee'
    ],
    featuresFr: [
      'Traduction Professionnelle',
      'Traducteurs Certifiés',
      'Prix Variable par Type de Document',
      'Plusieurs Paires de Langues',
      'Livraison 48h Ouvrables',
      'Garantie Qualité'
    ],
    icon: '📄',
    color: 'bg-purple-500',
    isPopular: true,
    duration: '48 business hours',
    durationFr: '48 heures ouvrables'
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'stripe_card',
    name: 'Credit/Debit Card',
    nameFr: 'Carte de Crédit/Débit',
    icon: '💳',
    description: 'Secure payment with Visa, Mastercard, or American Express',
    descriptionFr: 'Paiement sécurisé avec Visa, Mastercard ou American Express',
    isAvailable: true
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    nameFr: 'Virement Bancaire',
    icon: '🏦',
    description: 'Direct bank transfer to our account',
    descriptionFr: 'Virement bancaire direct vers notre compte',
    isAvailable: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    nameFr: 'PayPal',
    icon: '🅿️',
    description: 'Pay securely with your PayPal account',
    descriptionFr: 'Payez en toute sécurité avec votre compte PayPal',
    isAvailable: true
  }
];

export const getServiceById = (id: string): Service | undefined => {
  return SERVICES.find(service => service.id === id);
};

export const getServicesByCategory = (categoryId: string): Service[] => {
  return SERVICES.filter(service => service.category.id === categoryId);
};

export const getServicesForCountry = (country: string): Service[] => {
  return SERVICES.filter(service => 
    service.targetCountries.includes('ALL') || 
    service.targetCountries.includes(country)
  );
};

export const getAvailableServices = (userCountry?: string): Service[] => {
  if (!userCountry) {
    return SERVICES; // Return all services but they will be grayed out
  }
  return getServicesForCountry(userCountry);
};

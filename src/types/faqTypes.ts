export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  isPopular: boolean;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  description: string;
  descriptionFr: string;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'general',
    name: 'General Questions',
    nameFr: 'Questions Générales',
    icon: '❓',
    color: 'bg-blue-500',
    description: 'General information about E-TAWJIHI',
    descriptionFr: 'Informations générales sur E-TAWJIHI'
  },
  {
    id: 'account',
    name: 'Account & Profile',
    nameFr: 'Compte & Profil',
    icon: '👤',
    color: 'bg-green-500',
    description: 'Account management and profile settings',
    descriptionFr: 'Gestion du compte et paramètres du profil'
  },
  {
    id: 'services',
    name: 'Services',
    nameFr: 'Services',
    icon: '🎯',
    color: 'bg-purple-500',
    description: 'Our services and offerings',
    descriptionFr: 'Nos services et offres'
  },
  {
    id: 'documents',
    name: 'Documents',
    nameFr: 'Documents',
    icon: '📄',
    color: 'bg-orange-500',
    description: 'Document management and processing',
    descriptionFr: 'Gestion et traitement des documents'
  },
  {
    id: 'translations',
    name: 'Translations',
    nameFr: 'Traductions',
    icon: '🌐',
    color: 'bg-indigo-500',
    description: 'Translation services and process',
    descriptionFr: 'Services de traduction et processus'
  },
  {
    id: 'tests',
    name: 'Test Vouchers',
    nameFr: 'Vouchers de Test',
    icon: '📝',
    color: 'bg-red-500',
    description: 'Test vouchers and exam preparation',
    descriptionFr: 'Vouchers de test et préparation aux examens'
  },
  {
    id: 'payments',
    name: 'Payments',
    nameFr: 'Paiements',
    icon: '💳',
    color: 'bg-emerald-500',
    description: 'Payment methods and billing',
    descriptionFr: 'Moyens de paiement et facturation'
  },
  {
    id: 'technical',
    name: 'Technical Support',
    nameFr: 'Support Technique',
    icon: '🔧',
    color: 'bg-gray-500',
    description: 'Technical issues and troubleshooting',
    descriptionFr: 'Problèmes techniques et dépannage'
  },
  {
    id: 'campus-france',
    name: 'Campus France',
    nameFr: 'Campus France',
    icon: '🇫🇷',
    color: 'bg-blue-600',
    description: 'Campus France procedures and requirements',
    descriptionFr: 'Procédures et exigences Campus France'
  },
  {
    id: 'morocco',
    name: 'Morocco Services',
    nameFr: 'Services Maroc',
    icon: '🇲🇦',
    color: 'bg-red-600',
    description: 'Moroccan education services',
    descriptionFr: 'Services d\'éducation marocains'
  }
];

export const getFAQCategory = (categoryId: string, language: string = 'en'): FAQCategory | undefined => {
  return FAQ_CATEGORIES.find(cat => cat.id === categoryId);
};

export const getFAQCategoryColor = (categoryId: string): string => {
  const category = getFAQCategory(categoryId);
  return category?.color || 'bg-gray-500';
};

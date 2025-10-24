// Types et constantes pour la gestion des documents

export interface DocumentCategory {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  icon: string;
  color: string;
  required: boolean;
  documentTypes: DocumentType[];
}

export interface DocumentType {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  required: boolean;
  maxFileSize?: number; // en MB
  allowedExtensions?: string[];
  expiryRequired?: boolean;
}

export interface DocumentStatus {
  id: string;
  name: string;
  nameFr: string;
  color: string;
  bgColor: string;
}

// Catégories de documents prédéfinies
export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    id: 'identity',
    name: 'Identity',
    nameFr: 'Identité',
    description: 'Submit a valid ID proof to enrol in courses',
    descriptionFr: 'Soumettez une preuve d\'identité valide pour vous inscrire aux cours',
    icon: 'User',
    color: 'blue',
    required: true,
    documentTypes: [
      {
        id: 'passport',
        name: 'Passport',
        nameFr: 'Passeport',
        description: 'Valid passport copy',
        descriptionFr: 'Copie de passeport valide',
        required: true,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
        expiryRequired: true
      },
      {
        id: 'national_id',
        name: 'National ID',
        nameFr: 'Carte d\'Identité Nationale',
        description: 'National identity card',
        descriptionFr: 'Carte d\'identité nationale',
        required: false,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png']
      }
    ]
  },
  {
    id: 'english_tests',
    name: 'English Language Tests',
    nameFr: 'Tests de Langue Anglaise',
    description: 'Provide one of the listed certificates to determine your course eligibility',
    descriptionFr: 'Fournissez l\'un des certificats listés pour déterminer votre éligibilité aux cours',
    icon: 'Globe',
    color: 'emerald',
    required: true,
    documentTypes: [
      {
        id: 'duolingo',
        name: 'Duolingo',
        nameFr: 'Duolingo',
        description: 'Duolingo English Test certificate',
        descriptionFr: 'Certificat Duolingo English Test',
        required: false,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
        expiryRequired: true
      },
      {
        id: 'ielts',
        name: 'IELTS',
        nameFr: 'IELTS',
        description: 'International English Language Testing System',
        descriptionFr: 'Système international de test de langue anglaise',
        required: false,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
        expiryRequired: true
      },
      {
        id: 'toefl',
        name: 'TOEFL',
        nameFr: 'TOEFL',
        description: 'Test of English as a Foreign Language',
        descriptionFr: 'Test d\'anglais langue étrangère',
        required: false,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
        expiryRequired: true
      },
      {
        id: 'pte',
        name: 'PTE Academic',
        nameFr: 'PTE Academic',
        description: 'Pearson Test of English Academic',
        descriptionFr: 'Test Pearson d\'anglais académique',
        required: false,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
        expiryRequired: true
      }
    ]
  },
  {
    id: 'academic_certificates',
    name: 'Academic Certificates',
    nameFr: 'Certificats Académiques',
    description: 'Secure admission to your best-matching courses by submitting accurate and comprehensive documents',
    descriptionFr: 'Assurez votre admission aux cours les mieux adaptés en soumettant des documents précis et complets',
    icon: 'GraduationCap',
    color: 'purple',
    required: true,
    documentTypes: [
      {
        id: 'secondary_school',
        name: 'Secondary School',
        nameFr: 'École Secondaire',
        description: 'Secondary School Marksheets',
        descriptionFr: 'Relevés de notes du secondaire',
        required: true,
        maxFileSize: 10,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png']
      },
      {
        id: 'senior_high_school',
        name: 'Senior High School',
        nameFr: 'Lycée',
        description: 'Senior High School Marksheets',
        descriptionFr: 'Relevés de notes du lycée',
        required: true,
        maxFileSize: 10,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png']
      },
      {
        id: 'undergraduate_marksheets',
        name: 'Undergraduate',
        nameFr: 'Premier Cycle',
        description: 'Undergraduate Semester Marksheets',
        descriptionFr: 'Relevés de notes semestriels de premier cycle',
        required: false,
        maxFileSize: 10,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png']
      },
      {
        id: 'undergraduate_certificate',
        name: 'Undergraduate Graduation Certificate',
        nameFr: 'Certificat de Diplôme de Premier Cycle',
        description: 'Bachelor degree certificate',
        descriptionFr: 'Certificat de licence',
        required: false,
        maxFileSize: 10,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png']
      },
      {
        id: 'postgraduate_marksheets',
        name: 'Postgraduate',
        nameFr: 'Deuxième Cycle',
        description: 'Postgraduate Semester Marksheets',
        descriptionFr: 'Relevés de notes semestriels de deuxième cycle',
        required: false,
        maxFileSize: 10,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png']
      },
      {
        id: 'postgraduate_certificate',
        name: 'Postgraduate Certificate',
        nameFr: 'Certificat de Diplôme de Deuxième Cycle',
        description: 'Master degree certificate',
        descriptionFr: 'Certificat de master',
        required: false,
        maxFileSize: 10,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png']
      }
    ]
  },
  {
    id: 'other_documents',
    name: 'Other Documents',
    nameFr: 'Autres Documents',
    description: 'Additional optional documents to support your application',
    descriptionFr: 'Documents supplémentaires facultatifs pour soutenir votre candidature',
    icon: 'FileText',
    color: 'orange',
    required: false,
    documentTypes: [
      {
        id: 'cv_resume',
        name: 'CV/Resume',
        nameFr: 'CV/Curriculum Vitae',
        description: 'Professional resume or curriculum vitae',
        descriptionFr: 'CV professionnel ou curriculum vitae',
        required: false,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'doc', 'docx']
      },
      {
        id: 'statement_of_purpose',
        name: 'Statement of Purpose',
        nameFr: 'Lettre de Motivation',
        description: 'Personal statement explaining your goals',
        descriptionFr: 'Lettre personnelle expliquant vos objectifs',
        required: false,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'doc', 'docx']
      },
      {
        id: 'letters_of_recommendation',
        name: 'Letters of Recommendation',
        nameFr: 'Lettres de Recommandation',
        description: 'Reference letters from teachers or employers',
        descriptionFr: 'Lettres de référence d\'enseignants ou d\'employeurs',
        required: false,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'doc', 'docx']
      },
      {
        id: 'portfolio',
        name: 'Portfolio',
        nameFr: 'Portfolio',
        description: 'Work samples and creative portfolio',
        descriptionFr: 'Échantillons de travail et portfolio créatif',
        required: false,
        maxFileSize: 20,
        allowedExtensions: ['pdf', 'zip', 'rar']
      },
      {
        id: 'financial_documents',
        name: 'Financial Documents',
        nameFr: 'Documents Financiers',
        description: 'Bank statements and financial proof',
        descriptionFr: 'Relevés bancaires et preuves financières',
        required: false,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png']
      },
      {
        id: 'medical_certificate',
        name: 'Medical Certificate',
        nameFr: 'Certificat Médical',
        description: 'Health certificate and medical records',
        descriptionFr: 'Certificat de santé et dossiers médicaux',
        required: false,
        maxFileSize: 5,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png']
      }
    ]
  }
];

// Statuts des documents
export const DOCUMENT_STATUSES: DocumentStatus[] = [
  {
    id: 'uploaded',
    name: 'Uploaded',
    nameFr: 'Téléchargé',
    color: 'text-green-800',
    bgColor: 'bg-green-100'
  },
  {
    id: 'processing',
    name: 'Processing',
    nameFr: 'En cours de traitement',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'verified',
    name: 'Verified',
    nameFr: 'Vérifié',
    color: 'text-green-800',
    bgColor: 'bg-green-100'
  },
  {
    id: 'rejected',
    name: 'Rejected',
    nameFr: 'Rejeté',
    color: 'text-red-800',
    bgColor: 'bg-red-100'
  },
  {
    id: 'expired',
    name: 'Expired',
    nameFr: 'Expiré',
    color: 'text-orange-800',
    bgColor: 'bg-orange-100'
  },
  {
    id: 'pending',
    name: 'Pending',
    nameFr: 'En attente',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100'
  },
  {
    id: 'not_submitted',
    name: 'Not Submitted',
    nameFr: 'Non soumis',
    color: 'text-gray-800',
    bgColor: 'bg-gray-100'
  },
  {
    id: 'optional',
    name: 'Optional',
    nameFr: 'Facultatif',
    color: 'text-gray-800',
    bgColor: 'bg-gray-100'
  }
];

// Statuts de validation E-TAWJIHI
export const VALIDATION_STATUSES: DocumentStatus[] = [
  {
    id: 'pending',
    name: 'Pending Review',
    nameFr: 'En attente de révision',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100'
  },
  {
    id: 'under_review',
    name: 'Under Review',
    nameFr: 'En cours de révision',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'approved',
    name: 'Approved by E-TAWJIHI',
    nameFr: 'Approuvé par E-TAWJIHI',
    color: 'text-green-800',
    bgColor: 'bg-green-100'
  },
  {
    id: 'rejected',
    name: 'Rejected by E-TAWJIHI',
    nameFr: 'Rejeté par E-TAWJIHI',
    color: 'text-red-800',
    bgColor: 'bg-red-100'
  }
];

// Fonctions utilitaires
export const getDocumentCategory = (categoryId: string): DocumentCategory | undefined => {
  return DOCUMENT_CATEGORIES.find(cat => cat.id === categoryId);
};

export const getDocumentType = (categoryId: string, typeId: string): DocumentType | undefined => {
  const category = getDocumentCategory(categoryId);
  return category?.documentTypes.find(type => type.id === typeId);
};

export const getDocumentStatus = (statusId: string): DocumentStatus | undefined => {
  return DOCUMENT_STATUSES.find(status => status.id === statusId);
};

export const getValidationStatus = (statusId: string): DocumentStatus | undefined => {
  return VALIDATION_STATUSES.find(status => status.id === statusId);
};

export const getCategoryColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' }
  };
  return colorMap[color] || colorMap.blue;
};

export interface Ambassador {
  id: number;
  university: string;
  fieldOfStudy: string;
  studyLevel: 'bachelor' | 'master' | 'phd' | 'other';
  graduationYear: number;
  motivation: string;
  experience: string;
  skills: string;
  socialMedia?: string;
  additionalInfo?: string;
  status: 'pending' | 'under_review' | 'interview_scheduled' | 'approved' | 'rejected' | 'active' | 'inactive';
  adminNotes?: string;
  interviewDate?: string;
  trainingDate?: string;
  startDate?: string;
  endDate?: string;
  points: number;
  referrals: number;
  isActive: boolean;
  userName: string;
  userCountry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyLevel {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
}

export interface AmbassadorStatus {
  id: string;
  name: string;
  nameFr: string;
  color: string;
  description: string;
  descriptionFr: string;
}

export interface AmbassadorBenefit {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  icon: string;
  color: string;
}

export interface AmbassadorTier {
  id: string;
  name: string;
  nameFr: string;
  level: number;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
  description: string;
  descriptionFr: string;
  benefits: string[];
  benefitsFr: string[];
  requirements: string[];
  requirementsFr: string[];
}

export const STUDY_LEVELS: StudyLevel[] = [
  {
    id: 'bachelor',
    name: 'Bachelor\'s Degree',
    nameFr: 'Licence',
    description: 'Undergraduate degree (3-4 years)',
    descriptionFr: 'Diplôme de premier cycle (3-4 ans)'
  },
  {
    id: 'master',
    name: 'Master\'s Degree',
    nameFr: 'Master',
    description: 'Graduate degree (1-2 years)',
    descriptionFr: 'Diplôme de deuxième cycle (1-2 ans)'
  },
  {
    id: 'phd',
    name: 'PhD/Doctorate',
    nameFr: 'Doctorat',
    description: 'Doctoral degree (3-5 years)',
    descriptionFr: 'Diplôme de troisième cycle (3-5 ans)'
  },
  {
    id: 'other',
    name: 'Other',
    nameFr: 'Autre',
    description: 'Other educational level',
    descriptionFr: 'Autre niveau d\'éducation'
  }
];

export const AMBASSADOR_STATUSES: AmbassadorStatus[] = [
  {
    id: 'pending',
    name: 'Pending',
    nameFr: 'En Attente',
    color: 'bg-gray-100 text-gray-800',
    description: 'Application is waiting for review',
    descriptionFr: 'La candidature attend un examen'
  },
  {
    id: 'under_review',
    name: 'Under Review',
    nameFr: 'En Cours d\'Examen',
    color: 'bg-blue-100 text-blue-800',
    description: 'Application is being reviewed',
    descriptionFr: 'La candidature est en cours d\'examen'
  },
  {
    id: 'interview_scheduled',
    name: 'Interview Scheduled',
    nameFr: 'Entretien Programmé',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Interview has been scheduled',
    descriptionFr: 'L\'entretien a été programmé'
  },
  {
    id: 'approved',
    name: 'Approved',
    nameFr: 'Approuvé',
    color: 'bg-green-100 text-green-800',
    description: 'Application has been approved',
    descriptionFr: 'La candidature a été approuvée'
  },
  {
    id: 'rejected',
    name: 'Rejected',
    nameFr: 'Rejeté',
    color: 'bg-red-100 text-red-800',
    description: 'Application has been rejected',
    descriptionFr: 'La candidature a été rejetée'
  },
  {
    id: 'active',
    name: 'Active',
    nameFr: 'Actif',
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Ambassador is currently active',
    descriptionFr: 'L\'ambassadeur est actuellement actif'
  },
  {
    id: 'inactive',
    name: 'Inactive',
    nameFr: 'Inactif',
    color: 'bg-gray-100 text-gray-600',
    description: 'Ambassador is currently inactive',
    descriptionFr: 'L\'ambassadeur est actuellement inactif'
  }
];

export const AMBASSADOR_BENEFITS: AmbassadorBenefit[] = [
  {
    id: 'networking',
    title: 'Global Networking',
    titleFr: 'Réseautage Mondial',
    description: 'Connect with students and professionals worldwide',
    descriptionFr: 'Connectez-vous avec des étudiants et professionnels du monde entier',
    icon: '🌍',
    color: 'bg-blue-500'
  },
  {
    id: 'leadership',
    title: 'Leadership Skills',
    titleFr: 'Compétences de Leadership',
    description: 'Develop leadership and communication skills',
    descriptionFr: 'Développez vos compétences de leadership et de communication',
    icon: '👑',
    color: 'bg-purple-500'
  },
  {
    id: 'experience',
    title: 'Professional Experience',
    titleFr: 'Expérience Professionnelle',
    description: 'Gain valuable professional experience',
    descriptionFr: 'Acquérez une expérience professionnelle précieuse',
    icon: '💼',
    color: 'bg-green-500'
  },
  {
    id: 'rewards',
    title: 'Rewards & Recognition',
    titleFr: 'Récompenses & Reconnaissance',
    description: 'Earn points, certificates, and exclusive benefits',
    descriptionFr: 'Gagnez des points, certificats et avantages exclusifs',
    icon: '🏆',
    color: 'bg-yellow-500'
  },
  {
    id: 'mentorship',
    title: 'Mentorship Opportunities',
    titleFr: 'Opportunités de Mentorat',
    description: 'Mentor new students and share your experience',
    descriptionFr: 'Mentorez de nouveaux étudiants et partagez votre expérience',
    icon: '🤝',
    color: 'bg-indigo-500'
  },
  {
    id: 'events',
    title: 'Exclusive Events',
    titleFr: 'Événements Exclusifs',
    description: 'Access to exclusive events and workshops',
    descriptionFr: 'Accès à des événements et ateliers exclusifs',
    icon: '🎉',
    color: 'bg-pink-500'
  }
];

export const getStudyLevel = (levelId: string, language: string = 'en'): StudyLevel | undefined => {
  return STUDY_LEVELS.find(level => level.id === levelId);
};

export const getAmbassadorStatus = (statusId: string, language: string = 'en'): AmbassadorStatus | undefined => {
  return AMBASSADOR_STATUSES.find(status => status.id === statusId);
};

export const getAmbassadorStatusColor = (status: string): string => {
  const statusObj = getAmbassadorStatus(status);
  return statusObj?.color || 'bg-gray-100 text-gray-800';
};

export const AMBASSADOR_TIERS: AmbassadorTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Ambassador',
    nameFr: 'Ambassadeur Bronze',
    level: 1,
    minPoints: 0,
    maxPoints: 99,
    color: 'bg-amber-500',
    icon: '🥉',
    description: 'Entry-level ambassador with basic responsibilities',
    descriptionFr: 'Ambassadeur de niveau d\'entrée avec des responsabilités de base',
    benefits: [
      'Access to ambassador community',
      'Basic training materials',
      'Certificate of participation',
      'Monthly newsletter'
    ],
    benefitsFr: [
      'Accès à la communauté d\'ambassadeurs',
      'Matériel de formation de base',
      'Certificat de participation',
      'Newsletter mensuelle'
    ],
    requirements: [
      'Complete application process',
      'Attend orientation session',
      'Maintain active status'
    ],
    requirementsFr: [
      'Compléter le processus de candidature',
      'Assister à la session d\'orientation',
      'Maintenir un statut actif'
    ]
  },
  {
    id: 'silver',
    name: 'Silver Ambassador',
    nameFr: 'Ambassadeur Argent',
    level: 2,
    minPoints: 100,
    maxPoints: 299,
    color: 'bg-gray-400',
    icon: '🥈',
    description: 'Experienced ambassador with expanded responsibilities',
    descriptionFr: 'Ambassadeur expérimenté avec des responsabilités étendues',
    benefits: [
      'All Bronze benefits',
      'Advanced training workshops',
      'Priority event access',
      'Mentorship opportunities',
      'Exclusive merchandise'
    ],
    benefitsFr: [
      'Tous les avantages Bronze',
      'Ateliers de formation avancés',
      'Accès prioritaire aux événements',
      'Opportunités de mentorat',
      'Produits exclusifs'
    ],
    requirements: [
      '100+ points earned',
      'Complete 3+ successful referrals',
      'Attend 2+ training sessions',
      'Maintain 90%+ activity rate'
    ],
    requirementsFr: [
      '100+ points gagnés',
      'Compléter 3+ parrainages réussis',
      'Assister à 2+ sessions de formation',
      'Maintenir un taux d\'activité de 90%+'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Ambassador',
    nameFr: 'Ambassadeur Or',
    level: 3,
    minPoints: 300,
    maxPoints: 599,
    color: 'bg-yellow-500',
    icon: '🥇',
    description: 'Senior ambassador with leadership responsibilities',
    descriptionFr: 'Ambassadeur senior avec des responsabilités de leadership',
    benefits: [
      'All Silver benefits',
      'Leadership training program',
      'Event organization privileges',
      'Direct communication with team',
      'Premium merchandise',
      'Recognition in ambassador hall of fame'
    ],
    benefitsFr: [
      'Tous les avantages Argent',
      'Programme de formation au leadership',
      'Privilèges d\'organisation d\'événements',
      'Communication directe avec l\'équipe',
      'Produits premium',
      'Reconnaissance dans le hall of fame des ambassadeurs'
    ],
    requirements: [
      '300+ points earned',
      'Complete 10+ successful referrals',
      'Lead 2+ events or workshops',
      'Mentor 3+ new ambassadors',
      'Maintain 95%+ activity rate'
    ],
    requirementsFr: [
      '300+ points gagnés',
      'Compléter 10+ parrainages réussis',
      'Diriger 2+ événements ou ateliers',
      'Mentorer 3+ nouveaux ambassadeurs',
      'Maintenir un taux d\'activité de 95%+'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum Ambassador',
    nameFr: 'Ambassadeur Platine',
    level: 4,
    minPoints: 600,
    maxPoints: 999,
    color: 'bg-blue-500',
    icon: '💎',
    description: 'Elite ambassador with executive responsibilities',
    descriptionFr: 'Ambassadeur d\'élite avec des responsabilités exécutives',
    benefits: [
      'All Gold benefits',
      'Executive leadership program',
      'Strategic planning participation',
      'International opportunities',
      'Luxury merchandise',
      'Annual retreat invitation',
      'Personal brand development support'
    ],
    benefitsFr: [
      'Tous les avantages Or',
      'Programme de leadership exécutif',
      'Participation à la planification stratégique',
      'Opportunités internationales',
      'Produits de luxe',
      'Invitation à la retraite annuelle',
      'Support au développement de marque personnelle'
    ],
    requirements: [
      '600+ points earned',
      'Complete 25+ successful referrals',
      'Lead 5+ major events',
      'Mentor 10+ ambassadors',
      'Contribute to strategic initiatives',
      'Maintain 98%+ activity rate'
    ],
    requirementsFr: [
      '600+ points gagnés',
      'Compléter 25+ parrainages réussis',
      'Diriger 5+ événements majeurs',
      'Mentorer 10+ ambassadeurs',
      'Contribuer aux initiatives stratégiques',
      'Maintenir un taux d\'activité de 98%+'
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond Ambassador',
    nameFr: 'Ambassadeur Diamant',
    level: 5,
    minPoints: 1000,
    maxPoints: 9999,
    color: 'bg-purple-600',
    icon: '💠',
    description: 'Master ambassador with global impact',
    descriptionFr: 'Ambassadeur maître avec un impact mondial',
    benefits: [
      'All Platinum benefits',
      'Global ambassador network access',
      'Board advisory role',
      'International conference invitations',
      'Lifetime ambassador status',
      'Custom merchandise',
      'Personal assistant support',
      'Revenue sharing opportunities'
    ],
    benefitsFr: [
      'Tous les avantages Platine',
      'Accès au réseau d\'ambassadeurs mondial',
      'Rôle consultatif au conseil',
      'Invitations aux conférences internationales',
      'Statut d\'ambassadeur à vie',
      'Produits personnalisés',
      'Support d\'assistant personnel',
      'Opportunités de partage de revenus'
    ],
    requirements: [
      '1000+ points earned',
      'Complete 50+ successful referrals',
      'Lead 10+ major international events',
      'Mentor 25+ ambassadors',
      'Develop innovative programs',
      'Maintain 99%+ activity rate',
      'Demonstrate exceptional leadership'
    ],
    requirementsFr: [
      '1000+ points gagnés',
      'Compléter 50+ parrainages réussis',
      'Diriger 10+ événements internationaux majeurs',
      'Mentorer 25+ ambassadeurs',
      'Développer des programmes innovants',
      'Maintenir un taux d\'activité de 99%+',
      'Démontrer un leadership exceptionnel'
    ]
  }
];

export const getAmbassadorTier = (points: number): AmbassadorTier => {
  return AMBASSADOR_TIERS.find(tier => points >= tier.minPoints && points <= tier.maxPoints) || AMBASSADOR_TIERS[0];
};

export const getNextTier = (currentPoints: number): AmbassadorTier | null => {
  const currentTier = getAmbassadorTier(currentPoints);
  const currentIndex = AMBASSADOR_TIERS.findIndex(tier => tier.id === currentTier.id);
  return currentIndex < AMBASSADOR_TIERS.length - 1 ? AMBASSADOR_TIERS[currentIndex + 1] : null;
};

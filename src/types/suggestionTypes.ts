export interface Suggestion {
  id: number;
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'under_review' | 'approved' | 'implemented' | 'rejected';
  attachments?: string[];
  adminResponse?: string;
  adminResponseDate?: string;
  votes: number;
  isPublic: boolean;
  isAnonymous: boolean;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuggestionCategory {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  description: string;
  descriptionFr: string;
}

export interface SuggestionPriority {
  id: string;
  name: string;
  nameFr: string;
  color: string;
  description: string;
  descriptionFr: string;
}

export interface SuggestionStatus {
  id: string;
  name: string;
  nameFr: string;
  color: string;
  description: string;
  descriptionFr: string;
}

export const SUGGESTION_CATEGORIES: SuggestionCategory[] = [
  {
    id: 'ui-ux',
    name: 'User Interface & Experience',
    nameFr: 'Interface Utilisateur & Expérience',
    icon: '🎨',
    color: 'bg-purple-500',
    description: 'Improvements to the user interface and user experience',
    descriptionFr: 'Améliorations de l\'interface utilisateur et de l\'expérience utilisateur'
  },
  {
    id: 'features',
    name: 'New Features',
    nameFr: 'Nouvelles Fonctionnalités',
    icon: '✨',
    color: 'bg-blue-500',
    description: 'Suggestions for new features and capabilities',
    descriptionFr: 'Suggestions pour de nouvelles fonctionnalités et capacités'
  },
  {
    id: 'performance',
    name: 'Performance & Speed',
    nameFr: 'Performance & Vitesse',
    icon: '⚡',
    color: 'bg-green-500',
    description: 'Performance improvements and speed optimizations',
    descriptionFr: 'Améliorations de performance et optimisations de vitesse'
  },
  {
    id: 'mobile',
    name: 'Mobile Experience',
    nameFr: 'Expérience Mobile',
    icon: '📱',
    color: 'bg-indigo-500',
    description: 'Mobile app and responsive design improvements',
    descriptionFr: 'Améliorations de l\'application mobile et du design responsive'
  },
  {
    id: 'content',
    name: 'Content & Information',
    nameFr: 'Contenu & Information',
    icon: '📚',
    color: 'bg-orange-500',
    description: 'Content updates, translations, and information improvements',
    descriptionFr: 'Mises à jour de contenu, traductions et améliorations d\'information'
  },
  {
    id: 'services',
    name: 'Services & Support',
    nameFr: 'Services & Support',
    icon: '🎯',
    color: 'bg-red-500',
    description: 'Improvements to existing services and customer support',
    descriptionFr: 'Améliorations des services existants et du support client'
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    nameFr: 'Sécurité & Confidentialité',
    icon: '🔒',
    color: 'bg-gray-500',
    description: 'Security enhancements and privacy improvements',
    descriptionFr: 'Améliorations de sécurité et de confidentialité'
  },
  {
    id: 'integration',
    name: 'Integrations & APIs',
    nameFr: 'Intégrations & APIs',
    icon: '🔗',
    color: 'bg-teal-500',
    description: 'Third-party integrations and API improvements',
    descriptionFr: 'Intégrations tierces et améliorations d\'API'
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    nameFr: 'Accessibilité',
    icon: '♿',
    color: 'bg-pink-500',
    description: 'Accessibility improvements for users with disabilities',
    descriptionFr: 'Améliorations d\'accessibilité pour les utilisateurs en situation de handicap'
  },
  {
    id: 'other',
    name: 'Other',
    nameFr: 'Autre',
    icon: '💡',
    color: 'bg-gray-400',
    description: 'Other suggestions not covered by the above categories',
    descriptionFr: 'Autres suggestions non couvertes par les catégories ci-dessus'
  }
];

export const SUGGESTION_PRIORITIES: SuggestionPriority[] = [
  {
    id: 'low',
    name: 'Low',
    nameFr: 'Faible',
    color: 'bg-gray-100 text-gray-800',
    description: 'Nice to have, can be implemented later',
    descriptionFr: 'Agréable à avoir, peut être implémenté plus tard'
  },
  {
    id: 'medium',
    name: 'Medium',
    nameFr: 'Moyen',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Standard priority, should be considered',
    descriptionFr: 'Priorité standard, devrait être considéré'
  },
  {
    id: 'high',
    name: 'High',
    nameFr: 'Élevé',
    color: 'bg-orange-100 text-orange-800',
    description: 'Important improvement, should be prioritized',
    descriptionFr: 'Amélioration importante, devrait être priorisé'
  },
  {
    id: 'urgent',
    name: 'Urgent',
    nameFr: 'Urgent',
    color: 'bg-red-100 text-red-800',
    description: 'Critical improvement, needs immediate attention',
    descriptionFr: 'Amélioration critique, nécessite une attention immédiate'
  }
];

export const SUGGESTION_STATUSES: SuggestionStatus[] = [
  {
    id: 'pending',
    name: 'Pending',
    nameFr: 'En Attente',
    color: 'bg-gray-100 text-gray-800',
    description: 'Suggestion is waiting for review',
    descriptionFr: 'La suggestion attend un examen'
  },
  {
    id: 'under_review',
    name: 'Under Review',
    nameFr: 'En Cours d\'Examen',
    color: 'bg-blue-100 text-blue-800',
    description: 'Suggestion is being reviewed by our team',
    descriptionFr: 'La suggestion est en cours d\'examen par notre équipe'
  },
  {
    id: 'approved',
    name: 'Approved',
    nameFr: 'Approuvé',
    color: 'bg-green-100 text-green-800',
    description: 'Suggestion has been approved for implementation',
    descriptionFr: 'La suggestion a été approuvée pour implémentation'
  },
  {
    id: 'implemented',
    name: 'Implemented',
    nameFr: 'Implémenté',
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Suggestion has been implemented',
    descriptionFr: 'La suggestion a été implémentée'
  },
  {
    id: 'rejected',
    name: 'Rejected',
    nameFr: 'Rejeté',
    color: 'bg-red-100 text-red-800',
    description: 'Suggestion has been rejected',
    descriptionFr: 'La suggestion a été rejetée'
  }
];

export const getSuggestionCategory = (categoryId: string, language: string = 'en'): SuggestionCategory | undefined => {
  return SUGGESTION_CATEGORIES.find(cat => cat.id === categoryId);
};

export const getSuggestionPriority = (priorityId: string, language: string = 'en'): SuggestionPriority | undefined => {
  return SUGGESTION_PRIORITIES.find(pri => pri.id === priorityId);
};

export const getSuggestionStatus = (statusId: string, language: string = 'en'): SuggestionStatus | undefined => {
  return SUGGESTION_STATUSES.find(status => status.id === statusId);
};

export const getSuggestionStatusColor = (status: string): string => {
  const statusObj = getSuggestionStatus(status);
  return statusObj?.color || 'bg-gray-100 text-gray-800';
};

export const getSuggestionPriorityColor = (priority: string): string => {
  const priorityObj = getSuggestionPriority(priority);
  return priorityObj?.color || 'bg-gray-100 text-gray-800';
};

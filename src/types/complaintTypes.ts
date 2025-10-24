export interface Complaint {
  id: number;
  category: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  attachments?: string[];
  relatedService?: string;
  relatedDocument?: string;
  relatedTest?: string;
  adminResponse?: string;
  adminResponseDate?: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  messages?: ComplaintMessage[];
}

export interface ComplaintMessage {
  id: number;
  message: string;
  attachments?: string[];
  isFromAdmin: boolean;
  senderName: string;
  createdAt: string;
}

export interface ComplaintCategory {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  description: string;
  descriptionFr: string;
}

export interface ComplaintPriority {
  id: string;
  name: string;
  nameFr: string;
  color: string;
  description: string;
  descriptionFr: string;
}

export interface ComplaintStatus {
  id: string;
  name: string;
  nameFr: string;
  color: string;
  description: string;
  descriptionFr: string;
}

export const COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  {
    id: 'technical',
    name: 'Technical Issues',
    nameFr: 'Problèmes Techniques',
    icon: '🔧',
    color: 'bg-blue-500',
    description: 'Website, app, or system problems',
    descriptionFr: 'Problèmes de site web, application ou système'
  },
  {
    id: 'payment',
    name: 'Payment Issues',
    nameFr: 'Problèmes de Paiement',
    icon: '💳',
    color: 'bg-green-500',
    description: 'Payment processing, refunds, billing',
    descriptionFr: 'Traitement des paiements, remboursements, facturation'
  },
  {
    id: 'service',
    name: 'Service Issues',
    nameFr: 'Problèmes de Service',
    icon: '🎯',
    color: 'bg-purple-500',
    description: 'Service delivery, quality, delays',
    descriptionFr: 'Livraison de service, qualité, retards'
  },
  {
    id: 'document',
    name: 'Document Issues',
    nameFr: 'Problèmes de Documents',
    icon: '📄',
    color: 'bg-orange-500',
    description: 'Document processing, translation, validation',
    descriptionFr: 'Traitement de documents, traduction, validation'
  },
  {
    id: 'test',
    name: 'Test Issues',
    nameFr: 'Problèmes de Tests',
    icon: '📝',
    color: 'bg-red-500',
    description: 'Test vouchers, scheduling, results',
    descriptionFr: 'Vouchers de test, planification, résultats'
  },
  {
    id: 'account',
    name: 'Account Issues',
    nameFr: 'Problèmes de Compte',
    icon: '👤',
    color: 'bg-gray-500',
    description: 'Profile, settings, access',
    descriptionFr: 'Profil, paramètres, accès'
  },
  {
    id: 'other',
    name: 'Other',
    nameFr: 'Autre',
    icon: '❓',
    color: 'bg-gray-400',
    description: 'Other issues not listed above',
    descriptionFr: 'Autres problèmes non listés ci-dessus'
  }
];

export const COMPLAINT_PRIORITIES: ComplaintPriority[] = [
  {
    id: 'low',
    name: 'Low',
    nameFr: 'Faible',
    color: 'bg-gray-100 text-gray-800',
    description: 'Minor issues that can be addressed later',
    descriptionFr: 'Problèmes mineurs qui peuvent être traités plus tard'
  },
  {
    id: 'medium',
    name: 'Medium',
    nameFr: 'Moyen',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Standard priority issues',
    descriptionFr: 'Problèmes de priorité standard'
  },
  {
    id: 'high',
    name: 'High',
    nameFr: 'Élevé',
    color: 'bg-orange-100 text-orange-800',
    description: 'Important issues requiring attention',
    descriptionFr: 'Problèmes importants nécessitant une attention'
  },
  {
    id: 'urgent',
    name: 'Urgent',
    nameFr: 'Urgent',
    color: 'bg-red-100 text-red-800',
    description: 'Critical issues requiring immediate attention',
    descriptionFr: 'Problèmes critiques nécessitant une attention immédiate'
  }
];

export const COMPLAINT_STATUSES: ComplaintStatus[] = [
  {
    id: 'open',
    name: 'Open',
    nameFr: 'Ouvert',
    color: 'bg-blue-100 text-blue-800',
    description: 'Complaint has been submitted and is awaiting review',
    descriptionFr: 'La réclamation a été soumise et attend un examen'
  },
  {
    id: 'in_progress',
    name: 'In Progress',
    nameFr: 'En Cours',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Complaint is being investigated and worked on',
    descriptionFr: 'La réclamation est en cours d\'investigation et de traitement'
  },
  {
    id: 'resolved',
    name: 'Resolved',
    nameFr: 'Résolu',
    color: 'bg-green-100 text-green-800',
    description: 'Complaint has been resolved',
    descriptionFr: 'La réclamation a été résolue'
  },
  {
    id: 'closed',
    name: 'Closed',
    nameFr: 'Fermé',
    color: 'bg-gray-100 text-gray-800',
    description: 'Complaint has been closed',
    descriptionFr: 'La réclamation a été fermée'
  }
];

export const getComplaintCategory = (categoryId: string, language: string = 'en'): ComplaintCategory | undefined => {
  return COMPLAINT_CATEGORIES.find(cat => cat.id === categoryId);
};

export const getComplaintPriority = (priorityId: string, language: string = 'en'): ComplaintPriority | undefined => {
  return COMPLAINT_PRIORITIES.find(pri => pri.id === priorityId);
};

export const getComplaintStatus = (statusId: string, language: string = 'en'): ComplaintStatus | undefined => {
  return COMPLAINT_STATUSES.find(status => status.id === statusId);
};

export const getComplaintStatusColor = (status: string): string => {
  const statusObj = getComplaintStatus(status);
  return statusObj?.color || 'bg-gray-100 text-gray-800';
};

export const getComplaintPriorityColor = (priority: string): string => {
  const priorityObj = getComplaintPriority(priority);
  return priorityObj?.color || 'bg-gray-100 text-gray-800';
};

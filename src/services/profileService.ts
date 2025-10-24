import api from '../config/api';

export interface UserProfile {
  id?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  country?: string;
  city?: string;
  nationality?: string[];
  phone?: string;
  whatsapp?: string;
  phoneCountry?: string;
  whatsappCountry?: string;
  passportNumber?: string;
  address?: string;
  postalCode?: string;
  dateOfBirth?: string;
  avatar?: string;
  studyLevel?: string;
  fieldOfStudy?: string;
  preferredCountry?: string;
  startDate?: string;
  preferredCurrency?: string;
  annualBudget?: string;
  scholarshipRequired?: boolean;
  languagePreferences?: string[];
  onboardingProgress?: Record<string, boolean>;
  preferredDestinations?: string[];
  preferredIntakes?: string[];
  preferredSubjects?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Qualification {
  id?: number;
  type: string;
  title: string;
  institution?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  score?: string;
  scoreType?: string;
  expiryDate?: string;
  status?: string;
  description?: string;
  country?: string;
  board?: string;
  gradingScheme?: string;
  englishScore?: string;
  academicQualification?: string;
  exactQualificationName?: string;
  detailedScores?: {
    overall?: string;
    listening?: string;
    reading?: string;
    readingWriting?: string; // Nouveau champ pour SAT Reading and Writing
    writing?: string;
    speaking?: string;
    production?: string;
    comprehension?: string;
    conversation?: string;
    literacy?: string;
    useOfEnglish?: string;
    english?: string;
    mathematics?: string;
    science?: string;
    verbal?: string;
    quantitative?: string;
    analytical?: string;
    integratedReasoning?: string;
    logicalReasoning?: string;
    analyticalReasoning?: string;
    readingComprehension?: string;
    writingSample?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  id?: number;
  type: string; // document type ID (e.g., 'passport', 'ielts')
  category: string; // document category ID (e.g., 'identity', 'english_tests')
  title: string;
  filename?: string;
  originalFilename?: string;
  mimeType?: string;
  fileSize?: number;
  fileSizeFormatted?: string;
  status: string; // uploaded, processing, verified, rejected, expired
  validationStatus?: string; // pending, approved, rejected, under_review
  validationNotes?: string; // Notes de validation par E-TAWJIHI
  validatedBy?: string; // Nom de l'agent E-TAWJIHI qui a validé
  validatedAt?: string; // Date de validation
  description?: string;
  expiryDate?: string;
  rejectionReason?: string;
  fileUrl?: string; // URL pour accéder au fichier
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  id?: number;
  universityName: string;
  programName: string;
  country?: string;
  status: string;
  applicationFee?: string;
  tuitionFee?: string;
  applicationDeadline?: string;
  startDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShortlistItem {
  id?: number;
  universityName: string;
  programName: string;
  country?: string;
  field?: string;
  level?: string;
  tuitionFee?: string;
  currency?: string;
  applicationDeadline?: string;
  startDate?: string;
  notes?: string;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

class ProfileService {
  // Profile management
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/profile');
    // Handle case where backend returns { userProfile: {...} } structure
    if (response.data && response.data.userProfile) {
      return response.data.userProfile;
    }
    return response.data;
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put('/profile', profileData);
    return response.data;
  }

  // Qualifications management
  async getQualifications(): Promise<Qualification[]> {
    const response = await api.get('/profile/qualifications');
    // Handle case where backend returns { userProfile: {...} } structure
    if (response.data && response.data.userProfile) {
      return response.data.userProfile.qualifications || [];
    }
    return response.data || [];
  }

  async addQualification(qualification: Omit<Qualification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Qualification> {
    const response = await api.post('/profile/qualifications', qualification);
    return response.data;
  }

  async updateQualification(id: number, qualification: Partial<Qualification>): Promise<Qualification> {
    const response = await api.put(`/profile/qualifications/${id}`, qualification);
    return response.data;
  }

  async deleteQualification(id: number): Promise<void> {
    await api.delete(`/profile/qualifications/${id}`);
  }

  // Documents management
  async getDocuments(): Promise<Document[]> {
    const response = await api.get('/profile/documents');
    // Handle case where backend returns { userProfile: {...} } structure
    if (response.data && response.data.userProfile) {
      return response.data.userProfile.documents || [];
    }
    return response.data || [];
  }

  async uploadDocument(file: File, documentData: Omit<Document, 'id' | 'filename' | 'originalFilename' | 'mimeType' | 'fileSize' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentData.type);
    formData.append('category', documentData.category);
    formData.append('title', documentData.title);
    if (documentData.description) {
      formData.append('description', documentData.description);
    }
    if (documentData.expiryDate) {
      formData.append('expiryDate', documentData.expiryDate);
    }

    const response = await api.post('/profile/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Gérer la nouvelle structure de réponse
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Upload failed');
    }
  }

  async updateDocument(id: number, document: Partial<Document>): Promise<Document> {
    const response = await api.put(`/profile/documents/${id}`, document);
    return response.data;
  }

  async deleteDocument(id: number): Promise<void> {
    await api.delete(`/profile/documents/${id}`);
  }

  // Méthodes pour télécharger et visualiser les documents
  getDocumentDownloadUrl(id: number): string {
    return `/profile/documents/${id}/download`;
  }

  getDocumentViewUrl(id: number): string {
    return `/profile/documents/${id}/view`;
  }

  async downloadDocument(id: number): Promise<void> {
    // Récupérer d'abord les informations du document pour obtenir le nom de fichier original
    const documents = await this.getDocuments();
    const docInfo = documents.find(doc => doc.id === id);
    
    if (!docInfo) {
      throw new Error('Document not found');
    }

    const url = this.getDocumentDownloadUrl(id);
    const response = await api.get(url, {
      responseType: 'blob',
    });
    
    // Créer un lien de téléchargement avec le nom de fichier original
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = docInfo.originalFilename || `document-${id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  async viewDocument(id: number): Promise<void> {
    // Récupérer d'abord les informations du document pour obtenir le type MIME
    const documents = await this.getDocuments();
    const docInfo = documents.find(doc => doc.id === id);
    
    if (!docInfo) {
      throw new Error('Document not found');
    }

    const url = this.getDocumentViewUrl(id);
    const response = await api.get(url, {
      responseType: 'blob',
    });
    
    // Créer un blob URL pour l'affichage avec le bon type MIME
    const blob = new Blob([response.data], { 
      type: docInfo.mimeType || 'application/octet-stream' 
    });
    const viewUrl = window.URL.createObjectURL(blob);
    window.open(viewUrl, '_blank');
    
    // Nettoyer l'URL après un délai
    setTimeout(() => {
      window.URL.revokeObjectURL(viewUrl);
    }, 1000);
  }

  // Applications management
  async getApplications(): Promise<Application[]> {
    const response = await api.get('/profile/applications');
    // Handle case where backend returns { userProfile: {...} } structure
    if (response.data && response.data.userProfile) {
      return response.data.userProfile.applications || [];
    }
    return response.data || [];
  }

  async addApplication(application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    const response = await api.post('/profile/applications', application);
    return response.data;
  }

  async updateApplication(id: number, application: Partial<Application>): Promise<Application> {
    const response = await api.put(`/profile/applications/${id}`, application);
    return response.data;
  }

  async deleteApplication(id: number): Promise<void> {
    await api.delete(`/profile/applications/${id}`);
  }

  // Shortlist management
  async getShortlist(): Promise<{ programs: any[], establishments: any[] }> {
    const response = await api.get('/profile/shortlist');
    // Handle case where backend returns { userProfile: {...} } structure
    if (response.data && response.data.userProfile) {
      return response.data.userProfile.shortlist || { programs: [], establishments: [] };
    }
    return response.data || { programs: [], establishments: [] };
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      'valid': 'text-green-600 bg-green-100',
      'expired': 'text-red-600 bg-red-100',
      'pending': 'text-yellow-600 bg-yellow-100',
      'uploaded': 'text-blue-600 bg-blue-100',
      'processing': 'text-blue-600 bg-blue-100',
      'verified': 'text-green-600 bg-green-100',
      'rejected': 'text-red-600 bg-red-100',
      'draft': 'text-gray-600 bg-gray-100',
      'not_required': 'text-gray-600 bg-gray-100',
      'submitted': 'text-blue-600 bg-blue-100',
      'under_review': 'text-yellow-600 bg-yellow-100',
      'accepted': 'text-green-600 bg-green-100',
      'waitlisted': 'text-orange-600 bg-orange-100',
      // Statuts de validation E-TAWJIHI
      'approved': 'text-green-600 bg-green-100',
      'rejected_validation': 'text-red-600 bg-red-100',
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  }

  getStatusText(status: string): string {
    const statusTexts: Record<string, string> = {
      'valid': 'Valid',
      'expired': 'Expired',
      'pending': 'Pending',
      'uploaded': 'Uploaded',
      'processing': 'Processing',
      'verified': 'Verified',
      'rejected': 'Rejected',
      'draft': 'Draft',
      'not_required': 'Not Required',
      'submitted': 'Submitted',
      'under_review': 'Under Review',
      'accepted': 'Accepted',
      'waitlisted': 'Waitlisted',
      // Statuts de validation E-TAWJIHI
      'approved': 'Approved by E-TAWJIHI',
      'rejected_validation': 'Rejected by E-TAWJIHI',
    };
    return statusTexts[status] || status;
  }
}

export default new ProfileService();

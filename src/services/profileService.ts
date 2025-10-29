import api from '../config/api';
import { getAllDefaultQualifications, getDefaultQualificationsByType, getEssentialQualifications, getSimpleCommonQualifications, DefaultQualification } from './defaultQualificationsService';

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
  expiryDate?: string;
  grade?: string;
  score?: string;
  scoreType?: string;
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

  // Auto-add essential qualifications only (Baccalauréat and TCF)
  async addDefaultQualifications(): Promise<void> {
    try {
      const existingQualifications = await this.getQualifications();
      const existingTitles = existingQualifications.map(q => q.title.toLowerCase());
      
      // Get only essential qualifications that don't already exist
      const essentialQuals = getEssentialQualifications().filter(defaultQual => 
        !existingTitles.some(existingTitle => 
          existingTitle.includes(defaultQual.title.toLowerCase()) ||
          defaultQual.title.toLowerCase().includes(existingTitle)
        )
      );
      
      // Add each essential qualification
      for (const defaultQual of essentialQuals) {
        try {
          await this.addQualification(defaultQual);
          console.log(`Added essential qualification: ${defaultQual.title}`);
        } catch (error) {
          console.error(`Failed to add qualification ${defaultQual.title}:`, error);
        }
      }
      
      console.log(`Added ${essentialQuals.length} essential qualifications (Baccalauréat and TCF)`);
    } catch (error) {
      console.error('Error adding essential qualifications:', error);
    }
  }

  // Add simple common qualifications (Baccalauréat and TCF only) and return updated list
  async addSimpleCommonQualifications(): Promise<Qualification[]> {
    try {
      const existingQualifications = await this.getQualifications();
      const existingTitles = existingQualifications.map(q => q.title.toLowerCase());
      
      // Get only simple common qualifications that don't already exist
      const simpleQuals = getSimpleCommonQualifications().filter(defaultQual => 
        !existingTitles.some(existingTitle => 
          existingTitle.includes(defaultQual.title.toLowerCase()) ||
          defaultQual.title.toLowerCase().includes(existingTitle)
        )
      );
      
      // Add each simple qualification
      for (const defaultQual of simpleQuals) {
        try {
          await this.addQualification(defaultQual);
          console.log(`Added simple qualification: ${defaultQual.title}`);
        } catch (error) {
          console.error(`Failed to add qualification ${defaultQual.title}:`, error);
        }
      }
      
      console.log(`Added ${simpleQuals.length} simple qualifications (Baccalauréat and TCF)`);
      
      // Return updated qualifications list
      return await this.getQualifications();
    } catch (error) {
      console.error('Error adding simple qualifications:', error);
      throw error;
    }
  }

  // Add specific default qualifications by type
  async addDefaultQualificationsByType(type: string): Promise<void> {
    try {
      const existingQualifications = await this.getQualifications();
      const existingTitles = existingQualifications.map(q => q.title.toLowerCase());
      
      const defaultQuals = getDefaultQualificationsByType(type).filter(defaultQual => 
        !existingTitles.some(existingTitle => 
          existingTitle.includes(defaultQual.title.toLowerCase()) ||
          defaultQual.title.toLowerCase().includes(existingTitle)
        )
      );
      
      for (const defaultQual of defaultQuals) {
        try {
          await this.addQualification(defaultQual);
          console.log(`Added default ${type} qualification: ${defaultQual.title}`);
        } catch (error) {
          console.error(`Failed to add ${type} qualification ${defaultQual.title}:`, error);
        }
      }
      
      console.log(`Added ${defaultQuals.length} default ${type} qualifications`);
    } catch (error) {
      console.error(`Error adding default ${type} qualifications:`, error);
    }
  }

  // Documents management - Now handled through Application Process
  async getDocuments(): Promise<Document[]> {
    // Documents are now managed through the Application Process page
    return [];
  }

  async uploadDocument(file: File, documentData: any): Promise<Document> {
    // Documents are now managed through the Application Process page
    throw new Error('Documents are now managed through the Application Process page');
  }

  async updateDocument(id: number, document: Partial<Document>): Promise<Document> {
    // Documents are now managed through the Application Process page
    throw new Error('Documents are now managed through the Application Process page');
  }

  async deleteDocument(id: number): Promise<void> {
    // Documents are now managed through the Application Process page
    throw new Error('Documents are now managed through the Application Process page');
  }

  getDocumentDownloadUrl(id: number): string {
    // Documents are now managed through the Application Process page
    return '#';
  }

  getDocumentViewUrl(id: number): string {
    // Documents are now managed through the Application Process page
    return '#';
  }

  async downloadDocument(id: number): Promise<void> {
    // Documents are now managed through the Application Process page
    throw new Error('Documents are now managed through the Application Process page');
  }

  async viewDocument(id: number): Promise<void> {
    // Documents are now managed through the Application Process page
    throw new Error('Documents are now managed through the Application Process page');
  }

  // Applications management - Now handled through Application Process
  async getApplications(): Promise<Application[]> {
    // Applications are now managed through the Application Process page
    return [];
  }

  async addApplication(application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    // Applications are now managed through the Application Process page
    throw new Error('Applications are now managed through the Application Process page');
  }

  async updateApplication(id: number, application: Partial<Application>): Promise<Application> {
    // Applications are now managed through the Application Process page
    throw new Error('Applications are now managed through the Application Process page');
  }

  async deleteApplication(id: number): Promise<void> {
    // Applications are now managed through the Application Process page
    throw new Error('Applications are now managed through the Application Process page');
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

  async validateStep3(): Promise<{
    isValid: boolean;
    missingDocuments: string[];
    documentsStatus: Record<string, {
      exists: boolean;
      title: string;
      originalLanguage?: string;
      validationStatus?: string;
    }>;
  }> {
    try {
      const response = await api.get('/profile/validate-step3');
      return response.data;
    } catch (error) {
      console.error('Error validating step 3:', error);
      throw error;
    }
  }

  async saveStep2Validation(isValidated: boolean): Promise<{ success: boolean; step2Validated: boolean }> {
    try {
      const response = await api.post('/profile/validate-step2', { isValidated });
      return response.data;
    } catch (error) {
      console.error('Error saving step 2 validation:', error);
      throw error;
    }
  }

  async getStep2Validation(): Promise<{ step2Validated: boolean }> {
    try {
      const response = await api.get('/profile/get-step2-validation');
      return response.data;
    } catch (error) {
      console.error('Error getting step 2 validation:', error);
      throw error;
    }
  }

  async saveStep4Validation(isValidated: boolean): Promise<{ success: boolean; step4Validated: boolean }> {
    try {
      const response = await api.post('/profile/validate-step4', { isValidated });
      return response.data;
    } catch (error) {
      console.error('Error saving step 4 validation:', error);
      throw error;
    }
  }

  async getStep4Validation(): Promise<{ step4Validated: boolean }> {
    try {
      const response = await api.get('/profile/get-step4-validation');
      return response.data;
    } catch (error) {
      console.error('Error getting step 4 validation:', error);
      throw error;
    }
  }

  async saveStep5Validation(isValidated: boolean): Promise<{ success: boolean; step5Validated: boolean }> {
    try {
      const response = await api.post('/profile/validate-step5', { isValidated });
      return response.data;
    } catch (error) {
      console.error('Error saving step 5 validation:', error);
      throw error;
    }
  }

  async getStep5Validation(): Promise<{ step5Validated: boolean }> {
    try {
      const response = await api.get('/profile/get-step5-validation');
      return response.data;
    } catch (error) {
      console.error('Error getting step 5 validation:', error);
      throw error;
    }
  }
}

export default new ProfileService();

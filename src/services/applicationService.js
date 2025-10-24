import api from '../config/api';
import userProfileService from './userProfileService';

export const applicationService = {
  // Get all applications for current user
  async getApplications() {
    const response = await api.get('/applications');
    return response.data;
  },

  // Get specific application with progress
  async getApplication(id) {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Get application by program ID
  async getApplicationByProgram(programId) {
    const response = await api.get(`/applications/by-program/${programId}`);
    return response.data;
  },

  // Create new application
  async createApplication(programId) {
    const response = await api.post('/applications', { programId });
    return response.data;
  },

  // Update application step
  async updateApplicationStep(applicationId, stepNumber, stepData) {
    const response = await api.put(`/applications/${applicationId}/steps/${stepNumber}`, stepData);
    return response.data;
  },

  // Assign agent
  async assignAgent(applicationId, agentData) {
    const response = await api.post(`/applications/${applicationId}/agent`, agentData);
    return response.data;
  },

  // Upload document
  async uploadDocument(applicationId, documentType, file) {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);

    const response = await api.post(`/applications/${applicationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Submit application
  async submitApplication(applicationId) {
    const response = await api.post(`/applications/${applicationId}/submit`);
    return response.data;
  },

  // Get steps configuration
  async getStepsConfiguration() {
    const response = await api.get('/applications/steps/config');
    return response.data;
  },

  // Alias for getStepsConfiguration
  async getStepsConfig() {
    return this.getStepsConfiguration();
  },

  // Get pre-filled data for application steps
  async getPrefilledStepData(stepNumber) {
    switch (stepNumber) {
      case 1: // Personal Information
        return await userProfileService.getPersonalInfo();
      case 3: // Academic Documents
        return await userProfileService.getAcademicInfo();
      case 5: // Motivation Letter
        return {
          content: '',
          wordCount: 0,
          lastSaved: null
        };
      case 6: // References
        return await userProfileService.getReferences();
      default:
        return {};
    }
  },

  // Update application step and sync with profile if needed
  async updateApplicationStepWithProfileSync(applicationId, stepNumber, stepData) {
    // Update the application step
    const response = await this.updateApplicationStep(applicationId, stepNumber, stepData);
    
    // Sync with profile for relevant steps
    await this.syncStepDataWithProfile(stepNumber, stepData);
    
    return response;
  },

  // Sync step data with user profile
  async syncStepDataWithProfile(stepNumber, stepData) {
    try {
      switch (stepNumber) {
        case 1: // Personal Information
          await userProfileService.updatePersonalInfo(stepData);
          break;
        case 3: // Academic Documents
          await userProfileService.updateAcademicInfo(stepData);
          break;
        case 6: // References
          await userProfileService.updateReferences(stepData);
          break;
        // Other steps don't need profile sync
      }
    } catch (error) {
      console.warn('Failed to sync step data with profile:', error);
      // Don't throw error to avoid breaking the application flow
    }
  },

  // Check if profile needs to be updated based on application data
  async checkAndUpdateProfile(applicationData) {
    const isProfileComplete = await userProfileService.isProfileComplete();
    
    if (!isProfileComplete) {
      // Update profile with application data
      const personalData = applicationData.personalInfo || {};
      const academicData = applicationData.academicInfo || {};
      const referencesData = applicationData.references || {};
      
      if (Object.keys(personalData).length > 0) {
        await userProfileService.updatePersonalInfo(personalData);
      }
      
      if (Object.keys(academicData).length > 0) {
        await userProfileService.updateAcademicInfo(academicData);
      }
      
      if (Object.keys(referencesData).length > 0) {
        await userProfileService.updateReferences(referencesData);
      }
    }
  },

  // Helper methods
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getDocumentTypeLabel(type, language = 'en') {
    const labels = {
      en: {
        passport: 'Passport',
        diploma: 'Diploma/Certificate',
        transcript: 'Academic Transcript',
        language_certificate: 'Language Certificate',
        motivation_letter: 'Motivation Letter',
        recommendation_letter: 'Recommendation Letter',
        photo: 'Passport Photo',
        cv: 'CV/Resume',
        financial_proof: 'Financial Proof',
        medical_certificate: 'Medical Certificate'
      },
      fr: {
        passport: 'Passeport',
        diploma: 'Diplôme/Certificat',
        transcript: 'Relevé de Notes',
        language_certificate: 'Certificat de Langue',
        motivation_letter: 'Lettre de Motivation',
        recommendation_letter: 'Lettre de Recommandation',
        photo: 'Photo Passeport',
        cv: 'CV',
        financial_proof: 'Preuve Financière',
        medical_certificate: 'Certificat Médical'
      }
    };
    return labels[language]?.[type] || type;
  },

  getStatusLabel(status, language = 'en') {
    const labels = {
      en: {
        draft: 'Draft',
        submitted: 'Submitted',
        under_review: 'Under Review',
        accepted: 'Accepted',
        rejected: 'Rejected'
      },
      fr: {
        draft: 'Brouillon',
        submitted: 'Soumise',
        under_review: 'En Révision',
        accepted: 'Acceptée',
        rejected: 'Rejetée'
      }
    };
    return labels[language]?.[status] || status;
  },

  getDocumentStatusLabel(status, language = 'en') {
    const labels = {
      en: {
        pending: 'Pending Review',
        approved: 'Approved',
        rejected: 'Rejected',
        under_review: 'Under Review'
      },
      fr: {
        pending: 'En Attente',
        approved: 'Approuvé',
        rejected: 'Rejeté',
        under_review: 'En Révision'
      }
    };
    return labels[language]?.[status] || status;
  }
};

export default applicationService;

import api from '../config/api';

export interface Document {
  id?: number;
  type: string;
  category: string;
  title: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  status: string;
  validationStatus?: string;
  validationNotes?: string;
  validatedBy?: string;
  validatedAt?: string;
  rejectionReason?: string;
  expiryDate?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  originalLanguage?: string;
  etawjihiNotes?: string;
}

class DocumentService {

  async getDocuments(): Promise<Document[]> {
    try {
      const response = await api.get('/profile/documents');
      return response.data.documents || response.data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async uploadDocument(file: File, documentData: {
    type: string;
    category: string;
    title: string;
    description?: string;
    originalLanguage?: string;
    expiryDate?: string;
  }): Promise<Document> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', documentData.type);
      formData.append('category', documentData.category);
      formData.append('title', documentData.title);
      if (documentData.description) {
        formData.append('description', documentData.description);
      }
      if (documentData.originalLanguage) {
        formData.append('originalLanguage', documentData.originalLanguage);
      }
      if (documentData.expiryDate) {
        formData.append('expiryDate', documentData.expiryDate);
      }

      const response = await api.post('/profile/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.document || response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async updateDocument(id: number, updateData: Partial<Document>): Promise<Document> {
    try {
      const response = await api.put(`/profile/documents/${id}`, updateData);
      return response.data.document || response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async deleteDocument(id: number): Promise<void> {
    try {
      await api.delete(`/profile/documents/${id}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async getDocumentContent(id: number): Promise<Blob> {
    try {
      const response = await api.get(`/profile/documents/${id}/view`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching document content:', error);
      throw error;
    }
  }

  // Helper method to map document key to type and category
  getDocumentTypeAndCategory(docKey: string): { type: string; category: string } {
    const typeMapping: { [key: string]: { type: string; category: string } } = {
      // Personal Documents
      'passport': { type: 'personal', category: 'identity' },
      'nationalId': { type: 'personal', category: 'identity' },
      'cv': { type: 'personal', category: 'cv' },
      'guardian1NationalId': { type: 'personal', category: 'guardian' },
      'guardian2NationalId': { type: 'personal', category: 'guardian' },
      
      // Academic Documents
      'transcript': { type: 'academic', category: 'transcript' },
      'englishTest': { type: 'academic', category: 'language_test' },
      'frenchTest': { type: 'academic', category: 'language_test' },
      'portfolio': { type: 'academic', category: 'portfolio' },
      'baccalaureate': { type: 'academic', category: 'diploma' },
      'bac2': { type: 'academic', category: 'diploma' },
      'bac3': { type: 'academic', category: 'diploma' },
      'bac5': { type: 'academic', category: 'diploma' },
      'enrollmentCertificate': { type: 'academic', category: 'certificate' },
      
      // Application Documents
      'recommendationLetter1': { type: 'application', category: 'recommendation' },
      'recommendationLetter2': { type: 'application', category: 'recommendation' },
      'motivationLetter': { type: 'application', category: 'motivation' }
    };

    return typeMapping[docKey] || { type: 'other', category: 'other' };
  }

  // Helper method to get document title
  getDocumentTitle(docKey: string, language: string = 'en'): string {
    const titleMapping: { [key: string]: { en: string; fr: string } } = {
      'passport': { en: 'Passport', fr: 'Passeport' },
      'nationalId': { en: 'National ID Card', fr: 'Carte Nationale' },
      'cv': { en: 'Curriculum Vitae (CV)', fr: 'Curriculum Vitae (CV)' },
      'guardian1NationalId': { en: 'Guardian 1 National ID', fr: 'Carte Nationale Tuteur 1' },
      'guardian2NationalId': { en: 'Guardian 2 National ID', fr: 'Carte Nationale Tuteur 2' },
      'transcript': { en: 'General Transcript', fr: 'Relevé de note général' },
      'englishTest': { en: 'English Test Certificate', fr: 'Certificat de Test d\'Anglais' },
      'frenchTest': { en: 'French Test Certificate', fr: 'Certificat de Test de Français' },
      'portfolio': { en: 'Portfolio', fr: 'Portfolio' },
      'baccalaureate': { en: 'Baccalaureate Diploma', fr: 'Diplôme du Baccalauréat' },
      'bac2': { en: 'BAC+2 Diploma', fr: 'Diplôme BAC+2' },
      'bac3': { en: 'BAC+3 Diploma', fr: 'Diplôme BAC+3' },
      'bac5': { en: 'BAC+5 Diploma', fr: 'Diplôme BAC+5' },
      'enrollmentCertificate': { en: 'Enrollment Certificate', fr: 'Attestation de Scolarité' },
      'recommendationLetter1': { en: 'Recommendation Letter 1', fr: 'Lettre de Recommandation 1' },
      'recommendationLetter2': { en: 'Recommendation Letter 2', fr: 'Lettre de Recommandation 2' },
      'motivationLetter': { en: 'Motivation Letter', fr: 'Lettre de Motivation' }
    };

    return titleMapping[docKey]?.[language] || docKey;
  }
}

const documentService = new DocumentService();
export default documentService;
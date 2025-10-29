import api from '../config/api';

export interface DocumentTranslation {
  id: number;
  targetLanguage: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  status: 'uploaded' | 'approved' | 'rejected' | 'under_review';
  notes?: string;
  etawjihiNotes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateTranslationRequest {
  targetLanguage: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  notes?: string;
}

export interface UpdateTranslationRequest {
  status?: 'uploaded' | 'approved' | 'rejected' | 'under_review';
  notes?: string;
  etawjihiNotes?: string;
  targetLanguage?: string;
}

class DocumentTranslationService {
  async getTranslations(documentId: number): Promise<DocumentTranslation[]> {
    try {
      const response = await api.get(`/profile/documents/${documentId}/translations`);
      return response.data.translations || [];
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  }

  async createTranslation(documentId: number, file: File, translationData: {
    targetLanguage: string;
    notes?: string;
  }): Promise<DocumentTranslation> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetLanguage', translationData.targetLanguage);
      if (translationData.notes) {
        formData.append('notes', translationData.notes);
      }

      const response = await api.post(`/profile/documents/${documentId}/translations`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.translation || response.data;
    } catch (error) {
      console.error('Error creating translation:', error);
      throw error;
    }
  }

  async updateTranslation(documentId: number, translationId: number, updateData: UpdateTranslationRequest): Promise<DocumentTranslation> {
    try {
      const response = await api.put(`/profile/documents/${documentId}/translations/${translationId}`, updateData);
      return response.data.translation;
    } catch (error) {
      console.error('Error updating translation:', error);
      throw error;
    }
  }

  async deleteTranslation(documentId: number, translationId: number): Promise<void> {
    try {
      await api.delete(`/profile/documents/${documentId}/translations/${translationId}`);
    } catch (error) {
      console.error('Error deleting translation:', error);
      throw error;
    }
  }

  async viewTranslation(documentId: number, translationId: number): Promise<void> {
    try {
      const url = `/profile/documents/${documentId}/translations/${translationId}/view`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing translation:', error);
      throw error;
    }
  }

  async getTranslationContent(documentId: number, translationId: number): Promise<Blob> {
    try {
      const response = await api.get(`/profile/documents/${documentId}/translations/${translationId}/content`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching translation content:', error);
      throw error;
    }
  }
}

const documentTranslationService = new DocumentTranslationService();
export default documentTranslationService;

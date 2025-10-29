import api from '../config/api';

export interface FinalStep {
  id: number;
  name: string;
  description: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  notes?: string;
  completedAt?: string;
  documents: FinalStepDocument[];
}

export interface FinalStepDocument {
  id: number;
  title: string;
  filePath: string;
  fileType: string;
  fileSize?: number;
}

export interface UpdateFinalStepStatusRequest {
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  notes?: string;
}

class FinalStepService {
  async getFinalSteps(language: string = 'en'): Promise<FinalStep[]> {
    try {
      const response = await api.get(`/final-steps?language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching final steps:', error);
      throw error;
    }
  }

  async updateFinalStepStatus(stepId: number, data: UpdateFinalStepStatusRequest): Promise<{
    success: boolean;
    status: string;
    notes?: string;
    completedAt?: string;
  }> {
    try {
      const response = await api.post(`/final-steps/${stepId}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating final step status:', error);
      throw error;
    }
  }

  async downloadDocument(documentId: number): Promise<Blob> {
    try {
      const response = await api.get(`/final-steps/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }
}

export default new FinalStepService();

import api from '../config/api';
import { Ambassador } from '../types/ambassadorTypes';

export interface AmbassadorResponse {
  success: boolean;
  data: Ambassador[];
  message?: string;
}

export interface AmbassadorSingleResponse {
  success: boolean;
  data: Ambassador;
  message?: string;
}

export interface AmbassadorListResponse {
  success: boolean;
  data: string[];
  message?: string;
}

class AmbassadorService {
  private baseUrl = '/ambassadors';

  async getAmbassadors(
    status: string = 'active',
    university: string = '',
    search: string = ''
  ): Promise<AmbassadorResponse> {
    try {
      const params: any = { status };
      if (university) params.university = university;
      if (search) params.search = search;

      const response = await api.get(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching ambassadors:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch ambassadors');
    }
  }

  async getMyAmbassador(): Promise<AmbassadorSingleResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/my`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching my ambassador application:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch ambassador application');
    }
  }

  async createAmbassador(ambassadorData: {
    university: string;
    fieldOfStudy: string;
    studyLevel: string;
    graduationYear: number;
    motivation: string;
    experience: string;
    skills: string;
    socialMedia?: string;
    additionalInfo?: string;
  }): Promise<AmbassadorSingleResponse> {
    try {
      const response = await api.post(this.baseUrl, ambassadorData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating ambassador application:', error);
      throw new Error(error.response?.data?.message || 'Failed to create ambassador application');
    }
  }

  async updateAmbassador(id: number, ambassadorData: Partial<Ambassador>): Promise<AmbassadorSingleResponse> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, ambassadorData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating ambassador application:', error);
      throw new Error(error.response?.data?.message || 'Failed to update ambassador application');
    }
  }

  async deleteAmbassador(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting ambassador application:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete ambassador application');
    }
  }

  async getUniversities(): Promise<AmbassadorListResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/universities`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching universities:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch universities');
    }
  }

  async getFieldsOfStudy(): Promise<AmbassadorListResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/fields-of-study`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching fields of study:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch fields of study');
    }
  }

  async searchAmbassadors(searchTerm: string): Promise<AmbassadorResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          search: searchTerm,
          status: 'active'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error searching ambassadors:', error);
      throw new Error(error.response?.data?.message || 'Failed to search ambassadors');
    }
  }
}

export default new AmbassadorService();

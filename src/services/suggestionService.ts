import api from '../config/api';
import { Suggestion } from '../types/suggestionTypes';

export interface SuggestionResponse {
  success: boolean;
  data: Suggestion[];
  message?: string;
}

export interface SuggestionSingleResponse {
  success: boolean;
  data: Suggestion;
  message?: string;
}

export interface SuggestionCategoriesResponse {
  success: boolean;
  data: string[];
  message?: string;
}

class SuggestionService {
  private baseUrl = '/suggestions';


  async getSuggestionById(id: number): Promise<SuggestionSingleResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching suggestion:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch suggestion');
    }
  }

  async createSuggestion(suggestionData: {
    category: string;
    title: string;
    description: string;
    priority?: string;
    attachments?: string[];
    isPublic?: boolean;
    isAnonymous?: boolean;
  }): Promise<SuggestionSingleResponse> {
    try {
      const response = await api.post(this.baseUrl, suggestionData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating suggestion:', error);
      throw new Error(error.response?.data?.message || 'Failed to create suggestion');
    }
  }

  async updateSuggestion(id: number, suggestionData: Partial<Suggestion>): Promise<SuggestionSingleResponse> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, suggestionData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating suggestion:', error);
      throw new Error(error.response?.data?.message || 'Failed to update suggestion');
    }
  }

  async deleteSuggestion(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting suggestion:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete suggestion');
    }
  }


  async getCategories(): Promise<SuggestionCategoriesResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/categories`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching suggestion categories:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch suggestion categories');
    }
  }

  async searchSuggestions(searchTerm: string): Promise<SuggestionResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          search: searchTerm,
          type: 'my'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error searching suggestions:', error);
      throw new Error(error.response?.data?.message || 'Failed to search suggestions');
    }
  }

  async getMySuggestions(): Promise<SuggestionResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          type: 'my'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching my suggestions:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch my suggestions');
    }
  }

}

export default new SuggestionService();

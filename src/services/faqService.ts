import api from '../config/api';
import { FAQ } from '../types/faqTypes';

export interface FAQResponse {
  success: boolean;
  data: FAQ[] | { [key: string]: FAQ[] };
  message?: string;
}

export interface FAQSingleResponse {
  success: boolean;
  data: FAQ;
  message?: string;
}

export interface FAQCategoriesResponse {
  success: boolean;
  data: string[];
  message?: string;
}

class FAQService {
  private baseUrl = '/faqs';

  async getFAQs(
    language: string = 'en', 
    category: string = 'all', 
    search: string = '', 
    popular: boolean = false
  ): Promise<FAQResponse> {
    try {
      const params: any = { language };
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      if (popular) params.popular = 'true';

      const response = await api.get(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching FAQs:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch FAQs');
    }
  }

  async getFAQById(id: number, language: string = 'en'): Promise<FAQSingleResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`, {
        params: { language }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching FAQ:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch FAQ');
    }
  }

  async getCategories(): Promise<FAQCategoriesResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/categories`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching FAQ categories:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch FAQ categories');
    }
  }

  async searchFAQs(searchTerm: string, language: string = 'en'): Promise<FAQResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          language,
          search: searchTerm
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error searching FAQs:', error);
      throw new Error(error.response?.data?.message || 'Failed to search FAQs');
    }
  }

  async getPopularFAQs(language: string = 'en'): Promise<FAQResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          language,
          popular: 'true'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching popular FAQs:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch popular FAQs');
    }
  }
}

export default new FAQService();

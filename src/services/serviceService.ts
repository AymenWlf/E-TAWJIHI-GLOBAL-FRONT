import api from '../config/api';

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  currency: string;
  originalCurrency: string;
  category: string;
  targetCountries: string[];
  features: string[];
  icon: string;
  color: string;
  duration?: number;
  durationUnit?: string;
  isAvailable: boolean;
  availabilityMessage: string;
}

export interface ServiceResponse {
  success: boolean;
  data: Service[];
  userCountry?: string;
  userStudyCountry?: string;
  userCurrency?: string;
  message?: string;
}

export interface SingleServiceResponse {
  success: boolean;
  data: Service;
  message?: string;
}

class ServiceService {
  /**
   * Get all services with user-specific filtering and currency conversion
   */
  async getServices(language: string = 'en'): Promise<ServiceResponse> {
    try {
      const response = await api.get(`/services?language=${language}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching services:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch services');
    }
  }

  /**
   * Get a specific service by ID
   */
  async getService(id: number, language: string = 'en'): Promise<SingleServiceResponse> {
    try {
      const response = await api.get(`/services/${id}?language=${language}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching service:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch service');
    }
  }

  /**
   * Get services by category
   */
  async getServicesByCategory(category: string, language: string = 'en'): Promise<ServiceResponse> {
    try {
      const response = await api.get(`/services?category=${category}&language=${language}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching services by category:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch services by category');
    }
  }

  /**
   * Get available services for user's country
   */
  async getAvailableServices(language: string = 'en'): Promise<ServiceResponse> {
    try {
      const response = await api.get(`/services?available=true&language=${language}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching available services:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch available services');
    }
  }
}

export default new ServiceService();

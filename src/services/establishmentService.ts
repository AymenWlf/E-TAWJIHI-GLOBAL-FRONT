import api from '../config/api';

export interface Establishment {
  id: number;
  name: string;
  country?: string;
  city?: string;
  type?: string;
  rating?: string;
  students?: number;
  programs?: number;
  logo?: string;
  description?: string;
  featured: boolean;
  sponsored: boolean;
  tuition?: string;
  tuitionRange?: {
    min?: string;
    max?: string;
    currency?: string;
  };
  acceptanceRate?: string;
  worldRanking?: number;
  rankings?: {
    qs?: number;
    times?: number;
    arwu?: number;
    usNews?: number;
  };
  popularPrograms?: string[];
  applicationDeadline?: string;
  scholarships: boolean;
  housing: boolean;
  language?: string;
  aidvisorRecommended: boolean;
  easyApply: boolean;
  universityType?: string;
  commissionRate?: string;
  freeApplications?: number;
  visaSupport?: string;
  countrySpecific?: any;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  accreditations?: string[];
  accommodation: boolean;
  careerServices: boolean;
  languageSupport: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EstablishmentFilters {
  country?: string | string[];
  city?: string;
  type?: string;
  studyLevel?: string | string[];
  universityType?: string | string[];
  language?: string;
  scholarships?: boolean;
  housing?: boolean;
  featured?: boolean;
  aidvisorRecommended?: boolean;
  easyApply?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EstablishmentListResponse {
  success: boolean;
  data: Establishment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface EstablishmentResponse {
  success: boolean;
  data: Establishment;
}

export interface EstablishmentFiltersResponse {
  success: boolean;
  data: {
    countries: string[];
    cities: string[];
    types: string[];
    universityTypes: string[];
    languages: string[];
  };
}

class EstablishmentService {
  async getEstablishments(filters?: EstablishmentFilters): Promise<EstablishmentListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              value.forEach(item => params.append(`${key}[]`, item.toString()));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      const response = await api.get<EstablishmentListResponse>(`/establishments?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des établissements');
    }
  }

  async getEstablishment(id: number): Promise<EstablishmentResponse> {
    try {
      const response = await api.get<EstablishmentResponse>(`/establishments/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'établissement');
    }
  }

  async getFeaturedEstablishments(): Promise<EstablishmentListResponse> {
    try {
      const response = await api.get<EstablishmentListResponse>('/establishments/featured');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des établissements en vedette');
    }
  }

  async searchEstablishments(query: string): Promise<EstablishmentListResponse> {
    try {
      const response = await api.get<EstablishmentListResponse>(`/establishments/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la recherche d\'établissements');
    }
  }


  async getEstablishmentPrograms(id: number): Promise<{ success: boolean; data: any[]; total: number }> {
    try {
      const response = await api.get<{ success: boolean; data: any[]; total: number }>(`/establishments/${id}/programs`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des programmes de l\'établissement');
    }
  }
}

const establishmentService = new EstablishmentService();
export default establishmentService;

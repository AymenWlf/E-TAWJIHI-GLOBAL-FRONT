import api from '../config/api';

export interface AdminEstablishment {
  id: number;
  name: string;
  nameFr?: string;
  slug: string;
  country?: string;
  city?: string;
  type?: string;
  rating?: string;
  students?: number;
  programs?: number;
  logo?: string;
  featured: boolean;
  sponsored: boolean;
  universityType?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Detailed fields (when detailed = true)
  description?: string;
  descriptionFr?: string;
  mission?: string;
  missionFr?: string;
  foundedYear?: number;
  tuition?: string;
  tuitionMin?: string;
  tuitionMax?: string;
  tuitionCurrency?: string;
  acceptanceRate?: string;
  worldRanking?: number;
  qsRanking?: number;
  timesRanking?: number;
  arwuRanking?: number;
  usNewsRanking?: number;
  popularPrograms?: string[];
  applicationDeadline?: string;
  scholarships: boolean;
  scholarshipTypes?: string[];
  scholarshipDescription?: string;
  housing: boolean;
  language?: string;
  aidvisorRecommended: boolean;
  easyApply: boolean;
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
  admissionRequirements?: any;
  admissionRequirementsFr?: any;
  englishTestRequirements?: any;
  academicRequirements?: any;
  documentRequirements?: any;
  visaRequirements?: any;
  applicationFee?: string;
  applicationFeeCurrency?: string;
  livingCosts?: string;
  livingCostsCurrency?: string;
  programsCount?: number;
}

export interface AdminStats {
  establishments: {
    total: number;
    active: number;
    inactive: number;
  };
  programs: {
    total: number;
    active: number;
    inactive: number;
  };
  byCountry: Array<{
    country: string;
    count: number;
  }>;
  byUniversityType: Array<{
    universityType: string;
    count: number;
  }>;
}

export interface AdminListResponse {
  success: boolean;
  data: AdminEstablishment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}

export interface AdminResponse {
  success: boolean;
  data?: AdminEstablishment;
  message?: string;
  errors?: string[];
}

export interface AdminStatsResponse {
  success: boolean;
  data?: AdminStats;
  message?: string;
}

export interface AdminFilters {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  type?: string;
  universityType?: string;
  isActive?: boolean;
}

export interface TranslationPrice {
  id?: number;
  fromLanguage: string;
  toLanguage: string;
  price: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TranslationPriceResponse {
  success: boolean;
  data?: TranslationPrice | TranslationPrice[];
  message?: string;
  error?: string;
}

class AdminService {
  // ===== ESTABLISHMENTS MANAGEMENT =====

  async getEstablishments(filters?: AdminFilters): Promise<AdminListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get<AdminListResponse>(`/admin/establishments?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des établissements');
    }
  }

  async getEstablishment(id: number): Promise<AdminResponse> {
    try {
      const response = await api.get<AdminResponse>(`/admin/establishments/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'établissement');
    }
  }

  async createEstablishment(establishment: Partial<AdminEstablishment>): Promise<AdminResponse> {
    try {
      const response = await api.post<AdminResponse>('/admin/establishments', establishment);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'établissement');
    }
  }

  async updateEstablishment(id: number, establishment: Partial<AdminEstablishment>): Promise<AdminResponse> {
    try {
      const response = await api.put<AdminResponse>(`/admin/establishments/${id}`, establishment);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'établissement');
    }
  }

  async deleteEstablishment(id: number): Promise<AdminResponse> {
    try {
      const response = await api.delete<AdminResponse>(`/admin/establishments/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'établissement');
    }
  }

  async toggleEstablishmentStatus(id: number): Promise<AdminResponse> {
    try {
      const response = await api.patch<AdminResponse>(`/admin/establishments/${id}/toggle-status`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut');
    }
  }

  // ===== STATISTICS =====

  async getStats(): Promise<AdminStatsResponse> {
    try {
      const response = await api.get<AdminStatsResponse>('/admin/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des statistiques');
    }
  }

  // ===== FILE UPLOADS =====

  async uploadCampusPhoto(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/admin/upload-campus-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'upload de la photo');
    }
  }

  async uploadBrochure(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/admin/upload-brochure', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'upload de la brochure');
    }
  }

  // ===== PROGRAMS MANAGEMENT (Coming Soon) =====

  async getPrograms(filters?: any): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }
      const response = await api.get(`/admin/programs?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des programmes');
    }
  }

  async getProgram(id: number): Promise<any> {
    try {
      const response = await api.get(`/admin/programs/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du programme');
    }
  }

  async createProgram(program: any): Promise<any> {
    try {
      const response = await api.post('/admin/programs', program);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du programme');
    }
  }

  async updateProgram(id: number, program: any): Promise<any> {
    try {
      const response = await api.put(`/admin/programs/${id}`, program);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du programme');
    }
  }

  async deleteProgram(id: number): Promise<any> {
    try {
      const response = await api.delete(`/admin/programs/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du programme');
    }
  }

  // ===== TRANSLATION PRICES MANAGEMENT =====

  async getTranslationPrices(): Promise<TranslationPriceResponse> {
    try {
      const response = await api.get<TranslationPriceResponse>('/admin/translation-prices');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching translation prices:', error);
      // If the response has data, return it to show the error message
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error(error.response?.data?.message || error.message || 'Erreur lors de la récupération des prix de traduction');
    }
  }

  async getTranslationPrice(id: number): Promise<TranslationPriceResponse> {
    try {
      const response = await api.get<TranslationPriceResponse>(`/admin/translation-prices/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du prix');
    }
  }

  async createTranslationPrice(price: TranslationPrice): Promise<TranslationPriceResponse> {
    try {
      const response = await api.post<TranslationPriceResponse>('/admin/translation-prices', price);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du prix');
    }
  }

  async updateTranslationPrice(id: number, price: Partial<TranslationPrice>): Promise<TranslationPriceResponse> {
    try {
      const response = await api.put<TranslationPriceResponse>(`/admin/translation-prices/${id}`, price);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du prix');
    }
  }

  async deleteTranslationPrice(id: number): Promise<TranslationPriceResponse> {
    try {
      const response = await api.delete<TranslationPriceResponse>(`/admin/translation-prices/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du prix');
    }
  }
}

const adminService = new AdminService();
export default adminService;

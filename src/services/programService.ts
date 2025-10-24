import api from '../config/api';

export interface Program {
  id: number;
  name: string;
  establishment: {
    id: number;
    name: string;
    country?: string;
    city?: string;
    logo?: string;
    type?: string;
    rating?: string;
    worldRanking?: number;
  };
  country?: string;
  city?: string;
  degree?: string;
  duration?: string;
  language?: string;
  tuition?: string;
  tuitionAmount?: string;
  tuitionCurrency?: string;
  startDate?: string;
  applicationDeadline?: string;
  description?: string;
  scholarships: boolean;
  logo?: string;
  featured: boolean;
  aidvisorRecommended: boolean;
  easyApply: boolean;
  ranking?: number;
  studyType?: string;
  universityType?: string;
  subject?: string;
  field?: string;
  studyLevel?: string;
  languages?: string[];
  intakes?: string[];
  subjects?: string[];
  studyLevels?: string[];
  curriculum?: string;
  careerProspects?: string;
  faculty?: any[];
  facilities?: any[];
  accreditations?: string[];
  rating?: string;
  reviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgramFilters {
  establishmentId?: number;
  country?: string | string[];
  city?: string;
  degree?: string;
  studyLevel?: string | string[];
  subject?: string | string[];
  intake?: string | string[];
  language?: string;
  studyType?: string | string[];
  universityType?: string | string[];
  scholarships?: boolean;
  featured?: boolean;
  aidvisorRecommended?: boolean;
  easyApply?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProgramListResponse {
  success: boolean;
  data: Program[];
  total: number;
}

export interface ProgramResponse {
  success: boolean;
  data: Program;
}

export interface ProgramFiltersResponse {
  success: boolean;
  data: {
    countries: string[];
    cities: string[];
    degrees: string[];
    studyLevels: string[];
    subjects: string[];
    languages: string[];
    studyTypes: string[];
    universityTypes: string[];
  };
}

class ProgramService {
  async getPrograms(filters?: ProgramFilters): Promise<ProgramListResponse> {
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

      const response = await api.get<ProgramListResponse>(`/programs?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des programmes');
    }
  }

  async getProgram(id: number): Promise<ProgramResponse> {
    try {
      const response = await api.get<ProgramResponse>(`/programs/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du programme');
    }
  }

  async getFeaturedPrograms(): Promise<ProgramListResponse> {
    try {
      const response = await api.get<ProgramListResponse>('/programs/featured');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des programmes en vedette');
    }
  }

  async searchPrograms(query: string): Promise<ProgramListResponse> {
    try {
      const response = await api.get<ProgramListResponse>(`/programs/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la recherche de programmes');
    }
  }


  async getProgramsByEstablishment(establishmentId: number): Promise<ProgramListResponse> {
    try {
      const response = await api.get<ProgramListResponse>(`/programs/establishment/${establishmentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des programmes de l\'établissement');
    }
  }
}

const programService = new ProgramService();
export default programService;

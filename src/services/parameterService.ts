import api from '../config/api';

export interface ParameterItem {
  id: number;
  category: string;
  code: string;
  labelEn: string;
  labelFr: string;
  meta?: Record<string, any> | null;
  parentCode?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ParameterListResponse {
  success: boolean;
  data: ParameterItem[];
  message?: string;
}

const parameterService = {
  async list(category: string, activeOnly: boolean = true): Promise<ParameterListResponse> {
    const res = await api.get(`/parameters`, { params: { category, activeOnly } });
    return res.data;
  },

  async create(item: Partial<ParameterItem>): Promise<any> {
    const res = await api.post(`/parameters`, item);
    return res.data;
  },

  async update(id: number, item: Partial<ParameterItem>): Promise<any> {
    const res = await api.put(`/parameters/${id}`, item);
    return res.data;
  },

  async deactivate(id: number): Promise<any> {
    const res = await api.delete(`/parameters/${id}`);
    return res.data;
  }
};

export default parameterService;



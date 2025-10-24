import api from '../config/api';

export interface Preferences {
  id?: number;
  preferredDestinations?: string[];
  preferredStudyLevel?: string;
  preferredDegree?: string;
  preferredIntakes?: string[];
  preferredSubjects?: string[];
  preferredCurrency?: string;
  annualBudget?: Record<string, any>;
  scholarshipRequired?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class PreferencesService {
  // Get user preferences
  async getPreferences(): Promise<Preferences> {
    const response = await api.get('/preferences');
    return response.data;
  }

  // Update user preferences
  async updatePreferences(preferencesData: Partial<Preferences>): Promise<Preferences> {
    const response = await api.put('/preferences', preferencesData);
    return response.data;
  }

  // Create default preferences
  async createDefaultPreferences(): Promise<Preferences> {
    const defaultPreferences = {
      preferredDestinations: [],
      preferredStudyLevel: '',
      preferredIntakes: [],
      preferredSubjects: [],
      preferredCurrency: 'USD',
      annualBudget: {},
      scholarshipRequired: false
    };
    return this.updatePreferences(defaultPreferences);
  }
}

export default new PreferencesService();

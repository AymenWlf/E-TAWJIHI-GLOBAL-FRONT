import api from '../config/api';

class ApplicationService {
  /**
   * Get all applications for the current user
   */
  async getApplications() {
    const response = await api.get('/applications');
    return response.data.data;
  }

  /**
   * Get a specific application by ID
   */
  async getApplication(id) {
    const response = await api.get(`/applications/${id}`);
    return response.data.data;
  }

  /**
   * Create a new application or get existing one for a program
   */
  async createOrGetApplication(programId, language = 'en') {
    const response = await api.post(`/applications/program/${programId}`, {
      language
    });
    return response.data;
  }

  /**
   * Update an application
   */
  async updateApplication(id, data) {
    const response = await api.put(`/applications/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete an application (only draft applications)
   */
  async deleteApplication(id) {
    await api.delete(`/applications/${id}`);
  }

  /**
   * Check if user has an active application for a program
   */
  async checkApplication(programId) {
    const response = await api.get(`/applications/check/${programId}`);
    return response.data;
  }

  /**
   * Submit an application
   */
  async submitApplication(id) {
    return this.updateApplication(id, { status: 'submitted' });
  }

  /**
   * Save application progress
   */
  async saveApplicationProgress(id, stepData) {
    return this.updateApplication(id, stepData);
  }
}

export default new ApplicationService();

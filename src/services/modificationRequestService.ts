import api from '../config/api';

interface ModificationRequest {
  id: number;
  user: number;
  application: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: string;
  admin?: number;
  modificationAllowedUntil?: string;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
}

interface ModificationRequestStatus {
  data: ModificationRequest | null;
  modificationAllowed: boolean;
}

class ModificationRequestService {
  /**
   * Create a modification request
   */
  async createModificationRequest(applicationId: number, reason: string) {
    const response = await api.post('/modification-requests', {
      applicationId,
      reason
    });
    return response.data;
  }

  /**
   * Get modification request status for an application
   */
  async getModificationRequestStatus(applicationId: number): Promise<ModificationRequestStatus> {
    const response = await api.get(`/modification-requests/application/${applicationId}`);
    return response.data;
  }

  /**
   * Get all modification requests for current user
   */
  async getUserModificationRequests() {
    const response = await api.get('/modification-requests');
    return response.data.data;
  }
}

export default new ModificationRequestService();


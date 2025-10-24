import api from '../config/api';
import { Complaint, ComplaintMessage } from '../types/complaintTypes';

export interface ComplaintResponse {
  success: boolean;
  data: Complaint[];
  message?: string;
}

export interface ComplaintSingleResponse {
  success: boolean;
  data: Complaint;
  message?: string;
}

export interface ComplaintMessageResponse {
  success: boolean;
  data: { id: number };
  message?: string;
}

class ComplaintService {
  private baseUrl = '/complaints';

  async getComplaints(status?: string, category?: string): Promise<ComplaintResponse> {
    try {
      const params: any = {};
      if (status) params.status = status;
      if (category) params.category = category;

      const response = await api.get(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching complaints:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch complaints');
    }
  }

  async getComplaint(id: number): Promise<ComplaintSingleResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching complaint:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch complaint');
    }
  }

  async createComplaint(complaintData: {
    category: string;
    subject: string;
    description: string;
    priority?: string;
    attachments?: string[];
    relatedService?: string;
    relatedDocument?: string;
    relatedTest?: string;
  }): Promise<ComplaintSingleResponse> {
    try {
      const response = await api.post(this.baseUrl, complaintData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating complaint:', error);
      throw new Error(error.response?.data?.message || 'Failed to create complaint');
    }
  }

  async updateComplaint(id: number, complaintData: Partial<Complaint>): Promise<ComplaintSingleResponse> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, complaintData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating complaint:', error);
      throw new Error(error.response?.data?.message || 'Failed to update complaint');
    }
  }

  async deleteComplaint(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting complaint:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete complaint');
    }
  }

  async addMessage(complaintId: number, messageData: {
    message: string;
    attachments?: string[];
  }): Promise<ComplaintMessageResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/${complaintId}/messages`, messageData);
      return response.data;
    } catch (error: any) {
      console.error('Error adding message:', error);
      throw new Error(error.response?.data?.message || 'Failed to add message');
    }
  }
}

export default new ComplaintService();

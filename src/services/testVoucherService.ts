import api from '../config/api';

export interface TestVoucher {
  id: number;
  name: string;
  vendor: string;
  vendorLogo: string;
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  category: string;
  status: string;
  description: string;
  recognition: string;
  features: string[];
  validity: string;
  shareLink?: string;
  buyLink?: string;
  icon: string;
  color: string;
  isActive: boolean;
  sortOrder?: number;
}

export interface TestVoucherResponse {
  success: boolean;
  data: TestVoucher[];
  userCurrency?: string;
  message?: string;
}

export interface TestVoucherSingleResponse {
  success: boolean;
  data: TestVoucher;
  message?: string;
}

class TestVoucherService {
  private baseUrl = '/test-vouchers';

  async getTestVouchers(language: string = 'en', category: string = 'all'): Promise<TestVoucherResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          language,
          category: category !== 'all' ? category : undefined
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching test vouchers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch test vouchers');
    }
  }

  async getTestVoucher(id: number, language: string = 'en'): Promise<TestVoucherSingleResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`, {
        params: { language }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching test voucher:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch test voucher');
    }
  }

  async createTestVoucher(voucherData: Partial<TestVoucher>): Promise<TestVoucherSingleResponse> {
    try {
      const response = await api.post(this.baseUrl, voucherData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating test voucher:', error);
      throw new Error(error.response?.data?.message || 'Failed to create test voucher');
    }
  }

  async updateTestVoucher(id: number, voucherData: Partial<TestVoucher>): Promise<TestVoucherSingleResponse> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, voucherData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating test voucher:', error);
      throw new Error(error.response?.data?.message || 'Failed to update test voucher');
    }
  }

  async deleteTestVoucher(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting test voucher:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete test voucher');
    }
  }
}

export default new TestVoucherService();

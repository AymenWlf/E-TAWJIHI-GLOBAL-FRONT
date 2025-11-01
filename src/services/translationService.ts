import api from '../config/api';

export interface Translation {
  id: number;
  originalFilename: string;
  originalLanguage: string;
  targetLanguage: string;
  documentType: string;
  numberOfPages: number;
  pricePerPage: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  notes?: string;
  translatedFilename?: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationRequest {
  originalFilename: string;
  originalLanguage: string;
  targetLanguage: string;
  documentType: string;
  numberOfPages: number;
  pricePerPage: number;
  totalPrice: number;
  currency: string;
  notes?: string;
  originalDocument: File;
}

export interface PendingPaymentData {
  translations: Translation[];
  totalAmount: number;
  count: number;
}

export interface TranslationResponse {
  success: boolean;
  data: Translation[];
  message?: string;
}

export interface SingleTranslationResponse {
  success: boolean;
  data: Translation;
  message?: string;
}

export interface PendingPaymentResponse {
  success: boolean;
  data: PendingPaymentData;
  message?: string;
}

class TranslationService {
  /**
   * Get all translations for the current user
   */
  async getTranslations(): Promise<TranslationResponse> {
    try {
      const response = await api.get('/translations');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching translations:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch translations');
    }
  }

  /**
   * Get a specific translation by ID
   */
  async getTranslation(id: number): Promise<SingleTranslationResponse> {
    try {
      const response = await api.get(`/translations/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching translation:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch translation');
    }
  }

  /**
   * Create a new translation request
   */
  async createTranslation(translationData: TranslationRequest): Promise<SingleTranslationResponse> {
    try {
      const formData = new FormData();
      
      // Add file
      formData.append('originalDocument', translationData.originalDocument);
      
      // Add other data as JSON
      const dataWithoutFile = {
        originalFilename: translationData.originalFilename,
        originalLanguage: translationData.originalLanguage,
        targetLanguage: translationData.targetLanguage,
        documentType: translationData.documentType,
        numberOfPages: translationData.numberOfPages,
        pricePerPage: translationData.pricePerPage,
        totalPrice: translationData.totalPrice,
        currency: translationData.currency,
        notes: translationData.notes
      };
      
      formData.append('data', JSON.stringify(dataWithoutFile));

      const response = await api.post('/translations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating translation:', error);
      throw new Error(error.response?.data?.message || 'Failed to create translation');
    }
  }

  /**
   * Get pending translations for payment
   */
  async getPendingPayment(): Promise<PendingPaymentResponse> {
    try {
      const response = await api.get('/translations/pending-payment');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending payment:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch pending payment');
    }
  }

  /**
   * Pay for pending translations
   */
  async payPendingTranslations(): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response = await api.post('/translations/pending-payment');
      return response.data;
    } catch (error: any) {
      console.error('Error paying for translations:', error);
      throw new Error(error.response?.data?.message || 'Failed to process payment');
    }
  }

  /**
   * Download original document
   */
  async downloadOriginal(id: number): Promise<void> {
    try {
      const response = await api.get(`/translations/${id}/original`, {
        responseType: 'blob',
      });
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `original_${id}.pdf`; // You might want to get the actual filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading original document:', error);
      throw new Error(error.response?.data?.message || 'Failed to download original document');
    }
  }

  /**
   * Download translated document
   */
  async downloadTranslated(id: number): Promise<void> {
    try {
      const response = await api.get(`/translations/${id}/translated`, {
        responseType: 'blob',
      });
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `translated_${id}.pdf`; // You might want to get the actual filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading translated document:', error);
      throw new Error(error.response?.data?.message || 'Failed to download translated document');
    }
  }

  /**
   * View original document in browser
   */
  async viewOriginal(id: number): Promise<void> {
    try {
      const response = await api.get(`/translations/${id}/original`, {
        responseType: 'blob',
      });
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'document.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Create blob with proper MIME type
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error viewing original document:', error);
      throw new Error(error.response?.data?.message || 'Failed to view original document');
    }
  }

  /**
   * View translated document in browser
   */
  async viewTranslated(id: number): Promise<void> {
    try {
      const response = await api.get(`/translations/${id}/translated`, {
        responseType: 'blob',
      });
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'translated_document.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Create blob with proper MIME type
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error viewing translated document:', error);
      throw new Error(error.response?.data?.message || 'Failed to view translated document');
    }
  }

  /**
   * Delete a translation request
   */
  async deleteTranslation(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/translations/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting translation:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete translation');
    }
  }

  /**
   * Get translation price by languages
   */
  async getTranslationPriceByLanguages(fromLanguage: string, toLanguage: string): Promise<{
    success: boolean;
    data?: {
      fromLanguage: string;
      toLanguage: string;
      price: number;
      currency: string;
    };
    message?: string;
  }> {
    try {
      const response = await api.get(`/translations/price?fromLanguage=${fromLanguage}&toLanguage=${toLanguage}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching translation price:', error);
      // Return error response instead of throwing to allow handling in component
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch translation price');
    }
  }
}

export default new TranslationService();

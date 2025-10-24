const API_BASE_URL = 'http://localhost:8000/api';

class ShortlistService {
  async toggleProgram(programId) {
    try {
      const token = localStorage.getItem('jwt_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/shortlist/toggle/program/${programId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(errorData.message || 'Failed to toggle program shortlist');
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling program shortlist:', error);
      throw error;
    }
  }

  async toggleEstablishment(establishmentId) {
    try {
      const token = localStorage.getItem('jwt_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/shortlist/toggle/establishment/${establishmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(errorData.message || 'Failed to toggle establishment shortlist');
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling establishment shortlist:', error);
      throw error;
    }
  }

  async checkProgram(programId) {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}/shortlist/check/program/${programId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check program shortlist status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking program shortlist status:', error);
      return { isShortlisted: false };
    }
  }

  async checkEstablishment(establishmentId) {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}/shortlist/check/establishment/${establishmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check establishment shortlist status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking establishment shortlist status:', error);
      return { isShortlisted: false };
    }
  }

}

export default new ShortlistService();

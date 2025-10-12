import api from '../config/api';
import { LoginResponse, RegisterResponse, User, ApiResponse } from '../types/auth';

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        // Stocker le token et les données utilisateur
        localStorage.setItem('jwt_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  }

  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', {
        email,
        password,
        firstName,
        lastName,
      });

      if (response.data.success) {
        // Stocker le token et les données utilisateur
        localStorage.setItem('jwt_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
      return response.data.data!.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des données utilisateur');
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
      const newToken = response.data.data!.token;
      localStorage.setItem('jwt_token', newToken);
      return newToken;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du rafraîchissement du token');
    }
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

const authService = new AuthService();
export default authService;

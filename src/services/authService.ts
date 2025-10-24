import api from '../config/api';
import { LoginResponse, RegisterResponse, User, ApiResponse } from '../types/auth';

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<any>('/auth/login', {
        email,
        password,
      });

      // Le backend retourne soit { token: "..." } soit { success: true, data: { user: {...}, token: "..." } }
      let token: string;
      let user: any;

      if (response.data.token) {
        // Format direct du token
        token = response.data.token;
        // Récupérer les données utilisateur avec le token
        try {
          const userResponse = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          user = userResponse.data;
        } catch (userError) {
          throw new Error('Erreur lors de la récupération des données utilisateur');
        }
      } else if (response.data.success && response.data.data) {
        // Format avec success et data
        token = response.data.data.token;
        user = response.data.data.user;
      } else {
        throw new Error('Format de réponse inattendu');
      }

      // Stocker le token et les données utilisateur
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        message: 'Connexion réussie',
        data: {
          user,
          token
        }
      };
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
      const user = response.data.data!.user;
      // Mettre à jour l'utilisateur stocké avec les dernières données
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des données utilisateur');
    }
  }

  async updateLanguage(language: string): Promise<ApiResponse<{ preferredLanguage: string }>> {
    try {
      const response = await api.post<ApiResponse<{ preferredLanguage: string }>>('/auth/update-language', {
        language,
      });
      
      // Mettre à jour l'utilisateur stocké avec la nouvelle langue
      const storedUser = this.getStoredUser();
      if (storedUser) {
        storedUser.preferredLanguage = language;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la langue');
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

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email de récupération');
    }
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/reset-password', {
        token,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    }
  }

  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/verify-email', {
        token,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la vérification de l\'email');
    }
  }

  async resendVerificationEmail(): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/resend-verification');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email de vérification');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  isTokenExpired(): boolean {
    const token = this.getStoredToken();
    if (!token) return true;

    try {
      // Vérifier que le token a le bon format (3 parties séparées par des points)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Invalid token format');
        return true;
      }

      const payload = JSON.parse(atob(parts[1]));
      
      // Si pas d'expiration (exp = 0 ou undefined), le token n'expire jamais
      if (!payload.exp || payload.exp === 0) {
        return false;
      }
      
      const currentTime = Date.now() / 1000;
      const isExpired = payload.exp < currentTime;
      
      if (isExpired) {
        console.log('Token expired at:', new Date(payload.exp * 1000));
      }
      
      return isExpired;
    } catch (error) {
      console.log('Error parsing token:', error);
      return true;
    }
  }

  getTokenExpirationTime(): number | null {
    const token = this.getStoredToken();
    if (!token) return null;

    try {
      // Vérifier que le token a le bon format
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      // Si pas d'expiration (exp = 0 ou undefined), retourner null (infini)
      if (!payload.exp || payload.exp === 0) {
        return null;
      }
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.log('Error getting token expiration time:', error);
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;

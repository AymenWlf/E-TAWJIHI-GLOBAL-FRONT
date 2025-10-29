import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '../types/auth';
import authService from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = (): void => {
    authService.logout();
    setCurrentUser(null);
    setToken(null);
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const storedToken = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (storedToken && storedUser) {
      // Vérifier si le token est expiré
      if (authService.isTokenExpired()) {
        // Token expiré, déconnecter l'utilisateur
        authService.logout();
        setCurrentUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      setToken(storedToken);
      setCurrentUser(storedUser);
      setIsLoading(false);
      
      // Vérifier si le token est toujours valide côté serveur (en arrière-plan)
      // Ne pas bloquer le chargement si cette vérification échoue
      authService.getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
          // Mettre à jour les données utilisateur stockées
          localStorage.setItem('user', JSON.stringify(user));
        })
        .catch((error) => {
          // Token invalide côté serveur, mais ne pas déconnecter automatiquement
          // L'utilisateur sera déconnecté lors de la prochaine action qui nécessite l'auth
          console.log('Token validation failed in background:', error.message);
          // Ne pas appeler authService.logout() ici pour éviter les boucles
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success) {
        setCurrentUser(response.data.user);
        setToken(response.data.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName?: string, lastName?: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(email, password, firstName, lastName);
      
      if (response.success) {
        setCurrentUser(response.data.user);
        setToken(response.data.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.forgotPassword(email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.resetPassword(token, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.changePassword(currentPassword, newPassword);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.verifyEmail(token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.resendVerificationEmail();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLanguage = async (language: string): Promise<void> => {
    try {
      await authService.updateLanguage(language);
      // Mettre à jour l'utilisateur actuel avec la nouvelle langue
      if (currentUser) {
        const updatedUser = { ...currentUser, preferredLanguage: language };
        setCurrentUser(updatedUser);
      }
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    user: currentUser, // Alias pour compatibilité
    token,
    isAuthenticated: !!currentUser && !!token,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    resendVerificationEmail,
    updateLanguage,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

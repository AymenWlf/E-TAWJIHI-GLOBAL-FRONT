import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

export const useAuthCheck = () => {
  const { currentUser, token, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Vérifier l'authentification à chaque changement de route
    const checkAuth = async () => {
      const storedToken = authService.getStoredToken();
      
      if (storedToken) {
        // Vérifier si le token est expiré
        if (authService.isTokenExpired()) {
          logout();
          return;
        }

        // Si on a un token mais pas d'utilisateur, essayer de récupérer les données
        if (!currentUser && token) {
          try {
            const user = await authService.getCurrentUser();
            // L'utilisateur sera mis à jour via le contexte
          } catch (error) {
            // Token invalide côté serveur
            logout();
          }
        }
      }
    };

    checkAuth();
  }, [location.pathname, currentUser, token, logout]);

  return { currentUser, token };
};

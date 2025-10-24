import axios from 'axios';

// Configuration de base d'axios
// En développement, utilise le proxy Vite (/api -> http://localhost:8000)
// En production, utilise l'URL directe de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Vérifier si le token est expiré
      const token = localStorage.getItem('jwt_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          // Si le token est expiré ET qu'il a une expiration définie, essayer de le rafraîchir
          if (payload.exp && payload.exp > 0 && payload.exp < currentTime) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              try {
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                  refreshToken
                });
                
                const newToken = response.data.data.token;
                localStorage.setItem('jwt_token', newToken);
                
                // Retry la requête originale avec le nouveau token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
              } catch (refreshError) {
                // Refresh échoué, nettoyer les tokens
                console.log('Token refresh failed, cleaning up tokens');
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                // Ne pas recharger la page, juste supprimer le token
              }
            } else {
              // Pas de refresh token, nettoyer
              console.log('No refresh token, cleaning up');
              localStorage.removeItem('jwt_token');
              localStorage.removeItem('user');
            }
          } else {
            // Token non expiré mais erreur 401, probablement invalide côté serveur
            console.log('Token not expired but 401 error, cleaning up');
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
          }
        } catch (parseError) {
          // Token invalide, nettoyer
          console.log('Invalid token format, cleaning up');
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
        }
      } else {
        // Pas de token
        console.log('No token found');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };

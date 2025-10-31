import api from '../config/api';

class EAdvisorService {
  /**
   * Envoyer un message à l'agent IA Grok
   */
  async chat(question, conversationHistory = [], userProfile = {}) {
    try {
      const response = await api.post('/eadvisor/chat', {
        question,
        conversationHistory,
        userProfile,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to E-DVISOR:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    }
  }

  /**
   * Rechercher des établissements avec filtres (pour E-DVISOR)
   */
  async searchEstablishments(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(`${key}[]`, item.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await api.get(`/establishments?${params.toString()}&limit=6`);
      return response.data;
    } catch (error) {
      console.error('Error searching establishments:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la recherche d\'établissements');
    }
  }

  /**
   * Rechercher des programmes avec filtres (pour E-DVISOR)
   */
  async searchPrograms(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(`${key}[]`, item.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      // Ajouter le filtre status pour s'assurer d'avoir seulement les programmes publiés
      params.append('status', 'published');
      params.append('limit', '6');

      const response = await api.get(`/programs?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching programs:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la recherche de programmes');
    }
  }

  /**
   * Analyser le profil utilisateur
   */
  async analyze(answers, stage = 'general') {
    try {
      const response = await api.post('/eadvisor/analyze', {
        answers,
        stage,
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing profile:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'analyse');
    }
  }

  /**
   * Obtenir une suggestion après une étape
   */
  async suggest(answers, currentStep, nextQuestionId) {
    try {
      const response = await api.post('/eadvisor/suggest', {
        answers,
        currentStep,
        nextQuestionId,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting suggestion:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la génération de suggestion');
    }
  }
}

export default new EAdvisorService();


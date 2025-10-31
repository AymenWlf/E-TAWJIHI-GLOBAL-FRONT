import api from '../config/api';

class DiagnosticService {
  /**
   * Récupère toutes les questions groupées par catégorie
   */
  async getQuestions() {
    try {
      const response = await api.get('/diagnostic/questions');
      return response.data;
    } catch (error) {
      console.error('Error fetching diagnostic questions:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des questions');
    }
  }

  /**
   * Récupère ou crée une session de test
   */
  async getSession() {
    try {
      const response = await api.get('/diagnostic/session');
      return response.data;
    } catch (error) {
      console.error('Error getting session:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la session');
    }
  }

  /**
   * Sauvegarde une réponse
   */
  async saveAnswer(questionId, answer) {
    try {
      const response = await api.post('/diagnostic/answer', {
        questionId,
        answer,
      });
      return response.data;
    } catch (error) {
      console.error('Error saving answer:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  }

  /**
   * Génère le diagnostic final
   */
  async generateDiagnostic() {
    try {
      const response = await api.post('/diagnostic/generate');
      return response.data;
    } catch (error) {
      console.error('Error generating diagnostic:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la génération du diagnostic');
    }
  }

  /**
   * Récupère le résultat d'une session
   */
  async getResult(sessionId) {
    try {
      const response = await api.get(`/diagnostic/result/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting result:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du résultat');
    }
  }
}

export default new DiagnosticService();


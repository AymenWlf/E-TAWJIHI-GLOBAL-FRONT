import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Search, Info, CheckCircle, AlertCircle } from 'lucide-react';

const AgentSelectionStep = ({ data, onSave, language }) => {
  const [selectionType, setSelectionType] = useState('auto'); // 'auto' or 'manual'
  const [agentCode, setAgentCode] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = () => {
    if (data) {
      setSelectionType(data.selectionType || 'auto');
      setAgentCode(data.agentCode || '');
      setSelectedAgent(data.selectedAgent || null);
    }
  };

  const handleAutoAssignment = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call to get best available agent
      // In real implementation, this would call the backend
      const mockAgent = {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@etawjihi.com',
        specialization: 'Engineering Programs',
        experience: '5 years',
        rating: 4.8,
        studentsHelped: 150,
        languages: ['English', 'French', 'Arabic']
      };
      setSelectedAgent(mockAgent);
    } catch (err) {
      setError(language === 'fr' ? 'Erreur lors de l\'attribution automatique' : 'Error in auto assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCode = async () => {
    if (!agentCode.trim()) {
      setError(language === 'fr' ? 'Veuillez saisir un code agent' : 'Please enter an agent code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Simulate API call to find agent by code
      const mockAgent = {
        id: 2,
        name: 'Ahmed Al-Rashid',
        email: 'ahmed.alrashid@etawjihi.com',
        specialization: 'Business Programs',
        experience: '8 years',
        rating: 4.9,
        studentsHelped: 200,
        languages: ['English', 'French', 'Arabic']
      };
      setSelectedAgent(mockAgent);
    } catch (err) {
      setError(language === 'fr' ? 'Code agent invalide' : 'Invalid agent code');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedAgent) {
      setError(language === 'fr' ? 'Veuillez sélectionner un agent' : 'Please select an agent');
      return;
    }

    try {
      setSaving(true);
      const stepData = {
        selectionType,
        agentCode: selectionType === 'manual' ? agentCode : null,
        selectedAgent,
        assignedAt: new Date().toISOString()
      };
      await onSave(stepData);
    } catch (err) {
      setError(language === 'fr' ? 'Erreur lors de la sauvegarde' : 'Error saving data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Users className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {language === 'fr' ? 'Sélection d\'Agent' : 'Agent Selection'}
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'fr' 
            ? 'Choisissez votre agent éducatif ou laissez-nous vous en assigner un automatiquement. Votre agent vous accompagnera tout au long de votre candidature.' 
            : 'Choose your education agent or let us assign one automatically. Your agent will guide you through your entire application process.'
          }
        </p>
      </div>

      {/* Selection Type */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">
          {language === 'fr' ? 'Comment souhaitez-vous procéder ?' : 'How would you like to proceed?'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setSelectionType('auto')}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              selectionType === 'auto'
                ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck className={`w-6 h-6 ${selectionType === 'auto' ? 'text-green-600' : 'text-gray-400'}`} />
              <div className="text-left">
                <h5 className="font-medium text-gray-900">
                  {language === 'fr' ? 'Attribution Automatique' : 'Automatic Assignment'}
                </h5>
                <p className="text-sm text-gray-600">
                  {language === 'fr' ? 'Nous vous assignons le meilleur agent disponible' : 'We assign you the best available agent'}
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectionType('manual')}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              selectionType === 'manual'
                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <Search className={`w-6 h-6 ${selectionType === 'manual' ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="text-left">
                <h5 className="font-medium text-gray-900">
                  {language === 'fr' ? 'Code Agent' : 'Agent Code'}
                </h5>
                <p className="text-sm text-gray-600">
                  {language === 'fr' ? 'J\'ai déjà un code agent' : 'I already have an agent code'}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Auto Assignment */}
      {selectionType === 'auto' && (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 mb-2">
                  {language === 'fr' ? 'Attribution Automatique' : 'Automatic Assignment'}
                </h4>
                <p className="text-sm text-green-700 mb-3">
                  {language === 'fr' 
                    ? 'Nous analyserons votre profil et vos besoins pour vous assigner l\'agent le plus qualifié.'
                    : 'We will analyze your profile and needs to assign you the most qualified agent.'
                  }
                </p>
                <button
                  onClick={handleAutoAssignment}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {language === 'fr' ? 'Recherche...' : 'Searching...'}
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      {language === 'fr' ? 'Assigner Automatiquement' : 'Assign Automatically'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Code Entry */}
      {selectionType === 'manual' && (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">
                  {language === 'fr' ? 'Code Agent' : 'Agent Code'}
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  {language === 'fr' 
                    ? 'Saisissez le code agent que vous avez reçu de votre conseiller.'
                    : 'Enter the agent code you received from your advisor.'
                  }
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={agentCode}
                    onChange={(e) => setAgentCode(e.target.value)}
                    placeholder={language === 'fr' ? 'Ex: AGT123456' : 'Ex: AGT123456'}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleManualCode}
                    disabled={loading || !agentCode.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {language === 'fr' ? 'Vérification...' : 'Verifying...'}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        {language === 'fr' ? 'Vérifier' : 'Verify'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Agent Display */}
      {selectedAgent && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-900">{selectedAgent.name}</h4>
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm font-medium">{selectedAgent.rating}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>{language === 'fr' ? 'Email:' : 'Email:'}</strong> {selectedAgent.email}</p>
                  <p><strong>{language === 'fr' ? 'Spécialisation:' : 'Specialization:'}</strong> {selectedAgent.specialization}</p>
                </div>
                <div>
                  <p><strong>{language === 'fr' ? 'Expérience:' : 'Experience:'}</strong> {selectedAgent.experience}</p>
                  <p><strong>{language === 'fr' ? 'Étudiants aidés:' : 'Students helped:'}</strong> {selectedAgent.studentsHelped}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  <strong>{language === 'fr' ? 'Langues:' : 'Languages:'}</strong> {selectedAgent.languages.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={!selectedAgent || saving}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {language === 'fr' ? 'Sauvegarde...' : 'Saving...'}
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              {language === 'fr' ? 'Confirmer l\'Agent' : 'Confirm Agent'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AgentSelectionStep;

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, FileText, User, Users, GraduationCap, Building2, Clock, Send } from 'lucide-react';

const ReviewSubmissionStep = ({ application, onSubmit, language }) => {
  const [reviewData, setReviewData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplicationData();
  }, [application]);

  const loadApplicationData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch the complete application data
      // For now, we'll use the application prop
      setReviewData({
        personalInfo: application?.steps?.find(s => s.stepNumber === 1)?.stepData || {},
        agentInfo: application?.steps?.find(s => s.stepNumber === 2)?.stepData || {},
        academicInfo: application?.steps?.find(s => s.stepNumber === 3)?.stepData || {},
        documents: application?.steps?.find(s => s.stepNumber === 4)?.stepData || {},
        motivationLetter: application?.steps?.find(s => s.stepNumber === 5)?.stepData || {},
        references: application?.steps?.find(s => s.stepNumber === 6)?.stepData || {}
      });
    } catch (error) {
      console.error('Failed to load application data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await onSubmit();
    } catch (err) {
      setError(err.response?.data?.error || (language === 'fr' ? 'Erreur lors de la soumission' : 'Submission error'));
    } finally {
      setSubmitting(false);
    }
  };

  const getStepStatus = (stepNumber) => {
    const step = application?.steps?.find(s => s.stepNumber === stepNumber);
    return step?.isCompleted ? 'completed' : 'incomplete';
  };

  const getStepIcon = (stepNumber, status) => {
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const getStepTitle = (stepNumber) => {
    const titles = {
      en: {
        1: 'Personal Information',
        2: 'Agent Selection',
        3: 'Academic Information',
        4: 'Personal Documents',
        5: 'Motivation Letter',
        6: 'References'
      },
      fr: {
        1: 'Informations Personnelles',
        2: 'Sélection d\'Agent',
        3: 'Informations Académiques',
        4: 'Documents Personnels',
        5: 'Lettre de Motivation',
        6: 'Références'
      }
    };
    return titles[language]?.[stepNumber] || `Step ${stepNumber}`;
  };

  const isApplicationComplete = () => {
    const requiredSteps = [1, 2, 3, 4, 5, 6];
    return requiredSteps.every(stepNumber => getStepStatus(stepNumber) === 'completed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">
          {language === 'fr' ? 'Chargement des données...' : 'Loading data...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {language === 'fr' ? 'Révision et Soumission' : 'Review & Submit'}
        </h3>
        <p className="text-gray-600">
          {language === 'fr' 
            ? 'Révisez votre candidature avant de la soumettre définitivement' 
            : 'Review your application before final submission'
          }
        </p>
      </div>

      {/* Application Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {language === 'fr' ? 'Résumé de la Candidature' : 'Application Summary'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>{language === 'fr' ? 'Programme:' : 'Program:'}</strong> {application?.program?.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>{language === 'fr' ? 'Établissement:' : 'Institution:'}</strong> {application?.program?.establishment?.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>{language === 'fr' ? 'Date de création:' : 'Created:'}</strong> {new Date(application?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>{language === 'fr' ? 'Progrès:' : 'Progress:'}</strong> {application?.progressPercentage}%
            </p>
            <p className="text-sm text-gray-600">
              <strong>{language === 'fr' ? 'Statut:' : 'Status:'}</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                application?.status === 'draft' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {application?.status === 'draft' 
                  ? (language === 'fr' ? 'Brouillon' : 'Draft')
                  : (language === 'fr' ? 'Soumise' : 'Submitted')
                }
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Steps Review */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">
          {language === 'fr' ? 'Vérification des Étapes' : 'Steps Verification'}
        </h4>
        
        {[1, 2, 3, 4, 5, 6].map(stepNumber => {
          const status = getStepStatus(stepNumber);
          const isCompleted = status === 'completed';
          
          return (
            <div key={stepNumber} className={`flex items-center gap-3 p-3 rounded-lg border ${
              isCompleted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              {getStepIcon(stepNumber, status)}
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">
                  {getStepTitle(stepNumber)}
                </h5>
                <p className="text-sm text-gray-600">
                  {isCompleted 
                    ? (language === 'fr' ? 'Complété' : 'Completed')
                    : (language === 'fr' ? 'Incomplet' : 'Incomplete')
                  }
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Status */}
      <div className={`rounded-lg p-4 ${
        isApplicationComplete() 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          {isApplicationComplete() ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h4 className={`font-semibold ${
              isApplicationComplete() ? 'text-green-900' : 'text-red-900'
            }`}>
              {isApplicationComplete() 
                ? (language === 'fr' ? 'Candidature Complète' : 'Application Complete')
                : (language === 'fr' ? 'Candidature Incomplète' : 'Application Incomplete')
              }
            </h4>
            <p className={`text-sm ${
              isApplicationComplete() ? 'text-green-700' : 'text-red-700'
            }`}>
              {isApplicationComplete() 
                ? (language === 'fr' ? 'Toutes les étapes sont complétées. Vous pouvez soumettre votre candidature.' : 'All steps are completed. You can submit your application.')
                : (language === 'fr' ? 'Veuillez compléter toutes les étapes avant de soumettre.' : 'Please complete all steps before submitting.')
              }
            </p>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          {language === 'fr' ? 'Notes Importantes' : 'Important Notes'}
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• {language === 'fr' ? 'Une fois soumise, votre candidature ne pourra plus être modifiée' : 'Once submitted, your application cannot be modified'}</li>
          <li>• {language === 'fr' ? 'Vous recevrez un email de confirmation après soumission' : 'You will receive a confirmation email after submission'}</li>
          <li>• {language === 'fr' ? 'Votre agent vous contactera dans les 48 heures' : 'Your agent will contact you within 48 hours'}</li>
          <li>• {language === 'fr' ? 'Conservez une copie de tous vos documents' : 'Keep a copy of all your documents'}</li>
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center pt-6 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={!isApplicationComplete() || submitting}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg font-medium"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {language === 'fr' ? 'Soumission en cours...' : 'Submitting...'}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {language === 'fr' ? 'Soumettre la Candidature' : 'Submit Application'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmissionStep;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Clock, Users, FileText, CheckCircle, AlertCircle, Calendar, Globe, Edit3 } from 'lucide-react';
import applicationService from '../services/applicationService';
import { useAuth } from '../contexts/AuthContext';

const ApplicationConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  program, 
  language = 'en' 
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [hasActiveApplication, setHasActiveApplication] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && program?.id && isAuthenticated) {
      checkExistingApplication();
    }
  }, [isOpen, program?.id, isAuthenticated]);

  const checkExistingApplication = async () => {
    if (!program?.id || !isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await applicationService.checkApplication(program.id);
      setHasActiveApplication(response.hasActiveApplication);
      setExistingApplication(response.application);
    } catch (error) {
      console.error('Error checking application:', error);
      // Si l'erreur est 401, l'utilisateur n'est pas connecté
      if (error.response?.status === 401) {
        console.log('User not authenticated, skipping application check');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartApplication = async () => {
    if (!program) return;

    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      navigate('/login');
      onClose();
      return;
    }

    try {
      setLoading(true);
      const response = await applicationService.createOrGetApplication(program.id, language);
      
      // Récupérer l'ID de l'application depuis la réponse
      const applicationId = response.data?.id || response.id;
      
      const establishmentId = program.establishment?.id || 1;
      const programId = program.id || 1;
      
      // Rediriger vers la page ApplicationProcess avec l'ID de l'application
      navigate(`/application/${establishmentId}/${programId}?applicationId=${applicationId}`);
    } catch (error) {
      console.error('Error creating/getting application:', error);
      // Si l'erreur est 401, rediriger vers la connexion
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleContinueApplication = () => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      navigate('/login');
      onClose();
      return;
    }

    if (program && existingApplication) {
      const establishmentId = program.establishment?.id || 1;
      const programId = program.id || 1;
      const applicationId = existingApplication.id;
      
      // Rediriger vers la page ApplicationProcess avec l'ID de l'application existante
      navigate(`/application/${establishmentId}/${programId}?applicationId=${applicationId}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  const content = {
    en: {
      title: 'Application Process Confirmation',
      subtitle: 'Please review the application process and requirements before proceeding',
      sections: {
        process: {
          title: 'Application Process',
          steps: [
            'Complete your personal information',
            'Select an education agent (optional)',
            'Upload required documents',
            'Write your motivation letter',
            'Provide academic references',
            'Review and submit your application'
          ]
        },
        timeline: {
          title: 'Application Timeline',
          items: [
            'Application submission: Immediate',
            'Initial review: 3-5 business days',
            'Document verification: 1-2 weeks',
            'Final decision: 2-4 weeks'
          ]
        },
        requirements: {
          title: 'Required Documents',
          items: [
            'Valid passport copy',
            'Academic transcripts',
            'Diploma/certificate',
            'English proficiency test results',
            'Motivation letter',
            'Academic references (2)'
          ]
        },
        benefits: {
          title: 'What You Get',
          items: [
            'Free application process',
            'Personalized guidance from education agents',
            'Document verification assistance',
            'Application status tracking',
            'Direct communication with universities'
          ]
        }
      },
      buttons: {
        cancel: 'Cancel',
        confirm: 'Start Application Process'
      }
    },
    fr: {
      title: 'Confirmation du Processus de Candidature',
      subtitle: 'Veuillez examiner le processus de candidature et les exigences avant de continuer',
      sections: {
        process: {
          title: 'Processus de Candidature',
          steps: [
            'Complétez vos informations personnelles',
            'Sélectionnez un agent éducatif (optionnel)',
            'Téléchargez les documents requis',
            'Rédigez votre lettre de motivation',
            'Fournissez des références académiques',
            'Révisez et soumettez votre candidature'
          ]
        },
        timeline: {
          title: 'Délais de Candidature',
          items: [
            'Soumission de candidature : Immédiate',
            'Examen initial : 3-5 jours ouvrables',
            'Vérification des documents : 1-2 semaines',
            'Décision finale : 2-4 semaines'
          ]
        },
        requirements: {
          title: 'Documents Requis',
          items: [
            'Copie du passeport valide',
            'Relevés de notes académiques',
            'Diplôme/certificat',
            'Résultats du test de maîtrise de l\'anglais',
            'Lettre de motivation',
            'Références académiques (2)'
          ]
        },
        benefits: {
          title: 'Ce Que Vous Obtenez',
          items: [
            'Processus de candidature gratuit',
            'Guidance personnalisée des agents éducatifs',
            'Assistance à la vérification des documents',
            'Suivi du statut de candidature',
            'Communication directe avec les universités'
          ]
        }
      },
      buttons: {
        cancel: 'Annuler',
        confirm: 'Commencer le Processus de Candidature'
      }
    }
  };

  const t = content[language];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">{t.title}</h2>
              <p className="text-gray-300 text-sm mt-1">{t.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Program Info */}
        {program && (
          <div className="bg-gray-50 p-6 border-b">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                {program.establishment?.logo ? (
                  <img 
                    src={program.establishment.logo} 
                    alt={program.establishment.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Globe className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                <p className="text-gray-600 text-sm">{program.establishment?.name}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {program.duration} {program.durationUnit === 'months' ? (language === 'en' ? 'months' : 'mois') : (language === 'en' ? 'years' : 'ans')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {program.studyType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Application Process */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: 'rgb(30 64 175 / var(--tw-text-opacity, 1))' }} />
                {t.sections.process.title}
              </h3>
              <ul className="space-y-2">
                {t.sections.process.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 text-white" style={{ backgroundColor: 'rgb(30 64 175 / var(--tw-text-opacity, 1))' }}>
                      {index + 1}
                    </span>
                    <span className="text-gray-700 text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: 'rgb(30 64 175 / var(--tw-text-opacity, 1))' }} />
                {t.sections.timeline.title}
              </h3>
              <ul className="space-y-2">
                {t.sections.timeline.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Clock className="w-4 h-4 mt-0.5" style={{ color: 'rgb(30 64 175 / var(--tw-text-opacity, 1))' }} />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" style={{ color: 'rgb(30 64 175 / var(--tw-text-opacity, 1))' }} />
                {t.sections.requirements.title}
              </h3>
              <ul className="space-y-2">
                {t.sections.requirements.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: 'rgb(30 64 175 / var(--tw-text-opacity, 1))' }} />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: 'rgb(30 64 175 / var(--tw-text-opacity, 1))' }} />
                {t.sections.benefits.title}
              </h3>
              <ul className="space-y-2">
                {t.sections.benefits.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Users className="w-4 h-4 mt-0.5" style={{ color: 'rgb(30 64 175 / var(--tw-text-opacity, 1))' }} />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 text-green-600" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {language === 'en' ? 'Important Notice' : 'Avis Important'}
                </h4>
                <p className="text-gray-700 text-sm">
                  {language === 'en' 
                    ? 'This is a free application process. You will not be charged for submitting your application. Our education agents will guide you through the entire process at no cost.'
                    : 'Ceci est un processus de candidature gratuit. Vous ne serez pas facturé pour soumettre votre candidature. Nos agents éducatifs vous guideront tout au long du processus sans frais.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {t.buttons.cancel}
          </button>
          
          {loading ? (
            <button
              disabled
              className="px-8 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
            >
              {language === 'en' ? 'Loading...' : 'Chargement...'}
            </button>
          ) : hasActiveApplication ? (
            <button
              onClick={handleContinueApplication}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {language === 'en' ? 'Continue My Application' : 'Continuer Ma Candidature'}
            </button>
          ) : (
            <button
              onClick={handleStartApplication}
              className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {t.buttons.confirm}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationConfirmationModal;

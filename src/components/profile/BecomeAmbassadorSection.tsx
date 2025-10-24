import React, { useState, useEffect } from 'react';
import { 
  Users, Star, Award, Globe, CheckCircle, X, 
  GraduationCap, MapPin, Calendar, User, 
  MessageSquare, Briefcase, Lightbulb, Heart,
  TrendingUp, Target, Crown, Zap, Shield
} from 'lucide-react';
import ambassadorService, { Ambassador } from '../../services/ambassadorService';
import { 
  STUDY_LEVELS, 
  AMBASSADOR_STATUSES,
  AMBASSADOR_BENEFITS,
  AMBASSADOR_TIERS,
  getStudyLevel,
  getAmbassadorStatusColor,
  getAmbassadorTier,
  getNextTier
} from '../../types/ambassadorTypes';

interface BecomeAmbassadorSectionProps {
  language: string;
  userProfile?: any; // User profile data for pre-filling
}

const BecomeAmbassadorSection: React.FC<BecomeAmbassadorSectionProps> = ({ 
  language, 
  userProfile 
}) => {
  const [myAmbassador, setMyAmbassador] = useState<Ambassador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentLanguage = language;

  // Load user's ambassador application
  useEffect(() => {
    loadMyAmbassador();
  }, []);

  const loadMyAmbassador = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ambassadorService.getMyAmbassador();
      setMyAmbassador(response.data);
    } catch (err: any) {
      if (err.message.includes('No ambassador application found')) {
        setMyAmbassador(null);
      } else {
        setError(err.message || 'Failed to load ambassador application');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (applicationData: any) => {
    try {
      setSubmitting(true);
      await ambassadorService.createAmbassador(applicationData);
      setShowApplicationModal(false);
      loadMyAmbassador();
    } catch (err: any) {
      setError(err.message || 'Failed to submit ambassador application');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusMessage = (status: string) => {
    const statusObj = AMBASSADOR_STATUSES.find(s => s.id === status);
    if (!statusObj) return '';

    const messages = {
      pending: {
        en: 'Your application is being reviewed. We will get back to you within 5-7 business days.',
        fr: 'Votre candidature est en cours d\'examen. Nous vous répondrons dans les 5-7 jours ouvrables.'
      },
      under_review: {
        en: 'Your application is under detailed review. We may contact you for additional information.',
        fr: 'Votre candidature fait l\'objet d\'un examen détaillé. Nous pourrions vous contacter pour des informations supplémentaires.'
      },
      interview_scheduled: {
        en: 'Great! We\'ve scheduled an interview with you. Check your email for details.',
        fr: 'Excellent ! Nous avons programmé un entretien avec vous. Vérifiez votre email pour les détails.'
      },
      approved: {
        en: 'Congratulations! Your application has been approved. Welcome to the E-TAWJIHI Ambassador Program!',
        fr: 'Félicitations ! Votre candidature a été approuvée. Bienvenue dans le Programme Ambassadeur E-TAWJIHI !'
      },
      rejected: {
        en: 'Thank you for your interest. Unfortunately, we cannot proceed with your application at this time.',
        fr: 'Merci pour votre intérêt. Malheureusement, nous ne pouvons pas poursuivre votre candidature pour le moment.'
      },
      active: {
        en: 'You are an active E-TAWJIHI Ambassador! Keep up the great work.',
        fr: 'Vous êtes un Ambassadeur E-TAWJIHI actif ! Continuez votre excellent travail.'
      },
      inactive: {
        en: 'Your ambassador status is currently inactive. Contact us if you wish to reactivate.',
        fr: 'Votre statut d\'ambassadeur est actuellement inactif. Contactez-nous si vous souhaitez le réactiver.'
      }
    };

    return messages[status as keyof typeof messages]?.[currentLanguage as 'en' | 'fr'] || '';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              {currentLanguage === 'en' ? 'Loading...' : 'Chargement...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentLanguage === 'en' ? 'Become an Ambassador' : 'Devenir Ambassadeur'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentLanguage === 'en' 
                ? 'Join our global community of student ambassadors' 
                : 'Rejoignez notre communauté mondiale d\'ambassadeurs étudiants'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              {currentLanguage === 'en' ? 'Global Community' : 'Communauté Mondiale'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentLanguage === 'en' ? 'Error loading application' : 'Erreur de chargement de la candidature'}
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={loadMyAmbassador}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentLanguage === 'en' ? 'Retry' : 'Réessayer'}
            </button>
          </div>
        ) : myAmbassador ? (
          /* Existing Application */
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentLanguage === 'en' ? 'Ambassador Application' : 'Candidature Ambassadeur'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentLanguage === 'en' ? 'Submitted on' : 'Soumise le'} {formatDate(myAmbassador.createdAt)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAmbassadorStatusColor(myAmbassador.status)}`}>
                  {currentLanguage === 'en' 
                    ? AMBASSADOR_STATUSES.find(s => s.id === myAmbassador.status)?.name || myAmbassador.status
                    : AMBASSADOR_STATUSES.find(s => s.id === myAmbassador.status)?.nameFr || myAmbassador.status
                  }
                </span>
              </div>
              
              <p className="text-gray-700 mb-4">
                {getStatusMessage(myAmbassador.status)}
              </p>

              {myAmbassador.adminNotes && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    {currentLanguage === 'en' ? 'Admin Notes' : 'Notes de l\'Administrateur'}
                  </h4>
                  <p className="text-sm text-gray-600">{myAmbassador.adminNotes}</p>
                </div>
              )}

              {myAmbassador.interviewDate && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      {currentLanguage === 'en' ? 'Interview Scheduled' : 'Entretien Programmé'}:
                    </span>
                    <span className="text-sm text-yellow-700">
                      {formatDate(myAmbassador.interviewDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Application Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Tier */}
                <div className="lg:col-span-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {currentLanguage === 'en' ? 'Current Tier' : 'Palier Actuel'}
                  </h4>
                  {(() => {
                    const currentTier = getAmbassadorTier(myAmbassador.points);
                    const nextTier = getNextTier(myAmbassador.points);
                    const progress = nextTier ? 
                      ((myAmbassador.points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100;
                    
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-12 h-12 ${currentTier.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                            {currentTier.icon}
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              {currentLanguage === 'en' ? currentTier.name : currentTier.nameFr}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {myAmbassador.points} {currentLanguage === 'en' ? 'points' : 'points'}
                            </p>
                          </div>
                        </div>
                        
                        {nextTier && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{currentLanguage === 'en' ? 'Progress to' : 'Progression vers'} {currentLanguage === 'en' ? nextTier.name : nextTier.nameFr}</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {nextTier.minPoints - myAmbassador.points} {currentLanguage === 'en' ? 'points to next tier' : 'points vers le prochain palier'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Application Details */}
                <div className="lg:col-span-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {currentLanguage === 'en' ? 'Application Details' : 'Détails de la Candidature'}
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{myAmbassador.university}</p>
                        <p className="text-xs text-gray-500">{myAmbassador.fieldOfStudy}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {currentLanguage === 'en' 
                            ? STUDY_LEVELS.find(s => s.id === myAmbassador.studyLevel)?.name || myAmbassador.studyLevel
                            : STUDY_LEVELS.find(s => s.id === myAmbassador.studyLevel)?.nameFr || myAmbassador.studyLevel
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {currentLanguage === 'en' ? 'Graduation' : 'Diplômé en'} {myAmbassador.graduationYear}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="lg:col-span-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {currentLanguage === 'en' ? 'Performance' : 'Performance'}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{myAmbassador.points}</div>
                      <div className="text-sm text-gray-600">
                        {currentLanguage === 'en' ? 'Points' : 'Points'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{myAmbassador.referrals}</div>
                      <div className="text-sm text-gray-600">
                        {currentLanguage === 'en' ? 'Referrals' : 'Parrainages'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        ) : (
          /* No Application - Show Simplified Ambassador Program */
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {currentLanguage === 'en' ? 'Become a Student Ambassador' : 'Devenir Ambassadeur Étudiant'}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                {currentLanguage === 'en' 
                  ? 'Represent E-TAWJIHI Global and Help Fellow Students Achieve Their Dreams'
                  : 'Représentez E-TAWJIHI Global et Aidez Vos Camarades Étudiants à Réaliser Leurs Rêves'
                }
              </p>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                {currentLanguage === 'en' 
                  ? 'Join our global network of student ambassadors and make a difference in your community.'
                  : 'Rejoignez notre réseau mondial d\'ambassadeurs étudiants et faites la différence dans votre communauté.'
                }
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {currentLanguage === 'en' ? 'Earn While You Help' : 'Gagnez en Aidant'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'en' 
                    ? 'Earn 5-20% commissions on application fees, plus monthly stipends and performance bonuses.'
                    : 'Gagnez 5-20% de commissions sur les frais de candidature, plus des allocations mensuelles et des primes de performance.'
                  }
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {currentLanguage === 'en' ? 'Build Your Network' : 'Construisez Votre Réseau'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'en' 
                    ? 'Connect with students worldwide, university representatives, and industry professionals.'
                    : 'Connectez-vous avec des étudiants du monde entier, des représentants d\'universités et des professionnels de l\'industrie.'
                  }
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {currentLanguage === 'en' ? 'Leadership Development' : 'Développement du Leadership'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'en' 
                    ? 'Develop essential skills: public speaking, event management, and cross-cultural communication.'
                    : 'Développez des compétences essentielles : prise de parole en public, gestion d\'événements et communication interculturelle.'
                  }
                </p>
              </div>
            </div>

            {/* Ambassador Levels */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {currentLanguage === 'en' ? 'Ambassador Levels' : 'Niveaux d\'Ambassadeur'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {AMBASSADOR_TIERS.map((tier) => (
                  <div key={tier.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <div className={`w-12 h-12 ${tier.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white text-lg`}>
                      {tier.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">
                      {currentLanguage === 'en' ? tier.name : tier.nameFr}
                    </h3>
                    <div className="text-xs text-gray-600 mb-2">
                      {tier.minPoints === 0 ? (
                        currentLanguage === 'en' ? '0-10 referrals/year' : '0-10 parrainages/an'
                      ) : tier.minPoints === 11 ? (
                        currentLanguage === 'en' ? '11-25 referrals/year' : '11-25 parrainages/an'
                      ) : tier.minPoints === 26 ? (
                        currentLanguage === 'en' ? '26-50 referrals/year' : '26-50 parrainages/an'
                      ) : tier.minPoints === 51 ? (
                        currentLanguage === 'en' ? '51-100 referrals/year' : '51-100 parrainages/an'
                      ) : (
                        currentLanguage === 'en' ? '100+ referrals/year' : '100+ parrainages/an'
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {tier.minPoints === 0 ? '5%' : tier.minPoints === 11 ? '8%' : tier.minPoints === 26 ? '12%' : tier.minPoints === 51 ? '16%' : '20%'} {currentLanguage === 'en' ? 'commission' : 'commission'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Process */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {currentLanguage === 'en' ? 'How to Apply' : 'Comment Postuler'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-lg font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {currentLanguage === 'en' ? 'Submit Application' : 'Soumettre la Candidature'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {currentLanguage === 'en' 
                      ? 'Complete our ambassador application form'
                      : 'Complétez notre formulaire de candidature d\'ambassadeur'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-lg font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {currentLanguage === 'en' ? 'Interview' : 'Entretien'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {currentLanguage === 'en' 
                      ? 'Participate in a friendly interview'
                      : 'Participez à un entretien amical'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-lg font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {currentLanguage === 'en' ? 'Training' : 'Formation'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {currentLanguage === 'en' 
                      ? 'Complete our training program'
                      : 'Complétez notre programme de formation'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-lg font-bold">
                    4
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {currentLanguage === 'en' ? 'Start Helping' : 'Commencer à Aider'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {currentLanguage === 'en' 
                      ? 'Begin helping students and earning rewards'
                      : 'Commencez à aider les étudiants et gagner des récompenses'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg p-6 sm:p-8 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                {currentLanguage === 'en' ? 'Ready to Make a Difference?' : 'Prêt à Faire la Différence ?'}
              </h2>
              <p className="text-sm sm:text-base mb-6 text-white opacity-90">
                {currentLanguage === 'en' ? 'Join our community of student ambassadors today' : 'Rejoignez notre communauté d\'ambassadeurs étudiants aujourd\'hui'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowApplicationModal(true)}
                  className="px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  {currentLanguage === 'en' ? 'Apply Now' : 'Postuler Maintenant'}
                </button>
                <button
                  onClick={() => setShowBenefitsModal(true)}
                  className="px-6 sm:px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-medium"
                >
                  {currentLanguage === 'en' ? 'View Benefits' : 'Voir les Avantages'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <AmbassadorApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          onSubmit={handleSubmitApplication}
          language={currentLanguage}
          userProfile={userProfile}
          submitting={submitting}
        />
      )}

      {/* Benefits Modal */}
      {showBenefitsModal && (
        <AmbassadorBenefitsModal
          isOpen={showBenefitsModal}
          onClose={() => setShowBenefitsModal(false)}
          language={currentLanguage}
        />
      )}
    </div>
  );
};

// Application Modal Component
const AmbassadorApplicationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  language: string;
  userProfile?: any;
  submitting: boolean;
}> = ({ isOpen, onClose, onSubmit, language, userProfile, submitting }) => {
  const [formData, setFormData] = useState({
    university: '',
    fieldOfStudy: '',
    studyLevel: 'bachelor',
    graduationYear: new Date().getFullYear() + 1,
    motivation: '',
    experience: '',
    skills: '',
    socialMedia: '',
    additionalInfo: ''
  });

  // Pre-fill form with user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        // Pre-fill with available user data
        university: userProfile.university || '',
        fieldOfStudy: userProfile.fieldOfStudy || '',
        studyLevel: userProfile.studyLevel || 'bachelor',
        graduationYear: userProfile.graduationYear || new Date().getFullYear() + 1,
        socialMedia: userProfile.socialMedia || ''
      }));
    }
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.university && formData.fieldOfStudy && formData.motivation && formData.experience && formData.skills) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Ambassador Application' : 'Candidature Ambassadeur'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'University/Institution' : 'Université/Institution'} *
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'en' ? 'Your university name' : 'Nom de votre université'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Field of Study' : 'Domaine d\'Étude'} *
              </label>
              <input
                type="text"
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'en' ? 'e.g., Computer Science' : 'ex: Informatique'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Study Level' : 'Niveau d\'Étude'} *
              </label>
              <select
                value={formData.studyLevel}
                onChange={(e) => setFormData({ ...formData, studyLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {STUDY_LEVELS.map(level => (
                  <option key={level.id} value={level.id}>
                    {language === 'en' ? level.name : level.nameFr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Expected Graduation Year' : 'Année de Diplôme Prévue'} *
              </label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 10}
                required
              />
            </div>
          </div>

          {/* Motivation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Why do you want to become an E-TAWJIHI Ambassador?' : 'Pourquoi voulez-vous devenir Ambassadeur E-TAWJIHI ?'} *
            </label>
            <textarea
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Tell us about your motivation and goals...' : 'Parlez-nous de votre motivation et de vos objectifs...'}
              required
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Relevant Experience' : 'Expérience Pertinente'} *
            </label>
            <textarea
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Describe your relevant experience (leadership, mentoring, community service, etc.)...' : 'Décrivez votre expérience pertinente (leadership, mentorat, service communautaire, etc.)...'}
              required
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Skills & Strengths' : 'Compétences & Forces'} *
            </label>
            <textarea
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'List your key skills and strengths...' : 'Listez vos compétences et forces clés...'}
              required
            />
          </div>

          {/* Social Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Social Media Presence (Optional)' : 'Présence sur les Réseaux Sociaux (Optionnel)'}
            </label>
            <textarea
              value={formData.socialMedia}
              onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'LinkedIn, Instagram, Facebook profiles...' : 'Profils LinkedIn, Instagram, Facebook...'}
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Additional Information (Optional)' : 'Informations Supplémentaires (Optionnel)'}
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Anything else you\'d like us to know...' : 'Autre chose que vous aimeriez que nous sachions...'}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={submitting}
            >
              {language === 'en' ? 'Cancel' : 'Annuler'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{language === 'en' ? 'Submitting...' : 'Soumission...'}</span>
                </div>
              ) : (
                language === 'en' ? 'Submit Application' : 'Soumettre la Candidature'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Benefits Modal Component
const AmbassadorBenefitsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  language: string;
}> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Ambassador Benefits' : 'Avantages d\'Ambassadeur'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Ambassador Tiers */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'en' ? 'Ambassador Tiers & Benefits' : 'Paliers d\'Ambassadeur & Avantages'}
          </h4>
          <div className="space-y-4">
            {AMBASSADOR_TIERS.map((tier) => (
              <div key={tier.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 ${tier.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {tier.icon}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {language === 'en' ? tier.name : tier.nameFr}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {tier.minPoints} - {tier.maxPoints === 9999 ? '∞' : tier.maxPoints} {language === 'en' ? 'points' : 'points'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'en' ? tier.description : tier.descriptionFr}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="text-sm font-medium text-gray-900 mb-2">
                      {language === 'en' ? 'Benefits' : 'Avantages'}
                    </h6>
                    <ul className="space-y-1">
                      {(language === 'en' ? tier.benefits : tier.benefitsFr).map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-900 mb-2">
                      {language === 'en' ? 'Requirements' : 'Exigences'}
                    </h6>
                    <ul className="space-y-1">
                      {(language === 'en' ? tier.requirements : tier.requirementsFr).map((requirement, index) => (
                        <li key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                          <Target className="w-3 h-3 text-blue-500 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Benefits */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'en' ? 'General Program Benefits' : 'Avantages Généraux du Programme'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AMBASSADOR_BENEFITS.map((benefit) => (
              <div key={benefit.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 ${benefit.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {benefit.icon}
                  </div>
                  <h5 className="font-medium text-gray-900">
                    {language === 'en' ? benefit.title : benefit.titleFr}
                  </h5>
                </div>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? benefit.description : benefit.descriptionFr}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">
              {language === 'en' ? 'Ready to Join?' : 'Prêt à Rejoindre ?'}
            </h4>
          </div>
          <p className="text-blue-800 text-sm">
            {language === 'en' 
              ? 'Join our community of passionate students making a difference in education worldwide.'
              : 'Rejoignez notre communauté d\'étudiants passionnés qui font la différence dans l\'éducation mondiale.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default BecomeAmbassadorSection;

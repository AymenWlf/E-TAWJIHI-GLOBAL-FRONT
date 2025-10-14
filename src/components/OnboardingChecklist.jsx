import React from 'react';
import { CheckCircle, Circle, ArrowRight, User, Mail, Brain, Search, FileText, UserCheck, GraduationCap, FileCheck, Settings } from 'lucide-react';

const OnboardingChecklist = ({ 
  userProgress = {}, 
  language = 'en', 
  isCompact = false, 
  showProgress = true,
  onStepClick = null 
}) => {
  // Define onboarding steps
  const onboardingSteps = [
    {
      id: 'account_creation',
      icon: User,
      title: language === 'en' ? 'Create Account' : 'Créer un Compte',
      description: language === 'en' ? 'Sign up and verify your account' : 'Inscrivez-vous et vérifiez votre compte',
      completed: userProgress.account_creation || false
    },
    {
      id: 'email_verification',
      icon: Mail,
      title: language === 'en' ? 'Verify Email' : 'Vérifier l\'Email',
      description: language === 'en' ? 'Confirm your email address' : 'Confirmez votre adresse email',
      completed: userProgress.email_verification || false
    },
    {
      id: 'edvisor_test',
      icon: Brain,
      title: language === 'en' ? 'E-DVISOR Test' : 'Test E-DVISOR',
      description: language === 'en' ? 'Complete your AI assessment' : 'Complétez votre évaluation IA',
      completed: userProgress.edvisor_test || false
    },
    {
      id: 'search_shortlist',
      icon: Search,
      title: language === 'en' ? 'Search & Shortlist' : 'Rechercher & Sélectionner',
      description: language === 'en' ? 'Find and save your favorite programs' : 'Trouvez et sauvegardez vos programmes favoris',
      completed: userProgress.search_shortlist || false
    },
    {
      id: 'apply_choice',
      icon: FileText,
      title: language === 'en' ? 'Apply to 1 Choice' : 'Postuler à 1 Choix',
      description: language === 'en' ? 'Submit your first application' : 'Soumettez votre première candidature',
      completed: userProgress.apply_choice || false
    },
    {
      id: 'fill_information',
      icon: UserCheck,
      title: language === 'en' ? 'Fill Your Information' : 'Remplir Vos Informations',
      description: language === 'en' ? 'Complete your personal details' : 'Complétez vos détails personnels',
      completed: userProgress.fill_information || false
    },
    {
      id: 'degrees_qualifications',
      icon: GraduationCap,
      title: language === 'en' ? 'Degrees & Qualifications' : 'Diplômes & Qualifications',
      description: language === 'en' ? 'Add your academic background' : 'Ajoutez votre parcours académique',
      completed: userProgress.degrees_qualifications || false
    },
    {
      id: 'documents_preferences',
      icon: FileCheck,
      title: language === 'en' ? 'Documents & Preferences' : 'Documents & Préférences',
      description: language === 'en' ? 'Upload documents and set preferences' : 'Téléchargez les documents et définissez les préférences',
      completed: userProgress.documents_preferences || false
    }
  ];

  // Calculate progress
  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const totalSteps = onboardingSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  // Get next incomplete step
  const nextStep = onboardingSteps.find(step => !step.completed);

  if (isCompact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            {language === 'en' ? 'Onboarding Progress' : 'Progression d\'Inscription'}
          </h3>
          <span className="text-xs text-gray-500">
            {completedSteps}/{totalSteps}
          </span>
        </div>
        
        {showProgress && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {Math.round(progressPercentage)}% {language === 'en' ? 'complete' : 'terminé'}
            </p>
          </div>
        )}

        {nextStep && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <nextStep.icon className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-gray-700">
              {language === 'en' ? 'Next:' : 'Suivant:'} {nextStep.title}
            </span>
          </div>
        )}

        {completedSteps === totalSteps && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">
              {language === 'en' ? 'Onboarding Complete!' : 'Inscription Terminée!'}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {language === 'en' ? 'Onboarding Checklist' : 'Liste de Vérification d\'Inscription'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'en' 
              ? 'Complete these steps to get the most out of E-TAWJIHI' 
              : 'Complétez ces étapes pour tirer le meilleur parti d\'E-TAWJIHI'
            }
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {completedSteps}/{totalSteps}
          </div>
          <div className="text-sm text-gray-600">
            {language === 'en' ? 'Steps Complete' : 'Étapes Terminées'}
          </div>
        </div>
      </div>

      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {language === 'en' ? 'Overall Progress' : 'Progression Globale'}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {onboardingSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div 
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                step.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } ${onStepClick ? 'cursor-pointer' : ''}`}
              onClick={() => onStepClick && onStepClick(step.id)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.completed 
                  ? 'bg-green-100' 
                  : 'bg-gray-100'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Icon className="w-5 h-5 text-gray-600" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold ${
                    step.completed ? 'text-green-800' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h4>
                  {step.completed && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {language === 'en' ? 'Complete' : 'Terminé'}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${
                  step.completed ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {step.description}
                </p>
              </div>

              {!step.completed && onStepClick && (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          );
        })}
      </div>

      {nextStep && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <nextStep.icon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">
                {language === 'en' ? 'Next Step' : 'Étape Suivante'}
              </h4>
              <p className="text-sm text-blue-700">
                {nextStep.title}: {nextStep.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {completedSteps === totalSteps && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-900">
                {language === 'en' ? 'Congratulations!' : 'Félicitations!'}
              </h4>
              <p className="text-sm text-green-700">
                {language === 'en' 
                  ? 'You have completed all onboarding steps. You\'re all set to make the most of E-TAWJIHI!'
                  : 'Vous avez terminé toutes les étapes d\'inscription. Vous êtes prêt à tirer le meilleur parti d\'E-TAWJIHI!'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingChecklist;

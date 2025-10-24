import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  FileText, 
  User, 
  Users, 
  GraduationCap,
  Building2,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import applicationService from '../services/applicationService';
import PersonalInfoStep from './applicationSteps/PersonalInfoStep';
import AgentSelectionStep from './applicationSteps/AgentSelectionStep';
import AcademicInfoStep from './applicationSteps/AcademicInfoStep';
import PersonalDocumentsStep from './applicationSteps/PersonalDocumentsStep';
import MotivationLetterStep from './applicationSteps/MotivationLetterStep';
import ReferencesStep from './applicationSteps/ReferencesStep';
import ReviewSubmissionStep from './applicationSteps/ReviewSubmissionStep';

const ApplicationWizard = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [application, setApplication] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [stepsConfig, setStepsConfig] = useState({});

  useEffect(() => {
    loadApplication();
    loadStepsConfig();
  }, [programId]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      // First try to get existing application for this program
      const response = await applicationService.getApplicationByProgram(parseInt(programId));
      setApplication(response.application);
      setCurrentStep(response.application.currentStep);
      setStepData(response.progress.steps.reduce((acc, step) => {
        acc[step.stepNumber] = step.stepData || {};
        return acc;
      }, {}));
    } catch (err) {
      if (err.response?.status === 404) {
        // No existing application, create new one
        try {
          const response = await applicationService.createApplication(parseInt(programId));
          setApplication(response.application);
          setCurrentStep(1);
          setStepData({});
        } catch (createErr) {
          setError(createErr.response?.data?.error || 'Failed to create application');
        }
      } else {
        setError(err.response?.data?.error || 'Failed to load application');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStepsConfig = async () => {
    try {
      const config = await applicationService.getStepsConfig();
      setStepsConfig(config);
    } catch (err) {
      console.error('Failed to load steps config:', err);
    }
  };

  const saveStep = async (stepNumber, data) => {
    if (!application) return;

    try {
      setSaving(true);
      // Use the new method that syncs with profile
      const response = await applicationService.updateApplicationStepWithProfileSync(
        application.id, 
        stepNumber, 
        data
      );
      
      setApplication(response.application);
      setStepData(prev => ({
        ...prev,
        [stepNumber]: data
      }));
      
      return response.step;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save step');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = async () => {
    if (!application) return;

    try {
      setSaving(true);
      await applicationService.submitApplication(application.id);
      navigate('/profile?tab=applications');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setSaving(false);
    }
  };

  const getStepIcon = (stepNumber) => {
    const icons = {
      1: User,
      2: Users,
      3: GraduationCap,
      4: FileText,
      5: FileText,
      6: Users,
      7: CheckCircle2
    };
    return icons[stepNumber] || Circle;
  };

  const getStepStatus = (stepNumber) => {
    if (!application) return 'pending';
    
    const step = application.steps?.find(s => s.stepNumber === stepNumber);
    if (step?.isCompleted) return 'completed';
    if (stepNumber === currentStep) return 'current';
    if (stepNumber < currentStep) return 'completed';
    return 'pending';
  };

  const renderProgressBar = () => {
    const totalSteps = 7;
    const progress = application ? parseFloat(application.progressPercentage) : 0;

    return (
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                {language === 'fr' ? 'Progression de la Candidature' : 'Application Progress'}
              </h2>
              <p className="text-gray-600 mt-1">
                {language === 'fr' ? 'Suivez votre avancement étape par étape' : 'Track your progress step by step'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</div>
                <div className="text-sm text-gray-600">
                  {language === 'fr' ? 'complété' : 'complete'}
                </div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                    className="text-blue-600 transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map(stepNumber => {
              const Icon = getStepIcon(stepNumber);
              const status = getStepStatus(stepNumber);
              const config = stepsConfig[stepNumber];
              
              return (
                <div key={stepNumber} className="flex flex-col items-center group">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110
                    ${status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' : 
                      status === 'current' ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg' : 
                      'bg-gray-100 text-gray-400 hover:bg-gray-200'}
                  `}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${
                      status === 'completed' ? 'text-green-600' : 
                      status === 'current' ? 'text-blue-600' : 
                      'text-gray-500'
                    }`}>
                      {language === 'fr' ? config?.titleFr : config?.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {language === 'fr' ? 'Étape' : 'Step'} {stepNumber}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    if (!application) return null;

    switch (currentStep) {
      case 1:
        return <PersonalInfoStep 
          data={stepData[1] || {}} 
          onSave={(data) => saveStep(1, data)}
          language={language}
        />;
      case 2:
        return <AgentSelectionStep 
          data={stepData[2] || {}} 
          onSave={(data) => saveStep(2, data)}
          language={language}
        />;
      case 3:
        return <AcademicInfoStep 
          data={stepData[3] || {}} 
          onSave={(data) => saveStep(3, data)}
          language={language}
        />;
      case 4:
        return <PersonalDocumentsStep 
          applicationId={application.id}
          data={stepData[4] || {}} 
          onSave={(data) => saveStep(4, data)}
          language={language}
        />;
      case 5:
        return <MotivationLetterStep 
          data={stepData[5] || {}} 
          onSave={(data) => saveStep(5, data)}
          language={language}
        />;
      case 6:
        return <ReferencesStep 
          data={stepData[6] || {}} 
          onSave={(data) => saveStep(6, data)}
          language={language}
        />;
      case 7:
        return <ReviewSubmissionStep 
          application={application}
          onSubmit={submitApplication}
          language={language}
        />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'fr' ? 'Chargement...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {language === 'fr' ? 'Erreur' : 'Error'}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/establishments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {language === 'fr' ? 'Retour' : 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {language === 'fr' ? 'Candidature' : 'Application'}
                </h1>
                <p className="text-sm text-gray-600">
                  {application?.program?.name} - {application?.program?.establishment?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                {language === 'fr' ? 'Étape' : 'Step'} {currentStep}/7
              </div>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-300"
                  style={{ width: `${(currentStep / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {renderProgressBar()}
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Step Header */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {React.createElement(getStepIcon(currentStep), { className: "w-5 h-5 text-white" })}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {language === 'fr' ? stepsConfig[currentStep]?.titleFr : stepsConfig[currentStep]?.title}
                </h2>
                <p className="text-blue-100 text-sm">
                  {language === 'fr' ? stepsConfig[currentStep]?.descriptionFr : stepsConfig[currentStep]?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6 lg:p-8">
            {renderStepContent()}
          </div>
          
          {/* Navigation Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'Précédent' : 'Previous'}
              </button>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {language === 'fr' ? 'Sauvegarde automatique activée' : 'Auto-save enabled'}
              </div>
              
              {currentStep < 7 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {language === 'fr' ? 'Suivant' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={submitApplication}
                  disabled={saving || !application?.canSubmit}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === 'fr' ? 'Soumission...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {language === 'fr' ? 'Soumettre la Candidature' : 'Submit Application'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components are now imported from separate files
// PersonalInfoStep, AcademicInfoStep, ReferencesStep are imported at the top
// Other step components need to be created as separate files

export default ApplicationWizard;

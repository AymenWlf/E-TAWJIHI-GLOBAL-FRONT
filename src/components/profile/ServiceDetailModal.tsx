import React, { useState } from 'react';
import { 
  X, Download, Smartphone, Clock, CheckCircle, 
  Star, Globe, ArrowRight, ExternalLink, FileText,
  Users, Award, Shield, Zap
} from 'lucide-react';
import { Service } from '../../types/serviceTypes';
import TranslationModal from './TranslationModal';
import { TranslationRequest } from '../../types/translationTypes';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  language: string;
  onPurchase: () => void;
  onTranslationRequest?: (request: TranslationRequest) => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  service,
  language,
  onPurchase,
  onTranslationRequest
}) => {
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  if (!isOpen) return null;

  const handleDownloadExample = () => {
    if (service.exampleReportUrl) {
      // Create a temporary link to download the example
      const link = document.createElement('a');
      link.href = service.exampleReportUrl;
      link.download = `example-${service.id}-report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getServiceIcon = (feature: string) => {
    if (feature.toLowerCase().includes('mobile') || feature.toLowerCase().includes('app')) {
      return <Smartphone className="w-5 h-5 text-blue-500" />;
    }
    if (feature.toLowerCase().includes('consultation') || feature.toLowerCase().includes('support')) {
      return <Users className="w-5 h-5 text-green-500" />;
    }
    if (feature.toLowerCase().includes('guarantee') || feature.toLowerCase().includes('success')) {
      return <Shield className="w-5 h-5 text-purple-500" />;
    }
    if (feature.toLowerCase().includes('premium') || feature.toLowerCase().includes('exclusive')) {
      return <Award className="w-5 h-5 text-yellow-500" />;
    }
    if (feature.toLowerCase().includes('notification') || feature.toLowerCase().includes('real-time')) {
      return <Zap className="w-5 h-5 text-orange-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {service.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'en' ? service.name : service.nameFr}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'en' ? service.category.name : service.category.nameFr}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {service.isPopular && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>{language === 'en' ? 'Popular' : 'Populaire'}</span>
              </span>
            )}
            {service.mobileApp && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                <Smartphone className="w-3 h-3" />
                <span>App</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {language === 'en' ? 'Service Description' : 'Description du Service'}
            </h3>
            <p className="text-gray-700">
              {language === 'en' ? service.description : service.descriptionFr}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {language === 'en' ? 'What\'s Included' : 'Ce qui est Inclus'}
            </h3>
            <div className="space-y-2">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    {language === 'en' ? feature : service.featuresFr[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.duration && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {language === 'en' ? 'Duration' : 'Durée'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? service.duration : service.durationFr}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">
                  {language === 'en' ? 'Availability' : 'Disponibilité'}
                </h4>
                <p className="text-sm text-gray-600">
                  {service.targetCountries.includes('ALL') 
                    ? (language === 'en' ? 'All Countries' : 'Tous les Pays')
                    : `${service.targetCountries.length} ${language === 'en' ? 'Countries' : 'Pays'}`
                  }
                </p>
              </div>
            </div>

            {service.mobileApp && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {language === 'en' ? 'Mobile App' : 'Application Mobile'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'iOS & Android' : 'iOS & Android'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Example Report */}
          {service.exampleReportUrl && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {language === 'en' ? 'Example Report' : 'Exemple de Rapport'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'en' 
                      ? 'Download a sample report'
                      : 'Téléchargez un exemple de rapport'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownloadExample}
                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'en' ? 'Download' : 'Télécharger'}</span>
              </button>
            </div>
          )}

          {/* Process Steps for Housing & Guarantor */}
          {service.id === 'housing_guarantor' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'en' ? 'How It Works' : 'Comment ça Marche'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {language === 'en' ? 'Housing Search' : 'Recherche de Logement'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en' 
                        ? 'We help you find suitable accommodation based on your budget and preferences'
                        : 'Nous vous aidons à trouver un logement adapté selon votre budget et préférences'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {language === 'en' ? 'Guarantor Services' : 'Services de Garant'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en' 
                        ? 'We provide guarantor services to help you secure your accommodation'
                        : 'Nous fournissons des services de garant pour vous aider à sécuriser votre logement'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {language === 'en' ? 'Ongoing Support' : 'Support Continu'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en' 
                        ? 'Continuous assistance with any housing-related issues during your studies'
                        : 'Assistance continue pour tout problème lié au logement pendant vos études'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? 'Service Price' : 'Prix du Service'}
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {service.id === 'document_translation' 
                  ? (language === 'en' ? 'Variable Pricing' : 'Prix Variable')
                  : `${service.price.toLocaleString()} ${service.currency}`
                }
              </div>
            </div>
            {service.id === 'document_translation' ? (
              <button
                onClick={() => {
                  // Navigate to translations section
                  window.location.href = '/profile/translations';
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>{language === 'en' ? 'Start Now' : 'Commencer maintenant'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onPurchase}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>{language === 'en' ? 'Purchase Now' : 'Acheter Maintenant'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Translation Modal */}
      {showTranslationModal && onTranslationRequest && (
        <TranslationModal
          isOpen={showTranslationModal}
          onClose={() => setShowTranslationModal(false)}
          service={service}
          language={language}
          onTranslationRequest={onTranslationRequest}
        />
      )}
    </div>
  );
};

export default ServiceDetailModal;

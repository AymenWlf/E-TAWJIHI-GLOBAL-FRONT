import React, { useState, useEffect } from 'react';
import { 
  Star, Smartphone, Globe, Clock, 
  CheckCircle, Filter, MapPin, Loader2
} from 'lucide-react';
import { 
  SERVICE_CATEGORIES
} from '../../types/serviceTypes';
import serviceService, { Service } from '../../services/serviceService';

interface ServicesSectionProps {
  language: string;
  userCountry?: string;
  userStudyCountry?: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  language,
  userCountry,
  userStudyCountry
}) => {
  // Check if the country is a default value (not user-set)
  const isDefaultCountry = (country: string | undefined) => {
    if (!country) return true;
    const defaultCountries = ['United Kingdom', 'Morocco', 'Casablanca'];
    return defaultCountries.includes(country);
  };

  const effectiveUserCountry = isDefaultCountry(userCountry) ? undefined : userCountry;
  const effectiveUserStudyCountry = isDefaultCountry(userStudyCountry) ? undefined : userStudyCountry;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load services from backend
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await serviceService.getServices(language);
        if (response.success) {
          setServices(response.data);
        } else {
          setError(response.message || 'Failed to load services');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [language]);

  // Filter services by category (backend already filters by country)
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(service => service.category === selectedCategory));
    }
  }, [selectedCategory, services]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const handlePurchase = (service: Service) => {
    setSelectedService(service);
    setShowPaymentModal(true);
  };


  const getServiceStatus = (service: Service) => {
    return {
      available: service.isAvailable,
      message: service.availabilityMessage,
      color: service.isAvailable ? 'text-green-600' : 'text-orange-500'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'My Services' : 'Mes Services'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Discover our comprehensive services to support your educational journey'
              : 'Découvrez nos services complets pour accompagner votre parcours éducatif'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="w-5 h-5" />
          <span className="text-sm">
            {effectiveUserStudyCountry || effectiveUserCountry || (language === 'en' ? 'Country not set' : 'Pays non défini')}
          </span>
          {effectiveUserCountry && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              {language === 'en' ? 'Services for your country' : 'Services pour votre pays'}
            </span>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Filter by Category' : 'Filtrer par Catégorie'}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {language === 'en' ? 'All Services' : 'Tous les Services'}
          </button>
          
          {SERVICE_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{language === 'en' ? category.name : category.nameFr}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {language === 'en' ? 'No services found' : 'Aucun service trouvé'}
          </h3>
          <p className="text-gray-500 mb-4">
            {userCountry ? (
              language === 'en' 
                ? `No services are currently available for ${userCountry}. Try selecting a different category or update your country settings.`
                : `Aucun service n'est actuellement disponible pour ${userCountry}. Essayez de sélectionner une autre catégorie ou mettez à jour vos paramètres de pays.`
            ) : (
              language === 'en' 
                ? 'Please set your country in your profile to see available services for your location.'
                : 'Veuillez définir votre pays dans votre profil pour voir les services disponibles pour votre localisation.'
            )}
          </p>
          {!userCountry && (
            <button
              onClick={() => {
                // Scroll to basic info section to set country
                const basicInfoSection = document.getElementById('basic-info');
                if (basicInfoSection) {
                  basicInfoSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Set Country' : 'Définir le Pays'}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-gray-600">
                  {language === 'en' ? 'Loading services...' : 'Chargement des services...'}
                </span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Services List */}
          {!loading && !error && (
            <div className="space-y-4">
              {filteredServices.map(service => {
              const status = getServiceStatus(service);
              
              return (
                <div
                  key={service.id}
                  className="border border-gray-200 rounded-lg p-6 transition-colors hover:border-blue-300 cursor-pointer"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {SERVICE_CATEGORIES.find(cat => cat.id === service.category)?.name || service.category}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        {service.duration && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {service.duration} {service.durationUnit ? (
                                language === 'en' 
                                  ? service.durationUnit 
                                  : service.durationUnit === 'days' ? 'jours' 
                                  : service.durationUnit === 'weeks' ? 'semaines'
                                  : service.durationUnit === 'months' ? 'mois'
                                  : service.durationUnit === 'hours' ? 'heures'
                                  : service.durationUnit
                              ) : ''}
                            </span>
                          </span>
                        )}
                        {service.features.includes('Mobile App') && (
                          <span className="flex items-center space-x-1">
                            <Smartphone className="w-4 h-4" />
                            <span>Mobile App</span>
                          </span>
                        )}
                        {service.features.includes('Popular') && (
                          <span className="flex items-center space-x-1 text-yellow-600">
                            <Star className="w-4 h-4" />
                            <span>{language === 'en' ? 'Popular' : 'Populaire'}</span>
                          </span>
                        )}
                        {userCountry && (
                          <span className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>{language === 'en' ? 'Available for you' : 'Disponible pour vous'}</span>
                          </span>
                        )}
                      </div>
                      
                      <div className={`text-sm ${status.color}`}>
                        {status.message}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {service.category === 'translation' 
                          ? (language === 'en' ? 'Variable' : 'Variable')
                          : `${service.price.toLocaleString()} ${service.currency}`
                        }
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (service.category === 'translation') {
                            // Navigate to translations section
                            window.location.href = '/profile/translations';
                          } else {
                            handlePurchase(service);
                          }
                        }}
                        className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {service.category === 'translation' 
                          ? (language === 'en' ? 'Start Now' : 'Commencer maintenant')
                          : (language === 'en' ? 'Purchase' : 'Acheter')
                        }
                      </button>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </>
      )}

      {/* Modals - Temporarily disabled */}
      {selectedService && showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">{selectedService.name}</h3>
            <p className="text-gray-600 mb-4">{selectedService.description}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowServiceModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {language === 'en' ? 'Close' : 'Fermer'}
              </button>
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setShowPaymentModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {language === 'en' ? 'Purchase' : 'Acheter'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {selectedService && showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'en' ? 'Payment' : 'Paiement'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'en' ? 'Payment functionality coming soon' : 'Fonctionnalité de paiement bientôt disponible'}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {language === 'en' ? 'Close' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesSection;

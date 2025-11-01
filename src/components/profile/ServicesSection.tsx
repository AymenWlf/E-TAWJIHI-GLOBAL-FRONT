import React, { useState, useEffect } from 'react';
import { 
  Star, Smartphone, Globe, 
  CheckCircle, Filter, MapPin, Loader2, Tag,
  X, Bell, GraduationCap, BookOpen, Users, Award,
  ArrowRight, Zap, Shield, MessageCircle, Percent
} from 'lucide-react';
import { 
  SERVICE_CATEGORIES
} from '../../types/serviceTypes';
import serviceService, { Service } from '../../services/serviceService';
import { useCurrency } from '../../contexts/CurrencyContext';

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
  const { userCurrency } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load services from backend with user's currency
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        // Ensure language is 'fr' or 'en' (normalize it)
        const normalizedLanguage = language === 'fr' || language === 'français' ? 'fr' : 'en';
        const response = await serviceService.getServices(normalizedLanguage, userCurrency);
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
  }, [language, userCurrency]);

  // Update selectedService when language changes (to reflect translated features)
  useEffect(() => {
    if (selectedService && services.length > 0) {
      const updatedService = services.find(s => s.id === selectedService.id);
      if (updatedService && updatedService !== selectedService) {
        setSelectedService(updatedService);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, services]);

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
            {effectiveUserStudyCountry || effectiveUserCountry || userCountry || (language === 'en' ? 'Country not set' : 'Pays non défini')}
          </span>
          {(effectiveUserCountry || (userCountry && !isDefaultCountry(userCountry))) && (
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
                      {service.promotionalPrice && service.discountAmount && service.discountPercentage ? (
                        <div className="mb-2">
                          <div className="flex items-center justify-end space-x-2 mb-1">
                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                              -{service.discountPercentage}%
                            </span>
                            <span className="text-xs text-red-600 font-medium">
                              {language === 'en' ? 'Promotion' : 'Promotion'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 line-through mb-1">
                            {service.price.toLocaleString()} {service.currency}
                          </div>
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {service.promotionalPrice.toLocaleString()} {service.currency}
                          </div>
                          <div className="text-xs text-gray-500">
                            {language === 'en' 
                              ? `Save ${service.discountAmount.toFixed(2)} ${service.currency}`
                              : `Économisez ${service.discountAmount.toFixed(2)} ${service.currency}`
                            }
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {service.category === 'translation' 
                            ? (language === 'en' ? 'Variable' : 'Variable')
                            : `${service.price.toLocaleString()} ${service.currency}`
                          }
                        </div>
                      )}
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

      {/* Service Detail Modal */}
      {selectedService && showServiceModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setShowServiceModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-blue-800 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm ${selectedService.color || 'bg-blue-500'}`}>
                    {selectedService.icon && selectedService.icon.length > 2 ? (
                      <span className="text-3xl">{selectedService.icon}</span>
                    ) : (
                      <Smartphone className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-white">{selectedService.name}</h2>
                    <p className="text-white text-opacity-90">
                      {SERVICE_CATEGORIES.find(cat => cat.id === selectedService.category)?.name || selectedService.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Service Description' : 'Description du Service'}
                </h3>
                <p className="text-gray-700 leading-relaxed">{selectedService.description}</p>
              </div>

              {/* Service Features */}
              {selectedService.features && selectedService.features.length > 0 && (
                <div className="bg-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'en' ? 'What\'s Included' : 'Ce qui est Inclus'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedService.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Images - Available for all services */}
              {selectedService.images && selectedService.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-blue-800" />
                    <span>{language === 'en' ? 'Application Screenshots' : 'Captures d\'écran de l\'Application'}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedService.images.map((imageUrl, index) => (
                      <div 
                        key={index}
                        className="relative aspect-[9/16] rounded-xl border-2 border-gray-200 overflow-hidden group cursor-pointer hover:border-blue-400 transition-colors"
                      >
                        <img 
                          src={imageUrl} 
                          alt={`${language === 'en' ? 'Screenshot' : 'Capture d\'écran'} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center';
                            fallback.innerHTML = `
                              <div class="text-center">
                                <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p class="text-xs text-gray-500">${language === 'en' ? 'Screenshot' : 'Capture d\'écran'} ${index + 1}</p>
                              </div>
                            `;
                            target.parentElement?.appendChild(fallback);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-800" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {language === 'en' ? 'Availability' : 'Disponibilité'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedService.targetCountries && selectedService.targetCountries.length > 0
                        ? selectedService.targetCountries.includes('ALL')
                          ? (language === 'en' ? 'All Countries' : 'Tous les Pays')
                          : `${selectedService.targetCountries.length} ${language === 'en' ? 'Countries' : 'Pays'}`
                        : (language === 'en' ? 'Available' : 'Disponible')
                      }
                    </p>
                  </div>
                </div>

                {selectedService.features && selectedService.features.some(f => f.toLowerCase().includes('mobile') || f.toLowerCase().includes('app')) && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Smartphone className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {language === 'en' ? 'Mobile App' : 'Application Mobile'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {language === 'en' ? 'iOS & Android' : 'iOS & Android'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === 'en' ? 'Service Price' : 'Prix du Service'}
                    </h3>
                    {selectedService.promotionalPrice && selectedService.discountAmount && selectedService.discountPercentage ? (
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-sm text-gray-400 line-through">
                            {selectedService.price.toLocaleString()} {selectedService.currency}
                          </div>
                          <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
                            -{selectedService.discountPercentage}%
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {selectedService.promotionalPrice.toLocaleString()} {selectedService.currency}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'en' 
                            ? `Save ${selectedService.discountAmount.toFixed(2)} ${selectedService.currency}`
                            : `Économisez ${selectedService.discountAmount.toFixed(2)} ${selectedService.currency}`
                          }
                        </div>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">
                        {selectedService.category === 'translation' 
                          ? (language === 'en' ? 'Variable Pricing' : 'Prix Variable')
                          : `${selectedService.price.toLocaleString()} ${selectedService.currency}`
                        }
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowServiceModal(false);
                      if (selectedService.category === 'translation') {
                        window.location.href = '/profile/translations';
                      } else {
                        setShowPaymentModal(true);
                      }
                    }}
                    className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                  >
                    <span>
                      {selectedService.category === 'translation' 
                        ? (language === 'en' ? 'Start Now' : 'Commencer maintenant')
                        : (language === 'en' ? 'Purchase Now' : 'Acheter Maintenant')
                      }
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
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

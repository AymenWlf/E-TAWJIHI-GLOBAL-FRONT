import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, Users, BookOpen, Globe, Calendar, 
  Award, Building2, CheckCircle, ExternalLink, Phone, Mail, 
  DollarSign, Home, Trophy, GraduationCap, Clock, Languages,
  Shield, Heart, Share2, Download, Eye, MessageCircle, Target,
  Zap, Image, Play, Map, FileText, Mic, PenTool, TrendingUp,
  FileCheck, TestTube, File
} from 'lucide-react';
import SEO from '../components/SEO';
import HeaderAuth from '../components/HeaderAuth';
import { useCurrency } from '../contexts/CurrencyContext';
import parameterService from '../services/parameterService';
import { useAllParameters } from '../hooks/useAllParameters';
import { getLabel } from '../utils/parameterDisplay';
import HeartButton from '../components/HeartButton';
import { useShortlist } from '../hooks/useShortlist';
import { useAuth } from '../contexts/AuthContext';
import EstablishmentMedia from '../components/EstablishmentMedia';
import ApplicationConfirmationModal from '../components/ApplicationConfirmationModal';

// Utility functions for application periods
const getNextApplicationPeriod = (multiIntakes) => {
  if (!multiIntakes || multiIntakes.length === 0) return null;
  const now = new Date();
  const nextIntake = multiIntakes.find(intake => {
    if (!intake.applicationCloses) return false;
    const closesDate = new Date(intake.applicationCloses);
    return now <= closesDate;
  });
  return nextIntake || null;
};

const getApplicationPeriodStatus = (intake, language = 'en') => {
  if (!intake.applicationOpens || !intake.applicationCloses) {
      return {
      status: 'no-dates', 
      color: 'gray', 
      text: language === 'fr' ? 'Aucune date disponible' : 'No dates available',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600'
    };
  }
  
  const now = new Date();
  const opensDate = new Date(intake.applicationOpens);
  const closesDate = new Date(intake.applicationCloses);
  
  // Check if application is open
  if (now >= opensDate && now <= closesDate) {
    const daysUntilClose = Math.ceil((closesDate - now) / (1000 * 60 * 60 * 24));
    if (daysUntilClose <= 30) {
      return {
        status: 'closing-soon', 
        color: 'red', 
        text: language === 'fr' ? `Se ferme dans ${daysUntilClose} jours` : `Closes in ${daysUntilClose} days`,
        bgColor: 'bg-red-100',
        textColor: 'text-red-600'
      };
    }
        return {
      status: 'open', 
      color: 'green', 
      text: language === 'fr' ? 'Ouvert' : 'Open',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    };
  }
  
  // Check if application hasn't opened yet
  if (now < opensDate) {
    const daysUntilOpen = Math.ceil((opensDate - now) / (1000 * 60 * 60 * 24));
        return {
      status: 'not-open', 
      color: 'blue', 
      text: language === 'fr' ? `S'ouvre dans ${daysUntilOpen} jours` : `Opens in ${daysUntilOpen} days`,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    };
  }
  
  // Application is closed
        return {
    status: 'closed', 
    color: 'gray', 
    text: language === 'fr' ? 'Fermé' : 'Closed',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600'
  };
};

// Utility functions for parameter-based localization
const getParameterLabel = (parameters, category, code, language = 'en') => {
  const params = parameters[category] || [];
  const param = params.find(p => p.code === code);
  if (!param) return code;
  return language === 'fr' ? param.labelFr : param.labelEn;
};

const getDegreeLabel = (parameters, degreeCode, language = 'en') => {
  return getParameterLabel(parameters, 'degrees', degreeCode, language);
};

const getLanguageLabel = (parameters, languageCode, language = 'en') => {
  return getParameterLabel(parameters, 'languages', languageCode, language);
};

const getSchoolTypeLabel = (parameters, typeCode, language = 'en') => {
  return getParameterLabel(parameters, 'schoolTypes', typeCode, language);
};

const getDurationUnitLabel = (durationUnit, language = 'en') => {
  const units = {
    'year': {
      en: 'year',
      fr: 'an'
    },
    'month': {
      en: 'month',
      fr: 'mois'
    },
    'semester': {
      en: 'semester',
      fr: 'semestre'
    },
    'trimester': {
      en: 'trimester',
      fr: 'trimestre'
    }
  };
  
  return units[durationUnit]?.[language] || durationUnit;
};

// Function to format intake name with translated months
const formatIntakeName = (intakeName, language = 'en') => {
  if (!intakeName) return intakeName;
  
  const monthTranslations = {
    'january': { en: 'January', fr: 'Janvier' },
    'february': { en: 'February', fr: 'Février' },
    'march': { en: 'March', fr: 'Mars' },
    'april': { en: 'April', fr: 'Avril' },
    'may': { en: 'May', fr: 'Mai' },
    'june': { en: 'June', fr: 'Juin' },
    'july': { en: 'July', fr: 'Juillet' },
    'august': { en: 'August', fr: 'Août' },
    'september': { en: 'September', fr: 'Septembre' },
    'october': { en: 'October', fr: 'Octobre' },
    'november': { en: 'November', fr: 'Novembre' },
    'december': { en: 'December', fr: 'Décembre' }
  };
  
  // Handle formats like "september-2025", "february-2026"
  const parts = intakeName.split('-');
  if (parts.length === 2) {
    const [month, year] = parts;
    const translatedMonth = monthTranslations[month.toLowerCase()]?.[language] || month;
    return `${translatedMonth} ${year}`;
  }
  
  // Handle other formats or return as is
  return intakeName;
};

// Function to get translated country name
const getCountryLabel = (parameters, countryCode, language = 'en') => {
  return getParameterLabel(parameters, 'countries', countryCode, language);
};

// Function to get translated school type (private/public)
const getTranslatedSchoolType = (typeCode, parameters, language) => {
  const typeParam = parameters.schoolTypes?.find(type => type.code === typeCode);
  if (typeParam) {
    return language === 'fr' ? typeParam.labelFr : typeParam.labelEn;
  }
  return typeCode; // Fallback to code if not found
};

// Function to render requirements section
const renderRequirements = (structuredRequirements, language = 'en') => {
  if (!structuredRequirements || Object.keys(structuredRequirements).length === 0) {
    return null;
  }

  const getRequirementIcon = (type) => {
    switch (type) {
      case 'academic':
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'english':
        return <Languages className="w-5 h-5 text-green-600" />;
      case 'standardizedTests':
        return <TestTube className="w-5 h-5 text-purple-600" />;
      case 'documents':
        return <File className="w-5 h-5 text-orange-600" />;
      default:
        return <FileCheck className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRequirementTitle = (type, language) => {
    const titles = {
      academic: {
        en: 'Academic Requirements',
        fr: 'Exigences académiques'
      },
      english: {
        en: 'English Language Requirements',
        fr: 'Exigences en langue anglaise'
      },
      standardizedTests: {
        en: 'Standardized Tests',
        fr: 'Tests standardisés'
      },
      documents: {
        en: 'Required Documents',
        fr: 'Documents requis'
      }
    };
    return titles[type]?.[language] || type;
  };

  const getRequirementColor = (type) => {
    switch (type) {
      case 'academic':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'english':
        return 'from-green-50 to-green-100 border-green-200';
      case 'standardizedTests':
        return 'from-purple-50 to-purple-100 border-purple-200';
      case 'documents':
        return 'from-orange-50 to-orange-100 border-orange-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Target className="w-6 h-6 text-indigo-600" />
        {language === 'fr' ? 'Exigences d\'admission' : 'Admission Requirements'}
      </h3>
      
      <div className="space-y-6">
        {Object.entries(structuredRequirements).map(([category, data]) => (
          <div key={category} className="bg-gradient-to-br rounded-xl border p-6">
            <div className={`bg-gradient-to-br ${getRequirementColor(category)} rounded-xl border p-6`}>
              <div className="flex items-center gap-3 mb-4">
                {getRequirementIcon(category)}
                <h4 className="text-lg font-semibold text-gray-900">
                  {getRequirementTitle(category, language)}
                </h4>
              </div>
              
              <div className="space-y-4">
                {data.items?.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold text-gray-900">
                            {language === 'fr' ? item.name?.fr || item.name?.en : item.name?.en || item.name?.fr}
                          </h5>
                          {item.required && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              {language === 'fr' ? 'Obligatoire' : 'Required'}
                            </span>
                          )}
                          {!item.required && (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                              {language === 'fr' ? 'Optionnel' : 'Optional'}
                            </span>
                          )}
                        </div>
                        
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {language === 'fr' ? item.description?.fr || item.description?.en : item.description?.en || item.description?.fr}
                          </p>
                        )}
                        
                        {/* Test-specific information */}
                        {item.type === 'test' && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.testValue && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {language === 'fr' ? 'Score requis' : 'Required Score'}: {item.testValue}
                              </span>
                            )}
                            {item.testScore && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {language === 'fr' ? 'Échelle' : 'Scale'}: {item.testScore}
                              </span>
                            )}
                            {item.englishTestType && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                {item.englishTestType.toUpperCase()}
                              </span>
                            )}
                            {item.standardizedTestType && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                {item.standardizedTestType.toUpperCase()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        {item.required ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Function to get university type info
const getUniversityTypeInfo = (program, language) => {
  const { programType, servicePricing } = program;
  
  if (programType === "A") {
        return { 
      type: "Type A",
      description: language === 'fr' ? '3 candidatures gratuites' : '3 free applications',
      color: 'green',
      freeApps: language === 'fr' ? '3 candidatures gratuites' : '3 free applications',
      visaSupport: language === 'fr' ? 'Oui' : 'Yes',
      serviceFees: language === 'fr' ? 'Gratuit' : 'Free',
      originalPrice: servicePricing?.normalPrice,
      promotionPrice: servicePricing?.promotionPrice,
      promotionDeadline: servicePricing?.promotionDeadline,
      currency: servicePricing?.currency || 'EUR'
    };
  } else if (programType === "B") {
        return { 
      type: "Type B",
      description: language === 'fr' ? 'Service payant' : 'Paid service',
      color: 'blue',
      serviceFees: language === 'fr' ? 'Frais de service requis' : 'Service fees required',
      originalPrice: servicePricing?.normalPrice,
      promotionPrice: servicePricing?.promotionPrice,
      promotionDeadline: servicePricing?.promotionDeadline,
      currency: servicePricing?.currency || 'EUR'
    };
  } else if (programType === "C") {
        return { 
      type: "Type C",
      description: language === 'fr' ? 'Configuration spéciale' : 'Special configuration',
      color: 'purple',
      serviceFees: language === 'fr' ? 'Configuration spéciale' : 'Special configuration',
      originalPrice: servicePricing?.normalPrice,
      promotionPrice: servicePricing?.promotionPrice,
      promotionDeadline: servicePricing?.promotionDeadline,
      currency: servicePricing?.currency || 'EUR'
    };
  }
  
  return null;
};

// Function to get ranking information
const getRankingInfo = (rankingType, rankingValue, language) => {
  const rankingData = {
    qs: {
      fr: {
        name: 'QS World University Rankings',
        description: 'Classement mondial des universités par QS',
        url: `https://www.topuniversities.com/university-rankings/world-university-rankings/${new Date().getFullYear()}`,
        color: 'blue'
      },
      en: {
        name: 'QS World University Rankings',
        description: 'World university rankings by QS',
        url: `https://www.topuniversities.com/university-rankings/world-university-rankings/${new Date().getFullYear()}`,
        color: 'blue'
      }
    },
    times: {
      fr: {
        name: 'Times Higher Education',
        description: 'Classement mondial des universités par THE',
        url: `https://www.timeshighereducation.com/world-university-rankings/${new Date().getFullYear()}/world-ranking`,
        color: 'red'
      },
      en: {
        name: 'Times Higher Education',
        description: 'World university rankings by THE',
        url: `https://www.timeshighereducation.com/world-university-rankings/${new Date().getFullYear()}/world-ranking`,
        color: 'red'
      }
    },
    arwu: {
      fr: {
        name: 'ARWU (Shanghai)',
        description: 'Classement académique des universités mondiales',
        url: 'https://www.shanghairanking.com/rankings/arwu/2023',
        color: 'green'
      },
      en: {
        name: 'ARWU (Shanghai)',
        description: 'Academic Ranking of World Universities',
        url: 'https://www.shanghairanking.com/rankings/arwu/2023',
        color: 'green'
      }
    },
    usNews: {
      fr: {
        name: 'U.S. News Global',
        description: 'Classement mondial des universités par U.S. News',
        url: 'https://www.usnews.com/education/best-global-universities/rankings',
        color: 'purple'
      },
      en: {
        name: 'U.S. News Global',
        description: 'Global university rankings by U.S. News',
        url: 'https://www.usnews.com/education/best-global-universities/rankings',
        color: 'purple'
      }
    }
  };

  return rankingData[rankingType]?.[language] || rankingData[rankingType]?.en || {
    name: rankingType.toUpperCase(),
    description: 'University ranking',
    url: '#',
    color: 'gray'
  };
};

const ProgramDetail = () => {
  const { establishmentSlug, programSlug } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [program, setProgram] = useState(null);
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formattedPrices, setFormattedPrices] = useState({});
  const { formatPrice, convertPrice, userCurrency } = useCurrency();
  const { currentUser } = useAuth();
  const [paramOptions, setParamOptions] = useState({ studyLevels: [], studyTypes: [], languages: [], degrees: [] });
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  
  // Parameters for localization
  const [parameters, setParameters] = useState({
    countries: [],
    cities: [],
    languages: [],
    schoolTypes: [],
    degrees: []
  });

  // Component to display service price with conversion
  const ServicePriceDisplay = ({ price, currency, isPromotion = false, className = "" }) => {
    const [displayPrice, setDisplayPrice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const loadPrice = async () => {
        if (!price) {
          setDisplayPrice(null);
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          
          // Check if convertPrice is a function
          if (typeof convertPrice !== 'function') {
            console.error('convertPrice is not a function:', convertPrice);
            setDisplayPrice(`${currency} ${price}`);
            return;
          }
          
          // Format price with currency and conversion logic
          if (currency === userCurrency) {
            const formatted = await formatPrice(price, currency, false);
            setDisplayPrice(formatted);
          } else {
            // Convert to user currency
            const converted = await convertPrice(price, currency, false);
            if (converted && converted.convertedAmount) {
              const formatted = await formatPrice(converted.convertedAmount, userCurrency, false);
              setDisplayPrice(formatted);
            } else {
              const formatted = await formatPrice(price, currency, false);
              setDisplayPrice(formatted);
            }
          }
        } catch (error) {
          console.error('Error loading service price:', error);
          setDisplayPrice(`${currency} ${price}`);
        } finally {
          setIsLoading(false);
        }
      };

      loadPrice();
    }, [price, currency, isPromotion, userCurrency, formatPrice, convertPrice]);

    if (isLoading) {
      return <span className={`${className} animate-pulse`}>...</span>;
    }

    if (!displayPrice) {
      return null;
    }

    return <span className={className}>{displayPrice}</span>;
  };

  // Scholarship info function (same as EstablishmentDetail)
  const getScholarshipInfo = (scholarshipType, language) => {
    const scholarshipData = {
      government: {
        fr: {
          title: 'Bourse Gouvernementale',
          description: 'Bourse financée par le gouvernement du pays d\'accueil, couvrant généralement les frais de scolarité et parfois les frais de subsistance.',
          type: 'Gouvernementale'
        },
        en: {
          title: 'Government Scholarship',
          description: 'Scholarship funded by the host country government, typically covering tuition fees and sometimes living expenses.',
          type: 'Government'
        }
      },
      university_full: {
        fr: {
          title: 'Bourse Universitaire Complète',
          description: 'Bourse complète offerte par l\'université, couvrant 100% des frais de scolarité et souvent les frais de subsistance.',
          type: 'Université - Complète'
        },
        en: {
          title: 'University Full Scholarship',
          description: 'Full scholarship offered by the university, covering 100% of tuition fees and often living expenses.',
          type: 'University - Full'
        }
      },
      university_partial: {
        fr: {
          title: 'Bourse Universitaire Partielle',
          description: 'Bourse partielle offerte par l\'université, couvrant une partie des frais de scolarité.',
          type: 'Université - Partielle'
        },
        en: {
          title: 'University Partial Scholarship',
          description: 'Partial scholarship offered by the university, covering a portion of tuition fees.',
          type: 'University - Partial'
        }
      },
      merit: {
        fr: {
          title: 'Bourse au Mérite',
          description: 'Bourse basée sur l\'excellence académique et les performances exceptionnelles de l\'étudiant.',
          type: 'Mérite'
        },
        en: {
          title: 'Merit Scholarship',
          description: 'Scholarship based on academic excellence and exceptional student performance.',
          type: 'Merit'
        }
      },
      international: {
        fr: {
          title: 'Bourse Internationale',
          description: 'Bourse spécialement conçue pour les étudiants internationaux, favorisant la diversité culturelle.',
          type: 'Internationale'
        },
        en: {
          title: 'International Scholarship',
          description: 'Scholarship specifically designed for international students, promoting cultural diversity.',
          type: 'International'
        }
      },
      research: {
        fr: {
          title: 'Bourse de Recherche',
          description: 'Bourse pour les étudiants engagés dans des projets de recherche avancés.',
          type: 'Recherche'
        },
        en: {
          title: 'Research Scholarship',
          description: 'Scholarship for students engaged in advanced research projects.',
          type: 'Research'
        }
      }
    };

    return scholarshipData[scholarshipType]?.[language] || scholarshipData[scholarshipType]?.en || {
      title: scholarshipType,
      description: '',
      type: scholarshipType
    };
  };

  // Use only the program slug for the API call
  const fullSlug = programSlug;

  // Load program details
  useEffect(() => {
    const loadProgramDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/programs/slug/${fullSlug}?lang=${language}`);
        
        if (!response.ok) {
          throw new Error('Program not found');
        }
        
        const data = await response.json();
        if (data.success) {
          // Test data - add languages for testing
          const programData = {
            ...data.data,
            languages: data.data.languages || ['en', 'fr'], // Test languages
            language: data.data.language || 'en' // Fallback to single language
          };
          console.log('Program data loaded:', { duration: programData.duration, durationUnit: programData.durationUnit });
          setProgram(programData);
          setEstablishment(data.data.establishment);
          
      } else {
          throw new Error(data.message || 'Failed to load program');
        }
      } catch (err) {
        setError(err.message);
      } finally {
      setLoading(false);
      }
    };

    if (fullSlug) {
      loadProgramDetail();
    }
  }, [fullSlug, language]);

  // Load all parameters using centralized service
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();

  useEffect(() => {
    if (allParams) {
      setParamOptions({
        studyLevels: allParams.studyLevels,
        studyTypes: allParams.studyTypes,
        languages: allParams.languages,
        degrees: allParams.degrees
      });
      setParameters({
        countries: allParams.countries,
        cities: allParams.cities,
        languages: allParams.languages,
        schoolTypes: allParams.schoolTypes,
        degrees: allParams.degrees,
        studyLevels: allParams.studyLevels
      });
    }
  }, [allParams, language]);

  // Format prices asynchronously
  useEffect(() => {
    const formatPrices = async () => {
      if (!program) return;
      
      const prices = {};
      
      // Format tuition amount
      if (program.tuitionAmount && program.tuitionCurrency) {
        try {
          const formatted = await formatPrice(program.tuitionAmount, program.tuitionCurrency, false);
          prices.tuition = formatted;
        } catch (error) {
          console.error('Error formatting tuition price:', error);
        }
      }
      
      setFormattedPrices(prices);
    };

    formatPrices();
  }, [program, formatPrice]);

  // Generate dynamic SEO data
  const generateDynamicTitle = () => {
    if (!program) return language === 'fr' ? 'Programme' : 'Program';
    
    const programName = language === 'fr' ? program.nameFr || program.name : program.name;
    const establishmentName = establishment?.name || '';
    const degree = getDegreeLabel(parameters, program.degree, language) || program.degree || '';
    
    return `${programName} - ${degree} | ${establishmentName}`;
  };

  const generateDynamicDescription = () => {
    if (!program) return language === 'fr' ? 'Découvrez ce programme' : 'Discover this program';
    
    const programName = language === 'fr' ? program.nameFr || program.name : program.name;
    const establishmentName = establishment?.name || '';
    const degree = getDegreeLabel(parameters, program.degree, language) || program.degree || '';
    const duration = program.duration || '';
    const country = getCountryLabel(parameters, establishment?.country, language) || establishment?.country || '';
    
    return language === 'fr' 
      ? `Étudiez ${programName} (${degree}) à ${establishmentName} en ${country}. Durée: ${duration}. Découvrez les conditions d'admission, les frais de scolarité et postulez maintenant.`
      : `Study ${programName} (${degree}) at ${establishmentName} in ${country}. Duration: ${duration}. Discover admission requirements, tuition fees and apply now.`;
  };

  const generateKeywords = () => {
    if (!program) return language === 'fr' ? 'programme, université' : 'program, university';
    
    const keywords = [];
    
    // Program name
    keywords.push(program.name);
    if (program.nameFr) keywords.push(program.nameFr);
    
    // Establishment
    if (establishment?.name) keywords.push(establishment.name);
    
    // Degree and field
    if (program.degree) keywords.push(getDegreeLabel(parameters, program.degree, language));
    if (program.subject) keywords.push(program.subject);
    if (program.field && Array.isArray(program.field)) {
      program.field.forEach(field => {
        if (typeof field === 'object' && field.labelEn) {
          keywords.push(language === 'fr' ? field.labelFr : field.labelEn);
        } else if (typeof field === 'string') {
          keywords.push(field);
        }
      });
    }
    
    // Location
    if (establishment?.country) keywords.push(getCountryLabel(parameters, establishment.country, language) || establishment.country);
    if (establishment?.city) keywords.push(establishment.city);
    
    // Study level
    if (program.studyLevel) keywords.push(program.studyLevel);
    
    return keywords.join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gray-50 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Programme non trouvé' : 'Program Not Found'}
            </h1>
            <p className="text-gray-600 mb-8">
              {language === 'fr' 
                ? 'Le programme que vous recherchez n\'existe pas ou a été supprimé.' 
                : 'The program you are looking for does not exist or has been removed.'
              }
            </p>
            <Link 
              to="/establishments" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left w-4 h-4">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              {language === 'fr' ? 'Retour aux établissements' : 'Back to Establishments'}
          </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={generateDynamicTitle()}
        description={generateDynamicDescription()}
        keywords={generateKeywords()}
        canonical={`/programs/${fullSlug}`}
        additionalMeta={[
          { name: 'og:type', content: 'article' },
          { name: 'og:title', content: generateDynamicTitle() },
          { name: 'og:description', content: generateDynamicDescription() },
          { name: 'og:image', content: establishment?.logo || '' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: generateDynamicTitle() },
          { name: 'twitter:description', content: generateDynamicDescription() },
          { name: 'twitter:image', content: establishment?.logo || '' }
        ]}
      />
      
      <HeaderAuth language={language} setLanguage={setLanguage} />
      
      <div className="pt-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb and Heart */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/establishments" className="hover:text-blue-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left w-4 h-4">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                {language === 'fr' ? 'Retour aux programmes' : 'Back to Programs'}
            </Link>
            <span>/</span>
              <span className="text-gray-900 font-medium">
                {language === 'fr' ? program.nameFr || program.name : program.name}
              </span>
            </div>
          </div>

          {/* Program Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src={establishment?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(establishment?.name || 'University')}&size=200&background=3B82F6&color=fff`} 
                    alt={`${establishment?.name || 'University'} logo`} 
                    className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {language === 'fr' ? program.nameFr || program.name : program.name}
                    </h1>
                    <h2 className="text-xl text-gray-700 mb-2">{establishment?.name}</h2>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-4 h-4">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{establishment?.city}, {getCountryLabel(parameters, establishment?.country, language) || establishment?.country}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {program.degree && (
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{getDegreeLabel(parameters, program.degree, language)}</div>
                      <div className="text-sm text-gray-600">{language === 'fr' ? 'Diplôme' : 'Degree'}</div>
                  </div>
                  )}
                  {program.duration && (
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {program.duration} {getDurationUnitLabel(program.durationUnit || 'year', language)}
                  </div>
                      <div className="text-sm text-gray-600">{language === 'fr' ? 'Durée' : 'Duration'}</div>
                  </div>
                  )}
                  {program.studyType && (
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {program.studyType === 'on-campus' ? (language === 'fr' ? 'Présentiel' : 'On-Campus') :
                         program.studyType === 'hybrid' ? (language === 'fr' ? 'Hybride' : 'Hybrid') :
                         program.studyType === 'online' ? (language === 'fr' ? 'En ligne' : 'Online') : 
                         program.studyType}
                  </div>
                      <div className="text-sm text-gray-600">{language === 'fr' ? 'Type d\'études' : 'Study Type'}</div>
                  </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {program.aidvisorRecommended && (
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-3 h-3">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <path d="m9 11 3 3L22 4"></path>
                      </svg>
                      {language === 'fr' ? 'Recommandé par E-DVISOR' : 'E-DVISOR Recommended'}
                    </div>
                  )}
                  {program.featured && (
                    <div className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award w-3 h-3">
                        <circle cx="12" cy="8" r="6"></circle>
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                      </svg>
                      {language === 'fr' ? 'En vedette' : 'Featured'}
                    </div>
                  )}
                  {program?.programType && (
                    <div className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 bg-purple-100 text-purple-800">
                      <span className="text-sm">📋</span>
                      {program.programType === 'A' ? 'Type A' : 
                       program.programType === 'B' ? 'Type B' : 
                       program.programType === 'C' ? 'Type C' : 
                       program.programType === null ? (language === 'fr' ? 'Aucun type' : 'No type') : program.programType}
                      </div>
                  )}
                  {program?.scholarships && (
                    <div className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 bg-green-100 text-green-800">
                      <span className="text-sm">🎓</span>
                      {language === 'fr' ? 'Bourses disponibles' : 'Scholarships Available'}
                    </div>
                  )}
                  {program?.housing && (
                    <div className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 bg-blue-100 text-blue-800">
                      <span className="text-sm">🏠</span>
                      {language === 'fr' ? 'Logement disponible' : 'Housing Available'}
                    </div>
                  )}
                  {program?.easyApply && (
                    <div className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 bg-orange-100 text-orange-800">
                      <span className="text-sm">⚡</span>
                      {language === 'fr' ? 'Candidature facile' : 'Easy Apply'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-5 h-5 text-green-600">
                      <line x1="12" x2="12" y1="2" y2="22"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {formattedPrices.tuition || `${program.tuitionAmount} ${program.tuitionCurrency}`}
                    </div>
                      <div className="text-sm text-gray-600">{language === 'fr' ? 'Frais de scolarité' : 'Tuition Fee'}</div>
                  </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe w-5 h-5 text-indigo-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {program.languages && Array.isArray(program.languages) && program.languages.length > 0 
                          ? program.languages.map((lang, index) => (
                              <span key={index}>
                                {getLanguageLabel(parameters, lang, language)}
                                {index < program.languages.length - 1 && ', '}
                              </span>
                            ))
                          : program.language 
                            ? getLanguageLabel(parameters, program.language, language)
                            : (language === 'fr' ? 'Non spécifié' : 'Not specified')
                        }
                    </div>
                      <div className="text-sm text-gray-600">{language === 'fr' ? 'Langues' : 'Languages'}</div>
                  </div>
                  </div>


                  {program?.field && Array.isArray(program.field) && program.field.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                    <div>
                        <div className="font-semibold text-gray-900">
                          {program.field.map((field, index) => (
                            <span key={index}>
                              {typeof field === 'object' && field.labelEn 
                                ? (language === 'fr' ? field.labelFr : field.labelEn)
                                : field
                              }
                              {index < program.field.length - 1 && ', '}
                            </span>
                          ))}
                    </div>
                        <div className="text-sm text-gray-600">{language === 'fr' ? 'Domaine' : 'Field'}</div>
                  </div>
                </div>
                  )}

                  {program?.studyLevel && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    <div>
                        <div className="font-semibold text-gray-900">
                          {getParameterLabel(parameters, 'studyLevels', program.studyLevel, language) || program.studyLevel}
                    </div>
                        <div className="text-sm text-gray-600">{language === 'fr' ? 'Niveau d\'études' : 'Study Level'}</div>
                  </div>
                    </div>
                  )}

                </div>
              </div>


              <div className="lg:w-80">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{language === 'fr' ? 'Prêt à postuler ?' : 'Ready to Apply?'}</h3>
                  <div className="space-y-3 mb-6">
                    {program?.universityType === 'A' ? (
                    <button 
                        onClick={() => setShowApplicationModal(true)}
                        className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-4 h-4">
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                          <path d="M10 9H8"></path>
                          <path d="M16 13H8"></path>
                          <path d="M16 17H8"></path>
                        </svg>
                        {language === 'fr' ? 'CANDIDATER MAINTENANT' : 'APPLY NOW'}
                    </button>
                    ) : (
                      <button className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-4 h-4">
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                          <path d="M10 9H8"></path>
                          <path d="M16 13H8"></path>
                          <path d="M16 17H8"></path>
                        </svg>
                        {language === 'fr' ? 'CANDIDATURE GRATUITE' : 'FREE APPLY'}
                      </button>
                    )}
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-4 h-4">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                      </svg>
                      {language === 'fr' ? 'Contacter un conseiller' : 'Contact Advisor'}
                    </button>
                    {currentUser && (
                      <HeartButton 
                        type="program"
                        id={program.id}
                        isShortlisted={program.isShortlisted}
                        className="w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        showText={true}
                        language={language}
                      />
                    )}
                    <button className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2 w-4 h-4">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                      </svg>
                      {language === 'fr' ? 'Partager' : 'Share'}
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-4 h-4">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                      </svg>
                      <span>{language === 'fr' ? 'Besoin d\'aide ?' : 'Need Help?'}</span>
                    </div>
                    <div className="space-y-2">
                      <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-3 h-3">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        {language === 'fr' ? 'Appeler un conseiller' : 'Call Advisor'}
                      </button>
                      <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-3 h-3">
                          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                        {language === 'fr' ? 'Support par email' : 'Email Support'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Application Periods Section */}
          {program.multiIntakes && program.multiIntakes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                {language === 'fr' ? 'Périodes de candidature' : 'Application Periods'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {program.multiIntakes.map((intake, index) => {
                  const status = getApplicationPeriodStatus(intake);
                  const isOpen = status.status === 'open';
                  const isClosingSoon = status.status === 'closing-soon';
                  
                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                      {/* Intake Name */}
                      <div className="flex items-center justify-between mb-4">
                         <h4 className="text-lg font-semibold text-gray-900">
                           {formatIntakeName(intake.name, language) || `${language === 'fr' ? 'Période' : 'Period'} ${index + 1}`}
                         </h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}>
                          {status.text}
                        </span>
            </div>

                      {/* Dates */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                            <div className="text-sm text-gray-600">
                              {language === 'fr' ? 'Ouverture' : 'Opens'}
                </div>
                            <div className="font-medium text-gray-900">
                              {intake.applicationOpens 
                                ? new Date(intake.applicationOpens).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : (language === 'fr' ? 'Non spécifié' : 'Not specified')
                              }
                            </div>
            </div>
          </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                            <div className="text-sm text-gray-600">
                              {language === 'fr' ? 'Fermeture' : 'Closes'}
                      </div>
                            <div className="font-medium text-gray-900">
                              {intake.applicationCloses 
                                ? new Date(intake.applicationCloses).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : (language === 'fr' ? 'Non spécifié' : 'Not specified')
                              }
                      </div>
                      </div>
                    </div>
                  </div>

                      {/* Apply Button */}
                      <button 
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                          isOpen 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
                            : isClosingSoon
                            ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isOpen && !isClosingSoon}
                        onClick={() => {
                          if (isOpen || isClosingSoon) {
                            setShowApplicationModal(true);
                          }
                        }}
                      >
                        {isOpen ? (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            {language === 'fr' ? 'Postuler maintenant' : 'Apply Now'}
                          </>
                        ) : isClosingSoon ? (
                          <>
                            <Clock className="w-4 h-4" />
                            {language === 'fr' ? 'Postuler rapidement' : 'Apply Quickly'}
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4" />
                            {language === 'fr' ? 'Non disponible' : 'Not Available'}
                          </>
                        )}
                      </button>
                </div>
              );
                })}
          </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-3 h-3 text-blue-600" />
            </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">
                      {language === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}
                    </p>
                    <p>
                      {language === 'fr' 
                        ? 'Contactez nos conseillers pour obtenir de l\'aide avec votre candidature et pour toute question sur les périodes d\'admission.'
                        : 'Contact our advisors for help with your application and any questions about admission periods.'
                      }
                    </p>
              </div>
                    </div>
                </div>
              </div>
          )}


          {/* University Type and Service Pricing */}
            {(() => {
            const typeInfo = getUniversityTypeInfo(program, language);
            if (!typeInfo) return null;
              
              return (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  {language === 'fr' ? 'Type d\'université et frais de service' : 'University Type and Service Fees'}
            </h3>
                
                  <div className="bg-gray-50 rounded-xl p-6">
                  {/* Header avec type et école */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        typeInfo.color === 'green' ? 'bg-green-100' :
                        typeInfo.color === 'blue' ? 'bg-blue-100' :
                        typeInfo.color === 'purple' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        <span className="text-2xl">
                          {typeInfo.color === 'green' ? '💰' :
                           typeInfo.color === 'blue' ? '🏛️' :
                           typeInfo.color === 'purple' ? '📋' : '❓'}
                        </span>
                      </div>
              <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {typeInfo.type}
                </h4>
                        <p className="text-sm text-gray-600">
                          {typeInfo.description}
                        </p>
                      </div>
              </div>

                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      program.type === 'Public' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                       {getTranslatedSchoolType(program.type, parameters, language)}
                        </span>
              </div>

                  {/* Informations de base */}
                  <div className="space-y-3 mb-6">
                    {typeInfo.type === "Type A" && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{language === 'fr' ? 'Candidatures gratuites:' : 'Free applications:'}</span>
                        <span className="font-semibold text-gray-900">{typeInfo.freeApps}</span>
              </div>
                    )}
                    
                    {typeInfo.type !== "Type B" && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{language === 'fr' ? 'Support visa:' : 'Visa support:'}</span>
                        <span className="font-semibold text-gray-900">{typeInfo.visaSupport}</span>
              </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{language === 'fr' ? 'Frais de service:' : 'Service fees:'}</span>
                      <span className="font-semibold text-gray-900">{typeInfo.serviceFees}</span>
                    </div>
              </div>

                  {/* Section spécifique par type */}
                  {typeInfo.originalPrice && (
                    <div className="border-t pt-4">
                      {typeInfo.type === "Type A" && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              {language === 'fr' ? 'Frais de service' : 'Service fees'}
                        </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                              {typeInfo.type}
                      </span>
              </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ServicePriceDisplay 
                                price={typeInfo.originalPrice}
                                currency={typeInfo.currency}
                                className="text-gray-400 line-through text-sm"
                                userCurrency={userCurrency}
                                formatPrice={formatPrice}
                                convertPrice={convertPrice}
                              />
                              <span className="font-semibold text-green-600 text-lg">
                                {language === 'fr' ? 'Gratuit' : 'Free'}
                              </span>
            </div>
                            <span className="text-xs text-gray-500">
                              {language === 'fr' ? '3 candidatures gratuites' : '3 free applications'}
                            </span>
          </div>
          </div>
                      )}

                      {typeInfo.type === "Type B" && (
                        <div className="space-y-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-lg">🏛️</span>
            </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-blue-900 mb-2">
                                  {language === 'fr' ? 'Service d\'accompagnement complet' : 'Complete Support Service'}
                                </h4>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                  {language === 'fr' 
                                    ? 'Pour les établissements de type B, notre équipe s\'occupe de vous inscrire et de suivre votre admission de près jusqu\'à l\'admission finale. Aucune admission n\'est garantie, nous vous aidons dans la préparation de dossier et la validation de vos informations, mais c\'est l\'université qui décidera de votre acceptation !'
                                    : 'For Type B programs, our team handles your registration and follows your admission closely until final admission. No admission is guaranteed, we help you with document preparation and information validation, but it\'s the university that will decide on your acceptance!'
                }
              </p>
                    </div>
            </div>
          </div>

                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700">
                                {language === 'fr' ? 'Frais de service' : 'Service fees'}
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            {typeInfo.type}
                              </span>
              </div>

                            {typeInfo.promotionPrice && typeInfo.originalPrice ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <ServicePriceDisplay 
                                      price={typeInfo.originalPrice}
                                      currency={typeInfo.currency}
                                      className="text-gray-400 line-through text-sm"
                                      userCurrency={userCurrency}
                                      formatPrice={formatPrice}
                                      convertPrice={convertPrice}
                                    />
                                    <ServicePriceDisplay 
                                      price={typeInfo.promotionPrice}
                                      currency={typeInfo.currency}
                                      isPromotion={true}
                                      className="font-semibold text-red-600 text-lg"
                                      userCurrency={userCurrency}
                                      formatPrice={formatPrice}
                                      convertPrice={convertPrice}
                                    />
              </div>
                                  <span className="text-xs text-red-600 font-medium">
                                    {language === 'fr' ? 'Promotion' : 'Promotion'}
                                  </span>
            </div>
                                {typeInfo.promotionDeadline && typeInfo.promotionDeadline.trim() !== '' && (
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-red-600" />
                                      <span className="text-xs text-red-700 font-medium">
                                        {language === 'fr' ? 'Promotion valable jusqu\'au' : 'Promotion valid until'} {new Date(typeInfo.promotionDeadline).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                                      </span>
            </div>
          </div>
                                )}
                    </div>
                            ) : typeInfo.originalPrice ? (
                              <div className="flex items-center justify-between">
                                <ServicePriceDisplay 
                                  price={typeInfo.originalPrice}
                                  currency={typeInfo.currency}
                                  className="font-semibold text-blue-600 text-lg"
                                  userCurrency={userCurrency}
                                  formatPrice={formatPrice}
                                  convertPrice={convertPrice}
                                />
                                <span className="text-xs text-gray-500">
                                  {language === 'fr' ? 'Prix normal' : 'Normal price'}
                                </span>
                  </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-600 text-lg">
                                    {language === 'fr' ? 'Prix sur demande' : 'Price on request'}
                                  </span>
                                  {typeInfo.currency && (
                                    <span className="text-sm text-gray-500">
                                      ({typeInfo.currency})
                                    </span>
                                  )}
                    </div>
                                <span className="text-xs text-gray-500">
                                  {language === 'fr' ? 'Contactez-nous' : 'Contact us'}
                                </span>
                  </div>
                            )}
                </div>
              </div>
                      )}

                      {typeInfo.type === "Type C" && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              {language === 'fr' ? 'Frais de service' : 'Service fees'}
                      </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                              {typeInfo.type}
                            </span>
                </div>

                          {typeInfo.promotionPrice && typeInfo.originalPrice ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ServicePriceDisplay 
                                    price={typeInfo.originalPrice}
                                    currency={typeInfo.currency}
                                    className="text-gray-400 line-through text-sm"
                                    userCurrency={userCurrency}
                                    formatPrice={formatPrice}
                                    convertPrice={convertPrice}
                                  />
                                  <ServicePriceDisplay 
                                    price={typeInfo.promotionPrice}
                                    currency={typeInfo.currency}
                                    isPromotion={true}
                                    className="font-semibold text-red-600 text-lg"
                                    userCurrency={userCurrency}
                                    formatPrice={formatPrice}
                                    convertPrice={convertPrice}
                                  />
                </div>
                                <span className="text-xs text-red-600 font-medium">
                                  {language === 'fr' ? 'Promotion' : 'Promotion'}
                          </span>
              </div>
                              {typeInfo.promotionDeadline && typeInfo.promotionDeadline.trim() !== '' && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-red-600" />
                                    <span className="text-xs text-red-700 font-medium">
                                      {language === 'fr' ? 'Promotion valable jusqu\'au' : 'Promotion valid until'} {new Date(typeInfo.promotionDeadline).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                          </span>
            </div>
                      </div>
                              )}
                    </div>
                          ) : typeInfo.originalPrice ? (
                            <div className="flex items-center justify-between">
                              <ServicePriceDisplay 
                                price={typeInfo.originalPrice}
                                currency={typeInfo.currency}
                                className="font-semibold text-purple-600 text-lg"
                                userCurrency={userCurrency}
                                formatPrice={formatPrice}
                                convertPrice={convertPrice}
                              />
                              <span className="text-xs text-gray-500">
                                {language === 'fr' ? 'Configuration spéciale' : 'Special configuration'}
                              </span>
                </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-purple-600 text-lg">
                                  {language === 'fr' ? 'Prix sur demande' : 'Price on request'}
                                </span>
                                {typeInfo.currency && (
                                  <span className="text-sm text-gray-500">
                                    ({typeInfo.currency})
                                  </span>
                                )}
                      </div>
                              <span className="text-xs text-gray-500">
                                {language === 'fr' ? 'Contactez-nous' : 'Contact us'}
                              </span>
              </div>
            )}
          </div>
                      )}
                  </div>
                  )}
                </div>
              </div>
            );
          })()}


          {/* E-DVISOR Check and Visa Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-blue-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-6 h-6 text-white">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <path d="m9 11 3 3L22 4"></path>
                  </svg>
                </div>
              <div>
                  <h3 className="text-xl font-bold text-gray-900">{language === 'fr' ? 'Vérification E-DVISOR' : 'E-DVISOR Check'}</h3>
                  <p className="text-sm text-gray-600">{language === 'fr' ? 'Évaluation d\'admission alimentée par l\'IA' : 'AI-Powered Admission Assessment'}</p>
                      </div>
              </div>
              <p className="text-gray-700 mb-6">
                {language === 'fr' 
                  ? 'Obtenez un retour instantané sur vos chances d\'admission pour ce programme en utilisant notre système d\'IA avancé. Recevez des recommandations personnalisées et des conseils.'
                  : 'Get instant feedback on your admission chances for this program using our advanced AI system. Receive personalized recommendations and insights.'
                }
              </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-5 h-5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                {language === 'fr' ? 'Vérifier mes chances' : 'Check My Chances'}
              </button>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg p-8 border border-emerald-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target w-6 h-6 text-white">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                      </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{language === 'fr' ? 'Calculateur de Visa' : 'Visa Calculator'}</h3>
                  <p className="text-sm text-gray-600">{language === 'fr' ? 'Exigences et coûts de visa intelligents' : 'Smart Visa Requirements &amp; Costs'}</p>
                    </div>
                </div>
              <p className="text-gray-700 mb-6">
                {language === 'fr' 
                  ? 'Calculez vos exigences de visa, temps de traitement et coûts estimés pour étudier au Canada. Obtenez des conseils personnalisés et des listes de documents.'
                  : 'Calculate your visa requirements, processing times, and estimated costs for studying in Canada. Get personalized guidance and document checklists.'
                }
              </p>
              <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target w-5 h-5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                {language === 'fr' ? 'Calculer le visa' : 'Calculate Visa'}
              </button>
              </div>
          </div>


          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{language === 'fr' ? 'Navigation rapide' : 'Quick Navigation'}</h3>
            <div className="flex flex-wrap gap-3">
              <a href="#overview" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">{language === 'fr' ? 'Aperçu' : 'Overview'}</a>
              <a href="#admission" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">{language === 'fr' ? 'Admission' : 'Admission'}</a>
              <a href="#costs" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">{language === 'fr' ? 'Coûts' : 'Costs'}</a>
              <a href="#photos" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">{language === 'fr' ? 'Photos' : 'Photos'}</a>
              <a href="#videos" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">{language === 'fr' ? 'Vidéos' : 'Videos'}</a>
              <a href="#locations" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">{language === 'fr' ? 'Emplacements' : 'Locations'}</a>
            </div>
          </div>

          {/* Overview Section */}
          <div id="overview" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{language === 'fr' ? 'Aperçu du programme' : 'Course Overview'}</h3>
            <div className="prose prose-lg max-w-none">
              {program?.description ? (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: language === 'fr' ? (program.descriptionFr || program.description) : program.description 
                  }} 
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {language === 'fr' 
                    ? 'Ce programme est conçu pour fournir aux étudiants des connaissances et compétences avancées dans leur domaine d\'étude, avec un accent particulier sur l\'excellence académique et l\'application pratique.'
                    : 'This program is designed to provide students with advanced knowledge and skills in their field of study, with particular emphasis on academic excellence and practical application.'
              }
            </p>
              )}
            </div>
          </div>


          {/* Rankings Section */}
          {program.establishmentRankings && Object.keys(program.establishmentRankings).length > 0 && (
            <div id="rankings" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                {language === 'fr' ? 'Classements internationaux' : 'International Rankings'}
            </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(program.establishmentRankings).map(([rankingType, rankingValue]) => {
                  const rankingInfo = getRankingInfo(rankingType, rankingValue, language);
                  const colorClasses = {
                    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
                    red: 'from-red-50 to-red-100 border-red-200 text-red-800',
                    green: 'from-green-50 to-green-100 border-green-200 text-green-800',
                    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-800',
                    gray: 'from-gray-50 to-gray-100 border-gray-200 text-gray-800'
                  };
              
              return (
                    <div 
                      key={rankingType} 
                      className={`bg-gradient-to-br ${colorClasses[rankingInfo.color]} rounded-lg p-4 border hover:shadow-md transition-shadow cursor-pointer`}
                      onClick={() => window.open(rankingInfo.url, '_blank')}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            rankingInfo.color === 'blue' ? 'bg-blue-100' :
                            rankingInfo.color === 'red' ? 'bg-red-100' :
                            rankingInfo.color === 'green' ? 'bg-green-100' :
                            rankingInfo.color === 'purple' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                            <Award className={`w-4 h-4 ${
                              rankingInfo.color === 'blue' ? 'text-blue-600' :
                              rankingInfo.color === 'red' ? 'text-red-600' :
                              rankingInfo.color === 'green' ? 'text-green-600' :
                              rankingInfo.color === 'purple' ? 'text-purple-600' :
                              'text-gray-600'
                            }`} />
                  </div>
                      <div>
                            <h4 className="font-semibold text-sm">
                              {rankingInfo.name}
                </h4>
                  </div>
                </div>
                        <ExternalLink className="w-4 h-4 opacity-60" />
          </div>

                      <div className="text-center mb-3">
                        <div className="text-2xl font-bold">
                          {rankingValue && rankingValue !== null ? 
                            `#${typeof rankingValue === 'object' ? JSON.stringify(rankingValue) : rankingValue}` : 
                            (language === 'fr' ? 'Non disponible' : 'Not available')
                          }
                      </div>
                        <div className="text-xs opacity-75">
                          {language === 'fr' ? 'Mondial' : 'Global'}
                    </div>
                  </div>
                  
                      <p className="text-xs opacity-80 leading-relaxed">
                        {rankingInfo.description}
                      </p>
                      
                      <div className="mt-3 text-xs opacity-60 text-center">
                        {language === 'fr' ? 'Cliquer pour voir le classement' : 'Click to view ranking'}
                  </div>
                </div>
                  );
                })}
            </div>
          </div>
          )}

          {/* Requirements Section */}
          {renderRequirements(program.structuredRequirements, language)}

          {/* Media & Campus Section */}
          <EstablishmentMedia program={program} language={language} />




          {/* Need Help Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'fr' 
                  ? 'Réservez une session de conseil vidéo avec votre conseiller dédié pour obtenir des réponses à toutes vos questions.'
                  : 'Hop onto a video counselling session with your dedicated counsellor to get all your queries answered.'
                }
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                {language === 'fr' ? 'Réserver une session' : 'Book a session'}
              </button>
            </div>
          </div>
        </div>
              </div>

      {/* Application Confirmation Modal */}
      <ApplicationConfirmationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onConfirm={() => {
          setShowApplicationModal(false);
          navigate(`/apply/${program.id}`);
        }}
        program={program}
        language={language}
      />
    </>
  );
};

export default ProgramDetail;

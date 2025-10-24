import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, Users, BookOpen, Globe, Calendar, 
  Award, Building2, CheckCircle, ExternalLink, Phone, Mail, 
  DollarSign, Home, Trophy, GraduationCap, Clock, Languages,
  Shield, Heart, Share2, Download, Eye, MessageCircle, Target,
  Zap, Image, Play, Map, FileText
} from 'lucide-react';
import SEO from '../components/SEO';
import HeaderAuth from '../components/HeaderAuth';
import { useCurrency } from '../contexts/CurrencyContext';
import HeartButton from '../components/HeartButton';
import { useShortlist } from '../hooks/useShortlist';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import EstablishmentMedia from '../components/EstablishmentMedia';
import parameterService from '../services/parameterService';
import { useAllParameters } from '../hooks/useAllParameters';

// Function to generate program slug for SEO-friendly URLs
const generateProgramSlug = (program) => {
  if (!program) return '';
  
  const establishmentName = program.establishment?.name || program.establishment?.slug || 'university';
  const programName = program.name || program.slug || 'program';
  
  // Create SEO-friendly slugs with proper French character handling
  const establishmentSlug = establishmentName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
    
  const programSlug = programName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `programs/${establishmentSlug}/${programSlug}`;
};

  // Function to get next application period
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

  // Function to get application period status
  const getApplicationPeriodStatus = (intake) => {
    if (!intake.applicationOpens || !intake.applicationCloses) {
      return { status: 'no-dates', color: 'gray', text: language === 'fr' ? 'Aucune date disponible' : 'No dates available' };
    }
    
    const now = new Date();
    const opensDate = new Date(intake.applicationOpens);
    const closesDate = new Date(intake.applicationCloses);
    
    // Check if application is open
    if (now >= opensDate && now <= closesDate) {
      // Check if closing soon (within 30 days)
      const daysUntilClose = Math.ceil((closesDate - now) / (1000 * 60 * 60 * 24));
      if (daysUntilClose <= 30) {
        return { 
          status: 'closing-soon', 
          color: 'red', 
          text: language === 'fr' ? `Se ferme dans ${daysUntilClose} jours` : `Closes in ${daysUntilClose} days` 
        };
      }
      return { status: 'open', color: 'green', text: language === 'fr' ? 'Ouvert' : 'Open' };
    }
    
    // Check if not yet open
    if (now < opensDate) {
      const daysUntilOpen = Math.ceil((opensDate - now) / (1000 * 60 * 60 * 24));
      return { 
        status: 'not-open', 
        color: 'blue', 
        text: language === 'fr' ? `S'ouvre dans ${daysUntilOpen} jours` : `Opens in ${daysUntilOpen} days` 
      };
    }
    
    // Application is closed
    return { status: 'closed', color: 'gray', text: language === 'fr' ? 'Fermé' : 'Closed' };
  };

  // Function to get university type information
  const getUniversityTypeInfo = (establishment, language) => {
    const { universityType, servicePricing } = establishment;
    
    if (universityType === "A") {
      return {
        type: "Type A",
        color: "green",
        description: language === 'fr' ? "3 candidatures gratuites" : "3 free applications",
        freeApps: 3,
        visaSupport: language === 'fr' ? "Gratuit" : "Free",
        serviceFees: language === 'fr' ? "3 candidatures gratuites" : "3 free applications",
        originalPrice: servicePricing?.normalPrice,
        promotionPrice: servicePricing?.promotionPrice,
        promotionDeadline: servicePricing?.promotionDeadline,
        currency: servicePricing?.currency || 'EUR'
      };
    } else if (universityType === "B") {
      return {
        type: "Type B",
        color: "blue",
        description: language === 'fr' ? "Service payant" : "Paid service",
        freeApps: 0,
        visaSupport: language === 'fr' ? "Service payant" : "Paid service",
        serviceFees: language === 'fr' ? "Frais de service requis" : "Service fee required",
        originalPrice: servicePricing?.normalPrice,
        promotionPrice: servicePricing?.promotionPrice,
        promotionDeadline: servicePricing?.promotionDeadline,
        currency: servicePricing?.currency || 'EUR'
      };
    } else if (universityType === "C") {
        return {
          type: "Type C",
          color: "purple",
        description: language === 'fr' ? "Configuration spéciale" : "Special configuration",
          freeApps: 0,
        visaSupport: language === 'fr' ? "Service payant" : "Paid service",
        serviceFees: language === 'fr' ? "Configuration spéciale" : "Special configuration",
        originalPrice: servicePricing?.normalPrice,
        promotionPrice: servicePricing?.promotionPrice,
        promotionDeadline: servicePricing?.promotionDeadline,
        currency: servicePricing?.currency || 'EUR'
      };
    }
    
    // Default fallback
    return {
      type: "Unknown",
      color: "gray",
      description: language === 'fr' ? "Type inconnu" : "Unknown type",
      freeApps: 0,
      visaSupport: language === 'fr' ? "Type inconnu" : "Unknown type",
      serviceFees: language === 'fr' ? "Type inconnu" : "Unknown type",
      originalPrice: null,
      promotionPrice: null,
      promotionDeadline: null,
      currency: 'EUR'
    };
  };

  // Component to display service price with conversion
  const ServicePriceDisplay = ({ price, currency, isPromotion = false, className = "", userCurrency, formatPrice, convertPrice }) => {
    const [displayPrice, setDisplayPrice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Early return if required props are not available
    if (!userCurrency || !formatPrice || !convertPrice) {
      return <span className={`${className} text-gray-500`}>Loading...</span>;
    }

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

  // Function to get scholarship information based on type
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
    merit: {
      fr: {
        title: 'Bourse au Mérite',
        description: 'Bourse basée sur l\'excellence académique, les réalisations personnelles et le potentiel de leadership de l\'étudiant.',
        type: 'Mérite'
      },
      en: {
        title: 'Merit Scholarship',
        description: 'Scholarship based on academic excellence, personal achievements, and student leadership potential.',
        type: 'Merit'
      }
    }
  };

  return scholarshipData[scholarshipType]?.[language] || scholarshipData[scholarshipType]?.en || {
    title: scholarshipType,
    description: 'Scholarship available',
    type: scholarshipType
  };
};


const EstablishmentDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const { userCurrency, formatPrice, convertPrice } = useCurrency();
  const { currentUser } = useAuth();
  
  const [establishment, setEstablishment] = useState(null);
  
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [programsPage, setProgramsPage] = useState(1);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [formattedPrices, setFormattedPrices] = useState({});
  const [parameters, setParameters] = useState({ languages: [], universityTypes: [], schoolTypes: [] });

  useEffect(() => {
    loadEstablishmentDetail();
  }, [slug]);

  // Load all parameters using centralized service
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();

  useEffect(() => {
    if (allParams) {
      setParameters({
        languages: allParams.languages,
        universityTypes: allParams.universityTypes,
        schoolTypes: allParams.schoolTypes
      });
    }
  }, [allParams]);

  // Function to get translated language name
  const getTranslatedLanguage = (languageCode) => {
    const languageParam = parameters.languages.find(lang => lang.code === languageCode);
    if (languageParam) {
      return language === 'fr' ? languageParam.labelFr : languageParam.labelEn;
    }
    return languageCode; // Fallback to code if not found
  };

  // Function to get translated university type
  const getTranslatedUniversityType = (typeCode) => {
    const typeParam = parameters.universityTypes.find(type => type.code === typeCode);
    if (typeParam) {
      return language === 'fr' ? typeParam.labelFr : typeParam.labelEn;
    }
    return typeCode; // Fallback to code if not found
  };

  // Function to get translated school type (private/public)
  const getTranslatedSchoolType = (typeCode) => {
    const typeParam = parameters.schoolTypes.find(type => type.code === typeCode);
    if (typeParam) {
      return language === 'fr' ? typeParam.labelFr : typeParam.labelEn;
    }
    return typeCode; // Fallback to code if not found
  };

  // Function to format application period status
  const getApplicationPeriodStatus = (intake) => {
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
    
    if (now >= opensDate && now <= closesDate) {
      const daysUntilClose = Math.ceil((closesDate - now) / (1000 * 60 * 60 * 24));
      if (daysUntilClose <= 7) {
        return { 
          status: 'closing-soon', 
          color: 'red', 
          text: language === 'fr' ? `Se ferme dans ${daysUntilClose} jour${daysUntilClose > 1 ? 's' : ''}` : `Closes in ${daysUntilClose} day${daysUntilClose > 1 ? 's' : ''}`,
          bgColor: 'bg-red-100',
          textColor: 'text-red-700'
        };
      }
      return { 
        status: 'open', 
        color: 'green', 
        text: language === 'fr' ? 'Ouvert' : 'Open',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700'
      };
    }
    
    if (now < opensDate) {
      const daysUntilOpen = Math.ceil((opensDate - now) / (1000 * 60 * 60 * 24));
      return { 
        status: 'not-open', 
        color: 'blue', 
        text: language === 'fr' ? `S'ouvre dans ${daysUntilOpen} jour${daysUntilOpen > 1 ? 's' : ''}` : `Opens in ${daysUntilOpen} day${daysUntilOpen > 1 ? 's' : ''}`,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700'
      };
    }
    
    return { 
      status: 'closed', 
      color: 'gray', 
      text: language === 'fr' ? 'Fermé' : 'Closed',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600'
    };
  };

  useEffect(() => {
    if (establishment) {
      loadPrograms();
    }
  }, [establishment, programsPage]);

  // Format prices when programs, establishment, or userCurrency changes
  useEffect(() => {
    if (userCurrency && (programs.length > 0 || establishment)) {
      const formatAllPrices = async () => {
        const priceMap = {};
        
        // Format program prices
        for (const program of programs) {
          if (program.tuitionAmount && program.tuitionCurrency) {
            try {
              const formatted = await formatPrice(program.tuitionAmount, program.tuitionCurrency);
              priceMap[program.id] = formatted;
            } catch (error) {
              console.error('Error formatting price for program', program.id, error);
              priceMap[program.id] = `${program.tuitionAmount} ${program.tuitionCurrency}`;
            }
          }
        }
        
        // Format establishment prices
        if (establishment) {
          // Tuition range
          if (establishment.tuitionRange) {
            if (establishment.tuitionRange.min && establishment.tuitionRange.currency) {
              try {
                const formatted = await formatPrice(establishment.tuitionRange.min, establishment.tuitionRange.currency);
                priceMap['tuition_min'] = formatted;
              } catch (error) {
                priceMap['tuition_min'] = `${establishment.tuitionRange.min} ${establishment.tuitionRange.currency}`;
              }
            }
            if (establishment.tuitionRange.max && establishment.tuitionRange.currency) {
              try {
                const formatted = await formatPrice(establishment.tuitionRange.max, establishment.tuitionRange.currency);
                priceMap['tuition_max'] = formatted;
              } catch (error) {
                priceMap['tuition_max'] = `${establishment.tuitionRange.max} ${establishment.tuitionRange.currency}`;
              }
            }
          }
          
          // Application fee
          if (establishment.applicationFee && establishment.applicationFeeCurrency) {
            try {
              const formatted = await formatPrice(establishment.applicationFee, establishment.applicationFeeCurrency);
              priceMap['application_fee'] = formatted;
            } catch (error) {
              priceMap['application_fee'] = `${establishment.applicationFee} ${establishment.applicationFeeCurrency}`;
            }
          }
          
          // Living costs
          if (establishment.livingCosts && establishment.livingCostsCurrency) {
            try {
              const formatted = await formatPrice(establishment.livingCosts, establishment.livingCostsCurrency);
              priceMap['living_costs'] = formatted;
            } catch (error) {
              priceMap['living_costs'] = `${establishment.livingCosts} ${establishment.livingCostsCurrency}`;
            }
          }
        }
        
        setFormattedPrices(priceMap);
      };
      formatAllPrices();
    }
  }, [programs, establishment, userCurrency, formatPrice]);

  const loadEstablishmentDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/establishments/slug/${slug}?lang=${language}`);
      
      if (response.data.success) {
        setEstablishment(response.data.data);
      } else {
        setError('Establishment not found');
      }
    } catch (err) {
      setError('Failed to load establishment details');
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    try {
      setProgramsLoading(true);
      const response = await api.get(`/establishments/${slug}/programs?page=${programsPage}&limit=10&lang=${language}`);
      
      if (response.data.success) {
        setPrograms(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load programs:', err);
    } finally {
      setProgramsLoading(false);
    }
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

  if (error || !establishment) {
    return (
      <div className="min-h-screen bg-gray-50 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Établissement introuvable' : 'Establishment Not Found'}
          </h1>
            <p className="text-gray-600 mb-6">
              {language === 'fr' 
                ? 'L\'établissement que vous recherchez n\'existe pas ou a été supprimé.'
                : 'The establishment you\'re looking for doesn\'t exist or has been removed.'
              }
            </p>
            <Link 
              to="/establishments" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'fr' ? 'Retour aux établissements' : 'Back to Establishments'}
          </Link>
          </div>
        </div>
      </div>
    );
  }

  // SEO Data
  const seoData = {
    title: establishment.seoTitle || `${establishment.name} - ${establishment.country} | E-TAWJIHI Global`,
    description: establishment.seoDescription || `${establishment.description || `Study at ${establishment.name} in ${establishment.city}, ${establishment.country}. ${establishment.programs} programs available. ${establishment.scholarships ? 'Scholarships available.' : ''} Apply now!`}`,
    keywords: establishment.seoKeywords && Array.isArray(establishment.seoKeywords) 
      ? establishment.seoKeywords.join(', ') 
      : `${establishment.name}, ${establishment.country}, ${establishment.city}, university, study abroad, programs, ${establishment.scholarships ? 'scholarships,' : ''} ${getTranslatedSchoolType(establishment.type)}`,
    canonical: `https://e-tawjihi-global.com/establishments/${slug}`,
    ogType: 'website',
    ogImage: establishment.campusPhotos && establishment.campusPhotos.length > 0 
      ? establishment.campusPhotos[0].url 
      : establishment.logo,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": establishment.name,
      "description": establishment.seoDescription || establishment.description,
      "url": `https://e-tawjihi-global.com/establishments/${slug}`,
      "image": establishment.campusPhotos && establishment.campusPhotos.length > 0 
        ? establishment.campusPhotos.map(photo => photo.url)
        : establishment.logo,
      "keywords": establishment.seoKeywords && Array.isArray(establishment.seoKeywords) 
        ? establishment.seoKeywords.join(', ')
        : undefined,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": establishment.country,
        "addressLocality": establishment.city,
        "streetAddress": establishment.address
      },
      "telephone": establishment.phone,
      "email": establishment.email,
      "foundingDate": establishment.founded,
      "numberOfStudents": establishment.students,
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Academic Programs",
        "itemListElement": programs.map(program => ({
          "@type": "Course",
          "name": program.name,
          "description": program.description,
          "provider": {
            "@type": "EducationalOrganization",
            "name": establishment.name
          }
        }))
      }
    }
  };

  return (
    <>
      <SEO {...seoData} />
      <HeaderAuth language={language} setLanguage={setLanguage} />
      
      <div className="min-h-screen bg-gray-50 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              to="/establishments" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'fr' ? 'Retour aux établissements' : 'Back to Establishments'}
            </Link>
          </div>

          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-shrink-0">
                <img 
                  src={establishment.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(establishment.name)}&size=200&background=3B82F6&color=fff`} 
                  alt={`${establishment.name} logo`}
                  className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{establishment.name}</h1>
                    <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                      <Building2 className="w-5 h-5" />
                      <span>{establishment.city}, {establishment.country}</span>
                      <span className="text-gray-400">•</span>
                      <span>{getTranslatedSchoolType(establishment.type)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {currentUser && (
                      <HeartButton 
                        type="establishment"
                        id={establishment.id}
                        isShortlisted={establishment.isShortlisted}
                        className="p-2 rounded-lg transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
                        showText={false}
                        language={language}
                      />
                    )}
                    <button
                      onClick={() => {
                        const shareSection = document.querySelector('#share-section');
                        if (shareSection) {
                          shareSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title={language === 'fr' ? 'Partager' : 'Share'}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                {(() => {
                  const statsCards = [];
                  
                  // Number of students
                  if (establishment.students) {
                    statsCards.push(
                      <div key="students" className="bg-green-50 rounded-lg p-4 text-center">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">{language === 'fr' ? 'Nombre d\'étudiants' : 'Number of students'}</div>
                        <div className="font-semibold text-gray-900">{establishment.students.toLocaleString() + '+'}</div>
                  </div>
                    );
                  }
                  
                  // Languages (dynamic)
                  if (establishment.languages && establishment.languages.length > 0) {
                    statsCards.push(
                      <div key="languages" className="bg-purple-50 rounded-lg p-4 text-center">
                    <Globe className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">{language === 'fr' ? 'Langues' : 'Languages'}</div>
                        <div className="font-semibold text-gray-900">
                          {establishment.languages.map((lang, index) => (
                            <span key={index}>
                              {getTranslatedLanguage(lang)}
                              {index < establishment.languages.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                  </div>
                  </div>
                    );
                  }
                  
                  // Number of programs
                  if (programs && programs.length > 0) {
                    statsCards.push(
                      <div key="programs" className="bg-blue-50 rounded-lg p-4 text-center">
                        <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">{language === 'fr' ? 'Nombre de programmes' : 'Number of programs'}</div>
                        <div className="font-semibold text-gray-900">{programs.length}+</div>
                </div>
                    );
                  }
                  
                  // Degree recognition
                  if (establishment.degreeRecognition) {
                    statsCards.push(
                      <div key="recognition" className="bg-orange-50 rounded-lg p-4 text-center">
                        <Award className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">{language === 'fr' ? 'Reconnaissance du diplôme' : 'Degree recognition'}</div>
                        <div className="font-semibold text-gray-900">{establishment.degreeRecognition}</div>
                      </div>
                    );
                  }
                  
                  // Determine grid classes based on number of cards
                  const getGridClasses = (count) => {
                    if (count === 1) return "grid grid-cols-1 gap-4 mb-6";
                    if (count === 2) return "grid grid-cols-2 gap-4 mb-6";
                    if (count === 3) return "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6";
                    return "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6";
                  };
                  
                  return (
                    <div className={getGridClasses(statsCards.length)}>
                      {statsCards}
                  </div>
                  );
                })()}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => establishment.website && window.open(establishment.website, '_blank')}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {language === 'fr' ? 'Postuler maintenant' : 'Apply Now'}
                  </button>
                  <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {language === 'fr' ? 'Contacter un conseiller' : 'Contact Advisor'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Application Periods Section */}
          {establishment.multiIntakes && establishment.multiIntakes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                {language === 'fr' ? 'Périodes de candidature' : 'Application Periods'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {establishment.multiIntakes.map((intake, index) => {
                  const status = getApplicationPeriodStatus(intake);
                  const isOpen = status.status === 'open';
                  const isClosingSoon = status.status === 'closing-soon';
                  
                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                      {/* Intake Name */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {intake.name || `${language === 'fr' ? 'Période' : 'Period'} ${index + 1}`}
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
                            // Handle application logic here
                            console.log('Applying to intake:', intake);
                            // You can add navigation to application form or external link
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
            const typeInfo = getUniversityTypeInfo(establishment, language);
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
                      establishment.type === 'Public' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {getTranslatedSchoolType(establishment.type)}
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
                                    : 'For Type B establishments, our team handles your registration and follows your admission closely until final admission. No admission is guaranteed, we help you with document preparation and information validation, but it\'s the university that will decide on your acceptance!'
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


          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Navigation rapide' : 'Quick Navigation'}
              </h3>
            <div className="flex flex-wrap gap-3">
              <a href="#overview" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                {language === 'fr' ? 'Aperçu' : 'Overview'}
              </a>
              <a href="#programs" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                {language === 'fr' ? 'Programmes' : 'Programs'}
              </a>
              <a href="#costs" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                {language === 'fr' ? 'Coûts' : 'Costs'}
              </a>
              {establishment.rankings && Object.keys(establishment.rankings).length > 0 && (
                <a href="#rankings" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  {language === 'fr' ? 'Classements' : 'Rankings'}
                </a>
              )}
              {establishment.campusPhotos && establishment.campusPhotos.length > 0 && (
                <a href="#photos" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  {language === 'fr' ? 'Photos' : 'Photos'}
                </a>
              )}
              {establishment.brochures && establishment.brochures.length > 0 && (
                <a href="#brochures" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  {language === 'fr' ? 'Brochures' : 'Brochures'}
                </a>
                        )}
            </div>
          </div>

          {/* Quick Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-blue-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">E-DVISOR Check</h3>
                  <p className="text-sm text-gray-600">
                    {language === 'fr' ? 'Évaluation d\'admission alimentée par l\'IA' : 'AI-Powered Admission Assessment'}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                {language === 'fr' 
                  ? 'Obtenez un retour instantané sur vos chances d\'admission pour cette université en utilisant notre système d\'IA avancé. Recevez des recommandations personnalisées et des insights.'
                  : 'Get instant feedback on your admission chances for this university using our advanced AI system. Receive personalized recommendations and insights.'
                }
              </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {language === 'fr' ? 'Vérifier mes chances' : 'Check My Chances'}
              </button>
                    </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg p-8 border border-emerald-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'fr' ? 'Calculateur de visa' : 'Visa Calculator'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'fr' ? 'Exigences et coûts de visa intelligents' : 'Smart Visa Requirements & Costs'}
                  </p>
              </div>
                    </div>
              <p className="text-gray-700 mb-6">
                {language === 'fr' 
                  ? `Calculez vos exigences de visa, temps de traitement et coûts estimés pour étudier en ${establishment.country}. Obtenez des conseils personnalisés et des listes de documents.`
                  : `Calculate your visa requirements, processing times, and estimated costs for studying in ${establishment.country}. Get personalized guidance and document checklists.`
                        }
                      </p>
              <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                {language === 'fr' ? 'Calculer le visa' : 'Calculate Visa'}
              </button>
                </div>
              </div>

          {/* Overview Section */}
          <div id="overview" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'fr' ? 'Aperçu de l\'université' : 'University Overview'}
            </h3>
            <div 
              className="text-gray-600 leading-relaxed prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{
                __html: (language === 'fr' ? establishment.descriptionFr : establishment.descriptionEn) || 
                  (language === 'fr' 
                    ? `<p>${establishment.name} est une ${getTranslatedSchoolType(establishment.type)} prestigieuse située à ${establishment.city}, ${establishment.country}. Avec une riche histoire et un engagement envers l'excellence académique, nous offrons une éducation de classe mondiale et des opportunités de recherche aux étudiants du monde entier.</p>`
                    : `<p>${establishment.name} is a prestigious ${getTranslatedSchoolType(establishment.type)} located in ${establishment.city}, ${establishment.country}. With a rich history and commitment to academic excellence, we provide world-class education and research opportunities to students from around the globe.</p>`
                  )
              }}
            />
              </div>


          {/* Rankings Section */}
          {establishment.rankings && Object.keys(establishment.rankings).length > 0 && (
            <div id="rankings" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                {language === 'fr' ? 'Classements internationaux' : 'International Rankings'}
            </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(establishment.rankings).map(([rankingType, rankingValue]) => {
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

          {/* Costs Section */}
          <div id="costs" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'fr' ? 'Coûts' : 'Costs'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Tuition Fees */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {language === 'fr' ? 'Frais de scolarité' : 'Tuition Fees'}
                  </h4>
                  <div className="space-y-2">
                    {establishment.tuitionRange && establishment.tuitionRange.min && establishment.tuitionRange.max ? (
                      <>
                    <div className="flex justify-between">
                          <span className="text-gray-600">
                            {language === 'fr' ? 'Min' : 'Min'}
                          </span>
                          <span className="font-semibold text-blue-600">
                            {typeof formattedPrices['tuition_min'] === 'object' ? JSON.stringify(formattedPrices['tuition_min']) : (formattedPrices['tuition_min'] || `${establishment.tuitionRange.min} ${establishment.tuitionRange.currency}`)}/year
                        </span>
                    </div>
                    <div className="flex justify-between">
                          <span className="text-gray-600">
                            {language === 'fr' ? 'Max' : 'Max'}
                          </span>
                          <span className="font-semibold text-blue-600">
                            {typeof formattedPrices['tuition_max'] === 'object' ? JSON.stringify(formattedPrices['tuition_max']) : (formattedPrices['tuition_max'] || `${establishment.tuitionRange.max} ${establishment.tuitionRange.currency}`)}/year
                          </span>
                    </div>
                      </>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        {language === 'fr' ? 'Informations de scolarité non disponibles' : 'Tuition information not available'}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Application Fee */}
                {establishment.applicationFee && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                      {language === 'fr' ? 'Frais de candidature' : 'Application Fee'}
                  </h4>
                    <div className="text-lg font-semibold text-gray-600">
                      {typeof formattedPrices['application_fee'] === 'object' ? JSON.stringify(formattedPrices['application_fee']) : (formattedPrices['application_fee'] || `${establishment.applicationFee} ${establishment.applicationFeeCurrency}`)}
                </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Living Costs */}
                {establishment.livingCosts && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">
                      {language === 'fr' ? 'Coûts de vie' : 'Living Costs'}
                  </h4>
                    <div className="text-lg font-semibold text-green-600">
                      {typeof formattedPrices['living_costs'] === 'object' ? JSON.stringify(formattedPrices['living_costs']) : (formattedPrices['living_costs'] || `${establishment.livingCosts} ${establishment.livingCostsCurrency}`)}/year
                </div>
                </div>
                )}
              </div>
            </div>
            
            {/* Available Scholarships */}
            {establishment.scholarships && (
              <div className="mt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  {language === 'fr' ? 'Bourses disponibles' : 'Available Scholarships'}
                </h4>
                {establishment.scholarshipTypes && establishment.scholarshipTypes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {establishment.scholarshipTypes.map((scholarshipType, index) => {
                      const scholarshipInfo = getScholarshipInfo(scholarshipType, language);
                      return (
                        <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 text-lg">💰</span>
                            </div>
                            <h5 className="font-semibold text-gray-900">
                              {scholarshipInfo.title}
                            </h5>
                          </div>
                          <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                            {scholarshipInfo.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-600">
                              <strong>
                                {language === 'fr' ? 'Type:' : 'Type:'} {scholarshipInfo.type}
                              </strong>
                            </div>
                            <div className="text-xs text-yellow-600 font-medium">
                              {language === 'fr' ? 'Disponible' : 'Available'}
                            </div>
                  </div>
                </div>
              );
                    })}
                  </div>
                ) : (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <p className="text-gray-700">
                      {establishment.scholarshipDescription || 
                        (language === 'fr' 
                          ? 'Bourses d\'excellence disponibles pour les étudiants internationaux. Contactez-nous pour plus d\'informations.'
                          : 'Excellence scholarships available for international students. Contact us for more information.'
                        )
                      }
                    </p>
                </div>
                )}
              </div>
            )}
          </div>


          {/* Programs Section */}
          <div id="programs" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {language === 'fr' ? 'Programmes offerts' : 'Programs Offered'}
              </h3>
              {programs && programs.length > 0 && (
                <Link 
                  to={`/establishments?university=${encodeURIComponent(establishment.name)}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {language === 'fr' ? 'Voir tous les programmes' : 'View All Programs'}
                </Link>
              )}
            </div>
            {programs && programs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.slice(0, 3).map((program) => (
                <div key={program.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                  {/* Enhanced Logo Section */}
                  <div className="relative h-32 sm:h-36 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="logo-container">
                      <img
                        src={establishment.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(establishment.name)}&size=200&background=3B82F6&color=fff`}
                        alt={program.name}
                        className="logo-image group-hover:scale-105 transition-all duration-300"
                      />
                  </div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {program.featured && (
                        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {language === 'fr' ? 'En vedette' : 'Featured'}
                </div>
                      )}
                      <div className="px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 bg-green-100 text-green-800">
                        <span className="text-xs">💰</span>
                        {language === 'fr' ? 'Type' : 'Type'} {establishment.universityType || 'A'}
            </div>
          </div>

                    {/* World Ranking */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-xs font-bold text-gray-800">#{establishment.ranking || '18'}</span>
                  </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="p-4 sm:p-5">
                    {/* Header */}
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {program.name}
                      </h4>
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <Building2 className="w-4 h-4 mr-1 text-blue-500" />
                        {establishment.name}
                </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {establishment.city}, {establishment.country}
            </div>
          </div>

                    {/* Key Information */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'fr' ? 'Diplôme' : 'Degree'}</div>
                        <div className="text-sm font-semibold text-gray-800">{program.degree}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'fr' ? 'Durée' : 'Duration'}</div>
                        <div className="text-sm font-semibold text-gray-800">{program.duration}</div>
                      </div>
                    </div>
                  
                    {/* Tuition */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="text-xs text-gray-500 mb-1">{language === 'fr' ? 'Frais de scolarité' : 'Tuition'}</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {typeof formattedPrices[program.id] === 'object' ? JSON.stringify(formattedPrices[program.id]) : (formattedPrices[program.id] || `${program.tuitionAmount} ${program.tuitionCurrency}`)}
                    </div>
                  </div>
                  
                    {/* Action Buttons */}
                      <div className="flex gap-2">
                      <Link 
                        to={`/${generateProgramSlug(program)}`}
                        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-xl text-sm font-semibold text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                          <Eye className="w-4 h-4" />
                        {language === 'fr' ? 'Voir le programme' : 'View Program'}
                      </Link>
            </div>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    {language === 'fr' ? 'Aucun programme disponible' : 'No programs available'}
                  </h4>
                  <p className="text-gray-500 mb-4">
                    {language === 'fr' 
                      ? 'Aucun programme n\'est affiché pour le moment. Revenez plus tard pour découvrir nos programmes.'
                      : 'No programs are currently displayed. Check back later to discover our programs.'
                    }
                  </p>
                  <div className="text-sm text-gray-400">
                    {language === 'fr' 
                      ? 'Les programmes seront bientôt disponibles'
                      : 'Programs will be available soon'
                    }
        </div>
                </div>
              </div>
            )}
      </div>


          {/* Media & Campus Section */}
          <EstablishmentMedia establishment={establishment} language={language} />






            </div>
          </div>
    </>
  );
};

export default EstablishmentDetail;
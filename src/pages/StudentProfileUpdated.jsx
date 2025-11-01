import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  User, Edit3, Save, X, MapPin, Calendar, Phone, Mail, 
  GraduationCap, Award, Globe, Heart, FileText, Settings,
  CheckCircle, AlertCircle, Star,
  Building2, BookOpen, Target, MessageCircle, Bell, Plus,
  ShoppingBag, CreditCard, MessageSquare, HelpCircle, Lightbulb, Users,
  DollarSign, Trash2, Eye, Download, Languages, ClipboardCheck, ExternalLink,
  Briefcase, Lock, Flag, Search, Bot, Clock, Zap, Home, Mic, PenTool
} from 'lucide-react';
import SEO from '../components/SEO';
import HeaderAuth from '../components/HeaderAuth';
import OnboardingChecklist from '../components/OnboardingChecklist';
import QualificationsTabs from '../components/profile/QualificationsTabs';
import PreferencesSection from '../components/profile/PreferencesSection';
import ProfileBreadcrumbs from '../components/profile/ProfileBreadcrumbs';
import DocumentModal from '../components/profile/DocumentModal';
import ApplicationModal from '../components/profile/ApplicationModal';
import ShortlistModal from '../components/profile/ShortlistModal';
import ApplicationDocumentsSection from '../components/profile/ApplicationDocumentsSection';
import DocumentUploadModal from '../components/profile/DocumentUploadModal';
import ServicesSection from '../components/profile/ServicesSection';
import MyTranslationsSection from '../components/profile/MyTranslationsSection';
import TranslationModal from '../components/profile/TranslationModal';
import TestVouchersSection from '../components/profile/TestVouchersSection';
import MyComplaintsSection from '../components/profile/MyComplaintsSection';
import FAQSection from '../components/profile/FAQSection';
import SuggestionsSection from '../components/profile/SuggestionsSection';
import BecomeAmbassadorSection from '../components/profile/BecomeAmbassadorSection';
import SecuritySection from '../components/profile/SecuritySection';
import SelectSearchable from '../components/ui/SelectSearchable';
import MultiSelect from '../components/ui/MultiSelect';
import SingleSelect from '../components/ui/SingleSelect';
import PhoneInput from '../components/ui/PhoneInput';
import { useAllParameters } from '../hooks/useAllParameters';
import applicationService from '../services/applicationService';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../services/profileService';
import finalStepService from '../services/finalStepService';
import HeartButton from '../components/HeartButton';
import { useCurrency } from '../contexts/CurrencyContext';

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

// Function to analyze program requirements and determine required types
const analyzeProgramRequirements = (program) => {
  const requirements = {
    hasEnglishTest: false,
    hasStandardizedTest: false,
    hasInterview: false,
    hasWrittenTest: false
  };

  // Check if program has structured requirements
  if (program.structuredRequirements) {
    const structured = program.structuredRequirements;
    
    // Check English tests
    if (structured.english && structured.english.items && structured.english.items.length > 0) {
      const hasRequiredEnglish = structured.english.items.some(item => item.required === true);
      if (hasRequiredEnglish) requirements.hasEnglishTest = true;
    }
    
    // Check Standardized tests
    if (structured.standardizedTests && structured.standardizedTests.items && structured.standardizedTests.items.length > 0) {
      const hasRequiredStandardized = structured.standardizedTests.items.some(item => item.required === true);
      if (hasRequiredStandardized) requirements.hasStandardizedTest = true;
    }
    
    // Check Academic requirements for interviews and written tests
    if (structured.academic && structured.academic.items && structured.academic.items.length > 0) {
      const academicItems = structured.academic.items;
      const hasInterview = academicItems.some(item => 
        item.required === true && 
        (item.name?.en?.toLowerCase().includes('interview') || 
         item.name?.fr?.toLowerCase().includes('entretien') ||
         item.description?.en?.toLowerCase().includes('interview') ||
         item.description?.fr?.toLowerCase().includes('entretien'))
      );
      const hasWrittenTest = academicItems.some(item => 
        item.required === true && 
        (item.name?.en?.toLowerCase().includes('written') || 
         item.name?.fr?.toLowerCase().includes('écrit') ||
         item.description?.en?.toLowerCase().includes('written') ||
         item.description?.fr?.toLowerCase().includes('écrit'))
      );
      
      if (hasInterview) requirements.hasInterview = true;
      if (hasWrittenTest) requirements.hasWrittenTest = true;
    }
  }
  
  // Check program-specific exam fields
  if (program.oralExam) requirements.hasInterview = true;
  if (program.writtenExam) requirements.hasWrittenTest = true;
  
  return requirements;
};

// Month mapping for localization
const monthMapping = {
  en: {
    'January': 'January', 'February': 'February', 'March': 'March', 'April': 'April',
    'May': 'May', 'June': 'June', 'July': 'July', 'August': 'August',
    'September': 'September', 'October': 'October', 'November': 'November', 'December': 'December'
  },
  fr: {
    'January': 'Janvier', 'February': 'Février', 'March': 'Mars', 'April': 'Avril',
    'May': 'Mai', 'June': 'Juin', 'July': 'Juillet', 'August': 'Août',
    'September': 'Septembre', 'October': 'Octobre', 'November': 'Novembre', 'December': 'Décembre'
  }
};

// Function to localize month names in intake names
const localizeIntakeName = (intakeName, language) => {
  if (!intakeName) return intakeName;
  
  const months = monthMapping[language] || monthMapping.en;
  let localizedName = intakeName;
  
  // Handle formats like "february-2026" or "February 2026"
  Object.keys(monthMapping.en).forEach(englishMonth => {
    const localizedMonth = months[englishMonth];
    const englishMonthLower = englishMonth.toLowerCase();
    
    // Replace exact month names (case insensitive)
    const regex = new RegExp(`\\b${englishMonth}\\b`, 'gi');
    localizedName = localizedName.replace(regex, localizedMonth);
    
    // Handle hyphenated format like "february-2026"
    const hyphenRegex = new RegExp(`\\b${englishMonthLower}-(\\d{4})\\b`, 'gi');
    localizedName = localizedName.replace(hyphenRegex, (match, year) => {
      return `${localizedMonth} ${year}`;
    });
  });
  
  return localizedName;
};

const StudentProfileUpdated = () => {
  const { section, subsection } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, currentUser } = useAuth();
  const { userCurrency, formatPrice, convertPrice } = useCurrency();
  const [language, setLanguage] = useState(() => {
    // Initialize language from user preference or browser language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) return savedLanguage;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'fr' ? 'fr' : 'en';
  });
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();
  const [activeSection, setActiveSection] = useState('onboarding');
  const [activeSubsection, setActiveSubsection] = useState('academic');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile data
  const [profile, setProfile] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [shortlist, setShortlist] = useState({ programs: [], establishments: [] });
  const [activeShortlistTab, setActiveShortlistTab] = useState('programs');
  const [applicationsData, setApplicationsData] = useState({}); // Store validation data and final steps for each application

  // Modal states
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  
  // Translation data
  const [translations, setTranslations] = useState([
    // Example translations for testing
    {
      id: 'trans_1',
      userId: 'current_user',
      originalDocument: new File([''], 'diploma.pdf', { type: 'application/pdf' }),
      originalFilename: 'diploma.pdf',
      originalLanguage: 'en',
      targetLanguage: 'fr',
      documentType: 'diploma',
      numberOfPages: 2,
      pricePerPage: 70,
      totalPrice: 140,
      currency: 'MAD',
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      notes: 'Urgent translation needed',
      deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
    },
    {
      id: 'trans_2',
      userId: 'current_user',
      originalDocument: new File([''], 'transcript.pdf', { type: 'application/pdf' }),
      originalFilename: 'transcript.pdf',
      originalLanguage: 'ar',
      targetLanguage: 'en',
      documentType: 'transcript',
      numberOfPages: 5,
      pricePerPage: 60,
      totalPrice: 300,
      currency: 'MAD',
      status: 'in_progress',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      notes: 'Academic transcript translation',
      deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
    }
  ]);

  // Translation refresh trigger
  const [translationRefreshTrigger, setTranslationRefreshTrigger] = useState(0);

  // Handle new translation request
  const handleNewTranslation = (translationRequest) => {
    // Trigger refresh of translations
    setTranslationRefreshTrigger(prev => prev + 1);
    setShowTranslationModal(false);
  };

  // Form data
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    // Birth Information
    countryOfBirth: '',
    cityOfBirth: '',
    nationality: [],
    // Contact Information
    phone: '',
    whatsapp: '',
    phoneCountry: '',
    whatsappCountry: '',
    alternateEmail: '',
    // Address Information
    address: '',
    city: '',
    country: '',
    postalCode: '',
    // Official Documents
    passportNumber: '',
    passportAvailable: false,
    passportExpirationDate: '',
    cinNumber: '',
    // Additional Information
    religion: '',
    nativeLanguage: '',
    chineseName: '',
    // Communication
    wechatId: '',
    skypeNo: '',
    // China-specific fields
    chinaFamilyMembers: {
      father: {
        name: '',
        dateOfBirth: '',
        occupation: '',
        phone: ''
      },
      mother: {
        name: '',
        dateOfBirth: '',
        occupation: '',
        phone: ''
      }
    },
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactGender: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    emergencyContactAddress: '',
    // Work Experience
    hasWorkExperience: false,
    workCompany: '',
    workPosition: '',
    workStartDate: '',
    workEndDate: '',
    workDescription: '',
    // Preferences (keep existing)
    studyLevel: '',
    fieldOfStudy: '',
    preferredCountry: '',
    startDate: '',
    preferredCurrency: 'USD',
    annualBudget: '',
    scholarshipRequired: false,
    languagePreferences: []
  });

  // Modal states
  const [documentModal, setDocumentModal] = useState({ isOpen: false, document: null });
  const [applicationModal, setApplicationModal] = useState({ isOpen: false, application: null });
  const [documentUploadModal, setDocumentUploadModal] = useState({ 
    isOpen: false, 
    categoryId: '', 
    typeId: '' 
  });

  // Handle URL parameters
  useEffect(() => {
    if (section) {
      setActiveSection(section);
    }
    if (subsection) {
      setActiveSubsection(subsection);
    }
  }, [section, subsection]);

  // Initialize language from user preference
  useEffect(() => {
    if (currentUser?.preferredLanguage) {
      setLanguage(currentUser.preferredLanguage);
      localStorage.setItem('language', currentUser.preferredLanguage);
    }
  }, [currentUser?.preferredLanguage]);

  // Sync language to localStorage when it changes
  useEffect(() => {
    if (language) {
      localStorage.setItem('language', language);
    }
  }, [language]);

  // Load profile data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadProfileData();
  }, [isAuthenticated, navigate]);

  // Parameters state for localization
  const [parameters, setParameters] = useState({
    countries: [],
    cities: [],
    languages: [],
    schoolTypes: [],
    degrees: []
  });

  // Load parameters
  useEffect(() => {
    if (allParams && !paramsLoading) {
      setParameters({
        countries: allParams.countries || [],
        cities: allParams.cities || [],
        languages: allParams.languages || [],
        schoolTypes: allParams.schoolTypes || [],
        degrees: allParams.degrees || []
      });
    }
  }, [allParams, paramsLoading]);

  // Utility functions for parameter-based localization
  const getParameterLabel = (category, code, language = 'en') => {
    const params = parameters[category] || [];
    const param = params.find(p => p.code === code);
    if (!param) return code;
    return language === 'fr' ? param.labelFr : param.labelEn;
  };

  const getCountryLabel = (countryCode) => {
    return getParameterLabel('countries', countryCode, language);
  };

  const getCityLabel = (cityCode) => {
    return getParameterLabel('cities', cityCode, language);
  };

  const getLanguageLabel = (languageCode) => {
    return getParameterLabel('languages', languageCode, language);
  };

  const getDegreeLabel = (degreeCode) => {
    return getParameterLabel('degrees', degreeCode, language);
  };

  const getSchoolTypeLabel = (typeCode) => {
    return getParameterLabel('schoolTypes', typeCode, language);
  };

  // Map countries from parameters
  const getCountryOptions = () => {
    if (!allParams?.countries) return [];
    return allParams.countries.map(country => ({
      value: country.code,
      label: language === 'fr' ? (country.labelFr || country.labelEn) : country.labelEn,
      flag: getLanguageFlag(country.code),
      phoneCode: country.meta?.phoneCode || '+1' // Default phone code
    }));
  };

  // Get language flag for country
  const getLanguageFlag = (countryCode) => {
    const flagMap = {
      'US': '🇺🇸', 'FR': '🇫🇷', 'CA': '🇨🇦', 'GB': '🇬🇧', 'DE': '🇩🇪',
      'ES': '🇪🇸', 'IT': '🇮🇹', 'PT': '🇵🇹', 'MA': '🇲🇦', 'DZ': '🇩🇿',
      'TN': '🇹🇳', 'EG': '🇪🇬', 'AU': '🇦🇺', 'JP': '🇯🇵', 'KR': '🇰🇷',
      'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷', 'MX': '🇲🇽', 'AR': '🇦🇷'
    };
    return flagMap[countryCode] || '🌐';
  };

  // Function to parse price string and extract amount and currency
  const parsePriceString = (priceString) => {
    if (!priceString) return { amount: 0, currency: 'USD' };
    
    // Remove commas and extract currency symbol and amount
    const cleanString = priceString.replace(/,/g, '');
    const currencyMatch = cleanString.match(/^([^\d]+)/);
    const amountMatch = cleanString.match(/([\d.]+)/);
    
    if (!amountMatch) return { amount: 0, currency: 'USD' };
    
    const amount = parseFloat(amountMatch[1]);
    let currency = 'USD';
    
    if (currencyMatch) {
      const symbol = currencyMatch[1].trim();
      // Map common currency symbols to codes
      const symbolMap = {
        '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY', 'MAD': 'MAD', 'EUR': 'EUR', 'USD': 'USD'
      };
      currency = symbolMap[symbol] || 'USD';
    }
    
    return { amount, currency };
  };

  // Component to display converted price
  const PriceDisplay = ({ amount, currency, className = "" }) => {
    const safeAmount = amount ?? 0;
    const [displayPrice, setDisplayPrice] = useState(`${currency} ${safeAmount.toLocaleString()}`);
    
    useEffect(() => {
      const updatePrice = async () => {
        try {
          const converted = await formatPrice(safeAmount, currency, false);
          setDisplayPrice(converted);
        } catch (error) {
          console.error('Error converting price:', error);
          setDisplayPrice(`${currency} ${safeAmount.toLocaleString()}`);
        }
      };
      updatePrice();
    }, [safeAmount, currency, userCurrency]);
    
    return <span className={className}>{displayPrice}</span>;
  };

  // Component to display converted price from string
  const PriceDisplayFromString = ({ priceString, className = "" }) => {
    const [displayPrice, setDisplayPrice] = useState(priceString);
    
    useEffect(() => {
      const updatePrice = async () => {
        try {
          const { amount, currency } = parsePriceString(priceString);
          const converted = await formatPrice(amount, currency, false);
          setDisplayPrice(converted);
        } catch (error) {
          console.error('Error converting price:', error);
          setDisplayPrice(priceString);
        }
      };
      updatePrice();
    }, [priceString, userCurrency]);
    
    return <span className={className}>{displayPrice}</span>;
  };

  // University type utility functions
  const getUniversityTypeInfo = (establishment) => {
    const { universityType, servicePricing } = establishment;
    
    if (universityType === "A") {
      return {
        type: "Type A",
        color: "green",
        freeApps: 3,
        originalPrice: servicePricing?.normalPrice,
        promotionPrice: servicePricing?.promotionPrice,
        promotionDeadline: servicePricing?.promotionDeadline,
        currency: servicePricing?.currency || 'EUR'
      };
    } else if (universityType === "B") {
      return {
        type: "Type B",
        color: "blue",
        freeApps: 0,
        originalPrice: servicePricing?.normalPrice,
        promotionPrice: servicePricing?.promotionPrice,
        promotionDeadline: servicePricing?.promotionDeadline,
        currency: servicePricing?.currency || 'EUR'
      };
    } else if (universityType === "C") {
      return {
        type: "Type C",
        color: "purple",
        freeApps: 0,
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
      freeApps: 0
    };
  };

  const getServiceFee = (establishment) => {
    const { universityType, countrySpecific } = establishment;
    
    if (universityType === "A") {
      return { 
        amount: language === 'fr' ? "Gratuit" : "Free", 
        originalAmount: "$50",
        description: language === 'fr' ? "3 premières candidatures gratuites" : "First 3 applications free",
        showStrikethrough: true
      };
    } else if (universityType === "B") {
      return { 
        amount: "$100", 
        description: language === 'fr' ? "Frais de service par candidature" : "Service fee per application",
        showStrikethrough: false
      };
    } else if (universityType === "C") {
      const countryType = countrySpecific?.type;
      if (countryType === "france") {
        return { 
          amount: "€150", 
          description: language === 'fr' ? "Gestion des procédures Campus France" : "Campus France procedure management",
          showStrikethrough: false
        };
      } else if (countryType === "china") {
        return { 
          amount: "¥800", 
          description: language === 'fr' ? "Gestion des procédures chinoises" : "Chinese procedure management",
          showStrikethrough: false
        };
      } else {
        return { 
          amount: "$150", 
          description: language === 'fr' ? "Gestion des procédures spéciales" : "Special procedure management",
          showStrikethrough: false
        };
      }
    }
    
    // Default fallback
    return {
      amount: language === 'fr' ? "Inconnu" : "Unknown",
      description: language === 'fr' ? "Frais de service inconnus" : "Unknown service fee",
      showStrikethrough: false
    };
  };

  // Function to get the next application period from multi-intakes
  const getNextApplicationPeriod = (multiIntakes) => {
    if (!multiIntakes || multiIntakes.length === 0) return null;
    
    const now = new Date();
    
    // Find the next upcoming intake (not yet closed)
    const nextIntake = multiIntakes.find(intake => {
      if (!intake.applicationCloses) return false;
      const closesDate = new Date(intake.applicationCloses);
      return now <= closesDate; // Not yet closed
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

  // Function to format price with currency and conversion
  const formatServicePrice = async (price, currency, isPromotion = false) => {
    if (!price) return null;
    
    try {
      // If currency is the same as user currency, no conversion needed
      if (currency === userCurrency) {
        const formatted = await formatPrice(price, currency, false);
        return formatted;
      }
      
      // Convert to user currency
      const converted = await convertPrice(price, currency, userCurrency);
      // Extract the formatted string from the conversion result and format it properly
      if (converted.convertedAmount) {
        return await formatPrice(converted.convertedAmount, userCurrency, false);
      } else {
        return await formatPrice(price, currency, false);
      }
    } catch (error) {
      console.error('Error formatting service price:', error);
      // Fallback to original price with original currency
      return await formatPrice(price, currency, false);
    }
  };

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
          const formatted = await formatServicePrice(price, currency, isPromotion);
          setDisplayPrice(formatted);
        } catch (error) {
          console.error('Error loading service price:', error);
          setDisplayPrice(`${currency} ${price}`);
        } finally {
          setIsLoading(false);
        }
      };

      loadPrice();
    }, [price, currency, isPromotion]);

    if (isLoading) {
      return <span className={`${className} animate-pulse`}>...</span>;
    }

    if (!displayPrice) {
      return null;
    }

    return <span className={className}>{displayPrice}</span>;
  };

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, qualificationsData, shortlistData, applicationsData] = await Promise.all([
        profileService.getProfile(),
        profileService.getQualifications(),
        profileService.getShortlist(),
        applicationService.getApplications()
      ]);

      setProfile(profileData);
      setQualifications(qualificationsData);
      setDocuments([]); // Documents are now managed through Application Process
      console.log('Raw applications data from API:', applicationsData);
      console.log('Profile data loaded:', profileData);
      console.log('User data from context:', user);
      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      setShortlist(shortlistData);

      // Load validation data per application and final steps for each submitted application
      const applicationsDataMap = {};
      
      // Validate step 3 once (documents are shared across all applications)
      let step3ValidationGlobal = false;
      try {
        const step3Validation = await profileService.validateStep3().catch(() => ({ isValid: false }));
        step3ValidationGlobal = step3Validation.isValid || false;
      } catch (error) {
        console.error('Error validating step 3:', error);
      }
      
      // Load final steps and calculate progress for each application individually
      const applicationsList = Array.isArray(applicationsData) ? applicationsData : [];
      for (const app of applicationsList) {
        let finalSteps = [];
        
        // Load final steps only if application is submitted
        if (app.status === 'submitted' || app.submittedAt) {
          try {
            finalSteps = await finalStepService.getFinalSteps(language);
          } catch (error) {
            console.error(`Error loading final steps for application ${app.id}:`, error);
          }
        }

        // Calculate validation status for each application based on its own data
        // Use submittedData if application is submitted, otherwise use applicationData
        const appDataToUse = (app.status === 'submitted' || app.submittedAt) && app.submittedData 
          ? app.submittedData 
          : app.applicationData;
        
        // Step 1: Check personal info in application data
        let step1Validated = false;
        if (appDataToUse?.personalInfo) {
          const personalInfo = appDataToUse.personalInfo;
          step1Validated = !!(
            personalInfo.firstName &&
            personalInfo.lastName &&
            personalInfo.dateOfBirth &&
            personalInfo.countryOfBirth &&
            personalInfo.cityOfBirth &&
            personalInfo.nationality &&
            personalInfo.nationality.length > 0 &&
            personalInfo.gender &&
            personalInfo.maritalStatus &&
            personalInfo.email &&
            personalInfo.phone &&
            personalInfo.address &&
            personalInfo.city &&
            personalInfo.country &&
            personalInfo.postalCode &&
            personalInfo.passportNumber
          );
        }

        // Step 2: Check if qualifications exist (shared across all applications)
        const step2Validated = qualificationsData.length > 0 && 
          qualificationsData.some(q => q.type === 'language' && q.title?.toLowerCase().includes('tcf')) &&
          qualificationsData.some(q => q.type === 'academic' && q.title?.toLowerCase().includes('baccalauréat'));

        // Step 4: Check preferences in application data
        let step4Validated = false;
        if (appDataToUse?.preferences) {
          const preferences = appDataToUse.preferences;
          const hasIntake = preferences.intake && preferences.intake.trim() !== '';
          const hasAdditionalInfo = preferences.additionalInfo && preferences.additionalInfo.trim() !== '';
          step4Validated = hasIntake || hasAdditionalInfo;
        }

        // Step 5: Check if application is submitted
        const step5Validated = app.status === 'submitted' || !!app.submittedAt;

        // Debug: Log validation for this application
        console.log(`Application ${app.id} validation:`, {
          step1Validated,
          step2Validated,
          step3Validated: step3ValidationGlobal,
          step4Validated,
          step5Validated,
          preferences: appDataToUse?.preferences,
          personalInfo: appDataToUse?.personalInfo ? 'exists' : 'missing',
          usingSubmittedData: (app.status === 'submitted' || app.submittedAt) && app.submittedData ? true : false
        });

        applicationsDataMap[app.id] = {
          step1Validated,
          step2Validated,
          step3Validated: step3ValidationGlobal, // Shared validation
          step4Validated,
          step5Validated,
          finalSteps: finalSteps
        };
      }
      setApplicationsData(applicationsDataMap);

      // Note: Auto-adding default qualifications is disabled
      // Users can manually add qualifications using the "Ajouter Baccalauréat & TCF" button

      // Update form data
      setFormData({
        // Basic Information
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: user?.email || profileData.email || '',
        dateOfBirth: profileData.dateOfBirth || '',
        gender: profileData.gender || '',
        maritalStatus: profileData.maritalStatus || '',
        // Birth Information
        countryOfBirth: profileData.countryOfBirth || '',
        cityOfBirth: profileData.cityOfBirth || '',
        nationality: Array.isArray(profileData.nationality) ? profileData.nationality : (profileData.nationality ? [profileData.nationality] : []),
        // Contact Information
        phone: profileData.phone || '',
        whatsapp: profileData.whatsapp || '',
        phoneCountry: profileData.phoneCountry || '',
        whatsappCountry: profileData.whatsappCountry || '',
        alternateEmail: profileData.alternateEmail || '',
        // Address Information
        address: profileData.address || '',
        city: profileData.city || '',
        country: Array.isArray(profileData.country) ? profileData.country[0] || '' : (profileData.country || ''),
        postalCode: profileData.postalCode || '',
        // Official Documents
        passportNumber: profileData.passportNumber || '',
        passportAvailable: !!profileData.passportNumber,
        passportExpirationDate: profileData.passportExpirationDate || '',
        cinNumber: profileData.cinNumber || '',
        // Additional Information
        religion: profileData.religion || '',
        nativeLanguage: profileData.nativeLanguage || '',
        chineseName: profileData.chineseName || '',
        // China-specific fields
        chinaFamilyMembers: (() => {
          const loaded = profileData.chinaFamilyMembers;
          console.log('Loading chinaFamilyMembers from profile:', JSON.stringify(loaded, null, 2));
          
          // Ensure proper structure if data exists but is incomplete
          if (loaded && typeof loaded === 'object') {
            return {
              father: {
                name: loaded.father?.name || '',
                dateOfBirth: loaded.father?.dateOfBirth || '',
                occupation: loaded.father?.occupation || '',
                phone: loaded.father?.phone || ''
              },
              mother: {
                name: loaded.mother?.name || '',
                dateOfBirth: loaded.mother?.dateOfBirth || '',
                occupation: loaded.mother?.occupation || '',
                phone: loaded.mother?.phone || ''
              }
            };
          }
          
          return {
            father: { name: '', dateOfBirth: '', occupation: '', phone: '' },
            mother: { name: '', dateOfBirth: '', occupation: '', phone: '' }
          };
        })(),
        // Communication
        wechatId: profileData.wechatId || '',
        skypeNo: profileData.skypeNo || '',
        // Emergency Contact
        emergencyContactName: profileData.emergencyContactName || '',
        emergencyContactGender: profileData.emergencyContactGender || '',
        emergencyContactRelationship: profileData.emergencyContactRelationship || '',
        emergencyContactPhone: profileData.emergencyContactPhone || '',
        emergencyContactEmail: profileData.emergencyContactEmail || '',
        emergencyContactAddress: profileData.emergencyContactAddress || '',
        // Work Experience
        hasWorkExperience: profileData.hasWorkExperience || false,
        workCompany: profileData.workCompany || '',
        workPosition: profileData.workPosition || '',
        workStartDate: profileData.workStartDate || '',
        workEndDate: profileData.workEndDate || '',
        workDescription: profileData.workDescription || '',
        // Preferences
        studyLevel: profileData.studyLevel || '',
        fieldOfStudy: profileData.fieldOfStudy || '',
        preferredCountry: profileData.preferredCountry || '',
        startDate: profileData.startDate || '',
        preferredCurrency: profileData.preferredCurrency || 'USD',
        annualBudget: profileData.annualBudget || '',
        scholarshipRequired: profileData.scholarshipRequired || false,
        languagePreferences: profileData.languagePreferences || []
      });
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Applications are now managed through the Application Process page

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (profile) {
        // Prepare data for saving - ensure country and nationality are in the right format
        const dataToSave = {
          // Basic Information
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          maritalStatus: formData.maritalStatus,
          // Birth Information
          countryOfBirth: formData.countryOfBirth,
          cityOfBirth: formData.cityOfBirth,
          nationality: Array.isArray(formData.nationality) ? formData.nationality : (formData.nationality ? [formData.nationality] : []),
          // Contact Information
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          phoneCountry: formData.phoneCountry,
          whatsappCountry: formData.whatsappCountry,
          alternateEmail: formData.alternateEmail,
          // Address Information
          address: formData.address,
          city: formData.city,
          country: formData.country, // Already a string from SingleSelect
          postalCode: formData.postalCode,
          // Official Documents
          passportNumber: formData.passportNumber,
          passportExpirationDate: formData.passportExpirationDate,
          cinNumber: formData.cinNumber,
          // Additional Information
          religion: formData.religion,
          nativeLanguage: formData.nativeLanguage,
          chineseName: formData.chineseName,
          // China-specific fields
          chinaFamilyMembers: (() => {
            const data = formData.chinaFamilyMembers;
            console.log('Saving chinaFamilyMembers to profile:', JSON.stringify(data, null, 2));
            // Ensure all fields are present
            return {
              father: {
                name: data?.father?.name || '',
                dateOfBirth: data?.father?.dateOfBirth || '',
                occupation: data?.father?.occupation || '',
                phone: data?.father?.phone || ''
              },
              mother: {
                name: data?.mother?.name || '',
                dateOfBirth: data?.mother?.dateOfBirth || '',
                occupation: data?.mother?.occupation || '',
                phone: data?.mother?.phone || ''
              }
            };
          })(),
          // Communication
          wechatId: formData.wechatId,
          skypeNo: formData.skypeNo,
          // Emergency Contact
          emergencyContactName: formData.emergencyContactName,
          emergencyContactGender: formData.emergencyContactGender,
          emergencyContactRelationship: formData.emergencyContactRelationship,
          emergencyContactPhone: formData.emergencyContactPhone,
          emergencyContactEmail: formData.emergencyContactEmail,
          emergencyContactAddress: formData.emergencyContactAddress,
          // Work Experience
          hasWorkExperience: formData.hasWorkExperience,
          workCompany: formData.workCompany,
          workPosition: formData.workPosition,
          workStartDate: formData.workStartDate,
          workEndDate: formData.workEndDate,
          workDescription: formData.workDescription,
          // Preferences
          studyLevel: formData.studyLevel,
          fieldOfStudy: formData.fieldOfStudy,
          preferredCountry: formData.preferredCountry,
          startDate: formData.startDate,
          preferredCurrency: formData.preferredCurrency,
          annualBudget: formData.annualBudget,
          scholarshipRequired: formData.scholarshipRequired,
          languagePreferences: formData.languagePreferences || []
        };
        
        await profileService.updateProfile(dataToSave);
        await loadProfileData();
        setIsEditing(false);
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  // Navigation functions
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    navigate(`/profile/${sectionId}`);
    
    // Scroll to the main content area on mobile/tablet
    setTimeout(() => {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const handleSubsectionChange = (subsectionId) => {
    setActiveSubsection(subsectionId);
    navigate(`/profile/${activeSection}/${subsectionId}`);
  };

  const handleDiscard = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        country: profile.country || '',
        city: profile.city || '',
        nationality: profile.nationality || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        studyLevel: profile.studyLevel || '',
        fieldOfStudy: profile.fieldOfStudy || '',
        preferredCountry: profile.preferredCountry || '',
        startDate: profile.startDate || '',
        preferredCurrency: profile.preferredCurrency || 'USD',
        annualBudget: profile.annualBudget || '',
        scholarshipRequired: profile.scholarshipRequired || false,
        languagePreferences: profile.languagePreferences || []
      });
    }
    setIsEditing(false);
  };

  // Qualification handlers
  const handleRefreshQualifications = (updatedQualifications) => {
    setQualifications(updatedQualifications);
  };

  const handleAddQualification = async (qualificationData) => {
    try {
      if (qualificationData.id) {
        // Update existing qualification
        await profileService.updateQualification(qualificationData.id, qualificationData);
      } else {
        // Add new qualification
        await profileService.addQualification(qualificationData);
      }
      await loadProfileData();
    } catch (err) {
      setError(qualificationData.id ? 'Failed to update qualification' : 'Failed to add qualification');
      console.error('Error with qualification:', err);
    }
  };

  const handleDeleteQualification = async (id) => {
    try {
      await profileService.deleteQualification(id);
      await loadProfileData();
    } catch (err) {
      setError('Failed to delete qualification');
      console.error('Error deleting qualification:', err);
    }
  };

  // Document handlers - Now handled through Application Process
  const handleUploadDocument = async (file, documentData) => {
    // Documents are now managed through the Application Process page
    setError('Documents are now managed through the Application Process page');
  };

  const handleDeleteDocument = async (id) => {
    // Documents are now managed through the Application Process page
    setError('Documents are now managed through the Application Process page');
  };

  // Gestion des documents dynamiques
  const handleUploadDocumentDynamic = (categoryId, typeId) => {
    setDocumentUploadModal({
      isOpen: true,
      categoryId,
      typeId
    });
  };

  const handleDocumentUploaded = () => {
    // Le composant ApplicationDocumentsSection se rafraîchira automatiquement
    console.log('Document uploaded successfully');
  };

  // Application handlers
  const handleAddApplication = async (applicationData) => {
    try {
      await profileService.addApplication(applicationData);
      await loadProfileData();
    } catch (err) {
      setError('Failed to add application');
      console.error('Error adding application:', err);
    }
  };

  // Get application status color
  // Calculate real progress based on actual step validations for each application
  const calculateRealProgress = (application) => {
    const appData = applicationsData[application.id] || {};
    let completedSteps = 0;
    const totalSteps = 5; // Steps 1-5 (step 6 is final steps, not counted)
    
    // Debug: Log validation status for this application
    console.log(`Progress calculation for application ${application.id}:`, {
      step1Validated: appData.step1Validated,
      step2Validated: appData.step2Validated,
      step3Validated: appData.step3Validated,
      step4Validated: appData.step4Validated,
      step5Validated: appData.step5Validated,
      applicationData: application.applicationData,
      submittedData: application.submittedData,
      status: application.status,
      submittedAt: application.submittedAt
    });
    
    // Step 1: Personal Information - Check in application data
    if (appData.step1Validated) {
      completedSteps++;
      console.log(`  ✓ Step 1 validated`);
    } else {
      console.log(`  ✗ Step 1 NOT validated`);
    }
    
    // Step 2: Academic Background - based on step2Validated
    if (appData.step2Validated) {
      completedSteps++;
      console.log(`  ✓ Step 2 validated`);
    } else {
      console.log(`  ✗ Step 2 NOT validated`);
    }
    
    // Step 3: Documents - based on step3Validated
    if (appData.step3Validated) {
      completedSteps++;
      console.log(`  ✓ Step 3 validated`);
    } else {
      console.log(`  ✗ Step 3 NOT validated`);
    }
    
    // Step 4: Preferences - based on step4Validated
    if (appData.step4Validated) {
      completedSteps++;
      console.log(`  ✓ Step 4 validated`);
    } else {
      console.log(`  ✗ Step 4 NOT validated`);
    }
    
    // Step 5: Review & Submit - based on step5Validated
    if (appData.step5Validated) {
      completedSteps++;
      console.log(`  ✓ Step 5 validated`);
    } else {
      console.log(`  ✗ Step 5 NOT validated`);
    }
    
    const progress = Math.round((completedSteps / totalSteps) * 100);
    console.log(`Application ${application.id} progress: ${completedSteps}/${totalSteps} = ${progress}%`);
    
    return progress;
  };

  // Get final step status
  const getFinalStepStatus = (application) => {
    const appData = applicationsData[application.id];
    if (!appData || !appData.finalSteps || appData.finalSteps.length === 0) {
      return null;
    }

    const activeSteps = appData.finalSteps.filter(step => 
      step.status === 'in_progress' || step.status === 'completed'
    );

    if (activeSteps.length === 0) {
      return {
        status: 'pending',
        text: language === 'en' ? 'Pending' : 'En attente',
        color: 'gray'
      };
    }

    const completedSteps = appData.finalSteps.filter(step => step.status === 'completed').length;
    const totalSteps = appData.finalSteps.length;

    if (completedSteps === totalSteps) {
      return {
        status: 'completed',
        text: language === 'en' ? 'Completed' : 'Terminé',
        color: 'green',
        progress: `${completedSteps}/${totalSteps}`
      };
    }

    const inProgressStep = appData.finalSteps.find(step => step.status === 'in_progress');
    return {
      status: 'in_progress',
      text: language === 'en' ? `In Progress: ${inProgressStep?.name || ''}` : `En cours: ${inProgressStep?.name || ''}`,
      color: 'blue',
      progress: `${completedSteps}/${totalSteps}`
    };
  };

  // Get submission status
  const getSubmissionStatus = (application) => {
    if (application.status === 'submitted' || application.submittedAt) {
      return {
        submitted: true,
        text: language === 'en' ? 'Submitted' : 'Soumise',
        date: application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : null,
        color: 'green'
      };
    }
    return {
      submitted: false,
      text: language === 'en' ? 'Draft' : 'Brouillon',
      color: 'gray'
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'pre_admission': 'bg-purple-100 text-purple-800',
      'enrolled': 'bg-green-100 text-green-800',
      'final_offer': 'bg-green-100 text-green-800',
      'visa_application': 'bg-orange-100 text-orange-800',
      'enroll': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get application status text
  const getStatusText = (status) => {
    const texts = {
      'draft': language === 'en' ? 'Draft' : 'Brouillon',
      'submitted': language === 'en' ? 'Submitted' : 'Soumise',
      'under_review': language === 'en' ? 'Under Review' : 'En Cours d\'Examen',
      'pre_admission': language === 'en' ? 'Pre-admission' : 'Pré-admission',
      'enrolled': language === 'en' ? 'Enrolled' : 'Inscrit',
      'final_offer': language === 'en' ? 'Final Offer' : 'Offre Finale',
      'visa_application': language === 'en' ? 'Visa Application' : 'Demande de Visa',
      'enroll': language === 'en' ? 'Enroll' : 'S\'Inscrire',
      'rejected': language === 'en' ? 'Rejected' : 'Rejetée',
      'withdrawn': language === 'en' ? 'Withdrawn' : 'Retirée'
    };
    return texts[status] || status;
  };

  // Navigate to application
  const handleViewApplication = (application) => {
    console.log('Application data:', application);
    console.log('Program data:', application.program);
    console.log('Establishment data:', application.program?.establishment);
    
    const establishmentId = application.program?.establishment?.id || 1;
    const programId = application.program?.id || 1;
    
    console.log('Establishment ID:', establishmentId);
    console.log('Program ID:', programId);
    console.log('Application ID:', application.id);
    
    if (!establishmentId || !programId || !application.id) {
      console.error('Missing required IDs:', { establishmentId, programId, applicationId: application.id });
      return;
    }
    
    console.log('Navigating to:', `/application/${establishmentId}/${programId}?applicationId=${application.id}`);
    navigate(`/application/${establishmentId}/${programId}?applicationId=${application.id}`);
  };

  const profileSections = [
    { id: 'onboarding', label: language === 'en' ? 'Onboarding' : 'Inscription', icon: CheckCircle },
    { id: 'basic-info', label: language === 'en' ? 'Basic Info' : 'Informations de Base', icon: User },
    { id: 'qualifications', label: language === 'en' ? 'Qualifications' : 'Qualifications', icon: GraduationCap },
    { id: 'preferences', label: language === 'en' ? 'Preferences' : 'Préférences', icon: Target },
    { id: 'documents', label: language === 'en' ? 'Documents' : 'Documents', icon: FileText },
    { id: 'services', label: language === 'en' ? 'My Services' : 'Mes Services', icon: ShoppingBag },
    { id: 'translations', label: language === 'en' ? 'My Translations' : 'Mes Traductions', icon: Languages },
    { id: 'test-vouchers', label: language === 'en' ? 'My Test Vouchers' : 'Mes Vouchers de Test', icon: ClipboardCheck },
    { id: 'applications', label: language === 'en' ? 'Applications' : 'Candidatures', icon: Building2 },
    { id: 'shortlist', label: language === 'en' ? 'Shortlist' : 'Liste de Souhaits', icon: Heart },
    { id: 'orders', label: language === 'en' ? 'My Orders' : 'Mes Commandes', icon: ShoppingBag },
    { id: 'payments', label: language === 'en' ? 'My Payments' : 'Mes Paiements', icon: CreditCard },
    { id: 'complaints', label: language === 'en' ? 'My Complaints' : 'Mes Réclamations', icon: MessageSquare },
    { id: 'faq', label: language === 'en' ? 'FAQ' : 'FAQ', icon: HelpCircle },
    { id: 'suggestions', label: language === 'en' ? 'Suggestions' : 'Suggestions', icon: Lightbulb },
    { id: 'ambassador', label: language === 'en' ? 'Become Ambassador' : 'Devenir Ambassadeur', icon: Users },
    { id: 'security', label: language === 'en' ? 'Security' : 'Sécurité', icon: Lock }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadProfileData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No profile found</p>
        </div>
      </div>
    );
  }


  return (
    <>
      <SEO 
        title={`${profile.firstName && profile.lastName 
          ? `${profile.firstName} ${profile.lastName}` 
          : profile.firstName || profile.lastName || 'Profile'} - Profile | E-TAWJIHI`}
        description="Student profile and preferences management"
        keywords="student profile, study abroad, applications, preferences"
      />
      
      <HeaderAuth language={language} setLanguage={setLanguage} />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
              {/* Breadcrumbs */}
              <ProfileBreadcrumbs language={language} />
              
              <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
            {/* Enhanced Sidebar */}
            <div className="w-full xl:w-96">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 xl:sticky xl:top-24 xl:h-[calc(100vh-120px)] xl:overflow-y-auto">
                {/* Enhanced Profile Header */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-4">
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {profile.firstName && profile.lastName 
                      ? `${profile.firstName} ${profile.lastName}` 
                      : profile.firstName || profile.lastName || 'Student Profile'
                    }
                  </h1>
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {profile.country && profile.city ? `${profile.city}, ${profile.country}` : 'Student'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Star className="w-4 h-4" />
                      <span>Premium</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Navigation */}
                <nav className="space-y-1">
                  {profileSections.map((section) => {
                    const Icon = section.icon;
                    return (
                            <button
                              key={section.id}
                              onClick={() => handleSectionChange(section.id)}
                              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                                activeSection === section.id
                                  ? 'bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-700 border border-blue-200 shadow-sm'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                        <div className={`p-2 rounded-lg transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Enhanced Main Content */}
            <div className="flex-1 main-content">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                {/* Section Content */}
                {activeSection === 'onboarding' && (
                  <OnboardingChecklist 
                    progress={profile.onboardingProgress || {}} 
                    language={language} 
                  />
                )}

                {activeSection === 'basic-info' && (
                  <div className="space-y-8">
                    {/* Enhanced Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {language === 'en' ? 'Basic Information' : 'Informations de Base'}
                        </h2>
                        <p className="text-gray-600">
                          {language === 'en' ? 'Manage your personal information' : 'Gérez vos informations personnelles'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleDiscard}
                              className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              <X className="w-4 h-4" />
                              <span className="font-medium">{language === 'en' ? 'Cancel' : 'Annuler'}</span>
                            </button>
                            <button
                              onClick={handleSave}
                              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              <Save className="w-4 h-4" />
                              <span className="font-medium">{language === 'en' ? 'Save' : 'Enregistrer'}</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span className="font-medium">{language === 'en' ? 'Edit' : 'Modifier'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Personal Information Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        {language === 'en' ? 'Personal Information' : 'Informations Personnelles'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'First Name' : 'Prénom'} *
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Last Name' : 'Nom'} *
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Date of Birth' : 'Date de Naissance'} *
                          </label>
                          <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Country of Birth' : 'Pays de Naissance'} *
                          </label>
                          <SingleSelect
                            options={getCountryOptions()}
                            value={formData.countryOfBirth}
                            onChange={(value) => handleInputChange('countryOfBirth', value)}
                            placeholder={language === 'en' ? 'Select country of birth...' : 'Sélectionner le pays de naissance...'}
                            searchPlaceholder={language === 'en' ? 'Search countries...' : 'Rechercher des pays...'}
                            className="w-full"
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'City of Birth' : 'Ville de Naissance'} *
                          </label>
                          <input
                            type="text"
                            value={formData.cityOfBirth}
                            onChange={(e) => handleInputChange('cityOfBirth', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            placeholder={language === 'en' ? 'Enter your city of birth' : 'Saisissez votre ville de naissance'}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Nationality' : 'Nationalité'} *
                          </label>
                          <MultiSelect
                            options={getCountryOptions()}
                            value={Array.isArray(formData.nationality) ? formData.nationality : (formData.nationality ? [formData.nationality] : [])}
                            onChange={(value) => handleInputChange('nationality', value)}
                            placeholder={language === 'en' ? 'Select nationalities...' : 'Sélectionner les nationalités...'}
                            searchPlaceholder={language === 'en' ? 'Search nationalities...' : 'Rechercher des nationalités...'}
                            className="w-full"
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Gender' : 'Genre'} *
                          </label>
                          <select
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            required
                          >
                            <option value="">{language === 'en' ? 'Select gender' : 'Sélectionner le genre'}</option>
                            <option value="male">{language === 'en' ? 'Male' : 'Homme'}</option>
                            <option value="female">{language === 'en' ? 'Female' : 'Femme'}</option>
                            <option value="other">{language === 'en' ? 'Other' : 'Autre'}</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Marital Status' : 'Statut Matrimonial'}
                          </label>
                          <select
                            value={formData.maritalStatus}
                            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                          >
                            <option value="">{language === 'en' ? 'Select status' : 'Sélectionner le statut'}</option>
                            <option value="single">{language === 'en' ? 'Single' : 'Célibataire'}</option>
                            <option value="married">{language === 'en' ? 'Married' : 'Marié(e)'}</option>
                            <option value="divorced">{language === 'en' ? 'Divorced' : 'Divorcé(e)'}</option>
                            <option value="widowed">{language === 'en' ? 'Widowed' : 'Veuf/Veuve'}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-green-600" />
                        {language === 'en' ? 'Contact Information' : 'Informations de Contact'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Email' : 'Email'} *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            required
                          />
                        </div>

                        <PhoneInput
                          label={language === 'en' ? 'Phone' : 'Téléphone'}
                          value={formData.phone}
                          onChange={(phoneNumber, countryCode) => {
                            handleInputChange('phone', phoneNumber);
                            handleInputChange('phoneCountry', countryCode);
                          }}
                          placeholder={language === 'en' ? 'Enter phone number' : 'Entrez le numéro de téléphone'}
                          disabled={!isEditing}
                          className="w-full"
                        />

                        <PhoneInput
                          label={language === 'en' ? 'WhatsApp' : 'WhatsApp'}
                          value={formData.whatsapp}
                          onChange={(phoneNumber, countryCode) => {
                            handleInputChange('whatsapp', phoneNumber);
                            handleInputChange('whatsappCountry', countryCode);
                          }}
                          placeholder={language === 'en' ? 'Enter WhatsApp number' : 'Entrez le numéro WhatsApp'}
                          disabled={!isEditing}
                          className="w-full"
                        />

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Alternate Email' : 'Email Alternatif'}
                          </label>
                          <input
                            type="email"
                            value={formData.alternateEmail}
                            onChange={(e) => handleInputChange('alternateEmail', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Information Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        {language === 'en' ? 'Address Information' : 'Informations d\'Adresse'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-3 space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Address' : 'Adresse'} *
                          </label>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'City' : 'Ville'} *
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Country' : 'Pays'} *
                          </label>
                          <SingleSelect
                            options={getCountryOptions()}
                            value={Array.isArray(formData.country) ? formData.country[0] || '' : (formData.country || '')}
                            onChange={(value) => handleInputChange('country', value)}
                            placeholder={language === 'en' ? 'Select country...' : 'Sélectionner un pays...'}
                            searchPlaceholder={language === 'en' ? 'Search countries...' : 'Rechercher des pays...'}
                            className="w-full"
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Postal Code' : 'Code Postal'} *
                          </label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Official Documents Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-orange-600" />
                        {language === 'en' ? 'Official Documents' : 'Documents Officiels'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'CIN Number' : 'Numéro CIN'} *
                          </label>
                          <input
                            type="text"
                            value={formData.cinNumber}
                            onChange={(e) => handleInputChange('cinNumber', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            placeholder={language === 'en' ? 'Enter your CIN number' : 'Saisissez votre numéro CIN'}
                            required
                          />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.passportAvailable}
                              onChange={(e) => handleInputChange('passportAvailable', e.target.checked)}
                              disabled={!isEditing}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {language === 'en' ? 'I have a passport available' : 'J\'ai un passeport disponible'}
                            </span>
                          </label>
                        </div>

                        {formData.passportAvailable && (
                          <>
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                {language === 'en' ? 'Passport Number' : 'Numéro de Passeport'} *
                              </label>
                              <input
                                type="text"
                                value={formData.passportNumber}
                                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                                placeholder={language === 'en' ? 'Enter your passport number' : 'Saisissez votre numéro de passeport'}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                {language === 'en' ? 'Passport Expiration Date' : 'Date d\'Expiration du Passeport'} *
                              </label>
                              <input
                                type="date"
                                value={formData.passportExpirationDate}
                                onChange={(e) => handleInputChange('passportExpirationDate', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                                required
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Emergency Contact Information Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-red-600" />
                        {language === 'en' ? 'Emergency Contact Information' : 'Informations de Contact d\'Urgence'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Emergency Contact Name' : 'Nom du Contact d\'Urgence'} *
                          </label>
                          <input
                            type="text"
                            value={formData.emergencyContactName}
                            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            placeholder={language === 'en' ? 'Enter emergency contact name' : 'Saisissez le nom du contact d\'urgence'}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Gender' : 'Genre'} *
                          </label>
                          <select
                            value={formData.emergencyContactGender}
                            onChange={(e) => handleInputChange('emergencyContactGender', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            required
                          >
                            <option value="">{language === 'en' ? 'Select gender' : 'Sélectionner le genre'}</option>
                            <option value="male">{language === 'en' ? 'Male' : 'Homme'}</option>
                            <option value="female">{language === 'en' ? 'Female' : 'Femme'}</option>
                            <option value="other">{language === 'en' ? 'Other' : 'Autre'}</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Relationship to you' : 'Relation avec vous'} *
                          </label>
                          <select
                            value={formData.emergencyContactRelationship}
                            onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            required
                          >
                            <option value="">{language === 'en' ? 'Select relationship' : 'Sélectionner la relation'}</option>
                            <option value="parent">{language === 'en' ? 'Parent' : 'Parent'}</option>
                            <option value="spouse">{language === 'en' ? 'Spouse' : 'Conjoint(e)'}</option>
                            <option value="sibling">{language === 'en' ? 'Sibling' : 'Frère/Sœur'}</option>
                            <option value="friend">{language === 'en' ? 'Friend' : 'Ami(e)'}</option>
                            <option value="other">{language === 'en' ? 'Other' : 'Autre'}</option>
                          </select>
                        </div>

                        <PhoneInput
                          label={language === 'en' ? 'Phone' : 'Téléphone'}
                          value={formData.emergencyContactPhone}
                          onChange={(phoneNumber) => handleInputChange('emergencyContactPhone', phoneNumber)}
                          placeholder={language === 'en' ? 'Enter emergency contact phone' : 'Entrez le téléphone du contact d\'urgence'}
                          disabled={!isEditing}
                          className="w-full"
                        />

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Email' : 'Email'} *
                          </label>
                          <input
                            type="email"
                            value={formData.emergencyContactEmail}
                            onChange={(e) => handleInputChange('emergencyContactEmail', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            placeholder={language === 'en' ? 'Enter emergency contact email' : 'Saisissez l\'email du contact d\'urgence'}
                            required
                          />
                        </div>

                        <div className="lg:col-span-3 space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {language === 'en' ? 'Address' : 'Adresse'} *
                          </label>
                          <input
                            type="text"
                            value={formData.emergencyContactAddress}
                            onChange={(e) => handleInputChange('emergencyContactAddress', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            placeholder={language === 'en' ? 'Enter emergency contact address' : 'Saisissez l\'adresse du contact d\'urgence'}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* China-Specific Fields Section */}
                    <div className="bg-white border border-red-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Flag className="w-5 h-5 text-red-600" />
                        🇨🇳 {language === 'en' ? 'China Application Fields' : 'Champs Spécifiques à la Chine'}
                      </h4>
                      
                      {/* Religion */}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {language === 'en' ? 'Religion' : 'Religion'} *
                        </label>
                        <input
                          type="text"
                          value={formData.religion}
                          onChange={(e) => handleInputChange('religion', e.target.value)}
                          disabled={!isEditing}
                          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                          placeholder={language === 'en' ? 'Enter your religion' : 'Saisissez votre religion'}
                          required
                        />
                      </div>

                      {/* Family Members */}
                      <div className="mb-6">
                        <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-600" />
                          {language === 'en' ? 'Family Members' : 'Membres de la Famille'}
                        </h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Father */}
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h6 className="text-sm font-medium text-gray-800 mb-3">
                              {language === 'en' ? 'Father' : 'Père'}
                            </h6>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {language === 'en' ? 'Name' : 'Nom'} *
                                </label>
                                <input
                                  type="text"
                                  value={formData.chinaFamilyMembers.father.name}
                                  onChange={(e) => handleInputChange('chinaFamilyMembers', {
                                    ...formData.chinaFamilyMembers,
                                    father: { ...formData.chinaFamilyMembers.father, name: e.target.value }
                                  })}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                  placeholder={language === 'en' ? 'Father\'s name' : 'Nom du père'}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {language === 'en' ? 'Date of Birth' : 'Date de naissance'}
                                </label>
                                <input
                                  type="date"
                                  value={formData.chinaFamilyMembers.father.dateOfBirth}
                                  onChange={(e) => handleInputChange('chinaFamilyMembers', {
                                    ...formData.chinaFamilyMembers,
                                    father: { ...formData.chinaFamilyMembers.father, dateOfBirth: e.target.value }
                                  })}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {language === 'en' ? 'Occupation' : 'Profession'}
                                </label>
                                <input
                                  type="text"
                                  value={formData.chinaFamilyMembers.father.occupation}
                                  onChange={(e) => handleInputChange('chinaFamilyMembers', {
                                    ...formData.chinaFamilyMembers,
                                    father: { ...formData.chinaFamilyMembers.father, occupation: e.target.value }
                                  })}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                  placeholder={language === 'en' ? 'Father\'s occupation' : 'Profession du père'}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {language === 'en' ? 'Phone' : 'Téléphone'}
                                </label>
                                <input
                                  type="tel"
                                  value={formData.chinaFamilyMembers.father.phone}
                                  onChange={(e) => handleInputChange('chinaFamilyMembers', {
                                    ...formData.chinaFamilyMembers,
                                    father: { ...formData.chinaFamilyMembers.father, phone: e.target.value }
                                  })}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                  placeholder={language === 'en' ? 'Father\'s phone' : 'Téléphone du père'}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Mother */}
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h6 className="text-sm font-medium text-gray-800 mb-3">
                              {language === 'en' ? 'Mother' : 'Mère'}
                            </h6>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {language === 'en' ? 'Name' : 'Nom'} *
                                </label>
                                <input
                                  type="text"
                                  value={formData.chinaFamilyMembers.mother.name}
                                  onChange={(e) => handleInputChange('chinaFamilyMembers', {
                                    ...formData.chinaFamilyMembers,
                                    mother: { ...formData.chinaFamilyMembers.mother, name: e.target.value }
                                  })}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                  placeholder={language === 'en' ? 'Mother\'s name' : 'Nom de la mère'}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {language === 'en' ? 'Date of Birth' : 'Date de naissance'}
                                </label>
                                <input
                                  type="date"
                                  value={formData.chinaFamilyMembers.mother.dateOfBirth}
                                  onChange={(e) => handleInputChange('chinaFamilyMembers', {
                                    ...formData.chinaFamilyMembers,
                                    mother: { ...formData.chinaFamilyMembers.mother, dateOfBirth: e.target.value }
                                  })}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {language === 'en' ? 'Occupation' : 'Profession'}
                                </label>
                                <input
                                  type="text"
                                  value={formData.chinaFamilyMembers.mother.occupation}
                                  onChange={(e) => handleInputChange('chinaFamilyMembers', {
                                    ...formData.chinaFamilyMembers,
                                    mother: { ...formData.chinaFamilyMembers.mother, occupation: e.target.value }
                                  })}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                  placeholder={language === 'en' ? 'Mother\'s occupation' : 'Profession de la mère'}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {language === 'en' ? 'Phone' : 'Téléphone'}
                                </label>
                                <input
                                  type="tel"
                                  value={formData.chinaFamilyMembers.mother.phone}
                                  onChange={(e) => handleInputChange('chinaFamilyMembers', {
                                    ...formData.chinaFamilyMembers,
                                    mother: { ...formData.chinaFamilyMembers.mother, phone: e.target.value }
                                  })}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                  placeholder={language === 'en' ? 'Mother\'s phone' : 'Téléphone de la mère'}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Work Experience Information Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        {language === 'en' ? 'Work Experience Information' : 'Informations sur l\'Expérience Professionnelle'}
                      </h4>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasWorkExperience}
                            onChange={(e) => handleInputChange('hasWorkExperience', e.target.checked)}
                            disabled={!isEditing}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {language === 'en' ? 'I have work experience' : 'J\'ai une expérience professionnelle'}
                          </span>
                        </label>

                        {formData.hasWorkExperience && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                {language === 'en' ? 'Company' : 'Entreprise'}
                              </label>
                              <input
                                type="text"
                                value={formData.workCompany}
                                onChange={(e) => handleInputChange('workCompany', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                {language === 'en' ? 'Position' : 'Poste'}
                              </label>
                              <input
                                type="text"
                                value={formData.workPosition}
                                onChange={(e) => handleInputChange('workPosition', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                {language === 'en' ? 'Start Date' : 'Date de Début'}
                              </label>
                              <input
                                type="date"
                                value={formData.workStartDate}
                                onChange={(e) => handleInputChange('workStartDate', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                {language === 'en' ? 'End Date' : 'Date de Fin'}
                              </label>
                              <input
                                type="date"
                                value={formData.workEndDate}
                                onChange={(e) => handleInputChange('workEndDate', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                              />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3 space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                {language === 'en' ? 'Description' : 'Description'}
                              </label>
                              <textarea
                                value={formData.workDescription}
                                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                                disabled={!isEditing}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 resize-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'qualifications' && (
                  <QualificationsTabs
                    degrees={qualifications}
                    onAddDegree={handleAddQualification}
                    onDeleteDegree={handleDeleteQualification}
                    onRefreshQualifications={handleRefreshQualifications}
                    language={language}
                    activeSubsection={activeSubsection}
                    onSubsectionChange={handleSubsectionChange}
                    applications={applications}
                  />
                )}

                {activeSection === 'preferences' && (
                  <PreferencesSection
                    profile={profile}
                    onUpdateProfile={handleSave}
                    language={language}
                  />
                )}

                {/* Documents Section - Application Style */}
                {activeSection === 'documents' && (
                  <ApplicationDocumentsSection
                    language={language}
                    onUploadDocument={handleUploadDocumentDynamic}
                    onDocumentUploaded={handleDocumentUploaded}
                  />
                )}

                {/* Services Section */}
                {activeSection === 'services' && (
                  <ServicesSection
                    language={language}
                    userCountry={profile.country}
                    userStudyCountry={profile.preferredCountry}
                  />
                )}

                {/* Translations Section */}
                {activeSection === 'translations' && (
                  <MyTranslationsSection
                    language={language}
                    onNewTranslation={() => {
                      // Open translation modal directly
                      setShowTranslationModal(true);
                    }}
                    refreshTrigger={translationRefreshTrigger}
                  />
                )}

                {/* Test Vouchers Section */}
                {activeSection === 'test-vouchers' && (
                  <TestVouchersSection
                    language={language}
                  />
                )}

                {/* My Complaints Section */}
                {activeSection === 'complaints' && (
                  <MyComplaintsSection
                    language={language}
                  />
                )}

                {/* FAQ Section */}
                {activeSection === 'faq' && (
                  <FAQSection
                    language={language}
                  />
                )}

                {/* Suggestions Section */}
                {activeSection === 'suggestions' && (
                  <SuggestionsSection
                    language={language}
                  />
                )}

                {/* Become Ambassador Section */}
                {activeSection === 'ambassador' && (
                  <BecomeAmbassadorSection
                    language={language}
                    userProfile={profile}
                  />
                )}

                {/* Security Section */}
                {activeSection === 'security' && (
                  <SecuritySection
                    language={language}
                  />
                )}

                {activeSection === 'applications' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {language === 'en' ? 'My Applications' : 'Mes Candidatures'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {language === 'en' ? 'Manage your university applications' : 'Gérez vos candidatures universitaires'}
                        </p>
                      </div>
                    </div>

                    {applications.length === 0 ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-blue-900">
                              {language === 'en' ? 'No Applications Yet' : 'Aucune Candidature'}
                            </h3>
                            <p className="text-blue-700 text-sm">
                              {language === 'en' ? 'Start your first application to a university program' : 'Commencez votre première candidature à un programme universitaire'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <p className="text-gray-700">
                            {language === 'en' 
                              ? 'Browse our programs and start your application process. Our education agents will guide you through each step.'
                              : 'Parcourez nos programmes et commencez votre processus de candidature. Nos agents éducatifs vous guideront à chaque étape.'
                            }
                          </p>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate('/establishments')}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>
                                {language === 'en' ? 'Browse Programs' : 'Parcourir les Programmes'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {applications.map((application) => (
                          <div key={application.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {application.program?.name || 'Program Name'}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                      {application.program?.establishment?.name || 'Establishment Name'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{application.program?.establishment?.city}, {application.program?.establishment?.country}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                  {getStatusText(application.status)}
                                </span>
                                {application.notes && (
                                  <div className="relative">
                                    <Bell className="w-5 h-5 text-orange-500" />
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>{language === 'en' ? 'Progress' : 'Progrès'}</span>
                                <span>{calculateRealProgress(application)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${calculateRealProgress(application)}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Submission Status */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Submission Status' : 'État de Soumission'}
                                </span>
                                {(() => {
                                  const submissionStatus = getSubmissionStatus(application);
                                  return (
                                    <div className="flex items-center gap-2">
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        submissionStatus.color === 'green' 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {submissionStatus.submitted ? (
                                          <div className="flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            {submissionStatus.text}
                                          </div>
                                        ) : (
                                          submissionStatus.text
                                        )}
                                      </span>
                                      {submissionStatus.date && (
                                        <span className="text-xs text-gray-500">
                                          {language === 'en' ? 'on' : 'le'} {submissionStatus.date}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* Final Steps Status */}
                            {(() => {
                              const finalStepStatus = getFinalStepStatus(application);
                              if (!finalStepStatus) return null;
                              
                              return (
                                <div className="mb-4">
                                  <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">
                                      {language === 'en' ? 'Final Steps' : 'Étapes Finales'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      finalStepStatus.color === 'green' 
                                        ? 'bg-green-100 text-green-800'
                                        : finalStepStatus.color === 'blue'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {finalStepStatus.progress && (
                                        <span className="mr-1">{finalStepStatus.progress}</span>
                                      )}
                                      {finalStepStatus.text}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            {/* Notifications */}
                            {application.notes && (
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                <div className="flex items-start space-x-2">
                                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                                  <div>
                                    <p className="text-orange-800 text-sm font-medium">
                                      {language === 'en' ? 'Notification' : 'Notification'}
                                    </p>
                                    <p className="text-orange-700 text-sm">
                                      {application.notes}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleViewApplication(application)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>
                                    {language === 'en' ? 'View Application' : 'Voir la Candidature'}
                                  </span>
                                </button>
                              </div>
                              
                              <div className="text-xs text-gray-500">
                                {language === 'en' ? 'Last updated' : 'Dernière mise à jour'}: {new Date(application.updatedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'shortlist' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {language === 'en' ? 'My Shortlist' : 'Ma Liste de Souhaits'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {language === 'en' ? 'Your favorite programs and universities' : 'Vos programmes et universités préférés'}
                        </p>
                      </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        <button
                          onClick={() => setActiveShortlistTab('programs')}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeShortlistTab === 'programs'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            {language === 'en' ? 'Programs' : 'Programmes'} ({shortlist.programs.length})
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveShortlistTab('establishments')}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeShortlistTab === 'establishments'
                              ? 'border-green-500 text-green-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {language === 'en' ? 'Universities' : 'Universités'} ({shortlist.establishments.length})
                          </div>
                        </button>
                      </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                      {activeShortlistTab === 'programs' && (
                        <div className="space-y-4">
                          {shortlist.programs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {shortlist.programs.map((program) => (
                                <div 
                                  key={program.id} 
                                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                  {/* Program Logo Section */}
                                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                    <div className="logo-container">
                                      <img
                                        src={program.establishment?.logo || program.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(program.establishment?.name || program.name)}&size=200&background=3B82F6&color=fff`}
                                        alt={program.name}
                                        className="logo-image group-hover:scale-105 transition-all duration-300"
                                      />
                                    </div>
                                    
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                      {program.aidvisorRecommended && (
                                        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                          <Bot className="w-3 h-3" />
                                          {language === 'en' ? 'E-DVISOR Recommended' : 'Recommandé par E-DVISOR'}
                                        </div>
                                      )}
                                      {program.featured && (
                                        <div className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                          <Award className="w-3 h-3" />
                                          {language === 'en' ? 'Featured' : 'En vedette'}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Program Content */}
                                  <div className="p-4 sm:p-6">
                                    {/* Header */}
                                    <div className="mb-4">
                                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {program.name}
                                      </h3>
                                      <div className="flex items-center text-gray-600 text-sm mb-2">
                                        <Building2 className="w-4 h-4 mr-1 text-blue-500" />
                                        {program.establishment?.name || 'University'}
                                      </div>
                                      <div className="flex items-center text-gray-500 text-sm mb-2">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {getCityLabel(program.establishment?.city)}, {getCountryLabel(program.establishment?.country)}
                                      </div>
                                      <div className="flex items-center text-gray-500 text-sm">
                                        <Globe className="w-4 h-4 mr-1" />
                                        {program.language ? getLanguageLabel(program.language) : (language === 'en' ? 'Not specified' : 'Non spécifié')}
                                      </div>
                                    </div>

                                    {/* University Rankings */}
                                    {program.establishmentRankings && (program.establishmentRankings.qs || program.establishmentRankings.times || program.establishmentRankings.arwu || program.establishmentRankings.usNews) && (
                                      <div className="mb-4">
                                        <div className="text-xs text-gray-500 mb-2">{language === 'en' ? 'University Rankings' : 'Classements de l\'Université'}</div>
                                        <div className="flex flex-wrap gap-2">
                                          {program.establishmentRankings?.qs && (
                                            <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                                              QS #{program.establishmentRankings.qs}
                                            </div>
                                          )}
                                          {program.establishmentRankings?.times && (
                                            <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium">
                                              Times #{program.establishmentRankings.times}
                                            </div>
                                          )}
                                          {program.establishmentRankings?.arwu && (
                                            <div className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                                              ARWU #{program.establishmentRankings.arwu}
                                            </div>
                                          )}
                                          {program.establishmentRankings?.usNews && (
                                            <div className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-medium">
                                              US News #{program.establishmentRankings.usNews}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Program Details */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Degree' : 'Diplôme'}</div>
                                        <div className="text-sm font-semibold text-gray-800">{getDegreeLabel(program.degree)}</div>
                                      </div>
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Duration' : 'Durée'}</div>
                                        <div className="text-sm font-semibold text-gray-800">{program.duration} {program.durationUnit === 'month' ? (language === 'en' ? 'month' : 'mois') : (language === 'en' ? 'year' : 'an')}</div>
                                      </div>
                                    </div>

                                    {/* Study Type and Tuition */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Study Type' : 'Type d\'Étude'}</div>
                                        <div className="text-sm font-semibold text-gray-800">
                                          {program.studyType === 'on-campus' ? (language === 'en' ? 'On-Campus' : 'Présentiel') :
                                           program.studyType === 'hybrid' ? (language === 'en' ? 'Hybrid' : 'Hybride') :
                                           program.studyType === 'online' ? (language === 'en' ? 'Online' : 'En ligne') : 
                                           program.studyType}
                                        </div>
                                      </div>
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Tuition' : 'Frais'}</div>
                                        <div className="text-sm font-semibold text-gray-800">
                                          <PriceDisplayFromString priceString={program.tuition} />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Features */}
                                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                                      {program.scholarships && (
                                        <div className="flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3 text-green-500" />
                                          <span>{language === 'en' ? 'Scholarships' : 'Bourses'}</span>
                                        </div>
                                      )}
                                      {program.housing === true && (
                                        <div className="flex items-center gap-1">
                                          <Home className="w-3 h-3 text-blue-500" />
                                          <span>{language === 'en' ? 'Housing' : 'Logement'}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Next Application Period */}
                                    {(() => {
                                      let nextIntake = getNextApplicationPeriod(program.multiIntakes);
                                      
                                      if (nextIntake) {
                                        const status = getApplicationPeriodStatus(nextIntake);
                                        const isOpen = status.status === 'open';
                                        const isClosingSoon = status.status === 'closing-soon';
                                        
                                        return (
                                          <div className="mb-4">
                                            <div className="text-xs text-gray-500 mb-2">
                                              {language === 'en' ? 'Next Application Period' : 'Prochaine période de candidature'}
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                              {/* Header with intake name and status */}
                                              <div className="flex justify-between items-center mb-3">
                                                <div className="text-sm font-semibold text-gray-900">
                                                  {localizeIntakeName(nextIntake.name, language)}
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                  status.color === 'green' ? 'bg-green-100 text-green-800' :
                                                  status.color === 'red' ? 'bg-red-100 text-red-800' :
                                                  status.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                                  'bg-gray-100 text-gray-800'
                                                }`}>
                                                  {status.text}
                                                </span>
                                              </div>
                                              
                                              {/* Dates with icons */}
                                              <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Calendar className="w-3 h-3 text-blue-600" />
                                                  </div>
                                                  <div className="text-xs text-gray-600">
                                                    <span className="font-medium">{language === 'en' ? 'Opens:' : 'Ouverture:'}</span>
                                                    <span className="ml-1">
                                                      {nextIntake.applicationOpens 
                                                        ? new Date(nextIntake.applicationOpens).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                          })
                                                        : (language === 'en' ? 'Not specified' : 'Non spécifié')
                                                      }
                                                    </span>
                                                  </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                                                    <Clock className="w-3 h-3 text-red-600" />
                                                  </div>
                                                  <div className="text-xs text-gray-600">
                                                    <span className="font-medium">{language === 'en' ? 'Closes:' : 'Fermeture:'}</span>
                                                    <span className="ml-1">
                                                      {nextIntake.applicationCloses 
                                                        ? new Date(nextIntake.applicationCloses).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                          })
                                                        : (language === 'en' ? 'Not specified' : 'Non spécifié')
                                                      }
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              {/* Apply button */}
                                              <button 
                                                className={`w-full mt-3 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${
                                                  isOpen 
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                    : isClosingSoon
                                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                                disabled={!isOpen && !isClosingSoon}
                                              >
                                                {isOpen ? (
                                                  <>
                                                    <ExternalLink className="w-3 h-3" />
                                                    {language === 'en' ? 'Apply Now' : 'Postuler maintenant'}
                                                  </>
                                                ) : isClosingSoon ? (
                                                  <>
                                                    <Clock className="w-3 h-3" />
                                                    {language === 'en' ? 'Apply Quickly' : 'Postuler rapidement'}
                                                  </>
                                                ) : (
                                                  <>
                                                    <Calendar className="w-3 h-3" />
                                                    {language === 'en' ? 'Not Available' : 'Non disponible'}
                                                  </>
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      } else {
                                        return (
                                          <div className="mb-4">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                              <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Application Period' : 'Période de candidature'}</div>
                                              <div className="text-sm text-gray-500">{language === 'en' ? 'No dates available' : 'Aucune date disponible'}</div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    })()}

                                    {/* Requirements - Only show if at least one requirement is detected */}
                                    {(() => {
                                      const reqAnalysis = analyzeProgramRequirements(program);
                                      const hasAnyRequirement = reqAnalysis.hasEnglishTest || reqAnalysis.hasStandardizedTest || reqAnalysis.hasInterview || reqAnalysis.hasWrittenTest;
                                      
                                      // Only render the entire section if there's at least one requirement
                                      if (!hasAnyRequirement) return null;
                                      
                                      return (
                                        <div className="mb-4">
                                          <div className="text-xs text-gray-500 mb-2">{language === 'en' ? 'Requirements' : 'Prérequis'}</div>
                                          <div className="flex flex-wrap gap-2">
                                            {reqAnalysis.hasEnglishTest && (
                                              <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md">
                                                <Languages className="w-3 h-3" />
                                                <span>{language === 'en' ? 'English Test' : 'Test d\'anglais'}</span>
                                              </div>
                                            )}
                                            {reqAnalysis.hasStandardizedTest && (
                                              <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md">
                                                <FileText className="w-3 h-3" />
                                                <span>{language === 'en' ? 'Standardized Test' : 'Test standardisé'}</span>
                                              </div>
                                            )}
                                            {reqAnalysis.hasInterview && (
                                              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
                                                <Mic className="w-3 h-3" />
                                                <span>{language === 'en' ? 'Interview' : 'Entretien'}</span>
                                              </div>
                                            )}
                                            {reqAnalysis.hasWrittenTest && (
                                              <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md">
                                                <PenTool className="w-3 h-3" />
                                                <span>{language === 'en' ? 'Written Test' : 'Test écrit'}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Program Type and Pricing */}
                                    {(() => {
                                      const typeInfo = getUniversityTypeInfo({ 
                                        universityType: program.programType || program.universityType, 
                                        servicePricing: program.servicePricing 
                                      });
                                      
                                      if (!typeInfo || typeInfo.type === "Unknown") return null;
                                      
                                      return (
                                        <div className="mb-4">
                                          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold mb-2 ${
                                            typeInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                                            typeInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                            typeInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                            typeInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                                            typeInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                                            'bg-gray-100 text-gray-800'
                                          }`}>
                                            {typeInfo.type}
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">
                                              {typeInfo.freeApps > 0 
                                                ? (language === 'fr' ? `${typeInfo.freeApps} candidatures gratuites` : `${typeInfo.freeApps} free applications`)
                                                : (language === 'fr' ? 'Service payant' : 'Paid service')
                                              }
                                            </span>
                                            <div className="flex items-center gap-2">
                                              {/* Type A: Gratuit avec prix original barré */}
                                              {typeInfo.type === "Type A" && (
                                                <>
                                                  {typeInfo.originalPrice && (
                                                    <ServicePriceDisplay 
                                                      price={typeInfo.originalPrice}
                                                      currency={typeInfo.currency}
                                                      className="text-gray-400 line-through text-xs"
                                                    />
                                                  )}
                                                  <span className="font-semibold text-green-600">
                                                    {language === 'fr' ? 'Gratuit' : 'Free'}
                                                  </span>
                                                </>
                                              )}
                                              
                                              {/* Type B: Prix normal ou promotion */}
                                              {typeInfo.type === "Type B" && (
                                                <>
                                                  {typeInfo.promotionPrice && typeInfo.originalPrice ? (
                                                    <div className="flex flex-col items-end gap-1">
                                                      <div className="flex items-center gap-2">
                                                        <ServicePriceDisplay 
                                                          price={typeInfo.originalPrice}
                                                          currency={typeInfo.currency}
                                                          className="text-gray-400 line-through text-xs"
                                                        />
                                                        <ServicePriceDisplay 
                                                          price={typeInfo.promotionPrice}
                                                          currency={typeInfo.currency}
                                                          isPromotion={true}
                                                          className="font-semibold text-red-600 text-sm"
                                                        />
                                                      </div>
                                                      {typeInfo.promotionDeadline && typeInfo.promotionDeadline.trim() !== '' && (
                                                        <span className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded">
                                                          {language === 'fr' ? 'Jusqu\'au' : 'Until'} {new Date(typeInfo.promotionDeadline).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                          })}
                                                        </span>
                                                      )}
                                                    </div>
                                                  ) : typeInfo.originalPrice ? (
                                                    <ServicePriceDisplay 
                                                      price={typeInfo.originalPrice}
                                                      currency={typeInfo.currency}
                                                      className="font-semibold text-blue-600"
                                                    />
                                                  ) : (
                                                    <span className="font-semibold text-blue-600">
                                                      {language === 'fr' ? 'Prix sur demande' : 'Price on request'}
                                                    </span>
                                                  )}
                                                </>
                                              )}
                                              
                                              {/* Type C: Prix normal ou promotion */}
                                              {typeInfo.type === "Type C" && (
                                                <>
                                                  {typeInfo.promotionPrice && typeInfo.originalPrice ? (
                                                    <div className="flex flex-col items-end gap-1">
                                                      <div className="flex items-center gap-2">
                                                        <ServicePriceDisplay 
                                                          price={typeInfo.originalPrice}
                                                          currency={typeInfo.currency}
                                                          className="text-gray-400 line-through text-xs"
                                                        />
                                                        <ServicePriceDisplay 
                                                          price={typeInfo.promotionPrice}
                                                          currency={typeInfo.currency}
                                                          isPromotion={true}
                                                          className="font-semibold text-red-600 text-sm"
                                                        />
                                                      </div>
                                                      {typeInfo.promotionDeadline && typeInfo.promotionDeadline.trim() !== '' && (
                                                        <span className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded">
                                                          {language === 'fr' ? 'Jusqu\'au' : 'Until'} {new Date(typeInfo.promotionDeadline).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                          })}
                                                        </span>
                                                      )}
                                                    </div>
                                                  ) : typeInfo.originalPrice ? (
                                                    <ServicePriceDisplay 
                                                      price={typeInfo.originalPrice}
                                                      currency={typeInfo.currency}
                                                      className="font-semibold text-purple-600"
                                                    />
                                                  ) : (
                                                    <span className="font-semibold text-purple-600">
                                                      {language === 'fr' ? 'Prix sur demande' : 'Price on request'}
                                                    </span>
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Actions */}
                                    <div className="space-y-3">
                                      {/* Main Actions Row */}
                                      <div className="flex gap-2">
                                        <Link 
                                          to={`/${generateProgramSlug(program)}`}
                                          className="flex-1 bg-blue-800 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors"
                                        >
                                          <Eye className="w-4 h-4" />
                                          {language === 'en' ? 'View Details' : 'Voir les détails'}
                                        </Link>
                                        <HeartButton 
                                          type="program"
                                          id={program.id}
                                          isShortlisted={true}
                                          className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold flex items-center justify-center"
                                          language={language}
                                        />
                                      </div>
                                      
                                      {/* Secondary Actions Row */}
                                      <div className="flex gap-2">
                                        {program.easyApply && (
                                          <div 
                                            className={`flex-1 text-white py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                                              program.universityType === 'A' 
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                                            }`}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              // Handle apply
                                            }}
                                          >
                                            <Zap className="w-4 h-4" />
                                            {program.universityType === 'A' 
                                              ? (language === 'en' ? 'FREE APPLY' : 'CANDIDATURE GRATUITE')
                                              : (language === 'en' ? 'APPLY' : 'CANDIDATURE')
                                            }
                                          </div>
                                        )}
                                        <div 
                                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            // Handle contact advisor
                                          }}
                                        >
                                          <MessageCircle className="w-4 h-4" />
                                          {language === 'en' ? 'Contact Advisor' : 'Contacter un Conseiller'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {language === 'en' ? 'No Programs Yet' : 'Aucun Programme'}
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {language === 'en' ? 'Start exploring programs to add them to your shortlist' : 'Commencez à explorer les programmes pour les ajouter à votre liste de souhaits'}
                              </p>
                              <Link
                                to="/establishments"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Search className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Explore Programs' : 'Explorer les Programmes'}
                              </Link>
                            </div>
                          )}
                        </div>
                      )}

                      {activeShortlistTab === 'establishments' && (
                        <div className="space-y-4">
                          {shortlist.establishments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {shortlist.establishments.map((establishment) => (
                                <div key={establishment.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                                  {/* Enhanced Logo Section */}
                                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                    <div className="logo-container">
                                      <img
                                        src={establishment.logo}
                                        alt={establishment.name}
                                        className="logo-image group-hover:scale-105 transition-all duration-300"
                                      />
                                    </div>
                                    
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                      {establishment.aidvisorRecommended && (
                                        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                          <Bot className="w-3 h-3" />
                                          {language === 'en' ? 'E-DVISOR Recommended' : 'Recommandé par E-DVISOR'}
                                        </div>
                                      )}
                                      {establishment.featured && (
                                        <div className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                          <Award className="w-3 h-3" />
                                          {language === 'en' ? 'Featured' : 'En vedette'}
                                        </div>
                                      )}
                                      {establishment.sponsored && (
                                        <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                          {language === 'en' ? 'Sponsored' : 'Sponsorisé'}
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* World Ranking */}
                                    {establishment.worldRanking && (
                                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-sm font-bold text-gray-800">#{establishment.worldRanking}</span>
                                      </div>
                                    )}
                                    
                                    {/* Rating */}
                                    {establishment.rating && (
                                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="text-sm font-semibold text-gray-800">{establishment.rating}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Enhanced Content */}
                                  <div className="p-4 sm:p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                          {establishment.name}
                                        </h3>
                                        <div className="flex items-center text-gray-600 text-sm mb-2">
                                          <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                                          {getCityLabel(establishment.city)}, {getCountryLabel(establishment.country)}
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                          <Globe className="w-4 h-4 mr-1" />
                                          {establishment.languages && establishment.languages.length > 0 
                                            ? establishment.languages.map(lang => {
                                                if (typeof lang === 'object' && lang.label) {
                                                  return lang.label;
                                                }
                                                return getLanguageLabel(lang);
                                              }).join(', ')
                                            : getLanguageLabel(establishment.language)
                                          }
                                        </div>
                                      </div>
                                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        establishment.type === 'Public' 
                                          ? 'bg-blue-100 text-blue-800' 
                                          : 'bg-purple-100 text-purple-800'
                                      }`}>
                                        {getSchoolTypeLabel(establishment.type)}
                                      </span>
                                    </div>

                                    {/* Key Information */}
                                    {establishment.tuitionRange && (
                                      <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                          <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Tuition Range' : 'Gamme de frais'}</div>
                                          <div className="text-sm font-semibold text-gray-800">
                                            <PriceDisplay 
                                              amount={establishment.tuitionRange.min} 
                                              currency={establishment.tuitionRange.currency}
                                            />
                                            {establishment.tuitionRange.min !== establishment.tuitionRange.max && (
                                              <>
                                                <span className="mx-1">-</span>
                                                <PriceDisplay 
                                                  amount={establishment.tuitionRange.max} 
                                                  currency={establishment.tuitionRange.currency}
                                                />
                                              </>
                                            )}
                                          </div>
                                        </div>
                                        {establishment.acceptanceRate && (
                                          <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-500 mb-1">
                                              {language === 'en' ? 'Acceptance Rate' : "Taux d'admission"}
                                            </div>
                                            <div className="text-sm font-semibold text-gray-800">
                                              {establishment.acceptanceRate}%
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Rankings */}
                                    {establishment.rankings && (establishment.rankings.qs || establishment.rankings.times || establishment.rankings.arwu || establishment.rankings.usNews) && (
                                      <div className="mb-4">
                                        <div className="text-xs text-gray-500 mb-2">{language === 'en' ? 'Global Rankings' : 'Classements Mondiaux'}</div>
                                        <div className="flex flex-wrap gap-2">
                                          {establishment.rankings.qs && (
                                            <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                                              QS #{establishment.rankings.qs}
                                            </div>
                                          )}
                                          {establishment.rankings.times && (
                                            <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium">
                                              Times #{establishment.rankings.times}
                                            </div>
                                          )}
                                          {establishment.rankings.arwu && (
                                            <div className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                                              ARWU #{establishment.rankings.arwu}
                                            </div>
                                          )}
                                          {establishment.rankings.usNews && (
                                            <div className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-medium">
                                              US News #{establishment.rankings.usNews}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Features */}
                                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                                      {establishment.scholarships && (
                                        <div className="flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3 text-green-500" />
                                          <span>{language === 'en' ? 'Scholarships' : 'Bourses'}</span>
                                          {establishment.scholarshipTypes && establishment.scholarshipTypes.length > 0 && (
                                            <span className="text-gray-500">({establishment.scholarshipTypes.length})</span>
                                          )}
                                        </div>
                                      )}
                                      {establishment.housing && (
                                        <div className="flex items-center gap-1">
                                          <Building2 className="w-3 h-3 text-blue-500" />
                                          <span>{language === 'en' ? 'Housing' : 'Logement'}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                                      <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        <span>{(establishment.students ?? 0).toLocaleString()}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4 text-emerald-500" />
                                        <span>{establishment.programs || 0} {language === 'en' ? 'programs' : 'programmes'}</span>
                                      </div>
                                    </div>

                                    {/* University Type Information */}
                                    {(() => {
                                      const typeInfo = getUniversityTypeInfo(establishment);
                                      if (!typeInfo || typeInfo.type === "Unknown") return null;
                                      
                                      return (
                                        <div className="mb-4">
                                          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold mb-2 ${
                                            typeInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                                            typeInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                            typeInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                            typeInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                                            typeInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                                            'bg-gray-100 text-gray-800'
                                          }`}>
                                            {typeInfo.type}
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">
                                              {typeInfo.freeApps > 0 
                                                ? (language === 'fr' ? `${typeInfo.freeApps} candidatures gratuites` : `${typeInfo.freeApps} free applications`)
                                                : (language === 'fr' ? 'Service payant' : 'Paid service')
                                              }
                                            </span>
                                            <div className="flex items-center gap-2">
                                              {/* Type A: Gratuit avec prix original barré */}
                                              {typeInfo.type === "Type A" && (
                                                <>
                                                  {typeInfo.originalPrice && (
                                                    <ServicePriceDisplay 
                                                      price={typeInfo.originalPrice}
                                                      currency={typeInfo.currency}
                                                      className="text-gray-400 line-through text-xs"
                                                    />
                                                  )}
                                                  <span className="font-semibold text-green-600">
                                                    {language === 'fr' ? 'Gratuit' : 'Free'}
                                                  </span>
                                                </>
                                              )}
                                              
                                              {/* Type B: Prix normal ou promotion */}
                                              {typeInfo.type === "Type B" && (
                                                <>
                                                  {typeInfo.promotionPrice && typeInfo.originalPrice ? (
                                                    <div className="flex flex-col items-end gap-1">
                                                      <div className="flex items-center gap-2">
                                                        <ServicePriceDisplay 
                                                          price={typeInfo.originalPrice}
                                                          currency={typeInfo.currency}
                                                          className="text-gray-400 line-through text-xs"
                                                        />
                                                        <ServicePriceDisplay 
                                                          price={typeInfo.promotionPrice}
                                                          currency={typeInfo.currency}
                                                          isPromotion={true}
                                                          className="font-semibold text-red-600 text-sm"
                                                        />
                                                      </div>
                                                      {typeInfo.promotionDeadline && typeInfo.promotionDeadline.trim() !== '' && (
                                                        <span className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded">
                                                          {language === 'fr' ? 'Jusqu\'au' : 'Until'} {new Date(typeInfo.promotionDeadline).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                          })}
                                                        </span>
                                                      )}
                                                    </div>
                                                  ) : typeInfo.originalPrice ? (
                                                    <ServicePriceDisplay 
                                                      price={typeInfo.originalPrice}
                                                      currency={typeInfo.currency}
                                                      className="font-semibold text-blue-600"
                                                    />
                                                  ) : (
                                                    <span className="font-semibold text-blue-600">
                                                      {language === 'fr' ? 'Prix sur demande' : 'Price on request'}
                                                    </span>
                                                  )}
                                                </>
                                              )}
                                              
                                              {/* Type C: Prix normal ou promotion */}
                                              {typeInfo.type === "Type C" && (
                                                <>
                                                  {typeInfo.promotionPrice && typeInfo.originalPrice ? (
                                                    <div className="flex flex-col items-end gap-1">
                                                      <div className="flex items-center gap-2">
                                                        <ServicePriceDisplay 
                                                          price={typeInfo.originalPrice}
                                                          currency={typeInfo.currency}
                                                          className="text-gray-400 line-through text-xs"
                                                        />
                                                        <ServicePriceDisplay 
                                                          price={typeInfo.promotionPrice}
                                                          currency={typeInfo.currency}
                                                          isPromotion={true}
                                                          className="font-semibold text-red-600 text-sm"
                                                        />
                                                      </div>
                                                      {typeInfo.promotionDeadline && typeInfo.promotionDeadline.trim() !== '' && (
                                                        <span className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded">
                                                          {language === 'fr' ? 'Jusqu\'au' : 'Until'} {new Date(typeInfo.promotionDeadline).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                          })}
                                                        </span>
                                                      )}
                                                    </div>
                                                  ) : typeInfo.originalPrice ? (
                                                    <ServicePriceDisplay 
                                                      price={typeInfo.originalPrice}
                                                      currency={typeInfo.currency}
                                                      className="font-semibold text-purple-600"
                                                    />
                                                  ) : (
                                                    <span className="font-semibold text-purple-600">
                                                      {language === 'fr' ? 'Prix sur demande' : 'Price on request'}
                                                    </span>
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Next Application Period */}
                                    {(() => {
                                      const nextPeriod = getNextApplicationPeriod(establishment.multiIntakes);
                                      if (!nextPeriod) {
                                        return (
                                          <div className="mb-4">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                              <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Application Period' : 'Période de candidature'}</div>
                                              <div className="text-sm text-gray-500">{language === 'en' ? 'No dates available' : 'Aucune date disponible'}</div>
                                            </div>
                                          </div>
                                        );
                                      }

                                      const status = getApplicationPeriodStatus(nextPeriod);
                                      const isOpen = status.status === 'open';
                                      const isClosingSoon = status.status === 'closing-soon';
                                      
                                      return (
                                        <div className="mb-4">
                                          <div className="text-xs text-gray-500 mb-2">
                                            {language === 'en' ? 'Next Application Period' : 'Prochaine période de candidature'}
                                          </div>
                                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            {/* Header with intake name and status */}
                                            <div className="flex justify-between items-center mb-3">
                                              <div className="text-sm font-semibold text-gray-900">
                                                {localizeIntakeName(nextPeriod.name, language)}
                                              </div>
                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                status.color === 'green' ? 'bg-green-100 text-green-800' :
                                                status.color === 'red' ? 'bg-red-100 text-red-800' :
                                                status.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                              }`}>
                                                {status.text}
                                              </span>
                                            </div>

                                            {/* Dates with icons */}
                                            <div className="space-y-2">
                                              <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                                  <Calendar className="w-3 h-3 text-blue-600" />
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                  <span className="font-medium">{language === 'en' ? 'Opens:' : 'Ouverture:'}</span>
                                                  <span className="ml-1">
                                                    {nextPeriod.applicationOpens 
                                                      ? new Date(nextPeriod.applicationOpens).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                                          year: 'numeric',
                                                          month: 'short',
                                                          day: 'numeric'
                                                        })
                                                      : (language === 'en' ? 'Not specified' : 'Non spécifié')
                                                    }
                                                  </span>
                                                </div>
                                              </div>
                                              
                                              <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                                                  <Clock className="w-3 h-3 text-red-600" />
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                  <span className="font-medium">{language === 'en' ? 'Closes:' : 'Fermeture:'}</span>
                                                  <span className="ml-1">
                                                    {nextPeriod.applicationCloses 
                                                      ? new Date(nextPeriod.applicationCloses).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                                          year: 'numeric',
                                                          month: 'short',
                                                          day: 'numeric'
                                                        })
                                                      : (language === 'en' ? 'Not specified' : 'Non spécifié')
                                                    }
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {/* Apply button */}
                                            <button 
                                              className={`w-full mt-3 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${
                                                isOpen 
                                                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                  : isClosingSoon
                                                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                              }`}
                                              disabled={!isOpen && !isClosingSoon}
                                            >
                                              {isOpen ? (
                                                <>
                                                  <ExternalLink className="w-3 h-3" />
                                                  {language === 'en' ? 'Apply Now' : 'Postuler maintenant'}
                                                </>
                                              ) : isClosingSoon ? (
                                                <>
                                                  <Clock className="w-3 h-3" />
                                                  {language === 'en' ? 'Apply Quickly' : 'Postuler rapidement'}
                                                </>
                                              ) : (
                                                <>
                                                  <Calendar className="w-3 h-3" />
                                                  {language === 'en' ? 'Not Available' : 'Non disponible'}
                                                </>
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Enhanced Actions */}
                                    <div className="space-y-3">
                                      {/* Main Actions Row */}
                                      <div className="flex gap-2">
                                        <Link
                                          to={`/establishments/${establishment.slug}`}
                                          className="flex-1 bg-blue-800 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors"
                                        >
                                          <Eye className="w-4 h-4" />
                                          {language === 'en' ? 'View Details' : 'Voir les détails'}
                                        </Link>
                                        <HeartButton 
                                          type="establishment"
                                          id={establishment.id}
                                          isShortlisted={true}
                                          className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold flex items-center justify-center"
                                          language={language}
                                        />
                                      </div>
                                      
                                      {/* Secondary Actions Row */}
                                      <div className="flex gap-2">
                                        {establishment.freeApplications > 0 && (
                                          <div 
                                            className={`flex-1 text-white py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                                              establishment.universityType === 'A' 
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                                            }`}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              // Handle apply
                                            }}
                                          >
                                            <Zap className="w-4 h-4" />
                                            {establishment.universityType === 'A' 
                                              ? (language === 'en' ? 'FREE APPLY' : 'CANDIDATURE GRATUITE')
                                              : (language === 'en' ? 'APPLY' : 'CANDIDATURE')
                                            }
                                          </div>
                                        )}
                                        <div 
                                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            // Handle contact advisor
                                          }}
                                        >
                                          <MessageCircle className="w-4 h-4" />
                                          {language === 'en' ? 'Contact Advisor' : 'Contacter un Conseiller'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {language === 'en' ? 'No Universities Yet' : 'Aucune Université'}
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {language === 'en' ? 'Start exploring universities to add them to your shortlist' : 'Commencez à explorer les universités pour les ajouter à votre liste de souhaits'}
                              </p>
                              <Link
                                to="/establishments"
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Search className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Explore Universities' : 'Explorer les Universités'}
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}

      <DocumentModal
        isOpen={documentModal.isOpen}
        onClose={() => setDocumentModal({ isOpen: false, document: null })}
        onSave={handleUploadDocument}
        document={documentModal.document}
        language={language}
      />

      <DocumentUploadModal
        isOpen={documentUploadModal.isOpen}
        onClose={() => setDocumentUploadModal({ isOpen: false, categoryId: '', typeId: '' })}
        categoryId={documentUploadModal.categoryId}
        typeId={documentUploadModal.typeId}
        language={language}
        onDocumentUploaded={handleDocumentUploaded}
      />

      <ApplicationModal
        isOpen={applicationModal.isOpen}
        onClose={() => setApplicationModal({ isOpen: false, application: null })}
        onSave={handleAddApplication}
        application={applicationModal.application}
        language={language}
      />


      {/* Translation Modal */}
      <TranslationModal
        isOpen={showTranslationModal}
        onClose={() => setShowTranslationModal(false)}
        service={{
          id: 'document_translation',
          name: 'Official Document Translation',
          nameFr: 'Traduction de Documents Officiels',
          icon: '📄',
          color: 'bg-purple-500'
        }}
        language={language}
        onTranslationRequest={handleNewTranslation}
      />
    </>
  );
};

export default StudentProfileUpdated;

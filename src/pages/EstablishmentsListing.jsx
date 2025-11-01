import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Users, BookOpen, Globe, Filter, ChevronDown, ChevronUp, X, Heart, Eye, Calendar, Award, Building2, TrendingUp, CheckCircle, ExternalLink, SlidersHorizontal, Bell, Grid, List, MessageCircle, Zap, Bot, Sparkles, ChevronLeft, ChevronRight, GraduationCap, DollarSign, Home, Trophy, Phone, Languages, FileText, Mic, PenTool, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import HeaderAuth from '../components/HeaderAuth';
import establishmentService from '../services/establishmentService';
import programService from '../services/programService';
import SelectSearchable from '../components/ui/SelectSearchable';
import MultiSelect from '../components/ui/MultiSelect';
import CountryMultiSelect from '../components/profile/CountryMultiSelect';
import SubjectMultiSelect from '../components/profile/SubjectMultiSelect';
import FieldMultiSelect from '../components/ui/FieldMultiSelect';
import GradeInput from '../components/ui/GradeInput';
import { gradeConversionService } from '../services/gradeConversionService';
import { useCurrency } from '../contexts/CurrencyContext';
import parameterService from '../services/parameterService';
import { useAllParameters } from '../hooks/useAllParameters';
import HeartButton from '../components/HeartButton';
import { useShortlist } from '../hooks/useShortlist';

// Mapping between SubjectMultiSelect IDs and database values
const subjectMapping = {
  'computer-science': 'Computer Science',
  'business-administration': 'Business',
  'engineering': 'Engineering',
  'medicine': 'Medicine',
  'law': 'Law',
  'economics': 'Economics',
  'finance': 'Finance',
  'psychology': 'Psychology',
  'education': 'Education',
  'arts': 'Arts',
  'sciences': 'Sciences',
  'philosophy': 'Philosophy',
  'nursing': 'Nursing',
  'pharmacy': 'Pharmacy',
  'dentistry': 'Dentistry',
  'veterinary': 'Veterinary Science',
  'agriculture': 'Agriculture',
  'environmental-science': 'Environmental Science',
  'geology': 'Geology',
  'astronomy': 'Astronomy',
  'mathematics': 'Mathematics',
  'physics': 'Physics',
  'chemistry': 'Chemistry',
  'biology': 'Biology',
  'accounting': 'Accounting',
  'marketing': 'Marketing',
  'management': 'Management',
  'international-business': 'International Business',
  'entrepreneurship': 'Entrepreneurship',
  'human-resources': 'Human Resources',
  'supply-chain': 'Supply Chain Management',
  'literature': 'Literature',
  'history': 'History',
  'languages': 'Languages',
  'linguistics': 'Linguistics',
  'art': 'Art',
  'music': 'Music',
  'theater': 'Theater',
  'film': 'Film Studies',
  'design': 'Design',
  'architecture': 'Architecture',
  'journalism': 'Journalism',
  'communication': 'Communication',
  'sociology': 'Sociology',
  'anthropology': 'Anthropology',
  'political-science': 'Political Science',
  'international-relations': 'International Relations',
  'criminology': 'Criminology',
  'social-work': 'Social Work',
  'public-administration': 'Public Administration',
  'urban-planning': 'Urban Planning',
  'geography': 'Geography',
  'tourism': 'Tourism',
  'hospitality': 'Hospitality',
  'culinary-arts': 'Culinary Arts',
  'fashion': 'Fashion',
  'sports': 'Sports',
  'kinesiology': 'Kinesiology',
  'nutrition': 'Nutrition',
  'forestry': 'Forestry',
  'marine-science': 'Marine Science',
  'aviation': 'Aviation',
  'transportation': 'Transportation',
  'logistics': 'Logistics',
  'information-technology': 'Information Technology',
  'cybersecurity': 'Cybersecurity',
  'data-science': 'Data Science',
  'artificial-intelligence': 'Artificial Intelligence',
  'robotics': 'Robotics',
  'biotechnology': 'Biotechnology',
  'nanotechnology': 'Nanotechnology',
  'renewable-energy': 'Renewable Energy',
  'sustainable-development': 'Sustainable Development',
  'public-health': 'Public Health',
  'epidemiology': 'Epidemiology',
  'global-health': 'Global Health',
  'mental-health': 'Mental Health',
  'occupational-therapy': 'Occupational Therapy',
  'physical-therapy': 'Physical Therapy',
  'speech-therapy': 'Speech Therapy',
  'radiology': 'Radiology',
  'pathology': 'Pathology',
  'oncology': 'Oncology',
  'cardiology': 'Cardiology',
  'neurology': 'Neurology',
  'pediatrics': 'Pediatrics',
  'geriatrics': 'Geriatrics',
  'emergency-medicine': 'Emergency Medicine',
  'surgery': 'Surgery',
  'anesthesiology': 'Anesthesiology',
  'dermatology': 'Dermatology',
  'ophthalmology': 'Ophthalmology',
  'otolaryngology': 'Otolaryngology',
  'urology': 'Urology',
  'gynecology': 'Gynecology',
  'orthopedics': 'Orthopedics',
  'plastic-surgery': 'Plastic Surgery',
  'cosmetic-surgery': 'Cosmetic Surgery',
  'veterinary-medicine': 'Veterinary Medicine',
  'animal-science': 'Animal Science',
  'food-science': 'Food Science',
  'nutrition-science': 'Nutrition Science',
  'exercise-science': 'Exercise Science',
  'sports-medicine': 'Sports Medicine',
  'rehabilitation-science': 'Rehabilitation Science',
  'therapeutic-recreation': 'Therapeutic Recreation',
  'recreation-management': 'Recreation Management',
  'event-management': 'Event Management',
  'project-management': 'Project Management',
  'quality-management': 'Quality Management',
  'risk-management': 'Risk Management',
  'crisis-management': 'Crisis Management',
  'change-management': 'Change Management',
  'knowledge-management': 'Knowledge Management',
  'information-management': 'Information Management',
  'database-management': 'Database Management',
  'network-management': 'Network Management',
  'system-management': 'System Management',
  'security-management': 'Security Management',
  'compliance-management': 'Compliance Management',
  'regulatory-affairs': 'Regulatory Affairs',
  'legal-studies': 'Legal Studies',
  'paralegal': 'Paralegal',
  'court-reporting': 'Court Reporting',
  'forensic-science': 'Forensic Science',
  'criminal-justice': 'Criminal Justice',
  'law-enforcement': 'Law Enforcement',
  'corrections': 'Corrections',
  'probation': 'Probation',
  'parole': 'Parole',
  'victim-services': 'Victim Services',
  'juvenile-justice': 'Juvenile Justice',
  'restorative-justice': 'Restorative Justice',
  'mediation': 'Mediation',
  'arbitration': 'Arbitration',
  'conflict-resolution': 'Conflict Resolution',
  'peace-studies': 'Peace Studies',
  'international-law': 'International Law',
  'human-rights': 'Human Rights',
  'environmental-law': 'Environmental Law',
  'health-law': 'Health Law',
  'business-law': 'Business Law',
  'corporate-law': 'Corporate Law',
  'tax-law': 'Tax Law',
  'intellectual-property': 'Intellectual Property',
  'patent-law': 'Patent Law',
  'copyright-law': 'Copyright Law',
  'trademark-law': 'Trademark Law',
  'entertainment-law': 'Entertainment Law',
  'sports-law': 'Sports Law',
  'immigration-law': 'Immigration Law',
  'family-law': 'Family Law',
  'estate-planning': 'Estate Planning',
  'real-estate-law': 'Real Estate Law',
  'construction-law': 'Construction Law',
  'labor-law': 'Labor Law',
  'employment-law': 'Employment Law',
  'workers-compensation': 'Workers Compensation',
  'disability-law': 'Disability Law',
  'elder-law': 'Elder Law',
  'education-law': 'Education Law',
  'student-affairs': 'Student Affairs',
  'academic-affairs': 'Academic Affairs',
  'institutional-research': 'Institutional Research',
  'assessment': 'Assessment',
  'evaluation': 'Evaluation',
  'measurement': 'Measurement',
  'statistics': 'Statistics',
  'research-methods': 'Research Methods',
  'qualitative-research': 'Qualitative Research',
  'quantitative-research': 'Quantitative Research',
  'mixed-methods': 'Mixed Methods',
  'action-research': 'Action Research',
  'participatory-research': 'Participatory Research',
  'community-based-research': 'Community Based Research',
  'applied-research': 'Applied Research',
  'basic-research': 'Basic Research',
  'translational-research': 'Translational Research',
  'clinical-research': 'Clinical Research',
  'biomedical-research': 'Biomedical Research',
  'pharmaceutical-research': 'Pharmaceutical Research',
  'drug-development': 'Drug Development',
  'clinical-trials': 'Clinical Trials',
  'pharmacovigilance': 'Pharmacovigilance',
  'pharmacoeconomics': 'Pharmacoeconomics',
  'pharmacoepidemiology': 'Pharmacoepidemiology',
  'pharmacogenomics': 'Pharmacogenomics',
  'pharmacokinetics': 'Pharmacokinetics',
  'pharmacodynamics': 'Pharmacodynamics',
  'pharmacology': 'Pharmacology',
  'toxicology': 'Toxicology',
  'pharmaceutical-sciences': 'Pharmaceutical Sciences',
  'pharmaceutical-chemistry': 'Pharmaceutical Chemistry',
  'pharmaceutical-analysis': 'Pharmaceutical Analysis',
  'pharmaceutical-technology': 'Pharmaceutical Technology',
  'pharmaceutical-engineering': 'Pharmaceutical Engineering',
  'pharmaceutical-manufacturing': 'Pharmaceutical Manufacturing',
  'pharmaceutical-quality': 'Pharmaceutical Quality',
  'pharmaceutical-regulatory': 'Pharmaceutical Regulatory',
  'pharmaceutical-marketing': 'Pharmaceutical Marketing',
  'pharmaceutical-sales': 'Pharmaceutical Sales',
  'pharmaceutical-management': 'Pharmaceutical Management',
  'pharmaceutical-administration': 'Pharmaceutical Administration',
  'pharmaceutical-policy': 'Pharmaceutical Policy',
  'pharmaceutical-economics': 'Pharmaceutical Economics',
  'pharmaceutical-law': 'Pharmaceutical Law',
  'pharmaceutical-ethics': 'Pharmaceutical Ethics',
  'pharmaceutical-communication': 'Pharmaceutical Communication',
  'pharmaceutical-education': 'Pharmaceutical Education',
  'pharmaceutical-training': 'Pharmaceutical Training',
  'pharmaceutical-development': 'Pharmaceutical Development',
  'pharmaceutical-innovation': 'Pharmaceutical Innovation',
  'pharmaceutical-entrepreneurship': 'Pharmaceutical Entrepreneurship',
  'pharmaceutical-consulting': 'Pharmaceutical Consulting',
  'pharmaceutical-advocacy': 'Pharmaceutical Advocacy',
  'pharmaceutical-outcomes': 'Pharmaceutical Outcomes',
  'pharmaceutical-effectiveness': 'Pharmaceutical Effectiveness',
  'pharmaceutical-safety': 'Pharmaceutical Safety',
  'pharmaceutical-efficacy': 'Pharmaceutical Efficacy',
  'pharmaceutical-quality-assurance': 'Pharmaceutical Quality Assurance',
  'pharmaceutical-quality-control': 'Pharmaceutical Quality Control',
  'pharmaceutical-compliance': 'Pharmaceutical Compliance',
  'pharmaceutical-auditing': 'Pharmaceutical Auditing',
  'pharmaceutical-inspection': 'Pharmaceutical Inspection',
  'pharmaceutical-certification': 'Pharmaceutical Certification',
  'pharmaceutical-accreditation': 'Pharmaceutical Accreditation',
  'pharmaceutical-licensing': 'Pharmaceutical Licensing',
  'pharmaceutical-approval': 'Pharmaceutical Approval',
  'pharmaceutical-clearance': 'Pharmaceutical Clearance',
  'pharmaceutical-authorization': 'Pharmaceutical Authorization',
  'pharmaceutical-permission': 'Pharmaceutical Permission',
  'pharmaceutical-consent': 'Pharmaceutical Consent',
  'pharmaceutical-agreement': 'Pharmaceutical Agreement',
  'pharmaceutical-contract': 'Pharmaceutical Contract',
  'pharmaceutical-partnership': 'Pharmaceutical Partnership',
  'pharmaceutical-collaboration': 'Pharmaceutical Collaboration',
  'pharmaceutical-cooperation': 'Pharmaceutical Cooperation',
  'pharmaceutical-coordination': 'Pharmaceutical Coordination',
  'pharmaceutical-integration': 'Pharmaceutical Integration',
  'pharmaceutical-synergy': 'Pharmaceutical Synergy',
  'pharmaceutical-alliance': 'Pharmaceutical Alliance',
  'pharmaceutical-consortium': 'Pharmaceutical Consortium',
  'pharmaceutical-network': 'Pharmaceutical Network',
  'pharmaceutical-community': 'Pharmaceutical Community',
  'pharmaceutical-society': 'Pharmaceutical Society',
  'pharmaceutical-association': 'Pharmaceutical Association',
  'pharmaceutical-organization': 'Pharmaceutical Organization',
  'pharmaceutical-institution': 'Pharmaceutical Institution',
  'pharmaceutical-academy': 'Pharmaceutical Academy',
  'pharmaceutical-institute': 'Pharmaceutical Institute',
  'pharmaceutical-center': 'Pharmaceutical Center',
  'pharmaceutical-facility': 'Pharmaceutical Facility',
  'pharmaceutical-laboratory': 'Pharmaceutical Laboratory',
  'pharmaceutical-clinic': 'Pharmaceutical Clinic',
  'pharmaceutical-hospital': 'Pharmaceutical Hospital',
  'pharmaceutical-pharmacy': 'Pharmaceutical Pharmacy',
  'pharmaceutical-dispensary': 'Pharmaceutical Dispensary',
  'pharmaceutical-warehouse': 'Pharmaceutical Warehouse',
  'pharmaceutical-distribution': 'Pharmaceutical Distribution',
  'pharmaceutical-logistics': 'Pharmaceutical Logistics',
  'pharmaceutical-supply-chain': 'Pharmaceutical Supply Chain',
  'pharmaceutical-procurement': 'Pharmaceutical Procurement',
  'pharmaceutical-sourcing': 'Pharmaceutical Sourcing',
  'pharmaceutical-purchasing': 'Pharmaceutical Purchasing',
  'pharmaceutical-buying': 'Pharmaceutical Buying',
  'pharmaceutical-acquisition': 'Pharmaceutical Acquisition'
};

// Function to map SubjectMultiSelect IDs to database values
const mapSubjectToDatabase = (subjectId) => {
  if (!subjectId || typeof subjectId !== 'string') {
    return '';
  }
  return subjectMapping[subjectId] || subjectId;
};

// Function to map database values to SubjectMultiSelect IDs
const mapDatabaseToSubject = (databaseValue) => {
  const entry = Object.entries(subjectMapping).find(([id, value]) => value === databaseValue);
  return entry ? entry[0] : databaseValue;
};

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
  
  // Only use structured requirements - no fallback to deprecated requirements array
  
  // Check program-specific exam fields
  if (program.oralExam) requirements.hasInterview = true;
  if (program.writtenExam) requirements.hasWrittenTest = true;
  
  
  return requirements;
};

// Function to analyze intake status
const analyzeIntakeStatus = (intake) => {
  if (!intake.applicationOpens || !intake.applicationCloses) {
    return { status: 'no-dates', color: 'gray', text: 'No dates available' };
  }
  
  const now = new Date();
  const opensDate = new Date(intake.applicationOpens);
  const closesDate = new Date(intake.applicationCloses);
  
  // Check if application is open
  if (now >= opensDate && now <= closesDate) {
    // Check if closing soon (within 30 days)
    const daysUntilClose = Math.ceil((closesDate - now) / (1000 * 60 * 60 * 24));
    if (daysUntilClose <= 30) {
      return { status: 'closing-soon', color: 'red', text: `Closes in ${daysUntilClose} days` };
    }
    return { status: 'open', color: 'green', text: 'Open' };
  }
  
  // Check if not yet open
  if (now < opensDate) {
    const daysUntilOpen = Math.ceil((opensDate - now) / (1000 * 60 * 60 * 24));
    return { status: 'not-open', color: 'blue', text: `Opens in ${daysUntilOpen} days` };
  }
  
  // Application is closed
  return { status: 'closed', color: 'gray', text: 'Closed' };
};

// Function to find the next application period
const findNextIntake = (multiIntakes) => {
  if (!multiIntakes || multiIntakes.length === 0) return null;
  
  const now = new Date();
  const validIntakes = multiIntakes.filter(intake => 
    intake.applicationOpens && intake.applicationCloses
  );
  
  if (validIntakes.length === 0) return null;
  
  // Sort by opening date
  const sortedIntakes = validIntakes.sort((a, b) => 
    new Date(a.applicationOpens) - new Date(b.applicationOpens)
  );
  
  // Find the next intake (either currently open or future)
  const nextIntake = sortedIntakes.find(intake => {
    const opensDate = new Date(intake.applicationOpens);
    const closesDate = new Date(intake.applicationCloses);
    return now <= closesDate; // Not yet closed
  });
  
  return nextIntake || null;
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

const EstablishmentsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [language, setLanguage] = useState('en');
  const [showFilters, setShowFilters] = useState(true);
  const { userCurrency, formatPrice, convertPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('programs'); // 'establishments' or 'programs'
  const [selectedFilters, setSelectedFilters] = useState({
    country: [],
    city: [],
    studyLevel: [],
    degree: [],
    subject: [],
    field: [],
    intake: [],
    studyType: [],
    universityType: [],
    nationality: '',
    residenceCountry: '',
    academicQualification: '',
    englishTest: '',
    standardizedTest: '',
    waiver: false,
    // New filters
    requiresAcademicQualification: null, // null, true, false
    academicQualifications: [],
    minimumGrade: '',
    gradeSystem: '', // Empty by default to avoid sending in payload
  });
  const [paramOptions, setParamOptions] = useState({ studyLevels: [], studyTypes: [] });
  const [expandedSections, setExpandedSections] = useState({
    studentDetails: true,
    studyPreference: true,
    detailedFilters: false
  });
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true);
  
  // Function to format price with currency conversion
  const formatPriceWithConversion = async (amount, currency) => {
    try {
      return await formatPrice(amount, currency, false);
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${currency} ${(amount ?? 0).toLocaleString()}`;
    }
  };

  // Component to display price without loading state
  const PriceWithLoading = ({ amount, currency, className = "" }) => {
    const safeAmount = amount ?? 0;
    const [displayPrice, setDisplayPrice] = useState(`${currency} ${safeAmount.toLocaleString()}`);
    
    useEffect(() => {
      const updatePrice = async () => {
        try {
          const converted = await formatPriceWithConversion(safeAmount, currency);
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
        '$': 'USD',
        '€': 'EUR',
        '£': 'GBP',
        '¥': 'JPY',
        'A$': 'AUD',
        'C$': 'CAD',
        'CHF': 'CHF',
        'MAD': 'MAD',
        'AED': 'AED',
        'SAR': 'SAR',
        'EGP': 'EGP',
        'ZAR': 'ZAR',
        'S$': 'SGD',
        'HK$': 'HKD',
        'NZ$': 'NZD',
        'kr': 'SEK',
        'zł': 'PLN',
        'Kč': 'CZK',
        'Ft': 'HUF',
        'lei': 'RON',
        'лв': 'BGN',
        'kn': 'HRK',
        'дин': 'RSD',
        '₺': 'TRY',
        '₽': 'RUB',
        '₴': 'UAH',
        '₪': 'ILS',
        'QR': 'QAR',
        'KD': 'KWD',
        'BD': 'BHD',
        'OMR': 'OMR',
        'JD': 'JOD',
        'L£': 'LBP',
        '₨': 'PKR',
        '৳': 'BDT',
        'Rs': 'LKR',
        '؋': 'AFN',
        '฿': 'THB',
        '₫': 'VND',
        'Rp': 'IDR',
        'RM': 'MYR',
        '₱': 'PHP',
        'NT$': 'TWD',
        'S/': 'PEN',
        '$U': 'UYU',
        '₲': 'PYG',
        'Bs': 'BOB',
        'Bs.S': 'VES',
        'G$': 'GYD',
        'د.ج': 'DZD',
        'د.ت': 'TND',
        'ل.د': 'LYD',
        'ج.س': 'SDG',
        'Br': 'ETB',
        'KSh': 'KES',
        'USh': 'UGX',
        'TSh': 'TZS',
        '₵': 'GHS',
        '₦': 'NGN',
        'P': 'BWP',
        'N$': 'NAD',
        'Z$': 'ZWL',
        'ZK': 'ZMW',
        'MK': 'MWK',
        'MT': 'MZN',
        'Kz': 'AOA',
        'FCFA': 'XAF',
        'CFA': 'XOF',
        'FC': 'CDF',
        'Db': 'STN',
        'FG': 'GNF',
        'Le': 'SLE',
        'L$': 'LRD',
        'D': 'GMD',
        'UM': 'MRU',
        'CF': 'KMF',
        'Ar': 'MGA',
        'L': 'LSL',
        '₾': 'GEL',
        '֏': 'AMD',
        '₼': 'AZN',
        '₸': 'KZT',
        'лв': 'KGS',
        'SM': 'TJS',
        'T': 'TMT',
        'Rf': 'MVR',
        'K': 'MMK',
        '₭': 'LAK',
        '៛': 'KHR',
        'B$': 'BND',
        'MOP$': 'MOP',
        '₮': 'MNT',
        '₩': 'KRW',
        '﷼': 'YER',
        'ع.د': 'IQD',
        'IRR': 'IRR',
        '£': 'SYP',
        'kr': 'ISK',
        'L': 'ALL',
        'ден': 'MKD',
        'КМ': 'BAM'
      };
      currency = symbolMap[symbol] || 'USD';
    }
    
    return { amount, currency };
  };

  // Component to display converted price
  const PriceDisplay = ({ amount, currency, className = "", id = "" }) => {
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
  const PriceDisplayFromString = ({ priceString, className = "", id = "" }) => {
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
  
  // Dynamic data states
  const [establishments, setEstablishments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Parameters for localization
  const [parameters, setParameters] = useState({
    countries: [],
    cities: [],
    languages: [],
    schoolTypes: [],
    degrees: []
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15, // Multiple of 3 for better grid display
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [availableFilters, setAvailableFilters] = useState({
    countries: [],
    cities: [],
    types: [],
    universityTypes: [],
    languages: []
  });
  const [programFilters, setProgramFilters] = useState({
    countries: [],
    cities: [],
    degrees: [],
    studyLevels: [],
    subjects: [],
    languages: [],
    studyTypes: [],
    universityTypes: []
  });
  
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
    const result = getParameterLabel('degrees', degreeCode, language);
    return result;
  };

  const getSchoolTypeLabel = (typeCode) => {
    return getParameterLabel('schoolTypes', typeCode, language);
  };
  
  // University type utility functions
  const getUniversityTypeInfo = (establishment) => {
    const { universityType, countrySpecific, commissionRate, freeApplications, visaSupport, servicePricing } = establishment;
    
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
      icon: "❓",
      description: language === 'fr' ? "Type d'université inconnu" : "Unknown university type",
      freeApps: 0,
      visaSupport: language === 'fr' ? "Inconnu" : "Unknown",
      serviceFees: language === 'fr' ? "Inconnu" : "Unknown"
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
  
  // Detailed filters state
  const [detailedFilters, setDetailedFilters] = useState({
    awardingBoard: '',
    grade: '',
    gradeType: '', // Start with empty value to show placeholder
    englishTest: '',
    englishScore: '',
    standardizedTest: '',
    standardizedScore: '',
    studyGap: '',
    minFees: 0,
    maxFees: 300000,
    // New choice field filters
    languageTestFilter: null,
    standardizedTestFilter: null,
    scholarshipFilter: null,
    housingFilter: null,
    rankingFilter: null,
    featuredFilter: null
  });

  // Temporary fee filters for Apply button
  const [tempFeeFilters, setTempFeeFilters] = useState({
    minFees: 0,
    maxFees: 300000
  });


  // Initialize temp fee filters with current detailed filters
  useEffect(() => {
    setTempFeeFilters({
      minFees: detailedFilters.minFees,
      maxFees: detailedFilters.maxFees
    });
  }, [detailedFilters.minFees, detailedFilters.maxFees]);


  // Handle URL parameters for university filtering
  useEffect(() => {
    const universityParam = searchParams.get('university');
    if (universityParam) {
      setSearchQuery(universityParam);
      setActiveTab('programs'); // Switch to programs tab when filtering by university
    }
  }, [searchParams]);

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && (tabParam === 'establishments' || tabParam === 'programs')) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Function to handle tab change and update URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tab);
    setSearchParams(newSearchParams);
  };

  // Load establishments data
  const loadEstablishments = async (filters = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await establishmentService.getEstablishments({
        ...filters,
        page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setEstablishments(response.data);
        setPagination(response.pagination);
        
      } else {
        setError('Failed to load establishments');
      }
    } catch (err) {
      setError(err.message || 'Failed to load establishments');
    } finally {
      setLoading(false);
    }
  };

  // Load programs data
  const loadPrograms = async (filters = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await programService.getPrograms({
        ...filters,
        status: 'published',
        page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setPrograms(response.data);
        setPagination(response.pagination);
        
      } else {
        setError('Failed to load programs');
      }
    } catch (err) {
      setError(err.message || 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  // Load all parameters using centralized service
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();

  // Fonction pour obtenir le drapeau correspondant à une langue
  const getLanguageFlag = (languageCode) => {
    const flagMap = {
      'English': '🇺🇸',
      'French': '🇫🇷',
      'Spanish': '🇪🇸',
      'German': '🇩🇪',
      'Italian': '🇮🇹',
      'Portuguese': '🇵🇹',
      'Arabic': '🇸🇦',
      'Chinese': '🇨🇳',
      'Japanese': '🇯🇵',
      'Korean': '🇰🇷',
      'en': '🇺🇸',
      'fr': '🇫🇷',
      'es': '🇪🇸',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ar': '🇸🇦',
      'zh': '🇨🇳',
      'ja': '🇯🇵',
      'ko': '🇰🇷'
    };
    return flagMap[languageCode] || '🌐';
  };

  // Load filters from centralized parameters
  const loadFiltersFromParameters = (params, currentLanguage) => {
    if (params) {
      // Map parameters to the correct format for filters
      const mapParameterToFilter = (param) => ({
        value: param.code,
        label: currentLanguage === 'fr' ? (param.labelFr || param.labelEn) : param.labelEn
      });

      // Set establishment filters from parameters
      const mappedCountries = (params.countries || []).map(mapParameterToFilter);
      const mappedCities = (params.cities || []).map(mapParameterToFilter);
      const mappedTypes = (params.schoolTypes || []).map(mapParameterToFilter);
      const mappedUniversityTypes = (params.universityTypes || []).map(mapParameterToFilter);
      const mappedLanguages = (params.languages || []).map(param => ({
        value: param.code,
        label: currentLanguage === 'fr' ? (param.labelFr || param.labelEn) : param.labelEn,
        labelFr: param.labelFr,
        flag: getLanguageFlag(param.code)
      }));
      
      setAvailableFilters({
        countries: mappedCountries,
        cities: mappedCities,
        types: mappedTypes,
        universityTypes: mappedUniversityTypes,
        languages: mappedLanguages
      });
      
      // Set program filters from parameters
      const mappedProgramCountries = (params.countries || []).map(mapParameterToFilter);
      const mappedProgramCities = (params.cities || []).map(mapParameterToFilter);
      const mappedDegrees = (params.degrees || []).map(mapParameterToFilter);
      const mappedStudyLevels = (params.studyLevels || []).map(mapParameterToFilter);
      const mappedSubjects = (params.fields || []).map(mapParameterToFilter);
      const mappedProgramLanguages = (params.languages || []).map(param => ({
        value: param.code,
        label: currentLanguage === 'fr' ? (param.labelFr || param.labelEn) : param.labelEn,
        labelFr: param.labelFr,
        flag: getLanguageFlag(param.code)
      }));
      const mappedStudyTypes = (params.studyTypes || []).map(mapParameterToFilter);
      const mappedProgramUniversityTypes = (params.universityTypes || []).map(mapParameterToFilter);
      
      setProgramFilters({
        countries: mappedProgramCountries,
        cities: mappedProgramCities,
        degrees: mappedDegrees,
        studyLevels: mappedStudyLevels,
        subjects: mappedSubjects,
        languages: mappedProgramLanguages,
        studyTypes: mappedStudyTypes,
        universityTypes: mappedProgramUniversityTypes
      });
    }
  };

  // Load filters when parameters are available
  useEffect(() => {
    if (allParams && !paramsLoading) {
      // Load filters from parameters first
      loadFiltersFromParameters(allParams, language);
      
      // Set parameters for other uses
      setParameters({
        countries: allParams.countries,
        cities: allParams.cities,
        languages: allParams.languages,
        schoolTypes: allParams.schoolTypes,
        degrees: allParams.degrees
      });
      
      // Set param options directly from allParams
      const studyLevels = (allParams.studyLevels || []).map(i => ({ 
        value: i.code, 
        label: language === 'fr' ? (i.labelFr || i.labelEn) : i.labelEn 
      }));
      const studyTypes = (allParams.studyTypes || []).map(i => ({ 
        value: i.code, 
        label: language === 'fr' ? (i.labelFr || i.labelEn) : i.labelEn 
      }));
      
      setParamOptions({ 
        studyLevels, 
        studyTypes 
      });

      // Load grade types from parameters
      const gradeTypes = (allParams.gradeSystems || []).map(type => ({
        value: type.code,
        label: language === 'fr' ? type.labelFr : type.labelEn
      }));
      setGradeTypes(gradeTypes);

      // Load English tests from parameters
      const englishTests = (allParams.englishTests || []).map(test => ({
        value: test.code,
        label: language === 'fr' ? test.labelFr : test.labelEn,
        range: getTestRange(test.code),
        steps: getTestSteps(test.code)
      }));
      setEnglishTests(englishTests);

      // Load standardized tests from parameters
      const standardizedTests = (allParams.standardizedTests || []).map(test => ({
        value: test.code,
        label: language === 'fr' ? test.labelFr : test.labelEn,
        range: getStandardizedTestRange(test.code),
        steps: getStandardizedTestSteps(test.code)
      }));
      setStandardizedTests(standardizedTests);
    }
  }, [allParams]);

  // Update labels when language changes (without reloading parameters)
  useEffect(() => {
    if (allParams) {
      // Use the already mapped filters
      setParamOptions({ 
        studyLevels: programFilters.studyLevels || [], 
        studyTypes: programFilters.studyTypes || [] 
      });

      // Update grade types labels
      const gradeTypes = (allParams.gradeSystems || []).map(type => ({
        value: type.code,
        label: language === 'fr' ? type.labelFr : type.labelEn
      }));
      setGradeTypes(gradeTypes);

      // Update English tests labels
      const englishTests = (allParams.englishTests || []).map(test => ({
        value: test.code,
        label: language === 'fr' ? test.labelFr : test.labelEn,
        range: getTestRange(test.code),
        steps: getTestSteps(test.code)
      }));
      setEnglishTests(englishTests);

      // Update standardized tests labels
      const standardizedTests = (allParams.standardizedTests || []).map(test => ({
        value: test.code,
        label: language === 'fr' ? test.labelFr : test.labelEn,
        range: getStandardizedTestRange(test.code),
        steps: getStandardizedTestSteps(test.code)
      }));
      setStandardizedTests(standardizedTests);
    }
  }, [language, allParams]);

  // Load data when filters or search query change (with debouncing)
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      const buildFilters = async () => {
        const filters = {
          country: selectedFilters.country,
          city: selectedFilters.city,
          studyLevel: selectedFilters.studyLevel,
          degree: selectedFilters.degree,
          intake: selectedFilters.intake,
          studyType: selectedFilters.studyType,
          universityType: selectedFilters.universityType,
          subject: selectedFilters.subject.filter(s => s && String(s).trim() !== '').map(mapSubjectToDatabase), // Map subject IDs to database values
          field: selectedFilters.field.map(f => f.code), // Map field objects to codes
          search: searchQuery,
          // New filters
          requiresAcademicQualification: selectedFilters.requiresAcademicQualification,
          academicQualifications: selectedFilters.academicQualifications,
          minimumGrade: selectedFilters.minimumGrade,
          // Only include gradeSystem if it has a value
          ...(selectedFilters.gradeSystem && { gradeSystem: selectedFilters.gradeSystem }),
          // No test filters
          // Include choice filters if they have a value
          ...(detailedFilters.languageTestFilter && { languageTestFilter: detailedFilters.languageTestFilter }),
          ...(detailedFilters.standardizedTestFilter && { standardizedTestFilter: detailedFilters.standardizedTestFilter }),
          ...(detailedFilters.scholarshipFilter && { scholarshipFilter: detailedFilters.scholarshipFilter }),
          ...(detailedFilters.housingFilter && { housingFilter: detailedFilters.housingFilter }),
          ...(detailedFilters.rankingFilter && { rankingFilter: detailedFilters.rankingFilter }),
          ...(detailedFilters.featuredFilter && { featuredFilter: detailedFilters.featuredFilter }),
          // Detailed grade filters
          detailedGrade: detailedFilters.grade,
          detailedGradeType: detailedFilters.gradeType,
          // Language and standardized test filters
          englishTest: detailedFilters.englishTest,
          englishScore: detailedFilters.englishScore,
          standardizedTest: detailedFilters.standardizedTest,
          standardizedScore: detailedFilters.standardizedScore,
          // Fee filters (send as entered by user with current currency)
          minFees: detailedFilters.minFees >= 0 ? detailedFilters.minFees : null,
          maxFees: detailedFilters.maxFees >= 0 ? detailedFilters.maxFees : null,
          feeCurrency: userCurrency
        };
      
        // Remove empty filters (but keep false values for boolean filters)
        Object.keys(filters).forEach(key => {
          if (filters[key] === null || filters[key] === undefined || filters[key] === '' || 
              (Array.isArray(filters[key]) && filters[key].length === 0)) {
            delete filters[key];
          }
        });
        
        if (activeTab === 'establishments') {
          loadEstablishments(filters, 1);
        } else {
          loadPrograms(filters, 1);
        }
      };
      
      buildFilters();
    }, 300); // 300ms debounce delay
    
    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [selectedFilters, detailedFilters, searchQuery, activeTab, userCurrency]);

  // Track if we've already converted for this currency to avoid infinite loops
  const convertedCurrencyRef = useRef(null);
  
  // Debounce timer for API calls
  const debounceTimerRef = useRef(null);

  // Convert maxFees when currency changes to maintain equivalent value
  useEffect(() => {
    const convertMaxFees = async () => {
      if (userCurrency === 'USD') {
        // Reset to USD default and clear the ref
        setDetailedFilters(prev => ({
          ...prev,
          maxFees: 300000
        }));
        setTempFeeFilters(prev => ({
          ...prev,
          maxFees: 300000
        }));
        convertedCurrencyRef.current = null;
      } else if (convertedCurrencyRef.current !== userCurrency) {
        // Only convert if we haven't converted for this currency yet
        const baseMaxFeesUSD = 300000;
        try {
          const conversion = await convertPrice(baseMaxFeesUSD, 'USD');
          if (conversion && conversion.convertedAmount > 0) {
            const convertedValue = Math.round(conversion.convertedAmount);
            setDetailedFilters(prev => ({
              ...prev,
              maxFees: convertedValue
            }));
            setTempFeeFilters(prev => ({
              ...prev,
              maxFees: convertedValue
            }));
            convertedCurrencyRef.current = userCurrency;
          }
        } catch (error) {
          console.error('Error converting maxFees:', error);
        }
      }
    };

    // Add debouncing to currency conversion to avoid multiple API calls
    const timeoutId = setTimeout(() => {
      convertMaxFees();
    }, 100); // Small delay to batch currency changes

    return () => clearTimeout(timeoutId);
  }, [userCurrency]); // Only depend on userCurrency, not convertPrice

  // Handle pagination
  const handlePageChange = async (newPage) => {
    // Validate page number
    if (newPage < 1 || newPage > pagination.pages) {
      console.warn(`Invalid page number: ${newPage}. Valid range: 1-${pagination.pages}`);
      return;
    }

    // Prevent multiple simultaneous page changes
    if (loading) {
      console.warn('Page change ignored: already loading');
      return;
    }

    try {
      const filters = {
        country: selectedFilters.country,
        city: selectedFilters.city,
        studyLevel: selectedFilters.studyLevel,
        degree: selectedFilters.degree,
        intake: selectedFilters.intake,
        studyType: selectedFilters.studyType,
        universityType: selectedFilters.universityType,
        subject: selectedFilters.subject.filter(s => s && String(s).trim() !== '').map(mapSubjectToDatabase), // Map subject IDs to database values
        field: selectedFilters.field.map(f => f.code), // Map field objects to codes
        search: searchQuery,
        // New filters
        requiresAcademicQualification: selectedFilters.requiresAcademicQualification,
        academicQualifications: selectedFilters.academicQualifications,
        minimumGrade: selectedFilters.minimumGrade,
          // Only include gradeSystem if it has a value
          ...(selectedFilters.gradeSystem && { gradeSystem: selectedFilters.gradeSystem }),
          // No test filters
          // Include choice filters if they have a value
          ...(detailedFilters.languageTestFilter && { languageTestFilter: detailedFilters.languageTestFilter }),
          ...(detailedFilters.standardizedTestFilter && { standardizedTestFilter: detailedFilters.standardizedTestFilter }),
          ...(detailedFilters.scholarshipFilter && { scholarshipFilter: detailedFilters.scholarshipFilter }),
          ...(detailedFilters.housingFilter && { housingFilter: detailedFilters.housingFilter }),
          ...(detailedFilters.rankingFilter && { rankingFilter: detailedFilters.rankingFilter }),
          ...(detailedFilters.featuredFilter && { featuredFilter: detailedFilters.featuredFilter }),
          // Detailed grade filters
          detailedGrade: detailedFilters.grade,
          detailedGradeType: detailedFilters.gradeType,
          // Language and standardized test filters
          englishTest: detailedFilters.englishTest,
          englishScore: detailedFilters.englishScore,
          standardizedTest: detailedFilters.standardizedTest,
          standardizedScore: detailedFilters.standardizedScore,
        // Fee filters (send as entered by user with current currency)
        minFees: detailedFilters.minFees >= 0 ? detailedFilters.minFees : null,
        maxFees: detailedFilters.maxFees >= 0 ? detailedFilters.maxFees : null,
        feeCurrency: userCurrency
      };
      
      // Remove empty filters (but keep false values for boolean filters)
      Object.keys(filters).forEach(key => {
        if (filters[key] === null || filters[key] === undefined || filters[key] === '' || 
            (Array.isArray(filters[key]) && filters[key].length === 0)) {
          delete filters[key];
        }
      });
      
      if (activeTab === 'establishments') {
        await loadEstablishments(filters, newPage);
      } else {
        await loadPrograms(filters, newPage);
      }
    } catch (error) {
      console.error('Error during page change:', error);
      setError('Failed to load page. Please try again.');
    }
  };

  // Dynamic establishments data loaded from API
  // const establishments = [
  /*
    {
      id: 1,
      name: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      type: "Public",
      rating: 4.8,
      students: 97000,
      programs: 700,
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Utoronto_coa.svg/1200px-Utoronto_coa.svg.png",
      description: "One of Canada's leading research universities, offering world-class education in diverse fields.",
      featured: true,
      sponsored: false,
      tuition: "$6,100 - $58,160",
      tuitionRange: { min: 6100, max: 58160, currency: "USD" },
      acceptanceRate: "43%",
      worldRanking: 18,
      qsRanking: 18,
      rankings: {
        qs: 18,
        times: 22,
        arwu: 25,
        usNews: 20
      },
      popularPrograms: ["Computer Science", "Business", "Engineering"],
      applicationDeadline: "January 15, 2025",
      scholarships: true,
      housing: true,
      language: "English",
      aidvisorRecommended: true,
      easyApply: true,
      // University type information
      universityType: "A", // "A", "B", or "C"
      commissionRate: "5-15%",
      freeApplications: 3, // Number of free applications for Type A schools
      visaSupport: "free", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      }
    },
    {
      id: 2,
      name: "Sorbonne University",
      country: "France",
      city: "Paris",
      type: "Public",
      rating: 4.6,
      students: 55000,
      programs: 200,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sorbonne_University_logo.svg/1200px-Sorbonne_University_logo.svg.png",
      description: "Historic university in the heart of Paris, renowned for humanities and social sciences.",
      featured: false,
      sponsored: true,
      tuition: "€170 - €3,770",
      tuitionRange: { min: 170, max: 3770, currency: "EUR" },
      acceptanceRate: "12%",
      worldRanking: 83,
      qsRanking: 83,
      rankings: {
        qs: 83,
        times: 95,
        arwu: 78,
        usNews: 89
      },
      popularPrograms: ["Literature", "History", "Philosophy"],
      applicationDeadline: "March 1, 2025",
      scholarships: true,
      housing: false,
      language: "French",
      aidvisorRecommended: false,
      easyApply: true,
      // University type information
      universityType: "C", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // No free applications for Type C schools
      visaSupport: "paid", // "free" or "paid"
      countrySpecific: {
        type: "france", // "standard", "france", "china", "parcoursup"
        requirements: ["Campus France", "Parcoursup"]
      }
    },
    {
      id: 3,
      name: "MIT",
      country: "United States",
      city: "Cambridge",
      type: "Private",
      rating: 4.9,
      students: 12000,
      programs: 50,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png",
      description: "World-renowned institute of technology, leading in engineering and computer science.",
      featured: true,
      sponsored: false,
      tuition: "$57,986",
      tuitionRange: { min: 57986, max: 57986, currency: "USD" },
      acceptanceRate: "7%",
      worldRanking: 1,
      qsRanking: 1,
      rankings: {
        qs: 1,
        times: 2,
        arwu: 1,
        usNews: 1
      },
      popularPrograms: ["Computer Science", "Engineering", "Physics"],
      applicationDeadline: "January 1, 2025",
      scholarships: true,
      housing: true,
      language: "English",
      aidvisorRecommended: true,
      easyApply: false,
      // University type information
      universityType: "B", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // No free applications for Type B schools
      visaSupport: "paid", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      }
    },
    {
      id: 4,
      name: "University of Melbourne",
      country: "Australia",
      city: "Melbourne",
      type: "Public",
      rating: 4.7,
      students: 50000,
      programs: 300,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png",
      description: "Australia's leading research university, offering comprehensive programs across all disciplines.",
      featured: false,
      sponsored: false,
      tuition: "A$37,728 - A$64,512",
      tuitionRange: { min: 37728, max: 64512, currency: "AUD" },
      acceptanceRate: "70%",
      worldRanking: 33,
      qsRanking: 33,
      rankings: {
        qs: 33,
        times: 45,
        arwu: 35,
        usNews: 38
      },
      popularPrograms: ["Medicine", "Law", "Business"],
      applicationDeadline: "October 31, 2024",
      scholarships: true,
      housing: true,
      language: "English",
      aidvisorRecommended: true,
      easyApply: true,
      // University type information
      universityType: "A", // "A", "B", or "C"
      commissionRate: "8-12%",
      freeApplications: 3, // Number of free applications for Type A schools
      visaSupport: "free", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      }
    },
    {
      id: 5,
      name: "ETH Zurich",
      country: "Switzerland",
      city: "Zurich",
      type: "Public",
      rating: 4.8,
      students: 20000,
      programs: 100,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/ETH_Zurich_logo.svg/1200px-ETH_Zurich_logo.svg.png",
      description: "Swiss Federal Institute of Technology, world leader in science and technology.",
      featured: true,
      sponsored: false,
      tuition: "CHF 730",
      tuitionRange: { min: 730, max: 730, currency: "CHF" },
      acceptanceRate: "27%",
      worldRanking: 6,
      qsRanking: 6,
      rankings: {
        qs: 6,
        times: 8,
        arwu: 4,
        usNews: 7
      },
      popularPrograms: ["Engineering", "Computer Science", "Mathematics"],
      applicationDeadline: "December 15, 2024",
      scholarships: true,
      housing: true,
      language: "German/English",
      aidvisorRecommended: true,
      easyApply: true,
      // University type information
      universityType: "B", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // No free applications for Type B schools
      visaSupport: "paid", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      }
    },
    {
      id: 6,
      name: "University of Tokyo",
      country: "Japan",
      city: "Tokyo",
      type: "Public",
      rating: 4.5,
      students: 28000,
      programs: 150,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/University_of_Tokyo_logo.svg/1200px-University_of_Tokyo_logo.svg.png",
      description: "Japan's premier university, combining traditional values with cutting-edge research.",
      featured: false,
      sponsored: true,
      tuition: "¥535,800",
      tuitionRange: { min: 535800, max: 535800, currency: "JPY" },
      acceptanceRate: "21%",
      worldRanking: 23,
      qsRanking: 23,
      rankings: {
        qs: 23,
        times: 28,
        arwu: 20,
        usNews: 25
      },
      popularPrograms: ["Engineering", "Medicine", "Economics"],
      applicationDeadline: "January 4, 2025",
      scholarships: true,
      housing: true,
      language: "Japanese/English",
      aidvisorRecommended: false,
      easyApply: true,
      // University type information
      universityType: "B", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // No free applications for Type B schools
      visaSupport: "paid", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      }
    },
    {
      id: 7,
      name: "Tsinghua University",
      country: "China",
      city: "Beijing",
      type: "Public",
      rating: 4.6,
      students: 45000,
      programs: 200,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tsinghua_University_logo.svg/1200px-Tsinghua_University_logo.svg.png",
      description: "China's leading university, renowned for engineering and technology programs.",
      featured: true,
      sponsored: false,
      tuition: "¥26,000 - ¥40,000",
      tuitionRange: { min: 26000, max: 40000, currency: "CNY" },
      acceptanceRate: "15%",
      worldRanking: 14,
      qsRanking: 14,
      rankings: {
        qs: 14,
        times: 16,
        arwu: 12,
        usNews: 18
      },
      popularPrograms: ["Engineering", "Computer Science", "Business"],
      applicationDeadline: "December 31, 2024",
      scholarships: true,
      housing: true,
      language: "Chinese/English",
      aidvisorRecommended: true,
      easyApply: true,
      // University type information
      universityType: "C", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // No free applications for Type C schools
      visaSupport: "free", // Free visa support if accepted
      countrySpecific: {
        type: "china", // "standard", "france", "china", "parcoursup"
        requirements: ["Chinese Language Test", "Academic Records"]
      }
    }
  */
  // ];

  // Dynamic programs data loaded from API
  // const programs = [
  /*
    {
      id: 1,
      name: "Master of Computer Science",
      university: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      degree: "Master's",
      duration: "2 years",
      language: "English",
      tuition: "$58,160",
      startDate: "September 2025",
      applicationDeadline: "January 15, 2025",
      description: "Advanced program in computer science with focus on AI and machine learning.",
      requirements: ["Bachelor's in CS", "IELTS 7.0", "GRE 320+"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Utoronto_coa.svg/1200px-Utoronto_coa.svg.png",
      featured: true,
      aidvisorRecommended: true,
      easyApply: true,
      ranking: 18,
      studyType: "on-campus",
      universityType: "A"
    },
    {
      id: 2,
      name: "Bachelor of Medicine",
      university: "Sorbonne University",
      country: "France",
      city: "Paris",
      degree: "Bachelor's",
      duration: "6 years",
      language: "French",
      tuition: "€3,770",
      startDate: "September 2025",
      applicationDeadline: "March 1, 2025",
      description: "Comprehensive medical program with clinical rotations and research opportunities.",
      requirements: ["High School Diploma", "DELF B2", "Medical Entrance Exam"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sorbonne_University_logo.svg/1200px-Sorbonne_University_logo.svg.png",
      featured: false,
      aidvisorRecommended: false,
      easyApply: true,
      ranking: 83,
      studyType: "on-campus",
      universityType: "C"
    },
    {
      id: 3,
      name: "PhD in Engineering",
      university: "MIT",
      country: "United States",
      city: "Cambridge",
      degree: "PhD",
      duration: "4-5 years",
      language: "English",
      tuition: "$57,986",
      startDate: "September 2025",
      applicationDeadline: "December 15, 2024",
      description: "Research-focused doctoral program in various engineering disciplines.",
      requirements: ["Master's Degree", "TOEFL 100+", "GRE 330+", "Research Proposal"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png",
      featured: true,
      aidvisorRecommended: true,
      easyApply: false,
      ranking: 1,
      studyType: "hybrid"
    },
    {
      id: 4,
      name: "Master of Business Administration",
      university: "University of Melbourne",
      country: "Australia",
      city: "Melbourne",
      degree: "Master's",
      duration: "2 years",
      language: "English",
      tuition: "A$64,512",
      startDate: "February 2025",
      applicationDeadline: "October 31, 2024",
      description: "World-class MBA program with international focus and networking opportunities.",
      requirements: ["Bachelor's Degree", "GMAT 650+", "IELTS 7.0", "Work Experience"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png",
      featured: false,
      aidvisorRecommended: true,
      easyApply: true,
      ranking: 33,
      studyType: "online",
      universityType: "A"
    },
    {
      id: 5,
      name: "Bachelor of Computer Science",
      university: "ETH Zurich",
      country: "Switzerland",
      city: "Zurich",
      degree: "Bachelor's",
      duration: "3 years",
      language: "German/English",
      tuition: "CHF 730",
      startDate: "September 2025",
      applicationDeadline: "April 30, 2025",
      description: "Rigorous computer science program with strong mathematical foundation.",
      requirements: ["High School Diploma", "German B2", "Mathematics Proficiency"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/ETH_Zurich_logo.svg/1200px-ETH_Zurich_logo.svg.png",
      featured: true,
      aidvisorRecommended: true,
      easyApply: true,
      ranking: 6,
      studyType: "on-campus",
      universityType: "B"
    },
    {
      id: 6,
      name: "Master of International Relations",
      university: "University of Tokyo",
      country: "Japan",
      city: "Tokyo",
      degree: "Master's",
      duration: "2 years",
      language: "Japanese/English",
      tuition: "¥535,800",
      startDate: "April 2025",
      applicationDeadline: "January 4, 2025",
      description: "Comprehensive program covering global politics, economics, and diplomacy.",
      requirements: ["Bachelor's Degree", "JLPT N2", "TOEFL 90+", "Statement of Purpose"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/University_of_Tokyo_logo.svg/1200px-University_of Tokyo_logo.svg.png",
      featured: false,
      aidvisorRecommended: false,
      easyApply: true,
      ranking: 23,
      studyType: "hybrid"
    }
  */
  // ];

  // Use the already mapped filters from loadFiltersFromParameters
  const countries = availableFilters.countries || [];
  const studyLevels = programFilters.studyLevels || [];
  const degrees = programFilters.degrees || [];
  const subjects = programFilters.subjects || [];

  // Generate intake options (same as preferences)
  const currentYear = new Date().getFullYear();
  const generateIntakes = () => {
    const intakes = [];
    const months = ['January', 'March', 'May', 'July', 'September', 'November'];
    
    // Generate for current year and following years until 2027
    for (let year = currentYear; year <= 2027; year++) {
      months.forEach(month => {
        // For current year, don't include past months
        if (year === currentYear) {
          const currentMonth = new Date().getMonth();
          const monthIndex = months.indexOf(month);
          if (monthIndex < currentMonth) return; // Skip past months
        }
        
        // For 2027, stop at January
        if (year === 2027 && month !== 'January') return;
        
        intakes.push({
          value: `${month} ${year}`,
          label: `${month} ${year}`
        });
      });
    }
    
    return intakes;
  };
  
  const intakes = generateIntakes();

  // Use the already mapped filters from loadFiltersFromParameters
  const studyTypes = programFilters.studyTypes || [];
  const schoolTypes = availableFilters.types || [];
  const universityTypes = availableFilters.universityTypes || [];
  const languages = availableFilters.languages || [];

  // Academic qualifications from profile preferences
  const academicQualifications = [
    { value: 'High School Diploma', label: language === 'en' ? 'High School Diploma' : 'Baccalauréat' },
    { value: 'Bachelor\'s Degree', label: language === 'en' ? 'Bachelor\'s Degree' : 'Licence' },
    { value: 'Master\'s Degree', label: language === 'en' ? 'Master\'s Degree' : 'Master' },
    { value: 'Doctorate', label: language === 'en' ? 'Doctorate' : 'Doctorat' },
    { value: 'Associate Degree', label: language === 'en' ? 'Associate Degree' : 'DUT/BTS' },
    { value: 'Professional Certificate', label: language === 'en' ? 'Professional Certificate' : 'Certificat Professionnel' }
  ];

  // Academic qualification requirement options
  const academicQualificationRequirementOptions = [
    { value: null, label: language === 'en' ? 'All Programs' : 'Tous les programmes' },
    { value: false, label: language === 'en' ? 'No Academic Qualification Required' : 'Aucune qualification académique requise' },
    { value: 'High School Diploma', label: language === 'en' ? 'High School Diploma' : 'Baccalauréat' },
    { value: 'Bachelor\'s Degree', label: language === 'en' ? 'Bachelor\'s Degree' : 'Licence' },
    { value: 'Master\'s Degree', label: language === 'en' ? 'Master\'s Degree' : 'Master' },
    { value: 'Doctorate', label: language === 'en' ? 'Doctorate' : 'Doctorat' },
    { value: 'Associate Degree', label: language === 'en' ? 'Associate Degree' : 'DUT/BTS' },
    { value: 'Professional Certificate', label: language === 'en' ? 'Professional Certificate' : 'Certificat Professionnel' }
  ];

  // Grade types from parameters
  const [gradeTypes, setGradeTypes] = useState([]);

  // English tests from parameters
  const [englishTests, setEnglishTests] = useState([]);
  

  const getTestRange = (testCode) => {
    const ranges = {
      'ielts': '1-9',
      'toefl': '0-120',
      'pte': '10-90',
      'duolingo': '10-160',
      'oet': '0-500',
      'c1-advanced': '0-210',
      'cael': '0-90',
      'languagecert': '0-50',
      'goethe': '0-100',
      'testdaf': '0-5'
    };
    return ranges[testCode] || '0-100';
  };

  const getTestSteps = (testCode) => {
    const steps = {
      'ielts': 0.5,
      'toefl': 1,
      'pte': 1,
      'duolingo': 5,
      'oet': 10,
      'c1-advanced': 1,
      'cael': 1,
      'languagecert': 1,
      'goethe': 1,
      'testdaf': 0.5
    };
    return steps[testCode] || 1;
  };

  // Standardized tests from parameters
  const [standardizedTests, setStandardizedTests] = useState([]);

  const getStandardizedTestRange = (testCode) => {
    const ranges = {
      'gmat': '200-800',
      'gre': '130-170',
      'sat': '400-1600',
      'act': '1-36',
      'lsat': '120-180'
    };
    return ranges[testCode] || '0-100';
  };

  const getStandardizedTestSteps = (testCode) => {
    const steps = {
      'gmat': 10,
      'gre': 1,
      'sat': 10,
      'act': 1,
      'lsat': 1
    };
    return steps[testCode] || 1;
  };


  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filter, value) => {
    // For SubjectMultiSelect, extract IDs from objects
    if (filter === 'subject' && Array.isArray(value)) {
      const subjectIds = value.map(item => item.id || item);
      setSelectedFilters(prev => ({
        ...prev,
        [filter]: subjectIds
      }));
    } else {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: value
    }));
    }
  };

  const clearFilters = () => {
    setSelectedFilters({
      country: [],
      city: [],
      studyLevel: [],
      degree: [],
      subject: [],
      intake: [],
      studyType: [],
      universityType: [],
      nationality: '',
      residenceCountry: '',
      academicQualification: '',
      englishTest: '',
      standardizedTest: '',
      waiver: false
    });
    setDetailedFilters({
      awardingBoard: '',
      grade: '',
      gradeType: '',
      englishTest: '',
      englishScore: '',
      standardizedTest: '',
      standardizedScore: '',
      studyGap: '',
      minFees: 0,
      maxFees: 300000,
      // New choice field filters
      languageTestFilter: null,
      standardizedTestFilter: null,
      scholarshipFilter: null,
      housingFilter: null,
      rankingFilter: null,
      featuredFilter: null
    });
  };

  const handleDetailedFilterChange = (filterName, value) => {
    setDetailedFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Handle temporary fee filter changes
  const handleTempFeeFilterChange = (key, value) => {
    setTempFeeFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Ensure min doesn't exceed max and vice versa
      if (key === 'minFees' && newFilters.minFees > newFilters.maxFees) {
        newFilters.maxFees = newFilters.minFees;
      } else if (key === 'maxFees' && newFilters.maxFees < newFilters.minFees) {
        newFilters.minFees = newFilters.maxFees;
      }
      
      return newFilters;
    });
  };

  // Apply fee filters
  const applyFeeFilters = () => {
    setDetailedFilters(prev => ({
      ...prev,
      minFees: tempFeeFilters.minFees,
      maxFees: tempFeeFilters.maxFees
    }));
  };

  // Clear all filters (main and detailed)
  const clearAllFilters = async () => {
    // Clear main filters
    setSelectedFilters({
      country: [],
      city: [],
      studyLevel: [],
      subject: [],
      intake: [],
      studyType: [],
      universityType: [],
      nationality: '',
      residenceCountry: '',
      academicQualification: '',
      englishTest: '',
      standardizedTest: '',
      waiver: false,
      requiresAcademicQualification: null,
      academicQualifications: [],
      minimumGrade: '',
      gradeSystem: '' // Empty to avoid sending in payload
    });

    // Get the default maxFees for current currency
    let defaultMaxFees = 300000;
    if (userCurrency !== 'USD') {
      try {
        const conversion = await convertPrice(300000, 'USD');
        if (conversion && conversion.convertedAmount > 0) {
          defaultMaxFees = Math.round(conversion.convertedAmount);
        }
      } catch (error) {
        console.error('Error converting maxFees in clearAllFilters:', error);
      }
    }

    // Clear detailed filters
    setDetailedFilters({
      awardingBoard: '',
      grade: '',
      gradeType: '', // Empty to show placeholder
      englishTest: '',
      englishScore: '',
      standardizedTest: '',
      standardizedScore: '',
      studyGap: '',
      minFees: 0,
      maxFees: defaultMaxFees
    });

    // Clear temporary fee filters
    setTempFeeFilters({
      minFees: 0,
      maxFees: defaultMaxFees
    });

    // Clear search query
    setSearchQuery('');
  };

  // Get the default maxFees value for current currency
  const getDefaultMaxFees = () => {
    // For USD, return 300000 directly
    if (userCurrency === 'USD') {
      return 300000;
    }
    // For other currencies, we'll use a simple approach: 
    // if maxFees is the current converted value, consider it default
    // This is a bit tricky, so we'll use a tolerance approach
    const tolerance = 1000; // Allow 1000 units tolerance
    const currentMaxFees = detailedFilters.maxFees;
    
    // If maxFees is close to what we expect for the current currency, consider it default
    // This is not perfect but works for the hasActiveFilters check
    return currentMaxFees;
  };

  // Get the maximum value for sliders based on current currency
  const getSliderMaxValue = () => {
    // For USD, return 300000 directly
    if (userCurrency === 'USD') {
      return 300000;
    }
    // For other currencies, use the current maxFees value or calculate it
    return detailedFilters.maxFees || 300000;
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    // Check main filters
    const hasMainFilters = selectedFilters.country.length > 0 ||
                          selectedFilters.city.length > 0 ||
                          selectedFilters.studyLevel.length > 0 ||
                          selectedFilters.degree.length > 0 ||
                          selectedFilters.subject.length > 0 ||
                          selectedFilters.intake.length > 0 ||
                          selectedFilters.studyType.length > 0 ||
                          selectedFilters.universityType.length > 0 ||
                          selectedFilters.nationality ||
                          selectedFilters.residenceCountry ||
                          selectedFilters.academicQualification ||
                          selectedFilters.englishTest ||
                          selectedFilters.standardizedTest ||
                          selectedFilters.waiver ||
                          selectedFilters.requiresAcademicQualification !== null ||
                          selectedFilters.academicQualifications.length > 0 ||
                          selectedFilters.minimumGrade ||
                          selectedFilters.gradeSystem;

    // Check detailed filters
    const hasDetailedFilters = detailedFilters.awardingBoard ||
                              detailedFilters.grade ||
                              detailedFilters.gradeType ||
                              detailedFilters.englishTest ||
                              detailedFilters.englishScore ||
                              detailedFilters.standardizedTest ||
                              detailedFilters.standardizedScore ||
                              detailedFilters.studyGap ||
                              detailedFilters.minFees >= 0 ||
                              detailedFilters.maxFees !== getDefaultMaxFees() ||
                              detailedFilters.languageTestFilter ||
                              detailedFilters.standardizedTestFilter ||
                              detailedFilters.scholarshipFilter ||
                              detailedFilters.housingFilter ||
                              detailedFilters.rankingFilter ||
                              detailedFilters.featuredFilter;

    // Check search query
    const hasSearchQuery = searchQuery.trim().length > 0;

    return hasMainFilters || hasDetailedFilters || hasSearchQuery;
  };

  const filteredEstablishments = establishments.filter(establishment => {
    // Search query applies to name, country, or city (OR logic for search)
    const matchesSearch = !searchQuery || 
                         (establishment.name && establishment.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (establishment.country && establishment.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (establishment.city && establishment.city.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // All other filters use AND logic
    const matchesCountry = selectedFilters.country.length === 0 || selectedFilters.country.includes(establishment.country);
    const matchesStudyLevel = selectedFilters.studyLevel.length === 0 || 
      (establishment.programsList && establishment.programsList.some(program => 
        selectedFilters.studyLevel.includes(program.studyLevel)
      ));
    
    const matchesDegree = selectedFilters.degree.length === 0 || 
      (establishment.programsList && establishment.programsList.some(program => 
        selectedFilters.degree.includes(program.degree)
      ));
    
    const matchesSubject = selectedFilters.subject.length === 0 || 
      (establishment.programsList && establishment.programsList.some(program => {
        const subjectStr = String(program.subject || '');
        const fieldStr = String(program.field || '');
        return selectedFilters.subject.some(filterSubject => {
          const mappedSubject = String(mapSubjectToDatabase(filterSubject) || '');
          return subjectStr.toLowerCase().includes(mappedSubject.toLowerCase()) ||
                 fieldStr.toLowerCase().includes(mappedSubject.toLowerCase());
        });
      }));
    
    const matchesField = selectedFilters.field.length === 0 || 
      (establishment.programsList && establishment.programsList.some(program => {
        const programField = String(program.field || '');
        return selectedFilters.field.some(filterField => {
          return programField.toLowerCase().includes(filterField.code.toLowerCase());
        });
      }));
    
    const matchesIntake = selectedFilters.intake.length === 0 || 
      (establishment.programsList && establishment.programsList.some(program => 
        selectedFilters.intake.includes(program.intake)
      ));
    
    const matchesStudyType = selectedFilters.studyType.length === 0 || 
      (establishment.programsList && establishment.programsList.some(program => 
        selectedFilters.studyType.includes(program.studyType)
      ));
    
    const matchesUniversityType = selectedFilters.universityType.length === 0 || selectedFilters.universityType.includes(establishment.universityType);
    
    // Grade filtering for establishments (check if any program meets grade requirements)
    const matchesGrade = !detailedFilters.grade || !detailedFilters.gradeType || (() => {
      try {
        // Convert user's grade to standard 10-point scale
        const userStandardGrade = gradeConversionService.convertToStandard(
          parseFloat(detailedFilters.grade), 
          detailedFilters.gradeType
        );
        
        // Check if any program in the establishment meets grade requirements
        if (establishment.programsList && establishment.programsList.length > 0) {
          return establishment.programsList.some(program => {
            if (program.structuredRequirements?.academic?.items) {
              const gradeRequirements = program.structuredRequirements.academic.items.filter(
                item => item.type === 'grade' && item.gradeSystem && item.minimumScore
              );
              
              if (gradeRequirements.length === 0) {
                return true; // No grade requirements, so it matches
              }
              
              // Check if user meets any of the grade requirements
              return gradeRequirements.some(requirement => {
                try {
                  const requirementStandardGrade = gradeConversionService.convertToStandard(
                    parseFloat(requirement.minimumScore),
                    requirement.gradeSystem
                  );
                  return userStandardGrade >= requirementStandardGrade;
                } catch (error) {
                  console.warn('Error converting requirement grade:', error);
                  return true; // If conversion fails, assume it matches
                }
              });
            }
            
            return true; // No structured requirements, so it matches
          });
        }
        
        return true; // No programs, so it matches
      } catch (error) {
        console.warn('Error in grade filtering for establishment:', error);
        return true; // If conversion fails, assume it matches
      }
    })();
    
    return matchesSearch && matchesCountry && matchesStudyLevel && matchesDegree && matchesSubject && matchesField && matchesIntake && matchesStudyType && matchesUniversityType && matchesGrade;
  });

  const filteredPrograms = programs.filter(program => {
    const universityName = program.establishment?.name || '';
    
    // Search query applies to name, university, country, or city (OR logic for search)
    const matchesSearch = !searchQuery || 
                         (program.name && program.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (universityName && universityName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (program.country && program.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (program.city && program.city.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // All other filters use AND logic
    const matchesCountry = selectedFilters.country.length === 0 || selectedFilters.country.includes(program.country);
    const matchesStudyLevel = selectedFilters.studyLevel.length === 0 || selectedFilters.studyLevel.includes(program.studyLevel);
    const matchesDegree = selectedFilters.degree.length === 0 || selectedFilters.degree.includes(program.degree);
    const matchesSubject = selectedFilters.subject.length === 0 || selectedFilters.subject.some(subject => {
      const mappedSubject = String(mapSubjectToDatabase(subject) || '');
      const programSubject = String(program.subject || '');
      const programField = String(program.field || '');
      return programSubject.toLowerCase().includes(mappedSubject.toLowerCase()) || 
             programField.toLowerCase().includes(mappedSubject.toLowerCase());
    });
    const matchesField = selectedFilters.field.length === 0 || selectedFilters.field.some(filterField => {
      const programField = String(program.field || '');
      return programField.toLowerCase().includes(filterField.code.toLowerCase());
    });
    const matchesStudyType = selectedFilters.studyType.length === 0 || selectedFilters.studyType.includes(program.studyType);
    const matchesIntake = selectedFilters.intake.length === 0 || selectedFilters.intake.includes(program.intake);
    
    // Grade filtering using conversion service
    const matchesGrade = !detailedFilters.grade || !detailedFilters.gradeType || (() => {
      try {
        // Convert user's grade to standard 10-point scale
        const userStandardGrade = gradeConversionService.convertToStandard(
          parseFloat(detailedFilters.grade), 
          detailedFilters.gradeType
        );
        
        // Check if program has grade requirements
        if (program.structuredRequirements?.academic?.items) {
          const gradeRequirements = program.structuredRequirements.academic.items.filter(
            item => item.type === 'grade' && item.gradeSystem && item.minimumScore
          );
          
          if (gradeRequirements.length === 0) {
            return true; // No grade requirements, so it matches
          }
          
          // Check if user meets any of the grade requirements
          return gradeRequirements.some(requirement => {
            try {
              const requirementStandardGrade = gradeConversionService.convertToStandard(
                parseFloat(requirement.minimumScore),
                requirement.gradeSystem
              );
              return userStandardGrade >= requirementStandardGrade;
            } catch (error) {
              console.warn('Error converting requirement grade:', error);
              return true; // If conversion fails, assume it matches
            }
          });
        }
        
        return true; // No structured requirements, so it matches
      } catch (error) {
        console.warn('Error in grade filtering:', error);
        return true; // If conversion fails, assume it matches
      }
    })();
    
    return matchesSearch && matchesCountry && matchesStudyLevel && matchesDegree && matchesSubject && matchesField && matchesStudyType && matchesIntake && matchesGrade;
  });

  // Generate dynamic SEO data based on current filters and results
  const generateDynamicTitle = () => {
    const baseTitle = language === 'en' 
      ? 'Universities & Programs - Find Your Perfect Study Abroad Option | E-TAWJIHI Global' 
      : 'Universités & Programmes - Trouvez Votre Option d\'Études à l\'Étranger Parfaite | E-TAWJIHI Global';
    
    if (selectedFilters.country.length > 0) {
      const countries = selectedFilters.country.join(', ');
      return language === 'en' 
        ? `Study in ${countries} - Universities & Programs | E-TAWJIHI Global`
        : `Étudier en ${countries} - Universités & Programmes | E-TAWJIHI Global`;
    }
    
    if (selectedFilters.subject.length > 0) {
      const subjects = selectedFilters.subject.join(', ');
      return language === 'en' 
        ? `${subjects} Programs - Universities Worldwide | E-TAWJIHI Global`
        : `Programmes ${subjects} - Universités Mondiales | E-TAWJIHI Global`;
    }
    
    return baseTitle;
  };

  const generateDynamicDescription = () => {
    const baseDescription = language === 'en'
      ? 'Search and compare universities and programs worldwide. Find the perfect study abroad option with detailed information, rankings, and admission requirements.'
      : 'Recherchez et comparez les universités et programmes du monde entier. Trouvez l\'option d\'études à l\'étranger parfaite avec des informations détaillées, classements et exigences d\'admission.';
    
    const filters = [];
    if (selectedFilters.country.length > 0) filters.push(selectedFilters.country.join(', '));
    if (selectedFilters.subject.length > 0) filters.push(selectedFilters.subject.join(', '));
    if (selectedFilters.field.length > 0) filters.push(selectedFilters.field.map(f => f.labelEn || f.code).join(', '));
    if (selectedFilters.studyLevel.length > 0) filters.push(selectedFilters.studyLevel.join(', '));
    if (selectedFilters.degree.length > 0) filters.push(selectedFilters.degree.join(', '));
    
    if (filters.length > 0) {
      return language === 'en'
        ? `Find ${filters.join(' ')} programs at top universities worldwide. Compare tuition fees, admission requirements, and rankings. ${establishments.length} universities available.`
        : `Trouvez des programmes ${filters.join(' ')} dans les meilleures universités mondiales. Comparez les frais de scolarité, exigences d'admission et classements. ${establishments.length} universités disponibles.`;
    }
    
    return baseDescription;
  };

  const generateKeywords = () => {
    const baseKeywords = language === 'en'
      ? 'universities, study programs, study abroad, international education, university search, program comparison, admission requirements, university rankings, tuition fees, scholarships'
      : 'universités, programmes d\'études, études à l\'étranger, éducation internationale, recherche universitaire, comparaison programmes, exigences admission, classements universitaires, frais scolarité, bourses';
    
    const dynamicKeywords = [];
    if (selectedFilters.country.length > 0) {
      dynamicKeywords.push(...selectedFilters.country.map(country => 
        language === 'en' ? `study in ${country}` : `étudier en ${country}`
      ));
    }
    if (selectedFilters.subject.length > 0) {
      dynamicKeywords.push(...selectedFilters.subject.map(subject => 
        language === 'en' ? `${subject} programs` : `programmes ${subject}`
      ));
    }
    if (selectedFilters.studyLevel.length > 0) {
      dynamicKeywords.push(...selectedFilters.studyLevel.map(level => 
        language === 'en' ? `${level} programs` : `programmes ${level}`
      ));
    }
    if (selectedFilters.degree.length > 0) {
      dynamicKeywords.push(...selectedFilters.degree.map(degree => 
        language === 'en' ? `${degree} programs` : `programmes ${degree}`
      ));
    }
    
    return [...dynamicKeywords, baseKeywords].join(', ');
  };

  const seoData = {
    title: generateDynamicTitle(),
    description: generateDynamicDescription(),
    keywords: generateKeywords(),
    canonical: 'https://e-tawjihi-global.com/establishments',
    ogType: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": language === 'en' ? "Universities & Programs Search" : "Recherche Universités & Programmes",
      "description": generateDynamicDescription(),
      "url": "https://e-tawjihi-global.com/establishments",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": language === 'en' ? "Home" : "Accueil",
            "item": "https://e-tawjihi-global.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": language === 'en' ? "Universities & Programs" : "Universités & Programmes",
            "item": "https://e-tawjihi-global.com/establishments"
          }
        ]
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": establishments.length,
        "itemListElement": establishments.slice(0, 20).map((establishment, index) => ({
            "@type": "EducationalOrganization",
          "position": index + 1,
            "name": establishment.name,
            "description": establishment.description,
            "url": establishment.website,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": establishment.country,
              "addressLocality": establishment.city
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": language === 'en' ? "Programs" : "Programmes",
              "numberOfItems": establishment.programs || 0
          },
          "aggregateRating": establishment.ranking ? {
            "@type": "AggregateRating",
            "ratingValue": establishment.ranking,
            "bestRating": 1,
            "worstRating": 1000
          } : undefined
        }))
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://e-tawjihi-global.com/establishments?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    alternateLanguages: [
      { code: 'en', url: 'https://e-tawjihi-global.com/establishments' },
      { code: 'fr', url: 'https://e-tawjihi-global.com/fr/establishments' }
    ]
  };

  // Map filter data for JSX components

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <SEO 
        {...seoData} 
        language={language}
        // Additional SEO enhancements
        ogImage="https://e-tawjihi-global.com/images/universities-programs-og.jpg"
        twitterImage="https://e-tawjihi-global.com/images/universities-programs-twitter.jpg"
        // Add more specific meta tags
        additionalMeta={[
          { name: "google-site-verification", content: "your-google-verification-code" },
          { name: "msvalidate.01", content: "your-bing-verification-code" },
          { name: "yandex-verification", content: "your-yandex-verification-code" },
          { name: "format-detection", content: "telephone=no" },
          { name: "mobile-web-app-capable", content: "yes" },
          { name: "apple-mobile-web-app-capable", content: "yes" },
          { name: "apple-mobile-web-app-status-bar-style", content: "default" },
          { name: "apple-mobile-web-app-title", content: "E-TAWJIHI Global" },
          { name: "application-name", content: "E-TAWJIHI Global" },
          { name: "msapplication-TileColor", content: "#2563eb" },
          { name: "msapplication-config", content: "/browserconfig.xml" },
          { name: "theme-color", content: "#2563eb" },
          { name: "color-scheme", content: "light" },
          { name: "supported-color-schemes", content: "light" }
        ]}
      />
      {/* Enhanced Authenticated Header */}
      <HeaderAuth language={language} setLanguage={setLanguage} />



      <div className="flex flex-col xl:flex-row max-w-[1600px] mx-auto pt-4 sm:pt-8 relative z-10">
        {/* Enhanced Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} xl:block w-full xl:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 m-2 sm:m-4 xl:m-0 xl:ml-4 ${isFiltersCollapsed ? 'h-auto' : 'h-[calc(100vh-150px)] sm:h-[calc(100vh-200px)]'} overflow-y-auto scrollbar-hide xl:sticky xl:top-24 xl:h-[calc(100vh-120px)] xl:overflow-y-auto xl:filters-scrollbar`}>
          <div className="p-6">
            {/* E-DVISOR Help Section - Always Visible */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {language === 'en' ? 'E-DVISOR' : 'E-DVISOR'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {language === 'en' ? 'AI Assistant' : 'Assistant IA'}
                  </p>
                </div>
                <div className="ml-auto">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {language === 'en' 
                  ? 'E-DVISOR is here to help you find the perfect university match!'
                  : 'E-DVISOR est là pour vous aider à trouver l\'université parfaite !'
                }
              </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>{language === 'en' ? 'Get AI Recommendations' : 'Obtenir des Recommandations IA'}</span>
              </button>
            </div>

            {/* University Types Information */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">🎓</span>
                {language === 'en' ? 'University Types' : 'Types d\'Universités'}
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">💰</span>
                  <span><strong>{language === 'en' ? 'Type A:' : 'Type A:'}</strong> {language === 'en' ? '3 free applications available' : '3 candidatures gratuites disponibles'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🏛️</span>
                  <span><strong>{language === 'en' ? 'Type B:' : 'Type B:'}</strong> {language === 'en' ? 'Service fee required for application' : 'Frais de service requis pour candidature'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">📋</span>
                  <span><strong>{language === 'en' ? 'Type C:' : 'Type C:'}</strong> {language === 'en' ? 'Special admission procedure management' : 'Gestion de procédure d\'admission spéciale'}</span>
                </div>
              </div>
            </div>

            {/* Collapse Toggle Button - Mobile Only */}
            <div className="mb-4 flex justify-center xl:hidden">
              <button
                onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm ${
                  isFiltersCollapsed 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {isFiltersCollapsed ? (
                  <>
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>{language === 'en' ? 'Show Filters' : 'Afficher les Filtres'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>{language === 'en' ? 'Hide Filters' : 'Masquer les Filtres'}</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Filters Header */}
            {!isFiltersCollapsed && (
            <div className="flex items-center justify-between mb-6 xl:flex">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {language === 'en' ? 'Advanced Filters' : 'Filtres Avancés'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters() && (
                <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors flex items-center gap-1"
                >
                    <X className="w-4 h-4" />
                  {language === 'en' ? 'Clear All' : 'Tout effacer'}
                </button>
                )}
              </div>
            </div>)}

            {/* Enhanced Search Bar */}
            <div className={`mb-6 ${!isFiltersCollapsed ? 'block' : 'hidden'} xl:block`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search universities...' : 'Rechercher des universités...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                />
              </div>
            </div>


            {/* Study Preference Section */}
            <div className={`mb-6 ${!isFiltersCollapsed ? 'block' : 'hidden'} xl:block`}>
              <button
                onClick={() => toggleSection('studyPreference')}
                className="flex items-center justify-between w-full py-3 text-left bg-gray-50 rounded-xl px-4 hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  {language === 'en' ? 'Study Preferences' : 'Préférences d\'Études'}
                </span>
                {expandedSections.studyPreference ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              
              {expandedSections.studyPreference && (
                <div className="mt-4 space-y-4">
                  {/* Study Destination */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Destinations' : 'Destinations'}
                    </label>
                    <MultiSelect
                      options={countries}
                      value={selectedFilters.country}
                      onChange={(value) => handleFilterChange('country', value)}
                      placeholder={language === 'en' ? 'All Destinations' : 'Toutes les destinations'}
                      searchPlaceholder={language === 'en' ? 'Search destinations...' : 'Rechercher des destinations...'}
                    />
                  </div>

                  {/* Study Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Study Level' : 'Niveau d\'Études'}
                    </label>
                    <MultiSelect
                      options={studyLevels}
                      value={selectedFilters.studyLevel}
                      onChange={(value) => handleFilterChange('studyLevel', value)}
                      placeholder={language === 'en' ? 'All Levels' : 'Tous les niveaux'}
                      searchPlaceholder={language === 'en' ? 'Search study levels...' : 'Rechercher des niveaux...'}
                    />
                  </div>

                  {/* Degree */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Degree' : 'Diplôme'}
                    </label>
                    <MultiSelect
                      options={degrees}
                      value={selectedFilters.degree}
                      onChange={(value) => handleFilterChange('degree', value)}
                      placeholder={language === 'en' ? 'All Degrees' : 'Tous les diplômes'}
                      searchPlaceholder={language === 'en' ? 'Search degrees...' : 'Rechercher des diplômes...'}
                    />
                    </div>

                  {/* Intake */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Intake' : 'Période d\'Admission'}
                    </label>
                    <MultiSelect
                      options={intakes}
                      value={selectedFilters.intake}
                      onChange={(value) => handleFilterChange('intake', value)}
                      placeholder={language === 'en' ? 'All Intakes' : 'Toutes les admissions'}
                      searchPlaceholder={language === 'en' ? 'Search intakes...' : 'Rechercher des admissions...'}
                    />
                  </div>

                  {/* Fields of Study */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Field of Study' : 'Domaine d\'Études'}
                    </label>
                    <FieldMultiSelect
                      value={Array.isArray(selectedFilters.field) ? selectedFilters.field : []}
                      onChange={(value) => handleFilterChange('field', value)}
                      placeholder={language === 'en' ? 'Select fields of study...' : 'Sélectionner des domaines d\'études...'}
                      language={language}
                      maxSelections={10}
                    />
                  </div>

                  {/* Study Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Study Type' : 'Type d\'Étude'}
                    </label>
                    <MultiSelect
                      options={studyTypes}
                      value={selectedFilters.studyType}
                      onChange={(value) => handleFilterChange('studyType', value)}
                      placeholder={language === 'en' ? 'All Types' : 'Tous les types'}
                      searchPlaceholder={language === 'en' ? 'Search study types...' : 'Rechercher des types...'}
                    />
                  </div>

                  {/* University Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'University Type' : 'Type d\'Université'}
                    </label>
                    <MultiSelect
                      options={universityTypes}
                      value={selectedFilters.universityType}
                      onChange={(value) => handleFilterChange('universityType', value)}
                      placeholder={language === 'en' ? 'All Types' : 'Tous les Types'}
                      searchPlaceholder={language === 'en' ? 'Search types...' : 'Rechercher des types...'}
                    />
                  </div>

                </div>
              )}
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters() && (
              <div className="mb-4">
                <button
                  onClick={clearAllFilters}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-sm font-medium py-3 px-4 rounded-lg border border-red-200 hover:border-red-300 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  {language === 'en' ? 'Clear All Filters' : 'Effacer Tous les Filtres'}
                </button>
              </div>
            )}

            {/* Detailed Filters Section */}
            <div className={`mb-6 ${!isFiltersCollapsed ? 'block' : 'hidden'} xl:block`}>
              <button
                onClick={() => toggleSection('detailedFilters')}
                className="flex items-center justify-between w-full py-3 text-left bg-gray-50 rounded-xl px-4 hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  {language === 'en' ? 'Detailed Filters' : 'Filtres Détaillés'}
                </span>
                {expandedSections.detailedFilters ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              
              {expandedSections.detailedFilters && (
                <div className="mt-4 space-y-6">
                  {/* Clear All Button */}
                  {(detailedFilters.gradeType || detailedFilters.grade || detailedFilters.englishTest || detailedFilters.englishScore || detailedFilters.standardizedTest || detailedFilters.standardizedScore || detailedFilters.languageTestFilter || detailedFilters.standardizedTestFilter || detailedFilters.scholarshipFilter || detailedFilters.housingFilter || detailedFilters.rankingFilter || detailedFilters.featuredFilter) && (
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() => {
                          handleDetailedFilterChange('gradeType', '');
                          handleDetailedFilterChange('grade', '');
                          handleDetailedFilterChange('englishTest', '');
                          handleDetailedFilterChange('englishScore', '');
                          handleDetailedFilterChange('standardizedTest', '');
                          handleDetailedFilterChange('standardizedScore', '');
                          handleDetailedFilterChange('languageTestFilter', null);
                          handleDetailedFilterChange('standardizedTestFilter', null);
                          handleDetailedFilterChange('scholarshipFilter', null);
                          handleDetailedFilterChange('housingFilter', null);
                          handleDetailedFilterChange('rankingFilter', null);
                          handleDetailedFilterChange('featuredFilter', null);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        {language === 'en' ? 'Clear All Filters' : 'Effacer Tous les Filtres'}
                      </button>
                      </div>
                  )}

                  {/* Grade Requirements */}
                      <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                        {language === 'en' ? 'Grade Requirements' : 'Exigences de Note'}
                    </h3>
                      {(detailedFilters.gradeType || detailedFilters.grade) && (
                        <button
                          onClick={() => {
                            handleDetailedFilterChange('gradeType', '');
                            handleDetailedFilterChange('grade', '');
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title={language === 'en' ? 'Clear grade filters' : 'Effacer les filtres de note'}
                        >
                          <X className="w-3 h-3" />
                          {language === 'en' ? 'Clear' : 'Effacer'}
                        </button>
                      )}
                      </div>
                    <div className="space-y-4">
                      {/* Grade System */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Grade System' : 'Système de Notation'}
                        </label>
                        <SelectSearchable
                          options={gradeTypes}
                          value={detailedFilters.gradeType}
                          onChange={(value) => handleDetailedFilterChange('gradeType', value)}
                          placeholder={language === 'en' ? 'Select Grade System' : 'Sélectionner le système de notation'}
                          searchPlaceholder={language === 'en' ? 'Search grade systems...' : 'Rechercher des systèmes de notation...'}
                        />
                      </div>

                      {/* Grade Score */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Your Grade Score' : 'Votre Note'}
                        </label>
                          <input
                            type="number"
                          step={detailedFilters.gradeType === 'cgpa-4' ? '0.01' : detailedFilters.gradeType === 'cgpa-20' ? '0.01' : detailedFilters.gradeType === 'percentage' ? '0.01' : detailedFilters.gradeType === 'gpa-5' ? '0.01' : detailedFilters.gradeType === 'gpa-10' ? '0.01' : detailedFilters.gradeType === 'cgpa-7' ? '0.01' : '0.01'}
                          min={detailedFilters.gradeType === 'cgpa-4' ? '0' : detailedFilters.gradeType === 'cgpa-20' ? '0' : detailedFilters.gradeType === 'percentage' ? '0' : detailedFilters.gradeType === 'gpa-5' ? '0' : detailedFilters.gradeType === 'gpa-10' ? '0' : detailedFilters.gradeType === 'cgpa-7' ? '0' : '0'}
                          max={detailedFilters.gradeType === 'cgpa-4' ? '4' : detailedFilters.gradeType === 'cgpa-20' ? '20' : detailedFilters.gradeType === 'percentage' ? '100' : detailedFilters.gradeType === 'gpa-5' ? '5' : detailedFilters.gradeType === 'gpa-10' ? '10' : detailedFilters.gradeType === 'cgpa-7' ? '7' : '100'}
                            value={detailedFilters.grade}
                            onChange={(e) => handleDetailedFilterChange('grade', e.target.value)}
                          placeholder={
                            detailedFilters.gradeType === 'cgpa-4' ? 'e.g., 3.75' :
                            detailedFilters.gradeType === 'cgpa-20' ? 'e.g., 17.5' :
                            detailedFilters.gradeType === 'percentage' ? 'e.g., 85.5' :
                            detailedFilters.gradeType === 'gpa-5' ? 'e.g., 4.2' :
                            detailedFilters.gradeType === 'gpa-10' ? 'e.g., 8.9' :
                            detailedFilters.gradeType === 'cgpa-7' ? 'e.g., 5.5' :
                            language === 'en' ? 'Enter Score' : 'Saisir la note'
                          }
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        />
                        {detailedFilters.grade && detailedFilters.gradeType && (
                          <p className="mt-1 text-xs text-gray-500">
                            {language === 'en' ? 'Showing programs with requirements ≤ your grade' : 'Affichage des programmes avec exigences ≤ votre note'}: {detailedFilters.grade} ({gradeTypes.find(gt => gt.value === detailedFilters.gradeType)?.label || detailedFilters.gradeType})
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* English Language Test */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                      {language === 'en' ? 'English Language Test' : 'Test de Langue Anglaise'}
                    </h3>
                      {(detailedFilters.englishTest || detailedFilters.englishScore) && (
                        <button
                          onClick={() => {
                            handleDetailedFilterChange('englishTest', '');
                            handleDetailedFilterChange('englishScore', '');
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title={language === 'en' ? 'Clear English test filters' : 'Effacer les filtres de test d\'anglais'}
                        >
                          <X className="w-3 h-3" />
                          {language === 'en' ? 'Clear' : 'Effacer'}
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Test Type' : 'Type de test'}
                        </label>
                        <SelectSearchable
                          options={englishTests}
                          value={detailedFilters.englishTest}
                          onChange={(value) => handleDetailedFilterChange('englishTest', value)}
                          placeholder={language === 'en' ? 'Select Test' : 'Sélectionner le test'}
                          searchPlaceholder={language === 'en' ? 'Search tests...' : 'Rechercher des tests...'}
                        />
                      </div>
                      {detailedFilters.englishTest && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            {language === 'en' ? 'Score' : 'Score'} ({englishTests.find(t => t.value === detailedFilters.englishTest)?.range})
                          </label>
                          <input
                            type="number"
                            value={detailedFilters.englishScore}
                            onChange={(e) => handleDetailedFilterChange('englishScore', e.target.value)}
                            placeholder={language === 'en' ? 'Enter Score' : 'Saisir le score'}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Standardized Test */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                      {language === 'en' ? 'Standardized Test' : 'Test Standardisé'}
                    </h3>
                      {(detailedFilters.standardizedTest || detailedFilters.standardizedScore) && (
                        <button
                          onClick={() => {
                            handleDetailedFilterChange('standardizedTest', '');
                            handleDetailedFilterChange('standardizedScore', '');
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title={language === 'en' ? 'Clear standardized test filters' : 'Effacer les filtres de test standardisé'}
                        >
                          <X className="w-3 h-3" />
                          {language === 'en' ? 'Clear' : 'Effacer'}
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Test Type' : 'Type de test'}
                        </label>
                        <SelectSearchable
                          options={standardizedTests}
                          value={detailedFilters.standardizedTest}
                          onChange={(value) => handleDetailedFilterChange('standardizedTest', value)}
                          placeholder={language === 'en' ? 'Select Test' : 'Sélectionner le test'}
                          searchPlaceholder={language === 'en' ? 'Search tests...' : 'Rechercher des tests...'}
                        />
                      </div>
                      {detailedFilters.standardizedTest && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            {language === 'en' ? 'Score' : 'Score'} ({standardizedTests.find(t => t.value === detailedFilters.standardizedTest)?.range})
                          </label>
                          <input
                            type="number"
                            value={detailedFilters.standardizedScore}
                            onChange={(e) => handleDetailedFilterChange('standardizedScore', e.target.value)}
                            placeholder={language === 'en' ? 'Enter Score' : 'Saisir le score'}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>


                  {/* Fees Range */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                      {language === 'en' ? 'Fees Range' : 'Gamme de Frais'}
                    </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {userCurrency}
                      </span>
                    </div>
                    
                    {/* Range Slider */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>0</span>
                        <span className="font-medium text-blue-600">{userCurrency} {(tempFeeFilters.minFees ?? 0).toLocaleString()} - {(tempFeeFilters.maxFees ?? 0).toLocaleString()}</span>
                        <span>300,000</span>
                      </div>
                    <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            {language === 'en' ? 'Minimum' : 'Minimum'}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max={getSliderMaxValue()}
                            step="1000"
                            value={tempFeeFilters.minFees}
                            onChange={(e) => handleTempFeeFilterChange('minFees', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            {language === 'en' ? 'Maximum' : 'Maximum'}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max={getSliderMaxValue()}
                            step="1000"
                            value={tempFeeFilters.maxFees}
                            onChange={(e) => handleTempFeeFilterChange('maxFees', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Number Inputs */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Min Fees' : 'Frais minimum'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={getSliderMaxValue()}
                          step="1000"
                          value={tempFeeFilters.minFees}
                          onChange={(e) => handleTempFeeFilterChange('minFees', parseInt(e.target.value) || 0)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Max Fees' : 'Frais maximum'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={getSliderMaxValue()}
                          step="1000"
                          value={tempFeeFilters.maxFees}
                          onChange={(e) => handleTempFeeFilterChange('maxFees', parseInt(e.target.value) || getSliderMaxValue())}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        />
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={applyFeeFilters}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {language === 'en' ? 'Apply Filters' : 'Appliquer les Filtres'}
                    </button>
                  </div>

                  {/* Additional Filters */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                        {language === 'en' ? 'Additional Filters' : 'Filtres Supplémentaires'}
                      </h3>
                      {(detailedFilters.languageTestFilter || detailedFilters.standardizedTestFilter || detailedFilters.scholarshipFilter || detailedFilters.housingFilter || detailedFilters.rankingFilter || detailedFilters.featuredFilter) && (
                        <button
                          onClick={() => {
                            handleDetailedFilterChange('languageTestFilter', null);
                            handleDetailedFilterChange('standardizedTestFilter', null);
                            handleDetailedFilterChange('scholarshipFilter', null);
                            handleDetailedFilterChange('housingFilter', null);
                            handleDetailedFilterChange('rankingFilter', null);
                            handleDetailedFilterChange('featuredFilter', null);
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title={language === 'en' ? 'Clear additional filters' : 'Effacer les filtres supplémentaires'}
                        >
                          <X className="w-3 h-3" />
                          {language === 'en' ? 'Clear' : 'Effacer'}
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {/* Language Test Filter */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Language Test' : 'Test de Langue'}
                        </label>
                        <select
                          value={detailedFilters.languageTestFilter || ''}
                          onChange={(e) => handleDetailedFilterChange('languageTestFilter', e.target.value || null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">{language === 'en' ? 'All Cases' : 'Tous les cas'}</option>
                          <option value="without">{language === 'en' ? 'Without Test' : 'Sans Test'}</option>
                          <option value="with">{language === 'en' ? 'With Test' : 'Avec Test'}</option>
                        </select>
                      </div>

                      {/* Standardized Test Filter */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Standardized Test' : 'Test Standardisé'}
                        </label>
                        <select
                          value={detailedFilters.standardizedTestFilter || ''}
                          onChange={(e) => handleDetailedFilterChange('standardizedTestFilter', e.target.value || null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">{language === 'en' ? 'All Cases' : 'Tous les cas'}</option>
                          <option value="without">{language === 'en' ? 'Without Test' : 'Sans Test'}</option>
                          <option value="with">{language === 'en' ? 'With Test' : 'Avec Test'}</option>
                        </select>
                      </div>

                      {/* Scholarship Filter */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Scholarship' : 'Bourse'}
                        </label>
                        <select
                          value={detailedFilters.scholarshipFilter || ''}
                          onChange={(e) => handleDetailedFilterChange('scholarshipFilter', e.target.value || null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">{language === 'en' ? 'All Cases' : 'Tous les cas'}</option>
                          <option value="with">{language === 'en' ? 'With Scholarship' : 'Avec Bourse'}</option>
                        </select>
                      </div>

                      {/* Housing Filter */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Housing' : 'Logement'}
                        </label>
                        <select
                          value={detailedFilters.housingFilter || ''}
                          onChange={(e) => handleDetailedFilterChange('housingFilter', e.target.value || null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">{language === 'en' ? 'All Cases' : 'Tous les cas'}</option>
                          <option value="with">{language === 'en' ? 'With Housing' : 'Avec Logement'}</option>
                        </select>
                      </div>

                      {/* Ranking Filter */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Ranking' : 'Classement'}
                        </label>
                        <select
                          value={detailedFilters.rankingFilter || ''}
                          onChange={(e) => handleDetailedFilterChange('rankingFilter', e.target.value || null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">{language === 'en' ? 'All Cases' : 'Tous les cas'}</option>
                          <option value="top">{language === 'en' ? 'Top Ranked' : 'Top Classé'}</option>
                        </select>
                      </div>

                      {/* Featured Filter */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Featured' : 'En Vedette'}
                        </label>
                        <select
                          value={detailedFilters.featuredFilter || ''}
                          onChange={(e) => handleDetailedFilterChange('featuredFilter', e.target.value || null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">{language === 'en' ? 'All Cases' : 'Tous les cas'}</option>
                          <option value="featured">{language === 'en' ? 'Featured' : 'En Vedette'}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-6 xl:p-8">
          {/* Tabs */}
          <div className="mb-4 sm:mb-8">
            <div className="flex w-full bg-gray-100 rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => handleTabChange('establishments')}
                className={`flex-1 py-3 sm:py-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 border ${
                  activeTab === 'establishments'
                    ? 'bg-white text-blue-800 shadow-sm border-blue-200'
                    : 'text-gray-600 hover:text-gray-800 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{language === 'en' ? 'Universities' : 'Universités'}</span>
              </button>
              <button
                onClick={() => handleTabChange('programs')}
                className={`flex-1 py-3 sm:py-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 border ${
                  activeTab === 'programs'
                    ? 'bg-white text-blue-800 shadow-sm border-blue-200'
                    : 'text-gray-600 hover:text-gray-800 border-gray-200 hover:border-gray-300'
                }`}
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{language === 'en' ? 'Programs' : 'Programmes'}</span>
              </button>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {activeTab === 'establishments' 
                  ? (language === 'en' ? 'Top Universities' : 'Meilleures Universités')
                  : (language === 'en' ? 'Study Programs' : 'Programmes d\'Études')
                }
              </h2>
              <div className="text-gray-600">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    {language === 'en' ? 'Loading...' : 'Chargement...'}
                  </span>
                ) : activeTab === 'establishments' 
                  ? (language === 'en' 
                      ? `${pagination.total} universities found` 
                      : `${pagination.total} universités trouvées`)
                  : (language === 'en' 
                      ? `${pagination.total} programs found` 
                      : `${pagination.total} programmes trouvés`)
                }
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort Options */}
              <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium">
                <option>{language === 'en' ? 'Sort by: Ranking' : 'Trier par: Classement'}</option>
                <option>{language === 'en' ? 'Sort by: Rating' : 'Trier par: Note'}</option>
                <option>{language === 'en' ? 'Sort by: Tuition' : 'Trier par: Frais'}</option>
                <option>{language === 'en' ? 'Sort by: Popularity' : 'Trier par: Popularité'}</option>
              </select>
              
              {/* View Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button className="px-3 py-2 bg-blue-800 text-white">
                  <Grid className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-white text-gray-600 hover:bg-gray-50">
                  <List className="w-4 h-4" />
                </button>
              </div>
              
            </div>
          </div>

          {/* TOP 3 E-DVISOR Recommendations */}
          {activeTab === 'programs' && filteredPrograms.filter(p => p.aidvisorRecommended).length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">
                      {language === 'en' ? 'TOP 3 Recommendations from E-DVISOR' : 'TOP 3 Recommandations d\'E-DVISOR'}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {language === 'en' 
                        ? 'AI-powered recommendations based on your profile and preferences.'
                        : 'Recommandations alimentées par l\'IA basées sur votre profil et préférences.'
                      }
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPrograms.filter(p => p.aidvisorRecommended).slice(0, 3).map(program => (
                    <div key={program.id} className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                        <div className="flex items-center gap-3 mb-2">
                          <img 
                            src={program.establishment?.logo || program.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(program.establishment?.name || 'University')}&size=64&background=3B82F6&color=fff`} 
                            alt={program.establishment?.name || 'University'}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{program.name}</h4>
                            <p className="text-xs text-gray-600">{program.establishment?.name || 'University'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{getDegreeLabel(program.degree)}</span>
                          <div className="flex items-center gap-1">
                            {program.universityType === 'A' && (
                              <>
                                <span className="text-gray-400 line-through text-xs">$50</span>
                                <span className="text-green-600 font-semibold text-sm">Free</span>
                              </>
                            )}
                            {program.universityType !== 'A' && (
                              <span className="text-blue-600 font-semibold text-sm">
                                {program.universityType === 'B' ? '$100' : 
                                 program.universityType === 'C' ? ((program.establishment?.name || '').includes('Sorbonne') ? '€150' : '¥800') : '$100'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Link 
                            to={`/${generateProgramSlug(program)}`}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            {language === 'fr' ? 'Voir détails' : 'View Details'}
                    </Link>
                          <HeartButton 
                            type="program"
                            id={program.id}
                            isShortlisted={program.isShortlisted}
                            className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium flex items-center justify-center"
                            size="w-3 h-3"
                            language={language}
                          />
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {loading ? (
              /* Loading State */
              <>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-48 sm:h-56 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : activeTab === 'establishments' ? (
              /* Establishments Cards */
              filteredEstablishments.map(establishment => (
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
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-gray-800">#{establishment.worldRanking}</span>
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">{establishment.rating}</span>
                  </div>
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
                              // Si lang est un objet avec une propriété label, utiliser cette propriété
                              if (typeof lang === 'object' && lang.label) {
                                return lang.label;
                              }
                              // Sinon, utiliser getLanguageLabel pour les codes
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
                    </div>{establishment.acceptanceRate && (
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
                    const serviceFee = getServiceFee(establishment);
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
                            onClick={() => {
                              if (isOpen || isClosingSoon) {
                                // Handle application logic here
                              }
                            }}
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
                          isShortlisted={establishment.isShortlisted}
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
            ))

            ) : (
              /* Programs Cards */
              filteredPrograms.map(program => (
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
                       // Try to get program's multiIntakes first, then fallback to establishment's multiIntakes
                       let nextIntake = getNextApplicationPeriod(program.multiIntakes);
                       let isFromEstablishment = false;
                       
                       // If program has no intakes, try to get establishment's intakes
                       if (!nextIntake && program.establishment?.id) {
                         const establishment = establishments.find(e => e.id === program.establishment.id);
                         if (establishment && establishment.multiIntakes) {
                           nextIntake = getNextApplicationPeriod(establishment.multiIntakes);
                           isFromEstablishment = true;
                         }
                       }
                       
                       if (nextIntake) {
                         const status = getApplicationPeriodStatus(nextIntake);
                         const isOpen = status.status === 'open';
                         const isClosingSoon = status.status === 'closing-soon';
                         
                         return (
                    <div className="mb-4">
                             <div className="text-xs text-gray-500 mb-2">
                               {language === 'en' ? 'Next Application Period' : 'Prochaine période de candidature'}
                               {isFromEstablishment && (
                                 <span className="ml-1 text-blue-600">({language === 'en' ? 'From university' : 'De l\'université'})</span>
                               )}
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
                                 onClick={() => {
                                   if (isOpen || isClosingSoon) {
                                     // Handle application logic here
                                   }
                                 }}
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
                      
                      if (!typeInfo) return null;
                      
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
                          isShortlisted={program.isShortlisted}
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
              ))
            )}
          </div>


        {/* Pagination - Below the listing */}
        {pagination.pages > 1 && (
          <div className="mt-8">
            {/* Pagination Info */}
            <div className="text-center text-sm text-gray-600 mb-4">
              {language === 'fr' 
                ? `Page ${pagination.page} sur ${pagination.pages} (${pagination.total} résultats)`
                : `Page ${pagination.page} of ${pagination.pages} (${pagination.total} results)`
              }
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev || loading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            
            {(() => {
              const totalPages = pagination.pages;
              const currentPage = pagination.page;
              const maxVisiblePages = 5;
              
              // Calculate the range of pages to show
              let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
              let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
              
              // Adjust start page if we're near the end
              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }
              
              const pages = [];
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      i === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              return pages;
            })()}
            
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext || loading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

          {/* No Results */}
          {((activeTab === 'establishments' && filteredEstablishments.length === 0) || 
            (activeTab === 'programs' && filteredPrograms.length === 0)) && (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'establishments' 
                  ? (language === 'en' ? 'No establishments found' : 'Aucun établissement trouvé')
                  : (language === 'en' ? 'No programs found' : 'Aucun programme trouvé')
                }
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Try adjusting your search criteria or filters' 
                  : 'Essayez d\'ajuster vos critères de recherche ou filtres'
                }
              </p>
            </div>
          )}
        </div>


      </div>
    </div>
    </>
  );
};

export default EstablishmentsListing;

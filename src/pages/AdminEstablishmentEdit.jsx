import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Building2, 
  Globe, 
  Star, 
  MapPin, 
  Users, 
  GraduationCap,
  DollarSign,
  Calendar,
  Award,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Youtube,
  Map,
  X,
} from 'lucide-react';
import adminService from '../services/adminService';
import HTMLEditor from '../components/HTMLEditor';
import FileUpload from '../components/FileUpload';
import MultiSelectSearchable from '../components/MultiSelectSearchable';
import SEOCalculator from '../components/SEOCalculator';
import SelectSearchable from '../components/ui/SelectSearchable';
import parameterService from '../services/parameterService';
import { useAllParameters } from '../hooks/useAllParameters';

const AdminEstablishmentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if this is a new establishment (either id is 'new' or id is undefined and pathname includes '/new')
  const isNewEstablishment = !id || id === 'new' || location.pathname.includes('/new');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [establishment, setEstablishment] = useState({
    name: '',
    nameFr: '',
    slug: '',
    country: '',
    city: '',
    type: '',
    rating: '',
    students: '',
    programs: '',
    logo: '',
    description: '',
    descriptionFr: '',
    mission: '',
    missionFr: '',
    foundedYear: '',
    featured: false,
    sponsored: false,
    tuition: '',
    tuitionMin: '',
    tuitionMax: '',
    tuitionCurrency: 'USD',
    acceptanceRate: '',
    worldRanking: '',
    qsRanking: '',
    timesRanking: '',
    arwuRanking: '',
    usNewsRanking: '',
    popularPrograms: [],
    applicationDeadline: '',
    scholarships: false,
    scholarshipTypes: [],
    scholarshipDescription: '',
    housing: false,
    language: '',
    aidvisorRecommended: false,
    easyApply: false,
    universityType: '',
    commissionRate: '',
    freeApplications: '',
    visaSupport: '',
    countrySpecific: {},
    website: '',
    email: '',
    phone: '',
    address: '',
    accreditations: [],
    accommodation: false,
    careerServices: false,
    languageSupport: false,
    isActive: true,
    admissionRequirements: {},
    admissionRequirementsFr: {},
    englishTestRequirements: {},
    academicRequirements: {},
    documentRequirements: {},
    visaRequirements: {},
    applicationFee: '',
    applicationFeeCurrency: 'USD',
    livingCosts: '',
    livingCostsCurrency: 'USD',
    // Nouveaux champs
    languages: [],
    campusPhotos: [],
    youtubeVideos: [],
    brochures: [],
    campusLocations: [],
    // Statut de publication
    status: 'draft', // 'published' ou 'draft'
    // Champs SEO
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    seoImageAlt: '',
    // Configuration des prix selon le type d'université
    servicePricing: {
      normalPrice: '',
      promotionPrice: '',
      promotionDeadline: ''
    },
    // Multi-intakes
    multiIntakes: []
  });

  const [paramOptions, setParamOptions] = useState({ currencies: [], schoolTypes: [], countries: [], languages: [], universityTypes: [] });

  // Intake options generator (reuse search page logic simplified)
  const generateIntakes = () => {
    const months = [
      { en: 'January', num: 1 },
      { en: 'February', num: 2 },
      { en: 'March', num: 3 },
      { en: 'April', num: 4 },
      { en: 'May', num: 5 },
      { en: 'June', num: 6 },
      { en: 'July', num: 7 },
      { en: 'August', num: 8 },
      { en: 'September', num: 9 },
      { en: 'October', num: 10 },
      { en: 'November', num: 11 },
      { en: 'December', num: 12 }
    ];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const academicYearStart = currentMonth >= 9 ? currentYear : currentYear - 1; // September boundary

    // Generate from September (9) of academicYearStart through August (8) of academicYearStart + 2
    const intakes = [];
    let y = academicYearStart;
    let m = 9; // Start from September
    for (let i = 0; i < 24; i++) { // 2 academic years
      const month = months.find(mo => mo.num === m);
      intakes.push({ value: `${month.en} ${y}`, label: `${month.en} ${y}` });
      m += 1;
      if (m > 12) { m = 1; y += 1; }
    }

    return intakes;
  };
  const intakeOptions = generateIntakes();

  // Les options de langues sont maintenant chargées dynamiquement depuis les paramètres

  // Load all parameters using centralized service
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();

  useEffect(() => {
    if (allParams) {
      const currencies = (allParams.currencies || []).map(i => ({ 
        value: i.code, 
        label: language === 'fr' ? i.labelFr : i.labelEn 
      }));
      const schoolTypes = (allParams.schoolTypes || []).map(i => ({ 
        value: i.code, 
        label: language === 'fr' ? i.labelFr : i.labelEn 
      }));
      const countries = (allParams.countries || []).map(i => ({ 
        value: i.code, 
        label: language === 'fr' ? i.labelFr : i.labelEn 
      }));
      const languages = (allParams.languages || []).map(i => ({ 
        value: i.code, 
        label: language === 'fr' ? i.labelFr : i.labelEn,
        labelFr: i.labelFr,
        flag: getLanguageFlag(i.code)
      }));
      const universityTypes = (allParams.universityTypes || []).map(i => ({ 
        value: i.code, 
        label: language === 'fr' ? i.labelFr : i.labelEn 
      }));
      setParamOptions({ currencies, schoolTypes, countries, languages, universityTypes });
    }
  }, [allParams, language]);

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
      'Korean': '🇰🇷'
    };
    return flagMap[languageCode] || '🌐';
  };

  // Fonction utilitaire pour s'assurer que tous les champs string ne sont pas null
  const sanitizeEstablishmentData = (data) => {
    const stringFields = [
      'name', 'nameFr', 'slug', 'country', 'city', 'type',
      'logo', 'description', 'descriptionFr', 'mission', 'missionFr',
      'tuition', 'tuitionMin', 'tuitionMax', 'tuitionCurrency', 'acceptanceRate',
      'applicationDeadline', 'language', 'universityType', 'commissionRate',
      'visaSupport', 'website', 'email', 'phone', 'address',
      'applicationFee', 'applicationFeeCurrency', 'livingCosts', 'livingCostsCurrency',
      'status', 'seoTitle', 'seoDescription', 'seoImageAlt'
    ];

    const numericFields = [
      'students', 'programs', 'foundedYear', 'rating', 'worldRanking', 'qsRanking', 
      'timesRanking', 'arwuRanking', 'usNewsRanking', 'freeApplications'
    ];

    const sanitized = { ...data };
    
    // S'assurer que tous les champs string ne sont pas null
    stringFields.forEach(field => {
      if (sanitized[field] === null || sanitized[field] === undefined) {
        sanitized[field] = '';
      }
    });

    // S'assurer que tous les champs numériques ne sont pas null et sont convertis en strings
    numericFields.forEach(field => {
      if (sanitized[field] === null || sanitized[field] === undefined) {
        sanitized[field] = '';
      } else {
        // Convertir en string pour les inputs
        sanitized[field] = String(sanitized[field]);
      }
    });

    // Gérer les champs array - s'assurer que les langues sont stockées comme des codes
    sanitized.languages = (data.languages || []).map(lang => {
      // Si c'est déjà un code (string), le garder
      if (typeof lang === 'string') {
        return lang;
      }
      // Si c'est un objet avec une propriété value, extraire le code
      if (typeof lang === 'object' && lang.value) {
        return lang.value;
      }
      // Sinon, retourner tel quel
      return lang;
    });
    sanitized.campusPhotos = (data.campusPhotos || []).map(photo => ({
      ...photo,
      url: photo.url && !photo.url.startsWith('http') ? `${window.location.origin}${photo.url}` : photo.url,
      alt: photo.alt || ''
    }));
    sanitized.youtubeVideos = data.youtubeVideos || [];
    sanitized.brochures = (data.brochures || []).map(brochure => ({
      ...brochure,
      file: brochure.file ? {
        ...brochure.file,
        url: brochure.file.url && !brochure.file.url.startsWith('http') && !brochure.file.url.startsWith('blob:') ? `${window.location.origin}${brochure.file.url}` : brochure.file.url
      } : brochure.file
    }));
    sanitized.campusLocations = (data.campusLocations || []).map(location => ({
      ...location,
      googleMapsEmbed: location.googleMapsEmbed || location.coordinates || ''
    }));
    sanitized.popularPrograms = data.popularPrograms || [];
    sanitized.scholarshipTypes = data.scholarshipTypes || [];
    sanitized.accreditations = data.accreditations || [];
    sanitized.seoKeywords = data.seoKeywords || [];

    // Gérer les champs object
    sanitized.countrySpecific = data.countrySpecific || {};
    sanitized.admissionRequirements = data.admissionRequirements || {};
    sanitized.admissionRequirementsFr = data.admissionRequirementsFr || {};
    sanitized.englishTestRequirements = data.englishTestRequirements || {};
    sanitized.academicRequirements = data.academicRequirements || {};
    sanitized.documentRequirements = data.documentRequirements || {};
    sanitized.visaRequirements = data.visaRequirements || {};

    // Gérer les champs boolean
    sanitized.featured = data.featured || false;
    sanitized.sponsored = data.sponsored || false;
    sanitized.scholarships = data.scholarships || false;
    sanitized.housing = data.housing || false;
    sanitized.aidvisorRecommended = data.aidvisorRecommended || false;
    sanitized.easyApply = data.easyApply || false;
    sanitized.accommodation = data.accommodation || false;
    sanitized.careerServices = data.careerServices || false;
    sanitized.languageSupport = data.languageSupport || false;
    sanitized.isActive = data.isActive !== undefined ? data.isActive : true;

    // Gérer la configuration des prix
    sanitized.servicePricing = data.servicePricing || {
      normalPrice: '',
      promotionPrice: '',
      promotionDeadline: '',
      currency: ''
    };
    
    // Multi-intakes
    sanitized.multiIntakes = data.multiIntakes || [];

    return sanitized;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEstablishment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle service pricing changes
  const handleServicePricingChange = (pricingField, value) => {
    setEstablishment(prev => ({
      ...prev,
      servicePricing: {
        ...prev.servicePricing,
        [pricingField]: value
      }
    }));
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setTimeout(() => navigate('/admin/establishments'), 2000);
        return;
      }

      const sanitizedData = sanitizeEstablishmentData(establishment);
      
      // Determine if this is a new establishment or an update
      const isNew = isNewEstablishment;
      
      // Validate: if updating, id must be present and valid
      if (!isNew && (!id || id === 'undefined' || id === 'new')) {
        setError('Invalid establishment ID for update. Please try creating a new establishment.');
        setSaving(false);
        return;
      }
      
      const url = isNew 
        ? '/api/admin/establishments'
        : `/api/admin/establishments/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sanitizedData)
      });

      if (response.status === 401) {
        setError('Authentication expired. Please log in again.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${isNew ? 'create' : 'update'} establishment (${response.status})`);
      }

      const responseData = await response.json();
      setSuccess(isNew ? 'Establishment created successfully!' : 'Establishment updated successfully!');
      
      // If creating a new establishment, redirect to edit page with the new ID
      if (isNew && responseData.data && responseData.data.id) {
        setTimeout(() => {
          navigate(`/admin/establishments/${responseData.data.id}/edit`);
        }, 1000);
      } else {
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle YouTube video management
  const handleAddYoutubeVideo = () => {
    const newVideo = {
      url: '',
      title: '',
      description: ''
    };
    setEstablishment(prev => ({
      ...prev,
      youtubeVideos: [...(prev.youtubeVideos || []), newVideo]
    }));
  };

  const handleRemoveYoutubeVideo = (index) => {
    setEstablishment(prev => ({
      ...prev,
      youtubeVideos: prev.youtubeVideos.filter((_, i) => i !== index)
    }));
  };

  const handleYoutubeVideoChange = (index, field, value) => {
    setEstablishment(prev => ({
      ...prev,
      youtubeVideos: prev.youtubeVideos.map((video, i) => 
        i === index ? { ...video, [field]: value } : video
      )
    }));
  };

  // Handle brochure management
  const handleAddBrochure = () => {
    const newBrochure = {
      name: '',
      url: '',
      size: ''
    };
    setEstablishment(prev => ({
      ...prev,
      brochures: [...(prev.brochures || []), newBrochure]
    }));
  };

  const handleRemoveBrochure = (index) => {
    setEstablishment(prev => ({
      ...prev,
      brochures: prev.brochures.filter((_, i) => i !== index)
    }));
  };

  const handleBrochureChange = (index, field, value) => {
    setEstablishment(prev => ({
      ...prev,
      brochures: prev.brochures.map((brochure, i) => 
        i === index ? { ...brochure, [field]: value } : brochure
      )
    }));
  };

  // Handle campus location management
  const handleAddCampusLocation = () => {
    const newLocation = {
      name: '',
      address: '',
      description: '',
      coordinates: {
        lat: '',
        lng: ''
      }
    };
    setEstablishment(prev => ({
      ...prev,
      campusLocations: [...(prev.campusLocations || []), newLocation]
    }));
  };

  const handleRemoveCampusLocation = (index) => {
    setEstablishment(prev => ({
      ...prev,
      campusLocations: prev.campusLocations.filter((_, i) => i !== index)
    }));
  };

  const handleCampusLocationChange = (index, field, value) => {
    setEstablishment(prev => ({
      ...prev,
      campusLocations: prev.campusLocations.map((location, i) => 
        i === index ? { ...location, [field]: value } : location
      )
    }));
  };

  const handleCampusLocationCoordinateChange = (index, coordinate, value) => {
    setEstablishment(prev => ({
      ...prev,
      campusLocations: prev.campusLocations.map((location, i) => 
        i === index ? { 
          ...location, 
          coordinates: { 
            ...location.coordinates, 
            [coordinate]: value 
          } 
        } : location
      )
    }));
  };

  // Handle campus photo management
  const handleUpdatePhoto = (index, field, value) => {
    setEstablishment(prev => ({
      ...prev,
      campusPhotos: prev.campusPhotos.map((photo, i) => 
        i === index ? { ...photo, [field]: value } : photo
      )
    }));
  };

  const handleRemoveCampusPhoto = (index) => {
    setEstablishment(prev => ({
      ...prev,
      campusPhotos: prev.campusPhotos.filter((_, i) => i !== index)
    }));
  };

  // Load establishment data
  useEffect(() => {
    const loadEstablishment = async () => {
      // Don't load data if creating a new establishment
      if (isNewEstablishment) return;
      
      // Validate id exists and is not undefined
      if (!id || id === 'undefined' || id === 'new') return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('jwt_token');
        
        if (!token) {
          setError('No authentication token found. Please log in again.');
          setTimeout(() => navigate('/admin/establishments'), 2000);
          return;
        }

        const response = await fetch(`/api/admin/establishments/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          setError('Authentication expired. Please log in again.');
          localStorage.removeItem('jwt_token');
          setTimeout(() => navigate('/admin/establishments'), 2000);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to load establishment (${response.status})`);
        }

        const responseData = await response.json();
        console.log('Raw data from API:', responseData);
        console.log('API data keys:', Object.keys(responseData));
        
        // Extraire les données du champ 'data' de la réponse
        const data = responseData.data || responseData;
        console.log('Extracted establishment data:', data);
        console.log('Establishment data keys:', Object.keys(data));
        
        const sanitizedData = sanitizeEstablishmentData(data);
        console.log('Sanitized data:', sanitizedData);
        
        // S'assurer que toutes les propriétés du state initial sont présentes
        const completeData = {
          name: '',
          nameFr: '',
          slug: '',
          country: '',
          city: '',
          type: '',
          rating: '',
          students: '',
          programs: '',
          logo: '',
          description: '',
          descriptionFr: '',
          mission: '',
          missionFr: '',
          foundedYear: '',
          featured: false,
          sponsored: false,
          tuition: '',
          tuitionMin: '',
          tuitionMax: '',
          tuitionCurrency: 'USD',
          acceptanceRate: '',
          worldRanking: '',
          qsRanking: '',
          timesRanking: '',
          arwuRanking: '',
          usNewsRanking: '',
          popularPrograms: [],
          applicationDeadline: '',
          scholarships: false,
          scholarshipTypes: [],
          scholarshipDescription: '',
          housing: false,
          language: '',
          aidvisorRecommended: false,
          easyApply: false,
          universityType: '',
          commissionRate: '',
          freeApplications: '',
          visaSupport: '',
          countrySpecific: {},
          website: '',
          email: '',
          phone: '',
          address: '',
          accreditations: [],
          accommodation: false,
          careerServices: false,
          languageSupport: false,
          isActive: true,
          admissionRequirements: {},
          admissionRequirementsFr: {},
          englishTestRequirements: {},
          academicRequirements: {},
          documentRequirements: {},
          visaRequirements: {},
          applicationFee: '',
          applicationFeeCurrency: 'USD',
          livingCosts: '',
          livingCostsCurrency: 'USD',
          languages: [],
          campusPhotos: [],
          youtubeVideos: [],
          brochures: [],
          campusLocations: [],
          status: 'draft',
          seoTitle: '',
          seoDescription: '',
          seoKeywords: [],
          seoImageAlt: '',
          servicePricing: {
            normalPrice: '',
            promotionPrice: '',
            promotionDeadline: ''
          },
          ...sanitizedData
        };
        
        console.log('Complete data with defaults:', completeData);
        console.log('Key fields check:', {
          name: completeData.name,
          country: completeData.country,
          city: completeData.city,
          type: completeData.type,
          students: completeData.students,
          programs: completeData.programs,
          rating: completeData.rating,
          tuitionMin: completeData.tuitionMin,
          tuitionMax: completeData.tuitionMax,
          tuitionCurrency: completeData.tuitionCurrency
        });
        setEstablishment(completeData);
      } catch (err) {
        console.error('Error loading establishment:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEstablishment();
  }, [id, navigate, isNewEstablishment]);

  // Debug: Log establishment state changes
  useEffect(() => {
    console.log('Establishment state changed:', establishment);
  }, [establishment]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading establishment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Establishment</h1>
              <p className="mt-2 text-gray-600">Manage establishment information and settings</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Admin
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving 
                  ? (isNewEstablishment ? 'Creating...' : 'Saving...') 
                  : (isNewEstablishment ? 'Create Establishment' : 'Save Changes')
                }
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">{success}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Main Content - 2/3 */}
          <div className="flex-1 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={establishment.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="University name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name (French)</label>
                  <input
                    type="text"
                    value={establishment.nameFr}
                    onChange={(e) => handleInputChange('nameFr', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Name in French"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    value={establishment.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="url-friendly-name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <SelectSearchable
                    options={paramOptions.countries}
                    value={establishment.country}
                    onChange={(val) => handleInputChange('country', val)}
                    placeholder="Select a country..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={establishment.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <SelectSearchable
                    options={paramOptions.schoolTypes}
                    value={establishment.type}
                    onChange={(val) => handleInputChange('type', val)}
                    placeholder="Select a type..."
                  />
                </div>
              </div>

              {/* Multi-Intakes */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Multi-Intakes
                </h4>
                <div className="space-y-4">
                  {establishment.multiIntakes?.map((intake, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-medium text-gray-900">Intake {index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => {
                            const newIntakes = [...(establishment.multiIntakes || [])];
                            newIntakes.splice(index, 1);
                            handleInputChange('multiIntakes', newIntakes);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Intake</label>
                          <SelectSearchable 
                            options={intakeOptions} 
                            value={intake.name || ''} 
                            onChange={(v) => {
                              const newIntakes = [...(establishment.multiIntakes || [])];
                              newIntakes[index] = { ...newIntakes[index], name: v };
                              handleInputChange('multiIntakes', newIntakes);
                            }} 
                            placeholder="Select intake..." 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Application Opens</label>
                          <input
                            type="date"
                            value={intake.applicationOpens || ''}
                            onChange={(e) => {
                              const newIntakes = [...(establishment.multiIntakes || [])];
                              newIntakes[index] = { ...newIntakes[index], applicationOpens: e.target.value };
                              handleInputChange('multiIntakes', newIntakes);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Application Closes</label>
                          <input
                            type="date"
                            value={intake.applicationCloses || ''}
                            onChange={(e) => {
                              const newIntakes = [...(establishment.multiIntakes || [])];
                              newIntakes[index] = { ...newIntakes[index], applicationCloses: e.target.value };
                              handleInputChange('multiIntakes', newIntakes);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newIntakes = [...(establishment.multiIntakes || []), {
                        name: '',
                        applicationOpens: '',
                        applicationCloses: ''
                      }];
                      handleInputChange('multiIntakes', newIntakes);
                    }}
                    className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    + Add Intake
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label>
                  <HTMLEditor
                    value={establishment.description}
                    onChange={(value) => handleInputChange('description', value)}
                    placeholder="Establishment description in English"
                    height="200px"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (French)</label>
                  <HTMLEditor
                    value={establishment.descriptionFr}
                    onChange={(value) => handleInputChange('descriptionFr', value)}
                    placeholder="Establishment description in French"
                    height="200px"
                  />
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Students</label>
                  <input
                    type="number"
                    value={establishment.students}
                    onChange={(e) => handleInputChange('students', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de programmes</label>
                  <input
                    type="number"
                    value={establishment.programs}
                    onChange={(e) => handleInputChange('programs', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={establishment.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="4.5"
                  />
                </div>
              </div>
            </div>

            {/* Rankings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rankings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Classement mondial</label>
                  <input
                    type="number"
                    value={establishment.worldRanking}
                    onChange={(e) => handleInputChange('worldRanking', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 150"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">QS World Ranking</label>
                  <input
                    type="number"
                    value={establishment.qsRanking}
                    onChange={(e) => handleInputChange('qsRanking', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Times Higher Education</label>
                  <input
                    type="number"
                    value={establishment.timesRanking}
                    onChange={(e) => handleInputChange('timesRanking', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ARWU (Shanghai)</label>
                  <input
                    type="number"
                    value={establishment.arwuRanking}
                    onChange={(e) => handleInputChange('arwuRanking', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">US News</label>
                  <input
                    type="number"
                    value={establishment.usNewsRanking}
                    onChange={(e) => handleInputChange('usNewsRanking', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 500"
                  />
                </div>
              </div>
            </div>

            {/* Tuition Fees */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tuition Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Tuition</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={establishment.tuitionMin}
                    onChange={(e) => handleInputChange('tuitionMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5000.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Tuition</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={establishment.tuitionMax}
                    onChange={(e) => handleInputChange('tuitionMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15000.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <SelectSearchable
                    options={paramOptions.currencies}
                    value={establishment.tuitionCurrency}
                    onChange={(val) => handleInputChange('tuitionCurrency', val)}
                    placeholder="Select currency..."
                  />
                </div>
              </div>
            </div>

            {/* Application Fees */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Fee</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={establishment.applicationFee}
                    onChange={(e) => handleInputChange('applicationFee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <SelectSearchable
                    options={paramOptions.currencies}
                    value={establishment.applicationFeeCurrency}
                    onChange={(val) => handleInputChange('applicationFeeCurrency', val)}
                    placeholder="Select currency..."
                  />
                </div>
              </div>
            </div>

            {/* Living Costs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Living Costs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Living Costs</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={establishment.livingCosts}
                    onChange={(e) => handleInputChange('livingCosts', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="8000.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <SelectSearchable
                    options={paramOptions.currencies}
                    value={establishment.livingCostsCurrency}
                    onChange={(val) => handleInputChange('livingCostsCurrency', val)}
                    placeholder="Select currency..."
                  />
                </div>
              </div>
            </div>

            {/* Vidéos YouTube */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">YouTube Videos</h3>
              <div className="space-y-4">
                {(establishment.youtubeVideos || []).map((video, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Video {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveYoutubeVideo(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                          type="text"
                          value={video.title}
                          onChange={(e) => handleYoutubeVideoChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Video title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL YouTube</label>
                        <input
                          type="url"
                          value={video.url}
                          onChange={(e) => handleYoutubeVideoChange(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={video.description}
                        onChange={(e) => handleYoutubeVideoChange(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Video description"
                      />
                    </div>
                    {/* Aperçu de la vidéo */}
                    {video.url && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <iframe
                            src={video.url.replace('watch?v=', 'embed/')}
                            className="w-full h-full"
                            allowFullScreen
                            title={video.title || 'Vidéo YouTube'}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddYoutubeVideo}
                  className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add video
                </button>
              </div>
            </div>

            {/* Brochures */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Brochures</h3>
              <div className="space-y-4">
                {(establishment.brochures || []).map((brochure, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Brochure {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveBrochure(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Anglais)</label>
                        <input
                          type="text"
                          value={brochure.name}
                          onChange={(e) => handleBrochureChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom de la brochure en anglais"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name (French)</label>
                        <input
                          type="text"
                          value={brochure.nameFr}
                          onChange={(e) => handleBrochureChange(index, 'nameFr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom de la brochure en français"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
                      <FileUpload
                        files={brochure.file ? [{ id: 1, name: brochure.file.name, type: brochure.file.type, url: brochure.file.url }] : []}
                        onChange={(files) => handleBrochureChange(index, 'file', files[0] || null)}
                        accept=".pdf,.doc,.docx"
                        multiple={false}
                        maxSize={10 * 1024 * 1024} // 10MB
                        label=""
                        description="Format: PDF, DOC, DOCX (max 10MB)"
                        uploadType="brochure"
                      />
                    </div>
                    {/* Aperçu du fichier */}
                    {brochure.file && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <span className="text-red-600 font-semibold text-sm">PDF</span>
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">{brochure.file.name}</p>
                            <p className="text-xs text-gray-500">{brochure.file.type}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <a
                              href={brochure.file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Ouvrir
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddBrochure}
                  className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add brochure
                </button>
              </div>
            </div>

            {/* Bibliothèque de photos */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Library</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add photos</label>
                  <FileUpload
                    files={establishment.campusPhotos || []}
                    onChange={(files) => handleInputChange('campusPhotos', files)}
                    accept="image/*"
                    multiple={true}
                    maxFiles={10}
                    maxSize={5 * 1024 * 1024} // 5MB
                    label=""
                    description="Format: JPG, PNG, WEBP (max 5MB par image, max 10 images)"
                    uploadType="campus-photo"
                  />
                </div>
                
                {/* Aperçu des photos avec gestion des alt */}
                {(establishment.campusPhotos || []).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gestion des photos</label>
                    <div className="space-y-4">
                      {(establishment.campusPhotos || []).map((photo, index) => (
                        <div key={photo.id || index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex gap-4">
                            {/* Aperçu de l'image */}
                            <div className="flex-shrink-0">
                              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={photo.url}
                                  alt={photo.alt || `Photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                                  <div className="text-center">
                                    <div className="text-gray-400 mb-1">📷</div>
                                    <div>Image non trouvée</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Informations et contrôles */}
                            <div className="flex-1 space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Texte alternatif (Alt) - SEO
                                </label>
                                <input
                                  type="text"
                                  value={photo.alt || ''}
                                  onChange={(e) => handleUpdatePhoto(index, 'alt', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Image description for SEO and accessibility"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Important for SEO and accessibility. Describe the image content.
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                  <div><strong>Nom:</strong> {photo.name}</div>
                                  <div><strong>Taille:</strong> {photo.size ? (photo.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}</div>
                                </div>
                                <button
                                  onClick={() => handleRemoveCampusPhoto(index)}
                                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Localisation des campus */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campus Locations</h3>
              <div className="space-y-4">
                {(establishment.campusLocations || []).map((location, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Campus {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveCampusLocation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campus name</label>
                        <input
                          type="text"
                          value={location.name}
                          onChange={(e) => handleUpdateCampusLocation(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Campus principal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                        <input
                          type="text"
                          value={location.address}
                          onChange={(e) => handleUpdateCampusLocation(index, 'address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Adresse complète"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Integration Code</label>
                      <textarea
                        value={location.googleMapsEmbed}
                        onChange={(e) => handleUpdateCampusLocation(index, 'googleMapsEmbed', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Collez ici le code iframe de Google Maps..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Copiez le code d'intégration depuis Google Maps (iframe)
                      </p>
                    </div>
                    {/* Aperçu de la carte */}
                    {location.googleMapsEmbed && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Map Preview</label>
                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                          <div 
                            dangerouslySetInnerHTML={{ __html: location.googleMapsEmbed }}
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddCampusLocation}
                  className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add campus
                </button>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Optimization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre SEO</label>
                  <input
                    type="text"
                    value={establishment.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Titre optimisé pour les moteurs de recherche"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {establishment.seoTitle.length}/60 caractères (recommandé: 30-60)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords</label>
                  <MultiSelectSearchable
                    options={[
                      { value: 'université', label: 'Université' },
                      { value: 'études', label: 'Études' },
                      { value: 'master', label: 'Master' },
                      { value: 'bachelor', label: 'Bachelor' },
                      { value: 'doctorat', label: 'Doctorat' },
                      { value: 'ingénierie', label: 'Ingénierie' },
                      { value: 'business', label: 'Business' },
                      { value: 'médecine', label: 'Médecine' },
                      { value: 'droit', label: 'Droit' },
                      { value: 'sciences', label: 'Sciences' },
                      { value: 'arts', label: 'Arts' },
                      { value: 'informatique', label: 'Informatique' },
                      { value: 'marketing', label: 'Marketing' },
                      { value: 'finance', label: 'Finance' },
                      { value: 'international', label: 'International' },
                      { value: 'bourse', label: 'Bourse' },
                      { value: 'admission', label: 'Admission' },
                      { value: 'campus', label: 'Campus' },
                      { value: 'étudiant', label: 'Étudiant' },
                      { value: 'formation', label: 'Formation' }
                    ]}
                    value={establishment.seoKeywords || []}
                    onChange={(keywords) => handleInputChange('seoKeywords', keywords)}
                    placeholder="Select keywords"
                    searchPlaceholder="Search keywords..."
                    allowCreate={true}
                    createLabel="Add"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sélectionnez ou ajoutez des mots-clés pertinents pour le SEO
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description SEO</label>
                <textarea
                  value={establishment.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description optimisée pour les moteurs de recherche"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {establishment.seoDescription.length}/160 caractères (recommandé: 120-160)
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="w-80 space-y-6">
            {/* Publication Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publication Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={establishment.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {establishment.status === 'published' 
                      ? 'The establishment is visible on the public website' 
                      : 'The establishment is in draft mode and is not publicly visible'
                    }
                  </p>
                </div>
                
                {establishment.status === 'published' && establishment.slug && (
                  <a
                    href={`/establishments/${establishment.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Public Page
                  </a>
                )}
              </div>
            </div>

            {/* Type Université */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">University Type</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <SelectSearchable
                  options={paramOptions.universityTypes}
                  value={establishment.universityType}
                  onChange={(val) => handleInputChange('universityType', val)}
                  placeholder="Sélectionner un type..."
                />
              </div>
            </div>

            {/* Configuration des Prix selon le Type */}
            {establishment.universityType && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Pricing Configuration</h3>
                
                {establishment.universityType === 'B' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Type B - Service Fee Required</h4>
                      <p className="text-sm text-blue-700">Configure the service fee for Type B universities</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Normal Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={establishment.servicePricing.normalPrice}
                          onChange={(e) => handleServicePricingChange('normalPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={establishment.servicePricing.promotionPrice}
                          onChange={(e) => handleServicePricingChange('promotionPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <SelectSearchable
                          options={paramOptions.currencies}
                          value={establishment.servicePricing.currency}
                          onChange={(val) => handleServicePricingChange('currency', val)}
                          placeholder="Select currency..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Deadline (Optional)</label>
                      <input
                        type="date"
                        value={establishment.servicePricing.promotionDeadline}
                        onChange={(e) => handleServicePricingChange('promotionDeadline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {establishment.universityType === 'A' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">Type A - Free Applications</h4>
                      <p className="text-sm text-green-700">Configure pricing for additional services</p>
                    </div>
                    
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Normal Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={establishment.servicePricing.normalPrice}
                          onChange={(e) => handleServicePricingChange('normalPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">Standard price for additional services</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={establishment.servicePricing.promotionPrice}
                          onChange={(e) => handleServicePricingChange('promotionPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">Promotional price (optional)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <SelectSearchable
                          options={paramOptions.currencies}
                          value={establishment.servicePricing.currency}
                          onChange={(val) => handleServicePricingChange('currency', val)}
                          placeholder="Select currency..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Deadline (Optional)</label>
                      <input
                        type="date"
                        value={establishment.servicePricing.promotionDeadline}
                        onChange={(e) => handleServicePricingChange('promotionDeadline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logo */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <FileUpload
                    files={establishment.logo ? [{ id: 1, name: 'logo.png', type: 'image/png', url: establishment.logo }] : []}
                    onChange={(files) => handleInputChange('logo', files[0]?.url || '')}
                    accept="image/*"
                    multiple={false}
                    label=""
                    description="Format recommandé: PNG, JPG (max 2MB)"
                  />
                </div>
                
                {/* Aperçu du logo */}
                {establishment.logo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo Preview</label>
                    <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                      <div className="relative">
                        <img
                          src={establishment.logo}
                          alt="Logo de l'établissement"
                          className="max-h-24 max-w-full object-contain"
                        />
                        <button
                          onClick={() => handleInputChange('logo', '')}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acceptance Rate</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Acceptance Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={establishment.acceptanceRate}
                    onChange={(e) => handleInputChange('acceptanceRate', e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 25.5"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter only the numeric value (e.g: 25.5 for 25.5%)
                </p>
              </div>
            </div>

            {/* Study Languages */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Languages</h3>
              <MultiSelectSearchable
                options={paramOptions.languages}
                value={establishment.languages || []}
                onChange={(value) => {
                  // Stocker uniquement les values (codes) des langues sélectionnées
                  const languageCodes = value.map(item => 
                    typeof item === 'string' ? item : item.value
                  );
                  handleInputChange('languages', languageCodes);
                }}
                placeholder="Select languages"
                searchPlaceholder="Search for a language..."
                label=""
                allowCreate={true}
                createLabel="Add language"
              />
            </div>

            {/* Calculateur SEO */}
            <SEOCalculator establishment={establishment} />

            {/* Fonctionnalités */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={establishment.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">En vedette</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={establishment.aidvisorRecommended}
                    onChange={(e) => handleInputChange('aidvisorRecommended', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Recommended by E-DVISOR</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={establishment.scholarships}
                    onChange={(e) => handleInputChange('scholarships', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Bourses disponibles</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={establishment.housing}
                    onChange={(e) => handleInputChange('housing', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Logement disponible</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={establishment.easyApply}
                    onChange={(e) => handleInputChange('easyApply', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Candidature facile</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={establishment.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Actif</span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminEstablishmentEdit;

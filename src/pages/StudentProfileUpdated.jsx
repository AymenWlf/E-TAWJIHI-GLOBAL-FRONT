import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  User, Edit3, Save, X, MapPin, Calendar, Phone, Mail, 
  GraduationCap, Award, Globe, Heart, FileText, Settings,
  CheckCircle, AlertCircle, Star,
  Building2, BookOpen, Target, MessageCircle, Bell, Plus,
  ShoppingBag, CreditCard, MessageSquare, HelpCircle, Lightbulb, Users,
  DollarSign, Trash2, Eye, Download, Languages, ClipboardCheck
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
import DynamicDocumentsSection from '../components/profile/DynamicDocumentsSection';
import DocumentUploadModal from '../components/profile/DocumentUploadModal';
import ServicesSection from '../components/profile/ServicesSection';
import MyTranslationsSection from '../components/profile/MyTranslationsSection';
import TranslationModal from '../components/profile/TranslationModal';
import TestVouchersSection from '../components/profile/TestVouchersSection';
import MyComplaintsSection from '../components/profile/MyComplaintsSection';
import FAQSection from '../components/profile/FAQSection';
import SuggestionsSection from '../components/profile/SuggestionsSection';
import BecomeAmbassadorSection from '../components/profile/BecomeAmbassadorSection';
import SelectSearchable from '../components/ui/SelectSearchable';
import MultiSelect from '../components/ui/MultiSelect';
import SingleSelect from '../components/ui/SingleSelect';
import PhoneInput from '../components/ui/PhoneInput';
import { useAllParameters } from '../hooks/useAllParameters';
import profileService from '../services/profileService';

const StudentProfileUpdated = () => {
  const { section, subsection } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
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
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    nationality: [],
    phone: '',
    whatsapp: '',
    phoneCountry: '',
    whatsappCountry: '',
    passportNumber: '',
    address: '',
    postalCode: '',
    dateOfBirth: '',
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

  // Load profile data
  useEffect(() => {
    loadProfileData();
  }, []);

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

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, qualificationsData, documentsData, applicationsData, shortlistData] = await Promise.all([
        profileService.getProfile(),
        profileService.getQualifications(),
        profileService.getDocuments(),
        profileService.getApplications(),
        profileService.getShortlist()
      ]);

      setProfile(profileData);
      setQualifications(qualificationsData);
      setDocuments(documentsData);
      setApplications(applicationsData);
      setShortlist(shortlistData);

      // Update form data
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        country: Array.isArray(profileData.country) ? profileData.country[0] || '' : (profileData.country || ''),
        city: profileData.city || '',
        nationality: profileData.nationality ? (Array.isArray(profileData.nationality) ? profileData.nationality : [profileData.nationality]) : [],
        phone: profileData.phone || '',
        whatsapp: profileData.whatsapp || '',
        phoneCountry: profileData.phoneCountry || '',
        whatsappCountry: profileData.whatsappCountry || '',
        passportNumber: profileData.passportNumber || '',
        address: profileData.address || '',
        postalCode: profileData.postalCode || '',
        dateOfBirth: profileData.dateOfBirth || '',
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
          ...formData,
          country: formData.country, // Already a string from SingleSelect
          nationality: Array.isArray(formData.nationality) ? formData.nationality : (formData.nationality ? [formData.nationality] : [])
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

  // Document handlers
  const handleUploadDocument = async (file, documentData) => {
    try {
      await profileService.uploadDocument(file, documentData);
      await loadProfileData();
    } catch (err) {
      setError('Failed to upload document');
      console.error('Error uploading document:', err);
    }
  };

  const handleDeleteDocument = async (id) => {
    try {
      await profileService.deleteDocument(id);
      await loadProfileData();
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
    }
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
    // Le composant DynamicDocumentsSection se rafraîchira automatiquement
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

  const handleDeleteApplication = async (id) => {
    try {
      await profileService.deleteApplication(id);
      await loadProfileData();
    } catch (err) {
      setError('Failed to delete application');
      console.error('Error deleting application:', err);
    }
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
    { id: 'ambassador', label: language === 'en' ? 'Become Ambassador' : 'Devenir Ambassadeur', icon: Users }
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
        title={`${profile.fullName || 'Profile'} - Profile | E-TAWJIHI`}
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
                    {profile.fullName || 'Student Profile'}
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

                    {/* Enhanced Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {language === 'en' ? 'First Name' : 'Prénom'}
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {language === 'en' ? 'Last Name' : 'Nom'}
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {language === 'en' ? 'Country' : 'Pays'}
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
                          {language === 'en' ? 'City' : 'Ville'}
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {language === 'en' ? 'Nationality' : 'Nationalité'}
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
                          {language === 'en' ? 'Passport Number' : 'Numéro de Passeport'}
                        </label>
                        <input
                          type="text"
                          value={formData.passportNumber}
                          onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {language === 'en' ? 'Address' : 'Adresse'}
                        </label>
                        <textarea
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 hover:border-gray-400 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {language === 'en' ? 'Postal Code' : 'Code Postal'}
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {language === 'en' ? 'Date of Birth' : 'Date de Naissance'}
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'qualifications' && (
                  <QualificationsTabs
                    qualifications={qualifications}
                    onAddQualification={handleAddQualification}
                    onDeleteQualification={handleDeleteQualification}
                    language={language}
                    activeSubsection={activeSubsection}
                    onSubsectionChange={handleSubsectionChange}
                  />
                )}

                {activeSection === 'preferences' && (
                  <PreferencesSection
                    profile={profile}
                    onUpdateProfile={handleSave}
                    language={language}
                  />
                )}

                {/* Documents Section - Dynamic */}
                {activeSection === 'documents' && (
                  <DynamicDocumentsSection
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

                {activeSection === 'applications' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {language === 'en' ? 'My Applications' : 'Mes Candidatures'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {language === 'en' ? 'Track your university applications and their status' : 'Suivez vos candidatures universitaires et leur statut'}
                        </p>
                      </div>
                      <button
                        onClick={() => setApplicationModal({ isOpen: true, application: null })}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{language === 'en' ? 'Add Application' : 'Ajouter une Candidature'}</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div key={application.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {application.programName}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${profileService.getStatusColor(application.status)}`}>
                                  {profileService.getStatusText(application.status)}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-2">{application.universityName}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {application.country && (
                                  <span className="flex items-center space-x-1">
                                    <Globe className="w-4 h-4" />
                                    <span>{application.country}</span>
                                  </span>
                                )}
                                {application.applicationDeadline && (
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Deadline: {application.applicationDeadline}</span>
                                  </span>
                                )}
                                {application.tuitionFee && (
                                  <span className="flex items-center space-x-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>${application.tuitionFee}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setApplicationModal({ isOpen: true, application })}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteApplication(application.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {applications.length === 0 && (
                        <div className="text-center py-12">
                          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">
                            {language === 'en' ? 'No applications yet' : 'Aucune candidature pour le moment'}
                          </p>
                          <button
                            onClick={() => setApplicationModal({ isOpen: true, application: null })}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {language === 'en' ? 'Add Your First Application' : 'Ajouter votre Première Candidature'}
                          </button>
                        </div>
                      )}
                    </div>
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
                                <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                        {language === 'fr' ? program.nameFr || program.name : program.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{program.establishment?.name}</p>
                                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{program.degree}</span>
                                        <span>{program.duration}</span>
                                      </div>
                                      {program.tuitionAmount && (
                                        <div className="text-sm font-medium text-gray-900">
                                          {program.tuitionAmount.toLocaleString()} {program.tuitionCurrency}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-400">
                                      {language === 'en' ? 'Added' : 'Ajouté'} {new Date(program.shortlistedAt).toLocaleDateString()}
                                    </div>
                                    <Link
                                      to={`/programs/${program.establishment?.slug}/${program.slug.split('/').pop()}`}
                                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                      {language === 'en' ? 'View Details' : 'Voir Détails'}
                                    </Link>
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
                                <div key={establishment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                        {language === 'fr' ? establishment.nameFr || establishment.name : establishment.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 mb-2">{establishment.city}, {establishment.country}</p>
                                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                        {establishment.worldRanking && (
                                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">#{establishment.worldRanking}</span>
                                        )}
                                        {establishment.rating && (
                                          <span className="flex items-center gap-1">
                                            ⭐ {establishment.rating}
                                          </span>
                                        )}
                                      </div>
                                      {establishment.students && (
                                        <div className="text-sm text-gray-600">
                                          {establishment.students.toLocaleString()} {language === 'en' ? 'students' : 'étudiants'}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-400">
                                      {language === 'en' ? 'Added' : 'Ajouté'} {new Date(establishment.shortlistedAt).toLocaleDateString()}
                                    </div>
                                    <Link
                                      to={`/establishments/${establishment.slug}`}
                                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                    >
                                      {language === 'en' ? 'View Details' : 'Voir Détails'}
                                    </Link>
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

                    {/* Global Empty State */}
                    {shortlist.programs.length === 0 && shortlist.establishments.length === 0 && (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                          {language === 'en' ? 'Your Shortlist is Empty' : 'Votre Liste de Souhaits est Vide'}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          {language === 'en' ? 'Start exploring programs and universities to build your personalized shortlist' : 'Commencez à explorer les programmes et universités pour créer votre liste de souhaits personnalisée'}
                        </p>
                        <Link
                          to="/establishments"
                          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <Search className="w-5 h-5 mr-2" />
                          {language === 'en' ? 'Start Exploring' : 'Commencer l\'Exploration'}
                        </Link>
                      </div>
                    )}
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

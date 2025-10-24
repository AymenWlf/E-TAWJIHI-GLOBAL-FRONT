import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Upload,
  Eye,
  Edit3,
  Save,
  ArrowRight,
  AlertCircle,
  Globe,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import QualificationsTabs from '../components/profile/QualificationsTabs';

const ApplicationProcess = () => {
  const { establishmentSlug, programSlug } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState('en');
  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qualifications, setQualifications] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      gender: '',
      maritalStatus: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      cinNumber: '',
      passportNumber: '',
      whatsapp: '',
      dateOfBirth: '',
      chineseName: '',
      countryOfBirth: '',
      cityOfBirth: '',
      religion: '',
      nativeLanguage: '',
      passportExpirationDate: '',
      alternateEmail: '',
      wechatId: '',
      skypeNo: '',
      emergencyContactName: '',
      emergencyContactGender: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      emergencyContactEmail: '',
      emergencyContactAddress: '',
      hasWorkExperience: false,
      workCompany: '',
      workPosition: '',
      workStartDate: '',
      workEndDate: '',
      workDescription: ''
    },
    academicInfo: {
      currentInstitution: '',
      currentProgram: '',
      graduationYear: '',
      gpa: '',
      gradeSystem: '',
      englishTest: '',
      englishScore: '',
      frenchTest: '',
      frenchScore: '',
      standardizedTest: '',
      standardizedScore: '',
      workExperience: '',
      internships: '',
      researchExperience: '',
      publications: '',
      awards: '',
      extracurricularActivities: '',
      highestEducationLevel: '',
      highestEducationField: '',
      highestEducationCountry: '',
      highestEducationInstitute: '',
      highestEducationQualification: '',
      highestEducationYearsAttended: '',
      highestEducationEntryDate: '',
      highestEducationCompletionDate: '',
      otherEducation1Level: '',
      otherEducation1Field: '',
      otherEducation1Country: '',
      otherEducation1Institute: '',
      otherEducation1Qualification: '',
      otherEducation1YearsAttended: '',
      otherEducation1EntryDate: '',
      otherEducation1CompletionDate: '',
      otherEducation2Level: '',
      otherEducation2Field: '',
      otherEducation2Country: '',
      otherEducation2Institute: '',
      otherEducation2Qualification: '',
      otherEducation2YearsAttended: '',
      otherEducation2EntryDate: '',
      otherEducation2CompletionDate: '',
      employmentEmployer: '',
      employmentWorkEngaged: '',
      employmentTitlePosition: '',
      employmentEntryDate: '',
      employmentCompletionDate: ''
    },
    documents: {
      passport: null,
      transcripts: null,
      englishTest: null,
      frenchTest: null,
      standardizedTest: null,
      motivationLetter: null,
      recommendationLetters: null,
      portfolio: null,
      cv: null,
      birthCertificate: null,
      financialDocuments: null,
      balanceCertificate: null,
      blockingCertificate: null,
      studyProject: null,
      nationalId: null,
      guardian1NationalId: null,
      guardian2NationalId: null,
      medicalCertificate: null,
      policeClearance: null,
      healthCheck: null,
      applicationForm: null,
      bacDiploma: null,
      bacPlus2Diploma: null,
      bacPlus3Diploma: null,
      bacPlus5Diploma: null,
      schoolCertificate: null
    },
    preferences: {
      intake: '',
      accommodation: false,
      scholarship: false,
      visaSupport: false,
      airportPickup: false,
      orientationProgram: false,
      languageSupport: false,
      additionalInfo: ''
    }
  });

  const steps = [
    {
      id: 1,
      title: language === 'en' ? 'Personal Information' : 'Informations Personnelles',
      icon: User,
      description: language === 'en' ? 'Tell us about yourself' : 'Parlez-nous de vous'
    },
    {
      id: 2,
      title: language === 'en' ? 'Academic Background' : 'Parcours Académique',
      icon: GraduationCap,
      description: language === 'en' ? 'Your educational history' : 'Votre historique éducatif'
    },
    {
      id: 3,
      title: language === 'en' ? 'Documents' : 'Documents',
      icon: FileText,
      description: language === 'en' ? 'Upload required documents' : 'Téléchargez les documents requis'
    },
    {
      id: 4,
      title: language === 'en' ? 'Preferences' : 'Préférences',
      icon: BookOpen,
      description: language === 'en' ? 'Your study preferences' : 'Vos préférences d\'études'
    },
    {
      id: 5,
      title: language === 'en' ? 'Review & Submit' : 'Révision et Soumission',
      icon: CheckCircle,
      description: language === 'en' ? 'Review your application' : 'Révisez votre candidature'
    },
    {
      id: 6,
      title: language === 'en' ? 'Pre-admission' : 'Préadmission',
      icon: Award,
      description: language === 'en' ? 'Pre-admission process' : 'Processus de préadmission'
    },
    {
      id: 7,
      title: language === 'en' ? 'Confirm Enrolment' : 'Confirmer l\'Inscription',
      icon: Users,
      description: language === 'en' ? 'Confirm your enrolment' : 'Confirmez votre inscription'
    },
    {
      id: 8,
      title: language === 'en' ? 'Final Offer' : 'Offre Finale',
      icon: Briefcase,
      description: language === 'en' ? 'Final offer letter' : 'Lettre d\'offre finale'
    },
    {
      id: 9,
      title: language === 'en' ? 'Visa' : 'Visa',
      icon: Globe,
      description: language === 'en' ? 'Visa application' : 'Demande de visa'
    },
    {
      id: 10,
      title: language === 'en' ? 'Enroll' : 'S\'Inscrire',
      icon: CheckCircle,
      description: language === 'en' ? 'Final enrollment' : 'Inscription finale'
    }
  ];

  useEffect(() => {
    // Simulate loading program data
    const loadProgramData = async () => {
      setIsLoading(true);
      // In a real app, you would fetch from API
      setTimeout(() => {
        setProgram({
          name: 'Master in Business Administration',
          establishment: {
            name: 'NEOMA Business School',
            logo: '/images/neoma-logo.png'
          },
          duration: '2',
          durationUnit: 'years',
          studyType: 'Full-time'
        });
        setIsLoading(false);
      }, 1000);
    };

    loadProgramData();
  }, [establishmentSlug, programSlug]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Qualification management functions
  const handleAddQualification = (qualificationData) => {
    setQualifications(prev => [...prev, qualificationData]);
  };

  const handleDeleteQualification = (index) => {
    setQualifications(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // In a real app, you would submit to API
    alert(language === 'en' ? 'Application submitted successfully!' : 'Candidature soumise avec succès!');
    navigate('/');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Admission Team Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">E-T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'Please ensure all personal information is accurate and matches your official documents. This information will be used for your application processing.'
                      : 'Veuillez vous assurer que toutes les informations personnelles sont exactes et correspondent à vos documents officiels. Ces informations seront utilisées pour le traitement de votre candidature.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? 'Personal Information' : 'Informations Personnelles'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Tell us about yourself' : 'Parlez-nous de vous'}
                </p>
              </div>
            </div>
            
            {/* Basic Identity Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                {language === 'en' ? 'Basic Identity Information' : 'Informations d\'Identité de Base'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'First Name' : 'Prénom'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Last Name' : 'Nom de famille'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Email' : 'Email'} *
                </label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Phone' : 'Téléphone'} *
                </label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'WhatsApp' : 'WhatsApp'} *
                </label>
                <input
                  type="tel"
                  value={formData.personalInfo.whatsapp}
                  onChange={(e) => handleInputChange('personalInfo', 'whatsapp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter your WhatsApp number' : 'Saisissez votre numéro WhatsApp'}
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Chinese Name' : 'Nom Chinois'}
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.chineseName}
                  onChange={(e) => handleInputChange('personalInfo', 'chineseName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter your Chinese name' : 'Saisissez votre nom chinois'}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Country of Birth' : 'Pays de Naissance'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.countryOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'countryOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter your country of birth' : 'Saisissez votre pays de naissance'}
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'City of Birth' : 'Ville de Naissance'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.cityOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'cityOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter your city of birth' : 'Saisissez votre ville de naissance'}
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Religion' : 'Religion'}
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.religion}
                  onChange={(e) => handleInputChange('personalInfo', 'religion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter your religion' : 'Saisissez votre religion'}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Native Language' : 'Langue Maternelle'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.nativeLanguage}
                  onChange={(e) => handleInputChange('personalInfo', 'nativeLanguage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter your native language' : 'Saisissez votre langue maternelle'}
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Passport Expiration Date' : 'Date d\'Expiration du Passeport'} *
                </label>
                <input
                  type="date"
                  value={formData.personalInfo.passportExpirationDate}
                  onChange={(e) => handleInputChange('personalInfo', 'passportExpirationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Alternate Email' : 'Email Alternatif'}
                </label>
                <input
                  type="email"
                  value={formData.personalInfo.alternateEmail}
                  onChange={(e) => handleInputChange('personalInfo', 'alternateEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter alternate email' : 'Saisissez un email alternatif'}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'WeChat ID' : 'ID WeChat'}
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.wechatId}
                  onChange={(e) => handleInputChange('personalInfo', 'wechatId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter your WeChat ID' : 'Saisissez votre ID WeChat'}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'SKYPE No.' : 'Numéro SKYPE'}
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.skypeNo}
                  onChange={(e) => handleInputChange('personalInfo', 'skypeNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter your SKYPE number' : 'Saisissez votre numéro SKYPE'}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Date of Birth' : 'Date de naissance'} *
                </label>
                <input
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Nationality' : 'Nationalité'} *
                </label>
                <select
                  value={formData.personalInfo.nationality}
                  onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">{language === 'en' ? 'Select nationality' : 'Sélectionner la nationalité'}</option>
                  <option value="moroccan">Moroccan</option>
                  <option value="french">French</option>
                  <option value="algerian">Algerian</option>
                  <option value="tunisian">Tunisian</option>
                  <option value="canadian">Canadian</option>
                  <option value="american">American</option>
                  <option value="british">British</option>
                  <option value="german">German</option>
                  <option value="spanish">Spanish</option>
                  <option value="italian">Italian</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Gender' : 'Genre'} *
                </label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">{language === 'en' ? 'Select gender' : 'Sélectionner le genre'}</option>
                  <option value="male">{language === 'en' ? 'Male' : 'Homme'}</option>
                  <option value="female">{language === 'en' ? 'Female' : 'Femme'}</option>
                  <option value="other">{language === 'en' ? 'Other' : 'Autre'}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Marital Status' : 'Statut Matrimonial'}
                </label>
                <select
                  value={formData.personalInfo.maritalStatus}
                  onChange={(e) => handleInputChange('personalInfo', 'maritalStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">{language === 'en' ? 'Select status' : 'Sélectionner le statut'}</option>
                  <option value="single">{language === 'en' ? 'Single' : 'Célibataire'}</option>
                  <option value="married">{language === 'en' ? 'Married' : 'Marié(e)'}</option>
                  <option value="divorced">{language === 'en' ? 'Divorced' : 'Divorcé(e)'}</option>
                  <option value="widowed">{language === 'en' ? 'Widowed' : 'Veuf/Veuve'}</option>
                </select>
              </div>
              
              <div className="lg:col-span-3">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Address' : 'Adresse'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.address}
                  onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'City' : 'Ville'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.city}
                  onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Country' : 'Pays'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.country}
                  onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Postal Code' : 'Code Postal'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.postalCode}
                  onChange={(e) => handleInputChange('personalInfo', 'postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'CIN Number' : 'Numéro de CIN'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.cinNumber}
                  onChange={(e) => handleInputChange('personalInfo', 'cinNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter your CIN number' : 'Saisissez votre numéro de CIN'}
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Passport Number' : 'Numéro de Passeport'} *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.passportNumber}
                  onChange={(e) => handleInputChange('personalInfo', 'passportNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Enter your passport number' : 'Saisissez votre numéro de passeport'}
                  required
                />
              </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                {language === 'en' ? 'Contact Information' : 'Informations de Contact'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Email' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Phone' : 'Téléphone'} *
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'WhatsApp' : 'WhatsApp'} *
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.whatsapp}
                    onChange={(e) => handleInputChange('personalInfo', 'whatsapp', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter your WhatsApp number' : 'Saisissez votre numéro WhatsApp'}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Alternate Email' : 'Email Alternatif'}
                  </label>
                  <input
                    type="email"
                    value={formData.personalInfo.alternateEmail}
                    onChange={(e) => handleInputChange('personalInfo', 'alternateEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter alternate email' : 'Saisissez un email alternatif'}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'WeChat ID' : 'ID WeChat'}
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.wechatId}
                    onChange={(e) => handleInputChange('personalInfo', 'wechatId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter your WeChat ID' : 'Saisissez votre ID WeChat'}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'SKYPE No.' : 'Numéro SKYPE'}
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.skypeNo}
                    onChange={(e) => handleInputChange('personalInfo', 'skypeNo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter your SKYPE number' : 'Saisissez votre numéro SKYPE'}
                  />
                </div>
              </div>
            </div>
            
            {/* Address Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                {language === 'en' ? 'Address Information' : 'Informations d\'Adresse'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Address' : 'Adresse'} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'City' : 'Ville'} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.city}
                    onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Country' : 'Pays'} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.country}
                    onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Postal Code' : 'Code Postal'} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.postalCode}
                    onChange={(e) => handleInputChange('personalInfo', 'postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Official Documents */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                {language === 'en' ? 'Official Documents' : 'Documents Officiels'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'CIN Number' : 'Numéro de CIN'} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.cinNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'cinNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter your CIN number' : 'Saisissez votre numéro de CIN'}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Passport Number' : 'Numéro de Passeport'} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.passportNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'passportNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter your passport number' : 'Saisissez votre numéro de passeport'}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Passport Expiration Date' : 'Date d\'Expiration du Passeport'} *
                  </label>
                  <input
                    type="date"
                    value={formData.personalInfo.passportExpirationDate}
                    onChange={(e) => handleInputChange('personalInfo', 'passportExpirationDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Emergency Contact Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                {language === 'en' ? 'Emergency Contact Information' : 'Informations de Contact d\'Urgence'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Emergency Contact Name' : 'Nom du Contact d\'Urgence'} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.emergencyContactName}
                    onChange={(e) => handleInputChange('personalInfo', 'emergencyContactName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter emergency contact name' : 'Saisissez le nom du contact d\'urgence'}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Gender' : 'Genre'} *
                  </label>
                  <select
                    value={formData.personalInfo.emergencyContactGender}
                    onChange={(e) => handleInputChange('personalInfo', 'emergencyContactGender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">{language === 'en' ? 'Select gender' : 'Sélectionner le genre'}</option>
                    <option value="male">{language === 'en' ? 'Male' : 'Homme'}</option>
                    <option value="female">{language === 'en' ? 'Female' : 'Femme'}</option>
                    <option value="other">{language === 'en' ? 'Other' : 'Autre'}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Relationship to you' : 'Relation avec vous'} *
                  </label>
                  <select
                    value={formData.personalInfo.emergencyContactRelationship}
                    onChange={(e) => handleInputChange('personalInfo', 'emergencyContactRelationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Phone' : 'Téléphone'} *
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.emergencyContactPhone}
                    onChange={(e) => handleInputChange('personalInfo', 'emergencyContactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter emergency contact phone' : 'Saisissez le téléphone du contact d\'urgence'}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Email' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    value={formData.personalInfo.emergencyContactEmail}
                    onChange={(e) => handleInputChange('personalInfo', 'emergencyContactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter emergency contact email' : 'Saisissez l\'email du contact d\'urgence'}
                    required
                  />
                </div>
                
                <div className="lg:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Address' : 'Adresse'} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.emergencyContactAddress}
                    onChange={(e) => handleInputChange('personalInfo', 'emergencyContactAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter emergency contact address' : 'Saisissez l\'adresse du contact d\'urgence'}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Work Experience Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                {language === 'en' ? 'Work Experience Information' : 'Informations sur l\'Expérience Professionnelle'}
              </h4>
              
              {/* Work Experience Toggle */}
              <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.personalInfo.hasWorkExperience}
                    onChange={(e) => handleInputChange('personalInfo', 'hasWorkExperience', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'en' ? 'I have work experience' : 'J\'ai une expérience professionnelle'}
                  </span>
                </label>
              </div>
              
              {/* Work Experience Fields - Conditionally Rendered */}
              {formData.personalInfo.hasWorkExperience && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Company Name' : 'Nom de l\'Entreprise'} *
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.workCompany}
                      onChange={(e) => handleInputChange('personalInfo', 'workCompany', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={language === 'en' ? 'Enter company name' : 'Saisissez le nom de l\'entreprise'}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Position/Job Title' : 'Poste/Titre du Travail'} *
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.workPosition}
                      onChange={(e) => handleInputChange('personalInfo', 'workPosition', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={language === 'en' ? 'Enter your position' : 'Saisissez votre poste'}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Start Date' : 'Date de Début'} *
                    </label>
                    <input
                      type="date"
                      value={formData.personalInfo.workStartDate}
                      onChange={(e) => handleInputChange('personalInfo', 'workStartDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'End Date' : 'Date de Fin'}
                    </label>
                    <input
                      type="date"
                      value={formData.personalInfo.workEndDate}
                      onChange={(e) => handleInputChange('personalInfo', 'workEndDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={language === 'en' ? 'Leave empty if still working' : 'Laissez vide si vous travaillez encore'}
                    />
                  </div>
                  
                  <div className="lg:col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Job Description' : 'Description du Travail'}
                    </label>
                    <textarea
                      value={formData.personalInfo.workDescription}
                      onChange={(e) => handleInputChange('personalInfo', 'workDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={language === 'en' ? 'Describe your responsibilities and achievements' : 'Décrivez vos responsabilités et réalisations'}
                    />
                  </div>
                </div>
              )}
            </div>
            
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Admission Team Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">E-T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'Please provide all your academic qualifications, language test results, and standardized test scores. This information is crucial for program eligibility assessment.'
                      : 'Veuillez fournir toutes vos qualifications académiques, résultats de tests de langue et scores de tests standardisés. Ces informations sont cruciales pour l\'évaluation de l\'éligibilité au programme.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? 'Academic Background' : 'Parcours Académique'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Your educational and language background' : 'Votre parcours éducatif et linguistique'}
                </p>
              </div>
            </div>
            
            
            {/* Qualifications */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <QualificationsTabs
                qualifications={qualifications}
                onAddQualification={handleAddQualification}
                onDeleteQualification={handleDeleteQualification}
                language={language}
                activeSubsection="academic"
                onSubsectionChange={() => {}}
              />
            </div>
              
            
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">E-T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'Please upload all required documents in PDF format. Ensure documents are clear, readable, and properly translated if needed. Incomplete documentation may delay your application.'
                      : 'Veuillez télécharger tous les documents requis au format PDF. Assurez-vous que les documents sont clairs, lisibles et correctement traduits si nécessaire. Une documentation incomplète peut retarder votre candidature.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? 'Required Documents' : 'Documents Requis'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Upload required documents' : 'Téléchargez les documents requis'}
                </p>
              </div>
            </div>
            
            {/* Language Requirements Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    {language === 'en' ? 'Document Language Requirements' : 'Exigences de Langue des Documents'}
                  </h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>
                      {language === 'en' 
                        ? 'All documents must be submitted in the following languages:'
                        : 'Tous les documents doivent être soumis dans les langues suivantes :'
                      }
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>
                        <strong>{language === 'en' ? 'French' : 'Français'}</strong>: 
                        {language === 'en' 
                          ? ' For studies in France (Case: Study in France)'
                          : ' Pour les études en France (Cas : Étude en France)'
                        }
                      </li>
                      <li>
                        <strong>{language === 'en' ? 'English' : 'Anglais'}</strong>: 
                        {language === 'en' 
                          ? ' For all other cases'
                          : ' Pour tous les autres cas'
                        }
                      </li>
                    </ul>
                    <p className="mt-3">
                      {language === 'en' 
                        ? 'If you need document translation services, please visit our '
                        : 'Si vous avez besoin de services de traduction de documents, veuillez visiter notre '
                      }
                      <a 
                        href="/profile/translations" 
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {language === 'en' ? 'translation page' : 'page de traduction'}
                      </a>
                      {language === 'en' ? '.' : '.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Personal Documents */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  {language === 'en' ? 'Personal Documents' : 'Documents Personnels'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      key: 'passport', 
                      label: language === 'en' ? 'Passport Copy' : 'Copie du Passeport', 
                      required: true,
                      description: language === 'en' 
                        ? 'Valid passport with at least 6 months validity. All pages must be clearly visible and in color.'
                        : 'Passeport valide avec au moins 6 mois de validité. Toutes les pages doivent être clairement visibles et en couleur.'
                    },
                    { 
                      key: 'nationalId', 
                      label: language === 'en' ? 'National ID Card' : 'Carte Nationale', 
                      required: true,
                      description: language === 'en' 
                        ? 'Front and back of your national identity card. Must be clearly readable and not expired.'
                        : 'Recto et verso de votre carte d\'identité nationale. Doit être clairement lisible et non expirée.'
                    },
                    { 
                      key: 'birthCertificate', 
                      label: language === 'en' ? 'Birth Certificate' : 'Acte de Naissance', 
                      required: true,
                      description: language === 'en' 
                        ? 'Official birth certificate issued by civil authorities. Must be translated if not in French/English.'
                        : 'Acte de naissance officiel délivré par les autorités civiles. Doit être traduit s\'il n\'est pas en français/anglais.'
                    },
                    { 
                      key: 'cv', 
                      label: language === 'en' ? 'Curriculum Vitae (CV)' : 'Curriculum Vitae (CV)', 
                      required: true,
                      description: language === 'en' 
                        ? 'Updated CV with your educational background, work experience, and skills. Maximum 2 pages.'
                        : 'CV mis à jour avec votre parcours éducatif, expérience professionnelle et compétences. Maximum 2 pages.'
                    },
                    { 
                      key: 'guardian1NationalId', 
                      label: language === 'en' ? 'Guardian 1 National ID' : 'Carte Nationale Tuteur 1', 
                      required: true,
                      description: language === 'en' 
                        ? 'National ID of your first guardian. Both sides must be visible and clearly readable.'
                        : 'Carte d\'identité de votre premier tuteur. Les deux côtés doivent être visibles et clairement lisibles.'
                    },
                    { 
                      key: 'guardian2NationalId', 
                      label: language === 'en' ? 'Guardian 2 National ID' : 'Carte Nationale Tuteur 2', 
                      required: false,
                      description: language === 'en' 
                        ? 'National ID of your second guardian (if applicable). Both sides must be visible.'
                        : 'Carte d\'identité de votre deuxième tuteur (si applicable). Les deux côtés doivent être visibles.'
                    },
                    { 
                      key: 'medicalCertificate', 
                      label: language === 'en' ? 'Medical Certificate' : 'Certificat Médical', 
                      required: false,
                      description: language === 'en' 
                        ? 'Medical certificate confirming good health. Must be issued by a licensed physician within 6 months.'
                        : 'Certificat médical confirmant une bonne santé. Doit être délivré par un médecin agréé dans les 6 derniers mois.'
                    },
                    { 
                      key: 'policeClearance', 
                      label: language === 'en' ? 'Police Clearance Certificate' : 'Certificat de Bonne Conduite', 
                      required: false,
                      description: language === 'en' 
                        ? 'Police clearance certificate from your country of residence. Must be issued within 6 months.'
                        : 'Certificat de bonne conduite de votre pays de résidence. Doit être délivré dans les 6 derniers mois.'
                    },
                    { 
                      key: 'healthCheck', 
                      label: language === 'en' ? 'Health Check Certificate' : 'Certificat de Contrôle de Santé', 
                      required: false,
                      description: language === 'en' 
                        ? 'Comprehensive health check certificate including blood tests, X-rays, and general medical examination. Must be issued within 3 months.'
                        : 'Certificat de contrôle de santé complet incluant analyses de sang, radiographies et examen médical général. Doit être délivré dans les 3 derniers mois.'
                    }
                  ].map((doc) => (
                    <div key={doc.key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{doc.label}</h4>
                          {doc.required && (
                            <span className="text-red-500 text-xs">* {language === 'en' ? 'Required' : 'Requis'}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{doc.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <a 
                            href="#" 
                            className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              // In a real app, this would open a modal or new page with the example
                              alert(language === 'en' ? 'Example document preview would open here' : 'Aperçu du document exemple s\'ouvrirait ici');
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {language === 'en' ? 'View Example' : 'Voir Exemple'}
                          </a>
                          <a 
                            href="#" 
                            className="text-xs text-green-600 hover:text-green-800 underline flex items-center gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              // In a real app, this would download the template
                              alert(language === 'en' ? 'Template download would start here' : 'Le téléchargement du modèle commencerait ici');
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {language === 'en' ? 'Download Template' : 'Télécharger Modèle'}
                          </a>
                          {doc.key === 'cv' && (
                            <a 
                              href="/cv-generator" 
                              className="text-xs text-purple-600 hover:text-purple-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use CV Generator' : 'Utiliser Générateur CV'}
                            </a>
                          )}
                          {doc.key === 'motivationLetter' && (
                            <a 
                              href="/motivation-letter-generator" 
                              className="text-xs text-orange-600 hover:text-orange-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Motivation Letter Generator' : 'Utiliser Générateur Lettre de Motivation'}
                            </a>
                          )}
                          {doc.key === 'applicationForm' && (
                            <a 
                              href="/application-form-generator" 
                              className="text-xs text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Application Form Generator' : 'Utiliser Générateur Formulaire de Candidature'}
                            </a>
                          )}
                          {doc.key === 'studyProject' && (
                            <a 
                              href="/study-project-generator" 
                              className="text-xs text-teal-600 hover:text-teal-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Study Project Generator' : 'Utiliser Générateur Projet d\'Étude'}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                            className="hidden"
                            id={`file-${doc.key}`}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor={`file-${doc.key}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-all duration-200 text-sm font-medium"
                          >
                            <Upload className="w-4 h-4 inline mr-2" />
                            {language === 'en' ? 'Upload' : 'Télécharger'}
                          </label>
                          {formData.documents[doc.key] && (
                            <span className="text-green-600 text-sm flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {language === 'en' ? 'Uploaded' : 'Téléchargé'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Documents */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  {language === 'en' ? 'Academic Documents' : 'Documents Académiques'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      key: 'transcripts', 
                      label: language === 'en' ? 'Academic Transcripts' : 'Relevés de Notes', 
                      required: true,
                      description: language === 'en' 
                        ? 'Official academic transcripts from all institutions attended. Must be translated if not in French/English.'
                        : 'Relevés de notes officiels de tous les établissements fréquentés. Doivent être traduits s\'ils ne sont pas en français/anglais.'
                    },
                    { 
                      key: 'englishTest', 
                      label: language === 'en' ? 'English Test Certificate' : 'Certificat de Test d\'Anglais', 
                      required: false,
                      description: language === 'en' 
                        ? 'IELTS, TOEFL, PTE, or other recognized English proficiency test. Score must be within validity period.'
                        : 'IELTS, TOEFL, PTE ou autre test de compétence en anglais reconnu. Le score doit être dans la période de validité.'
                    },
                    { 
                      key: 'frenchTest', 
                      label: language === 'en' ? 'French Test Certificate' : 'Certificat de Test de Français', 
                      required: false,
                      description: language === 'en' 
                        ? 'TCF, DELF, DALF or other recognized French proficiency test. Required for studies in France.'
                        : 'TCF, DELF, DALF ou autre test de compétence en français reconnu. Requis pour les études en France.'
                    },
                    { 
                      key: 'standardizedTest', 
                      label: language === 'en' ? 'Standardized Test Certificate' : 'Certificat de Test Standardisé', 
                      required: false,
                      description: language === 'en' 
                        ? 'GMAT, GRE, SAT, ACT, or LSAT scores if required by the program. Must be within validity period.'
                        : 'Scores GMAT, GRE, SAT, ACT ou LSAT si requis par le programme. Doivent être dans la période de validité.'
                    },
                    { 
                      key: 'portfolio', 
                      label: language === 'en' ? 'Portfolio (if applicable)' : 'Portfolio (si applicable)', 
                      required: false,
                      description: language === 'en' 
                        ? 'Creative portfolio for design, art, or architecture programs. Maximum 20 pages, PDF format preferred.'
                        : 'Portfolio créatif pour les programmes de design, art ou architecture. Maximum 20 pages, format PDF préféré.'
                    },
                    { 
                      key: 'bacDiploma', 
                      label: language === 'en' ? 'Baccalaureate Diploma' : 'Diplôme du Bac', 
                      required: true,
                      description: language === 'en' 
                        ? 'Official baccalaureate diploma or equivalent high school graduation certificate. Must be translated if not in French/English.'
                        : 'Diplôme du baccalauréat officiel ou certificat de fin d\'études secondaires équivalent. Doit être traduit s\'il n\'est pas en français/anglais.'
                    },
                    { 
                      key: 'bacPlus2Diploma', 
                      label: language === 'en' ? 'BAC+2 Diploma' : 'Diplôme BAC+2', 
                      required: false,
                      description: language === 'en' 
                        ? 'Two-year post-secondary diploma (Associate degree, BTS, DUT, etc.). Must be translated if not in French/English.'
                        : 'Diplôme post-secondaire de deux ans (Associate degree, BTS, DUT, etc.). Doit être traduit s\'il n\'est pas en français/anglais.'
                    },
                    { 
                      key: 'bacPlus3Diploma', 
                      label: language === 'en' ? 'BAC+3 Diploma' : 'Diplôme BAC+3', 
                      required: false,
                      description: language === 'en' 
                        ? 'Three-year post-secondary diploma (Bachelor\'s degree, Licence, etc.). Must be translated if not in French/English.'
                        : 'Diplôme post-secondaire de trois ans (Bachelor\'s degree, Licence, etc.). Doit être traduit s\'il n\'est pas en français/anglais.'
                    },
                    { 
                      key: 'bacPlus5Diploma', 
                      label: language === 'en' ? 'BAC+5 Diploma' : 'Diplôme BAC+5', 
                      required: false,
                      description: language === 'en' 
                        ? 'Five-year post-secondary diploma (Master\'s degree, MBA, etc.). Must be translated if not in French/English.'
                        : 'Diplôme post-secondaire de cinq ans (Master\'s degree, MBA, etc.). Doit être traduit s\'il n\'est pas en français/anglais.'
                    },
                    { 
                      key: 'schoolCertificate', 
                      label: language === 'en' ? 'School Certificate' : 'Certificat de Scolarité', 
                      required: true,
                      description: language === 'en' 
                        ? 'Official certificate of enrollment or attendance from your current or most recent educational institution. Must be issued within the last 6 months.'
                        : 'Certificat officiel d\'inscription ou de fréquentation de votre établissement éducatif actuel ou le plus récent. Doit être délivré dans les 6 derniers mois.'
                    }
                  ].map((doc) => (
                    <div key={doc.key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{doc.label}</h4>
                          {doc.required && (
                            <span className="text-red-500 text-xs">* {language === 'en' ? 'Required' : 'Requis'}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{doc.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <a 
                            href="#" 
                            className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              // In a real app, this would open a modal or new page with the example
                              alert(language === 'en' ? 'Example document preview would open here' : 'Aperçu du document exemple s\'ouvrirait ici');
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {language === 'en' ? 'View Example' : 'Voir Exemple'}
                          </a>
                          <a 
                            href="#" 
                            className="text-xs text-green-600 hover:text-green-800 underline flex items-center gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              // In a real app, this would download the template
                              alert(language === 'en' ? 'Template download would start here' : 'Le téléchargement du modèle commencerait ici');
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {language === 'en' ? 'Download Template' : 'Télécharger Modèle'}
                          </a>
                          {doc.key === 'cv' && (
                            <a 
                              href="/cv-generator" 
                              className="text-xs text-purple-600 hover:text-purple-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use CV Generator' : 'Utiliser Générateur CV'}
                            </a>
                          )}
                          {doc.key === 'motivationLetter' && (
                            <a 
                              href="/motivation-letter-generator" 
                              className="text-xs text-orange-600 hover:text-orange-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Motivation Letter Generator' : 'Utiliser Générateur Lettre de Motivation'}
                            </a>
                          )}
                          {doc.key === 'applicationForm' && (
                            <a 
                              href="/application-form-generator" 
                              className="text-xs text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Application Form Generator' : 'Utiliser Générateur Formulaire de Candidature'}
                            </a>
                          )}
                          {doc.key === 'studyProject' && (
                            <a 
                              href="/study-project-generator" 
                              className="text-xs text-teal-600 hover:text-teal-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Study Project Generator' : 'Utiliser Générateur Projet d\'Étude'}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                            className="hidden"
                            id={`file-${doc.key}`}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor={`file-${doc.key}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-all duration-200 text-sm font-medium"
                          >
                            <Upload className="w-4 h-4 inline mr-2" />
                            {language === 'en' ? 'Upload' : 'Télécharger'}
                          </label>
                          {formData.documents[doc.key] && (
                            <span className="text-green-600 text-sm flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {language === 'en' ? 'Uploaded' : 'Téléchargé'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Documents */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  {language === 'en' ? 'Application Documents' : 'Documents de Candidature'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      key: 'motivationLetter', 
                      label: language === 'en' ? 'Motivation Letter' : 'Lettre de Motivation', 
                      required: true,
                      description: language === 'en' 
                        ? 'Personal statement explaining your motivation, goals, and why you chose this program. Maximum 2 pages.'
                        : 'Lettre personnelle expliquant votre motivation, vos objectifs et pourquoi vous avez choisi ce programme. Maximum 2 pages.'
                    },
                    { 
                      key: 'studyProject', 
                      label: language === 'en' ? 'Study Project' : 'Projet d\'Étude', 
                      required: true,
                      description: language === 'en' 
                        ? 'Detailed study project outlining your research interests and academic goals. Maximum 3 pages.'
                        : 'Projet d\'étude détaillé décrivant vos intérêts de recherche et objectifs académiques. Maximum 3 pages.'
                    },
                    { 
                      key: 'recommendationLetters', 
                      label: language === 'en' ? 'Recommendation Letters' : 'Lettres de Recommandation', 
                      required: true,
                      description: language === 'en' 
                        ? 'Academic or professional recommendation letters from teachers, professors, or employers.'
                        : 'Lettres de recommandation académiques ou professionnelles d\'enseignants, professeurs ou employeurs.'
                    },
                    { 
                      key: 'applicationForm', 
                      label: language === 'en' ? 'Application Form' : 'Formulaire de Candidature', 
                      required: true,
                      description: language === 'en' 
                        ? 'Official application form filled out completely and signed. Must be the latest version from the institution.'
                        : 'Formulaire de candidature officiel rempli complètement et signé. Doit être la dernière version de l\'établissement.'
                    }
                  ].map((doc) => (
                    <div key={doc.key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{doc.label}</h4>
                          {doc.required && (
                            <span className="text-red-500 text-xs">* {language === 'en' ? 'Required' : 'Requis'}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{doc.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <a 
                            href="#" 
                            className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              // In a real app, this would open a modal or new page with the example
                              alert(language === 'en' ? 'Example document preview would open here' : 'Aperçu du document exemple s\'ouvrirait ici');
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {language === 'en' ? 'View Example' : 'Voir Exemple'}
                          </a>
                          <a 
                            href="#" 
                            className="text-xs text-green-600 hover:text-green-800 underline flex items-center gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              // In a real app, this would download the template
                              alert(language === 'en' ? 'Template download would start here' : 'Le téléchargement du modèle commencerait ici');
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {language === 'en' ? 'Download Template' : 'Télécharger Modèle'}
                          </a>
                          {doc.key === 'cv' && (
                            <a 
                              href="/cv-generator" 
                              className="text-xs text-purple-600 hover:text-purple-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use CV Generator' : 'Utiliser Générateur CV'}
                            </a>
                          )}
                          {doc.key === 'motivationLetter' && (
                            <a 
                              href="/motivation-letter-generator" 
                              className="text-xs text-orange-600 hover:text-orange-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Motivation Letter Generator' : 'Utiliser Générateur Lettre de Motivation'}
                            </a>
                          )}
                          {doc.key === 'applicationForm' && (
                            <a 
                              href="/application-form-generator" 
                              className="text-xs text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Application Form Generator' : 'Utiliser Générateur Formulaire de Candidature'}
                            </a>
                          )}
                          {doc.key === 'studyProject' && (
                            <a 
                              href="/study-project-generator" 
                              className="text-xs text-teal-600 hover:text-teal-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Study Project Generator' : 'Utiliser Générateur Projet d\'Étude'}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                            className="hidden"
                            id={`file-${doc.key}`}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor={`file-${doc.key}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-all duration-200 text-sm font-medium"
                          >
                            <Upload className="w-4 h-4 inline mr-2" />
                            {language === 'en' ? 'Upload' : 'Télécharger'}
                          </label>
                          {formData.documents[doc.key] && (
                            <span className="text-green-600 text-sm flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {language === 'en' ? 'Uploaded' : 'Téléchargé'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Documents */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  {language === 'en' ? 'Financial Documents' : 'Documents Financiers'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      key: 'financialDocuments', 
                      label: language === 'en' ? 'Financial Documents' : 'Documents Financiers', 
                      required: true,
                      description: language === 'en' 
                        ? 'Additional financial documents such as scholarship letters, sponsor letters, or income certificates.'
                        : 'Documents financiers supplémentaires tels que lettres de bourse, lettres de parrainage ou certificats de revenus.'
                    },
                    { 
                      key: 'balanceCertificate', 
                      label: language === 'en' ? 'Balance Certificate' : 'Attestation de Solde', 
                      required: true,
                      description: language === 'en' 
                        ? 'Bank statement showing sufficient funds for tuition and living expenses. Must be issued within 3 months.'
                        : 'Relevé bancaire montrant des fonds suffisants pour les frais de scolarité et de vie. Doit être délivré dans les 3 derniers mois.'
                    },
                    { 
                      key: 'blockingCertificate', 
                      label: language === 'en' ? 'Blocking Certificate' : 'Attestation de Blocage', 
                      required: true,
                      description: language === 'en' 
                        ? 'Certificate proving that required funds are blocked in your bank account for study purposes.'
                        : 'Certificat prouvant que les fonds requis sont bloqués sur votre compte bancaire à des fins d\'études.'
                    }
                  ].map((doc) => (
                    <div key={doc.key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{doc.label}</h4>
                          {doc.required && (
                            <span className="text-red-500 text-xs">* {language === 'en' ? 'Required' : 'Requis'}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{doc.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <a 
                            href="#" 
                            className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              // In a real app, this would open a modal or new page with the example
                              alert(language === 'en' ? 'Example document preview would open here' : 'Aperçu du document exemple s\'ouvrirait ici');
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {language === 'en' ? 'View Example' : 'Voir Exemple'}
                          </a>
                          <a 
                            href="#" 
                            className="text-xs text-green-600 hover:text-green-800 underline flex items-center gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              // In a real app, this would download the template
                              alert(language === 'en' ? 'Template download would start here' : 'Le téléchargement du modèle commencerait ici');
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {language === 'en' ? 'Download Template' : 'Télécharger Modèle'}
                          </a>
                          {doc.key === 'cv' && (
                            <a 
                              href="/cv-generator" 
                              className="text-xs text-purple-600 hover:text-purple-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use CV Generator' : 'Utiliser Générateur CV'}
                            </a>
                          )}
                          {doc.key === 'motivationLetter' && (
                            <a 
                              href="/motivation-letter-generator" 
                              className="text-xs text-orange-600 hover:text-orange-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Motivation Letter Generator' : 'Utiliser Générateur Lettre de Motivation'}
                            </a>
                          )}
                          {doc.key === 'applicationForm' && (
                            <a 
                              href="/application-form-generator" 
                              className="text-xs text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Application Form Generator' : 'Utiliser Générateur Formulaire de Candidature'}
                            </a>
                          )}
                          {doc.key === 'studyProject' && (
                            <a 
                              href="/study-project-generator" 
                              className="text-xs text-teal-600 hover:text-teal-800 underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {language === 'en' ? 'Use Study Project Generator' : 'Utiliser Générateur Projet d\'Étude'}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                            className="hidden"
                            id={`file-${doc.key}`}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor={`file-${doc.key}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-all duration-200 text-sm font-medium"
                          >
                            <Upload className="w-4 h-4 inline mr-2" />
                            {language === 'en' ? 'Upload' : 'Télécharger'}
                          </label>
                          {formData.documents[doc.key] && (
                            <span className="text-green-600 text-sm flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {language === 'en' ? 'Uploaded' : 'Téléchargé'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">E-T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'Please indicate your study preferences and additional services you may need. This information helps us provide you with the best support during your studies.'
                      : 'Veuillez indiquer vos préférences d\'études et les services supplémentaires dont vous pourriez avoir besoin. Ces informations nous aident à vous fournir le meilleur soutien pendant vos études.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? 'Study Preferences' : 'Préférences d\'Études'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Your study preferences' : 'Vos préférences d\'études'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Preferred Intake' : 'Période d\'Admission Préférée'} *
                </label>
                <select
                  value={formData.preferences.intake}
                  onChange={(e) => handleInputChange('preferences', 'intake', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">{language === 'en' ? 'Select intake' : 'Sélectionner la période'}</option>
                  <option value="september-2025">September 2025</option>
                  <option value="january-2026">January 2026</option>
                  <option value="september-2026">September 2026</option>
                </select>
              </div>
              
              <div className="md:col-span-2 lg:col-span-2">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="accommodation"
                      checked={formData.preferences.accommodation}
                      onChange={(e) => handleInputChange('preferences', 'accommodation', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="accommodation" className="ml-2 text-sm text-gray-700">
                      {language === 'en' ? 'I need accommodation assistance' : 'J\'ai besoin d\'aide pour l\'hébergement'}
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="scholarship"
                      checked={formData.preferences.scholarship}
                      onChange={(e) => handleInputChange('preferences', 'scholarship', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="scholarship" className="ml-2 text-sm text-gray-700">
                      {language === 'en' ? 'I am interested in scholarships' : 'Je suis intéressé par les bourses'}
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="visaSupport"
                      checked={formData.preferences.visaSupport}
                      onChange={(e) => handleInputChange('preferences', 'visaSupport', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="visaSupport" className="ml-2 text-sm text-gray-700">
                      {language === 'en' ? 'I need visa support assistance' : 'J\'ai besoin d\'aide pour le visa'}
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="airportPickup"
                      checked={formData.preferences.airportPickup}
                      onChange={(e) => handleInputChange('preferences', 'airportPickup', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="airportPickup" className="ml-2 text-sm text-gray-700">
                      {language === 'en' ? 'I need airport pickup service' : 'J\'ai besoin du service de récupération à l\'aéroport'}
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="orientationProgram"
                      checked={formData.preferences.orientationProgram}
                      onChange={(e) => handleInputChange('preferences', 'orientationProgram', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="orientationProgram" className="ml-2 text-sm text-gray-700">
                      {language === 'en' ? 'I want to participate in orientation program' : 'Je veux participer au programme d\'orientation'}
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="languageSupport"
                      checked={formData.preferences.languageSupport}
                      onChange={(e) => handleInputChange('preferences', 'languageSupport', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="languageSupport" className="ml-2 text-sm text-gray-700">
                      {language === 'en' ? 'I need language support' : 'J\'ai besoin de soutien linguistique'}
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Additional Information' : 'Informations Supplémentaires'}
                </label>
                <textarea
                  value={formData.preferences.additionalInfo}
                  onChange={(e) => handleInputChange('preferences', 'additionalInfo', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Any additional information you would like to share...' : 'Toute information supplémentaire que vous souhaitez partager...'}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">E-T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'Please carefully review all your information before submitting. Once submitted, changes may require additional documentation. Contact us if you need any assistance.'
                      : 'Veuillez examiner attentivement toutes vos informations avant de soumettre. Une fois soumise, les modifications peuvent nécessiter une documentation supplémentaire. Contactez-nous si vous avez besoin d\'aide.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? 'Review Your Application' : 'Révisez Votre Candidature'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Review your application' : 'Révisez votre candidature'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  {language === 'en' ? 'Personal Information' : 'Informations Personnelles'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>{language === 'en' ? 'Name:' : 'Nom:'}</strong> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</div>
                  <div><strong>{language === 'en' ? 'Email:' : 'Email:'}</strong> {formData.personalInfo.email}</div>
                  <div><strong>{language === 'en' ? 'Phone:' : 'Téléphone:'}</strong> {formData.personalInfo.phone}</div>
                  <div><strong>{language === 'en' ? 'WhatsApp:' : 'WhatsApp:'}</strong> {formData.personalInfo.whatsapp}</div>
                  <div><strong>{language === 'en' ? 'Chinese Name:' : 'Nom Chinois:'}</strong> {formData.personalInfo.chineseName}</div>
                  <div><strong>{language === 'en' ? 'Country of Birth:' : 'Pays de Naissance:'}</strong> {formData.personalInfo.countryOfBirth}</div>
                  <div><strong>{language === 'en' ? 'City of Birth:' : 'Ville de Naissance:'}</strong> {formData.personalInfo.cityOfBirth}</div>
                  <div><strong>{language === 'en' ? 'Religion:' : 'Religion:'}</strong> {formData.personalInfo.religion}</div>
                  <div><strong>{language === 'en' ? 'Native Language:' : 'Langue Maternelle:'}</strong> {formData.personalInfo.nativeLanguage}</div>
                  <div><strong>{language === 'en' ? 'Nationality:' : 'Nationalité:'}</strong> {formData.personalInfo.nationality}</div>
                  <div><strong>{language === 'en' ? 'CIN Number:' : 'Numéro de CIN:'}</strong> {formData.personalInfo.cinNumber}</div>
                  <div><strong>{language === 'en' ? 'Passport Number:' : 'Numéro de Passeport:'}</strong> {formData.personalInfo.passportNumber}</div>
                  <div><strong>{language === 'en' ? 'Passport Expiration:' : 'Expiration Passeport:'}</strong> {formData.personalInfo.passportExpirationDate}</div>
                  <div><strong>{language === 'en' ? 'Alternate Email:' : 'Email Alternatif:'}</strong> {formData.personalInfo.alternateEmail}</div>
                  <div><strong>{language === 'en' ? 'WeChat ID:' : 'ID WeChat:'}</strong> {formData.personalInfo.wechatId}</div>
                  <div><strong>{language === 'en' ? 'SKYPE No.:' : 'Numéro SKYPE:'}</strong> {formData.personalInfo.skypeNo}</div>
                  
                  {/* Work Experience Information */}
                  {formData.personalInfo.hasWorkExperience && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        {language === 'en' ? 'Work Experience' : 'Expérience Professionnelle'}
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div><strong>{language === 'en' ? 'Company:' : 'Entreprise:'}</strong> {formData.personalInfo.workCompany}</div>
                        <div><strong>{language === 'en' ? 'Position:' : 'Poste:'}</strong> {formData.personalInfo.workPosition}</div>
                        <div><strong>{language === 'en' ? 'Start Date:' : 'Date de Début:'}</strong> {formData.personalInfo.workStartDate}</div>
                        <div><strong>{language === 'en' ? 'End Date:' : 'Date de Fin:'}</strong> {formData.personalInfo.workEndDate || (language === 'en' ? 'Present' : 'Présent')}</div>
                        {formData.personalInfo.workDescription && (
                          <div><strong>{language === 'en' ? 'Description:' : 'Description:'}</strong> {formData.personalInfo.workDescription}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-red-600" />
                  {language === 'en' ? 'Emergency Contact Information' : 'Informations de Contact d\'Urgence'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>{language === 'en' ? 'Name:' : 'Nom:'}</strong> {formData.personalInfo.emergencyContactName}</div>
                  <div><strong>{language === 'en' ? 'Gender:' : 'Genre:'}</strong> {formData.personalInfo.emergencyContactGender}</div>
                  <div><strong>{language === 'en' ? 'Relationship:' : 'Relation:'}</strong> {formData.personalInfo.emergencyContactRelationship}</div>
                  <div><strong>{language === 'en' ? 'Phone:' : 'Téléphone:'}</strong> {formData.personalInfo.emergencyContactPhone}</div>
                  <div><strong>{language === 'en' ? 'Email:' : 'Email:'}</strong> {formData.personalInfo.emergencyContactEmail}</div>
                  <div><strong>{language === 'en' ? 'Address:' : 'Adresse:'}</strong> {formData.personalInfo.emergencyContactAddress}</div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  {language === 'en' ? 'Education History' : 'Historique Éducatif'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">{language === 'en' ? 'Highest/Current Education' : 'Éducation la Plus Élevée/Actuelle'}</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>{language === 'en' ? 'Level:' : 'Niveau:'}</strong> {formData.personalInfo.highestEducationLevel}</div>
                      <div><strong>{language === 'en' ? 'Field:' : 'Domaine:'}</strong> {formData.personalInfo.highestEducationField}</div>
                      <div><strong>{language === 'en' ? 'Country:' : 'Pays:'}</strong> {formData.personalInfo.highestEducationCountry}</div>
                      <div><strong>{language === 'en' ? 'Institute:' : 'Institut:'}</strong> {formData.personalInfo.highestEducationInstitute}</div>
                      <div><strong>{language === 'en' ? 'Qualification:' : 'Qualification:'}</strong> {formData.personalInfo.highestEducationQualification}</div>
                      <div><strong>{language === 'en' ? 'Years Attended:' : 'Années d\'Étude:'}</strong> {formData.personalInfo.highestEducationYearsAttended}</div>
                      <div><strong>{language === 'en' ? 'Entry Date:' : 'Date d\'Entrée:'}</strong> {formData.personalInfo.highestEducationEntryDate}</div>
                      <div><strong>{language === 'en' ? 'Completion Date:' : 'Date de Fin:'}</strong> {formData.personalInfo.highestEducationCompletionDate}</div>
                    </div>
                  </div>
                  
                  {(formData.personalInfo.otherEducation1Level || formData.personalInfo.otherEducation1Institute) && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">{language === 'en' ? 'Other Education I' : 'Autre Éducation I'}</h5>
                      <div className="space-y-2 text-sm">
                        <div><strong>{language === 'en' ? 'Level:' : 'Niveau:'}</strong> {formData.personalInfo.otherEducation1Level}</div>
                        <div><strong>{language === 'en' ? 'Field:' : 'Domaine:'}</strong> {formData.personalInfo.otherEducation1Field}</div>
                        <div><strong>{language === 'en' ? 'Country:' : 'Pays:'}</strong> {formData.personalInfo.otherEducation1Country}</div>
                        <div><strong>{language === 'en' ? 'Institute:' : 'Institut:'}</strong> {formData.personalInfo.otherEducation1Institute}</div>
                        <div><strong>{language === 'en' ? 'Qualification:' : 'Qualification:'}</strong> {formData.personalInfo.otherEducation1Qualification}</div>
                        <div><strong>{language === 'en' ? 'Years Attended:' : 'Années d\'Étude:'}</strong> {formData.personalInfo.otherEducation1YearsAttended}</div>
                        <div><strong>{language === 'en' ? 'Entry Date:' : 'Date d\'Entrée:'}</strong> {formData.personalInfo.otherEducation1EntryDate}</div>
                        <div><strong>{language === 'en' ? 'Completion Date:' : 'Date de Fin:'}</strong> {formData.personalInfo.otherEducation1CompletionDate}</div>
                      </div>
                    </div>
                  )}
                  
                  {(formData.personalInfo.otherEducation2Level || formData.personalInfo.otherEducation2Institute) && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">{language === 'en' ? 'Other Education II' : 'Autre Éducation II'}</h5>
                      <div className="space-y-2 text-sm">
                        <div><strong>{language === 'en' ? 'Level:' : 'Niveau:'}</strong> {formData.personalInfo.otherEducation2Level}</div>
                        <div><strong>{language === 'en' ? 'Field:' : 'Domaine:'}</strong> {formData.personalInfo.otherEducation2Field}</div>
                        <div><strong>{language === 'en' ? 'Country:' : 'Pays:'}</strong> {formData.personalInfo.otherEducation2Country}</div>
                        <div><strong>{language === 'en' ? 'Institute:' : 'Institut:'}</strong> {formData.personalInfo.otherEducation2Institute}</div>
                        <div><strong>{language === 'en' ? 'Qualification:' : 'Qualification:'}</strong> {formData.personalInfo.otherEducation2Qualification}</div>
                        <div><strong>{language === 'en' ? 'Years Attended:' : 'Années d\'Étude:'}</strong> {formData.personalInfo.otherEducation2YearsAttended}</div>
                        <div><strong>{language === 'en' ? 'Entry Date:' : 'Date d\'Entrée:'}</strong> {formData.personalInfo.otherEducation2EntryDate}</div>
                        <div><strong>{language === 'en' ? 'Completion Date:' : 'Date de Fin:'}</strong> {formData.personalInfo.otherEducation2CompletionDate}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  {language === 'en' ? 'Employment History' : 'Historique d\'Emploi'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>{language === 'en' ? 'Employer:' : 'Employeur:'}</strong> {formData.personalInfo.employmentEmployer}</div>
                  <div><strong>{language === 'en' ? 'Work Engaged:' : 'Type de Travail:'}</strong> {formData.personalInfo.employmentWorkEngaged}</div>
                  <div><strong>{language === 'en' ? 'Title & Position:' : 'Titre et Poste:'}</strong> {formData.personalInfo.employmentTitlePosition}</div>
                  <div><strong>{language === 'en' ? 'Entry Date:' : 'Date d\'Entrée:'}</strong> {formData.personalInfo.employmentEntryDate}</div>
                  <div><strong>{language === 'en' ? 'Completion Date:' : 'Date de Fin:'}</strong> {formData.personalInfo.employmentCompletionDate}</div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-green-600" />
                  {language === 'en' ? 'Academic Information' : 'Informations Académiques'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>{language === 'en' ? 'Institution:' : 'Établissement:'}</strong> {formData.academicInfo.currentInstitution}</div>
                  <div><strong>{language === 'en' ? 'Program:' : 'Programme:'}</strong> {formData.academicInfo.currentProgram}</div>
                  <div><strong>{language === 'en' ? 'GPA:' : 'Moyenne:'}</strong> {formData.academicInfo.gpa}</div>
                  <div><strong>{language === 'en' ? 'English Test:' : 'Test d\'Anglais:'}</strong> {formData.academicInfo.englishTest}</div>
                  <div><strong>{language === 'en' ? 'French Test:' : 'Test de Français:'}</strong> {formData.academicInfo.frenchTest}</div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {language === 'en' ? 'Documents' : 'Documents'}
                </h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(formData.documents).map(([key, file]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                      <span className={file ? 'text-green-600' : 'text-red-500'}>
                        {file ? (language === 'en' ? 'Uploaded' : 'Téléchargé') : (language === 'en' ? 'Missing' : 'Manquant')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  {language === 'en' ? 'Preferences' : 'Préférences'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>{language === 'en' ? 'Intake:' : 'Période:'}</strong> {formData.preferences.intake}</div>
                  <div><strong>{language === 'en' ? 'Accommodation:' : 'Hébergement:'}</strong> {formData.preferences.accommodation ? (language === 'en' ? 'Yes' : 'Oui') : (language === 'en' ? 'No' : 'Non')}</div>
                  <div><strong>{language === 'en' ? 'Scholarship:' : 'Bourse:'}</strong> {formData.preferences.scholarship ? (language === 'en' ? 'Yes' : 'Oui') : (language === 'en' ? 'No' : 'Non')}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {language === 'en' ? 'Important Notice' : 'Avis Important'}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {language === 'en' 
                      ? 'By submitting this application, you confirm that all information provided is accurate and complete. Our education agents will review your application and contact you within 5 business days.'
                      : 'En soumettant cette candidature, vous confirmez que toutes les informations fournies sont exactes et complètes. Nos agents éducatifs examineront votre candidature et vous contacteront dans les 5 jours ouvrables.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">E-T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'Your application is being processed by our admission team. You will receive updates on your pre-admission status. Please check this section regularly for updates.'
                      : 'Votre candidature est en cours de traitement par notre équipe d\'admission. Vous recevrez des mises à jour sur votre statut de préadmission. Veuillez vérifier cette section régulièrement pour les mises à jour.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? 'Pre-admission Process' : 'Processus de Préadmission'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Pre-admission process' : 'Processus de préadmission'}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Pre-admission Status' : 'Statut de Préadmission'}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {language === 'en' ? 'Application submitted successfully' : 'Candidature soumise avec succès'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {language === 'en' ? 'Under review by admissions team' : 'En cours d\'examen par l\'équipe d\'admission'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {language === 'en' ? 'Pre-admission available' : 'Préadmission disponible'}
                  </span>
                </div>
              </div>
              
              {/* Pre-admission Document */}
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-green-900 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {language === 'en' ? 'Pre-admission Letter' : 'Lettre de Préadmission'}
                  </h5>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {language === 'en' ? 'Available' : 'Disponible'}
                  </span>
                </div>
                <p className="text-sm text-green-800 mb-4">
                  {language === 'en' 
                    ? 'Congratulations! Your pre-admission letter is ready for download. This document confirms your conditional acceptance to the program.'
                    : 'Félicitations ! Votre lettre de préadmission est prête à être téléchargée. Ce document confirme votre acceptation conditionnelle au programme.'
                  }
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      // In a real app, this would download the pre-admission letter
                      alert(language === 'en' ? 'Pre-admission letter download would start here' : 'Le téléchargement de la lettre de préadmission commencerait ici');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {language === 'en' ? 'Download Letter' : 'Télécharger la Lettre'}
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would open a modal or new page to view the document
                      alert(language === 'en' ? 'Pre-admission letter preview would open here' : 'L\'aperçu de la lettre de préadmission s\'ouvrirait ici');
                    }}
                    className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {language === 'en' ? 'View Letter' : 'Voir la Lettre'}
                  </button>
                </div>
                <div className="mt-3 text-xs text-green-700">
                  <p>
                    {language === 'en' 
                      ? 'Document issued on: January 15, 2025 | Valid until: March 15, 2025'
                      : 'Document délivré le : 15 janvier 2025 | Valide jusqu\'au : 15 mars 2025'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">E-T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'To confirm your enrollment, you need to pay the tuition fees or a portion of them. Please select your payment method, upload the payment receipt, and wait for our team validation.'
                      : 'Pour confirmer votre inscription, vous devez payer les frais de scolarité ou une partie de ceux-ci. Veuillez sélectionner votre méthode de paiement, télécharger le reçu de paiement et attendre la validation de notre équipe.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? 'Confirm Enrolment' : 'Confirmer l\'Inscription'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Confirm your enrolment' : 'Confirmez votre inscription'}
                </p>
              </div>
            </div>
            
            {/* Payment Receipt Upload */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                {language === 'en' ? 'Upload Payment Receipt' : 'Télécharger le Reçu de Paiement'}
              </h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <label htmlFor="payment-receipt" className="cursor-pointer">
                  <span className="text-sm font-medium text-gray-900">
                    {language === 'en' ? 'Click to upload receipt' : 'Cliquez pour télécharger le reçu'}
                  </span>
                  <span className="block text-xs text-gray-500 mt-1">
                    {language === 'en' ? 'PDF, JPG, PNG up to 10MB' : 'PDF, JPG, PNG jusqu\'à 10MB'}
                  </span>
                </label>
                <input
                  id="payment-receipt"
                  name="payment-receipt"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                />
              </div>
            </div>

            {/* Validation Status */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {language === 'en' ? 'Pending Validation' : 'Validation en Attente'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'en' 
                      ? 'Your receipt is being reviewed by E-TAWJIHI team'
                      : 'Votre reçu est en cours d\'examen par l\'équipe E-TAWJIHI'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">E-T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'Congratulations! Your final admission letter and related documents are now available. Please download and review all documents carefully.'
                      : 'Félicitations ! Votre lettre d\'admission finale et les documents associés sont maintenant disponibles. Veuillez télécharger et examiner tous les documents attentivement.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? 'Final Offer' : 'Offre Finale'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Final offer letter' : 'Lettre d\'offre finale'}
                </p>
              </div>
            </div>
            
            {/* Final Admission Letter */}
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Final Admission Letter' : 'Lettre d\'Admission Finale'}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {language === 'en' ? 'Final admission letter issued' : 'Lettre d\'admission finale émise'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {language === 'en' ? 'Scholarship details included' : 'Détails de bourse inclus'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {language === 'en' ? 'Program details confirmed' : 'Détails du programme confirmés'}
                  </span>
                </div>
              </div>
              
              {/* Document Actions */}
              <div className="mt-6 bg-white border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-green-900 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {language === 'en' ? 'Final Admission Letter' : 'Lettre d\'Admission Finale'}
                  </h5>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {language === 'en' ? 'Available' : 'Disponible'}
                  </span>
                </div>
                <p className="text-sm text-green-800 mb-4">
                  {language === 'en' 
                    ? 'Congratulations! Your final admission letter is ready for download. This document confirms your official acceptance to the program.'
                    : 'Félicitations ! Votre lettre d\'admission finale est prête à être téléchargée. Ce document confirme votre acceptation officielle au programme.'
                  }
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      // In a real app, this would download the document
                      alert(language === 'en' ? 'Final admission letter would be downloaded' : 'La lettre d\'admission finale serait téléchargée');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {language === 'en' ? 'Download Letter' : 'Télécharger la Lettre'}
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would open a modal or new page to view the document
                      alert(language === 'en' ? 'Final admission letter preview would open here' : 'L\'aperçu de la lettre d\'admission finale s\'ouvrirait ici');
                    }}
                    className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {language === 'en' ? 'View Letter' : 'Voir la Lettre'}
                  </button>
                </div>
                <div className="mt-3 text-xs text-green-700">
                  <p>
                    {language === 'en' 
                      ? 'Document issued on: February 15, 2025 | Valid until: August 15, 2025'
                      : 'Document délivré le : 15 février 2025 | Valide jusqu\'au : 15 août 2025'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Documents */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Additional Documents' : 'Documents Supplémentaires'}
              </h4>
              <div className="space-y-4">
                {/* JW Document */}
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-blue-900 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {language === 'en' ? 'JW Document' : 'Document JW'}
                    </h5>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {language === 'en' ? 'Available' : 'Disponible'}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    {language === 'en' 
                      ? 'Official JW document for visa processing and university enrollment.'
                      : 'Document JW officiel pour le traitement du visa et l\'inscription à l\'université.'
                    }
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        alert(language === 'en' ? 'JW document would be downloaded' : 'Le document JW serait téléchargé');
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {language === 'en' ? 'Download' : 'Télécharger'}
                    </button>
                    <button
                      onClick={() => {
                        alert(language === 'en' ? 'JW document preview would open here' : 'L\'aperçu du document JW s\'ouvrirait ici');
                      }}
                      className="px-3 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {language === 'en' ? 'View' : 'Voir'}
                    </button>
                  </div>
                </div>

                {/* Campus France Validation */}
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-blue-900 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {language === 'en' ? 'Campus France Validation' : 'Validation Campus France'}
                    </h5>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {language === 'en' ? 'Available' : 'Disponible'}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    {language === 'en' 
                      ? 'Campus France validation document for French universities and visa processing.'
                      : 'Document de validation Campus France pour les universités françaises et le traitement du visa.'
                    }
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        alert(language === 'en' ? 'Campus France validation would be downloaded' : 'La validation Campus France serait téléchargée');
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {language === 'en' ? 'Download' : 'Télécharger'}
                    </button>
                    <button
                      onClick={() => {
                        alert(language === 'en' ? 'Campus France validation preview would open here' : 'L\'aperçu de la validation Campus France s\'ouvrirait ici');
                      }}
                      className="px-3 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {language === 'en' ? 'View' : 'Voir'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">E-T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'Please ensure you have all required documents for your visa application. Update your visa status as you progress through the process.'
                      : 'Veuillez vous assurer d\'avoir tous les documents requis pour votre demande de visa. Mettez à jour votre statut de visa au fur et à mesure de votre progression.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? 'Visa Application' : 'Demande de Visa'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Visa application process' : 'Processus de demande de visa'}
                </p>
              </div>
            </div>
            
            {/* Required Documents */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Required Documents for Visa Application' : 'Documents Requis pour la Demande de Visa'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    {language === 'en' ? 'Identity Documents' : 'Documents d\'Identité'}
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {language === 'en' ? 'Valid passport' : 'Passeport valide'}</li>
                    <li>• {language === 'en' ? 'National ID card' : 'Carte d\'identité nationale'}</li>
                    <li>• {language === 'en' ? 'Birth certificate' : 'Acte de naissance'}</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    {language === 'en' ? 'Academic Documents' : 'Documents Académiques'}
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {language === 'en' ? 'Final admission letter' : 'Lettre d\'admission finale'}</li>
                    <li>• {language === 'en' ? 'Academic transcripts' : 'Relevés de notes'}</li>
                    <li>• {language === 'en' ? 'Degree certificates' : 'Certificats de diplôme'}</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {language === 'en' ? 'Financial Documents' : 'Documents Financiers'}
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {language === 'en' ? 'Bank statements' : 'Relevés bancaires'}</li>
                    <li>• {language === 'en' ? 'Sponsorship letter' : 'Lettre de parrainage'}</li>
                    <li>• {language === 'en' ? 'Proof of funds' : 'Preuve de fonds'}</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {language === 'en' ? 'Other Documents' : 'Autres Documents'}
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {language === 'en' ? 'Visa application form' : 'Formulaire de demande de visa'}</li>
                    <li>• {language === 'en' ? 'Passport photos' : 'Photos d\'identité'}</li>
                    <li>• {language === 'en' ? 'Medical certificate' : 'Certificat médical'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Visa Status Management */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Visa Status Management' : 'Gestion du Statut de Visa'}
              </h4>
              
              {/* Status Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {language === 'en' ? 'Current Visa Status' : 'Statut Actuel du Visa'}
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="not-taken">{language === 'en' ? 'Not yet taken' : 'Pas encore pris'}</option>
                  <option value="appointment-taken">{language === 'en' ? 'Appointment taken' : 'Rendez-vous pris'}</option>
                  <option value="waiting-result">{language === 'en' ? 'Waiting for result' : 'En attente du résultat'}</option>
                  <option value="visa-refused">{language === 'en' ? 'Visa refused' : 'Visa refusé'}</option>
                  <option value="visa-accepted">{language === 'en' ? 'Visa accepted' : 'Visa accepté'}</option>
                </select>
              </div>

              {/* Appointment Date (if appointment taken) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Appointment Date' : 'Date de Rendez-vous'}
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Refusal Reason (if visa refused) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Refusal Reason' : 'Motif de Refus'}
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={language === 'en' ? 'Enter the reason for visa refusal...' : 'Entrez le motif du refus de visa...'}
                />
              </div>

              {/* Refusal Screenshot Upload (if visa refused) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Refusal Screenshot' : 'Capture d\'Écran du Refus'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <label htmlFor="refusal-screenshot" className="cursor-pointer">
                    <span className="text-sm font-medium text-gray-900">
                      {language === 'en' ? 'Click to upload refusal screenshot' : 'Cliquez pour télécharger la capture d\'écran du refus'}
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {language === 'en' ? 'JPG, PNG up to 5MB' : 'JPG, PNG jusqu\'à 5MB'}
                    </span>
                  </label>
                  <input
                    id="refusal-screenshot"
                    name="refusal-screenshot"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="sr-only"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                {language === 'en' ? 'Update Visa Status' : 'Mettre à Jour le Statut de Visa'}
              </button>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">E-T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'Congratulations! You are now enrolled. Please follow this checklist to prepare for your journey and complete your administrative registration upon arrival.'
                      : 'Félicitations ! Vous êtes maintenant inscrit. Veuillez suivre cette checklist pour préparer votre voyage et compléter votre inscription administrative à l\'arrivée.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? 'Final Enrollment' : 'Inscription Finale'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Final enrollment process' : 'Processus d\'inscription finale'}
                </p>
              </div>
            </div>
            
            {/* Travel Checklist */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {language === 'en' ? 'Travel Checklist' : 'Checklist du Voyage'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {language === 'en' ? 'Before Departure' : 'Avant le Départ'}
                  </h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Valid passport and visa' : 'Passeport et visa valides'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Flight tickets booked' : 'Billets d\'avion réservés'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Accommodation arranged' : 'Hébergement arrangé'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Travel insurance purchased' : 'Assurance voyage achetée'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Currency exchanged' : 'Devise échangée'}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {language === 'en' ? 'Essential Documents' : 'Documents Essentiels'}
                  </h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Final admission letter' : 'Lettre d\'admission finale'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Academic transcripts' : 'Relevés de notes'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Medical certificates' : 'Certificats médicaux'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Passport photos' : 'Photos d\'identité'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Emergency contacts' : 'Contacts d\'urgence'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Post-Arrival Checklist */}
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {language === 'en' ? 'Post-Arrival Checklist' : 'Checklist Après l\'Atterrissage'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {language === 'en' ? 'Administrative Registration' : 'Inscription Administrative'}
                  </h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Visit university registration office' : 'Visiter le bureau d\'inscription de l\'université'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Complete enrollment forms' : 'Compléter les formulaires d\'inscription'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Obtain student ID card' : 'Obtenir la carte d\'étudiant'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Register for courses' : 'S\'inscrire aux cours'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Pay tuition fees' : 'Payer les frais de scolarité'}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {language === 'en' ? 'Settlement Tasks' : 'Tâches d\'Installation'}
                  </h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Open bank account' : 'Ouvrir un compte bancaire'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Get local phone number' : 'Obtenir un numéro de téléphone local'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Register with local authorities' : 'S\'enregistrer auprès des autorités locales'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Attend orientation session' : 'Assister à la session d\'orientation'}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Meet academic advisor' : 'Rencontrer le conseiller académique'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Welcome to Your New Journey!' : 'Bienvenue dans Votre Nouveau Parcours !'}
                </h4>
                <p className="text-gray-600 mb-4">
                  {language === 'en' 
                    ? 'You have successfully completed the application process. Follow the checklists above to ensure a smooth transition to your new academic journey.'
                    : 'Vous avez complété avec succès le processus de candidature. Suivez les checklists ci-dessus pour assurer une transition en douceur vers votre nouveau parcours académique.'
                  }
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {language === 'en' ? 'Need help? Contact E-TAWJIHI support' : 'Besoin d\'aide ? Contactez le support E-TAWJIHI'}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'en' ? 'Loading application...' : 'Chargement de la candidature...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'Back' : 'Retour'}
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              
              {/* E-TAWJIHI Logo */}
              <div className="flex items-center">
                <img 
                  src="https://cdn.e-tawjihi.ma/logo-rectantgle-simple-nobg.png" 
                  alt="E-TAWJIHI Logo" 
                  className="h-12 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                />
              </div>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              {/* Program Info */}
              <div className="flex items-center gap-3">
                {program?.establishment?.logo && (
                  <img 
                    src={program.establishment.logo} 
                    alt={program.establishment.name}
                    className="w-10 h-10 object-contain rounded-lg border border-gray-200"
                  />
                )}
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{program?.name}</h1>
                  <p className="text-xs text-gray-600">{program?.establishment?.name}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    language === 'en' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    language === 'fr' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  FR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-l-4 border-blue-500 p-4 sticky top-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Application Steps' : 'Étapes de Candidature'}
                </h2>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round((currentStep / steps.length) * 100)}% {language === 'en' ? 'Complete' : 'Terminé'}
                </p>
              </div>
              
              <div className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 p-2.5 rounded-lg transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'bg-blue-500 text-white shadow-lg' 
                          : isCompleted 
                            ? 'bg-green-50 border border-green-200 text-green-900 hover:bg-green-100' 
                            : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => setCurrentStep(step.id)}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium text-sm ${
                          isActive ? 'text-white' : isCompleted ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-xs ${
                          isActive ? 'text-white/80' : isCompleted ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-xl border">
              <div className="p-6">
                <div className="transition-all duration-300">
                  {renderStepContent()}
                </div>
              </div>
              
              {/* Navigation */}
              <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {language === 'en' ? 'Previous' : 'Précédent'}
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {language === 'en' ? 'Step' : 'Étape'} {currentStep} {language === 'en' ? 'of' : 'sur'} {steps.length}
                  </span>
                </div>
                
                {currentStep < steps.length ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {language === 'en' ? 'Next' : 'Suivant'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {language === 'en' ? 'Submit Application' : 'Soumettre la Candidature'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};


export default ApplicationProcess;
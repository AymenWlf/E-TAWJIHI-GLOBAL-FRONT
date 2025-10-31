import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  Flag,
  Download,
  ChevronRight,
  ChevronLeft,
  Info
} from 'lucide-react';
import QualificationsTabs from '../components/profile/QualificationsTabs';
import ApplicationDocumentsSection from '../components/profile/ApplicationDocumentsSection';
import documentService from '../services/documentService';
import documentTranslationService from '../services/documentTranslationService';
import applicationService from '../services/applicationService';
import programService from '../services/programService';
import profileService from '../services/profileService';
import finalStepService from '../services/finalStepService';
import modificationRequestService from '../services/modificationRequestService';
import MultiSelect from '../components/ui/MultiSelect';
import SingleSelect from '../components/ui/SingleSelect';
import PhoneInput from '../components/ui/PhoneInput';
import { useAllParameters } from '../hooks/useAllParameters';
import { useAuth } from '../contexts/AuthContext';
import EAdvisorWidget from '../components/eadvisor/EAdvisorWidget';

// Utility functions for application periods (inspired by ProgramDetail)
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
  
  // Check if application hasn't opened yet
  if (now < opensDate) {
    const daysUntilOpen = Math.ceil((opensDate - now) / (1000 * 60 * 60 * 24));
    return {
      status: 'not-open', 
      color: 'blue', 
      text: language === 'fr' ? `S'ouvre dans ${daysUntilOpen} jours` : `Opens in ${daysUntilOpen} days`,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
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

const ApplicationProcess = () => {
  const { establishmentId: establishmentIdParam, programId: programIdParam } = useParams();
  const establishmentId = parseInt(establishmentIdParam);
  const programId = parseInt(programIdParam);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { parameters: allParams } = useAllParameters();
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState('en');
  const [program, setProgram] = useState(null);
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userQualifications, setUserQualifications] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userDocuments, setUserDocuments] = useState({});
  const [documentsMap, setDocumentsMap] = useState({});
  const [translationsMap, setTranslationsMap] = useState({});
  const [step2Validated, setStep2Validated] = useState(false);
  const [step3Validated, setStep3Validated] = useState(false);
  const [step4Validated, setStep4Validated] = useState(false);
  const [step5Validated, setStep5Validated] = useState(false);
  const [finalSteps, setFinalSteps] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [modificationRequest, setModificationRequest] = useState(null);
  const [modificationAllowed, setModificationAllowed] = useState(false);
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [modificationReason, setModificationReason] = useState('');
  
  // Check if application is submitted (read-only mode)
  // Allow modification if request is approved and still valid
  const isReadOnly = (application?.status === 'submitted' || !!application?.submittedAt) && !modificationAllowed;

  // Récupérer l'ID de l'application depuis l'URL
  const applicationId = searchParams.get('applicationId');

  // Helper function to find document key (same as ApplicationDocumentsSection)
  const findDocumentKey = (doc) => {
    console.log('🔍 Finding document key for:', doc.title, 'Type:', typeof doc.title, 'Length:', doc.title?.length);
    
    // Map backend document to frontend document key
    const titleMapping = {
      'Passport': 'passport',
      'Passeport': 'passport',
      'passport': 'passport',
      'National ID Card': 'nationalId',
      'Carte Nationale': 'nationalId',
      'nationalId': 'nationalId',
      'Curriculum Vitae (CV)': 'cv',
      'cv': 'cv',
      'Guardian 1 National ID': 'guardian1NationalId',
      'Carte Nationale Tuteur 1': 'guardian1NationalId',
      'guardian1NationalId': 'guardian1NationalId',
      'Guardian 2 National ID': 'guardian2NationalId',
      'Carte Nationale Tuteur 2': 'guardian2NationalId',
      'guardian2NationalId': 'guardian2NationalId',
      'General Transcript': 'generalTranscript',
      'Relevé de note général': 'generalTranscript',
      'Relevé de Notes': 'generalTranscript',
      'Transcript': 'generalTranscript',
      'transcript': 'transcript',
      'English Test Certificate': 'englishTest',
      'Certificat de Test d\'Anglais': 'englishTest',
      'englishTest': 'englishTest',
      'French Test Certificate': 'frenchTest',
      'Certificat de Test de Français': 'frenchTest',
      'frenchTest': 'frenchTest',
      'Portfolio': 'portfolio',
      'portfolio': 'portfolio',
      'Baccalaureate Diploma': 'baccalaureate',
      'Diplôme du Baccalauréat': 'baccalaureate',
      'baccalaureate': 'baccalaureate',
      'BAC+2 Diploma': 'bac2',
      'Diplôme BAC+2': 'bac2',
      'bac2': 'bac2',
      'BAC+3 Diploma': 'bac3',
      'Diplôme BAC+3': 'bac3',
      'bac3': 'bac3',
      'BAC+5 Diploma': 'bac5',
      'Diplôme BAC+5': 'bac5',
      'bac5': 'bac5',
      'Enrollment Certificate': 'enrollmentCertificate',
      'Attestation de Scolarité': 'enrollmentCertificate',
      'enrollmentCertificate': 'enrollmentCertificate',
      'Recommendation Letter 1': 'recommendationLetter1',
      'Lettre de Recommandation 1': 'recommendationLetter1',
      'recommendationLetter1': 'recommendationLetter1',
      'Recommendation Letter 2': 'recommendationLetter2',
      'Lettre de Recommandation 2': 'recommendationLetter2',
      'recommendationLetter2': 'recommendationLetter2',
      'Motivation Letter': 'motivationLetter',
      'Lettre de Motivation': 'motivationLetter',
      'motivationLetter': 'motivationLetter',
      'Medical Health Check': 'medicalHealthCheck',
      'Certificat Médical de Santé': 'medicalHealthCheck',
      'medicalHealthCheck': 'medicalHealthCheck', // Direct key mapping
      'Anthropometric Record (Good Conduct)': 'anthropometricRecord',
      'Fiche Anthropométrique (Bonne Conduite)': 'anthropometricRecord',
      'anthropometricRecord': 'anthropometricRecord', // Direct key mapping
      
      // Additional variations for China documents
      'Certificat M__dical de Sant__': 'medicalHealthCheck', // With encoded characters
      'Fiche Anthropom__trique (Bonne Conduite)': 'anthropometricRecord', // With encoded characters
      'Certificat MÃ©dical de SantÃ©': 'medicalHealthCheck', // UTF-8 encoding issues
      'Fiche AnthropomÃ©trique (Bonne Conduite)': 'anthropometricRecord' // UTF-8 encoding issues
    };

    // First try exact match
    if (titleMapping[doc.title]) {
      console.log('✅ Exact match found:', doc.title, '->', titleMapping[doc.title]);
      return titleMapping[doc.title];
    } else {
      console.log('❌ No exact match for:', doc.title);
      console.log('Title length:', doc.title.length);
      console.log('Title char codes:', doc.title.split('').map(c => c.charCodeAt(0)));
      console.log('Available keys containing "Certificat":', Object.keys(titleMapping).filter(key => key.includes('Certificat')));
      console.log('Available keys containing "Médical":', Object.keys(titleMapping).filter(key => key.includes('Médical')));
      
      // Try to find the exact key by comparing character by character
      const exactKey = Object.keys(titleMapping).find(key => {
        if (key.length !== doc.title.length) return false;
        return key.split('').every((char, index) => char === doc.title[index]);
      });
      
      if (exactKey) {
        console.log('✅ Found exact key by character comparison:', exactKey, '->', titleMapping[exactKey]);
        return titleMapping[exactKey];
      }
    }
    
    // For China documents, try partial matching
    if (doc.title && typeof doc.title === 'string') {
      const title = doc.title.toLowerCase();
      
      // Normalize special characters for better matching
      const normalizedTitle = title
        .replace(/[éèêë]/g, 'e')
        .replace(/[àâä]/g, 'a')
        .replace(/[ùûü]/g, 'u')
        .replace(/[ôö]/g, 'o')
        .replace(/[îï]/g, 'i')
        .replace(/[ç]/g, 'c');
      
      console.log('Normalized title:', normalizedTitle);
      
      // Check for medical health check variations
      if (title.includes('médical') || title.includes('medical') || title.includes('santé') || title.includes('health') ||
          normalizedTitle.includes('medical') || normalizedTitle.includes('sante') ||
          (title.includes('certificat') && title.includes('santé')) ||
          (normalizedTitle.includes('certificat') && normalizedTitle.includes('sante'))) {
        console.log('✅ Partial match for medical health check');
        return 'medicalHealthCheck';
      }
      
      // Check for anthropometric record variations
      if (title.includes('anthropométrique') || title.includes('anthropometric') || title.includes('conduite') || title.includes('conduct') ||
          normalizedTitle.includes('anthropometrique') || normalizedTitle.includes('conduct') ||
          (title.includes('fiche') && title.includes('conduite')) ||
          (normalizedTitle.includes('fiche') && normalizedTitle.includes('conduct'))) {
        console.log('✅ Partial match for anthropometric record');
        return 'anthropometricRecord';
      }
    }
    
    // Final fallback: try to match by key patterns
    if (doc.title && typeof doc.title === 'string') {
      const title = doc.title.toLowerCase();
      
      // Medical health check patterns
      if ((title.includes('certificat') && title.includes('médical')) ||
          (title.includes('certificat') && title.includes('medical')) ||
          (title.includes('certificat') && title.includes('santé')) ||
          (title.includes('certificat') && title.includes('sante'))) {
        console.log('✅ Fallback match for medical health check');
        return 'medicalHealthCheck';
      }
      
      // Anthropometric record patterns
      if ((title.includes('fiche') && title.includes('anthropométrique')) ||
          (title.includes('fiche') && title.includes('anthropometric')) ||
          (title.includes('fiche') && title.includes('conduite')) ||
          (title.includes('fiche') && title.includes('conduct'))) {
        console.log('✅ Fallback match for anthropometric record');
        return 'anthropometricRecord';
      }
    }
    
    return null;
  };

  // Function to create documents map from userDocuments
  const createDocumentsMap = async (documents) => {
    const map = {};
    const translations = {};
    
    if (documents && Array.isArray(documents)) {
      console.log('Creating documents map from:', documents);
      console.log('Looking for China documents specifically...');
      documents.forEach(doc => {
        console.log('Processing document:', doc.title, '->', findDocumentKey(doc));
        
        // Special logging for China documents
        if (doc.title && (doc.title.includes('Médical') || doc.title.includes('Anthropométrique') || doc.title.includes('Medical') || doc.title.includes('Anthropometric'))) {
          console.log('🔍 CHINA DOCUMENT DETECTED:', doc.title, 'Type:', doc.type, 'Category:', doc.category);
        }
        
        const docKey = findDocumentKey(doc);
        if (docKey) {
          map[docKey] = {
            id: doc.id,
            name: doc.originalFilename,
            size: doc.fileSize,
            type: doc.mimeType,
            uploadedAt: doc.createdAt,
            status: 'uploaded',
            validationStatus: doc.validationStatus || 'pending',
            validationComment: doc.validationNotes || doc.rejectionReason,
            validatedAt: doc.validatedAt,
            originalLanguage: doc.originalLanguage,
            etawjihiNotes: doc.etawjihiNotes
          };
          console.log(`Successfully mapped document: ${doc.title} -> ${docKey}`);
        } else {
          console.warn('No document key found for:', doc.title);
        }
      });
      
      // Load translations for each document
      for (const [docKey, doc] of Object.entries(map)) {
        try {
          const documentTranslations = await documentTranslationService.getTranslations(doc.id);
          translations[docKey] = documentTranslations;
          console.log(`Loaded ${documentTranslations.length} translations for ${docKey}`);
        } catch (error) {
          console.error(`Error loading translations for document ${docKey}:`, error);
          translations[docKey] = [];
        }
      }
    }
    
    console.log('Final documents map:', map);
    console.log('Final translations map:', translations);
    
    // Log China documents specifically
    const chinaDocs = ['medicalHealthCheck', 'anthropometricRecord'];
    chinaDocs.forEach(docKey => {
      if (map[docKey]) {
        console.log(`✅ China document ${docKey} found in map:`, map[docKey]);
      } else {
        console.log(`❌ China document ${docKey} NOT found in map`);
      }
    });
    
    return { map, translations };
  };

  // Helper function to check if document has French translation
  const hasFrenchTranslation = (docKey) => {
    const translations = translationsMap[docKey] || [];
    return translations.some(translation => 
      translation.targetLanguage === 'French' || 
      translation.targetLanguage === 'Français' ||
      translation.targetLanguage === 'fr'
    );
  };

  // Helper function to check if required document is properly in French
  const isRequiredDocumentInFrench = (docKey, uploadedDoc, docRequired) => {
    if (!docRequired) return true; // Non-required documents are always valid
    
    if (!uploadedDoc) return false; // Required document is missing
    
    // Check if original is in French
    const isOriginalFrench = uploadedDoc.originalLanguage === 'French' || 
                           uploadedDoc.originalLanguage === 'Français';
    
    // Check if has French translation
    const hasFrenchTrans = hasFrenchTranslation(docKey);
    
    // For required documents, must have either French original OR French translation
    return isOriginalFrench || hasFrenchTrans;
  };

  // Helper function to check if required document is properly in English (for China)
  const isRequiredDocumentInEnglish = (docKey, uploadedDoc, docRequired) => {
    if (!docRequired) return true; // Non-required documents are always valid
    
    if (!uploadedDoc) return false; // Required document is missing
    
    // Check if original is in English
    const isOriginalEnglish = uploadedDoc.originalLanguage === 'English' || 
                             uploadedDoc.originalLanguage === 'Anglais';
    
    // Check if has English translation
    const hasEnglishTrans = hasEnglishTranslation(docKey);
    
    console.log(`🔍 Document ${docKey} validation:`, {
      originalLanguage: uploadedDoc.originalLanguage,
      isOriginalEnglish,
      hasEnglishTrans,
      result: isOriginalEnglish || hasEnglishTrans
    });
    
    // For required documents, must have either English original OR English translation
    return isOriginalEnglish || hasEnglishTrans;
  };

  // Helper function to check if required document needs French validation
  const needsFrenchValidation = (docKey, uploadedDoc, docRequired) => {
    if (!docRequired) return false; // Non-required documents don't need French validation
    
    if (!uploadedDoc) return true; // Required document is missing, needs French
    
    // Check if original is in French
    const isOriginalFrench = uploadedDoc.originalLanguage === 'French' || 
                           uploadedDoc.originalLanguage === 'Français';
    
    // Check if has French translation
    const hasFrenchTrans = hasFrenchTranslation(docKey);
    
    // For required documents, show "Français Requis" if not in French
    return !isOriginalFrench && !hasFrenchTrans;
  };

  // Helper function to check if required document needs English validation (for China)
  const needsEnglishValidation = (docKey, uploadedDoc, docRequired) => {
    if (!docRequired) return false; // Non-required documents don't need English validation
    
    if (!uploadedDoc) return true; // Required document is missing, needs English
    
    // Check if original is in English
    const isOriginalEnglish = uploadedDoc.originalLanguage === 'English' || 
                             uploadedDoc.originalLanguage === 'Anglais';
    
    // Check if has English translation
    const hasEnglishTrans = hasEnglishTranslation(docKey);
    
    // For required documents, show "Anglais Requis" if not in English
    return !isOriginalEnglish && !hasEnglishTrans;
  };

  // Helper function to check if document has English translation
  const hasEnglishTranslation = (docKey) => {
    const translations = translationsMap[docKey] || [];
    console.log(`🔍 Checking English translation for ${docKey}:`, translations);
    const hasEnglish = translations.some(translation => 
      translation.targetLanguage === 'en' || 
      translation.targetLanguage === 'English'
    );
    console.log(`✅ Has English translation for ${docKey}:`, hasEnglish);
    return hasEnglish;
  };

  // Form data state
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: [],
      gender: '',
      maritalStatus: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      cinNumber: '',
      passportAvailable: false,
      passportNumber: '',
      passportIssueDate: '',
      whatsapp: '',
      phoneCountry: '',
      whatsappCountry: '',
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
    // China-specific fields
    chinaFields: {
      religion: '',
      familyMembers: {
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
      }
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
      title: language === 'en' ? 'Final Steps' : 'Étapes Finales',
      icon: Flag,
      description: language === 'en' ? 'Next steps after submission' : 'Prochaines étapes après soumission'
    }
  ];

  // Update language when user changes
  useEffect(() => {
    if (user?.preferredLanguage) {
      setLanguage(user.preferredLanguage);
    }
  }, [user?.preferredLanguage]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      // Validate IDs
      if (isNaN(establishmentId) || isNaN(programId)) {
        console.error('Invalid IDs:', { establishmentId, programId });
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        
        // Set language from user preference or default to 'en'
        const userLanguage = user.preferredLanguage || 'en';
        setLanguage(userLanguage);
        
        // Load program data, user profile, and qualifications in parallel
        const [programData, userProfileData, userQualifications, userDocumentsData, step2ValidationData, step4ValidationData, step5ValidationData, finalStepsData] = await Promise.all([
          programService.getProgram(programId),
          profileService.getProfile(),
          profileService.getQualifications(),
          documentService.getDocuments(),
          profileService.getStep2Validation(),
          profileService.getStep4Validation(),
          profileService.getStep5Validation(),
          finalStepService.getFinalSteps(userLanguage)
        ]);
        
        setProgram(programData.data);
        setUserProfile(userProfileData);
        setUserDocuments(userDocumentsData);
        setStep2Validated(step2ValidationData.step2Validated);
        setStep4Validated(step4ValidationData.step4Validated);
        setStep5Validated(step5ValidationData.step5Validated);
        setFinalSteps(finalStepsData);
        
        // Create documents map for consistent document handling
        const { map: documentsMap, translations } = await createDocumentsMap(userDocumentsData);
        setDocumentsMap(documentsMap);
        setTranslationsMap(translations);
        
        // Debug: Log user profile and documents
        console.log('User profile loaded:', userProfileData);
        console.log('User documents loaded:', userDocumentsData);
        console.log('Documents map created:', documentsMap);
        console.log('Translations map created:', translations);
        
        // Debug: Log program data to see intakes structure
        console.log('Program data loaded:', programData.data);
        console.log('Program intakes:', programData.data?.intakes);
        
        // Pre-fill personal information from user profile (only fill empty fields)
        if (userProfileData) {
          setFormData(prev => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              // Only fill if the field is empty
              firstName: prev.personalInfo.firstName || userProfileData.firstName || '',
              lastName: prev.personalInfo.lastName || userProfileData.lastName || '',
              email: prev.personalInfo.email || user.email || userProfileData.email || '',
              phone: prev.personalInfo.phone || userProfileData.phone || '',
              whatsapp: prev.personalInfo.whatsapp || userProfileData.whatsapp || '',
              phoneCountry: prev.personalInfo.phoneCountry || userProfileData.phoneCountry || '',
              whatsappCountry: prev.personalInfo.whatsappCountry || userProfileData.whatsappCountry || '',
              dateOfBirth: prev.personalInfo.dateOfBirth || userProfileData.dateOfBirth || '',
              gender: prev.personalInfo.gender || userProfileData.gender || '',
              maritalStatus: prev.personalInfo.maritalStatus || userProfileData.maritalStatus || '',
              countryOfBirth: prev.personalInfo.countryOfBirth || userProfileData.countryOfBirth || '',
              cityOfBirth: prev.personalInfo.cityOfBirth || userProfileData.cityOfBirth || '',
              nationality: (prev.personalInfo.nationality && prev.personalInfo.nationality.length > 0) 
                ? prev.personalInfo.nationality 
                : (Array.isArray(userProfileData.nationality) ? userProfileData.nationality : (userProfileData.nationality ? [userProfileData.nationality] : [])),
              address: prev.personalInfo.address || userProfileData.address || '',
              city: prev.personalInfo.city || userProfileData.city || '',
              country: prev.personalInfo.country || (Array.isArray(userProfileData.country) ? userProfileData.country[0] || '' : (userProfileData.country || '')),
              postalCode: prev.personalInfo.postalCode || userProfileData.postalCode || '',
              passportNumber: prev.personalInfo.passportNumber || userProfileData.passportNumber || '',
              passportIssueDate: prev.personalInfo.passportIssueDate || userProfileData.passportIssueDate || '',
              passportAvailable: prev.personalInfo.passportAvailable !== undefined ? prev.personalInfo.passportAvailable : !!userProfileData.passportNumber,
              passportExpirationDate: prev.personalInfo.passportExpirationDate || userProfileData.passportExpirationDate || '',
              cinNumber: prev.personalInfo.cinNumber || userProfileData.cinNumber || '',
              alternateEmail: prev.personalInfo.alternateEmail || userProfileData.alternateEmail || '',
              religion: prev.personalInfo.religion || userProfileData.religion || '',
              nativeLanguage: prev.personalInfo.nativeLanguage || userProfileData.nativeLanguage || '',
              chineseName: prev.personalInfo.chineseName || userProfileData.chineseName || '',
              wechatId: prev.personalInfo.wechatId || userProfileData.wechatId || '',
              skypeNo: prev.personalInfo.skypeNo || userProfileData.skypeNo || '',
              emergencyContactName: prev.personalInfo.emergencyContactName || userProfileData.emergencyContactName || '',
              emergencyContactGender: prev.personalInfo.emergencyContactGender || userProfileData.emergencyContactGender || '',
              emergencyContactRelationship: prev.personalInfo.emergencyContactRelationship || userProfileData.emergencyContactRelationship || '',
              emergencyContactPhone: prev.personalInfo.emergencyContactPhone || userProfileData.emergencyContactPhone || '',
              emergencyContactEmail: prev.personalInfo.emergencyContactEmail || userProfileData.emergencyContactEmail || '',
              emergencyContactAddress: prev.personalInfo.emergencyContactAddress || userProfileData.emergencyContactAddress || '',
              // Determine hasWorkExperience: prioritize application data, then check if profile has work data
              // Check if this is initial state (form not yet loaded with data) by checking if firstName is empty
              hasWorkExperience: (!prev.personalInfo.firstName && userProfileData.hasWorkExperience !== undefined)
                ? userProfileData.hasWorkExperience
                : (prev.personalInfo.hasWorkExperience !== undefined 
                  ? prev.personalInfo.hasWorkExperience 
                  : (userProfileData.hasWorkExperience !== undefined 
                    ? userProfileData.hasWorkExperience 
                    : (userProfileData.workCompany || userProfileData.workPosition || userProfileData.workStartDate || userProfileData.workEndDate || userProfileData.workDescription ? true : false))),
              workCompany: prev.personalInfo.workCompany || userProfileData.workCompany || '',
              workPosition: prev.personalInfo.workPosition || userProfileData.workPosition || '',
              workStartDate: prev.personalInfo.workStartDate || userProfileData.workStartDate || '',
              workEndDate: prev.personalInfo.workEndDate || userProfileData.workEndDate || '',
              workDescription: prev.personalInfo.workDescription || userProfileData.workDescription || ''
            }
          }));
        }
        
        // Pre-fill qualifications from user profile
        if (userQualifications && Array.isArray(userQualifications)) {
          setUserQualifications(userQualifications);
          
          // Note: Auto-adding default qualifications is disabled
          // Users can manually add qualifications using the "Ajouter Baccalauréat & TCF" button
        }
        
        // Si on a un applicationId dans l'URL, charger cette application spécifique
        if (applicationId) {
          const specificApplication = await applicationService.getApplication(applicationId);
          setApplication(specificApplication);
          
          // Reload program from application to ensure we have the latest data including multiIntakes
          if (specificApplication.program?.id) {
            try {
              const appProgramData = await programService.getProgram(specificApplication.program.id);
              if (appProgramData.data) {
                setProgram(appProgramData.data);
                console.log('Program reloaded from application:', appProgramData.data);
                console.log('Program multiIntakes:', appProgramData.data?.multiIntakes);
              }
            } catch (error) {
              console.error('Error reloading program from application:', error);
            }
          }
          
          // Load existing form data from the specific application
          if (specificApplication.applicationData) {
            const appData = specificApplication.applicationData;
            
            // Load China-specific fields from application entity
            if (specificApplication.isChina) {
              setFormData(prev => ({
                ...prev,
                chinaFields: {
                  religion: specificApplication.religion || '',
                  familyMembers: specificApplication.familyMembers || {
                    father: { name: '', dateOfBirth: '', occupation: '', phone: '' },
                    mother: { name: '', dateOfBirth: '', occupation: '', phone: '' }
                  }
                }
              }));
            }
            if (appData.personalInfo) {
              setFormData(prev => ({
                ...prev,
                personalInfo: {
                  // Pre-fill from profile first, then override with saved application data
                  firstName: appData.personalInfo.firstName || prev.personalInfo.firstName || userProfileData?.firstName || '',
                  lastName: appData.personalInfo.lastName || prev.personalInfo.lastName || userProfileData?.lastName || '',
                  email: appData.personalInfo.email || prev.personalInfo.email || user.email || userProfileData?.email || '',
                  phone: appData.personalInfo.phone || prev.personalInfo.phone || userProfileData?.phone || '',
                  whatsapp: appData.personalInfo.whatsapp || prev.personalInfo.whatsapp || userProfileData?.whatsapp || '',
                  phoneCountry: appData.personalInfo.phoneCountry || prev.personalInfo.phoneCountry || userProfileData?.phoneCountry || '',
                  whatsappCountry: appData.personalInfo.whatsappCountry || prev.personalInfo.whatsappCountry || userProfileData?.whatsappCountry || '',
                  dateOfBirth: appData.personalInfo.dateOfBirth || prev.personalInfo.dateOfBirth || userProfileData?.dateOfBirth || '',
                  gender: appData.personalInfo.gender || prev.personalInfo.gender || userProfileData?.gender || '',
                  maritalStatus: appData.personalInfo.maritalStatus || prev.personalInfo.maritalStatus || userProfileData?.maritalStatus || '',
                  countryOfBirth: appData.personalInfo.countryOfBirth || prev.personalInfo.countryOfBirth || userProfileData?.countryOfBirth || '',
                  cityOfBirth: appData.personalInfo.cityOfBirth || prev.personalInfo.cityOfBirth || userProfileData?.cityOfBirth || '',
                  nationality: (appData.personalInfo.nationality && appData.personalInfo.nationality.length > 0) 
                    ? appData.personalInfo.nationality 
                    : (prev.personalInfo.nationality && prev.personalInfo.nationality.length > 0 
                      ? prev.personalInfo.nationality 
                      : (Array.isArray(userProfileData?.nationality) ? userProfileData.nationality : (userProfileData?.nationality ? [userProfileData.nationality] : []))),
                  address: appData.personalInfo.address || prev.personalInfo.address || userProfileData?.address || '',
                  city: appData.personalInfo.city || prev.personalInfo.city || userProfileData?.city || '',
                  country: appData.personalInfo.country || prev.personalInfo.country || (Array.isArray(userProfileData?.country) ? userProfileData.country[0] || '' : (userProfileData?.country || '')),
                  postalCode: appData.personalInfo.postalCode || prev.personalInfo.postalCode || userProfileData?.postalCode || '',
                  passportNumber: appData.personalInfo.passportNumber || prev.personalInfo.passportNumber || userProfileData?.passportNumber || '',
                  passportIssueDate: appData.personalInfo.passportIssueDate || prev.personalInfo.passportIssueDate || userProfileData?.passportIssueDate || '',
                  passportAvailable: appData.personalInfo.passportAvailable !== undefined ? appData.personalInfo.passportAvailable : (prev.personalInfo.passportAvailable !== undefined ? prev.personalInfo.passportAvailable : !!userProfileData?.passportNumber),
                  passportExpirationDate: appData.personalInfo.passportExpirationDate || prev.personalInfo.passportExpirationDate || userProfileData?.passportExpirationDate || '',
                  cinNumber: appData.personalInfo.cinNumber || prev.personalInfo.cinNumber || userProfileData?.cinNumber || '',
                  alternateEmail: appData.personalInfo.alternateEmail || prev.personalInfo.alternateEmail || userProfileData?.alternateEmail || '',
                  religion: appData.personalInfo.religion || prev.personalInfo.religion || userProfileData?.religion || '',
                  nativeLanguage: appData.personalInfo.nativeLanguage || prev.personalInfo.nativeLanguage || userProfileData?.nativeLanguage || '',
                  chineseName: appData.personalInfo.chineseName || prev.personalInfo.chineseName || userProfileData?.chineseName || '',
                  wechatId: appData.personalInfo.wechatId || prev.personalInfo.wechatId || userProfileData?.wechatId || '',
                  skypeNo: appData.personalInfo.skypeNo || prev.personalInfo.skypeNo || userProfileData?.skypeNo || '',
                  emergencyContactName: appData.personalInfo.emergencyContactName || prev.personalInfo.emergencyContactName || userProfileData?.emergencyContactName || '',
                  emergencyContactGender: appData.personalInfo.emergencyContactGender || prev.personalInfo.emergencyContactGender || userProfileData?.emergencyContactGender || '',
                  emergencyContactRelationship: appData.personalInfo.emergencyContactRelationship || prev.personalInfo.emergencyContactRelationship || userProfileData?.emergencyContactRelationship || '',
                  emergencyContactPhone: appData.personalInfo.emergencyContactPhone || prev.personalInfo.emergencyContactPhone || userProfileData?.emergencyContactPhone || '',
                  emergencyContactEmail: appData.personalInfo.emergencyContactEmail || prev.personalInfo.emergencyContactEmail || userProfileData?.emergencyContactEmail || '',
                  emergencyContactAddress: appData.personalInfo.emergencyContactAddress || prev.personalInfo.emergencyContactAddress || userProfileData?.emergencyContactAddress || '',
                  // Determine hasWorkExperience: prioritize application data, then check if profile has work data
                  hasWorkExperience: appData.personalInfo.hasWorkExperience !== undefined 
                    ? appData.personalInfo.hasWorkExperience 
                    : (prev.personalInfo.hasWorkExperience !== undefined && prev.personalInfo.firstName)
                      ? prev.personalInfo.hasWorkExperience
                      : (userProfileData?.hasWorkExperience !== undefined 
                        ? userProfileData.hasWorkExperience 
                        : (userProfileData?.workCompany || userProfileData?.workPosition || userProfileData?.workStartDate || userProfileData?.workEndDate || userProfileData?.workDescription ? true : false)),
                  workCompany: appData.personalInfo.workCompany || prev.personalInfo.workCompany || userProfileData?.workCompany || '',
                  workPosition: appData.personalInfo.workPosition || prev.personalInfo.workPosition || userProfileData?.workPosition || '',
                  workStartDate: appData.personalInfo.workStartDate || prev.personalInfo.workStartDate || userProfileData?.workStartDate || '',
                  workEndDate: appData.personalInfo.workEndDate || prev.personalInfo.workEndDate || userProfileData?.workEndDate || '',
                  workDescription: appData.personalInfo.workDescription || prev.personalInfo.workDescription || userProfileData?.workDescription || ''
                }
              }));
            }
            if (appData.academicInfo) {
              setFormData(prev => ({
                ...prev,
                academicInfo: appData.academicInfo
              }));
            }
            if (appData.documents) {
              setFormData(prev => ({
                ...prev,
                documents: appData.documents
              }));
            }
              if (appData.preferences) {
                setFormData(prev => ({
                  ...prev,
                  preferences: appData.preferences
                }));
              }
              if (appData.chinaFields) {
                setFormData(prev => ({
                  ...prev,
                  chinaFields: appData.chinaFields
                }));
              }
            }
            
            // Set current step from application
            if (specificApplication.currentStep) {
            setCurrentStep(specificApplication.currentStep);
          }
          
          // Load modification request status if application is submitted
          if (specificApplication.status === 'submitted' || specificApplication.submittedAt) {
            try {
              const modificationStatus = await modificationRequestService.getModificationRequestStatus(specificApplication.id);
              setModificationRequest(modificationStatus.data);
              setModificationAllowed(modificationStatus.modificationAllowed);
            } catch (error) {
              console.error('Error loading modification request status:', error);
            }
          }
        } else {
          // Check for existing application
          const existingApplication = await applicationService.checkApplication(programData.id);
          
          if (existingApplication.hasActiveApplication) {
            setApplication(existingApplication.application);
            // Load existing form data
            if (existingApplication.application.applicationData) {
              const appData = existingApplication.application.applicationData;
              if (appData.personalInfo) {
                setFormData(prev => ({
                  ...prev,
                  personalInfo: {
                    // Pre-fill from profile first, then override with saved application data
                    firstName: appData.personalInfo.firstName || prev.personalInfo.firstName || userProfileData?.firstName || '',
                    lastName: appData.personalInfo.lastName || prev.personalInfo.lastName || userProfileData?.lastName || '',
                    email: appData.personalInfo.email || prev.personalInfo.email || user.email || userProfileData?.email || '',
                    phone: appData.personalInfo.phone || prev.personalInfo.phone || userProfileData?.phone || '',
                    whatsapp: appData.personalInfo.whatsapp || prev.personalInfo.whatsapp || userProfileData?.whatsapp || '',
                    phoneCountry: appData.personalInfo.phoneCountry || prev.personalInfo.phoneCountry || userProfileData?.phoneCountry || '',
                    whatsappCountry: appData.personalInfo.whatsappCountry || prev.personalInfo.whatsappCountry || userProfileData?.whatsappCountry || '',
                    dateOfBirth: appData.personalInfo.dateOfBirth || prev.personalInfo.dateOfBirth || userProfileData?.dateOfBirth || '',
                    gender: appData.personalInfo.gender || prev.personalInfo.gender || userProfileData?.gender || '',
                    maritalStatus: appData.personalInfo.maritalStatus || prev.personalInfo.maritalStatus || userProfileData?.maritalStatus || '',
                    countryOfBirth: appData.personalInfo.countryOfBirth || prev.personalInfo.countryOfBirth || userProfileData?.countryOfBirth || '',
                    cityOfBirth: appData.personalInfo.cityOfBirth || prev.personalInfo.cityOfBirth || userProfileData?.cityOfBirth || '',
                    nationality: (appData.personalInfo.nationality && appData.personalInfo.nationality.length > 0) 
                      ? appData.personalInfo.nationality 
                      : (prev.personalInfo.nationality && prev.personalInfo.nationality.length > 0 
                        ? prev.personalInfo.nationality 
                        : (Array.isArray(userProfileData?.nationality) ? userProfileData.nationality : (userProfileData?.nationality ? [userProfileData.nationality] : []))),
                    address: appData.personalInfo.address || prev.personalInfo.address || userProfileData?.address || '',
                    city: appData.personalInfo.city || prev.personalInfo.city || userProfileData?.city || '',
                    country: appData.personalInfo.country || prev.personalInfo.country || (Array.isArray(userProfileData?.country) ? userProfileData.country[0] || '' : (userProfileData?.country || '')),
                    postalCode: appData.personalInfo.postalCode || prev.personalInfo.postalCode || userProfileData?.postalCode || '',
                    passportNumber: appData.personalInfo.passportNumber || prev.personalInfo.passportNumber || userProfileData?.passportNumber || '',
                    passportIssueDate: appData.personalInfo.passportIssueDate || prev.personalInfo.passportIssueDate || userProfileData?.passportIssueDate || '',
                    passportAvailable: appData.personalInfo.passportAvailable !== undefined ? appData.personalInfo.passportAvailable : (prev.personalInfo.passportAvailable !== undefined ? prev.personalInfo.passportAvailable : !!userProfileData?.passportNumber),
                    passportExpirationDate: appData.personalInfo.passportExpirationDate || prev.personalInfo.passportExpirationDate || userProfileData?.passportExpirationDate || '',
                    cinNumber: appData.personalInfo.cinNumber || prev.personalInfo.cinNumber || userProfileData?.cinNumber || '',
                    alternateEmail: appData.personalInfo.alternateEmail || prev.personalInfo.alternateEmail || userProfileData?.alternateEmail || '',
                    religion: appData.personalInfo.religion || prev.personalInfo.religion || userProfileData?.religion || '',
                    nativeLanguage: appData.personalInfo.nativeLanguage || prev.personalInfo.nativeLanguage || userProfileData?.nativeLanguage || '',
                    chineseName: appData.personalInfo.chineseName || prev.personalInfo.chineseName || userProfileData?.chineseName || '',
                    wechatId: appData.personalInfo.wechatId || prev.personalInfo.wechatId || userProfileData?.wechatId || '',
                    skypeNo: appData.personalInfo.skypeNo || prev.personalInfo.skypeNo || userProfileData?.skypeNo || '',
                    emergencyContactName: appData.personalInfo.emergencyContactName || prev.personalInfo.emergencyContactName || userProfileData?.emergencyContactName || '',
                    emergencyContactGender: appData.personalInfo.emergencyContactGender || prev.personalInfo.emergencyContactGender || userProfileData?.emergencyContactGender || '',
                    emergencyContactRelationship: appData.personalInfo.emergencyContactRelationship || prev.personalInfo.emergencyContactRelationship || userProfileData?.emergencyContactRelationship || '',
                    emergencyContactPhone: appData.personalInfo.emergencyContactPhone || prev.personalInfo.emergencyContactPhone || userProfileData?.emergencyContactPhone || '',
                    emergencyContactEmail: appData.personalInfo.emergencyContactEmail || prev.personalInfo.emergencyContactEmail || userProfileData?.emergencyContactEmail || '',
                    emergencyContactAddress: appData.personalInfo.emergencyContactAddress || prev.personalInfo.emergencyContactAddress || userProfileData?.emergencyContactAddress || '',
                    // Determine hasWorkExperience: prioritize application data, then check if profile has work data
                    hasWorkExperience: appData.personalInfo.hasWorkExperience !== undefined 
                      ? appData.personalInfo.hasWorkExperience 
                      : (prev.personalInfo.hasWorkExperience !== undefined && prev.personalInfo.firstName)
                        ? prev.personalInfo.hasWorkExperience
                        : (userProfileData?.hasWorkExperience !== undefined 
                          ? userProfileData.hasWorkExperience 
                          : (userProfileData?.workCompany || userProfileData?.workPosition || userProfileData?.workStartDate || userProfileData?.workEndDate || userProfileData?.workDescription ? true : false)),
                    workCompany: appData.personalInfo.workCompany || prev.personalInfo.workCompany || userProfileData?.workCompany || '',
                    workPosition: appData.personalInfo.workPosition || prev.personalInfo.workPosition || userProfileData?.workPosition || '',
                    workStartDate: appData.personalInfo.workStartDate || prev.personalInfo.workStartDate || userProfileData?.workStartDate || '',
                    workEndDate: appData.personalInfo.workEndDate || prev.personalInfo.workEndDate || userProfileData?.workEndDate || '',
                    workDescription: appData.personalInfo.workDescription || prev.personalInfo.workDescription || userProfileData?.workDescription || ''
                  }
                }));
              }
              if (appData.academicInfo) {
                setFormData(prev => ({
                  ...prev,
                  academicInfo: appData.academicInfo
                }));
              }
              if (appData.documents) {
                setFormData(prev => ({
                  ...prev,
                  documents: appData.documents
                }));
              }
              if (appData.preferences) {
                setFormData(prev => ({
                  ...prev,
                  preferences: appData.preferences
                }));
              }
              if (appData.chinaFields) {
                setFormData(prev => ({
                  ...prev,
                  chinaFields: appData.chinaFields
                }));
              }
            }
            
            // Set current step from application
            if (existingApplication.application.currentStep) {
              setCurrentStep(existingApplication.application.currentStep);
            }
            
            // Load modification request status if application is submitted
            if (existingApplication.application.status === 'submitted' || existingApplication.application.submittedAt) {
              try {
                const modificationStatus = await modificationRequestService.getModificationRequestStatus(existingApplication.application.id);
                setModificationRequest(modificationStatus.data);
                setModificationAllowed(modificationStatus.modificationAllowed);
              } catch (error) {
                console.error('Error loading modification request status:', error);
              }
            }
          } else {
            // Create new application
            const newApplication = await applicationService.createOrGetApplication(programData.id, userLanguage);
            setApplication(newApplication.data);
          }
        }
        
      } catch (error) {
        console.error('Error loading application data:', error);
        // Handle error - maybe redirect to program page
        navigate(`/establishment/${establishmentId}/${programId}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [establishmentId, programId, user, navigate, applicationId]);

  // Validate step 3 when documents change
  useEffect(() => {
    const checkStep3Validation = async () => {
      try {
        const validationResult = await profileService.validateStep3();
        console.log('🔍 Backend validation result:', validationResult);
        console.log('🔍 Step 3 validation isValid:', validationResult.isValid);
        console.log('🔍 Missing documents:', validationResult.missingDocuments);
        console.log('🔍 Documents status:', validationResult.documentsStatus);
        setStep3Validated(validationResult.isValid);
      } catch (error) {
        console.error('Error checking step 3 validation:', error);
        setStep3Validated(false);
      }
    };

    // Only check if we have documents loaded
    if (userDocuments && Object.keys(userDocuments).length > 0) {
      checkStep3Validation();
    }
  }, [userDocuments]);

  // Auto-validate step 4 when preferences change
  useEffect(() => {
    const autoValidateStep4 = async () => {
      if (validateStep4()) {
        try {
          await profileService.saveStep4Validation(true);
          setStep4Validated(true);
        } catch (error) {
          console.error('Error auto-validating step 4:', error);
        }
      } else {
        try {
          await profileService.saveStep4Validation(false);
          setStep4Validated(false);
        } catch (error) {
          console.error('Error auto-invalidating step 4:', error);
        }
      }
    };

    // Only validate if we have preferences data
    if (formData.preferences) {
      autoValidateStep4();
    }
  }, [formData.preferences]);

  // Note: Auto-save for personal info is disabled
  // Users must manually save using the "Enregistrer" button

  // Step validation functions
  // Calculate real progress based on actual step validations
  const calculateRealProgress = () => {
    let completedSteps = 0;
    // Only count steps 1-5 for progress (step 6 is final steps, not part of completion)
    const totalSteps = 5;
    
    // Step 1: Personal Information - based on validateStep1()
    if (validateStep1()) completedSteps++;
    
    // Step 2: Academic Background - based on step2Validated
    if (step2Validated) completedSteps++;
    
    // Step 3: Documents - based on step3Validated
    if (step3Validated) completedSteps++;
    
    // Step 4: Preferences - based on step4Validated
    if (step4Validated) completedSteps++;
    
    // Step 5: Review & Submit - based on step5Validated
    if (step5Validated) completedSteps++;
    
    // Step 6 (Final Steps) is not counted in progress as it's a post-submission tracking step
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const validateStep1 = () => {
    const { personalInfo } = formData;
    return (
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
  };

  const validateStep2 = () => {
    // Simplified validation - only check if TCF and Baccalauréat exist
    const hasTCF = userQualifications.some(q => 
      q.type === 'language' && q.title?.toLowerCase().includes('tcf')
    );
    const hasBaccalaureat = userQualifications.some(q => 
      q.type === 'academic' && q.title?.toLowerCase().includes('baccalauréat')
    );
    
    return hasTCF && hasBaccalaureat;
  };

  const validateStep4 = () => {
    // Check if preferences are filled
    const { preferences } = formData;
    
    // For step 4, we need either:
    // 1. A preferred intake selected, OR
    // 2. Additional information provided
    const hasIntake = preferences.intake && preferences.intake.trim() !== '';
    const hasAdditionalInfo = preferences.additionalInfo && preferences.additionalInfo.trim() !== '';
    
    return hasIntake || hasAdditionalInfo;
  };

  // Helper function to validate if a qualification is complete
  const isQualificationComplete = (qualification) => {
    if (!qualification) return false;
    
    // For TCF (language test), check if Baccalauréat exists
    if (qualification.type === 'language' && qualification.title?.toLowerCase().includes('tcf')) {
      const hasBaccalaureat = userQualifications.some(q => 
        q.type === 'academic' && 
        q.title?.toLowerCase().includes('baccalauréat') &&
        q.title && q.institution && q.field && q.academicQualification
      );
      return hasBaccalaureat;
    }
    
    // For academic qualifications, check all fields except score
    if (qualification.type === 'academic') {
      return qualification.title && 
             qualification.institution && 
             qualification.field && 
             qualification.academicQualification &&
             qualification.exactQualificationName;
    }
    
    // For other qualifications, check all fields except score
    return qualification.title && 
           qualification.institution && 
           qualification.field;
  };

  // Map countries from parameters
  const getCountryOptions = () => {
    if (!allParams?.countries) {
      // Fallback countries if API is not available
      const fallbackCountries = [
        { code: 'FR', labelEn: 'France', labelFr: 'France' },
        { code: 'US', labelEn: 'United States', labelFr: 'États-Unis' },
        { code: 'CA', labelEn: 'Canada', labelFr: 'Canada' },
        { code: 'GB', labelEn: 'United Kingdom', labelFr: 'Royaume-Uni' },
        { code: 'DE', labelEn: 'Germany', labelFr: 'Allemagne' },
        { code: 'ES', labelEn: 'Spain', labelFr: 'Espagne' },
        { code: 'IT', labelEn: 'Italy', labelFr: 'Italie' },
        { code: 'MA', labelEn: 'Morocco', labelFr: 'Maroc' },
        { code: 'TN', labelEn: 'Tunisia', labelFr: 'Tunisie' },
        { code: 'DZ', labelEn: 'Algeria', labelFr: 'Algérie' },
        { code: 'AU', labelEn: 'Australia', labelFr: 'Australie' },
        { code: 'NZ', labelEn: 'New Zealand', labelFr: 'Nouvelle-Zélande' },
        { code: 'NL', labelEn: 'Netherlands', labelFr: 'Pays-Bas' },
        { code: 'BE', labelEn: 'Belgium', labelFr: 'Belgique' },
        { code: 'CH', labelEn: 'Switzerland', labelFr: 'Suisse' },
        { code: 'AT', labelEn: 'Austria', labelFr: 'Autriche' },
        { code: 'SE', labelEn: 'Sweden', labelFr: 'Suède' },
        { code: 'NO', labelEn: 'Norway', labelFr: 'Norvège' },
        { code: 'DK', labelEn: 'Denmark', labelFr: 'Danemark' },
        { code: 'FI', labelEn: 'Finland', labelFr: 'Finlande' }
      ];
      return fallbackCountries.map(country => ({
        value: country.code,
        label: language === 'fr' ? (country.labelFr || country.labelEn) : country.labelEn,
        flag: getLanguageFlag(country.code),
      }));
    }
    
    return allParams.countries.map(country => ({
      value: country.code,
      label: language === 'fr' ? (country.labelFr || country.labelEn) : country.labelEn,
      flag: getLanguageFlag(country.code),
    }));
  };

  // Get language flag emoji
  const getLanguageFlag = (code) => {
    const flags = {
      'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'NZ': '🇳🇿',
      'FR': '🇫🇷', 'DE': '🇩🇪', 'ES': '🇪🇸', 'IT': '🇮🇹', 'PT': '🇵🇹',
      'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪',
      'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'LU': '🇱🇺',
      'MA': '🇲🇦', 'TN': '🇹🇳', 'DZ': '🇩🇿', 'EG': '🇪🇬', 'LY': '🇱🇾',
      'SD': '🇸🇩', 'ET': '🇪🇹', 'KE': '🇰🇪', 'NG': '🇳🇬', 'ZA': '🇿🇦',
      'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'SG': '🇸🇬',
      'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳', 'ID': '🇮🇩', 'PH': '🇵🇭',
      'BR': '🇧🇷', 'AR': '🇦🇷', 'MX': '🇲🇽', 'CL': '🇨🇱', 'CO': '🇨🇴',
      'PE': '🇵🇪', 'VE': '🇻🇪', 'UY': '🇺🇾', 'PY': '🇵🇾', 'BO': '🇧🇴',
      'RU': '🇷🇺', 'UA': '🇺🇦', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺',
      'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SI': '🇸🇮', 'SK': '🇸🇰',
      'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪', 'TR': '🇹🇷', 'GR': '🇬🇷',
      'CY': '🇨🇾', 'MT': '🇲🇹', 'IS': '🇮🇸', 'IL': '🇮🇱', 'AE': '🇦🇪',
      'SA': '🇸🇦', 'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭', 'OM': '🇴🇲',
      'JO': '🇯🇴', 'LB': '🇱🇧', 'SY': '🇸🇾', 'IQ': '🇮🇶', 'IR': '🇮🇷',
      'AF': '🇦🇫', 'PK': '🇵🇰', 'BD': '🇧🇩', 'LK': '🇱🇰', 'MV': '🇲🇻',
      'NP': '🇳🇵', 'BT': '🇧🇹', 'MM': '🇲🇲', 'LA': '🇱🇦', 'KH': '🇰🇭',
      'MN': '🇲🇳', 'KZ': '🇰🇿', 'UZ': '🇺🇿', 'KG': '🇰🇬', 'TJ': '🇹🇯',
      'TM': '🇹🇲', 'AZ': '🇦🇿', 'AM': '🇦🇲', 'GE': '🇬🇪', 'MD': '🇲🇩',
      'BY': '🇧🇾', 'AL': '🇦🇱', 'MK': '🇲🇰', 'ME': '🇲🇪', 'RS': '🇷🇸',
      'BA': '🇧🇦', 'XK': '🇽🇰', 'AD': '🇦🇩', 'MC': '🇲🇨', 'SM': '🇸🇲',
      'VA': '🇻🇦', 'LI': '🇱🇮', 'FO': '🇫🇴', 'GL': '🇬🇱', 'SJ': '🇸🇯',
      'AX': '🇦🇽', 'GG': '🇬🇬', 'JE': '🇯🇪', 'IM': '🇮🇲', 'GI': '🇬🇮',
      'PT': '🇵🇹', 'ES': '🇪🇸', 'FR': '🇫🇷', 'IT': '🇮🇹', 'DE': '🇩🇪',
      'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪',
      'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'LU': '🇱🇺',
      'MA': '🇲🇦', 'TN': '🇹🇳', 'DZ': '🇩🇿', 'EG': '🇪🇬', 'LY': '🇱🇾',
      'SD': '🇸🇩', 'ET': '🇪🇹', 'KE': '🇰🇪', 'NG': '🇳🇬', 'ZA': '🇿🇦',
      'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'SG': '🇸🇬',
      'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳', 'ID': '🇮🇩', 'PH': '🇵🇭',
      'BR': '🇧🇷', 'AR': '🇦🇷', 'MX': '🇲🇽', 'CL': '🇨🇱', 'CO': '🇨🇴',
      'PE': '🇵🇪', 'VE': '🇻🇪', 'UY': '🇺🇾', 'PY': '🇵🇾', 'BO': '🇧🇴',
      'RU': '🇷🇺', 'UA': '🇺🇦', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺',
      'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SI': '🇸🇮', 'SK': '🇸🇰',
      'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪', 'TR': '🇹🇷', 'GR': '🇬🇷',
      'CY': '🇨🇾', 'MT': '🇲🇹', 'IS': '🇮🇸', 'IL': '🇮🇱', 'AE': '🇦🇪',
      'SA': '🇸🇦', 'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭', 'OM': '🇴🇲',
      'JO': '🇯🇴', 'LB': '🇱🇧', 'SY': '🇸🇾', 'IQ': '🇮🇶', 'IR': '🇮🇷',
      'AF': '🇦🇫', 'PK': '🇵🇰', 'BD': '🇧🇩', 'LK': '🇱🇰', 'MV': '🇲🇻',
      'NP': '🇳🇵', 'BT': '🇧🇹', 'MM': '🇲🇲', 'LA': '🇱🇦', 'KH': '🇰🇭',
      'MN': '🇲🇳', 'KZ': '🇰🇿', 'UZ': '🇺🇿', 'KG': '🇰🇬', 'TJ': '🇹🇯',
      'TM': '🇹🇲', 'AZ': '🇦🇿', 'AM': '🇦🇲', 'GE': '🇬🇪', 'MD': '🇲🇩',
      'BY': '🇧🇾', 'AL': '🇦🇱', 'MK': '🇲🇰', 'ME': '🇲🇪', 'RS': '🇷🇸',
      'BA': '🇧🇦', 'XK': '🇽🇰', 'AD': '🇦🇩', 'MC': '🇲🇨', 'SM': '🇸🇲',
      'VA': '🇻🇦', 'LI': '🇱🇮', 'FO': '🇫🇴', 'GL': '🇬🇱', 'SJ': '🇸🇯',
      'AX': '🇦🇽', 'GG': '🇬🇬', 'JE': '🇯🇪', 'IM': '🇮🇲', 'GI': '🇬🇮',
      'PT': '🇵🇹', 'ES': '🇪🇸', 'FR': '🇫🇷', 'IT': '🇮🇹', 'DE': '🇩🇪',
      'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪',
      'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'LU': '🇱🇺',
      'MA': '🇲🇦', 'TN': '🇹🇳', 'DZ': '🇩🇿', 'EG': '🇪🇬', 'LY': '🇱🇾',
      'SD': '🇸🇩', 'ET': '🇪🇹', 'KE': '🇰🇪', 'NG': '🇳🇬', 'ZA': '🇿🇦',
      'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'SG': '🇸🇬',
      'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳', 'ID': '🇮🇩', 'PH': '🇵🇭',
      'BR': '🇧🇷', 'AR': '🇦🇷', 'MX': '🇲🇽', 'CL': '🇨🇱', 'CO': '🇨🇴',
      'PE': '🇵🇪', 'VE': '🇻🇪', 'UY': '🇺🇾', 'PY': '🇵🇾', 'BO': '🇧🇴',
      'RU': '🇷🇺', 'UA': '🇺🇦', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺',
      'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SI': '🇸🇮', 'SK': '🇸🇰',
      'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪', 'TR': '🇹🇷', 'GR': '🇬🇷',
      'CY': '🇨🇾', 'MT': '🇲🇹', 'IS': '🇮🇸', 'IL': '🇮🇱', 'AE': '🇦🇪',
      'SA': '🇸🇦', 'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭', 'OM': '🇴🇲',
      'JO': '🇯🇴', 'LB': '🇱🇧', 'SY': '🇸🇾', 'IQ': '🇮🇶', 'IR': '🇮🇷',
      'AF': '🇦🇫', 'PK': '🇵🇰', 'BD': '🇧🇩', 'LK': '🇱🇰', 'MV': '🇲🇻',
      'NP': '🇳🇵', 'BT': '🇧🇹', 'MM': '🇲🇲', 'LA': '🇱🇦', 'KH': '🇰🇭',
      'MN': '🇲🇳', 'KZ': '🇰🇿', 'UZ': '🇺🇿', 'KG': '🇰🇬', 'TJ': '🇹🇯',
      'TM': '🇹🇲', 'AZ': '🇦🇿', 'AM': '🇦🇲', 'GE': '🇬🇪', 'MD': '🇲🇩',
      'BY': '🇧🇾', 'AL': '🇦🇱', 'MK': '🇲🇰', 'ME': '🇲🇪', 'RS': '🇷🇸',
      'BA': '🇧🇦', 'XK': '🇽🇰', 'AD': '🇦🇩', 'MC': '🇲🇨', 'SM': '🇸🇲',
      'VA': '🇻🇦', 'LI': '🇱🇮', 'FO': '🇫🇴', 'GL': '🇬🇱', 'SJ': '🇸🇯',
      'AX': '🇦🇽', 'GG': '🇬🇬', 'JE': '🇯🇪', 'IM': '🇮🇲', 'GI': '🇬🇮',
      'PT': '🇵🇹', 'ES': '🇪🇸', 'FR': '🇫🇷', 'IT': '🇮🇹', 'DE': '🇩🇪',
      'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪',
      'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'LU': '🇱🇺',
      'MA': '🇲🇦', 'TN': '🇹🇳', 'DZ': '🇩🇿', 'EG': '🇪🇬', 'LY': '🇱🇾',
      'SD': '🇸🇩', 'ET': '🇪🇹', 'KE': '🇰🇪', 'NG': '🇳🇬', 'ZA': '🇿🇦',
      'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'SG': '🇸🇬',
      'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳', 'ID': '🇮🇩', 'PH': '🇵🇭',
      'BR': '🇧🇷', 'AR': '🇦🇷', 'MX': '🇲🇽', 'CL': '🇨🇱', 'CO': '🇨🇴',
      'PE': '🇵🇪', 'VE': '🇻🇪', 'UY': '🇺🇾', 'PY': '🇵🇾', 'BO': '🇧🇴',
      'RU': '🇷🇺', 'UA': '🇺🇦', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺',
      'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SI': '🇸🇮', 'SK': '🇸🇰',
      'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪', 'TR': '🇹🇷', 'GR': '🇬🇷',
      'CY': '🇨🇾', 'MT': '🇲🇹', 'IS': '🇮🇸', 'IL': '🇮🇱', 'AE': '🇦🇪',
      'SA': '🇸🇦', 'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭', 'OM': '🇴🇲',
      'JO': '🇯🇴', 'LB': '🇱🇧', 'SY': '🇸🇾', 'IQ': '🇮🇶', 'IR': '🇮🇷',
      'AF': '🇦🇫', 'PK': '🇵🇰', 'BD': '🇧🇩', 'LK': '🇱🇰', 'MV': '🇲🇻',
      'NP': '🇳🇵', 'BT': '🇧🇹', 'MM': '🇲🇲', 'LA': '🇱🇦', 'KH': '🇰🇭',
      'MN': '🇲🇳', 'KZ': '🇰🇿', 'UZ': '🇺🇿', 'KG': '🇰🇬', 'TJ': '🇹🇯',
      'TM': '🇹🇲', 'AZ': '🇦🇿', 'AM': '🇦🇲', 'GE': '🇬🇪', 'MD': '🇲🇩',
      'BY': '🇧🇾', 'AL': '🇦🇱', 'MK': '🇲🇰', 'ME': '🇲🇪', 'RS': '🇷🇸',
      'BA': '🇧🇦', 'XK': '🇽🇰', 'AD': '🇦🇩', 'MC': '🇲🇨', 'SM': '🇸🇲',
      'VA': '🇻🇦', 'LI': '🇱🇮', 'FO': '🇫🇴', 'GL': '🇬🇱', 'SJ': '🇸🇯',
      'AX': '🇦🇽', 'GG': '🇬🇬', 'JE': '🇯🇪', 'IM': '🇮🇲', 'GI': '🇬🇮',
      'PT': '🇵🇹', 'ES': '🇪🇸', 'FR': '🇫🇷', 'IT': '🇮🇹', 'DE': '🇩🇪',
      'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪',
      'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'LU': '🇱🇺',
      'MA': '🇲🇦', 'TN': '🇹🇳', 'DZ': '🇩🇿', 'EG': '🇪🇬', 'LY': '🇱🇾',
      'SD': '🇸🇩', 'ET': '🇪🇹', 'KE': '🇰🇪', 'NG': '🇳🇬', 'ZA': '🇿🇦',
      'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'SG': '🇸🇬',
      'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳', 'ID': '🇮🇩', 'PH': '🇵🇭',
      'BR': '🇧🇷', 'AR': '🇦🇷', 'MX': '🇲🇽', 'CL': '🇨🇱', 'CO': '🇨🇴',
      'PE': '🇵🇪', 'VE': '🇻🇪', 'UY': '🇺🇾', 'PY': '🇵🇾', 'BO': '🇧🇴',
      'RU': '🇷🇺', 'UA': '🇺🇦', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺',
      'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SI': '🇸🇮', 'SK': '🇸🇰',
      'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪', 'TR': '🇹🇷', 'GR': '🇬🇷',
      'CY': '🇨🇾', 'MT': '🇲🇹', 'IS': '🇮🇸', 'IL': '🇮🇱', 'AE': '🇦🇪',
      'SA': '🇸🇦', 'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭', 'OM': '🇴🇲',
      'JO': '🇯🇴', 'LB': '🇱🇧', 'SY': '🇸🇾', 'IQ': '🇮🇶', 'IR': '🇮🇷',
      'AF': '🇦🇫', 'PK': '🇵🇰', 'BD': '🇧🇩', 'LK': '🇱🇰', 'MV': '🇲🇻',
      'NP': '🇳🇵', 'BT': '🇧🇹', 'MM': '🇲🇲', 'LA': '🇱🇦', 'KH': '🇰🇭',
      'MN': '🇲🇳', 'KZ': '🇰🇿', 'UZ': '🇺🇿', 'KG': '🇰🇬', 'TJ': '🇹🇯',
      'TM': '🇹🇲', 'AZ': '🇦🇿', 'AM': '🇦🇲', 'GE': '🇬🇪', 'MD': '🇲🇩',
      'BY': '🇧🇾', 'AL': '🇦🇱', 'MK': '🇲🇰', 'ME': '🇲🇪', 'RS': '🇷🇸',
      'BA': '🇧🇦', 'XK': '🇽🇰', 'AD': '🇦🇩', 'MC': '🇲🇨', 'SM': '🇸🇲',
      'VA': '🇻🇦', 'LI': '🇱🇮', 'FO': '🇫🇴', 'GL': '🇬🇱', 'SJ': '🇸🇯',
      'AX': '🇦🇽', 'GG': '🇬🇬', 'JE': '🇯🇪', 'IM': '🇮🇲', 'GI': '🇬🇮',
      'PT': '🇵🇹', 'ES': '🇪🇸', 'FR': '🇫🇷', 'IT': '🇮🇹', 'DE': '🇩🇪',
      'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪',
      'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'LU': '🇱🇺',
      'MA': '🇲🇦', 'TN': '🇹🇳', 'DZ': '🇩🇿', 'EG': '🇪🇬', 'LY': '🇱🇾',
      'SD': '🇸🇩', 'ET': '🇪🇹', 'KE': '🇰🇪', 'NG': '🇳🇬', 'ZA': '🇿🇦',
      'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'SG': '🇸🇬',
      'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳', 'ID': '🇮🇩', 'PH': '🇵🇭',
      'BR': '🇧🇷', 'AR': '🇦🇷', 'MX': '🇲🇽', 'CL': '🇨🇱', 'CO': '🇨🇴',
      'PE': '🇵🇪', 'VE': '🇻🇪', 'UY': '🇺🇾', 'PY': '🇵🇾', 'BO': '🇧🇴',
      'RU': '🇷🇺', 'UA': '🇺🇦', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺',
      'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SI': '🇸🇮', 'SK': '🇸🇰',
      'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪', 'TR': '🇹🇷', 'GR': '🇬🇷',
      'CY': '🇨🇾', 'MT': '🇲🇹', 'IS': '🇮🇸', 'IL': '🇮🇱', 'AE': '🇦🇪',
      'SA': '🇸🇦', 'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭', 'OM': '🇴🇲',
      'JO': '🇯🇴', 'LB': '🇱🇧', 'SY': '🇸🇾', 'IQ': '🇮🇶', 'IR': '🇮🇷',
      'AF': '🇦🇫', 'PK': '🇵🇰', 'BD': '🇧🇩', 'LK': '🇱🇰', 'MV': '🇲🇻',
      'NP': '🇳🇵', 'BT': '🇧🇹', 'MM': '🇲🇲', 'LA': '🇱🇦', 'KH': '🇰🇭',
      'MN': '🇲🇳', 'KZ': '🇰🇿', 'UZ': '🇺🇿', 'KG': '🇰🇬', 'TJ': '🇹🇯',
      'TM': '🇹🇲', 'AZ': '🇦🇿', 'AM': '🇦🇲', 'GE': '🇬🇪', 'MD': '🇲🇩',
      'BY': '🇧🇾', 'AL': '🇦🇱', 'MK': '🇲🇰', 'ME': '🇲🇪', 'RS': '🇷🇸',
      'BA': '🇧🇦', 'XK': '🇽🇰', 'AD': '🇦🇩', 'MC': '🇲🇨', 'SM': '🇸🇲',
      'VA': '🇻🇦', 'LI': '🇱🇮', 'FO': '🇫🇴', 'GL': '🇬🇱', 'SJ': '🇸🇯',
      'AX': '🇦🇽', 'GG': '🇬🇬', 'JE': '🇯🇪', 'IM': '🇮🇲', 'GI': '🇬🇮'
    };
    return flags[code] || '🏳️';
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Auto-save after input change (except for intake selection which is handled manually)
    if (application && !(section === 'preferences' && field === 'intake')) {
      saveApplicationProgress();
    }
  };

  // Auto-save function
  const saveApplicationProgress = async (customFormData = null) => {
    if (!application) return;
    
    try {
      setIsSaving(true);
      
      // Use custom form data if provided, otherwise use current state
      const dataToSave = customFormData || formData;
      
      const updateData = {
        personalInfo: dataToSave.personalInfo,
        academicInfo: dataToSave.academicInfo,
        documents: dataToSave.documents,
        preferences: {
          intake: dataToSave.preferences.intake || '',
          additionalInfo: dataToSave.preferences.additionalInfo || ''
        },
        language: language
      };

      // Add China-specific fields if application is for China
      if (application.isChina && dataToSave.chinaFields) {
        updateData.chinaFields = dataToSave.chinaFields;
      }
      
      // Debug: Log the intake selection being saved
      console.log('Saving application progress with intake:', dataToSave.preferences.intake);
      console.log('Full preferences data:', dataToSave.preferences);
      console.log('Update data being sent:', updateData);
      
      await applicationService.updateApplication(application.id, updateData);
      
      setLastSaved(new Date());
      console.log('Application progress saved successfully');
    } catch (error) {
      console.error('Error saving application progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Save personal information to user profile manually
  const savePersonalInfoToProfile = async () => {
    try {
      setIsSaving(true);
      const personalInfo = formData.personalInfo;
      
      const updates = {
        // Basic Information
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        dateOfBirth: personalInfo.dateOfBirth,
        gender: personalInfo.gender,
        maritalStatus: personalInfo.maritalStatus,
        
        // Birth Information
        countryOfBirth: personalInfo.countryOfBirth,
        cityOfBirth: personalInfo.cityOfBirth,
        nationality: personalInfo.nationality,
        
        // Contact Information
        phone: personalInfo.phone,
        phoneCountry: personalInfo.phoneCountry,
        whatsapp: personalInfo.whatsapp,
        whatsappCountry: personalInfo.whatsappCountry,
        alternateEmail: personalInfo.alternateEmail,
        
        // Address Information
        address: personalInfo.address,
        city: personalInfo.city,
        country: personalInfo.country,
        postalCode: personalInfo.postalCode,
        
        // Official Documents
        passportNumber: personalInfo.passportNumber,
        passportExpirationDate: personalInfo.passportExpirationDate,
        cinNumber: personalInfo.cinNumber,
        
        // Additional Information
        religion: personalInfo.religion,
        nativeLanguage: personalInfo.nativeLanguage,
        chineseName: personalInfo.chineseName,
        
        // Communication
        wechatId: personalInfo.wechatId,
        skypeNo: personalInfo.skypeNo,
        
        // Emergency Contact Information
        emergencyContactName: personalInfo.emergencyContactName,
        emergencyContactGender: personalInfo.emergencyContactGender,
        emergencyContactRelationship: personalInfo.emergencyContactRelationship,
        emergencyContactPhone: personalInfo.emergencyContactPhone,
        emergencyContactEmail: personalInfo.emergencyContactEmail,
        emergencyContactAddress: personalInfo.emergencyContactAddress,
        
        // Work Experience Information
        hasWorkExperience: personalInfo.hasWorkExperience,
        workCompany: personalInfo.workCompany,
        workPosition: personalInfo.workPosition,
        workStartDate: personalInfo.workStartDate,
        workEndDate: personalInfo.workEndDate,
        workDescription: personalInfo.workDescription
      };
      
      console.log('Saving personal info to profile:', updates);
      await profileService.updateProfile(updates);
      console.log('Personal information saved to profile successfully');
      
      // Show success message
      alert(language === 'en' 
        ? 'Personal information saved to profile successfully!' 
        : 'Informations personnelles sauvegardées dans le profil avec succès !'
      );
      
    } catch (error) {
      console.error('Error saving personal info to profile:', error);
      alert(language === 'en' 
        ? 'Error saving personal information. Please try again.' 
        : 'Erreur lors de la sauvegarde des informations personnelles. Veuillez réessayer.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Qualification management functions
  const handleAddQualification = async (qualificationData) => {
    try {
      console.log('handleAddQualification received:', qualificationData);
      
      if (qualificationData.id) {
        // Update existing qualification
        console.log('Updating qualification with ID:', qualificationData.id);
        await profileService.updateQualification(qualificationData.id, qualificationData);
        console.log('Qualification updated in profile:', qualificationData);
      } else {
        // Add new qualification
        console.log('Adding new qualification');
        await profileService.addQualification(qualificationData);
        console.log('Qualification added to profile:', qualificationData);
      }
      
      // Refresh user qualifications
      const updatedQualifications = await profileService.getQualifications();
      setUserQualifications(updatedQualifications);
    } catch (error) {
      console.error('Error with qualification:', error);
    }
  };

  const handleRefreshQualifications = (updatedQualifications) => {
    setUserQualifications(updatedQualifications);
  };

  const handleDeleteQualification = async (idOrIndex) => {
    try {
      let qualificationToDelete;
      
      // Check if it's an ID (number) or index (number)
      if (typeof idOrIndex === 'number') {
        // If it's an ID, find the qualification
        qualificationToDelete = userQualifications.find(q => q.id === idOrIndex);
        if (!qualificationToDelete) {
          console.error('Qualification not found with ID:', idOrIndex);
          return;
        }
      } else {
        // If it's an index (legacy support)
        qualificationToDelete = userQualifications[idOrIndex];
      }
      
      // Delete from user profile if it has an ID (exists in database)
      if (qualificationToDelete.id) {
        await profileService.deleteQualification(qualificationToDelete.id);
        console.log('Qualification deleted from profile:', qualificationToDelete.id);
        
        // Refresh user qualifications
        const updatedQualifications = await profileService.getQualifications();
        setUserQualifications(updatedQualifications);
      }
    } catch (error) {
      console.error('Error deleting qualification from profile:', error);
    }
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

  // Function to refresh data when reaching review step
  const refreshDataForReview = async () => {
    try {
      console.log('Refreshing data for review step...');
      
      // Refresh user profile, qualifications, and documents
      const [userProfileData, userQualifications, userDocumentsData] = await Promise.all([
        profileService.getProfile(),
        profileService.getQualifications(),
        documentService.getDocuments()
      ]);
      
      setUserProfile(userProfileData);
      setUserQualifications(userQualifications);
      setUserDocuments(userDocumentsData);
      
      // Refresh documents map and translations
      const { map: documentsMap, translations } = await createDocumentsMap(userDocumentsData);
      setDocumentsMap(documentsMap);
      setTranslationsMap(translations);
      
      console.log('Data refreshed for review step:', {
        profile: userProfileData,
        qualifications: userQualifications,
        documents: userDocumentsData,
        documentsMap,
        translations
      });
    } catch (error) {
      console.error('Error refreshing data for review:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      // Refresh data when reaching step 5 (Review & Submit)
      if (newStep === 5) {
        refreshDataForReview();
      }
      
      // Refresh final steps when reaching step 6 (Final Steps)
      if (newStep === 6) {
        const refreshFinalSteps = async () => {
          try {
            const updatedFinalSteps = await finalStepService.getFinalSteps(language);
            setFinalSteps(updatedFinalSteps);
          } catch (error) {
            console.error('Error refreshing final steps:', error);
          }
        };
        refreshFinalSteps();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const blob = await finalStepService.downloadDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert(language === 'en' ? 'Failed to download document' : 'Échec du téléchargement du document');
    }
  };

  const handleRequestModification = async () => {
    if (!application || !modificationReason.trim()) {
      alert(language === 'en' ? 'Please provide a reason for the modification request' : 'Veuillez fournir une raison pour la demande de modification');
      return;
    }

    try {
      const result = await modificationRequestService.createModificationRequest(application.id, modificationReason);
      setModificationRequest(result.data);
      setShowModificationModal(false);
      setModificationReason('');
      alert(language === 'en' 
        ? 'Modification request submitted successfully. You will be notified when it is reviewed.' 
        : 'Demande de modification soumise avec succès. Vous serez notifié lorsqu\'elle sera examinée.');
    } catch (error) {
      console.error('Error creating modification request:', error);
      alert(language === 'en' 
        ? 'Failed to submit modification request' 
        : 'Échec de la soumission de la demande de modification');
    }
  };

  const handleSubmit = async () => {
    if (!application) return;
    
    try {
      // Ensure all data is saved before submission
      console.log('Final preferences data before submission:', formData.preferences);
      console.log('Selected intake:', formData.preferences?.intake);
      
      // Validate that intake is selected if program has intakes available
      if (program && program.multiIntakes && program.multiIntakes.length > 0 && !formData.preferences.intake) {
        alert(language === 'en' ? 'Please select a preferred intake before submitting.' : 'Veuillez sélectionner une période d\'admission préférée avant de soumettre.');
        return;
      }
      
      // Save all current data one final time
      const updateData = {
        personalInfo: formData.personalInfo,
        academicInfo: formData.academicInfo,
        documents: formData.documents,
        preferences: {
          intake: formData.preferences.intake || '',
          additionalInfo: formData.preferences.additionalInfo || ''
        },
        language: language
      };

      // Add China-specific fields if application is for China
      if (application.isChina && formData.chinaFields) {
        updateData.chinaFields = formData.chinaFields;
      }
      
      console.log('Final payload being sent:', updateData);
      console.log('Preferences payload specifically:', updateData.preferences);
      await applicationService.updateApplication(application.id, updateData);
      
      // Submit the application
      await applicationService.submitApplication(application.id);
      
      // Validate step 5 (Review & Submit) automatically upon successful submission
      await profileService.saveStep5Validation(true);
      setStep5Validated(true);
      
      // Reload application data to get updated status
      const updatedApplication = await applicationService.getApplication(application.id);
      setApplication(updatedApplication);
      
      // Reload final steps data before activating pre-admission step
      try {
        const refreshedFinalSteps = await finalStepService.getFinalSteps(language);
        setFinalSteps(refreshedFinalSteps);
        
        // Activate pre-admission step (first final step) after submission
        const preAdmissionStep = refreshedFinalSteps.find(step => step.order === 1);
        if (preAdmissionStep) {
          await finalStepService.updateFinalStepStatus(preAdmissionStep.id, {
            status: 'in_progress',
            notes: language === 'en' 
              ? 'Application submitted successfully. Your application is now under review.'
              : 'Candidature soumise avec succès. Votre candidature est maintenant en cours d\'examen.'
          });
          
          // Refresh final steps again to show updated status
          const updatedFinalSteps = await finalStepService.getFinalSteps(language);
          setFinalSteps(updatedFinalSteps);
        }
      } catch (error) {
        console.error('Error activating pre-admission step:', error);
        // Don't block the submission if this fails
      }
      
      alert(language === 'en' ? 'Application submitted successfully!' : 'Candidature soumise avec succès!');
      
      // Navigate to final steps instead of profile
      setCurrentStep(6);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(language === 'en' ? 'Failed to submit application' : 'Échec de la soumission de la candidature');
    }
  };

  const getStepNote = (stepId) => {
    const notes = {
      1: {
        en: 'Please ensure all personal information is accurate and matches your official documents. This information will be used for your application processing.',
        fr: 'Veuillez vous assurer que toutes les informations personnelles sont exactes et correspondent à vos documents officiels. Ces informations seront utilisées pour le traitement de votre candidature.'
      },
      2: {
        en: 'Complete your academic background including all qualifications, language tests, and standardized tests. This helps us evaluate your academic readiness.',
        fr: 'Complétez votre parcours académique incluant tous vos diplômes, tests de langues et tests standardisés. Cela nous aide à évaluer votre préparation académique.'
      },
      3: {
        en: 'Upload all required documents in French or with French translations. Ensure documents are clear and legible for proper processing.',
        fr: 'Téléchargez tous les documents requis en français ou avec des traductions françaises. Assurez-vous que les documents sont clairs et lisibles pour un traitement approprié.'
      },
      4: {
        en: 'Select your preferred intake period and provide any additional information that might help with your application review.',
        fr: 'Sélectionnez votre période d\'admission préférée et fournissez toute information supplémentaire qui pourrait aider à l\'examen de votre candidature.'
      },
      5: {
        en: 'Review all your information carefully before submission. Once submitted, your application will be processed by our admission team.',
        fr: 'Examinez attentivement toutes vos informations avant la soumission. Une fois soumise, votre candidature sera traitée par notre équipe d\'admission.'
      },
      6: {
        en: 'Your application has been submitted! Track your progress through the admission process and stay updated on next steps.',
        fr: 'Votre candidature a été soumise ! Suivez votre progression dans le processus d\'admission et restez informé des prochaines étapes.'
      }
    };
    
    return notes[stepId]?.[language] || notes[stepId]?.en || '';
  };

  const renderAdmissionTeamNote = (stepId) => {
    const isCompleted = stepId === 1 ? validateStep1() : 
                       stepId === 2 ? step2Validated : 
                       stepId === 3 ? step3Validated : 
                       stepId === 4 ? step4Validated : 
                       stepId === 5 ? step5Validated : 
                       false;

    return (
      <div className="border-l-4 p-4 rounded-r-lg bg-yellow-50 border-yellow-500">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-yellow-500">
              <span className="text-white text-sm font-bold">E-T</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-yellow-900">
                {language === 'en' ? 'E-TAWJIHI Admission Team' : 'Équipe d\'Admission E-TAWJIHI'}
              </h4>
              {isCompleted && (
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                  ✓ {language === 'en' ? 'Complete' : 'Complet'}
                </span>
              )}
            </div>
            <p className="text-sm text-yellow-800">
              {getStepNote(stepId)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Translation functions for field values
  const translateGender = (gender) => {
    const translations = {
      'male': { en: 'Male', fr: 'Masculin' },
      'female': { en: 'Female', fr: 'Féminin' },
      'other': { en: 'Other', fr: 'Autre' }
    };
    return translations[gender]?.[language] || gender;
  };

  const translateMaritalStatus = (status) => {
    const translations = {
      'single': { en: 'Single', fr: 'Célibataire' },
      'married': { en: 'Married', fr: 'Marié(e)' },
      'divorced': { en: 'Divorced', fr: 'Divorcé(e)' },
      'widowed': { en: 'Widowed', fr: 'Veuf(ve)' }
    };
    return translations[status]?.[language] || status;
  };

  const translateQualificationType = (type) => {
    const translations = {
      'academic': { en: 'Academic', fr: 'Académique' },
      'language': { en: 'Language Test', fr: 'Test de Langue' },
      'standardized': { en: 'Standardized Test', fr: 'Test Standardisé' }
    };
    return translations[type]?.[language] || type;
  };

  const translateRelationship = (relationship) => {
    const translations = {
      'parent': { en: 'Parent', fr: 'Parent' },
      'guardian': { en: 'Guardian', fr: 'Tuteur' },
      'spouse': { en: 'Spouse', fr: 'Conjoint(e)' },
      'sibling': { en: 'Sibling', fr: 'Frère/Sœur' },
      'other': { en: 'Other', fr: 'Autre' }
    };
    return translations[relationship]?.[language] || relationship;
  };

  const translateYesNo = (value) => {
    if (value === true || value === 'yes' || value === 'Yes') {
      return language === 'en' ? 'Yes' : 'Oui';
    }
    if (value === false || value === 'no' || value === 'No') {
      return language === 'en' ? 'No' : 'Non';
    }
    return value;
  };

  const translateField = (fieldKey) => {
    // Try to get translation from allParams if available
    if (allParams?.fields) {
      const field = allParams.fields.find(f => f.code === fieldKey);
      if (field) {
        return language === 'fr' ? field.nameFr : field.nameEn;
      }
    }
    return fieldKey;
  };

  const translateDegree = (degree) => {
    const translations = {
      'bachelor': { en: 'Bachelor', fr: 'Licence' },
      'master': { en: 'Master', fr: 'Master' },
      'phd': { en: 'PhD', fr: 'Doctorat' },
      'diploma': { en: 'Diploma', fr: 'Diplôme' },
      'certificate': { en: 'Certificate', fr: 'Certificat' }
    };
    return translations[degree?.toLowerCase()]?.[language] || degree;
  };

  const translateAcademicQualification = (qualificationKey) => {
    // Try to get translation from allParams if available
    if (allParams?.degrees) {
      const degree = allParams.degrees.find(d => d.code === qualificationKey);
      if (degree) {
        return language === 'fr' ? degree.nameFr : degree.nameEn;
      }
    }
    return qualificationKey;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Admission Team Note */}
            {renderAdmissionTeamNote(1)}
            
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
            
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                {language === 'en' ? 'Personal Information' : 'Informations Personnelles'}
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
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Date of Birth' : 'Date de Naissance'} *
                  </label>
                  <input
                    type="date"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={isReadOnly}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Country of Birth' : 'Pays de Naissance'} *
                  </label>
                  <SingleSelect
                    options={getCountryOptions()}
                    value={formData.personalInfo.countryOfBirth}
                    onChange={(value) => handleInputChange('personalInfo', 'countryOfBirth', value)}
                    placeholder={language === 'en' ? 'Select country of birth...' : 'Sélectionner le pays de naissance...'}
                    searchPlaceholder={language === 'en' ? 'Search countries...' : 'Rechercher des pays...'}
                    className="w-full"
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Nationality' : 'Nationalité'} *
                  </label>
                  <MultiSelect
                    options={getCountryOptions()}
                    value={Array.isArray(formData.personalInfo.nationality) ? formData.personalInfo.nationality : (formData.personalInfo.nationality ? [formData.personalInfo.nationality] : [])}
                    onChange={(value) => handleInputChange('personalInfo', 'nationality', value)}
                    placeholder={language === 'en' ? 'Select nationalities...' : 'Sélectionner les nationalités...'}
                    searchPlaceholder={language === 'en' ? 'Search nationalities...' : 'Rechercher des nationalités...'}
                    className="w-full"
                    disabled={isReadOnly}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Gender' : 'Genre'} *
                  </label>
                  <select
                    value={formData.personalInfo.gender}
                    onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
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
            
            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                ☎️ {language === 'en' ? 'Contact Information' : 'Informations de Contact'}
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
                    disabled={isReadOnly}
                    required
                  />
                </div>
                
                <PhoneInput
                  label={language === 'en' ? 'Phone' : 'Téléphone'}
                  value={formData.personalInfo.phone}
                  onChange={(phoneNumber, countryCode) => {
                    handleInputChange('personalInfo', 'phone', phoneNumber);
                    handleInputChange('personalInfo', 'phoneCountry', countryCode);
                  }}
                  placeholder={language === 'en' ? 'Enter phone number' : 'Entrez le numéro de téléphone'}
                  className="w-full"
                  disabled={isReadOnly}
                />
                
                <PhoneInput
                  label={language === 'en' ? 'WhatsApp' : 'WhatsApp'}
                  value={formData.personalInfo.whatsapp}
                  onChange={(phoneNumber, countryCode) => {
                    handleInputChange('personalInfo', 'whatsapp', phoneNumber);
                    handleInputChange('personalInfo', 'whatsappCountry', countryCode);
                  }}
                  placeholder={language === 'en' ? 'Enter WhatsApp number' : 'Entrez le numéro WhatsApp'}
                  className="w-full"
                  disabled={isReadOnly}
                />
              </div>
            </div>
            
            {/* Address Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                🏠 {language === 'en' ? 'Address Information' : 'Informations d\'Adresse'}
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
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Official Documents */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                🪪 {language === 'en' ? 'Official Documents' : 'Documents Officiels'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'CIN Number' : 'Numéro CIN'} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.cinNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'cinNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={language === 'en' ? 'Enter your CIN number' : 'Saisissez votre numéro CIN'}
                    disabled={isReadOnly}
                    required
                  />
                </div>
                

                {/* Passport Available Checkbox */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.personalInfo.passportAvailable}
                      onChange={(e) => handleInputChange('personalInfo', 'passportAvailable', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isReadOnly}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'en' ? 'I have a passport available' : 'J\'ai un passeport disponible'}
                    </span>
                  </label>
                </div>
                
                {/* Passport Fields - Only show if passport is available */}
                {formData.personalInfo.passportAvailable && (
                  <>
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
                        disabled={isReadOnly}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        {language === 'en' ? 'Issue Date' : 'Date de Délivrance'} *
                      </label>
                      <input
                        type="date"
                        value={formData.personalInfo.passportIssueDate}
                        onChange={(e) => handleInputChange('personalInfo', 'passportIssueDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={isReadOnly}
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
                        disabled={isReadOnly}
                        required
                      />
                    </div>
                  </>
                )}
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
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
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
                  value={formData.personalInfo.emergencyContactPhone}
                  onChange={(phoneNumber, countryCode) => {
                    handleInputChange('personalInfo', 'emergencyContactPhone', phoneNumber);
                    // Note: We could add emergencyContactPhoneCountry if needed
                  }}
                  placeholder={language === 'en' ? 'Enter emergency contact phone' : 'Entrez le téléphone du contact d\'urgence'}
                  className="w-full"
                  disabled={isReadOnly}
                />
                
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
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
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
                      disabled={isReadOnly}
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
                      disabled={isReadOnly}
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
                      disabled={isReadOnly}
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
                      disabled={isReadOnly}
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
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* China-specific fields - Only show if application is for China */}
            {application?.isChina && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-600" />
                  {language === 'en' ? 'China Application Specific Fields' : 'Champs Spécifiques à la Candidature Chine'}
                </h4>
                
                
                {/* Religion */}
                <div className="mb-6">
                  <div className="max-w-md">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Religion' : 'Religion'} *
                    </label>
                    <input
                      type="text"
                      value={formData.chinaFields.religion}
                      onChange={(e) => handleInputChange('chinaFields', 'religion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={language === 'en' ? 'Enter your religion' : 'Saisissez votre religion'}
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                </div>
                
                {/* Family Members */}
                <div className="mb-6">
                  <h5 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    {language === 'en' ? 'Family Members' : 'Membres de la Famille'}
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Father */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="text-sm font-medium text-gray-800 mb-3">
                        {language === 'en' ? 'Father' : 'Père'}
                      </h6>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.chinaFields.familyMembers.father.name}
                          onChange={(e) => handleInputChange('chinaFields', 'familyMembers', {
                            ...formData.chinaFields.familyMembers,
                            father: { ...formData.chinaFields.familyMembers.father, name: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder={language === 'en' ? 'Father\'s name' : 'Nom du père'}
                          disabled={isReadOnly}
                        />
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {language === 'en' ? 'Date of Birth' : 'Date de naissance'}
                          </label>
                          <input
                            type="date"
                            value={formData.chinaFields.familyMembers.father.dateOfBirth}
                            onChange={(e) => handleInputChange('chinaFields', 'familyMembers', {
                              ...formData.chinaFields.familyMembers,
                              father: { ...formData.chinaFields.familyMembers.father, dateOfBirth: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={isReadOnly}
                          />
                        </div>
                        <input
                          type="text"
                          value={formData.chinaFields.familyMembers.father.occupation}
                          onChange={(e) => handleInputChange('chinaFields', 'familyMembers', {
                            ...formData.chinaFields.familyMembers,
                            father: { ...formData.chinaFields.familyMembers.father, occupation: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder={language === 'en' ? 'Father\'s occupation' : 'Profession du père'}
                          disabled={isReadOnly}
                        />
                        <input
                          type="tel"
                          value={formData.chinaFields.familyMembers.father.phone}
                          onChange={(e) => handleInputChange('chinaFields', 'familyMembers', {
                            ...formData.chinaFields.familyMembers,
                            father: { ...formData.chinaFields.familyMembers.father, phone: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder={language === 'en' ? 'Father\'s phone' : 'Téléphone du père'}
                          disabled={isReadOnly}
                        />
                      </div>
                    </div>
                    
                    {/* Mother */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="text-sm font-medium text-gray-800 mb-3">
                        {language === 'en' ? 'Mother' : 'Mère'}
                      </h6>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.chinaFields.familyMembers.mother.name}
                          onChange={(e) => handleInputChange('chinaFields', 'familyMembers', {
                            ...formData.chinaFields.familyMembers,
                            mother: { ...formData.chinaFields.familyMembers.mother, name: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder={language === 'en' ? 'Mother\'s name' : 'Nom de la mère'}
                          disabled={isReadOnly}
                        />
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {language === 'en' ? 'Date of Birth' : 'Date de naissance'}
                          </label>
                          <input
                            type="date"
                            value={formData.chinaFields.familyMembers.mother.dateOfBirth}
                            onChange={(e) => handleInputChange('chinaFields', 'familyMembers', {
                              ...formData.chinaFields.familyMembers,
                              mother: { ...formData.chinaFields.familyMembers.mother, dateOfBirth: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={isReadOnly}
                          />
                        </div>
                        <input
                          type="text"
                          value={formData.chinaFields.familyMembers.mother.occupation}
                          onChange={(e) => handleInputChange('chinaFields', 'familyMembers', {
                            ...formData.chinaFields.familyMembers,
                            mother: { ...formData.chinaFields.familyMembers.mother, occupation: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder={language === 'en' ? 'Mother\'s occupation' : 'Profession de la mère'}
                          disabled={isReadOnly}
                        />
                        <input
                          type="tel"
                          value={formData.chinaFields.familyMembers.mother.phone}
                          onChange={(e) => handleInputChange('chinaFields', 'familyMembers', {
                            ...formData.chinaFields.familyMembers,
                            mother: { ...formData.chinaFields.familyMembers.mother, phone: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder={language === 'en' ? 'Mother\'s phone' : 'Téléphone de la mère'}
                          disabled={isReadOnly}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            )}
            
            {/* Save Personal Information Button */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">
                    {language === 'en' ? 'Save to Profile' : 'Sauvegarder dans le Profil'}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {language === 'en' 
                      ? 'Save your personal information to your profile for future applications'
                      : 'Sauvegardez vos informations personnelles dans votre profil pour les futures candidatures'
                    }
                  </p>
                </div>
                <button
                  onClick={savePersonalInfoToProfile}
                  disabled={isSaving || isReadOnly}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      {language === 'en' ? 'Saving...' : 'Sauvegarde...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {language === 'en' ? 'Save to Profile' : 'Enregistrer dans le Profil'}
                    </>
                  )}
                </button>
              </div>
            </div>
            
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Admission Team Note */}
            {renderAdmissionTeamNote(2)}
            
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

            {/* Informative Note for France Requirements */}
            {application?.isFrance && (
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                      {language === 'en' ? 'Important Information for Studies in France' : 'Information Importante pour les Études en France'}
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>
                        {language === 'en' 
                          ? 'To study in France, you must add your Baccalauréat and all diplomas you hold.'
                          : 'Pour étudier en France, vous devez ajouter le baccalauréat et tous les diplômes que vous disposez.'}
                      </li>
                      <li>
                        {language === 'en' 
                          ? 'TCF is mandatory for studies in French, except in case of exemption.'
                          : 'Le TCF est obligatoire pour les études en français, sauf en cas de dispense.'}
                      </li>
                      <li>
                        {language === 'en' 
                          ? 'TOEFL is mandatory for studies in English, except in case of exemption.'
                          : 'Le TOEFL est obligatoire pour les études en anglais, sauf en cas de dispense.'}
                      </li>
                      <li>
                        {language === 'en' 
                          ? 'Standardized tests are not required for studies in France.'
                          : 'Pour les tests standardisés, pas besoin en France.'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Informative Note for China Requirements */}
            {application?.isChina && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900 mb-2">
                      {language === 'en' ? 'Important Information for Studies in China' : 'Information Importante pour les Études en Chine'}
                    </h4>
                    <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                      <li>
                        {language === 'en' 
                          ? 'To study in China, you must add your Baccalauréat and all diplomas you hold.'
                          : 'Pour étudier en Chine, vous devez ajouter le baccalauréat et tous les diplômes que vous disposez.'}
                      </li>
                      <li>
                        {language === 'en' 
                          ? 'CSCA (China Standardized Competency Assessment) is required for studies in China.'
                          : 'Le CSCA (Évaluation Standardisée des Compétences de Chine) est requis pour les études en Chine.'}
                      </li>
                      <li>
                        {language === 'en' 
                          ? 'English certification (IELTS, TOEFL, etc.) is mandatory for some Chinese universities.'
                          : 'La certification d\'anglais (IELTS, TOEFL, etc.) est obligatoire pour certaines universités chinoises.'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            
            {/* Qualifications */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <QualificationsTabs
                degrees={userQualifications}
                onAddDegree={handleAddQualification}
                onDeleteDegree={handleDeleteQualification}
                onRefreshQualifications={handleRefreshQualifications}
                language={language}
                activeSubsection="academic"
                onSubsectionChange={() => {}}
                applications={application ? [application] : []}
              />
            </div>

            {/* Validation Buttons */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step2Validated ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {step2Validated ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white text-sm font-bold">?</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {language === 'en' ? 'Section Validation' : 'Validation de Section'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {step2Validated 
                        ? (language === 'en' ? 'This section has been validated' : 'Cette section a été validée')
                        : (language === 'en' ? 'Validate this section when all information is complete' : 'Validez cette section quand toutes les informations sont complètes')
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {!step2Validated ? (
                    <button
                      onClick={async() => {
                        // Simplified validation check - only check TCF and Baccalauréat
                        const missingFields = [];
                        
                        const hasTCF = userQualifications.some(q => 
                          q.type === 'language' && q.title?.toLowerCase().includes('tcf')
                        );
                        const hasBaccalaureat = userQualifications.some(q => 
                          q.type === 'academic' && q.title?.toLowerCase().includes('baccalauréat')
                        );
                        
                        if (!hasTCF) missingFields.push('TCF');
                        if (!hasBaccalaureat) missingFields.push('Baccalauréat');
                        
                        if (validateStep2()) {
                          try {
                            await profileService.saveStep2Validation(true);
                            setStep2Validated(true);
                            alert(language === 'en' ? 'Section validated successfully!' : 'Section validée avec succès!');
                          } catch (error) {
                            console.error('Error saving step 2 validation:', error);
                            alert(language === 'en' ? 'Error saving validation' : 'Erreur lors de la sauvegarde');
                          }
                        } else {
                          const message = language === 'en' 
                            ? `Please add the following qualifications: ${missingFields.join(', ')}`
                            : `Veuillez ajouter les qualifications suivantes: ${missingFields.join(', ')}`;
                          alert(message);
                        }
                      }}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {language === 'en' ? 'Validate This Section' : 'Valider Cette Section'}
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        try {
                          await profileService.saveStep2Validation(false);
                          setStep2Validated(false);
                          alert(language === 'en' ? 'Section marked as incomplete' : 'Section marquée comme non complète');
                        } catch (error) {
                          console.error('Error saving step 2 validation:', error);
                          alert(language === 'en' ? 'Error saving validation' : 'Erreur lors de la sauvegarde');
                        }
                      }}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {language === 'en' ? 'Mark as Incomplete' : 'Marquer comme Incomplet'}
                    </button>
                  )}
                </div>
              </div>
            </div>
              
            
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            {renderAdmissionTeamNote(3)}
            
            {/* Use the reusable ApplicationDocumentsSection component */}
            <ApplicationDocumentsSection 
              language={language}
              onUploadDocument={handleFileUpload}
              onDocumentUploaded={(docKey, document) => {
                // Update formData when document is uploaded
                setFormData(prev => ({
                  ...prev,
                  documents: {
                    ...prev.documents,
                    [docKey]: document
                  }
                }));
              }}
              application={application}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            {renderAdmissionTeamNote(4)}
            
            {/* Study Preferences Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  📚 {language === 'en' ? 'Study Preferences' : 'Préférences d\'Études'}
                </h4>
              </div>
              <div className="p-6">
              {/* Debug: Log program and intakes in preferences step */}
              {console.log('Preferences step - Program:', program)}
              {console.log('Preferences step - MultiIntakes:', program?.multiIntakes)}
              {console.log('Preferences step - MultiIntakes length:', program?.multiIntakes?.length)}
              
              {/* Check if program has intakes available */}
              {program && program.multiIntakes && program.multiIntakes.length > 0 ? (
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-4">
                    {language === 'en' ? 'Preferred Intake' : 'Période d\'Admission Préférée'} *
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.multiIntakes.map((intake, index) => {
                      const status = getApplicationPeriodStatus(intake, language);
                      const isSelected = formData.preferences.intake === intake.name;
                      
                      return (
                        <div 
                          key={index} 
                          className={`bg-gray-50 rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-md ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={async () => {
                            console.log('Intake clicked:', intake.name);
                            console.log('Current intake before change:', formData.preferences.intake);
                            
                            // Update the state using handleInputChange (no auto-save for intake)
                            handleInputChange('preferences', 'intake', intake.name);
                            
                            // Save immediately with the updated data
                            if (application) {
                              console.log('Intake changed, saving immediately:', intake.name);
                              try {
                                // Create updated form data for saving
                                const updatedFormData = {
                                  ...formData,
                                  preferences: {
                                    ...formData.preferences,
                                    intake: intake.name
                                  }
                                };
                                await saveApplicationProgress(updatedFormData);
                                console.log('Intake change saved successfully');
                              } catch (error) {
                                console.error('Error saving intake change:', error);
                              }
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {formatIntakeName(intake.name, language)}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}>
                              {status.text}
                            </span>
                          </div>

                          {/* Dates */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-3 h-3 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">
                                  {language === 'fr' ? 'Ouverture' : 'Opens'}
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {intake.applicationOpens 
                                    ? new Date(intake.applicationOpens).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })
                                    : (language === 'fr' ? 'Non spécifié' : 'Not specified')
                                  }
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <Clock className="w-3 h-3 text-red-600" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">
                                  {language === 'fr' ? 'Fermeture' : 'Closes'}
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {intake.applicationCloses 
                                    ? new Date(intake.applicationCloses).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })
                                    : (language === 'fr' ? 'Non spécifié' : 'Not specified')
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="mt-3 flex items-center gap-2 text-blue-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {language === 'en' ? 'Selected' : 'Sélectionné'}
                              </span>
                              {isSaving && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3 animate-spin" />
                                  <span>{language === 'en' ? 'Saving...' : 'Sauvegarde...'}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              
              {/* Always show additional info input */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-700 mb-2 mt-4">
                  {language === 'en' ? 'Additional Information' : 'Informations Supplémentaires'}
                </label>
                <textarea
                  value={formData.preferences.additionalInfo}
                  onChange={(e) => handleInputChange('preferences', 'additionalInfo', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={language === 'en' ? 'Any additional information you would like to share...' : 'Toute information supplémentaire que vous souhaitez partager...'}
                  disabled={isReadOnly}
                />
              </div>
              </div>
            </div>
          </div>
        );

      case 5:
        // Use submittedData if application is submitted, otherwise use formData
        const reviewData = isReadOnly && application?.submittedData 
          ? { ...formData, ...application.submittedData } 
          : formData;
        
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            {renderAdmissionTeamNote(5)}

            {/* China-specific note for document language requirement */}
            {application?.isChina && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900 mb-2">
                      {language === 'en' ? 'Important: Document Language Requirement for China Applications' : 'Important : Exigence de Langue des Documents pour les Candidatures Chine'}
                    </h4>
                    <p className="text-sm text-red-800">
                      {language === 'en' 
                        ? 'For applications to China, all documents must be in English. Please ensure all your academic documents, transcripts, and certificates are translated to English before submission.'
                        : 'Pour les candidatures en Chine, tous les documents doivent être en anglais. Veuillez vous assurer que tous vos documents académiques, relevés de notes et certificats sont traduits en anglais avant la soumission.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Program Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{program?.name}</h3>
                  <p className="text-gray-600">{program?.establishment?.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>📍 {program?.establishment?.country}</span>
                    <span>🎓 {translateDegree(program?.degree)}</span>
                    <span>⏱️ {program?.duration} {program?.durationUnit}</span>
                  </div>
                </div>
                {reviewData.preferences?.intake && (
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{language === 'en' ? 'Preferred Intake' : 'Période Préférée'}</div>
                    <div className="font-semibold text-blue-600">{formatIntakeName(reviewData.preferences.intake, language)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Application Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  {language === 'en' ? 'Application Summary' : 'Résumé de la Candidature'}
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  
                  {/* Personal Information */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        📘 {language === 'en' ? 'Personal Information' : 'Informations Personnelles'}
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'First Name' : 'Prénom'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.firstName || formData.personalInfo.firstName}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Last Name' : 'Nom'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.lastName || formData.personalInfo.lastName}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Date of Birth' : 'Date de Naissance'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.dateOfBirth || formData.personalInfo.dateOfBirth}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Country of Birth' : 'Pays de Naissance'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.countryOfBirth || formData.personalInfo.countryOfBirth}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'City of Birth' : 'Ville de Naissance'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.cityOfBirth || formData.personalInfo.cityOfBirth}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Gender' : 'Genre'}</label>
                          <p className="text-sm font-semibold text-gray-900">{translateGender(reviewData.personalInfo?.gender || formData.personalInfo.gender)}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Marital Status' : 'Statut Matrimonial'}</label>
                          <p className="text-sm font-semibold text-gray-900">{translateMaritalStatus(reviewData.personalInfo?.maritalStatus || formData.personalInfo.maritalStatus)}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Nationality' : 'Nationalité'}</label>
                          <p className="text-sm font-semibold text-gray-900">
                            {Array.isArray(reviewData.personalInfo?.nationality || formData.personalInfo.nationality) 
                              ? (reviewData.personalInfo?.nationality || formData.personalInfo.nationality).join(', ') 
                              : (reviewData.personalInfo?.nationality || formData.personalInfo.nationality)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Country' : 'Pays'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.country || formData.personalInfo.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-green-600" />
                        </div>
                        🎓 {language === 'en' ? 'Academic Qualifications' : 'Qualifications Académiques'}
                      </h4>
                    </div>
                    <div className="p-6">
                      {userQualifications.length > 0 ? (
                        <div className="space-y-4">
                          {userQualifications.map((qualification, index) => {
                            const isComplete = isQualificationComplete(qualification);
                            return (
                              <div key={index} className={`bg-gray-50 rounded-lg p-4 border-l-4 ${isComplete ? 'border-green-500' : 'border-yellow-500'}`}>
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-2">
                                    {isComplete && (
                                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                        ✓ Valide
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Type' : 'Type'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{translateQualificationType(qualification.type)}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Title' : 'Titre'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{qualification.title || 'Non renseigné'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Institution' : 'Établissement'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{qualification.institution || 'Non renseigné'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Field' : 'Domaine'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{translateField(qualification.field) || 'Non renseigné'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Score' : 'Score'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{qualification.score || 'Non renseigné'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Academic Qualification' : 'Qualification Académique'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{translateAcademicQualification(qualification.academicQualification) || 'Non renseigné'}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 italic">
                          {language === 'en' ? 'No qualifications added yet' : 'Aucune qualification ajoutée pour le moment'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-4 h-4 text-purple-600" />
                        </div>
                        ☎️ {language === 'en' ? 'Contact Information' : 'Informations de Contact'}
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Email' : 'Email'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.email || formData.personalInfo.email}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Phone' : 'Téléphone'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.phone || formData.personalInfo.phone}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'WhatsApp' : 'WhatsApp'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.whatsapp || formData.personalInfo.whatsapp}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-orange-600" />
                        </div>
                        🏠 {language === 'en' ? 'Address Information' : 'Informations d\'Adresse'}
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Address' : 'Adresse'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.address || formData.personalInfo.address}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'City' : 'Ville'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.city || formData.personalInfo.city}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Country' : 'Pays'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.country || formData.personalInfo.country}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Postal Code' : 'Code Postal'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.postalCode || formData.personalInfo.postalCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Official Documents */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-indigo-600" />
                        </div>
                        🪪 {language === 'en' ? 'Official Documents' : 'Documents Officiels'}
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'CIN Number' : 'Numéro CIN'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.cinNumber || formData.personalInfo.cinNumber}</p>
                        </div>
                        {(reviewData.personalInfo?.passportAvailable || formData.personalInfo.passportAvailable) && (
                          <>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Passport Number' : 'Numéro de Passeport'}</label>
                              <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.passportNumber || formData.personalInfo.passportNumber}</p>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Issue Date' : 'Date de Délivrance'}</label>
                              <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.passportIssueDate || formData.personalInfo.passportIssueDate}</p>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Passport Expiration' : 'Expiration Passeport'}</label>
                              <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.passportExpirationDate || formData.personalInfo.passportExpirationDate}</p>
                            </div>
                          </>
                        )}
                        
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact Information */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-red-600" />
                        </div>
                        🚨 {language === 'en' ? 'Emergency Contact Information' : 'Informations de Contact d\'Urgence'}
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Name' : 'Nom'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.emergencyContactName || formData.personalInfo.emergencyContactName}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Gender' : 'Genre'}</label>
                          <p className="text-sm font-semibold text-gray-900">{translateGender(reviewData.personalInfo?.emergencyContactGender || formData.personalInfo.emergencyContactGender)}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Relationship' : 'Relation'}</label>
                          <p className="text-sm font-semibold text-gray-900">{translateRelationship(reviewData.personalInfo?.emergencyContactRelationship || formData.personalInfo.emergencyContactRelationship)}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Phone' : 'Téléphone'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.emergencyContactPhone || formData.personalInfo.emergencyContactPhone}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Email' : 'Email'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.emergencyContactEmail || formData.personalInfo.emergencyContactEmail}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Address' : 'Adresse'}</label>
                          <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.emergencyContactAddress || formData.personalInfo.emergencyContactAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Work Experience Information */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-teal-600" />
                        </div>
                        💼 {language === 'en' ? 'Work Experience Information' : 'Informations d\'Expérience Professionnelle'}
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Has Work Experience' : 'A de l\'Expérience Professionnelle'}</label>
                            <p className="text-sm font-semibold text-gray-900">
                              {translateYesNo(reviewData.personalInfo?.hasWorkExperience || formData.personalInfo.hasWorkExperience)}
                            </p>
                          </div>
                        </div>
                        {(reviewData.personalInfo?.hasWorkExperience || formData.personalInfo.hasWorkExperience) && (
                          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-teal-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Company' : 'Entreprise'}</label>
                                <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.workCompany || formData.personalInfo.workCompany}</p>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Position' : 'Poste'}</label>
                                <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.workPosition || formData.personalInfo.workPosition}</p>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Start Date' : 'Date de Début'}</label>
                                <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.workStartDate || formData.personalInfo.workStartDate}</p>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'End Date' : 'Date de Fin'}</label>
                                <p className="text-sm font-semibold text-gray-900">{reviewData.personalInfo?.workEndDate || formData.personalInfo.workEndDate || (language === 'en' ? 'Present' : 'Présent')}</p>
                              </div>
                            </div>
                            {(reviewData.personalInfo?.workDescription || formData.personalInfo.workDescription) && (
                              <div className="mt-4">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">{language === 'en' ? 'Description' : 'Description'}</label>
                                <div className="bg-white p-3 rounded border text-sm text-gray-700">{reviewData.personalInfo?.workDescription || formData.personalInfo.workDescription}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>


                  {/* China-specific fields - Only show if application is for China */}
                  {application?.isChina && (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <Flag className="w-4 h-4 text-red-600" />
                          </div>
                          🇨🇳 {language === 'en' ? 'China Application Specific Fields' : 'Champs Spécifiques à la Candidature Chine'}
                        </h4>
                      </div>
                      <div className="p-6">
                        <div className="space-y-6">
                          {/* Religion */}
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Religion' : 'Religion'}</label>
                            <p className="text-sm font-semibold text-gray-900">{formData.chinaFields?.religion || ''}</p>
                          </div>

                          {/* Family Members */}
                          <div className="space-y-4">
                            <h5 className="text-md font-semibold text-gray-900 flex items-center gap-2">
                              <Users className="w-4 h-4 text-green-600" />
                              {language === 'en' ? 'Family Members' : 'Membres de la Famille'}
                            </h5>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Father */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h6 className="text-sm font-medium text-gray-800 mb-3">
                                  {language === 'en' ? 'Father' : 'Père'}
                                </h6>
                                <div className="space-y-2">
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Name' : 'Nom'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{formData.chinaFields?.familyMembers?.father?.name || ''}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Date of Birth' : 'Date de Naissance'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{formData.chinaFields?.familyMembers?.father?.dateOfBirth || ''}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Occupation' : 'Profession'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{formData.chinaFields?.familyMembers?.father?.occupation || ''}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Phone' : 'Téléphone'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{formData.chinaFields?.familyMembers?.father?.phone || ''}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Mother */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h6 className="text-sm font-medium text-gray-800 mb-3">
                                  {language === 'en' ? 'Mother' : 'Mère'}
                                </h6>
                                <div className="space-y-2">
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Name' : 'Nom'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{formData.chinaFields?.familyMembers?.mother?.name || ''}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Date of Birth' : 'Date de Naissance'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{formData.chinaFields?.familyMembers?.mother?.dateOfBirth || ''}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Occupation' : 'Profession'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{formData.chinaFields?.familyMembers?.mother?.occupation || ''}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{language === 'en' ? 'Phone' : 'Téléphone'}</label>
                                    <p className="text-sm font-semibold text-gray-900">{formData.chinaFields?.familyMembers?.mother?.phone || ''}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Documents Status */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        📄 Statut des Documents
                      </h4>
                    </div>
                    <div className="p-6">
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            Complétion des Documents
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            {(() => {
                              const baseDocs = 16; // Base number of document types (removed frenchTest from academic)
                              const chinaDocs = application?.isChina ? 2 : 0; // China-specific documents
                              const franceDocs = application?.isFrance ? 1 : 0; // France-specific documents
                              const totalDocs = baseDocs + chinaDocs + franceDocs;
                              const uploadedDocs = Object.keys(documentsMap).length;
                              const percentage = Math.round((uploadedDocs / totalDocs) * 100);
                              return `${percentage}%`;
                            })()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(() => {
                              const baseDocs = 16; // Base number of document types (removed frenchTest from academic)
                              const chinaDocs = application?.isChina ? 2 : 0; // China-specific documents
                              const franceDocs = application?.isFrance ? 1 : 0; // France-specific documents
                              const totalDocs = baseDocs + chinaDocs + franceDocs;
                              const uploadedDocs = Object.keys(documentsMap).length;
                              return Math.round((uploadedDocs / totalDocs) * 100);
                              })()}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Required Documents Progress */}
                      <div className="mb-6">
                        {(() => {
                          // Base required documents (always required)
                          const baseRequiredDocs = ['passport', 'nationalId', 'cv', 'guardian1NationalId', 'generalTranscript', 'baccalaureate', 'motivationLetter', 'recommendationLetter1'];
                          
                          // Add country-specific required documents
                          const chinaRequiredDocs = application?.isChina ? ['medicalHealthCheck', 'anthropometricRecord'] : [];
                          const franceRequiredDocs = application?.isFrance ? ['frenchTest'] : [];
                          
                          // Combine all required documents
                          const requiredDocs = [...baseRequiredDocs, ...chinaRequiredDocs, ...franceRequiredDocs];
                          
                          // Calculate uploaded required documents
                          const uploadedRequiredDocs = requiredDocs.filter(docKey => documentsMap[docKey]);
                          const percentage = Math.round((uploadedRequiredDocs.length / requiredDocs.length) * 100);
                          const isComplete = uploadedRequiredDocs.length === requiredDocs.length;
                          
                          return (
                            <>
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-700">
                                  Documents Requis (Minimum)
                                </span>
                                <span className={`text-lg font-bold ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
                                  {percentage}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    isComplete ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </>
                          );
                        })()}
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {(() => {
                              // Use the same logic as above
                              const baseRequiredDocs = ['passport', 'nationalId', 'cv', 'guardian1NationalId', 'generalTranscript', 'baccalaureate', 'motivationLetter', 'recommendationLetter1'];
                              const chinaRequiredDocs = application?.isChina ? ['medicalHealthCheck', 'anthropometricRecord'] : [];
                              const franceRequiredDocs = application?.isFrance ? ['frenchTest'] : [];
                              const requiredDocs = [...baseRequiredDocs, ...chinaRequiredDocs, ...franceRequiredDocs];
                              const uploadedRequiredDocs = requiredDocs.filter(docKey => documentsMap[docKey]);
                              return `${uploadedRequiredDocs.length}/${requiredDocs.length} documents requis`;
                            })()}
                          </span>
                          {(() => {
                            // Use the same logic as above
                            const baseRequiredDocs = ['passport', 'nationalId', 'cv', 'guardian1NationalId', 'generalTranscript', 'baccalaureate', 'motivationLetter', 'recommendationLetter1'];
                            const chinaRequiredDocs = application?.isChina ? ['medicalHealthCheck', 'anthropometricRecord'] : [];
                            const franceRequiredDocs = application?.isFrance ? ['frenchTest'] : [];
                            const requiredDocs = [...baseRequiredDocs, ...chinaRequiredDocs, ...franceRequiredDocs];
                            const uploadedRequiredDocs = requiredDocs.filter(docKey => documentsMap[docKey]);
                            const isComplete = uploadedRequiredDocs.length === requiredDocs.length;
                            return isComplete ? (
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                                ✓ Minimum Complet
                              </span>
                            ) : (
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full font-medium">
                                En cours
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Documents List - Exact same fields as ApplicationDocumentsSection */}
                    <div className="space-y-6">
                      
                      {/* Personal Documents Section */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          📘 Documents Personnels
                        </h5>
                        <div className="space-y-2">
                          {[
                            { key: 'passport', label: 'Passeport', required: true },
                            { key: 'nationalId', label: 'Carte Nationale', required: true },
                            { key: 'cv', label: 'Curriculum Vitae (CV)', required: true },
                            { key: 'guardian1NationalId', label: 'Carte Nationale Tuteur 1', required: true },
                            { key: 'guardian2NationalId', label: 'Carte Nationale Tuteur 2', required: false }
                          ].map((doc) => {
                            const uploadedDoc = documentsMap[doc.key];
                            const isUploaded = !!uploadedDoc;
                            
                            // Fonction pour obtenir l'état de validation
                            const getValidationStatus = (doc) => {
                              if (!doc) return { status: 'missing', text: 'Manquant', color: 'gray', icon: null };
                              
                              switch (doc.validationStatus) {
                                case 'approved':
                                  return { status: 'approved', text: 'Validé', color: 'green', icon: CheckCircle };
                                case 'under_review':
                                  return { status: 'under_review', text: 'En cours de révision', color: 'yellow', icon: Clock };
                                case 'rejected':
                                  return { status: 'rejected', text: 'Refusé', color: 'red', icon: XCircle };
                                default:
                                  return { status: 'uploaded', text: 'Téléchargé', color: 'blue', icon: Upload };
                              }
                            };
                            
                            const validationInfo = getValidationStatus(uploadedDoc);
                            const StatusIcon = validationInfo.icon;
                            
                            return (
                              <div key={doc.key} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    validationInfo.status === 'approved' ? 'bg-green-500' :
                                    validationInfo.status === 'under_review' ? 'bg-yellow-500' :
                                    validationInfo.status === 'rejected' ? 'bg-red-500' :
                                    validationInfo.status === 'uploaded' ? 'bg-blue-500' :
                                    'bg-gray-300'
                                  }`}></div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {doc.label}
                                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isUploaded ? (
                                    <>
                                      {StatusIcon && <StatusIcon className={`w-4 h-4 ${
                                        validationInfo.color === 'green' ? 'text-green-600' :
                                        validationInfo.color === 'yellow' ? 'text-yellow-600' :
                                        validationInfo.color === 'red' ? 'text-red-600' :
                                        'text-blue-600'
                                      }`} />}
                                      <span className={`text-sm font-semibold ${
                                        validationInfo.color === 'green' ? 'text-green-600' :
                                        validationInfo.color === 'yellow' ? 'text-yellow-600' :
                                        validationInfo.color === 'red' ? 'text-red-600' :
                                        'text-blue-600'
                                      }`}>
                                        {validationInfo.text}
                                      </span>
                                      {/* Language validation based on application country */}
                                      {application?.isChina ? (
                                        <>
                                          {needsEnglishValidation(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                              Anglais Requis
                                            </span>
                                          )}
                                          {isRequiredDocumentInEnglish(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                              ✓ En Anglais
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {needsFrenchValidation(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                              Français Requis
                                            </span>
                                          )}
                                          {isRequiredDocumentInFrench(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                              ✓ En Français
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                                      <span className="text-sm text-gray-500">
                                        Manquant
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Academic Documents Section */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          🎓 Documents Académiques
                        </h5>
                        <div className="space-y-2">
                          {[
                            { key: 'generalTranscript', label: language === 'en' ? 'General Transcript' : 'Relevé de note général', required: true },
                            { key: 'englishTest', label: 'Certificat de Test d\'Anglais', required: false },
                            { key: 'portfolio', label: 'Portfolio', required: false },
                            { key: 'baccalaureate', label: 'Diplôme du Baccalauréat', required: true },
                            { key: 'bac2', label: 'Diplôme BAC+2', required: false },
                            { key: 'bac3', label: 'Diplôme BAC+3', required: false },
                            { key: 'bac5', label: 'Diplôme BAC+5', required: false },
                            { key: 'enrollmentCertificate', label: 'Attestation de Scolarité', required: false }
                          ].map((doc) => {
                            const uploadedDoc = documentsMap[doc.key];
                            const isUploaded = !!uploadedDoc;
                            
                            // Fonction pour obtenir l'état de validation
                            const getValidationStatus = (doc) => {
                              if (!doc) return { status: 'missing', text: 'Manquant', color: 'gray', icon: null };
                              
                              switch (doc.validationStatus) {
                                case 'approved':
                                  return { status: 'approved', text: 'Validé', color: 'green', icon: CheckCircle };
                                case 'under_review':
                                  return { status: 'under_review', text: 'En cours de révision', color: 'yellow', icon: Clock };
                                case 'rejected':
                                  return { status: 'rejected', text: 'Refusé', color: 'red', icon: XCircle };
                                default:
                                  return { status: 'uploaded', text: 'Téléchargé', color: 'blue', icon: Upload };
                              }
                            };
                            
                            const validationInfo = getValidationStatus(uploadedDoc);
                            const StatusIcon = validationInfo.icon;
                            
                            return (
                              <div key={doc.key} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    validationInfo.status === 'approved' ? 'bg-green-500' :
                                    validationInfo.status === 'under_review' ? 'bg-yellow-500' :
                                    validationInfo.status === 'rejected' ? 'bg-red-500' :
                                    validationInfo.status === 'uploaded' ? 'bg-blue-500' :
                                    'bg-gray-300'
                                  }`}></div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {doc.label}
                                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isUploaded ? (
                                    <>
                                      {StatusIcon && <StatusIcon className={`w-4 h-4 ${
                                        validationInfo.color === 'green' ? 'text-green-600' :
                                        validationInfo.color === 'yellow' ? 'text-yellow-600' :
                                        validationInfo.color === 'red' ? 'text-red-600' :
                                        'text-blue-600'
                                      }`} />}
                                      <span className={`text-sm font-semibold ${
                                        validationInfo.color === 'green' ? 'text-green-600' :
                                        validationInfo.color === 'yellow' ? 'text-yellow-600' :
                                        validationInfo.color === 'red' ? 'text-red-600' :
                                        'text-blue-600'
                                      }`}>
                                        {validationInfo.text}
                                      </span>
                                      {/* Language validation based on application country */}
                                      {application?.isChina ? (
                                        <>
                                          {needsEnglishValidation(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                              Anglais Requis
                                            </span>
                                          )}
                                          {isRequiredDocumentInEnglish(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                              ✓ En Anglais
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {needsFrenchValidation(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                              Français Requis
                                            </span>
                                          )}
                                          {isRequiredDocumentInFrench(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                              ✓ En Français
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                                      <span className="text-sm text-gray-500">
                                        Manquant
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Application Documents Section */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-600" />
                          📝 Documents de Candidature
                        </h5>
                        <div className="space-y-2">
                          {[
                            { key: 'recommendationLetter1', label: 'Lettre de Recommandation 1', required: true },
                            { key: 'recommendationLetter2', label: 'Lettre de Recommandation 2', required: false },
                            { key: 'motivationLetter', label: 'Lettre de Motivation', required: true }
                          ].map((doc) => {
                            const uploadedDoc = documentsMap[doc.key];
                            const isUploaded = !!uploadedDoc;
                            
                            // Fonction pour obtenir l'état de validation
                            const getValidationStatus = (doc) => {
                              if (!doc) return { status: 'missing', text: 'Manquant', color: 'gray', icon: null };
                              
                              switch (doc.validationStatus) {
                                case 'approved':
                                  return { status: 'approved', text: 'Validé', color: 'green', icon: CheckCircle };
                                case 'under_review':
                                  return { status: 'under_review', text: 'En cours de révision', color: 'yellow', icon: Clock };
                                case 'rejected':
                                  return { status: 'rejected', text: 'Refusé', color: 'red', icon: XCircle };
                                default:
                                  return { status: 'uploaded', text: 'Téléchargé', color: 'blue', icon: Upload };
                              }
                            };
                            
                            const validationInfo = getValidationStatus(uploadedDoc);
                            const StatusIcon = validationInfo.icon;
                            
                            return (
                              <div key={doc.key} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    validationInfo.status === 'approved' ? 'bg-green-500' :
                                    validationInfo.status === 'under_review' ? 'bg-yellow-500' :
                                    validationInfo.status === 'rejected' ? 'bg-red-500' :
                                    validationInfo.status === 'uploaded' ? 'bg-blue-500' :
                                    'bg-gray-300'
                                  }`}></div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {doc.label}
                                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isUploaded ? (
                                    <>
                                      {StatusIcon && <StatusIcon className={`w-4 h-4 ${
                                        validationInfo.color === 'green' ? 'text-green-600' :
                                        validationInfo.color === 'yellow' ? 'text-yellow-600' :
                                        validationInfo.color === 'red' ? 'text-red-600' :
                                        'text-blue-600'
                                      }`} />}
                                      <span className={`text-sm font-semibold ${
                                        validationInfo.color === 'green' ? 'text-green-600' :
                                        validationInfo.color === 'yellow' ? 'text-yellow-600' :
                                        validationInfo.color === 'red' ? 'text-red-600' :
                                        'text-blue-600'
                                      }`}>
                                        {validationInfo.text}
                                      </span>
                                      {/* Language validation based on application country */}
                                      {application?.isChina ? (
                                        <>
                                          {needsEnglishValidation(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                              Anglais Requis
                                            </span>
                                          )}
                                          {isRequiredDocumentInEnglish(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                              ✓ En Anglais
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {needsFrenchValidation(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                              Français Requis
                                            </span>
                                          )}
                                          {isRequiredDocumentInFrench(doc.key, uploadedDoc, doc.required) && (
                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                              ✓ En Français
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                                      <span className="text-sm text-gray-500">
                                        Manquant
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* China-Specific Documents Section - Only show if application is for China */}
                      {application?.isChina && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-red-600" />
                            🇨🇳 Documents Spécifiques à la Chine
                          </h5>
                          <div className="space-y-2">
                            {[
                              { key: 'medicalHealthCheck', label: 'Certificat Médical de Santé', required: true },
                              { key: 'anthropometricRecord', label: 'Fiche Anthropométrique (Bonne Conduite)', required: true }
                            ].map((doc) => {
                              const uploadedDoc = documentsMap[doc.key];
                              const isUploaded = !!uploadedDoc;
                              
                              // Fonction pour obtenir l'état de validation
                              const getValidationStatus = (doc) => {
                                if (!doc) return { status: 'missing', text: 'Manquant', color: 'gray', icon: null };
                                
                                switch (doc.validationStatus) {
                                  case 'approved':
                                    return { status: 'approved', text: 'Validé', color: 'green', icon: CheckCircle };
                                  case 'under_review':
                                    return { status: 'under_review', text: 'En cours de révision', color: 'yellow', icon: Clock };
                                  case 'rejected':
                                    return { status: 'rejected', text: 'Refusé', color: 'red', icon: XCircle };
                                  default:
                                    return { status: 'uploaded', text: 'Téléchargé', color: 'blue', icon: Upload };
                                }
                              };
                              
                              const validationInfo = getValidationStatus(uploadedDoc);
                              const StatusIcon = validationInfo.icon;
                              
                              return (
                                <div key={doc.key} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                      validationInfo.status === 'approved' ? 'bg-green-500' :
                                      validationInfo.status === 'under_review' ? 'bg-yellow-500' :
                                      validationInfo.status === 'rejected' ? 'bg-red-500' :
                                      validationInfo.status === 'uploaded' ? 'bg-blue-500' :
                                      'bg-gray-300'
                                    }`}></div>
                                    <span className="text-sm font-medium text-gray-700">
                                      {doc.label}
                                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isUploaded ? (
                                      <>
                                        {StatusIcon && <StatusIcon className={`w-4 h-4 ${
                                          validationInfo.color === 'green' ? 'text-green-600' :
                                          validationInfo.color === 'yellow' ? 'text-yellow-600' :
                                          validationInfo.color === 'red' ? 'text-red-600' :
                                          'text-blue-600'
                                        }`} />}
                                        <span className={`text-sm font-semibold ${
                                          validationInfo.color === 'green' ? 'text-green-600' :
                                          validationInfo.color === 'yellow' ? 'text-yellow-600' :
                                          validationInfo.color === 'red' ? 'text-red-600' :
                                          'text-blue-600'
                                        }`}>
                                          {validationInfo.text}
                                        </span>
                                        {/* Language validation for China - English required */}
                                        {needsEnglishValidation(doc.key, uploadedDoc, doc.required) && (
                                          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                            Anglais Requis
                                          </span>
                                        )}
                                        {isRequiredDocumentInEnglish(doc.key, uploadedDoc, doc.required) && (
                                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                            ✓ En Anglais
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                                        <span className="text-sm text-gray-500">
                                          Manquant
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* France-Specific Documents Section - Only show if application is for France */}
                      {application?.isFrance && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            🇫🇷 Documents Spécifiques à la France
                          </h5>
                          <div className="space-y-2">
                            {[
                              { key: 'frenchTest', label: 'Certificat de Test de Français', required: true }
                            ].map((doc) => {
                              const uploadedDoc = documentsMap[doc.key];
                              const isUploaded = !!uploadedDoc;
                              
                              // Fonction pour obtenir l'état de validation
                              const getValidationStatus = (doc) => {
                                if (!doc) return { status: 'missing', text: 'Manquant', color: 'gray', icon: null };
                                
                                switch (doc.validationStatus) {
                                  case 'approved':
                                    return { status: 'approved', text: 'Validé', color: 'green', icon: CheckCircle };
                                  case 'under_review':
                                    return { status: 'under_review', text: 'En cours de révision', color: 'yellow', icon: Clock };
                                  case 'rejected':
                                    return { status: 'rejected', text: 'Refusé', color: 'red', icon: XCircle };
                                  default:
                                    return { status: 'uploaded', text: 'Téléchargé', color: 'blue', icon: Upload };
                                }
                              };
                              
                              const validationInfo = getValidationStatus(uploadedDoc);
                              const StatusIcon = validationInfo.icon;
                              
                              return (
                                <div key={doc.key} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                      validationInfo.status === 'approved' ? 'bg-green-500' :
                                      validationInfo.status === 'under_review' ? 'bg-yellow-500' :
                                      validationInfo.status === 'rejected' ? 'bg-red-500' :
                                      validationInfo.status === 'uploaded' ? 'bg-blue-500' :
                                      'bg-gray-300'
                                    }`}></div>
                                    <span className="text-sm font-medium text-gray-700">
                                      {doc.label}
                                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isUploaded ? (
                                      <>
                                        {StatusIcon && <StatusIcon className={`w-4 h-4 ${
                                          validationInfo.color === 'green' ? 'text-green-600' :
                                          validationInfo.color === 'yellow' ? 'text-yellow-600' :
                                          validationInfo.color === 'red' ? 'text-red-600' :
                                          'text-blue-600'
                                        }`} />}
                                        <span className={`text-sm font-semibold ${
                                          validationInfo.color === 'green' ? 'text-green-600' :
                                          validationInfo.color === 'yellow' ? 'text-yellow-600' :
                                          validationInfo.color === 'red' ? 'text-red-600' :
                                          'text-blue-600'
                                        }`}>
                                          {validationInfo.text}
                                        </span>
                                        {/* Language validation for France - French required */}
                                        {needsFrenchValidation(doc.key, uploadedDoc, doc.required) && (
                                          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                            Français Requis
                                          </span>
                                        )}
                                        {isRequiredDocumentInFrench(doc.key, uploadedDoc, doc.required) && (
                                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                            ✓ En Français
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                                        <span className="text-sm text-gray-500">
                                          Manquant
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* E-TAWJIHI Validation Status */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">E-T</span>
                          </div>
                          <span className="text-sm font-semibold text-blue-900">
                            Statut de Validation E-TAWJIHI
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-blue-700 font-medium">
                            Complétion de la Section
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {(() => {
                              const baseDocs = 16; // Base number of document types (removed frenchTest from academic)
                              const chinaDocs = application?.isChina ? 2 : 0; // China-specific documents
                              const franceDocs = application?.isFrance ? 1 : 0; // France-specific documents
                              const totalDocs = baseDocs + chinaDocs + franceDocs;
                              const uploadedDocs = Object.keys(documentsMap).length;
                              const percentage = Math.round((uploadedDocs / totalDocs) * 100);
                              return `${percentage}%`;
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-blue-800">
                        {(() => {
                          const baseDocs = 16; // Base number of document types (removed frenchTest from academic)
                          const chinaDocs = application?.isChina ? 2 : 0; // China-specific documents
                          const franceDocs = application?.isFrance ? 1 : 0; // France-specific documents
                          const totalDocs = baseDocs + chinaDocs + franceDocs;
                          const uploadedDocs = Object.keys(documentsMap).length;
                          const percentage = Math.round((uploadedDocs / totalDocs) * 100);
                          
                          if (uploadedDocs === 0) {
                            return '⚠️ Aucun document trouvé dans le profil utilisateur. Veuillez d\'abord télécharger des documents.';
                          } else if (percentage === 100) {
                            return '✅ Tous les documents téléchargés. Section finalisée à 100%. Les documents seront validés par l\'équipe E-TAWJIHI.';
                          } else {
                            return `⚠️ ${totalDocs - uploadedDocs} document(s) manquant(s). Téléchargez tous les documents pour finaliser cette section.`;
                          }
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Study Preferences */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        📚 {language === 'en' ? 'Study Preferences' : 'Préférences d\'Études'}
                      </h4>
                    </div>
                    <div className="p-6">
                      {formData.preferences.intake || formData.preferences.additionalInfo ? (
                        <div className="space-y-4">
                          {formData.preferences.intake && (
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">{language === 'en' ? 'Preferred Intake' : 'Période Préférée'}</p>
                                  <p className="text-lg font-semibold text-gray-900">{formatIntakeName(formData.preferences.intake, language)}</p>
                                </div>
                              </div>
                              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {language === 'en' ? 'Selected' : 'Sélectionné'}
                              </div>
                            </div>
                          )}
                          
                          {formData.preferences.additionalInfo && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-600 mb-2">{language === 'en' ? 'Additional Information' : 'Informations Supplémentaires'}</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">{formData.preferences.additionalInfo}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 italic">
                            {language === 'en' ? 'No preferences specified yet' : 'Aucune préférence spécifiée pour le moment'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              {application?.status === 'submitted' || application?.submittedAt ? (
                // Show modification request button if application is submitted
                <>
                  {modificationRequest?.status === 'pending' ? (
                    <div className="text-center">
                      <div className="px-8 py-4 bg-yellow-100 border border-yellow-400 rounded-2xl text-yellow-800 font-medium">
                        <div className="flex items-center gap-2 justify-center">
                          <Clock className="w-5 h-5" />
                          <span>{language === 'en' ? 'Modification Request Pending' : 'Demande de Modification en Attente'}</span>
                        </div>
                      </div>
                      {modificationRequest.reason && (
                        <p className="mt-2 text-sm text-gray-600">
                          {language === 'en' ? 'Reason:' : 'Raison :'} {modificationRequest.reason}
                        </p>
                      )}
                    </div>
                  ) : modificationRequest?.status === 'approved' && modificationAllowed ? (
                    <div className="text-center">
                      <div className="px-8 py-4 bg-green-100 border border-green-400 rounded-2xl text-green-800 font-medium mb-4">
                        <div className="flex items-center gap-2 justify-center">
                          <CheckCircle className="w-5 h-5" />
                          <span>{language === 'en' ? 'Modification Allowed' : 'Modification Autorisée'}</span>
                        </div>
                      </div>
                      {modificationRequest.modificationAllowedUntil && (
                        <p className="text-sm text-gray-600 mb-4">
                          {language === 'en' ? 'Valid until:' : 'Valide jusqu\'au :'} {new Date(modificationRequest.modificationAllowedUntil).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                        </p>
                      )}
                    </div>
                  ) : modificationRequest?.status === 'rejected' ? (
                    <div className="text-center">
                      <div className="px-8 py-4 bg-red-100 border border-red-400 rounded-2xl text-red-800 font-medium mb-4">
                        <div className="flex items-center gap-2 justify-center">
                          <AlertCircle className="w-5 h-5" />
                          <span>{language === 'en' ? 'Modification Request Rejected' : 'Demande de Modification Refusée'}</span>
                        </div>
                      </div>
                      {modificationRequest.adminResponse && (
                        <p className="text-sm text-gray-600 mb-4">
                          {language === 'en' ? 'Admin response:' : 'Réponse de l\'administrateur :'} {modificationRequest.adminResponse}
                        </p>
                      )}
                      <button
                        onClick={() => setShowModificationModal(true)}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        {language === 'en' ? 'Request Modification Again' : 'Demander une Modification à Nouveau'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowModificationModal(true)}
                      className="group relative px-12 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </div>
                        <span>{language === 'en' ? 'Request Modification' : 'Demander la Modification'}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </button>
                  )}
                </>
              ) : (
                // Show submit button if application is not submitted
                <button
                  onClick={handleSubmit}
                  className="group relative px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span>{language === 'en' ? 'Submit Application' : 'Soumettre la Candidature'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
              )}
            </div>

            {/* Modification Request Modal */}
            {showModificationModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {language === 'en' ? 'Request Modification' : 'Demander la Modification'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'en' 
                      ? 'Please provide a reason for requesting modification of your submitted application. Your request will be reviewed by the admin team.'
                      : 'Veuillez fournir une raison pour demander la modification de votre candidature soumise. Votre demande sera examinée par l\'équipe d\'administration.'}
                  </p>
                  <textarea
                    value={modificationReason}
                    onChange={(e) => setModificationReason(e.target.value)}
                    placeholder={language === 'en' ? 'Enter your reason...' : 'Entrez votre raison...'}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  />
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowModificationModal(false);
                        setModificationReason('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {language === 'en' ? 'Cancel' : 'Annuler'}
                    </button>
                    <button
                      onClick={handleRequestModification}
                      disabled={!modificationReason.trim()}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {language === 'en' ? 'Submit Request' : 'Soumettre la Demande'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* Admission Team Note */}
            {renderAdmissionTeamNote(6)}

            {/* Message if application is not submitted */}
            {!(application?.status === 'submitted' || application?.submittedAt) && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                      {language === 'en' ? 'Submission Required' : 'Soumission Requise'}
                    </h3>
                    <p className="text-sm text-yellow-800">
                      {language === 'en' 
                        ? 'You must submit your application to access this step. Please complete all previous steps and submit your application to proceed.'
                        : 'Vous devez soumettre votre candidature pour accéder à cette étape. Veuillez compléter toutes les étapes précédentes et soumettre votre candidature pour continuer.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500"></div>
                
                <div className="space-y-8">
                  {finalSteps.map((step, index) => {
                    const getStatusColor = (status) => {
                      // If application is not submitted, all steps should be gray (not started)
                      if (!(application?.status === 'submitted' || application?.submittedAt)) {
                        return 'bg-gray-300';
                      }
                      switch (status) {
                        case 'completed': return 'bg-green-500';
                        case 'in_progress': return 'bg-blue-500';
                        case 'rejected': return 'bg-red-500';
                        default: return 'bg-gray-300';
                      }
                    };

                    const getStatusIcon = (status) => {
                      // If application is not submitted, all steps should show Award icon
                      if (!(application?.status === 'submitted' || application?.submittedAt)) {
                        return <Award className="w-4 h-4 text-white" />;
                      }
                      switch (status) {
                        case 'completed': return <CheckCircle className="w-4 h-4 text-white" />;
                        case 'in_progress': return <Clock className="w-4 h-4 text-white" />;
                        case 'rejected': return <AlertCircle className="w-4 h-4 text-white" />;
                        default: return <Award className="w-4 h-4 text-white" />;
                      }
                    };

                    const getNoteColor = (status) => {
                      switch (status) {
                        case 'completed': return 'bg-green-50 border-green-200 text-green-800';
                        case 'in_progress': return 'bg-blue-50 border-blue-200 text-blue-800';
                        case 'rejected': return 'bg-red-50 border-red-200 text-red-800';
                        default: return 'bg-gray-50 border-gray-200 text-gray-800';
                      }
                    };

                    return (
                      <div key={step.id} className="relative flex items-start gap-4">
                        <div className={`relative z-10 w-8 h-8 ${getStatusColor(step.status)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="flex-1 pt-1">
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {step.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {step.description}
                          </p>
                          
                          {/* Dynamic Note - Only show if application is submitted */}
                          {step.notes && (application?.status === 'submitted' || application?.submittedAt) && (
                            <div className={`${getNoteColor(step.status)} border rounded-lg p-3 mb-3`}>
                              <p className="text-xs font-medium mb-1">
                                {language === 'en' ? 'Note:' : 'Note :'}
                              </p>
                              <p className="text-xs">
                                {step.notes}
                              </p>
                            </div>
                          )}

                          {/* Dynamic Documents - Only show if application is submitted */}
                          {step.documents && step.documents.length > 0 && (application?.status === 'submitted' || application?.submittedAt) && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <p className="text-xs text-gray-700 font-medium mb-2">
                                {language === 'en' ? 'Documents to download:' : 'Documents à télécharger :'}
                              </p>
                              <div className="space-y-1">
                                {step.documents.map((doc) => (
                                  <button
                                    key={doc.id}
                                    onClick={() => handleDownloadDocument(doc.id, doc.title)}
                                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <Download className="w-3 h-3" />
                                    {doc.title}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                    </div>
                  </div>


                  {/* E-TAWJIHI Notes */}
            {(application?.etawjihiNotes || formData?.etawjihiNotes) && (
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {language === 'en' ? 'E-TAWJIHI Notes' : 'Notes E-TAWJIHI'}
                    </h3>
                    <div className="bg-white border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {application?.etawjihiNotes || formData?.etawjihiNotes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Need Help?' : 'Besoin d\'Aide ?'}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'en' 
                    ? 'E-TAWJIHI team is here to support you'
                    : 'L\'équipe E-TAWJIHI est là pour vous soutenir'
                  }
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">support@etawjihi.com</span>
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
              {/* Save Status Indicator */}
              <div className="flex items-center gap-2 text-sm">
                {isSaving ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>{language === 'en' ? 'Saving...' : 'Sauvegarde...'}</span>
                  </div>
                ) : lastSaved ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>{language === 'en' ? 'Saved' : 'Sauvegardé'}</span>
                    <span className="text-gray-500 text-xs">
                      {lastSaved.toLocaleTimeString()}
                    </span>
                  </div>
                ) : null}
              </div>
              
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
                    style={{ width: `${calculateRealProgress()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {calculateRealProgress()}% {language === 'en' ? 'Complete' : 'Terminé'}
                </p>
              </div>
              
              <div className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = step.id === 1 ? validateStep1() : step.id === 2 ? step2Validated : step.id === 3 ? step3Validated : step.id === 4 ? step4Validated : step.id === 5 ? step5Validated : false;
                  
                  // For step 6 (Final Steps), it should be yellow if step 5 is validated (submitted)
                  const isFinalStepActive = step.id === 6 && step5Validated;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 p-2.5 rounded-lg transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'bg-blue-500 text-white shadow-lg' 
                          : isCompleted 
                            ? 'bg-green-50 border border-green-200 text-green-900 hover:bg-green-100' 
                            : isFinalStepActive || (step.id === 1 && !validateStep1()) || (step.id === 2 && !step2Validated) || (step.id === 3 && !step3Validated) || (step.id === 4 && !step4Validated) || (step.id === 5 && !step5Validated)
                              ? 'bg-yellow-50 border border-yellow-200 text-yellow-800 hover:bg-yellow-100'
                              : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => {
                        setCurrentStep(step.id);
                        // Refresh data when clicking on step 5 (Review & Submit)
                        if (step.id === 5) {
                          refreshDataForReview();
                        }
                        // Refresh final steps when clicking on step 6 (Final Steps)
                        if (step.id === 6) {
                          const refreshFinalSteps = async () => {
                            try {
                              const updatedFinalSteps = await finalStepService.getFinalSteps(language);
                              setFinalSteps(updatedFinalSteps);
                            } catch (error) {
                              console.error('Error refreshing final steps:', error);
                            }
                          };
                          refreshFinalSteps();
                        }
                      }}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isFinalStepActive || (step.id === 1 && !validateStep1()) || (step.id === 2 && !step2Validated) || (step.id === 3 && !step3Validated) || (step.id === 4 && !step4Validated) || (step.id === 5 && !step5Validated)
                              ? 'bg-yellow-200 text-yellow-700'
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
                            isActive ? 'text-white' : isCompleted ? 'text-green-900' : isFinalStepActive || (step.id === 1 && !validateStep1()) || (step.id === 2 && !step2Validated) || (step.id === 3 && !step3Validated) || (step.id === 4 && !step4Validated) || (step.id === 5 && !step5Validated) ? 'text-yellow-800' : 'text-gray-900'
                          }`}>
                          {step.title}
                        </h3>
                        <p className={`text-xs ${
                          isActive ? 'text-white/80' : isCompleted ? 'text-green-700' : isFinalStepActive || (step.id === 1 && !validateStep1()) || (step.id === 2 && !step2Validated) || (step.id === 3 && !step3Validated) || (step.id === 4 && !step4Validated) || (step.id === 5 && !step5Validated) ? 'text-yellow-700' : 'text-gray-600'
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
                ) : currentStep === 5 ? (
                  <button
                    onClick={handleSubmit}
                    className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
                  >
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                    <span className="font-semibold">{language === 'en' ? 'Submit Application' : 'Soumettre la Candidature'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
  );
};


export default ApplicationProcess;

// Inject E-ADVISOR POC widget on this page only
// eslint-disable-next-line
(() => {})();
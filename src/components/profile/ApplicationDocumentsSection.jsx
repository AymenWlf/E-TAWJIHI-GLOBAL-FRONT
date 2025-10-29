import React, { useState, useEffect } from 'react';
import { 
  User, FileText, Upload, CheckCircle, Eye, Download, 
  AlertCircle, Clock, XCircle, CheckCircle2, Trash2, 
  Languages, Plus, Globe, FileCheck, X 
} from 'lucide-react';
import documentService from '../../services/documentService';
import documentTranslationService from '../../services/documentTranslationService';
import { useAuth } from '../../contexts/AuthContext';
import { useAllParameters } from '../../hooks/useAllParameters';

const ApplicationDocumentsSection = ({ language, onUploadDocument, onDocumentUploaded }) => {
  const { user, isAuthenticated } = useAuth();
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();
  const [documents, setDocuments] = useState({});
  const [translations, setTranslations] = useState({}); // Store translations by document key
  const [uploading, setUploading] = useState({});
  const [uploadingTranslation, setUploadingTranslation] = useState({}); // Store translation uploads
  const [loading, setLoading] = useState(true);
  const [showTranslationModal, setShowTranslationModal] = useState({});
  const [documentLanguages, setDocumentLanguages] = useState({});
  const [showTranslationForm, setShowTranslationForm] = useState({});
  const [errorAlert, setErrorAlert] = useState({ show: false, title: '', message: '', details: [] });

  // Function to show detailed error alert
  const showErrorAlert = (title, message, details = []) => {
    setErrorAlert({
      show: true,
      title,
      message,
      details: Array.isArray(details) ? details : [details]
    });
  };

  // Function to hide error alert
  const hideErrorAlert = () => {
    setErrorAlert({ show: false, title: '', message: '', details: [] });
  };

  // Load documents from backend on component mount, but only if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDocuments();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      
      // Double check authentication
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, skipping document load');
        setLoading(false);
        return;
      }
      
      const backendDocuments = await documentService.getDocuments();
      console.log('Backend documents loaded:', backendDocuments);
      
      // Convert backend documents to local state format
      const documentsMap = {};
      const languagesMap = {};
      backendDocuments.forEach(doc => {
        // Find the document key based on title or type/category
        const docKey = findDocumentKey(doc);
        if (docKey) {
          documentsMap[docKey] = {
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
          
          // Store the original language for pre-selection
          if (doc.originalLanguage) {
            languagesMap[docKey] = doc.originalLanguage;
          }
          
          console.log(`Document mapped: ${docKey} -> ID: ${doc.id}, Language: ${doc.originalLanguage}`);
        } else {
          console.warn('No document key found for:', doc);
        }
      });
      
      setDocuments(documentsMap);
      setDocumentLanguages(languagesMap); // Pre-select languages from backend
      console.log('Final documents map:', documentsMap);
      console.log('Document languages map:', languagesMap);
      
      // Load translations for each document
      const translationsMap = {};
      for (const [docKey, doc] of Object.entries(documentsMap)) {
        if (doc.id) {
          try {
            const documentTranslations = await documentTranslationService.getTranslations(doc.id);
            translationsMap[docKey] = documentTranslations;
          } catch (error) {
            console.error(`Error loading translations for document ${docKey}:`, error);
            translationsMap[docKey] = [];
          }
        }
      }
      setTranslations(translationsMap);
    } catch (error) {
      console.error('Error loading documents:', error);
      
      // If it's an authentication error, don't show error to user
      if (error.message.includes('authentication token')) {
        console.log('Authentication token not found, user may not be logged in');
        setDocuments({});
      } else {
        // Show detailed error to user
        const errorTitle = language === 'en' ? 'Failed to Load Documents' : 'Échec du Chargement des Documents';
        const errorMessage = language === 'en' 
          ? 'Unable to load your documents from the server.' 
          : 'Impossible de charger vos documents depuis le serveur.';
        const errorDetails = [
          language === 'en' ? `Error: ${error.message}` : `Erreur: ${error.message}`,
          language === 'en' ? `Status: ${error.response?.status || 'Unknown'}` : `Statut: ${error.response?.status || 'Inconnu'}`,
          language === 'en' ? `URL: ${error.config?.url || 'Unknown'}` : `URL: ${error.config?.url || 'Inconnue'}`
        ];
        showErrorAlert(errorTitle, errorMessage, errorDetails);
      }
    } finally {
      setLoading(false);
    }
  };

  const findDocumentKey = (doc) => {
    // Map backend document to frontend document key
    const titleMapping = {
      'Passport': 'passport',
      'Passeport': 'passport',
      'National ID Card': 'nationalId',
      'Carte Nationale': 'nationalId',
      'Curriculum Vitae (CV)': 'cv',
      'Guardian 1 National ID': 'guardian1NationalId',
      'Carte Nationale Tuteur 1': 'guardian1NationalId',
      'Guardian 2 National ID': 'guardian2NationalId',
      'Carte Nationale Tuteur 2': 'guardian2NationalId',
      'General Transcript': 'transcript',
      'Relevé de note général': 'transcript',
      'English Test Certificate': 'englishTest',
      'Certificat de Test d\'Anglais': 'englishTest',
      'French Test Certificate': 'frenchTest',
      'Certificat de Test de Français': 'frenchTest',
      'Portfolio': 'portfolio',
      'Baccalaureate Diploma': 'baccalaureate',
      'Diplôme du Baccalauréat': 'baccalaureate',
      'BAC+2 Diploma': 'bac2',
      'Diplôme BAC+2': 'bac2',
      'BAC+3 Diploma': 'bac3',
      'Diplôme BAC+3': 'bac3',
      'BAC+5 Diploma': 'bac5',
      'Diplôme BAC+5': 'bac5',
      'Enrollment Certificate': 'enrollmentCertificate',
      'Attestation de Scolarité': 'enrollmentCertificate',
      'Recommendation Letter 1': 'recommendationLetter1',
      'Lettre de Recommandation 1': 'recommendationLetter1',
      'Recommendation Letter 2': 'recommendationLetter2',
      'Lettre de Recommandation 2': 'recommendationLetter2',
      'Motivation Letter': 'motivationLetter',
      'Lettre de Motivation': 'motivationLetter'
    };

    return titleMapping[doc.title] || null;
  };

  // Document definitions - exact match with user requirements
  const documentSections = [
    {
      title: language === 'en' ? 'Personal Documents' : 'Documents Personnels',
      icon: User,
      color: 'blue',
      emoji: '📘',
      documents: [
        { 
          key: 'passport', 
          label: language === 'en' ? 'Passport' : 'Passeport', 
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
          key: 'cv', 
          label: language === 'en' ? 'Curriculum Vitae (CV)' : 'Curriculum Vitae (CV)', 
          required: true,
          description: language === 'en' 
            ? 'Updated CV with your educational background, work experience, and skills. Maximum 2 pages.'
            : 'CV mis à jour avec votre parcours éducatif, expérience professionnelle et compétences. Maximum 2 pages.',
          hasGenerator: true
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
        }
      ]
    },
    {
      title: language === 'en' ? 'Academic Documents' : 'Documents Académiques',
      icon: FileText,
      color: 'green',
      emoji: '🎓',
      documents: [
        { 
          key: 'transcript', 
          label: language === 'en' ? 'General Transcript' : 'Relevé de note général', 
          required: true,
          description: language === 'en' 
            ? 'Official transcripts from all institutions attended. Must include all courses and grades.'
            : 'Relevés de notes officiels de tous les établissements fréquentés. Doit inclure tous les cours et notes.'
        },
        { 
          key: 'englishTest', 
          label: language === 'en' ? 'English Test Certificate' : 'Certificat de Test d\'Anglais', 
          required: false,
          description: language === 'en' 
            ? 'English test certificate (IELTS, TOEFL, etc.) - Required if studying in English.'
            : 'Certificat de test d\'anglais (IELTS, TOEFL, etc.) - Obligatoire si études en anglais.'
        },
        { 
          key: 'frenchTest', 
          label: language === 'en' ? 'French Test Certificate' : 'Certificat de Test de Français', 
          required: true,
          description: language === 'en' 
            ? 'French test certificate (TCF, DELF, DALF) - Required for French studies.'
            : 'Certificat de test de français (TCF, DELF, DALF) - Obligatoire pour les études en français.'
        },
        { 
          key: 'portfolio', 
          label: language === 'en' ? 'Portfolio' : 'Portfolio', 
          required: false,
          description: language === 'en' 
            ? 'Portfolio of your work - Required if applying for architecture or art.'
            : 'Portfolio de vos travaux - Obligatoire si candidature en architecture ou art.'
        },
        { 
          key: 'baccalaureate', 
          label: language === 'en' ? 'Baccalaureate Diploma' : 'Diplôme du Baccalauréat', 
          required: true,
          description: language === 'en' 
            ? 'Official baccalaureate diploma or equivalent high school completion certificate.'
            : 'Diplôme officiel du baccalauréat ou certificat équivalent de fin d\'études secondaires.'
        },
        { 
          key: 'bac2', 
          label: language === 'en' ? 'BAC+2 Diploma' : 'Diplôme BAC+2', 
          required: false,
          description: language === 'en' 
            ? 'BAC+2 Diploma - Required if available (2-year higher education diploma).'
            : 'Diplôme BAC+2 - Obligatoire en cas de disponibilité (diplôme d\'enseignement supérieur de 2 ans).'
        },
        { 
          key: 'bac3', 
          label: language === 'en' ? 'BAC+3 Diploma' : 'Diplôme BAC+3', 
          required: false,
          description: language === 'en' 
            ? 'BAC+3 Diploma - Required if available (3-year higher education diploma).'
            : 'Diplôme BAC+3 - Obligatoire en cas de disponibilité (diplôme d\'enseignement supérieur de 3 ans).'
        },
        { 
          key: 'bac5', 
          label: language === 'en' ? 'BAC+5 Diploma' : 'Diplôme BAC+5', 
          required: false,
          description: language === 'en' 
            ? 'BAC+5 Diploma - Required if available (5-year higher education diploma).'
            : 'Diplôme BAC+5 - Obligatoire en cas de disponibilité (diplôme d\'enseignement supérieur de 5 ans).'
        },
        { 
          key: 'enrollmentCertificate', 
          label: language === 'en' ? 'Enrollment Certificate' : 'Attestation de Scolarité', 
          required: false,
          description: language === 'en' 
            ? 'Current enrollment certificate - Required if you are currently studying.'
            : 'Certificat de scolarité actuelle - Obligatoire si vous étudiez actuellement.'
        }
      ]
    },
    {
      title: language === 'en' ? 'Application Documents' : 'Documents de Candidature',
      icon: FileText,
      color: 'purple',
      emoji: '📝',
      documents: [
        { 
          key: 'recommendationLetter1', 
          label: language === 'en' ? 'Recommendation Letter 1' : 'Lettre de Recommandation 1', 
          required: true,
          description: language === 'en' 
            ? 'First recommendation letter from a teacher, professor or professional supervisor.'
            : 'Première lettre de recommandation d\'un enseignant, professeur ou superviseur professionnel.'
        },
        { 
          key: 'recommendationLetter2', 
          label: language === 'en' ? 'Recommendation Letter 2' : 'Lettre de Recommandation 2', 
          required: false,
          description: language === 'en' 
            ? 'Second recommendation letter from a teacher, professor or professional supervisor.'
            : 'Deuxième lettre de recommandation d\'un enseignant, professeur ou superviseur professionnel.'
        },
        { 
          key: 'motivationLetter', 
          label: language === 'en' ? 'Motivation Letter' : 'Lettre de Motivation', 
          required: true,
          description: language === 'en' 
            ? 'Personal letter explaining your motivation, goals and why you want to study this program.'
            : 'Lettre personnelle expliquant votre motivation, objectifs et pourquoi vous voulez étudier ce programme.',
          hasGenerator: true
        }
      ]
    }
  ];

  const handleFileUpload = async (docKey, file) => {
    if (!file) return;

    setUploading(prev => ({ ...prev, [docKey]: true }));

    try {
      // Get document info
      const docInfo = documentSections
        .flatMap(section => section.documents)
        .find(doc => doc.key === docKey);
      
      if (!docInfo) {
        throw new Error('Document type not found');
      }

      // Get type and category from document service
      const { type, category } = documentService.getDocumentTypeAndCategory(docKey);
      const title = documentService.getDocumentTitle(docKey, language);

      // Prepare document data for backend
      const documentData = {
        type: type,
        category: category,
        title: title,
        description: docInfo.description,
        originalLanguage: documentLanguages[docKey] || ''
      };

      // Upload to backend with file
      const uploadedDocument = await documentService.uploadDocument(file, documentData);
      
      // Update local state
      setDocuments(prev => ({
        ...prev,
        [docKey]: {
          id: uploadedDocument.id,
          name: uploadedDocument.originalFilename,
          size: uploadedDocument.fileSize,
          type: uploadedDocument.mimeType,
          uploadedAt: uploadedDocument.createdAt,
          status: 'uploaded',
          validationStatus: uploadedDocument.validationStatus || 'under_review',
          validationComment: uploadedDocument.validationNotes || uploadedDocument.rejectionReason,
          validatedAt: uploadedDocument.validatedAt,
          originalLanguage: uploadedDocument.originalLanguage,
          etawjihiNotes: uploadedDocument.etawjihiNotes
        }
      }));

      // Update document languages state with the uploaded language
      if (uploadedDocument.originalLanguage) {
        setDocumentLanguages(prev => ({
          ...prev,
          [docKey]: uploadedDocument.originalLanguage
        }));
      }

      // Call parent callback
      if (onDocumentUploaded) {
        onDocumentUploaded(docKey, uploadedDocument);
      }

    } catch (error) {
      console.error('Error uploading document:', error);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        const errorTitle = language === 'en' ? 'Session Expired' : 'Session Expirée';
        const errorMessage = language === 'en' 
          ? 'Your session has expired. Please log in again.' 
          : 'Votre session a expiré. Veuillez vous reconnecter.';
        const errorDetails = [
          language === 'en' ? 'Status: 401 Unauthorized' : 'Statut: 401 Non autorisé',
          language === 'en' ? 'Action: Please refresh the page and log in again' : 'Action: Veuillez actualiser la page et vous reconnecter'
        ];
        showErrorAlert(errorTitle, errorMessage, errorDetails);
      } else if (error.message.includes('connecté')) {
        showErrorAlert(
          language === 'en' ? 'Authentication Error' : 'Erreur d\'Authentification',
          error.message,
          [language === 'en' ? 'Please check your login status' : 'Veuillez vérifier votre statut de connexion']
        );
      } else {
        const errorTitle = language === 'en' ? 'Document Upload Failed' : 'Échec du Téléchargement du Document';
        const errorMessage = language === 'en' 
          ? 'Unable to upload the document to the server.' 
          : 'Impossible de télécharger le document sur le serveur.';
        const errorDetails = [
          language === 'en' ? `Error: ${error.message}` : `Erreur: ${error.message}`,
          language === 'en' ? `Status: ${error.response?.status || 'Unknown'}` : `Statut: ${error.response?.status || 'Inconnu'}`,
          language === 'en' ? `File: ${file.name}` : `Fichier: ${file.name}`,
          language === 'en' ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB` : `Taille: ${(file.size / 1024 / 1024).toFixed(2)} MB`
        ];
        showErrorAlert(errorTitle, errorMessage, errorDetails);
      }
    } finally {
      setUploading(prev => ({ ...prev, [docKey]: false }));
    }
  };

  const getStatusIcon = (docKey) => {
    if (uploading[docKey]) {
      return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
    if (documents[docKey]) {
      if (documents[docKey].validationStatus === 'approved') {
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      } else if (documents[docKey].validationStatus === 'rejected') {
        return <XCircle className="w-4 h-4 text-red-500" />;
      } else {
        return <Clock className="w-4 h-4 text-blue-500" />;
      }
    }
    return <XCircle className="w-4 h-4 text-gray-400" />;
  };

  const getStatusText = (docKey) => {
    if (uploading[docKey]) {
      return language === 'en' ? 'Under Validation...' : 'En cours de validation...';
    }
    if (documents[docKey]) {
      if (documents[docKey].validationStatus === 'approved') {
        return language === 'en' ? 'Approved' : 'Validé';
      } else if (documents[docKey].validationStatus === 'rejected') {
        return language === 'en' ? 'Rejected' : 'Refusé';
      } else {
        return language === 'en' ? 'Under Review' : 'En cours de révision';
      }
    }
    return language === 'en' ? 'Not uploaded' : 'Non téléchargé';
  };

  const getStatusColor = (docKey) => {
    if (uploading[docKey]) {
      return 'text-yellow-600';
    }
    if (documents[docKey]) {
      if (documents[docKey].validationStatus === 'approved') {
        return 'text-green-600';
      } else if (documents[docKey].validationStatus === 'rejected') {
        return 'text-red-600';
      } else {
        return 'text-blue-600';
      }
    }
    return 'text-gray-500';
  };

  const handleViewDocument = async (docKey) => {
    const document = documents[docKey];
    if (!document) return;

    try {
      console.log('Viewing document:', document);
      
      // Fetch the document content with authentication
      const response = await documentService.getDocumentContent(document.id);
      console.log('Document content response:', response);
      
      // Determine the correct MIME type and extension
      const mimeType = document.type || 'application/pdf';
      let extension = 'pdf';
      
      if (mimeType.includes('pdf')) {
        extension = 'pdf';
      } else if (mimeType.includes('word') || mimeType.includes('document')) {
        extension = 'doc';
      } else if (mimeType.includes('image')) {
        if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
          extension = 'jpg';
        } else if (mimeType.includes('png')) {
          extension = 'png';
        }
      }
      
      console.log('Creating blob with MIME type:', mimeType);
      
      // Create a blob URL from the response with proper MIME type
      const blob = new Blob([response], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      
      console.log('Blob URL created:', blobUrl);
      
      // Open the document in a new tab
      window.open(blobUrl, '_blank');
      
      // Clean up the blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 10000); // 10 seconds
      
    } catch (error) {
      console.error('Error viewing document:', error);
      const errorTitle = language === 'en' ? 'Document View Failed' : 'Échec de Visualisation du Document';
      const errorMessage = language === 'en' 
        ? 'Unable to open the document for viewing.' 
        : 'Impossible d\'ouvrir le document pour visualisation.';
      const errorDetails = [
        language === 'en' ? `Error: ${error.message}` : `Erreur: ${error.message}`,
        language === 'en' ? `Status: ${error.response?.status || 'Unknown'}` : `Statut: ${error.response?.status || 'Inconnu'}`,
        language === 'en' ? `Document: ${document.name}` : `Document: ${document.name}`,
        language === 'en' ? `Type: ${document.type}` : `Type: ${document.type}`
      ];
      showErrorAlert(errorTitle, errorMessage, errorDetails);
    }
  };

  const handleDeleteDocument = async (docKey) => {
    const document = documents[docKey];
    if (!document) {
      console.error('Document not found for key:', docKey);
      return;
    }

    console.log('Deleting document:', { docKey, document });

    const confirmMessage = language === 'en' 
      ? `Are you sure you want to delete "${document.name}"?` 
      : `Êtes-vous sûr de vouloir supprimer "${document.name}" ?`;

    if (!confirm(confirmMessage)) return;

    try {
      if (document.id) {
        console.log('Calling deleteDocument with ID:', document.id);
        await documentService.deleteDocument(document.id);
        console.log('Document deleted successfully from backend');
        
        // Reload documents from backend to ensure consistency
        await loadDocuments();
      } else {
        console.error('Document has no ID:', document);
      }

    } catch (error) {
      console.error('Error deleting document:', error);
      const errorTitle = language === 'en' ? 'Document Deletion Failed' : 'Échec de Suppression du Document';
      const errorMessage = language === 'en' 
        ? 'Unable to delete the document from the server.' 
        : 'Impossible de supprimer le document du serveur.';
      const errorDetails = [
        language === 'en' ? `Error: ${error.message}` : `Erreur: ${error.message}`,
        language === 'en' ? `Status: ${error.response?.status || 'Unknown'}` : `Statut: ${error.response?.status || 'Inconnu'}`,
        language === 'en' ? `Document: ${document.name}` : `Document: ${document.name}`,
        language === 'en' ? `ID: ${document.id}` : `ID: ${document.id}`
      ];
      showErrorAlert(errorTitle, errorMessage, errorDetails);
    }
  };

  // Language options from parameters
  const getLanguageOptions = () => {
    if (!allParams?.languages) {
      // Fallback options if parameters are not loaded yet
      return [
        { value: 'English', label: 'English', flag: '🇺🇸' },
        { value: 'French', label: 'Français', flag: '🇫🇷' },
        { value: 'Arabic', label: 'العربية', flag: '🇸🇦' }
      ];
    }
    
    return allParams.languages.map(lang => ({
      value: lang.code, // code now contains the full name (e.g., "English", "French")
      label: language === 'fr' ? (lang.labelFr || lang.labelEn) : lang.labelEn,
      flag: lang.flag || '🌐'
    }));
  };

  const languageOptions = getLanguageOptions();

  // Helper functions for translations
  const getTranslationsForDocument = (docKey) => {
    return translations[docKey] || [];
  };

  const getTranslationStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'under_review':
        return 'text-blue-600 bg-blue-50';
      case 'uploaded':
        return 'text-blue-600 bg-blue-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTranslationStatusText = (status) => {
    switch (status) {
      case 'approved':
        return language === 'en' ? 'Approved' : 'Validé';
      case 'under_review':
        return language === 'en' ? 'Under Review' : 'En cours de révision';
      case 'uploaded':
        return language === 'en' ? 'Under Review' : 'En cours de révision';
      case 'rejected':
        return language === 'en' ? 'Rejected' : 'Refusé';
      default:
        return status;
    }
  };

  const getTranslationStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-3 h-3 text-green-600" />;
      case 'under_review':
        return <Clock className="w-3 h-3 text-blue-600" />;
      case 'uploaded':
        return <Clock className="w-3 h-3 text-blue-600" />;
      case 'rejected':
        return <XCircle className="w-3 h-3 text-red-600" />;
      default:
        return <Clock className="w-3 h-3 text-gray-600" />;
    }
  };

  const getLanguageLabel = (languageCode) => {
    const lang = languageOptions.find(l => l.value === languageCode);
    return lang ? `${lang.flag} ${lang.label}` : languageCode;
  };

  const handleTranslationLanguageChange = async (docKey, translationId, languageCode) => {
    const document = documents[docKey];
    if (!document || !document.id) {
      showErrorAlert(
        language === 'en' ? 'Document Not Found' : 'Document Non Trouvé',
        language === 'en' ? 'The original document is not available for updating the translation.' : 'Le document original n\'est pas disponible pour mettre à jour la traduction.',
        [language === 'en' ? 'Action: Please refresh the page and try again' : 'Action: Veuillez actualiser la page et réessayer']
      );
      return;
    }

    try {
      // Update translation language in backend
      await documentTranslationService.updateTranslation(document.id, translationId, {
        targetLanguage: languageCode
      });

      // Reload documents to get updated translations
      await loadDocuments();

      console.log(`Language updated for translation ${translationId}: ${languageCode}`);
    } catch (error) {
      console.error(`Error updating language for translation ${translationId}:`, error);
      
      const errorTitle = language === 'en' ? 'Language Update Failed' : 'Échec de la Mise à Jour de la Langue';
      const errorMessage = language === 'en' 
        ? 'Unable to save the translation language. Please try again.' 
        : 'Impossible de sauvegarder la langue de la traduction. Veuillez réessayer.';
      const errorDetails = [
        language === 'en' ? `Error: ${error.message}` : `Erreur: ${error.message}`,
        language === 'en' ? `Status: ${error.response?.status || 'Unknown'}` : `Statut: ${error.response?.status || 'Inconnu'}`,
        language === 'en' ? `Translation ID: ${translationId}` : `ID Traduction: ${translationId}`,
        language === 'en' ? `Language: ${languageCode}` : `Langue: ${languageCode}`
      ];
      showErrorAlert(errorTitle, errorMessage, errorDetails);
    }
  };

  const handleDocumentLanguageChange = async (docKey, languageCode) => {
    // Update local state immediately
    setDocumentLanguages(prev => ({
      ...prev,
      [docKey]: languageCode
    }));

    // Persist to backend if document exists
    const document = documents[docKey];
    if (document && document.id) {
      try {
        // Update the document's original language in the backend
        await documentService.updateDocument(document.id, {
          originalLanguage: languageCode
        });
        console.log(`Language updated for document ${docKey}: ${languageCode}`);
      } catch (error) {
        console.error(`Error updating language for document ${docKey}:`, error);
        // Revert local state on error
        setDocumentLanguages(prev => ({
          ...prev,
          [docKey]: document.originalLanguage || 'English'
        }));
        
        const errorTitle = language === 'en' ? 'Language Update Failed' : 'Échec de la Mise à Jour de la Langue';
        const errorMessage = language === 'en' 
          ? 'Unable to save the document language. Please try again.' 
          : 'Impossible de sauvegarder la langue du document. Veuillez réessayer.';
        const errorDetails = [
          language === 'en' ? `Error: ${error.message}` : `Erreur: ${error.message}`,
          language === 'en' ? `Document: ${docKey}` : `Document: ${docKey}`,
          language === 'en' ? `Language: ${languageCode}` : `Langue: ${languageCode}`
        ];
        showErrorAlert(errorTitle, errorMessage, errorDetails);
      }
    }
  };

  const handleTranslationFileChange = async (docKey, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const select = document.getElementById(`translation-lang-${docKey}`);
    const targetLanguage = select.value;

    if (!targetLanguage) {
      showErrorAlert(
        language === 'en' ? 'Language Selection Required' : 'Sélection de Langue Requise',
        language === 'en' ? 'Please select a target language before uploading the translation.' : 'Veuillez sélectionner une langue cible avant de télécharger la traduction.',
        [language === 'en' ? 'Action: Select a language from the dropdown menu' : 'Action: Sélectionnez une langue dans le menu déroulant']
      );
      return;
    }

    await handleAddTranslation(docKey, targetLanguage, file);
  };

  const handleAddTranslation = async (docKey, targetLanguage, file) => {
    if (!file) {
      showErrorAlert(
        language === 'en' ? 'File Selection Required' : 'Sélection de Fichier Requise',
        language === 'en' ? 'Please select a file to upload as translation.' : 'Veuillez sélectionner un fichier à télécharger comme traduction.',
        [language === 'en' ? 'Action: Click the upload button and select a file' : 'Action: Cliquez sur le bouton de téléchargement et sélectionnez un fichier']
      );
      return;
    }

    setUploadingTranslation(prev => ({ ...prev, [`${docKey}_${targetLanguage}`]: true }));

    try {
      let document = documents[docKey];
      let documentId = document?.id;

      // If no original document exists, create a placeholder first
      if (!document || !document.id) {
        // Get document info
        const docInfo = documentSections
          .flatMap(section => section.documents)
          .find(doc => doc.key === docKey);
        
        if (!docInfo) {
          throw new Error('Document type not found');
        }

        // Get type and category from document service
        const { type, category } = documentService.getDocumentTypeAndCategory(docKey);
        const title = documentService.getDocumentTitle(docKey, language);

        // Create document data for the placeholder original document
        const documentData = {
          type: type,
          category: category,
          title: title,
          description: docInfo.description,
          originalLanguage: documentLanguages[docKey] || 'English' // Use selected language or default
        };

        // Create a minimal PDF placeholder file
        const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(PLACEHOLDER DOCUMENT) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`;
        
        const placeholderFile = new File([pdfContent], 'placeholder.pdf', { type: 'application/pdf' });
        
        // Upload placeholder document to create the original document
        const uploadedDocument = await documentService.uploadDocument(placeholderFile, documentData);
        
        // Update local state with the new placeholder document
        setDocuments(prev => ({
          ...prev,
          [docKey]: {
            id: uploadedDocument.id,
            name: uploadedDocument.originalFilename,
            size: uploadedDocument.fileSize,
            type: uploadedDocument.mimeType,
            uploadedAt: uploadedDocument.createdAt,
            status: 'uploaded',
            validationStatus: uploadedDocument.validationStatus || 'under_review',
            validationComment: uploadedDocument.validationNotes || uploadedDocument.rejectionReason,
            validatedAt: uploadedDocument.validatedAt,
            originalLanguage: uploadedDocument.originalLanguage,
            etawjihiNotes: uploadedDocument.etawjihiNotes
          }
        }));

        // Update document languages state with the placeholder language
        if (uploadedDocument.originalLanguage) {
          setDocumentLanguages(prev => ({
            ...prev,
            [docKey]: uploadedDocument.originalLanguage
          }));
        }

        documentId = uploadedDocument.id;
      }

      const translationData = {
        targetLanguage: targetLanguage,
        notes: ''
      };

      const newTranslation = await documentTranslationService.createTranslation(documentId, file, translationData);
      
      // Update local state
      setTranslations(prev => ({
        ...prev,
        [docKey]: [...(prev[docKey] || []), newTranslation]
      }));

      // Close the form
      setShowTranslationForm(prev => ({ ...prev, [docKey]: false }));

      // Reset file input
      const fileInput = window.document.getElementById(`translation-file-${docKey}`);
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Error uploading translation:', error);
      const errorTitle = language === 'en' ? 'Translation Upload Failed' : 'Échec du Téléchargement de la Traduction';
      const errorMessage = language === 'en' 
        ? 'Unable to upload the translation to the server.' 
        : 'Impossible de télécharger la traduction sur le serveur.';
      const errorDetails = [
        language === 'en' ? `Error: ${error.message}` : `Erreur: ${error.message}`,
        language === 'en' ? `Status: ${error.response?.status || 'Unknown'}` : `Statut: ${error.response?.status || 'Inconnu'}`,
        language === 'en' ? `File: ${file.name}` : `Fichier: ${file.name}`,
        language === 'en' ? `Target Language: ${targetLanguage}` : `Langue Cible: ${targetLanguage}`,
        language === 'en' ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB` : `Taille: ${(file.size / 1024 / 1024).toFixed(2)} MB`
      ];
      showErrorAlert(errorTitle, errorMessage, errorDetails);
    } finally {
      setUploadingTranslation(prev => ({ ...prev, [`${docKey}_${targetLanguage}`]: false }));
    }
  };

  const handleViewTranslation = async (docKey, translationId) => {
    const document = documents[docKey];
    if (!document || !document.id) {
      showErrorAlert(
        language === 'en' ? 'Document Not Found' : 'Document Non Trouvé',
        language === 'en' ? 'The original document is not available for viewing the translation.' : 'Le document original n\'est pas disponible pour visualiser la traduction.',
        [language === 'en' ? 'Action: Please upload the original document first' : 'Action: Veuillez d\'abord télécharger le document original']
      );
      return;
    }

    try {
      // Fetch the translation content with authentication
      const response = await documentTranslationService.getTranslationContent(document.id, translationId);
      
      // Determine the correct MIME type and extension for translations
      // Get the translation from the translations array to get its MIME type
      const translation = translations[docKey]?.find(t => t.id === translationId);
      const mimeType = translation?.mimeType || 'application/pdf';
      let extension = 'pdf';
      
      if (mimeType.includes('pdf')) {
        extension = 'pdf';
      } else if (mimeType.includes('word') || mimeType.includes('document')) {
        extension = 'doc';
      } else if (mimeType.includes('image')) {
        if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
          extension = 'jpg';
        } else if (mimeType.includes('png')) {
          extension = 'png';
        }
      }
      
      // Create a blob URL from the response with proper MIME type
      const blob = new Blob([response], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      
      // Open the document in a new tab
      window.open(blobUrl, '_blank');
      
      // Clean up the blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 10000); // 10 seconds
      
    } catch (error) {
      console.error('Error viewing translation:', error);
      const translation = translations[docKey]?.find(t => t.id === translationId);
      const errorTitle = language === 'en' ? 'Translation View Failed' : 'Échec de Visualisation de la Traduction';
      const errorMessage = language === 'en' 
        ? 'Unable to open the translation for viewing.' 
        : 'Impossible d\'ouvrir la traduction pour visualisation.';
      const errorDetails = [
        language === 'en' ? `Error: ${error.message}` : `Erreur: ${error.message}`,
        language === 'en' ? `Status: ${error.response?.status || 'Unknown'}` : `Statut: ${error.response?.status || 'Inconnu'}`,
        language === 'en' ? `Translation ID: ${translationId}` : `ID Traduction: ${translationId}`,
        language === 'en' ? `Target Language: ${translation?.targetLanguage || 'Unknown'}` : `Langue Cible: ${translation?.targetLanguage || 'Inconnue'}`,
        language === 'en' ? `Document ID: ${document.id}` : `ID Document: ${document.id}`
      ];
      showErrorAlert(errorTitle, errorMessage, errorDetails);
    }
  };

  const handleDeleteTranslation = async (docKey, translationId) => {
    const confirmMessage = language === 'en' 
      ? `Are you sure you want to delete this translation?` 
      : `Êtes-vous sûr de vouloir supprimer cette traduction ?`;

    if (!confirm(confirmMessage)) return;

    const document = documents[docKey];
    if (!document || !document.id) {
      showErrorAlert(
        language === 'en' ? 'Document Not Found' : 'Document Non Trouvé',
        language === 'en' ? 'The original document is not available for deleting the translation.' : 'Le document original n\'est pas disponible pour supprimer la traduction.',
        [language === 'en' ? 'Action: Please refresh the page and try again' : 'Action: Veuillez actualiser la page et réessayer']
      );
      return;
    }

    try {
      await documentTranslationService.deleteTranslation(document.id, translationId);
      
      // Reload documents from backend to ensure consistency
      await loadDocuments();

    } catch (error) {
      console.error('Error deleting translation:', error);
      const translation = translations[docKey]?.find(t => t.id === translationId);
      const errorTitle = language === 'en' ? 'Translation Deletion Failed' : 'Échec de Suppression de la Traduction';
      const errorMessage = language === 'en' 
        ? 'Unable to delete the translation from the server.' 
        : 'Impossible de supprimer la traduction du serveur.';
      const errorDetails = [
        language === 'en' ? `Error: ${error.message}` : `Erreur: ${error.message}`,
        language === 'en' ? `Status: ${error.response?.status || 'Unknown'}` : `Statut: ${error.response?.status || 'Inconnu'}`,
        language === 'en' ? `Translation ID: ${translationId}` : `ID Traduction: ${translationId}`,
        language === 'en' ? `Target Language: ${translation?.targetLanguage || 'Unknown'}` : `Langue Cible: ${translation?.targetLanguage || 'Inconnue'}`,
        language === 'en' ? `Document ID: ${document.id}` : `ID Document: ${document.id}`
      ];
      showErrorAlert(errorTitle, errorMessage, errorDetails);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {language === 'en' ? 'Application Documents' : 'Documents de Candidature'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Upload required documents for your applications' : 'Téléchargez les documents requis pour vos candidatures'}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-500 animate-spin" />
            <span className="text-gray-600">
              {language === 'en' ? 'Loading documents...' : 'Chargement des documents...'}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
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
                        : ' Pour les études en France (Cas : Étudier en France)'
                      }
                    </li>
                    <li>
                      <strong>{language === 'en' ? 'English' : 'Anglais'}</strong>: 
                      {language === 'en' 
                        ? ' For studies in English-speaking countries (Case: Study Abroad)'
                        : ' Pour les études dans les pays anglophones (Cas : Étudier à l\'Étranger)'
                      }
                    </li>
                    <li>
                      <strong>{language === 'en' ? 'Original Language' : 'Langue Originale'}</strong>: 
                      {language === 'en' 
                        ? ' With certified translation if not in French/English'
                        : ' Avec traduction certifiée si pas en français/anglais'
                      }
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

      {/* Document Sections */}
      <div className="space-y-6">
        {documentSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <section.icon className={`w-5 h-5 text-${section.color}-600`} />
              {section.emoji} {section.title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.documents.map((doc) => (
                <div key={doc.key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{doc.label}</h4>
                      {doc.required && (
                        <span className="text-red-500 text-xs">* {language === 'en' ? 'Required' : 'Requis'}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{doc.description}</p>
                    
                    {/* Document Types Section */}
                    <div className="mt-4 space-y-3">
                      {/* Original Document */}
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        {/* Document Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {language === 'en' ? 'Original Document' : 'Document Original'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {documents[doc.key] && (
                              <>
                                <button
                                  onClick={() => handleViewDocument(doc.key)}
                                  className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  {language === 'en' ? 'View' : 'Voir'}
                                </button>
                                <button
                                  onClick={() => handleDeleteDocument(doc.key)}
                                  className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  {language === 'en' ? 'Delete' : 'Supprimer'}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Status Badge - Only show if document is uploaded */}
                        {documents[doc.key] && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTranslationStatusColor(documents[doc.key].validationStatus || 'under_review')}`}>
                              {getTranslationStatusIcon(documents[doc.key].validationStatus || 'under_review')}
                              {getTranslationStatusText(documents[doc.key].validationStatus || 'under_review')}
                            </div>
                            <span className="text-xs text-gray-500">
                              {language === 'en' ? 'Uploaded:' : 'Téléchargé:'} {new Date(documents[doc.key].uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        {/* Language Selection */}
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {language === 'en' ? 'Document Language' : 'Langue du Document'}
                          </label>
                          <select
                            value={documentLanguages[doc.key] || 'English'}
                            onChange={(e) => handleDocumentLanguageChange(doc.key, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {languageOptions.map((lang) => (
                              <option key={lang.value} value={lang.value}>
                                {lang.flag} {lang.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Original Document Actions */}
                        <div className="flex items-center gap-2">
                          {!documents[doc.key] ? (
                            <>
                              <input
                                type="file"
                                onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                                className="hidden"
                                id={`file-${doc.key}`}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              />
                              <label
                                htmlFor={`file-${doc.key}`}
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-all duration-200 text-xs font-medium flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3" />
                                {language === 'en' ? 'Upload' : 'Télécharger'}
                              </label>
                            </>
                          ) : (
                            <div className="flex items-center gap-1">
                              <input
                                type="file"
                                onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                                className="hidden"
                                id={`file-${doc.key}-replace`}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              />
                              <label
                                htmlFor={`file-${doc.key}-replace`}
                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 flex items-center gap-1 cursor-pointer"
                              >
                                <Upload className="w-3 h-3" />
                                {language === 'en' ? 'Replace' : 'Remplacer'}
                              </label>
                            </div>
                          )}
                        </div>
                        
                        {/* E-Tawjihi Notes for Original Document */}
                        {documents[doc.key]?.etawjihiNotes && (
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex items-start gap-2">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <FileText className="w-2.5 h-2.5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h6 className="text-xs font-medium text-blue-900 mb-1">
                                  {language === 'en' ? 'E-Tawjihi Notes' : 'Notes E-Tawjihi'}
                                </h6>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                  {documents[doc.key].etawjihiNotes}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Translated Documents */}
                      <div className="border border-gray-100 rounded-lg p-3 bg-blue-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Languages className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">
                              {language === 'en' ? 'Translated Documents' : 'Documents Traduits'}
                            </span>
                          </div>
                          {/* Always show Add Translation button */}
                          <button
                            onClick={() => setShowTranslationForm(prev => ({ ...prev, [doc.key]: !prev[doc.key] }))}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            {language === 'en' ? 'Add Translation' : 'Ajouter Traduction'}
                          </button>
                        </div>
                        
                        {/* Translation Form */}
                        {showTranslationForm[doc.key] && (
                          <div className="mb-3 p-3 bg-white rounded border border-blue-200">
                            <h5 className="text-xs font-medium text-blue-800 mb-2">
                              {language === 'en' ? 'Upload Translation' : 'Télécharger Traduction'}
                            </h5>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  {language === 'en' ? 'Target Language' : 'Langue Cible'}
                                </label>
                                <select
                                  id={`translation-lang-${doc.key}`}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {languageOptions
                                    .filter(lang => lang.value !== documentLanguages[doc.key])
                                    .map((lang) => (
                                      <option key={lang.value} value={lang.value}>
                                        {lang.flag} {lang.label}
                                      </option>
                                    ))}
                                </select>
                              </div>
                              <div>
                                <input
                                  type="file"
                                  id={`translation-file-${doc.key}`}
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={(e) => handleTranslationFileChange(doc.key, e)}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const fileInput = window.document.getElementById(`translation-file-${doc.key}`);
                                    fileInput.click();
                                  }}
                                  className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer transition-all duration-200 text-xs font-medium flex items-center gap-1"
                                >
                                  <Upload className="w-3 h-3" />
                                  {language === 'en' ? 'Upload Translation' : 'Télécharger Traduction'}
                                </button>
                                <button
                                  onClick={() => setShowTranslationForm(prev => ({ ...prev, [doc.key]: false }))}
                                  className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                                >
                                  {language === 'en' ? 'Cancel' : 'Annuler'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Translation List */}
                        <div className="space-y-3">
                          {getTranslationsForDocument(doc.key).map((translation, index) => (
                            <div key={translation.id} className="bg-white rounded-lg p-3 border border-gray-200">
                              {/* Translation Header */}
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {getLanguageLabel(translation.targetLanguage)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleViewTranslation(doc.key, translation.id)}
                                    className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 flex items-center gap-1"
                                  >
                                    <Eye className="w-3 h-3" />
                                    {language === 'en' ? 'View' : 'Voir'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTranslation(doc.key, translation.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    {language === 'en' ? 'Delete' : 'Supprimer'}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Language Selection */}
                              <div className="mb-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  {language === 'en' ? 'Translation Language' : 'Langue de Traduction'}
                                </label>
                                <select
                                  value={translation.targetLanguage}
                                  onChange={(e) => handleTranslationLanguageChange(doc.key, translation.id, e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {languageOptions
                                    .filter(lang => lang.value !== documentLanguages[doc.key])
                                    .map((lang) => (
                                      <option key={lang.value} value={lang.value}>
                                        {lang.flag} {lang.label}
                                      </option>
                                    ))}
                                </select>
                              </div>
                              
                              {/* Status Badge */}
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTranslationStatusColor(translation.status)}`}>
                                  {getTranslationStatusIcon(translation.status)}
                                  {getTranslationStatusText(translation.status)}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {language === 'en' ? 'Uploaded:' : 'Téléchargé:'} {new Date(translation.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {/* E-Tawjihi Notes Section */}
                              {translation.etawjihiNotes && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                  <div className="flex items-start gap-2">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <FileText className="w-2.5 h-2.5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <h6 className="text-xs font-medium text-blue-900 mb-1">
                                        {language === 'en' ? 'E-Tawjihi Notes' : 'Notes E-Tawjihi'}
                                      </h6>
                                      <p className="text-xs text-blue-800 leading-relaxed">
                                        {translation.etawjihiNotes}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {getTranslationsForDocument(doc.key).length === 0 && (
                            <div className="text-xs text-gray-500 text-center py-2">
                              {language === 'en' ? 'No translations yet' : 'Aucune traduction pour le moment'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Helper Links */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                      <a 
                        href="#" 
                        className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(language === 'en' ? 'Example document preview would open here' : 'Aperçu du document exemple s\'ouvrirait ici');
                        }}
                      >
                        <Eye className="w-3 h-3" />
                        {language === 'en' ? 'View Example' : 'Voir Exemple'}
                      </a>
                      {/* Only show download template for recommendation letters and motivation letter */}
                      {(doc.key === 'recommendationLetter1' || doc.key === 'recommendationLetter2' || doc.key === 'motivationLetter') && (
                        <a 
                          href="#" 
                          className="text-xs text-green-600 hover:text-green-800 underline flex items-center gap-1"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(language === 'en' ? 'Download template would start here' : 'Téléchargement du modèle commencerait ici');
                          }}
                        >
                          <Download className="w-3 h-3" />
                          {language === 'en' ? 'Download Template' : 'Télécharger Modèle'}
                        </a>
                      )}
                      {doc.hasGenerator && (
                        <a 
                          href="#" 
                          className="text-xs text-purple-600 hover:text-purple-800 underline flex items-center gap-1"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(language === 'en' 
                              ? `CV Generator would open here for ${doc.label}` 
                              : `Générateur CV s'ouvrirait ici pour ${doc.label}`);
                          }}
                        >
                          <FileText className="w-3 h-3" />
                          {doc.key === 'cv' 
                            ? (language === 'en' ? 'Use CV Generator' : 'Utiliser Générateur CV')
                            : (language === 'en' ? 'Use Motivation Letter Generator' : 'Utiliser Générateur Lettre de Motivation')
                          }
                        </a>
                      )}
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">
          {language === 'en' ? 'Document Upload Summary' : 'Résumé des Téléchargements'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-green-600">
              {Object.values(documents).filter(doc => doc.validationStatus === 'approved').length} {language === 'en' ? 'Approved' : 'Approuvés'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-600">
              {Object.values(documents).filter(doc => doc.validationStatus === 'rejected').length} {language === 'en' ? 'Rejected' : 'Rejetés'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600">
              {Object.values(documents).filter(doc => doc.status === 'uploaded' && !doc.validationStatus).length} {language === 'en' ? 'Under Review' : 'En révision'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">
              {documentSections.reduce((total, section) => total + section.documents.length, 0) - Object.keys(documents).length} {language === 'en' ? 'Pending' : 'En attente'}
            </span>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Error Alert Modal */}
      {errorAlert.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-red-500 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-lg font-semibold">{errorAlert.title}</h3>
              </div>
              <button
                onClick={hideErrorAlert}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-4 leading-relaxed">
                {errorAlert.message}
              </p>
              
              {/* Error Details */}
              {errorAlert.details && errorAlert.details.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    {language === 'en' ? 'Error Details:' : 'Détails de l\'Erreur:'}
                  </h4>
                  <ul className="space-y-1">
                    {errorAlert.details.map((detail, index) => (
                      <li key={index} className="text-sm text-gray-600 font-mono">
                        • {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={hideErrorAlert}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
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

export default ApplicationDocumentsSection;

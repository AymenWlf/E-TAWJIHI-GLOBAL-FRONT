import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Save,
  GraduationCap,
  Building2,
  Globe,
  Calendar,
  DollarSign,
  Award,
  Settings,
  X,
  Plus,
  Map,
  Trash2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import adminService from '../services/adminService';
import HTMLEditor from '../components/HTMLEditor';
import SelectSearchable from '../components/ui/SelectSearchable';
import MultiSelect from '../components/ui/MultiSelect';
import MultiSelectSearchable from '../components/MultiSelectSearchable';
import FieldMultiSelect from '../components/ui/FieldMultiSelect';
import RequirementsBuilder from '../components/ui/RequirementsBuilder';
import FileUpload from '../components/FileUpload';
import SEOCalculator from '../components/SEOCalculator';
import { useCurrency } from '../contexts/CurrencyContext';
import parameterService from '../services/parameterService';
import { useAllParameters } from '../hooks/useAllParameters';

const AdminProgramEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const isNew = !id || id === 'new';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [program, setProgram] = useState({
    establishmentId: '',
    name: '',
    nameFr: '',
    slug: '',
    status: 'draft',
    degree: '',
    studyLevel: '',
    studyType: '',
    language: '',
    universityType: '',
    programType: '',
    duration: '',
    durationUnit: 'year',
    tuitionAmount: '',
    tuitionCurrency: 'EUR',
    scholarships: false,
    featured: false,
    aidvisorRecommended: false,
    easyApply: false,
    isActive: true,
    startDate: '',
    intake: '',
    applicationDeadline: '',
    description: '',
    descriptionFr: '',
    subjects: [],
    field: [],
    languages: [],
    intakes: [],
    studyLevels: [],
    requirements: {},
    structuredRequirements: {},
    // Photos, locations, videos and brochures
    campusPhotos: [],
    campusLocations: [],
    youtubeVideos: [],
    brochures: [],
    // Settings
    scholarships: false,
    featured: false,
    aidvisorRecommended: false,
    easyApply: false,
    housing: false,
    isActive: true,
    // SEO fields
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    // Multi-intakes
    multiIntakes: [],
    // Configuration des prix selon le type d'université
    servicePricing: {
      normalPrice: '',
      promotionPrice: '',
      promotionDeadline: '',
      currency: ''
    }
  });

  const [establishments, setEstablishments] = useState([]);
  const { supportedCurrencies } = useCurrency();
  const [params, setParams] = useState({ 
    languages: [], 
    studyLevels: [], 
    degrees: [], 
    studyTypes: [], 
    currencies: [], 
    standardizedTests: [], 
    englishTests: [], 
    universityTypes: [], 
    gradeSystems: [],
    countries: [],
    cities: [],
    schoolTypes: [],
    procedureTypes: [],
    fieldCategories: [],
    fields: []
  });

  // Derived options
  const establishmentOptions = establishments.map((e) => ({ value: String(e.id), label: e.name }));
  const establishmentById = Object.fromEntries(establishments.map(e => [String(e.id), e]));
  const currencyOptions = (supportedCurrencies || []).map(c => ({ value: c.code, label: `${c.symbol} ${c.name} (${c.code})` }));

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
    const endYear = academicYearStart + 2;
    const intakes = [];

    let y = academicYearStart;
    let m = 9; // start at September
    while (y < endYear || (y === endYear && m <= 8)) { // until August of endYear
      const monthObj = months.find(mm => mm.num === m);
      if (monthObj) {
        const value = `${monthObj.en.toLowerCase()}-${y}`;
        const label = `${monthObj.en} ${y}`; // English UI
        intakes.push({ value, label });
      }
      m += 1;
      if (m > 12) { m = 1; y += 1; }
    }

    return intakes;
  };
  const intakeOptions = generateIntakes();

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

  useEffect(() => {
    loadEstablishmentsOptions();
    if (!isNew) {
      loadProgram();
    }
    // Load parameterized options will be handled by useAllParameters hook
  }, [id]);

  // Load all parameters using centralized service
  const [forceReload, setForceReload] = useState(false);
  const { parameters: allParams, loading: paramsLoading } = useAllParameters(forceReload);

  useEffect(() => {
    if (allParams && !paramsLoading) {
      const mappedParams = {
        languages: (allParams.languages || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn,
          labelFr: i.labelFr,
          flag: getLanguageFlag(i.code)
        })),
        studyLevels: (allParams.studyLevels || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        })),
        degrees: (allParams.degrees || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        })),
        studyTypes: (allParams.studyTypes || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        })),
        currencies: (allParams.currencies || []).map(i => ({ 
          value: i.code, 
          label: `${language === 'fr' ? i.labelFr : i.labelEn} (${i.code})` 
        })),
        standardizedTests: (allParams.standardizedTests || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn, 
          scoreRange: i.scoreRange 
        })),
        englishTests: (allParams.englishTests || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn, 
          scoreRange: i.scoreRange 
        })),
        universityTypes: (allParams.universityTypes || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        })),
        gradeSystems: (allParams.gradeSystems || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        })),
        countries: (allParams.countries || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        })),
        cities: (allParams.cities || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        })),
        schoolTypes: (allParams.schoolTypes || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        })),
        procedureTypes: (allParams.procedureTypes || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        })),
        fieldCategories: (allParams.fieldCategories || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        })),
        fields: (allParams.fields || []).map(i => ({ 
          value: i.code, 
          label: language === 'fr' ? i.labelFr : i.labelEn 
        }))
      };
      
      setParams(mappedParams);
    }
  }, [allParams, language, paramsLoading]);

  // Force reload parameters if they're empty after loading
  useEffect(() => {
    if (!paramsLoading && allParams && Object.keys(allParams).length === 0) {
      console.log('Parameters are empty, forcing reload...');
      setForceReload(true);
    }
  }, [allParams, paramsLoading]);

  const loadEstablishmentsOptions = async () => {
    try {
      const res = await adminService.getEstablishments({ limit: 200, page: 1 });
      if (res.success) setEstablishments(res.data);
    } catch (e) { /* noop */ }
  };

  // Template functions for requirements
  const getAcademicTemplate = (template) => {
    const templates = {
      undergraduate: {
        items: [
          {
            name: { en: "High School Diploma", fr: "Baccalauréat" },
            description: { en: "Minimum grade B or equivalent", fr: "Note minimum B ou équivalent" },
            required: true,
            type: "document"
          },
          {
            name: { en: "GPA 3.0/4.0", fr: "GPA 3.0/4.0" },
            description: { en: "Minimum grade point average", fr: "Moyenne minimale requise" },
            required: true,
            type: "grade"
          }
        ]
      },
      graduate: {
        items: [
          {
            name: { en: "Bachelor's Degree", fr: "Licence" },
            description: { en: "From accredited institution", fr: "D'un établissement accrédité" },
            required: true,
            type: "document"
          },
          {
            name: { en: "GPA 3.5/4.0", fr: "GPA 3.5/4.0" },
            description: { en: "Minimum grade point average", fr: "Moyenne minimale requise" },
            required: true,
            type: "grade"
          }
        ]
      },
      mba: {
        items: [
          {
            name: { en: "Bachelor's Degree", fr: "Licence" },
            description: { en: "From accredited institution", fr: "D'un établissement accrédité" },
            required: true,
            type: "document"
          },
          {
            name: { en: "GPA 3.0/4.0", fr: "GPA 3.0/4.0" },
            description: { en: "Minimum grade point average", fr: "Moyenne minimale requise" },
            required: true,
            type: "grade"
          },
          {
            name: { en: "Work Experience", fr: "Expérience professionnelle" },
            description: { en: "2+ years professional experience", fr: "2+ années d'expérience professionnelle" },
            required: true,
            type: "experience"
          }
        ]
      },
      phd: {
        items: [
          {
            name: { en: "Master's Degree", fr: "Master" },
            description: { en: "From accredited institution", fr: "D'un établissement accrédité" },
            required: true,
            type: "document"
          },
          {
            name: { en: "GPA 3.7/4.0", fr: "GPA 3.7/4.0" },
            description: { en: "Minimum grade point average", fr: "Moyenne minimale requise" },
            required: true,
            type: "grade"
          },
          {
            name: { en: "Research Proposal", fr: "Proposition de recherche" },
            description: { en: "Detailed research proposal", fr: "Proposition de recherche détaillée" },
            required: true,
            type: "document"
          }
        ]
      },
      custom: {
        items: []
      }
    };
    return templates[template] || templates.custom;
  };

  const getEnglishTemplate = (template) => {
    const templates = {
      basic: {
        items: [
          {
            name: { en: "IELTS 6.0", fr: "IELTS 6.0" },
            description: { en: "Overall band score", fr: "Score global" },
            required: true,
            type: "test",
            englishTestType: "ielts",
            testValue: "6.0",
            testScore: "1-9"
          },
          {
            name: { en: "TOEFL 80", fr: "TOEFL 80" },
            description: { en: "Internet-based test", fr: "Test sur internet" },
            required: false,
            type: "test",
            englishTestType: "toefl",
            testValue: "80",
            testScore: "0-120"
          }
        ]
      },
      intermediate: {
        items: [
          {
            name: { en: "IELTS 6.5", fr: "IELTS 6.5" },
            description: { en: "Overall band score", fr: "Score global" },
            required: true,
            type: "test",
            englishTestType: "ielts",
            testValue: "6.5",
            testScore: "1-9"
          },
          {
            name: { en: "TOEFL 90", fr: "TOEFL 90" },
            description: { en: "Internet-based test", fr: "Test sur internet" },
            required: false,
            type: "test",
            englishTestType: "toefl",
            testValue: "90",
            testScore: "0-120"
          }
        ]
      },
      advanced: {
        items: [
          {
            name: { en: "IELTS 7.0", fr: "IELTS 7.0" },
            description: { en: "Overall band score", fr: "Score global" },
            required: true,
            type: "test",
            englishTestType: "ielts",
            testValue: "7.0",
            testScore: "1-9"
          },
          {
            name: { en: "TOEFL 100", fr: "TOEFL 100" },
            description: { en: "Internet-based test", fr: "Test sur internet" },
            required: false,
            type: "test",
            englishTestType: "toefl",
            testValue: "100",
            testScore: "0-120"
          }
        ]
      },
      business: {
        items: [
          {
            name: { en: "IELTS 6.5", fr: "IELTS 6.5" },
            description: { en: "Overall band score", fr: "Score global" },
            required: true,
            type: "test",
            englishTestType: "ielts",
            testValue: "6.5",
            testScore: "1-9"
          },
          {
            name: { en: "Business English Certificate", fr: "Certificat d'anglais des affaires" },
            description: { en: "BEC Higher or equivalent", fr: "BEC Higher ou équivalent" },
            required: false,
            type: "test"
          }
        ]
      },
      academic: {
        items: [
          {
            name: { en: "IELTS 7.0", fr: "IELTS 7.0" },
            description: { en: "Overall band score", fr: "Score global" },
            required: true,
            type: "test",
            englishTestType: "ielts",
            testValue: "7.0",
            testScore: "1-9"
          },
          {
            name: { en: "Academic Writing Sample", fr: "Échantillon d'écriture académique" },
            description: { en: "Demonstrating academic English proficiency", fr: "Démontrant la maîtrise de l'anglais académique" },
            required: true,
            type: "document"
          }
        ]
      },
      custom: {
        items: []
      }
    };
    return templates[template] || templates.custom;
  };

  const getDocumentTemplate = (template) => {
    const templates = {
      basic: {
        items: [
          {
            name: { en: "Transcripts", fr: "Relevés de notes" },
            description: { en: "Official transcripts from all institutions", fr: "Relevés officiels de tous les établissements" },
            required: true,
            type: "document"
          },
          {
            name: { en: "ID Copy", fr: "Copie de pièce d'identité" },
            description: { en: "Passport or national ID", fr: "Passeport ou carte d'identité nationale" },
            required: true,
            type: "document"
          }
        ]
      },
      graduate: {
        items: [
          {
            name: { en: "Transcripts", fr: "Relevés de notes" },
            description: { en: "Official transcripts from all institutions", fr: "Relevés officiels de tous les établissements" },
            required: true,
            type: "document"
          },
          {
            name: { en: "Letters of Recommendation", fr: "Lettres de recommandation" },
            description: { en: "2-3 letters from academic or professional references", fr: "2-3 lettres de références académiques ou professionnelles" },
            required: true,
            type: "document"
          },
          {
            name: { en: "Statement of Purpose", fr: "Lettre de motivation" },
            description: { en: "Personal statement explaining your goals", fr: "Lettre de motivation expliquant vos objectifs" },
            required: true,
            type: "document"
          }
        ]
      },
      international: {
        items: [
          {
            name: { en: "Passport Copy", fr: "Copie de passeport" },
            description: { en: "Valid passport with at least 6 months validity", fr: "Passeport valide avec au moins 6 mois de validité" },
            required: true,
            type: "document"
          },
          {
            name: { en: "Visa Documents", fr: "Documents de visa" },
            description: { en: "Student visa application documents", fr: "Documents de demande de visa étudiant" },
            required: true,
            type: "document"
          },
          {
            name: { en: "Financial Proof", fr: "Preuve financière" },
            description: { en: "Bank statements or scholarship letters", fr: "Relevés bancaires ou lettres de bourse" },
            required: true,
            type: "document"
          }
        ]
      },
      scholarship: {
        items: [
          {
            name: { en: "Scholarship Application", fr: "Demande de bourse" },
            description: { en: "Completed scholarship application form", fr: "Formulaire de demande de bourse complété" },
            required: true,
            type: "document"
          },
          {
            name: { en: "Financial Need Statement", fr: "Déclaration de besoin financier" },
            description: { en: "Statement explaining financial circumstances", fr: "Déclaration expliquant la situation financière" },
            required: true,
            type: "document"
          },
          {
            name: { en: "Academic Achievements", fr: "Réalisations académiques" },
            description: { en: "Certificates and awards", fr: "Certificats et récompenses" },
            required: true,
            type: "document"
          }
        ]
      },
      research: {
        items: [
          {
            name: { en: "Research Proposal", fr: "Proposition de recherche" },
            description: { en: "Detailed research proposal (5-10 pages)", fr: "Proposition de recherche détaillée (5-10 pages)" },
            required: true,
            type: "document"
          },
          {
            name: { en: "Supervisor Agreement", fr: "Accord de superviseur" },
            description: { en: "Letter from potential research supervisor", fr: "Lettre du superviseur de recherche potentiel" },
            required: true,
            type: "document"
          },
          {
            name: { en: "Previous Research", fr: "Recherche précédente" },
            description: { en: "Publications or research experience", fr: "Publications ou expérience de recherche" },
            required: false,
            type: "document"
          }
        ]
      },
      custom: {
        items: []
      }
    };
    return templates[template] || templates.custom;
  };

  const getStandardizedTestTemplate = (template) => {
    const templates = {
      basic: {
        items: [
          {
            name: { en: "GRE General Test", fr: "Test GRE Général" },
            description: { en: "Graduate Record Examination", fr: "Examen d'évaluation des diplômés" },
            required: true,
            type: "test",
            standardizedTestType: "gre",
            testValue: "300",
            testScore: "130-170"
          }
        ]
      },
      graduate: {
        items: [
          {
            name: { en: "GRE General Test", fr: "Test GRE Général" },
            description: { en: "Minimum score: 300", fr: "Score minimum: 300" },
            required: true,
            type: "test",
            standardizedTestType: "gre",
            testValue: "300",
            testScore: "130-170"
          },
          {
            name: { en: "GRE Subject Test", fr: "Test GRE Spécialisé" },
            description: { en: "Subject-specific GRE test", fr: "Test GRE spécialisé" },
            required: false,
            type: "test",
            standardizedTestType: "gre",
            testValue: "700",
            testScore: "130-170"
          }
        ]
      },
      undergraduate: {
        items: [
          {
            name: { en: "SAT", fr: "SAT" },
            description: { en: "Scholastic Assessment Test", fr: "Test d'évaluation scolaire" },
            required: true,
            type: "test",
            standardizedTestType: "sat",
            testValue: "1200",
            testScore: "400-1600"
          },
          {
            name: { en: "ACT", fr: "ACT" },
            description: { en: "American College Testing", fr: "Test d'admission universitaire américain" },
            required: false,
            type: "test",
            standardizedTestType: "act",
            testValue: "24",
            testScore: "1-36"
          }
        ]
      },
      law: {
        items: [
          {
            name: { en: "LSAT", fr: "LSAT" },
            description: { en: "Law School Admission Test", fr: "Test d'admission en école de droit" },
            required: true,
            type: "test",
            standardizedTestType: "lsat",
            testValue: "150",
            testScore: "120-180"
          }
        ]
      },
      business: {
        items: [
          {
            name: { en: "GMAT", fr: "GMAT" },
            description: { en: "Graduate Management Admission Test", fr: "Test d'admission en gestion des diplômés" },
            required: true,
            type: "test",
            standardizedTestType: "gmat",
            testValue: "600",
            testScore: "200-800"
          },
          {
            name: { en: "GRE General Test", fr: "Test GRE Général" },
            description: { en: "Alternative to GMAT", fr: "Alternative au GMAT" },
            required: false,
            type: "test",
            standardizedTestType: "gre",
            testValue: "310",
            testScore: "130-170"
          }
        ]
      },
      custom: {
        items: []
      }
    };
    return templates[template] || templates.custom;
  };

  const loadProgram = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getProgram(parseInt(id));
      if (res.success) {
        const p = res.data;
        setProgram({
          establishmentId: p.establishment?.id || '',
          name: p.name || '',
          nameFr: p.nameFr || '',
          slug: p.slug || '',
          status: p.status || 'draft',
          degree: p.degree || '',
          studyLevel: p.studyLevel || '',
          studyType: p.studyType || '',
          language: p.language || '',
          universityType: p.establishment?.universityType || p.universityType || '',
          programType: p.programType || '',
          duration: p.duration || '',
          durationUnit: p.durationUnit || 'year',
          tuitionAmount: p.tuitionAmount || '',
          tuitionCurrency: p.tuitionCurrency || 'EUR',
          scholarships: !!p.scholarships,
          featured: !!p.featured,
          aidvisorRecommended: !!p.aidvisorRecommended,
          easyApply: !!p.easyApply,
          housing: !!p.housing,
          oralExam: !!p.oralExam,
          writtenExam: !!p.writtenExam,
          isActive: !!p.isActive,
          startDate: p.startDate || '',
          startYear: p.startYear || '',
          intake: p.intake || '',
          applicationDeadline: p.applicationDeadline || '',
          description: p.description || '',
          descriptionFr: p.descriptionFr || '',
          subjects: p.subjects || [],
          field: p.field || [],
          languages: p.languages || [],
          intakes: p.intakes || [],
          studyLevels: p.studyLevels || [],
          requirements: p.requirements || {},
        structuredRequirements: p.structuredRequirements || {},
        campusPhotos: p.campusPhotos || [],
        campusLocations: p.campusLocations || [],
        youtubeVideos: p.youtubeVideos || [],
        brochures: p.brochures || [],
        scholarships: p.scholarships || false,
        featured: p.featured || false,
        aidvisorRecommended: p.aidvisorRecommended || false,
        easyApply: p.easyApply || false,
        isActive: p.isActive !== undefined ? p.isActive : true,
        seoTitle: p.seoTitle || '',
        seoDescription: p.seoDescription || '',
        seoKeywords: p.seoKeywords || [],
        multiIntakes: p.multiIntakes || [],
        servicePricing: p.servicePricing || {
          normalPrice: '',
          promotionPrice: '',
          promotionDeadline: '',
          currency: ''
        }
        });
      } else {
        setError('Programme non trouvé');
      }
    } catch (e) {
      setError(e.message || 'Erreur de chargement du programme');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setProgram(prev => ({ ...prev, [key]: value }));
  };

  // Handle service pricing changes
  const handleServicePricingChange = (pricingField, value) => {
    setProgram(prev => ({
      ...prev,
      servicePricing: {
        ...prev.servicePricing,
        [pricingField]: value
      }
    }));
  };

  // Fonctions pour les vidéos YouTube
  const handleAddYoutubeVideo = () => {
    setProgram(prev => ({
      ...prev,
      youtubeVideos: [...(prev.youtubeVideos || []), { title: '', url: '', description: '' }]
    }));
  };

  const handleUpdateYoutubeVideo = (index, field, value) => {
    setProgram(prev => ({
      ...prev,
      youtubeVideos: (prev.youtubeVideos || []).map((video, i) => 
        i === index ? { ...video, [field]: value } : video
      )
    }));
  };

  const handleRemoveYoutubeVideo = (index) => {
    setProgram(prev => ({
      ...prev,
      youtubeVideos: (prev.youtubeVideos || []).filter((_, i) => i !== index)
    }));
  };

  // Fonctions pour les brochures
  const handleAddBrochure = () => {
    setProgram(prev => ({
      ...prev,
      brochures: [...(prev.brochures || []), { name: '', nameFr: '', file: null }]
    }));
  };

  const handleUpdateBrochure = (index, field, value) => {
    setProgram(prev => ({
      ...prev,
      brochures: (prev.brochures || []).map((brochure, i) => 
        i === index ? { ...brochure, [field]: value } : brochure
      )
    }));
  };

  const handleRemoveBrochure = (index) => {
    setProgram(prev => ({
      ...prev,
      brochures: (prev.brochures || []).filter((_, i) => i !== index)
    }));
  };

  // Fonctions pour les photos de campus
  const handleRemoveCampusPhoto = (index) => {
    setProgram(prev => ({
      ...prev,
      campusPhotos: (prev.campusPhotos || []).filter((_, i) => i !== index)
    }));
  };

  const handleUpdatePhoto = (index, field, value) => {
    setProgram(prev => ({
      ...prev,
      campusPhotos: (prev.campusPhotos || []).map((photo, i) => 
        i === index ? { ...photo, [field]: value } : photo
      )
    }));
  };

  // Fonctions pour les localisations de campus
  const handleAddCampusLocation = () => {
    setProgram(prev => ({
      ...prev,
      campusLocations: [...(prev.campusLocations || []), { name: '', address: '', googleMapsEmbed: '' }]
    }));
  };

  const handleUpdateCampusLocation = (index, field, value) => {
    setProgram(prev => ({
      ...prev,
      campusLocations: (prev.campusLocations || []).map((location, i) => 
        i === index ? { ...location, [field]: value } : location
      )
    }));
  };

  const handleRemoveCampusLocation = (index) => {
    setProgram(prev => ({
      ...prev,
      campusLocations: (prev.campusLocations || []).filter((_, i) => i !== index)
    }));
  };

  // Function to generate program URL for public page
  const generateProgramUrl = () => {
    const establishment = establishmentById[String(program.establishmentId)];
    const establishmentSlug = establishment?.slug || 
      establishment?.name?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() || 
      'university';
    const programSlug = program.slug || 
      program.name?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() || 
      'program';
    return `/programs/${establishmentSlug}/${programSlug}`;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload = { ...program };
      if (!payload.slug && payload.name) {
        payload.slug = payload.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
      }

      const res = isNew
        ? await adminService.createProgram(payload)
        : await adminService.updateProgram(parseInt(id), payload);

      if (res.success) {
        setSuccess('Programme sauvegardé avec succès');
        if (isNew && res.data?.id) {
          navigate(`/admin/programs/${res.data.id}/edit`);
        }
      } else {
        setError(res.message || 'Erreur lors de l\'enregistrement');
      }
    } catch (e) {
      setError(e.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">{isNew ? 'New Program' : 'Edit Program'}</h1>
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
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <X className="w-5 h-5 mr-2 mt-0.5" />
            <div>{error}</div>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex gap-6">
          {/* Main 2/3 */}
          <div className="flex-1 space-y-6">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5" />Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University *</label>
                  <SelectSearchable
                    options={establishmentOptions}
                    value={program.establishmentId ? String(program.establishmentId) : ''}
                    onChange={(val) => handleChange('establishmentId', val)}
                    placeholder="Search a university..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input type="text" value={program.name || ''} onChange={(e) => handleChange('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name (FR)</label>
                  <input type="text" value={program.nameFr || ''} onChange={(e) => handleChange('nameFr', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input type="text" value={program.slug || ''} onChange={(e) => handleChange('slug', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            </div>

            {/* Academic & Tuition */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5" />Academic & Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                  <SelectSearchable options={params.degrees} value={program.degree || ''} onChange={(v) => handleChange('degree', v)} placeholder="Select..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Level</label>
                  <SelectSearchable options={params.studyLevels} value={program.studyLevel || ''} onChange={(v) => handleChange('studyLevel', v)} placeholder="Select..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Type</label>
                  <SelectSearchable options={params.studyTypes} value={program.studyType || ''} onChange={(v) => handleChange('studyType', v)} placeholder="Select..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <div className="flex gap-2">
                    <input type="number" min="0" step="1" value={program.duration || ''} onChange={(e) => handleChange('duration', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <select value={program.durationUnit || 'year'} onChange={(e) => handleChange('durationUnit', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="year">Year(s)</option>
                      <option value="month">Month(s)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tuition Amount</label>
                  <input type="number" min="0" step="0.01" value={program.tuitionAmount || ''} onChange={(e) => handleChange('tuitionAmount', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <SelectSearchable options={currencyOptions} value={program.tuitionCurrency || 'EUR'} onChange={(v) => handleChange('tuitionCurrency', v)} placeholder="Select currency..." />
                </div>
              </div>
            </div>

            {/* Study Languages */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Study Languages
              </h3>
              <MultiSelectSearchable
                options={params.languages}
                value={program.languages || []}
                onChange={(value) => {
                  // Stocker uniquement les values (codes) des langues sélectionnées
                  const languageCodes = value.map(item => 
                    typeof item === 'string' ? item : item.value
                  );
                  handleChange('languages', languageCodes);
                }}
                placeholder="Select languages"
                searchPlaceholder="Search for a language..."
                label=""
                allowCreate={true}
                createLabel="Add language"
              />
            </div>

            {/* Field of Study */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Field of Study
              </h3>
              <FieldMultiSelect
                value={Array.isArray(program.field) ? program.field : []}
                onChange={(value) => handleChange('field', value)}
                placeholder="Select fields of study..."
                language="en"
                maxSelections={10}
              />
            </div>

            {/* Multi-Intakes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Multi-Intakes
              </h3>
              <div className="space-y-4">
                {program.multiIntakes?.map((intake, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Intake {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newIntakes = [...(program.multiIntakes || [])];
                          newIntakes.splice(index, 1);
                          handleChange('multiIntakes', newIntakes);
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
                            const newIntakes = [...(program.multiIntakes || [])];
                            newIntakes[index] = { ...newIntakes[index], name: v };
                            handleChange('multiIntakes', newIntakes);
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
                            const newIntakes = [...(program.multiIntakes || [])];
                            newIntakes[index] = { ...newIntakes[index], applicationOpens: e.target.value };
                            handleChange('multiIntakes', newIntakes);
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
                            const newIntakes = [...(program.multiIntakes || [])];
                            newIntakes[index] = { ...newIntakes[index], applicationCloses: e.target.value };
                            handleChange('multiIntakes', newIntakes);
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
                    const newIntakes = [...(program.multiIntakes || []), {
                      name: '',
                      applicationOpens: '',
                      applicationCloses: ''
                    }];
                    handleChange('multiIntakes', newIntakes);
                  }}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  + Add Intake
                </button>
              </div>
            </div>

            {/* Descriptions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Descriptions</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label>
                  <HTMLEditor
                    value={program.description || ''}
                    onChange={(value) => handleChange('description', value)}
                    placeholder="Program description in English"
                    height="200px"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (French)</label>
                  <HTMLEditor
                    value={program.descriptionFr || ''}
                    onChange={(value) => handleChange('descriptionFr', value)}
                    placeholder="Program description in French"
                    height="200px"
                  />
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <div className="space-y-6">
                {/* Academic Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Requirements</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Template</label>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const template = getAcademicTemplate(e.target.value);
                            handleChange('structuredRequirements', {
                              ...program.structuredRequirements,
                              academic: template
                            });
                            e.target.value = '';
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a template...</option>
                        <option value="undergraduate">Undergraduate Program</option>
                        <option value="graduate">Graduate Program</option>
                        <option value="mba">MBA Program</option>
                        <option value="phd">PhD Program</option>
                        <option value="custom">Custom Requirements</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Requirements List</label>
                      <RequirementsBuilder
                        items={program.structuredRequirements?.academic?.items || []}
                        onChange={(items) => handleChange('structuredRequirements', {
                          ...program.structuredRequirements,
                          academic: {
                            ...program.structuredRequirements?.academic,
                            items: items
                          }
                        })}
                        gradeSystemOptions={params.gradeSystems}
                      />
                    </div>
                  </div>
                </div>

                {/* English Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English Requirements</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Template</label>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const template = getEnglishTemplate(e.target.value);
                            handleChange('structuredRequirements', {
                              ...program.structuredRequirements,
                              english: template
                            });
                            e.target.value = '';
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a template...</option>
                        <option value="basic">Basic English (IELTS 6.0)</option>
                        <option value="intermediate">Intermediate (IELTS 6.5)</option>
                        <option value="advanced">Advanced (IELTS 7.0+)</option>
                        <option value="business">Business English</option>
                        <option value="academic">Academic English</option>
                        <option value="custom">Custom Requirements</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Requirements List</label>
                      <RequirementsBuilder
                        items={program.structuredRequirements?.english?.items || []}
                        onChange={(items) => handleChange('structuredRequirements', {
                          ...program.structuredRequirements,
                          english: {
                            ...program.structuredRequirements?.english,
                            items: items
                          }
                        })}
                        englishTestOptions={params.englishTests}
                        gradeSystemOptions={params.gradeSystems}
                      />
                    </div>
                  </div>
                </div>

                {/* Document Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Requirements</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Template</label>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const template = getDocumentTemplate(e.target.value);
                            handleChange('structuredRequirements', {
                              ...program.structuredRequirements,
                              documents: template
                            });
                            e.target.value = '';
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a template...</option>
                        <option value="basic">Basic Documents</option>
                        <option value="graduate">Graduate Documents</option>
                        <option value="international">International Students</option>
                        <option value="scholarship">Scholarship Application</option>
                        <option value="research">Research Program</option>
                        <option value="custom">Custom Requirements</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Requirements List</label>
                      <RequirementsBuilder
                        items={program.structuredRequirements?.documents?.items || []}
                        onChange={(items) => handleChange('structuredRequirements', {
                          ...program.structuredRequirements,
                          documents: {
                            ...program.structuredRequirements?.documents,
                            items: items
                          }
                        })}
                        gradeSystemOptions={params.gradeSystems}
                      />
                    </div>
                  </div>
                </div>

                {/* Standardized Test Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Standardized Test Requirements</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Template</label>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const template = getStandardizedTestTemplate(e.target.value);
                            handleChange('structuredRequirements', {
                              ...program.structuredRequirements,
                              standardizedTests: template
                            });
                            e.target.value = '';
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a template...</option>
                        <option value="basic">Basic Standardized Tests</option>
                        <option value="graduate">Graduate Tests (GRE/GMAT)</option>
                        <option value="undergraduate">Undergraduate Tests (SAT/ACT)</option>
                        <option value="law">Law School Tests (LSAT)</option>
                        <option value="business">Business School Tests</option>
                        <option value="custom">Custom Requirements</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Requirements List</label>
                      <RequirementsBuilder
                        items={program.structuredRequirements?.standardizedTests?.items || []}
                        onChange={(items) => handleChange('structuredRequirements', {
                          ...program.structuredRequirements,
                          standardizedTests: {
                            ...program.structuredRequirements?.standardizedTests,
                            items: items
                          }
                        })}
                        standardizedTestOptions={params.standardizedTests}
                        gradeSystemOptions={params.gradeSystems}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Optimization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                  <input
                    type="text"
                    value={program.seoTitle || ''}
                    onChange={(e) => handleChange('seoTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optimized title for search engines"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {program.seoTitle.length}/60 characters (recommended: 30-60)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords</label>
                  <MultiSelect
                    options={[
                      { value: 'university', label: 'University' },
                      { value: 'studies', label: 'Studies' },
                      { value: 'master', label: 'Master' },
                      { value: 'bachelor', label: 'Bachelor' },
                      { value: 'phd', label: 'PhD' },
                      { value: 'engineering', label: 'Engineering' },
                      { value: 'business', label: 'Business' },
                      { value: 'medicine', label: 'Medicine' },
                      { value: 'law', label: 'Law' },
                      { value: 'sciences', label: 'Sciences' },
                      { value: 'arts', label: 'Arts' },
                      { value: 'computer-science', label: 'Computer Science' },
                      { value: 'marketing', label: 'Marketing' },
                      { value: 'finance', label: 'Finance' },
                      { value: 'international', label: 'International' },
                      { value: 'scholarship', label: 'Scholarship' },
                      { value: 'admission', label: 'Admission' },
                      { value: 'campus', label: 'Campus' },
                      { value: 'student', label: 'Student' },
                      { value: 'education', label: 'Education' },
                      { value: 'program', label: 'Program' },
                      { value: 'degree', label: 'Degree' },
                      { value: 'course', label: 'Course' },
                      { value: 'tuition', label: 'Tuition' },
                      { value: 'requirements', label: 'Requirements' }
                    ]}
                    value={program.seoKeywords || []}
                    onChange={(keywords) => handleChange('seoKeywords', keywords)}
                    placeholder="Select keywords"
                    searchPlaceholder="Search keywords..."
                    allowCreate={true}
                    createLabel="Create keyword"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Choose relevant keywords for better search visibility
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                <textarea
                  value={program.seoDescription || ''}
                  onChange={(e) => handleChange('seoDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optimized description for search engines"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {program.seoDescription.length}/160 characters (recommended: 120-160)
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar 1/3 */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Publication status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publication status</h3>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={program.status || 'draft'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <p className="text-xs text-gray-500">
                  {program.status === 'draft' 
                    ? 'This program is not visible to users' 
                    : 'This program is visible to users'
                  }
                </p>
                {program.status === 'published' && (
                  <a
                    href={generateProgramUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View public page
                  </a>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Type</label>
                  <SelectSearchable
                    options={[
                      { value: null, label: 'Aucun type' },
                      ...params.universityTypes
                    ]}
                    value={program.programType}
                    onChange={(val) => handleChange('programType', val)}
                    placeholder="Select program type..."
                  />
                  {program.universityType && (
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Note:</span> L'établissement associé est de type <span className="font-semibold text-blue-600">{program.universityType}</span>
                    </p>
                  )}
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={program.scholarships}
                    onChange={(e) => handleChange('scholarships', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Scholarships available</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={program.featured}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={program.aidvisorRecommended}
                    onChange={(e) => handleChange('aidvisorRecommended', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Aidvisor recommended</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={program.easyApply}
                    onChange={(e) => handleChange('easyApply', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Easy apply</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={program.housing}
                    onChange={(e) => handleChange('housing', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Housing available</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={program.oralExam}
                    onChange={(e) => handleChange('oralExam', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Oral exam required</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={program.writtenExam}
                    onChange={(e) => handleChange('writtenExam', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Written exam required</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={program.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            {/* Configuration des Prix selon le Type */}
            {program.programType && program.programType !== null && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Pricing Configuration</h3>
                
                {program.programType === 'B' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-1 text-sm">Type B - Service Fee Required</h4>
                      <p className="text-xs text-blue-700">Configure the service fee for Type B universities</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Normal Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={program.servicePricing.normalPrice}
                          onChange={(e) => handleServicePricingChange('normalPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={program.servicePricing.promotionPrice}
                          onChange={(e) => handleServicePricingChange('promotionPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <SelectSearchable
                          options={params.currencies}
                          value={program.servicePricing.currency}
                          onChange={(val) => handleServicePricingChange('currency', val)}
                          placeholder="Select currency..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Deadline</label>
                        <input
                          type="date"
                          value={program.servicePricing.promotionDeadline}
                          onChange={(e) => handleServicePricingChange('promotionDeadline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {program.programType === 'A' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-1 text-sm">Type A - Free Applications</h4>
                      <p className="text-xs text-green-700">Configure pricing for additional services</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Normal Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={program.servicePricing.normalPrice}
                          onChange={(e) => handleServicePricingChange('normalPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">Standard price for additional services</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={program.servicePricing.promotionPrice}
                          onChange={(e) => handleServicePricingChange('promotionPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">Promotional price (optional)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <SelectSearchable
                          options={params.currencies}
                          value={program.servicePricing.currency}
                          onChange={(val) => handleServicePricingChange('currency', val)}
                          placeholder="Select currency..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Deadline</label>
                        <input
                          type="date"
                          value={program.servicePricing.promotionDeadline}
                          onChange={(e) => handleServicePricingChange('promotionDeadline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {program.programType === 'C' && (
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900 mb-1 text-sm">Type C - Special Configuration</h4>
                      <p className="text-xs text-purple-700">Configure pricing for Type C programs</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Normal Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={program.servicePricing.normalPrice}
                          onChange={(e) => handleServicePricingChange('normalPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">Standard price for Type C programs</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={program.servicePricing.promotionPrice}
                          onChange={(e) => handleServicePricingChange('promotionPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">Promotional price (optional)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <SelectSearchable
                          options={params.currencies}
                          value={program.servicePricing.currency}
                          onChange={(val) => handleServicePricingChange('currency', val)}
                          placeholder="Select currency..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Deadline</label>
                        <input
                          type="date"
                          value={program.servicePricing.promotionDeadline}
                          onChange={(e) => handleServicePricingChange('promotionDeadline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Calculateur SEO */}
            <SEOCalculator establishment={program} />

            {/* Vidéos YouTube */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">YouTube Videos</h3>
              <div className="space-y-4">
                {(program.youtubeVideos || []).map((video, index) => (
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={video.title}
                          onChange={(e) => handleUpdateYoutubeVideo(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Video title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                        <input
                          type="url"
                          value={video.url}
                          onChange={(e) => handleUpdateYoutubeVideo(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={video.description}
                        onChange={(e) => handleUpdateYoutubeVideo(index, 'description', e.target.value)}
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
                            title={video.title || 'YouTube Video'}
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
                {(program.brochures || []).map((brochure, index) => (
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                        <input
                          type="text"
                          value={brochure.name}
                          onChange={(e) => handleUpdateBrochure(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Brochure name in English"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name (French)</label>
                        <input
                          type="text"
                          value={brochure.nameFr}
                          onChange={(e) => handleUpdateBrochure(index, 'nameFr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Brochure name in French"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                      <FileUpload
                        files={brochure.file ? [{ id: 1, name: brochure.file.name, type: brochure.file.type, url: brochure.file.url }] : []}
                        onChange={(files) => handleUpdateBrochure(index, 'file', files[0] || null)}
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
                              Open
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
                    files={program.campusPhotos || []}
                    onChange={(files) => handleChange('campusPhotos', files)}
                    accept="image/*"
                    multiple={true}
                    maxFiles={10}
                    maxSize={5 * 1024 * 1024} // 5MB
                    label=""
                    description="Format: JPG, PNG, WEBP (max 5MB per image, max 10 images)"
                    uploadType="campus-photo"
                  />
                </div>
                
                {/* Aperçu des photos avec gestion des alt */}
                {(program.campusPhotos || []).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo Management</label>
                    <div className="space-y-4">
                      {(program.campusPhotos || []).map((photo, index) => (
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
                                    <div>Image not found</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Informations et contrôles */}
                            <div className="flex-1 space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Alt Text</label>
                                <input
                                  type="text"
                                  value={photo.alt || ''}
                                  onChange={(e) => handleUpdatePhoto(index, 'alt', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  placeholder="Describe the image for accessibility"
                                />
                              </div>
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleRemoveCampusPhoto(index)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
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
                {(program.campusLocations || []).map((location, index) => (
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
                          placeholder="Ex: Main Campus"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={location.address}
                          onChange={(e) => handleUpdateCampusLocation(index, 'address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Complete address"
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
                        placeholder="Paste the Google Maps iframe code here..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Copy the integration code from Google Maps (iframe)
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


            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProgramEdit;



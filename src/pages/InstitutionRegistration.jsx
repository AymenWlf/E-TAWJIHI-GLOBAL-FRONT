import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SEO from '../components/SEO';
import HeaderGlobal from '../components/landing/HeaderGlobal';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Award, 
  BookOpen, 
  GraduationCap, 
  Users, 
  DollarSign, 
  Calendar,
  Upload,
  CheckCircle,
  Star,
  ArrowRight,
  FileText,
  Shield,
  Target,
  Zap,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Handshake,
  Network,
  Rocket,
  CheckCircle2,
  Quote,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  RotateCcw,
  Settings,
  Database,
  Cpu,
  Cloud,
  Lock,
  Unlock,
  Activity,
  PieChart,
  LineChart,
  TrendingDown,
  ArrowDown,
  ArrowUp,
  Minus,
  Plus,
  X,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  ExternalLink,
  Download,
  Share2,
  Heart,
  ThumbsUp,
  MessageCircle,
  Send,
  Bell,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  MoreHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Clock
} from 'lucide-react';

const InstitutionRegistration = () => {
  const [language, setLanguage] = useState('en');
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
  const [animatedStats, setAnimatedStats] = useState(false);
  const [formData, setFormData] = useState({
    // Informations de base
    institutionName: '',
    institutionType: '',
    country: '',
    city: '',
    address: '',
    website: '',
    phone: '',
    email: '',
    
    // Représentant
    representativeName: '',
    representativePosition: '',
    representativeEmail: '',
    representativePhone: '',
    
    // Programmes et services
    programs: [],
    studyLevels: [],
    languages: [],
    tuitionRange: { min: '', max: '' },
    
    // Accréditations et classements
    accreditations: [],
    rankings: {
      qs: '',
      times: '',
      arwu: '',
      usNews: ''
    },
    
    // Services additionnels
    scholarships: false,
    accommodation: false,
    careerServices: false,
    languageSupport: false,
    
    // Documents
    logo: null,
    brochure: null,
    additionalDocs: []
  });

  const content = {
    en: {
      hero: {
        title: "Partner with E-TAWJIHI Global",
        subtitle: "The Leading International Education Platform Connecting Institutions with Global Talent",
        description: "Join 500+ prestigious institutions worldwide in our mission to democratize access to quality international education. E-TAWJIHI Global is revolutionizing how students discover, apply to, and succeed in their dream programs."
      },
      company: {
        title: "About E-TAWJIHI Global",
        subtitle: "Empowering Global Education Through Technology",
        description: "Founded with a vision to bridge educational gaps worldwide, E-TAWJIHI Global has become the trusted platform connecting students with top-tier institutions across 50+ countries. Our AI-powered matching system and comprehensive support services ensure successful outcomes for both students and institutions.",
        stats: [
          { value: "100K+", label: "Students Helped", icon: <Users className="w-6 h-6" /> },
          { value: "500+", label: "Partner Institutions", icon: <Building2 className="w-6 h-6" /> },
          { value: "50+", label: "Countries", icon: <Globe className="w-6 h-6" /> },
          { value: "95%", label: "Success Rate", icon: <TrendingUp className="w-6 h-6" /> }
        ]
      },
      values: {
        title: "Our Core Values",
        subtitle: "What Drives Our Mission",
        items: [
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Trust & Transparency",
            description: "We maintain the highest standards of integrity in all our partnerships, ensuring complete transparency in our processes and communications."
          },
          {
            icon: <Target className="w-8 h-8" />,
            title: "Excellence in Education",
            description: "We partner only with accredited institutions that meet our rigorous quality standards, ensuring students receive world-class education."
          },
          {
            icon: <Network className="w-8 h-8" />,
            title: "Global Connectivity",
            description: "We break down geographical barriers, connecting students with opportunities worldwide and institutions with diverse talent pools."
          },
          {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Innovation & Technology",
            description: "Our cutting-edge AI platform and digital tools streamline the application process, making international education more accessible."
          }
        ]
      },
      benefits: {
        title: "Why Partner with E-TAWJIHI Global?",
        subtitle: "Comprehensive Benefits for Your Institution",
        items: [
          {
            icon: <Users className="w-8 h-8" />,
            title: "Access to Global Talent Pool",
            description: "Connect with qualified students from 50+ countries, expanding your international reach and diversifying your student body."
          },
          {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Data-Driven Insights",
            description: "Receive detailed analytics on student preferences, application trends, and market opportunities to optimize your recruitment strategy."
          },
          {
            icon: <Zap className="w-8 h-8" />,
            title: "Streamlined Application Process",
            description: "Our AI-powered platform automates application processing, reducing administrative burden and improving efficiency."
          },
          {
            icon: <Handshake className="w-8 h-8" />,
            title: "Dedicated Partnership Support",
            description: "Get personalized support from our partnership team, including marketing assistance and student guidance throughout the process."
          },
          {
            icon: <Award className="w-8 h-8" />,
            title: "Quality Assurance",
            description: "All students are pre-screened and verified, ensuring you receive applications from qualified, motivated candidates."
          },
          {
            icon: <Rocket className="w-8 h-8" />,
            title: "Scalable Growth",
            description: "Scale your international recruitment efforts efficiently with our proven systems and global network infrastructure."
          }
        ]
      },
      testimonials: {
        title: "What Our Partners Say",
        subtitle: "Success Stories from Leading Institutions",
        items: [
          {
            quote: "E-TAWJIHI Global has transformed our international recruitment. The quality of students and the streamlined process exceeded our expectations.",
            author: "Dr. Sarah Johnson",
            position: "Director of International Relations",
            institution: "University of Toronto"
          },
          {
            quote: "The platform's AI matching system has significantly improved our application quality while reducing our administrative workload.",
            author: "Prof. Michael Chen",
            position: "Dean of Graduate Studies",
            institution: "MIT"
          },
          {
            quote: "Partnering with E-TAWJIHI Global has opened doors to exceptional students from regions we never had access to before.",
            author: "Dr. Emma Rodriguez",
            position: "International Admissions Director",
            institution: "University of Barcelona"
          }
        ]
      },
      process: {
        title: "Simple Partnership Process",
        subtitle: "Get Started in 4 Easy Steps",
        steps: [
          {
            number: "01",
            title: "Submit Application",
            description: "Complete our comprehensive partnership application with your institution details and requirements."
          },
          {
            number: "02",
            title: "Verification & Review",
            description: "Our team reviews your application and verifies your institution's credentials and accreditation."
          },
          {
            number: "03",
            title: "Partnership Agreement",
            description: "Sign our partnership agreement and receive your dedicated account manager and support resources."
          },
          {
            number: "04",
            title: "Go Live & Grow",
            description: "Start receiving qualified applications and grow your international student body with our support."
          }
        ]
      },
      title: "Join E-TAWJIHI Global Network",
      subtitle: "Connect with thousands of students worldwide and showcase your institution's excellence",
      steps: {
        basic: "Basic Information",
        programs: "Programs & Services", 
        accreditation: "Accreditations & Rankings",
        documents: "Documents & Media"
      },
      form: {
        institutionName: "Institution Name",
        institutionType: "Institution Type",
        country: "Country",
        city: "City",
        address: "Address",
        website: "Website",
        phone: "Phone Number",
        email: "Email Address",
        representativeName: "Representative Name",
        representativePosition: "Position/Title",
        representativeEmail: "Representative Email",
        representativePhone: "Representative Phone",
        programs: "Programs Offered",
        studyLevels: "Study Levels",
        languages: "Languages of Instruction",
        tuitionMin: "Minimum Tuition (USD)",
        tuitionMax: "Maximum Tuition (USD)",
        accreditations: "Accreditations",
        qsRanking: "QS World Ranking",
        timesRanking: "Times Higher Education Ranking",
        arwuRanking: "ARWU Ranking",
        usNewsRanking: "US News Ranking",
        logo: "Institution Logo",
        brochure: "Institution Brochure",
        additionalDocs: "Additional Documents"
      },
      services: {
        scholarships: "Scholarship Programs",
        accommodation: "Student Accommodation",
        careerServices: "Career Services",
        languageSupport: "Language Support"
      },
      institutionTypes: [
        "University",
        "College",
        "Institute",
        "Academy",
        "School",
        "Research Center"
      ],
      studyLevels: [
        "Bachelor's Degree",
        "Master's Degree", 
        "PhD/Doctorate",
        "Certificate",
        "Diploma",
        "Associate Degree"
      ],
      languages: [
        "English",
        "French",
        "Spanish",
        "German",
        "Italian",
        "Portuguese",
        "Arabic",
        "Chinese",
        "Japanese",
        "Korean"
      ],
      cta: {
        title: "Ready to Join Our Network?",
        subtitle: "Start connecting with students worldwide today",
        button: "Submit Application"
      }
    },
    fr: {
      hero: {
        title: "Partenaire avec E-TAWJIHI Global",
        subtitle: "La Plateforme d'Éducation Internationale Leader Connectant les Institutions au Talent Mondial",
        description: "Rejoignez 500+ institutions prestigieuses dans le monde dans notre mission de démocratiser l'accès à une éducation internationale de qualité. E-TAWJIHI Global révolutionne la façon dont les étudiants découvrent, postulent et réussissent dans leurs programmes de rêve."
      },
      company: {
        title: "À Propos d'E-TAWJIHI Global",
        subtitle: "Autonomiser l'Éducation Mondiale par la Technologie",
        description: "Fondée avec la vision de combler les écarts éducatifs dans le monde, E-TAWJIHI Global est devenue la plateforme de confiance connectant les étudiants aux institutions de premier plan dans plus de 50 pays. Notre système de correspondance alimenté par l'IA et nos services de support complets garantissent des résultats réussis pour les étudiants et les institutions.",
        stats: [
          { value: "100K+", label: "Étudiants Aidés", icon: <Users className="w-6 h-6" /> },
          { value: "500+", label: "Institutions Partenaires", icon: <Building2 className="w-6 h-6" /> },
          { value: "50+", label: "Pays", icon: <Globe className="w-6 h-6" /> },
          { value: "95%", label: "Taux de Réussite", icon: <TrendingUp className="w-6 h-6" /> }
        ]
      },
      values: {
        title: "Nos Valeurs Fondamentales",
        subtitle: "Ce Qui Guide Notre Mission",
        items: [
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Confiance & Transparence",
            description: "Nous maintenons les plus hauts standards d'intégrité dans tous nos partenariats, garantissant une transparence complète dans nos processus et communications."
          },
          {
            icon: <Target className="w-8 h-8" />,
            title: "Excellence en Éducation",
            description: "Nous nous associons uniquement avec des institutions accréditées qui répondent à nos standards de qualité rigoureux, garantissant aux étudiants une éducation de classe mondiale."
          },
          {
            icon: <Network className="w-8 h-8" />,
            title: "Connectivité Mondiale",
            description: "Nous brisons les barrières géographiques, connectant les étudiants aux opportunités mondiales et les institutions aux pools de talents diversifiés."
          },
          {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Innovation & Technologie",
            description: "Notre plateforme IA de pointe et nos outils numériques rationalisent le processus de candidature, rendant l'éducation internationale plus accessible."
          }
        ]
      },
      benefits: {
        title: "Pourquoi Partenariat avec E-TAWJIHI Global?",
        subtitle: "Avantages Complets pour Votre Institution",
        items: [
          {
            icon: <Users className="w-8 h-8" />,
            title: "Accès au Pool de Talents Mondial",
            description: "Connectez-vous avec des étudiants qualifiés de plus de 50 pays, élargissant votre portée internationale et diversifiant votre corps étudiant."
          },
          {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Insights Basés sur les Données",
            description: "Recevez des analyses détaillées sur les préférences des étudiants, les tendances de candidature et les opportunités de marché pour optimiser votre stratégie de recrutement."
          },
          {
            icon: <Zap className="w-8 h-8" />,
            title: "Processus de Candidature Rationalisé",
            description: "Notre plateforme alimentée par l'IA automatise le traitement des candidatures, réduisant la charge administrative et améliorant l'efficacité."
          },
          {
            icon: <Handshake className="w-8 h-8" />,
            title: "Support de Partenariat Dédié",
            description: "Obtenez un support personnalisé de notre équipe de partenariat, incluant l'assistance marketing et l'orientation des étudiants tout au long du processus."
          },
          {
            icon: <Award className="w-8 h-8" />,
            title: "Assurance Qualité",
            description: "Tous les étudiants sont pré-sélectionnés et vérifiés, garantissant que vous recevez des candidatures de candidats qualifiés et motivés."
          },
          {
            icon: <Rocket className="w-8 h-8" />,
            title: "Croissance Évolutive",
            description: "Évoluez vos efforts de recrutement international efficacement avec nos systèmes éprouvés et notre infrastructure de réseau mondial."
          }
        ]
      },
      testimonials: {
        title: "Ce Que Disent Nos Partenaires",
        subtitle: "Histoires de Succès d'Institutions Leaders",
        items: [
          {
            quote: "E-TAWJIHI Global a transformé notre recrutement international. La qualité des étudiants et le processus rationalisé ont dépassé nos attentes.",
            author: "Dr. Sarah Johnson",
            position: "Directrice des Relations Internationales",
            institution: "Université de Toronto"
          },
          {
            quote: "Le système de correspondance IA de la plateforme a considérablement amélioré la qualité de nos candidatures tout en réduisant notre charge de travail administrative.",
            author: "Prof. Michael Chen",
            position: "Doyen des Études Supérieures",
            institution: "MIT"
          },
          {
            quote: "Le partenariat avec E-TAWJIHI Global a ouvert des portes à des étudiants exceptionnels de régions auxquelles nous n'avions jamais eu accès auparavant.",
            author: "Dr. Emma Rodriguez",
            position: "Directrice des Admissions Internationales",
            institution: "Université de Barcelone"
          }
        ]
      },
      process: {
        title: "Processus de Partenariat Simple",
        subtitle: "Commencez en 4 Étapes Faciles",
        steps: [
          {
            number: "01",
            title: "Soumettre la Candidature",
            description: "Complétez notre candidature de partenariat complète avec les détails et exigences de votre institution."
          },
          {
            number: "02",
            title: "Vérification & Révision",
            description: "Notre équipe examine votre candidature et vérifie les références et accréditations de votre institution."
          },
          {
            number: "03",
            title: "Accord de Partenariat",
            description: "Signez notre accord de partenariat et recevez votre gestionnaire de compte dédié et ressources de support."
          },
          {
            number: "04",
            title: "Mise en Ligne & Croissance",
            description: "Commencez à recevoir des candidatures qualifiées et développez votre corps étudiant international avec notre support."
          }
        ]
      },
      title: "Rejoignez le Réseau E-TAWJIHI Global",
      subtitle: "Connectez-vous avec des milliers d'étudiants dans le monde et mettez en valeur l'excellence de votre établissement",
      steps: {
        basic: "Informations de Base",
        programs: "Programmes & Services",
        accreditation: "Accréditations & Classements", 
        documents: "Documents & Médias"
      },
      form: {
        institutionName: "Nom de l'Établissement",
        institutionType: "Type d'Établissement",
        country: "Pays",
        city: "Ville",
        address: "Adresse",
        website: "Site Web",
        phone: "Numéro de Téléphone",
        email: "Adresse Email",
        representativeName: "Nom du Représentant",
        representativePosition: "Poste/Titre",
        representativeEmail: "Email du Représentant",
        representativePhone: "Téléphone du Représentant",
        programs: "Programmes Proposés",
        studyLevels: "Niveaux d'Études",
        languages: "Langues d'Enseignement",
        tuitionMin: "Frais Minimum (USD)",
        tuitionMax: "Frais Maximum (USD)",
        accreditations: "Accréditations",
        qsRanking: "Classement QS Mondial",
        timesRanking: "Classement Times Higher Education",
        arwuRanking: "Classement ARWU",
        usNewsRanking: "Classement US News",
        logo: "Logo de l'Établissement",
        brochure: "Brochure de l'Établissement",
        additionalDocs: "Documents Supplémentaires"
      },
      services: {
        scholarships: "Programmes de Bourses",
        accommodation: "Hébergement Étudiant",
        careerServices: "Services Carrière",
        languageSupport: "Support Linguistique"
      },
      institutionTypes: [
        "Université",
        "Collège",
        "Institut",
        "Académie",
        "École",
        "Centre de Recherche"
      ],
      studyLevels: [
        "Licence",
        "Master",
        "Doctorat",
        "Certificat",
        "Diplôme",
        "DUT/BTS"
      ],
      languages: [
        "Anglais",
        "Français",
        "Espagnol",
        "Allemand",
        "Italien",
        "Portugais",
        "Arabe",
        "Chinois",
        "Japonais",
        "Coréen"
      ],
      cta: {
        title: "Prêt à Rejoindre Notre Réseau?",
        subtitle: "Commencez à vous connecter avec des étudiants du monde entier dès aujourd'hui",
        button: "Soumettre la Candidature"
      }
    }
  };

  const t = content[language];

  // Auto-play testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % t.testimonials.items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [t.testimonials.items.length]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.institutionName} *
          </label>
          <input
            type="text"
            value={formData.institutionName}
            onChange={(e) => handleInputChange('institutionName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter institution name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.institutionType} *
          </label>
          <select
            value={formData.institutionType}
            onChange={(e) => handleInputChange('institutionType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select institution type</option>
            {t.institutionTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.country} *
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.city} *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter city"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.address} *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter full address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.website}
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.phone}
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.email} *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="contact@institution.com"
          />
        </div>
      </div>

      {/* Representative Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Representative Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.form.representativeName} *
            </label>
            <input
              type="text"
              value={formData.representativeName}
              onChange={(e) => handleInputChange('representativeName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter representative name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.form.representativePosition} *
            </label>
            <input
              type="text"
              value={formData.representativePosition}
              onChange={(e) => handleInputChange('representativePosition', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., International Relations Director"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.form.representativeEmail} *
            </label>
            <input
              type="email"
              value={formData.representativeEmail}
              onChange={(e) => handleInputChange('representativeEmail', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="representative@institution.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.form.representativePhone}
            </label>
            <input
              type="tel"
              value={formData.representativePhone}
              onChange={(e) => handleInputChange('representativePhone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.form.programs} *
        </label>
        <textarea
          value={formData.programs.join(', ')}
          onChange={(e) => handleInputChange('programs', e.target.value.split(', ').filter(p => p.trim()))}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="List programs separated by commas (e.g., Computer Science, Business Administration, Engineering)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t.form.studyLevels} *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {t.studyLevels.map((level, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.studyLevels.includes(level)}
                onChange={(e) => handleArrayChange('studyLevels', level, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t.form.languages} *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {t.languages.map((lang, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.languages.includes(lang)}
                onChange={(e) => handleArrayChange('languages', lang, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{lang}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.tuitionMin}
          </label>
          <input
            type="number"
            value={formData.tuitionRange.min}
            onChange={(e) => handleInputChange('tuitionRange', { ...formData.tuitionRange, min: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.tuitionMax}
          </label>
          <input
            type="number"
            value={formData.tuitionRange.max}
            onChange={(e) => handleInputChange('tuitionRange', { ...formData.tuitionRange, max: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Additional Services
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(t.services).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData[key]}
                onChange={(e) => handleInputChange(key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.form.accreditations}
        </label>
        <textarea
          value={formData.accreditations.join(', ')}
          onChange={(e) => handleInputChange('accreditations', e.target.value.split(', ').filter(a => a.trim()))}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="List accreditations separated by commas (e.g., AACSB, EQUIS, AMBA)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.qsRanking}
          </label>
          <input
            type="number"
            value={formData.rankings.qs}
            onChange={(e) => handleInputChange('rankings', { ...formData.rankings, qs: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.timesRanking}
          </label>
          <input
            type="number"
            value={formData.rankings.times}
            onChange={(e) => handleInputChange('rankings', { ...formData.rankings, times: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.arwuRanking}
          </label>
          <input
            type="number"
            value={formData.rankings.arwu}
            onChange={(e) => handleInputChange('rankings', { ...formData.rankings, arwu: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.usNewsRanking}
          </label>
          <input
            type="number"
            value={formData.rankings.usNews}
            onChange={(e) => handleInputChange('rankings', { ...formData.rankings, usNews: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 250"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.form.logo} *
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">Upload your institution logo</p>
          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload('logo', e.target.files[0])}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Choose File
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.form.brochure}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">Upload institution brochure</p>
          <p className="text-xs text-gray-500">PDF up to 10MB</p>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileUpload('brochure', e.target.files[0])}
            className="hidden"
            id="brochure-upload"
          />
          <label
            htmlFor="brochure-upload"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Choose File
          </label>
        </div>
      </div>
    </motion.div>
  );

  const seoData = {
    title: language === 'en' 
      ? 'Institution Registration - Partner with E-TAWJIHI Global | Educational Institutions' 
      : 'Inscription Institution - Partenaires avec E-TAWJIHI Global | Établissements Éducatifs',
    description: language === 'en'
      ? 'Join E-TAWJIHI Global as an educational institution partner. Connect with international students, expand your reach, and grow your institution with our comprehensive platform.'
      : 'Rejoignez E-TAWJIHI Global en tant que partenaire d\'établissement éducatif. Connectez-vous avec des étudiants internationaux, étendez votre portée et développez votre institution avec notre plateforme complète.',
    keywords: language === 'en'
      ? 'institution registration, educational institution, university partnership, international students, education platform, student recruitment, higher education'
      : 'inscription institution, établissement éducatif, partenariat universitaire, étudiants internationaux, plateforme éducation, recrutement étudiants, enseignement supérieur',
    canonical: 'https://e-tawjihi-global.com/institution-registration',
    ogType: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": language === 'en' ? "Institution Registration" : "Inscription Institution",
      "description": language === 'en' 
        ? "Partner with E-TAWJIHI Global as an educational institution to connect with international students"
        : "Partenaires avec E-TAWJIHI Global en tant qu'établissement éducatif pour se connecter avec des étudiants internationaux",
      "url": "https://e-tawjihi-global.com/institution-registration",
      "mainEntity": {
        "@type": "Service",
        "name": language === 'en' ? "Institution Partnership Program" : "Programme de Partenariat Institutionnel",
        "description": language === 'en' 
          ? "Comprehensive partnership program for educational institutions to connect with international students"
          : "Programme de partenariat complet pour les établissements éducatifs pour se connecter avec des étudiants internationaux",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "E-TAWJIHI Global"
        },
        "serviceType": "Partnership Services",
        "audience": {
          "@type": "Audience",
          "audienceType": "Educational Institutions"
        }
      }
    },
    alternateLanguages: [
      { code: 'en', url: 'https://e-tawjihi-global.com/institution-registration' },
      { code: 'fr', url: 'https://e-tawjihi-global.com/fr/institution-registration' }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO {...seoData} language={language} />
      {/* Header */}
      <HeaderGlobal language={language} setLanguage={setLanguage} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t.hero.title}
            </h1>
            <p className="text-2xl text-blue-600 font-semibold mb-4">
              {t.hero.subtitle}
            </p>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.company.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-6">
              {t.company.subtitle}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              {t.company.description}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {t.company.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Platform Demo Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-8xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === 'en' ? 'See E-TAWJIHI Global in Action' : 'Découvrez E-TAWJIHI Global en Action'}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {language === 'en' ? 'Experience our AI-powered platform and see how we connect students with institutions' : 'Découvrez notre plateforme alimentée par l\'IA et voyez comment nous connectons les étudiants aux institutions'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-white/70 text-sm">E-TAWJIHI Platform</div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Cpu className="w-5 h-5 text-blue-300" />
                      <span className="text-white font-medium">AI Matching Engine</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                      </div>
                      <div className="text-white/70 text-sm">Matching students with programs...</div>
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Database className="w-5 h-5 text-emerald-300" />
                      <span className="text-white font-medium">Global Database</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          className="h-8 bg-white/20 rounded"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 + 1 }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className="w-5 h-5 text-yellow-300" />
                      <span className="text-white font-medium">Real-time Analytics</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-white text-2xl font-bold">95%</div>
                      <div className="flex-1">
                        <div className="text-white/70 text-sm mb-1">Success Rate</div>
                        <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "95%" }}
                            transition={{ duration: 2, delay: 1.5 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {[
                  { icon: <Zap className="w-6 h-6" />, title: language === 'en' ? 'Lightning Fast Matching' : 'Correspondance Ultra-Rapide', desc: language === 'en' ? 'AI processes applications in seconds' : 'L\'IA traite les candidatures en secondes' },
                  { icon: <Shield className="w-6 h-6" />, title: language === 'en' ? 'Secure & Compliant' : 'Sécurisé et Conforme', desc: language === 'en' ? 'GDPR compliant with bank-level security' : 'Conforme RGPD avec sécurité bancaire' },
                  { icon: <Globe className="w-6 h-6" />, title: language === 'en' ? 'Global Reach' : 'Portée Mondiale', desc: language === 'en' ? 'Connect with students from 50+ countries' : 'Connectez-vous avec des étudiants de 50+ pays' },
                  { icon: <BarChart3 className="w-6 h-6" />, title: language === 'en' ? 'Data-Driven Insights' : 'Insights Basés sur les Données', desc: language === 'en' ? 'Real-time analytics and reporting' : 'Analyses et rapports en temps réel' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="flex items-start gap-4 p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                      <p className="text-blue-100 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.values.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.values.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.values.items.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.benefits.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.benefits.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.benefits.items.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Process Flow Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'How Our Partnership Works' : 'Comment Fonctionne Notre Partenariat'}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {language === 'en' ? 'From Application to Success - A Seamless Journey' : 'De la Candidature au Succès - Un Parcours Fluide'}
            </p>
          </motion.div>

          {/* Interactive Flow Diagram */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-blue-200 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: 1,
                  icon: <FileText className="w-8 h-8" />,
                  title: language === 'en' ? 'Submit Application' : 'Soumettre Candidature',
                  description: language === 'en' ? 'Complete our comprehensive partnership form with institution details' : 'Complétez notre formulaire de partenariat avec les détails de l\'institution',
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-50',
                  borderColor: 'border-blue-200'
                },
                {
                  step: 2,
                  icon: <Shield className="w-8 h-8" />,
                  title: language === 'en' ? 'Verification Process' : 'Processus de Vérification',
                  description: language === 'en' ? 'Our team reviews credentials and validates institution accreditation' : 'Notre équipe examine les références et valide l\'accréditation',
                  color: 'from-emerald-500 to-emerald-600',
                  bgColor: 'bg-emerald-50',
                  borderColor: 'border-emerald-200'
                },
                {
                  step: 3,
                  icon: <Handshake className="w-8 h-8" />,
                  title: language === 'en' ? 'Partnership Agreement' : 'Accord de Partenariat',
                  description: language === 'en' ? 'Sign agreement and receive dedicated account manager' : 'Signez l\'accord et recevez un gestionnaire de compte dédié',
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-50',
                  borderColor: 'border-purple-200'
                },
                {
                  step: 4,
                  icon: <Rocket className="w-8 h-8" />,
                  title: language === 'en' ? 'Launch & Growth' : 'Lancement & Croissance',
                  description: language === 'en' ? 'Start receiving applications and grow your international reach' : 'Commencez à recevoir des candidatures et développez votre portée internationale',
                  color: 'from-orange-500 to-orange-600',
                  bgColor: 'bg-orange-50',
                  borderColor: 'border-orange-200'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative group"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.color} text-white flex items-center justify-center font-bold text-sm shadow-lg`}>
                      {item.step}
                    </div>
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`${item.bgColor} ${item.borderColor} border-2 rounded-2xl p-6 pt-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Hover Effect */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
                    />
                  </motion.div>

                  {/* Arrow for mobile */}
                  {index < 3 && (
                    <div className="lg:hidden flex justify-center mt-4">
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Success Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <Clock className="w-6 h-6" />, value: '24h', label: language === 'en' ? 'Average Response Time' : 'Temps de Réponse Moyen' },
              { icon: <CheckCircle className="w-6 h-6" />, value: '98%', label: language === 'en' ? 'Partnership Success Rate' : 'Taux de Réussite des Partenariats' },
              { icon: <TrendingUp className="w-6 h-6" />, value: '300%', label: language === 'en' ? 'Average Growth in Applications' : 'Croissance Moyenne des Candidatures' }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-lg"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                <div className="text-gray-600 font-medium">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.testimonials.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.testimonials.subtitle}
            </p>
            
            {/* Interactive Testimonials Carousel */}
            <div className="relative">
              <div className="overflow-hidden">
                <motion.div
                  className="flex transition-transform duration-500 ease-in-out"
                  animate={{ x: -activeTestimonial * 100 + '%' }}
                >
                  {t.testimonials.items.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto"
                      >
                        <div className="text-center">
                          <Quote className="w-12 h-12 text-blue-600 mx-auto mb-6" />
                          <p className="text-xl text-gray-700 italic mb-8 leading-relaxed max-w-3xl mx-auto">
                            "{testimonial.quote}"
                          </p>
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {testimonial.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-gray-900 text-lg">{testimonial.author}</div>
                              <div className="text-blue-600 font-medium">{testimonial.position}</div>
                              <div className="text-gray-500">{testimonial.institution}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-3 mt-8">
                {t.testimonials.items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial 
                        ? 'bg-blue-600 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setActiveTestimonial(prev => prev === 0 ? t.testimonials.items.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setActiveTestimonial(prev => prev === t.testimonials.items.length - 1 ? 0 : prev + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Auto-play indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>{language === 'en' ? 'Auto-playing testimonials' : 'Témoignages en lecture automatique'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.process.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.process.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.process.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Analytics Dashboard Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-8xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === 'en' ? 'Real-Time Partnership Analytics' : 'Analyses de Partenariat en Temps Réel'}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {language === 'en' ? 'See the impact of partnering with E-TAWJIHI Global' : 'Découvrez l\'impact du partenariat avec E-TAWJIHI Global'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Live Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Live Dashboard</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: language === 'en' ? 'Active Partners' : 'Partenaires Actifs', value: '500+', icon: <Building2 className="w-5 h-5" />, color: 'text-blue-400' },
                  { label: language === 'en' ? 'Applications Today' : 'Candidatures Aujourd\'hui', value: '1,247', icon: <FileText className="w-5 h-5" />, color: 'text-emerald-400' },
                  { label: language === 'en' ? 'Success Rate' : 'Taux de Réussite', value: '95.2%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-yellow-400' },
                  { label: language === 'en' ? 'Avg. Response' : 'Réponse Moy.', value: '2.3h', icon: <Clock className="w-5 h-5" />, color: 'text-purple-400' }
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 rounded-xl p-4 border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={metric.color}>{metric.icon}</div>
                      <span className="text-white/70 text-sm">{metric.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Chart Placeholder */}
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{language === 'en' ? 'Application Trends' : 'Tendances des Candidatures'}</span>
                </div>
                <div className="h-32 flex items-end gap-2">
                  {[65, 80, 45, 90, 75, 95, 85].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-emerald-400 rounded-t"
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-white/60 mt-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </motion.div>

            {/* Interactive Features */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">
                  {language === 'en' ? 'Platform Features' : 'Fonctionnalités de la Plateforme'}
                </h3>
                
                <div className="space-y-4">
                  {[
                    { 
                      icon: <Cpu className="w-6 h-6" />, 
                      title: language === 'en' ? 'AI-Powered Matching' : 'Correspondance IA', 
                      desc: language === 'en' ? 'Advanced algorithms match students with perfect programs' : 'Des algorithmes avancés font correspondre les étudiants aux programmes parfaits',
                      progress: 95
                    },
                    { 
                      icon: <Database className="w-6 h-6" />, 
                      title: language === 'en' ? 'Global Database' : 'Base de Données Mondiale', 
                      desc: language === 'en' ? 'Access to 50+ countries and 1000+ institutions' : 'Accès à 50+ pays et 1000+ institutions',
                      progress: 88
                    },
                    { 
                      icon: <Shield className="w-6 h-6" />, 
                      title: language === 'en' ? 'Security & Compliance' : 'Sécurité et Conformité', 
                      desc: language === 'en' ? 'Bank-level security with GDPR compliance' : 'Sécurité bancaire avec conformité RGPD',
                      progress: 100
                    },
                    { 
                      icon: <Activity className="w-6 h-6" />, 
                      title: language === 'en' ? 'Real-time Analytics' : 'Analyses en Temps Réel', 
                      desc: language === 'en' ? 'Live insights and performance tracking' : 'Insights en direct et suivi des performances',
                      progress: 92
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                          <p className="text-white/70 text-sm mb-3">{feature.desc}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${feature.progress}%` }}
                                transition={{ delay: index * 0.1 + 0.8, duration: 1 }}
                              />
                            </div>
                            <span className="text-white text-sm font-medium">{feature.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                      step <= currentStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step < currentStep ? <CheckCircle2 className="w-6 h-6" /> : step}
                    </div>
                    {step < 4 && (
                      <div className={`w-20 h-1 mx-3 ${
                        step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {Object.values(t.steps)[currentStep - 1]}
                </h3>
                <p className="text-gray-600">
                  Step {currentStep} of 4
                </p>
              </div>

              {/* Form Content */}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Previous
                </button>
                
                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => console.log('Submit:', formData)}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t.cta.button}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default InstitutionRegistration;

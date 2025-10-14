import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Clock,
  Briefcase,
  UserCheck,
  Globe2
} from 'lucide-react';

const ScholarshipSponsorRegistration = () => {
  const [language, setLanguage] = useState('en');
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
  const [animatedStats, setAnimatedStats] = useState(false);
  const [formData, setFormData] = useState({
    // Informations organisation
    organizationName: '',
    organizationType: '',
    contactPerson: '',
    position: '',
    email: '',
    phone: '',
    website: '',
    country: '',
    city: '',
    
    // Informations sur l'organisation
    foundedYear: '',
    mission: '',
    focusAreas: [],
    targetRegions: [],
    
    // Informations sur les bourses
    scholarshipTypes: [],
    fundingAmount: '',
    numberOfScholarships: '',
    duration: '',
    requirements: '',
    
    // Processus de sélection
    selectionCriteria: [],
    applicationProcess: '',
    reviewTimeline: '',
    decisionTimeline: '',
    
    // Documents
    organizationProfile: null,
    financialStatements: null,
    previousScholarships: null,
    additionalDocs: []
  });

  const content = {
    en: {
      hero: {
        title: "Become a Scholarship Sponsor",
        subtitle: "Empower Students' Dreams Through Educational Funding",
        description: "Join our network of scholarship sponsors and make a lasting impact on students' lives. Partner with E-TAWJIHI Global to create opportunities for deserving students worldwide."
      },
      company: {
        title: "About E-TAWJIHI Global Scholarship Program",
        subtitle: "Connecting Sponsors with Deserving Students",
        description: "Our scholarship program connects generous sponsors with talented students in need, creating a bridge between opportunity and aspiration. We facilitate the entire process from application to selection, ensuring transparency and impact.",
        stats: [
          { value: "500+", label: "Active Sponsors", icon: <Award className="w-6 h-6" />, description: "Organizations and individuals" },
          { value: "10,000+", label: "Scholarships Awarded", icon: <GraduationCap className="w-6 h-6" />, description: "Students supported worldwide" },
          { value: "$50M+", label: "Total Funding", icon: <DollarSign className="w-6 h-6" />, description: "Educational investments made" },
          { value: "95%", label: "Success Rate", icon: <Star className="w-6 h-6" />, description: "Student completion rate" }
        ]
      },
      values: {
        title: "Our Scholarship Values",
        subtitle: "What Makes Our Program Special",
        items: [
          {
            icon: <Heart className="w-8 h-8" />,
            title: "Access to Education",
            description: "Breaking down financial barriers to ensure every deserving student has access to quality education and opportunities."
          },
          {
            icon: <Globe className="w-8 h-8" />,
            title: "Global Impact",
            description: "Creating worldwide opportunities for students from diverse backgrounds and regions to pursue their educational dreams."
          },
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Transparency & Trust",
            description: "Ensuring complete transparency in the selection process and maintaining trust between sponsors and students."
          },
          {
            icon: <Target className="w-8 h-8" />,
            title: "Merit-Based Selection",
            description: "Focusing on academic excellence, potential, and need to identify the most deserving scholarship recipients."
          }
        ]
      },
      benefits: {
        title: "Why Partner with E-TAWJIHI Global?",
        subtitle: "Comprehensive Benefits for Scholarship Sponsors",
        items: [
          {
            icon: <Users className="w-8 h-8" />,
            title: "Access to Qualified Students",
            description: "Connect with pre-screened, qualified students from our global network. Our rigorous selection process ensures you reach the most deserving candidates."
          },
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Secure & Transparent Process",
            description: "Complete transparency in the selection process with detailed reporting and regular updates on scholarship recipients' progress."
          },
          {
            icon: <Network className="w-8 h-8" />,
            title: "Global Reach",
            description: "Extend your impact worldwide with access to students from 50+ countries, maximizing your scholarship program's reach and influence."
          },
          {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Impact Tracking",
            description: "Comprehensive reporting and analytics to track the impact of your scholarships, including student progress and success stories."
          },
          {
            icon: <Handshake className="w-8 h-8" />,
            title: "Dedicated Support",
            description: "Personalized support throughout the entire process, from setup to ongoing management of your scholarship program."
          },
          {
            icon: <Award className="w-8 h-8" />,
            title: "Recognition & Branding",
            description: "Enhanced visibility and recognition for your organization through our platform and marketing materials, building your philanthropic brand."
          }
        ]
      },
      sponsorTypes: {
        title: "Types of Scholarship Sponsors",
        subtitle: "Join Our Diverse Network of Partners",
        types: [
          {
            name: "Corporate Sponsors",
            description: "Companies and corporations supporting education",
            examples: ["Fortune 500 Companies", "Tech Giants", "Financial Institutions", "Manufacturing Companies"],
            benefits: ["CSR Impact", "Talent Pipeline", "Brand Recognition", "Tax Benefits"]
          },
          {
            name: "Foundations",
            description: "Non-profit organizations focused on education",
            examples: ["Educational Foundations", "Family Foundations", "Community Foundations", "International NGOs"],
            benefits: ["Mission Alignment", "Global Impact", "Legacy Building", "Networking"]
          },
          {
            name: "Government Agencies",
            description: "Public sector organizations and ministries",
            examples: ["Ministries of Education", "Development Agencies", "Embassies", "Cultural Centers"],
            benefits: ["Policy Impact", "International Relations", "Development Goals", "Diplomatic Relations"]
          },
          {
            name: "Individual Donors",
            description: "Philanthropic individuals and families",
            examples: ["Successful Entrepreneurs", "Retired Professionals", "Alumni", "Philanthropic Families"],
            benefits: ["Personal Impact", "Legacy Creation", "Direct Connection", "Flexible Giving"]
          }
        ]
      },
      selectionProcess: {
        title: "Student Selection Process",
        subtitle: "How We Identify the Most Deserving Students",
        steps: [
          {
            number: "01",
            title: "Application Review",
            description: "Comprehensive review of academic records, financial need, and personal statements to identify qualified candidates."
          },
          {
            number: "02",
            title: "Initial Screening",
            description: "Our team conducts initial screening based on your specific criteria and requirements for the scholarship."
          },
          {
            number: "03",
            title: "Interview Process",
            description: "Shortlisted candidates undergo interviews to assess their motivation, goals, and alignment with your scholarship objectives."
          },
          {
            number: "04",
            title: "Final Selection",
            description: "Final selection based on merit, need, and fit with your organization's values and scholarship goals."
          }
        ]
      },
      criteria: {
        title: "Selection Criteria Options",
        subtitle: "Customize Your Scholarship Requirements",
        categories: [
          {
            name: "Academic Excellence",
            count: "GPA & Test Scores",
            examples: ["Minimum GPA requirements", "Standardized test scores", "Academic achievements", "Research experience"],
            description: "Academic performance and potential"
          },
          {
            name: "Financial Need",
            count: "Economic Background",
            examples: ["Family income verification", "Financial hardship documentation", "Cost of living analysis", "Asset assessment"],
            description: "Demonstrated financial need"
          },
          {
            name: "Field of Study",
            count: "Academic Disciplines",
            examples: ["STEM fields", "Business & Economics", "Arts & Humanities", "Medicine & Health"],
            description: "Specific academic disciplines"
          },
          {
            name: "Geographic Focus",
            count: "Regional Targeting",
            examples: ["Specific countries", "Developing regions", "Rural areas", "Urban centers"],
            description: "Geographic preferences"
          },
          {
            name: "Demographics",
            count: "Student Background",
            examples: ["Gender preferences", "Age requirements", "Minority groups", "First-generation students"],
            description: "Demographic considerations"
          },
          {
            name: "Leadership & Service",
            count: "Extracurricular",
            examples: ["Community service", "Leadership roles", "Volunteer work", "Social impact projects"],
            description: "Leadership and service experience"
          }
        ]
      },
      gettingStarted: {
        title: "Getting Started is Simple",
        subtitle: "Everything You Need to Launch Your Scholarship Program",
        benefits: [
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Flexible Program Design",
            description: "Design your scholarship program with complete flexibility - set your own criteria, amounts, and requirements."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Comprehensive Support",
            description: "Full support throughout the process, from initial setup to ongoing management and student communication."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Transparent Reporting",
            description: "Regular reports on scholarship recipients, their progress, and the impact of your funding."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Secure Platform",
            description: "Safe and secure platform for managing applications, communications, and scholarship disbursements."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Global Network",
            description: "Access to our extensive network of qualified students from around the world."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Impact Measurement",
            description: "Detailed analytics and impact measurement tools to track the success of your scholarship program."
          }
        ]
      },
      testimonials: {
        title: "What Our Sponsors Say",
        subtitle: "Success Stories from Scholarship Partners",
        items: [
          {
            quote: "Partnering with E-TAWJIHI Global has allowed us to reach deserving students worldwide. The transparency and quality of candidates exceeded our expectations.",
            author: "Sarah Johnson",
            position: "CSR Director",
            organization: "TechCorp International",
            results: "50+ students supported, $2M invested"
          },
          {
            quote: "The selection process is thorough and fair. We've seen incredible success stories from our scholarship recipients, making our investment truly meaningful.",
            author: "Dr. Ahmed Hassan",
            position: "Foundation Director",
            organization: "Global Education Foundation",
            results: "100+ scholarships, 95% completion rate"
          },
          {
            quote: "E-TAWJIHI Global made it easy for us to establish our scholarship program. The support and reporting have been exceptional throughout the process.",
            author: "Maria Rodriguez",
            position: "Philanthropy Manager",
            organization: "Future Leaders Foundation",
            results: "25+ students, $500K invested"
          }
        ]
      },
      process: {
        title: "Simple Partnership Process",
        subtitle: "Join Our Network in 4 Easy Steps",
        steps: [
          {
            number: "01",
            title: "Submit Application",
            description: "Complete our sponsor application with details about your organization and scholarship program requirements."
          },
          {
            number: "02",
            title: "Program Design",
            description: "Work with our team to design your scholarship program, including criteria, amounts, and selection process."
          },
          {
            number: "03",
            title: "Student Matching",
            description: "We identify and present qualified candidates that match your scholarship criteria and requirements."
          },
          {
            number: "04",
            title: "Launch & Monitor",
            description: "Launch your scholarship program and monitor student progress with regular updates and reporting."
          }
        ]
      },
      title: "Join E-TAWJIHI Global Scholarship Network",
      subtitle: "Make a lasting impact on students' lives",
      steps: {
        organization: "Organization Information",
        scholarship: "Scholarship Details",
        criteria: "Selection Criteria",
        process: "Selection Process"
      },
      cta: {
        title: "Ready to Make a Difference?",
        subtitle: "Start your scholarship program today and change lives",
        button: "Apply Now"
      }
    },
    fr: {
      hero: {
        title: "Devenez Sponsor de Bourses",
        subtitle: "Donnez Vie aux Rêves des Étudiants par le Financement Éducatif",
        description: "Rejoignez notre réseau de sponsors de bourses et créez un impact durable sur la vie des étudiants. Partenaires avec E-TAWJIHI Global pour créer des opportunités pour les étudiants méritants du monde entier."
      },
      company: {
        title: "À Propos du Programme de Bourses E-TAWJIHI Global",
        subtitle: "Connecter les Sponsors avec les Étudiants Méritants",
        description: "Notre programme de bourses connecte les sponsors généreux avec les étudiants talentueux dans le besoin, créant un pont entre l'opportunité et l'aspiration. Nous facilitons tout le processus de candidature à la sélection, assurant transparence et impact.",
        stats: [
          { value: "500+", label: "Sponsors Actifs", icon: <Award className="w-6 h-6" />, description: "Organisations et individus" },
          { value: "10,000+", label: "Bourses Accordées", icon: <GraduationCap className="w-6 h-6" />, description: "Étudiants soutenus mondialement" },
          { value: "$50M+", label: "Financement Total", icon: <DollarSign className="w-6 h-6" />, description: "Investissements éducatifs réalisés" },
          { value: "95%", label: "Taux de Réussite", icon: <Star className="w-6 h-6" />, description: "Taux d'achèvement des étudiants" }
        ]
      },
      values: {
        title: "Nos Valeurs de Bourses",
        subtitle: "Ce Qui Rend Notre Programme Spécial",
        items: [
          {
            icon: <Heart className="w-8 h-8" />,
            title: "Accès à l'Éducation",
            description: "Briser les barrières financières pour assurer que chaque étudiant méritant ait accès à une éducation de qualité et aux opportunités."
          },
          {
            icon: <Globe className="w-8 h-8" />,
            title: "Impact Mondial",
            description: "Créer des opportunités mondiales pour les étudiants de divers horizons et régions pour poursuivre leurs rêves éducatifs."
          },
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Transparence & Confiance",
            description: "Assurer une transparence complète dans le processus de sélection et maintenir la confiance entre sponsors et étudiants."
          },
          {
            icon: <Target className="w-8 h-8" />,
            title: "Sélection Basée sur le Mérite",
            description: "Se concentrer sur l'excellence académique, le potentiel et le besoin pour identifier les bénéficiaires de bourses les plus méritants."
          }
        ]
      },
      benefits: {
        title: "Pourquoi Partenaires avec E-TAWJIHI Global?",
        subtitle: "Avantages Complets pour les Sponsors de Bourses",
        items: [
          {
            icon: <Users className="w-8 h-8" />,
            title: "Accès aux Étudiants Qualifiés",
            description: "Connectez-vous avec des étudiants pré-sélectionnés et qualifiés de notre réseau mondial. Notre processus de sélection rigoureux garantit que vous atteignez les candidats les plus méritants."
          },
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Processus Sécurisé & Transparent",
            description: "Transparence complète dans le processus de sélection avec rapports détaillés et mises à jour régulières sur les progrès des bénéficiaires de bourses."
          },
          {
            icon: <Network className="w-8 h-8" />,
            title: "Portée Mondiale",
            description: "Étendez votre impact mondialement avec accès aux étudiants de 50+ pays, maximisant la portée et l'influence de votre programme de bourses."
          },
          {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Suivi d'Impact",
            description: "Rapports et analyses complets pour suivre l'impact de vos bourses, incluant les progrès des étudiants et histoires de succès."
          },
          {
            icon: <Handshake className="w-8 h-8" />,
            title: "Support Dédié",
            description: "Support personnalisé tout au long du processus, de la configuration à la gestion continue de votre programme de bourses."
          },
          {
            icon: <Award className="w-8 h-8" />,
            title: "Reconnaissance & Branding",
            description: "Visibilité et reconnaissance améliorées pour votre organisation à travers notre plateforme et matériel marketing, construisant votre marque philanthropique."
          }
        ]
      },
      sponsorTypes: {
        title: "Types de Sponsors de Bourses",
        subtitle: "Rejoignez Notre Réseau Diversifié de Partenaires",
        types: [
          {
            name: "Sponsors Corporatifs",
            description: "Entreprises et corporations soutenant l'éducation",
            examples: ["Entreprises Fortune 500", "Géants Tech", "Institutions Financières", "Entreprises de Fabrication"],
            benefits: ["Impact RSE", "Pipeline de Talents", "Reconnaissance de Marque", "Avantages Fiscaux"]
          },
          {
            name: "Fondations",
            description: "Organisations à but non lucratif axées sur l'éducation",
            examples: ["Fondations Éducatives", "Fondations Familiales", "Fondations Communautaires", "ONG Internationales"],
            benefits: ["Alignement Mission", "Impact Mondial", "Construction d'Héritage", "Réseautage"]
          },
          {
            name: "Agences Gouvernementales",
            description: "Organisations du secteur public et ministères",
            examples: ["Ministères de l'Éducation", "Agences de Développement", "Ambassades", "Centres Culturels"],
            benefits: ["Impact Politique", "Relations Internationales", "Objectifs de Développement", "Relations Diplomatiques"]
          },
          {
            name: "Donateurs Individuels",
            description: "Individus et familles philanthropiques",
            examples: ["Entrepreneurs à Succès", "Professionnels Retraités", "Anciens Étudiants", "Familles Philanthropiques"],
            benefits: ["Impact Personnel", "Création d'Héritage", "Connexion Directe", "Don Flexible"]
          }
        ]
      },
      selectionProcess: {
        title: "Processus de Sélection des Étudiants",
        subtitle: "Comment Nous Identifions les Étudiants les Plus Méritants",
        steps: [
          {
            number: "01",
            title: "Révision de Candidature",
            description: "Révision complète des dossiers académiques, besoins financiers et déclarations personnelles pour identifier les candidats qualifiés."
          },
          {
            number: "02",
            title: "Sélection Initiale",
            description: "Notre équipe effectue une sélection initiale basée sur vos critères spécifiques et exigences pour la bourse."
          },
          {
            number: "03",
            title: "Processus d'Entretien",
            description: "Les candidats présélectionnés passent des entretiens pour évaluer leur motivation, objectifs et alignement avec vos objectifs de bourse."
          },
          {
            number: "04",
            title: "Sélection Finale",
            description: "Sélection finale basée sur le mérite, le besoin et l'adéquation avec les valeurs de votre organisation et objectifs de bourse."
          }
        ]
      },
      criteria: {
        title: "Options de Critères de Sélection",
        subtitle: "Personnalisez Vos Exigences de Bourse",
        categories: [
          {
            name: "Excellence Académique",
            count: "GPA & Scores Tests",
            examples: ["Exigences GPA minimum", "Scores tests standardisés", "Réalisations académiques", "Expérience recherche"],
            description: "Performance et potentiel académiques"
          },
          {
            name: "Besoin Financier",
            count: "Contexte Économique",
            examples: ["Vérification revenus familiaux", "Documentation difficultés financières", "Analyse coût de vie", "Évaluation actifs"],
            description: "Besoin financier démontré"
          },
          {
            name: "Domaine d'Étude",
            count: "Disciplines Académiques",
            examples: ["Domaines STEM", "Business & Économie", "Arts & Humanités", "Médecine & Santé"],
            description: "Disciplines académiques spécifiques"
          },
          {
            name: "Focus Géographique",
            count: "Ciblage Régional",
            examples: ["Pays spécifiques", "Régions en développement", "Zones rurales", "Centres urbains"],
            description: "Préférences géographiques"
          },
          {
            name: "Démographie",
            count: "Contexte Étudiant",
            examples: ["Préférences genre", "Exigences âge", "Groupes minoritaires", "Étudiants première génération"],
            description: "Considérations démographiques"
          },
          {
            name: "Leadership & Service",
            count: "Extrascolaire",
            examples: ["Service communautaire", "Rôles leadership", "Travail bénévole", "Projets impact social"],
            description: "Expérience leadership et service"
          }
        ]
      },
      gettingStarted: {
        title: "Commencer est Simple",
        subtitle: "Tout Ce Dont Vous Avez Besoin pour Lancer Votre Programme de Bourses",
        benefits: [
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Conception de Programme Flexible",
            description: "Concevez votre programme de bourses avec une flexibilité complète - définissez vos propres critères, montants et exigences."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Support Complet",
            description: "Support complet tout au long du processus, de la configuration initiale à la gestion continue et communication avec les étudiants."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Rapports Transparents",
            description: "Rapports réguliers sur les bénéficiaires de bourses, leurs progrès et l'impact de votre financement."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Plateforme Sécurisée",
            description: "Plateforme sûre et sécurisée pour gérer les candidatures, communications et versements de bourses."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Réseau Mondial",
            description: "Accès à notre réseau étendu d'étudiants qualifiés du monde entier."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Mesure d'Impact",
            description: "Outils d'analyses et de mesure d'impact détaillés pour suivre le succès de votre programme de bourses."
          }
        ]
      },
      testimonials: {
        title: "Ce Que Disent Nos Sponsors",
        subtitle: "Histoires de Succès des Partenaires de Bourses",
        items: [
          {
            quote: "Partenaires avec E-TAWJIHI Global nous a permis d'atteindre des étudiants méritants mondialement. La transparence et qualité des candidats ont dépassé nos attentes.",
            author: "Sarah Johnson",
            position: "Directrice RSE",
            organization: "TechCorp International",
            results: "50+ étudiants soutenus, $2M investis"
          },
          {
            quote: "Le processus de sélection est approfondi et équitable. Nous avons vu d'incroyables histoires de succès de nos bénéficiaires de bourses, rendant notre investissement vraiment significatif.",
            author: "Dr. Ahmed Hassan",
            position: "Directeur Fondation",
            organization: "Global Education Foundation",
            results: "100+ bourses, 95% taux d'achèvement"
          },
          {
            quote: "E-TAWJIHI Global a rendu facile l'établissement de notre programme de bourses. Le support et rapports ont été exceptionnels tout au long du processus.",
            author: "Maria Rodriguez",
            position: "Manager Philanthropie",
            organization: "Future Leaders Foundation",
            results: "25+ étudiants, $500K investis"
          }
        ]
      },
      process: {
        title: "Processus de Partenariat Simple",
        subtitle: "Rejoignez Notre Réseau en 4 Étapes Faciles",
        steps: [
          {
            number: "01",
            title: "Soumettre Candidature",
            description: "Complétez notre candidature de sponsor avec détails sur votre organisation et exigences du programme de bourses."
          },
          {
            number: "02",
            title: "Conception de Programme",
            description: "Travaillez avec notre équipe pour concevoir votre programme de bourses, incluant critères, montants et processus de sélection."
          },
          {
            number: "03",
            title: "Appariement d'Étudiants",
            description: "Nous identifions et présentons des candidats qualifiés qui correspondent à vos critères et exigences de bourse."
          },
          {
            number: "04",
            title: "Lancer & Surveiller",
            description: "Lancez votre programme de bourses et surveillez les progrès des étudiants avec mises à jour et rapports réguliers."
          }
        ]
      },
      title: "Rejoignez le Réseau de Bourses E-TAWJIHI Global",
      subtitle: "Créez un impact durable sur la vie des étudiants",
      steps: {
        organization: "Informations Organisation",
        scholarship: "Détails de Bourse",
        criteria: "Critères de Sélection",
        process: "Processus de Sélection"
      },
      cta: {
        title: "Prêt à Faire une Différence?",
        subtitle: "Commencez votre programme de bourses aujourd'hui et changez des vies",
        button: "Postuler Maintenant"
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
            {language === 'en' ? 'Organization Name' : 'Nom de l\'Organisation'}
          </label>
          <input
            type="text"
            value={formData.organizationName}
            onChange={(e) => handleInputChange('organizationName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter organization name' : 'Entrez le nom de l\'organisation'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Organization Type' : 'Type d\'Organisation'}
          </label>
          <select
            value={formData.organizationType}
            onChange={(e) => handleInputChange('organizationType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'en' ? 'Select type' : 'Sélectionnez le type'}</option>
            <option value="Corporate">Corporate</option>
            <option value="Foundation">Foundation</option>
            <option value="Government Agency">Government Agency</option>
            <option value="Individual Donor">Individual Donor</option>
            <option value="NGO">NGO</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Contact Person' : 'Personne de Contact'}
          </label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter contact person name' : 'Entrez le nom de la personne de contact'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Position' : 'Poste'}
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter position/title' : 'Entrez le poste/titre'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Email Address' : 'Adresse Email'}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter email address' : 'Entrez l\'adresse email'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Phone Number' : 'Numéro de Téléphone'}
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter phone number' : 'Entrez le numéro de téléphone'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Website' : 'Site Web'}
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter website URL' : 'Entrez l\'URL du site web'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Country' : 'Pays'}
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter country' : 'Entrez le pays'}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'City' : 'Ville'}
        </label>
        <input
          type="text"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Enter city' : 'Entrez la ville'}
        />
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Founded Year' : 'Année de Fondation'}
          </label>
          <input
            type="number"
            value={formData.foundedYear}
            onChange={(e) => handleInputChange('foundedYear', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter founded year' : 'Entrez l\'année de fondation'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Funding Amount' : 'Montant du Financement'}
          </label>
          <input
            type="text"
            value={formData.fundingAmount}
            onChange={(e) => handleInputChange('fundingAmount', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'e.g., $10,000 per student' : 'ex: $10,000 par étudiant'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Number of Scholarships' : 'Nombre de Bourses'}
          </label>
          <input
            type="number"
            value={formData.numberOfScholarships}
            onChange={(e) => handleInputChange('numberOfScholarships', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter number of scholarships' : 'Entrez le nombre de bourses'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Duration' : 'Durée'}
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'e.g., 4 years, 1 year' : 'ex: 4 ans, 1 an'}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Organization Mission' : 'Mission de l\'Organisation'}
        </label>
        <textarea
          value={formData.mission}
          onChange={(e) => handleInputChange('mission', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Describe your organization\'s mission' : 'Décrivez la mission de votre organisation'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Focus Areas' : 'Domaines d\'Intérêt'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'STEM', 'Business', 'Arts', 'Medicine', 'Education', 'Social Sciences',
            'Engineering', 'Law', 'Agriculture', 'Environmental', 'Technology', 'Humanities'
          ].map((area) => (
            <label key={area} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.focusAreas.includes(area)}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...formData.focusAreas, area]
                    : formData.focusAreas.filter(a => a !== area);
                  handleInputChange('focusAreas', newAreas);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Target Regions' : 'Régions Cibles'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'North America', 'Europe', 'Asia', 'Africa', 'South America', 'Middle East',
            'Oceania', 'Caribbean', 'Central America', 'Global'
          ].map((region) => (
            <label key={region} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.targetRegions.includes(region)}
                onChange={(e) => {
                  const newRegions = e.target.checked
                    ? [...formData.targetRegions, region]
                    : formData.targetRegions.filter(r => r !== region);
                  handleInputChange('targetRegions', newRegions);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{region}</span>
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
          {language === 'en' ? 'Scholarship Types' : 'Types de Bourses'}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Merit-based', 'Need-based', 'Academic Excellence', 'Leadership',
            'Community Service', 'Research', 'Athletic', 'Creative Arts',
            'Minority Support', 'First Generation', 'International', 'Graduate'
          ].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.scholarshipTypes.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...formData.scholarshipTypes, type]
                    : formData.scholarshipTypes.filter(t => t !== type);
                  handleInputChange('scholarshipTypes', newTypes);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Selection Criteria' : 'Critères de Sélection'}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Academic Performance', 'Financial Need', 'Leadership Skills', 'Community Service',
            'Extracurricular Activities', 'Personal Statement', 'Letters of Recommendation',
            'Interview Performance', 'Field of Study', 'Geographic Location', 'Demographics', 'Career Goals'
          ].map((criteria) => (
            <label key={criteria} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.selectionCriteria.includes(criteria)}
                onChange={(e) => {
                  const newCriteria = e.target.checked
                    ? [...formData.selectionCriteria, criteria]
                    : formData.selectionCriteria.filter(c => c !== criteria);
                  handleInputChange('selectionCriteria', newCriteria);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{criteria}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Requirements' : 'Exigences'}
        </label>
        <textarea
          value={formData.requirements}
          onChange={(e) => handleInputChange('requirements', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Describe specific requirements for scholarship recipients' : 'Décrivez les exigences spécifiques pour les bénéficiaires de bourses'}
        />
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
          {language === 'en' ? 'Application Process' : 'Processus de Candidature'}
        </label>
        <textarea
          value={formData.applicationProcess}
          onChange={(e) => handleInputChange('applicationProcess', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Describe your application process' : 'Décrivez votre processus de candidature'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Review Timeline' : 'Délai de Révision'}
          </label>
          <input
            type="text"
            value={formData.reviewTimeline}
            onChange={(e) => handleInputChange('reviewTimeline', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'e.g., 2-4 weeks' : 'ex: 2-4 semaines'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Decision Timeline' : 'Délai de Décision'}
          </label>
          <input
            type="text"
            value={formData.decisionTimeline}
            onChange={(e) => handleInputChange('decisionTimeline', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'e.g., 6-8 weeks' : 'ex: 6-8 semaines'}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Organization Profile' : 'Profil de l\'Organisation'}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {language === 'en' ? 'Upload organization profile or brochure' : 'Téléchargez le profil ou brochure de l\'organisation'}
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleInputChange('organizationProfile', e.target.files[0])}
            className="hidden"
            id="profile-upload"
          />
          <label
            htmlFor="profile-upload"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            {language === 'en' ? 'Choose File' : 'Choisir un Fichier'}
          </label>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
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
                  className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium mb-2">{stat.label}</div>
                  <div className="text-sm text-blue-600 font-semibold">{stat.description}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-blue-50 to-emerald-50">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
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

      {/* Sponsor Types Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.sponsorTypes.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.sponsorTypes.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {t.sponsorTypes.types.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {type.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {type.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      {language === 'en' ? 'Examples:' : 'Exemples:'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {type.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-center text-sm text-gray-600">
                          <Star className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      {language === 'en' ? 'Benefits:' : 'Avantages:'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {type.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Selection Process Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.selectionProcess.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.selectionProcess.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.selectionProcess.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
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

      {/* Criteria Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.criteria.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.criteria.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.criteria.categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                      {category.count}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {category.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="flex items-center text-sm text-gray-700">
                        <Star className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.gettingStarted.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.gettingStarted.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.gettingStarted.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
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

      {/* Testimonials Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-blue-50 to-emerald-50">
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
                              <div className="text-gray-500 mb-2">{testimonial.organization}</div>
                              <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                                {testimonial.results}
                              </div>
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
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
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

      {/* Application Form Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-blue-50 to-emerald-50">
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
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
            >
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                      step <= currentStep 
                        ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step < currentStep ? <CheckCircle2 className="w-6 h-6" /> : step}
                    </div>
                    {step < 4 && (
                      <div className={`w-20 h-1 mx-3 ${
                        step < currentStep ? 'bg-gradient-to-r from-blue-600 to-emerald-600' : 'bg-gray-200'
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
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => console.log('Submit:', formData)}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-colors flex items-center gap-2 font-medium"
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

export default ScholarshipSponsorRegistration;

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
  Clock
} from 'lucide-react';

const EducationAgentRegistration = () => {
  const [language, setLanguage] = useState('en');
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
  const [animatedStats, setAnimatedStats] = useState(false);
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    website: '',
    linkedin: '',
    
    // Informations professionnelles
    companyName: '',
    companyType: '',
    yearsExperience: '',
    specialization: '',
    languages: [],
    certifications: [],
    
    // Services offerts
    services: [],
    targetCountries: [],
    studentVolume: '',
    commissionExpectation: '',
    
    // Documents
    resume: null,
    businessLicense: null,
    additionalDocs: []
  });

  const content = {
    en: {
      hero: {
        title: "Join E-TAWJIHI Global as an Education Agent",
        subtitle: "The Leading Platform Connecting Education Agents with Global Opportunities",
        description: "Partner with 500+ prestigious institutions worldwide and help students achieve their international education dreams. E-TAWJIHI Global empowers education agents with cutting-edge tools and comprehensive support."
      },
      company: {
        title: "About E-TAWJIHI Global Agent Network",
        subtitle: "Empowering Education Agents Through Technology",
        description: "Our agent network spans across 50+ countries, connecting qualified education agents with top-tier institutions. Our AI-powered platform and comprehensive support services ensure successful outcomes for both agents and students.",
        stats: [
          { value: "2,500+", label: "Active Agents", icon: <Users className="w-6 h-6" />, description: "Earning $50K+ annually" },
          { value: "500+", label: "Partner Institutions", icon: <Building2 className="w-6 h-6" />, description: "Including Ivy League & Russell Group" },
          { value: "50+", label: "Countries", icon: <Globe className="w-6 h-6" />, description: "Global reach & opportunities" },
          { value: "98%", label: "Success Rate", icon: <TrendingUp className="w-6 h-6" />, description: "Application acceptance rate" }
        ]
      },
      values: {
        title: "Our Agent Values",
        subtitle: "What Makes Our Network Special",
        items: [
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Trust & Integrity",
            description: "We maintain the highest standards of integrity in all our agent partnerships, ensuring complete transparency and ethical practices."
          },
          {
            icon: <Target className="w-8 h-8" />,
            title: "Student Success",
            description: "Our primary focus is student success, ensuring every agent helps students find the perfect educational opportunities."
          },
          {
            icon: <Network className="w-8 h-8" />,
            title: "Global Network",
            description: "Access to a worldwide network of institutions and opportunities, breaking down geographical barriers for students."
          },
          {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Innovation & Support",
            description: "Cutting-edge tools, training, and ongoing support to help agents excel in their profession."
          }
        ]
      },
      benefits: {
        title: "Why Join Our Agent Network?",
        subtitle: "Comprehensive Benefits for Education Agents",
        items: [
          {
            icon: <Users className="w-8 h-8" />,
            title: "Premium Institution Portfolio",
            description: "Access 500+ top-tier institutions including Ivy League, Russell Group, and world-renowned universities. From community colleges to research universities, expand your portfolio with institutions students dream of attending."
          },
          {
            icon: <DollarSign className="w-8 h-8" />,
            title: "Competitive Commission Structure",
            description: "Earn 5-20% commissions on application fees. Tier-based rewards: Bronze (5%), Silver (8%), Gold (12%), Platinum (16%), Diamond (20%). Plus quarterly bonuses up to $10,000 for top performers."
          },
          {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Advanced Analytics & Market Intelligence",
            description: "Real-time insights on application trends, success rates, and market opportunities. Track your performance with detailed dashboards and receive personalized recommendations to maximize your earnings."
          },
          {
            icon: <Zap className="w-8 h-8" />,
            title: "AI-Powered Application Processing",
            description: "Our intelligent platform processes applications 10x faster than traditional methods. Automated document verification, instant status updates, and smart matching algorithms increase your success rate by 40%."
          },
          {
            icon: <Handshake className="w-8 h-8" />,
            title: "Dedicated Success Manager",
            description: "Get a personal success manager who provides training, marketing materials, and ongoing support. Access to exclusive webinars, industry insights, and direct communication with institution representatives."
          },
          {
            icon: <Rocket className="w-8 h-8" />,
            title: "Scalable Business Growth",
            description: "Start small and scale rapidly. From individual agent to agency owner, our platform grows with you. Access to white-label solutions, team management tools, and enterprise features for established agencies."
          }
        ]
      },
      commissionStructure: {
        title: "Transparent Commission Structure",
        subtitle: "Earn More as You Grow",
        tiers: [
          {
            name: "Bronze",
            commission: "5%",
            requirements: "0-10 students/year",
            benefits: ["Basic support", "All universities", "Monthly reports"],
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200"
          },
          {
            name: "Silver",
            commission: "8%",
            requirements: "11-25 students/year",
            benefits: ["Priority support", "All universities", "Weekly reports", "Marketing materials"],
            color: "from-gray-400 to-gray-500",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200"
          },
          {
            name: "Gold",
            commission: "12%",
            requirements: "26-50 students/year",
            benefits: ["Dedicated manager", "All universities", "Real-time analytics", "Training sessions"],
            color: "from-yellow-500 to-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200"
          },
          {
            name: "Platinum",
            commission: "16%",
            requirements: "51-100 students/year",
            benefits: ["VIP support", "All universities", "Custom marketing", "Quarterly bonuses"],
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
          },
          {
            name: "Diamond",
            commission: "20%",
            requirements: "100+ students/year",
            benefits: ["Executive support", "All universities", "White-label options", "Annual retreat"],
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
          }
        ]
      },
      institutionPortfolio: {
        title: "Complete University Access",
        subtitle: "Access to All Universities Worldwide",
        categories: [
          {
            name: "All Universities",
            count: "500+",
            examples: ["Harvard University", "Oxford University", "University of Tokyo", "Sorbonne University"],
            description: "Complete access to all universities in our network"
          },
          {
            name: "UK Universities",
            count: "150+",
            examples: ["Oxford University", "Cambridge University", "Imperial College", "LSE"],
            description: "All UK universities including Russell Group"
          },
          {
            name: "European Universities",
            count: "200+",
            examples: ["Sorbonne University", "ETH Zurich", "TU Delft", "University of Helsinki"],
            description: "Comprehensive European university network"
          },
          {
            name: "Asian Universities",
            count: "100+",
            examples: ["University of Tokyo", "Seoul National University", "NUS Singapore", "HKU"],
            description: "Top Asian universities and institutions"
          },
          {
            name: "Middle East & Africa",
            count: "50+",
            examples: ["American University of Dubai", "University of Cape Town", "AUC Cairo", "King Saud University"],
            description: "Leading institutions in MENA and Africa"
          },
          {
            name: "Specialized Programs",
            count: "1000+",
            examples: ["MBA Programs", "Engineering", "Medicine", "Arts & Design"],
            description: "All academic programs and specializations"
          }
        ]
      },
      gettingStarted: {
        title: "Getting Started is Easy",
        subtitle: "Everything You Need to Launch Your Agent Business",
        benefits: [
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "No Upfront Costs",
            description: "Join completely free. No registration fees, no monthly subscriptions. You only pay when you succeed."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Instant Access",
            description: "Get immediate access to our platform and institution database. Start working with students within 24 hours."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Complete Training",
            description: "Free comprehensive training program covering application processes, best practices, and platform features."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Marketing Support",
            description: "Professional marketing materials, website templates, and social media content to promote your services."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Legal Compliance",
            description: "All necessary legal documentation and compliance support to operate as an education agent in your region."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "24/7 Support",
            description: "Round-the-clock support team to help you with any questions or technical issues."
          }
        ]
      },
      scalingBenefits: {
        title: "Scale Your Business to New Heights",
        subtitle: "Advanced Tools and Features for Growing Agencies",
        features: [
          {
            icon: <Users className="w-8 h-8" />,
            title: "Team Management",
            description: "Add team members, assign roles, and track performance. Manage multiple agents under your agency with advanced reporting and analytics."
          },
          {
            icon: <Building2 className="w-8 h-8" />,
            title: "White-Label Solutions",
            description: "Brand our platform with your agency's identity. Custom domains, logos, and branding to maintain your professional image."
          },
          {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Advanced Analytics",
            description: "Comprehensive business intelligence with custom reports, ROI tracking, and predictive analytics to optimize your operations."
          },
          {
            icon: <Globe className="w-8 h-8" />,
            title: "Global Expansion",
            description: "Access to institutions in 50+ countries. Expand your business internationally with our global network and local support."
          },
          {
            icon: <Award className="w-8 h-8" />,
            title: "Exclusive Partnerships",
            description: "Direct partnerships with top institutions, priority application processing, and exclusive scholarship opportunities for your students."
          },
          {
            icon: <Rocket className="w-8 h-8" />,
            title: "Enterprise Features",
            description: "API access, custom integrations, dedicated infrastructure, and priority support for large-scale operations."
          }
        ]
      },
      testimonials: {
        title: "What Our Agents Say",
        subtitle: "Success Stories from Top Education Agents",
        items: [
          {
            quote: "E-TAWJIHI Global has transformed my business. I've increased my monthly income by 300% since joining. The 16% commission rate and access to all universities has been game-changing.",
            author: "Sarah Johnson",
            position: "Platinum Agent",
            institution: "Global Education Solutions",
            results: "300% income increase, 150+ students placed"
          },
          {
            quote: "The platform's AI matching system has increased my success rate to 95%. I'm now earning $15,000+ monthly in commissions with the Diamond tier benefits.",
            author: "Michael Chen",
            position: "Diamond Agent",
            institution: "International Pathways",
            results: "95% success rate, $15,000+ monthly earnings"
          },
          {
            quote: "Partnering with E-TAWJIHI Global opened doors to all universities I never had access to. My agency now serves 200+ students annually with 20% commission rates.",
            author: "Emma Rodriguez",
            position: "Gold Agent",
            institution: "Study Abroad Experts",
            results: "200+ students annually, 20% commission rate"
          }
        ]
      },
      process: {
        title: "Simple Agent Registration Process",
        subtitle: "Get Started in 4 Easy Steps",
        steps: [
          {
            number: "01",
            title: "Submit Application",
            description: "Complete our comprehensive agent application with your professional details and experience."
          },
          {
            number: "02",
            title: "Verification & Review",
            description: "Our team reviews your application and verifies your credentials and business license."
          },
          {
            number: "03",
            title: "Agent Agreement",
            description: "Sign our agent agreement and receive your dedicated account manager and support resources."
          },
          {
            number: "04",
            title: "Start & Grow",
            description: "Begin connecting students with institutions and grow your business with our support."
          }
        ]
      },
      title: "Join E-TAWJIHI Global Agent Network",
      subtitle: "Connect with top institutions worldwide and help students achieve their dreams",
      steps: {
        personal: "Personal Information",
        professional: "Professional Details", 
        services: "Services & Specialization",
        documents: "Documents & Verification"
      },
      cta: {
        title: "Ready to Join Our Agent Network?",
        subtitle: "Start connecting students with institutions worldwide today",
        button: "Submit Application"
      }
    },
    fr: {
      hero: {
        title: "Rejoignez E-TAWJIHI Global en tant qu'Agent Éducatif",
        subtitle: "La Plateforme Leader Connectant les Agents Éducatifs aux Opportunités Mondiales",
        description: "Partenaire avec 500+ institutions prestigieuses dans le monde et aidez les étudiants à réaliser leurs rêves d'éducation internationale. E-TAWJIHI Global autonomise les agents éducatifs avec des outils de pointe et un support complet."
      },
      company: {
        title: "À Propos du Réseau d'Agents E-TAWJIHI Global",
        subtitle: "Autonomiser les Agents Éducatifs par la Technologie",
        description: "Notre réseau d'agents s'étend sur plus de 50 pays, connectant des agents éducatifs qualifiés aux institutions de premier plan. Notre plateforme alimentée par l'IA et nos services de support complets garantissent des résultats réussis pour les agents et les étudiants.",
        stats: [
          { value: "2,500+", label: "Agents Actifs", icon: <Users className="w-6 h-6" />, description: "Gagnant 50K$+ annuellement" },
          { value: "500+", label: "Institutions Partenaires", icon: <Building2 className="w-6 h-6" />, description: "Incluant Ivy League & Russell Group" },
          { value: "50+", label: "Pays", icon: <Globe className="w-6 h-6" />, description: "Portée mondiale & opportunités" },
          { value: "98%", label: "Taux de Réussite", icon: <TrendingUp className="w-6 h-6" />, description: "Taux d'acceptation des candidatures" }
        ]
      },
      values: {
        title: "Nos Valeurs d'Agent",
        subtitle: "Ce Qui Rend Notre Réseau Spécial",
        items: [
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Confiance & Intégrité",
            description: "Nous maintenons les plus hauts standards d'intégrité dans tous nos partenariats d'agents, garantissant une transparence complète et des pratiques éthiques."
          },
          {
            icon: <Target className="w-8 h-8" />,
            title: "Succès des Étudiants",
            description: "Notre objectif principal est le succès des étudiants, garantissant que chaque agent aide les étudiants à trouver les opportunités éducatives parfaites."
          },
          {
            icon: <Network className="w-8 h-8" />,
            title: "Réseau Mondial",
            description: "Accès à un réseau mondial d'institutions et d'opportunités, brisant les barrières géographiques pour les étudiants."
          },
          {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Innovation & Support",
            description: "Outils de pointe, formation et support continu pour aider les agents à exceller dans leur profession."
          }
        ]
      },
      benefits: {
        title: "Pourquoi Rejoindre Notre Réseau d'Agents?",
        subtitle: "Avantages Complets pour les Agents Éducatifs",
        items: [
          {
            icon: <Users className="w-8 h-8" />,
            title: "Portefeuille d'Institutions Premium",
            description: "Accédez à 500+ institutions de premier plan incluant Ivy League, Russell Group et universités de renommée mondiale. Des collèges communautaires aux universités de recherche, élargissez votre portefeuille avec des institutions dont rêvent les étudiants."
          },
          {
            icon: <DollarSign className="w-8 h-8" />,
            title: "Structure de Commission Compétitive",
            description: "Gagnez 5-20% de commissions sur les frais de candidature. Récompenses par paliers : Bronze (5%), Argent (8%), Or (12%), Platine (16%), Diamant (20%). Plus des bonus trimestriels jusqu'à 10,000$ pour les meilleurs performeurs."
          },
          {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Analyses Avancées & Intelligence de Marché",
            description: "Insights en temps réel sur les tendances de candidature, taux de succès et opportunités de marché. Suivez vos performances avec des tableaux de bord détaillés et recevez des recommandations personnalisées pour maximiser vos gains."
          },
          {
            icon: <Zap className="w-8 h-8" />,
            title: "Traitement de Candidature Alimenté par l'IA",
            description: "Notre plateforme intelligente traite les candidatures 10x plus rapidement que les méthodes traditionnelles. Vérification automatisée des documents, mises à jour de statut instantanées et algorithmes de correspondance intelligents augmentent votre taux de succès de 40%."
          },
          {
            icon: <Handshake className="w-8 h-8" />,
            title: "Gestionnaire de Succès Dédié",
            description: "Obtenez un gestionnaire de succès personnel qui fournit formation, matériel marketing et support continu. Accès à des webinaires exclusifs, insights industriels et communication directe avec les représentants d'institutions."
          },
          {
            icon: <Rocket className="w-8 h-8" />,
            title: "Croissance d'Entreprise Évolutive",
            description: "Commencez petit et évoluez rapidement. D'agent individuel à propriétaire d'agence, notre plateforme évolue avec vous. Accès aux solutions white-label, outils de gestion d'équipe et fonctionnalités d'entreprise pour les agences établies."
          }
        ]
      },
      commissionStructure: {
        title: "Structure de Commission Transparente",
        subtitle: "Gagnez Plus en Grandissant",
        tiers: [
          {
            name: "Bronze",
            commission: "5%",
            requirements: "0-10 étudiants/an",
            benefits: ["Support de base", "Toutes les universités", "Rapports mensuels"],
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200"
          },
          {
            name: "Argent",
            commission: "8%",
            requirements: "11-25 étudiants/an",
            benefits: ["Support prioritaire", "Toutes les universités", "Rapports hebdomadaires", "Matériel marketing"],
            color: "from-gray-400 to-gray-500",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200"
          },
          {
            name: "Or",
            commission: "12%",
            requirements: "26-50 étudiants/an",
            benefits: ["Gestionnaire dédié", "Toutes les universités", "Analyses temps réel", "Sessions de formation"],
            color: "from-yellow-500 to-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200"
          },
          {
            name: "Platine",
            commission: "16%",
            requirements: "51-100 étudiants/an",
            benefits: ["Support VIP", "Toutes les universités", "Marketing personnalisé", "Bonus trimestriels"],
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
          },
          {
            name: "Diamant",
            commission: "20%",
            requirements: "100+ étudiants/an",
            benefits: ["Support exécutif", "Toutes les universités", "Options white-label", "Retraite annuelle"],
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
          }
        ]
      },
      institutionPortfolio: {
        title: "Accès Complet aux Universités",
        subtitle: "Accès à Toutes les Universités dans le Monde",
        categories: [
          {
            name: "Toutes les Universités",
            count: "500+",
            examples: ["Harvard University", "Oxford University", "University of Tokyo", "Sorbonne University"],
            description: "Accès complet à toutes les universités de notre réseau"
          },
          {
            name: "Universités UK",
            count: "150+",
            examples: ["Oxford University", "Cambridge University", "Imperial College", "LSE"],
            description: "Toutes les universités UK incluant Russell Group"
          },
          {
            name: "Universités Européennes",
            count: "200+",
            examples: ["Sorbonne University", "ETH Zurich", "TU Delft", "University of Helsinki"],
            description: "Réseau complet d'universités européennes"
          },
          {
            name: "Universités Asiatiques",
            count: "100+",
            examples: ["University of Tokyo", "Seoul National University", "NUS Singapore", "HKU"],
            description: "Top universités et institutions asiatiques"
          },
          {
            name: "Moyen-Orient & Afrique",
            count: "50+",
            examples: ["American University of Dubai", "University of Cape Town", "AUC Cairo", "King Saud University"],
            description: "Institutions leaders en MENA et Afrique"
          },
          {
            name: "Programmes Spécialisés",
            count: "1000+",
            examples: ["Programmes MBA", "Ingénierie", "Médecine", "Arts & Design"],
            description: "Tous les programmes académiques et spécialisations"
          }
        ]
      },
      gettingStarted: {
        title: "Commencer est Facile",
        subtitle: "Tout Ce Dont Vous Avez Besoin pour Lancer Votre Entreprise d'Agent",
        benefits: [
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Aucun Coût Initial",
            description: "Rejoignez complètement gratuit. Aucun frais d'inscription, aucun abonnement mensuel. Vous ne payez que quand vous réussissez."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Accès Instantané",
            description: "Obtenez un accès immédiat à notre plateforme et base de données d'institutions. Commencez à travailler avec des étudiants dans les 24 heures."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Formation Complète",
            description: "Programme de formation gratuit et complet couvrant les processus de candidature, meilleures pratiques et fonctionnalités de la plateforme."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Support Marketing",
            description: "Matériel marketing professionnel, modèles de site web et contenu de médias sociaux pour promouvoir vos services."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Conformité Légale",
            description: "Toute la documentation légale nécessaire et support de conformité pour opérer comme agent éducatif dans votre région."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Support 24/7",
            description: "Équipe de support disponible 24h/24 pour vous aider avec toute question ou problème technique."
          }
        ]
      },
      scalingBenefits: {
        title: "Évoluez Votre Entreprise vers de Nouveaux Sommets",
        subtitle: "Outils et Fonctionnalités Avancés pour les Agences en Croissance",
        features: [
          {
            icon: <Users className="w-8 h-8" />,
            title: "Gestion d'Équipe",
            description: "Ajoutez des membres d'équipe, assignez des rôles et suivez les performances. Gérez plusieurs agents sous votre agence avec rapports et analyses avancés."
          },
          {
            icon: <Building2 className="w-8 h-8" />,
            title: "Solutions White-Label",
            description: "Marquez notre plateforme avec l'identité de votre agence. Domaines personnalisés, logos et branding pour maintenir votre image professionnelle."
          },
          {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Analyses Avancées",
            description: "Intelligence d'entreprise complète avec rapports personnalisés, suivi ROI et analyses prédictives pour optimiser vos opérations."
          },
          {
            icon: <Globe className="w-8 h-8" />,
            title: "Expansion Mondiale",
            description: "Accès aux institutions dans 50+ pays. Évoluez votre entreprise internationalement avec notre réseau mondial et support local."
          },
          {
            icon: <Award className="w-8 h-8" />,
            title: "Partenariats Exclusifs",
            description: "Partenariats directs avec les top institutions, traitement prioritaire des candidatures et opportunités de bourses exclusives pour vos étudiants."
          },
          {
            icon: <Rocket className="w-8 h-8" />,
            title: "Fonctionnalités d'Entreprise",
            description: "Accès API, intégrations personnalisées, infrastructure dédiée et support prioritaire pour les opérations à grande échelle."
          }
        ]
      },
      testimonials: {
        title: "Ce Que Disent Nos Agents",
        subtitle: "Histoires de Succès des Meilleurs Agents Éducatifs",
        items: [
          {
            quote: "E-TAWJIHI Global a transformé mon entreprise. J'ai augmenté mes revenus mensuels de 300% depuis mon adhésion. Le taux de commission de 16% et l'accès à toutes les universités ont été révolutionnaires.",
            author: "Sarah Johnson",
            position: "Agent Platine",
            institution: "Global Education Solutions",
            results: "300% d'augmentation de revenus, 150+ étudiants placés"
          },
          {
            quote: "Le système de correspondance IA de la plateforme a augmenté mon taux de succès à 95%. Je gagne maintenant plus de 15,000$ mensuellement en commissions avec les avantages du niveau Diamant.",
            author: "Michael Chen",
            position: "Agent Diamant",
            institution: "International Pathways",
            results: "95% de taux de succès, 15,000$+ de gains mensuels"
          },
          {
            quote: "Le partenariat avec E-TAWJIHI Global a ouvert des portes à toutes les universités auxquelles je n'avais jamais eu accès. Mon agence sert maintenant 200+ étudiants annuellement avec des taux de commission de 20%.",
            author: "Emma Rodriguez",
            position: "Agent Or",
            institution: "Study Abroad Experts",
            results: "200+ étudiants annuellement, taux de commission de 20%"
          }
        ]
      },
      process: {
        title: "Processus d'Enregistrement d'Agent Simple",
        subtitle: "Commencez en 4 Étapes Faciles",
        steps: [
          {
            number: "01",
            title: "Soumettre la Candidature",
            description: "Complétez notre candidature d'agent complète avec vos détails professionnels et votre expérience."
          },
          {
            number: "02",
            title: "Vérification & Révision",
            description: "Notre équipe examine votre candidature et vérifie vos références et licence commerciale."
          },
          {
            number: "03",
            title: "Accord d'Agent",
            description: "Signez notre accord d'agent et recevez votre gestionnaire de compte dédié et ressources de support."
          },
          {
            number: "04",
            title: "Commencer & Croître",
            description: "Commencez à connecter les étudiants aux institutions et développez votre entreprise avec notre support."
          }
        ]
      },
      title: "Rejoignez le Réseau d'Agents E-TAWJIHI Global",
      subtitle: "Connectez-vous aux meilleures institutions mondiales et aidez les étudiants à réaliser leurs rêves",
      steps: {
        personal: "Informations Personnelles",
        professional: "Détails Professionnels",
        services: "Services & Spécialisation",
        documents: "Documents & Vérification"
      },
      cta: {
        title: "Prêt à Rejoindre Notre Réseau d'Agents?",
        subtitle: "Commencez à connecter les étudiants aux institutions du monde entier dès aujourd'hui",
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
            {language === 'en' ? 'First Name' : 'Prénom'}
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter your first name' : 'Entrez votre prénom'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Last Name' : 'Nom'}
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter your last name' : 'Entrez votre nom'}
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
            placeholder={language === 'en' ? 'Enter your email' : 'Entrez votre email'}
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
            placeholder={language === 'en' ? 'Enter your phone number' : 'Entrez votre numéro de téléphone'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Country' : 'Pays'}
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'en' ? 'Select your country' : 'Sélectionnez votre pays'}</option>
            <option value="Morocco">Morocco</option>
            <option value="France">France</option>
            <option value="Canada">Canada</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
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
            placeholder={language === 'en' ? 'Enter your city' : 'Entrez votre ville'}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Address' : 'Adresse'}
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Enter your full address' : 'Entrez votre adresse complète'}
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
            {language === 'en' ? 'Company Name' : 'Nom de l\'Entreprise'}
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter your company name' : 'Entrez le nom de votre entreprise'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Company Type' : 'Type d\'Entreprise'}
          </label>
          <select
            value={formData.companyType}
            onChange={(e) => handleInputChange('companyType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'en' ? 'Select company type' : 'Sélectionnez le type d\'entreprise'}</option>
            <option value="Individual">Individual Agent</option>
            <option value="Agency">Education Agency</option>
            <option value="Consultancy">Consultancy Firm</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Years of Experience' : 'Années d\'Expérience'}
          </label>
          <select
            value={formData.yearsExperience}
            onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'en' ? 'Select experience level' : 'Sélectionnez le niveau d\'expérience'}</option>
            <option value="0-1">0-1 years</option>
            <option value="2-5">2-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Specialization' : 'Spécialisation'}
          </label>
          <select
            value={formData.specialization}
            onChange={(e) => handleInputChange('specialization', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'en' ? 'Select specialization' : 'Sélectionnez la spécialisation'}</option>
            <option value="Undergraduate">Undergraduate Programs</option>
            <option value="Graduate">Graduate Programs</option>
            <option value="Language">Language Courses</option>
            <option value="Vocational">Vocational Training</option>
            <option value="All">All Programs</option>
          </select>
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
            placeholder={language === 'en' ? 'Enter your website URL' : 'Entrez l\'URL de votre site web'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Enter your LinkedIn profile' : 'Entrez votre profil LinkedIn'}
          />
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
          {language === 'en' ? 'Services Offered' : 'Services Offerts'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { value: 'Application Assistance', label: language === 'en' ? 'Application Assistance' : 'Assistance aux Candidatures' },
            { value: 'Visa Support', label: language === 'en' ? 'Visa Support' : 'Support Visa' },
            { value: 'Documentation', label: language === 'en' ? 'Documentation' : 'Documentation' },
            { value: 'Pre-departure', label: language === 'en' ? 'Pre-departure' : 'Pré-départ' },
            { value: 'Post-arrival', label: language === 'en' ? 'Post-arrival' : 'Post-arrivée' },
            { value: 'Career Guidance', label: language === 'en' ? 'Career Guidance' : 'Orientation Carrière' }
          ].map((service) => (
            <label key={service.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.services.includes(service.value)}
                onChange={(e) => {
                  const newServices = e.target.checked
                    ? [...formData.services, service.value]
                    : formData.services.filter(s => s !== service.value);
                  handleInputChange('services', newServices);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{service.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Target Countries' : 'Pays Cibles'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'UK', 'France', 'China', 'South Korea', 'Japan', 'Poland', 'Spain', 'Turkey',
            'Cyprus', 'Malaysia', 'Italy', 'Finland', 'Hungary', 'Netherlands', 'United Arab Emirates', 'Australia', 'Ireland'
          ].map((country) => (
            <label key={country} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.targetCountries.includes(country)}
                onChange={(e) => {
                  const newCountries = e.target.checked
                    ? [...formData.targetCountries, country]
                    : formData.targetCountries.filter(c => c !== country);
                  handleInputChange('targetCountries', newCountries);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{country}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Expected Student Volume (per year)' : 'Volume d\'Étudiants Attendu (par an)'}
          </label>
          <select
            value={formData.studentVolume}
            onChange={(e) => handleInputChange('studentVolume', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'en' ? 'Select volume' : 'Sélectionnez le volume'}</option>
            <option value="1-10">1-10 students</option>
            <option value="11-25">11-25 students</option>
            <option value="26-50">26-50 students</option>
            <option value="51-100">51-100 students</option>
            <option value="100+">100+ students</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Commission Expectation' : 'Attente de Commission'}
          </label>
          <select
            value={formData.commissionExpectation}
            onChange={(e) => handleInputChange('commissionExpectation', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'en' ? 'Select expectation' : 'Sélectionnez l\'attente'}</option>
            <option value="5-10%">5-10%</option>
            <option value="10-15%">10-15%</option>
            <option value="15-20%">15-20%</option>
            <option value="20%+">20%+</option>
            <option value="Negotiable">Negotiable</option>
          </select>
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
          {language === 'en' ? 'Resume/CV' : 'CV/Resume'}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {language === 'en' ? 'Upload your resume or CV' : 'Téléchargez votre CV ou resume'}
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleInputChange('resume', e.target.files[0])}
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            {language === 'en' ? 'Choose File' : 'Choisir un Fichier'}
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Business License' : 'Licence Commerciale'}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {language === 'en' ? 'Upload your business license' : 'Téléchargez votre licence commerciale'}
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleInputChange('businessLicense', e.target.files[0])}
            className="hidden"
            id="license-upload"
          />
          <label
            htmlFor="license-upload"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            {language === 'en' ? 'Choose File' : 'Choisir un Fichier'}
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Certifications (Optional)' : 'Certifications (Optionnel)'}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {language === 'en' ? 'Upload any relevant certifications' : 'Téléchargez toute certification pertinente'}
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={(e) => handleInputChange('certifications', Array.from(e.target.files))}
            className="hidden"
            id="cert-upload"
          />
          <label
            htmlFor="cert-upload"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            {language === 'en' ? 'Choose Files' : 'Choisir des Fichiers'}
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

      {/* Commission Structure Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.commissionStructure.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.commissionStructure.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {t.commissionStructure.tiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${tier.bgColor} ${tier.borderColor} border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${tier.color}`}></div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl`}>
                      {tier.commission}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{tier.requirements}</p>
                    
                    <div className="space-y-2">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'en' ? 'Additional Benefits' : 'Avantages Supplémentaires'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">$10,000</div>
                  <p className="text-gray-600">
                    {language === 'en' ? 'Quarterly Bonuses for Top Performers' : 'Bonus Trimestriels pour les Meilleurs Performeurs'}
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">40%</div>
                  <p className="text-gray-600">
                    {language === 'en' ? 'Higher Success Rate with AI Platform' : 'Taux de Succès Plus Élevé avec la Plateforme IA'}
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
                  <p className="text-gray-600">
                    {language === 'en' ? 'Average Application Processing Time' : 'Temps Moyen de Traitement des Candidatures'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Institution Portfolio Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.institutionPortfolio.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.institutionPortfolio.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.institutionPortfolio.categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-shadow"
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
                        <Building2 className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
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
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-emerald-50 to-blue-50">
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
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
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

      {/* Scaling Benefits Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.scalingBenefits.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-12">
              {t.scalingBenefits.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.scalingBenefits.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
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
                              <div className="text-gray-500 mb-2">{testimonial.institution}</div>
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

export default EducationAgentRegistration;

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

const StudentAmbassadorRegistration = () => {
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
    age: '',
    nationality: '',
    currentCountry: '',
    city: '',
    
    // Informations académiques
    currentUniversity: '',
    currentProgram: '',
    yearOfStudy: '',
    expectedGraduation: '',
    gpa: '',
    languages: [],
    
    // Expérience et compétences
    leadershipExperience: '',
    socialMediaPresence: '',
    communicationSkills: '',
    interests: [],
    
    // Motivation et objectifs
    motivation: '',
    goals: '',
    timeCommitment: '',
    preferredActivities: [],
    
    // Documents
    resume: null,
    transcript: null,
    recommendationLetter: null,
    additionalDocs: []
  });

  const content = {
    en: {
      hero: {
        title: "Become a Student Ambassador",
        subtitle: "Represent E-TAWJIHI Global and Help Fellow Students Achieve Their Dreams",
        description: "Join our global network of student ambassadors and make a difference in your community. Share your study abroad experience, guide prospective students, and earn rewards while building valuable skills."
      },
      company: {
        title: "About E-TAWJIHI Global Student Ambassador Program",
        subtitle: "Empowering Students to Help Students",
        description: "Our student ambassador program connects current international students with prospective ones, creating a supportive community where experience meets aspiration. Ambassadors share their journey, provide guidance, and help students make informed decisions about their education abroad.",
        stats: [
          { value: "1,200+", label: "Active Ambassadors", icon: <Users className="w-6 h-6" />, description: "Students from 50+ countries" },
          { value: "15,000+", label: "Students Helped", icon: <GraduationCap className="w-6 h-6" />, description: "Successful applications guided" },
          { value: "50+", label: "Countries", icon: <Globe className="w-6 h-6" />, description: "Global ambassador network" },
          { value: "95%", label: "Satisfaction Rate", icon: <Star className="w-6 h-6" />, description: "Student feedback score" }
        ]
      },
      values: {
        title: "Our Ambassador Values",
        subtitle: "What Makes Our Program Special",
        items: [
          {
            icon: <Heart className="w-8 h-8" />,
            title: "Peer Support",
            description: "Students helping students through shared experiences, creating authentic connections and genuine guidance."
          },
          {
            icon: <Globe className="w-8 h-8" />,
            title: "Global Community",
            description: "Join a worldwide network of ambassadors representing diverse cultures, backgrounds, and academic fields."
          },
          {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Personal Growth",
            description: "Develop leadership, communication, and networking skills while making a positive impact on others' lives."
          },
          {
            icon: <Award className="w-8 h-8" />,
            title: "Recognition & Rewards",
            description: "Earn certificates, exclusive opportunities, and monetary rewards for your valuable contributions."
          }
        ]
      },
      benefits: {
        title: "Why Become a Student Ambassador?",
        subtitle: "Comprehensive Benefits for Student Leaders",
        items: [
          {
            icon: <DollarSign className="w-8 h-8" />,
            title: "Earn While You Help",
            description: "Earn 5-20% commissions on application fees, plus monthly stipends and performance bonuses. Top ambassadors earn up to $1,000 monthly."
          },
          {
            icon: <Network className="w-8 h-8" />,
            title: "Build Your Network",
            description: "Connect with students worldwide, university representatives, and industry professionals. Expand your professional network globally."
          },
          {
            icon: <Award className="w-8 h-8" />,
            title: "Leadership Development",
            description: "Develop essential skills: public speaking, event management, social media marketing, and cross-cultural communication."
          },
          {
            icon: <Rocket className="w-8 h-8" />,
            title: "Career Opportunities",
            description: "Access exclusive internships, job opportunities, and mentorship programs with our partner companies and universities."
          },
          {
            icon: <Globe className="w-8 h-8" />,
            title: "Global Recognition",
            description: "Featured on our platform, social media, and marketing materials. Build your personal brand as a student leader."
          },
          {
            icon: <Heart className="w-8 h-8" />,
            title: "Make a Difference",
            description: "Help fellow students achieve their dreams while building meaningful relationships and creating positive impact."
          }
        ]
      },
      ambassadorLevels: {
        title: "Ambassador Levels & Rewards",
        subtitle: "Grow Your Impact and Earnings",
        levels: [
          {
            name: "Bronze",
            requirements: "0-10 referrals/year",
            rewards: ["5% commission", "Basic training", "Certificate"],
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200"
          },
          {
            name: "Silver",
            requirements: "11-25 referrals/year",
            rewards: ["8% commission", "Advanced training", "Monthly stipend $100", "Social media kit"],
            color: "from-gray-400 to-gray-500",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200"
          },
          {
            name: "Gold",
            requirements: "26-50 referrals/year",
            rewards: ["12% commission", "Leadership training", "Monthly stipend $200", "Event opportunities"],
            color: "from-yellow-500 to-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200"
          },
          {
            name: "Platinum",
            requirements: "51-100 referrals/year",
            rewards: ["16% commission", "Mentorship program", "Monthly stipend $300", "Conference invitations"],
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
          },
          {
            name: "Diamond",
            requirements: "100+ referrals/year",
            rewards: ["20% commission", "Executive mentorship", "Monthly stipend $500", "International opportunities"],
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
          }
        ]
      },
      activities: {
        title: "Ambassador Activities",
        subtitle: "How You Can Make an Impact",
        categories: [
          {
            name: "Peer Mentoring",
            count: "1-on-1",
            examples: ["Virtual consultations", "Application guidance", "Cultural insights", "Study tips"],
            description: "Direct support for prospective students"
          },
          {
            name: "Content Creation",
            count: "Social Media",
            examples: ["Instagram stories", "YouTube videos", "Blog posts", "TikTok content"],
            description: "Share your study abroad journey"
          },
          {
            name: "Events & Webinars",
            count: "Live Sessions",
            examples: ["University presentations", "Q&A sessions", "Cultural events", "Study fairs"],
            description: "Engage with student communities"
          },
          {
            name: "Campus Outreach",
            count: "Local Events",
            examples: ["University visits", "Student fairs", "Workshops", "Networking events"],
            description: "Represent E-TAWJIHI on campus"
          },
          {
            name: "Community Building",
            count: "Online Groups",
            examples: ["WhatsApp groups", "Discord servers", "Facebook communities", "LinkedIn networks"],
            description: "Build supportive student communities"
          },
          {
            name: "Feedback & Insights",
            count: "Market Research",
            examples: ["Student surveys", "Trend analysis", "University reviews", "Program feedback"],
            description: "Help improve our services"
          }
        ]
      },
      gettingStarted: {
        title: "Getting Started is Easy",
        subtitle: "Everything You Need to Begin Your Ambassador Journey",
        benefits: [
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "No Experience Required",
            description: "We provide comprehensive training and support. Your passion for helping others is all you need to start."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Flexible Schedule",
            description: "Work around your studies. Commit as little as 5 hours per week and scale up based on your availability."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Complete Training",
            description: "Free training program covering communication skills, platform features, and best practices for student support."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Marketing Materials",
            description: "Professional templates, graphics, and content ideas to help you create engaging social media posts and presentations."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Ongoing Support",
            description: "Dedicated ambassador manager, regular check-ins, and 24/7 support to help you succeed in your role."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Performance Tracking",
            description: "Easy-to-use dashboard to track your referrals, earnings, and impact. Set goals and celebrate achievements."
          }
        ]
      },
      testimonials: {
        title: "What Our Ambassadors Say",
        subtitle: "Success Stories from Student Leaders",
        items: [
          {
            quote: "Being an E-TAWJIHI ambassador has been life-changing. I've helped 50+ students and earned $3,000 with 20% commission while developing amazing leadership skills.",
            author: "Sarah Ahmed",
            position: "Diamond Ambassador",
            institution: "University of Toronto",
            results: "50+ students helped, 20% commission"
          },
          {
            quote: "The training and support are incredible. I've grown so much as a person and built connections that will last a lifetime.",
            author: "Marco Rodriguez",
            position: "Platinum Ambassador",
            institution: "University of Barcelona",
            results: "30+ referrals, 16% commission"
          },
          {
            quote: "I love helping fellow students achieve their dreams. The rewards are great, but the satisfaction of making a difference is even better.",
            author: "Priya Patel",
            position: "Gold Ambassador",
            institution: "University of Melbourne",
            results: "25+ students guided, 12% commission"
          }
        ]
      },
      process: {
        title: "Simple Ambassador Application Process",
        subtitle: "Join Our Community in 4 Easy Steps",
        steps: [
          {
            number: "01",
            title: "Submit Application",
            description: "Complete our ambassador application with your academic details and motivation for joining our program."
          },
          {
            number: "02",
            title: "Interview & Selection",
            description: "Participate in a friendly interview to discuss your goals and ensure the program is a good fit for you."
          },
          {
            number: "03",
            title: "Training & Onboarding",
            description: "Complete our comprehensive training program and get access to all ambassador resources and tools."
          },
          {
            number: "04",
            title: "Start Making Impact",
            description: "Begin helping students, earning rewards, and building your network as an E-TAWJIHI ambassador."
          }
        ]
      },
      title: "Join E-TAWJIHI Global Student Ambassador Program",
      subtitle: "Make a difference while building your future",
      steps: {
        personal: "Personal Information",
        academic: "Academic Details",
        experience: "Experience & Skills",
        motivation: "Motivation & Goals"
      },
      cta: {
        title: "Ready to Become a Student Ambassador?",
        subtitle: "Start making a difference in students' lives today",
        button: "Apply Now"
      }
    },
    fr: {
      hero: {
        title: "Devenez Ambassadeur Étudiant",
        subtitle: "Représentez E-TAWJIHI Global et Aidez Vos Pairs à Réaliser Leurs Rêves",
        description: "Rejoignez notre réseau mondial d'ambassadeurs étudiants et faites une différence dans votre communauté. Partagez votre expérience d'études à l'étranger, guidez les étudiants potentiels, et gagnez des récompenses tout en développant des compétences précieuses."
      },
      company: {
        title: "À Propos du Programme d'Ambassadeurs Étudiants E-TAWJIHI Global",
        subtitle: "Autonomiser les Étudiants pour Aider les Étudiants",
        description: "Notre programme d'ambassadeurs étudiants connecte les étudiants internationaux actuels avec les potentiels, créant une communauté de soutien où l'expérience rencontre l'aspiration. Les ambassadeurs partagent leur parcours, fournissent des conseils, et aident les étudiants à prendre des décisions éclairées sur leur éducation à l'étranger.",
        stats: [
          { value: "1,200+", label: "Ambassadeurs Actifs", icon: <Users className="w-6 h-6" />, description: "Étudiants de 50+ pays" },
          { value: "15,000+", label: "Étudiants Aidés", icon: <GraduationCap className="w-6 h-6" />, description: "Candidatures guidées avec succès" },
          { value: "50+", label: "Pays", icon: <Globe className="w-6 h-6" />, description: "Réseau d'ambassadeurs mondial" },
          { value: "95%", label: "Taux de Satisfaction", icon: <Star className="w-6 h-6" />, description: "Score de feedback des étudiants" }
        ]
      },
      values: {
        title: "Nos Valeurs d'Ambassadeur",
        subtitle: "Ce Qui Rend Notre Programme Spécial",
        items: [
          {
            icon: <Heart className="w-8 h-8" />,
            title: "Soutien par les Pairs",
            description: "Étudiants aidant les étudiants à travers des expériences partagées, créant des connexions authentiques et des conseils sincères."
          },
          {
            icon: <Globe className="w-8 h-8" />,
            title: "Communauté Mondiale",
            description: "Rejoignez un réseau mondial d'ambassadeurs représentant des cultures, origines et domaines académiques divers."
          },
          {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Croissance Personnelle",
            description: "Développez des compétences de leadership, communication et réseautage tout en ayant un impact positif sur la vie des autres."
          },
          {
            icon: <Award className="w-8 h-8" />,
            title: "Reconnaissance & Récompenses",
            description: "Gagnez des certificats, opportunités exclusives et récompenses monétaires pour vos contributions précieuses."
          }
        ]
      },
      benefits: {
        title: "Pourquoi Devenir Ambassadeur Étudiant?",
        subtitle: "Avantages Complets pour les Leaders Étudiants",
        items: [
          {
            icon: <DollarSign className="w-8 h-8" />,
            title: "Gagnez en Aidant",
            description: "Gagnez 5-20% de commissions sur les frais de candidature, plus des allocations mensuelles et bonus de performance. Les meilleurs ambassadeurs gagnent jusqu'à 1,000$ mensuellement."
          },
          {
            icon: <Network className="w-8 h-8" />,
            title: "Construisez Votre Réseau",
            description: "Connectez-vous avec des étudiants du monde entier, représentants d'universités et professionnels de l'industrie. Élargissez votre réseau professionnel mondialement."
          },
          {
            icon: <Award className="w-8 h-8" />,
            title: "Développement du Leadership",
            description: "Développez des compétences essentielles : prise de parole en public, gestion d'événements, marketing des médias sociaux et communication interculturelle."
          },
          {
            icon: <Rocket className="w-8 h-8" />,
            title: "Opportunités de Carrière",
            description: "Accédez à des stages exclusifs, opportunités d'emploi et programmes de mentorat avec nos entreprises et universités partenaires."
          },
          {
            icon: <Globe className="w-8 h-8" />,
            title: "Reconnaissance Mondiale",
            description: "Mis en avant sur notre plateforme, médias sociaux et matériel marketing. Construisez votre marque personnelle en tant que leader étudiant."
          },
          {
            icon: <Heart className="w-8 h-8" />,
            title: "Faites une Différence",
            description: "Aidez vos pairs étudiants à réaliser leurs rêves tout en construisant des relations significatives et en créant un impact positif."
          }
        ]
      },
      ambassadorLevels: {
        title: "Niveaux d'Ambassadeur & Récompenses",
        subtitle: "Développez Votre Impact et Vos Gains",
        levels: [
          {
            name: "Bronze",
            requirements: "0-10 références/an",
            rewards: ["5% commission", "Formation de base", "Certificat"],
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200"
          },
          {
            name: "Argent",
            requirements: "11-25 références/an",
            rewards: ["8% commission", "Formation avancée", "Allocation mensuelle 100$", "Kit médias sociaux"],
            color: "from-gray-400 to-gray-500",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200"
          },
          {
            name: "Or",
            requirements: "26-50 références/an",
            rewards: ["12% commission", "Formation leadership", "Allocation mensuelle 200$", "Opportunités d'événements"],
            color: "from-yellow-500 to-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200"
          },
          {
            name: "Platine",
            requirements: "51-100 références/an",
            rewards: ["16% commission", "Programme de mentorat", "Allocation mensuelle 300$", "Invitations conférences"],
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
          },
          {
            name: "Diamant",
            requirements: "100+ références/an",
            rewards: ["20% commission", "Mentorat exécutif", "Allocation mensuelle 500$", "Opportunités internationales"],
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
          }
        ]
      },
      activities: {
        title: "Activités d'Ambassadeur",
        subtitle: "Comment Vous Pouvez Avoir un Impact",
        categories: [
          {
            name: "Mentorat par les Pairs",
            count: "1-à-1",
            examples: ["Consultations virtuelles", "Conseils candidature", "Insights culturels", "Conseils d'étude"],
            description: "Support direct pour les étudiants potentiels"
          },
          {
            name: "Création de Contenu",
            count: "Médias Sociaux",
            examples: ["Stories Instagram", "Vidéos YouTube", "Articles de blog", "Contenu TikTok"],
            description: "Partagez votre parcours d'études à l'étranger"
          },
          {
            name: "Événements & Webinaires",
            count: "Sessions Live",
            examples: ["Présentations universitaires", "Sessions Q&A", "Événements culturels", "Salons d'études"],
            description: "Engagez avec les communautés étudiantes"
          },
          {
            name: "Outreach Campus",
            count: "Événements Locaux",
            examples: ["Visites universitaires", "Salons étudiants", "Ateliers", "Événements réseautage"],
            description: "Représentez E-TAWJIHI sur le campus"
          },
          {
            name: "Construction Communauté",
            count: "Groupes En Ligne",
            examples: ["Groupes WhatsApp", "Serveurs Discord", "Communautés Facebook", "Réseaux LinkedIn"],
            description: "Construisez des communautés étudiantes de soutien"
          },
          {
            name: "Feedback & Insights",
            count: "Recherche Marché",
            examples: ["Sondages étudiants", "Analyse tendances", "Avis universités", "Feedback programmes"],
            description: "Aidez à améliorer nos services"
          }
        ]
      },
      gettingStarted: {
        title: "Commencer est Facile",
        subtitle: "Tout Ce Dont Vous Avez Besoin pour Commencer Votre Parcours d'Ambassadeur",
        benefits: [
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Aucune Expérience Requise",
            description: "Nous fournissons une formation complète et un support. Votre passion pour aider les autres est tout ce dont vous avez besoin pour commencer."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Horaires Flexibles",
            description: "Travaillez autour de vos études. Engagez-vous aussi peu que 5 heures par semaine et évoluez selon votre disponibilité."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Formation Complète",
            description: "Programme de formation gratuit couvrant les compétences de communication, fonctionnalités de plateforme et meilleures pratiques pour le support étudiant."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Matériel Marketing",
            description: "Modèles professionnels, graphiques et idées de contenu pour vous aider à créer des posts de médias sociaux et présentations engageants."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Support Continu",
            description: "Gestionnaire d'ambassadeur dédié, vérifications régulières et support 24/7 pour vous aider à réussir dans votre rôle."
          },
          {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Suivi de Performance",
            description: "Tableau de bord facile à utiliser pour suivre vos références, gains et impact. Fixez des objectifs et célébrez les réalisations."
          }
        ]
      },
      testimonials: {
        title: "Ce Que Disent Nos Ambassadeurs",
        subtitle: "Histoires de Succès des Leaders Étudiants",
        items: [
          {
            quote: "Être ambassadeur E-TAWJIHI a été transformateur. J'ai aidé 50+ étudiants et gagné 3,000$ avec 20% de commission tout en développant d'incroyables compétences de leadership.",
            author: "Sarah Ahmed",
            position: "Ambassadeur Diamant",
            institution: "University of Toronto",
            results: "50+ étudiants aidés, 20% commission"
          },
          {
            quote: "La formation et le support sont incroyables. J'ai tellement grandi en tant que personne et construit des connexions qui dureront toute une vie.",
            author: "Marco Rodriguez",
            position: "Ambassadeur Platine",
            institution: "University of Barcelona",
            results: "30+ références, 16% commission"
          },
          {
            quote: "J'adore aider mes pairs étudiants à réaliser leurs rêves. Les récompenses sont géniales, mais la satisfaction de faire une différence est encore meilleure.",
            author: "Priya Patel",
            position: "Ambassadeur Or",
            institution: "University of Melbourne",
            results: "25+ étudiants guidés, 12% commission"
          }
        ]
      },
      process: {
        title: "Processus de Candidature d'Ambassadeur Simple",
        subtitle: "Rejoignez Notre Communauté en 4 Étapes Faciles",
        steps: [
          {
            number: "01",
            title: "Soumettre Candidature",
            description: "Complétez notre candidature d'ambassadeur avec vos détails académiques et motivation pour rejoindre notre programme."
          },
          {
            number: "02",
            title: "Entretien & Sélection",
            description: "Participez à un entretien amical pour discuter de vos objectifs et vous assurer que le programme vous convient."
          },
          {
            number: "03",
            title: "Formation & Intégration",
            description: "Complétez notre programme de formation complet et accédez à toutes les ressources et outils d'ambassadeur."
          },
          {
            number: "04",
            title: "Commencer à Avoir un Impact",
            description: "Commencez à aider les étudiants, gagner des récompenses et construire votre réseau en tant qu'ambassadeur E-TAWJIHI."
          }
        ]
      },
      title: "Rejoignez le Programme d'Ambassadeurs Étudiants E-TAWJIHI Global",
      subtitle: "Faites une différence tout en construisant votre avenir",
      steps: {
        personal: "Informations Personnelles",
        academic: "Détails Académiques",
        experience: "Expérience & Compétences",
        motivation: "Motivation & Objectifs"
      },
      cta: {
        title: "Prêt à Devenir Ambassadeur Étudiant?",
        subtitle: "Commencez à faire une différence dans la vie des étudiants dès aujourd'hui",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Age' : 'Âge'}
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Your age' : 'Votre âge'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Nationality' : 'Nationalité'}
          </label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Your nationality' : 'Votre nationalité'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Current Country' : 'Pays Actuel'}
          </label>
          <input
            type="text"
            value={formData.currentCountry}
            onChange={(e) => handleInputChange('currentCountry', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Where you study' : 'Où vous étudiez'}
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
          placeholder={language === 'en' ? 'Enter your city' : 'Entrez votre ville'}
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
            {language === 'en' ? 'Current University' : 'Université Actuelle'}
          </label>
          <input
            type="text"
            value={formData.currentUniversity}
            onChange={(e) => handleInputChange('currentUniversity', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Your university name' : 'Nom de votre université'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Current Program' : 'Programme Actuel'}
          </label>
          <input
            type="text"
            value={formData.currentProgram}
            onChange={(e) => handleInputChange('currentProgram', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Your program of study' : 'Votre programme d\'études'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Year of Study' : 'Année d\'Étude'}
          </label>
          <select
            value={formData.yearOfStudy}
            onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'en' ? 'Select year' : 'Sélectionnez l\'année'}</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Graduate">Graduate</option>
            <option value="PhD">PhD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Expected Graduation' : 'Diplôme Attendu'}
          </label>
          <input
            type="month"
            value={formData.expectedGraduation}
            onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'GPA' : 'Moyenne'}
          </label>
          <input
            type="text"
            value={formData.gpa}
            onChange={(e) => handleInputChange('gpa', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={language === 'en' ? 'e.g., 3.5/4.0' : 'ex: 3.5/4.0'}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Languages Spoken' : 'Langues Parlées'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Arabic', 'Chinese',
            'Japanese', 'Korean', 'Russian', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish'
          ].map((language) => (
            <label key={language} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.languages.includes(language)}
                onChange={(e) => {
                  const newLanguages = e.target.checked
                    ? [...formData.languages, language]
                    : formData.languages.filter(l => l !== language);
                  handleInputChange('languages', newLanguages);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{language}</span>
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
          {language === 'en' ? 'Leadership Experience' : 'Expérience de Leadership'}
        </label>
        <textarea
          value={formData.leadershipExperience}
          onChange={(e) => handleInputChange('leadershipExperience', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Describe your leadership roles, clubs, organizations, etc.' : 'Décrivez vos rôles de leadership, clubs, organisations, etc.'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Social Media Presence' : 'Présence sur les Médias Sociaux'}
        </label>
        <textarea
          value={formData.socialMediaPresence}
          onChange={(e) => handleInputChange('socialMediaPresence', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={language === 'en' ? 'List your social media accounts and follower counts' : 'Listez vos comptes de médias sociaux et nombre d\'abonnés'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Communication Skills' : 'Compétences de Communication'}
        </label>
        <textarea
          value={formData.communicationSkills}
          onChange={(e) => handleInputChange('communicationSkills', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Describe your communication and presentation skills' : 'Décrivez vos compétences de communication et présentation'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Interests & Hobbies' : 'Intérêts & Loisirs'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Technology', 'Sports', 'Music', 'Art', 'Travel', 'Photography', 'Writing', 'Volunteering',
            'Cooking', 'Gaming', 'Fashion', 'Fitness', 'Reading', 'Dancing', 'Theater', 'Languages'
          ].map((interest) => (
            <label key={interest} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={(e) => {
                  const newInterests = e.target.checked
                    ? [...formData.interests, interest]
                    : formData.interests.filter(i => i !== interest);
                  handleInputChange('interests', newInterests);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{interest}</span>
            </label>
          ))}
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
          {language === 'en' ? 'Why do you want to become an ambassador?' : 'Pourquoi voulez-vous devenir ambassadeur?'}
        </label>
        <textarea
          value={formData.motivation}
          onChange={(e) => handleInputChange('motivation', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Explain your motivation and passion for helping other students' : 'Expliquez votre motivation et passion pour aider d\'autres étudiants'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'What are your goals as an ambassador?' : 'Quels sont vos objectifs en tant qu\'ambassadeur?'}
        </label>
        <textarea
          value={formData.goals}
          onChange={(e) => handleInputChange('goals', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Describe what you hope to achieve and contribute' : 'Décrivez ce que vous espérez accomplir et contribuer'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Time Commitment' : 'Engagement de Temps'}
        </label>
        <select
          value={formData.timeCommitment}
          onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{language === 'en' ? 'Select time commitment' : 'Sélectionnez l\'engagement de temps'}</option>
          <option value="5-10 hours/week">5-10 hours/week</option>
          <option value="10-15 hours/week">10-15 hours/week</option>
          <option value="15-20 hours/week">15-20 hours/week</option>
          <option value="20+ hours/week">20+ hours/week</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Preferred Activities' : 'Activités Préférées'}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Peer Mentoring', 'Social Media Content', 'Events & Webinars', 'Campus Outreach',
            'Community Building', 'Market Research', 'Video Creation', 'Blog Writing'
          ].map((activity) => (
            <label key={activity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferredActivities.includes(activity)}
                onChange={(e) => {
                  const newActivities = e.target.checked
                    ? [...formData.preferredActivities, activity]
                    : formData.preferredActivities.filter(a => a !== activity);
                  handleInputChange('preferredActivities', newActivities);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{activity}</span>
            </label>
          ))}
        </div>
      </div>

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
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HeaderGlobal language={language} setLanguage={setLanguage} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t.hero.title}
            </h1>
            <p className="text-2xl text-purple-600 font-semibold mb-4">
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
            <p className="text-xl text-purple-600 font-semibold mb-6">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium mb-2">{stat.label}</div>
                  <div className="text-sm text-purple-600 font-semibold">{stat.description}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.values.title}
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-12">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
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
            <p className="text-xl text-purple-600 font-semibold mb-12">
              {t.benefits.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.benefits.items.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
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

      {/* Ambassador Levels Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.ambassadorLevels.title}
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-12">
              {t.ambassadorLevels.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {t.ambassadorLevels.levels.map((level, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${level.bgColor} ${level.borderColor} border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${level.color}`}></div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${level.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl`}>
                      {level.name[0]}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{level.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{level.requirements}</p>
                    
                    <div className="space-y-2">
                      {level.rewards.map((reward, rewardIndex) => (
                        <div key={rewardIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{reward}</span>
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

      {/* Activities Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.activities.title}
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-12">
              {t.activities.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.activities.categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 hover:shadow-lg transition-shadow"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                      {category.count}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {category.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="flex items-center text-sm text-gray-700">
                        <Star className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
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
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.gettingStarted.title}
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-12">
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
                  <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pink-600">
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
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.testimonials.title}
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-12">
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
                          <Quote className="w-12 h-12 text-purple-600 mx-auto mb-6" />
                          <p className="text-xl text-gray-700 italic mb-8 leading-relaxed max-w-3xl mx-auto">
                            "{testimonial.quote}"
                          </p>
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {testimonial.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-gray-900 text-lg">{testimonial.author}</div>
                              <div className="text-purple-600 font-medium">{testimonial.position}</div>
                              <div className="text-gray-500 mb-2">{testimonial.institution}</div>
                              <div className="text-sm font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full inline-block">
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
                        ? 'bg-purple-600 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setActiveTestimonial(prev => prev === 0 ? t.testimonials.items.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-purple-600 hover:shadow-xl transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setActiveTestimonial(prev => prev === t.testimonials.items.length - 1 ? 0 : prev + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-purple-600 hover:shadow-xl transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Auto-play indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                <span>{language === 'en' ? 'Auto-playing testimonials' : 'Témoignages en lecture automatique'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.process.title}
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-12">
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
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
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
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
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
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step < currentStep ? <CheckCircle2 className="w-6 h-6" /> : step}
                    </div>
                    {step < 4 && (
                      <div className={`w-20 h-1 mx-3 ${
                        step < currentStep ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-200'
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
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => console.log('Submit:', formData)}
                    className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-colors flex items-center gap-2 font-medium"
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

export default StudentAmbassadorRegistration;

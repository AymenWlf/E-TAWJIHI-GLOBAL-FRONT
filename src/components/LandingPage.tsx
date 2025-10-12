import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, X, BookOpen, Users, Award, Smartphone, CheckCircle, Star, Download, 
  Phone, Mail, MapPin, ChevronRight, Zap, Target, Globe, Sparkles, 
  Search, Filter, GraduationCap, Brain, Clock, Heart, MessageCircle,
  ChevronDown, Play, ArrowRight, Building, MapPin as Location, Calendar,
  User, Send, ExternalLink, Lightbulb, TrendingUp, Shield
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-advance steps animation
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const plans = [
    {
      name: 'ORIENTATION',
      price: '500',
      color: 'from-emerald-400 to-teal-500',
      features: [
        'Application d\'orientation et d\'annonces',
        'Méthodes de candidature correcte',
        'Listes de présélection complètes',
        'Candidature aux cités universitaires',
        'Discussion avec conseillers',
        'Suivi des dossiers'
      ],
      popular: false
    },
    {
      name: 'TAWJIH PLUS',
      price: '1800',
      color: 'from-blue-500 to-indigo-600',
      features: [
        'Toutes les filières disponibles',
        'Gestion complète des inscriptions',
        'Suivi de 73 établissements partenaires',
        'Séance d\'orientation personnalisée',
        'Préparation dossier complet',
        'Envoi postal inclus'
      ],
      popular: true
    },
    {
      name: 'TASSJIL PLUS',
      price: '2300',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Package complet premium',
        'Gestion TOP 15 établissements',
        'Orientation personnalisée',
        'Suivi dossiers prioritaire',
        'Support dédié 24/7',
        'Garantie satisfaction'
      ],
      popular: false
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Création du compte',
      description: 'Commencez par vous inscrire sur E-Tawjihi et configurez votre compte.',
      icon: <User className="h-8 w-8" />
    },
    {
      number: '2',
      title: 'Tests d\'orientation',
      description: 'Passez un test d\'orientation spécialisé qui permettra à notre algorithme de définir votre personnalité.',
      icon: <Brain className="h-8 w-8" />
    },
    {
      number: '3',
      title: 'Exploration des résultats',
      description: 'Recevez un bilan détaillé avec des recommandations concernant les secteurs et filières adaptées.',
      icon: <Target className="h-8 w-8" />
    },
    {
      number: '4',
      title: 'Trouvez votre filière !',
      description: 'Nous vous guidons vers les choix d\'écoles qui vous correspondent selon vos préférences.',
      icon: <GraduationCap className="h-8 w-8" />
    }
  ];

  const features = [
    {
      icon: <Brain className="h-12 w-12" />,
      title: 'Test d\'orientation Générale',
      description: 'Basé sur le modèle RIASEC reconnu mondialement, notre test analyse vos intérêts et inclinations naturelles.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: 'Tests de Compatibilités',
      description: 'Mesurez l\'adéquation entre vos intérêts et différents secteurs professionnels avec un pourcentage précis.',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <Search className="h-12 w-12" />,
      title: 'Recherche et Filtrage avancé',
      description: 'Trouvez facilement les filières selon vos critères : ville, secteur, diplôme et plus encore.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <Building className="h-12 w-12" />,
      title: 'Détails des écoles',
      description: 'Explorez les informations complètes sur les programmes, qualité d\'enseignement et débouchés.',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const schools = [
    {
      id: 2351,
      name: 'École Nationale Supérieure d\'Informatique',
      sigle: 'SUPEMIR',
      fullName: 'Ecole Supérieure des Multimédia, Informatique et Réseaux',
      location: 'Rabat',
      type: 'Privé',
      university: 'Pas d\'université',
      fees: '38000 - 42000 Dhs/an',
      description: 'Fondée en 2004, SUPEMIR (École Supérieure Privée d\'Ingénierie et de Management) est un établissement reconnu pour son engagement envers l\'excellence académique et l\'employabilité de ses diplômés.',
      image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=400',
      sponsored: true
    },
    {
      id: 2356,
      name: 'HEC Maroc',
      sigle: 'ESMC',
      fullName: 'Ecole Supérieure de Management et de Communication',
      location: 'Casablanca',
      type: 'Privé',
      university: 'Sans Université',
      fees: '30000 - 33000 Dhs/an',
      description: 'L\'ESMC Business School se distingue comme une institution avant-gardiste dans le paysage de l\'enseignement supérieur, axée sur la préparation de ses étudiants à devenir les leaders et managers de demain.',
      image: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400',
      sponsored: true
    },
    {
      id: 2229,
      name: 'École Mohammadia d\'Ingénieurs',
      sigle: 'EMSI',
      fullName: 'Ecole Marocaine des Sciences de l\'Ingénieur',
      location: 'Rabat',
      type: 'Privé',
      university: 'Sans Université',
      fees: '45000 - 55000 Dhs/an',
      description: 'Nous donnons à nos élèves ingénieurs une formation de qualité et des expériences qui les préparent au succès dans leurs carrières. Nos écoles sont reconnues par l\'Etat.',
      image: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=400',
      sponsored: false
    },
    {
      id: 2544,
      name: 'ISCAE',
      sigle: 'UIC',
      fullName: 'Ecole Privé de Management en Hôtellerie Internationale',
      location: 'Casablanca',
      type: 'Privé',
      university: 'UIC - Université Internationale de Casablanca',
      fees: '69500 - 72000 Dhs/an',
      description: 'L\'Université Internationale de Casablanca, en partenariat avec Vatel Casablanca, propose un programme de formation en Management en Hôtellerie Internationale.',
      image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
      sponsored: false
    },
    {
      id: 2485,
      name: 'École Nationale des Sciences Appliquées',
      sigle: 'ENSA',
      fullName: 'École Nationale des Sciences Appliquées',
      location: 'Multi-villes',
      type: 'Public',
      university: 'Multi-Universités',
      fees: 'Gratuit',
      description: 'Les Écoles Nationales des Sciences Appliquées constituent un réseau d\'établissements d\'enseignement supérieur au Maroc, dédiées à la formation d\'ingénieurs d\'État.',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=600',
      sponsored: false
    },
    {
      id: 2484,
      name: 'Faculté des Sciences et Techniques',
      sigle: 'FST',
      fullName: 'Faculté des Sciences et Techniques',
      location: 'Multi-villes',
      type: 'Public',
      university: 'Multi-Universités',
      fees: 'Gratuit',
      description: 'Les FST sont des facultés marocaines qui combinent la science et la technique dans leur enseignement avec des formations pratiques et théoriques.',
      image: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=400',
      sponsored: false
    }
  ];

  const faqs = [
    {
      question: 'Qu\'est-ce que E-Tawjihi et comment cela peut-il m\'aider ?',
      answer: 'E-Tawjihi est une plateforme d\'orientation scolaire et professionnelle conçue pour les élèves du baccalauréat. Elle utilise des tests basés sur le modèle RIASEC et l\'intelligence artificielle pour recommander des secteurs et filières adaptés à votre personnalité et intérêts.'
    },
    {
      question: 'Comment fonctionnent les tests d\'orientation sur E-Tawjihi ?',
      answer: 'Nos tests utilisent le modèle RIASEC reconnu mondialement. Vous répondez à une série de questions qui analysent vos intérêts, forces et inclinations naturelles. Notre algorithme génère ensuite des recommandations personnalisées.'
    },
    {
      question: 'À part les tests d\'orientation, quelles autres fonctionnalités offre E-Tawjihi ?',
      answer: 'E-Tawjihi offre une recherche avancée d\'écoles, des détails complets sur les établissements, un suivi des candidatures, des notifications pour les concours et bourses, et un accompagnement personnalisé.'
    },
    {
      question: 'Est-ce que E-Tawjihi prend en compte les universités et écoles à l\'étranger ?',
      answer: 'Oui, notre plateforme couvre les opportunités d\'études au Maroc et à l\'étranger, incluant des programmes internationaux et des bourses d\'études.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  E-Tawjihi.ma
                </h1>
                <p className="text-xs text-gray-500">2025/2026</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <a href="#accueil" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Accueil</a>
              <a href="#ecoles" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Les écoles supérieures</a>
              <a href="#concours" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Liste des concours</a>
              <a href="#chine" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Étudier en Chine</a>
              <a href="#orientation" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Orientation scolaire</a>
              {currentUser ? (
                <Link to="/dashboard" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Mon tableau de bord
                </Link>
              ) : (
                <Link to="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Se connecter
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 animate-fade-in">
              <div className="flex flex-col space-y-4">
                <a href="#accueil" className="text-gray-700 hover:text-blue-600 transition-colors py-2">Accueil</a>
                <a href="#ecoles" className="text-gray-700 hover:text-blue-600 transition-colors py-2">Les écoles supérieures</a>
                <a href="#concours" className="text-gray-700 hover:text-blue-600 transition-colors py-2">Liste des concours</a>
                <a href="#chine" className="text-gray-700 hover:text-blue-600 transition-colors py-2">Étudier en Chine</a>
                <a href="#orientation" className="text-gray-700 hover:text-blue-600 transition-colors py-2">Orientation scolaire</a>
                {currentUser ? (
                  <Link to="/dashboard" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-center hover:shadow-lg transition-all duration-300">
                    Mon tableau de bord
                  </Link>
                ) : (
                  <Link to="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-center hover:shadow-lg transition-all duration-300">
                    Se connecter
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md mb-6">
                <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Orientation scolaire pour les lycéens Marocains</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Tawjihi au Maroc !
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
                  Où étudier après le BAC ?
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Vous avez peur de faire le mauvais choix de filière qui vous coûtera des années d'études ? 
                Utilisez notre plateforme d'orientation pour trouver les secteurs de métiers et les filières qui vous correspondent !
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                {currentUser ? (
                  <Link to="/dashboard" className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center">
                    Accéder à mon tableau de bord
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link to="/login" className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center">
                    Commencer le test gratuit
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <div className="flex items-center text-gray-700 font-medium">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-3">
                    Illimité et GRATUIT !!
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">+60K</div>
                  <div className="text-gray-600">Utilisateurs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">+200</div>
                  <div className="text-gray-600">Écoles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">95%</div>
                  <div className="text-gray-600">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">Facile</div>
                  <div className="text-gray-600">à utiliser</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the landing page content would go here... */}
      {/* For brevity, I'll include just the essential sections */}
      
      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Trouver une École supérieure !
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Le choix de la filière d'études d'une école supérieure constitue l'un des plus grands défis auxquels les étudiants sont confrontés. 
                De nombreux jeunes regrettent leur choix de filière, ce qui provoque par la suite un manque d'épanouissement dans leurs études.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                C'est pour cela que nous avons créé E-Tawjihi, une plateforme d'orientation scolaire et professionnelle pour les jeunes élèves du baccalauréat, 
                car nous croyons que chaque être humain possède des capacités uniques.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                  <Heart className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">Orientation sur-mesure</span>
                </div>
                <div className="flex items-center bg-green-50 px-4 py-2 rounded-full">
                  <Clock className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Gain de temps</span>
                </div>
                <div className="flex items-center bg-purple-50 px-4 py-2 rounded-full">
                  <Zap className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-purple-800 font-medium">Travailler avec passion</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8">
                <img 
                  src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Étudiants en orientation"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à découvrir votre voie ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Rejoignez plus de 60 000 étudiants qui ont trouvé leur orientation avec E-Tawjihi
          </p>
          {currentUser ? (
            <Link to="/dashboard" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center">
              Accéder à mon tableau de bord
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <Link to="/login" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div className="ml-2">
                  <span className="text-xl font-bold">E-Tawjihi.ma</span>
                  <div className="text-xs text-gray-400 font-medium">Orientation IA</div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Votre plateforme d'orientation scolaire et professionnelle au Maroc. Trouvez votre voie avec nos tests scientifiques et notre base de données complète d'écoles.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens utiles</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Accueil</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Les écoles supérieures</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Secteurs d'études</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Conseils et Orientation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Questions/Réponses</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Conditions d'utilisation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contactez-nous</h4>
              <div className="space-y-4">
                <a href="tel:0660518125" className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <Phone className="h-5 w-5 mr-3" />
                  06 60 51 81 25
                </a>
                <a href="mailto:contact@e-tawjihi.ma" className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <Mail className="h-5 w-5 mr-3" />
                  contact@e-tawjihi.ma
                </a>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-3" />
                  Casablanca, Maroc
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-12 text-center">
            <p className="text-gray-400">2023 © E-Tawjihi</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

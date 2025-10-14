import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Clock, DollarSign, Users, Star, 
  BookOpen, Globe, Award, CheckCircle, ExternalLink, Heart, 
  Share2, Download, MessageCircle, Phone, Mail, Building2,
  GraduationCap, FileText, Zap, TrendingUp, Target, Eye,
  Play, Image as ImageIcon, Map, X
} from 'lucide-react';
import SEO from '../components/SEO';
import HeaderAuth from '../components/HeaderAuth';

const EstablishmentDetail = () => {
  const { establishmentId } = useParams();
  const [language, setLanguage] = useState('en');
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // University type utility functions
  const getUniversityTypeInfo = (establishment) => {
    const { universityType, countrySpecific, commissionRate, freeApplications, visaSupport } = establishment;
    
    if (universityType === "A") {
      return {
        type: "Type A",
        color: "green",
        icon: "💰",
        description: `3 free applications available`,
        freeApps: freeApplications,
        visaSupport: visaSupport === "free" ? "Free visa support" : "Paid visa support",
        serviceFees: "Free for first 3 applications"
      };
    } else if (universityType === "B") {
      return {
        type: "Type B",
        color: "blue",
        icon: "🏛️",
        description: "Service fee required for application",
        freeApps: 0,
        visaSupport: "Paid service",
        serviceFees: "Service fee per application"
      };
    } else if (universityType === "C") {
      const countryType = countrySpecific?.type;
      if (countryType === "france") {
        return {
          type: "Type C",
          color: "purple",
          icon: "🇫🇷",
          description: "Campus France & Parcoursup procedure management",
          freeApps: 0,
          visaSupport: "Paid service",
          serviceFees: "Service fee for procedure management"
        };
      } else if (countryType === "china") {
        return {
          type: "Type C",
          color: "red",
          icon: "🇨🇳",
          description: "Chinese admission procedure management",
          freeApps: 0,
          visaSupport: "Free if accepted",
          serviceFees: "Service fee for procedure management"
        };
      } else {
        return {
          type: "Type C",
          color: "orange",
          icon: "📋",
          description: "Special admission procedure management",
          freeApps: 0,
          visaSupport: "Paid service",
          serviceFees: "Service fee for procedure management"
        };
      }
    }
    
    // Default fallback
    return {
      type: "Unknown",
      color: "gray",
      icon: "❓",
      description: "Unknown university type",
      freeApps: 0,
      visaSupport: "Unknown",
      serviceFees: "Unknown"
    };
  };

  const getServiceFee = (establishment) => {
    const { universityType, countrySpecific } = establishment;
    
    if (universityType === "A") {
      return { 
        amount: "Free", 
        originalAmount: "$50",
        description: "First 3 applications free",
        showStrikethrough: true
      };
    } else if (universityType === "B") {
      return { 
        amount: "$100", 
        description: "Service fee per application",
        showStrikethrough: false
      };
    } else if (universityType === "C") {
      const countryType = countrySpecific?.type;
      if (countryType === "france") {
        return { 
          amount: "€150", 
          description: "Campus France procedure management",
          showStrikethrough: false
        };
      } else if (countryType === "china") {
        return { 
          amount: "¥800", 
          description: "Chinese procedure management",
          showStrikethrough: false
        };
      } else {
        return { 
          amount: "$150", 
          description: "Special procedure management",
          showStrikethrough: false
        };
      }
    }
    
    // Default fallback
    return {
      amount: "Unknown",
      description: "Unknown service fee",
      showStrikethrough: false
    };
  };

  // Sample detailed establishment data
  const establishmentsData = {
    1: {
      id: 1,
      name: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      type: "Public University",
      founded: "1827",
      students: "97,000+",
      language: "English",
      ranking: 18,
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Utoronto_coa.svg/1200px-Utoronto_coa.svg.png",
      featured: true,
      aidvisorRecommended: true,
      easyApply: true,
      // University type information
      universityType: "A", // "A", "B", or "C"
      commissionRate: "5-15%",
      freeApplications: 3, // Number of free applications for Type A schools
      visaSupport: "free", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      },
      
      // Simple text sections for manual entry
      overview: "The University of Toronto is a public research university in Toronto, Ontario, Canada, located on the grounds that surround Queen's Park. It was founded by royal charter in 1827 as King's College, the first institution of higher learning in Upper Canada. Originally controlled by the Church of England, the university assumed its present name in 1850 upon becoming a secular institution.",
      
      mission: "To be an internationally significant research university, with undergraduate, graduate and professional programs of excellent quality.",
      
      // Categorized admission requirements
      admission: {
        academicCertificates: [
          "High school diploma or equivalent",
          "Minimum GPA of 3.0/4.0",
          "Official transcripts"
        ],
        englishLanguageTests: [
          "IELTS 6.5 or higher",
          "TOEFL 100 or higher",
          "Duolingo 120 or higher"
        ],
        requiredDocuments: [
          "Personal statement",
          "Letters of recommendation",
          "Application fee",
          "Portfolio (for certain programs)"
        ],
        visa: [
          "Valid passport",
          "Study permit application",
          "Financial proof"
        ],
        medical: [
          "Medical examination",
          "Health insurance"
        ],
        identity: [
          "Passport copy",
          "Birth certificate",
          "Photo ID"
        ]
      },
      
      // Simple costs
      costs: {
        tuition: {
          domestic: "$6,100 CAD/year",
          international: "$58,160 CAD/year"
        },
        applicationFee: "$125 CAD",
        livingCosts: "$15,000 CAD/year",
        total: "$73,285 CAD/year"
      },
      
      // Simple important dates
      importantDates: {
        applicationDeadline: "January 15, 2025",
        startDate: "September 2025",
        intakes: "September, January, May"
      },
      
      // Simple campus info
      campus: {
        location: "Downtown Toronto, Ontario, Canada",
        language: "English",
        accommodation: "On-campus and off-campus options available"
      },
      
      // Simple scholarships
      scholarships: "International Student Excellence Award (up to $10,000), Computer Science Graduate Fellowship ($15,000)",
      
      // Statistics
      statistics: {
        acceptanceRate: "43%",
        averageGPA: "3.6",
        classSize: "120 students per program",
        internationalStudents: "65%"
      },
      
      // Photos section
      photos: [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop"
      ],
      
      // Videos section
      videos: [
        {
          title: "University of Toronto Campus Tour",
          description: "Take a virtual tour of our beautiful campus and facilities",
          url: "https://www.youtube.com/embed/9bZkp7q19f0"
        },
        {
          title: "Student Life at UofT",
          description: "Discover what it's like to be a student at our university",
          url: "https://www.youtube.com/embed/jNQXAC9IVRw"
        }
      ],
      
      // Locations with Google Maps
      locations: [
        {
          name: "St. George Campus",
          address: "27 King's College Cir, Toronto, ON M5S 1A1, Canada",
          type: "Main Campus",
          description: "The main campus located in downtown Toronto with historic buildings and modern facilities"
        },
        {
          name: "Mississauga Campus",
          address: "3359 Mississauga Rd, Mississauga, ON L5L 1C6, Canada",
          type: "Satellite Campus",
          description: "Modern campus with state-of-the-art facilities and research centers"
        }
      ],
      
      // Programs offered
      programs: [
        {
          name: "Master of Computer Science",
          degree: "Master's",
          duration: "2 years",
          tuition: "$58,160 CAD/year",
          studyType: "on-campus"
        },
        {
          name: "Bachelor of Engineering",
          degree: "Bachelor's",
          duration: "4 years",
          tuition: "$58,160 CAD/year",
          studyType: "hybrid"
        },
        {
          name: "Master of Business Administration",
          degree: "Master's",
          duration: "2 years",
          tuition: "$64,000 CAD/year",
          studyType: "online"
        }
      ]
    },
    2: {
      id: 2,
      name: "Sorbonne University",
      country: "France",
      city: "Paris",
      type: "Public University",
      founded: "1257",
      students: "55,000+",
      language: "French",
      ranking: 83,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Logo_Sorbonne_Universit%C3%A9.svg/1200px-Logo_Sorbonne_Universit%C3%A9.svg.png",
      featured: false,
      aidvisorRecommended: false,
      easyApply: true,
      // University type information
      universityType: "C", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // Number of free applications for Type A schools
      visaSupport: "paid", // "free" or "paid"
      countrySpecific: {
        type: "france", // "standard", "france", "china", "parcoursup"
        requirements: ["Campus France", "Parcoursup"]
      },
      
      // Simple text sections for manual entry
      overview: "Sorbonne University is a public research university in Paris, France. It was established in 2018 by the merger of Paris-Sorbonne University and Pierre and Marie Curie University. The university is named after the historic Sorbonne college, founded in 1257.",
      
      mission: "To provide world-class education and research in the heart of Paris, fostering innovation and academic excellence.",
      
      // Categorized admission requirements
      admission: {
        academicCertificates: [
          "Baccalauréat or equivalent",
          "Minimum grade of 12/20",
          "Official transcripts"
        ],
        englishLanguageTests: [
          "DELF B2 or higher",
          "TCF 400+ points",
          "French language proficiency required"
        ],
        requiredDocuments: [
          "Personal statement in French",
          "Letters of recommendation",
          "Campus France application",
          "Parcoursup application"
        ],
        visa: [
          "Valid passport",
          "Campus France certificate",
          "Financial proof (€615/month)"
        ],
        medical: [
          "Medical examination",
          "Health insurance (Sécurité Sociale)"
        ],
        identity: [
          "Passport copy",
          "Birth certificate",
          "Photo ID"
        ]
      },
      
      // Programs offered
      programs: [
        {
          id: 1,
          name: "Master in Medicine",
          degree: "Master's",
          duration: "6 years",
          tuition: "€243/year",
          startDate: "September 2025",
          studyType: "on-campus",
          description: "Comprehensive medical program with clinical rotations",
          requirements: ["Baccalauréat with high grades", "French B2", "Medical entrance exam"]
        }
      ],
      
      // Costs
      costs: {
        tuition: "€243/year",
        applicationFee: "€150",
        serviceFee: "€150",
        livingCosts: "€800-1200/month",
        healthInsurance: "€215/year",
        totalFirstYear: "€10,000-15,000"
      },
      
      // Photos
      photos: [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop"
      ],
      
      // Videos
      videos: [
        {
          title: "Campus Tour",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
        }
      ],
      
      // Locations
      locations: [
        {
          name: "Main Campus - Latin Quarter",
          address: "21 Rue de l'École de Médecine, 75006 Paris, France",
          type: "Main Campus",
          facilities: ["Libraries", "Laboratories", "Student services"],
          mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991440608142!2d2.3442143156744144!3d48.85061017928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671d877937b0f%3A0x4b0e5b5b5b5b5b5b!2sSorbonne%20University!5e0!3m2!1sen!2sfr!4v1234567890123!5m2!1sen!2sfr"
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setEstablishment(establishmentsData[establishmentId] || establishmentsData[1]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [establishmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading establishment details...</p>
        </div>
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Establishment Not Found</h1>
          <Link to="/establishments" className="text-blue-600 hover:text-blue-700">
            ← Back to Establishments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${establishment.name} | E-TAWJIHI`}
        description={establishment.overview}
        keywords={`${establishment.name}, ${establishment.country}, study abroad, international education`}
      />
      
      <style jsx>{`
        .logo-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .logo-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
      `}</style>
      
      <HeaderAuth />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              to="/establishments" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'en' ? 'Back to Establishments' : 'Retour aux Établissements'}
            </Link>
          </div>

          {/* Establishment Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* University Logo */}
              <div className="flex-shrink-0">
                <img 
                  src={establishment.logo} 
                  alt={`${establishment.name} logo`}
                  className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                />
              </div>

              {/* Establishment Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{establishment.name}</h1>
                    <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                      <Building2 className="w-5 h-5" />
                      <span>{establishment.city}, {establishment.country}</span>
                      <span className="text-gray-400">•</span>
                      <span>{establishment.type}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-2 rounded-lg transition-colors ${
                        isFavorite 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">{language === 'en' ? 'Founded' : 'Fondée'}</div>
                    <div className="font-semibold text-gray-900">{establishment.founded}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">{language === 'en' ? 'Students' : 'Étudiants'}</div>
                    <div className="font-semibold text-gray-900">{establishment.students}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <Globe className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">{language === 'en' ? 'Language' : 'Langue'}</div>
                    <div className="font-semibold text-gray-900">{establishment.language}</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">{language === 'en' ? 'Ranking' : 'Classement'}</div>
                    <div className="font-semibold text-gray-900">#{establishment.ranking}</div>
                  </div>
                </div>

                {/* Main CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    {language === 'en' ? 'Apply Now' : 'Postuler Maintenant'}
                  </button>
                  <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {language === 'en' ? 'Contact Advisor' : 'Contacter un Conseiller'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* E-DVISOR and Visa Calculator Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* E-DVISOR Section */}
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-blue-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">E-DVISOR Check</h3>
                  <p className="text-sm text-gray-600">AI-Powered Admission Assessment</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                {language === 'en' 
                  ? 'Get instant feedback on your admission chances for this university using our advanced AI system. Receive personalized recommendations and insights.'
                  : 'Obtenez un retour instantané sur vos chances d\'admission pour cette université en utilisant notre système IA avancé. Recevez des recommandations et des conseils personnalisés.'
                }
              </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {language === 'en' ? 'Check My Chances' : 'Vérifier Mes Chances'}
              </button>
            </div>

            {/* Visa Calculator Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg p-8 border border-emerald-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Visa Calculator</h3>
                  <p className="text-sm text-gray-600">Smart Visa Requirements & Costs</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                {language === 'en' 
                  ? `Calculate your visa requirements, processing times, and estimated costs for studying in ${establishment.country}. Get personalized guidance and document checklists.`
                  : `Calculez vos exigences de visa, délais de traitement et coûts estimés pour étudier au ${establishment.country}. Obtenez des conseils personnalisés et des listes de documents.`
                }
              </p>
              <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                {language === 'en' ? 'Calculate Visa' : 'Calculer le Visa'}
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Quick Navigation' : 'Navigation Rapide'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'overview', label: language === 'en' ? 'Overview' : 'Aperçu' },
                { id: 'programs', label: language === 'en' ? 'Programs' : 'Programmes' },
                { id: 'admission', label: language === 'en' ? 'Admission' : 'Admission' },
                { id: 'costs', label: language === 'en' ? 'Costs' : 'Coûts' },
                { id: 'photos', label: language === 'en' ? 'Photos' : 'Photos' },
                { id: 'videos', label: language === 'en' ? 'Videos' : 'Vidéos' },
                { id: 'locations', label: language === 'en' ? 'Locations' : 'Localisations' }
              ].map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>

          {/* Overview Section */}
          <div id="overview" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'University Overview' : 'Aperçu de l\'Université'}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {establishment.overview}
            </p>
            
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'en' ? 'Mission' : 'Mission'}
              </h4>
              <p className="text-gray-600">{establishment.mission}</p>
            </div>
          </div>

          {/* University Type and Application Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Application Information' : 'Informations de Candidature'}
            </h3>
            {(() => {
              const typeInfo = getUniversityTypeInfo(establishment);
              const serviceFee = getServiceFee(establishment);
              
              if (!typeInfo || !serviceFee) {
                return null;
              }
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* University Type */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg ${
                        typeInfo.color === 'green' ? 'bg-green-100' :
                        typeInfo.color === 'blue' ? 'bg-blue-100' :
                        typeInfo.color === 'purple' ? 'bg-purple-100' :
                        typeInfo.color === 'red' ? 'bg-red-100' :
                        typeInfo.color === 'orange' ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        <span className="text-2xl">{typeInfo.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{typeInfo.type}</h4>
                        <p className="text-sm text-gray-600">{typeInfo.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applications:</span>
                        <span className="font-semibold">
                          {typeInfo.freeApps > 0 
                            ? `${typeInfo.freeApps} free applications`
                            : 'Paid service'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visa Support:</span>
                        <span className="font-semibold">{typeInfo.visaSupport}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Fees */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      {language === 'en' ? 'Service Fees' : 'Frais de Service'}
                    </h4>
                    <div className="flex items-center gap-3 mb-4">
                      {serviceFee.showStrikethrough && serviceFee.originalAmount && (
                        <span className="text-2xl text-gray-400 line-through">
                          {serviceFee.originalAmount}
                        </span>
                      )}
                      <span className={`text-3xl font-bold ${
                        serviceFee.amount === 'Free' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {serviceFee.amount}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{serviceFee.description}</p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Programs Section */}
          <div id="programs" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {language === 'en' ? 'Programs Offered' : 'Programmes Proposés'}
              </h3>
              <Link 
                to={`/establishments?university=${encodeURIComponent(establishment.name)}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                {language === 'en' ? 'View All Programs' : 'Voir Tous les Programmes'}
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {establishment.programs.map((program, index) => (
                <Link 
                  key={index} 
                  to={`/programs/${program.id || index + 1}`}
                  className="block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Program Logo Section */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="logo-container">
                      <img
                        src={establishment.logo}
                        alt={program.name}
                        className="logo-image group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {establishment.aidvisorRecommended && (
                        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {language === 'en' ? 'E-DVISOR Recommended' : 'Recommandé par E-DVISOR'}
                        </div>
                      )}
                      {establishment.featured && (
                        <div className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {language === 'en' ? 'Featured' : 'En vedette'}
                        </div>
                      )}
                      {/* University Type Badge */}
                      {(() => {
                        const typeInfo = getUniversityTypeInfo(establishment);
                        return (
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                            typeInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                            typeInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                            typeInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                            typeInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                            typeInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            <span className="text-sm">{typeInfo.icon}</span>
                            {typeInfo.type}
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* University Ranking */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-gray-800">#{establishment.ranking}</span>
                    </div>
                  </div>

                  {/* Program Content */}
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {program.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Building2 className="w-4 h-4 mr-1 text-blue-500" />
                        {establishment.name}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {establishment.city}, {establishment.country}
                      </div>
                    </div>

                    {/* Program Details */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Degree' : 'Diplôme'}</div>
                        <div className="text-sm font-semibold text-gray-800">{program.degree}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Duration' : 'Durée'}</div>
                        <div className="text-sm font-semibold text-gray-800">{program.duration}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Study Type' : 'Type d\'Étude'}</div>
                        <div className="text-sm font-semibold text-gray-800">
                          {program.studyType === 'on-campus' ? (language === 'en' ? 'On-Campus' : 'Présentiel') :
                           program.studyType === 'hybrid' ? (language === 'en' ? 'Hybrid' : 'Hybride') :
                           program.studyType === 'online' ? (language === 'en' ? 'Online' : 'En ligne') : 
                           (language === 'en' ? 'On-Campus' : 'Présentiel')}
                        </div>
                      </div>
                    </div>

                    {/* Tuition and Start Date */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Tuition' : 'Frais'}</div>
                        <div className="text-sm font-semibold text-gray-800">{program.tuition}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Start Date' : 'Date de début'}</div>
                        <div className="text-sm font-semibold text-gray-800">{establishment.importantDates.startDate}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {language === 'en' 
                          ? `Study ${program.name} at ${establishment.name}, one of the world's leading universities. This program offers excellent academic opportunities and career prospects.`
                          : `Étudiez ${program.name} à ${establishment.name}, l'une des meilleures universités au monde. Ce programme offre d'excellentes opportunités académiques et perspectives de carrière.`
                        }
                      </p>
                    </div>

                    {/* Requirements */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-2">{language === 'en' ? 'Requirements' : 'Prérequis'}</div>
                      <div className="flex flex-wrap gap-1">
                        {establishment.admission.requiredDocuments.slice(0, 2).map((req, reqIndex) => (
                          <span key={reqIndex} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                            {req}
                          </span>
                        ))}
                        {establishment.admission.requiredDocuments.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{establishment.admission.requiredDocuments.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      {/* Main Actions Row */}
                      <div className="flex gap-2">
                        <div className="flex-1 bg-blue-800 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          {language === 'en' ? 'View Details' : 'Voir les détails'}
                        </div>
                        <div 
                          className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold flex items-center justify-center cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle favorite toggle
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </div>
                      </div>
                      
                      {/* Secondary Actions Row */}
                      <div className="flex gap-2">
                        {establishment.easyApply && (
                          <div 
                            className={`flex-1 text-white py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                              establishment.universityType === 'A' 
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Handle apply
                            }}
                          >
                            <Zap className="w-4 h-4" />
                            {establishment.universityType === 'A' 
                              ? (language === 'en' ? 'FREE APPLY' : 'CANDIDATURE GRATUITE')
                              : (language === 'en' ? 'APPLY' : 'CANDIDATURE')
                            }
                          </div>
                        )}
                        <div 
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle contact advisor
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                          {language === 'en' ? 'Contact Advisor' : 'Contacter un Conseiller'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Admission Requirements Section */}
          <div id="admission" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Admission Requirements' : 'Exigences d\'Admission'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Academic Certificates */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  {language === 'en' ? 'Academic Certificates' : 'Certificats Académiques'}
                </h4>
                <div className="space-y-2">
                  {establishment.admission.academicCertificates.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* English Language Tests */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  {language === 'en' ? 'English Language Tests' : 'Tests de Langue Anglaise'}
                </h4>
                <div className="space-y-2">
                  {establishment.admission.englishLanguageTests.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  {language === 'en' ? 'Required Documents' : 'Documents Requis'}
                </h4>
                <div className="space-y-2">
                  {establishment.admission.requiredDocuments.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visa */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  {language === 'en' ? 'Visa' : 'Visa'}
                </h4>
                <div className="space-y-2">
                  {establishment.admission.visa.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" />
                  {language === 'en' ? 'Medical' : 'Médical'}
                </h4>
                <div className="space-y-2">
                  {establishment.admission.medical.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identity */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  {language === 'en' ? 'Identity' : 'Identité'}
                </h4>
                <div className="space-y-2">
                  {establishment.admission.identity.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Costs Section */}
          <div id="costs" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Costs' : 'Coûts'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {language === 'en' ? 'Tuition Fees' : 'Frais de Scolarité'}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'en' ? 'Domestic Students' : 'Étudiants Nationaux'}</span>
                      <span className="font-semibold text-blue-600">{establishment.costs.tuition.domestic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'en' ? 'International Students' : 'Étudiants Internationaux'}</span>
                      <span className="font-semibold text-blue-600">{establishment.costs.tuition.international}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {language === 'en' ? 'Application Fee' : 'Frais de Candidature'}
                  </h4>
                  <div className="text-lg font-semibold text-gray-600">{establishment.costs.applicationFee}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {language === 'en' ? 'Living Costs' : 'Coûts de Vie'}
                  </h4>
                  <div className="text-lg font-semibold text-green-600">{establishment.costs.livingCosts}</div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {language === 'en' ? 'Total Estimated Cost' : 'Coût Total Estimé'}
                  </h4>
                  <div className="text-2xl font-bold text-blue-600">{establishment.costs.total}</div>
                </div>
              </div>
            </div>
            
            {establishment.scholarships && (
              <div className="mt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  {language === 'en' ? 'Available Scholarships' : 'Bourses Disponibles'}
                </h4>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-gray-700">{establishment.scholarships}</p>
                </div>
              </div>
            )}
          </div>

          {/* Photos Section */}
          <div id="photos" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-600" />
              {language === 'en' ? 'Campus Photos' : 'Photos du Campus'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {establishment.photos.map((photo, index) => (
                <div 
                  key={index} 
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setIsImageModalOpen(true);
                  }}
                >
                  <img 
                    src={photo} 
                    alt={`Campus photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Videos Section */}
          <div id="videos" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Play className="w-6 h-6 text-red-600" />
              {language === 'en' ? 'Videos' : 'Vidéos'}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {establishment.videos.map((video, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <iframe
                      src={video.url}
                      title={video.title}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{video.title}</h4>
                    <p className="text-gray-600 text-sm">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locations Section */}
          <div id="locations" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Map className="w-6 h-6 text-green-600" />
              {language === 'en' ? 'Campus Locations' : 'Localisations du Campus'}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {establishment.locations.map((location, index) => (
                <div key={index} className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{location.name}</h4>
                        <div className="text-sm text-green-600 font-medium mb-2">{location.type}</div>
                        <p className="text-gray-600 text-sm mb-3">{location.address}</p>
                        <p className="text-gray-700">{location.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Google Maps Embed */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgUfXrH3g&q=${encodeURIComponent(location.address)}&zoom=15`}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${location.name}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="flex items-center justify-center">
              <button
                onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : establishment.photos.length - 1)}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              
              <img
                src={establishment.photos[selectedImageIndex]}
                alt={`Campus photo ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              <button
                onClick={() => setSelectedImageIndex(prev => prev < establishment.photos.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
              >
                <ArrowLeft className="w-8 h-8 rotate-180" />
              </button>
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <p className="text-sm">
                {selectedImageIndex + 1} / {establishment.photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EstablishmentDetail;

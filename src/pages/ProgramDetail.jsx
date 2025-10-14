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

const ProgramDetail = () => {
  const { programId } = useParams();
  const [language, setLanguage] = useState('en');
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // University type utility functions
  const getUniversityTypeInfo = (program) => {
    const { universityType, countrySpecific, commissionRate, freeApplications, visaSupport } = program;
    
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

  const getServiceFee = (program) => {
    const { universityType, countrySpecific } = program;
    
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

  // Sample detailed program data
  const programsData = {
    1: {
      id: 1,
      name: "Master of Computer Science",
      university: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      degree: "Master's",
      duration: "2 years",
      language: "English",
      tuition: "$58,160",
      startDate: "September 2025",
      applicationDeadline: "January 15, 2025",
      description: "Advanced program in computer science with focus on AI and machine learning.",
      studyType: "on-campus",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Utoronto_coa.svg/1200px-Utoronto_coa.svg.png",
      featured: true,
      aidvisorRecommended: true,
      easyApply: true,
      ranking: 18,
      // University type information
      universityType: "A", // "A", "B", or "C"
      commissionRate: "5-15%",
      freeApplications: 3, // Number of free applications for Type A schools
      visaSupport: "free", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      },
      // Detailed information
      overview: {
        description: "The Master of Computer Science program at the University of Toronto is designed to provide students with advanced knowledge and skills in computer science, with particular emphasis on artificial intelligence, machine learning, and software engineering. This program combines rigorous theoretical foundations with practical applications, preparing graduates for leadership roles in the technology industry.",
        highlights: [
          "World-class faculty with industry experience",
          "Cutting-edge research opportunities",
          "Strong industry connections and partnerships",
          "Flexible curriculum with specialization tracks",
          "Access to state-of-the-art facilities and labs"
        ],
        careerOutcomes: [
          "Software Engineer",
          "Data Scientist",
          "AI/ML Engineer",
          "Research Scientist",
          "Technical Lead",
          "Product Manager"
        ]
      },
      curriculum: {
        coreCourses: [
          "Advanced Algorithms and Data Structures",
          "Machine Learning Fundamentals",
          "Software Engineering Principles",
          "Database Systems",
          "Computer Networks",
          "Operating Systems"
        ],
        electives: [
          "Deep Learning and Neural Networks",
          "Computer Vision",
          "Natural Language Processing",
          "Distributed Systems",
          "Cybersecurity",
          "Human-Computer Interaction"
        ],
        thesis: "Students must complete a research thesis or capstone project in their chosen specialization area."
      },
      admission: {
        academicCertificates: [
          "Bachelor's degree in Computer Science or related field",
          "Minimum GPA of 3.0/4.0 (B average)",
          "Official transcripts from all post-secondary institutions"
        ],
        englishLanguageTests: [
          "IELTS 7.0 (with no band below 6.5)",
          "TOEFL 100+",
          "English proficiency test scores"
        ],
        requiredDocuments: [
          "Statement of Purpose (500-1000 words)",
          "Two letters of recommendation",
          "Resume/CV",
          "Portfolio (for certain specializations)"
        ],
        visa: [
          "Valid passport",
          "Study permit application",
          "Financial proof of funds",
          "Letter of acceptance"
        ],
        medical: [
          "Medical examination certificate",
          "Immunization records",
          "Health insurance coverage"
        ],
        identity: [
          "Passport copy",
          "Birth certificate",
          "National ID card"
        ],
        process: [
          "Submit online application",
          "Pay application fee ($125 CAD)",
          "Upload required documents",
          "Interview (if selected)",
          "Receive admission decision",
          "Accept offer and pay deposit"
        ]
      },
      costs: {
        tuition: {
          domestic: "$6,100 CAD per year",
          international: "$58,160 CAD per year"
        },
        fees: [
          "Student Services Fee: $1,200 CAD/year",
          "Health Insurance: $600 CAD/year",
          "Technology Fee: $300 CAD/year",
          "Recreation Fee: $200 CAD/year"
        ],
        living: {
          accommodation: "$12,000 - $18,000 CAD/year",
          food: "$4,000 - $6,000 CAD/year",
          transportation: "$1,200 CAD/year",
          books: "$1,500 CAD/year",
          personal: "$3,000 CAD/year"
        },
        total: "$80,000 - $90,000 CAD/year (international students)"
      },
      scholarships: [
        {
          name: "International Student Excellence Award",
          amount: "$10,000 CAD",
          description: "Merit-based scholarship for outstanding international students",
          requirements: ["Minimum GPA 3.7", "Strong research potential", "Leadership experience"]
        },
        {
          name: "Computer Science Graduate Fellowship",
          amount: "$15,000 CAD",
          description: "Research-based fellowship for students pursuing AI/ML research",
          requirements: ["Research proposal", "Faculty recommendation", "Academic excellence"]
        }
      ],
      campus: {
        location: "Downtown Toronto, Ontario, Canada",
        facilities: [
          "Bahen Centre for Information Technology",
          "Advanced Computing Research Lab",
          "AI Research Institute",
          "Student Commons and Study Spaces",
          "24/7 Computer Labs",
          "Collaboration Spaces"
        ],
        housing: [
          "Graduate House (on-campus)",
          "Chestnut Residence",
          "Off-campus housing assistance",
          "Homestay programs"
        ]
      },
      faculty: [
        {
          name: "Dr. Geoffrey Hinton",
          title: "Professor Emeritus",
          expertise: "Machine Learning, Neural Networks",
          bio: "Pioneer in deep learning and AI research"
        },
        {
          name: "Dr. Raquel Urtasun",
          title: "Professor",
          expertise: "Computer Vision, Autonomous Vehicles",
          bio: "Leading researcher in computer vision and robotics"
        }
      ],
      rankings: {
        qs: 18,
        times: 22,
        arwu: 25,
        usNews: 20
      },
      statistics: {
        acceptanceRate: "43%",
        averageGPA: "3.6",
        averageGRE: "325",
        classSize: "120 students",
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
          thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
          duration: "3:45",
          url: "https://www.youtube.com/embed/9bZkp7q19f0"
        },
        {
          title: "Computer Science Program Overview",
          description: "Learn more about our Computer Science program and curriculum",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          duration: "5:20",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Student Life at UofT",
          description: "Discover what it's like to be a student at our university",
          thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
          duration: "4:15",
          url: "https://www.youtube.com/embed/jNQXAC9IVRw"
        }
      ],
      
      // Locations with Google Maps
      locations: [
        {
          name: "St. George Campus",
          address: "27 King's College Cir, Toronto, ON M5S 1A1, Canada",
          type: "Main Campus",
          description: "The main campus located in downtown Toronto with historic buildings and modern facilities",
          coordinates: {
            lat: 43.6532,
            lng: -79.3832
          }
        },
        {
          name: "Mississauga Campus",
          address: "3359 Mississauga Rd, Mississauga, ON L5L 1C6, Canada",
          type: "Satellite Campus",
          description: "Modern campus with state-of-the-art facilities and research centers",
          coordinates: {
            lat: 43.5448,
            lng: -79.6659
          }
        }
      ]
    },
    // Add more programs as needed
    2: {
      id: 2,
      name: "Bachelor of Medicine",
      university: "Sorbonne University",
      country: "France",
      city: "Paris",
      degree: "Bachelor's",
      duration: "6 years",
      language: "French",
      tuition: "€3,770",
      startDate: "September 2025",
      applicationDeadline: "March 1, 2025",
      description: "Comprehensive medical program with clinical rotations and research opportunities.",
      studyType: "on-campus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sorbonne_University_logo.svg/1200px-Sorbonne_University_logo.svg.png",
      featured: false,
      aidvisorRecommended: false,
      easyApply: true,
      ranking: 83,
      overview: {
        description: "The Bachelor of Medicine program at Sorbonne University provides comprehensive medical education with a strong foundation in basic sciences, clinical skills, and patient care. The program follows the European medical education standards and prepares students for medical practice in France and internationally.",
        highlights: [
          "Historic institution with centuries of medical excellence",
          "Clinical rotations in top Parisian hospitals",
          "Research opportunities in cutting-edge medical fields",
          "International exchange programs",
          "Strong alumni network in global healthcare"
        ],
        careerOutcomes: [
          "General Practitioner",
          "Specialist Physician",
          "Medical Researcher",
          "Public Health Officer",
          "Medical Administrator",
          "Healthcare Consultant"
        ]
      },
      curriculum: {
        coreCourses: [
          "Anatomy and Physiology",
          "Biochemistry and Molecular Biology",
          "Pathology and Pathophysiology",
          "Pharmacology and Therapeutics",
          "Clinical Medicine",
          "Medical Ethics and Law"
        ],
        electives: [
          "Cardiology",
          "Neurology",
          "Pediatrics",
          "Surgery",
          "Psychiatry",
          "Emergency Medicine"
        ],
        thesis: "Students complete clinical rotations and a research project in their final year."
      },
      admission: {
        requirements: [
          "High School Diploma with excellent grades",
          "DELF B2 French proficiency",
          "Medical entrance examination (PACES)",
          "Personal statement",
          "Interview",
          "Medical fitness certificate"
        ],
        documents: [
          "High school transcripts",
          "French proficiency certificate",
          "Medical entrance exam results",
          "Personal statement",
          "Medical fitness certificate",
          "Passport copy"
        ],
        process: [
          "Register for PACES exam",
          "Take entrance examination",
          "Submit application with documents",
          "Attend interview",
          "Receive admission decision",
          "Complete medical registration"
        ]
      },
      costs: {
        tuition: {
          domestic: "€170 per year",
          international: "€3,770 per year"
        },
        fees: [
          "Student Services Fee: €200/year",
          "Health Insurance: €200/year",
          "Library Fee: €50/year"
        ],
        living: {
          accommodation: "€8,000 - €12,000/year",
          food: "€3,000 - €4,500/year",
          transportation: "€400/year",
          books: "€800/year",
          personal: "€2,000/year"
        },
        total: "€15,000 - €20,000/year (international students)"
      },
      scholarships: [
        {
          name: "Eiffel Excellence Scholarship",
          amount: "€1,181/month",
          description: "French government scholarship for international students",
          requirements: ["Academic excellence", "French proficiency", "Age under 30"]
        }
      ],
      campus: {
        location: "Latin Quarter, Paris, France",
        facilities: [
          "Historic medical library",
          "Anatomy laboratories",
          "Clinical simulation center",
          "Research laboratories",
          "Student medical center"
        ],
        housing: [
          "CROUS student housing",
          "Private student residences",
          "Shared apartments",
          "Homestay programs"
        ]
      },
      faculty: [
        {
          name: "Prof. Jean-Claude Ameisen",
          title: "Professor of Immunology",
          expertise: "Immunology, Cell Biology",
          bio: "Leading researcher in immunology and cell death mechanisms"
        }
      ],
      rankings: {
        qs: 83,
        times: 95,
        arwu: 78,
        usNews: 89
      },
      statistics: {
        acceptanceRate: "12%",
        averageGrade: "16/20",
        classSize: "300 students",
        internationalStudents: "25%"
      }
    },
    2: {
      id: 2,
      name: "Master in Medicine",
      university: "Sorbonne University",
      country: "France",
      city: "Paris",
      degree: "Master's",
      duration: "6 years",
      language: "French",
      tuition: "€243/year",
      startDate: "September 2025",
      applicationDeadline: "March 15, 2025",
      description: "Comprehensive medical program with clinical rotations in Paris hospitals.",
      studyType: "on-campus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Logo_Sorbonne_Universit%C3%A9.svg/1200px-Logo_Sorbonne_Universit%C3%A9.svg.png",
      featured: false,
      aidvisorRecommended: false,
      easyApply: true,
      ranking: 83,
      // University type information
      universityType: "C", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // Number of free applications for Type A schools
      visaSupport: "paid", // "free" or "paid"
      countrySpecific: {
        type: "france", // "standard", "france", "china", "parcoursup"
        requirements: ["Campus France", "Parcoursup"]
      },
      // Detailed information
      overview: {
        description: "The Master in Medicine program at Sorbonne University is a comprehensive 6-year program that combines theoretical knowledge with extensive clinical practice. Students gain hands-on experience in Paris's leading hospitals and medical centers.",
        highlights: [
          "Clinical rotations in Paris hospitals",
          "World-renowned faculty",
          "Research opportunities",
          "International exchange programs"
        ]
      },
      curriculum: {
        year1: ["Basic Sciences", "Anatomy", "Physiology", "Biochemistry"],
        year2: ["Pathology", "Pharmacology", "Microbiology", "Clinical Skills"],
        year3: ["Internal Medicine", "Surgery", "Pediatrics", "Obstetrics"],
        year4: ["Specialized Rotations", "Research Project", "Electives"],
        year5: ["Advanced Clinical Practice", "Thesis Preparation"],
        year6: ["Final Clinical Rotations", "Thesis Defense", "Licensing Exam"]
      },
      admission: {
        academicCertificates: [
          "Baccalauréat with high grades (15/20 minimum)",
          "Official transcripts",
          "Pre-medical courses completion"
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
          "Parcoursup application",
          "Medical entrance exam results"
        ],
        visa: [
          "Valid passport",
          "Campus France certificate",
          "Financial proof (€615/month)",
          "Health insurance"
        ],
        medical: [
          "Medical examination",
          "Vaccination records",
          "Health insurance (Sécurité Sociale)"
        ],
        identity: [
          "Passport copy",
          "Birth certificate",
          "Photo ID"
        ]
      },
      costs: {
        tuition: "€243/year",
        applicationFee: "€150",
        serviceFee: "€150",
        livingCosts: "€800-1200/month",
        healthInsurance: "€215/year",
        books: "€500/year",
        totalFirstYear: "€10,000-15,000"
      },
      campus: {
        name: "Sorbonne University Medical Campus",
        location: "Paris, France",
        facilities: [
          "Modern anatomy laboratories",
          "Clinical simulation center",
          "Medical library",
          "Student health center"
        ],
        housing: [
          "CROUS student housing",
          "Private student residences",
          "Shared apartments"
        ]
      },
      faculty: [
        {
          name: "Prof. Marie Dubois",
          title: "Professor of Internal Medicine",
          expertise: "Cardiology, Internal Medicine",
          bio: "Leading cardiologist with 20+ years of experience"
        }
      ],
      rankings: {
        qs: 83,
        times: 95,
        arwu: 78,
        usNews: 89
      },
      statistics: {
        acceptanceRate: "8%",
        averageGrade: "16/20",
        classSize: "200 students",
        internationalStudents: "15%"
      },
      photos: [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop"
      ],
      videos: [
        {
          title: "Medical Campus Tour",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
        }
      ],
      locations: [
        {
          name: "Medical Campus - Latin Quarter",
          address: "21 Rue de l'École de Médecine, 75006 Paris, France",
          type: "Main Campus",
          facilities: ["Anatomy labs", "Clinical simulation", "Medical library"],
          mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991440608142!2d2.3442143156744144!3d48.85061017928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671d877937b0f%3A0x4b0e5b5b5b5b5b5b!2sSorbonne%20University!5e0!3m2!1sen!2sfr!4v1234567890123!5m2!1sen!2sfr"
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setProgram(programsData[programId]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [programId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading Program Details...</h2>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Not Found</h2>
          <Link to="/establishments" className="text-blue-600 hover:text-blue-800">
            ← Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  const seoData = {
    title: `${program.name} - ${program.university} | E-TAWJIHI Global`,
    description: `Discover ${program.name} at ${program.university}. ${program.description} Apply now for ${program.startDate} intake.`,
    keywords: `${program.name}, ${program.university}, ${program.degree}, study abroad, international education, ${program.country}`,
    canonical: `https://e-tawjihi.ma/programs/${program.id}`,
    ogImage: program.logo
  };

  const getStudyTypeLabel = (type) => {
    switch (type) {
      case 'on-campus': return language === 'en' ? 'On-Campus' : 'Présentiel';
      case 'hybrid': return language === 'en' ? 'Hybrid' : 'Hybride';
      case 'online': return language === 'en' ? 'Online' : 'En ligne';
      default: return type;
    }
  };

  return (
    <>
      <SEO {...seoData} />
      <HeaderAuth language={language} setLanguage={setLanguage} />
      
      <div className="pt-24 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link to="/establishments" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              {language === 'en' ? 'Back to Programs' : 'Retour aux Programmes'}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{program.name}</span>
          </div>

          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* University Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src={program.logo} 
                    alt={`${program.university} logo`}
                    className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{program.name}</h1>
                    <h2 className="text-xl text-gray-700 mb-2">{program.university}</h2>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{program.city}, {program.country}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{program.degree}</div>
                    <div className="text-sm text-gray-600">{language === 'en' ? 'Degree' : 'Diplôme'}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{program.duration}</div>
                    <div className="text-sm text-gray-600">{language === 'en' ? 'Duration' : 'Durée'}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{getStudyTypeLabel(program.studyType)}</div>
                    <div className="text-sm text-gray-600">{language === 'en' ? 'Study Type' : 'Type d\'Étude'}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">#{program.ranking}</div>
                    <div className="text-sm text-gray-600">{language === 'en' ? 'QS Ranking' : 'Classement QS'}</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {program.aidvisorRecommended && (
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {language === 'en' ? 'E-DVISOR Recommended' : 'Recommandé par E-DVISOR'}
                    </div>
                  )}
                  {program.featured && (
                    <div className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {language === 'en' ? 'Featured' : 'En vedette'}
                    </div>
                  )}
                  {/* University Type Badge */}
                  {(() => {
                    const typeInfo = getUniversityTypeInfo(program);
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

                {/* Key Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{program.tuition}</div>
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Tuition Fee' : 'Frais de Scolarité'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{program.startDate}</div>
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Start Date' : 'Date de Début'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{program.applicationDeadline}</div>
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Application Deadline' : 'Date Limite'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{program.language}</div>
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Language' : 'Langue'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:w-80">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {language === 'en' ? 'Ready to Apply?' : 'Prêt à Postuler ?'}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <button className={`w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      program.universityType === 'A' 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    }`}>
                      <FileText className="w-4 h-4" />
                      {program.universityType === 'A' 
                        ? (language === 'en' ? 'FREE APPLY' : 'CANDIDATURE GRATUITE')
                        : (language === 'en' ? 'APPLY NOW' : 'POSTULER MAINTENANT')
                      }
                    </button>
                    
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {language === 'en' ? 'Contact Advisor' : 'Contacter un Conseiller'}
                    </button>
                    
                    <button 
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isFavorite 
                          ? 'bg-red-100 text-red-600 border border-red-200' 
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? (language === 'en' ? 'Saved' : 'Sauvegardé') : (language === 'en' ? 'Save Program' : 'Sauvegarder')}
                    </button>
                    
                    <button className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      {language === 'en' ? 'Share' : 'Partager'}
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{language === 'en' ? 'Need Help?' : 'Besoin d\'Aide ?'}</span>
                    </div>
                    <div className="space-y-2">
                      <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {language === 'en' ? 'Call Advisor' : 'Appeler Conseiller'}
                      </button>
                      <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {language === 'en' ? 'Email Support' : 'Support Email'}
                      </button>
                    </div>
                  </div>
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
                  ? 'Get instant feedback on your admission chances for this program using our advanced AI system. Receive personalized recommendations and insights.'
                  : 'Obtenez un retour instantané sur vos chances d\'admission pour ce programme en utilisant notre système IA avancé. Recevez des recommandations et des conseils personnalisés.'
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
                  ? `Calculate your visa requirements, processing times, and estimated costs for studying in ${program.country}. Get personalized guidance and document checklists.`
                  : `Calculez vos exigences de visa, délais de traitement et coûts estimés pour étudier au ${program.country}. Obtenez des conseils personnalisés et des listes de documents.`
                }
              </p>
              <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                {language === 'en' ? 'Calculate Visa' : 'Calculer le Visa'}
              </button>
            </div>
          </div>

          {/* University Type and Application Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Application Information' : 'Informations de Candidature'}
            </h3>
            {(() => {
              const typeInfo = getUniversityTypeInfo(program);
              const serviceFee = getServiceFee(program);
              
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

          {/* Quick Navigation Links */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Quick Navigation' : 'Navigation Rapide'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'overview', label: language === 'en' ? 'Overview' : 'Aperçu' },
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

          {/* Course Overview Section */}
          <div id="overview" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Course Overview' : 'Aperçu du Cours'}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              {program.overview.description}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Key Program Highlights' : 'Points Forts du Programme'}
                </h4>
                <ul className="space-y-3">
                  {program.overview.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Career Outcomes' : 'Débouchés Professionnels'}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {program.overview.careerOutcomes.map((career, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-3 text-center">
                      <span className="text-sm font-medium text-blue-800">{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Requirements Section */}
          <div id="admission" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Requirements' : 'Exigences'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'en' 
                ? 'The requirements may vary based on your selected study options.'
                : 'Les exigences peuvent varier selon vos options d\'études sélectionnées.'
              }
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Academic Certificates' : 'Certificats Académiques'}
                </h4>
                <ul className="space-y-2">
                  {program.admission.academicCertificates.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'English Language Tests' : 'Tests de Langue Anglaise'}
                </h4>
                <ul className="space-y-2">
                  {program.admission.englishLanguageTests.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Required Documents' : 'Documents Requis'}
                </h4>
                <ul className="space-y-2">
                  {program.admission.requiredDocuments.map((doc, index) => (
                    <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700 text-sm">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Visa' : 'Visa'}
                </h4>
                <ul className="space-y-2">
                  {program.admission.visa.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Medical' : 'Médical'}
                </h4>
                <ul className="space-y-2">
                  {program.admission.medical.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Identity' : 'Identité'}
                </h4>
                <ul className="space-y-2">
                  {program.admission.identity.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>


          {/* Need Help Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'en' ? 'Need help?' : 'Besoin d\'aide ?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'en' 
                  ? 'Hop onto a video counselling session with your dedicated counsellor to get all your queries answered.'
                  : 'Rejoignez une session de conseil vidéo avec votre conseiller dédié pour obtenir des réponses à toutes vos questions.'
                }
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                {language === 'en' ? 'Book a session' : 'Réserver une session'}
              </button>
            </div>
          </div>

          {/* Curriculum Section */}
          <div id="curriculum" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Curriculum Structure' : 'Structure du Programme'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Core Courses' : 'Cours Principaux'}
                </h4>
                <ul className="space-y-2">
                  {program.curriculum.coreCourses.map((course, index) => (
                    <li key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">{course}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Elective Courses' : 'Cours Optionnels'}
                </h4>
                <ul className="space-y-2">
                  {program.curriculum.electives.map((course, index) => (
                    <li key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{course}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-3">
                {language === 'en' ? 'Thesis/Capstone Project' : 'Thèse/Projet de Fin d\'Études'}
              </h4>
              <p className="text-gray-600">{program.curriculum.thesis}</p>
            </div>
          </div>

          {/* Costs Section */}
          <div id="costs" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Program Costs' : 'Coûts du Programme'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Tuition Fees' : 'Frais de Scolarité'}
                </h4>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="font-semibold text-green-800">
                      {language === 'en' ? 'Domestic Students' : 'Étudiants Nationaux'}
                    </div>
                    <div className="text-2xl font-bold text-green-600">{program.costs.tuition.domestic}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="font-semibold text-blue-800">
                      {language === 'en' ? 'International Students' : 'Étudiants Internationaux'}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{program.costs.tuition.international}</div>
                  </div>
                </div>

                <h5 className="text-lg font-bold text-gray-900 mt-6 mb-3">
                  {language === 'en' ? 'Additional Fees' : 'Frais Supplémentaires'}
                </h5>
                <ul className="space-y-2">
                  {program.costs.fees.map((fee, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{fee}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Living Expenses' : 'Frais de Vie'}
                </h4>
                <div className="space-y-3">
                  {Object.entries(program.costs.living).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize">
                        {category === 'accommodation' ? (language === 'en' ? 'Accommodation' : 'Hébergement') :
                         category === 'food' ? (language === 'en' ? 'Food' : 'Nourriture') :
                         category === 'transportation' ? (language === 'en' ? 'Transportation' : 'Transport') :
                         category === 'books' ? (language === 'en' ? 'Books & Supplies' : 'Livres & Fournitures') :
                         category === 'personal' ? (language === 'en' ? 'Personal Expenses' : 'Dépenses Personnelles') :
                         category}
                      </span>
                      <span className="font-semibold text-gray-900">{amount}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h5 className="text-lg font-bold text-gray-900 mb-2">
                    {language === 'en' ? 'Total Estimated Cost' : 'Coût Total Estimé'}
                  </h5>
                  <div className="text-3xl font-bold text-blue-600">{program.costs.total}</div>
                  <p className="text-sm text-gray-600 mt-2">
                    {language === 'en' ? 'Per year for international students' : 'Par an pour les étudiants internationaux'}
                  </p>
                </div>
              </div>
            </div>

            {program.scholarships && program.scholarships.length > 0 && (
              <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Available Scholarships' : 'Bourses Disponibles'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.scholarships.map((scholarship, index) => (
                    <div key={index} className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                      <h5 className="text-lg font-bold text-yellow-800 mb-2">{scholarship.name}</h5>
                      <div className="text-2xl font-bold text-yellow-600 mb-2">{scholarship.amount}</div>
                      <p className="text-gray-600 mb-3">{scholarship.description}</p>
                      <div>
                        <h6 className="font-semibold text-gray-900 mb-2">
                          {language === 'en' ? 'Requirements:' : 'Exigences :'}
                        </h6>
                        <ul className="space-y-1">
                          {scholarship.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-yellow-600">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Campus Section */}
          <div id="campus" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Campus & Facilities' : 'Campus & Installations'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Campus Location' : 'Localisation du Campus'}
                </h4>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{program.campus.location}</span>
                  </div>
                </div>

                <h5 className="text-lg font-bold text-gray-900 mb-3">
                  {language === 'en' ? 'Campus Facilities' : 'Installations du Campus'}
                </h5>
                <ul className="space-y-2">
                  {program.campus.facilities.map((facility, index) => (
                    <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">{facility}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Student Housing' : 'Logement Étudiant'}
                </h4>
                <ul className="space-y-3">
                  {program.campus.housing.map((option, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {program.faculty && program.faculty.length > 0 && (
              <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Key Faculty Members' : 'Membres Clés du Corps Enseignant'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.faculty.map((member, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                      <h5 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h5>
                      <div className="text-blue-600 font-semibold mb-2">{member.title}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">{language === 'en' ? 'Expertise:' : 'Expertise :'}</span> {member.expertise}
                      </div>
                      <p className="text-sm text-gray-500">{member.bio}</p>
                    </div>
                  ))}
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
              {program.photos.map((photo, index) => (
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
              {program.videos.map((video, index) => (
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
              {program.locations.map((location, index) => (
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
                onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : program.photos.length - 1)}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              
              <img
                src={program.photos[selectedImageIndex]}
                alt={`Campus photo ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              <button
                onClick={() => setSelectedImageIndex(prev => prev < program.photos.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
              >
                <ArrowLeft className="w-8 h-8 rotate-180" />
              </button>
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <p className="text-sm">
                {selectedImageIndex + 1} / {program.photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgramDetail;

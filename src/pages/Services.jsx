import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import HeaderGlobal from '../components/landing/HeaderGlobal';
import { 
  FileCheck, 
  Home, 
  Languages, 
  CreditCard, 
  ClipboardList,
  MapPin,
  Star,
  CheckCircle,
  Phone,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Globe,
  Shield,
  Clock,
  Users,
  Award,
  BookOpen,
  GraduationCap,
  Building2,
  DollarSign,
  Calendar,
  Mail,
  ExternalLink
} from 'lucide-react';

const Services = () => {
  const [language, setLanguage] = useState('en');
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [activeService, setActiveService] = useState('visa');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const servicesData = {
    en: {
      hero: {
        title: "Comprehensive Student Services",
        subtitle: "Your Complete Support System for International Education",
        description: "From visa assistance to housing solutions, we provide end-to-end support to make your international education journey seamless and successful."
      },
      services: {
        title: "Our Services",
        subtitle: "Everything You Need for Your Educational Journey",
        items: [
          {
            id: 'visa',
            title: 'Visa Assistance',
            description: 'Complete visa support for all countries',
            icon: <FileCheck className="w-8 h-8" />,
            color: 'from-blue-600 to-blue-700',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
          },
          {
            id: 'housing',
            title: 'Student Housing',
            description: 'Safe and comfortable accommodation',
            icon: <Home className="w-8 h-8" />,
            color: 'from-green-600 to-green-700',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
          },
          {
            id: 'translation',
            title: 'Document Translation',
            description: 'Certified translation services',
            icon: <Languages className="w-8 h-8" />,
            color: 'from-purple-600 to-purple-700',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
          },
          {
            id: 'vouchers',
            title: 'Test Service Vouchers',
            description: 'Discounted test vouchers and prep',
            icon: <CreditCard className="w-8 h-8" />,
            color: 'from-orange-600 to-orange-700',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
          },
          {
            id: 'admission',
            title: 'Admission & Application',
            description: 'Complete application assistance',
            icon: <ClipboardList className="w-8 h-8" />,
            color: 'from-pink-600 to-pink-700',
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-200'
          },
          {
            id: 'scholarships',
            title: 'Paid Scholarships',
            description: 'University partner scholarships with tuition discounts',
            icon: <Award className="w-8 h-8" />,
            color: 'from-indigo-600 to-indigo-700',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200'
          }
        ]
      }
    },
    fr: {
      hero: {
        title: "Services Étudiants Complets",
        subtitle: "Votre Système de Support Complet pour l'Éducation Internationale",
        description: "De l'assistance visa aux solutions de logement, nous fournissons un support de bout en bout pour rendre votre parcours éducatif international fluide et réussi."
      },
      services: {
        title: "Nos Services",
        subtitle: "Tout Ce Dont Vous Avez Besoin pour Votre Parcours Éducatif",
        items: [
          {
            id: 'visa',
            title: 'Assistance Visa',
            description: 'Support visa complet pour tous les pays',
            icon: <FileCheck className="w-8 h-8" />,
            color: 'from-blue-600 to-blue-700',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
          },
          {
            id: 'housing',
            title: 'Logement Étudiant',
            description: 'Hébergement sûr et confortable',
            icon: <Home className="w-8 h-8" />,
            color: 'from-green-600 to-green-700',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
          },
          {
            id: 'translation',
            title: 'Traduction de Documents',
            description: 'Services de traduction certifiés',
            icon: <Languages className="w-8 h-8" />,
            color: 'from-purple-600 to-purple-700',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
          },
          {
            id: 'vouchers',
            title: 'Bons de Service de Test',
            description: 'Bons de test réduits et préparation',
            icon: <CreditCard className="w-8 h-8" />,
            color: 'from-orange-600 to-orange-700',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
          },
          {
            id: 'admission',
            title: 'Admission & Candidature',
            description: 'Assistance complète aux candidatures',
            icon: <ClipboardList className="w-8 h-8" />,
            color: 'from-pink-600 to-pink-700',
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-200'
          },
          {
            id: 'scholarships',
            title: 'Bourses Payantes',
            description: 'Bourses partenaires universitaires avec réductions sur les frais',
            icon: <Award className="w-8 h-8" />,
            color: 'from-indigo-600 to-indigo-700',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200'
          }
        ]
      }
    }
  };

  const seoData = {
    title: language === 'en' 
      ? 'Student Services - Visa, Housing, Translation & More | E-TAWJIHI Global' 
      : 'Services Étudiants - Visa, Logement, Traduction & Plus | E-TAWJIHI Global',
    description: language === 'en'
      ? 'Complete student services for international education: visa assistance, student housing, document translation, test vouchers, and admission support. Expert guidance for studying abroad.'
      : 'Services étudiants complets pour l\'éducation internationale : assistance visa, logement étudiant, traduction de documents, bons de test et support d\'admission. Conseils d\'experts pour étudier à l\'étranger.',
    keywords: language === 'en'
      ? 'student services, visa assistance, student housing, document translation, test vouchers, admission support, study abroad services, international education support'
      : 'services étudiants, assistance visa, logement étudiant, traduction documents, bons de test, support admission, services études à l\'étranger, support éducation internationale',
    canonical: 'https://e-tawjihi-global.com/services',
    ogType: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": language === 'en' ? "Student Services" : "Services Étudiants",
      "description": language === 'en' 
        ? "Comprehensive student services for international education including visa assistance, housing, translation, and admission support"
        : "Services étudiants complets pour l'éducation internationale incluant assistance visa, logement, traduction et support d'admission",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "E-TAWJIHI Global",
        "url": "https://e-tawjihi-global.com"
      },
      "serviceType": "Education Services",
      "areaServed": [
        "United States", "United Kingdom", "Canada", "Australia", "Germany", "France"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": language === 'en' ? "Student Services" : "Services Étudiants",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": language === 'en' ? "Visa Assistance" : "Assistance Visa"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": language === 'en' ? "Student Housing" : "Logement Étudiant"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": language === 'en' ? "Document Translation" : "Traduction de Documents"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": language === 'en' ? "Test Service Vouchers" : "Bons de Service de Test"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": language === 'en' ? "Admission & Application Assistance" : "Assistance Admission & Candidature"
            }
          }
        ]
      }
    },
    alternateLanguages: [
      { code: 'en', url: 'https://e-tawjihi-global.com/services' },
      { code: 'fr', url: 'https://e-tawjihi-global.com/fr/services' }
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {servicesData[language].hero.title}
            </h1>
            <p className="text-2xl text-blue-600 font-semibold mb-8">
              {servicesData[language].hero.subtitle}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {servicesData[language].hero.description}
            </p>
          </motion.div>

          {/* Quick Access Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {servicesData[language].services.items.map((service, index) => (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => scrollToSection(service.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${service.bgColor} ${service.borderColor} text-gray-700 hover:scale-105`}
              >
                <div className="p-2 rounded-lg bg-white">
                  {service.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{service.title}</div>
                  <div className="text-sm text-gray-500">
                    {service.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Visa Assistance Section */}
      <section id="visa" className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Visa Assistance' : 'Assistance Visa'}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-6">
              {language === 'en' ? 'Complete Visa Support for All Destinations' : 'Support Visa Complet pour Toutes les Destinations'}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Our comprehensive visa assistance service ensures you have all the support needed to obtain your student visa successfully.'
                : 'Notre service d\'assistance visa complet garantit que vous avez tout le support nécessaire pour obtenir votre visa étudiant avec succès.'
              }
            </p>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: language === 'en' ? 'Document Preparation' : 'Préparation des Documents',
                description: language === 'en' ? 'Complete guidance on required documents and forms' : 'Guidance complète sur les documents et formulaires requis',
                details: language === 'en' 
                  ? ['Passport verification and renewal assistance', 'Academic transcripts and certificates preparation', 'Financial documents and bank statements', 'Medical examination and insurance documents', 'Statement of purpose and recommendation letters']
                  : ['Vérification et renouvellement de passeport', 'Préparation des relevés et certificats académiques', 'Documents financiers et relevés bancaires', 'Examens médicaux et documents d\'assurance', 'Lettres de motivation et de recommandation']
              },
              {
                title: language === 'en' ? 'Application Submission' : 'Soumission de Candidature',
                description: language === 'en' ? 'Expert assistance with visa application process' : 'Assistance experte avec le processus de candidature visa',
                details: language === 'en'
                  ? ['Online application form completion', 'Appointment scheduling with embassies/consulates', 'Document submission and tracking', 'Interview preparation and coaching', 'Application status monitoring']
                  : ['Completion des formulaires de candidature en ligne', 'Planification des rendez-vous avec ambassades/consulats', 'Soumission et suivi des documents', 'Préparation et coaching d\'entretien', 'Surveillance du statut de candidature']
              },
              {
                title: language === 'en' ? 'Country-Specific Support' : 'Support Spécifique par Pays',
                description: language === 'en' ? 'Tailored assistance based on destination country' : 'Assistance adaptée basée sur le pays de destination',
                details: language === 'en'
                  ? ['Understanding specific visa requirements', 'Local embassy/consulate procedures', 'Country-specific document requirements', 'Timeline and processing information', 'Post-approval guidance']
                  : ['Compréhension des exigences visa spécifiques', 'Procédures d\'ambassade/consulat locales', 'Exigences de documents spécifiques au pays', 'Informations sur délais et traitement', 'Guidance post-approbation']
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Countries */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'Country-Specific Information' : 'Informations Spécifiques par Pays'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries({
                "United States": {
                  visaType: language === 'en' ? "F-1 Student Visa" : "Visa Étudiant F-1",
                  processingTime: language === 'en' ? "2-8 weeks" : "2-8 semaines",
                  requirements: language === 'en' 
                    ? ["SEVIS fee payment", "I-20 form from university", "Financial proof ($25,000+ annually)", "English proficiency test (TOEFL/IELTS)", "Interview at US Embassy/Consulate"]
                    : ["Paiement des frais SEVIS", "Formulaire I-20 de l'université", "Preuve financière ($25,000+ annuellement)", "Test de maîtrise anglaise (TOEFL/IELTS)", "Entretien à l'Ambassade/Consulat US"],
                  specialNotes: language === 'en' ? "DS-160 form completion, biometric appointment required" : "Completion formulaire DS-160, rendez-vous biométrique requis"
                },
                "United Kingdom": {
                  visaType: language === 'en' ? "Student Visa (Tier 4)" : "Visa Étudiant (Tier 4)",
                  processingTime: language === 'en' ? "3-6 weeks" : "3-6 semaines",
                  requirements: language === 'en'
                    ? ["CAS (Confirmation of Acceptance for Studies)", "Financial proof (£1,334/month for London, £1,023/month outside)", "English proficiency (IELTS/TOEFL/PTE)", "Tuberculosis test (if required)", "Academic Technology Approval Scheme (ATAS) if applicable"]
                    : ["CAS (Confirmation d'Acceptation pour Études)", "Preuve financière (£1,334/mois pour Londres, £1,023/mois ailleurs)", "Maîtrise anglaise (IELTS/TOEFL/PTE)", "Test tuberculose (si requis)", "Schéma d'Approbation Technologie Académique (ATAS) si applicable"],
                  specialNotes: language === 'en' ? "Healthcare surcharge payment, biometric residence permit" : "Paiement surcharge santé, permis de séjour biométrique"
                },
                "Canada": {
                  visaType: language === 'en' ? "Study Permit" : "Permis d'Études",
                  processingTime: language === 'en' ? "4-8 weeks" : "4-8 semaines",
                  requirements: language === 'en'
                    ? ["Letter of Acceptance from DLI", "Proof of financial support (CAD $10,000+ annually)", "English/French proficiency test", "Medical examination", "Police clearance certificate"]
                    : ["Lettre d'Acceptation d'Établissement DLI", "Preuve de support financier (CAD $10,000+ annuellement)", "Test de maîtrise anglais/français", "Examen médical", "Certificat de casier judiciaire"],
                  specialNotes: language === 'en' ? "Biometric collection, electronic travel authorization (eTA)" : "Collecte biométrique, autorisation de voyage électronique (eTA)"
                },
                "Australia": {
                  visaType: language === 'en' ? "Student Visa (Subclass 500)" : "Visa Étudiant (Sous-classe 500)",
                  processingTime: language === 'en' ? "4-12 weeks" : "4-12 semaines",
                  requirements: language === 'en'
                    ? ["Confirmation of Enrollment (CoE)", "Genuine Temporary Entrant (GTE) statement", "Financial proof (AUD $21,041 annually)", "English proficiency test", "Overseas Student Health Cover (OSHC)"]
                    : ["Confirmation d'Inscription (CoE)", "Déclaration Entrant Temporaire Authentique (GTE)", "Preuve financière (AUD $21,041 annuellement)", "Test de maîtrise anglaise", "Couverture Santé Étudiant Outre-mer (OSHC)"],
                  specialNotes: language === 'en' ? "Health examinations, character requirements" : "Examens de santé, exigences de caractère"
                },
                "Germany": {
                  visaType: language === 'en' ? "Student Visa (Type D)" : "Visa Étudiant (Type D)",
                  processingTime: language === 'en' ? "4-12 weeks" : "4-12 semaines",
                  requirements: language === 'en'
                    ? ["University admission letter", "Proof of financial resources (€10,332 annually)", "German language proficiency (if required)", "Health insurance coverage", "Motivation letter"]
                    : ["Lettre d'admission universitaire", "Preuve de ressources financières (€10,332 annuellement)", "Maîtrise allemande (si requise)", "Couverture d'assurance santé", "Lettre de motivation"],
                  specialNotes: language === 'en' ? "Blocked account (Sperrkonto), residence permit after arrival" : "Compte bloqué (Sperrkonto), permis de séjour après arrivée"
                },
                "France": {
                  visaType: language === 'en' ? "Long Stay Student Visa" : "Visa Long Séjour Étudiant",
                  processingTime: language === 'en' ? "2-4 weeks" : "2-4 semaines",
                  requirements: language === 'en'
                    ? ["Campus France procedure completion", "Proof of financial resources (€615/month)", "French language proficiency (if required)", "Health insurance", "Accommodation proof"]
                    : ["Completion procédure Campus France", "Preuve de ressources financières (€615/mois)", "Maîtrise française (si requise)", "Assurance santé", "Preuve d'hébergement"],
                  specialNotes: language === 'en' ? "OFII procedure after arrival, residence permit application" : "Procédure OFII après arrivée, candidature permis de séjour"
                }
              }).map(([country, info], index) => (
                <motion.div
                  key={country}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow"
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="text-lg font-bold text-gray-900">{country}</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-blue-600">
                        {language === 'en' ? 'Visa Type:' : 'Type de Visa:'}
                      </span>
                      <p className="text-sm text-gray-700">{info.visaType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-blue-600">
                        {language === 'en' ? 'Processing Time:' : 'Délai de Traitement:'}
                      </span>
                      <p className="text-sm text-gray-700">{info.processingTime}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-blue-600">
                        {language === 'en' ? 'Requirements:' : 'Exigences:'}
                      </span>
                      <ul className="text-xs text-gray-600 mt-1 space-y-1">
                        {info.requirements.slice(0, 3).map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start">
                            <Star className="w-3 h-3 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                        {info.requirements.length > 3 && (
                          <li className="text-blue-600 font-medium">
                            +{info.requirements.length - 3} {language === 'en' ? 'more' : 'de plus'}
                          </li>
                        )}
                      </ul>
                    </div>
                    {info.specialNotes && (
                      <div>
                        <span className="text-sm font-semibold text-orange-600">
                          {language === 'en' ? 'Special Notes:' : 'Notes Spéciales:'}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">{info.specialNotes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Student Housing Section */}
      <section id="housing" className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Student Housing' : 'Logement Étudiant'}
            </h2>
            <p className="text-xl text-green-600 font-semibold mb-6">
              {language === 'en' ? 'Safe and Comfortable Accommodation' : 'Hébergement Sûr et Confortable'}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Find the perfect place to call home during your studies. We offer a wide range of housing options tailored to your needs and budget.'
                : 'Trouvez l\'endroit parfait pour vous sentir chez vous pendant vos études. Nous offrons une large gamme d\'options de logement adaptées à vos besoins et budget.'
              }
            </p>
          </motion.div>

          {/* Housing Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: language === 'en' ? 'University Dormitories' : 'Résidences Universitaires',
                description: language === 'en' ? 'On-campus accommodation with full amenities' : 'Hébergement sur campus avec toutes les commodités',
                features: language === 'en' 
                  ? ['Furnished rooms', 'Shared common areas', '24/7 security', 'Laundry facilities', 'Internet included', 'Meal plans available']
                  : ['Chambres meublées', 'Espaces communs partagés', 'Sécurité 24h/24', 'Laverie', 'Internet inclus', 'Plans de repas disponibles'],
                price: language === 'en' ? '$800-1500/month' : '800-1500$/mois',
                icon: <Building2 className="w-8 h-8" />
              },
              {
                title: language === 'en' ? 'Shared Apartments' : 'Appartements Partagés',
                description: language === 'en' ? 'Private rooms in shared apartments' : 'Chambres privées dans des appartements partagés',
                features: language === 'en'
                  ? ['Private bedroom', 'Shared kitchen and living room', 'Utilities included', 'Flexible lease terms', 'Student-friendly areas', 'Public transport access']
                  : ['Chambre privée', 'Cuisine et salon partagés', 'Charges incluses', 'Baux flexibles', 'Zones étudiantes', 'Accès transport public'],
                price: language === 'en' ? '$600-1200/month' : '600-1200$/mois',
                icon: <Home className="w-8 h-8" />
              },
              {
                title: language === 'en' ? 'Homestay Programs' : 'Programmes Famille d\'Accueil',
                description: language === 'en' ? 'Live with local families for cultural immersion' : 'Vivez avec des familles locales pour l\'immersion culturelle',
                features: language === 'en'
                  ? ['Cultural exchange', 'Meals included', 'Local family support', 'Language practice', 'Safe environment', 'Cultural activities']
                  : ['Échange culturel', 'Repas inclus', 'Support famille locale', 'Pratique de langue', 'Environnement sûr', 'Activités culturelles'],
                price: language === 'en' ? '$700-1300/month' : '700-1300$/mois',
                icon: <Users className="w-8 h-8" />
              }
            ].map((housing, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                    {housing.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{housing.title}</h3>
                    <p className="text-green-600 font-semibold">{housing.price}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{housing.description}</p>
                <ul className="space-y-2">
                  {housing.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Housing Process */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'How Our Housing Service Works' : 'Comment Fonctionne Notre Service de Logement'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: language === 'en' ? '1. Application' : '1. Candidature',
                  title: language === 'en' ? 'Submit Your Preferences' : 'Soumettez Vos Préférences',
                  description: language === 'en' ? 'Tell us your budget, location preferences, and requirements' : 'Dites-nous votre budget, préférences de localisation et exigences'
                },
                {
                  step: language === 'en' ? '2. Matching' : '2. Correspondance',
                  title: language === 'en' ? 'We Find Options' : 'Nous Trouvons des Options',
                  description: language === 'en' ? 'Our team searches for suitable housing options' : 'Notre équipe recherche des options de logement appropriées'
                },
                {
                  step: language === 'en' ? '3. Viewing' : '3. Visite',
                  title: language === 'en' ? 'Virtual or In-Person Tours' : 'Visites Virtuelles ou en Personne',
                  description: language === 'en' ? 'Arrange property viewings and inspections' : 'Organisez des visites et inspections de propriétés'
                },
                {
                  step: language === 'en' ? '4. Booking' : '4. Réservation',
                  title: language === 'en' ? 'Secure Your Place' : 'Sécurisez Votre Place',
                  description: language === 'en' ? 'Complete paperwork and secure your accommodation' : 'Complétez la paperasserie et sécurisez votre hébergement'
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Document Translation Section */}
      <section id="translation" className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Document Translation' : 'Traduction de Documents'}
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-6">
              {language === 'en' ? 'Certified Translation Services' : 'Services de Traduction Certifiés'}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Get your academic and legal documents professionally translated and certified for international use.'
                : 'Obtenez vos documents académiques et légaux traduits et certifiés professionnellement pour usage international.'
              }
            </p>
          </motion.div>

          {/* Translation Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                title: language === 'en' ? 'Academic Documents' : 'Documents Académiques',
                description: language === 'en' ? 'Official translations of educational certificates and transcripts' : 'Traductions officielles de certificats et relevés éducatifs',
                documents: language === 'en' 
                  ? ['Diplomas and degrees', 'Academic transcripts', 'Certificates of completion', 'Letters of recommendation', 'Academic records', 'Research papers']
                  : ['Diplômes et grades', 'Relevés académiques', 'Certificats de completion', 'Lettres de recommandation', 'Dossiers académiques', 'Articles de recherche'],
                icon: <GraduationCap className="w-8 h-8" />,
                color: 'purple'
              },
              {
                title: language === 'en' ? 'Legal Documents' : 'Documents Légaux',
                description: language === 'en' ? 'Official translations of legal and government documents' : 'Traductions officielles de documents légaux et gouvernementaux',
                documents: language === 'en'
                  ? ['Birth certificates', 'Marriage certificates', 'Police clearance certificates', 'Medical reports', 'Bank statements', 'Employment letters']
                  : ['Actes de naissance', 'Actes de mariage', 'Certificats de casier judiciaire', 'Rapports médicaux', 'Relevés bancaires', 'Lettres d\'emploi'],
                icon: <Shield className="w-8 h-8" />,
                color: 'blue'
              }
            ].map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg bg-${type.color}-100 text-${type.color}-600 mr-4`}>
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{type.title}</h3>
                    <p className="text-gray-600">{type.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {type.documents.map((doc, docIndex) => (
                    <div key={docIndex} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Translation Process */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'Translation Process' : 'Processus de Traduction'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: language === 'en' ? 'Submit Documents' : 'Soumettre Documents',
                  description: language === 'en' ? 'Upload your documents securely through our platform' : 'Téléchargez vos documents en toute sécurité via notre plateforme',
                  time: language === 'en' ? 'Same day' : 'Même jour'
                },
                {
                  title: language === 'en' ? 'Professional Translation' : 'Traduction Professionnelle',
                  description: language === 'en' ? 'Certified translators work on your documents' : 'Des traducteurs certifiés travaillent sur vos documents',
                  time: language === 'en' ? '2-5 days' : '2-5 jours'
                },
                {
                  title: language === 'en' ? 'Certification & Delivery' : 'Certification & Livraison',
                  description: language === 'en' ? 'Documents are certified and delivered to you' : 'Les documents sont certifiés et livrés',
                  time: language === 'en' ? '1-2 days' : '1-2 jours'
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <p className="text-xs text-purple-600 font-medium">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Test Service Vouchers Section */}
      <section id="vouchers" className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Test Service Vouchers' : 'Bons de Service de Test'}
            </h2>
            <p className="text-xl text-orange-600 font-semibold mb-6">
              {language === 'en' ? 'Discounted Test Vouchers and Preparation' : 'Bons de Test Réduits et Préparation'}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Save money on standardized tests with our discounted vouchers and get comprehensive preparation support.'
                : 'Économisez de l\'argent sur les tests standardisés avec nos bons réduits et obtenez un support de préparation complet.'
              }
            </p>
          </motion.div>

          {/* Test Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: 'PTE',
                description: language === 'en' ? 'Pearson Test of English - Secure computer-based test accepted worldwide' : 'Test d\'Anglais Pearson - Test informatisé sécurisé accepté dans le monde entier',
                originalPrice: language === 'en' ? '$240.00' : '240.00$',
                ourPrice: language === 'en' ? '$209.00' : '209.00$',
                savings: language === 'en' ? 'Save $31.00' : 'Économisez 31.00$',
                features: language === 'en' 
                  ? ['Official test voucher', 'Computer-based testing', 'Fast results', 'Global acceptance']
                  : ['Bon de test officiel', 'Test informatisé', 'Résultats rapides', 'Acceptation mondiale'],
                status: 'available'
              },
              {
                name: 'TOEFL',
                description: language === 'en' ? 'Test of English as a Foreign Language - Accepted by 11,000+ institutions globally' : 'Test d\'Anglais comme Langue Étrangère - Accepté par 11,000+ institutions mondialement',
                originalPrice: language === 'en' ? '$275.00' : '275.00$',
                ourPrice: language === 'en' ? '$247.50' : '247.50$',
                savings: language === 'en' ? 'Save $27.50' : 'Économisez 27.50$',
                features: language === 'en'
                  ? ['Official test voucher', 'Global recognition', '11,000+ institutions', 'Score reports']
                  : ['Bon de test officiel', 'Reconnaissance mondiale', '11,000+ institutions', 'Rapports de scores'],
                status: 'available'
              },
              {
                name: 'Duolingo',
                description: language === 'en' ? 'Convenient, fast, and affordable English test trusted by 4,500+ institutions' : 'Test d\'anglais pratique, rapide et abordable approuvé par 4,500+ institutions',
                originalPrice: language === 'en' ? '$70.00' : '70.00$',
                ourPrice: language === 'en' ? '$57.00' : '57.00$',
                savings: language === 'en' ? 'Save $13.00' : 'Économisez 13.00$',
                features: language === 'en'
                  ? ['Official test voucher', 'Online testing', 'Fast results', '4,500+ institutions']
                  : ['Bon de test officiel', 'Test en ligne', 'Résultats rapides', '4,500+ institutions'],
                status: 'available'
              },
              {
                name: 'GRE',
                description: language === 'en' ? 'Graduate Record Examination - Globally recognized gold-standard admissions test' : 'Examen d\'Enregistrement des Diplômés - Test d\'admission standard reconnu mondialement',
                originalPrice: language === 'en' ? '$220.00' : '220.00$',
                ourPrice: language === 'en' ? '$209.00' : '209.00$',
                savings: language === 'en' ? 'Save $11.00' : 'Économisez 11.00$',
                features: language === 'en'
                  ? ['Official test voucher', 'Graduate school standard', 'Global recognition', 'Score analysis']
                  : ['Bon de test officiel', 'Standard école supérieure', 'Reconnaissance mondiale', 'Analyse des scores'],
                status: 'available'
              }
            ].map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative ${
                  test.status === 'sold-out' ? 'opacity-75' : ''
                }`}
              >
                {test.status === 'sold-out' && (
                  <div className="absolute top-4 right-4 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {language === 'en' ? 'Sold Out' : 'Épuisé'}
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{test.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{test.description}</p>
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <span className="text-lg text-gray-500 line-through">{test.originalPrice}</span>
                    <span className="text-2xl font-bold text-orange-600">{test.ourPrice}</span>
                  </div>
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {test.savings}
                  </span>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {test.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {test.status === 'available' ? (
                  <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                    {language === 'en' ? 'Buy Now' : 'Acheter Maintenant'}
                  </button>
                ) : (
                  <button 
                    disabled 
                    className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                  >
                    {language === 'en' ? 'Sold Out' : 'Épuisé'}
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Pricing Information */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-orange-100">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Pricing Information' : 'Informations sur les Prix'}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    {language === 'en' 
                      ? '• Prices are displayed in USD. During checkout you can pay in your local currency using local payment options.'
                      : '• Les prix sont affichés en USD. Lors du paiement, vous pouvez payer dans votre devise locale en utilisant les options de paiement locales.'
                    }
                  </p>
                  <p>
                    {language === 'en' 
                      ? '• You must charge applicable taxes to the end customer. Voucher purchases may be subject to Reverse Charge procedures based on your local government\'s law.'
                      : '• Vous devez facturer les taxes applicables au client final. Les achats de bons peuvent être soumis à des procédures de Reverse Charge selon la loi de votre gouvernement local.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Admission & Application Section */}
      <section id="admission" className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Admission & Application Assistance' : 'Assistance Admission & Candidature'}
            </h2>
            <p className="text-xl text-pink-600 font-semibold mb-6">
              {language === 'en' ? 'Complete Application Support' : 'Support Complet aux Candidatures'}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Get expert guidance throughout your university application process, from choosing programs to securing admission.'
                : 'Obtenez des conseils d\'experts tout au long de votre processus de candidature universitaire, du choix des programmes à l\'obtention de l\'admission.'
              }
            </p>
          </motion.div>

          {/* Application Process */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                step: language === 'en' ? '1. Program Selection' : '1. Sélection de Programme',
                title: language === 'en' ? 'Choose Your Path' : 'Choisissez Votre Chemin',
                description: language === 'en' ? 'We help you identify the best programs and universities for your goals' : 'Nous vous aidons à identifier les meilleurs programmes et universités pour vos objectifs',
                icon: <BookOpen className="w-8 h-8" />
              },
              {
                step: language === 'en' ? '2. Application Preparation' : '2. Préparation de Candidature',
                title: language === 'en' ? 'Prepare Documents' : 'Préparez les Documents',
                description: language === 'en' ? 'Complete guidance on required documents and application materials' : 'Guidance complète sur les documents requis et matériel de candidature',
                icon: <ClipboardList className="w-8 h-8" />
              },
              {
                step: language === 'en' ? '3. Application Submission' : '3. Soumission de Candidature',
                title: language === 'en' ? 'Submit Applications' : 'Soumettez les Candidatures',
                description: language === 'en' ? 'Expert assistance with application forms and submission process' : 'Assistance experte avec les formulaires de candidature et processus de soumission',
                icon: <ExternalLink className="w-8 h-8" />
              },
              {
                step: language === 'en' ? '4. Follow-up & Support' : '4. Suivi & Support',
                title: language === 'en' ? 'Track Progress' : 'Suivez les Progrès',
                description: language === 'en' ? 'Ongoing support and follow-up until you receive admission decisions' : 'Support continu et suivi jusqu\'à ce que vous receviez les décisions d\'admission',
                icon: <Award className="w-8 h-8" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 text-center"
              >
                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="text-sm text-pink-600 font-medium mb-2">{step.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Services Offered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                title: language === 'en' ? 'University Research & Selection' : 'Recherche & Sélection d\'Université',
                services: language === 'en' 
                  ? ['Program matching based on interests', 'University ranking analysis', 'Admission requirements review', 'Scholarship opportunities research', 'Campus culture assessment', 'Career outcome analysis']
                  : ['Correspondance de programme basée sur les intérêts', 'Analyse des classements universitaires', 'Révision des exigences d\'admission', 'Recherche d\'opportunités de bourses', 'Évaluation de la culture du campus', 'Analyse des résultats de carrière']
              },
              {
                title: language === 'en' ? 'Application Support' : 'Support de Candidature',
                services: language === 'en'
                  ? ['Personal statement writing', 'Letter of recommendation guidance', 'Resume/CV preparation', 'Portfolio development', 'Application form completion', 'Document verification']
                  : ['Rédaction de déclaration personnelle', 'Guidance de lettre de recommandation', 'Préparation de CV', 'Développement de portfolio', 'Completion de formulaire de candidature', 'Vérification de documents']
              },
              {
                title: language === 'en' ? 'Interview Preparation' : 'Préparation d\'Entretien',
                services: language === 'en'
                  ? ['Mock interview sessions', 'Common questions practice', 'Presentation skills training', 'Confidence building', 'Cultural awareness training', 'Follow-up guidance']
                  : ['Sessions d\'entretien simulé', 'Pratique de questions communes', 'Formation aux compétences de présentation', 'Renforcement de la confiance', 'Formation de sensibilisation culturelle', 'Guidance de suivi']
              },
              {
                title: language === 'en' ? 'Post-Admission Support' : 'Support Post-Admission',
                services: language === 'en'
                  ? ['Visa application assistance', 'Housing arrangement support', 'Orientation preparation', 'Academic planning', 'Cultural adjustment guidance', 'Ongoing mentorship']
                  : ['Assistance de candidature visa', 'Support d\'arrangement de logement', 'Préparation d\'orientation', 'Planification académique', 'Guidance d\'ajustement culturel', 'Mentorat continu']
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">{service.title}</h3>
                <ul className="space-y-3">
                  {service.services.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-pink-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Success Statistics */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'Our Success Rate' : 'Notre Taux de Réussite'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  number: '95%',
                  label: language === 'en' ? 'Admission Success Rate' : 'Taux de Réussite d\'Admission'
                },
                {
                  number: '500+',
                  label: language === 'en' ? 'Students Helped' : 'Étudiants Aidés'
                },
                {
                  number: '50+',
                  label: language === 'en' ? 'Partner Universities' : 'Universités Partenaires'
                },
                {
                  number: '15+',
                  label: language === 'en' ? 'Countries Covered' : 'Pays Couverts'
                }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-pink-600 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Paid Scholarships Section */}
      <section id="scholarships" className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Paid Scholarships' : 'Bourses Payantes'}
            </h2>
            <p className="text-xl text-indigo-600 font-semibold mb-6">
              {language === 'en' ? 'University Partner Scholarships with Tuition Discounts' : 'Bourses Partenaires Universitaires avec Réductions sur les Frais'}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Access exclusive scholarships offered by our partner universities. These are special gifts from universities to their partners, and we have the right to commercialize them to help students reduce their tuition costs.'
                : 'Accédez à des bourses exclusives offertes par nos universités partenaires. Ce sont des cadeaux spéciaux des universités à leurs partenaires, et nous avons le droit de les commercialiser pour aider les étudiants à réduire leurs frais de scolarité.'
              }
            </p>
          </motion.div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'How Our Scholarship Service Works' : 'Comment Fonctionne Notre Service de Bourses'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: language === 'en' ? '1. Partnership' : '1. Partenariat',
                  title: language === 'en' ? 'University Partnerships' : 'Partenariats Universitaires',
                  description: language === 'en' ? 'We maintain exclusive partnerships with universities worldwide' : 'Nous maintenons des partenariats exclusifs avec des universités du monde entier'
                },
                {
                  step: language === 'en' ? '2. Scholarship Gifts' : '2. Cadeaux de Bourses',
                  title: language === 'en' ? 'University Gifts' : 'Cadeaux Universitaires',
                  description: language === 'en' ? 'Universities offer scholarship gifts to their trusted partners' : 'Les universités offrent des cadeaux de bourses à leurs partenaires de confiance'
                },
                {
                  step: language === 'en' ? '3. Commercialization' : '3. Commercialisation',
                  title: language === 'en' ? 'Legal Commercialization' : 'Commercialisation Légale',
                  description: language === 'en' ? 'We have the right to commercialize these scholarship opportunities' : 'Nous avons le droit de commercialiser ces opportunités de bourses'
                },
                {
                  step: language === 'en' ? '4. Student Access' : '4. Accès Étudiant',
                  title: language === 'en' ? 'Tuition Discounts' : 'Réductions de Frais',
                  description: language === 'en' ? 'Students get significant discounts on their tuition fees' : 'Les étudiants obtiennent des réductions importantes sur leurs frais de scolarité'
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Country-Specific Scholarship Examples */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'Country-Specific Scholarship Examples' : 'Exemples de Bourses par Pays'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  country: 'Cyprus',
                  university: language === 'en' ? 'University of Cyprus' : 'Université de Chypre',
                  program: language === 'en' ? 'Bachelor in Computer Science' : 'Licence en Informatique',
                  originalTuition: language === 'en' ? '$8,000/year' : '8,000$/an',
                  scholarshipDiscount: '75%',
                  finalTuition: language === 'en' ? '$2,000/year' : '2,000$/an',
                  savings: language === 'en' ? 'Save $6,000/year' : 'Économisez 6,000$/an',
                  requirements: language === 'en' 
                    ? ['High school diploma', 'English proficiency (IELTS 6.0)', 'Mathematics background', 'Motivation letter']
                    : ['Diplôme de lycée', 'Maîtrise anglaise (IELTS 6.0)', 'Formation en mathématiques', 'Lettre de motivation'],
                  flag: '🇨🇾'
                },
                {
                  country: 'Cyprus',
                  university: language === 'en' ? 'Cyprus International University' : 'Université Internationale de Chypre',
                  program: language === 'en' ? 'Master in Business Administration' : 'Master en Administration des Affaires',
                  originalTuition: language === 'en' ? '$12,000/year' : '12,000$/an',
                  scholarshipDiscount: '100%',
                  finalTuition: language === 'en' ? 'FREE' : 'GRATUIT',
                  savings: language === 'en' ? 'Save $12,000/year' : 'Économisez 12,000$/an',
                  requirements: language === 'en' 
                    ? ['Bachelor degree', 'English proficiency (IELTS 6.5)', 'GMAT/GRE scores', 'Work experience', 'Leadership potential']
                    : ['Diplôme de licence', 'Maîtrise anglaise (IELTS 6.5)', 'Scores GMAT/GRE', 'Expérience professionnelle', 'Potentiel de leadership'],
                  flag: '🇨🇾'
                },
                {
                  country: 'Turkey',
                  university: language === 'en' ? 'Istanbul Technical University' : 'Université Technique d\'Istanbul',
                  program: language === 'en' ? 'Master in Engineering' : 'Master en Ingénierie',
                  originalTuition: language === 'en' ? '$12,000/year' : '12,000$/an',
                  scholarshipDiscount: '60%',
                  finalTuition: language === 'en' ? '$4,800/year' : '4,800$/an',
                  savings: language === 'en' ? 'Save $7,200/year' : 'Économisez 7,200$/an',
                  requirements: language === 'en'
                    ? ['Bachelor degree', 'English proficiency (TOEFL 80)', 'Engineering background', 'Research proposal']
                    : ['Diplôme de licence', 'Maîtrise anglaise (TOEFL 80)', 'Formation en ingénierie', 'Proposition de recherche'],
                  flag: '🇹🇷'
                },
                {
                  country: 'Malaysia',
                  university: language === 'en' ? 'University of Malaya' : 'Université de Malaya',
                  program: language === 'en' ? 'Master in Data Science' : 'Master en Science des Données',
                  originalTuition: language === 'en' ? '$10,000/year' : '10,000$/an',
                  scholarshipDiscount: '80%',
                  finalTuition: language === 'en' ? '$2,000/year' : '2,000$/an',
                  savings: language === 'en' ? 'Save $8,000/year' : 'Économisez 8,000$/an',
                  requirements: language === 'en'
                    ? ['Bachelor in related field', 'English proficiency (IELTS 6.5)', 'Programming skills', 'Portfolio']
                    : ['Licence dans un domaine connexe', 'Maîtrise anglaise (IELTS 6.5)', 'Compétences en programmation', 'Portfolio'],
                  flag: '🇲🇾'
                },
                {
                  country: 'Hungary',
                  university: language === 'en' ? 'Budapest University of Technology' : 'Université de Technologie de Budapest',
                  program: language === 'en' ? 'Bachelor in Architecture' : 'Licence en Architecture',
                  originalTuition: language === 'en' ? '$7,500/year' : '7,500$/an',
                  scholarshipDiscount: '70%',
                  finalTuition: language === 'en' ? '$2,250/year' : '2,250$/an',
                  savings: language === 'en' ? 'Save $5,250/year' : 'Économisez 5,250$/an',
                  requirements: language === 'en'
                    ? ['High school diploma', 'English proficiency (IELTS 6.0)', 'Art/Design portfolio', 'Mathematics background']
                    : ['Diplôme de lycée', 'Maîtrise anglaise (IELTS 6.0)', 'Portfolio art/design', 'Formation en mathématiques'],
                  flag: '🇭🇺'
                },
                {
                  country: 'Spain',
                  university: language === 'en' ? 'University of Barcelona' : 'Université de Barcelone',
                  program: language === 'en' ? 'Master in International Business' : 'Master en Commerce International',
                  originalTuition: language === 'en' ? '$15,000/year' : '15,000$/an',
                  scholarshipDiscount: '65%',
                  finalTuition: language === 'en' ? '$5,250/year' : '5,250$/an',
                  savings: language === 'en' ? 'Save $9,750/year' : 'Économisez 9,750$/an',
                  requirements: language === 'en'
                    ? ['Bachelor degree', 'English proficiency (IELTS 7.0)', 'Business background', 'Work experience']
                    : ['Diplôme de licence', 'Maîtrise anglaise (IELTS 7.0)', 'Formation en commerce', 'Expérience professionnelle'],
                  flag: '🇪🇸'
                }
              ].map((scholarship, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{scholarship.flag}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{scholarship.country}</h3>
                        <p className="text-sm text-gray-600">{scholarship.university}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${scholarship.scholarshipDiscount === '100%' ? 'text-green-600' : 'text-indigo-600'}`}>
                        {scholarship.scholarshipDiscount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {language === 'en' ? 'discount' : 'réduction'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{scholarship.program}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'en' ? 'Original Tuition:' : 'Frais Originaux:'}
                        </span>
                        <span className="text-gray-500 line-through">{scholarship.originalTuition}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'en' ? 'Final Tuition:' : 'Frais Finaux:'}
                        </span>
                        <span className={`font-bold ${scholarship.finalTuition === 'FREE' || scholarship.finalTuition === 'GRATUIT' ? 'text-green-600 text-lg' : 'text-green-600'}`}>
                          {scholarship.finalTuition}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                          scholarship.scholarshipDiscount === '100%' 
                            ? 'bg-green-200 text-green-900 font-bold' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {scholarship.savings}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">
                      {language === 'en' ? 'Requirements:' : 'Exigences:'}
                    </h5>
                    <ul className="space-y-1">
                      {scholarship.requirements.slice(0, 3).map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start text-xs text-gray-700">
                          <CheckCircle className="w-3 h-3 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                      {scholarship.requirements.length > 3 && (
                        <li className="text-xs text-indigo-600 font-medium">
                          +{scholarship.requirements.length - 3} {language === 'en' ? 'more' : 'de plus'}
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    {language === 'en' ? 'Apply for Scholarship' : 'Postuler pour la Bourse'}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>


          {/* Benefits Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'Why Choose Our Scholarship Service?' : 'Pourquoi Choisir Notre Service de Bourses?'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: language === 'en' ? 'Exclusive Access' : 'Accès Exclusif',
                  description: language === 'en' ? 'Access to scholarships not available to the general public' : 'Accès à des bourses non disponibles au grand public',
                  icon: <Shield className="w-8 h-8" />
                },
                {
                  title: language === 'en' ? 'Significant Savings' : 'Économies Importantes',
                  description: language === 'en' ? 'Save thousands of dollars on your tuition fees' : 'Économisez des milliers de dollars sur vos frais de scolarité',
                  icon: <DollarSign className="w-8 h-8" />
                },
                {
                  title: language === 'en' ? 'Partner Universities' : 'Universités Partenaires',
                  description: language === 'en' ? 'Scholarships from top-ranked universities worldwide' : 'Bourses d\'universités de haut rang dans le monde entier',
                  icon: <Building2 className="w-8 h-8" />
                },
                {
                  title: language === 'en' ? 'Expert Guidance' : 'Conseils d\'Experts',
                  description: language === 'en' ? 'Professional assistance throughout the application process' : 'Assistance professionnelle tout au long du processus de candidature',
                  icon: <Users className="w-8 h-8" />
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Success Statistics */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'Our Scholarship Success' : 'Notre Succès en Bourses'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  number: '200+',
                  label: language === 'en' ? 'Scholarships Awarded' : 'Bourses Accordées'
                },
                {
                  number: '$2.5M+',
                  label: language === 'en' ? 'Total Savings' : 'Économies Totales'
                },
                {
                  number: '80+',
                  label: language === 'en' ? 'Partner Universities' : 'Universités Partenaires'
                },
                {
                  number: '95%',
                  label: language === 'en' ? 'Success Rate' : 'Taux de Réussite'
                }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Ready to Get Started?' : 'Prêt à Commencer?'}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-6">
              {language === 'en' ? 'Contact Our Expert Team' : 'Contactez Notre Équipe d\'Experts'}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Get personalized assistance for your international education journey. Our experts are here to help you succeed.'
                : 'Obtenez une assistance personnalisée pour votre parcours d\'éducation internationale. Nos experts sont là pour vous aider à réussir.'
              }
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'en' ? 'Full Name' : 'Nom Complet'}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={language === 'en' ? 'Enter your full name' : 'Entrez votre nom complet'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'en' ? 'Email Address' : 'Adresse Email'}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={language === 'en' ? 'Enter your email' : 'Entrez votre email'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'en' ? 'Phone Number' : 'Numéro de Téléphone'}
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={language === 'en' ? 'Enter your phone number' : 'Entrez votre numéro de téléphone'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'en' ? 'Country' : 'Pays'}
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                      <option value="">{language === 'en' ? 'Select your country' : 'Sélectionnez votre pays'}</option>
                      <option value="morocco">Morocco</option>
                      <option value="algeria">Algeria</option>
                      <option value="tunisia">Tunisia</option>
                      <option value="france">France</option>
                      <option value="canada">Canada</option>
                      <option value="usa">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="germany">Germany</option>
                      <option value="other">{language === 'en' ? 'Other' : 'Autre'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'en' ? 'Service of Interest' : 'Service d\'Intérêt'}
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                    <option value="">{language === 'en' ? 'Select a service' : 'Sélectionnez un service'}</option>
                    <option value="visa">{language === 'en' ? 'Visa Assistance' : 'Assistance Visa'}</option>
                    <option value="housing">{language === 'en' ? 'Student Housing' : 'Logement Étudiant'}</option>
                    <option value="translation">{language === 'en' ? 'Document Translation' : 'Traduction de Documents'}</option>
                    <option value="vouchers">{language === 'en' ? 'Test Service Vouchers' : 'Bons de Service de Test'}</option>
                    <option value="admission">{language === 'en' ? 'Admission & Application' : 'Admission & Candidature'}</option>
                    <option value="scholarships">{language === 'en' ? 'Paid Scholarships' : 'Bourses Payantes'}</option>
                    <option value="multiple">{language === 'en' ? 'Multiple Services' : 'Services Multiples'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'en' ? 'Message' : 'Message'}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder={language === 'en' ? 'Tell us about your needs and goals...' : 'Parlez-nous de vos besoins et objectifs...'}
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="consent"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="consent" className="ml-2 text-sm text-gray-600">
                    {language === 'en' 
                      ? 'I agree to receive communications from E-TAWJIHI Global regarding my inquiry.'
                      : 'J\'accepte de recevoir des communications d\'E-TAWJIHI Global concernant ma demande.'
                    }
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {language === 'en' ? 'Send Message' : 'Envoyer le Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;

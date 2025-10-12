import React from 'react';
import { Plane, Home, Globe, MessageCircle, ArrowRight, CheckCircle, Clock, Shield, Users, Award } from 'lucide-react';

const ServicesGlobal = ({ language }) => {
  const content = {
    en: {
      title: "Your complete study journey, in one place.",
      subtitle: "From visa to housing, we've got you covered at every step.",
      cta: "Explore Services",
      services: [
        {
          icon: Plane,
          title: "Visa & Admission Assistance",
          description: "Simplify your paperwork.",
          details: "Get expert help with visa applications, document preparation, and admission processes. Our team ensures everything is done correctly and on time.",
          features: ["Visa application support", "Document verification", "Admission guidance", "Timeline management"],
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600"
        },
        {
          icon: Home,
          title: "Student Housing",
          description: "Find trusted accommodation near your school.",
          details: "Discover verified student accommodations, homestays, and shared apartments. All options are vetted for safety, location, and student-friendly amenities.",
          features: ["Verified accommodations", "Location-based search", "Safety checks", "Student discounts"],
          color: "from-emerald-500 to-emerald-600",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        {
          icon: Globe,
          title: "Translation & Certified Documents",
          description: "Fast, affordable, official.",
          details: "Get your academic documents translated and certified by professional translators. All translations are accepted by universities and immigration offices worldwide.",
          features: ["Professional translators", "University acceptance", "Fast turnaround", "Official certification"],
          color: "from-cyan-500 to-cyan-600",
          bgColor: "bg-cyan-50",
          iconColor: "text-cyan-600"
        },
        {
          icon: MessageCircle,
          title: "Personal Coaching",
          description: "Get help from real experts.",
          details: "Connect with education experts, alumni, and current students for personalized guidance. Get insights, tips, and support throughout your study journey.",
          features: ["Expert consultations", "Alumni connections", "Study tips", "24/7 support"],
          color: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600"
        }
      ],
      benefits: [
        {
          icon: Clock,
          title: "Save Time",
          description: "Complete your applications 5x faster"
        },
        {
          icon: Shield,
          title: "Guaranteed Quality",
          description: "All services backed by our quality promise"
        },
        {
          icon: Users,
          title: "Expert Support",
          description: "Access to education professionals worldwide"
        },
        {
          icon: Award,
          title: "Proven Results",
          description: "95% success rate in admissions"
        }
      ]
    },
    fr: {
      title: "Votre parcours d'études complet, en un seul endroit.",
      subtitle: "Du visa au logement, nous vous couvrons à chaque étape.",
      cta: "Explorer les Services",
      services: [
        {
          icon: Plane,
          title: "Assistance Visa & Admission",
          description: "Simplifiez vos démarches administratives.",
          details: "Obtenez une aide experte pour les demandes de visa, la préparation des documents et les processus d'admission. Notre équipe s'assure que tout est fait correctement et à temps.",
          features: ["Support demande visa", "Vérification documents", "Guidance admission", "Gestion des délais"],
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600"
        },
        {
          icon: Home,
          title: "Logement Étudiant",
          description: "Trouvez un logement de confiance près de votre école.",
          details: "Découvrez des logements étudiants vérifiés, des familles d'accueil et des appartements partagés. Toutes les options sont vérifiées pour la sécurité, l'emplacement et les équipements adaptés aux étudiants.",
          features: ["Logements vérifiés", "Recherche par localisation", "Contrôles de sécurité", "Réductions étudiantes"],
          color: "from-emerald-500 to-emerald-600",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        {
          icon: Globe,
          title: "Traduction & Documents Certifiés",
          description: "Rapide, abordable, officiel.",
          details: "Faites traduire et certifier vos documents académiques par des traducteurs professionnels. Toutes les traductions sont acceptées par les universités et bureaux d'immigration du monde entier.",
          features: ["Traducteurs professionnels", "Acceptation universitaire", "Délais rapides", "Certification officielle"],
          color: "from-cyan-500 to-cyan-600",
          bgColor: "bg-cyan-50",
          iconColor: "text-cyan-600"
        },
        {
          icon: MessageCircle,
          title: "Coaching Personnel",
          description: "Obtenez de l'aide d'experts réels.",
          details: "Connectez-vous avec des experts en éducation, des anciens élèves et des étudiants actuels pour un guidage personnalisé. Obtenez des conseils, astuces et support tout au long de votre parcours d'études.",
          features: ["Consultations d'experts", "Connexions alumni", "Conseils d'études", "Support 24/7"],
          color: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600"
        }
      ],
      benefits: [
        {
          icon: Clock,
          title: "Gagner du temps",
          description: "Complétez vos candidatures 5x plus vite"
        },
        {
          icon: Shield,
          title: "Qualité garantie",
          description: "Tous les services soutenus par notre promesse de qualité"
        },
        {
          icon: Users,
          title: "Support expert",
          description: "Accès aux professionnels de l'éducation dans le monde"
        },
        {
          icon: Award,
          title: "Résultats prouvés",
          description: "95% de taux de réussite en admissions"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-emerald-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-100/30 to-cyan-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full mb-6">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Complete Services</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {t.services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${service.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-lg font-medium text-gray-600 mb-4">
                    {service.description}
                  </p>
                  
                  <p className="text-gray-500 leading-relaxed mb-6">
                    {service.details}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="group/btn flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                    <span className="font-medium">
                      {language === 'en' ? 'Learn more' : 'En savoir plus'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 via-emerald-50 to-cyan-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {language === 'en' ? 'Why Choose Our Services?' : 'Pourquoi choisir nos services ?'}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'We provide comprehensive support to ensure your study abroad journey is smooth and successful.'
                : 'Nous fournissons un support complet pour garantir que votre parcours d\'études à l\'étranger soit fluide et réussi.'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {t.benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button className="group flex items-center space-x-3 px-8 py-4 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mx-auto">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold text-lg">{t.cta}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-800 mb-2">
              95%
            </div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Success Rate' : 'Taux de réussite'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              5x
            </div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Faster Process' : 'Processus plus rapide'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Support' : 'Support'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Satisfaction' : 'Satisfaction'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGlobal;

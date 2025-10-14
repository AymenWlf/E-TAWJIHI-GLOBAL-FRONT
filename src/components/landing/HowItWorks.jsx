import React from 'react';
import { Compass, GraduationCap, Home, ArrowRight, CheckCircle, Clock, Users, Globe } from 'lucide-react';

const HowItWorks = ({ language }) => {
  const content = {
    en: {
      title: "Your journey, simplified.",
      subtitle: "From choosing your program to securing your admission and accommodation, E-TAWJIHI simplifies every step of your study journey.",
      cta: "Start Now",
      steps: [
        {
          icon: Compass,
          title: "Get Oriented",
          description: "Take the test & meet E-DVISOR.",
          details: "Complete our comprehensive assessment and get personalized recommendations from our AI assistant.",
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600"
        },
        {
          icon: GraduationCap,
          title: "Apply Online",
          description: "One form for all institutions.",
          details: "Submit a single application that gets sent to multiple universities worldwide. No more repetitive paperwork.",
          color: "from-emerald-500 to-emerald-600",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        {
          icon: Home,
          title: "Get Admitted & Settle",
          description: "Receive your offer & prepare your arrival.",
          details: "Get your admission letter, visa assistance, and find accommodation near your chosen university.",
          color: "from-cyan-500 to-cyan-600",
          bgColor: "bg-cyan-50",
          iconColor: "text-cyan-600"
        }
      ],
      benefits: [
        {
          icon: Clock,
          title: "Save Time",
          description: "Reduce application time by 80%"
        },
        {
          icon: Users,
          title: "Expert Support",
          description: "24/7 guidance from education experts"
        },
        {
          icon: Globe,
          title: "Global Access",
          description: "Apply to universities worldwide"
        }
      ]
    },
    fr: {
      title: "Votre parcours, simplifié.",
      subtitle: "Du choix de votre programme à la sécurisation de votre admission et logement, E-TAWJIHI simplifie chaque étape de votre parcours d'études.",
      cta: "Commencer Maintenant",
      steps: [
        {
          icon: Compass,
          title: "S'orienter",
          description: "Passez le test et rencontrez E-DVISOR.",
          details: "Complétez notre évaluation complète et obtenez des recommandations personnalisées de notre assistant IA.",
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600"
        },
        {
          icon: GraduationCap,
          title: "Postuler en ligne",
          description: "Un formulaire pour toutes les institutions.",
          details: "Soumettez une seule candidature qui est envoyée à plusieurs universités dans le monde. Plus de paperasserie répétitive.",
          color: "from-emerald-500 to-emerald-600",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        {
          icon: Home,
          title: "Être admis et s'installer",
          description: "Recevez votre offre et préparez votre arrivée.",
          details: "Obtenez votre lettre d'admission, assistance visa, et trouvez un logement près de votre université choisie.",
          color: "from-cyan-500 to-cyan-600",
          bgColor: "bg-cyan-50",
          iconColor: "text-cyan-600"
        }
      ],
      benefits: [
        {
          icon: Clock,
          title: "Gagner du temps",
          description: "Réduire le temps de candidature de 80%"
        },
        {
          icon: Users,
          title: "Support expert",
          description: "Guidance 24/7 d'experts en éducation"
        },
        {
          icon: Globe,
          title: "Accès mondial",
          description: "Postuler aux universités du monde entier"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
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
            <span className="text-sm font-semibold text-blue-700">Simple Process</span>
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

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {t.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < t.steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
                  </div>
                )}

                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8">
                    <div className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${step.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg font-medium text-gray-600 mb-4">
                    {step.description}
                  </p>
                  
                  <p className="text-gray-500 leading-relaxed">
                    {step.details}
                  </p>

                  {/* Arrow */}
                  <div className="mt-6 flex items-center text-blue-600 group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-sm font-medium mr-2">
                      {language === 'en' ? 'Learn more' : 'En savoir plus'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 via-emerald-50 to-cyan-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {language === 'en' ? 'Why Choose E-TAWJIHI?' : 'Pourquoi choisir E-TAWJIHI ?'}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Join thousands of students who have simplified their study abroad journey with our platform.'
                : 'Rejoignez des milliers d\'étudiants qui ont simplifié leur parcours d\'études à l\'étranger avec notre plateforme.'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
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
              <GraduationCap className="w-6 h-6" />
              <span className="font-semibold text-lg">{t.cta}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-800 mb-2">
              80%
            </div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Time Saved' : 'Temps économisé'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              95%
            </div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Success Rate' : 'Taux de réussite'}
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
              50+
            </div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Countries' : 'Pays'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

import React from 'react';
import { Heart, Globe, Users, Lightbulb, ArrowRight, Award, Target, Zap } from 'lucide-react';

const AboutMission = ({ language }) => {
  const content = {
    en: {
      title: "Our mission: democratizing access to global education.",
      subtitle: "Born in Morocco, E-TAWJIHI is now a global EdTech platform that connects students, institutions, and opportunities. We believe education should be accessible, transparent, and personalized — for everyone, everywhere.",
      cta: "Learn more about E-TAWJIHI",
      values: [
        {
          icon: Heart,
          title: "Accessibility",
          description: "Making quality education accessible to students worldwide, regardless of their background or location."
        },
        {
          icon: Globe,
          title: "Global Reach",
          description: "Connecting students with opportunities across 50+ countries and thousands of institutions."
        },
        {
          icon: Users,
          title: "Community",
          description: "Building a supportive community of students, educators, and institutions working together."
        },
        {
          icon: Lightbulb,
          title: "Innovation",
          description: "Leveraging AI and technology to revolutionize the education application process."
        }
      ],
      story: {
        title: "From Morocco to the World",
        content: "E-TAWJIHI started as a solution to help Moroccan students navigate the complex world of international education. Today, we serve students from across Africa, the Middle East, and beyond, helping them achieve their dreams of studying abroad.",
        stats: [
          { value: "2019", label: "Founded in Morocco" },
          { value: "50+", label: "Countries Served" },
          { value: "100K+", label: "Students Helped" },
          { value: "500+", label: "Partner Institutions" }
        ]
      },
      vision: {
        title: "Our Vision for the Future",
        content: "We envision a world where every student has equal access to quality education, where borders don't limit opportunities, and where technology makes the path to knowledge smoother and more transparent."
      }
    },
    fr: {
      title: "Notre mission : démocratiser l'accès à l'éducation mondiale.",
      subtitle: "Né au Maroc, E-TAWJIHI est maintenant une plateforme EdTech mondiale qui connecte les étudiants, institutions et opportunités. Nous croyons que l'éducation devrait être accessible, transparente et personnalisée — pour tous, partout.",
      cta: "En savoir plus sur E-TAWJIHI",
      values: [
        {
          icon: Heart,
          title: "Accessibilité",
          description: "Rendre l'éducation de qualité accessible aux étudiants du monde entier, quel que soit leur origine ou leur localisation."
        },
        {
          icon: Globe,
          title: "Portée Mondiale",
          description: "Connecter les étudiants avec des opportunités dans plus de 50 pays et des milliers d'institutions."
        },
        {
          icon: Users,
          title: "Communauté",
          description: "Construire une communauté solidaire d'étudiants, éducateurs et institutions travaillant ensemble."
        },
        {
          icon: Lightbulb,
          title: "Innovation",
          description: "Exploiter l'IA et la technologie pour révolutionner le processus de candidature éducative."
        }
      ],
      story: {
        title: "Du Maroc au Monde",
        content: "E-TAWJIHI a commencé comme une solution pour aider les étudiants marocains à naviguer dans le monde complexe de l'éducation internationale. Aujourd'hui, nous servons des étudiants de toute l'Afrique, du Moyen-Orient et au-delà, les aidant à réaliser leurs rêves d'études à l'étranger.",
        stats: [
          { value: "2019", label: "Fondé au Maroc" },
          { value: "50+", label: "Pays Servis" },
          { value: "100K+", label: "Étudiants Aidés" },
          { value: "500+", label: "Institutions Partenaires" }
        ]
      },
      vision: {
        title: "Notre Vision pour l'Avenir",
        content: "Nous envisageons un monde où chaque étudiant a un accès égal à une éducation de qualité, où les frontières ne limitent pas les opportunités, et où la technologie rend le chemin vers la connaissance plus fluide et plus transparent."
      }
    }
  };

  const t = content[language];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-emerald-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full mb-6">
            <Heart className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Our Mission</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {t.values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Story Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              {t.story.title}
            </h3>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t.story.content}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {t.story.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              {/* Globe Animation */}
              <div className="relative w-full h-80 flex items-center justify-center">
                <div className="relative">
                  {/* Outer Ring */}
                  <div className="w-64 h-64 border-2 border-blue-200 rounded-full animate-spin-slow">
                    <div className="w-full h-full border-2 border-emerald-200 rounded-full animate-spin-reverse"></div>
                  </div>
                  
                  {/* Inner Globe */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full shadow-2xl flex items-center justify-center">
                      <Globe className="w-20 h-20 text-white" />
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 left-4 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-xs">🇲🇦</span>
                  </div>
                  <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-xs">🇫🇷</span>
                  </div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-xs">🇨🇦</span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-xs">🇩🇪</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              {t.vision.title}
            </h3>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              {t.vision.content}
            </p>

            <button className="group flex items-center space-x-3 px-8 py-4 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mx-auto">
              <Zap className="w-6 h-6" />
              <span className="font-semibold text-lg">{t.cta}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Impact Indicators */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {language === 'en' ? 'Quality Education' : 'Éducation de Qualité'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Ensuring every student has access to world-class education'
                  : 'Garantir que chaque étudiant ait accès à une éducation de classe mondiale'
                }
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {language === 'en' ? 'Global Access' : 'Accès Mondial'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Breaking down barriers to international education'
                  : 'Supprimer les barrières à l\'éducation internationale'
                }
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-cyan-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {language === 'en' ? 'Innovation' : 'Innovation'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Using technology to make education more accessible'
                  : 'Utiliser la technologie pour rendre l\'éducation plus accessible'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutMission;

import React from 'react';
import { Search, Sparkles, ArrowRight, Globe, Users, Award, Star, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToActionFinal = ({ language }) => {
  const content = {
    en: {
      title: "Ready to start your global education journey?",
      cta: "Search Study Programs",
      ctaSecondary: "Start with E-DVISOR",
      ctaInstitution: "Browse Universities",
      subtitle: "Join thousands of students already building their future with E-TAWJIHI Global.",
      features: [
        {
          icon: Search,
          title: "Find Your Program",
          description: "Discover programs that match your goals"
        },
        {
          icon: Sparkles,
          title: "Get AI Guidance",
          description: "Personalized recommendations from E-DVISOR"
        },
        {
          icon: Globe,
          title: "Apply Worldwide",
          description: "Access to 50+ countries and 10,000+ programs"
        }
      ],
      stats: [
        { value: "100K+", label: "Students Helped" },
        { value: "500+", label: "Partner Universities" },
        { value: "50+", label: "Countries" },
        { value: "95%", label: "Success Rate" }
      ]
    },
    fr: {
      title: "Prêt à commencer votre parcours d'éducation mondiale ?",
      cta: "Rechercher des Programmes",
      ctaSecondary: "Commencer avec E-DVISOR",
      ctaInstitution: "Parcourir les Universités",
      subtitle: "Rejoignez des milliers d'étudiants qui construisent déjà leur avenir avec E-TAWJIHI Global.",
      features: [
        {
          icon: Search,
          title: "Trouvez Votre Programme",
          description: "Découvrez des programmes qui correspondent à vos objectifs"
        },
        {
          icon: Sparkles,
          title: "Obtenez des Conseils IA",
          description: "Recommandations personnalisées d'E-DVISOR"
        },
        {
          icon: Globe,
          title: "Postulez dans le Monde",
          description: "Accès à plus de 50 pays et 10 000+ programmes"
        }
      ],
      stats: [
        { value: "100K+", label: "Étudiants Aidés" },
        { value: "500+", label: "Universités Partenaires" },
        { value: "50+", label: "Pays" },
        { value: "95%", label: "Taux de Réussite" }
      ]
    }
  };

  const t = content[language];

  const scrollToSearch = () => {
    const element = document.getElementById('search');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToEDVISOR = () => {
    const element = document.getElementById('aidvisor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 left-20 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-3 h-3 bg-white/40 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-5 h-5 bg-white/25 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t.title}
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-12">
            {t.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button
              onClick={scrollToSearch}
              className="group flex items-center space-x-3 px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Search className="w-6 h-6" />
              <span className="font-semibold text-lg">{t.cta}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={scrollToEDVISOR}
              className="group flex items-center space-x-3 px-8 py-4 border-2 border-white text-white rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              <Sparkles className="w-6 h-6" />
              <span className="font-semibold text-lg">{t.ctaSecondary}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <Link
              to="/establishments"
              className="group flex items-center space-x-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Building2 className="w-6 h-6" />
              <span className="font-semibold text-lg">{t.ctaInstitution}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {t.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-blue-100">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              {language === 'en' ? 'Join Our Success Stories' : 'Rejoignez Nos Histoires de Succès'}
            </h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Be part of a growing community of successful students and institutions worldwide.'
                : 'Faites partie d\'une communauté croissante d\'étudiants et d\'institutions prospères dans le monde.'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-blue-100 text-sm mb-6">
            {language === 'en' ? 'Trusted by leading institutions worldwide' : 'Approuvé par les institutions leaders mondiales'}
          </p>
          
          {/* Partner Logos Placeholder */}
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="w-20 h-10 bg-white/20 rounded"></div>
            <div className="w-20 h-10 bg-white/20 rounded"></div>
            <div className="w-20 h-10 bg-white/20 rounded"></div>
            <div className="w-20 h-10 bg-white/20 rounded"></div>
            <div className="w-20 h-10 bg-white/20 rounded"></div>
          </div>
        </div>

        {/* Final Message */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">
              {language === 'en' ? 'Start your journey today' : 'Commencez votre parcours aujourd\'hui'}
            </span>
            <Star className="w-5 h-5 text-yellow-300" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionFinal;

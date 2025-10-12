import React, { useState } from 'react';
import { Search, Globe, ArrowRight, Play, Star, Users, Building2, Award } from 'lucide-react';

const HeroGlobal = ({ language }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Scroll to search section
    const element = document.getElementById('search');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const content = {
    en: {
      headline: "Find your path. Anywhere in the world.",
      subtitle: "E-TAWJIHI is your global platform for academic orientation and simplified admissions — powered by AI, built for students, trusted by institutions.",
      cta: "Search Study Programs",
      stats: {
        countries: "+50 countries",
        programs: "+10,000 programs", 
        guidance: "AI-powered guidance"
      },
      watchDemo: "Watch Demo",
      trustedBy: "Trusted by leading institutions worldwide"
    },
    fr: {
      headline: "Trouvez votre voie. Partout dans le monde.",
      subtitle: "E-TAWJIHI est votre plateforme mondiale d'orientation académique et d'admissions simplifiées — alimentée par l'IA, conçue pour les étudiants, approuvée par les institutions.",
      cta: "Rechercher des Programmes",
      stats: {
        countries: "+50 pays",
        programs: "+10 000 programmes",
        guidance: "Guidance par IA"
      },
      watchDemo: "Voir la Démo",
      trustedBy: "Approuvé par les institutions leaders mondiales"
    }
  };

  const t = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-emerald-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-blue-400 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              <span className="text-blue-800">
                {t.headline}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.subtitle}
            </p>

            {/* Search Bar */}
            <div className="mb-6 sm:mb-8">
              <div className="relative max-w-2xl mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-xl border border-gray-200 p-2 gap-2">
                  <div className="flex items-center w-full sm:w-auto">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 ml-2 sm:ml-4" />
                    <input
                      type="text"
                      placeholder={language === 'en' ? "Search programs, countries, universities..." : "Rechercher programmes, pays, universités..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-2 sm:px-4 py-3 sm:py-4 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent text-sm sm:text-base"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
                  >
                    <span className="font-medium text-sm sm:text-base">{t.cta}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="font-medium text-sm sm:text-base">{t.stats.countries}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                <span className="font-medium text-sm sm:text-base">{t.stats.programs}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                <span className="font-medium text-sm sm:text-base">{t.stats.guidance}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={handleSearch}
                className="flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto justify-center"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-base sm:text-lg">{t.cta}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button className="flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-emerald-600 hover:text-emerald-600 transition-all duration-200 w-full sm:w-auto justify-center">
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-base sm:text-lg">{t.watchDemo}</span>
              </button>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative mt-8 lg:mt-0">
            {/* Main Visual Container */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
              {/* Globe Animation */}
              <div className="relative w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center">
                <div className="relative">
                  {/* Outer Ring */}
                  <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 border-2 border-blue-200 rounded-full animate-spin-slow">
                    <div className="w-full h-full border-2 border-emerald-200 rounded-full animate-spin-reverse"></div>
                  </div>
                  
                  {/* Inner Globe */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-blue-800 rounded-full shadow-2xl flex items-center justify-center">
                      <Globe className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-white" />
                    </div>
                  </div>
                  
                  {/* Floating University Icons */}
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-800" />
                  </div>
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  </div>
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-700" />
                  </div>
                  <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-800" />
                  </div>
                </div>
              </div>
              
              {/* Bottom Stats */}
              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-800">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Countries' : 'Pays'}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600">10K+</div>
                  <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Programs' : 'Programmes'}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-700">100K+</div>
                  <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Students' : 'Étudiants'}</div>
                </div>
              </div>
            </div>

            {/* Trusted By Section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">{t.trustedBy}</p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
              </div>
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

export default HeroGlobal;

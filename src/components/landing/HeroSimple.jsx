import React from 'react';
import { ArrowRight, Globe, GraduationCap, Building2 } from 'lucide-react';

const HeroSimple = ({ language }) => {
  const content = {
    en: {
      headline: "Find your path. Anywhere in the world.",
      subtext: "E-TAWJIHI helps students discover, apply, and succeed in top institutions worldwide — guided by E-DVISOR, our intelligent study advisor.",
      cta1: "🎓 Start your journey",
      cta2: "🏫 Reference your institution",
      tagline: "Your Global Education Gateway"
    },
    fr: {
      headline: "Trouvez votre voie. Partout dans le monde.",
      subtext: "E-TAWJIHI aide les étudiants à découvrir, postuler et réussir dans les meilleures institutions mondiales — guidés par E-DVISOR, notre conseiller d'études intelligent.",
      cta1: "🎓 Commencez votre parcours",
      cta2: "🏫 Référencez votre institution",
      tagline: "Votre Portail Éducatif Mondial"
    }
  };

  const currentContent = content[language];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
        <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-white/20 animate-float">
          <Globe size={60} />
        </div>
        
        <div className="absolute top-40 right-20 text-white/20 animate-float" style={{ animationDelay: '2s' }}>
          <GraduationCap size={80} />
        </div>
        
        <div className="absolute bottom-40 left-20 text-white/20 animate-float" style={{ animationDelay: '4s' }}>
          <Building2 size={70} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {currentContent.headline}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            {currentContent.subtext}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => scrollToSection('orientation')}
            className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            {currentContent.cta1}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => scrollToSection('institutions')}
            className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            {currentContent.cta2}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Tagline */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-white/70 text-lg font-medium">
            {currentContent.tagline}
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSimple;

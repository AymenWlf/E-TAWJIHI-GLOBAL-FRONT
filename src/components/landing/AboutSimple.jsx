import React from 'react';
import { Brain, Globe, Users } from 'lucide-react';

const AboutSimple = ({ language }) => {
  const content = {
    en: {
      title: "About E-TAWJIHI",
      description: "Born in Morocco, E-TAWJIHI has grown into a global platform connecting students, universities, and study services across 50+ countries. We combine orientation, admissions, and real human guidance — all in one place.",
      features: [
        {
          icon: Brain,
          title: "Orientation powered by AI",
          description: "Smart recommendations based on your profile and goals"
        },
        {
          icon: Globe,
          title: "Admissions to 10,000+ programs",
          description: "Access to universities and programs worldwide"
        },
        {
          icon: Users,
          title: "Global services & partnerships",
          description: "Complete support from application to graduation"
        }
      ],
      stats: [
        { number: "50+", label: "Countries" },
        { number: "10,000+", label: "Programs" },
        { number: "100,000+", label: "Students" },
        { number: "500+", label: "Partners" }
      ]
    },
    fr: {
      title: "À propos d'E-TAWJIHI",
      description: "Né au Maroc, E-TAWJIHI est devenu une plateforme mondiale connectant étudiants, universités et services d'études dans plus de 50 pays. Nous combinons orientation, admissions et accompagnement humain — tout en un seul endroit.",
      features: [
        {
          icon: Brain,
          title: "Orientation alimentée par l'IA",
          description: "Recommandations intelligentes basées sur votre profil et vos objectifs"
        },
        {
          icon: Globe,
          title: "Admissions à 10 000+ programmes",
          description: "Accès aux universités et programmes du monde entier"
        },
        {
          icon: Users,
          title: "Services mondiaux et partenariats",
          description: "Support complet de la candidature à l'obtention du diplôme"
        }
      ],
      stats: [
        { number: "50+", label: "Pays" },
        { number: "10 000+", label: "Programmes" },
        { number: "100 000+", label: "Étudiants" },
        { number: "500+", label: "Partenaires" }
      ]
    }
  };

  const currentContent = content[language];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {currentContent.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {currentContent.features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-6 mx-auto">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'en' ? 'Our Global Impact' : 'Notre Impact Mondial'}
            </h3>
            <p className="text-xl text-white/90">
              {language === 'en' 
                ? 'Connecting students and institutions worldwide' 
                : 'Connecter étudiants et institutions dans le monde entier'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {currentContent.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSimple;

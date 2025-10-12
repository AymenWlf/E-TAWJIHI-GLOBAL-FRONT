import React, { useState, useEffect } from 'react';
import { Bot, MessageCircle, Sparkles, ArrowRight, CheckCircle, Star } from 'lucide-react';

const AIDVISORSimple = ({ language }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const content = {
    en: {
      title: "Meet AIDVISOR — your personal education AI",
      description: "AIDVISOR analyzes your academic background, interests, and goals to recommend programs, countries, and institutions that fit your ambitions.",
      cta: "Try AIDVISOR now",
      demo: {
        title: "See AIDVISOR in action",
        messages: [
          {
            type: "user",
            text: "I want to study computer science in Europe"
          },
          {
            type: "ai",
            text: "Great choice! Based on your profile, I recommend these top programs:"
          },
          {
            type: "ai",
            text: "🇳🇱 TU Delft - Computer Science (Netherlands)\n🇩🇪 TU Munich - Informatics (Germany)\n🇸🇪 KTH - Computer Science (Sweden)"
          },
          {
            type: "user",
            text: "What about scholarships?"
          },
          {
            type: "ai",
            text: "Excellent question! Here are scholarship opportunities:\n\n• Erasmus Mundus (€24,000/year)\n• DAAD (Germany)\n• Swedish Institute Scholarships"
          }
        ]
      },
      features: [
        "Personalized recommendations",
        "Scholarship opportunities",
        "Application guidance",
        "24/7 availability"
      ]
    },
    fr: {
      title: "Rencontrez AIDVISOR — votre IA éducative personnelle",
      description: "AIDVISOR analyse votre parcours académique, vos intérêts et vos objectifs pour recommander des programmes, pays et institutions qui correspondent à vos ambitions.",
      cta: "Essayez AIDVISOR maintenant",
      demo: {
        title: "Voir AIDVISOR en action",
        messages: [
          {
            type: "user",
            text: "Je veux étudier l'informatique en Europe"
          },
          {
            type: "ai",
            text: "Excellent choix ! Basé sur votre profil, je recommande ces programmes de premier plan :"
          },
          {
            type: "ai",
            text: "🇳🇱 TU Delft - Informatique (Pays-Bas)\n🇩🇪 TU Munich - Informatique (Allemagne)\n🇸🇪 KTH - Informatique (Suède)"
          },
          {
            type: "user",
            text: "Et pour les bourses ?"
          },
          {
            type: "ai",
            text: "Excellente question ! Voici les opportunités de bourses :\n\n• Erasmus Mundus (24 000€/an)\n• DAAD (Allemagne)\n• Bourses Institut Suédois"
          }
        ]
      },
      features: [
        "Recommandations personnalisées",
        "Opportunités de bourses",
        "Guidance pour les candidatures",
        "Disponibilité 24/7"
      ]
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % currentContent.demo.messages.length);
        setIsTyping(false);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentContent.demo.messages.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="aidvisor" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {currentContent.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo Chat */}
          <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AIDVISOR</h3>
                <p className="text-gray-400 text-sm">Online now</p>
              </div>
            </div>

            <div className="space-y-4 h-80 overflow-y-auto">
              {currentContent.demo.messages.slice(0, currentMessage + 1).map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 p-4 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features & CTA */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {currentContent.demo.title}
              </h3>
              
              <div className="space-y-4">
                {currentContent.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollToSection('search')}
              className="group bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              {currentContent.cta}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-gray-600 font-medium">4.9/5</span>
              </div>
              <div className="text-gray-600">
                {language === 'en' ? '10,000+ students helped' : '10 000+ étudiants aidés'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDVISORSimple;

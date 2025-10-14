import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageCircle, Sparkles, ArrowRight, CheckCircle, Star } from 'lucide-react';

const EDVISOR = ({ language }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const content = {
    en: {
      title: "Meet E-DVISOR — your personal education AI",
      description: "E-DVISOR analyzes your academic background, interests, and goals to recommend programs, countries, and institutions that fit your ambitions.",
      cta: "Try E-DVISOR now",
      demo: {
        title: "See E-DVISOR in action",
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
      title: "Rencontrez E-DVISOR — votre IA éducative personnelle",
      description: "E-DVISOR analyse votre parcours académique, vos intérêts et vos objectifs pour recommander des programmes, pays et institutions qui correspondent à vos ambitions.",
      cta: "Essayez E-DVISOR maintenant",
      demo: {
        title: "Voir E-DVISOR en action",
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {currentContent.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo Chat */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">E-DVISOR</h3>
                <p className="text-gray-400 text-sm">Online now</p>
              </div>
            </div>

            <div className="space-y-4 h-80 overflow-y-auto">
              <AnimatePresence mode="wait">
                {currentContent.demo.messages.slice(0, currentMessage + 1).map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
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
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-700 p-4 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Features & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {currentContent.demo.title}
              </h3>
              
              <div className="space-y-4">
                {currentContent.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('search')}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              {currentContent.cta}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EDVISOR;

import React, { useState, useEffect } from 'react';
import { Bot, Target, Settings, MessageCircle, Sparkles, ArrowRight, CheckCircle, Star, Zap, Brain, Globe, Users } from 'lucide-react';

const EDVISORGlobal = ({ language }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const content = {
    en: {
      title: "Meet E-DVISOR — your personal study assistant.",
      subtitle: "Our AI helps you filter thousands of programs worldwide and recommends the ones that truly match your goals, profile, and budget.",
      cta: "Try E-DVISOR Now",
      features: [
        {
          icon: Target,
          title: "Personalized recommendations",
          description: "Get tailored program suggestions based on your academic background, interests, and career goals."
        },
        {
          icon: Settings,
          title: "AI-powered filtering",
          description: "Advanced algorithms analyze thousands of programs to find the perfect match for your profile."
        },
        {
          icon: MessageCircle,
          title: "Instant guidance & orientation",
          description: "Get real-time answers to your questions about programs, admissions, and study abroad."
        }
      ],
      demoMessages: [
        "Hi! I'm E-DVISOR, your personal study assistant. How can I help you today?",
        "Based on your interests in Computer Science, here are 3 top programs in Canada 🇨🇦",
        "I found 12 programs that match your budget and academic profile. Would you like to see them?",
        "Great choice! The University of Toronto has an excellent CS program. Let me help you with the application process."
      ]
    },
    fr: {
      title: "Rencontrez E-DVISOR — votre assistant d'études personnel.",
      subtitle: "Notre IA vous aide à filtrer des milliers de programmes dans le monde et recommande ceux qui correspondent vraiment à vos objectifs, profil et budget.",
      cta: "Essayer E-DVISOR Maintenant",
      features: [
        {
          icon: Target,
          title: "Recommandations personnalisées",
          description: "Obtenez des suggestions de programmes adaptées à votre parcours académique, intérêts et objectifs de carrière."
        },
        {
          icon: Settings,
          title: "Filtrage alimenté par l'IA",
          description: "Des algorithmes avancés analysent des milliers de programmes pour trouver la correspondance parfaite pour votre profil."
        },
        {
          icon: MessageCircle,
          title: "Guidance et orientation instantanées",
          description: "Obtenez des réponses en temps réel à vos questions sur les programmes, admissions et études à l'étranger."
        }
      ],
      demoMessages: [
        "Salut ! Je suis E-DVISOR, votre assistant d'études personnel. Comment puis-je vous aider aujourd'hui ?",
        "Basé sur vos intérêts en Informatique, voici 3 programmes de premier plan au Canada 🇨🇦",
        "J'ai trouvé 12 programmes qui correspondent à votre budget et profil académique. Voulez-vous les voir ?",
        "Excellent choix ! L'Université de Toronto a un excellent programme d'informatique. Laissez-moi vous aider avec le processus de candidature."
      ]
    }
  };

  const t = content[language];

  // Simulate typing effect
  useEffect(() => {
    const message = t.demoMessages[activeFeature];
    setCurrentMessage('');
    setIsTyping(true);
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < message.length) {
        setCurrentMessage(message.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [activeFeature, language]);

  return (
    <section id="aidvisor" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-emerald-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">AI-Powered Platform</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-blue-800">
              {t.title}
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Features */}
          <div className="space-y-6 sm:space-y-8">
            {t.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group cursor-pointer transition-all duration-300 ${
                    activeFeature === index ? 'transform scale-105' : 'hover:transform hover:scale-102'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                    activeFeature === index 
                      ? 'border-blue-500 bg-white shadow-xl' 
                      : 'border-gray-200 bg-white/50 hover:border-blue-300 hover:bg-white hover:shadow-lg'
                  }`}>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                        activeFeature === index
                          ? 'bg-blue-800 text-white'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors ${
                          activeFeature === index ? 'text-blue-700' : 'text-gray-800'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      {activeFeature === index && (
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* CTA Button */}
            <div className="pt-6">
              <button className="group flex items-center space-x-3 px-8 py-4 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <Sparkles className="w-6 h-6" />
                <span className="font-semibold text-lg">{t.cta}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side - E-DVISOR Demo */}
          <div className="relative mt-8 lg:mt-0">
            {/* Chat Interface */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-blue-800 p-4 sm:p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-white">E-DVISOR</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">AI Study Assistant</p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm">Online</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 sm:p-6 h-64 sm:h-80 overflow-y-auto bg-gray-50">
                {/* User Message */}
                <div className="flex justify-end mb-4">
                  <div className="bg-blue-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-br-md max-w-xs">
                    <p className="text-xs sm:text-sm text-white">
                      {language === 'en' 
                        ? "I want to study Computer Science abroad" 
                        : "Je veux étudier l'Informatique à l'étranger"
                      }
                    </p>
                  </div>
                </div>

                {/* E-DVISOR Response */}
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-md max-w-xs shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-500">E-DVISOR</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-800">
                      {currentMessage}
                      {isTyping && <span className="animate-pulse">|</span>}
                    </p>
                  </div>
                </div>

                {/* Program Suggestions */}
                {activeFeature === 1 && !isTyping && (
                  <div className="space-y-3">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 font-bold text-sm">U</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">University of Toronto</h4>
                          <p className="text-xs text-gray-600">Computer Science • Canada 🇨🇦</p>
                        </div>
                        <div className="ml-auto">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">M</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">McGill University</h4>
                          <p className="text-xs text-gray-600">Software Engineering • Canada 🇨🇦</p>
                        </div>
                        <div className="ml-auto">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder={language === 'en' ? "Ask E-DVISOR anything..." : "Demandez n'importe quoi à E-DVISOR..."}
                      className="w-full bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                  <button className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-all duration-200">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">98%</div>
                  <div className="text-xs text-gray-600">Accuracy Rate</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">24/7</div>
                  <div className="text-xs text-gray-600">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-800 mb-1">50+</div>
            <div className="text-xs sm:text-sm text-gray-600">Countries Analyzed</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-800 mb-1">100K+</div>
            <div className="text-xs sm:text-sm text-gray-600">Students Helped</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-800 mb-1">10K+</div>
            <div className="text-xs sm:text-sm text-gray-600">Programs Analyzed</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-800 mb-1">4.9/5</div>
            <div className="text-xs sm:text-sm text-gray-600">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EDVISORGlobal;

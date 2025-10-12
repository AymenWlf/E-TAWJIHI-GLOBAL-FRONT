import React, { useState, useEffect } from 'react';
import { Star, Quote, Users, Building2, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsGlobal = ({ language }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const content = {
    en: {
      title: "Trusted by Students & Institutions Worldwide.",
      testimonials: [
        {
          text: "Thanks to E-TAWJIHI, I got admitted to my dream university in France! The AI recommendations were spot-on and the application process was so smooth.",
          author: "Amina El Fassi",
          role: "Computer Science Student",
          university: "Sorbonne University, France",
          country: "🇫🇷",
          rating: 5,
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        },
        {
          text: "Our school received qualified leads from 5 African countries within weeks of joining E-TAWJIHI. The platform has revolutionized our international recruitment.",
          author: "Dr. Sarah Johnson",
          role: "International Admissions Director",
          university: "University of Toronto, Canada",
          country: "🇨🇦",
          rating: 5,
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        {
          text: "As an education agent, E-TAWJIHI has made my job so much easier. The lead management system and commission tracking are incredible.",
          author: "Mohamed Hassan",
          role: "Education Consultant",
          university: "Study Abroad Agency, Morocco",
          country: "🇲🇦",
          rating: 5,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        },
        {
          text: "The housing service helped me find the perfect accommodation near my university. Everything was verified and safe. Highly recommended!",
          author: "Fatima Al-Zahra",
          role: "Medicine Student",
          university: "McGill University, Canada",
          country: "🇨🇦",
          rating: 5,
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
        },
        {
          text: "AIDVISOR helped me discover programs I never knew existed. The personalized recommendations were exactly what I needed for my career goals.",
          author: "Ahmed Benali",
          role: "Engineering Student",
          university: "Technical University of Munich, Germany",
          country: "🇩🇪",
          rating: 5,
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
        }
      ],
      stats: [
        {
          icon: Users,
          value: "100K+",
          label: "Students Guided"
        },
        {
          icon: Building2,
          value: "500+",
          label: "Partner Institutions"
        },
        {
          icon: Globe,
          value: "50+",
          label: "Countries"
        }
      ]
    },
    fr: {
      title: "Approuvé par les Étudiants et Institutions du Monde Entier.",
      testimonials: [
        {
          text: "Grâce à E-TAWJIHI, j'ai été admise dans mon université de rêve en France ! Les recommandations de l'IA étaient parfaites et le processus de candidature était si fluide.",
          author: "Amina El Fassi",
          role: "Étudiante en Informatique",
          university: "Université de la Sorbonne, France",
          country: "🇫🇷",
          rating: 5,
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        },
        {
          text: "Notre école a reçu des prospects qualifiés de 5 pays africains en quelques semaines après avoir rejoint E-TAWJIHI. La plateforme a révolutionné notre recrutement international.",
          author: "Dr. Sarah Johnson",
          role: "Directrice des Admissions Internationales",
          university: "Université de Toronto, Canada",
          country: "🇨🇦",
          rating: 5,
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        {
          text: "En tant qu'agent d'éducation, E-TAWJIHI a rendu mon travail tellement plus facile. Le système de gestion des prospects et le suivi des commissions sont incroyables.",
          author: "Mohamed Hassan",
          role: "Consultant en Éducation",
          university: "Agence d'Études à l'Étranger, Maroc",
          country: "🇲🇦",
          rating: 5,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        },
        {
          text: "Le service de logement m'a aidée à trouver l'hébergement parfait près de mon université. Tout était vérifié et sûr. Hautement recommandé !",
          author: "Fatima Al-Zahra",
          role: "Étudiante en Médecine",
          university: "Université McGill, Canada",
          country: "🇨🇦",
          rating: 5,
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
        },
        {
          text: "AIDVISOR m'a aidé à découvrir des programmes dont je ne connaissais pas l'existence. Les recommandations personnalisées étaient exactement ce dont j'avais besoin pour mes objectifs de carrière.",
          author: "Ahmed Benali",
          role: "Étudiant en Ingénierie",
          university: "Université Technique de Munich, Allemagne",
          country: "🇩🇪",
          rating: 5,
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
        }
      ],
      stats: [
        {
          icon: Users,
          value: "100K+",
          label: "Étudiants Guidés"
        },
        {
          icon: Building2,
          value: "500+",
          label: "Institutions Partenaires"
        },
        {
          icon: Globe,
          value: "50+",
          label: "Pays"
        }
      ]
    }
  };

  const t = content[language];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % t.testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [t.testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % t.testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + t.testimonials.length) % t.testimonials.length);
  };

  const currentTestimonialData = t.testimonials[currentTestimonial];

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
            <Quote className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Success Stories</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h2>
        </div>

        {/* Main Testimonial */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 relative">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Quote className="w-6 h-6 text-white" />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Testimonial Content */}
              <div className="lg:pr-8">
                <p className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                  "{currentTestimonialData.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src={currentTestimonialData.image} 
                      alt={currentTestimonialData.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {currentTestimonialData.author}
                    </h4>
                    <p className="text-gray-600">{currentTestimonialData.role}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">{currentTestimonialData.university}</span>
                      <span className="text-lg">{currentTestimonialData.country}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mt-4">
                  {[...Array(currentTestimonialData.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              {/* Visual Element */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">{currentTestimonialData.country}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {currentTestimonialData.university.split(',')[0]}
                    </h3>
                    <p className="text-gray-600">
                      {currentTestimonialData.university.split(',')[1]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevTestimonial}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Previous' : 'Précédent'}
                </span>
              </button>

              {/* Dots Indicator */}
              <div className="flex items-center space-x-2">
                {t.testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentTestimonial
                        ? 'bg-blue-800'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Next' : 'Suivant'}
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-50 via-emerald-50 to-cyan-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {language === 'en' ? 'Our Impact in Numbers' : 'Notre Impact en Chiffres'}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Join thousands of students and institutions who trust E-TAWJIHI for their education journey.'
                : 'Rejoignez des milliers d\'étudiants et d\'institutions qui font confiance à E-TAWJIHI pour leur parcours éducatif.'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <Icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-lg text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-4 italic text-sm">
                "{testimonial.text.length > 120 ? testimonial.text.substring(0, 120) + '...' : testimonial.text}"
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 text-sm">{testimonial.author}</h5>
                  <p className="text-xs text-gray-600">{testimonial.role}</p>
                </div>
                <span className="text-lg ml-auto">{testimonial.country}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsGlobal;

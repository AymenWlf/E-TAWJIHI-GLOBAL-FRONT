import React, { useState, useEffect } from 'react';
import { Quote, Star, Globe, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSimple = ({ language }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const content = {
    en: {
      title: "Trusted by Students & Institutions Worldwide",
      subtitle: "See what our community has to say about their E-TAWJIHI experience",
      testimonials: [
        {
          quote: "Thanks to E-TAWJIHI, our university received qualified applicants from 5 countries in less than a month. The platform is incredibly user-friendly and the students are highly motivated.",
          author: "Dr. Sarah Johnson",
          role: "International Admissions Director",
          institution: "University of Toronto",
          country: "🇨🇦 Canada",
          rating: 5
        },
        {
          quote: "E-TAWJIHI helped me find the perfect program in Germany. The AI advisor was incredibly helpful in matching my interests with the right universities. I couldn't have done it without them!",
          author: "Ahmed Al-Rashid",
          role: "Computer Science Student",
          institution: "TU Munich",
          country: "🇩🇪 Germany",
          rating: 5
        },
        {
          quote: "As an agent, E-TAWJIHI has transformed my business. The commission structure is fair, the support is excellent, and I've helped over 100 students achieve their dreams.",
          author: "Maria Santos",
          role: "Education Agent",
          institution: "Santos Education Services",
          country: "🇪🇸 Spain",
          rating: 5
        },
        {
          quote: "The visa assistance and document translation services were outstanding. E-TAWJIHI made my study abroad journey smooth and stress-free.",
          author: "Fatima Zahra",
          role: "Business Administration Student",
          institution: "Sorbonne University",
          country: "🇫🇷 France",
          rating: 5
        }
      ],
      stats: [
        { number: "100,000+", label: "Students Helped" },
        { number: "500+", label: "Partner Institutions" },
        { number: "50+", label: "Countries" },
        { number: "98%", label: "Success Rate" }
      ],
      partners: [
        "University of Toronto",
        "TU Munich",
        "Sorbonne University",
        "University of Amsterdam",
        "KTH Royal Institute",
        "University of Melbourne"
      ]
    },
    fr: {
      title: "Fait confiance par les Étudiants & Institutions du Monde Entier",
      subtitle: "Découvrez ce que notre communauté dit de son expérience E-TAWJIHI",
      testimonials: [
        {
          quote: "Grâce à E-TAWJIHI, notre université a reçu des candidats qualifiés de 5 pays en moins d'un mois. La plateforme est incroyablement conviviale et les étudiants sont très motivés.",
          author: "Dr. Sarah Johnson",
          role: "Directrice Admissions Internationales",
          institution: "Université de Toronto",
          country: "🇨🇦 Canada",
          rating: 5
        },
        {
          quote: "E-TAWJIHI m'a aidé à trouver le programme parfait en Allemagne. Le conseiller IA était incroyablement utile pour faire correspondre mes intérêts avec les bonnes universités. Je n'aurais pas pu le faire sans eux !",
          author: "Ahmed Al-Rashid",
          role: "Étudiant en Informatique",
          institution: "TU Munich",
          country: "🇩🇪 Allemagne",
          rating: 5
        },
        {
          quote: "En tant qu'agent, E-TAWJIHI a transformé mon entreprise. La structure de commission est équitable, le support est excellent, et j'ai aidé plus de 100 étudiants à réaliser leurs rêves.",
          author: "Maria Santos",
          role: "Agent Éducation",
          institution: "Santos Education Services",
          country: "🇪🇸 Espagne",
          rating: 5
        },
        {
          quote: "L'assistance visa et les services de traduction de documents étaient exceptionnels. E-TAWJIHI a rendu mon parcours d'études à l'étranger fluide et sans stress.",
          author: "Fatima Zahra",
          role: "Étudiante en Administration des Affaires",
          institution: "Université Sorbonne",
          country: "🇫🇷 France",
          rating: 5
        }
      ],
      stats: [
        { number: "100 000+", label: "Étudiants Aidés" },
        { number: "500+", label: "Institutions Partenaires" },
        { number: "50+", label: "Pays" },
        { number: "98%", label: "Taux de Réussite" }
      ],
      partners: [
        "Université de Toronto",
        "TU Munich",
        "Université Sorbonne",
        "Université d'Amsterdam",
        "KTH Royal Institute",
        "Université de Melbourne"
      ]
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % currentContent.testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentContent.testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % currentContent.testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + currentContent.testimonials.length) % currentContent.testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="text-center">
              <Quote className="w-12 h-12 text-primary-600 mx-auto mb-6" />
              
              <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                "{currentContent.testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(currentContent.testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {currentContent.testimonials[currentTestimonial].author.charAt(0)}
                  </span>
                </div>
                
                <div className="text-left">
                  <h4 className="text-xl font-bold text-gray-900">
                    {currentContent.testimonials[currentTestimonial].author}
                  </h4>
                  <p className="text-gray-600">
                    {currentContent.testimonials[currentTestimonial].role}
                  </p>
                  <p className="text-primary-600 font-semibold">
                    {currentContent.testimonials[currentTestimonial].institution}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {currentContent.testimonials[currentTestimonial].country}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              
              <div className="flex gap-2">
                {currentContent.testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-12 text-white mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'en' ? 'Our Global Impact' : 'Notre Impact Mondial'}
            </h3>
            <p className="text-xl text-white/90">
              {language === 'en' 
                ? 'Numbers that speak for themselves' 
                : 'Des chiffres qui parlent d\'eux-mêmes'
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

        {/* Partner Institutions */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            {language === 'en' ? 'Trusted by Leading Institutions' : 'Fait Confiance par les Institutions Leaders'}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {currentContent.partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-700 text-center">
                  {partner}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSimple;

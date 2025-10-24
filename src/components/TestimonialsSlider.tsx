import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  country: string;
  university: string;
  content: string;
  rating: number;
  avatar: string;
}

interface TestimonialsSliderProps {
  language: string;
}

const TestimonialsSlider: React.FC<TestimonialsSliderProps> = ({ language }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Computer Science Student",
      country: "Canada",
      university: "University of Toronto",
      content: language === 'en' 
        ? "E-TAWJIHI Global made my dream of studying abroad a reality. The AI guidance helped me find the perfect program and the application process was seamless."
        : "E-TAWJIHI Global a rendu mon rêve d'étudier à l'étranger réalité. L'orientation IA m'a aidé à trouver le programme parfait et le processus de candidature était fluide.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Ahmed Al-Rashid",
      role: "Business Administration",
      country: "Germany",
      university: "WHU - Otto Beisheim School",
      content: language === 'en'
        ? "The platform connected me with top European universities. The visa assistance and document translation services were exceptional."
        : "La plateforme m'a connecté avec les meilleures universités européennes. L'assistance visa et les services de traduction de documents étaient exceptionnels.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      role: "Engineering Student",
      country: "Australia",
      university: "University of Melbourne",
      content: language === 'en'
        ? "E-DVISOR's personalized recommendations were spot-on. I found my ideal engineering program and got a scholarship through their partner network."
        : "Les recommandations personnalisées d'E-DVISOR étaient parfaites. J'ai trouvé mon programme d'ingénierie idéal et obtenu une bourse via leur réseau de partenaires.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Medicine Student",
      country: "United Kingdom",
      university: "Imperial College London",
      content: language === 'en'
        ? "The comprehensive support from application to arrival was outstanding. E-TAWJIHI Global truly cares about student success."
        : "Le support complet de la candidature à l'arrivée était exceptionnel. E-TAWJIHI Global se soucie vraiment de la réussite des étudiants.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Fatima Al-Zahra",
      role: "International Relations",
      country: "Netherlands",
      university: "University of Amsterdam",
      content: language === 'en'
        ? "The platform's AI-powered matching system found me the perfect university that I never would have discovered on my own."
        : "Le système de correspondance alimenté par l'IA de la plateforme m'a trouvé l'université parfaite que je n'aurais jamais découverte par moi-même.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentSlide];

  return (
    <div className="relative h-full flex flex-col justify-center p-8 lg:p-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <Quote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                {language === 'en' ? 'Success Stories' : 'Histoires de Succès'}
              </h2>
              <p className="text-blue-100 text-sm lg:text-base">
                {language === 'en' 
                  ? 'Join thousands of students who achieved their dreams' 
                  : 'Rejoignez des milliers d\'étudiants qui ont réalisé leurs rêves'}
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20">
          {/* Rating */}
          <div className="flex items-center mb-4">
            {[...Array(currentTestimonial.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>

          {/* Content */}
          <blockquote className="text-white text-lg lg:text-xl leading-relaxed mb-6">
            "{currentTestimonial.content}"
          </blockquote>

          {/* Author */}
          <div className="flex items-center">
            <img
              src={currentTestimonial.avatar}
              alt={currentTestimonial.name}
              className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white/30"
            />
            <div>
              <h4 className="text-white font-semibold text-lg">{currentTestimonial.name}</h4>
              <p className="text-blue-100 text-sm">{currentTestimonial.role}</p>
              <p className="text-blue-200 text-xs">
                {currentTestimonial.university} • {currentTestimonial.country}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {/* Dots */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-white">50+</div>
            <div className="text-blue-100 text-sm">
              {language === 'en' ? 'Countries' : 'Pays'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-white">10K+</div>
            <div className="text-blue-100 text-sm">
              {language === 'en' ? 'Students' : 'Étudiants'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-white">98%</div>
            <div className="text-blue-100 text-sm">
              {language === 'en' ? 'Success Rate' : 'Taux de Réussite'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSlider;

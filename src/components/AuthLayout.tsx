import React from 'react';
import { motion } from 'framer-motion';
import TestimonialsSlider from './TestimonialsSlider';

interface AuthLayoutProps {
  children: React.ReactNode;
  language: string;
  setLanguage: (lang: string) => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  language,
  setLanguage,
  title,
  subtitle,
  icon
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-32">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="https://cdn.e-tawjihi.ma/logo-rectantgle-simple-nobg.png" 
                alt="E-TAWJIHI Logo" 
                className="h-20 w-auto hover:opacity-80 transition-opacity cursor-pointer"
              />
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'FR' : 'EN'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 min-h-screen">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Side - Form */}
          <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex items-center justify-center mb-6"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-3 rounded-xl shadow-lg">
                    {icon}
                  </div>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  {title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600"
                >
                  {subtitle}
                </motion.p>
              </div>

              {/* Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                {children}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Testimonials */}
          <div className="hidden lg:block bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 relative overflow-hidden">
            <TestimonialsSlider language={language} />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Mobile Testimonials */}
      <div className="lg:hidden bg-gradient-to-r from-blue-600 to-emerald-600 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              {language === 'en' ? 'Success Stories' : 'Histoires de Succès'}
            </h3>
            <p className="text-blue-100">
              {language === 'en' 
                ? 'Join thousands of students who achieved their dreams' 
                : 'Rejoignez des milliers d\'étudiants qui ont réalisé leurs rêves'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
                  alt="Sarah"
                  className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white/30"
                />
                <div>
                  <h4 className="text-white font-semibold">Sarah Johnson</h4>
                  <p className="text-blue-100 text-sm">University of Toronto</p>
                </div>
              </div>
              <p className="text-white text-sm">
                {language === 'en'
                  ? "E-TAWJIHI Global made my dream of studying abroad a reality."
                  : "E-TAWJIHI Global a rendu mon rêve d'étudier à l'étranger réalité."}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                  alt="Ahmed"
                  className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white/30"
                />
                <div>
                  <h4 className="text-white font-semibold">Ahmed Al-Rashid</h4>
                  <p className="text-blue-100 text-sm">WHU Germany</p>
                </div>
              </div>
              <p className="text-white text-sm">
                {language === 'en'
                  ? "The platform connected me with top European universities."
                  : "La plateforme m'a connecté avec les meilleures universités européennes."}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
                  alt="Maria"
                  className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white/30"
                />
                <div>
                  <h4 className="text-white font-semibold">Maria Rodriguez</h4>
                  <p className="text-blue-100 text-sm">University of Melbourne</p>
                </div>
              </div>
              <p className="text-white text-sm">
                {language === 'en'
                  ? "E-DVISOR's personalized recommendations were spot-on."
                  : "Les recommandations personnalisées d'E-DVISOR étaient parfaites."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LanguageToggle = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 right-6 z-50"
    >
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Globe className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">
          {language === 'en' ? 'FR' : 'EN'}
        </span>
      </button>
    </motion.div>
  );
};

export default LanguageToggle;

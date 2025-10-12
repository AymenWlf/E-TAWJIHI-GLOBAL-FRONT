import React from 'react';
import { Globe } from 'lucide-react';

const LanguageToggleSimple = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Globe className="w-4 h-4 text-primary-600" />
        <span className="text-sm font-medium text-gray-700">
          {language === 'en' ? 'FR' : 'EN'}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggleSimple;

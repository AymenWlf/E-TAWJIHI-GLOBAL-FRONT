import React, { useState } from 'react';
import { Globe, Menu, X, User, Search, BookOpen } from 'lucide-react';

const HeaderGlobal = ({ language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="https://cdn.e-tawjihi.ma/logo-rectantgle-simple-nobg.png" 
              alt="E-TAWJIHI Logo" 
              className="h-20 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('programs')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {language === 'en' ? 'Programs' : 'Programmes'}
            </button>
            <button 
              onClick={() => scrollToSection('aidvisor')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              AIDVISOR
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {language === 'en' ? 'Services' : 'Services'}
            </button>
            <button 
              onClick={() => scrollToSection('partners')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {language === 'en' ? 'Partners' : 'Partenaires'}
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {language === 'en' ? 'About' : 'À propos'}
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'FR' : 'EN'}
              </span>
            </button>

            {/* Search Button */}
            <button 
              onClick={() => scrollToSection('search')}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Search className="w-4 h-4" />
              <span className="font-medium">
                {language === 'en' ? 'Search Programs' : 'Rechercher'}
              </span>
            </button>

            {/* Login Button */}
            <button className="hidden sm:flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">
                {language === 'en' ? 'Login' : 'Connexion'}
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('programs')}
                className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {language === 'en' ? 'Programs' : 'Programmes'}
              </button>
              <button 
                onClick={() => scrollToSection('aidvisor')}
                className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                AIDVISOR
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {language === 'en' ? 'Services' : 'Services'}
              </button>
              <button 
                onClick={() => scrollToSection('partners')}
                className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {language === 'en' ? 'Partners' : 'Partenaires'}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {language === 'en' ? 'About' : 'À propos'}
              </button>
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <button 
                  onClick={() => scrollToSection('search')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  <span className="font-medium">
                    {language === 'en' ? 'Search Programs' : 'Rechercher'}
                  </span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {language === 'en' ? 'Login' : 'Connexion'}
                  </span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderGlobal;

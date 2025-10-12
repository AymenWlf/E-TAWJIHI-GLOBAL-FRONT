import React, { useState } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';

const HeaderSimple = ({ language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoryDropdownOpen, setIsStoryDropdownOpen] = useState(false);

  const content = {
    en: {
      logo: "E-TAWJIHI",
      nav: {
        forStudents: "For Students",
        universities: "Universities", 
        programs: "Programs",
        ambassadors: "Ambassadors",
        ourStory: "Our Story"
      },
      auth: {
        login: "Login",
        signup: "Sign Up"
      },
      language: "EN"
    },
    fr: {
      logo: "E-TAWJIHI",
      nav: {
        forStudents: "Pour Étudiants",
        universities: "Universités",
        programs: "Programmes", 
        ambassadors: "Ambassadeurs",
        ourStory: "Notre Histoire"
      },
      auth: {
        login: "Connexion",
        signup: "S'inscrire"
      },
      language: "FR"
    }
  };

  const currentContent = content[language];

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-primary-600"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span>{currentContent.logo}</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a 
              href="#search" 
              onClick={() => scrollToSection('search')}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              {currentContent.nav.forStudents}
            </a>
            <a 
              href="#institutions" 
              onClick={() => scrollToSection('institutions')}
              className="text-gray-700 hover:text-secondary-600 transition-colors font-medium"
            >
              {currentContent.nav.universities}
            </a>
            <a 
              href="#search" 
              onClick={() => scrollToSection('search')}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              {currentContent.nav.programs}
            </a>
            <a 
              href="#agents" 
              onClick={() => scrollToSection('agents')}
              className="text-gray-700 hover:text-secondary-600 transition-colors font-medium"
            >
              {currentContent.nav.ambassadors}
            </a>
            
            {/* Our Story Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStoryDropdownOpen(!isStoryDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-secondary-600 transition-colors font-medium"
              >
                <span>{currentContent.nav.ourStory}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isStoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <a 
                    href="#about" 
                    onClick={() => scrollToSection('about')}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    {language === 'en' ? 'About Us' : 'À Propos'}
                  </a>
                  <a 
                    href="#testimonials" 
                    onClick={() => scrollToSection('testimonials')}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-secondary-600 transition-colors"
                  >
                    {language === 'en' ? 'Success Stories' : 'Histoires de Succès'}
                  </a>
                  <a 
                    href="#services" 
                    onClick={() => scrollToSection('services')}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    {language === 'en' ? 'Our Services' : 'Nos Services'}
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side - Language & Auth */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">
                {currentContent.language}
              </span>
            </button>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
            <a 
              href="/login" 
              className="text-gray-700 hover:text-secondary-600 transition-colors font-medium"
            >
              {currentContent.auth.login}
            </a>
              <a 
                href="/signup" 
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                {currentContent.auth.signup}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#search" 
                onClick={() => scrollToSection('search')}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
              >
                {currentContent.nav.forStudents}
              </a>
              <a 
                href="#institutions" 
                onClick={() => scrollToSection('institutions')}
                className="text-gray-700 hover:text-secondary-600 transition-colors font-medium py-2"
              >
                {currentContent.nav.universities}
              </a>
              <a 
                href="#search" 
                onClick={() => scrollToSection('search')}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
              >
                {currentContent.nav.programs}
              </a>
              <a 
                href="#agents" 
                onClick={() => scrollToSection('agents')}
                className="text-gray-700 hover:text-secondary-600 transition-colors font-medium py-2"
              >
                {currentContent.nav.ambassadors}
              </a>
              <a 
                href="#about" 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-secondary-600 transition-colors font-medium py-2"
              >
                {currentContent.nav.ourStory}
              </a>
              
              {/* Mobile Auth */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <a 
                  href="/login" 
                  className="text-gray-700 hover:text-secondary-600 transition-colors font-medium py-2"
                >
                  {currentContent.auth.login}
                </a>
                <a 
                  href="/signup" 
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:shadow-lg transition-all duration-300"
                >
                  {currentContent.auth.signup}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderSimple;

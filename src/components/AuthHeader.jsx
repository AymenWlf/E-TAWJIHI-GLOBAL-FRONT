import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, User, Search } from 'lucide-react';

const AuthHeader = ({ language = 'en', setLanguage }) => {
  const toggleLanguage = () => {
    if (setLanguage) {
      setLanguage(language === 'en' ? 'fr' : 'en');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://cdn.e-tawjihi.ma/logo-rectantgle-simple-nobg.png" 
                alt="E-TAWJIHI Logo" 
                className="h-20 w-auto hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            {setLanguage && (
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {language === 'en' ? 'FR' : 'EN'}
                </span>
              </button>
            )}

            {/* Search Button */}
            <Link 
              to="/establishments"
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Search className="w-4 h-4" />
              <span className="font-medium">
                {language === 'en' ? 'Search Programs' : 'Rechercher'}
              </span>
            </Link>

            {/* Login Button */}
            <Link 
              to="/login"
              className="hidden sm:flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">
                {language === 'en' ? 'Login' : 'Connexion'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;

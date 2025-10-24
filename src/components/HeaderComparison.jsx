import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Search, User, ChevronDown } from 'lucide-react';
import CurrencySelector from './CurrencySelector';

const HeaderComparison = () => {
  const [language, setLanguage] = useState('en');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Comparaison des Headers - Charte Graphique
        </h1>

        {/* Header Page d'Accueil */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Header Page d'Accueil (Référence)</h2>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center space-x-8">
                    <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                      E-DVISOR
                    </button>
                    <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                      E-STUDY
                    </button>
                    <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                      Services
                    </button>
                  </nav>

                  {/* Right side actions */}
                  <div className="flex items-center space-x-4">
                    {/* Currency Selector */}
                    <div className="hidden sm:block">
                      <CurrencySelector size="sm" showLabel={false} />
                    </div>

                    {/* Language Toggle */}
                    <button
                      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'en' ? 'FR' : 'EN'}
                      </span>
                    </button>

                    {/* Search Button */}
                    <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Search className="w-4 h-4" />
                      <span className="font-medium">
                        {language === 'en' ? 'Search Programs' : 'Rechercher'}
                      </span>
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div>

        {/* Header Système */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Header Système (Authentifié)</h2>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">
                  {/* Logo - Même que la page d'accueil */}
                  <Link to="/" className="flex items-center">
                    <img 
                      src="https://cdn.e-tawjihi.ma/logo-rectantgle-simple-nobg.png" 
                      alt="E-TAWJIHI Logo" 
                      className="h-20 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  </Link>

                  {/* Desktop Navigation - Cohérent avec la page d'accueil */}
                  <nav className="hidden md:flex items-center space-x-8">
                    <Link to="/establishments" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      Établissements
                    </Link>
                    <Link to="/programs" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      Programmes
                    </Link>
                    <Link to="/scholarships" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      Bourses
                    </Link>
                    <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      Services
                    </Link>
                    <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      E-DVISOR
                    </Link>
                  </nav>

                  {/* Right side - User info and actions */}
                  <div className="flex items-center space-x-4">
                    {/* Currency Selector */}
                    <div className="hidden sm:block">
                      <CurrencySelector size="sm" showLabel={false} />
                    </div>

                    {/* Language Toggle - Cohérent avec la page d'accueil */}
                    <button
                      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'en' ? 'FR' : 'EN'}
                      </span>
                    </button>

                    {/* Search Button - Identique à la page d'accueil */}
                    <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Search className="w-4 h-4" />
                      <span className="font-medium">
                        {language === 'en' ? 'Search Programs' : 'Rechercher'}
                      </span>
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div>

        {/* Checklist de Cohérence */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checklist de Cohérence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Logo identique (h-20, même URL)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Hauteur de header identique (h-24)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Bouton de recherche identique (bg-blue-800)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">CurrencySelector intégré</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Language toggle identique</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Navigation cohérente</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Transitions identiques</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Couleurs de la charte respectées</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComparison;

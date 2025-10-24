import React, { useState, useEffect } from 'react';
import { Globe, Menu, X, User, Search, BookOpen, ChevronDown, Building2, Users, Award, GraduationCap, FileCheck, Home, Languages, CreditCard, ClipboardList, Brain, FileText, Calculator, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CurrencySelector from '../CurrencySelector';

const HeaderGlobal = ({ language, setLanguage }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const handleLoginClick = () => {
    if (currentUser) {
      // Si déjà connecté, rediriger vers les établissements
      navigate('/establishments');
    } else {
      // Sinon, aller à la page de connexion
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const servicesItems = [
    {
      id: 'visa',
      title: language === 'en' ? 'Visa Assistance' : 'Assistance Visa',
      description: language === 'en' ? 'Complete visa support for all countries' : 'Support visa complet pour tous les pays',
      icon: <FileCheck className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      id: 'housing',
      title: language === 'en' ? 'Student Housing' : 'Logement Étudiant',
      description: language === 'en' ? 'Safe and comfortable accommodation' : 'Hébergement sûr et confortable',
      icon: <Home className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      id: 'translation',
      title: language === 'en' ? 'Document Translation' : 'Traduction de Documents',
      description: language === 'en' ? 'Certified translation services' : 'Services de traduction certifiés',
      icon: <Languages className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      id: 'vouchers',
      title: language === 'en' ? 'Test Service Vouchers' : 'Bons de Service de Test',
      description: language === 'en' ? 'Discounted test vouchers and prep' : 'Bons de test réduits et préparation',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'text-orange-600'
    },
    {
      id: 'admission',
      title: language === 'en' ? 'Admission & Application' : 'Admission & Candidature',
      description: language === 'en' ? 'Complete application assistance' : 'Assistance complète aux candidatures',
      icon: <ClipboardList className="w-5 h-5" />,
      color: 'text-pink-600'
    },
    {
      id: 'scholarships',
      title: language === 'en' ? 'Paid Scholarships' : 'Bourses Payantes',
      description: language === 'en' ? 'University partner scholarships with tuition discounts' : 'Bourses partenaires universitaires avec réductions sur les frais',
      icon: <Award className="w-5 h-5" />,
      color: 'text-indigo-600'
    }
  ];

  const toolsItems = [
    {
      id: 'diagnostic',
      title: language === 'en' ? 'Diagnostic System' : 'Système de Diagnostic',
      description: language === 'en' ? 'Complete personality & skills assessment' : 'Évaluation complète de personnalité et compétences',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      id: 'sop-generator',
      title: language === 'en' ? 'SOP Letter Generator' : 'Générateur de Lettre SOP',
      description: language === 'en' ? 'AI-powered Statement of Purpose creator' : 'Créateur de lettre de motivation alimenté par IA',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      id: 'visa-calculator',
      title: language === 'en' ? 'Visa Calculator' : 'Calculateur de Visa',
      description: language === 'en' ? 'Calculate visa requirements and costs' : 'Calculez les exigences et coûts de visa',
      icon: <Calculator className="w-5 h-5" />,
      color: 'text-green-600'
    }
  ];

  const partnerTypes = [
    {
      id: 'institution',
      title: language === 'en' ? 'Educational Institution' : 'Établissement d\'Enseignement',
      description: language === 'en' ? 'Universities, Colleges, Institutes' : 'Universités, Collèges, Instituts',
      icon: <Building2 className="w-5 h-5" />,
      link: '/institution-registration'
    },
    {
      id: 'agent',
      title: language === 'en' ? 'Education Agent' : 'Agent Éducatif',
      description: language === 'en' ? 'Recruitment Partners & Consultants' : 'Partenaires de Recrutement & Consultants',
      icon: <Users className="w-5 h-5" />,
      link: '/agent-registration'
    },
    {
      id: 'ambassador',
      title: language === 'en' ? 'Student Ambassador' : 'Ambassadeur Étudiant',
      description: language === 'en' ? 'Student Representatives & Advocates' : 'Représentants & Défenseurs Étudiants',
      icon: <GraduationCap className="w-5 h-5" />,
      link: '/ambassador-registration'
    },
    {
      id: 'sponsor',
      title: language === 'en' ? 'Scholarship Sponsor' : 'Sponsor de Bourses',
      description: language === 'en' ? 'Organizations & Foundations' : 'Organisations & Fondations',
      icon: <Award className="w-5 h-5" />,
      link: '/sponsor-registration'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPartnerDropdown && !event.target.closest('.partner-dropdown')) {
        setShowPartnerDropdown(false);
      }
      if (showServicesDropdown && !event.target.closest('.services-dropdown')) {
        setShowServicesDropdown(false);
      }
      if (showToolsDropdown && !event.target.closest('.tools-dropdown')) {
        setShowToolsDropdown(false);
      }
      if (showUserDropdown && !event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPartnerDropdown, showServicesDropdown, showToolsDropdown, showUserDropdown]);

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('aidvisor')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              E-DVISOR
            </button>
            <button 
              onClick={() => scrollToSection('estudy')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              E-STUDY
            </button>
            {/* Partner Dropdown */}
            <div className="relative partner-dropdown">
              <button
                onClick={() => setShowPartnerDropdown(!showPartnerDropdown)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {language === 'en' ? 'Become Partner' : 'Devenir Partenaire'}
                <ChevronDown className={`w-4 h-4 transition-transform ${showPartnerDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showPartnerDropdown && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-1">
                    {partnerTypes.map((partner) => (
                      <Link
                        key={partner.id}
                        to={partner.link}
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors group"
                        onClick={() => setShowPartnerDropdown(false)}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                          {partner.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm leading-tight">
                            {partner.title}
                          </h3>
                          <p className="text-xs text-gray-500 leading-tight mt-0.5">
                            {partner.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
        {/* Services Dropdown */}
        <div className="relative services-dropdown">
          <button
            onClick={() => setShowServicesDropdown(!showServicesDropdown)}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            {language === 'en' ? 'Services' : 'Services'}
            <ChevronDown className={`w-4 h-4 transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showServicesDropdown && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {language === 'en' ? 'Our Services' : 'Nos Services'}
                </h3>
                <div className="space-y-2">
                  {servicesItems.map((service) => (
                    <Link
                      key={service.id}
                      to={`/services#${service.id}`}
                      onClick={() => setShowServicesDropdown(false)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className={`p-2 rounded-lg bg-gray-50 ${service.color}`}>
                        {service.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {service.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {service.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Education Tools Dropdown */}
        <div className="relative tools-dropdown">
          <button
            onClick={() => setShowToolsDropdown(!showToolsDropdown)}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            {language === 'en' ? 'Education Tools' : 'Outils Éducatifs'}
            <ChevronDown className={`w-4 h-4 transition-transform ${showToolsDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showToolsDropdown && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {language === 'en' ? 'AI-Powered Tools' : 'Outils Alimentés par IA'}
                </h3>
                <div className="space-y-2">
                  {toolsItems.map((tool) => (
                    <Link
                      key={tool.id}
                      to={`/education-tools#${tool.id}`}
                      onClick={() => setShowToolsDropdown(false)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className={`p-2 rounded-lg bg-gray-50 ${tool.color}`}>
                        {tool.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {tool.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tool.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Currency Selector */}
            <div className="hidden sm:block">
              <CurrencySelector size="sm" showLabel={false} />
            </div>

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
            <Link 
              to="/establishments"
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Search className="w-4 h-4" />
              <span className="font-medium">
                {language === 'en' ? 'Search Programs' : 'Rechercher'}
              </span>
            </Link>

            {/* User Menu */}
            {currentUser ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {currentUser.firstName || currentUser.email.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {currentUser.firstName && currentUser.lastName 
                            ? `${currentUser.firstName} ${currentUser.lastName}`
                            : currentUser.email.split('@')[0]
                          }
                        </p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to="/establishments"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Building2 className="w-4 h-4" />
                          {language === 'en' ? 'Browse Programs' : 'Parcourir les Programmes'}
                        </Link>
                        
                        <Link
                          to="/profile"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          {language === 'en' ? 'My Profile' : 'Mon Profil'}
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {language === 'en' ? 'Logout' : 'Déconnexion'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">
                  {language === 'en' ? 'Login' : 'Connexion'}
                </span>
              </button>
            )}

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
                onClick={() => scrollToSection('aidvisor')}
                className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                E-DVISOR
              </button>
              <button 
                onClick={() => scrollToSection('estudy')}
                className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                E-STUDY
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {language === 'en' ? 'Services' : 'Services'}
              </button>
              {/* Mobile Partner Options */}
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {language === 'en' ? 'Become Partner' : 'Devenir Partenaire'}
                </h3>
                <div className="space-y-1">
                  {partnerTypes.map((partner) => (
                    <Link
                      key={partner.id}
                      to={partner.link}
                      className="flex items-center gap-3 p-2.5 rounded-md hover:bg-blue-50 transition-colors group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                        {partner.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {partner.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-tight mt-0.5">
                          {partner.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {language === 'en' ? 'About' : 'À propos'}
              </button>
              
              {/* Mobile Currency Selector */}
              <div className="pt-4 border-t border-gray-100">
                <CurrencySelector size="md" showLabel={true} />
              </div>

              {/* Mobile CTA Buttons */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link 
                  to="/establishments"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  <span className="font-medium">
                    {language === 'en' ? 'Search Programs' : 'Rechercher'}
                  </span>
                </Link>
                
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.firstName && currentUser.lastName 
                          ? `${currentUser.firstName} ${currentUser.lastName}`
                          : currentUser.email.split('@')[0]
                        }
                      </p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                    
                    <Link
                      to="/establishments"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">
                        {language === 'en' ? 'Browse Programs' : 'Parcourir les Programmes'}
                      </span>
                    </Link>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">
                        {language === 'en' ? 'My Profile' : 'Mon Profil'}
                      </span>
                    </Link>
                    
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">
                        {language === 'en' ? 'Logout' : 'Déconnexion'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleLoginClick}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-700">
                      {language === 'en' ? 'Login' : 'Connexion'}
                    </span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderGlobal;

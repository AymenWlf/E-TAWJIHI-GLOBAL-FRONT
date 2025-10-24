import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Globe,
  Search,
  Menu,
  X,
  Building2,
  GraduationCap,
  Award,
  Bot,
  TrendingUp,
  FileText
} from 'lucide-react';

const HeaderAuth = ({ language, setLanguage }) => {
  const { currentUser, logout, updateLanguage } = useAuth();
  const { userCurrency, setUserCurrency, supportedCurrencies } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currencySearchTerm, setCurrencySearchTerm] = useState('');

  // Calculate onboarding progress (example: 60% complete)
  const onboardingProgress = 60;

  // Initialize language from user preference
  useEffect(() => {
    if (currentUser?.preferredLanguage && currentUser.preferredLanguage !== language) {
      setLanguage(currentUser.preferredLanguage);
    }
  }, [currentUser?.preferredLanguage, language, setLanguage]);

  // Initialize currency from user preference
  useEffect(() => {
    if (currentUser?.preferredCurrency && currentUser.preferredCurrency !== userCurrency) {
      setUserCurrency(currentUser.preferredCurrency);
    }
  }, [currentUser?.preferredCurrency, userCurrency, setUserCurrency]);

  // Filter currencies based on search term
  const filteredCurrencies = supportedCurrencies.filter(currency => 
    currency.code.toLowerCase().includes(currencySearchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(currencySearchTerm.toLowerCase()) ||
    currency.symbol.toLowerCase().includes(currencySearchTerm.toLowerCase())
  );

  // Reset search when dropdown closes
  const handleCurrencyDropdownToggle = () => {
    setIsCurrencyOpen(!isCurrencyOpen);
    if (isCurrencyOpen) {
      setCurrencySearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const handleLanguageChange = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      setIsMobileMenuOpen(false);
      
      // Persister la langue dans la base de données si l'utilisateur est connecté
      if (currentUser) {
        await updateLanguage(newLanguage);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la langue:', error);
      // En cas d'erreur, on garde quand même le changement local
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
          {/* Logo - Fixed size, responsive */}
          <Link to="/" className="flex items-center flex-shrink-0">
              <img 
                src="https://cdn.e-tawjihi.ma/logo-rectantgle-simple-nobg.png" 
              alt="E-TAWJIHI Logo" 
              className="h-12 sm:h-16 lg:h-20 w-auto hover:opacity-80 transition-opacity cursor-pointer"
              />
                </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/establishments" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/establishments' || location.pathname === '/programs'
                  ? 'bg-blue-100 text-blue-600 border border-blue-200'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="font-medium">
                {language === 'fr' ? 'Établissement & Programmes' : 'Establishments & Programs'}
              </span>
                </Link>
            
            <Link 
              to="/profile?tab=applications" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/profile' && location.search.includes('applications')
                  ? 'bg-blue-100 text-blue-600 border border-blue-200'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="font-medium">
                {language === 'fr' ? 'Mes Candidatures' : 'My Applications'}
              </span>
            </Link>
            
            
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 cursor-not-allowed relative">
              <Award className="w-4 h-4" />
              <span className="font-medium">
                {language === 'fr' ? 'Bourses' : 'Scholarships'}
              </span>
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                {language === 'fr' ? 'Bientôt' : 'Soon'}
              </span>
            </div>
            
            <Link 
              to="/" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Bot className="w-4 h-4" />
              <span>E-DVISOR</span>
            </Link>
          </nav>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">

            {/* Currency Selector */}
            <div className="relative">
              <button 
                onClick={handleCurrencyDropdownToggle}
                className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-sm">
                  {supportedCurrencies.find(c => c.code === userCurrency)?.flag || '🌍'}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {userCurrency}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
              
              {/* Currency Dropdown */}
              {isCurrencyOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => {
                      setIsCurrencyOpen(false);
                      setCurrencySearchTerm('');
                    }}
                  />
                  <div className="absolute right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder={language === 'en' ? 'Search currency...' : 'Rechercher une devise...'}
                          value={currencySearchTerm}
                          onChange={(e) => setCurrencySearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    {/* Currency List */}
                    <div className="max-h-64 overflow-y-auto">
                      {filteredCurrencies.length > 0 ? (
                        filteredCurrencies.map((currency) => (
                          <button
                            key={currency.code}
                            onClick={() => {
                              setUserCurrency(currency.code);
                              setIsCurrencyOpen(false);
                              setCurrencySearchTerm('');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                              currency.code === userCurrency ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{currency.flag}</span>
                              <div>
                                <div className="font-medium text-gray-900 text-sm">
                                  {currency.code}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {currency.name}
                                </div>
                  </div>
                          </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                {currency.symbol}
                              </span>
                              {currency.code === userCurrency && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-gray-500 text-sm">
                          {language === 'en' ? 'No currencies found' : 'Aucune devise trouvée'}
                        </div>
                      )}
                      </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Language Toggle - Simple and clean */}
            <button
              onClick={() => handleLanguageChange(language === 'en' ? 'fr' : 'en')}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
              {language === 'en' ? 'FR' : 'EN'}
              </span>
            </button>

            {/* Search Button - Responsive */}
            <button
              onClick={() => navigate('/establishments')}
              className="hidden sm:flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Search className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">
                {language === 'en' ? 'Search' : 'Rechercher'}
              </span>
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.firstName}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-24">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-24">{currentUser?.email}</p>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
              </button>
              
              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                    
                    {/* Onboarding Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          {language === 'fr' ? 'Profil' : 'Profile'}
                        </span>
                        <span className="text-xs text-gray-500">{onboardingProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${onboardingProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>{language === 'fr' ? 'Mon Profil' : 'My Profile'}</span>
                    </Link>
                    
                    <Link
                      to="/profile?tab=settings"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>{language === 'fr' ? 'Paramètres' : 'Settings'}</span>
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{language === 'fr' ? 'Se déconnecter' : 'Logout'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex-shrink-0"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/establishments" 
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === '/establishments' || location.pathname === '/programs'
                    ? 'bg-blue-100 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Building2 className="w-4 h-4" />
                <span className="font-medium">
                  {language === 'fr' ? 'Établissement & Programmes' : 'Establishments & Programs'}
                </span>
              </Link>
              
              <Link 
                to="/profile?tab=applications" 
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === '/profile' && location.search.includes('applications')
                    ? 'bg-blue-100 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">
                  {language === 'fr' ? 'Mes Candidatures' : 'My Applications'}
                </span>
              </Link>
              
              
              <div className="flex items-center space-x-2 px-4 py-2 text-gray-500 cursor-not-allowed relative">
                <Award className="w-4 h-4" />
                <span className="font-medium">
                  {language === 'fr' ? 'Bourses' : 'Scholarships'}
                </span>
                <span className="ml-auto bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                  {language === 'fr' ? 'Bientôt' : 'Soon'}
                </span>
              </div>
              
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bot className="w-4 h-4" />
                <span>E-DVISOR</span>
              </Link>
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button
                  onClick={() => {
                    navigate('/establishments');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 w-full text-left"
                >
                  <Search className="w-4 h-4" />
                  <span>{language === 'fr' ? 'Rechercher' : 'Search'}</span>
                </button>
                </div>

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center space-x-2 px-4 py-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <button
                    onClick={() => handleLanguageChange(language === 'en' ? 'fr' : 'en')}
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {language === 'en' ? 'Français' : 'English'}
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderAuth;
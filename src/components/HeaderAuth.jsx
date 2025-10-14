import React, { useState } from 'react';
import { Search, Bell, User, Settings, LogOut, ChevronDown, BookOpen, FileText, Heart, MessageSquare, Award, Calendar, MapPin, Globe, Building2, Bot, Sparkles, Menu, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import OnboardingChecklist from './OnboardingChecklist';

const HeaderAuth = ({ language, setLanguage }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sample onboarding progress data
  const onboardingProgress = {
    account_creation: true,
    email_verification: true,
    edvisor_test: false,
    search_shortlist: false,
    apply_choice: false,
    fill_information: true,
    degrees_qualifications: false,
    documents_preferences: false
  };

  const notifications = [
    {
      id: 1,
      title: language === 'en' ? 'New scholarship opportunity' : 'Nouvelle opportunité de bourse',
      message: language === 'en' ? 'MIT offers new engineering scholarships' : 'MIT propose de nouvelles bourses d\'ingénierie',
      time: '2 hours ago',
      unread: true,
      type: 'scholarship'
    },
    {
      id: 2,
      title: language === 'en' ? 'Application deadline reminder' : 'Rappel de date limite de candidature',
      message: language === 'en' ? 'University of Toronto deadline in 5 days' : 'Date limite de l\'Université de Toronto dans 5 jours',
      time: '1 day ago',
      unread: true,
      type: 'deadline'
    },
    {
      id: 3,
      title: language === 'en' ? 'Profile completion' : 'Finalisation du profil',
      message: language === 'en' ? 'Complete your profile to get better matches' : 'Finalisez votre profil pour de meilleures correspondances',
      time: '3 days ago',
      unread: false,
      type: 'profile'
    }
  ];

  const userApplications = [
    {
      id: 1,
      university: 'MIT',
      program: 'Computer Science',
      status: 'Under Review',
      date: '2024-01-15'
    },
    {
      id: 2,
      university: 'University of Toronto',
      program: 'Engineering',
      status: 'Accepted',
      date: '2024-01-10'
    },
    {
      id: 3,
      university: 'ETH Zurich',
      program: 'Mathematics',
      status: 'Pending',
      date: '2024-01-20'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'text-green-600 bg-green-100';
      case 'Under Review': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'scholarship': return <Award className="w-4 h-4 text-emerald-500" />;
      case 'deadline': return <Calendar className="w-4 h-4 text-red-500" />;
      case 'profile': return <User className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-28">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-12">
              <img 
                src="https://cdn.e-tawjihi.ma/logo-rectantgle-simple-nobg.png" 
                alt="E-TAWJIHI" 
                className="h-24 w-auto"
              />
              <nav className="hidden lg:flex space-x-10">
                <Link to="/establishments" className="text-blue-800 bg-blue-50 px-4 py-3 rounded-xl font-semibold transition-colors flex items-center gap-3 hover:bg-blue-100">
                  <Building2 className="w-5 h-5" />
                  <span className="text-base">{language === 'en' ? 'Universities & Programs' : 'Universités & Programmes'}</span>
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                  <User className="w-5 h-5" />
                  <span className="text-base">{language === 'en' ? 'Profile' : 'Profil'}</span>
                </Link>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                  <FileText className="w-5 h-5" />
                  <span className="text-base">{language === 'en' ? 'My Applications' : 'Mes Candidatures'}</span>
                </a>
                <a href="#" className="text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 border border-emerald-200 hover:bg-emerald-100">
                  <Bot className="w-5 h-5" />
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="text-base">{language === 'en' ? 'E-DVISOR' : 'E-DVISOR'}</span>
                </a>
              </nav>
            </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-3 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>


            {/* Search */}
            <button className="hidden sm:block p-3 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50">
              <Search className="w-5 h-5" />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 text-gray-600 hover:text-blue-600 transition-colors relative rounded-lg hover:bg-gray-50"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => n.unread).length}
                  </div>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'en' ? 'Notifications' : 'Notifications'}
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      {language === 'en' ? 'View all notifications' : 'Voir toutes les notifications'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="px-4 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-medium flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'FR' : 'EN'}
            </button>
            
            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-4 pl-6 border-l border-gray-200 hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-base font-semibold">JD</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-base font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">Computer Science Student</p>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </button>
              
              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  {/* Profile Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">JD</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">John Doe</h3>
                        <p className="text-sm text-gray-500">john.doe@email.com</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{userApplications.length}</div>
                        <div className="text-xs text-gray-500">{language === 'en' ? 'Applications' : 'Candidatures'}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">1</div>
                        <div className="text-xs text-gray-500">{language === 'en' ? 'Accepted' : 'Accepté'}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">3</div>
                        <div className="text-xs text-gray-500">{language === 'en' ? 'Favorites' : 'Favoris'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Onboarding Progress */}
                  <div className="p-4 border-b border-gray-100">
                    <OnboardingChecklist 
                      userProgress={onboardingProgress}
                      language={language}
                      isCompact={true}
                      showProgress={true}
                      onStepClick={(stepId) => {
                        // Handle step click - could navigate to profile
                        console.log('Step clicked:', stepId);
                        setShowProfileDropdown(false);
                      }}
                    />
                  </div>
                  
                  {/* Navigation Links */}
                  <div className="p-2">
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      <span>{language === 'en' ? 'My Profile' : 'Mon Profil'}</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>{language === 'en' ? 'My Applications' : 'Mes Candidatures'}</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{language === 'en' ? 'Favorites' : 'Favoris'}</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>{language === 'en' ? 'Messages' : 'Messages'}</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>{language === 'en' ? 'Settings' : 'Paramètres'}</span>
                    </a>
                  </div>
                  
                  {/* Logout */}
                  <div className="p-2 border-t border-gray-100">
                    <button className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full">
                      <LogOut className="w-4 h-4" />
                      <span>{language === 'en' ? 'Sign Out' : 'Se Déconnecter'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Sidebar */}
    {showMobileMenu && (
      <div className="lg:hidden fixed inset-0 z-50">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setShowMobileMenu(false)}
        />
        
        {/* Sidebar */}
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'en' ? 'Menu' : 'Menu'}
              </h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-4">
              <Link 
                to="/establishments" 
                className="flex items-center gap-4 p-4 text-blue-800 bg-blue-50 rounded-xl font-semibold transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <Building2 className="w-6 h-6" />
                <span className="text-lg">{language === 'en' ? 'Universities & Programs' : 'Universités & Programmes'}</span>
              </Link>
              
              <Link 
                to="/profile" 
                className="flex items-center gap-4 p-4 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-xl hover:bg-gray-50"
                onClick={() => setShowMobileMenu(false)}
              >
                <User className="w-6 h-6" />
                <span className="text-lg">{language === 'en' ? 'Profile' : 'Profil'}</span>
              </Link>
              
              <a 
                href="#" 
                className="flex items-center gap-4 p-4 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-xl hover:bg-gray-50"
                onClick={() => setShowMobileMenu(false)}
              >
                <FileText className="w-6 h-6" />
                <span className="text-lg">{language === 'en' ? 'My Applications' : 'Mes Candidatures'}</span>
              </a>
              
              <a 
                href="#" 
                className="flex items-center gap-4 p-4 text-emerald-600 bg-emerald-50 rounded-xl font-medium transition-colors border border-emerald-200 hover:bg-emerald-100"
                onClick={() => setShowMobileMenu(false)}
              >
                <Bot className="w-6 h-6" />
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span className="text-lg">{language === 'en' ? 'E-DVISOR' : 'E-DVISOR'}</span>
              </a>
              
            </nav>

            {/* User Profile Section */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-base font-semibold">JD</span>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">Computer Science Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default HeaderAuth;

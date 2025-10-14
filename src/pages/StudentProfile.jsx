import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Edit3, Save, X, MapPin, Calendar, Phone, Mail, 
  GraduationCap, Award, Globe, Heart, FileText, Settings,
  Camera, Upload, CheckCircle, AlertCircle, Star,
  Building2, BookOpen, Target, MessageCircle, Bell, Plus,
  ShoppingBag, CreditCard, MessageSquare, HelpCircle, Lightbulb, Users
} from 'lucide-react';
import SEO from '../components/SEO';
import HeaderAuth from '../components/HeaderAuth';
import OnboardingChecklist from '../components/OnboardingChecklist';

const StudentProfile = () => {
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('onboarding');
  const [isEditing, setIsEditing] = useState(false);

  // Sample student data
  const [studentData, setStudentData] = useState({
    fullName: "Aymen Ouallaf",
    country: "Morocco",
    city: "Casablanca-Settat",
    nationality: "Morocco",
    phone: "+212 614 874083",
    dateOfBirth: "1995-06-15",
    email: "aymen.ouallaf@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    
    studyLevel: "Postgraduate",
    fieldOfStudy: "Finance",
    preferredCountry: "United Kingdom",
    startDate: "July 2026",
    
    counsellor: {
      name: "Eslam Aly",
      position: "Team Lead",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5.0
    },
    
    // Onboarding progress
    onboardingProgress: {
      account_creation: true,
      email_verification: true,
      edvisor_test: false,
      search_shortlist: false,
      apply_choice: false,
      fill_information: true,
      degrees_qualifications: false,
      documents_preferences: false
    }
  });

  const [formData, setFormData] = useState(studentData);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setStudentData(formData);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setFormData(studentData);
    setIsEditing(false);
  };

  const profileSections = [
    { id: 'onboarding', label: language === 'en' ? 'Onboarding' : 'Inscription', icon: CheckCircle },
    { id: 'basic-info', label: language === 'en' ? 'Basic Info' : 'Informations de Base', icon: User },
    { id: 'qualifications', label: language === 'en' ? 'Qualifications' : 'Qualifications', icon: GraduationCap },
    { id: 'preferences', label: language === 'en' ? 'Preferences' : 'Préférences', icon: Target },
    { id: 'documents', label: language === 'en' ? 'Documents' : 'Documents', icon: FileText },
    { id: 'applications', label: language === 'en' ? 'Applications' : 'Candidatures', icon: Building2 },
    { id: 'shortlist', label: language === 'en' ? 'Shortlist' : 'Liste de Souhaits', icon: Heart },
    { id: 'orders', label: language === 'en' ? 'My Orders' : 'Mes Commandes', icon: ShoppingBag },
    { id: 'payments', label: language === 'en' ? 'My Payments' : 'Mes Paiements', icon: CreditCard },
    { id: 'complaints', label: language === 'en' ? 'My Complaints' : 'Mes Réclamations', icon: MessageSquare },
    { id: 'faq', label: language === 'en' ? 'FAQ' : 'FAQ', icon: HelpCircle },
    { id: 'suggestions', label: language === 'en' ? 'Suggestions' : 'Suggestions', icon: Lightbulb },
    { id: 'ambassador', label: language === 'en' ? 'Become Ambassador' : 'Devenir Ambassadeur', icon: Users }
  ];

  return (
    <>
      <SEO 
        title={`${studentData.fullName} - Profile | E-TAWJIHI`}
        description="Student profile and preferences management"
        keywords="student profile, study abroad, applications, preferences"
      />
      
      <HeaderAuth language={language} setLanguage={setLanguage} />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Menu */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  {language === 'en' ? 'Profile Menu' : 'Menu du Profil'}
                </h3>
                <nav className="space-y-2">
                  {profileSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          activeSection === section.id
                            ? 'bg-white/20'
                            : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 transition-colors ${
                            activeSection === section.id ? 'text-white' : 'text-gray-600'
                          }`} />
                        </div>
                        <span className="font-medium">{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
          
              {/* Profile Header */}
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full -translate-y-36 translate-x-36"></div>
                
                <div className="relative p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Info Section */}
                    <div className="text-center lg:text-left">
                      <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                        {studentData.fullName}
                      </h1>
                      <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 mb-4">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="text-lg">{studentData.city}, {studentData.country}</span>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
                        <p className="text-gray-700 leading-relaxed">
                          {language === 'en' 
                            ? `Looking for a ${studentData.studyLevel} Course in ${studentData.fieldOfStudy} by ${studentData.startDate} in ${studentData.preferredCountry}`
                            : `Recherche un cours de ${studentData.studyLevel} en ${studentData.fieldOfStudy} d'ici ${studentData.startDate} au ${studentData.preferredCountry}`
                          }
                        </p>
                      </div>
                      
                      {!isEditing ? (
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto lg:mx-0"
                        >
                          <Edit3 className="w-5 h-5" />
                          {language === 'en' ? 'Edit Profile' : 'Modifier le Profil'}
                        </button>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                          <button 
                            onClick={handleSave}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Save className="w-5 h-5" />
                            {language === 'en' ? 'Save Changes' : 'Sauvegarder'}
                          </button>
                          <button 
                            onClick={handleDiscard}
                            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <X className="w-5 h-5" />
                            {language === 'en' ? 'Cancel' : 'Annuler'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Counsellor Info */}
                    <div className="flex justify-center lg:justify-end">
                      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200 shadow-lg w-full max-w-md">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-10 translate-x-10"></div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                          {language === 'en' ? 'Your Counsellor' : 'Votre Conseiller'}
                        </h3>
                        
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-0.5">
                              {studentData.counsellor.avatar && studentData.counsellor.avatar.trim() !== '' ? (
                                <img 
                                  src={studentData.counsellor.avatar} 
                                  alt={studentData.counsellor.name}
                                  className="w-14 h-14 rounded-full object-cover bg-white p-0.5"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${studentData.counsellor.avatar && studentData.counsellor.avatar.trim() !== '' ? 'hidden' : 'flex'}`}
                                style={{ display: studentData.counsellor.avatar && studentData.counsellor.avatar.trim() !== '' ? 'none' : 'flex' }}
                              >
                                <User className="w-7 h-7 text-gray-400" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-gray-900">{studentData.counsellor.name}</h4>
                            <p className="text-blue-600 font-medium text-sm">{studentData.counsellor.position}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                              <span className="text-xs text-gray-600 ml-1">5.0 (24)</span>
                            </div>
                          </div>
                        </div>
                        
                        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm">
                          <Calendar className="w-4 h-4" />
                          {language === 'en' ? 'Book Session' : 'Réserver'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-blue-50/30"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/10 to-indigo-100/10 rounded-full -translate-y-32 translate-x-32"></div>
                
                <div className="relative p-8 lg:p-12">
                  {activeSection === 'onboarding' && (
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {language === 'en' ? 'Onboarding Progress' : 'Progression d\'Inscription'}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {language === 'en' 
                              ? 'Complete these steps to get the most out of E-TAWJIHI' 
                              : 'Complétez ces étapes pour tirer le meilleur parti d\'E-TAWJIHI'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <OnboardingChecklist 
                        userProgress={studentData.onboardingProgress}
                        language={language}
                        isCompact={false}
                        showProgress={true}
                        onStepClick={(stepId) => {
                          // Handle step click - could navigate to relevant section
                          console.log('Step clicked:', stepId);
                        }}
                      />
                    </div>
                  )}

                  {activeSection === 'basic-info' && (
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {language === 'en' ? 'Basic Information' : 'Informations de Base'}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {language === 'en' ? 'Manage your personal details and contact information' : 'Gérez vos informations personnelles et de contact'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                            {language === 'en' ? 'Full Name' : 'Nom Complet'}
                          </label>
                          <p className="text-sm text-gray-500 mb-4">
                            {language === 'en' ? 'As per your passport or ID proof' : 'Comme indiqué sur votre passeport ou pièce d\'identité'}
                          </p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                          ) : (
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                              <p className="text-gray-900 font-semibold text-lg">{studentData.fullName}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                            {language === 'en' ? 'Country' : 'Pays'}
                          </label>
                          {isEditing ? (
                            <select
                              value={formData.country}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            >
                              <option value="Morocco">Morocco</option>
                              <option value="Algeria">Algeria</option>
                              <option value="Tunisia">Tunisia</option>
                              <option value="France">France</option>
                              <option value="Canada">Canada</option>
                            </select>
                          ) : (
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                              <p className="text-gray-900 font-semibold text-lg">{studentData.country}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                            {language === 'en' ? 'City' : 'Ville'}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                          ) : (
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                              <p className="text-gray-900 font-semibold text-lg">{studentData.city}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                            {language === 'en' ? 'Nationality' : 'Nationalité'}
                          </label>
                          {isEditing ? (
                            <select
                              value={formData.nationality}
                              onChange={(e) => handleInputChange('nationality', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            >
                              <option value="Morocco">Morocco</option>
                              <option value="Algeria">Algeria</option>
                              <option value="Tunisia">Tunisia</option>
                              <option value="France">France</option>
                              <option value="Canada">Canada</option>
                            </select>
                          ) : (
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                              <p className="text-gray-900 font-semibold text-lg">{studentData.nationality}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                            {language === 'en' ? 'Phone Number' : 'Numéro de Téléphone'}
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                          ) : (
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                              <p className="text-gray-900 font-semibold text-lg">{studentData.phone}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                            {language === 'en' ? 'Date of Birth' : 'Date de Naissance'}
                          </label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                          ) : (
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                              <p className="text-gray-900 font-semibold text-lg">
                                {new Date(studentData.dateOfBirth).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* My Orders Section */}
                  {activeSection === 'orders' && (
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl">
                          <ShoppingBag className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {language === 'en' ? 'My Orders' : 'Mes Commandes'}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {language === 'en' ? 'Track your service orders and purchases' : 'Suivez vos commandes de services et achats'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {language === 'en' ? 'No orders yet' : 'Aucune commande pour le moment'}
                            </h3>
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                              {language === 'en' ? 'Empty' : 'Vide'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {language === 'en' 
                              ? 'Your service orders will appear here once you make a purchase.'
                              : 'Vos commandes de services apparaîtront ici une fois que vous effectuerez un achat.'
                            }
                          </p>
                          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold">
                            {language === 'en' ? 'Browse Services' : 'Parcourir les Services'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* My Payments Section */}
                  {activeSection === 'payments' && (
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl">
                          <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {language === 'en' ? 'My Payments' : 'Mes Paiements'}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {language === 'en' ? 'View your payment history and manage billing' : 'Consultez votre historique de paiements et gérez la facturation'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {language === 'en' ? 'No payments yet' : 'Aucun paiement pour le moment'}
                            </h3>
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                              {language === 'en' ? 'Empty' : 'Vide'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {language === 'en' 
                              ? 'Your payment history will appear here once you make a purchase.'
                              : 'Votre historique de paiements apparaîtra ici une fois que vous effectuerez un achat.'
                            }
                          </p>
                          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold">
                            {language === 'en' ? 'View Services' : 'Voir les Services'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* My Complaints Section */}
                  {activeSection === 'complaints' && (
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl">
                          <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {language === 'en' ? 'My Complaints' : 'Mes Réclamations'}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {language === 'en' ? 'Submit and track your complaints and feedback' : 'Soumettez et suivez vos réclamations et commentaires'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-gray-50 to-red-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {language === 'en' ? 'No complaints submitted' : 'Aucune réclamation soumise'}
                            </h3>
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                              {language === 'en' ? 'Empty' : 'Vide'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {language === 'en' 
                              ? 'Submit a complaint or feedback if you have any issues with our services.'
                              : 'Soumettez une réclamation ou un commentaire si vous avez des problèmes avec nos services.'
                            }
                          </p>
                          <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 font-semibold">
                            {language === 'en' ? 'Submit Complaint' : 'Soumettre une Réclamation'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FAQ Section */}
                  {activeSection === 'faq' && (
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl">
                          <HelpCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {language === 'en' ? 'Frequently Asked Questions' : 'Questions Fréquemment Posées'}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {language === 'en' ? 'Find answers to common questions about our services' : 'Trouvez des réponses aux questions courantes sur nos services'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {language === 'en' ? 'How do I apply to universities?' : 'Comment postuler aux universités ?'}
                          </h3>
                          <p className="text-gray-600">
                            {language === 'en' 
                              ? 'You can apply directly through our platform by browsing universities and programs, then clicking "Apply Now" on your chosen program.'
                              : 'Vous pouvez postuler directement via notre plateforme en parcourant les universités et programmes, puis en cliquant sur "Postuler Maintenant" sur le programme de votre choix.'
                            }
                          </p>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {language === 'en' ? 'What documents do I need?' : 'Quels documents ai-je besoin ?'}
                          </h3>
                          <p className="text-gray-600">
                            {language === 'en' 
                              ? 'Required documents vary by program and university. Generally, you\'ll need transcripts, language test scores, and a personal statement.'
                              : 'Les documents requis varient selon le programme et l\'université. Généralement, vous aurez besoin de relevés de notes, de scores de tests de langue et d\'une déclaration personnelle.'
                            }
                          </p>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {language === 'en' ? 'How much does it cost?' : 'Combien ça coûte ?'}
                          </h3>
                          <p className="text-gray-600">
                            {language === 'en' 
                              ? 'Our platform is free to use. Universities may charge application fees, and you\'ll need to pay tuition fees if accepted.'
                              : 'Notre plateforme est gratuite à utiliser. Les universités peuvent facturer des frais de candidature, et vous devrez payer les frais de scolarité si vous êtes accepté.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggestions Section */}
                  {activeSection === 'suggestions' && (
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl">
                          <Lightbulb className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {language === 'en' ? 'Suggestions' : 'Suggestions'}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {language === 'en' ? 'Share your ideas to help us improve our platform' : 'Partagez vos idées pour nous aider à améliorer notre plateforme'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <form className="space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                              {language === 'en' ? 'Suggestion Type' : 'Type de Suggestion'}
                            </label>
                            <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                              <option>{language === 'en' ? 'Select type...' : 'Sélectionner le type...'}</option>
                              <option>{language === 'en' ? 'Feature Request' : 'Demande de Fonctionnalité'}</option>
                              <option>{language === 'en' ? 'Bug Report' : 'Rapport de Bug'}</option>
                              <option>{language === 'en' ? 'UI/UX Improvement' : 'Amélioration UI/UX'}</option>
                              <option>{language === 'en' ? 'General Feedback' : 'Commentaire Général'}</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                              {language === 'en' ? 'Your Suggestion' : 'Votre Suggestion'}
                            </label>
                            <textarea 
                              rows={6}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                              placeholder={language === 'en' ? 'Describe your suggestion in detail...' : 'Décrivez votre suggestion en détail...'}
                            />
                          </div>
                          
                          <button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                            {language === 'en' ? 'Submit Suggestion' : 'Soumettre la Suggestion'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Become Ambassador Section */}
                  {activeSection === 'ambassador' && (
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {language === 'en' ? 'Become an Ambassador' : 'Devenir Ambassadeur'}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {language === 'en' ? 'Join our ambassador program and earn rewards' : 'Rejoignez notre programme d\'ambassadeur et gagnez des récompenses'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {language === 'en' ? 'Ambassador Benefits' : 'Avantages d\'Ambassadeur'}
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <span className="text-gray-700">
                                {language === 'en' ? 'Earn 5-20% commission on referrals' : 'Gagnez 5-20% de commission sur les parrainages'}
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <span className="text-gray-700">
                                {language === 'en' ? 'Access to exclusive events' : 'Accès à des événements exclusifs'}
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <span className="text-gray-700">
                                {language === 'en' ? 'Priority support' : 'Support prioritaire'}
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <span className="text-gray-700">
                                {language === 'en' ? 'Marketing materials' : 'Matériel marketing'}
                              </span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {language === 'en' ? 'Requirements' : 'Exigences'}
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                              <span className="text-gray-700">
                                {language === 'en' ? 'Active student or graduate' : 'Étudiant actif ou diplômé'}
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                              <span className="text-gray-700">
                                {language === 'en' ? 'Strong social media presence' : 'Forte présence sur les réseaux sociaux'}
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                              <span className="text-gray-700">
                                {language === 'en' ? 'Passion for education' : 'Passion pour l\'éducation'}
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                              <span className="text-gray-700">
                                {language === 'en' ? 'Good communication skills' : 'Bonnes compétences en communication'}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          {language === 'en' ? 'Apply to Become an Ambassador' : 'Postuler pour Devenir Ambassadeur'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {language === 'en' 
                            ? 'Fill out the form below to apply for our ambassador program. We\'ll review your application and get back to you within 5 business days.'
                            : 'Remplissez le formulaire ci-dessous pour postuler à notre programme d\'ambassadeur. Nous examinerons votre candidature et vous répondrons dans les 5 jours ouvrables.'
                          }
                        </p>
                        
                        <form className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                                {language === 'en' ? 'Social Media Handles' : 'Comptes Réseaux Sociaux'}
                              </label>
                              <input 
                                type="text"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                placeholder={language === 'en' ? '@username' : '@nom_utilisateur'}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                                {language === 'en' ? 'Follower Count' : 'Nombre d\'Abonnés'}
                              </label>
                              <input 
                                type="number"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                placeholder="1000"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                              {language === 'en' ? 'Why do you want to become an ambassador?' : 'Pourquoi voulez-vous devenir ambassadeur ?'}
                            </label>
                            <textarea 
                              rows={4}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                              placeholder={language === 'en' ? 'Tell us about your motivation...' : 'Parlez-nous de votre motivation...'}
                            />
                          </div>
                          
                          <button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                            {language === 'en' ? 'Submit Application' : 'Soumettre la Candidature'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;
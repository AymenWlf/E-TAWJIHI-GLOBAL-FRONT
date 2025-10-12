import React, { useState } from 'react';
import { Search, ChevronDown, Users, Building2, UserCheck, ArrowRight } from 'lucide-react';

const HeroWithSearch = ({ language }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchQuery, setSearchQuery] = useState({
    what: '',
    where: ''
  });

  const content = {
    en: {
      title: "The world's premier higher education network",
      description: "E-TAWJIHI is an innovative student-recruitment platform that helps students study abroad at leading universities, and provides universities with access to a global student market.",
      search: {
        what: "What to study",
        where: "Where to study",
        button: "Search"
      },
      tabs: {
        students: {
          title: "Students",
          description: "Find your study abroad destination, university and program",
          icon: Users
        },
        universities: {
          title: "Universities", 
          description: "Recruit international students for your university",
          icon: Building2
        },
        partners: {
          title: "Partners",
          description: "Earn as you learn and help students, as a student",
          icon: UserCheck
        }
      }
    },
    fr: {
      title: "Le réseau d'enseignement supérieur de premier plan mondial",
      description: "E-TAWJIHI est une plateforme innovante de recrutement d'étudiants qui aide les étudiants à étudier à l'étranger dans les meilleures universités, et fournit aux universités un accès au marché mondial des étudiants.",
      search: {
        what: "Que étudier",
        where: "Où étudier", 
        button: "Rechercher"
      },
      tabs: {
        students: {
          title: "Étudiants",
          description: "Trouvez votre destination d'études à l'étranger, université et programme",
          icon: Users
        },
        universities: {
          title: "Universités",
          description: "Recrutez des étudiants internationaux pour votre université", 
          icon: Building2
        },
        partners: {
          title: "Partenaires",
          description: "Gagnez en apprenant et aidez les étudiants, en tant qu'étudiant",
          icon: UserCheck
        }
      }
    }
  };

  const currentContent = content[language];

  const handleSearch = () => {
    console.log('Searching:', searchQuery);
    // Implement search logic here
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className="pt-16 bg-gradient-to-br from-primary-50 to-secondary-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {currentContent.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                {currentContent.description}
              </p>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={currentContent.search.what}
                      value={searchQuery.what}
                      onChange={(e) => setSearchQuery({...searchQuery, what: e.target.value})}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={currentContent.search.where}
                      value={searchQuery.where}
                      onChange={(e) => setSearchQuery({...searchQuery, where: e.target.value})}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                {currentContent.search.button}
              </button>
            </div>
          </div>

          {/* Right Side - Interactive Tabs */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white rounded-2xl p-2 shadow-lg">
              {Object.entries(currentContent.tabs).map(([key, tab]) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                      : key === 'students' 
                        ? 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                        : key === 'universities'
                        ? 'text-gray-600 hover:text-secondary-600 hover:bg-gray-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden sm:block">{tab.title}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {Object.entries(currentContent.tabs).map(([key, tab]) => (
                <div
                  key={key}
                  className={`p-8 transition-all duration-500 ${
                    activeTab === key ? 'block' : 'hidden'
                  }`}
                >
                  <div className="text-center space-y-6">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto ${
                      key === 'students' 
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                        : key === 'universities'
                        ? 'bg-gradient-to-br from-secondary-500 to-secondary-600'
                        : 'bg-gradient-to-br from-primary-500 to-secondary-500'
                    }`}>
                      <tab.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {tab.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {tab.description}
                      </p>
                    </div>

                    <button className={`group text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto ${
                      key === 'students' 
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700'
                        : key === 'universities'
                        ? 'bg-gradient-to-r from-secondary-600 to-secondary-700'
                        : 'bg-gradient-to-r from-primary-600 to-secondary-600'
                    }`}>
                      {language === 'en' ? 'Get Started' : 'Commencer'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Countries' : 'Pays'}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-secondary-600">10K+</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Programs' : 'Programmes'}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-primary-600">100K+</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Students' : 'Étudiants'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroWithSearch;

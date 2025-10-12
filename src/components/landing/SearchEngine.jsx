import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Globe, ArrowRight, Star, Building2, Users, Award } from 'lucide-react';

const SearchEngine = ({ language }) => {
  const [searchFilters, setSearchFilters] = useState({
    country: '',
    field: '',
    budget: '',
    language: ''
  });

  const content = {
    en: {
      title: "Explore schools & universities worldwide.",
      subtitle: "Find your ideal program by country, budget, or field — and apply directly in a few clicks.",
      cta: "Search Programs",
      note: "10,000+ verified programs from 50+ countries.",
      filters: {
        country: "Country",
        field: "Field of Study",
        budget: "Budget Range",
        language: "Language"
      },
      sampleResults: [
        {
          title: "Computer Science",
          country: "Canada",
          university: "University of Toronto",
          rating: 4.8,
          students: "45,000+",
          flag: "🇨🇦"
        },
        {
          title: "Medicine",
          country: "France",
          university: "Sorbonne University",
          rating: 4.9,
          students: "55,000+",
          flag: "🇫🇷"
        },
        {
          title: "Business Administration",
          country: "Turkey",
          university: "Bogazici University",
          rating: 4.7,
          students: "18,000+",
          flag: "🇹🇷"
        },
        {
          title: "Engineering",
          country: "Germany",
          university: "Technical University of Munich",
          rating: 4.9,
          students: "42,000+",
          flag: "🇩🇪"
        }
      ]
    },
    fr: {
      title: "Explorez les écoles et universités du monde entier.",
      subtitle: "Trouvez votre programme idéal par pays, budget ou domaine — et postulez directement en quelques clics.",
      cta: "Rechercher des Programmes",
      note: "Plus de 10 000 programmes vérifiés dans plus de 50 pays.",
      filters: {
        country: "Pays",
        field: "Domaine d'études",
        budget: "Gamme de budget",
        language: "Langue"
      },
      sampleResults: [
        {
          title: "Informatique",
          country: "Canada",
          university: "Université de Toronto",
          rating: 4.8,
          students: "45 000+",
          flag: "🇨🇦"
        },
        {
          title: "Médecine",
          country: "France",
          university: "Université de la Sorbonne",
          rating: 4.9,
          students: "55 000+",
          flag: "🇫🇷"
        },
        {
          title: "Administration des affaires",
          country: "Turquie",
          university: "Université de Bogazici",
          rating: 4.7,
          students: "18 000+",
          flag: "🇹🇷"
        },
        {
          title: "Ingénierie",
          country: "Allemagne",
          university: "Université technique de Munich",
          rating: 4.9,
          students: "42 000+",
          flag: "🇩🇪"
        }
      ]
    }
  };

  const t = content[language];

  const countries = [
    { value: 'canada', label: '🇨🇦 Canada' },
    { value: 'france', label: '🇫🇷 France' },
    { value: 'germany', label: '🇩🇪 Germany' },
    { value: 'uk', label: '🇬🇧 United Kingdom' },
    { value: 'usa', label: '🇺🇸 United States' },
    { value: 'australia', label: '🇦🇺 Australia' },
    { value: 'turkey', label: '🇹🇷 Turkey' },
    { value: 'spain', label: '🇪🇸 Spain' }
  ];

  const fields = [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'business', label: 'Business Administration' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'arts', label: 'Arts & Humanities' },
    { value: 'law', label: 'Law' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'economics', label: 'Economics' }
  ];

  const budgets = [
    { value: 'low', label: language === 'en' ? 'Under $10,000/year' : 'Moins de 10 000$/an' },
    { value: 'medium', label: language === 'en' ? '$10,000 - $25,000/year' : '10 000$ - 25 000$/an' },
    { value: 'high', label: language === 'en' ? 'Over $25,000/year' : 'Plus de 25 000$/an' }
  ];

  const languages = [
    { value: 'english', label: '🇺🇸 English' },
    { value: 'french', label: '🇫🇷 French' },
    { value: 'german', label: '🇩🇪 German' },
    { value: 'spanish', label: '🇪🇸 Spanish' },
    { value: 'arabic', label: '🇲🇦 Arabic' }
  ];

  const handleSearch = () => {
    // Handle search logic here
    console.log('Searching with filters:', searchFilters);
  };

  return (
    <section id="search" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full mb-6">
            <Search className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Global Search</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {t.subtitle}
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-16">
          {/* Search Filters */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Country Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{t.filters.country}</span>
              </label>
              <select
                value={searchFilters.country}
                onChange={(e) => setSearchFilters({...searchFilters, country: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">{language === 'en' ? 'Select Country' : 'Sélectionner un pays'}</option>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Field Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{t.filters.field}</span>
              </label>
              <select
                value={searchFilters.field}
                onChange={(e) => setSearchFilters({...searchFilters, field: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">{language === 'en' ? 'Select Field' : 'Sélectionner un domaine'}</option>
                {fields.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <DollarSign className="w-4 h-4 text-cyan-600" />
                <span>{t.filters.budget}</span>
              </label>
              <select
                value={searchFilters.budget}
                onChange={(e) => setSearchFilters({...searchFilters, budget: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">{language === 'en' ? 'Select Budget' : 'Sélectionner un budget'}</option>
                {budgets.map((budget) => (
                  <option key={budget.value} value={budget.value}>
                    {budget.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Globe className="w-4 h-4 text-purple-600" />
                <span>{t.filters.language}</span>
              </label>
              <select
                value={searchFilters.language}
                onChange={(e) => setSearchFilters({...searchFilters, language: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">{language === 'en' ? 'Select Language' : 'Sélectionner une langue'}</option>
                {languages.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="text-center">
            <button
              onClick={handleSearch}
              className="group flex items-center space-x-3 px-8 py-4 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mx-auto"
            >
              <Search className="w-6 h-6" />
              <span className="font-semibold text-lg">{t.cta}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Sample Results */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            {language === 'en' ? 'Popular Programs' : 'Programmes populaires'}
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.sampleResults.map((program, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{program.flag}</div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600">{program.rating}</span>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {program.title}
                </h4>
                
                <p className="text-sm text-gray-600 mb-2">{program.university}</p>
                <p className="text-sm text-gray-500 mb-4">{program.country}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>{program.students}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    {language === 'en' ? 'View Details' : 'Voir détails'} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
            <Award className="w-5 h-5 text-emerald-600" />
            <span className="text-gray-700 font-medium">{t.note}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">10K+</div>
            <div className="text-sm text-gray-600">Programs</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">50+</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">100K+</div>
            <div className="text-sm text-gray-600">Students</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">500+</div>
            <div className="text-sm text-gray-600">Universities</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchEngine;

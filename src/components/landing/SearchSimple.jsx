import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, BookOpen, DollarSign, Clock, ArrowRight, Filter } from 'lucide-react';

const SearchSimple = ({ language }) => {
  const [filters, setFilters] = useState({
    country: '',
    domain: '',
    language: '',
    tuition: '',
    duration: ''
  });

  const content = {
    en: {
      title: "Explore schools & universities worldwide",
      subtitle: "Find the perfect program that matches your goals and budget",
      cta: "Find my program",
      searchPlaceholder: "Search programs, universities, or countries...",
      filters: {
        country: "Country",
        domain: "Field of Study",
        language: "Language",
        tuition: "Tuition Range",
        duration: "Duration"
      },
      countries: ["All Countries", "Germany", "France", "Netherlands", "Sweden", "Canada", "Australia", "UK", "USA"],
      domains: ["All Fields", "Computer Science", "Engineering", "Business", "Medicine", "Arts", "Sciences", "Law"],
      languages: ["All Languages", "English", "French", "German", "Spanish", "Italian"],
      tuitionRanges: ["All Ranges", "Free", "Under €5,000", "€5,000 - €15,000", "€15,000 - €30,000", "Above €30,000"],
      durations: ["All Durations", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"]
    },
    fr: {
      title: "Explorez les écoles et universités du monde entier",
      subtitle: "Trouvez le programme parfait qui correspond à vos objectifs et votre budget",
      cta: "Trouver mon programme",
      searchPlaceholder: "Rechercher programmes, universités ou pays...",
      filters: {
        country: "Pays",
        domain: "Domaine d'études",
        language: "Langue",
        tuition: "Fourchette de frais",
        duration: "Durée"
      },
      countries: ["Tous les pays", "Allemagne", "France", "Pays-Bas", "Suède", "Canada", "Australie", "Royaume-Uni", "États-Unis"],
      domains: ["Tous les domaines", "Informatique", "Ingénierie", "Commerce", "Médecine", "Arts", "Sciences", "Droit"],
      languages: ["Toutes les langues", "Anglais", "Français", "Allemand", "Espagnol", "Italien"],
      tuitionRanges: ["Toutes les fourchettes", "Gratuit", "Moins de 5 000€", "5 000€ - 15 000€", "15 000€ - 30 000€", "Plus de 30 000€"],
      durations: ["Toutes les durées", "1 an", "2 ans", "3 ans", "4 ans", "5+ ans"]
    }
  };

  const currentContent = content[language];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
  };

  const FilterDropdown = ({ type, options, icon: Icon }) => (
    <div className="relative">
      <select
        value={filters[type]}
        onChange={(e) => handleFilterChange(type, e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <section id="search" className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder={currentContent.searchPlaceholder}
              className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'en' ? 'Filter by' : 'Filtrer par'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.filters.country}
              </label>
              <FilterDropdown
                type="country"
                options={currentContent.countries}
                icon={MapPin}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.filters.domain}
              </label>
              <FilterDropdown
                type="domain"
                options={currentContent.domains}
                icon={BookOpen}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.filters.language}
              </label>
              <FilterDropdown
                type="language"
                options={currentContent.languages}
                icon={BookOpen}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.filters.tuition}
              </label>
              <FilterDropdown
                type="tuition"
                options={currentContent.tuitionRanges}
                icon={DollarSign}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.filters.duration}
              </label>
              <FilterDropdown
                type="duration"
                options={currentContent.durations}
                icon={Clock}
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleSearch}
            className="group bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-12 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            {currentContent.cta}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Sample Results Preview */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {language === 'en' ? 'Popular Programs' : 'Programmes Populaires'}
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                university: language === 'en' ? 'TU Munich' : 'TU Munich',
                program: language === 'en' ? 'Computer Science' : 'Informatique',
                country: '🇩🇪 Germany',
                duration: language === 'en' ? '2 years' : '2 ans',
                tuition: language === 'en' ? 'Free' : 'Gratuit'
              },
              {
                university: language === 'en' ? 'Sorbonne University' : 'Université Sorbonne',
                program: language === 'en' ? 'Business Administration' : 'Administration des Affaires',
                country: '🇫🇷 France',
                duration: language === 'en' ? '3 years' : '3 ans',
                tuition: '€3,000/year'
              },
              {
                university: language === 'en' ? 'University of Toronto' : 'Université de Toronto',
                program: language === 'en' ? 'Engineering' : 'Ingénierie',
                country: '🇨🇦 Canada',
                duration: language === 'en' ? '4 years' : '4 ans',
                tuition: 'CAD $15,000/year'
              }
            ].map((program, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-2">{program.university}</h4>
                <p className="text-blue-600 font-semibold mb-3">{program.program}</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{program.country}</p>
                  <p>{program.duration}</p>
                  <p className="font-semibold text-green-600">{program.tuition}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSimple;

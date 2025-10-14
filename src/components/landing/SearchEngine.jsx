import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, DollarSign, Globe, ArrowRight, Star, Building2, Users, Award, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchEngine = ({ language }) => {
  const [searchFilters, setSearchFilters] = useState({
    country: '',
    field: '',
    intakes: '',
    degree: ''
  });

  const [searchInputs, setSearchInputs] = useState({
    country: '',
    field: '',
    intakes: '',
    degree: ''
  });

  const [showDropdowns, setShowDropdowns] = useState({
    country: false,
    field: false,
    intakes: false,
    degree: false
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
        intakes: "Intakes",
        degree: "Degree Level"
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
        intakes: "Rentrées",
        degree: "Niveau de Diplôme"
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
    { value: 'netherlands', label: '🇳🇱 Netherlands' },
    { value: 'sweden', label: '🇸🇪 Sweden' },
    { value: 'norway', label: '🇳🇴 Norway' },
    { value: 'denmark', label: '🇩🇰 Denmark' },
    { value: 'switzerland', label: '🇨🇭 Switzerland' },
    { value: 'austria', label: '🇦🇹 Austria' },
    { value: 'belgium', label: '🇧🇪 Belgium' },
    { value: 'italy', label: '🇮🇹 Italy' },
    { value: 'spain', label: '🇪🇸 Spain' },
    { value: 'portugal', label: '🇵🇹 Portugal' },
    { value: 'ireland', label: '🇮🇪 Ireland' },
    { value: 'finland', label: '🇫🇮 Finland' },
    { value: 'turkey', label: '🇹🇷 Turkey' },
    { value: 'japan', label: '🇯🇵 Japan' },
    { value: 'south-korea', label: '🇰🇷 South Korea' },
    { value: 'singapore', label: '🇸🇬 Singapore' },
    { value: 'malaysia', label: '🇲🇾 Malaysia' },
    { value: 'new-zealand', label: '🇳🇿 New Zealand' }
  ];

  const fieldsOfStudy = [
    { value: 'computer-science', label: language === 'en' ? 'Computer Science' : 'Informatique' },
    { value: 'business', label: language === 'en' ? 'Business Administration' : 'Administration des Affaires' },
    { value: 'engineering', label: language === 'en' ? 'Engineering' : 'Ingénierie' },
    { value: 'medicine', label: language === 'en' ? 'Medicine' : 'Médecine' },
    { value: 'law', label: language === 'en' ? 'Law' : 'Droit' },
    { value: 'psychology', label: language === 'en' ? 'Psychology' : 'Psychologie' },
    { value: 'economics', label: language === 'en' ? 'Economics' : 'Économie' },
    { value: 'international-relations', label: language === 'en' ? 'International Relations' : 'Relations Internationales' },
    { value: 'architecture', label: language === 'en' ? 'Architecture' : 'Architecture' },
    { value: 'design', label: language === 'en' ? 'Design' : 'Design' },
    { value: 'art', label: language === 'en' ? 'Art & Design' : 'Art et Design' },
    { value: 'music', label: language === 'en' ? 'Music' : 'Musique' },
    { value: 'literature', label: language === 'en' ? 'Literature' : 'Littérature' },
    { value: 'history', label: language === 'en' ? 'History' : 'Histoire' },
    { value: 'philosophy', label: language === 'en' ? 'Philosophy' : 'Philosophie' },
    { value: 'mathematics', label: language === 'en' ? 'Mathematics' : 'Mathématiques' },
    { value: 'physics', label: language === 'en' ? 'Physics' : 'Physique' },
    { value: 'chemistry', label: language === 'en' ? 'Chemistry' : 'Chimie' },
    { value: 'biology', label: language === 'en' ? 'Biology' : 'Biologie' },
    { value: 'environmental', label: language === 'en' ? 'Environmental Science' : 'Sciences de l\'Environnement' },
    { value: 'agriculture', label: language === 'en' ? 'Agriculture' : 'Agriculture' },
    { value: 'education', label: language === 'en' ? 'Education' : 'Éducation' },
    { value: 'social-work', label: language === 'en' ? 'Social Work' : 'Travail Social' },
    { value: 'nursing', label: language === 'en' ? 'Nursing' : 'Infirmière' },
    { value: 'pharmacy', label: language === 'en' ? 'Pharmacy' : 'Pharmacie' },
    { value: 'dentistry', label: language === 'en' ? 'Dentistry' : 'Dentisterie' },
    { value: 'veterinary', label: language === 'en' ? 'Veterinary' : 'Médecine Vétérinaire' },
    { value: 'journalism', label: language === 'en' ? 'Journalism' : 'Journalisme' },
    { value: 'communication', label: language === 'en' ? 'Communication' : 'Communication' },
    { value: 'marketing', label: language === 'en' ? 'Marketing' : 'Marketing' },
    { value: 'finance', label: language === 'en' ? 'Finance' : 'Finance' },
    { value: 'accounting', label: language === 'en' ? 'Accounting' : 'Comptabilité' },
    { value: 'management', label: language === 'en' ? 'Management' : 'Management' }
  ];

  // Génération dynamique des intakes basée sur la date actuelle
  const generateIntakes = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    
    const intakes = [];
    
    // Déterminer l'année académique en cours
    // Si on est entre septembre et décembre, on est dans l'année académique en cours
    // Sinon, on est dans l'année académique suivante
    let academicYear = currentYear;
    if (currentMonth >= 9) {
      academicYear = currentYear;
    } else {
      academicYear = currentYear - 1;
    }
    
    // Générer les intakes pour l'année académique en cours et la suivante
    const months = [
      { num: 9, en: 'September', fr: 'Septembre' },
      { num: 10, en: 'October', fr: 'Octobre' },
      { num: 11, en: 'November', fr: 'Novembre' },
      { num: 12, en: 'December', fr: 'Décembre' },
      { num: 1, en: 'January', fr: 'Janvier' },
      { num: 2, en: 'February', fr: 'Février' },
      { num: 3, en: 'March', fr: 'Mars' },
      { num: 4, en: 'April', fr: 'Avril' },
      { num: 5, en: 'May', fr: 'Mai' },
      { num: 6, en: 'June', fr: 'Juin' },
      { num: 7, en: 'July', fr: 'Juillet' },
      { num: 8, en: 'August', fr: 'Août' }
    ];
    
    // Ajouter les intakes de l'année académique en cours (septembre à août)
    months.forEach(month => {
      let year = academicYear;
      if (month.num >= 1 && month.num <= 8) {
        year = academicYear + 1; // Janvier à août de l'année suivante
      }
      
      const value = `${month.en.toLowerCase()}-${year}`;
      const label = language === 'en' 
        ? `${month.en} ${year}` 
        : `${month.fr} ${year}`;
      
      intakes.push({ value, label });
    });
    
    // Ajouter les intakes de l'année académique suivante
    months.forEach(month => {
      let year = academicYear + 1;
      if (month.num >= 1 && month.num <= 8) {
        year = academicYear + 2; // Janvier à août de l'année suivante
      }
      
      const value = `${month.en.toLowerCase()}-${year}`;
      const label = language === 'en' 
        ? `${month.en} ${year}` 
        : `${month.fr} ${year}`;
      
      intakes.push({ value, label });
    });
    
    return intakes;
  };

  const intakes = generateIntakes();

  const degrees = [
    { value: 'bachelor', label: language === 'en' ? 'Bachelor\'s Degree' : 'Licence' },
    { value: 'master', label: language === 'en' ? 'Master\'s Degree' : 'Master' },
    { value: 'phd', label: language === 'en' ? 'PhD/Doctorate' : 'Doctorat' },
    { value: 'associate', label: language === 'en' ? 'Associate Degree' : 'Diplôme d\'Associé' },
    { value: 'diploma', label: language === 'en' ? 'Diploma' : 'Diplôme' },
    { value: 'certificate', label: language === 'en' ? 'Certificate' : 'Certificat' },
    { value: 'postgraduate-diploma', label: language === 'en' ? 'Postgraduate Diploma' : 'Diplôme Postgrade' },
    { value: 'foundation', label: language === 'en' ? 'Foundation Year' : 'Année Préparatoire' },
    { value: 'pre-master', label: language === 'en' ? 'Pre-Master\'s' : 'Pré-Master' },
    { value: 'mba', label: 'MBA' },
    { value: 'llm', label: 'LLM' },
    { value: 'msc', label: 'MSc' },
    { value: 'ma', label: 'MA' },
    { value: 'bsc', label: 'BSc' },
    { value: 'ba', label: 'BA' },
    { value: 'beng', label: 'BEng' },
    { value: 'meng', label: 'MEng' }
  ];


  const handleSearch = () => {
    // Handle search logic here
    console.log('Searching with filters:', searchFilters);
  };

  const handleInputChange = (field, value) => {
    setSearchInputs(prev => ({ ...prev, [field]: value }));
    // Fermer tous les autres dropdowns et ouvrir celui-ci
    setShowDropdowns({
      country: field === 'country',
      field: field === 'field',
      intakes: field === 'intakes',
      degree: field === 'degree'
    });
  };

  const handleOptionSelect = (field, value, label) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
    setSearchInputs(prev => ({ ...prev, [field]: label }));
    setShowDropdowns(prev => ({ ...prev, [field]: false }));
  };

  const filterOptions = (options, searchTerm) => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.searchable-input')) {
        setShowDropdowns({
          country: false,
          field: false,
          intakes: false,
          degree: false
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mettre à jour les labels des inputs quand la langue change
  useEffect(() => {
    const updateInputLabels = () => {
      const newInputs = { ...searchInputs };
      
      // Mettre à jour le label du pays si un pays est sélectionné
      if (searchFilters.country) {
        const selectedCountry = countries.find(c => c.value === searchFilters.country);
        if (selectedCountry) {
          newInputs.country = selectedCountry.label;
        }
      }
      
      // Mettre à jour le label du domaine si un domaine est sélectionné
      if (searchFilters.field) {
        const selectedField = fieldsOfStudy.find(f => f.value === searchFilters.field);
        if (selectedField) {
          newInputs.field = selectedField.label;
        }
      }
      
      // Mettre à jour le label de la rentrée si une rentrée est sélectionnée
      if (searchFilters.intakes) {
        const selectedIntake = intakes.find(i => i.value === searchFilters.intakes);
        if (selectedIntake) {
          newInputs.intakes = selectedIntake.label;
        }
      }
      
      // Mettre à jour le label du diplôme si un diplôme est sélectionné
      if (searchFilters.degree) {
        const selectedDegree = degrees.find(d => d.value === searchFilters.degree);
        if (selectedDegree) {
          newInputs.degree = selectedDegree.label;
        }
      }
      
      setSearchInputs(newInputs);
    };

    updateInputLabels();
  }, [language, searchFilters]);

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
            <div className="space-y-2 relative searchable-input">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{t.filters.country}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchInputs.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  onFocus={() => setShowDropdowns({
                    country: true,
                    field: false,
                    intakes: false,
                    degree: false
                  })}
                  placeholder={language === 'en' ? 'Search countries...' : 'Rechercher des pays...'}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {showDropdowns.country && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filterOptions(countries, searchInputs.country).map((country) => (
                      <div
                        key={country.value}
                        onClick={() => handleOptionSelect('country', country.value, country.label)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        {country.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Field Filter */}
            <div className="space-y-2 relative searchable-input">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{t.filters.field}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchInputs.field}
                  onChange={(e) => handleInputChange('field', e.target.value)}
                  onFocus={() => setShowDropdowns({
                    country: false,
                    field: true,
                    intakes: false,
                    degree: false
                  })}
                  placeholder={language === 'en' ? 'Search fields...' : 'Rechercher des domaines...'}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {showDropdowns.field && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filterOptions(fieldsOfStudy, searchInputs.field).map((field) => (
                      <div
                        key={field.value}
                        onClick={() => handleOptionSelect('field', field.value, field.label)}
                        className="px-4 py-3 hover:bg-emerald-50 cursor-pointer transition-colors"
                      >
                        {field.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Intakes Filter */}
            <div className="space-y-2 relative searchable-input">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Award className="w-4 h-4 text-cyan-600" />
                <span>{t.filters.intakes}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchInputs.intakes}
                  onChange={(e) => handleInputChange('intakes', e.target.value)}
                  onFocus={() => setShowDropdowns({
                    country: false,
                    field: false,
                    intakes: true,
                    degree: false
                  })}
                  placeholder={language === 'en' ? 'Search intakes...' : 'Rechercher des rentrées...'}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {showDropdowns.intakes && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filterOptions(intakes, searchInputs.intakes).map((intake) => (
                      <div
                        key={intake.value}
                        onClick={() => handleOptionSelect('intakes', intake.value, intake.label)}
                        className="px-4 py-3 hover:bg-cyan-50 cursor-pointer transition-colors"
                      >
                        {intake.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Degree Filter */}
            <div className="space-y-2 relative searchable-input">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Award className="w-4 h-4 text-purple-600" />
                <span>{t.filters.degree}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchInputs.degree}
                  onChange={(e) => handleInputChange('degree', e.target.value)}
                  onFocus={() => setShowDropdowns({
                    country: false,
                    field: false,
                    intakes: false,
                    degree: true
                  })}
                  placeholder={language === 'en' ? 'Search degrees...' : 'Rechercher des diplômes...'}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {showDropdowns.degree && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filterOptions(degrees, searchInputs.degree).map((degree) => (
                      <div
                        key={degree.value}
                        onClick={() => handleOptionSelect('degree', degree.value, degree.label)}
                        className="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors"
                      >
                        {degree.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="text-center space-y-4">
            <button
              onClick={handleSearch}
              className="group flex items-center space-x-3 px-8 py-4 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mx-auto"
            >
              <Search className="w-6 h-6" />
              <span className="font-semibold text-lg">{t.cta}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Link to Establishments Listing */}
            <div>
              <Link
                to="/establishments"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <Building2 className="w-4 h-4" />
                <span>{language === 'en' ? 'Browse All Establishments' : 'Parcourir tous les établissements'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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

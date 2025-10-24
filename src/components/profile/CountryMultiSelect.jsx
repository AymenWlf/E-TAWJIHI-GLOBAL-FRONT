import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { useAllParameters } from '../../hooks/useAllParameters';


const CountryMultiSelect = ({ 
  value = [], 
  onChange, 
  placeholder, 
  language = 'en', 
  className = '',
  maxSelections = 5 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectorRef = useRef(null);
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();

  // Map countries from parameters
  const getCountryOptions = () => {
    if (!allParams?.countries) return [];
    return allParams.countries.map(country => ({
      code: country.code,
      name: language === 'fr' ? (country.labelFr || country.labelEn) : country.labelEn,
      flag: getLanguageFlag(country.code)
    }));
  };

  // Get language flag for country
  const getLanguageFlag = (countryCode) => {
    const flagMap = {
      'US': '🇺🇸', 'FR': '🇫🇷', 'CA': '🇨🇦', 'GB': '🇬🇧', 'DE': '🇩🇪',
      'ES': '🇪🇸', 'IT': '🇮🇹', 'PT': '🇵🇹', 'MA': '🇲🇦', 'DZ': '🇩🇿',
      'TN': '🇹🇳', 'EG': '🇪🇬', 'AU': '🇦🇺', 'JP': '🇯🇵', 'KR': '🇰🇷',
      'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷', 'MX': '🇲🇽', 'AR': '🇦🇷'
    };
    return flagMap[countryCode] || '🌐';
  };

  const countryOptions = getCountryOptions();
  const filteredCountries = countryOptions.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country) => {
    if (value.length >= maxSelections && !value.find(c => c.code === country.code)) {
      return; // Max selections reached
    }
    
    const isSelected = value.find(c => c.code === country.code);
    if (isSelected) {
      onChange(value.filter(c => c.code !== country.code));
    } else {
      onChange([...value, country]);
    }
  };

  const handleRemove = (countryCode) => {
    onChange(value.filter(c => c.code !== countryCode));
  };

  const handleClear = () => {
    onChange([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = {
    selectCountries: language === 'en' ? 'Select Countries' : 'Sélectionner des Pays',
    searchCountries: language === 'en' ? 'Search countries...' : 'Rechercher des pays...',
    noResults: language === 'en' ? 'No countries found' : 'Aucun pays trouvé',
    maxSelections: language === 'en' ? `Maximum ${maxSelections} selections` : `Maximum ${maxSelections} sélections`,
    clearAll: language === 'en' ? 'Clear All' : 'Tout Effacer'
  };

  return (
    <div className={`relative ${className}`} ref={selectorRef}>
      {/* Selected Countries Display */}
      {value.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((country) => (
            <div
              key={country.code}
              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <span className="mr-2">{country.flag}</span>
              <span>{country.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(country.code)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              {t.clearAll}
            </button>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder || t.selectCountries}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Max Selections Warning */}
      {value.length >= maxSelections && (
        <p className="text-xs text-amber-600 mt-1">
          {t.maxSelections}
        </p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => {
              const isSelected = value.find(c => c.code === country.code);
              const isDisabled = value.length >= maxSelections && !isSelected;
              
              return (
                <div
                  key={country.code}
                  className={`px-4 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 text-blue-700' 
                      : isDisabled 
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => !isDisabled && handleSelect(country)}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="px-4 py-2 text-gray-500">
              {t.noResults}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountryMultiSelect;

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check, BookOpen } from 'lucide-react';
import { useAllParameters } from '../../hooks/useAllParameters';

const FieldMultiSelect = ({ 
  value = [], 
  onChange, 
  placeholder, 
  language = 'en', 
  className = '',
  maxSelections = 10 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectorRef = useRef(null);

  // Load categories and fields from centralized parameters
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();

  useEffect(() => {
    if (allParams) {
      setLoading(true);
      setCategories(allParams.fieldCategories || []);
      setFields(allParams.fields || []);
      setLoading(false);
    }
  }, [allParams]);

  const categoryOptions = ['All', ...categories.map(cat => cat.code)];

  const filteredFields = fields.filter(field => {
    const matchesSearch = field.labelEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.labelFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || field.parentCode === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (field) => {
    if (value.length >= maxSelections && !value.find(f => f.code === field.code)) {
      return; // Max selections reached
    }
    
    const isSelected = value.find(f => f.code === field.code);
    if (isSelected) {
      onChange(value.filter(f => f.code !== field.code));
    } else {
      onChange([...value, field]);
    }
  };

  const handleRemove = (fieldCode) => {
    onChange(value.filter(f => f.code !== fieldCode));
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

  const getCategoryLabel = (categoryCode) => {
    const category = categories.find(cat => cat.code === categoryCode);
    return category ? (language === 'fr' ? category.labelFr : category.labelEn) : categoryCode;
  };

  const getFieldLabel = (field) => {
    return language === 'fr' ? field.labelFr : field.labelEn;
  };

  const getFieldDescription = (field) => {
    return language === 'fr' ? field.descriptionFr : field.descriptionEn;
  };

  return (
    <div className={`relative ${className}`} ref={selectorRef}>
      {/* Selected Fields Display */}
      <div className="min-h-[40px] border border-gray-300 rounded-lg p-2 flex flex-wrap gap-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {value.length === 0 ? (
          <span className="text-gray-500 text-sm">{placeholder}</span>
        ) : (
          value.map(field => (
            <span key={field.code} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {getFieldLabel(field)}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(field.code);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
        <div className="ml-auto flex items-center">
          {value.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search and Category Filter */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search fields...' : 'Rechercher des domaines...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {categoryOptions.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'All' ? (language === 'en' ? 'All Categories' : 'Toutes les Catégories') : getCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Fields List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                {language === 'en' ? 'Loading...' : 'Chargement...'}
              </div>
            ) : filteredFields.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {language === 'en' ? 'No fields found' : 'Aucun domaine trouvé'}
              </div>
            ) : (
              filteredFields.map(field => {
                const isSelected = value.find(f => f.code === field.code);
                const categoryLabel = getCategoryLabel(field.parentCode);
                
                return (
                  <div
                    key={field.code}
                    onClick={() => handleSelect(field)}
                    className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-sm">{getFieldLabel(field)}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {categoryLabel}
                          </span>
                        </div>
                        {getFieldDescription(field) && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {getFieldDescription(field)}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selection Info */}
          {value.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {value.length} {language === 'en' ? 'selected' : 'sélectionné(s)'}
                  {maxSelections && ` / ${maxSelections} max`}
                </span>
                <button
                  onClick={handleClear}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {language === 'en' ? 'Clear all' : 'Tout effacer'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldMultiSelect;

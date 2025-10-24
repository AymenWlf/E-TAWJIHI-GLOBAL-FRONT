import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search, Check } from 'lucide-react';

const MultiSelectSearchable = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Sélectionner...",
  searchPlaceholder = "Rechercher...",
  label = "",
  maxHeight = "200px",
  allowCreate = false,
  createLabel = "Créer"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if search term matches any existing option
  const hasExactMatch = options.some(option => 
    option.label.toLowerCase() === searchTerm.toLowerCase() ||
    option.value.toLowerCase() === searchTerm.toLowerCase()
  );

  // Check if search term is already selected
  const isAlreadySelected = value.some(v => {
    // Si v est un string (code), comparer directement
    if (typeof v === 'string') {
      return v.toLowerCase() === searchTerm.toLowerCase();
    }
    // Si v est un objet, comparer label et value
    return (v.label && v.label.toLowerCase() === searchTerm.toLowerCase()) ||
           (v.value && v.value.toLowerCase() === searchTerm.toLowerCase());
  });

  const handleToggleOption = (option) => {
    const isSelected = value.some(v => {
      // Si v est un string (code), comparer directement
      if (typeof v === 'string') {
        return v === option.value;
      }
      // Si v est un objet, comparer la propriété value
      return v.value === option.value;
    });
    let newValue;
    
    if (isSelected) {
      newValue = value.filter(v => {
        // Si v est un string (code), comparer directement
        if (typeof v === 'string') {
          return v !== option.value;
        }
        // Si v est un objet, comparer la propriété value
        return v.value !== option.value;
      });
    } else {
      newValue = [...value, option];
    }
    
    onChange(newValue);
  };

  const handleRemoveOption = (optionToRemove) => {
    const newValue = value.filter(v => {
      // Si v est un string (code), comparer directement
      if (typeof v === 'string') {
        return v !== optionToRemove.value;
      }
      // Si v est un objet, comparer la propriété value
      return v.value !== optionToRemove.value;
    });
    onChange(newValue);
  };

  const handleCreateOption = () => {
    if (searchTerm.trim() && !hasExactMatch && !isAlreadySelected) {
      const newOption = {
        value: searchTerm.trim(),
        label: searchTerm.trim()
      };
      const newValue = [...value, newOption];
      onChange(newValue);
      setSearchTerm('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && allowCreate && searchTerm.trim() && !hasExactMatch && !isAlreadySelected) {
      e.preventDefault();
      handleCreateOption();
    }
  };

  const getSelectedLabels = () => {
    return value.map(v => {
      // Si v est un string (code), trouver le label correspondant dans les options
      if (typeof v === 'string') {
        const option = options.find(opt => opt.value === v);
        return option ? option.label : v;
      }
      // Si v est un objet, utiliser le label
      return v.label;
    }).join(', ');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Selected Values Display */}
      <div
        className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 flex flex-wrap gap-1">
            {value.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              <>
                {value.map((option) => {
                  // Si option est un string (code), trouver le label correspondant
                  const displayLabel = typeof option === 'string' 
                    ? (options.find(opt => opt.value === option)?.label || option)
                    : option.label;
                  const optionValue = typeof option === 'string' ? option : option.value;
                  
                  return (
                    <span
                      key={optionValue}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {displayLabel}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveOption({ value: optionValue });
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Options List */}
          <div 
            className="max-h-48 overflow-y-auto"
            style={{ maxHeight }}
          >
            {/* Create new option */}
            {allowCreate && searchTerm.trim() && !hasExactMatch && !isAlreadySelected && (
              <div
                className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                onClick={handleCreateOption}
              >
                <div className="flex items-center flex-1">
                  <span className="text-sm text-blue-600 font-medium">
                    {createLabel} "{searchTerm.trim()}"
                  </span>
                </div>
                <span className="text-xs text-blue-500">Appuyez sur Entrée</span>
              </div>
            )}

            {filteredOptions.length === 0 && (!allowCreate || !searchTerm.trim() || hasExactMatch || isAlreadySelected) ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                {allowCreate && searchTerm.trim() ? 'Aucun résultat trouvé' : 'Aucune option disponible'}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.some(v => v.value === option.value);
                return (
                  <div
                    key={option.value}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleToggleOption(option)}
                  >
                    <div className="flex items-center flex-1">
                      {option.flag && (
                        <span className="mr-2 text-lg">{option.flag}</span>
                      )}
                      <span className="text-sm text-gray-900">{option.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {value.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => onChange([])}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Tout désélectionner
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectSearchable;

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

const MultiSelect = ({ 
  options = [], 
  value = [], 
  onChange, 
  placeholder = 'Select options...', 
  searchPlaceholder = 'Search...',
  className = '',
  allowCreate = false,
  createLabel = 'Create',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (!disabled) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [disabled]);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if search term matches any existing option
  const hasExactMatch = options.some(option => 
    option.label.toLowerCase() === searchTerm.toLowerCase()
  );

  // Check if we should show create option
  const shouldShowCreate = allowCreate && searchTerm && !hasExactMatch && searchTerm.trim() !== '';

  // Handle option toggle
  const handleOptionToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  // Handle create new option
  const handleCreateOption = () => {
    if (searchTerm.trim()) {
      const newValue = searchTerm.trim();
      const newValueList = [...value, newValue];
      onChange(newValueList);
      setSearchTerm('');
    }
  };

  // Handle remove selected option
  const handleRemoveOption = (optionValue) => {
    const newValue = value.filter(v => v !== optionValue);
    onChange(newValue);
  };

  // Clear all selections
  const handleClearAll = () => {
    onChange([]);
  };

  // Get selected options labels
  const selectedLabels = value.map(val => 
    options.find(opt => opt.value === val)?.label || val
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected values display */}
      <div
        className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[48px] flex items-center flex-wrap gap-2 ${
          disabled 
            ? 'bg-white cursor-not-allowed' 
            : 'bg-white cursor-pointer'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedLabels.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedLabels.map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
              >
                {label}
                {!disabled && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveOption(value[index]);
                    }}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {selectedLabels.length > 1 && !disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
                className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1"
              >
                Clear all
              </button>
            )}
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        {!disabled && (
          <ChevronDown className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleOptionToggle(option.value)}
                  >
                    <span className="text-sm text-gray-900">{option.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            )}
            
            {/* Create new option */}
            {shouldShowCreate && (
              <div
                className="flex items-center p-3 hover:bg-green-50 cursor-pointer border-t border-gray-100"
                onClick={handleCreateOption}
              >
                <span className="text-sm text-green-600 font-medium">
                  {createLabel} "{searchTerm}"
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

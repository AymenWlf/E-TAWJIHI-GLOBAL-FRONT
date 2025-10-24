import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Phone, Search } from 'lucide-react';
import { COUNTRIES, getCountryByCode } from '../../data/countries';

interface PhoneInputProps {
  value: string;
  onChange: (value: string, countryCode: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter phone number',
  disabled = false,
  className = '',
  label
}) => {
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(() => {
    // Try to detect country from existing value
    if (value && value.startsWith('+')) {
      const phoneCode = value.substring(0, 4); // Get first 4 characters for country code
      const country = COUNTRIES.find(c => value.startsWith(c.phoneCode));
      return country || COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0];
    }
    return COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0];
  });
  const [phoneNumber, setPhoneNumber] = useState(() => {
    // Extract phone number without country code
    if (value && value.startsWith('+')) {
      const country = COUNTRIES.find(c => value.startsWith(c.phoneCode));
      if (country) {
        return value.substring(country.phoneCode.length);
      }
    }
    return value || '';
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsCountryOpen(false);
    setCountrySearchTerm('');
    // Update the full phone number with new country code
    const fullNumber = phoneNumber ? `${country.phoneCode}${phoneNumber}` : '';
    onChange(fullNumber, country.code);
  };

  // Filter countries based on search term
  const filteredCountries = countrySearchTerm
    ? COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
        country.nameFr.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
        country.phoneCode.includes(countrySearchTerm)
      )
    : COUNTRIES;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setPhoneNumber(inputValue);
    const fullNumber = inputValue ? `${selectedCountry.phoneCode}${inputValue}` : '';
    onChange(fullNumber, selectedCountry.code);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsCountryOpen(false);
      setCountrySearchTerm('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCountryOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isCountryOpen]);

  // Parse existing value when component mounts or value changes externally
  useEffect(() => {
    if (value && value !== `${selectedCountry.phoneCode}${phoneNumber}`) {
      const country = COUNTRIES.find(c => value.startsWith(c.phoneCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.substring(country.phoneCode.length));
      }
    }
  }, [value]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="flex">
        {/* Country Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsCountryOpen(!isCountryOpen)}
            disabled={disabled}
            className={`
              flex items-center space-x-2 px-3 py-3 border border-r-0 border-gray-300 rounded-l-xl
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400 cursor-pointer'}
              ${isCountryOpen ? 'border-blue-500 ring-2 ring-blue-200' : ''}
            `}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700">
              {selectedCountry.phoneCode}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCountryOpen && (
            <div className="absolute z-50 w-80 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search countries..."
                    value={countrySearchTerm}
                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              
              {/* Countries List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.length === 0 ? (
                  <div className="p-3 text-gray-500 text-center text-sm">
                    No countries found
                  </div>
                ) : (
                  filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      className="p-3 cursor-pointer flex items-center space-x-3 hover:bg-gray-50"
                      onClick={() => handleCountrySelect(country)}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{country.name}</div>
                        <div className="text-xs text-gray-500">{country.phoneCode}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white hover:border-gray-400'}
              ${isCountryOpen ? 'border-blue-500 ring-2 ring-blue-200' : ''}
            `}
          />
          <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default PhoneInput;

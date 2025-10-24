import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  className = '', 
  showLabel = true,
  size = 'md'
}) => {
  const { userCurrency, setUserCurrency, supportedCurrencies, isLoading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  const selectedCurrency = supportedCurrencies.find(c => c.code === userCurrency);

  const handleCurrencyChange = (currencyCode: string) => {
    setUserCurrency(currencyCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Devise préférée
        </label>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className={`
            w-full flex items-center justify-between 
            ${sizeClasses[size]}
            border border-gray-300 rounded-lg 
            bg-white hover:bg-gray-50 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="font-medium">
              {selectedCurrency?.symbol} {selectedCurrency?.code}
            </span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <>
            {/* Overlay pour fermer le dropdown */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              {supportedCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency.code)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 text-left
                    hover:bg-gray-50 transition-colors duration-150
                    ${currency.code === userCurrency ? 'bg-blue-50' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{currency.symbol}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {currency.code}
                      </div>
                      <div className="text-sm text-gray-500">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                  {currency.code === userCurrency && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {isLoading && (
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
          Conversion en cours...
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;

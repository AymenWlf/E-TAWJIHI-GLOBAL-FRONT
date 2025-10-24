import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import currencyService from '../services/currencyService';

interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
}

interface CurrencyContextType {
  userCurrency: string;
  setUserCurrency: (currency: string) => void;
  convertPrice: (amount: number, fromCurrency: string) => Promise<CurrencyConversion | null>;
  formatPrice: (amount: number, currency: string, showOriginal?: boolean) => Promise<string>;
  getCountryCurrency: (country: string) => string;
  supportedCurrencies: Array<{code: string, name: string, symbol: string, flag: string}>;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [userCurrency, setUserCurrencyState] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(false);

  // Charger la devise de l'utilisateur depuis le localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('userCurrency');
    if (savedCurrency) {
      setUserCurrencyState(savedCurrency);
    } else {
      // Devise par défaut basée sur la géolocalisation ou USD
      const defaultCurrency = navigator.language.includes('fr') ? 'EUR' : 'USD';
      setUserCurrencyState(defaultCurrency);
      localStorage.setItem('userCurrency', defaultCurrency);
    }
  }, []);

  const setUserCurrency = (currency: string) => {
    setUserCurrencyState(currency);
    localStorage.setItem('userCurrency', currency);
  };

  const convertPrice = useCallback(async (amount: number, fromCurrency: string, updateLoading: boolean = false): Promise<CurrencyConversion | null> => {
    if (fromCurrency === userCurrency) {
      return {
        from: fromCurrency,
        to: userCurrency,
        amount,
        convertedAmount: amount,
        rate: 1
      };
    }

    try {
      if (updateLoading) {
        setIsLoading(true);
      }
      const conversion = await currencyService.convertCurrency(amount, fromCurrency, userCurrency);
      return conversion;
    } catch (error) {
      console.error('Erreur de conversion:', error);
      return null;
    } finally {
      if (updateLoading) {
        setIsLoading(false);
      }
    }
  }, [userCurrency]);

  const formatPrice = useCallback(async (amount: number, currency: string, showOriginal: boolean = true): Promise<string> => {
    if (currency === userCurrency) {
      return currencyService.formatCurrency(amount, currency);
    }

    const conversion = await convertPrice(amount, currency, false);
    if (!conversion) {
      return currencyService.formatCurrency(amount, currency);
    }

    const convertedPrice = currencyService.formatCurrency(conversion.convertedAmount, userCurrency);
    
    if (showOriginal) {
      const originalPrice = currencyService.formatCurrency(amount, currency);
      return `${convertedPrice} (${originalPrice})`;
    }
    
    return convertedPrice;
  }, [convertPrice, userCurrency]);

  const getCountryCurrency = (country: string): string => {
    return currencyService.getCountryCurrency(country);
  };

  const supportedCurrencies = currencyService.getSupportedCurrenciesWithDetails();

  const value: CurrencyContextType = {
    userCurrency,
    setUserCurrency,
    convertPrice,
    formatPrice,
    getCountryCurrency,
    supportedCurrencies,
    isLoading
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

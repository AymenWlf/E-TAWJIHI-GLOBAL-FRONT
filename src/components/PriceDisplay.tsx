import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

interface PriceDisplayProps {
  amount: number;
  currency: string;
  showOriginal?: boolean;
  showTrend?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  country?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency,
  showOriginal = true,
  showTrend = false,
  className = '',
  size = 'md',
  country
}) => {
  const { userCurrency, formatPrice, getCountryCurrency, isLoading } = useCurrency();
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable' | null>(null);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  useEffect(() => {
    const convertAndFormat = async () => {
      if (!amount || !currency) return;

      setIsConverting(true);
      try {
        // Déterminer la devise du pays si fournie
        const countryCurrency = country ? getCountryCurrency(country) : currency;
        
        const formatted = await formatPrice(amount, countryCurrency, showOriginal);
        setFormattedPrice(formatted);

        // Simuler une tendance (dans un vrai projet, ceci viendrait d'une API)
        if (showTrend) {
          const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
          setTrend(trends[Math.floor(Math.random() * trends.length)]);
        }
      } catch (error) {
        console.error('Erreur de formatage du prix:', error);
        setFormattedPrice(`${currency} ${amount.toLocaleString()}`);
      } finally {
        setIsConverting(false);
      }
    };

    convertAndFormat();
  }, [amount, currency, userCurrency, showOriginal, country, formatPrice, getCountryCurrency]);

  if (isConverting || isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className={`${iconSizes[size]} animate-spin text-gray-400`} />
        <span className={`${sizeClasses[size]} text-gray-500`}>
          Conversion...
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <DollarSign className={`${iconSizes[size]} text-green-600`} />
      <span className={`${sizeClasses[size]} font-medium text-gray-900`}>
        {formattedPrice}
      </span>
      {showTrend && trend && (
        <div className="flex items-center">
          {trend === 'up' && (
            <TrendingUp className={`${iconSizes[size]} text-red-500`} />
          )}
          {trend === 'down' && (
            <TrendingDown className={`${iconSizes[size]} text-green-500`} />
          )}
          {trend === 'stable' && (
            <div className={`${iconSizes[size]} bg-gray-400 rounded-full`} />
          )}
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;

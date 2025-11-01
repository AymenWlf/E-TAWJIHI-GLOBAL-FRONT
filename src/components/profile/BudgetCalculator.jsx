import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Info, Save, RefreshCw, X } from 'lucide-react';
import currencyService from '../../services/currencyService';

const BudgetCalculator = ({ 
  value = {}, 
  onChange, 
  language = 'en',
  userCountry = '',
  preferredCountries = [],
  preferredCurrency = 'USD',
  className = '' 
}) => {
  const [budgetData, setBudgetData] = useState({
    tuition: value.tuition || '',
    accommodation: value.accommodation || '',
    transport: value.transport || '',
    insurance: value.insurance || '',
    travel: value.travel || '',
    living: value.living || '',
    books: value.books || '',
    other: value.other || '',
    currency: value.currency || preferredCurrency
  });

  const [isExpanded, setIsExpanded] = useState(true); // Détails affichés par défaut
  const [showPresets, setShowPresets] = useState(false);
  const [showRanges, setShowRanges] = useState(false);
  const [selectedCountryForRanges, setSelectedCountryForRanges] = useState('');
  const [total, setTotal] = useState('0.00');
  const [isConverting, setIsConverting] = useState(false);
  const [calculationMode, setCalculationMode] = useState('annual'); // 'annual' ou 'monthly'

  // Exemples de budget par pays (en USD) avec plages min/max - Only Maroc, France and China
  const budgetPresets = {
    'CN': {
      name: 'China',
      flag: '🇨🇳',
      // Values converted from DHS to USD (approx 1 USD = 10 DHS): tuition 10000 DHS/year ≈ 1000 USD/year, accommodation 3000 DHS/year ≈ 300 USD/year, living 2000 DHS/month (24000 DHS/year) ≈ 2400 USD/year
      tuition: { min: 800, max: 1200, avg: 1000 },
      accommodation: { min: 250, max: 400, avg: 300 },
      transport: { min: 30, max: 70, avg: 50 },
      insurance: { min: 40, max: 80, avg: 60 },
      travel: { min: 40, max: 80, avg: 60 },
      living: { min: 2000, max: 2800, avg: 2400 }, // 2000 DHS/month * 12 = 24000 DHS/year ≈ 2400 USD/year
      books: { min: 15, max: 25, avg: 20 },
      other: { min: 30, max: 50, avg: 40 }
    },
    'FR': {
      name: 'France',
      flag: '🇫🇷',
      // Values in EUR converted to USD (approx 1 EUR = 1.1 USD): tuition from 4000 EUR/year, accommodation realistic ranges for France
      tuition: { min: 4400, max: 16500, avg: 7700 }, // Public universities ~4000-5000 EUR/year (≈4400-5500 USD), private can go up to 15000 EUR/year (≈16500 USD)
      accommodation: { min: 3300, max: 8800, avg: 6050 }, // Student housing varies by city, average 5500 EUR/year (≈6050 USD/year)
      transport: { min: 220, max: 660, avg: 440 }, // Student transport card ~300-500 EUR/year (≈330-550 USD/year)
      insurance: { min: 220, max: 660, avg: 440 }, // Student health insurance ~200-500 EUR/year (≈220-550 USD/year)
      travel: { min: 550, max: 1650, avg: 1100 }, // Travel back home, trips
      living: { min: 3960, max: 7920, avg: 5940 }, // 300-600 EUR/month (≈330-660 USD/month) = 3600-7200 EUR/year (≈3960-7920 USD/year)
      books: { min: 330, max: 880, avg: 550 }, // Textbooks and materials 300-800 EUR/year (≈330-880 USD/year)
      other: { min: 660, max: 1650, avg: 1100 } // Miscellaneous expenses 600-1500 EUR/year (≈660-1650 USD/year)
    },
    'MA': {
      name: 'Morocco',
      flag: '🇲🇦',
      // Values converted from DHS to USD (approx 1 USD = 10 DHS): tuition from 3500 DHS/month = 42000 DHS/year ≈ 4200 USD/year
      tuition: { min: 3500, max: 8000, avg: 5000 }, // 3500 DHS/month = 42000 DHS/year ≈ 4200 USD/year, can go up to 80000 DHS/year for private
      accommodation: { min: 2000, max: 6000, avg: 4000 }, // 2000-5000 DHS/month = 24000-60000 DHS/year ≈ 2400-6000 USD/year
      transport: { min: 200, max: 600, avg: 400 }, // Public transport 300-500 DHS/month = 3600-6000 DHS/year ≈ 360-600 USD/year
      insurance: { min: 300, max: 800, avg: 500 }, // Health insurance 300-700 DHS/month = 3600-8400 DHS/year ≈ 360-840 USD/year
      travel: { min: 500, max: 1500, avg: 1000 }, // Travel expenses within Morocco or to home region
      living: { min: 2400, max: 4800, avg: 3600 }, // 2000-4000 DHS/month = 24000-48000 DHS/year ≈ 2400-4800 USD/year
      books: { min: 200, max: 600, avg: 400 }, // Textbooks and materials 200-500 DHS/month = 2400-6000 DHS/year ≈ 240-600 USD/year
      other: { min: 600, max: 1800, avg: 1200 } // Miscellaneous expenses 500-1500 DHS/month = 6000-18000 DHS/year ≈ 600-1800 USD/year
    },
    'default': {
      name: 'General Average',
      flag: '🌍',
      tuition: { min: 8000, max: 25000, avg: 15000 },
      accommodation: { min: 5000, max: 12000, avg: 8000 },
      transport: { min: 800, max: 1500, avg: 1200 },
      insurance: { min: 1000, max: 2000, avg: 1500 },
      travel: { min: 800, max: 1500, avg: 1200 },
      living: { min: 4000, max: 8000, avg: 6000 },
      books: { min: 400, max: 800, avg: 600 },
      other: { min: 800, max: 1500, avg: 1200 }
    }
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'EGP' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
    { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn' },
    { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD' },
    { code: 'OMR', name: 'Omani Rial', symbol: 'OMR' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: 'LBP' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'LKR', name: 'Sri Lankan Rupee', symbol: '₨' },
    { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨' },
    { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    { code: 'COP', name: 'Colombian Peso', symbol: '$' },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
    { code: 'UYU', name: 'Uruguayan Peso', symbol: '$' },
    { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲' },
    { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs' },
    { code: 'VES', name: 'Venezuelan Bolivar', symbol: 'Bs' },
    { code: 'GYD', name: 'Guyanese Dollar', symbol: 'G$' },
    { code: 'SRD', name: 'Surinamese Dollar', symbol: '$' },
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT' },
    { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD' },
    { code: 'SDG', name: 'Sudanese Pound', symbol: 'SDG' },
    { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
    { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$' },
    { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'Z$' },
    { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK' },
    { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK' },
    { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT' },
    { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz' },
    { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' },
    { code: 'XOF', name: 'West African CFA Franc', symbol: 'FCFA' },
    { code: 'CDF', name: 'Congolese Franc', symbol: 'FC' },
    { code: 'STN', name: 'São Tomé Dobra', symbol: 'Db' },
    { code: 'GNF', name: 'Guinean Franc', symbol: 'FG' },
    { code: 'SLE', name: 'Sierra Leonean Leone', symbol: 'Le' },
    { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$' },
    { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D' },
    { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM' },
    { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$' },
    { code: 'KMF', name: 'Comorian Franc', symbol: 'CF' },
    { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨' },
    { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
    { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar' },
    { code: 'LSL', name: 'Lesotho Loti', symbol: 'L' },
    { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'E' },
    { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
    { code: 'MDL', name: 'Moldovan Leu', symbol: 'L' },
    { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
    { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
    { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼' },
    { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
    { code: 'UZS', name: 'Uzbekistani Som', symbol: 'So\'m' },
    { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с' },
    { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'SM' },
    { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T' },
    { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf' },
    { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
    { code: 'LAK', name: 'Lao Kip', symbol: '₭' },
    { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
    { code: 'BND', name: 'Brunei Dollar', symbol: 'B$' },
    { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$' },
    { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮' },
    { code: 'KPW', name: 'North Korean Won', symbol: '₩' },
    { code: 'YER', name: 'Yemeni Rial', symbol: '﷼' },
    { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
    { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
    { code: 'SYP', name: 'Syrian Pound', symbol: '£' },
    { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr' },
    { code: 'ALL', name: 'Albanian Lek', symbol: 'L' },
    { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден' },
    { code: 'BAM', name: 'Bosnia-Herzegovina Mark', symbol: 'KM' }
  ];

  const budgetCategories = [
    { key: 'tuition', label: 'Tuition Fees', icon: '🎓', description: 'Annual university tuition fees' },
    { key: 'accommodation', label: 'Accommodation', icon: '🏠', description: 'Housing, rent, dormitory costs' },
    { key: 'transport', label: 'Transportation', icon: '🚌', description: 'Public transport, car, flights' },
    { key: 'insurance', label: 'Insurance', icon: '🛡️', description: 'Health, travel, liability insurance' },
    { key: 'travel', label: 'Travel', icon: '✈️', description: 'Trips home, vacation travel' },
    { key: 'living', label: 'Living Expenses', icon: '🍽️', description: 'Food, groceries, daily expenses (monthly amount)' },
    { key: 'books', label: 'Books & Materials', icon: '📚', description: 'Textbooks, supplies, equipment' },
    { key: 'other', label: 'Other Expenses', icon: '💼', description: 'Miscellaneous, entertainment, etc.' }
  ];

  const calculateTotal = () => {
    const calculatedTotal = Object.keys(budgetData).reduce((sum, key) => {
      if (key !== 'currency' && budgetData[key] && budgetData[key] !== '') {
        const value = parseFloat(budgetData[key]);
        if (isNaN(value)) return sum;
        
        // Living expenses are stored as monthly, need to multiply by 12 for annual total
        // All other expenses (tuition, accommodation, etc.) are already annual
        if (key === 'living') {
          return sum + (value * 12);
        }
        return sum + value;
      }
      return sum;
    }, 0);
    return calculatedTotal.toFixed(2);
  };

  // Calculer le total mensuel et annuel
  const calculateTotals = () => {
    const annualTotal = parseFloat(calculateTotal());
    const monthlyTotal = annualTotal / 12;
    return {
      annual: annualTotal.toFixed(2),
      monthly: monthlyTotal.toFixed(2)
    };
  };

  // Update total whenever budgetData changes
  useEffect(() => {
    const newTotal = calculateTotal();
    setTotal(newTotal);
  }, [budgetData]);

  const handleInputChange = (key, value) => {
    const newBudgetData = { ...budgetData, [key]: value };
    setBudgetData(newBudgetData);
    onChange(newBudgetData);
  };

  // Convertir les valeurs selon le mode de calcul
  const getDisplayValue = (key) => {
    const value = budgetData[key];
    if (!value || value === '') return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    // Living expenses are always stored as monthly, other expenses are always annual
    if (key === 'living') {
      // Living is always monthly, so display it as is (regardless of calculation mode)
      return numValue.toFixed(2);
    } else {
      // Other expenses are annual, convert if in monthly mode
      if (calculationMode === 'monthly') {
        return (numValue / 12).toFixed(2);
      }
      return numValue.toFixed(2);
    }
  };

  // Convertir la valeur saisie selon le mode
  const handleInputChangeWithConversion = (key, inputValue) => {
    if (!inputValue || inputValue === '') {
      handleInputChange(key, '');
      return;
    }
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      handleInputChange(key, inputValue);
      return;
    }
    
    // Living expenses are always stored as monthly, other expenses are always annual
    let convertedValue;
    if (key === 'living') {
      // Living is always monthly, store as is regardless of calculation mode
      convertedValue = numValue.toFixed(2);
    } else {
      // Other expenses are annual
      if (calculationMode === 'monthly') {
        // User entered monthly amount, convert to annual for storage
        convertedValue = (numValue * 12).toFixed(2);
      } else {
        // User entered annual amount, store as is
        convertedValue = numValue.toFixed(2);
      }
    }
    
    handleInputChange(key, convertedValue);
  };

  const handleCurrencyChange = (newCurrency) => {
    const oldCurrency = budgetData.currency;
    
    if (oldCurrency === newCurrency) return;
    
    setIsConverting(true);
    
    // Convertir toutes les valeurs existantes vers la nouvelle devise
    const convertedData = {
      tuition: budgetData.tuition ? currencyService.convert(parseFloat(budgetData.tuition), oldCurrency, newCurrency) : '',
      accommodation: budgetData.accommodation ? currencyService.convert(parseFloat(budgetData.accommodation), oldCurrency, newCurrency) : '',
      transport: budgetData.transport ? currencyService.convert(parseFloat(budgetData.transport), oldCurrency, newCurrency) : '',
      insurance: budgetData.insurance ? currencyService.convert(parseFloat(budgetData.insurance), oldCurrency, newCurrency) : '',
      travel: budgetData.travel ? currencyService.convert(parseFloat(budgetData.travel), oldCurrency, newCurrency) : '',
      living: budgetData.living ? currencyService.convert(parseFloat(budgetData.living), oldCurrency, newCurrency) : '',
      books: budgetData.books ? currencyService.convert(parseFloat(budgetData.books), oldCurrency, newCurrency) : '',
      other: budgetData.other ? currencyService.convert(parseFloat(budgetData.other), oldCurrency, newCurrency) : '',
      currency: newCurrency
    };
    
    setBudgetData(convertedData);
    onChange(convertedData);
    
    // Arrêter l'indicateur de conversion après un court délai
    setTimeout(() => {
      setIsConverting(false);
    }, 500);
  };

  const handlePresetSelect = (countryCode) => {
    const preset = budgetPresets[countryCode] || budgetPresets.default;
    const currentCurrency = budgetData.currency || preferredCurrency;
    
    // Convertir les valeurs USD vers la devise sélectionnée (utiliser avg)
    // Les exemples sont toujours en montants annuels pour toutes les catégories
    const convertedPreset = {
      tuition: currencyService.convert(preset.tuition.avg, 'USD', currentCurrency),
      accommodation: currencyService.convert(preset.accommodation.avg, 'USD', currentCurrency),
      transport: currencyService.convert(preset.transport.avg, 'USD', currentCurrency),
      insurance: currencyService.convert(preset.insurance.avg, 'USD', currentCurrency),
      travel: currencyService.convert(preset.travel.avg, 'USD', currentCurrency),
      // Living in examples is annual, but we store it as monthly
      living: currencyService.convert(preset.living.avg / 12, 'USD', currentCurrency),
      books: currencyService.convert(preset.books.avg, 'USD', currentCurrency),
      other: currencyService.convert(preset.other.avg, 'USD', currentCurrency),
      currency: currentCurrency
    };
    
    const newBudgetData = { ...budgetData, ...convertedPreset };
    setBudgetData(newBudgetData);
    onChange(newBudgetData);
    setShowPresets(false);
  };

  const handleClear = () => {
    const clearedData = {
      tuition: '',
      accommodation: '',
      transport: '',
      insurance: '',
      travel: '',
      living: '',
      books: '',
      other: '',
      currency: budgetData.currency
    };
    setBudgetData(clearedData);
    onChange(clearedData);
  };

  const handleShowRanges = (countryCode) => {
    setSelectedCountryForRanges(countryCode);
    setShowRanges(true);
  };

  const getCountryCode = (countryName) => {
    const countryMap = {
      'United States': 'US',
      'United Kingdom': 'GB',
      'Canada': 'CA',
      'Australia': 'AU',
      'Germany': 'DE',
      'France': 'FR',
      'Netherlands': 'NL',
      'Italy': 'IT',
      'Spain': 'ES',
      'Switzerland': 'CH',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Denmark': 'DK',
      'Finland': 'FI',
      'Ireland': 'IE',
      'New Zealand': 'NZ',
      'Japan': 'JP',
      'South Korea': 'KR',
      'Singapore': 'SG',
      'Cyprus': 'CY',
      'China': 'CN',
      'Turkey': 'TR',
      'Morocco': 'MA'
    };
    return countryMap[countryName] || 'default';
  };

  // Organiser les exemples par priorité (pays préférés en premier)
  const getOrderedPresets = () => {
    const presetEntries = Object.entries(budgetPresets);
    
    // Séparer les pays préférés des autres
    const preferredPresets = [];
    const otherPresets = [];
    
    presetEntries.forEach(([code, preset]) => {
      if (code === 'default') return; // Ignorer le default pour l'instant
      
      const isPreferred = preferredCountries.some(country => 
        country.name === preset.name || getCountryCode(country.name) === code
      );
      
      if (isPreferred) {
        preferredPresets.push([code, preset]);
      } else {
        otherPresets.push([code, preset]);
      }
    });
    
    // Retourner les pays préférés en premier, puis les autres, puis le default
    return [
      ...preferredPresets,
      ...otherPresets,
      ['default', budgetPresets.default]
    ];
  };

  // Auto-fill based on user country and sync currency
  useEffect(() => {
    if (userCountry && !Object.values(budgetData).some(v => v && v !== '')) {
      const countryCode = getCountryCode(userCountry);
      if (countryCode !== 'default') {
        const preset = budgetPresets[countryCode];
        if (preset) {
          // Convertir les valeurs USD vers la devise préférée (montants annuels)
          const convertedPreset = {
            tuition: currencyService.convert(preset.tuition.avg, 'USD', preferredCurrency),
            accommodation: currencyService.convert(preset.accommodation.avg, 'USD', preferredCurrency),
            transport: currencyService.convert(preset.transport.avg, 'USD', preferredCurrency),
            insurance: currencyService.convert(preset.insurance.avg, 'USD', preferredCurrency),
            travel: currencyService.convert(preset.travel.avg, 'USD', preferredCurrency),
            // Living in examples is annual, but we store it as monthly
            living: currencyService.convert(preset.living.avg / 12, 'USD', preferredCurrency),
            books: currencyService.convert(preset.books.avg, 'USD', preferredCurrency),
            other: currencyService.convert(preset.other.avg, 'USD', preferredCurrency),
            currency: preferredCurrency
          };
          const newBudgetData = { ...budgetData, ...convertedPreset };
          setBudgetData(newBudgetData);
          onChange(newBudgetData);
        }
      }
    }
  }, [userCountry]);

  // Sync currency with preferred currency
  useEffect(() => {
    if (preferredCurrency && budgetData.currency !== preferredCurrency) {
      const newBudgetData = { ...budgetData, currency: preferredCurrency };
      setBudgetData(newBudgetData);
      onChange(newBudgetData);
    }
  }, [preferredCurrency]);

  // Update budgetData when value prop changes
  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      setBudgetData(prev => ({
        ...prev,
        ...value,
        currency: value.currency || preferredCurrency
      }));
    }
  }, [value, preferredCurrency]);

  const t = {
    title: language === 'en' ? 'Budget Calculator' : 'Calculateur de Budget',
    subtitle: language === 'en' ? 'Estimate your study abroad costs' : 'Estimez vos coûts d\'études à l\'étranger',
    total: language === 'en' ? 'Total Budget' : 'Budget Total',
    currency: language === 'en' ? 'Currency' : 'Devise',
    presets: language === 'en' ? 'Budget Examples' : 'Exemples de Budget',
    clear: language === 'en' ? 'Clear All' : 'Tout Effacer',
    expand: language === 'en' ? 'Show Details' : 'Afficher les Détails',
    collapse: language === 'en' ? 'Hide Details' : 'Masquer les Détails',
    autoFill: language === 'en' ? 'Auto-fill from country' : 'Remplissage automatique par pays',
    enterAmount: language === 'en' ? 'Enter amount' : 'Entrez le montant',
    calculationMode: language === 'en' ? 'Calculation Mode' : 'Mode de Calcul',
    annual: language === 'en' ? 'Annual' : 'Annuel',
    monthly: language === 'en' ? 'Monthly' : 'Mensuel',
    perYear: language === 'en' ? 'per year' : 'par an',
    perMonth: language === 'en' ? 'per month' : 'par mois',
    annualTotal: language === 'en' ? 'Annual Total' : 'Total Annuel',
    monthlyTotal: language === 'en' ? 'Monthly Total' : 'Total Mensuel'
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t.title}</h3>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t.presets}
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {isExpanded ? t.collapse : t.expand}
          </button>
        </div>
      </div>

      {/* Budget Examples */}
      {showPresets && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">{t.presets}</h4>
          
          {/* Info sur les plages de budget */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">
                  {language === 'en' ? 'Budget Ranges Include:' : 'Les Plages de Budget Incluent:'}
                </p>
                <ul className="text-xs space-y-1">
                  <li>• {language === 'en' ? 'Scholarships and financial aid' : 'Bourses et aides financières'}</li>
                  <li>• {language === 'en' ? 'Public vs private institutions' : 'Établissements publics vs privés'}</li>
                  <li>• {language === 'en' ? 'Different cities and regions' : 'Différentes villes et régions'}</li>
                  <li>• {language === 'en' ? 'Various accommodation types' : 'Différents types de logement'}</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Section des pays préférés */}
          {preferredCountries.length > 0 && (
            <div className="mb-4">
              <h5 className="text-xs font-medium text-blue-600 mb-2 flex items-center">
                <span className="mr-1">⭐</span>
                {language === 'en' ? 'Your Preferred Destinations' : 'Vos Destinations Préférées'}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getOrderedPresets()
                  .filter(([code, preset]) => code !== 'default' && 
                    preferredCountries.some(country => 
                      country.name === preset.name || getCountryCode(country.name) === code
                    ))
                  .map(([countryCode, preset]) => (
                    <div key={countryCode} className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handlePresetSelect(countryCode)}
                        className="px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center space-x-2"
                      >
                        <span className="text-lg">{preset.flag}</span>
                        <span className="font-medium text-blue-800">{preset.name}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShowRanges(countryCode)}
                        className="px-2 py-2 text-xs bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                        title={language === 'en' ? 'View budget ranges' : 'Voir les plages de budget'}
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Section des autres pays */}
          <div>
            <h5 className="text-xs font-medium text-gray-600 mb-2">
              {language === 'en' ? 'Other Popular Destinations' : 'Autres Destinations Populaires'}
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {getOrderedPresets()
                .filter(([code, preset]) => code !== 'default' && 
                  !preferredCountries.some(country => 
                    country.name === preset.name || getCountryCode(country.name) === code
                  ))
                .map(([countryCode, preset]) => (
                  <div key={countryCode} className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handlePresetSelect(countryCode)}
                      className="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center space-x-2"
                    >
                      <span className="text-sm">{preset.flag}</span>
                      <span className="font-medium">{preset.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShowRanges(countryCode)}
                      className="px-1 py-2 text-xs bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                      title={language === 'en' ? 'View budget ranges' : 'Voir les plages de budget'}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
          
          {/* Exemple général */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => handlePresetSelect('default')}
              className="px-3 py-2 text-xs bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <span className="text-sm">🌍</span>
              <span className="font-medium">{language === 'en' ? 'General Example' : 'Exemple Général'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Currency Selection and Calculation Mode */}
      <div className="mb-6 space-y-4">
        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.currency}
          </label>
          <div className="flex items-center space-x-2">
            <select
              value={budgetData.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-lg flex items-center space-x-1">
              {isConverting && <RefreshCw className="h-3 w-3 animate-spin" />}
              <span>{language === 'en' ? 'Synced with preferences' : 'Synchronisé avec les préférences'}</span>
            </div>
          </div>
        </div>

        {/* Calculation Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.calculationMode}
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setCalculationMode('annual')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                calculationMode === 'annual'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.annual}
            </button>
            <button
              type="button"
              onClick={() => setCalculationMode('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                calculationMode === 'monthly'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.monthly}
            </button>
          </div>
        </div>
      </div>

      {/* Total Display */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{t.total}</h4>
              <p className="text-sm text-gray-600">
                {calculationMode === 'annual' ? t.annualTotal : t.monthlyTotal}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 flex items-center space-x-2">
              {isConverting && <RefreshCw className="h-5 w-5 animate-spin" />}
              <span>
                {calculationMode === 'annual' 
                  ? currencyService.formatAmount(parseFloat(calculateTotals().annual), budgetData.currency)
                  : currencyService.formatAmount(parseFloat(calculateTotals().monthly), budgetData.currency)
                }
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {calculationMode === 'annual' ? t.perYear : t.perMonth}
            </div>
          </div>
        </div>

        {/* Affichage des deux totaux */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
          <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
            <div className="text-sm font-medium text-gray-600 mb-1">{t.annualTotal}</div>
            <div className="text-lg font-bold text-blue-600">
              {currencyService.formatAmount(parseFloat(calculateTotals().annual), budgetData.currency)}
            </div>
            <div className="text-xs text-gray-500">{t.perYear}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-emerald-100">
            <div className="text-sm font-medium text-gray-600 mb-1">{t.monthlyTotal}</div>
            <div className="text-lg font-bold text-emerald-600">
              {currencyService.formatAmount(parseFloat(calculateTotals().monthly), budgetData.currency)}
            </div>
            <div className="text-xs text-gray-500">{t.perMonth}</div>
          </div>
        </div>
      </div>

      {/* Detailed Budget Categories */}
      {isExpanded && (
        <div className="space-y-4">
          {budgetCategories.map((category) => (
            <div key={category.key} className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">{category.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-gray-800">{category.label}</h5>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{budgetData.currency}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={getDisplayValue(category.key)}
                      onChange={(e) => handleInputChangeWithConversion(category.key, e.target.value)}
                      placeholder="0.00"
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {calculationMode === 'annual' 
                    ? `${language === 'en' ? 'Annual amount' : 'Montant annuel'}`
                    : `${language === 'en' ? 'Monthly amount' : 'Montant mensuel'}`
                  }
                </div>
                <p className="text-xs text-gray-500">{category.description}</p>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {t.clear}
            </button>
            <button
              type="button"
              onClick={() => onChange(budgetData)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Budget</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal pour afficher les plages de budget */}
      {showRanges && selectedCountryForRanges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Calculator className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">
                  {budgetPresets[selectedCountryForRanges]?.flag} {budgetPresets[selectedCountryForRanges]?.name}
                </h2>
              </div>
              <button 
                onClick={() => setShowRanges(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  {language === 'en' 
                    ? 'Budget ranges include scholarships, public/private institutions, and regional variations.'
                    : 'Les plages de budget incluent les bourses, établissements publics/privés et variations régionales.'
                  }
                </p>
              </div>

              <div className="space-y-4">
                {selectedCountryForRanges && budgetPresets[selectedCountryForRanges] && (
                  <>
                    {Object.entries(budgetPresets[selectedCountryForRanges])
                      .filter(([key]) => key !== 'name' && key !== 'flag')
                      .map(([category, range]) => (
                        <div key={category} className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2 capitalize">
                            {category === 'tuition' ? (language === 'en' ? 'Tuition Fees' : 'Frais de Scolarité') :
                             category === 'accommodation' ? (language === 'en' ? 'Accommodation' : 'Logement') :
                             category === 'transport' ? (language === 'en' ? 'Transport' : 'Transport') :
                             category === 'insurance' ? (language === 'en' ? 'Insurance' : 'Assurance') :
                             category === 'travel' ? (language === 'en' ? 'Travel' : 'Voyages') :
                             category === 'living' ? (language === 'en' ? 'Living Expenses' : 'Frais de Vie') :
                             category === 'books' ? (language === 'en' ? 'Books & Materials' : 'Livres & Matériel') :
                             category === 'other' ? (language === 'en' ? 'Other Expenses' : 'Autres Dépenses') :
                             category}
                          </h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-2 bg-red-50 border border-red-200 rounded">
                              <div className="font-semibold text-red-800">
                                {language === 'en' ? 'Minimum' : 'Minimum'}
                              </div>
                              <div className="text-red-600">
                                {currencyService.formatAmount(currencyService.convert(range.min, 'USD', budgetData.currency), budgetData.currency)}
                              </div>
                            </div>
                            <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
                              <div className="font-semibold text-blue-800">
                                {language === 'en' ? 'Average' : 'Moyenne'}
                              </div>
                              <div className="text-blue-600">
                                {currencyService.formatAmount(currencyService.convert(range.avg, 'USD', budgetData.currency), budgetData.currency)}
                              </div>
                            </div>
                            <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
                              <div className="font-semibold text-green-800">
                                {language === 'en' ? 'Maximum' : 'Maximum'}
                              </div>
                              <div className="text-green-600">
                                {currencyService.formatAmount(currencyService.convert(range.max, 'USD', budgetData.currency), budgetData.currency)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRanges(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  {language === 'en' ? 'Close' : 'Fermer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handlePresetSelect(selectedCountryForRanges);
                    setShowRanges(false);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save size={20} />
                  <span>{language === 'en' ? 'Use Example Values' : 'Utiliser les Valeurs d\'Exemple'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCalculator;

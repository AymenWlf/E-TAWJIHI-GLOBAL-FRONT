import React, { useState, useEffect } from 'react';
import { ChevronDown, DollarSign, RefreshCw } from 'lucide-react';

const CurrencySelector = ({ 
  value, 
  onChange, 
  userCountry = '',
  language = 'en', 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Mapping des pays vers leurs devises principales
  const countryCurrencyMap = {
    'United States': 'USD',
    'Canada': 'CAD',
    'United Kingdom': 'GBP',
    'Germany': 'EUR',
    'France': 'EUR',
    'Italy': 'EUR',
    'Spain': 'EUR',
    'Netherlands': 'EUR',
    'Belgium': 'EUR',
    'Austria': 'EUR',
    'Portugal': 'EUR',
    'Ireland': 'EUR',
    'Finland': 'EUR',
    'Luxembourg': 'EUR',
    'Malta': 'EUR',
    'Cyprus': 'EUR',
    'Slovenia': 'EUR',
    'Slovakia': 'EUR',
    'Estonia': 'EUR',
    'Latvia': 'EUR',
    'Lithuania': 'EUR',
    'Australia': 'AUD',
    'New Zealand': 'NZD',
    'Japan': 'JPY',
    'China': 'CNY',
    'South Korea': 'KRW',
    'India': 'INR',
    'Brazil': 'BRL',
    'Mexico': 'MXN',
    'Argentina': 'ARS',
    'Chile': 'CLP',
    'Colombia': 'COP',
    'Peru': 'PEN',
    'Venezuela': 'VES',
    'Uruguay': 'UYU',
    'Paraguay': 'PYG',
    'Bolivia': 'BOB',
    'Ecuador': 'USD',
    'Guyana': 'GYD',
    'Suriname': 'SRD',
    'Morocco': 'MAD',
    'Algeria': 'DZD',
    'Tunisia': 'TND',
    'Egypt': 'EGP',
    'Libya': 'LYD',
    'Sudan': 'SDG',
    'Ethiopia': 'ETB',
    'Kenya': 'KES',
    'Uganda': 'UGX',
    'Tanzania': 'TZS',
    'Ghana': 'GHS',
    'Nigeria': 'NGN',
    'South Africa': 'ZAR',
    'Botswana': 'BWP',
    'Namibia': 'NAD',
    'Zimbabwe': 'ZWL',
    'Zambia': 'ZMW',
    'Malawi': 'MWK',
    'Mozambique': 'MZN',
    'Angola': 'AOA',
    'Cameroon': 'XAF',
    'Senegal': 'XOF',
    'Ivory Coast': 'XOF',
    'Mali': 'XOF',
    'Burkina Faso': 'XOF',
    'Niger': 'XOF',
    'Chad': 'XAF',
    'Central African Republic': 'XAF',
    'Democratic Republic of the Congo': 'CDF',
    'Republic of the Congo': 'XAF',
    'Gabon': 'XAF',
    'Equatorial Guinea': 'XAF',
    'São Tomé and Príncipe': 'STN',
    'Guinea': 'GNF',
    'Guinea-Bissau': 'XOF',
    'Sierra Leone': 'SLE',
    'Liberia': 'LRD',
    'Gambia': 'GMD',
    'Mauritania': 'MRU',
    'Cape Verde': 'CVE',
    'Comoros': 'KMF',
    'Seychelles': 'SCR',
    'Mauritius': 'MUR',
    'Madagascar': 'MGA',
    'Malawi': 'MWK',
    'Zambia': 'ZMW',
    'Zimbabwe': 'ZWL',
    'Botswana': 'BWP',
    'Namibia': 'NAD',
    'South Africa': 'ZAR',
    'Lesotho': 'LSL',
    'Eswatini': 'SZL',
    'Russia': 'RUB',
    'Ukraine': 'UAH',
    'Belarus': 'BYN',
    'Moldova': 'MDL',
    'Romania': 'RON',
    'Bulgaria': 'BGN',
    'Serbia': 'RSD',
    'Montenegro': 'EUR',
    'North Macedonia': 'MKD',
    'Albania': 'ALL',
    'Bosnia and Herzegovina': 'BAM',
    'Croatia': 'HRK',
    'Slovenia': 'EUR',
    'Slovakia': 'EUR',
    'Czech Republic': 'CZK',
    'Poland': 'PLN',
    'Hungary': 'HUF',
    'Turkey': 'TRY',
    'Georgia': 'GEL',
    'Armenia': 'AMD',
    'Azerbaijan': 'AZN',
    'Kazakhstan': 'KZT',
    'Uzbekistan': 'UZS',
    'Kyrgyzstan': 'KGS',
    'Tajikistan': 'TJS',
    'Turkmenistan': 'TMT',
    'Afghanistan': 'AFN',
    'Pakistan': 'PKR',
    'India': 'INR',
    'Nepal': 'NPR',
    'Bhutan': 'BTN',
    'Bangladesh': 'BDT',
    'Sri Lanka': 'LKR',
    'Maldives': 'MVR',
    'Myanmar': 'MMK',
    'Thailand': 'THB',
    'Laos': 'LAK',
    'Cambodia': 'KHR',
    'Vietnam': 'VND',
    'Malaysia': 'MYR',
    'Singapore': 'SGD',
    'Brunei': 'BND',
    'Indonesia': 'IDR',
    'Philippines': 'PHP',
    'Taiwan': 'TWD',
    'Hong Kong': 'HKD',
    'Macau': 'MOP',
    'Mongolia': 'MNT',
    'North Korea': 'KPW',
    'South Korea': 'KRW',
    'Japan': 'JPY',
    'China': 'CNY',
    'Saudi Arabia': 'SAR',
    'United Arab Emirates': 'AED',
    'Qatar': 'QAR',
    'Kuwait': 'KWD',
    'Bahrain': 'BHD',
    'Oman': 'OMR',
    'Yemen': 'YER',
    'Iraq': 'IQD',
    'Iran': 'IRR',
    'Israel': 'ILS',
    'Palestine': 'ILS',
    'Jordan': 'JOD',
    'Lebanon': 'LBP',
    'Syria': 'SYP',
    'Cyprus': 'EUR',
    'Turkey': 'TRY',
    'Greece': 'EUR',
    'Albania': 'ALL',
    'North Macedonia': 'MKD',
    'Bulgaria': 'BGN',
    'Romania': 'RON',
    'Moldova': 'MDL',
    'Ukraine': 'UAH',
    'Belarus': 'BYN',
    'Lithuania': 'EUR',
    'Latvia': 'EUR',
    'Estonia': 'EUR',
    'Finland': 'EUR',
    'Sweden': 'SEK',
    'Norway': 'NOK',
    'Denmark': 'DKK',
    'Iceland': 'ISK',
    'Ireland': 'EUR',
    'United Kingdom': 'GBP',
    'Switzerland': 'CHF',
    'Liechtenstein': 'CHF',
    'Austria': 'EUR',
    'Germany': 'EUR',
    'Netherlands': 'EUR',
    'Belgium': 'EUR',
    'Luxembourg': 'EUR',
    'France': 'EUR',
    'Monaco': 'EUR',
    'Andorra': 'EUR',
    'Spain': 'EUR',
    'Portugal': 'EUR',
    'Italy': 'EUR',
    'San Marino': 'EUR',
    'Vatican City': 'EUR',
    'Malta': 'EUR',
    'Slovenia': 'EUR',
    'Croatia': 'HRK',
    'Bosnia and Herzegovina': 'BAM',
    'Serbia': 'RSD',
    'Montenegro': 'EUR',
    'North Macedonia': 'MKD',
    'Albania': 'ALL',
    'Greece': 'EUR',
    'Turkey': 'TRY',
    'Cyprus': 'EUR'
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', flag: '🇲🇦' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'EGP', flag: '🇪🇬' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬' },
    { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', flag: '🇭🇷' },
    { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин', flag: '🇷🇸' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', flag: '🇺🇦' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', flag: '🇶🇦' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', flag: '🇧🇭' },
    { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', flag: '🇴🇲' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD', flag: '🇯🇴' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£', flag: '🇱🇧' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' },
    { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰' },
    { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', flag: '🇳🇵' },
    { code: 'AFN', name: 'Afghan Afghani', symbol: '؋', flag: '🇦🇫' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
    { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷' },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱' },
    { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴' },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪' },
    { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', flag: '🇺🇾' },
    { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲', flag: '🇵🇾' },
    { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs', flag: '🇧🇴' },
    { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.S', flag: '🇻🇪' },
    { code: 'GYD', name: 'Guyanese Dollar', symbol: 'G$', flag: '🇬🇾' },
    { code: 'SRD', name: 'Surinamese Dollar', symbol: '$', flag: '🇸🇷' },
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', flag: '🇩🇿' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', flag: '🇹🇳' },
    { code: 'LYD', name: 'Libyan Dinar', symbol: 'ل.د', flag: '🇱🇾' },
    { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س', flag: '🇸🇩' },
    { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
    { code: 'BWP', name: 'Botswana Pula', symbol: 'P', flag: '🇧🇼' },
    { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$', flag: '🇳🇦' },
    { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'Z$', flag: '🇿🇼' },
    { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', flag: '🇿🇲' },
    { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', flag: '🇲🇼' },
    { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', flag: '🇲🇿' },
    { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', flag: '🇦🇴' },
    { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', flag: '🇨🇲' },
    { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', flag: '🇸🇳' },
    { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', flag: '🇨🇩' },
    { code: 'STN', name: 'São Tomé and Príncipe Dobra', symbol: 'Db', flag: '🇸🇹' },
    { code: 'GNF', name: 'Guinean Franc', symbol: 'FG', flag: '🇬🇳' },
    { code: 'SLE', name: 'Sierra Leonean Leone', symbol: 'Le', flag: '🇸🇱' },
    { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$', flag: '🇱🇷' },
    { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', flag: '🇬🇲' },
    { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM', flag: '🇲🇷' },
    { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$', flag: '🇨🇻' },
    { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', flag: '🇰🇲' },
    { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨', flag: '🇸🇨' },
    { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨', flag: '🇲🇺' },
    { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', flag: '🇲🇬' },
    { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', flag: '🇱🇸' },
    { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L', flag: '🇸🇿' },
    { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br', flag: '🇧🇾' },
    { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', flag: '🇲🇩' },
    { code: 'GEL', name: 'Georgian Lari', symbol: '₾', flag: '🇬🇪' },
    { code: 'AMD', name: 'Armenian Dram', symbol: '֏', flag: '🇦🇲' },
    { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', flag: '🇦🇿' },
    { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', flag: '🇰🇿' },
    { code: 'UZS', name: 'Uzbekistani Som', symbol: 'лв', flag: '🇺🇿' },
    { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'лв', flag: '🇰🇬' },
    { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'SM', flag: '🇹🇯' },
    { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T', flag: '🇹🇲' },
    { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf', flag: '🇲🇻' },
    { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', flag: '🇲🇲' },
    { code: 'LAK', name: 'Lao Kip', symbol: '₭', flag: '🇱🇦' },
    { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', flag: '🇰🇭' },
    { code: 'BND', name: 'Brunei Dollar', symbol: 'B$', flag: '🇧🇳' },
    { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$', flag: '🇲🇴' },
    { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮', flag: '🇲🇳' },
    { code: 'KPW', name: 'North Korean Won', symbol: '₩', flag: '🇰🇵' },
    { code: 'YER', name: 'Yemeni Rial', symbol: '﷼', flag: '🇾🇪' },
    { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', flag: '🇮🇶' },
    { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', flag: '🇮🇷' },
    { code: 'SYP', name: 'Syrian Pound', symbol: '£', flag: '🇸🇾' },
    { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr', flag: '🇮🇸' },
    { code: 'ALL', name: 'Albanian Lek', symbol: 'L', flag: '🇦🇱' },
    { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден', flag: '🇲🇰' },
    { code: 'BAM', name: 'Bosnia and Herzegovina Mark', symbol: 'КМ', flag: '🇧🇦' }
  ];

  const selectedCurrency = currencies.find(c => c.code === value) || currencies[0];

  // Auto-fill currency based on user country
  useEffect(() => {
    if (userCountry && countryCurrencyMap[userCountry]) {
      const suggestedCurrency = countryCurrencyMap[userCountry];
      if (suggestedCurrency && suggestedCurrency !== value) {
        onChange(suggestedCurrency);
      }
    }
  }, [userCountry]);

  const handleSelect = (currencyCode) => {
    onChange(currencyCode);
    setIsOpen(false);
  };

  const t = {
    selectCurrency: language === 'en' ? 'Select Currency' : 'Sélectionner la Devise',
    searchCurrency: language === 'en' ? 'Search currency...' : 'Rechercher une devise...',
    noResults: language === 'en' ? 'No currencies found' : 'Aucune devise trouvée',
    autoDetected: language === 'en' ? 'Auto-detected from country' : 'Détecté automatiquement du pays'
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{selectedCurrency.flag}</span>
            <div className="text-left">
              <div className="font-medium text-gray-800">{selectedCurrency.code}</div>
              <div className="text-sm text-gray-500">{selectedCurrency.name}</div>
            </div>
          </div>
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchCurrency}
                className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Currency List */}
          <div className="max-h-48 overflow-y-auto">
            {currencies.map((currency) => (
              <div
                key={currency.code}
                className="px-4 py-3 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between"
                onClick={() => handleSelect(currency.code)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{currency.flag}</span>
                  <div>
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-sm text-gray-500">{currency.name}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{currency.symbol}</div>
              </div>
            ))}
          </div>

          {/* Auto-detection info */}
          {userCountry && countryCurrencyMap[userCountry] && (
            <div className="p-3 border-t border-gray-200 bg-blue-50">
              <div className="flex items-center space-x-2 text-sm text-blue-700">
                <RefreshCw className="h-4 w-4" />
                <span>{t.autoDetected}: {countryCurrencyMap[userCountry]}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;

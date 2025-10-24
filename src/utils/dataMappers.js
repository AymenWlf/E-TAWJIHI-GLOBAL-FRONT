// Utilitaires pour mapper les données entre API et composants

// Données de référence pour les pays
export const countriesData = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo (Brazzaville)', flag: '🇨🇬' },
  { code: 'CD', name: 'Congo (Kinshasa)', flag: '🇨🇩' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czechia', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'KP', name: 'North Korea', flag: '🇰🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }
];

// Données de référence pour les matières (correspondant à SubjectMultiSelect)
export const subjectsData = [
  // Sciences
  { id: 'mathematics', name: 'Mathematics', category: 'Sciences', icon: '🔢' },
  { id: 'physics', name: 'Physics', category: 'Sciences', icon: '⚛️' },
  { id: 'chemistry', name: 'Chemistry', category: 'Sciences', icon: '🧪' },
  { id: 'biology', name: 'Biology', category: 'Sciences', icon: '🧬' },
  { id: 'computer-science', name: 'Computer Science', category: 'Sciences', icon: '💻' },
  { id: 'engineering', name: 'Engineering', category: 'Sciences', icon: '⚙️' },
  { id: 'medicine', name: 'Medicine', category: 'Sciences', icon: '🏥' },
  { id: 'nursing', name: 'Nursing', category: 'Sciences', icon: '🩺' },
  { id: 'pharmacy', name: 'Pharmacy', category: 'Sciences', icon: '💊' },
  { id: 'dentistry', name: 'Dentistry', category: 'Sciences', icon: '🦷' },
  { id: 'veterinary', name: 'Veterinary Science', category: 'Sciences', icon: '🐕' },
  { id: 'agriculture', name: 'Agriculture', category: 'Sciences', icon: '🌾' },
  { id: 'environmental-science', name: 'Environmental Science', category: 'Sciences', icon: '🌍' },
  { id: 'geology', name: 'Geology', category: 'Sciences', icon: '🪨' },
  { id: 'astronomy', name: 'Astronomy', category: 'Sciences', icon: '🔭' },

  // Business & Economics
  { id: 'business-administration', name: 'Business Administration', category: 'Business & Economics', icon: '💼' },
  { id: 'economics', name: 'Economics', category: 'Business & Economics', icon: '📈' },
  { id: 'finance', name: 'Finance', category: 'Business & Economics', icon: '💰' },
  { id: 'accounting', name: 'Accounting', category: 'Business & Economics', icon: '📊' },
  { id: 'marketing', name: 'Marketing', category: 'Business & Economics', icon: '📢' },
  { id: 'management', name: 'Management', category: 'Business & Economics', icon: '👥' },
  { id: 'international-business', name: 'International Business', category: 'Business & Economics', icon: '🌐' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', category: 'Business & Economics', icon: '🚀' },
  { id: 'human-resources', name: 'Human Resources', category: 'Business & Economics', icon: '👤' },
  { id: 'supply-chain', name: 'Supply Chain Management', category: 'Business & Economics', icon: '📦' },

  // Arts & Humanities
  { id: 'literature', name: 'Literature', category: 'Arts & Humanities', icon: '📚' },
  { id: 'history', name: 'History', category: 'Arts & Humanities', icon: '🏛️' },
  { id: 'philosophy', name: 'Philosophy', category: 'Arts & Humanities', icon: '🤔' },
  { id: 'languages', name: 'Languages', category: 'Arts & Humanities', icon: '🗣️' },
  { id: 'linguistics', name: 'Linguistics', category: 'Arts & Humanities', icon: '🔤' },
  { id: 'art', name: 'Art', category: 'Arts & Humanities', icon: '🎨' },
  { id: 'music', name: 'Music', category: 'Arts & Humanities', icon: '🎵' },
  { id: 'theater', name: 'Theater', category: 'Arts & Humanities', icon: '🎭' },
  { id: 'film', name: 'Film Studies', category: 'Arts & Humanities', icon: '🎬' },
  { id: 'design', name: 'Design', category: 'Arts & Humanities', icon: '🎨' },
  { id: 'architecture', name: 'Architecture', category: 'Arts & Humanities', icon: '🏗️' },
  { id: 'journalism', name: 'Journalism', category: 'Arts & Humanities', icon: '📰' },
  { id: 'communication', name: 'Communication', category: 'Arts & Humanities', icon: '📡' },

  // Social Sciences
  { id: 'psychology', name: 'Psychology', category: 'Social Sciences', icon: '🧠' },
  { id: 'sociology', name: 'Sociology', category: 'Social Sciences', icon: '👥' },
  { id: 'anthropology', name: 'Anthropology', category: 'Social Sciences', icon: '🌍' },
  { id: 'political-science', name: 'Political Science', category: 'Social Sciences', icon: '🏛️' },
  { id: 'international-relations', name: 'International Relations', category: 'Social Sciences', icon: '🌐' },
  { id: 'criminology', name: 'Criminology', category: 'Social Sciences', icon: '🔍' },
  { id: 'social-work', name: 'Social Work', category: 'Social Sciences', icon: '🤝' },
  { id: 'education', name: 'Education', category: 'Social Sciences', icon: '📚' },

  // Law & Legal Studies
  { id: 'law', name: 'Law', category: 'Law & Legal Studies', icon: '⚖️' },
  { id: 'criminal-justice', name: 'Criminal Justice', category: 'Law & Legal Studies', icon: '🚔' },
  { id: 'paralegal', name: 'Paralegal Studies', category: 'Law & Legal Studies', icon: '📋' },

  // Technology & IT
  { id: 'information-technology', name: 'Information Technology', category: 'Technology & IT', icon: '💻' },
  { id: 'cybersecurity', name: 'Cybersecurity', category: 'Technology & IT', icon: '🔒' },
  { id: 'data-science', name: 'Data Science', category: 'Technology & IT', icon: '📊' },
  { id: 'artificial-intelligence', name: 'Artificial Intelligence', category: 'Technology & IT', icon: '🤖' },
  { id: 'software-engineering', name: 'Software Engineering', category: 'Technology & IT', icon: '⚙️' },
  { id: 'web-development', name: 'Web Development', category: 'Technology & IT', icon: '🌐' },
  { id: 'game-development', name: 'Game Development', category: 'Technology & IT', icon: '🎮' },

  // Health & Wellness
  { id: 'public-health', name: 'Public Health', category: 'Health & Wellness', icon: '🏥' },
  { id: 'nutrition', name: 'Nutrition', category: 'Health & Wellness', icon: '🥗' },
  { id: 'kinesiology', name: 'Kinesiology', category: 'Health & Wellness', icon: '🏃' },
  { id: 'physical-therapy', name: 'Physical Therapy', category: 'Health & Wellness', icon: '🦵' },
  { id: 'occupational-therapy', name: 'Occupational Therapy', category: 'Health & Wellness', icon: '👋' },

  // Other
  { id: 'sports-science', name: 'Sports Science', category: 'Other', icon: '⚽' },
  { id: 'tourism', name: 'Tourism', category: 'Other', icon: '✈️' },
  { id: 'hospitality', name: 'Hospitality', category: 'Other', icon: '🏨' },
  { id: 'aviation', name: 'Aviation', category: 'Other', icon: '✈️' },
  { id: 'culinary-arts', name: 'Culinary Arts', category: 'Other', icon: '👨‍🍳' }
];

// Fonction pour mapper les chaînes de pays en objets complets
export const mapCountriesFromAPI = (countryStrings) => {
  if (!Array.isArray(countryStrings)) return [];
  
  return countryStrings.map(countryString => {
    // Chercher le pays dans les données de référence
    const foundCountry = countriesData.find(country => 
      country.name === countryString || 
      country.code === countryString
    );
    
    // Si trouvé, retourner l'objet complet, sinon créer un objet par défaut
    return foundCountry || {
      name: countryString,
      code: countryString,
      flag: '🌍'
    };
  });
};

// Fonction pour mapper les chaînes de matières en objets complets
export const mapSubjectsFromAPI = (subjectStrings) => {
  if (!Array.isArray(subjectStrings)) return [];
  
  return subjectStrings.map(subjectString => {
    // Chercher la matière dans les données de référence
    const foundSubject = subjectsData.find(subject => 
      subject.name === subjectString || 
      subject.id === subjectString
    );
    
    // Si trouvée, retourner l'objet complet, sinon créer un objet par défaut
    return foundSubject || {
      id: subjectString.toLowerCase().replace(/\s+/g, '-'),
      name: subjectString,
      category: 'Other',
      icon: '📚'
    };
  });
};

// Fonction pour mapper les objets vers les chaînes pour l'API
export const mapToAPI = (objects) => {
  if (!Array.isArray(objects)) return [];
  
  return objects.map(obj => {
    if (typeof obj === 'string') return obj;
    return obj.name || obj.id || obj.code || obj;
  });
};

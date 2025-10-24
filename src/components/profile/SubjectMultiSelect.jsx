import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check, BookOpen } from 'lucide-react';

const subjects = [
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
  { id: 'political-science', name: 'Political Science', category: 'Social Sciences', icon: '🏛️' },
  { id: 'international-relations', name: 'International Relations', category: 'Social Sciences', icon: '🌍' },
  { id: 'anthropology', name: 'Anthropology', category: 'Social Sciences', icon: '🔍' },
  { id: 'geography', name: 'Geography', category: 'Social Sciences', icon: '🗺️' },
  { id: 'criminology', name: 'Criminology', category: 'Social Sciences', icon: '🔍' },
  { id: 'social-work', name: 'Social Work', category: 'Social Sciences', icon: '🤝' },
  { id: 'education', name: 'Education', category: 'Social Sciences', icon: '🎓' },
  { id: 'public-policy', name: 'Public Policy', category: 'Social Sciences', icon: '📋' },

  // Law
  { id: 'law', name: 'Law', category: 'Law', icon: '⚖️' },
  { id: 'criminal-law', name: 'Criminal Law', category: 'Law', icon: '🚨' },
  { id: 'civil-law', name: 'Civil Law', category: 'Law', icon: '📜' },
  { id: 'international-law', name: 'International Law', category: 'Law', icon: '🌐' },
  { id: 'constitutional-law', name: 'Constitutional Law', category: 'Law', icon: '📜' },
  { id: 'corporate-law', name: 'Corporate Law', category: 'Law', icon: '🏢' },

  // Technology
  { id: 'information-technology', name: 'Information Technology', category: 'Technology', icon: '💻' },
  { id: 'software-engineering', name: 'Software Engineering', category: 'Technology', icon: '⚡' },
  { id: 'data-science', name: 'Data Science', category: 'Technology', icon: '📊' },
  { id: 'artificial-intelligence', name: 'Artificial Intelligence', category: 'Technology', icon: '🤖' },
  { id: 'cybersecurity', name: 'Cybersecurity', category: 'Technology', icon: '🔒' },
  { id: 'web-development', name: 'Web Development', category: 'Technology', icon: '🌐' },
  { id: 'mobile-development', name: 'Mobile Development', category: 'Technology', icon: '📱' },
  { id: 'game-development', name: 'Game Development', category: 'Technology', icon: '🎮' },
  { id: 'network-engineering', name: 'Network Engineering', category: 'Technology', icon: '🌐' },
  { id: 'database-management', name: 'Database Management', category: 'Technology', icon: '🗄️' },

  // Health Sciences
  { id: 'public-health', name: 'Public Health', category: 'Health Sciences', icon: '🏥' },
  { id: 'nutrition', name: 'Nutrition', category: 'Health Sciences', icon: '🥗' },
  { id: 'sports-science', name: 'Sports Science', category: 'Health Sciences', icon: '⚽' },
  { id: 'physiotherapy', name: 'Physiotherapy', category: 'Health Sciences', icon: '🏃' },
  { id: 'occupational-therapy', name: 'Occupational Therapy', category: 'Health Sciences', icon: '🤲' },
  { id: 'speech-therapy', name: 'Speech Therapy', category: 'Health Sciences', icon: '🗣️' },
  { id: 'mental-health', name: 'Mental Health', category: 'Health Sciences', icon: '🧠' },
  { id: 'epidemiology', name: 'Epidemiology', category: 'Health Sciences', icon: '📊' },

  // Other
  { id: 'tourism', name: 'Tourism', category: 'Other', icon: '✈️' },
  { id: 'hospitality', name: 'Hospitality', category: 'Other', icon: '🏨' },
  { id: 'culinary-arts', name: 'Culinary Arts', category: 'Other', icon: '👨‍🍳' },
  { id: 'fashion', name: 'Fashion', category: 'Other', icon: '👗' },
  { id: 'aviation', name: 'Aviation', category: 'Other', icon: '✈️' },
  { id: 'marine-science', name: 'Marine Science', category: 'Other', icon: '🌊' },
  { id: 'forestry', name: 'Forestry', category: 'Other', icon: '🌲' },
  { id: 'mining', name: 'Mining Engineering', category: 'Other', icon: '⛏️' }
];

const SubjectMultiSelect = ({ 
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
  const selectorRef = useRef(null);

  const categories = ['All', ...Array.from(new Set(subjects.map(s => s.category)))];

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || subject.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (subject) => {
    if (value.length >= maxSelections && !value.find(s => s.id === subject.id)) {
      return; // Max selections reached
    }
    
    const isSelected = value.find(s => s.id === subject.id);
    if (isSelected) {
      onChange(value.filter(s => s.id !== subject.id));
    } else {
      onChange([...value, subject]);
    }
  };

  const handleRemove = (subjectId) => {
    onChange(value.filter(s => s.id !== subjectId));
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

  const t = {
    selectSubjects: language === 'en' ? 'Select Subjects' : 'Sélectionner des Matières',
    searchSubjects: language === 'en' ? 'Search subjects...' : 'Rechercher des matières...',
    noResults: language === 'en' ? 'No subjects found' : 'Aucune matière trouvée',
    maxSelections: language === 'en' ? `Maximum ${maxSelections} selections` : `Maximum ${maxSelections} sélections`,
    clearAll: language === 'en' ? 'Clear All' : 'Tout Effacer',
    allCategories: language === 'en' ? 'All Categories' : 'Toutes les Catégories'
  };

  return (
    <div className={`relative ${className}`} ref={selectorRef}>
      {/* Selected Subjects Display */}
      {value.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
            >
              <span className="mr-2">{subject.icon}</span>
              <span>{subject.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(subject.id)}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              {t.clearAll}
            </button>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder || t.selectSubjects}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 pr-10"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Max Selections Warning */}
      {value.length >= maxSelections && (
        <p className="text-xs text-amber-600 mt-1">
          {t.maxSelections}
        </p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl shadow-lg mt-1 max-h-80 overflow-hidden">
          {/* Category Filter */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Subjects List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => {
                const isSelected = value.find(s => s.id === subject.id);
                const isDisabled = value.length >= maxSelections && !isSelected;
                
                return (
                  <div
                    key={subject.id}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : isDisabled 
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                    onClick={() => !isDisabled && handleSelect(subject)}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{subject.icon}</span>
                      <div>
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-xs text-gray-500">{subject.category}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>{t.noResults}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectMultiSelect;

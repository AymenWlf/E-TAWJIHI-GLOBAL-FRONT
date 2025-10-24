import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Search, Filter, ChevronDown, ChevronUp, 
  Star, Clock, MessageSquare, Phone, Mail, ExternalLink,
  BookOpen, Users, Globe, Award, Shield, Zap
} from 'lucide-react';
import faqService, { FAQ } from '../../services/faqService';
import { 
  FAQ_CATEGORIES, 
  getFAQCategory,
  getFAQCategoryColor
} from '../../types/faqTypes';

interface FAQSectionProps {
  language: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ language }) => {
  const [faqs, setFaqs] = useState<{ [key: string]: FAQ[] }>({});
  const [popularFaqs, setPopularFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showPopular, setShowPopular] = useState(true);
  const [searchResults, setSearchResults] = useState<FAQ[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const currentLanguage = language;

  // Load FAQs
  useEffect(() => {
    loadFAQs();
    loadPopularFAQs();
  }, [selectedCategory]);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchFAQs(searchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm]);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await faqService.getFAQs(currentLanguage, selectedCategory);
      setFaqs(response.data as { [key: string]: FAQ[] });
    } catch (err: any) {
      setError(err.message || 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const loadPopularFAQs = async () => {
    try {
      const response = await faqService.getPopularFAQs(currentLanguage);
      setPopularFaqs(response.data as FAQ[]);
    } catch (err: any) {
      console.error('Failed to load popular FAQs:', err);
    }
  };

  const searchFAQs = async (term: string) => {
    try {
      setIsSearching(true);
      const response = await faqService.searchFAQs(term, currentLanguage);
      setSearchResults(response.data as FAQ[]);
    } catch (err: any) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFAQClick = (faqId: number) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const renderFAQItem = (faq: FAQ) => {
    const isExpanded = expandedFAQ === faq.id;
    const category = getFAQCategory(faq.category, currentLanguage);
    
    return (
      <div
        key={faq.id}
        className="border border-gray-200 rounded-lg mb-3 hover:shadow-md transition-shadow"
      >
        <button
          onClick={() => handleFAQClick(faq.id)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start space-x-3 flex-1">
            <div className={`w-8 h-8 ${faq.color || getFAQCategoryColor(faq.category)} rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0`}>
              {faq.icon || category?.icon || '❓'}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {faq.question}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className={`px-2 py-1 rounded-full ${getFAQCategoryColor(faq.category)} text-white`}>
                  {category ? (currentLanguage === 'en' ? category.name : category.nameFr) : faq.category}
                </span>
                {faq.isPopular && (
                  <span className="flex items-center space-x-1 text-yellow-600">
                    <Star className="w-3 h-3" />
                    <span>{currentLanguage === 'en' ? 'Popular' : 'Populaire'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
          )}
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="pt-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContactInfo = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
        {currentLanguage === 'en' ? 'Still Need Help?' : 'Besoin d\'Aide Supplémentaire ?'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              {currentLanguage === 'en' ? 'Submit a Complaint' : 'Soumettre une Réclamation'}
            </h4>
            <p className="text-xs text-gray-500">
              {currentLanguage === 'en' ? 'Get personalized help' : 'Obtenez une aide personnalisée'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              {currentLanguage === 'en' ? 'Call Us' : 'Appelez-nous'}
            </h4>
            <p className="text-xs text-gray-500">+212 655 690 632</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              {currentLanguage === 'en' ? 'Email Support' : 'Support Email'}
            </h4>
            <p className="text-xs text-gray-500">support@etawjihi.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentLanguage === 'en' ? 'Frequently Asked Questions' : 'Questions Fréquemment Posées'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentLanguage === 'en' 
                ? 'Find answers to common questions about our services' 
                : 'Trouvez des réponses aux questions courantes sur nos services'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              {currentLanguage === 'en' ? 'Help Center' : 'Centre d\'Aide'}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={currentLanguage === 'en' ? 'Search FAQs...' : 'Rechercher dans les FAQ...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{currentLanguage === 'en' ? 'All Categories' : 'Toutes les Catégories'}</option>
              {FAQ_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {currentLanguage === 'en' ? category.name : category.nameFr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              {currentLanguage === 'en' ? 'Loading FAQs...' : 'Chargement des FAQ...'}
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentLanguage === 'en' ? 'Error loading FAQs' : 'Erreur de chargement des FAQ'}
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={loadFAQs}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentLanguage === 'en' ? 'Retry' : 'Réessayer'}
            </button>
          </div>
        ) : (
          <>
            {/* Search Results */}
            {searchTerm && searchResults.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentLanguage === 'en' ? 'Search Results' : 'Résultats de Recherche'} 
                  ({searchResults.length})
                </h3>
                <div className="space-y-3">
                  {searchResults.map(renderFAQItem)}
                </div>
              </div>
            )}

            {/* No Search Results */}
            {searchTerm && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {currentLanguage === 'en' ? 'No results found' : 'Aucun résultat trouvé'}
                </h3>
                <p className="text-gray-500">
                  {currentLanguage === 'en' 
                    ? `No FAQs found for "${searchTerm}". Try different keywords.` 
                    : `Aucune FAQ trouvée pour "${searchTerm}". Essayez d'autres mots-clés.`
                  }
                </p>
              </div>
            )}

            {/* Popular FAQs */}
            {!searchTerm && showPopular && popularFaqs.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    {currentLanguage === 'en' ? 'Popular Questions' : 'Questions Populaires'}
                  </h3>
                  <button
                    onClick={() => setShowPopular(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {currentLanguage === 'en' ? 'Hide' : 'Masquer'}
                  </button>
                </div>
                <div className="space-y-3">
                  {popularFaqs.map(renderFAQItem)}
                </div>
              </div>
            )}

            {/* Category FAQs */}
            {!searchTerm && (
              <div className="space-y-8">
                {Object.entries(faqs).map(([categoryId, categoryFAQs]) => {
                  const category = getFAQCategory(categoryId, currentLanguage);
                  if (!category || categoryFAQs.length === 0) return null;

                  return (
                    <div key={categoryId}>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {currentLanguage === 'en' ? category.name : category.nameFr}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {currentLanguage === 'en' ? category.description : category.descriptionFr}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {categoryFAQs.map(renderFAQItem)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Contact Info */}
            {renderContactInfo()}
          </>
        )}
      </div>
    </div>
  );
};

export default FAQSection;

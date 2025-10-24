import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, Plus, Filter, Search, ChevronDown, ChevronUp, 
  Eye, X, CheckCircle
} from 'lucide-react';
import suggestionService, { Suggestion } from '../../services/suggestionService';
import { 
  SUGGESTION_CATEGORIES, 
  SUGGESTION_PRIORITIES,
  SUGGESTION_STATUSES,
  getSuggestionCategory,
  getSuggestionStatusColor,
  getSuggestionPriorityColor
} from '../../types/suggestionTypes';

interface SuggestionsSectionProps {
  language: string;
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ language }) => {
  const [mySuggestions, setMySuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [searchResults, setSearchResults] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const currentLanguage = language;

  // Load suggestions
  useEffect(() => {
    loadMySuggestions();
  }, [selectedCategory, selectedStatus]);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchSuggestions(searchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm]);

  const loadMySuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await suggestionService.getMySuggestions();
      setMySuggestions(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load my suggestions');
    } finally {
      setLoading(false);
    }
  };

  const searchSuggestions = async (term: string) => {
    try {
      setIsSearching(true);
      const response = await suggestionService.searchSuggestions(term);
      setSearchResults(response.data);
    } catch (err: any) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateSuggestion = async (suggestionData: any) => {
    try {
      await suggestionService.createSuggestion(suggestionData);
      setShowCreateModal(false);
      loadMySuggestions();
    } catch (err: any) {
      setError(err.message || 'Failed to create suggestion');
    }
  };


  const handleViewSuggestion = async (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderSuggestionItem = (suggestion: Suggestion) => {
    const isExpanded = expandedSuggestion === suggestion.id;
    const category = getSuggestionCategory(suggestion.category, currentLanguage);
    
    return (
      <div
        key={suggestion.id}
        className="border border-gray-200 rounded-lg mb-4 hover:shadow-md transition-shadow"
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`w-10 h-10 ${suggestion.color || category?.color || 'bg-gray-500'} rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0`}>
                {suggestion.icon || category?.icon || '💡'}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {suggestion.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSuggestionStatusColor(suggestion.status)}`}>
                    {currentLanguage === 'en' 
                      ? SUGGESTION_STATUSES.find(s => s.id === suggestion.status)?.name || suggestion.status
                      : SUGGESTION_STATUSES.find(s => s.id === suggestion.status)?.nameFr || suggestion.status
                    }
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSuggestionPriorityColor(suggestion.priority)}`}>
                    {currentLanguage === 'en' 
                      ? SUGGESTION_PRIORITIES.find(p => p.id === suggestion.priority)?.name || suggestion.priority
                      : SUGGESTION_PRIORITIES.find(p => p.id === suggestion.priority)?.nameFr || suggestion.priority
                    }
                  </span>
                  <span className="text-xs text-gray-400">
                    {suggestion.userName} • {formatDate(suggestion.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleViewSuggestion(suggestion)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={currentLanguage === 'en' ? 'View Details' : 'Voir les Détails'}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-3 line-clamp-2">
            {suggestion.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${category?.color || 'bg-gray-500'}`}></span>
                <span>{category ? (currentLanguage === 'en' ? category.name : category.nameFr) : suggestion.category}</span>
              </span>
            </div>

            <button
              onClick={() => setExpandedSuggestion(isExpanded ? null : suggestion.id)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>{currentLanguage === 'en' ? (isExpanded ? 'Show Less' : 'Show More') : (isExpanded ? 'Voir Moins' : 'Voir Plus')}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="pt-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {suggestion.description}
                </p>
              </div>
              
              {suggestion.adminResponse && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    {currentLanguage === 'en' ? 'Admin Response' : 'Réponse de l\'Administrateur'}
                  </h4>
                  <p className="text-sm text-blue-800">{suggestion.adminResponse}</p>
                  {suggestion.adminResponseDate && (
                    <p className="text-xs text-blue-600 mt-2">
                      {formatDate(suggestion.adminResponseDate)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const currentSuggestions = searchTerm ? searchResults : mySuggestions;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentLanguage === 'en' ? 'My Suggestions' : 'Mes Suggestions'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentLanguage === 'en' 
                ? 'Share your ideas to improve our platform' 
                : 'Partagez vos idées pour améliorer notre plateforme'
              }
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{currentLanguage === 'en' ? 'New Suggestion' : 'Nouvelle Suggestion'}</span>
          </button>
        </div>
      </div>


      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={currentLanguage === 'en' ? 'Search suggestions...' : 'Rechercher des suggestions...'}
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
              {SUGGESTION_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {currentLanguage === 'en' ? category.name : category.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{currentLanguage === 'en' ? 'All Status' : 'Tous les Statuts'}</option>
              {SUGGESTION_STATUSES.map(status => (
                <option key={status.id} value={status.id}>
                  {currentLanguage === 'en' ? status.name : status.nameFr}
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
              {currentLanguage === 'en' ? 'Loading suggestions...' : 'Chargement des suggestions...'}
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentLanguage === 'en' ? 'Error loading suggestions' : 'Erreur de chargement des suggestions'}
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={loadSuggestions}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentLanguage === 'en' ? 'Retry' : 'Réessayer'}
            </button>
          </div>
        ) : currentSuggestions.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentLanguage === 'en' ? 'No suggestions found' : 'Aucune suggestion trouvée'}
            </h3>
            <p className="text-gray-500 mb-4">
              {currentLanguage === 'en' 
                ? 'Be the first to share your ideas for improving our platform!' 
                : 'Soyez le premier à partager vos idées pour améliorer notre plateforme !'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentLanguage === 'en' ? 'Submit First Suggestion' : 'Soumettre Première Suggestion'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {currentSuggestions.map(suggestion => renderSuggestionItem(suggestion))}
          </div>
        )}
      </div>

      {/* Create Suggestion Modal */}
      {showCreateModal && (
        <CreateSuggestionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSuggestion}
          language={currentLanguage}
        />
      )}

      {/* Suggestion Detail Modal */}
      {showDetailModal && selectedSuggestion && (
        <SuggestionDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          suggestion={selectedSuggestion}
          language={currentLanguage}
        />
      )}
    </div>
  );
};

// Create Suggestion Modal Component
const CreateSuggestionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  language: string;
}> = ({ isOpen, onClose, onSubmit, language }) => {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    priority: 'medium',
    isAnonymous: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category && formData.title && formData.description) {
      onSubmit(formData);
      setFormData({ category: '', title: '', description: '', priority: 'medium', isAnonymous: false });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Submit New Suggestion' : 'Soumettre une Nouvelle Suggestion'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Category' : 'Catégorie'} *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">{language === 'en' ? 'Select a category' : 'Sélectionner une catégorie'}</option>
              {SUGGESTION_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {language === 'en' ? category.name : category.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Title' : 'Titre'} *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Brief title for your suggestion' : 'Titre bref pour votre suggestion'}
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Priority' : 'Priorité'}
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {SUGGESTION_PRIORITIES.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {language === 'en' ? priority.name : priority.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Description' : 'Description'} *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Detailed description of your suggestion...' : 'Description détaillée de votre suggestion...'}
              required
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
                {language === 'en' ? 'Submit anonymously' : 'Soumettre anonymement'}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {language === 'en' ? 'Submit Suggestion' : 'Soumettre la Suggestion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Suggestion Detail Modal Component
const SuggestionDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  suggestion: Suggestion;
  language: string;
}> = ({ isOpen, onClose, suggestion, language }) => {
  if (!isOpen) return null;

  const category = getSuggestionCategory(suggestion.category, language);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {suggestion.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Suggestion Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Status' : 'Statut'}:
              </span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSuggestionStatusColor(suggestion.status)}`}>
                {language === 'en' 
                  ? SUGGESTION_STATUSES.find(s => s.id === suggestion.status)?.name || suggestion.status
                  : SUGGESTION_STATUSES.find(s => s.id === suggestion.status)?.nameFr || suggestion.status
                }
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Priority' : 'Priorité'}:
              </span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSuggestionPriorityColor(suggestion.priority)}`}>
                {language === 'en' 
                  ? SUGGESTION_PRIORITIES.find(p => p.id === suggestion.priority)?.name || suggestion.priority
                  : SUGGESTION_PRIORITIES.find(p => p.id === suggestion.priority)?.nameFr || suggestion.priority
                }
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Category' : 'Catégorie'}:
              </span>
              <span className="ml-2 text-sm text-gray-600">
                {category ? (language === 'en' ? category.name : category.nameFr) : suggestion.category}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Votes' : 'Votes'}:
              </span>
              <span className="ml-2 text-sm text-gray-600">{suggestion.votes}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {language === 'en' ? 'Description' : 'Description'}
          </h4>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{suggestion.description}</p>
        </div>

        {/* Admin Response */}
        {suggestion.adminResponse && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'Admin Response' : 'Réponse de l\'Administrateur'}
            </h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700">{suggestion.adminResponse}</p>
              {suggestion.adminResponseDate && (
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(suggestion.adminResponseDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionsSection;

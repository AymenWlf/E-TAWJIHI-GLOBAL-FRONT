import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Plus, Filter, Search, Clock, 
  AlertCircle, CheckCircle, XCircle, Eye, 
  MessageCircle, Send, Paperclip, X, ChevronDown, ChevronUp, Phone
} from 'lucide-react';
import complaintService, { Complaint, ComplaintMessage } from '../../services/complaintService';
import { 
  COMPLAINT_CATEGORIES, 
  COMPLAINT_PRIORITIES, 
  COMPLAINT_STATUSES,
  getComplaintStatusColor,
  getComplaintPriorityColor,
  getComplaintCategory
} from '../../types/complaintTypes';

interface MyComplaintsSectionProps {
  language: string;
}

const MyComplaintsSection: React.FC<MyComplaintsSectionProps> = ({ language }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [expandedComplaint, setExpandedComplaint] = useState<number | null>(null);

  const currentLanguage = language;

  // Load complaints
  useEffect(() => {
    loadComplaints();
  }, [selectedStatus, selectedCategory]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await complaintService.getComplaints(
        selectedStatus !== 'all' ? selectedStatus : undefined,
        selectedCategory !== 'all' ? selectedCategory : undefined
      );
      setComplaints(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComplaint = async (complaintData: any) => {
    try {
      await complaintService.createComplaint(complaintData);
      setShowCreateModal(false);
      loadComplaints();
    } catch (err: any) {
      setError(err.message || 'Failed to create complaint');
    }
  };

  const handleViewComplaint = async (complaint: Complaint) => {
    try {
      const response = await complaintService.getComplaint(complaint.id);
      setSelectedComplaint(response.data);
      setShowDetailModal(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load complaint details');
    }
  };

  const handleAddMessage = async () => {
    if (!selectedComplaint || !newMessage.trim()) return;

    try {
      await complaintService.addMessage(selectedComplaint.id, {
        message: newMessage.trim()
      });
      setNewMessage('');
      // Reload complaint details
      const response = await complaintService.getComplaint(selectedComplaint.id);
      setSelectedComplaint(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to add message');
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentLanguage === 'en' ? 'My Complaints' : 'Mes Réclamations'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentLanguage === 'en' 
                ? 'Submit and track your complaints and issues' 
                : 'Soumettez et suivez vos réclamations et problèmes'
              }
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{currentLanguage === 'en' ? 'New Complaint' : 'Nouvelle Réclamation'}</span>
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
                placeholder={currentLanguage === 'en' ? 'Search complaints...' : 'Rechercher des réclamations...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{currentLanguage === 'en' ? 'All Status' : 'Tous les Statuts'}</option>
              {COMPLAINT_STATUSES.map(status => (
                <option key={status.id} value={status.id}>
                  {currentLanguage === 'en' ? status.name : status.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{currentLanguage === 'en' ? 'All Categories' : 'Toutes les Catégories'}</option>
              {COMPLAINT_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {currentLanguage === 'en' ? category.name : category.nameFr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              {currentLanguage === 'en' ? 'Loading complaints...' : 'Chargement des réclamations...'}
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentLanguage === 'en' ? 'Error loading complaints' : 'Erreur de chargement des réclamations'}
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={loadComplaints}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentLanguage === 'en' ? 'Retry' : 'Réessayer'}
            </button>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentLanguage === 'en' ? 'No complaints found' : 'Aucune réclamation trouvée'}
            </h3>
            <p className="text-gray-500 mb-4">
              {currentLanguage === 'en' 
                ? 'You haven\'t submitted any complaints yet.' 
                : 'Vous n\'avez pas encore soumis de réclamations.'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentLanguage === 'en' ? 'Submit First Complaint' : 'Soumettre Première Réclamation'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => {
              const category = getComplaintCategory(complaint.category, currentLanguage);
              return (
                <div
                  key={complaint.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 ${category?.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                          {category?.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {complaint.subject}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {category ? (currentLanguage === 'en' ? category.name : category.nameFr) : complaint.category}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {complaint.description}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(complaint.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplaintStatusColor(complaint.status)}`}>
                            {currentLanguage === 'en' 
                              ? COMPLAINT_STATUSES.find(s => s.id === complaint.status)?.name || complaint.status
                              : COMPLAINT_STATUSES.find(s => s.id === complaint.status)?.nameFr || complaint.status
                            }
                          </span>
                        </span>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplaintPriorityColor(complaint.priority)}`}>
                          {currentLanguage === 'en' 
                            ? COMPLAINT_PRIORITIES.find(p => p.id === complaint.priority)?.name || complaint.priority
                            : COMPLAINT_PRIORITIES.find(p => p.id === complaint.priority)?.nameFr || complaint.priority
                          }
                        </span>

                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{complaint.messageCount}</span>
                        </span>

                        <span>{formatDate(complaint.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleViewComplaint(complaint)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title={currentLanguage === 'en' ? 'View Details' : 'Voir les Détails'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="p-6 border-t border-gray-200 bg-red-50">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex-shrink-0">
            <Phone className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-red-900">
              {currentLanguage === 'en' ? 'Emergency Contact' : 'Contact d\'Urgence'}
            </h4>
            <p className="text-sm text-red-700 mt-1">
              {currentLanguage === 'en' 
                ? 'For urgent matters, call us directly:' 
                : 'Pour les questions urgentes, appelez-nous directement :'
              }
            </p>
            <a 
              href="tel:+212655690632" 
              className="text-lg font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              +212 655 690 632
            </a>
          </div>
        </div>
      </div>

      {/* Create Complaint Modal */}
      {showCreateModal && (
        <CreateComplaintModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateComplaint}
          language={currentLanguage}
        />
      )}

      {/* Complaint Detail Modal */}
      {showDetailModal && selectedComplaint && (
        <ComplaintDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          complaint={selectedComplaint}
          onAddMessage={handleAddMessage}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          language={currentLanguage}
        />
      )}
    </div>
  );
};

// Create Complaint Modal Component
const CreateComplaintModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  language: string;
}> = ({ isOpen, onClose, onSubmit, language }) => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category && formData.subject && formData.description) {
      onSubmit(formData);
      setFormData({ category: '', subject: '', description: '', priority: 'medium' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Submit New Complaint' : 'Soumettre une Nouvelle Réclamation'}
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
              {COMPLAINT_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {language === 'en' ? category.name : category.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Subject' : 'Sujet'} *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Brief description of the issue' : 'Brève description du problème'}
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
              {COMPLAINT_PRIORITIES.map(priority => (
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
              placeholder={language === 'en' ? 'Detailed description of the issue...' : 'Description détaillée du problème...'}
              required
            />
          </div>

          {/* Response Time Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  {language === 'en' ? 'Response Time' : 'Délai de Réponse'}
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  {language === 'en' 
                    ? 'You will receive a response to your complaint via email within 48 business hours.'
                    : 'Vous recevrez une réponse à votre réclamation par email dans les 48 heures ouvrables.'
                  }
                </p>
              </div>
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
              {language === 'en' ? 'Submit Complaint' : 'Soumettre la Réclamation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Complaint Detail Modal Component
const ComplaintDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint;
  onAddMessage: () => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  language: string;
}> = ({ isOpen, onClose, complaint, onAddMessage, newMessage, setNewMessage, language }) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {complaint.subject}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Complaint Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Status' : 'Statut'}:
              </span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getComplaintStatusColor(complaint.status)}`}>
                {language === 'en' 
                  ? COMPLAINT_STATUSES.find(s => s.id === complaint.status)?.name || complaint.status
                  : COMPLAINT_STATUSES.find(s => s.id === complaint.status)?.nameFr || complaint.status
                }
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Priority' : 'Priorité'}:
              </span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getComplaintPriorityColor(complaint.priority)}`}>
                {language === 'en' 
                  ? COMPLAINT_PRIORITIES.find(p => p.id === complaint.priority)?.name || complaint.priority
                  : COMPLAINT_PRIORITIES.find(p => p.id === complaint.priority)?.nameFr || complaint.priority
                }
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Created' : 'Créé'}:
              </span>
              <span className="ml-2 text-sm text-gray-600">{formatDate(complaint.createdAt)}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Last Updated' : 'Dernière Mise à Jour'}:
              </span>
              <span className="ml-2 text-sm text-gray-600">{formatDate(complaint.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {language === 'en' ? 'Description' : 'Description'}
          </h4>
          <p className="text-gray-600">{complaint.description}</p>
        </div>

        {/* Admin Response */}
        {complaint.adminResponse && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'Admin Response' : 'Réponse de l\'Administrateur'}
            </h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700">{complaint.adminResponse}</p>
              {complaint.adminResponseDate && (
                <p className="text-sm text-gray-500 mt-2">
                  {formatDate(complaint.adminResponseDate)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        {complaint.messages && complaint.messages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Conversation' : 'Conversation'}
            </h4>
            <div className="space-y-4">
              {complaint.messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.isFromAdmin 
                      ? 'bg-blue-50 border border-blue-200 ml-8' 
                      : 'bg-gray-50 border border-gray-200 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700">{message.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Message */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            {language === 'en' ? 'Add Message' : 'Ajouter un Message'}
          </h4>
          <div className="flex space-x-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Type your message...' : 'Tapez votre message...'}
            />
            <button
              onClick={onAddMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComplaintsSection;

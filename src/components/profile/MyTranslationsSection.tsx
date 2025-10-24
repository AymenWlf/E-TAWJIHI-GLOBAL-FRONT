import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Eye, Clock, CheckCircle,
  XCircle, AlertCircle, Filter, Search, Plus, CreditCard, Loader2, Trash2, HelpCircle
} from 'lucide-react';
import { 
  TranslationRequest, 
  getTranslationStatus, 
  getPaymentStatus, 
  getLanguageName,
  getDocumentType
} from '../../types/translationTypes';
import translationService, { Translation } from '../../services/translationService';

interface MyTranslationsSectionProps {
  language: string;
  onNewTranslation: () => void;
  refreshTrigger?: number; // Add refresh trigger prop
}

const MyTranslationsSection: React.FC<MyTranslationsSectionProps> = ({
  language,
  onNewTranslation,
  refreshTrigger
}) => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingPayment, setPendingPayment] = useState<{ totalAmount: number; count: number }>({ totalAmount: 0, count: 0 });
  const [filteredTranslations, setFilteredTranslations] = useState<Translation[]>([]);

  // Load translations from backend
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [translationsResponse, pendingPaymentResponse] = await Promise.all([
          translationService.getTranslations(),
          translationService.getPendingPayment()
        ]);

        if (translationsResponse.success) {
          setTranslations(translationsResponse.data);
        }

        if (pendingPaymentResponse.success) {
          setPendingPayment({
            totalAmount: pendingPaymentResponse.data.totalAmount,
            count: pendingPaymentResponse.data.count
          });
        }
      } catch (error: any) {
        setError(error.message || 'Failed to load translations');
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [refreshTrigger]);

  useEffect(() => {
    let filtered = translations;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(translation => translation.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(translation => 
        translation.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLanguageName(translation.originalLanguage, language).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLanguageName(translation.targetLanguage, language).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTranslations(filtered);
  }, [translations, filterStatus, searchTerm, language]);

  const handleViewDocument = async (translation: Translation, type: 'original' | 'translated') => {
    try {
      if (type === 'original') {
        await translationService.viewOriginal(translation.id);
      } else {
        await translationService.viewTranslated(translation.id);
      }
    } catch (error: any) {
      console.error('Error viewing document:', error);
      alert(error.message || 'Failed to view document');
    }
  };

  const handleDownloadDocument = async (translation: Translation, type: 'original' | 'translated') => {
    try {
      if (type === 'original') {
        await translationService.downloadOriginal(translation.id);
      } else {
        await translationService.downloadTranslated(translation.id);
      }
    } catch (error: any) {
      console.error('Error downloading document:', error);
      alert(error.message || 'Failed to download document');
    }
  };

  const handlePayPending = async () => {
    try {
      const response = await translationService.payPendingTranslations();
      if (response.success) {
        // Reload translations to update payment status
        const translationsResponse = await translationService.getTranslations();
        if (translationsResponse.success) {
          setTranslations(translationsResponse.data);
        }
        
        const pendingPaymentResponse = await translationService.getPendingPayment();
        if (pendingPaymentResponse.success) {
          setPendingPayment({
            totalAmount: pendingPaymentResponse.data.totalAmount,
            count: pendingPaymentResponse.data.count
          });
        }
        
        alert(language === 'en' ? 'Payment processed successfully!' : 'Paiement traité avec succès!');
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      alert(error.message || 'Failed to process payment');
    }
  };

  const handleDeleteTranslation = async (translation: Translation) => {
    if (translation.paymentStatus === 'paid') {
      alert(language === 'en' 
        ? 'Cannot delete a paid translation'
        : 'Impossible de supprimer une traduction payée'
      );
      return;
    }

    const confirmMessage = language === 'en'
      ? `Are you sure you want to delete the translation of "${translation.originalFilename}"?`
      : `Êtes-vous sûr de vouloir supprimer la traduction de "${translation.originalFilename}" ?`;

    if (window.confirm(confirmMessage)) {
      try {
        const response = await translationService.deleteTranslation(translation.id);
        if (response.success) {
          // Reload translations
          const translationsResponse = await translationService.getTranslations();
          if (translationsResponse.success) {
            setTranslations(translationsResponse.data);
          }
          
          const pendingPaymentResponse = await translationService.getPendingPayment();
          if (pendingPaymentResponse.success) {
            setPendingPayment({
              totalAmount: pendingPaymentResponse.data.totalAmount,
              count: pendingPaymentResponse.data.count
            });
          }
        }
      } catch (error: any) {
        console.error('Error deleting translation:', error);
        alert(error.message || 'Failed to delete translation');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'awaiting_payment':
        return <CreditCard className="w-5 h-5 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    
    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '-';
    }
    
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-600">
            {language === 'en' ? 'Loading translations...' : 'Chargement des traductions...'}
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {language === 'en' ? 'Error Loading Translations' : 'Erreur de Chargement des Traductions'}
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {language === 'en' ? 'Retry' : 'Réessayer'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'My Translations' : 'Mes Traductions'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Manage your document translation requests and track their progress'
              : 'Gérez vos demandes de traduction de documents et suivez leur progression'
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              // Navigate to My Complaints section
              const complaintsSection = document.getElementById('my-complaints');
              if (complaintsSection) {
                complaintsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center space-x-2 px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'en' ? 'Help Center' : 'Centre d\'Aide'}</span>
          </button>
          <button
            onClick={onNewTranslation}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'en' ? 'New Translation' : 'Nouvelle Traduction'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {filteredTranslations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  {language === 'en' ? 'Total Requests' : 'Total Demandes'}
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {filteredTranslations.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  {language === 'en' ? 'Completed' : 'Terminées'}
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {filteredTranslations.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">
                  {language === 'en' ? 'In Progress' : 'En Cours'}
                </p>
                <p className="text-2xl font-bold text-yellow-900">
                  {filteredTranslations.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">
                  {language === 'en' ? 'Unpaid Total' : 'Total Non Payé'}
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {filteredTranslations
                    .filter(t => t.paymentStatus === 'pending')
                    .reduce((sum, t) => sum + t.totalPrice, 0)
                    .toLocaleString()} MAD
                </p>
              </div>
              <div className="text-purple-500 font-bold text-lg">₵</div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Section */}
      {pendingPayment.count > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Pay for Unpaid Translations' : 'Payer les Traductions Non Payées'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? `You have ${pendingPayment.count} unpaid translation(s)`
                  : `Vous avez ${pendingPayment.count} traduction(s) non payée(s)`
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Total to Pay' : 'Total à Payer'}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {pendingPayment.totalAmount.toLocaleString()} MAD
                </p>
              </div>
              <button
                onClick={handlePayPending}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>{language === 'en' ? 'Pay Now' : 'Payer Maintenant'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search translations...' : 'Rechercher des traductions...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{language === 'en' ? 'All Status' : 'Tous les Statuts'}</option>
            <option value="pending">{language === 'en' ? 'Pending' : 'En Attente'}</option>
            <option value="in_progress">{language === 'en' ? 'In Progress' : 'En Cours'}</option>
            <option value="completed">{language === 'en' ? 'Completed' : 'Terminé'}</option>
            <option value="cancelled">{language === 'en' ? 'Cancelled' : 'Annulé'}</option>
          </select>
        </div>
      </div>

      {/* Translations List */}
      {filteredTranslations.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {language === 'en' ? 'No translations found' : 'Aucune traduction trouvée'}
          </h3>
          <p className="text-gray-500 mb-4">
            {language === 'en' 
              ? 'Start by requesting a new document translation'
              : 'Commencez par demander une nouvelle traduction de document'
            }
          </p>
          <button
            onClick={onNewTranslation}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'en' ? 'Request Translation' : 'Demander une Traduction'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTranslations.map((translation) => {
            const translationStatus = getTranslationStatus(translation.status, language);
            const paymentStatus = getPaymentStatus(translation.paymentStatus, language);
            
            return (
              <div key={translation.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {translation.originalFilename}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Document and Price Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Document Information */}
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                        {language === 'en' ? 'Document Information' : 'Informations du Document'}
                      </h4>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Type:' : 'Type:'}
                          </span>
                          <span className="font-medium text-right">
                            {getDocumentType(translation.documentType)?.[language === 'en' ? 'name' : 'nameFr']}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Pages:' : 'Pages:'}
                          </span>
                          <span className="font-medium">
                            {translation.numberOfPages} {language === 'en' ? 'page(s)' : 'page(s)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Language:' : 'Langue:'}
                          </span>
                          <span className="font-medium text-right">
                            {getLanguageName(translation.originalLanguage, language)} → {getLanguageName(translation.targetLanguage, language)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                        {language === 'en' ? 'Price Breakdown' : 'Détail des Prix'}
                      </h4>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Base price per page:' : 'Prix de base par page:'}
                          </span>
                          <span className="font-medium">
                            {getDocumentType(translation.documentType)?.basePrice} MAD
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Price per page:' : 'Prix par page:'}
                          </span>
                          <span className="font-medium">
                            {translation.pricePerPage} MAD
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Number of pages:' : 'Nombre de pages:'}
                          </span>
                          <span className="font-medium">{translation.numberOfPages}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between text-base sm:text-lg font-bold">
                          <span className="text-gray-900">
                            {language === 'en' ? 'Total:' : 'Total:'}
                          </span>
                          <span className="text-blue-600">
                            {translation.totalPrice.toLocaleString()} {translation.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status and Dates */}
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(translation.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${translationStatus.bgColor} ${translationStatus.color}`}>
                        {translationStatus[language as keyof typeof translationStatus]}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${paymentStatus.color.replace('text-', 'bg-')}`}></div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatus.bgColor} ${paymentStatus.color}`}>
                        {paymentStatus[language as keyof typeof paymentStatus]}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      {language === 'en' ? 'Created' : 'Créé'} {formatDate(translation.createdAt)}
                    </div>
                    {translation.deliveryDate && (
                      <div className="text-gray-500">
                        {language === 'en' ? 'Delivery' : 'Livraison'} {formatDate(translation.deliveryDate)}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col space-y-3">
                    {/* Original Document Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDocument(translation, 'original')}
                        className="flex items-center space-x-1 px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-xs sm:text-sm"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{language === 'en' ? 'View' : 'Voir'}</span>
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(translation, 'original')}
                        className="flex items-center space-x-1 px-3 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-xs sm:text-sm"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{language === 'en' ? 'Download' : 'Télécharger'}</span>
                      </button>
                      {translation.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => handleDeleteTranslation(translation)}
                          className="flex items-center space-x-1 px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-xs sm:text-sm"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{language === 'en' ? 'Delete' : 'Supprimer'}</span>
                        </button>
                      )}
                    </div>
                    
                    {/* Translated Document Actions */}
                    {translation.status === 'completed' && translation.translatedDocumentUrl && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewDocument(translation, 'translated')}
                          className="flex items-center space-x-1 px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-xs sm:text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{language === 'en' ? 'View Translated' : 'Voir Traduit'}</span>
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(translation, 'translated')}
                          className="flex items-center space-x-1 px-3 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-xs sm:text-sm"
                        >
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{language === 'en' ? 'Download Translated' : 'Télécharger Traduit'}</span>
                        </button>
                      </div>
                    )}
                    
                    {/* Payment Action */}
                    {translation.paymentStatus === 'pending' && (
                      <button className="flex items-center justify-center space-x-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-xs sm:text-sm">
                        <span>{language === 'en' ? 'Complete Payment' : 'Finaliser Paiement'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTranslationsSection;

import React, { useState, useEffect } from 'react';
import { 
  User, Globe, GraduationCap, FileText, 
  Eye, Download, Trash2, Upload, Plus, Edit,
  Calendar, AlertCircle, CheckCircle, Clock 
} from 'lucide-react';
import { 
  DOCUMENT_CATEGORIES, 
  DOCUMENT_STATUSES, 
  VALIDATION_STATUSES,
  getDocumentCategory, 
  getDocumentType, 
  getDocumentStatus, 
  getValidationStatus,
  getCategoryColorClasses,
  DocumentCategory,
  DocumentType,
  DocumentStatus
} from '../../types/documentTypes';
import { Document } from '../../services/profileService';
import profileService from '../../services/profileService';
import DocumentEditModal from './DocumentEditModal';

interface DynamicDocumentsSectionProps {
  language: string;
  onUploadDocument: (categoryId: string, typeId: string) => void;
  onDocumentUploaded?: () => void; // Callback pour rafraîchir la liste après upload
}

const DynamicDocumentsSection: React.FC<DynamicDocumentsSectionProps> = ({
  language,
  onUploadDocument,
  onDocumentUploaded
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    document: null as Document | null
  });

  // Charger les documents depuis l'API
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const docs = await profileService.getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  // Recharger les documents quand un nouveau document est uploadé
  useEffect(() => {
    if (onDocumentUploaded) {
      const loadDocuments = async () => {
        try {
          const docs = await profileService.getDocuments();
          setDocuments(docs);
        } catch (error) {
          console.error('Error loading documents:', error);
        }
      };
      loadDocuments();
    }
  }, [onDocumentUploaded]);

  // Fonctions pour gérer les documents
  const handleViewDocument = async (document: Document) => {
    if (document.id) {
      try {
        await profileService.viewDocument(document.id);
      } catch (error) {
        console.error('Error viewing document:', error);
      }
    }
  };

  const handleDownloadDocument = async (document: Document) => {
    if (document.id) {
      try {
        await profileService.downloadDocument(document.id);
      } catch (error) {
        console.error('Error downloading document:', error);
      }
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this document?' : 'Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await profileService.deleteDocument(documentId);
        setDocuments(documents.filter(doc => doc.id !== documentId));
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const handleEditDocument = (document: Document) => {
    setEditModal({
      isOpen: true,
      document: document
    });
  };

  const handleDocumentUpdated = (updatedDocument: Document) => {
    setDocuments(documents.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    ));
    setEditModal({
      isOpen: false,
      document: null
    });
  };

  // Obtenir le document pour un type spécifique
  const getDocumentForType = (categoryId: string, typeId: string): Document | undefined => {
    return documents.find(doc => doc.category === categoryId && doc.type === typeId);
  };

  // Obtenir l'icône pour une catégorie
  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      User: <User className="w-6 h-6" />,
      Globe: <Globe className="w-6 h-6" />,
      GraduationCap: <GraduationCap className="w-6 h-6" />,
      FileText: <FileText className="w-6 h-6" />
    };
    return iconMap[iconName] || <FileText className="w-6 h-6" />;
  };

  // Obtenir le statut d'affichage pour un type de document
  const getDisplayStatus = (category: DocumentCategory, type: DocumentType, document?: Document): DocumentStatus => {
    if (document) {
      return getDocumentStatus(document.status) || DOCUMENT_STATUSES[0];
    }
    
    if (type.required) {
      return getDocumentStatus('not_submitted') || DOCUMENT_STATUSES[6];
    } else {
      return getDocumentStatus('optional') || DOCUMENT_STATUSES[7];
    }
  };

  // Vérifier si un document est expiré
  const isDocumentExpired = (document: Document): boolean => {
    if (!document.expiryDate) return false;
    return new Date(document.expiryDate) < new Date();
  };

  // Obtenir les actions disponibles pour un document
  const getAvailableActions = (document?: Document) => {
    if (!document) {
      return ['upload'];
    }

    const actions = ['view', 'download', 'edit'];
    
    // Ajouter l'action de suppression si le document n'est pas vérifié
    if (document.status !== 'verified') {
      actions.push('delete');
    }

    return actions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          {language === 'en' ? 'Loading documents...' : 'Chargement des documents...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Documents' : 'Documents'}
          </h2>
          <p className="text-gray-600 mt-1">
            {language === 'en' ? 'Upload and manage your application documents' : 'Téléchargez et gérez vos documents de candidature'}
          </p>
        </div>
      </div>

      {DOCUMENT_CATEGORIES.map((category) => {
        const colorClasses = getCategoryColorClasses(category.color);
        
        return (
          <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-6">
            {/* En-tête de catégorie */}
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 ${colorClasses.bg} rounded-lg`}>
                <div className={colorClasses.text}>
                  {getCategoryIcon(category.icon)}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'en' ? category.name : category.nameFr}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? category.description : category.descriptionFr}
                </p>
              </div>
            </div>

            {/* Types de documents dans cette catégorie */}
            <div className="space-y-4">
              {category.documentTypes.map((type) => {
                const document = getDocumentForType(category.id, type.id);
                const displayStatus = getDisplayStatus(category, type, document);
                const availableActions = getAvailableActions(document);
                const isExpired = document ? isDocumentExpired(document) : false;

                return (
                  <div key={type.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 sm:space-y-0">
                    <div className="flex items-start sm:items-center space-x-3 flex-1">
                      <div className={`p-2 ${colorClasses.bg} rounded-lg flex-shrink-0`}>
                        <FileText className={`w-4 h-4 sm:w-5 sm:h-5 ${colorClasses.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {language === 'en' ? type.name : type.nameFr}
                          </h4>
                          {type.required && (
                            <span className="text-red-500 text-sm">*</span>
                          )}
                          {isExpired && (
                            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {language === 'en' ? type.description : type.descriptionFr}
                        </p>
                        {document && (
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500 mt-2">
                            <span className="truncate">{document.originalFilename}</span>
                            <span className="flex-shrink-0">{document.fileSizeFormatted}</span>
                            {document.expiryDate && (
                              <span className={`flex items-center space-x-1 ${isExpired ? 'text-orange-600' : ''} flex-shrink-0`}>
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {language === 'en' ? 'Expires:' : 'Expire:'} {new Date(document.expiryDate).toLocaleDateString()}
                                </span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      {/* Statuts */}
                      <div className="flex flex-wrap gap-2">
                        {/* Statut du document */}
                        <span className={`px-2 py-1 ${displayStatus.bgColor} ${displayStatus.color} rounded-full text-xs font-medium`}>
                          {language === 'en' ? displayStatus.name : displayStatus.nameFr}
                        </span>

                        {/* Statut de validation E-TAWJIHI */}
                        {document && document.validationStatus && (
                          <span className={`px-2 py-1 ${getValidationStatus(document.validationStatus)?.bgColor || 'bg-gray-100'} ${getValidationStatus(document.validationStatus)?.color || 'text-gray-800'} rounded-full text-xs font-medium border border-gray-200`}>
                            {language === 'en' ? getValidationStatus(document.validationStatus)?.name : getValidationStatus(document.validationStatus)?.nameFr}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-center sm:justify-end space-x-1">
                        {availableActions.includes('view') && document && (
                          <button
                            onClick={() => handleViewDocument(document)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title={language === 'en' ? 'View document' : 'Voir le document'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        
                        {availableActions.includes('download') && document && (
                          <button
                            onClick={() => handleDownloadDocument(document)}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title={language === 'en' ? 'Download document' : 'Télécharger le document'}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}

                        {availableActions.includes('edit') && document && (
                          <button
                            onClick={() => handleEditDocument(document)}
                            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                            title={language === 'en' ? 'Edit document' : 'Modifier le document'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        
                        {availableActions.includes('upload') && (
                          <button
                            onClick={() => onUploadDocument(category.id, type.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title={language === 'en' ? 'Upload document' : 'Télécharger le document'}
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        )}
                        
                        {availableActions.includes('delete') && document && (
                          <button
                            onClick={() => handleDeleteDocument(document.id!)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title={language === 'en' ? 'Delete document' : 'Supprimer le document'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Bouton d'upload général */}
      <div className="flex justify-center">
        <button
          onClick={() => onUploadDocument('', '')}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>{language === 'en' ? 'Upload New Document' : 'Télécharger un Nouveau Document'}</span>
        </button>
      </div>

      {/* Modal d'édition */}
      <DocumentEditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, document: null })}
        document={editModal.document}
        language={language}
        onDocumentUpdated={handleDocumentUpdated}
      />
    </div>
  );
};

export default DynamicDocumentsSection;

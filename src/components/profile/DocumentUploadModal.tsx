import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { 
  DOCUMENT_CATEGORIES, 
  getDocumentCategory, 
  getDocumentType,
  DocumentCategory,
  DocumentType
} from '../../types/documentTypes';
import { Document } from '../../services/profileService';
import profileService from '../../services/profileService';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string;
  typeId?: string;
  language: string;
  onDocumentUploaded: (document: Document) => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  categoryId,
  typeId,
  language,
  onDocumentUploaded
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || '');
  const [selectedType, setSelectedType] = useState<string>(typeId || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchroniser les états avec les props quand elles changent
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(categoryId || '');
      setSelectedType(typeId || '');
      setSelectedFile(null);
      setExpiryDate('');
      setDescription('');
      setError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, categoryId, typeId]);

  // Réinitialiser le modal
  const resetModal = () => {
    setSelectedCategory(categoryId || '');
    setSelectedType(typeId || '');
    setSelectedFile(null);
    setExpiryDate('');
    setDescription('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Fermer le modal
  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Gérer la sélection de fichier
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const documentType = getDocumentType(selectedCategory, selectedType);
      if (documentType) {
        // Vérifier la taille du fichier
        if (documentType.maxFileSize && file.size > documentType.maxFileSize * 1024 * 1024) {
          setError(
            language === 'en' 
              ? `File size must be less than ${documentType.maxFileSize}MB`
              : `La taille du fichier doit être inférieure à ${documentType.maxFileSize}MB`
          );
          return;
        }

        // Vérifier l'extension du fichier
        if (documentType.allowedExtensions) {
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          if (!fileExtension || !documentType.allowedExtensions.includes(fileExtension)) {
            setError(
              language === 'en'
                ? `Allowed file types: ${documentType.allowedExtensions.join(', ')}`
                : `Types de fichiers autorisés: ${documentType.allowedExtensions.join(', ')}`
            );
            return;
          }
        }
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  // Gérer l'upload
  const handleUpload = async () => {
    if (!selectedFile || !selectedCategory || !selectedType) {
      setError(
        language === 'en' 
          ? 'Please select a file and document type'
          : 'Veuillez sélectionner un fichier et un type de document'
      );
      return;
    }

    const documentType = getDocumentType(selectedCategory, selectedType);
    if (!documentType) {
      setError(
        language === 'en' 
          ? 'Invalid document type'
          : 'Type de document invalide'
      );
      return;
    }

    // Vérifier si une date d'expiration est requise
    if (documentType.expiryRequired && !expiryDate) {
      setError(
        language === 'en' 
          ? 'Expiry date is required for this document type'
          : 'La date d\'expiration est requise pour ce type de document'
      );
      return;
    }

    try {
      setUploading(true);
      setError('');

      const documentData = {
        type: selectedType,
        category: selectedCategory,
        title: language === 'en' ? documentType.name : documentType.nameFr,
        description: description || (language === 'en' ? documentType.description : documentType.descriptionFr),
        expiryDate: expiryDate || undefined,
        status: 'uploaded'
      };

      const uploadedDocument = await profileService.uploadDocument(selectedFile, documentData);
      onDocumentUploaded(uploadedDocument);
      handleClose();
    } catch (error) {
      console.error('Error uploading document:', error);
      setError(
        language === 'en' 
          ? 'Failed to upload document. Please try again.'
          : 'Échec du téléchargement du document. Veuillez réessayer.'
      );
    } finally {
      setUploading(false);
    }
  };

  // Obtenir les types de documents disponibles pour la catégorie sélectionnée
  const getAvailableTypes = (): DocumentType[] => {
    if (!selectedCategory) return [];
    const category = getDocumentCategory(selectedCategory);
    return category?.documentTypes || [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {language === 'en' ? 'Upload Document' : 'Télécharger un Document'}
            </h2>
          </div>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sélection de catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Document Category' : 'Catégorie de Document'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedType('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={!!categoryId}
            >
              <option value="">
                {language === 'en' ? 'Select Category' : 'Sélectionner une Catégorie'}
              </option>
              {DOCUMENT_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {language === 'en' ? category.name : category.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection de type */}
          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Document Type' : 'Type de Document'}
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={!!typeId}
              >
                <option value="">
                  {language === 'en' ? 'Select Type' : 'Sélectionner un Type'}
                </option>
                {getAvailableTypes().map((type) => (
                  <option key={type.id} value={type.id}>
                    {language === 'en' ? type.name : type.nameFr}
                    {type.required && ' *'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Informations sur le type de document */}
          {selectedType && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              {(() => {
                const type = getDocumentType(selectedCategory, selectedType);
                return type ? (
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      {language === 'en' ? type.name : type.nameFr}
                    </h4>
                    <p className="text-sm text-blue-800 mb-2">
                      {language === 'en' ? type.description : type.descriptionFr}
                    </p>
                    <div className="text-xs text-blue-700 space-y-1">
                      {type.maxFileSize && (
                        <p>
                          {language === 'en' ? 'Max file size:' : 'Taille max:'} {type.maxFileSize}MB
                        </p>
                      )}
                      {type.allowedExtensions && (
                        <p>
                          {language === 'en' ? 'Allowed formats:' : 'Formats autorisés:'} {type.allowedExtensions.join(', ')}
                        </p>
                      )}
                      {type.expiryRequired && (
                        <p className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{language === 'en' ? 'Expiry date required' : 'Date d\'expiration requise'}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Sélection de fichier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Select File' : 'Sélectionner un Fichier'}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept={(() => {
                  const type = getDocumentType(selectedCategory, selectedType);
                  return type?.allowedExtensions?.map(ext => `.${ext}`).join(',') || '*';
                })()}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center space-y-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Upload className="w-8 h-8" />
                <span className="text-sm">
                  {language === 'en' ? 'Click to select file' : 'Cliquez pour sélectionner un fichier'}
                </span>
              </button>
              {selectedFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Date d'expiration */}
          {selectedType && getDocumentType(selectedCategory, selectedType)?.expiryRequired && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Expiry Date' : 'Date d\'Expiration'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Description (Optional)' : 'Description (Optionnel)'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder={language === 'en' ? 'Add any additional notes...' : 'Ajoutez des notes supplémentaires...'}
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            disabled={uploading}
          >
            {language === 'en' ? 'Cancel' : 'Annuler'}
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile || !selectedCategory || !selectedType}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{language === 'en' ? 'Uploading...' : 'Téléchargement...'}</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>{language === 'en' ? 'Upload Document' : 'Télécharger le Document'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;

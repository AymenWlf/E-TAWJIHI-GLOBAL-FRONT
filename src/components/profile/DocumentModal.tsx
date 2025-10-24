import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Upload, FileText, Calendar, AlertCircle } from 'lucide-react';
import { Document } from '../../services/profileService';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File, documentData: Omit<Document, 'id' | 'filename' | 'originalFilename' | 'mimeType' | 'fileSize' | 'createdAt' | 'updatedAt'>) => void;
  document?: Document | null;
  language: 'en' | 'fr';
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  document,
  language
}) => {
  const [formData, setFormData] = useState({
    type: 'academic',
    title: '',
    description: '',
    expiryDate: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document) {
      setFormData({
        type: document.type || 'academic',
        title: document.title || '',
        description: document.description || '',
        expiryDate: document.expiryDate || ''
      });
    } else {
      setFormData({
        type: 'academic',
        title: '',
        description: '',
        expiryDate: ''
      });
    }
    setSelectedFile(null);
    setErrors({});
  }, [document, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = language === 'en' ? 'Title is required' : 'Le titre est requis';
    }

    if (!selectedFile && !document) {
      newErrors.file = language === 'en' ? 'File is required' : 'Le fichier est requis';
    }

    // Validate file type
    if (selectedFile) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file = language === 'en' 
          ? 'Only PDF, Word documents, and images are allowed' 
          : 'Seuls les PDF, documents Word et images sont autorisés';
      }

      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        newErrors.file = language === 'en' 
          ? 'File size must be less than 10MB' 
          : 'La taille du fichier doit être inférieure à 10MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (selectedFile) {
      const documentData = {
        type: formData.type,
        title: formData.title,
        description: formData.description || undefined,
        expiryDate: formData.expiryDate || undefined,
        status: 'uploaded'
      };

      onSave(selectedFile, documentData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: file.name.split('.')[0] }));
      }
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: '' }));
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const t = {
    en: {
      title: document ? 'Edit Document' : 'Upload Document',
      type: 'Document Type',
      titleField: 'Title',
      description: 'Description',
      expiryDate: 'Expiry Date',
      file: 'File',
      selectFile: 'Select File',
      noFileSelected: 'No file selected',
      save: 'Save',
      cancel: 'Cancel',
      academic: 'Academic Document',
      language: 'Language Test',
      personal: 'Personal Document',
      other: 'Other',
      dragDrop: 'Drag and drop a file here, or click to select',
      supportedFormats: 'Supported formats: PDF, Word documents, images (max 10MB)'
    },
    fr: {
      title: document ? 'Modifier le Document' : 'Télécharger un Document',
      type: 'Type de Document',
      titleField: 'Titre',
      description: 'Description',
      expiryDate: 'Date d\'Expiration',
      file: 'Fichier',
      selectFile: 'Sélectionner un Fichier',
      noFileSelected: 'Aucun fichier sélectionné',
      save: 'Enregistrer',
      cancel: 'Annuler',
      academic: 'Document Académique',
      language: 'Test de Langue',
      personal: 'Document Personnel',
      other: 'Autre',
      dragDrop: 'Glissez-déposez un fichier ici, ou cliquez pour sélectionner',
      supportedFormats: 'Formats supportés: PDF, documents Word, images (max 10MB)'
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t[language].title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t[language].type}
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="academic">{t[language].academic}</option>
              <option value="language">{t[language].language}</option>
              <option value="personal">{t[language].personal}</option>
              <option value="other">{t[language].other}</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t[language].titleField} *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={language === 'en' ? 'Enter document title' : 'Entrez le titre du document'}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* File Upload */}
          {!document && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].file} *
              </label>
              
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  errors.file 
                    ? 'border-red-300 bg-red-50' 
                    : selectedFile 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t[language].dragDrop}</p>
                      <p className="text-xs text-gray-400">{t[language].supportedFormats}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {errors.file && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.file}</span>
                </div>
              )}
            </div>
          )}

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t[language].expiryDate}
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t[language].description}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Additional notes or description' : 'Notes ou description supplémentaires'}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {t[language].cancel}
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{t[language].save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentModal;

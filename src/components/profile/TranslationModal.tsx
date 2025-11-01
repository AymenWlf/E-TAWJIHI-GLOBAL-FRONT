import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Calculator, CreditCard, AlertCircle } from 'lucide-react';
import { Service } from '../../types/serviceTypes';
import { 
  DOCUMENT_TYPES,
  getLanguageName, 
  getDocumentType,
  getTranslationPrice,
  calculateTranslationPrice,
  TranslationRequest 
} from '../../types/translationTypes';
import translationService from '../../services/translationService';
import { useAllParameters } from '../../hooks/useAllParameters';

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  language: string;
  onTranslationRequest: (request: TranslationRequest) => void;
}

const TranslationModal: React.FC<TranslationModalProps> = ({
  isOpen,
  onClose,
  service,
  language,
  onTranslationRequest
}) => {
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();
  
  // Normalize language to 'fr' or 'en'
  const normalizedLanguage = (language === 'fr' || language === 'français') ? 'fr' : 'en';
  const [formData, setFormData] = useState({
    documentType: '',
    originalLanguage: '',
    targetLanguage: '',
    numberOfPages: 1,
    notes: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [pricePerPage, setPricePerPage] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get languages from parameters
  const getLanguageOptions = () => {
    if (!allParams?.languages || !Array.isArray(allParams.languages)) {
      return [];
    }
    return allParams.languages.map(lang => ({
      code: lang.code,
      name: lang.labelEn || lang.code,
      nameFr: lang.labelFr || lang.labelEn || lang.code
    }));
  };

  // Helper to get language name (with fallback)
  const getLanguageNameLocal = (code: string) => {
    const langOption = getLanguageOptions().find(l => l.code === code);
    if (langOption) {
      return normalizedLanguage === 'en' ? langOption.name : langOption.nameFr;
    }
    // Fallback to the imported function if not found in parameters
    return getLanguageName(code, normalizedLanguage);
  };

  // Helper to get language full name (English) for API calls
  const getLanguageNameForAPI = (code: string): string => {
    if (!allParams?.languages || !Array.isArray(allParams.languages)) {
      return code;
    }
    const langOption = allParams.languages.find(l => l.code === code);
    // Use labelEn for API (as stored in DB)
    return langOption?.labelEn || langOption?.labelFr || code;
  };

  // Fetch price from API when languages change
  useEffect(() => {
    const fetchPrice = async () => {
      if (formData.originalLanguage && formData.targetLanguage) {
        try {
          // Convert language codes to full names for API
          const fromLanguageName = getLanguageNameForAPI(formData.originalLanguage);
          const toLanguageName = getLanguageNameForAPI(formData.targetLanguage);
          
          const response = await translationService.getTranslationPriceByLanguages(
            fromLanguageName,
            toLanguageName
          );
          
          if (response.success && response.data) {
            setPricePerPage(response.data.price);
            // Calculate total price based on number of pages
            if (formData.numberOfPages > 0) {
              setCalculatedPrice(response.data.price * formData.numberOfPages);
            } else {
              setCalculatedPrice(null);
            }
            setError('');
          } else {
            setPricePerPage(null);
            setCalculatedPrice(null);
            if (response.message) {
              setError(response.message);
            }
          }
        } catch (err: any) {
          setPricePerPage(null);
          setCalculatedPrice(null);
          setError(err.message || 'Prix non disponible pour cette combinaison de langues');
        }
      } else {
        setPricePerPage(null);
        setCalculatedPrice(null);
      }
    };

    fetchPrice();
  }, [formData.originalLanguage, formData.targetLanguage]);

  // Recalculate total when number of pages changes
  useEffect(() => {
    if (pricePerPage && formData.numberOfPages > 0) {
      setCalculatedPrice(pricePerPage * formData.numberOfPages);
    } else {
      setCalculatedPrice(null);
    }
  }, [pricePerPage, formData.numberOfPages]);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError(normalizedLanguage === 'en' 
          ? 'Please select a PDF or image file (JPG, PNG)'
          : 'Veuillez sélectionner un fichier PDF ou image (JPG, PNG)'
        );
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(normalizedLanguage === 'en' 
          ? 'File size must be less than 10MB'
          : 'La taille du fichier doit être inférieure à 10MB'
        );
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Recalculate price when language or pages change
    if (field === 'originalLanguage' || field === 'targetLanguage' || field === 'numberOfPages') {
      calculatePrice();
    }
  };

  const calculatePrice = () => {
    // Price is now calculated automatically via useEffect
    // This function is kept for backward compatibility but does nothing
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError(normalizedLanguage === 'en' 
        ? 'Please select a document to translate'
        : 'Veuillez sélectionner un document à traduire'
      );
      return;
    }

    if (!formData.originalLanguage || !formData.targetLanguage) {
      setError(normalizedLanguage === 'en' 
        ? 'Please select source and target languages'
        : 'Veuillez sélectionner les langues source et cible'
      );
      return;
    }

    if (!formData.documentType) {
      setError(normalizedLanguage === 'en' 
        ? 'Please select document type'
        : 'Veuillez sélectionner le type de document'
      );
      return;
    }

    if (!pricePerPage) {
      setError(normalizedLanguage === 'en' 
        ? 'Price not available for this language pair'
        : 'Prix non disponible pour cette combinaison de langues'
      );
      return;
    }

    if (!calculatedPrice) {
      setError(normalizedLanguage === 'en' 
        ? 'Please enter number of pages'
        : 'Veuillez entrer le nombre de pages'
      );
      return;
    }

    try {
      setError('');

      const translationData = {
        originalFilename: selectedFile.name,
        originalLanguage: formData.originalLanguage,
        targetLanguage: formData.targetLanguage,
        documentType: formData.documentType,
        numberOfPages: formData.numberOfPages,
        pricePerPage: pricePerPage,
        totalPrice: calculatedPrice,
        currency: 'MAD',
        notes: formData.notes,
        originalDocument: selectedFile
      };

      const response = await translationService.createTranslation(translationData);
      
      if (response.success) {
        // Call the callback with the created translation
        onTranslationRequest(response.data);
        onClose();
      } else {
        setError(response.message || (normalizedLanguage === 'en' 
          ? 'Failed to create translation request'
          : 'Échec de la création de la demande de traduction'
        ));
      }
    } catch (error: any) {
      setError(error.message || (normalizedLanguage === 'en' 
        ? 'Failed to create translation request'
        : 'Échec de la création de la demande de traduction'
      ));
    }
  };

  const resetModal = () => {
    setFormData({
      documentType: '',
      originalLanguage: '',
      targetLanguage: '',
      numberOfPages: 1,
      notes: ''
    });
    setSelectedFile(null);
    setCalculatedPrice(null);
    setPricePerPage(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {service.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {normalizedLanguage === 'en' ? service.name : service.nameFr}
              </h2>
              <p className="text-sm text-gray-500">
                {normalizedLanguage === 'en' ? 'Document Translation Request' : 'Demande de Traduction de Document'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {normalizedLanguage === 'en' ? 'Upload Document' : 'Télécharger le Document'}
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {normalizedLanguage === 'en' 
                      ? 'Click to upload or drag and drop'
                      : 'Cliquez pour télécharger ou glissez-déposez'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG (max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Document Type' : 'Type de Document'}
            </label>
            <select
              value={formData.documentType}
              onChange={(e) => handleInputChange('documentType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">
                  {normalizedLanguage === 'en' ? 'Select document type' : 'Sélectionner le type de document'}
                </option>
                     {DOCUMENT_TYPES.map(docType => (
                       <option key={docType.id} value={docType.id}>
                         {normalizedLanguage === 'en' ? docType.name : docType.nameFr}
                       </option>
                     ))}
            </select>
          </div>

          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {normalizedLanguage === 'en' ? 'Source Language' : 'Langue Source'}
              </label>
              <select
                value={formData.originalLanguage}
                onChange={(e) => handleInputChange('originalLanguage', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  {normalizedLanguage === 'en' ? 'Select source language' : 'Sélectionner la langue source'}
                </option>
                {paramsLoading ? (
                  <option value="" disabled>{normalizedLanguage === 'en' ? 'Loading languages...' : 'Chargement des langues...'}</option>
                ) : (
                  getLanguageOptions().map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {normalizedLanguage === 'en' ? lang.name : lang.nameFr}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {normalizedLanguage === 'en' ? 'Target Language' : 'Langue Cible'}
              </label>
              <select
                value={formData.targetLanguage}
                onChange={(e) => handleInputChange('targetLanguage', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  {normalizedLanguage === 'en' ? 'Select target language' : 'Sélectionner la langue cible'}
                </option>
                {paramsLoading ? (
                  <option value="" disabled>{normalizedLanguage === 'en' ? 'Loading languages...' : 'Chargement des langues...'}</option>
                ) : (
                  getLanguageOptions().map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {normalizedLanguage === 'en' ? lang.name : lang.nameFr}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Number of Pages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {normalizedLanguage === 'en' ? 'Number of Pages' : 'Nombre de Pages'}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.numberOfPages}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty value for easy deletion
                if (value === '') {
                  setFormData({ ...formData, numberOfPages: 0 });
                  return;
                }
                const numValue = parseInt(value) || 1;
                handleInputChange('numberOfPages', numValue);
              }}
              onFocus={(e) => e.target.select()}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

                 {/* Price Calculation */}
                 {formData.originalLanguage && formData.targetLanguage && (
                   <div className="bg-gray-50 p-6 rounded-lg">
                     <div className="mb-4">
                       <h3 className="text-lg font-semibold text-gray-900">
                         {normalizedLanguage === 'en' ? 'Price Calculation' : 'Calcul du Prix'}
                       </h3>
                     </div>

                     {calculatedPrice ? (
                       <div className="space-y-4">
                         {/* Language Details */}
                         <div className="bg-white p-4 rounded-lg border">
                           <h4 className="font-medium text-gray-900 mb-3">
                             {normalizedLanguage === 'en' ? 'Translation Details' : 'Détails de la Traduction'}
                           </h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                             <div>
                               <span className="text-gray-500">
                                 {normalizedLanguage === 'en' ? 'From:' : 'De:'}
                               </span>
                              <span className="ml-2 font-medium">
                                {getLanguageNameLocal(formData.originalLanguage)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                {normalizedLanguage === 'en' ? 'To:' : 'Vers:'}
                              </span>
                              <span className="ml-2 font-medium">
                                {getLanguageNameLocal(formData.targetLanguage)}
                              </span>
                            </div>
                             <div>
                               <span className="text-gray-500">
                                 {normalizedLanguage === 'en' ? 'Pages:' : 'Pages:'}
                               </span>
                               <span className="ml-2 font-medium">{formData.numberOfPages}</span>
                             </div>
                           </div>
                         </div>

                         {/* Price Breakdown */}
                         <div className="bg-white p-4 rounded-lg border">
                           <h4 className="font-medium text-gray-900 mb-3">
                             {normalizedLanguage === 'en' ? 'Price Breakdown' : 'Détail des Prix'}
                           </h4>
                           <div className="space-y-2 text-sm">
                             <div className="flex justify-between">
                               <span className="text-gray-600">
                                 {normalizedLanguage === 'en' ? 'Price per page:' : 'Prix par page:'}
                               </span>
                               <span className="font-medium">
                                 {pricePerPage ? `${pricePerPage.toLocaleString()} MAD` : '—'}
                               </span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">
                                 {normalizedLanguage === 'en' ? 'Number of pages:' : 'Nombre de pages:'}
                               </span>
                               <span className="font-medium">{formData.numberOfPages}</span>
                             </div>
                             <hr className="my-2" />
                             <div className="flex justify-between text-lg font-bold">
                               <span className="text-gray-900">
                                 {normalizedLanguage === 'en' ? 'Total:' : 'Total:'}
                               </span>
                               <span className="text-blue-600">
                                 {calculatedPrice.toLocaleString()} MAD
                               </span>
                             </div>
                           </div>
                         </div>

                         {/* Delivery Info */}
                         <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                           <div className="flex items-center space-x-2">
                             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                             <span className="text-green-800 font-medium">
                               {normalizedLanguage === 'en' ? 'Delivery: 48 business hours' : 'Livraison: 48 heures ouvrables'}
                             </span>
                           </div>
                         </div>
                       </div>
                     ) : (
                       <div className="text-center py-8">
                         <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                         <p className="text-gray-500">
                           {normalizedLanguage === 'en' 
                             ? pricePerPage === null 
                               ? 'Price will be calculated when you select source and target languages'
                               : 'Enter number of pages to calculate total price'
                             : pricePerPage === null
                               ? 'Le prix sera calculé lorsque vous sélectionnerez les langues source et cible'
                               : 'Entrez le nombre de pages pour calculer le prix total'
                           }
                         </p>
                       </div>
                     )}
                   </div>
                 )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {normalizedLanguage === 'en' ? 'Additional Notes (Optional)' : 'Notes Supplémentaires (Optionnel)'}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={normalizedLanguage === 'en' 
                ? 'Any specific requirements or instructions...'
                : 'Toute exigence ou instruction spécifique...'
              }
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-800">
                  {normalizedLanguage === 'en' 
                    ? 'The translation will be added to your list. Payment will be made for all unpaid translations.'
                    : 'La traduction sera ajoutée à votre liste. Le paiement se fera pour toutes les traductions non payées.'
                  }
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {normalizedLanguage === 'en' ? 'Cancel' : 'Annuler'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedFile || !calculatedPrice}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>
                  {normalizedLanguage === 'en' 
                    ? 'Add Translation'
                    : 'Ajouter la Traduction'
                  }
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationModal;

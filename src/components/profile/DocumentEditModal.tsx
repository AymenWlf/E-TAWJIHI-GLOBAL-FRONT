import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import profileService from '../../services/profileService';
import { Document } from '../../services/profileService';

interface DocumentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  language: string;
  onDocumentUpdated: (document: Document) => void;
}

const DocumentEditModal: React.FC<DocumentEditModalProps> = ({
  isOpen,
  onClose,
  document,
  language,
  onDocumentUpdated
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expiryDate: '',
    status: 'uploaded',
    validationStatus: 'pending',
    validationNotes: '',
    rejectionReason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (document && isOpen) {
      setFormData({
        title: document.title || '',
        description: document.description || '',
        expiryDate: document.expiryDate || '',
        status: document.status || 'uploaded',
        validationStatus: document.validationStatus || 'pending',
        validationNotes: document.validationNotes || '',
        rejectionReason: document.rejectionReason || ''
      });
      setError('');
    }
  }, [document, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document?.id) return;

    try {
      setLoading(true);
      setError('');

      // Ne pas envoyer les champs de validation E-TAWJIHI (lecture seule pour l'utilisateur)
      const { validationStatus, validationNotes, validatedBy, ...userEditableData } = formData;
      
      const updatedDocument = await profileService.updateDocument(document.id, userEditableData);
      onDocumentUpdated(updatedDocument);
      onClose();
    } catch (error) {
      console.error('Error updating document:', error);
      setError(
        language === 'en' 
          ? 'Failed to update document. Please try again.'
          : 'Échec de la mise à jour du document. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      expiryDate: '',
      status: 'uploaded',
      validationStatus: 'pending',
      validationNotes: '',
      rejectionReason: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'en' ? 'Edit Document' : 'Modifier le Document'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Document Title' : 'Titre du Document'}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Description' : 'Description'}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder={language === 'en' ? 'Add a description...' : 'Ajoutez une description...'}
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Expiry Date' : 'Date d\'Expiration'}
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Status' : 'Statut'}
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="uploaded">{language === 'en' ? 'Uploaded' : 'Téléchargé'}</option>
              <option value="processing">{language === 'en' ? 'Processing' : 'En cours de traitement'}</option>
              <option value="verified">{language === 'en' ? 'Verified' : 'Vérifié'}</option>
              <option value="rejected">{language === 'en' ? 'Rejected' : 'Rejeté'}</option>
              <option value="expired">{language === 'en' ? 'Expired' : 'Expiré'}</option>
            </select>
          </div>

          {/* Section E-TAWJIHI Validation - Read Only */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-blue-900">
                {language === 'en' ? 'E-TAWJIHI Review Status' : 'Statut de Révision E-TAWJIHI'}
              </h3>
            </div>
            
            <div className="space-y-3">
              {/* Validation Status */}
              <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">
                  {language === 'en' ? 'Status' : 'Statut'}
                </label>
                <div className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm">
                  {formData.validationStatus === 'pending' && (
                    <span className="text-yellow-700">⏳ {language === 'en' ? 'Pending Review' : 'En attente de révision'}</span>
                  )}
                  {formData.validationStatus === 'under_review' && (
                    <span className="text-blue-700">👀 {language === 'en' ? 'Under Review' : 'En cours de révision'}</span>
                  )}
                  {formData.validationStatus === 'approved' && (
                    <span className="text-green-700">✅ {language === 'en' ? 'Approved by E-TAWJIHI' : 'Approuvé par E-TAWJIHI'}</span>
                  )}
                  {formData.validationStatus === 'rejected' && (
                    <span className="text-red-700">❌ {language === 'en' ? 'Rejected by E-TAWJIHI' : 'Rejeté par E-TAWJIHI'}</span>
                  )}
                  {!formData.validationStatus && (
                    <span className="text-gray-600">📋 {language === 'en' ? 'Not reviewed yet' : 'Pas encore révisé'}</span>
                  )}
                </div>
              </div>

              {/* Validation Notes */}
              {formData.validationNotes && (
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">
                    {language === 'en' ? 'Review Notes' : 'Notes de Révision'}
                  </label>
                  <div className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-gray-700 min-h-[60px]">
                    {formData.validationNotes}
                  </div>
                </div>
              )}

              {/* Validated By & Date */}
              {(formData.validatedBy || document?.validatedAt) && (
                <div className="grid grid-cols-2 gap-3">
                  {formData.validatedBy && (
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        {language === 'en' ? 'Reviewed by' : 'Révisé par'}
                      </label>
                      <div className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-gray-700">
                        {formData.validatedBy}
                      </div>
                    </div>
                  )}
                  {document?.validatedAt && (
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        {language === 'en' ? 'Review Date' : 'Date de Révision'}
                      </label>
                      <div className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-gray-700">
                        {new Date(document.validatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <p className="text-xs text-blue-600 mt-3 italic">
              ℹ️ {language === 'en' ? 'This information is managed by E-TAWJIHI staff and cannot be modified by users' : 'Ces informations sont gérées par le personnel E-TAWJIHI et ne peuvent pas être modifiées par les utilisateurs'}
            </p>
          </div>

          {/* Rejection Reason */}
          {formData.status === 'rejected' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Rejection Reason' : 'Raison du Rejet'}
              </label>
              <textarea
                value={formData.rejectionReason}
                onChange={(e) => handleInputChange('rejectionReason', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder={language === 'en' ? 'Explain why the document was rejected...' : 'Expliquez pourquoi le document a été rejeté...'}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              disabled={loading}
            >
              {language === 'en' ? 'Cancel' : 'Annuler'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{language === 'en' ? 'Saving...' : 'Sauvegarde...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{language === 'en' ? 'Save Changes' : 'Sauvegarder les Modifications'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentEditModal;

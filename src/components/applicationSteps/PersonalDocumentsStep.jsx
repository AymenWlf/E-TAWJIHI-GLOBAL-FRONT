import React, { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle, AlertCircle, Eye, Download, Trash2 } from 'lucide-react';
import applicationService from '../../services/applicationService';

const PersonalDocumentsStep = ({ applicationId, data, onSave, language }) => {
  const [documents, setDocuments] = useState({
    passport: null,
    photo: null,
    cv: null,
    financialProof: null,
    medicalCertificate: null
  });
  const [uploading, setUploading] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExistingDocuments();
  }, []);

  const loadExistingDocuments = () => {
    if (data && data.documents) {
      setDocuments(data.documents);
    }
  };

  const handleFileUpload = async (documentType, file) => {
    if (!file) return;

    // Validate file
    const allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setError(language === 'fr' 
        ? 'Type de fichier non supporté. Types autorisés: PDF, DOC, DOCX, JPG, PNG' 
        : 'Unsupported file type. Allowed types: PDF, DOC, DOCX, JPG, PNG'
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError(language === 'fr' 
        ? 'Fichier trop volumineux. Taille maximale: 10MB' 
        : 'File too large. Maximum size: 10MB'
      );
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [documentType]: true }));
      setError(null);

      const response = await applicationService.uploadDocument(applicationId, documentType, file);
      
      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          id: response.document.id,
          fileName: response.document.fileName,
          filePath: response.document.filePath,
          fileSize: response.document.fileSize,
          status: response.document.status,
          uploadedAt: response.document.uploadedAt
        }
      }));

      // Auto-save the step data
      await onSave({ documents: { ...documents, [documentType]: response.document } });

    } catch (err) {
      setError(err.response?.data?.error || (language === 'fr' ? 'Erreur lors de l\'upload' : 'Upload error'));
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const removeDocument = (documentType) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      en: {
        passport: 'Passport',
        photo: 'Passport Photo',
        cv: 'CV/Resume',
        financialProof: 'Financial Proof',
        medicalCertificate: 'Medical Certificate'
      },
      fr: {
        passport: 'Passeport',
        photo: 'Photo Passeport',
        cv: 'CV',
        financialProof: 'Preuve Financière',
        medicalCertificate: 'Certificat Médical'
      }
    };
    return labels[language]?.[type] || type;
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDocumentStatusLabel = (status) => {
    const labels = {
      en: {
        pending: 'Pending Review',
        approved: 'Approved',
        rejected: 'Rejected',
        under_review: 'Under Review'
      },
      fr: {
        pending: 'En Attente',
        approved: 'Approuvé',
        rejected: 'Rejeté',
        under_review: 'En Révision'
      }
    };
    return labels[language]?.[status] || status;
  };

  const renderDocumentUpload = (documentType, isRequired = false) => {
    const document = documents[documentType];
    const isUploading = uploading[documentType];

    return (
      <div key={documentType} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-medium text-gray-900">
              {getDocumentTypeLabel(documentType)}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'fr' ? 'Types acceptés: PDF, DOC, DOCX, JPG, PNG (Max 10MB)' : 'Accepted types: PDF, DOC, DOCX, JPG, PNG (Max 10MB)'}
            </p>
          </div>
        </div>

        {document ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{document.fileName}</p>
                  <p className="text-sm text-gray-600">
                    {applicationService.formatFileSize(document.fileSize)} • 
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(document.status)}`}>
                  {getDocumentStatusLabel(document.status)}
                </span>
                <button
                  onClick={() => removeDocument(documentType)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id={`upload-${documentType}`}
              onChange={(e) => handleFileUpload(documentType, e.target.files[0])}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={isUploading}
            />
            <label
              htmlFor={`upload-${documentType}`}
              className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-600">
                    {language === 'fr' ? 'Upload en cours...' : 'Uploading...'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {language === 'fr' ? 'Cliquez pour télécharger' : 'Click to upload'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {language === 'fr' ? 'ou glissez-déposez le fichier' : 'or drag and drop'}
                  </p>
                </div>
              )}
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {language === 'fr' ? 'Documents Personnels' : 'Personal Documents'}
        </h3>
        <p className="text-gray-600">
          {language === 'fr' 
            ? 'Téléchargez vos documents personnels requis pour votre candidature' 
            : 'Upload your required personal documents for your application'
          }
        </p>
      </div>

      {/* Required Documents */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">
          {language === 'fr' ? 'Documents Requis' : 'Required Documents'}
        </h4>
        
        {renderDocumentUpload('passport', true)}
        {renderDocumentUpload('photo', true)}
      </div>

      {/* Optional Documents */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">
          {language === 'fr' ? 'Documents Optionnels' : 'Optional Documents'}
        </h4>
        
        {renderDocumentUpload('cv')}
        {renderDocumentUpload('financialProof')}
        {renderDocumentUpload('medicalCertificate')}
      </div>

      {/* Document Guidelines */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          {language === 'fr' ? 'Directives pour les Documents' : 'Document Guidelines'}
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• {language === 'fr' ? 'Tous les documents doivent être clairs et lisibles' : 'All documents must be clear and readable'}</li>
          <li>• {language === 'fr' ? 'Les photos doivent être récentes (moins de 6 mois)' : 'Photos must be recent (less than 6 months old)'}</li>
          <li>• {language === 'fr' ? 'Les documents en langue étrangère doivent être traduits' : 'Foreign language documents must be translated'}</li>
          <li>• {language === 'fr' ? 'Taille maximale par fichier: 10MB' : 'Maximum file size: 10MB'}</li>
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">
          {language === 'fr' ? 'Progrès des Documents' : 'Document Progress'}
        </h4>
        <div className="space-y-2">
          {Object.entries(documents).map(([type, doc]) => (
            <div key={type} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{getDocumentTypeLabel(type)}</span>
              <div className="flex items-center gap-2">
                {doc ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">
                      {language === 'fr' ? 'Téléchargé' : 'Uploaded'}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">
                      {language === 'fr' ? 'Manquant' : 'Missing'}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalDocumentsStep;

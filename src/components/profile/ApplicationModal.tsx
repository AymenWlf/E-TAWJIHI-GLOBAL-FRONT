import React, { useState, useEffect } from 'react';
import { X, Save, Building2, BookOpen, Calendar, DollarSign, FileText } from 'lucide-react';
import { Application } from '../../services/profileService';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => void;
  application?: Application | null;
  language: 'en' | 'fr';
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  application,
  language
}) => {
  const [formData, setFormData] = useState({
    universityName: '',
    programName: '',
    country: '',
    status: 'draft',
    applicationFee: '',
    tuitionFee: '',
    applicationDeadline: '',
    startDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (application) {
      setFormData({
        universityName: application.universityName || '',
        programName: application.programName || '',
        country: application.country || '',
        status: application.status || 'draft',
        applicationFee: application.applicationFee || '',
        tuitionFee: application.tuitionFee || '',
        applicationDeadline: application.applicationDeadline || '',
        startDate: application.startDate || '',
        notes: application.notes || ''
      });
    } else {
      setFormData({
        universityName: '',
        programName: '',
        country: '',
        status: 'draft',
        applicationFee: '',
        tuitionFee: '',
        applicationDeadline: '',
        startDate: '',
        notes: ''
      });
    }
    setErrors({});
  }, [application, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.universityName.trim()) {
      newErrors.universityName = language === 'en' ? 'University name is required' : 'Le nom de l\'université est requis';
    }

    if (!formData.programName.trim()) {
      newErrors.programName = language === 'en' ? 'Program name is required' : 'Le nom du programme est requis';
    }

    if (formData.applicationDeadline && formData.startDate && new Date(formData.applicationDeadline) > new Date(formData.startDate)) {
      newErrors.applicationDeadline = language === 'en' ? 'Application deadline must be before start date' : 'La date limite de candidature doit être avant la date de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const applicationData = {
      ...formData,
      applicationFee: formData.applicationFee || undefined,
      tuitionFee: formData.tuitionFee || undefined,
      applicationDeadline: formData.applicationDeadline || undefined,
      startDate: formData.startDate || undefined,
      notes: formData.notes || undefined
    };

    onSave(applicationData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const t = {
    en: {
      title: application ? 'Edit Application' : 'Add Application',
      universityName: 'University Name',
      programName: 'Program Name',
      country: 'Country',
      status: 'Status',
      applicationFee: 'Application Fee',
      tuitionFee: 'Tuition Fee',
      applicationDeadline: 'Application Deadline',
      startDate: 'Start Date',
      notes: 'Notes',
      save: 'Save',
      cancel: 'Cancel',
      draft: 'Draft',
      submitted: 'Submitted',
      underReview: 'Under Review',
      accepted: 'Accepted',
      rejected: 'Rejected',
      waitlisted: 'Waitlisted'
    },
    fr: {
      title: application ? 'Modifier la Candidature' : 'Ajouter une Candidature',
      universityName: 'Nom de l\'Université',
      programName: 'Nom du Programme',
      country: 'Pays',
      status: 'Statut',
      applicationFee: 'Frais de Candidature',
      tuitionFee: 'Frais de Scolarité',
      applicationDeadline: 'Date Limite de Candidature',
      startDate: 'Date de Début',
      notes: 'Notes',
      save: 'Enregistrer',
      cancel: 'Annuler',
      draft: 'Brouillon',
      submitted: 'Soumis',
      underReview: 'En Révision',
      accepted: 'Accepté',
      rejected: 'Rejeté',
      waitlisted: 'Liste d\'Attente'
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
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
          {/* University and Program */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].universityName} *
              </label>
              <input
                type="text"
                value={formData.universityName}
                onChange={(e) => handleInputChange('universityName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.universityName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'en' ? 'Enter university name' : 'Entrez le nom de l\'université'}
              />
              {errors.universityName && (
                <p className="mt-1 text-sm text-red-600">{errors.universityName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].programName} *
              </label>
              <input
                type="text"
                value={formData.programName}
                onChange={(e) => handleInputChange('programName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.programName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'en' ? 'Enter program name' : 'Entrez le nom du programme'}
              />
              {errors.programName && (
                <p className="mt-1 text-sm text-red-600">{errors.programName}</p>
              )}
            </div>
          </div>

          {/* Country and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].country}
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'en' ? 'Enter country' : 'Entrez le pays'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].status}
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">{t[language].draft}</option>
                <option value="submitted">{t[language].submitted}</option>
                <option value="under_review">{t[language].underReview}</option>
                <option value="accepted">{t[language].accepted}</option>
                <option value="rejected">{t[language].rejected}</option>
                <option value="waitlisted">{t[language].waitlisted}</option>
              </select>
            </div>
          </div>

          {/* Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].applicationFee}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.applicationFee}
                  onChange={(e) => handleInputChange('applicationFee', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].tuitionFee}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.tuitionFee}
                  onChange={(e) => handleInputChange('tuitionFee', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].applicationDeadline}
              </label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.applicationDeadline ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.applicationDeadline && (
                <p className="mt-1 text-sm text-red-600">{errors.applicationDeadline}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].startDate}
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t[language].notes}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Additional notes about this application' : 'Notes supplémentaires sur cette candidature'}
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

export default ApplicationModal;

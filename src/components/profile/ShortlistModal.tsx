import React, { useState, useEffect } from 'react';
import { X, Save, Heart, Building2, BookOpen, Star, DollarSign } from 'lucide-react';
import { ShortlistItem } from '../../services/profileService';

interface ShortlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ShortlistItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  item?: ShortlistItem | null;
  language: 'en' | 'fr';
}

const ShortlistModal: React.FC<ShortlistModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
  language
}) => {
  const [formData, setFormData] = useState({
    universityName: '',
    programName: '',
    country: '',
    field: '',
    level: '',
    tuitionFee: '',
    currency: 'USD',
    applicationDeadline: '',
    startDate: '',
    notes: '',
    priority: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        universityName: item.universityName || '',
        programName: item.programName || '',
        country: item.country || '',
        field: item.field || '',
        level: item.level || '',
        tuitionFee: item.tuitionFee || '',
        currency: item.currency || 'USD',
        applicationDeadline: item.applicationDeadline || '',
        startDate: item.startDate || '',
        notes: item.notes || '',
        priority: item.priority || 1
      });
    } else {
      setFormData({
        universityName: '',
        programName: '',
        country: '',
        field: '',
        level: '',
        tuitionFee: '',
        currency: 'USD',
        applicationDeadline: '',
        startDate: '',
        notes: '',
        priority: 1
      });
    }
    setErrors({});
  }, [item, isOpen]);

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

    const itemData = {
      ...formData,
      tuitionFee: formData.tuitionFee || undefined,
      applicationDeadline: formData.applicationDeadline || undefined,
      startDate: formData.startDate || undefined,
      notes: formData.notes || undefined
    };

    onSave(itemData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const t = {
    en: {
      title: item ? 'Edit Shortlist Item' : 'Add to Shortlist',
      universityName: 'University Name',
      programName: 'Program Name',
      country: 'Country',
      field: 'Field of Study',
      level: 'Study Level',
      tuitionFee: 'Tuition Fee',
      currency: 'Currency',
      applicationDeadline: 'Application Deadline',
      startDate: 'Start Date',
      notes: 'Notes',
      priority: 'Priority',
      save: 'Save',
      cancel: 'Cancel',
      undergraduate: 'Undergraduate',
      postgraduate: 'Postgraduate',
      doctorate: 'Doctorate',
      certificate: 'Certificate',
      diploma: 'Diploma'
    },
    fr: {
      title: item ? 'Modifier l\'Élément de la Liste' : 'Ajouter à la Liste de Souhaits',
      universityName: 'Nom de l\'Université',
      programName: 'Nom du Programme',
      country: 'Pays',
      field: 'Domaine d\'Études',
      level: 'Niveau d\'Études',
      tuitionFee: 'Frais de Scolarité',
      currency: 'Devise',
      applicationDeadline: 'Date Limite de Candidature',
      startDate: 'Date de Début',
      notes: 'Notes',
      priority: 'Priorité',
      save: 'Enregistrer',
      cancel: 'Annuler',
      undergraduate: 'Licence',
      postgraduate: 'Master',
      doctorate: 'Doctorat',
      certificate: 'Certificat',
      diploma: 'Diplôme'
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
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

          {/* Country and Field */}
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
                {t[language].field}
              </label>
              <input
                type="text"
                value={formData.field}
                onChange={(e) => handleInputChange('field', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'en' ? 'Enter field of study' : 'Entrez le domaine d\'études'}
              />
            </div>
          </div>

          {/* Level and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].level}
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{language === 'en' ? 'Select level' : 'Sélectionner le niveau'}</option>
                <option value="undergraduate">{t[language].undergraduate}</option>
                <option value="postgraduate">{t[language].postgraduate}</option>
                <option value="doctorate">{t[language].doctorate}</option>
                <option value="certificate">{t[language].certificate}</option>
                <option value="diploma">{t[language].diploma}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].priority}
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 - {language === 'en' ? 'Highest' : 'Plus élevée'}</option>
                <option value={2}>2 - {language === 'en' ? 'High' : 'Élevée'}</option>
                <option value={3}>3 - {language === 'en' ? 'Medium' : 'Moyenne'}</option>
                <option value={4}>4 - {language === 'en' ? 'Low' : 'Faible'}</option>
                <option value={5}>5 - {language === 'en' ? 'Lowest' : 'Plus faible'}</option>
              </select>
            </div>
          </div>

          {/* Tuition Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].currency}
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="MAD">MAD</option>
                <option value="AED">AED</option>
                <option value="SAR">SAR</option>
              </select>
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
              placeholder={language === 'en' ? 'Additional notes about this program' : 'Notes supplémentaires sur ce programme'}
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

export default ShortlistModal;

import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Award, Building2, BookOpen, Star } from 'lucide-react';
import { Qualification } from '../../services/profileService';
import SubjectMultiSelect from './SubjectMultiSelect';

// Grade types will be loaded from parameters
const gradeTypes = [
  { value: 'cgpa-4', label: 'CGPA (4.0 Scale)' },
  { value: 'gpa-5', label: 'GPA (5.0 Scale)' },
  { value: 'cgpa-7', label: 'CGPA (7.0 Scale)' },
  { value: 'gpa-10', label: 'GPA (10.0 Scale)' },
  { value: 'cgpa-20', label: 'CGPA (20.0 Scale)' },
  { value: 'percentage', label: 'Percentage (%)' }
];

// Helper functions for dynamic score validation
const getScoreStep = (scoreType: string) => {
  switch (scoreType) {
    case 'cgpa-4':
    case 'gpa-5':
    case 'cgpa-7':
    case 'gpa-10':
    case 'cgpa-20':
      return '0.01';
    case 'percentage':
      return '0.1';
    default:
      return '0.01';
  }
};

const getScoreMin = (scoreType: string) => {
  switch (scoreType) {
    case 'cgpa-4':
      return '0';
    case 'gpa-5':
      return '0';
    case 'cgpa-7':
      return '0';
    case 'gpa-10':
      return '0';
    case 'cgpa-20':
      return '0';
    case 'percentage':
      return '0';
    default:
      return '0';
  }
};

const getScoreMax = (scoreType: string) => {
  switch (scoreType) {
    case 'cgpa-4':
      return '4';
    case 'gpa-5':
      return '5';
    case 'cgpa-7':
      return '7';
    case 'gpa-10':
      return '10';
    case 'cgpa-20':
      return '20';
    case 'percentage':
      return '100';
    default:
      return '100';
  }
};

const getScorePlaceholder = (scoreType: string) => {
  switch (scoreType) {
    case 'cgpa-4':
      return 'e.g., 3.75';
    case 'gpa-5':
      return 'e.g., 4.2';
    case 'cgpa-7':
      return 'e.g., 6.5';
    case 'gpa-10':
      return 'e.g., 8.5';
    case 'cgpa-20':
      return 'e.g., 16.5';
    case 'percentage':
      return 'e.g., 85.5';
    default:
      return 'Enter score';
  }
};

interface QualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (qualification: Omit<Qualification, 'id' | 'createdAt' | 'updatedAt'>) => void;
  qualification?: Qualification | null;
  language: 'en' | 'fr';
}

const QualificationModal: React.FC<QualificationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  qualification,
  language
}) => {
  const [formData, setFormData] = useState({
    type: 'academic',
    title: '',
    institution: '',
    field: '',
    startDate: '',
    endDate: '',
    grade: '',
    score: '',
    scoreType: '',
    expiryDate: '',
    status: 'valid',
    description: '',
    academicQualification: '',
    exactQualificationName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (qualification) {
      setFormData({
        type: qualification.type || 'academic',
        title: qualification.title || '',
        institution: qualification.institution || '',
        field: qualification.field || '',
        startDate: qualification.startDate || '',
        endDate: qualification.endDate || '',
        grade: qualification.grade || '',
        score: qualification.score || '',
        scoreType: qualification.scoreType || '',
        expiryDate: qualification.expiryDate || '',
        status: qualification.status || 'valid',
        description: qualification.description || '',
        academicQualification: qualification.academicQualification || '',
        exactQualificationName: qualification.exactQualificationName || ''
      });
    } else {
      setFormData({
        type: 'academic',
        title: '',
        institution: '',
        field: '',
        startDate: '',
        endDate: '',
        grade: '',
        score: '',
        scoreType: '',
        expiryDate: '',
        status: 'valid',
        description: '',
        academicQualification: '',
        exactQualificationName: ''
      });
    }
    setErrors({});
  }, [qualification, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = language === 'en' ? 'Title is required' : 'Le titre est requis';
    }

    if (formData.type === 'academic' && !formData.institution.trim()) {
      newErrors.institution = language === 'en' ? 'Institution is required' : 'L\'institution est requise';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = language === 'en' ? 'End date must be after start date' : 'La date de fin doit être après la date de début';
    }

    // Validate score based on score type
    if (formData.score && formData.scoreType) {
      const score = parseFloat(formData.score);
      const min = parseFloat(getScoreMin(formData.scoreType));
      const max = parseFloat(getScoreMax(formData.scoreType));
      
      if (isNaN(score)) {
        newErrors.score = language === 'en' ? 'Please enter a valid score' : 'Veuillez saisir un score valide';
      } else if (score < min || score > max) {
        newErrors.score = language === 'en' 
          ? `Score must be between ${min} and ${max}` 
          : `Le score doit être entre ${min} et ${max}`;
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

    const qualificationData = {
      ...formData,
      score: formData.score || undefined,
      expiryDate: formData.expiryDate || undefined,
      description: formData.description || undefined
    };

    onSave(qualificationData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Academic qualification options
  const academicQualifications = [
    { value: 'high-school', label: language === 'en' ? 'High School Diploma' : 'Baccalauréat' },
    { value: 'associate', label: language === 'en' ? 'Associate Degree' : 'Diplôme d\'Associé' },
    { value: 'bachelor', label: language === 'en' ? 'Bachelor\'s Degree' : 'Licence' },
    { value: 'master', label: language === 'en' ? 'Master\'s Degree' : 'Master' },
    { value: 'phd', label: language === 'en' ? 'PhD/Doctorate' : 'Doctorat' },
    { value: 'diploma', label: language === 'en' ? 'Diploma' : 'Diplôme' },
    { value: 'certificate', label: language === 'en' ? 'Certificate' : 'Certificat' },
    { value: 'foundation', label: language === 'en' ? 'Foundation Year' : 'Année Préparatoire' }
  ];

  // Field of study options (same as SubjectMultiSelect)
  const fieldOptions = [
    { value: 'computer-science', label: language === 'en' ? 'Computer Science' : 'Informatique' },
    { value: 'business-administration', label: language === 'en' ? 'Business Administration' : 'Administration des Affaires' },
    { value: 'engineering', label: language === 'en' ? 'Engineering' : 'Ingénierie' },
    { value: 'medicine', label: language === 'en' ? 'Medicine' : 'Médecine' },
    { value: 'law', label: language === 'en' ? 'Law' : 'Droit' },
    { value: 'economics', label: language === 'en' ? 'Economics' : 'Économie' },
    { value: 'finance', label: language === 'en' ? 'Finance' : 'Finance' },
    { value: 'psychology', label: language === 'en' ? 'Psychology' : 'Psychologie' },
    { value: 'education', label: language === 'en' ? 'Education' : 'Éducation' },
    { value: 'arts', label: language === 'en' ? 'Arts' : 'Arts' },
    { value: 'sciences', label: language === 'en' ? 'Sciences' : 'Sciences' },
    { value: 'other', label: language === 'en' ? 'Other' : 'Autre' }
  ];

  const t = {
    en: {
      title: qualification ? 'Edit Qualification' : 'Add Qualification',
      type: 'Type',
      titleField: 'Title',
      institution: 'Institution',
      field: 'Field of Study',
      academicQualification: 'Academic Qualification',
      exactQualificationName: 'Exact Qualification Name',
      startDate: 'Start Date',
      endDate: 'End Date',
      grade: 'Grade',
      score: 'Score',
      scoreType: 'Score Type',
      expiryDate: 'Expiry Date',
      status: 'Status',
      description: 'Description',
      save: 'Save',
      cancel: 'Cancel',
      academic: 'Academic',
      language: 'Language Test',
      professional: 'Professional Certification'
    },
    fr: {
      title: qualification ? 'Modifier la Qualification' : 'Ajouter une Qualification',
      type: 'Type',
      titleField: 'Titre',
      institution: 'Institution',
      field: 'Domaine d\'Études',
      academicQualification: 'Qualification Académique',
      exactQualificationName: 'Nom Exact de la Qualification',
      startDate: 'Date de Début',
      endDate: 'Date de Fin',
      grade: 'Note',
      score: 'Score',
      scoreType: 'Type de Score',
      expiryDate: 'Date d\'Expiration',
      status: 'Statut',
      description: 'Description',
      save: 'Enregistrer',
      cancel: 'Annuler',
      academic: 'Académique',
      language: 'Test de Langue',
      professional: 'Certification Professionnelle'
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
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
          {/* Type */}
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
              <option value="professional">{t[language].professional}</option>
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
              placeholder={language === 'en' ? 'Enter qualification title' : 'Entrez le titre de la qualification'}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Institution and Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].institution} {formData.type === 'academic' && '*'}
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.institution ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'en' ? 'Enter institution name' : 'Entrez le nom de l\'institution'}
              />
              {errors.institution && (
                <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].field}
              </label>
              <SubjectMultiSelect
                value={formData.field ? [{ id: formData.field, name: formData.field }] : []}
                onChange={(value) => handleInputChange('field', value.length > 0 ? value[0].id : '')}
                placeholder={language === 'en' ? 'Select field of study' : 'Sélectionner le domaine d\'études'}
                language={language}
                maxSelections={1}
              />
            </div>
          </div>

          {/* Academic Qualification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t[language].academicQualification}
            </label>
            <select
              value={formData.academicQualification}
              onChange={(e) => handleInputChange('academicQualification', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{language === 'en' ? 'Select qualification' : 'Sélectionner la qualification'}</option>
              {academicQualifications.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Exact Qualification Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t[language].exactQualificationName}
            </label>
            <input
              type="text"
              value={formData.exactQualificationName}
              onChange={(e) => handleInputChange('exactQualificationName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'en' ? 'e.g., Bachelor of Computer Science' : 'ex: Licence en Informatique'}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].endDate}
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Grade and Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].scoreType}
              </label>
              <select
                value={formData.scoreType}
                onChange={(e) => handleInputChange('scoreType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{language === 'en' ? 'Select Grade Type' : 'Sélectionner le type de note'}</option>
                {gradeTypes.map(gradeType => (
                  <option key={gradeType.value} value={gradeType.value}>
                    {gradeType.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].score}
              </label>
              <input
                type="number"
                step={getScoreStep(formData.scoreType)}
                min={getScoreMin(formData.scoreType)}
                max={getScoreMax(formData.scoreType)}
                value={formData.score}
                onChange={(e) => handleInputChange('score', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={getScorePlaceholder(formData.scoreType)}
              />
              {errors.score && (
                <p className="mt-1 text-sm text-red-600">{errors.score}</p>
              )}
            </div>
          </div>

          {/* Expiry Date and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].status}
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="valid">{language === 'en' ? 'Valid' : 'Valide'}</option>
                <option value="expired">{language === 'en' ? 'Expired' : 'Expiré'}</option>
                <option value="pending">{language === 'en' ? 'Pending' : 'En Attente'}</option>
              </select>
            </div>
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

export default QualificationModal;

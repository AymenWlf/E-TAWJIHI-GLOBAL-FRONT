import React, { useState, useEffect } from 'react';
import { X, Save, Award } from 'lucide-react';
import { Qualification } from '../../services/profileService';
import { useAllParameters } from '../../hooks/useAllParameters';
import SelectSearchable from '../ui/SelectSearchable';

// Helper functions for dynamic score validation using parameters
const getScoreInfo = (scoreType: string, gradeSystemOptions: Array<{value: string, label: string, scoreRange?: string, meta?: any}>) => {
  const gradeSystem = gradeSystemOptions.find(gs => gs.value === scoreType);
  
  if (gradeSystem?.meta) {
    return {
      step: gradeSystem.meta.step || '0.01',
      min: gradeSystem.meta.min || '0',
      max: gradeSystem.meta.max || '100',
      placeholder: gradeSystem.meta.placeholder || 'Enter score'
    };
  }
  
  // Fallback to hardcoded values if meta not available
  switch (scoreType) {
    case 'cgpa-4':
      return { step: '0.01', min: '0', max: '4.0', placeholder: 'e.g., 3.75' };
    case 'gpa-5':
      return { step: '0.01', min: '0', max: '5.0', placeholder: 'e.g., 4.2' };
    case 'cgpa-7':
      return { step: '0.01', min: '0', max: '7.0', placeholder: 'e.g., 6.5' };
    case 'gpa-10':
      return { step: '0.01', min: '0', max: '10.0', placeholder: 'e.g., 8.5' };
    case 'cgpa-20':
      return { step: '0.1', min: '0', max: '20', placeholder: 'e.g., 16.5' };
    case 'percentage':
      return { step: '0.1', min: '0', max: '100', placeholder: 'e.g., 85.5' };
    default:
      return { step: '0.01', min: '0', max: '100', placeholder: 'Enter score' };
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
  const { parameters: allParams } = useAllParameters();
  
  const [formData, setFormData] = useState({
    type: 'academic',
    title: '',
    institution: '',
    field: '',
    startYear: '',
    endYear: '',
    grade: '',
    score: '',
    scoreType: '',
    description: '',
    academicQualification: '',
    exactQualificationName: '',
    baccalaureateStream: '',
    baccalaureateStreamOther: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [academicDegrees, setAcademicDegrees] = useState<Array<{value: string, label: string}>>([]);
  const [fieldOptions, setFieldOptions] = useState<Array<{value: string, label: string}>>([]);
  const [gradeSystemOptions, setGradeSystemOptions] = useState<Array<{value: string, label: string}>>([]);

  // Load academic degrees from parameters
  useEffect(() => {
    if (allParams?.degrees) {
      const degrees = allParams.degrees.map(degree => ({
        value: degree.code,
        label: language === 'en' ? degree.labelEn : degree.labelFr
      }));
      setAcademicDegrees(degrees);
    } else {
      // Fallback to hardcoded options
      setAcademicDegrees([
        { value: 'high-school', label: language === 'en' ? 'High School Diploma' : 'Baccalauréat' },
        { value: 'associate', label: language === 'en' ? 'Associate Degree' : 'Diplôme d\'Associé' },
        { value: 'bachelor', label: language === 'en' ? 'Bachelor\'s Degree' : 'Licence' },
        { value: 'master', label: language === 'en' ? 'Master\'s Degree' : 'Master' },
        { value: 'phd', label: language === 'en' ? 'PhD/Doctorate' : 'Doctorat' },
        { value: 'diploma', label: language === 'en' ? 'Diploma' : 'Diplôme' },
        { value: 'certificate', label: language === 'en' ? 'Certificate' : 'Certificat' },
        { value: 'foundation', label: language === 'en' ? 'Foundation Year' : 'Année Préparatoire' }
      ]);
    }
  }, [allParams, language]);

  // Load field options from parameters (same as Search.jsx)
  useEffect(() => {
    if (allParams?.fields) {
      const fields = allParams.fields.map(field => ({
        value: field.code,
        label: language === 'en' ? field.labelEn : field.labelFr
      }));
      setFieldOptions(fields);
    } else {
      // Fallback to hardcoded options
      setFieldOptions([
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
      ]);
    }
  }, [allParams, language]);

  // Load grade system options from parameters
  useEffect(() => {
    if (allParams?.gradeSystems) {
      const gradeSystems = allParams.gradeSystems.map((grade: any) => ({
        value: grade.code,
        label: language === 'en' ? grade.labelEn : grade.labelFr,
        scoreRange: grade.scoreRange,
        meta: grade.meta
      }));
      setGradeSystemOptions(gradeSystems);
    } else {
      // Fallback options if parameters not loaded
      setGradeSystemOptions([
        { value: 'cgpa-4', label: language === 'en' ? 'CGPA (4.0 Scale)' : 'CGPA (Échelle 4.0)' },
        { value: 'gpa-5', label: language === 'en' ? 'GPA (5.0 Scale)' : 'GPA (Échelle 5.0)' },
        { value: 'percentage', label: language === 'en' ? 'Percentage' : 'Pourcentage' },
        { value: 'cgpa-20', label: language === 'en' ? 'CGPA (20.0 Scale)' : 'CGPA (Échelle 20.0)' },
        { value: 'gpa-10', label: language === 'en' ? 'GPA (10.0 Scale)' : 'GPA (Échelle 10.0)' }
      ]);
    }
  }, [allParams?.gradeSystems, language]);

  useEffect(() => {
    if (qualification) {
      setFormData({
        type: qualification.type || 'academic',
        title: qualification.title || '',
        institution: qualification.institution || '',
        field: qualification.field || '',
        startYear: qualification.startDate ? new Date(qualification.startDate).getFullYear().toString() : '',
        endYear: qualification.endDate ? new Date(qualification.endDate).getFullYear().toString() : '',
        grade: qualification.grade || '',
        score: qualification.score || '',
        scoreType: qualification.scoreType || '',
        description: qualification.description || '',
        academicQualification: qualification.academicQualification || '',
        exactQualificationName: qualification.exactQualificationName || '',
        baccalaureateStream: (qualification as any).baccalaureateStream || '',
        baccalaureateStreamOther: (qualification as any).baccalaureateStreamOther || ''
      });
    } else {
      setFormData({
        type: 'academic',
        title: '',
        institution: '',
        field: '',
        startYear: '',
        endYear: '',
        grade: '',
        score: '',
        scoreType: '',
        description: '',
        academicQualification: '',
        exactQualificationName: '',
        baccalaureateStream: '',
        baccalaureateStreamOther: ''
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

    if (formData.startYear && formData.endYear && parseInt(formData.startYear) > parseInt(formData.endYear)) {
      newErrors.endYear = language === 'en' ? 'End year must be after start year' : 'L\'année de fin doit être après l\'année de début';
    }

    // Validate score based on score type
    if (formData.score && formData.scoreType) {
      const score = parseFloat(formData.score);
      const scoreInfo = getScoreInfo(formData.scoreType, gradeSystemOptions);
      const min = parseFloat(scoreInfo.min);
      const max = parseFloat(scoreInfo.max);
      
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
      startDate: formData.startYear ? `${formData.startYear}-01-01` : undefined,
      endDate: formData.endYear ? `${formData.endYear}-12-31` : null,
      score: formData.score || undefined,
      description: formData.description || undefined,
      baccalaureateStream: formData.baccalaureateStream || undefined,
      baccalaureateStreamOther: formData.baccalaureateStreamOther || undefined
    };

    // Include ID if editing existing qualification
    if (qualification?.id) {
      qualificationData.id = qualification.id;
      console.log('Editing qualification with ID:', qualification.id, qualificationData);
    } else {
      console.log('Adding new qualification:', qualificationData);
    }

    onSave(qualificationData);
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const t = {
    en: {
      title: qualification ? 'Edit Qualification' : 'Add Qualification',
      type: 'Type',
      titleField: 'Title',
      institution: 'Institution',
      field: 'Field of Study',
      academicQualification: 'Academic Qualification',
      exactQualificationName: 'Exact Qualification Name',
      startYear: 'Start Year',
      endYear: 'End Year',
      grade: 'Grade',
      score: 'Score',
      scoreType: 'Score Type',
      description: 'Description',
      save: 'Save',
      cancel: 'Cancel',
      academic: 'Academic',
      professional: 'Professional Certification'
    },
    fr: {
      title: qualification ? 'Modifier le diplôme' : 'Ajouter un diplôme',
      type: 'Type',
      titleField: 'Titre',
      institution: 'Institution',
      field: 'Domaine d\'Études',
      academicQualification: 'Diplômes Académiques',
      exactQualificationName: 'Nom Exact de la Qualification',
      startYear: 'Année de Début',
      endYear: 'Année de Fin',
      grade: 'Note',
      score: 'Score',
      scoreType: 'Type de Score',
      description: 'Description',
      save: 'Enregistrer',
      cancel: 'Annuler',
      academic: 'Académique',
      professional: 'Certification Professionnelle'
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t[language].title}
              </h2>
              {/* Subtitle just after the title */}
              <p className="text-sm text-gray-600">{language === 'en' ? 'Academic Diploma' : 'Diplôme académique'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form - Scrollable Content */}
        <form id="qualification-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
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
              <SelectSearchable
                options={fieldOptions}
                value={formData.field}
                onChange={(value) => handleInputChange('field', Array.isArray(value) ? value[0] : value)}
                placeholder={language === 'en' ? 'Select field of study...' : 'Sélectionner le domaine d\'études...'}
                searchable={true}
                className="w-full"
              />
            </div>
          </div>

          {/* Academic Qualification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t[language].academicQualification}
            </label>
            <SelectSearchable
              options={academicDegrees}
              value={formData.academicQualification}
              onChange={(value) => handleInputChange('academicQualification', Array.isArray(value) ? value[0] : value)}
              placeholder={language === 'en' ? 'Select qualification...' : 'Sélectionner la qualification...'}
              searchable={true}
              className="w-full"
            />
          </div>

          {/* Baccalaureate stream (if Baccalauréat selected) */}
          {(() => {
            const val = (formData.academicQualification || '').toLowerCase();
            const isBac = val === 'high-school' || val === 'baccalaureat' || val === 'baccalauréat' || val === 'baccalaureate' || val === 'bac';
            if (!isBac) return null;
            const bacOptions = [
              { value: 'Sciences Math A', label: 'Sciences Math A' },
              { value: 'Sciences Math B', label: 'Sciences Math B' },
              { value: 'Sciences Physique', label: 'Sciences Physique' },
              { value: 'SVT', label: 'SVT' },
              { value: 'Sciences et technologies électriques', label: 'Sciences et technologies électriques' },
              { value: 'Sciences et technologies mécaniques', label: 'Sciences et technologies mécaniques' },
              { value: 'Sciences économique', label: 'Sciences économique' },
              { value: 'Sciences gestion comptable', label: 'Sciences gestion comptable' },
              { value: 'Sciences agronomiques', label: 'Sciences agronomiques' },
              { value: 'Lettres', label: 'Lettres' },
              { value: 'Sciences humaines', label: 'Sciences humaines' },
              { value: 'Sciences de la chariaa', label: 'Sciences de la chariaa' },
              { value: 'Arts Appliqués', label: 'Arts Appliqués' },
              { value: 'Autre', label: 'Autre' }
            ];
            return (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Baccalaureate Stream' : 'Filière du baccalauréat'}
                </label>
                <SelectSearchable
                  options={bacOptions}
                  value={formData.baccalaureateStream}
                  onChange={(value) => handleInputChange('baccalaureateStream', Array.isArray(value) ? value[0] : value)}
                  placeholder={language === 'en' ? 'Select stream...' : 'Sélectionner la filière...'}
                  searchable={true}
                  className="w-full"
                />
                {formData.baccalaureateStream === 'Autre' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.baccalaureateStreamOther}
                      onChange={(e) => handleInputChange('baccalaureateStreamOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'en' ? 'Specify other stream' : 'Précisez la filière'}
                    />
                  </div>
                )}
              </div>
            );
          })()}

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

          {/* Years */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].startYear}
              </label>
              <input
                type="number"
                min="1900"
                max="2030"
                value={formData.startYear}
                onChange={(e) => handleInputChange('startYear', e.target.value)}
                placeholder={language === 'en' ? 'e.g., 2020' : 'ex: 2020'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].endYear}
              </label>
              <input
                type="number"
                min="1900"
                max="2030"
                value={formData.endYear}
                onChange={(e) => handleInputChange('endYear', e.target.value)}
                placeholder={language === 'en' ? 'e.g., 2024' : 'ex: 2024'}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endYear ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endYear && (
                <p className="mt-1 text-sm text-red-600">{errors.endYear}</p>
              )}
            </div>
          </div>

          {/* Grade and Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].scoreType}
              </label>
              <SelectSearchable
                options={gradeSystemOptions}
                value={formData.scoreType}
                onChange={(value) => handleInputChange('scoreType', Array.isArray(value) ? value[0] : value)}
                placeholder={language === 'en' ? 'Select Grade Type...' : 'Sélectionner le type de note...'}
                searchable={true}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].score}
              </label>
              <input
                type="number"
                step={getScoreInfo(formData.scoreType, gradeSystemOptions).step}
                min={getScoreInfo(formData.scoreType, gradeSystemOptions).min}
                max={getScoreInfo(formData.scoreType, gradeSystemOptions).max}
                value={formData.score}
                onChange={(e) => handleInputChange('score', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={getScoreInfo(formData.scoreType, gradeSystemOptions).placeholder}
              />
              {errors.score && (
                <p className="mt-1 text-sm text-red-600">{errors.score}</p>
              )}
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
        </form>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t[language].cancel}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{t[language].save}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualificationModal;

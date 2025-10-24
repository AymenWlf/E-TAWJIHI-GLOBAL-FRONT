import React, { useState, useEffect } from 'react';
import { X, Save, GraduationCap } from 'lucide-react';
import CountrySelector from './CountrySelector';
import { useAllParameters } from '../../hooks/useAllParameters';

const AcademicQualificationModal = ({ isOpen, onClose, onSave, language, qualification = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    country: '',
    board: '',
    gradingScheme: '',
    score: '',
    englishScore: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  // Pre-fill form data when editing
  React.useEffect(() => {
    if (qualification && isOpen) {
      setFormData({
        title: qualification.title || '',
        institution: qualification.institution || '',
        country: qualification.country || '',
        board: qualification.board || '',
        gradingScheme: qualification.gradingScheme || '',
        score: qualification.score || '',
        englishScore: qualification.englishScore || '',
        startDate: qualification.startDate || '',
        endDate: qualification.endDate || '',
        description: qualification.description || ''
      });
    } else if (!qualification && isOpen) {
      // Reset form for new qualification
      setFormData({
        title: '',
        institution: '',
        country: '',
        board: '',
        gradingScheme: '',
        score: '',
        englishScore: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  }, [qualification, isOpen]);

  const [gradingSchemes, setGradingSchemes] = useState([]);
  
  // Load grade systems from centralized parameters
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();
  
  useEffect(() => {
    if (allParams?.gradeSystems) {
      setGradingSchemes(allParams.gradeSystems.map(scheme => {
        const configs = {
          'cgpa-4': { max: 4.0, step: 0.01, placeholder: '3.75' },
          'gpa-5': { max: 5.0, step: 0.01, placeholder: '4.25' },
          'cgpa-7': { max: 7.0, step: 0.01, placeholder: '6.25' },
          'gpa-10': { max: 10.0, step: 0.01, placeholder: '8.75' },
          'cgpa-20': { max: 20.0, step: 0.01, placeholder: '17.5' },
          'percentage': { max: 100, step: 1, placeholder: '85' }
        };
        const config = configs[scheme.code] || configs['cgpa-4'];
        return {
          value: scheme.code,
          label: scheme.labelEn,
          ...config
        };
      }));
    } else {
      // Fallback
      setGradingSchemes([
        { value: 'cgpa-4', label: 'CGPA (4.0 Scale)', max: 4.0, step: 0.01, placeholder: '3.75' },
        { value: 'gpa-5', label: 'GPA (5.0 Scale)', max: 5.0, step: 0.01, placeholder: '4.25' },
        { value: 'cgpa-7', label: 'CGPA (7.0 Scale)', max: 7.0, step: 0.01, placeholder: '6.25' },
        { value: 'gpa-10', label: 'GPA (10.0 Scale)', max: 10.0, step: 0.01, placeholder: '8.75' },
        { value: 'cgpa-20', label: 'CGPA (20.0 Scale)', max: 20.0, step: 0.01, placeholder: '17.5' },
        { value: 'percentage', label: 'Percentage (%)', max: 100, step: 1, placeholder: '85' }
      ]);
    }
  }, [allParams]);

  // Fonction pour obtenir les propriétés du système de notation sélectionné
  const getSelectedGradingScheme = () => {
    return gradingSchemes.find(scheme => scheme.value === formData.gradingScheme) || gradingSchemes[0];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const qualificationData = {
      ...(qualification && { id: qualification.id }), // Include ID for updates
      type: 'academic',
      title: formData.title,
      institution: formData.institution,
      field: 'Academic',
      country: formData.country,
      board: formData.board,
      gradingScheme: formData.gradingScheme,
      score: formData.score,
      englishScore: formData.englishScore,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      status: 'valid'
    };

    onSave(qualificationData);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      institution: '',
      country: '',
      board: '',
      gradingScheme: '',
      score: '',
      englishScore: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {qualification
                  ? (language === 'en' ? 'Edit Academic Qualification' : 'Modifier la Qualification Académique')
                  : (language === 'en' ? 'Add Academic Qualification' : 'Ajouter une Qualification Académique')
                }
              </h2>
              <p className="text-sm text-gray-600">
                {qualification
                  ? (language === 'en' ? 'Update your academic qualification details here' : 'Mettez à jour les détails de votre qualification académique ici')
                  : (language === 'en' ? 'Add your new academic qualification details here' : 'Ajoutez les détails de votre nouvelle qualification académique ici')
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Qualification Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'en' ? 'ACADEMIC QUALIFICATION' : 'QUALIFICATION ACADÉMIQUE'} *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={language === 'en' ? 'e.g., Bachelor of Science in Computer Science' : 'ex: Licence en Informatique'}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'en' ? 'INSTITUTION' : 'INSTITUTION'} *
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
              placeholder={language === 'en' ? 'e.g., University of Oxford' : 'ex: Université Mohammed V'}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Country and Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'en' ? 'COUNTRY OF EDUCATION' : 'PAYS D\'ÉDUCATION'} *
              </label>
              <CountrySelector
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
                placeholder={language === 'en' ? 'Select Country' : 'Sélectionner un Pays'}
                language={language}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'en' ? 'BOARD OF EDUCATION' : 'BOARD D\'ÉDUCATION'} (optional)
              </label>
              <input
                type="text"
                value={formData.board}
                onChange={(e) => handleInputChange('board', e.target.value)}
                placeholder={language === 'en' ? 'e.g., Cambridge International' : 'ex: Ministère de l\'Éducation'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Grading Scheme */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'en' ? 'GRADING SCHEME' : 'SYSTÈME DE NOTATION'} *
            </label>
            <select
              value={formData.gradingScheme}
              onChange={(e) => handleInputChange('gradingScheme', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">{language === 'en' ? 'Select Grading Scheme' : 'Sélectionner le Système de Notation'}</option>
              {gradingSchemes.map(scheme => (
                <option key={scheme.value} value={scheme.value}>{scheme.label}</option>
              ))}
            </select>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'en' ? `Score (${getSelectedGradingScheme().label})` : `Score (${getSelectedGradingScheme().label})`} *
              </label>
              <input
                type="number"
                min="0"
                max={getSelectedGradingScheme().max}
                step={getSelectedGradingScheme().step}
                value={formData.score}
                onChange={(e) => handleInputChange('score', e.target.value)}
                placeholder={getSelectedGradingScheme().placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' 
                  ? `Enter score from 0 to ${getSelectedGradingScheme().max}` 
                  : `Entrez le score de 0 à ${getSelectedGradingScheme().max}`
                }
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'en' ? `English Score (${getSelectedGradingScheme().label})` : `Score d'Anglais (${getSelectedGradingScheme().label})`} *
              </label>
              <input
                type="number"
                min="0"
                max={getSelectedGradingScheme().max}
                step={getSelectedGradingScheme().step}
                value={formData.englishScore}
                onChange={(e) => handleInputChange('englishScore', e.target.value)}
                placeholder={getSelectedGradingScheme().placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' 
                  ? `English proficiency score from 0 to ${getSelectedGradingScheme().max}` 
                  : `Score de maîtrise de l'anglais de 0 à ${getSelectedGradingScheme().max}`
                }
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'en' ? 'Start Date' : 'Date de Début'}
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'en' ? 'End Date' : 'Date de Fin'}
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'en' ? 'Description' : 'Description'} (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={language === 'en' ? 'Additional details about your qualification...' : 'Détails supplémentaires sur votre qualification...'}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {language === 'en' ? 'Discard' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Save className="w-4 h-4" />
              <span className="font-medium">
                {qualification
                  ? (language === 'en' ? 'Update Qualification' : 'Mettre à jour')
                  : (language === 'en' ? 'Save Qualification' : 'Enregistrer')
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcademicQualificationModal;

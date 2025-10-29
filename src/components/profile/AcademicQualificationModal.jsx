import React, { useState, useEffect } from 'react';
import { X, Save, GraduationCap } from 'lucide-react';
import CountrySelector from './CountrySelector';
import { useAllParameters } from '../../hooks/useAllParameters';

const AcademicQualificationModal = ({ isOpen, onClose, onSave, language, degree = null }) => {
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
    description: '',
    degreeType: 'academic' // Nouveau champ pour le type de diplôme
  });

  // Pre-fill form data when editing
  React.useEffect(() => {
    if (degree && isOpen) {
      setFormData({
        title: degree.title || '',
        institution: degree.institution || '',
        country: degree.country || '',
        board: degree.board || '',
        gradingScheme: degree.gradingScheme || '',
        score: degree.score || '',
        englishScore: degree.englishScore || '',
        startDate: degree.startDate || '',
        endDate: degree.endDate || '',
        description: degree.description || '',
        degreeType: degree.degreeType || 'academic'
      });
    } else if (!degree && isOpen) {
      // Reset form for new degree
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
        description: '',
        degreeType: 'academic'
      });
    }
  }, [degree, isOpen]);

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
    
    const degreeData = {
      ...(degree && { id: degree.id }), // Include ID for updates
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
      degreeType: formData.degreeType,
      status: 'valid'
    };

    onSave(degreeData);
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
      description: '',
      degreeType: 'academic'
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
                {degree
                  ? (language === 'en' ? 'Edit Academic Degree' : 'Modifier le Diplôme Académique')
                  : (language === 'en' ? 'Add Academic Degree' : 'Ajouter un Diplôme Académique')
                }
              </h2>
              <p className="text-sm text-gray-600">
                {degree
                  ? (language === 'en' ? 'Update your academic degree details here' : 'Mettez à jour les détails de votre diplôme académique ici')
                  : (language === 'en' ? 'Add your new academic degree details here' : 'Ajoutez les détails de votre nouveau diplôme académique ici')
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
          {/* Degree Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'en' ? 'DEGREE TYPE' : 'TYPE DE DIPLÔME'} *
            </label>
            <select
              value={formData.degreeType}
              onChange={(e) => handleInputChange('degreeType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="academic">{language === 'en' ? 'Academic' : 'Académique'}</option>
              <option value="professional">{language === 'en' ? 'Professional Certificate' : 'Certificat Professionnel'}</option>
            </select>
          </div>

          {/* Degree Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'en' ? 'ACADEMIC DEGREE' : 'DIPLÔMES ACADÉMIQUES'} *
            </label>
            <select
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">{language === 'en' ? 'Select Degree Type' : 'Sélectionner le Type de Diplôme'}</option>
              <option value="Baccalauréat">{language === 'en' ? 'Baccalaureate' : 'Baccalauréat'}</option>
              <option value="Technicien Spécialisé">{language === 'en' ? 'Specialized Technician' : 'Technicien Spécialisé'}</option>
              <option value="BTS">{language === 'en' ? 'BTS (Higher Technician Certificate)' : 'BTS (Brevet de Technicien Supérieur)'}</option>
              <option value="Classe Préparatoire">{language === 'en' ? 'Preparatory Class' : 'Classe Préparatoire'}</option>
              <option value="DUT">{language === 'en' ? 'DUT (University Technology Diploma)' : 'DUT (Diplôme Universitaire de Technologie)'}</option>
              <option value="BUT">{language === 'en' ? 'BUT (Bachelor of Technology)' : 'BUT (Bachelor Universitaire de Technologie)'}</option>
              <option value="DEUG">{language === 'en' ? 'DEUG (General University Studies Diploma)' : 'DEUG (Diplôme d\'Études Universitaires Générales)'}</option>
              <option value="DEUST">{language === 'en' ? 'DEUST (University Studies Diploma in Science and Technology)' : 'DEUST (Diplôme d\'Études Universitaires Scientifiques et Techniques)'}</option>
              <option value="Licence">{language === 'en' ? 'Bachelor\'s Degree' : 'Licence'}</option>
              <option value="Master">{language === 'en' ? 'Master\'s Degree' : 'Master'}</option>
              <option value="Doctorat">{language === 'en' ? 'Doctorate' : 'Doctorat'}</option>
              <option value="Autre">{language === 'en' ? 'Other' : 'Autre'}</option>
            </select>
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
                  ? `Enter English proficiency score from 0 to ${getSelectedGradingScheme().max}` 
                  : `Entrez le score de maîtrise de l'anglais de 0 à ${getSelectedGradingScheme().max}`
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
              placeholder={language === 'en' ? 'Additional details about your degree...' : 'Détails supplémentaires sur votre diplôme...'}
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
                {degree
                  ? (language === 'en' ? 'Update Degree' : 'Mettre à jour')
                  : (language === 'en' ? 'Save Degree' : 'Enregistrer')
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

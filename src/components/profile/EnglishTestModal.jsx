import React, { useState, useEffect } from 'react';
import { X, Save, Globe } from 'lucide-react';
import { useAllParameters } from '../../hooks/useAllParameters';

const EnglishTestModal = ({ isOpen, onClose, onSave, language, qualification = null }) => {
  const [formData, setFormData] = useState({
    testType: '',
    overallScore: '',
    listening: '',
    reading: '',
    writing: '',
    speaking: '',
    production: '',
    comprehension: '',
    conversation: '',
    literacy: '',
    useOfEnglish: '',
    testDate: '',
    expiryDate: '',
    description: ''
  });

  const [testTypes, setTestTypes] = useState([]);

  // Load test types from centralized parameters
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();

  useEffect(() => {
    if (allParams?.englishTests) {
      const formattedTests = allParams.englishTests.map(test => {
        const testConfig = getTestConfig(test.code);
        return {
          id: test.code,
          name: language === 'fr' ? test.labelFr : test.labelEn,
          fields: testConfig.fields
        };
      });
      setTestTypes(formattedTests);
    } else {
      // Fallback to hardcoded tests
      setTestTypes(getDefaultTestTypes());
    }
  }, [allParams, language]);

  const getTestConfig = (testCode) => {
    const configs = {
      'ielts': {
        fields: [
          { name: 'overallScore', label: 'Overall Score (1-9)', min: 1, max: 9, step: 0.5 },
          { name: 'listening', label: 'Listening (1-9)', min: 1, max: 9, step: 0.5 },
          { name: 'reading', label: 'Reading (1-9)', min: 1, max: 9, step: 0.5 },
          { name: 'writing', label: 'Writing (1-9)', min: 1, max: 9, step: 0.5 },
          { name: 'speaking', label: 'Speaking (1-9)', min: 1, max: 9, step: 0.5 }
        ]
      },
      'toefl': {
        fields: [
          { name: 'overallScore', label: 'Total Score (0-120)', min: 0, max: 120, step: 1 },
          { name: 'listening', label: 'Listening (0-30)', min: 0, max: 30, step: 1 },
          { name: 'reading', label: 'Reading (0-30)', min: 0, max: 30, step: 1 },
          { name: 'writing', label: 'Writing (0-30)', min: 0, max: 30, step: 1 },
          { name: 'speaking', label: 'Speaking (0-30)', min: 0, max: 30, step: 1 }
        ]
      },
      'pte': {
        fields: [
          { name: 'overallScore', label: 'Overall Score (10-90)', min: 10, max: 90, step: 1 },
          { name: 'listening', label: 'Listening (10-90)', min: 10, max: 90, step: 1 },
          { name: 'reading', label: 'Reading (10-90)', min: 10, max: 90, step: 1 },
          { name: 'writing', label: 'Writing (10-90)', min: 10, max: 90, step: 1 },
          { name: 'speaking', label: 'Speaking (10-90)', min: 10, max: 90, step: 1 }
        ]
      },
      'duolingo': {
        fields: [
          { name: 'overallScore', label: 'Overall Score (10-160)', min: 10, max: 160, step: 5 },
          { name: 'literacy', label: 'Literacy (10-160)', min: 10, max: 160, step: 5 },
          { name: 'comprehension', label: 'Comprehension (10-160)', min: 10, max: 160, step: 5 },
          { name: 'conversation', label: 'Conversation (10-160)', min: 10, max: 160, step: 5 },
          { name: 'production', label: 'Production (10-160)', min: 10, max: 160, step: 5 }
        ]
      },
      'oet': {
        fields: [
          { name: 'overallScore', label: 'Overall Score (0-500)', min: 0, max: 500, step: 10 },
          { name: 'listening', label: 'Listening (0-500)', min: 0, max: 500, step: 10 },
          { name: 'reading', label: 'Reading (0-500)', min: 0, max: 500, step: 10 },
          { name: 'writing', label: 'Writing (0-500)', min: 0, max: 500, step: 10 },
          { name: 'speaking', label: 'Speaking (0-500)', min: 0, max: 500, step: 10 }
        ]
      },
      'c1-advanced': {
        fields: [
          { name: 'overallScore', label: 'Overall Score (0-210)', min: 0, max: 210, step: 1 },
          { name: 'reading', label: 'Reading (0-210)', min: 0, max: 210, step: 1 },
          { name: 'writing', label: 'Writing (0-210)', min: 0, max: 210, step: 1 },
          { name: 'listening', label: 'Listening (0-210)', min: 0, max: 210, step: 1 },
          { name: 'speaking', label: 'Speaking (0-210)', min: 0, max: 210, step: 1 },
          { name: 'useOfEnglish', label: 'Use of English (0-210)', min: 0, max: 210, step: 1 }
        ]
      },
      'cael': {
        fields: [
          { name: 'overallScore', label: 'Overall Score (0-90)', min: 0, max: 90, step: 1 },
          { name: 'listening', label: 'Listening (0-90)', min: 0, max: 90, step: 1 },
          { name: 'reading', label: 'Reading (0-90)', min: 0, max: 90, step: 1 },
          { name: 'writing', label: 'Writing (0-90)', min: 0, max: 90, step: 1 },
          { name: 'speaking', label: 'Speaking (0-90)', min: 0, max: 90, step: 1 }
        ]
      },
      'languagecert': {
        fields: [
          { name: 'overallScore', label: 'Overall Score (0-50)', min: 0, max: 50, step: 1 },
          { name: 'listening', label: 'Listening (0-50)', min: 0, max: 50, step: 1 },
          { name: 'reading', label: 'Reading (0-50)', min: 0, max: 50, step: 1 },
          { name: 'writing', label: 'Writing (0-50)', min: 0, max: 50, step: 1 },
          { name: 'speaking', label: 'Speaking (0-50)', min: 0, max: 50, step: 1 }
        ]
      },
      'goethe': {
        fields: [
          { name: 'overallScore', label: 'Overall Score (0-100)', min: 0, max: 100, step: 1 },
          { name: 'listening', label: 'Listening (0-100)', min: 0, max: 100, step: 1 },
          { name: 'reading', label: 'Reading (0-100)', min: 0, max: 100, step: 1 },
          { name: 'writing', label: 'Writing (0-100)', min: 0, max: 100, step: 1 },
          { name: 'speaking', label: 'Speaking (0-100)', min: 0, max: 100, step: 1 }
        ]
      },
      'testdaf': {
        fields: [
          { name: 'overallScore', label: 'Overall Score (1-100)', min: 1, max: 100, step: 1 },
          { name: 'speaking', label: 'Speaking (1-100)', min: 1, max: 100, step: 1 },
          { name: 'writing', label: 'Writing (1-100)', min: 1, max: 100, step: 1 },
          { name: 'listening', label: 'Listening (1-100)', min: 1, max: 100, step: 1 },
          { name: 'reading', label: 'Reading (1-100)', min: 1, max: 100, step: 1 }
        ]
      }
    };
    return configs[testCode] || configs['ielts'];
  };

  const getDefaultTestTypes = () => {
    return [
      {
        id: 'ielts',
        name: 'IELTS',
        fields: [
          { name: 'overallScore', label: 'Overall Score (1-9)', min: 1, max: 9, step: 0.5 },
          { name: 'listening', label: 'Listening (1-9)', min: 1, max: 9, step: 0.5 },
          { name: 'reading', label: 'Reading (1-9)', min: 1, max: 9, step: 0.5 },
          { name: 'writing', label: 'Writing (1-9)', min: 1, max: 9, step: 0.5 },
          { name: 'speaking', label: 'Speaking (1-9)', min: 1, max: 9, step: 0.5 }
        ]
      }
    ];
  };

  // Pre-fill form data when editing
  useEffect(() => {
    if (qualification && isOpen) {
      // Determine test type from title or scoreType
      let testType = '';
      if (qualification.title?.toLowerCase().includes('ielts') || qualification.scoreType?.toLowerCase().includes('ielts')) {
        testType = 'ielts';
      } else if (qualification.title?.toLowerCase().includes('toefl') || qualification.scoreType?.toLowerCase().includes('toefl')) {
        testType = 'toefl';
      } else if (qualification.title?.toLowerCase().includes('pte') || qualification.scoreType?.toLowerCase().includes('pte')) {
        testType = 'pte';
      } else if (qualification.title?.toLowerCase().includes('duolingo') || qualification.scoreType?.toLowerCase().includes('duolingo')) {
        testType = 'duolingo';
      } else if (qualification.title?.toLowerCase().includes('oet') || qualification.scoreType?.toLowerCase().includes('oet')) {
        testType = 'oet';
      } else if (qualification.title?.toLowerCase().includes('cae') || qualification.title?.toLowerCase().includes('c1 advanced') || qualification.scoreType?.toLowerCase().includes('cae') || qualification.scoreType?.toLowerCase().includes('c1 advanced')) {
        testType = 'c1-advanced';
      } else if (qualification.title?.toLowerCase().includes('cael') || qualification.scoreType?.toLowerCase().includes('cael')) {
        testType = 'cael';
      } else if (qualification.title?.toLowerCase().includes('languagecert') || qualification.scoreType?.toLowerCase().includes('languagecert')) {
        testType = 'languagecert';
      } else if (qualification.title?.toLowerCase().includes('goethe') || qualification.scoreType?.toLowerCase().includes('goethe')) {
        testType = 'goethe';
      } else if (qualification.title?.toLowerCase().includes('testdaf') || qualification.scoreType?.toLowerCase().includes('testdaf')) {
        testType = 'testdaf';
      }

      setFormData({
        testType: testType,
        overallScore: qualification.detailedScores?.overall || qualification.score || '',
        listening: qualification.detailedScores?.listening || '',
        reading: qualification.detailedScores?.reading || '',
        writing: qualification.detailedScores?.writing || '',
        speaking: qualification.detailedScores?.speaking || '',
        production: qualification.detailedScores?.production || '',
        comprehension: qualification.detailedScores?.comprehension || '',
        conversation: qualification.detailedScores?.conversation || '',
        literacy: qualification.detailedScores?.literacy || '',
        useOfEnglish: qualification.detailedScores?.useOfEnglish || '',
        testDate: qualification.startDate || '',
        expiryDate: qualification.expiryDate || '',
        description: qualification.description || ''
      });
    } else if (!qualification && isOpen) {
      // Reset form for new qualification
      setFormData({
        testType: '',
        overallScore: '',
        listening: '',
        reading: '',
        writing: '',
        speaking: '',
        production: '',
        comprehension: '',
        conversation: '',
        literacy: '',
        useOfEnglish: '',
        testDate: '',
        expiryDate: '',
        description: ''
      });
    }
  }, [qualification, isOpen]);

  // testTypes is now loaded from parameters via useEffect above

  const selectedTest = testTypes.find(test => test.id === formData.testType);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const testData = {
      ...(qualification && { id: qualification.id }), // Include ID for updates
      type: 'language',
      title: `${selectedTest?.name} - ${formData.overallScore}`,
      institution: selectedTest?.name,
      field: 'English Language',
      score: formData.overallScore,
      scoreType: selectedTest?.name,
      startDate: formData.testDate,
      expiryDate: formData.expiryDate,
      description: formData.description,
      status: 'valid',
      // Store detailed scores
      detailedScores: {
        overall: formData.overallScore,
        listening: formData.listening,
        reading: formData.reading,
        writing: formData.writing,
        speaking: formData.speaking,
        production: formData.production,
        comprehension: formData.comprehension,
        conversation: formData.conversation,
        literacy: formData.literacy,
        useOfEnglish: formData.useOfEnglish
      }
    };

    onSave(testData);
    onClose();
    
    // Reset form
    setFormData({
      testType: '',
      overallScore: '',
      listening: '',
      reading: '',
      writing: '',
      speaking: '',
      testDate: '',
      expiryDate: '',
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
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Globe className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {qualification 
                  ? (language === 'en' ? 'Edit English Test' : 'Modifier le Test d\'Anglais')
                  : (language === 'en' ? 'Add English Test' : 'Ajouter un Test d\'Anglais')
                }
              </h2>
              <p className="text-sm text-gray-600">
                {qualification
                  ? (language === 'en' ? 'Update your english test details here' : 'Mettez à jour les détails de votre test d\'anglais ici')
                  : (language === 'en' ? 'Add your new english test details here' : 'Ajoutez les détails de votre nouveau test d\'anglais ici')
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
          {/* Test Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'en' ? 'Test Type' : 'Type de Test'} *
            </label>
            <select
              value={formData.testType}
              onChange={(e) => handleInputChange('testType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">{language === 'en' ? 'Select Test Type' : 'Sélectionner le Type de Test'}</option>
              {testTypes.map(test => (
                <option key={test.id} value={test.id}>{test.name}</option>
              ))}
            </select>
          </div>

          {/* Test Details */}
          {selectedTest && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                  {selectedTest.name}
                </h3>
                <p className="text-sm text-emerald-600">
                  {language === 'en' ? 'English Language Tests' : 'Tests de Langue Anglaise'}
                </p>
              </div>

              {/* Score Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTest.fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label} *
                    </label>
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={`${field.min}-${field.max}`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    {field.name === 'overallScore' && formData[field.name] && (
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'en' ? `Enter score from ${field.min} to ${field.max}` : `Entrez le score de ${field.min} à ${field.max}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'en' ? 'Test Date' : 'Date du Test'}
              </label>
              <input
                type="date"
                value={formData.testDate}
                onChange={(e) => handleInputChange('testDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'en' ? 'Expiry Date' : 'Date d\'Expiration'}
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
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
              placeholder={language === 'en' ? 'Additional details about your test...' : 'Détails supplémentaires sur votre test...'}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Save className="w-4 h-4" />
              <span className="font-medium">
                {qualification 
                  ? (language === 'en' ? 'Update Test' : 'Mettre à jour')
                  : (language === 'en' ? 'Save Test' : 'Enregistrer')
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnglishTestModal;

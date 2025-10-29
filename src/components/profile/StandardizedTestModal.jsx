import React, { useState, useEffect } from 'react';
import { X, Save, Award } from 'lucide-react';
import { useAllParameters } from '../../hooks/useAllParameters';

const StandardizedTestModal = ({ isOpen, onClose, onSave, language, qualification = null }) => {
  const [formData, setFormData] = useState({
    testType: '',
    totalScore: '',
    verbal: '',
    quantitative: '',
    analytical: '',
    reading: '',
    readingWriting: '', // Nouveau champ pour SAT Reading and Writing
    writing: '',
    mathematics: '',
    science: '',
    integratedReasoning: '',
    chineseLanguage: '', // Champ pour CSCA
    socialStudies: '', // Champ pour CSCA
    testDate: '',
    expiryDate: '',
    description: ''
  });

  const [testTypes, setTestTypes] = useState([]);

  // Load test types from centralized parameters
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();

  useEffect(() => {
    if (allParams?.standardizedTests) {
      const formattedTests = allParams.standardizedTests.map(test => {
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
      'gmat': {
        fields: [
          { name: 'totalScore', label: 'Total (200-800)', min: 200, max: 800, step: 10 },
          { name: 'integratedReasoning', label: 'Integrated Reasoning (1-8)', min: 1, max: 8, step: 1 },
          { name: 'quantitative', label: 'Quantitative (1-60)', min: 1, max: 60, step: 1 },
          { name: 'verbal', label: 'Verbal (1-60)', min: 1, max: 60, step: 1 },
          { name: 'analytical', label: 'Analytical Writing Assessment (1-6)', min: 1, max: 6, step: 0.5 }
        ]
      },
      'gre': {
        fields: [
          { name: 'verbal', label: 'Verbal Reasoning (130-170)', min: 130, max: 170, step: 1 },
          { name: 'quantitative', label: 'Quantitative Reasoning (130-170)', min: 130, max: 170, step: 1 },
          { name: 'analytical', label: 'Analytical Writing (1-6)', min: 1, max: 6, step: 0.5 }
        ]
      },
      'sat': {
        fields: [
          { name: 'totalScore', label: 'Total (400-1600)', min: 400, max: 1600, step: 10 },
          { name: 'readingWriting', label: 'Reading and Writing (200-800)', min: 200, max: 800, step: 10 },
          { name: 'mathematics', label: 'Mathematics (200-800)', min: 200, max: 800, step: 10 },
          { name: 'writing', label: 'Writing and Language (10-40)', min: 10, max: 40, step: 1 },
          { name: 'reading', label: 'Reading (1-40)', min: 1, max: 40, step: 1 }
        ]
      },
      'act': {
        fields: [
          { name: 'totalScore', label: 'Total (1-36)', min: 1, max: 36, step: 1 },
          { name: 'english', label: 'English (1-36)', min: 1, max: 36, step: 1 },
          { name: 'mathematics', label: 'Mathematics (1-36)', min: 1, max: 36, step: 1 },
          { name: 'reading', label: 'Reading (1-36)', min: 1, max: 36, step: 1 },
          { name: 'science', label: 'Science (1-36)', min: 1, max: 36, step: 1 }
        ]
      },
      'lsat': {
        fields: [
          { name: 'totalScore', label: 'Total (120-180)', min: 120, max: 180, step: 1 },
          { name: 'logicalReasoning', label: 'Logical Reasoning (1-50)', min: 1, max: 50, step: 1 },
          { name: 'analyticalReasoning', label: 'Analytical Reasoning (1-50)', min: 1, max: 50, step: 1 },
          { name: 'readingComprehension', label: 'Reading Comprehension (1-50)', min: 1, max: 50, step: 1 },
          { name: 'writingSample', label: 'Writing Sample (1-6)', min: 1, max: 6, step: 0.5 }
        ]
      },
      'csca': {
        fields: [
          { name: 'totalScore', label: 'Total Score (0-100)', min: 0, max: 100, step: 1 },
          { name: 'chineseLanguage', label: 'Chinese Language (0-100)', min: 0, max: 100, step: 1 },
          { name: 'mathematics', label: 'Mathematics (0-100)', min: 0, max: 100, step: 1 },
          { name: 'science', label: 'Science (0-100)', min: 0, max: 100, step: 1 },
          { name: 'socialStudies', label: 'Social Studies (0-100)', min: 0, max: 100, step: 1 }
        ]
      }
    };
    return configs[testCode] || configs['gmat'];
  };

  const getDefaultTestTypes = () => {
    return [
      {
        id: 'gmat',
        name: 'GMAT',
        fields: [
          { name: 'totalScore', label: 'Total (200-800)', min: 200, max: 800, step: 10 },
          { name: 'integratedReasoning', label: 'Integrated Reasoning (1-8)', min: 1, max: 8, step: 1 },
          { name: 'quantitative', label: 'Quantitative (1-60)', min: 1, max: 60, step: 1 },
          { name: 'verbal', label: 'Verbal (1-60)', min: 1, max: 60, step: 1 },
          { name: 'analytical', label: 'Analytical Writing Assessment (1-6)', min: 1, max: 6, step: 0.5 }
        ]
      }
    ];
  };

  // Pre-fill form data when editing
  useEffect(() => {
    console.log('StandardizedTestModal useEffect - qualification:', qualification, 'isOpen:', isOpen);
    
    if (qualification && isOpen) {
      // Determine test type from title or scoreType
      let testType = '';
      if (qualification.title?.toLowerCase().includes('gmat') || qualification.scoreType?.toLowerCase().includes('gmat')) {
        testType = 'gmat';
      } else if (qualification.title?.toLowerCase().includes('gre') || qualification.scoreType?.toLowerCase().includes('gre')) {
        testType = 'gre';
      } else if (qualification.title?.toLowerCase().includes('sat') || qualification.scoreType?.toLowerCase().includes('sat')) {
        testType = 'sat';
      } else if (qualification.title?.toLowerCase().includes('act') || qualification.scoreType?.toLowerCase().includes('act')) {
        testType = 'act';
      } else if (qualification.title?.toLowerCase().includes('lsat') || qualification.scoreType?.toLowerCase().includes('lsat')) {
        testType = 'lsat';
      } else if (qualification.title?.toLowerCase().includes('csca') || qualification.scoreType?.toLowerCase().includes('csca')) {
        testType = 'csca';
      }

      setFormData({
        testType: testType,
        totalScore: qualification.detailedScores?.totalScore || qualification.score || '',
        verbal: qualification.detailedScores?.verbal || '',
        quantitative: qualification.detailedScores?.quantitative || '',
        analytical: qualification.detailedScores?.analytical || '',
        reading: qualification.detailedScores?.reading || '',
        readingWriting: qualification.detailedScores?.readingWriting || '', // Nouveau champ
        writing: qualification.detailedScores?.writing || '',
        mathematics: qualification.detailedScores?.mathematics || '',
        science: qualification.detailedScores?.science || '',
        integratedReasoning: qualification.detailedScores?.integratedReasoning || '',
        chineseLanguage: qualification.detailedScores?.chineseLanguage || '',
        socialStudies: qualification.detailedScores?.socialStudies || '',
        testDate: qualification.startDate || '',
        expiryDate: qualification.expiryDate || '',
        description: qualification.description || ''
      });
    } else if (!qualification && isOpen) {
      // Reset form for new qualification
      setFormData({
        testType: '',
        totalScore: '',
        verbal: '',
        quantitative: '',
        analytical: '',
        reading: '',
        readingWriting: '', // Nouveau champ
        writing: '',
        mathematics: '',
        science: '',
        integratedReasoning: '',
        chineseLanguage: '', // Champ pour CSCA
        socialStudies: '', // Champ pour CSCA
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
      type: 'professional',
      title: `${selectedTest?.name} - ${formData.totalScore || formData.verbal || formData.quantitative}`,
      institution: selectedTest?.name,
      field: 'Standardized Test',
      score: formData.totalScore || formData.verbal || formData.quantitative,
      scoreType: selectedTest?.name,
      startDate: formData.testDate,
      expiryDate: formData.expiryDate,
      description: formData.description,
      status: 'valid',
      // Store detailed scores
      detailedScores: {
        total: formData.totalScore,
        verbal: formData.verbal,
        quantitative: formData.quantitative,
        analytical: formData.analytical,
        reading: formData.reading,
        readingWriting: formData.readingWriting, // Nouveau champ SAT
        writing: formData.writing,
        mathematics: formData.mathematics,
        science: formData.science,
        integratedReasoning: formData.integratedReasoning,
        english: formData.english,
        logicalReasoning: formData.logicalReasoning,
        analyticalReasoning: formData.analyticalReasoning,
        readingComprehension: formData.readingComprehension,
        chineseLanguage: formData.chineseLanguage, // Champ pour CSCA
        socialStudies: formData.socialStudies, // Champ pour CSCA
        writingSample: formData.writingSample
      }
    };

    onSave(testData);
    onClose();
    
    // Reset form
    setFormData({
      testType: '',
      totalScore: '',
      verbal: '',
      quantitative: '',
      analytical: '',
      reading: '',
      readingWriting: '', // Nouveau champ
      writing: '',
      mathematics: '',
      science: '',
      integratedReasoning: '',
      chineseLanguage: '', // Champ pour CSCA
      socialStudies: '', // Champ pour CSCA
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {qualification
                  ? (language === 'en' ? 'Edit Standardized Test' : 'Modifier le Test Standardisé')
                  : (language === 'en' ? 'Add Standardized Test' : 'Ajouter un Test Standardisé')
                }
              </h2>
              <p className="text-sm text-gray-600">
                {qualification
                  ? (language === 'en' ? 'Update your standardized test details here' : 'Mettez à jour les détails de votre test standardisé ici')
                  : (language === 'en' ? 'Add your new standardized test details here' : 'Ajoutez les détails de votre nouveau test standardisé ici')
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
              {language === 'en' ? 'Test Type' : 'Type de Test'}
            </label>
            <select
              value={formData.testType}
              onChange={(e) => handleInputChange('testType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  {selectedTest.name}
                </h3>
                <p className="text-sm text-purple-600">
                  {language === 'en' ? 'Standardised Tests' : 'Tests Standardisés'}
                </p>
              </div>

              {/* Score Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTest.fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={`${field.min}-${field.max}`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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

export default StandardizedTestModal;

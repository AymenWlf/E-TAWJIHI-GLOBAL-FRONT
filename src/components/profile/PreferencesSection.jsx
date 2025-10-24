import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, BookOpen, DollarSign, Globe, Info, ChevronDown, Search, X } from 'lucide-react';
import MultiSelect from '../ui/MultiSelect';
import CurrencySelector from './CurrencySelector';
import BudgetCalculator from './BudgetCalculator';
import SelectSearchable from '../ui/SelectSearchable';
import { useAllParameters } from '../../hooks/useAllParameters';
import preferencesService from '../../services/preferencesService';
import { mapCountriesFromAPI, mapSubjectsFromAPI, mapToAPI } from '../../utils/dataMappers';

const PreferencesSection = ({ profile, onUpdateProfile, language }) => {
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();
  const [formData, setFormData] = useState({
    preferredDestinations: [],
    preferredStudyLevel: '',
    preferredDegree: '',
    preferredIntakes: [],
    preferredSubjects: [],
    preferredCurrency: 'USD',
    annualBudget: {},
    scholarshipRequired: false
  });

  const [showStudyLevelInfo, setShowStudyLevelInfo] = useState(false);

  // Map study levels from parameters
  const getStudyLevelOptions = () => {
    if (!allParams?.studyLevels) return [];
    return allParams.studyLevels.map(level => ({
      value: level.code,
      label: language === 'fr' ? (level.labelFr || level.labelEn) : level.labelEn
    }));
  };

  // Map degrees from parameters
  const getDegreeOptions = () => {
    if (!allParams?.degrees) return [];
    return allParams.degrees.map(degree => ({
      value: degree.code,
      label: language === 'fr' ? (degree.labelFr || degree.labelEn) : degree.labelEn
    }));
  };

  // Map countries from parameters
  const getCountryOptions = () => {
    if (!allParams?.countries) return [];
    return allParams.countries.map(country => ({
      value: country.code,
      label: language === 'fr' ? (country.labelFr || country.labelEn) : country.labelEn
    }));
  };

  // Map subjects from parameters
  const getSubjectOptions = () => {
    if (!allParams?.fields) return [];
    return allParams.fields.map(field => ({
      value: field.code,
      label: language === 'fr' ? (field.labelFr || field.labelEn) : field.labelEn
    }));
  };

  // Generate intake options (same as preferences)
  const getIntakeOptions = () => {
    const currentYear = new Date().getFullYear();
    const intakes = [];
    const months = ['January', 'March', 'May', 'July', 'September', 'November'];
    
    for (let year = currentYear; year <= currentYear + 2; year++) {
      months.forEach(month => {
        const monthKey = month.toLowerCase();
        const intakeValue = `${monthKey}-${year}`;
        const intakeLabel = language === 'fr' 
          ? `${month} ${year}` 
          : `${month} ${year}`;
        
        intakes.push({
          value: intakeValue,
          label: intakeLabel
        });
      });
    }
    
    return intakes;
  };

  // Charger les préférences depuis l'API
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        const preferencesData = await preferencesService.getPreferences();
        setPreferences(preferencesData);
        setFormData({
          // Utiliser directement les codes pour MultiSelect
          preferredDestinations: Array.isArray(preferencesData.preferredDestinations) ? preferencesData.preferredDestinations : [],
          preferredStudyLevel: preferencesData.preferredStudyLevel || '',
          preferredDegree: preferencesData.preferredDegree || '',
          preferredIntakes: Array.isArray(preferencesData.preferredIntakes) ? preferencesData.preferredIntakes : [],
          // Utiliser directement les codes pour MultiSelect
          preferredSubjects: Array.isArray(preferencesData.preferredSubjects) ? preferencesData.preferredSubjects : [],
          preferredCurrency: preferencesData.preferredCurrency || 'USD',
          annualBudget: preferencesData.annualBudget || {},
          scholarshipRequired: preferencesData.scholarshipRequired || false
        });
      } catch (error) {
        console.error('Error loading preferences:', error);
        // En cas d'erreur, utiliser les données du profil comme fallback
        if (profile) {
          setFormData({
            // Utiliser directement les codes pour MultiSelect
            preferredDestinations: Array.isArray(profile.preferredDestinations) ? profile.preferredDestinations : [],
            preferredStudyLevel: profile.studyLevel || '',
            preferredDegree: profile.preferredDegree || '',
            preferredIntakes: Array.isArray(profile.preferredIntakes) ? profile.preferredIntakes : [],
            // Utiliser directement les codes pour MultiSelect
            preferredSubjects: Array.isArray(profile.preferredSubjects) ? profile.preferredSubjects : [],
            preferredCurrency: profile.preferredCurrency || 'USD',
            annualBudget: profile.annualBudget || {},
            scholarshipRequired: profile.scholarshipRequired || false
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [profile]);

  // Get study levels from parameters
  const getStudyLevels = () => {
    if (!allParams?.studyLevels) return [];
    return allParams.studyLevels.map(level => 
      language === 'fr' ? (level.labelFr || level.labelEn) : level.labelEn
    );
  };

  const studyLevelDescriptions = {
    en: {
      'Undergraduate': 'Bachelor\'s degree (3-4 years) - First university degree',
      'Postgraduate': 'Master\'s degree (1-2 years) - Advanced degree after Bachelor\'s',
      'PhD': 'Doctor of Philosophy (3-7 years) - Highest academic degree',
      'Diploma': 'Diploma program (1-2 years) - Vocational or technical training',
      'Certificate': 'Certificate program (6 months - 1 year) - Short-term specialized training',
      'Foundation': 'Foundation year (1 year) - Preparatory program for university entry'
    },
    fr: {
      'Undergraduate': 'Licence (3-4 ans) - Premier diplôme universitaire',
      'Postgraduate': 'Master (1-2 ans) - Diplôme avancé après la Licence',
      'PhD': 'Doctorat (3-7 ans) - Plus haut diplôme académique',
      'Diploma': 'Diplôme (1-2 ans) - Formation professionnelle ou technique',
      'Certificate': 'Certificat (6 mois - 1 an) - Formation spécialisée de courte durée',
      'Foundation': 'Année préparatoire (1 an) - Programme préparatoire pour l\'entrée à l\'université'
    }
  };

  // Générer les intakes disponibles (année en cours jusqu'à janvier 2027)
  const currentYear = new Date().getFullYear();
  const generateIntakes = () => {
    const intakes = [];
    const months = ['January', 'March', 'May', 'July', 'September', 'November'];
    
    // Générer pour l'année actuelle et les années suivantes jusqu'à 2027
    for (let year = currentYear; year <= 2027; year++) {
      months.forEach(month => {
        // Pour l'année actuelle, ne pas inclure les mois passés
        if (year === currentYear) {
          const currentMonth = new Date().getMonth();
          const monthIndex = months.indexOf(month);
          if (monthIndex < currentMonth) return; // Skip past months
        }
        
        // Pour 2027, s'arrêter à janvier
        if (year === 2027 && month !== 'January') return;
        
        intakes.push({
          value: `${month} ${year}`,
          label: `${month} ${year}`,
          month: month,
          year: year,
          displayText: `${month} ${year}`
        });
      });
    }
    
    return intakes;
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Les données sont déjà dans le bon format pour l'API
      const dataToSave = {
        ...formData
      };
      
      const updatedPreferences = await preferencesService.updatePreferences(dataToSave);
      setPreferences(updatedPreferences);
      // Notifier le composant parent si nécessaire
      if (onUpdateProfile) {
        onUpdateProfile(updatedPreferences);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      // En cas d'erreur, essayer de sauvegarder via le profil
      if (onUpdateProfile) {
        onUpdateProfile(formData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          {language === 'en' ? 'Loading preferences...' : 'Chargement des préférences...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'Study Preferences' : 'Préférences d\'Études'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' ? 'Configure your study preferences and requirements' : 'Configurez vos préférences et exigences d\'études'}
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <span className="font-medium">{language === 'en' ? 'Save Preferences' : 'Enregistrer les Préférences'}</span>
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preferred Destinations */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Preferred Destinations' : 'Destinations Préférées'}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Select multiple countries where you would like to study' : 'Sélectionnez plusieurs pays où vous aimeriez étudier'}
          </p>
          <MultiSelect
            options={getCountryOptions()}
            value={formData.preferredDestinations}
            onChange={(value) => handleInputChange('preferredDestinations', value)}
            placeholder={language === 'en' ? 'Select countries...' : 'Sélectionner des pays...'}
            searchPlaceholder={language === 'en' ? 'Search countries...' : 'Rechercher des pays...'}
            maxSelections={5}
          />
        </div>

        {/* Study Level */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Preferred Study Level' : 'Niveau d\'Études Préféré'}
            </h3>
            <button
              type="button"
              onClick={() => setShowStudyLevelInfo(!showStudyLevelInfo)}
              className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
              title={language === 'en' ? 'Study levels information' : 'Information sur les niveaux d\'études'}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Select your preferred study level' : 'Sélectionnez votre niveau d\'études préféré'}
          </p>
          <SelectSearchable
            options={getStudyLevelOptions()}
            value={formData.preferredStudyLevel}
            onChange={(value) => handleInputChange('preferredStudyLevel', value)}
            placeholder={language === 'en' ? 'Select Study Level' : 'Sélectionner le Niveau d\'Études'}
            searchPlaceholder={language === 'en' ? 'Search study levels...' : 'Rechercher des niveaux...'}
            className="w-full"
          />

          {/* Study Level Information */}
          {showStudyLevelInfo && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <h4 className="text-sm font-semibold text-emerald-800 mb-3">
                {language === 'en' ? 'Study Levels Explained' : 'Explication des Niveaux d\'Études'}
              </h4>
              <div className="space-y-2">
                {getStudyLevels().map(level => (
                  <div key={level} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-emerald-100 last:border-b-0">
                    <div className="flex-1">
                      <span className="font-medium text-emerald-900">{level}</span>
                    </div>
                    <div className="flex-1 sm:ml-4">
                      <span className="text-sm text-emerald-700">
                        {studyLevelDescriptions[language][level] || 'No description available'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <p className="text-xs text-emerald-600">
                  {language === 'en' 
                    ? '💡 Tip: Choose the level that matches your current education and career goals'
                    : '💡 Conseil : Choisissez le niveau qui correspond à votre éducation actuelle et vos objectifs de carrière'
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Preferred Degree */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Preferred Degree' : 'Diplôme Préféré'}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Select your preferred degree type' : 'Sélectionnez votre type de diplôme préféré'}
          </p>
          <SelectSearchable
            options={getDegreeOptions()}
            value={formData.preferredDegree}
            onChange={(value) => handleInputChange('preferredDegree', value)}
            placeholder={language === 'en' ? 'Select Degree' : 'Sélectionner le Diplôme'}
            searchPlaceholder={language === 'en' ? 'Search degrees...' : 'Rechercher des diplômes...'}
            className="w-full"
          />
        </div>

        {/* Preferred Intakes */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Preferred Intakes' : 'Périodes d\'Admission Préférées'}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Select multiple intake periods (up to January 2027)' : 'Sélectionnez plusieurs périodes d\'admission (jusqu\'à janvier 2027)'}
          </p>
          <MultiSelect
            options={getIntakeOptions()}
            value={formData.preferredIntakes}
            onChange={(value) => handleInputChange('preferredIntakes', value)}
            placeholder={language === 'en' ? 'Select intakes...' : 'Sélectionner des admissions...'}
            searchPlaceholder={language === 'en' ? 'Search intakes...' : 'Rechercher des admissions...'}
            maxSelections={10}
          />
        </div>

        {/* Preferred Subjects */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Preferred Subjects' : 'Matières Préférées'}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Select multiple subjects of interest' : 'Sélectionnez plusieurs matières d\'intérêt'}
          </p>
          <MultiSelect
            options={getSubjectOptions()}
            value={formData.preferredSubjects}
            onChange={(value) => handleInputChange('preferredSubjects', value)}
            placeholder={language === 'en' ? 'Select subjects...' : 'Sélectionner des matières...'}
            searchPlaceholder={language === 'en' ? 'Search subjects...' : 'Rechercher des matières...'}
            maxSelections={10}
          />
        </div>

        {/* Currency Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Preferred Currency' : 'Devise Préférée'}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Auto-filled based on your country' : 'Rempli automatiquement selon votre pays'}
          </p>
          <CurrencySelector
            value={formData.preferredCurrency}
            onChange={(value) => handleInputChange('preferredCurrency', value)}
            userCountry={profile?.country}
            language={language}
          />
        </div>
      </div>

      {/* Budget Calculator */}
      <div className="mt-8">
        <BudgetCalculator
          value={formData.annualBudget}
          onChange={(value) => handleInputChange('annualBudget', value)}
          userCountry={profile?.country}
          preferredCountries={formData.preferredDestinations}
          preferredCurrency={formData.preferredCurrency}
          language={language}
        />
      </div>

      {/* Scholarship Requirement */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="scholarshipRequired"
            checked={formData.scholarshipRequired}
            onChange={(e) => handleInputChange('scholarshipRequired', e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="scholarshipRequired" className="text-lg font-semibold text-gray-900 cursor-pointer">
            {language === 'en' ? 'I require a scholarship to study abroad' : 'J\'ai besoin d\'une bourse pour étudier à l\'étranger'}
          </label>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {language === 'en' 
            ? 'Check this if you need financial assistance to pursue your studies' 
            : 'Cochez cette case si vous avez besoin d\'une assistance financière pour poursuivre vos études'}
        </p>
      </div>

      {/* Selected Preferences Summary */}
      {((formData.preferredDestinations && formData.preferredDestinations.length > 0) || 
        (formData.preferredSubjects && formData.preferredSubjects.length > 0) || 
        (formData.preferredIntakes && formData.preferredIntakes.length > 0)) && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'en' ? 'Selected Preferences' : 'Préférences Sélectionnées'}
          </h3>
          
          {formData.preferredDestinations && formData.preferredDestinations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Destinations:' : 'Destinations:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.preferredDestinations.map((country, index) => (
                  <span key={`destination-${index}-${typeof country === 'string' ? country : country.code || country.name}`} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {typeof country === 'string' ? country : `${country.flag || ''} ${country.name || country.code || country}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.preferredIntakes && formData.preferredIntakes.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Intakes:' : 'Périodes d\'Admission:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.preferredIntakes.map((intake, index) => (
                  <span key={`intake-${index}-${intake}`} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    📅 {intake}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.preferredSubjects && formData.preferredSubjects.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Subjects:' : 'Matières:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.preferredSubjects.map((subject, index) => (
                  <span key={`subject-${index}-${typeof subject === 'string' ? subject : subject.code || subject.name}`} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                    {typeof subject === 'string' ? subject : `${subject.icon || ''} ${subject.name || subject.code || subject}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Save Button */}
      <div className="flex justify-center pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="font-medium">{language === 'en' ? 'Saving...' : 'Enregistrement...'}</span>
            </>
          ) : (
            <>
              <span className="font-medium">{language === 'en' ? 'Save Preferences' : 'Enregistrer les Préférences'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PreferencesSection;

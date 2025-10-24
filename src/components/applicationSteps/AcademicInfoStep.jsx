import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Trash2, Award, BookOpen, Globe } from 'lucide-react';
import userProfileService from '../../services/userProfileService';

const AcademicInfoStep = ({ data, onSave, language }) => {
  const [academicData, setAcademicData] = useState({
    highestEducation: '',
    currentInstitution: '',
    graduationYear: '',
    gpa: '',
    academicAchievements: [],
    languageProficiency: {
      english: { level: '', certificate: '', score: '' },
      french: { level: '', certificate: '', score: '' },
      other: { language: '', level: '', certificate: '', score: '' }
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrefilledData();
  }, []);

  const loadPrefilledData = async () => {
    try {
      setLoading(true);
      const profileData = await userProfileService.getAcademicInfo();
      setAcademicData(prev => ({
        ...prev,
        ...profileData,
        ...data // Override with any existing application data
      }));
    } catch (error) {
      console.error('Failed to load academic data:', error);
      setAcademicData(prev => ({ ...prev, ...data }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child, subChild] = field.split('.');
      setAcademicData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: subChild ? {
            ...prev[parent][child],
            [subChild]: value
          } : value
        }
      }));
    } else {
      setAcademicData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addAchievement = () => {
    setAcademicData(prev => ({
      ...prev,
      academicAchievements: [...prev.academicAchievements, {
        id: Date.now(),
        title: '',
        description: '',
        year: '',
        institution: ''
      }]
    }));
  };

  const removeAchievement = (index) => {
    setAcademicData(prev => ({
      ...prev,
      academicAchievements: prev.academicAchievements.filter((_, i) => i !== index)
    }));
  };

  const updateAchievement = (index, field, value) => {
    setAcademicData(prev => ({
      ...prev,
      academicAchievements: prev.academicAchievements.map((achievement, i) => 
        i === index ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(academicData);
    } catch (error) {
      console.error('Failed to save academic info:', error);
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = () => {
    return academicData.highestEducation && 
           academicData.currentInstitution && 
           academicData.graduationYear;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">
          {language === 'fr' ? 'Chargement des informations académiques...' : 'Loading academic information...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {language === 'fr' ? 'Informations Académiques' : 'Academic Information'}
        </h3>
        <p className="text-gray-600">
          {language === 'fr' 
            ? 'Vos informations académiques ont été préremplies depuis votre profil' 
            : 'Your academic information has been pre-filled from your profile'
          }
        </p>
      </div>

      {/* Basic Academic Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          {language === 'fr' ? 'Informations de Base' : 'Basic Information'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Niveau d\'Études le Plus Élevé' : 'Highest Education Level'} *
            </label>
            <select
              value={academicData.highestEducation}
              onChange={(e) => handleInputChange('highestEducation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{language === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
              <option value="high_school">{language === 'fr' ? 'Lycée' : 'High School'}</option>
              <option value="bachelor">{language === 'fr' ? 'Licence' : 'Bachelor'}</option>
              <option value="master">{language === 'fr' ? 'Master' : 'Master'}</option>
              <option value="phd">{language === 'fr' ? 'Doctorat' : 'PhD'}</option>
              <option value="other">{language === 'fr' ? 'Autre' : 'Other'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Institution Actuelle' : 'Current Institution'} *
            </label>
            <input
              type="text"
              value={academicData.currentInstitution}
              onChange={(e) => handleInputChange('currentInstitution', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? 'Université de Paris' : 'University of Paris'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Année de Diplôme' : 'Graduation Year'} *
            </label>
            <input
              type="number"
              value={academicData.graduationYear}
              onChange={(e) => handleInputChange('graduationYear', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2023"
              min="1950"
              max="2030"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Moyenne Générale (GPA)' : 'Grade Point Average (GPA)'}
            </label>
            <input
              type="text"
              value={academicData.gpa}
              onChange={(e) => handleInputChange('gpa', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3.5/4.0 ou 15/20"
            />
          </div>
        </div>
      </div>

      {/* Academic Achievements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Award className="w-4 h-4" />
            {language === 'fr' ? 'Réalisations Académiques' : 'Academic Achievements'}
          </h4>
          <button
            onClick={addAchievement}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            <Plus className="w-4 h-4" />
            {language === 'fr' ? 'Ajouter' : 'Add'}
          </button>
        </div>

        {academicData.academicAchievements.map((achievement, index) => (
          <div key={achievement.id || index} className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-900">
                {language === 'fr' ? 'Réalisation' : 'Achievement'} {index + 1}
              </h5>
              <button
                onClick={() => removeAchievement(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Titre' : 'Title'} *
                </label>
                <input
                  type="text"
                  value={achievement.title}
                  onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'fr' ? 'Prix d\'Excellence' : 'Excellence Award'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Année' : 'Year'}
                </label>
                <input
                  type="number"
                  value={achievement.year}
                  onChange={(e) => updateAchievement(index, 'year', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2023"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Description' : 'Description'}
                </label>
                <textarea
                  value={achievement.description}
                  onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'fr' ? 'Description de la réalisation...' : 'Achievement description...'}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Language Proficiency */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {language === 'fr' ? 'Maîtrise des Langues' : 'Language Proficiency'}
        </h4>

        <div className="space-y-4">
          {/* English */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">
              {language === 'fr' ? 'Anglais' : 'English'}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Niveau' : 'Level'}
                </label>
                <select
                  value={academicData.languageProficiency.english.level}
                  onChange={(e) => handleInputChange('languageProficiency.english.level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{language === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
                  <option value="beginner">{language === 'fr' ? 'Débutant' : 'Beginner'}</option>
                  <option value="intermediate">{language === 'fr' ? 'Intermédiaire' : 'Intermediate'}</option>
                  <option value="advanced">{language === 'fr' ? 'Avancé' : 'Advanced'}</option>
                  <option value="native">{language === 'fr' ? 'Natif' : 'Native'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Certificat' : 'Certificate'}
                </label>
                <input
                  type="text"
                  value={academicData.languageProficiency.english.certificate}
                  onChange={(e) => handleInputChange('languageProficiency.english.certificate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="TOEFL, IELTS, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Score' : 'Score'}
                </label>
                <input
                  type="text"
                  value={academicData.languageProficiency.english.score}
                  onChange={(e) => handleInputChange('languageProficiency.english.score', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="110/120"
                />
              </div>
            </div>
          </div>

          {/* French */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">
              {language === 'fr' ? 'Français' : 'French'}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Niveau' : 'Level'}
                </label>
                <select
                  value={academicData.languageProficiency.french.level}
                  onChange={(e) => handleInputChange('languageProficiency.french.level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{language === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
                  <option value="beginner">{language === 'fr' ? 'Débutant' : 'Beginner'}</option>
                  <option value="intermediate">{language === 'fr' ? 'Intermédiaire' : 'Intermediate'}</option>
                  <option value="advanced">{language === 'fr' ? 'Avancé' : 'Advanced'}</option>
                  <option value="native">{language === 'fr' ? 'Natif' : 'Native'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Certificat' : 'Certificate'}
                </label>
                <input
                  type="text"
                  value={academicData.languageProficiency.french.certificate}
                  onChange={(e) => handleInputChange('languageProficiency.french.certificate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="DELF, DALF, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Score' : 'Score'}
                </label>
                <input
                  type="text"
                  value={academicData.languageProficiency.french.score}
                  onChange={(e) => handleInputChange('languageProficiency.french.score', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="B2, C1, etc."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={!isFormValid() || saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {language === 'fr' ? 'Sauvegarde...' : 'Saving...'}
            </>
          ) : (
            <>
              <GraduationCap className="w-4 h-4" />
              {language === 'fr' ? 'Sauvegarder' : 'Save'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AcademicInfoStep;

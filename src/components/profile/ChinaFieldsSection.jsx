import React, { useState, useEffect } from 'react';
import { Flag, Users, Save, AlertCircle, CheckCircle, Calendar, Phone, Briefcase } from 'lucide-react';
import profileService from '../../services/profileService';

const ChinaFieldsSection = ({ language, profile, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    religion: '',
    familyMembers: {
      father: {
        name: '',
        dateOfBirth: '',
        occupation: '',
        phone: ''
      },
      mother: {
        name: '',
        dateOfBirth: '',
        occupation: '',
        phone: ''
      }
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load data from profile on mount
  useEffect(() => {
    if (profile) {
      setFormData({
        religion: profile.religion || '',
        familyMembers: profile.chinaFamilyMembers || {
          father: {
            name: '',
            dateOfBirth: '',
            occupation: '',
            phone: ''
          },
          mother: {
            name: '',
            dateOfBirth: '',
            occupation: '',
            phone: ''
          }
        }
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    if (field === 'religion') {
      setFormData(prev => ({
        ...prev,
        religion: value
      }));
    } else {
      // For nested family members fields
      const [member, subField] = field.split('.');
      setFormData(prev => ({
        ...prev,
        familyMembers: {
          ...prev.familyMembers,
          [member]: {
            ...prev.familyMembers[member],
            [subField]: value
          }
        }
      }));
    }
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        religion: formData.religion,
        chinaFamilyMembers: formData.familyMembers
      };

      await profileService.updateProfile(updateData);

      setMessage({
        type: 'success',
        text: language === 'en' ? 'China fields saved successfully!' : 'Champs Chine sauvegardés avec succès!'
      });

      // Call parent callback to refresh profile
      if (onUpdateProfile) {
        await onUpdateProfile();
      }
    } catch (error) {
      console.error('Error saving China fields:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || (language === 'en' ? 'Failed to save China fields' : 'Échec de la sauvegarde des champs Chine')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Flag className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🇨🇳 {language === 'en' ? 'China Application Fields' : 'Champs Spécifiques à la Chine'}
            </h2>
            <p className="text-gray-600 mt-1">
              {language === 'en' 
                ? 'Manage your China application specific information. This data will be automatically filled in new China applications.'
                : 'Gérez vos informations spécifiques à la candidature Chine. Ces données seront automatiquement remplies dans les nouvelles candidatures Chine.'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Religion */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Religion' : 'Religion'} *
          </label>
          <input
            type="text"
            value={formData.religion}
            onChange={(e) => handleInputChange('religion', e.target.value)}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            placeholder={language === 'en' ? 'Enter your religion' : 'Saisissez votre religion'}
            required
          />
        </div>

        {/* Family Members */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            {language === 'en' ? 'Family Members' : 'Membres de la Famille'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Father */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                {language === 'en' ? 'Father' : 'Père'}
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Name' : 'Nom'} *
                  </label>
                  <input
                    type="text"
                    value={formData.familyMembers.father.name}
                    onChange={(e) => handleInputChange('father.name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder={language === 'en' ? 'Father\'s name' : 'Nom du père'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Date of Birth' : 'Date de naissance'}
                  </label>
                  <input
                    type="date"
                    value={formData.familyMembers.father.dateOfBirth}
                    onChange={(e) => handleInputChange('father.dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Occupation' : 'Profession'}
                  </label>
                  <input
                    type="text"
                    value={formData.familyMembers.father.occupation}
                    onChange={(e) => handleInputChange('father.occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder={language === 'en' ? 'Father\'s occupation' : 'Profession du père'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Phone' : 'Téléphone'}
                  </label>
                  <input
                    type="tel"
                    value={formData.familyMembers.father.phone}
                    onChange={(e) => handleInputChange('father.phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder={language === 'en' ? 'Father\'s phone' : 'Téléphone du père'}
                  />
                </div>
              </div>
            </div>

            {/* Mother */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                {language === 'en' ? 'Mother' : 'Mère'}
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Name' : 'Nom'} *
                  </label>
                  <input
                    type="text"
                    value={formData.familyMembers.mother.name}
                    onChange={(e) => handleInputChange('mother.name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder={language === 'en' ? 'Mother\'s name' : 'Nom de la mère'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Date of Birth' : 'Date de naissance'}
                  </label>
                  <input
                    type="date"
                    value={formData.familyMembers.mother.dateOfBirth}
                    onChange={(e) => handleInputChange('mother.dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Occupation' : 'Profession'}
                  </label>
                  <input
                    type="text"
                    value={formData.familyMembers.mother.occupation}
                    onChange={(e) => handleInputChange('mother.occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder={language === 'en' ? 'Mother\'s occupation' : 'Profession de la mère'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Phone' : 'Téléphone'}
                  </label>
                  <input
                    type="tel"
                    value={formData.familyMembers.mother.phone}
                    onChange={(e) => handleInputChange('mother.phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder={language === 'en' ? 'Mother\'s phone' : 'Téléphone de la mère'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg border flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading || !formData.religion || !formData.familyMembers.father.name || !formData.familyMembers.mother.name}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {language === 'en' ? 'Saving...' : 'Sauvegarde...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {language === 'en' ? 'Save China Fields' : 'Enregistrer les Champs Chine'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              {language === 'en' ? 'Automatic Filling' : 'Remplissage Automatique'}
            </h3>
            <p className="text-sm text-blue-800">
              {language === 'en' 
                ? 'When you create a new application for China, these fields will be automatically filled from your profile. You can still modify them in the application form if needed.'
                : 'Lors de la création d\'une nouvelle candidature pour la Chine, ces champs seront automatiquement remplis depuis votre profil. Vous pouvez toujours les modifier dans le formulaire de candidature si nécessaire.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChinaFieldsSection;


import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Flag, Heart, Users } from 'lucide-react';
import userProfileService from '../../services/userProfileService';

const PersonalInfoStep = ({ data, onSave, language }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    gender: '',
    maritalStatus: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
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
      const profileData = await userProfileService.getPersonalInfo();
      setFormData(prev => ({
        ...prev,
        ...profileData,
        ...data // Override with any existing application data
      }));
    } catch (error) {
      console.error('Failed to load profile data:', error);
      setFormData(prev => ({ ...prev, ...data }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save personal info:', error);
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'nationality', 'address', 'city', 'country'];
    return required.every(field => formData[field] && formData[field].trim() !== '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">
          {language === 'fr' ? 'Chargement des données...' : 'Loading data...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {language === 'fr' ? 'Informations Personnelles' : 'Personal Information'}
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'fr' 
            ? 'Vos informations personnelles ont été préremplies depuis votre profil. Vérifiez et complétez les champs manquants.' 
            : 'Your personal information has been pre-filled from your profile. Please review and complete any missing fields.'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            {language === 'fr' ? 'Informations de Base' : 'Basic Information'}
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Prénom' : 'First Name'} *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? 'Votre prénom' : 'Your first name'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Nom de Famille' : 'Last Name'} *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? 'Votre nom de famille' : 'Your last name'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Email' : 'Email'} *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'fr' ? 'votre@email.com' : 'your@email.com'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Téléphone' : 'Phone'} *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'fr' ? '+33 1 23 45 67 89' : '+1 234 567 8900'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Date de Naissance' : 'Date of Birth'} *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            {language === 'fr' ? 'Adresse' : 'Address'}
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Nationalité' : 'Nationality'} *
            </label>
            <div className="relative">
              <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'fr' ? 'Française' : 'French'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Adresse' : 'Address'} *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? '123 Rue de la Paix' : '123 Peace Street'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'fr' ? 'Ville' : 'City'} *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'fr' ? 'Paris' : 'Paris'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'fr' ? 'Code Postal' : 'Postal Code'}
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="75001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Pays' : 'Country'} *
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? 'France' : 'France'}
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          {language === 'fr' ? 'Contact d\'Urgence' : 'Emergency Contact'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Nom' : 'Name'}
            </label>
            <input
              type="text"
              value={formData.emergencyContact.name}
              onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? 'Nom du contact' : 'Contact name'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Relation' : 'Relationship'}
            </label>
            <input
              type="text"
              value={formData.emergencyContact.relationship}
              onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? 'Parent, Conjoint...' : 'Parent, Spouse...'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Téléphone' : 'Phone'}
            </label>
            <input
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+33 1 23 45 67 89"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Email' : 'Email'}
            </label>
            <input
              type="email"
              value={formData.emergencyContact.email}
              onChange={(e) => handleInputChange('emergencyContact.email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="contact@email.com"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-8">
        <button
          onClick={handleSave}
          disabled={!isFormValid() || saving}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {language === 'fr' ? 'Sauvegarde...' : 'Saving...'}
            </>
          ) : (
            <>
              <User className="w-5 h-5" />
              {language === 'fr' ? 'Sauvegarder les Informations' : 'Save Information'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;

import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Mail, Phone, Building, GraduationCap } from 'lucide-react';
import userProfileService from '../../services/userProfileService';

const ReferencesStep = ({ data, onSave, language }) => {
  const [references, setReferences] = useState({
    academicReferences: [],
    professionalReferences: [],
    personalReferences: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrefilledData();
  }, []);

  const loadPrefilledData = async () => {
    try {
      setLoading(true);
      const profileData = await userProfileService.getReferences();
      setReferences(prev => ({
        ...prev,
        ...profileData,
        ...data // Override with any existing application data
      }));
    } catch (error) {
      console.error('Failed to load references data:', error);
      setReferences(prev => ({ ...prev, ...data }));
    } finally {
      setLoading(false);
    }
  };

  const addReference = (type) => {
    const newReference = {
      id: Date.now(),
      name: '',
      title: '',
      institution: '',
      email: '',
      phone: '',
      relationship: '',
      yearsKnown: '',
      canContact: true
    };

    setReferences(prev => ({
      ...prev,
      [type]: [...prev[type], newReference]
    }));
  };

  const removeReference = (type, index) => {
    setReferences(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateReference = (type, index, field, value) => {
    setReferences(prev => ({
      ...prev,
      [type]: prev[type].map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(references);
    } catch (error) {
      console.error('Failed to save references:', error);
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = () => {
    const totalReferences = references.academicReferences.length + 
                          references.professionalReferences.length + 
                          references.personalReferences.length;
    return totalReferences >= 2;
  };

  const renderReferenceForm = (type, reference, index) => {
    const typeLabels = {
      academicReferences: {
        title: language === 'fr' ? 'Référence Académique' : 'Academic Reference',
        icon: GraduationCap,
        color: 'blue'
      },
      professionalReferences: {
        title: language === 'fr' ? 'Référence Professionnelle' : 'Professional Reference',
        icon: Building,
        color: 'green'
      },
      personalReferences: {
        title: language === 'fr' ? 'Référence Personnelle' : 'Personal Reference',
        icon: Users,
        color: 'purple'
      }
    };

    const config = typeLabels[type];
    const Icon = config.icon;

    return (
      <div key={reference.id || index} className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 text-${config.color}-600`} />
            <h4 className="font-medium text-gray-900">{config.title}</h4>
          </div>
          <button
            onClick={() => removeReference(type, index)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Nom Complet' : 'Full Name'} *
            </label>
            <input
              type="text"
              value={reference.name}
              onChange={(e) => updateReference(type, index, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? 'Dr. Jean Dupont' : 'Dr. John Smith'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Titre/Poste' : 'Title/Position'} *
            </label>
            <input
              type="text"
              value={reference.title}
              onChange={(e) => updateReference(type, index, 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? 'Professeur de Mathématiques' : 'Mathematics Professor'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Institution/Entreprise' : 'Institution/Company'} *
            </label>
            <input
              type="text"
              value={reference.institution}
              onChange={(e) => updateReference(type, index, 'institution', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? 'Université de Paris' : 'University of Paris'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Relation' : 'Relationship'} *
            </label>
            <input
              type="text"
              value={reference.relationship}
              onChange={(e) => updateReference(type, index, 'relationship', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? 'Professeur, Superviseur...' : 'Professor, Supervisor...'}
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
                value={reference.email}
                onChange={(e) => updateReference(type, index, 'email', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="reference@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Téléphone' : 'Phone'}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={reference.phone}
                onChange={(e) => updateReference(type, index, 'phone', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'fr' ? 'Années de Connaissance' : 'Years Known'}
            </label>
            <input
              type="text"
              value={reference.yearsKnown}
              onChange={(e) => updateReference(type, index, 'yearsKnown', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'fr' ? '3 ans' : '3 years'}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id={`canContact-${type}-${index}`}
              checked={reference.canContact}
              onChange={(e) => updateReference(type, index, 'canContact', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={`canContact-${type}-${index}`} className="ml-2 block text-sm text-gray-700">
              {language === 'fr' ? 'Peut être contacté' : 'Can be contacted'}
            </label>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">
          {language === 'fr' ? 'Chargement des références...' : 'Loading references...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {language === 'fr' ? 'Références' : 'References'}
        </h3>
        <p className="text-gray-600">
          {language === 'fr' 
            ? 'Vos références ont été préremplies depuis votre profil. Ajoutez au moins 2 références.' 
            : 'Your references have been pre-filled from your profile. Add at least 2 references.'
          }
        </p>
      </div>

      {/* Academic References */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            {language === 'fr' ? 'Références Académiques' : 'Academic References'}
          </h4>
          <button
            onClick={() => addReference('academicReferences')}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            <Plus className="w-4 h-4" />
            {language === 'fr' ? 'Ajouter' : 'Add'}
          </button>
        </div>

        {references.academicReferences.map((reference, index) => 
          renderReferenceForm('academicReferences', reference, index)
        )}
      </div>

      {/* Professional References */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-green-600" />
            {language === 'fr' ? 'Références Professionnelles' : 'Professional References'}
          </h4>
          <button
            onClick={() => addReference('professionalReferences')}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
          >
            <Plus className="w-4 h-4" />
            {language === 'fr' ? 'Ajouter' : 'Add'}
          </button>
        </div>

        {references.professionalReferences.map((reference, index) => 
          renderReferenceForm('professionalReferences', reference, index)
        )}
      </div>

      {/* Personal References */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            {language === 'fr' ? 'Références Personnelles' : 'Personal References'}
          </h4>
          <button
            onClick={() => addReference('personalReferences')}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
          >
            <Plus className="w-4 h-4" />
            {language === 'fr' ? 'Ajouter' : 'Add'}
          </button>
        </div>

        {references.personalReferences.map((reference, index) => 
          renderReferenceForm('personalReferences', reference, index)
        )}
      </div>

      {/* Requirements Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          {language === 'fr' ? 'Exigences' : 'Requirements'}
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• {language === 'fr' ? 'Minimum 2 références requises' : 'Minimum 2 references required'}</li>
          <li>• {language === 'fr' ? 'Au moins une référence académique recommandée' : 'At least one academic reference recommended'}</li>
          <li>• {language === 'fr' ? 'Toutes les références doivent avoir un email valide' : 'All references must have a valid email'}</li>
        </ul>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={!isFormValid() || saving}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {language === 'fr' ? 'Sauvegarde...' : 'Saving...'}
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              {language === 'fr' ? 'Sauvegarder' : 'Save'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReferencesStep;

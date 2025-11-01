import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import profileService from '../../services/profileService';

const SecuritySection = ({ language }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const validatePassword = (password) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!currentPassword) {
      setMessage({
        type: 'error',
        text: language === 'en' ? 'Please enter your current password' : 'Veuillez entrer votre mot de passe actuel'
      });
      return;
    }

    if (!newPassword) {
      setMessage({
        type: 'error',
        text: language === 'en' ? 'Please enter a new password' : 'Veuillez entrer un nouveau mot de passe'
      });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({
        type: 'error',
        text: language === 'en' ? 'Password must be at least 8 characters long' : 'Le mot de passe doit contenir au moins 8 caractères'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: language === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas'
      });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({
        type: 'error',
        text: language === 'en' ? 'New password must be different from current password' : 'Le nouveau mot de passe doit être différent de l\'ancien'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await profileService.changePassword({
        currentPassword,
        newPassword,
        language
      });

      if (response.success) {
        setMessage({
          type: 'success',
          text: language === 'en' ? 'Password changed successfully!' : 'Mot de passe modifié avec succès!'
        });
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordValidation({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false
        });
      } else {
        setMessage({
          type: 'error',
          text: response.message || (language === 'en' ? 'Failed to change password' : 'Échec de la modification du mot de passe')
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      // Use the message from backend (already translated) or fallback
      const errorMessage = error?.response?.data?.message || error?.message;
      setMessage({
        type: 'error',
        text: errorMessage || (language === 'en' ? 'An error occurred while changing password' : 'Une erreur s\'est produite lors de la modification du mot de passe')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 border border-blue-500 rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {language === 'en' ? 'Security' : 'Sécurité'}
            </h2>
            <p className="text-white/90 mt-1">
              {language === 'en' 
                ? 'Change your password to keep your account secure'
                : 'Modifiez votre mot de passe pour garder votre compte sécurisé'}
            </p>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Current Password' : 'Mot de Passe Actuel'} *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                placeholder={language === 'en' ? 'Enter your current password' : 'Entrez votre mot de passe actuel'}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'New Password' : 'Nouveau Mot de Passe'} *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                placeholder={language === 'en' ? 'Enter your new password' : 'Entrez votre nouveau mot de passe'}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Password Requirements */}
            {newPassword && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Password Requirements:' : 'Exigences du mot de passe :'}
                </p>
                <div className="space-y-1">
                  {[
                    { key: 'length', label: language === 'en' ? 'At least 8 characters' : 'Au moins 8 caractères' },
                    { key: 'uppercase', label: language === 'en' ? 'One uppercase letter' : 'Une majuscule' },
                    { key: 'lowercase', label: language === 'en' ? 'One lowercase letter' : 'Une minuscule' },
                    { key: 'number', label: language === 'en' ? 'One number' : 'Un chiffre' },
                    { key: 'special', label: language === 'en' ? 'One special character' : 'Un caractère spécial' }
                  ].map(req => (
                    <div key={req.key} className="flex items-center gap-2">
                      {passwordValidation[req.key] ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordValidation[req.key] ? 'text-emerald-700' : 'text-gray-500'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Confirm New Password' : 'Confirmer le Nouveau Mot de Passe'} *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setMessage({ type: '', text: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 ${
                  confirmPassword && newPassword !== confirmPassword
                    ? 'border-red-300 bg-red-50'
                    : confirmPassword && newPassword === confirmPassword
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-300'
                }`}
                placeholder={language === 'en' ? 'Confirm your new password' : 'Confirmez votre nouveau mot de passe'}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {language === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas'}
              </p>
            )}
            {confirmPassword && newPassword === confirmPassword && newPassword && (
              <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {language === 'en' ? 'Passwords match' : 'Les mots de passe correspondent'}
              </p>
            )}
          </div>

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg border flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || !passwordValidation.length}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {language === 'en' ? 'Changing Password...' : 'Modification en cours...'}
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  {language === 'en' ? 'Change Password' : 'Modifier le Mot de Passe'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {language === 'en' ? 'Security Tips' : 'Conseils de Sécurité'}
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>{language === 'en' ? 'Use a unique password that you don\'t use elsewhere' : 'Utilisez un mot de passe unique que vous n\'utilisez pas ailleurs'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>{language === 'en' ? 'Change your password regularly' : 'Changez votre mot de passe régulièrement'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>{language === 'en' ? 'Never share your password with anyone' : 'Ne partagez jamais votre mot de passe avec personne'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>{language === 'en' ? 'Log out from shared or public computers' : 'Déconnectez-vous des ordinateurs partagés ou publics'}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SecuritySection;


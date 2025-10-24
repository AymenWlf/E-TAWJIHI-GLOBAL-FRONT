import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle,
  Shield,
  Loader2,
  ArrowRight
} from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const { resetPassword, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError(language === 'en' ? 'Invalid or missing reset token' : 'Token de réinitialisation invalide ou manquant');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(language === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError(language === 'en' ? 'Password must be at least 6 characters long' : 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!token) {
      setError(language === 'en' ? 'Invalid reset token' : 'Token de réinitialisation invalide');
      return;
    }

    try {
      await resetPassword(token, formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || (language === 'en' ? 'Error resetting password' : 'Erreur lors de la réinitialisation du mot de passe'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 0, text: language === 'en' ? 'Very Weak' : 'Très faible', color: 'text-red-500' };
    if (password.length < 8) return { strength: 1, text: language === 'en' ? 'Weak' : 'Faible', color: 'text-orange-500' };
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { strength: 3, text: language === 'en' ? 'Strong' : 'Fort', color: 'text-green-500' };
    }
    return { strength: 2, text: language === 'en' ? 'Medium' : 'Moyen', color: 'text-yellow-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const content = {
    en: {
      title: "Reset Password",
      subtitle: "Enter your new password to complete the reset process",
      password: "New Password",
      confirmPassword: "Confirm New Password",
      resetPassword: "Reset Password",
      success: "Password Reset!",
      successMessage: "Your password has been successfully reset. You will be redirected to the login page.",
      passwordMismatch: "Passwords do not match",
      passwordLengthError: "Password must be at least 6 characters long",
      resetError: "Error resetting password",
      backToLogin: "Back to Login"
    },
    fr: {
      title: "Réinitialiser le Mot de Passe",
      subtitle: "Entrez votre nouveau mot de passe pour terminer le processus de réinitialisation",
      password: "Nouveau Mot de Passe",
      confirmPassword: "Confirmer le Nouveau Mot de Passe",
      resetPassword: "Réinitialiser le Mot de Passe",
      success: "Mot de Passe Réinitialisé !",
      successMessage: "Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.",
      passwordMismatch: "Les mots de passe ne correspondent pas",
      passwordLengthError: "Le mot de passe doit contenir au moins 6 caractères",
      resetError: "Erreur lors de la réinitialisation du mot de passe",
      backToLogin: "Retour à la Connexion"
    }
  };

  const t = content[language];

  if (success) {
    return (
      <>
        <Helmet>
          <title>{t.success} - E-TAWJIHI Global</title>
          <meta name="description" content={t.successMessage} />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full mx-4 text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center mb-6"
              >
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.success}</h1>
              <p className="text-gray-600 mb-6">
                {t.successMessage}
              </p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto"
              />
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t.title} - E-TAWJIHI Global</title>
        <meta name="description" content={t.subtitle} />
      </Helmet>
      
      <AuthLayout
        language={language}
        setLanguage={setLanguage}
        title={t.title}
        subtitle={t.subtitle}
        icon={<Shield className="h-8 w-8 text-white" />}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
          >
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nouveau mot de passe */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t.password} *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            
            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength === 1 ? 'bg-red-500 w-1/3' :
                        passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/3' :
                        passwordStrength.strength === 3 ? 'bg-green-500 w-full' : 'w-0'
                      }`}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Confirmation mot de passe */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              {t.confirmPassword} *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder={t.confirmPassword}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            
            {/* Validation de confirmation */}
            {formData.confirmPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2"
              >
                {formData.password === formData.confirmPassword ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {language === 'en' ? 'Passwords match' : 'Les mots de passe correspondent'}
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {language === 'en' ? 'Passwords don\'t match' : 'Les mots de passe ne correspondent pas'}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Bouton de réinitialisation */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                {t.resetPassword}...
              </div>
            ) : (
              <>
                {t.resetPassword}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Lien vers la connexion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-center"
        >
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {t.backToLogin}
          </Link>
        </motion.div>
      </AuthLayout>
    </>
  );
};

export default ResetPasswordPage;
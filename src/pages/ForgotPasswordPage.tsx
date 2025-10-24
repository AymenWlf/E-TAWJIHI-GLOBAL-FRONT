import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { 
  Mail, 
  ArrowLeft, 
  Send, 
  CheckCircle,
  AlertCircle,
  KeyRound,
  Loader2
} from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, isLoading } = useAuth();
  const [language, setLanguage] = useState('en');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation côté client
    if (!email.includes('@')) {
      setError(language === 'en' ? 'Please enter a valid email address' : 'Veuillez entrer une adresse email valide');
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || (language === 'en' ? 'Error sending recovery email' : 'Erreur lors de l\'envoi de l\'email de récupération'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const content = {
    en: {
      title: "Forgot Password?",
      subtitle: "No problem! Enter your email address and we'll send you a link to reset your password.",
      email: "Email Address",
      sendLink: "Send Reset Link",
      success: "Email Sent!",
      successMessage: "We've sent a recovery link to",
      checkInbox: "Check your inbox and follow the instructions to reset your password.",
      backToLogin: "Back to Login",
      noEmail: "Didn't receive the email? Check your spam folder or",
      tryAgain: "try again",
      tips: "Tips for recovering your account",
      tip1: "Make sure the email address is correct",
      tip2: "Check your spam/junk folder",
      tip3: "The recovery link is valid for 24 hours",
      tip4: "Contact support if you don't receive the email"
    },
    fr: {
      title: "Mot de Passe Oublié ?",
      subtitle: "Pas de problème ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
      email: "Adresse Email",
      sendLink: "Envoyer le Lien",
      success: "Email Envoyé !",
      successMessage: "Nous avons envoyé un lien de récupération à",
      checkInbox: "Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.",
      backToLogin: "Retour à la Connexion",
      noEmail: "Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou",
      tryAgain: "réessayez",
      tips: "Conseils pour récupérer votre compte",
      tip1: "Vérifiez que l'adresse email est correcte",
      tip2: "Consultez votre dossier spam/courrier indésirable",
      tip3: "Le lien de récupération est valide pendant 24 heures",
      tip4: "Contactez le support si vous ne recevez pas l'email"
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
                {t.successMessage} <strong>{email}</strong>. {t.checkInbox}
              </p>
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t.backToLogin}
                </Link>
                <div className="text-sm text-gray-500">
                  {t.noEmail}{' '}
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t.tryAgain}
                  </button>
                </div>
              </div>
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
        icon={<KeyRound className="h-8 w-8 text-white" />}
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
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t.email}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="your@email.com"
              />
            </div>
          </motion.div>

          {/* Bouton d'envoi */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                {t.sendLink}...
              </div>
            ) : (
              <>
                {t.sendLink}
                <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Lien vers la connexion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToLogin}
          </Link>
        </motion.div>

        {/* Conseils */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200"
        >
          <h3 className="text-sm font-semibold text-blue-900 mb-3">{t.tips}</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {t.tip1}</li>
            <li>• {t.tip2}</li>
            <li>• {t.tip3}</li>
            <li>• {t.tip4}</li>
          </ul>
        </motion.div>
      </AuthLayout>
    </>
  );
};

export default ForgotPasswordPage;
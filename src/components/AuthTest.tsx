import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  LogOut, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const AuthTest: React.FC = () => {
  const { 
    currentUser, 
    token, 
    login, 
    register, 
    logout, 
    forgotPassword,
    isLoading 
  } = useAuth();

  const [testMode, setTestMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [formData, setFormData] = useState({
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    confirmPassword: 'password123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleLogin = async () => {
    try {
      await login(formData.email, formData.password);
      showMessage('Login successful!', 'success');
    } catch (error: any) {
      showMessage(`Login failed: ${error.message}`, 'error');
    }
  };

  const handleRegister = async () => {
    try {
      await register(formData.email, formData.password, formData.firstName, formData.lastName);
      showMessage('Registration successful!', 'success');
    } catch (error: any) {
      showMessage(`Registration failed: ${error.message}`, 'error');
    }
  };

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(formData.email);
      showMessage('Password reset email sent!', 'success');
    } catch (error: any) {
      showMessage(`Forgot password failed: ${error.message}`, 'error');
    }
  };

  const handleLogout = () => {
    logout();
    showMessage('Logged out successfully!', 'success');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔐 Authentication System Test</h1>
        <p className="text-gray-600">Test the complete authentication system</p>
      </div>

      {/* Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center mb-2">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-900">User Status</h3>
          </div>
          <p className="text-blue-800">
            {currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in'}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-900">Token Status</h3>
          </div>
          <p className="text-green-800">
            {token ? 'Token present' : 'No token'}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-purple-900">Loading Status</h3>
          </div>
          <p className="text-purple-800">
            {isLoading ? 'Loading...' : 'Ready'}
          </p>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl border ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center">
            {messageType === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message}
          </div>
        </motion.div>
      )}

      {/* Test Mode Selector */}
      <div className="mb-6">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
          {(['login', 'register', 'forgot'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTestMode(mode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                testMode === mode
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Test Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {testMode.charAt(0).toUpperCase() + testMode.slice(1)} Test
          </h2>

          <div className="space-y-4">
            {testMode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {testMode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {testMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <button
              onClick={
                testMode === 'login' ? handleLogin :
                testMode === 'register' ? handleRegister :
                handleForgotPassword
              }
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : `Test ${testMode.charAt(0).toUpperCase() + testMode.slice(1)}`}
            </button>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
          
          {currentUser ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">Current User</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>ID:</strong> {currentUser.id}</p>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}</p>
                  <p><strong>Roles:</strong> {currentUser.roles.join(', ')}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">Token Info</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No user logged in</p>
            </div>
          )}
        </div>
      </div>

      {/* API Endpoints Info */}
      <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">API Endpoints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Authentication</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• POST /api/auth/login</li>
              <li>• POST /api/auth/register</li>
              <li>• POST /api/auth/forgot-password</li>
              <li>• POST /api/auth/reset-password</li>
              <li>• GET /api/auth/me</li>
              <li>• POST /api/auth/refresh</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Features</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• JWT Token Management</li>
              <li>• Auto Token Refresh</li>
              <li>• Password Reset Flow</li>
              <li>• Email Verification</li>
              <li>• Role-based Access</li>
              <li>• Secure Storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;

import React from 'react';
import { Helmet } from 'react-helmet-async';
import AuthTest from '../components/AuthTest';

const AuthTestPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Authentication Test - E-TAWJIHI Global</title>
        <meta name="description" content="Test the complete authentication system" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <AuthTest />
        </div>
      </div>
    </>
  );
};

export default AuthTestPage;

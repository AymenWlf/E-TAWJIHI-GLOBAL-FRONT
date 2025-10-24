import React, { useState } from 'react';
import SEO from '../components/SEO';
import HeaderAuth from '../components/HeaderAuth';
import ProfileNavigation from '../components/profile/ProfileNavigation';

const ProfileNavigationPage = () => {
  const [language, setLanguage] = useState('en');

  return (
    <>
      <SEO
        title="Profile Navigation - Direct Links | E-TAWJIHI"
        description="Direct navigation links to all profile sections and subsections"
        keywords="profile navigation, direct links, profile sections, qualifications"
      />

      <HeaderAuth language={language} setLanguage={setLanguage} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Profile Navigation' : 'Navigation du Profil'}
            </h1>
            <p className="text-lg text-gray-600">
              {language === 'en' 
                ? 'Access any section of your profile directly with these bookmarkable URLs' 
                : 'Accédez directement à n\'importe quelle section de votre profil avec ces URLs sauvegardables'}
            </p>
          </div>

          <ProfileNavigation language={language} />
        </div>
      </div>
    </>
  );
};

export default ProfileNavigationPage;

import React, { useState, useEffect } from 'react';
import HeaderGlobal from '../components/landing/HeaderGlobal';
import HeroGlobal from '../components/landing/HeroGlobal';
import AIDVISORGlobal from '../components/landing/AIDVISORGlobal';
import HowItWorks from '../components/landing/HowItWorks';
import SearchEngine from '../components/landing/SearchEngine';
import ServicesGlobal from '../components/landing/ServicesGlobal';
import PartnersAmbassadors from '../components/landing/PartnersAmbassadors';
import TestimonialsGlobal from '../components/landing/TestimonialsGlobal';
import AboutMission from '../components/landing/AboutMission';
import CallToActionFinal from '../components/landing/CallToActionFinal';
import FooterGlobal from '../components/landing/FooterGlobal';

const LandingPageSimple = () => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">E-TAWJIHI Global</h2>
          <p className="text-gray-600 text-lg">Your Global Education Gateway</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HeaderGlobal language={language} setLanguage={setLanguage} />
      
      {/* Main Content */}
      <div className="animate-fade-in">
        <HeroGlobal language={language} />
        <AIDVISORGlobal language={language} />
        <HowItWorks language={language} />
        <SearchEngine language={language} />
        <ServicesGlobal language={language} />
        <PartnersAmbassadors language={language} />
        <TestimonialsGlobal language={language} />
        <AboutMission language={language} />
        <CallToActionFinal language={language} />
        <FooterGlobal language={language} />
      </div>
    </div>
  );
};

export default LandingPageSimple;

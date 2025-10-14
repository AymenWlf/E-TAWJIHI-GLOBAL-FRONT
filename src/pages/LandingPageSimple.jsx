import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import HeaderGlobal from '../components/landing/HeaderGlobal';
import HeroGlobal from '../components/landing/HeroGlobal';
import EDVISORGlobal from '../components/landing/AIDVISORGlobal';
import ESTUDYGlobal from '../components/landing/ESTUDYGlobal';
import EducationToolsGlobal from '../components/landing/EducationToolsGlobal';
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

  const seoData = {
    title: language === 'en' 
      ? 'E-TAWJIHI Global - International Education Platform' 
      : 'E-TAWJIHI Global - Plateforme d\'Éducation Internationale',
    description: language === 'en'
      ? 'Discover universities and programs worldwide with E-TAWJIHI Global. Get expert guidance for international education, visa assistance, and student services.'
      : 'Découvrez les universités et programmes du monde entier avec E-TAWJIHI Global. Obtenez des conseils d\'experts pour l\'éducation internationale, l\'assistance visa et les services étudiants.',
    keywords: language === 'en'
      ? 'international education, universities, study abroad, visa assistance, student services, E-TAWJIHI Global, education platform, study programs'
      : 'éducation internationale, universités, études à l\'étranger, assistance visa, services étudiants, E-TAWJIHI Global, plateforme éducation, programmes d\'études',
    canonical: 'https://e-tawjihi-global.com',
    ogType: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "E-TAWJIHI Global",
      "description": language === 'en' 
        ? "International education platform connecting students with universities worldwide"
        : "Plateforme d'éducation internationale connectant les étudiants avec les universités du monde entier",
      "url": "https://e-tawjihi-global.com",
      "logo": "https://e-tawjihi-global.com/images/logo.png",
      "sameAs": [
        "https://www.facebook.com/ETawjihiGlobal",
        "https://www.instagram.com/etawjihi_global",
        "https://www.linkedin.com/company/e-tawjihi-global",
        "https://twitter.com/ETawjihiGlobal"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+212-XXX-XXXXXX",
        "contactType": "customer service",
        "availableLanguage": ["English", "French", "Arabic"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "MA",
        "addressLocality": "Casablanca",
        "addressRegion": "Casablanca-Settat"
      },
      "offers": {
        "@type": "Offer",
        "description": language === 'en' 
          ? "International education services and university guidance"
          : "Services d'éducation internationale et orientation universitaire",
        "category": "Education Services"
      }
    },
    alternateLanguages: [
      { code: 'en', url: 'https://e-tawjihi-global.com' },
      { code: 'fr', url: 'https://e-tawjihi-global.com/fr' }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO {...seoData} language={language} />
      {/* Header */}
      <HeaderGlobal language={language} setLanguage={setLanguage} />
      
      {/* Main Content */}
      <div className="animate-fade-in">
        <HeroGlobal language={language} />
        <EDVISORGlobal language={language} />
        <HowItWorks language={language} />
        <SearchEngine language={language} />
        <ServicesGlobal language={language} />
        <ESTUDYGlobal language={language} />
        <EducationToolsGlobal language={language} />

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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import AIDVISOR from '../components/landing/AIDVISOR';
import Search from '../components/landing/Search';
import Services from '../components/landing/Services';
import Agents from '../components/landing/Agents';
import Institutions from '../components/landing/Institutions';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';
import LanguageToggle from '../components/landing/LanguageToggle';

const LandingPage = () => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for animations
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">E-TAWJIHI Global</h2>
          <p className="text-gray-600">Your Global Education Gateway</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Language Toggle */}
      <LanguageToggle language={language} setLanguage={setLanguage} />
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero language={language} />
        <About language={language} />
        <AIDVISOR language={language} />
        <Search language={language} />
        <Services language={language} />
        <Agents language={language} />
        <Institutions language={language} />
        <Testimonials language={language} />
        <Footer language={language} />
      </motion.div>
    </div>
  );
};

export default LandingPage;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import HeaderGlobal from '../components/landing/HeaderGlobal';
import { Brain, FileText, Calculator, CheckCircle, Lightbulb, TrendingUp, Shield, Globe, DollarSign, Clock, User, BookOpen, MessageSquare, GraduationCap, FileCheck, Sparkles, ArrowRight, Star, Zap } from 'lucide-react';

const EducationTools = () => {
  const [language, setLanguage] = useState('en');
  const [activeTool, setActiveTool] = useState('diagnostic');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toolsData = {
    en: {
      hero: {
        title: "AI-Powered Education Tools",
        subtitle: "Revolutionary Tools for Your Academic Journey",
        description: "Leverage cutting-edge AI to optimize your study abroad process, from self-discovery to visa application."
      },
      tools: {
        items: [
          {
            id: 'diagnostic',
            title: 'Diagnostic System',
            description: 'Complete personality & skills assessment',
            icon: <Brain className="w-8 h-8" />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
          },
          {
            id: 'sop-generator',
            title: 'SOP Letter Generator',
            description: 'AI-powered Statement of Purpose creator',
            icon: <FileText className="w-8 h-8" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
          },
          {
            id: 'visa-calculator',
            title: 'Visa Calculator',
            description: 'Calculate visa requirements and costs',
            icon: <Calculator className="w-8 h-8" />,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200'
          }
        ]
      },
      diagnostic: {
        title: 'Diagnostic System',
        subtitle: 'Complete Personality & Skills Assessment',
        description: 'Discover your true potential with our comprehensive AI-powered diagnostic system. Get detailed insights into your personality, soft skills, and career aptitudes with a certified E-TAWJIHI report.',
        features: [
          {
            title: 'Personality Analysis',
            description: 'Deep dive into your personality traits, strengths, and areas for development.',
            icon: <User className="w-6 h-6" />,
            features: [
              'Big Five Personality Assessment',
              'Emotional Intelligence Evaluation',
              'Leadership Style Analysis',
              'Communication Preferences'
            ]
          },
          {
            title: 'Skills Assessment',
            description: 'Comprehensive evaluation of your technical and soft skills.',
            icon: <GraduationCap className="w-6 h-6" />,
            features: [
              'Technical Skills Inventory',
              'Soft Skills Evaluation',
              'Learning Style Assessment',
              'Career Aptitude Testing'
            ]
          },
          {
            title: 'Career Guidance',
            description: 'Personalized recommendations for your academic and career path.',
            icon: <TrendingUp className="w-6 h-6" />,
            features: [
              'Career Path Recommendations',
              'University Program Matching',
              'Skill Development Plan',
              'Industry Insights'
            ]
          }
        ]
      },
      sop: {
        title: 'SOP Letter Generator',
        subtitle: 'AI-Powered Statement of Purpose Creator',
        description: 'Create compelling and personalized Statement of Purpose letters with our advanced AI technology. Get professional-quality SOPs tailored to your target universities and programs.',
        features: [
          {
            title: 'AI Writing Assistant',
            description: 'Advanced AI technology that understands university requirements.',
            icon: <FileText className="w-6 h-6" />,
            features: [
              'University-Specific Templates',
              'Academic Writing Style',
              'Personal Story Integration',
              'Grammar & Style Check'
            ]
          },
          {
            title: 'Personalization Engine',
            description: 'Tailored content based on your background and goals.',
            icon: <User className="w-6 h-6" />,
            features: [
              'Background Analysis',
              'Goal Alignment',
              'Experience Highlighting',
              'Cultural Adaptation'
            ]
          },
          {
            title: 'Quality Assurance',
            description: 'Professional review and optimization for maximum impact.',
            icon: <CheckCircle className="w-6 h-6" />,
            features: [
              'Content Optimization',
              'Structure Analysis',
              'Impact Assessment',
              'Final Review'
            ]
          }
        ]
      },
      visa: {
        title: 'Visa Calculator',
        subtitle: 'Calculate Visa Requirements and Costs',
        description: 'Get accurate visa requirements, processing times, and cost estimates for your study destination. Our smart calculator provides real-time data and personalized recommendations.',
        features: [
          {
            title: 'Requirements Analysis',
            description: 'Comprehensive visa requirements for your destination.',
            icon: <FileCheck className="w-6 h-6" />,
            features: [
              'Document Checklist',
              'Financial Requirements',
              'Health Insurance Needs',
              'Language Requirements'
            ]
          },
          {
            title: 'Cost Calculator',
            description: 'Accurate cost estimates for your visa application.',
            icon: <DollarSign className="w-6 h-6" />,
            features: [
              'Application Fees',
              'Processing Costs',
              'Additional Expenses',
              'Timeline Estimates'
            ]
          },
          {
            title: 'Timeline Planning',
            description: 'Strategic planning for your visa application process.',
            icon: <Clock className="w-6 h-6" />,
            features: [
              'Processing Times',
              'Deadline Tracking',
              'Document Preparation',
              'Application Strategy'
            ]
          }
        ]
      }
    },
    fr: {
      hero: {
        title: "Outils Éducatifs Alimentés par IA",
        subtitle: "Outils Révolutionnaires pour Votre Parcours Académique",
        description: "Exploitez l'IA de pointe pour optimiser votre processus d'études à l'étranger, de la découverte de soi à la demande de visa."
      },
      tools: {
        items: [
          {
            id: 'diagnostic',
            title: 'Système de Diagnostic',
            description: 'Évaluation complète de personnalité et compétences',
            icon: <Brain className="w-8 h-8" />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
          },
          {
            id: 'sop-generator',
            title: 'Générateur de Lettre SOP',
            description: 'Créateur de lettre de motivation alimenté par IA',
            icon: <FileText className="w-8 h-8" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
          },
          {
            id: 'visa-calculator',
            title: 'Calculateur de Visa',
            description: 'Calculez les exigences et coûts de visa',
            icon: <Calculator className="w-8 h-8" />,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200'
          }
        ]
      },
      diagnostic: {
        title: 'Système de Diagnostic',
        subtitle: 'Évaluation Complète de Personnalité et Compétences',
        description: 'Découvrez votre vrai potentiel avec notre système de diagnostic complet alimenté par IA. Obtenez des insights détaillés sur votre personnalité, compétences douces et aptitudes de carrière avec un rapport certifié E-TAWJIHI.',
        features: [
          {
            title: 'Analyse de Personnalité',
            description: 'Plongée profonde dans vos traits de personnalité, forces et domaines de développement.',
            icon: <User className="w-6 h-6" />,
            features: [
              'Évaluation Big Five',
              'Évaluation Intelligence Émotionnelle',
              'Analyse Style de Leadership',
              'Préférences de Communication'
            ]
          },
          {
            title: 'Évaluation des Compétences',
            description: 'Évaluation complète de vos compétences techniques et douces.',
            icon: <GraduationCap className="w-6 h-6" />,
            features: [
              'Inventaire Compétences Techniques',
              'Évaluation Compétences Douces',
              'Évaluation Style d\'Apprentissage',
              'Test d\'Aptitude Carrière'
            ]
          },
          {
            title: 'Orientation Carrière',
            description: 'Recommandations personnalisées pour votre parcours académique et professionnel.',
            icon: <TrendingUp className="w-6 h-6" />,
            features: [
              'Recommandations Parcours Carrière',
              'Correspondance Programmes Universitaires',
              'Plan Développement Compétences',
              'Insights Industrie'
            ]
          }
        ]
      },
      sop: {
        title: 'Générateur de Lettre SOP',
        subtitle: 'Créateur de Lettre de Motivation Alimenté par IA',
        description: 'Créez des lettres de motivation convaincantes et personnalisées avec notre technologie IA avancée. Obtenez des SOP de qualité professionnelle adaptés à vos universités et programmes cibles.',
        features: [
          {
            title: 'Assistant d\'Écriture IA',
            description: 'Technologie IA avancée qui comprend les exigences universitaires.',
            icon: <FileText className="w-6 h-6" />,
            features: [
              'Modèles Spécifiques Université',
              'Style Écriture Académique',
              'Intégration Histoire Personnelle',
              'Vérification Grammaire & Style'
            ]
          },
          {
            title: 'Moteur de Personnalisation',
            description: 'Contenu adapté basé sur votre parcours et objectifs.',
            icon: <User className="w-6 h-6" />,
            features: [
              'Analyse de Parcours',
              'Alignement Objectifs',
              'Mise en Valeur Expérience',
              'Adaptation Culturelle'
            ]
          },
          {
            title: 'Assurance Qualité',
            description: 'Révision professionnelle et optimisation pour un impact maximum.',
            icon: <CheckCircle className="w-6 h-6" />,
            features: [
              'Optimisation Contenu',
              'Analyse Structure',
              'Évaluation Impact',
              'Révision Finale'
            ]
          }
        ]
      },
      visa: {
        title: 'Calculateur de Visa',
        subtitle: 'Calculez les Exigences et Coûts de Visa',
        description: 'Obtenez des exigences de visa précises, des délais de traitement et des estimations de coûts pour votre destination d\'études. Notre calculateur intelligent fournit des données en temps réel et des recommandations personnalisées.',
        features: [
          {
            title: 'Analyse des Exigences',
            description: 'Exigences de visa complètes pour votre destination.',
            icon: <FileCheck className="w-6 h-6" />,
            features: [
              'Liste de Vérification Documents',
              'Exigences Financières',
              'Besoins Assurance Santé',
              'Exigences Linguistiques'
            ]
          },
          {
            title: 'Calculateur de Coûts',
            description: 'Estimations de coûts précises pour votre demande de visa.',
            icon: <DollarSign className="w-6 h-6" />,
            features: [
              'Frais de Demande',
              'Coûts de Traitement',
              'Dépenses Supplémentaires',
              'Estimations Délais'
            ]
          },
          {
            title: 'Planification Délais',
            description: 'Planification stratégique pour votre processus de demande de visa.',
            icon: <Clock className="w-6 h-6" />,
            features: [
              'Délais de Traitement',
              'Suivi Échéances',
              'Préparation Documents',
              'Stratégie Demande'
            ]
          }
        ]
      }
    }
  };

  const t = toolsData[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEO
        title={language === 'en' ? 'AI Education Tools - Diagnostic, SOP Generator & Visa Calculator | E-TAWJIHI Global' : 'Outils Éducatifs IA - Diagnostic, Générateur SOP & Calculateur Visa | E-TAWJIHI Global'}
        description={language === 'en' ? 'Revolutionary AI-powered education tools: personality diagnostic system, SOP letter generator, and visa calculator. Enhance your academic journey with cutting-edge technology.' : 'Outils éducatifs révolutionnaires alimentés par IA : système de diagnostic de personnalité, générateur de lettre SOP et calculateur de visa. Améliorez votre parcours académique avec une technologie de pointe.'}
        keywords={language === 'en' ? 'AI education tools, personality diagnostic, SOP generator, visa calculator, academic assessment, career development, AI technology' : 'outils éducatifs IA, diagnostic personnalité, générateur SOP, calculateur visa, évaluation académique, développement carrière, technologie IA'}
        canonical="https://e-tawjihi-global.com/education-tools"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": language === 'en' ? "AI-Powered Education Tools" : "Outils Éducatifs Alimentés par IA",
          "description": language === 'en' ? "Revolutionary tools for your academic journey, including Diagnostic System, SOP Letter Generator, and Visa Calculator." : "Des outils révolutionnaires pour votre parcours académique, incluant le Système de Diagnostic, le Générateur de Lettre SOP et le Calculateur de Visa.",
          "url": "https://e-tawjihi-global.com/education-tools",
          "mainEntity": t.tools.items.map(tool => ({
            "@type": "SoftwareApplication",
            "name": tool.title,
            "description": tool.description,
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }))
        }}
        alternateLanguages={[
          { code: 'en', url: 'https://e-tawjihi-global.com/education-tools' },
          { code: 'fr', url: 'https://e-tawjihi-global.com/fr/education-tools' }
        ]}
        language={language}
      />
      
      {/* Header */}
      <HeaderGlobal language={language} setLanguage={setLanguage} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/40 to-indigo-100/40"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-8xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {language === 'en' ? 'AI-Powered Technology' : 'Technologie Alimentée par IA'}
            </div>
            <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-2xl text-blue-600 font-semibold mb-6">
              {t.hero.subtitle}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t.hero.description}
            </p>
          </motion.div>

          {/* Quick Access Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {t.tools.items.map((tool, index) => (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(tool.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  activeTool === tool.id 
                    ? 'bg-white border-blue-300 text-gray-900 shadow-lg' 
                    : 'bg-white/80 border-gray-200 text-gray-700 hover:bg-white hover:border-blue-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${tool.bgColor}`}>
                  <div className={tool.color}>
                    {tool.icon}
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-semibold">{tool.title}</div>
                  <div className="text-sm text-gray-500">
                    {tool.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Diagnostic System Section */}
      <section id="diagnostic" className="py-20 px-6 sm:px-8 lg:px-12 bg-white relative">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              {language === 'en' ? 'Advanced AI Assessment' : 'Évaluation IA Avancée'}
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              {t.diagnostic.title}
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-6">
              {t.diagnostic.subtitle}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t.diagnostic.description}
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {t.diagnostic.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <div className="text-purple-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Report Visualization Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 mb-16 border border-purple-100"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'en' ? 'Your Personalized Diagnostic Report' : 'Votre Rapport de Diagnostic Personnalisé'}
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {language === 'en' 
                  ? 'Get a comprehensive, visually appealing report that breaks down your personality, skills, and career recommendations in an easy-to-understand format.'
                  : 'Obtenez un rapport complet et visuellement attrayant qui décompose votre personnalité, compétences et recommandations de carrière dans un format facile à comprendre.'
                }
              </p>
            </div>

            {/* Report Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Report Sections */}
              <div className="space-y-6">
                {/* Personality Analysis Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-purple-200 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {language === 'en' ? 'Personality Analysis' : 'Analyse de Personnalité'}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'en' ? 'Openness' : 'Ouverture'}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-20 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-purple-600">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'en' ? 'Conscientiousness' : 'Conscienciosité'}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-18 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'en' ? 'Extraversion' : 'Extraversion'}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-16 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-emerald-600">65%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Skills Assessment Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {language === 'en' ? 'Skills Assessment' : 'Évaluation des Compétences'}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-lg">92</span>
                      </div>
                      <p className="text-sm text-gray-600">{language === 'en' ? 'Technical Skills' : 'Compétences Techniques'}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-lg">88</span>
                      </div>
                      <p className="text-sm text-gray-600">{language === 'en' ? 'Soft Skills' : 'Compétences Douces'}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Career Recommendations Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {language === 'en' ? 'Career Recommendations' : 'Recommandations de Carrière'}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'Software Engineering' : 'Ingénierie Logicielle'}</span>
                      <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">95%</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'Data Science' : 'Science des Données'}</span>
                      <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">87%</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'Product Management' : 'Gestion de Produit'}</span>
                      <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">82%</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Visual Report Mockup */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{language === 'en' ? 'E-TAWJIHI Diagnostic Report' : 'Rapport de Diagnostic E-TAWJIHI'}</h4>
                      <p className="text-sm text-gray-500">{language === 'en' ? 'Generated on' : 'Généré le'} {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Report Content Mockup */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{language === 'en' ? 'Overall Score' : 'Score Global'}</h5>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">89</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{language === 'en' ? 'Excellent Match' : 'Correspondance Excellente'}</p>
                          <p className="text-xs text-gray-500">{language === 'en' ? 'High potential for success' : 'Potentiel élevé de réussite'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xs text-gray-600">{language === 'en' ? 'Personality' : 'Personnalité'}</p>
                        <p className="text-sm font-semibold text-gray-900">A+</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xs text-gray-600">{language === 'en' ? 'Skills' : 'Compétences'}</p>
                        <p className="text-sm font-semibold text-gray-900">A</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{language === 'en' ? 'Top Recommendation' : 'Recommandation Principale'}</h5>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{language === 'en' ? 'Software Engineering' : 'Ingénierie Logicielle'}</p>
                          <p className="text-sm text-gray-600">{language === 'en' ? '95% compatibility match' : '95% de compatibilité'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2">
                      <FileCheck className="w-4 h-4" />
                      {language === 'en' ? 'Download Full Report' : 'Télécharger le Rapport Complet'}
                    </button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 text-yellow-800" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-3 h-3 text-emerald-800" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-4 text-white">
                {language === 'en' ? 'Ready to Discover Your Potential?' : 'Prêt à Découvrir Votre Potentiel?'}
              </h3>
              <p className="text-lg mb-6 text-white opacity-90">
                {language === 'en' 
                  ? 'Get your personalized diagnostic report and unlock your true potential with our AI-powered assessment system.'
                  : 'Obtenez votre rapport de diagnostic personnalisé et débloquez votre vrai potentiel avec notre système d\'évaluation alimenté par IA.'
                }
              </p>
              <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors shadow-lg hover:shadow-xl border border-white/30">
                {language === 'en' ? 'Start Assessment' : 'Commencer l\'Évaluation'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOP Letter Generator Section */}
      <section id="sop-generator" className="py-20 px-6 sm:px-8 lg:px-12 bg-gray-50 relative">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              {language === 'en' ? 'AI Writing Assistant' : 'Assistant d\'Écriture IA'}
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              {t.sop.title}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-6">
              {t.sop.subtitle}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t.sop.description}
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {t.sop.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* SOP Generation Process Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 mb-16 border border-blue-100"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'en' ? 'AI-Powered SOP Generation Process' : 'Processus de Génération SOP Alimenté par IA'}
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {language === 'en' 
                  ? 'Watch how our advanced AI transforms your information into a compelling, personalized Statement of Purpose that stands out to admissions committees.'
                  : 'Découvrez comment notre IA avancée transforme vos informations en une lettre de motivation convaincante et personnalisée qui se démarque auprès des comités d\'admission.'
                }
              </p>
            </div>

            {/* Process Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Process Steps */}
              <div className="space-y-6">
                {/* Step 1: Input Collection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {language === 'en' ? 'Input Collection' : 'Collecte des Informations'}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{language === 'en' ? 'Personal Background' : 'Parcours Personnel'}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{language === 'en' ? 'Academic History' : 'Historique Académique'}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{language === 'en' ? 'Career Goals' : 'Objectifs de Carrière'}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2: AI Analysis */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {language === 'en' ? 'AI Analysis & Processing' : 'Analyse et Traitement IA'}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'en' ? 'Content Analysis' : 'Analyse du Contenu'}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-16 h-2 bg-indigo-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-indigo-600">80%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'en' ? 'Structure Planning' : 'Planification Structure'}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-18 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">90%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'en' ? 'Language Optimization' : 'Optimisation Langage'}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-20 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-emerald-600">95%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Step 3: Generation */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {language === 'en' ? 'SOP Generation' : 'Génération SOP'}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-600">{language === 'en' ? 'Draft Creation' : 'Création Brouillon'}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-600">{language === 'en' ? 'Quality Review' : 'Révision Qualité'}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - SOP Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{language === 'en' ? 'Generated SOP Preview' : 'Aperçu SOP Généré'}</h4>
                      <p className="text-sm text-gray-500">{language === 'en' ? 'AI-Generated Statement of Purpose' : 'Lettre de Motivation Générée par IA'}</p>
                    </div>
                  </div>

                  {/* SOP Content Preview */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{language === 'en' ? 'Opening Statement' : 'Déclaration d\'Ouverture'}</h5>
                      <p className="text-sm text-gray-600 italic">
                        "{language === 'en' 
                          ? 'My passion for software engineering stems from my desire to solve complex problems and create innovative solutions that impact millions of users worldwide.'
                          : 'Ma passion pour l\'ingénierie logicielle découle de mon désir de résoudre des problèmes complexes et de créer des solutions innovantes qui impactent des millions d\'utilisateurs dans le monde.'
                        }"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'Academic Background' : 'Parcours Académique'}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {language === 'en' 
                            ? 'Highlighted relevant coursework, projects, and academic achievements'
                            : 'Mise en valeur des cours pertinents, projets et réalisations académiques'
                          }
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'Professional Experience' : 'Expérience Professionnelle'}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {language === 'en' 
                            ? 'Connected work experience to program goals and career aspirations'
                            : 'Connexion de l\'expérience professionnelle aux objectifs du programme et aspirations de carrière'
                          }
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'Future Goals' : 'Objectifs Futurs'}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {language === 'en' 
                            ? 'Articulated clear career vision and how the program fits'
                            : 'Articulation d\'une vision de carrière claire et de l\'adéquation du programme'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{language === 'en' ? 'Quality Score' : 'Score de Qualité'}</h5>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">A+</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{language === 'en' ? 'Excellent Quality' : 'Qualité Excellente'}</p>
                          <p className="text-xs text-gray-500">{language === 'en' ? 'Ready for submission' : 'Prêt pour soumission'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2">
                      <FileCheck className="w-4 h-4" />
                      {language === 'en' ? 'Download SOP' : 'Télécharger SOP'}
                    </button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 text-yellow-800" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-3 h-3 text-blue-800" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-4 text-white">
                {language === 'en' ? 'Create Your Perfect SOP' : 'Créez Votre SOP Parfait'}
              </h3>
              <p className="text-lg mb-6 text-white opacity-90">
                {language === 'en' 
                  ? 'Let our AI help you craft a compelling Statement of Purpose that stands out to admissions committees.'
                  : 'Laissez notre IA vous aider à rédiger une lettre de motivation convaincante qui se démarque auprès des comités d\'admission.'
                }
              </p>
              <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors shadow-lg hover:shadow-xl border border-white/30">
                {language === 'en' ? 'Generate SOP' : 'Générer SOP'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visa Calculator Section */}
      <section id="visa-calculator" className="py-20 px-6 sm:px-8 lg:px-12 bg-white relative">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              {language === 'en' ? 'Smart Calculator' : 'Calculateur Intelligent'}
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              {t.visa.title}
            </h2>
            <p className="text-xl text-emerald-600 font-semibold mb-6">
              {t.visa.subtitle}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t.visa.description}
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {t.visa.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <div className="text-emerald-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Visa Calculator Process Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 mb-16 border border-emerald-100"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'en' ? 'Smart Visa Calculator Process' : 'Processus du Calculateur de Visa Intelligent'}
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {language === 'en' 
                  ? 'Experience how our intelligent calculator analyzes your profile and provides accurate visa requirements, costs, and timeline estimates for your study destination.'
                  : 'Découvrez comment notre calculateur intelligent analyse votre profil et fournit des exigences de visa précises, des coûts et des estimations de délais pour votre destination d\'études.'
                }
              </p>
            </div>

            {/* Calculator Process */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Calculator Steps */}
              <div className="space-y-6">
                {/* Step 1: Profile Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {language === 'en' ? 'Profile Input' : 'Saisie du Profil'}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700">{language === 'en' ? 'Destination Country' : 'Pays de Destination'}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700">{language === 'en' ? 'Visa Type' : 'Type de Visa'}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700">{language === 'en' ? 'Personal Details' : 'Détails Personnels'}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2: Analysis */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 border border-green-200 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {language === 'en' ? 'Smart Analysis' : 'Analyse Intelligente'}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'en' ? 'Requirements Check' : 'Vérification Exigences'}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-18 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">90%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'en' ? 'Cost Calculation' : 'Calcul des Coûts'}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-20 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-emerald-600">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'en' ? 'Timeline Estimation' : 'Estimation Délais'}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">85%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Step 3: Results */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {language === 'en' ? 'Results & Recommendations' : 'Résultats et Recommandations'}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-600">{language === 'en' ? 'Cost Breakdown' : 'Détail des Coûts'}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-600">{language === 'en' ? 'Timeline Plan' : 'Plan Délais'}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Calculator Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{language === 'en' ? 'Visa Calculator Results' : 'Résultats Calculateur Visa'}</h4>
                      <p className="text-sm text-gray-500">{language === 'en' ? 'Student Visa - United States' : 'Visa Étudiant - États-Unis'}</p>
                    </div>
                  </div>

                  {/* Results Content */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{language === 'en' ? 'Total Estimated Cost' : 'Coût Total Estimé'}</h5>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">$</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">$1,850</p>
                          <p className="text-sm text-gray-600">{language === 'en' ? 'Including all fees' : 'Incluant tous les frais'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'Application Fee' : 'Frais de Demande'}</span>
                        </div>
                        <p className="text-sm text-gray-600">$185 - {language === 'en' ? 'Non-refundable' : 'Non remboursable'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'SEVIS Fee' : 'Frais SEVIS'}</span>
                        </div>
                        <p className="text-sm text-gray-600">$350 - {language === 'en' ? 'Student tracking system' : 'Système de suivi étudiant'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'Processing Time' : 'Délai de Traitement'}</span>
                        </div>
                        <p className="text-sm text-gray-600">3-5 {language === 'en' ? 'weeks' : 'semaines'} - {language === 'en' ? 'Standard processing' : 'Traitement standard'}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{language === 'en' ? 'Required Documents' : 'Documents Requis'}</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{language === 'en' ? 'Valid Passport' : 'Passeport Valide'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{language === 'en' ? 'I-20 Form' : 'Formulaire I-20'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{language === 'en' ? 'Financial Proof' : 'Preuve Financière'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                    <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2">
                      <FileCheck className="w-4 h-4" />
                      {language === 'en' ? 'Download Report' : 'Télécharger Rapport'}
                    </button>
                    <button className="w-full bg-white border border-emerald-300 text-emerald-600 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {language === 'en' ? 'Get Expert Help' : 'Obtenir Aide Expert'}
                    </button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 text-yellow-800" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-3 h-3 text-emerald-800" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-3xl p-8 mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'Try Our Smart Calculator' : 'Essayez Notre Calculateur Intelligent'}
            </h3>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'en' ? 'Destination Country' : 'Pays de Destination'}
                  </label>
                  <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option value="">{language === 'en' ? 'Select Country' : 'Sélectionner le Pays'}</option>
                    <option value="usa">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="canada">Canada</option>
                    <option value="australia">Australia</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'en' ? 'Visa Type' : 'Type de Visa'}
                  </label>
                  <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option value="">{language === 'en' ? 'Select Visa Type' : 'Sélectionner le Type de Visa'}</option>
                    <option value="student">{language === 'en' ? 'Student Visa' : 'Visa Étudiant'}</option>
                    <option value="work">{language === 'en' ? 'Work Visa' : 'Visa de Travail'}</option>
                    <option value="tourist">{language === 'en' ? 'Tourist Visa' : 'Visa Touristique'}</option>
                  </select>
                </div>
              </div>
              <div className="text-center">
                <button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  {language === 'en' ? 'Calculate Visa Requirements' : 'Calculer les Exigences de Visa'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-4 text-white">
                {language === 'en' ? 'Plan Your Visa Journey' : 'Planifiez Votre Parcours Visa'}
              </h3>
              <p className="text-lg mb-6 text-white opacity-90">
                {language === 'en' 
                  ? 'Get personalized visa guidance and make your study abroad dreams a reality with our comprehensive calculator.'
                  : 'Obtenez des conseils personnalisés pour votre visa et réalisez vos rêves d\'études à l\'étranger avec notre calculateur complet.'
                }
              </p>
              <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors shadow-lg hover:shadow-xl border border-white/30">
                {language === 'en' ? 'Calculate Now' : 'Calculer Maintenant'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
              {language === 'en' ? 'Ready to Transform Your Education Journey?' : 'Prêt à Transformer Votre Parcours Éducatif?'}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Experience the future of education with our AI-powered tools. Get personalized insights, create compelling applications, and plan your international journey with confidence.'
                : 'Découvrez l\'avenir de l\'éducation avec nos outils alimentés par IA. Obtenez des insights personnalisés, créez des candidatures convaincantes et planifiez votre parcours international en toute confiance.'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                {language === 'en' ? 'Start Your Assessment' : 'Commencer Votre Évaluation'}
              </button>
              <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 shadow-lg">
                {language === 'en' ? 'Learn More' : 'En Savoir Plus'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EducationTools;
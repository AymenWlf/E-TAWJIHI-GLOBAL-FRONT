import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, Calculator, ArrowRight, Sparkles, Zap, CheckCircle } from 'lucide-react';

const EducationToolsGlobal = ({ language }) => {
  const tools = [
    {
      id: 'diagnostic',
      icon: <Brain className="w-8 h-8" />,
      title: language === 'en' ? 'Diagnostic System' : 'Système de Diagnostic',
      description: language === 'en' 
        ? 'Complete personality & skills assessment with certified E-TAWJIHI report'
        : 'Évaluation complète de personnalité et compétences avec rapport certifié E-TAWJIHI',
      features: language === 'en' 
        ? ['AI-Powered Analysis', 'Certified Report', 'Career Guidance']
        : ['Analyse Alimentée par IA', 'Rapport Certifié', 'Orientation Carrière'],
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'sop-generator',
      icon: <FileText className="w-8 h-8" />,
      title: language === 'en' ? 'SOP Letter Generator' : 'Générateur de Lettre SOP',
      description: language === 'en'
        ? 'AI-powered Statement of Purpose creator for university applications'
        : 'Créateur de lettre de motivation alimenté par IA pour candidatures universitaires',
      features: language === 'en'
        ? ['Personalized Content', 'University-Specific', 'Quality Assurance']
        : ['Contenu Personnalisé', 'Spécifique Université', 'Assurance Qualité'],
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'visa-calculator',
      icon: <Calculator className="w-8 h-8" />,
      title: language === 'en' ? 'Visa Calculator' : 'Calculateur de Visa',
      description: language === 'en'
        ? 'Calculate visa requirements, costs, and timeline estimates'
        : 'Calculez les exigences, coûts et estimations de délais de visa',
      features: language === 'en'
        ? ['Cost Estimation', 'Timeline Planning', 'Document Checklist']
        : ['Estimation Coûts', 'Planification Délais', 'Liste Documents'],
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200'
    }
  ];

  return (
    <section id="education-tools" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-purple-700 font-semibold text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            {language === 'en' ? 'AI-Powered Tools' : 'Outils Alimentés par IA'}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {language === 'en' ? (
              <>
                Transform Your <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Education Journey</span>
              </>
            ) : (
              <>
                Transformez Votre <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Parcours Éducatif</span>
              </>
            )}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {language === 'en' 
              ? 'Discover our cutting-edge AI tools designed to guide you through every step of your international education journey. From personality assessment to visa planning, we\'ve got you covered.'
              : 'Découvrez nos outils IA de pointe conçus pour vous guider à chaque étape de votre parcours éducatif international. De l\'évaluation de personnalité à la planification visa, nous vous accompagnons.'
            }
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              className={`group relative bg-gradient-to-br ${tool.bgColor} rounded-2xl p-8 border ${tool.borderColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${tool.color} rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {tool.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {tool.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {tool.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tool.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                to={`/education-tools#${tool.id}`}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${tool.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 group-hover:scale-105`}
              >
                {language === 'en' ? 'Explore Tool' : 'Explorer l\'Outil'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white/60" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Ready to Get Started?' : 'Prêt à Commencer ?'}
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Access all our AI-powered education tools and take control of your academic future with personalized insights and guidance.'
                : 'Accédez à tous nos outils éducatifs alimentés par IA et prenez le contrôle de votre avenir académique avec des conseils et insights personnalisés.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/education-tools"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Brain className="w-5 h-5" />
                {language === 'en' ? 'Explore All Tools' : 'Explorer Tous les Outils'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/education-tools#diagnostic"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-purple-200 text-purple-700 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5" />
                {language === 'en' ? 'Start Diagnostic' : 'Commencer Diagnostic'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationToolsGlobal;

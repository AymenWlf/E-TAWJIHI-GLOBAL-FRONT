import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, BarChart3, Users, MessageSquare, ArrowRight, CheckCircle, Globe, Target, Award } from 'lucide-react';

const Institutions = ({ language }) => {
  const [showForm, setShowForm] = useState(false);

  const content = {
    en: {
      title: "Reference your Institution or University",
      description: "Are you a university, college, or training center? Join E-TAWJIHI Global to reach thousands of motivated international students. Receive qualified applications, manage leads, and grow your visibility in Africa, the Middle East, and beyond.",
      cta1: "🏫 Register your Institution",
      cta2: "📄 Learn more about partnerships",
      features: [
        {
          icon: BarChart3,
          title: "Dashboard for partner institutions",
          description: "Comprehensive analytics and insights about your student applications and performance"
        },
        {
          icon: MessageSquare,
          title: "Lead tracking & communication",
          description: "Direct communication with prospective students and automated follow-up systems"
        },
        {
          icon: Users,
          title: "Analytics on student profiles",
          description: "Detailed insights into student demographics, interests, and application patterns"
        },
        {
          icon: Target,
          title: "Commission & performance tracking",
          description: "Track your partnership performance and commission earnings in real-time"
        }
      ],
      benefits: [
        "Access to 100,000+ qualified students",
        "Streamlined application process",
        "Marketing support & materials",
        "Dedicated account manager",
        "Competitive commission structure",
        "Global reach & visibility"
      ],
      form: {
        title: "Register Your Institution",
        fields: {
          name: "Institution Name",
          type: "Institution Type",
          country: "Country",
          email: "Contact Email",
          phone: "Phone Number",
          website: "Website",
          programs: "Number of Programs",
          students: "Current Student Count"
        },
        types: ["University", "College", "Training Center", "Language School", "Other"],
        submit: "Submit Application"
      }
    },
    fr: {
      title: "Référencez votre Institution ou Université",
      description: "Êtes-vous une université, un collège ou un centre de formation ? Rejoignez E-TAWJIHI Global pour atteindre des milliers d'étudiants internationaux motivés. Recevez des candidatures qualifiées, gérez les leads et développez votre visibilité en Afrique, au Moyen-Orient et au-delà.",
      cta1: "🏫 Enregistrer votre Institution",
      cta2: "📄 En savoir plus sur les partenariats",
      features: [
        {
          icon: BarChart3,
          title: "Tableau de bord pour institutions partenaires",
          description: "Analyses complètes et insights sur vos candidatures d'étudiants et performances"
        },
        {
          icon: MessageSquare,
          title: "Suivi des leads & communication",
          description: "Communication directe avec les étudiants potentiels et systèmes de suivi automatisés"
        },
        {
          icon: Users,
          title: "Analyses des profils étudiants",
          description: "Insights détaillés sur la démographie, intérêts et modèles de candidature des étudiants"
        },
        {
          icon: Target,
          title: "Suivi commission & performance",
          description: "Suivez vos performances de partenariat et gains de commission en temps réel"
        }
      ],
      benefits: [
        "Accès à 100 000+ étudiants qualifiés",
        "Processus de candidature simplifié",
        "Support marketing & matériel",
        "Gestionnaire de compte dédié",
        "Structure de commission compétitive",
        "Portée et visibilité mondiales"
      ],
      form: {
        title: "Enregistrer votre Institution",
        fields: {
          name: "Nom de l'Institution",
          type: "Type d'Institution",
          country: "Pays",
          email: "Email de Contact",
          phone: "Numéro de Téléphone",
          website: "Site Web",
          programs: "Nombre de Programmes",
          students: "Nombre d'Étudiants Actuels"
        },
        types: ["Université", "Collège", "Centre de Formation", "École de Langues", "Autre"],
        submit: "Soumettre la Candidature"
      }
    }
  };

  const currentContent = content[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="institutions" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            {currentContent.title}
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            {currentContent.description}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {currentContent.features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'en' ? 'Why Partner with E-TAWJIHI?' : 'Pourquoi Partenariat avec E-TAWJIHI ?'}
            </h3>
            <p className="text-xl text-white/90">
              {language === 'en' 
                ? 'Join the leading platform for international student recruitment' 
                : 'Rejoignez la plateforme leader pour le recrutement d\'étudiants internationaux'
              }
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
          >
            {currentContent.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-white/90">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
            >
              {currentContent.cta1}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center gap-3"
            >
              {currentContent.cta2}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        {/* Registration Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {currentContent.form.title}
              </h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.fields.name}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={currentContent.form.fields.name}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.fields.type}
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {currentContent.form.types.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.fields.country}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={currentContent.form.fields.country}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.fields.email}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={currentContent.form.fields.email}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.fields.phone}
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={currentContent.form.fields.phone}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.fields.website}
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={currentContent.form.fields.website}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.fields.programs}
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={currentContent.form.fields.programs}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.fields.students}
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={currentContent.form.fields.students}
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    {language === 'en' ? 'Cancel' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {currentContent.form.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Institutions;

import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Home, Globe, MessageCircle, ArrowRight, CheckCircle, Star } from 'lucide-react';

const Services = ({ language }) => {
  const content = {
    en: {
      title: "Your complete study journey, simplified",
      subtitle: "From application to graduation, we provide comprehensive support every step of the way",
      cta: "Explore Services",
      services: [
        {
          icon: Plane,
          title: "Visa & Application Assistance",
          description: "Expert guidance for visa applications, document preparation, and university applications",
          features: ["Visa consultation", "Document translation", "Application review", "Interview preparation"]
        },
        {
          icon: Home,
          title: "Housing & Accommodation",
          description: "Find safe, affordable housing options near your university with our partner network",
          features: ["Student housing", "Homestay options", "Shared apartments", "Safety verification"]
        },
        {
          icon: Globe,
          title: "Translation & Certified Documents",
          description: "Professional translation and certification services for all your academic documents",
          features: ["Academic transcripts", "Diploma translation", "Legal certification", "Fast processing"]
        },
        {
          icon: MessageCircle,
          title: "Coaching & Mentorship",
          description: "Personalized coaching from current students and alumni to help you succeed",
          features: ["Academic guidance", "Career counseling", "Cultural adaptation", "Peer mentoring"]
        }
      ],
      benefits: [
        "24/7 support available",
        "Expert local knowledge",
        "Proven success rate",
        "Affordable pricing"
      ]
    },
    fr: {
      title: "Votre parcours d'études complet, simplifié",
      subtitle: "De la candidature à l'obtention du diplôme, nous fournissons un support complet à chaque étape",
      cta: "Explorer les Services",
      services: [
        {
          icon: Plane,
          title: "Assistance Visa & Candidature",
          description: "Guidance experte pour les demandes de visa, préparation de documents et candidatures universitaires",
          features: ["Consultation visa", "Traduction de documents", "Révision de candidature", "Préparation entretien"]
        },
        {
          icon: Home,
          title: "Logement & Hébergement",
          description: "Trouvez des options de logement sûres et abordables près de votre université avec notre réseau de partenaires",
          features: ["Logement étudiant", "Options famille d'accueil", "Appartements partagés", "Vérification sécurité"]
        },
        {
          icon: Globe,
          title: "Traduction & Documents Certifiés",
          description: "Services professionnels de traduction et certification pour tous vos documents académiques",
          features: ["Relevés de notes", "Traduction diplômes", "Certification légale", "Traitement rapide"]
        },
        {
          icon: MessageCircle,
          title: "Coaching & Mentorat",
          description: "Coaching personnalisé d'étudiants actuels et anciens pour vous aider à réussir",
          features: ["Guidance académique", "Conseil carrière", "Adaptation culturelle", "Mentorat par les pairs"]
        }
      ],
      benefits: [
        "Support 24/7 disponible",
        "Connaissance locale experte",
        "Taux de réussite prouvé",
        "Tarification abordable"
      ]
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
    <section id="services" className="py-20 bg-white">
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
            {currentContent.subtitle}
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {currentContent.services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'en' ? 'Why Choose Our Services?' : 'Pourquoi Choisir Nos Services ?'}
            </h3>
            <p className="text-xl text-white/90">
              {language === 'en' 
                ? 'We make your study abroad journey seamless and successful' 
                : 'Nous rendons votre parcours d\'études à l\'étranger fluide et réussi'
              }
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {currentContent.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <p className="text-white/90 font-medium">{benefit}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            {currentContent.cta}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;

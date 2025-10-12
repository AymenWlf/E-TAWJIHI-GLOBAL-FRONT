import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Globe, Users, Target, Award, Zap } from 'lucide-react';

const About = ({ language }) => {
  const content = {
    en: {
      title: "About E-TAWJIHI",
      description: "Born in Morocco, E-TAWJIHI has grown into a global platform connecting students, universities, and study services across 50+ countries. We combine orientation, admissions, and real human guidance — all in one place.",
      features: [
        {
          icon: Brain,
          title: "Orientation powered by AI",
          description: "Smart recommendations based on your profile and goals"
        },
        {
          icon: Globe,
          title: "Admissions to 10,000+ programs",
          description: "Access to universities and programs worldwide"
        },
        {
          icon: Users,
          title: "Global services & partnerships",
          description: "Complete support from application to graduation"
        }
      ],
      stats: [
        { number: "50+", label: "Countries" },
        { number: "10,000+", label: "Programs" },
        { number: "100,000+", label: "Students" },
        { number: "500+", label: "Partners" }
      ]
    },
    fr: {
      title: "À propos d'E-TAWJIHI",
      description: "Né au Maroc, E-TAWJIHI est devenu une plateforme mondiale connectant étudiants, universités et services d'études dans plus de 50 pays. Nous combinons orientation, admissions et accompagnement humain — tout en un seul endroit.",
      features: [
        {
          icon: Brain,
          title: "Orientation alimentée par l'IA",
          description: "Recommandations intelligentes basées sur votre profil et vos objectifs"
        },
        {
          icon: Globe,
          title: "Admissions à 10 000+ programmes",
          description: "Accès aux universités et programmes du monde entier"
        },
        {
          icon: Users,
          title: "Services mondiaux et partenariats",
          description: "Support complet de la candidature à l'obtention du diplôme"
        }
      ],
      stats: [
        { number: "50+", label: "Pays" },
        { number: "10 000+", label: "Programmes" },
        { number: "100 000+", label: "Étudiants" },
        { number: "500+", label: "Partenaires" }
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
    <section id="about" className="py-20 bg-gray-50">
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
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {currentContent.features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 mx-auto">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'en' ? 'Our Global Impact' : 'Notre Impact Mondial'}
            </h3>
            <p className="text-xl text-white/90">
              {language === 'en' 
                ? 'Connecting students and institutions worldwide' 
                : 'Connecter étudiants et institutions dans le monde entier'
              }
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {currentContent.stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

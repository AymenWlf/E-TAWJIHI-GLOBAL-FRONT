import React from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Globe, 
  Award, 
  Users, 
  Clock, 
  CheckCircle, 
  Star,
  GraduationCap,
  BookOpen,
  Laptop,
  Wifi,
  FileText
} from 'lucide-react';

const ESTUDYGlobal = ({ language }) => {
  const content = {
    en: {
      title: "E-STUDY",
      subtitle: "Study Online, Get International Diplomas",
      description: "Access world-class education from anywhere in the world. Study online with international universities and receive the same diploma as international students, without leaving your country.",
      features: [
        {
          icon: <Monitor className="w-8 h-8" />,
          title: "Online Learning Platform",
          description: "Advanced virtual classrooms with interactive tools and real-time collaboration"
        },
        {
          icon: <Globe className="w-8 h-8" />,
          title: "Global University Access",
          description: "Study with top universities worldwide without geographical limitations"
        },
        {
          icon: <Award className="w-8 h-8" />,
          title: "Same International Diploma",
          description: "Receive identical diplomas to on-campus international students"
        },
        {
          icon: <Users className="w-8 h-8" />,
          title: "International Student Community",
          description: "Connect with students from around the world in virtual classrooms"
        },
        {
          icon: <Clock className="w-8 h-8" />,
          title: "Flexible Schedule",
          description: "Study at your own pace with recorded lectures and flexible deadlines"
        },
        {
          icon: <CheckCircle className="w-8 h-8" />,
          title: "Accredited Programs",
          description: "All programs are fully accredited and recognized internationally"
        }
      ],
      benefits: {
        title: "Why Choose E-STUDY?",
        items: [
          {
            title: "Cost-Effective",
            description: "Save on travel, accommodation, and living expenses while getting the same quality education",
            icon: <Star className="w-6 h-6" />
          },
          {
            title: "Time Efficient",
            description: "No visa processing time or travel arrangements needed",
            icon: <Clock className="w-6 h-6" />
          },
          {
            title: "Same Recognition",
            description: "Your diploma has the same value as traditional international students",
            icon: <FileText className="w-6 h-6" />
          },
          {
            title: "Global Network",
            description: "Build international connections and expand your professional network",
            icon: <Users className="w-6 h-6" />
          }
        ]
      },
      programs: {
        title: "Available Programs",
        subtitle: "Choose from a wide range of accredited online programs",
        categories: [
          {
            title: "Business & Management",
            programs: ["MBA", "Business Administration", "International Business", "Marketing"],
            icon: <GraduationCap className="w-6 h-6" />
          },
          {
            title: "Technology & Engineering",
            programs: ["Computer Science", "Software Engineering", "Data Science", "Cybersecurity"],
            icon: <Laptop className="w-6 h-6" />
          },
          {
            title: "Health & Medicine",
            programs: ["Public Health", "Healthcare Management", "Nursing", "Psychology"],
            icon: <BookOpen className="w-6 h-6" />
          },
          {
            title: "Arts & Humanities",
            programs: ["International Relations", "Education", "Languages", "Cultural Studies"],
            icon: <Globe className="w-6 h-6" />
          }
        ]
      },
      cta: {
        title: "Start Your E-STUDY Journey Today",
        description: "Join thousands of students who are already studying online with international universities",
        button: "Explore E-STUDY Programs"
      }
    },
    fr: {
      title: "E-STUDY",
      subtitle: "Étudiez en Ligne, Obtenez des Diplômes Internationaux",
      description: "Accédez à une éducation de classe mondiale depuis n'importe où dans le monde. Étudiez en ligne avec des universités internationales et recevez le même diplôme que les étudiants internationaux, sans quitter votre pays.",
      features: [
        {
          icon: <Monitor className="w-8 h-8" />,
          title: "Plateforme d'Apprentissage en Ligne",
          description: "Salles de classe virtuelles avancées avec outils interactifs et collaboration en temps réel"
        },
        {
          icon: <Globe className="w-8 h-8" />,
          title: "Accès aux Universités Mondiales",
          description: "Étudiez avec les meilleures universités du monde sans limitations géographiques"
        },
        {
          icon: <Award className="w-8 h-8" />,
          title: "Même Diplôme International",
          description: "Recevez des diplômes identiques aux étudiants internationaux sur campus"
        },
        {
          icon: <Users className="w-8 h-8" />,
          title: "Communauté d'Étudiants Internationaux",
          description: "Connectez-vous avec des étudiants du monde entier dans des salles de classe virtuelles"
        },
        {
          icon: <Clock className="w-8 h-8" />,
          title: "Horaire Flexible",
          description: "Étudiez à votre rythme avec des conférences enregistrées et des délais flexibles"
        },
        {
          icon: <CheckCircle className="w-8 h-8" />,
          title: "Programmes Accrédités",
          description: "Tous les programmes sont entièrement accrédités et reconnus internationalement"
        }
      ],
      benefits: {
        title: "Pourquoi Choisir E-STUDY?",
        items: [
          {
            title: "Économique",
            description: "Économisez sur les frais de voyage, d'hébergement et de vie tout en obtenant la même qualité d'éducation",
            icon: <Star className="w-6 h-6" />
          },
          {
            title: "Efficace en Temps",
            description: "Pas de temps de traitement de visa ou d'arrangements de voyage nécessaires",
            icon: <Clock className="w-6 h-6" />
          },
          {
            title: "Même Reconnaissance",
            description: "Votre diplôme a la même valeur que les étudiants internationaux traditionnels",
            icon: <FileText className="w-6 h-6" />
          },
          {
            title: "Réseau Mondial",
            description: "Construisez des connexions internationales et élargissez votre réseau professionnel",
            icon: <Users className="w-6 h-6" />
          }
        ]
      },
      programs: {
        title: "Programmes Disponibles",
        subtitle: "Choisissez parmi une large gamme de programmes en ligne accrédités",
        categories: [
          {
            title: "Commerce & Gestion",
            programs: ["MBA", "Administration des Affaires", "Commerce International", "Marketing"],
            icon: <GraduationCap className="w-6 h-6" />
          },
          {
            title: "Technologie & Ingénierie",
            programs: ["Informatique", "Génie Logiciel", "Science des Données", "Cybersécurité"],
            icon: <Laptop className="w-6 h-6" />
          },
          {
            title: "Santé & Médecine",
            programs: ["Santé Publique", "Gestion de la Santé", "Infirmière", "Psychologie"],
            icon: <BookOpen className="w-6 h-6" />
          },
          {
            title: "Arts & Sciences Humaines",
            programs: ["Relations Internationales", "Éducation", "Langues", "Études Culturelles"],
            icon: <Globe className="w-6 h-6" />
          }
        ]
      },
      cta: {
        title: "Commencez Votre Voyage E-STUDY Aujourd'hui",
        description: "Rejoignez des milliers d'étudiants qui étudient déjà en ligne avec des universités internationales",
        button: "Explorer les Programmes E-STUDY"
      }
    }
  };

  const t = content[language];

  return (
    <section id="estudy" className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {t.title}
          </h2>
          <p className="text-2xl text-blue-600 font-semibold mb-6">
            {t.subtitle}
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {t.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-2xl mb-6 mx-auto">
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-3xl p-12 shadow-xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t.benefits.title}
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.benefits.items.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Programs Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t.programs.title}
            </h3>
            <p className="text-lg text-gray-600">
              {t.programs.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.programs.categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {category.title}
                  </h4>
                </div>
                <ul className="space-y-2">
                  {category.programs.map((program, programIndex) => (
                    <li key={programIndex} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                      <span>{program}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-3xl p-12 text-gray-900 shadow-2xl border border-gray-100"
        >
          <h3 className="text-3xl font-bold mb-4 text-gray-900">
            {t.cta.title}
          </h3>
          <p className="text-xl mb-8 text-gray-600">
            {t.cta.description}
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            {t.cta.button}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ESTUDYGlobal;

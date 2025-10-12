import React from 'react';
import { Users, Handshake, DollarSign, Star, ArrowRight, Trophy, Gift, Target } from 'lucide-react';

const AgentsSimple = ({ language }) => {
  const content = {
    en: {
      title: "Join our Global Network",
      subtitle: "Become part of our community and earn while helping students achieve their dreams",
      cta: "Become a Partner",
      agents: {
        title: "Agents & Partners",
        description: "Earn commissions by connecting students to top institutions worldwide",
        features: [
          "Competitive commission rates",
          "Access to exclusive programs",
          "Marketing support & materials",
          "Real-time tracking dashboard",
          "Priority customer support",
          "Training & certification"
        ],
        benefits: [
          { icon: DollarSign, text: "Up to 15% commission" },
          { icon: Target, text: "Qualified leads" },
          { icon: Trophy, text: "Performance bonuses" }
        ]
      },
      ambassadors: {
        title: "Student Ambassadors",
        description: "Invite friends, earn points, and turn them into cash rewards",
        features: [
          "Referral rewards program",
          "Social media campaigns",
          "Campus events & workshops",
          "Exclusive ambassador events",
          "Leadership opportunities",
          "Networking with peers"
        ],
        benefits: [
          { icon: Gift, text: "€50 per successful referral" },
          { icon: Star, text: "Exclusive perks" },
          { icon: Users, text: "Build your network" }
        ]
      }
    },
    fr: {
      title: "Rejoignez notre Réseau Mondial",
      subtitle: "Devenez membre de notre communauté et gagnez en aidant les étudiants à réaliser leurs rêves",
      cta: "Devenir Partenaire",
      agents: {
        title: "Agents & Partenaires",
        description: "Gagnez des commissions en connectant les étudiants aux meilleures institutions mondiales",
        features: [
          "Taux de commission compétitifs",
          "Accès aux programmes exclusifs",
          "Support marketing & matériel",
          "Tableau de bord de suivi en temps réel",
          "Support client prioritaire",
          "Formation & certification"
        ],
        benefits: [
          { icon: DollarSign, text: "Jusqu'à 15% de commission" },
          { icon: Target, text: "Leads qualifiés" },
          { icon: Trophy, text: "Bonus de performance" }
        ]
      },
      ambassadors: {
        title: "Ambassadeurs Étudiants",
        description: "Invitez des amis, gagnez des points et transformez-les en récompenses en espèces",
        features: [
          "Programme de récompenses de parrainage",
          "Campagnes sur les réseaux sociaux",
          "Événements & ateliers sur campus",
          "Événements exclusifs ambassadeurs",
          "Opportunités de leadership",
          "Réseautage avec les pairs"
        ],
        benefits: [
          { icon: Gift, text: "50€ par parrainage réussi" },
          { icon: Star, text: "Avantages exclusifs" },
          { icon: Users, text: "Construisez votre réseau" }
        ]
      }
    }
  };

  const currentContent = content[language];

  return (
    <section id="agents" className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Agents & Partners */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Handshake className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {currentContent.agents.title}
              </h3>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {currentContent.agents.description}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {currentContent.agents.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {currentContent.agents.benefits.map((benefit, index) => (
                <div key={index} className="text-center p-4 bg-blue-50 rounded-2xl">
                  <benefit.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">{benefit.text}</p>
                </div>
              ))}
            </div>

            <button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3">
              {language === 'en' ? 'Become an Agent' : 'Devenir Agent'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Student Ambassadors */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {currentContent.ambassadors.title}
              </h3>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {currentContent.ambassadors.description}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {currentContent.ambassadors.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {currentContent.ambassadors.benefits.map((benefit, index) => (
                <div key={index} className="text-center p-4 bg-green-50 rounded-2xl">
                  <benefit.icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">{benefit.text}</p>
                </div>
              ))}
            </div>

            <button className="w-full bg-gradient-to-r from-secondary-600 to-secondary-700 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3">
              {language === 'en' ? 'Become an Ambassador' : 'Devenir Ambassadeur'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            {language === 'en' ? 'Success Stories' : 'Histoires de Succès'}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: language === 'en' ? 'Sarah M.' : 'Sarah M.',
                role: language === 'en' ? 'Agent, Morocco' : 'Agent, Maroc',
                quote: language === 'en' 
                  ? 'I\'ve helped 50+ students find their dream programs. The commission structure is excellent!' 
                  : 'J\'ai aidé plus de 50 étudiants à trouver leurs programmes de rêve. La structure de commission est excellente !',
                earnings: language === 'en' ? '€15,000 earned' : '15 000€ gagnés'
              },
              {
                name: language === 'en' ? 'Ahmed K.' : 'Ahmed K.',
                role: language === 'en' ? 'Ambassador, Germany' : 'Ambassadeur, Allemagne',
                quote: language === 'en' 
                  ? 'Being an ambassador helped me build my network and earn extra income while studying.' 
                  : 'Être ambassadeur m\'a aidé à construire mon réseau et gagner un revenu supplémentaire pendant mes études.',
                earnings: language === 'en' ? '€2,500 earned' : '2 500€ gagnés'
              },
              {
                name: language === 'en' ? 'Maria L.' : 'Maria L.',
                role: language === 'en' ? 'Partner, Spain' : 'Partenaire, Espagne',
                quote: language === 'en' 
                  ? 'The support and training provided by E-TAWJIHI is outstanding. Highly recommended!' 
                  : 'Le support et la formation fournis par E-TAWJIHI sont exceptionnels. Hautement recommandé !',
                earnings: language === 'en' ? '€8,000 earned' : '8 000€ gagnés'
              }
            ].map((story, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {story.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{story.quote}"</p>
                
                <div className="text-green-600 font-semibold">
                  {story.earnings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentsSimple;

import React from 'react';
import { Building2, Handshake, Users, ArrowRight, Globe, Award, TrendingUp, Star } from 'lucide-react';

const PartnersAmbassadors = ({ language }) => {
  const content = {
    en: {
      title: "Join our global network.",
      subtitle: "E-TAWJIHI connects institutions, agents, and student ambassadors worldwide — creating opportunities for everyone in the education ecosystem.",
      sections: [
        {
          icon: Building2,
          title: "For Institutions",
          description: "List your programs and receive qualified international applicants.",
          cta: "Register your Institution",
          features: [
            "Global student reach",
            "Qualified applicants",
            "Streamlined admissions",
            "Marketing support"
          ],
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600"
        },
        {
          icon: Handshake,
          title: "For Agents",
          description: "Manage leads, track commissions, and grow your portfolio.",
          cta: "Become a Partner",
          features: [
            "Lead management system",
            "Commission tracking",
            "Marketing materials",
            "Training & support"
          ],
          color: "from-emerald-500 to-emerald-600",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        {
          icon: Users,
          title: "For Student Ambassadors",
          description: "Invite friends, earn points, and turn them into rewards.",
          cta: "Join the Ambassador Program",
          features: [
            "Referral rewards",
            "Exclusive benefits",
            "Community access",
            "Career opportunities"
          ],
          color: "from-cyan-500 to-cyan-600",
          bgColor: "bg-cyan-50",
          iconColor: "text-cyan-600"
        }
      ],
      stats: [
        {
          icon: Building2,
          value: "500+",
          label: "Partner Institutions"
        },
        {
          icon: Handshake,
          value: "1,200+",
          label: "Education Agents"
        },
        {
          icon: Users,
          value: "5,000+",
          label: "Student Ambassadors"
        },
        {
          icon: Globe,
          value: "50+",
          label: "Countries"
        }
      ]
    },
    fr: {
      title: "Rejoignez notre réseau mondial.",
      subtitle: "E-TAWJIHI connecte les institutions, agents et ambassadeurs étudiants dans le monde entier — créant des opportunités pour tous dans l'écosystème éducatif.",
      sections: [
        {
          icon: Building2,
          title: "Pour les Institutions",
          description: "Listez vos programmes et recevez des candidats internationaux qualifiés.",
          cta: "Enregistrer votre Institution",
          features: [
            "Portée mondiale des étudiants",
            "Candidats qualifiés",
            "Admissions simplifiées",
            "Support marketing"
          ],
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600"
        },
        {
          icon: Handshake,
          title: "Pour les Agents",
          description: "Gérez les prospects, suivez les commissions et développez votre portefeuille.",
          cta: "Devenir Partenaire",
          features: [
            "Système de gestion des prospects",
            "Suivi des commissions",
            "Matériel marketing",
            "Formation et support"
          ],
          color: "from-emerald-500 to-emerald-600",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        {
          icon: Users,
          title: "Pour les Ambassadeurs Étudiants",
          description: "Invitez des amis, gagnez des points et transformez-les en récompenses.",
          cta: "Rejoindre le Programme Ambassadeur",
          features: [
            "Récompenses de parrainage",
            "Avantages exclusifs",
            "Accès à la communauté",
            "Opportunités de carrière"
          ],
          color: "from-cyan-500 to-cyan-600",
          bgColor: "bg-cyan-50",
          iconColor: "text-cyan-600"
        }
      ],
      stats: [
        {
          icon: Building2,
          value: "500+",
          label: "Institutions Partenaires"
        },
        {
          icon: Handshake,
          value: "1 200+",
          label: "Agents Éducation"
        },
        {
          icon: Users,
          value: "5 000+",
          label: "Ambassadeurs Étudiants"
        },
        {
          icon: Globe,
          value: "50+",
          label: "Pays"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section id="partners" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-emerald-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full mb-6">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Global Network</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Network Visualization */}
        <div className="mb-20">
          <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            {/* Central Hub */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Globe className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">E-TAWJIHI</h3>
              <p className="text-gray-600">Connecting the world of education</p>
            </div>

            {/* Network Nodes */}
            <div className="relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 z-0">
                <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
                <div className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {t.sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                      <div className={`w-16 h-16 ${section.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 ${section.iconColor}`} />
                      </div>
                      
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {section.title}
                      </h4>
                      
                      <p className="text-gray-600 mb-4">
                        {section.description}
                      </p>

                      <button className="group/btn flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mx-auto">
                        <span className="font-medium text-sm">{section.cta}</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      </div>
                    </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {t.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${section.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${section.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {section.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {section.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {section.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                      <button className="group/btn w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <span className="font-semibold">{section.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {language === 'en' ? 'Our Global Impact' : 'Notre Impact Mondial'}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Join thousands of partners who are transforming education worldwide.'
                : 'Rejoignez des milliers de partenaires qui transforment l\'éducation dans le monde.'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">University of Toronto</h4>
                <p className="text-sm text-gray-600">Partner since 2023</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {language === 'en' 
                ? '"E-TAWJIHI has helped us reach qualified students from 15+ countries."'
                : '"E-TAWJIHI nous a aidés à atteindre des étudiants qualifiés de plus de 15 pays."'
              }
            </p>
            <div className="flex items-center mt-4">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-2">5.0</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Handshake className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Education First Agency</h4>
                <p className="text-sm text-gray-600">Partner since 2022</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {language === 'en' 
                ? '"Our commission tracking and lead management has improved by 300%."'
                : '"Notre suivi des commissions et gestion des prospects s\'est amélioré de 300%."'
              }
            </p>
            <div className="flex items-center mt-4">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-2">4.9</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Sarah M.</h4>
                <p className="text-sm text-gray-600">Student Ambassador</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {language === 'en' 
                ? '"I\'ve earned over $2,000 in rewards by referring friends to E-TAWJIHI."'
                : '"J\'ai gagné plus de 2000$ en récompenses en référant des amis à E-TAWJIHI."'
              }
            </p>
            <div className="flex items-center mt-4">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-2">5.0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersAmbassadors;

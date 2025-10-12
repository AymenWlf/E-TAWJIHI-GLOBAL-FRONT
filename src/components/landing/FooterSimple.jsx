import React from 'react';
import { Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Globe, ArrowUp } from 'lucide-react';

const FooterSimple = ({ language }) => {
  const content = {
    en: {
      tagline: "From Morocco to the World — E-TAWJIHI Global © 2025",
      quickLinks: {
        title: "Quick Links",
        links: [
          { name: "About", href: "#about" },
          { name: "Programs", href: "#search" },
          { name: "Institutions", href: "#institutions" },
          { name: "Agents", href: "#agents" },
          { name: "Blog", href: "/blog" },
          { name: "Contact", href: "/contact" }
        ]
      },
      services: {
        title: "Services",
        links: [
          { name: "Student Orientation", href: "/orientation" },
          { name: "University Search", href: "/search" },
          { name: "Visa Assistance", href: "/visa" },
          { name: "Document Translation", href: "/translation" },
          { name: "Housing Support", href: "/housing" },
          { name: "Career Coaching", href: "/coaching" }
        ]
      },
      support: {
        title: "Support",
        links: [
          { name: "Help Center", href: "/help" },
          { name: "FAQ", href: "/faq" },
          { name: "Contact Us", href: "/contact" },
          { name: "Live Chat", href: "/chat" },
          { name: "Status", href: "/status" },
          { name: "Feedback", href: "/feedback" }
        ]
      },
      contact: {
        title: "Contact Info",
        email: "hello@e-tawjihi.ma",
        phone: "+212 5XX XXX XXX",
        address: "Casablanca, Morocco"
      },
      social: {
        title: "Follow Us",
        instagram: "Instagram",
        linkedin: "LinkedIn",
        youtube: "YouTube"
      }
    },
    fr: {
      tagline: "Du Maroc au Monde — E-TAWJIHI Global © 2025",
      quickLinks: {
        title: "Liens Rapides",
        links: [
          { name: "À propos", href: "#about" },
          { name: "Programmes", href: "#search" },
          { name: "Institutions", href: "#institutions" },
          { name: "Agents", href: "#agents" },
          { name: "Blog", href: "/blog" },
          { name: "Contact", href: "/contact" }
        ]
      },
      services: {
        title: "Services",
        links: [
          { name: "Orientation Étudiante", href: "/orientation" },
          { name: "Recherche Université", href: "/search" },
          { name: "Assistance Visa", href: "/visa" },
          { name: "Traduction Documents", href: "/translation" },
          { name: "Support Logement", href: "/housing" },
          { name: "Coaching Carrière", href: "/coaching" }
        ]
      },
      support: {
        title: "Support",
        links: [
          { name: "Centre d'Aide", href: "/help" },
          { name: "FAQ", href: "/faq" },
          { name: "Nous Contacter", href: "/contact" },
          { name: "Chat en Direct", href: "/chat" },
          { name: "Statut", href: "/status" },
          { name: "Commentaires", href: "/feedback" }
        ]
      },
      contact: {
        title: "Informations de Contact",
        email: "hello@e-tawjihi.ma",
        phone: "+212 5XX XXX XXX",
        address: "Casablanca, Maroc"
      },
      social: {
        title: "Suivez-nous",
        instagram: "Instagram",
        linkedin: "LinkedIn",
        youtube: "YouTube"
      }
    }
  };

  const currentContent = content[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">E-TAWJIHI</h3>
                <p className="text-gray-400 text-sm">Global</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              {language === 'en' 
                ? 'Your Global Education Gateway. Connecting students worldwide with top universities and programs through AI-powered guidance and comprehensive support services.'
                : 'Votre Portail Éducatif Mondial. Connecter les étudiants du monde entier avec les meilleures universités et programmes grâce à un guidage alimenté par l\'IA et des services de support complets.'
              }
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <a href={`mailto:${currentContent.contact.email}`} className="text-gray-300 hover:text-white transition-colors">
                  {currentContent.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <a href={`tel:${currentContent.contact.phone}`} className="text-gray-300 hover:text-white transition-colors">
                  {currentContent.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">{currentContent.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{currentContent.quickLinks.title}</h4>
            <ul className="space-y-3">
              {currentContent.quickLinks.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{currentContent.services.title}</h4>
            <ul className="space-y-3">
              {currentContent.services.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{currentContent.support.title}</h4>
            <ul className="space-y-3">
              {currentContent.support.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{currentContent.social.title}</h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/e-tawjihi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://linkedin.com/company/e-tawjihi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Linkedin className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://youtube.com/@e-tawjihi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Youtube className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Stay Updated' : 'Restez Informé'}
              </h4>
              <p className="text-gray-300 mb-4">
                {language === 'en' 
                  ? 'Get the latest news and opportunities' 
                  : 'Recevez les dernières nouvelles et opportunités'
                }
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={language === 'en' ? 'Your email' : 'Votre email'}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                  {language === 'en' ? 'Subscribe' : 'S\'abonner'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-center md:text-left">
            {currentContent.tagline}
          </p>
          
          <div className="flex items-center gap-4">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
              {language === 'en' ? 'Privacy Policy' : 'Politique de Confidentialité'}
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
              {language === 'en' ? 'Terms of Service' : 'Conditions d\'Utilisation'}
            </a>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSimple;

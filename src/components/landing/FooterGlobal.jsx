import React from 'react';
import { Globe, Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Twitter, ArrowRight } from 'lucide-react';

const FooterGlobal = ({ language }) => {
  const content = {
    en: {
      description: "E-TAWJIHI Global is your gateway to world-class education. Connect with universities worldwide, get AI-powered guidance, and make your study abroad dreams a reality.",
      quickLinks: {
        title: "Quick Links",
        links: [
          { name: "Home", href: "#" },
          { name: "Programs", href: "#programs" },
          { name: "Institutions", href: "#partners" },
          { name: "Agents", href: "#partners" },
          { name: "Blog", href: "#" },
          { name: "Contact", href: "#" }
        ]
      },
      services: {
        title: "Services",
        links: [
          { name: "E-DVISOR", href: "#aidvisor" },
          { name: "Search Programs", href: "#search" },
          { name: "Visa Assistance", href: "#services" },
          { name: "Student Housing", href: "#services" },
          { name: "Document Translation", href: "#services" },
          { name: "Personal Coaching", href: "#services" }
        ]
      },
      support: {
        title: "Support",
        links: [
          { name: "Help Center", href: "#" },
          { name: "FAQ", href: "#" },
          { name: "Contact Us", href: "#" },
          { name: "Live Chat", href: "#" },
          { name: "Status Page", href: "#" }
        ]
      },
      contact: {
        email: "contact@e-tawjihi.ma",
        phone: "+212 6 60 51 81 25",
        address: "Casablanca, Morocco"
      },
      copyright: "E-TAWJIHI Global © 2025 — From Morocco to the World."
    },
    fr: {
      description: "E-TAWJIHI Global est votre passerelle vers une éducation de classe mondiale. Connectez-vous avec des universités du monde entier, obtenez des conseils alimentés par l'IA et réalisez vos rêves d'études à l'étranger.",
      quickLinks: {
        title: "Liens Rapides",
        links: [
          { name: "Accueil", href: "#" },
          { name: "Programmes", href: "#programs" },
          { name: "Institutions", href: "#partners" },
          { name: "Agents", href: "#partners" },
          { name: "Blog", href: "#" },
          { name: "Contact", href: "#" }
        ]
      },
      services: {
        title: "Services",
        links: [
          { name: "E-DVISOR", href: "#aidvisor" },
          { name: "Rechercher Programmes", href: "#search" },
          { name: "Assistance Visa", href: "#services" },
          { name: "Logement Étudiant", href: "#services" },
          { name: "Traduction Documents", href: "#services" },
          { name: "Coaching Personnel", href: "#services" }
        ]
      },
      support: {
        title: "Support",
        links: [
          { name: "Centre d'Aide", href: "#" },
          { name: "FAQ", href: "#" },
          { name: "Nous Contacter", href: "#" },
          { name: "Chat en Direct", href: "#" },
          { name: "Page de Statut", href: "#" }
        ]
      },
      contact: {
        email: "contact@e-tawjihi.ma",
        phone: "+212 6 60 51 81 25",
        address: "Casablanca, Maroc"
      },
      copyright: "E-TAWJIHI Global © 2025 — Du Maroc au Monde."
    }
  };

  const t = content[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="https://cdn.e-tawjihi.ma/logo-blanc-nobg.png" 
                alt="E-TAWJIHI Logo" 
                className="h-24 w-auto"
              />
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              {t.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-blue-500" />
                <a href={`mailto:${t.contact.email}`} className="hover:text-white transition-colors">
                  {t.contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-emerald-500" />
                <a href={`tel:${t.contact.phone}`} className="hover:text-white transition-colors">
                  {t.contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-cyan-500" />
                <span>{t.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t.quickLinks.title}</h4>
            <ul className="space-y-3">
              {t.quickLinks.links.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => link.href.startsWith('#') ? scrollToSection(link.href.substring(1)) : null}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <span>{link.name}</span>
                    {link.href.startsWith('#') && (
                      <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t.services.title}</h4>
            <ul className="space-y-3">
              {t.services.links.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => link.href.startsWith('#') ? scrollToSection(link.href.substring(1)) : null}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <span>{link.name}</span>
                    {link.href.startsWith('#') && (
                      <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t.support.title}</h4>
            <ul className="space-y-3">
              {t.support.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-2xl p-8 mb-12 border border-gray-700">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl font-bold mb-2 text-white">
                {language === 'en' ? 'Stay Updated' : 'Restez Informé'}
              </h4>
              <p className="text-white">
                {language === 'en' 
                  ? 'Get the latest updates on programs, scholarships, and study opportunities.'
                  : 'Recevez les dernières mises à jour sur les programmes, bourses et opportunités d\'études.'
                }
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder={language === 'en' ? 'Enter your email' : 'Entrez votre email'}
                className="flex-1 px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 font-semibold">
                <span className="text-white">{language === 'en' ? 'Stay Informed' : 'Restez Informé'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-700">
          {/* Social Media */}
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              {t.copyright}
            </p>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5 rotate-[-90deg]" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterGlobal;

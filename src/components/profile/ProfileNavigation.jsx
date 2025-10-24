import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Copy, Check, ExternalLink, Bookmark } from 'lucide-react';

const ProfileNavigation = ({ language }) => {
  const location = useLocation();
  const [copiedUrl, setCopiedUrl] = useState('');

  const sections = [
    {
      id: 'onboarding',
      label: language === 'en' ? 'Onboarding' : 'Intégration',
      url: '/profile/onboarding'
    },
    {
      id: 'basic-info',
      label: language === 'en' ? 'Basic Information' : 'Informations de Base',
      url: '/profile/basic-info'
    },
    {
      id: 'qualifications',
      label: language === 'en' ? 'Qualifications' : 'Qualifications',
      url: '/profile/qualifications',
      subsections: [
        {
          id: 'academic',
          label: language === 'en' ? 'Academic Qualifications' : 'Qualifications Académiques',
          url: '/profile/qualifications/academic'
        },
        {
          id: 'english',
          label: language === 'en' ? 'English Language Tests' : 'Tests de Langue Anglaise',
          url: '/profile/qualifications/english'
        },
        {
          id: 'standardized',
          label: language === 'en' ? 'Standardized Tests' : 'Tests Standardisés',
          url: '/profile/qualifications/standardized'
        }
      ]
    },
    {
      id: 'preferences',
      label: language === 'en' ? 'Preferences' : 'Préférences',
      url: '/profile/preferences'
    },
    {
      id: 'documents',
      label: language === 'en' ? 'Documents' : 'Documents',
      url: '/profile/documents'
    },
    {
      id: 'applications',
      label: language === 'en' ? 'Applications' : 'Candidatures',
      url: '/profile/applications'
    },
    {
      id: 'shortlist',
      label: language === 'en' ? 'Shortlist' : 'Liste de Souhaits',
      url: '/profile/shortlist'
    },
    {
      id: 'orders',
      label: language === 'en' ? 'Orders' : 'Commandes',
      url: '/profile/orders'
    },
    {
      id: 'payments',
      label: language === 'en' ? 'Payments' : 'Paiements',
      url: '/profile/payments'
    },
    {
      id: 'complaints',
      label: language === 'en' ? 'Complaints' : 'Réclamations',
      url: '/profile/complaints'
    },
    {
      id: 'faq',
      label: language === 'en' ? 'FAQ' : 'FAQ',
      url: '/profile/faq'
    },
    {
      id: 'suggestions',
      label: language === 'en' ? 'Suggestions' : 'Suggestions',
      url: '/profile/suggestions'
    },
    {
      id: 'ambassador',
      label: language === 'en' ? 'Ambassador Program' : 'Programme Ambassadeur',
      url: '/profile/ambassador'
    }
  ];

  const copyToClipboard = async (url) => {
    try {
      const fullUrl = `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(''), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const isCurrentUrl = (url) => {
    return location.pathname === url;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Bookmark className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {language === 'en' ? 'Profile Navigation' : 'Navigation du Profil'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'en' ? 'Direct links to profile sections' : 'Liens directs vers les sections du profil'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="space-y-2">
            {/* Main Section */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Link
                  to={section.url}
                  className={`font-medium transition-colors ${
                    isCurrentUrl(section.url)
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {section.label}
                </Link>
                {isCurrentUrl(section.url) && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(section.url)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title={language === 'en' ? 'Copy URL' : 'Copier l\'URL'}
                >
                  {copiedUrl === section.url ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={section.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title={language === 'en' ? 'Open in new tab' : 'Ouvrir dans un nouvel onglet'}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Subsections */}
            {section.subsections && (
              <div className="ml-6 space-y-1">
                {section.subsections.map((subsection) => (
                  <div key={subsection.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={subsection.url}
                        className={`text-sm transition-colors ${
                          isCurrentUrl(subsection.url)
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                      >
                        • {subsection.label}
                      </Link>
                      {isCurrentUrl(subsection.url) && (
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(subsection.url)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title={language === 'en' ? 'Copy URL' : 'Copier l\'URL'}
                      >
                        {copiedUrl === subsection.url ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <a
                        href={subsection.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title={language === 'en' ? 'Open in new tab' : 'Ouvrir dans un nouvel onglet'}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current URL Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {language === 'en' ? 'Current URL:' : 'URL actuelle:'}
            </p>
            <p className="text-sm text-gray-600 font-mono break-all">
              {window.location.origin}{location.pathname}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(location.pathname)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={language === 'en' ? 'Copy current URL' : 'Copier l\'URL actuelle'}
          >
            {copiedUrl === location.pathname ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavigation;

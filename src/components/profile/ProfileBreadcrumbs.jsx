import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Copy, Check, Home, User } from 'lucide-react';

const ProfileBreadcrumbs = ({ language }) => {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      const fullUrl = `${window.location.origin}${location.pathname}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: language === 'en' ? 'Home' : 'Accueil', href: '/', icon: Home }
    ];

    if (pathSegments[0] === 'profile') {
      breadcrumbs.push({
        label: language === 'en' ? 'Profile' : 'Profil',
        href: '/profile',
        icon: User
      });

      if (pathSegments[1]) {
        const sectionMap = {
          'onboarding': language === 'en' ? 'Onboarding' : 'Intégration',
          'basic-info': language === 'en' ? 'Basic Information' : 'Informations de Base',
          'qualifications': language === 'en' ? 'Qualifications' : 'Qualifications',
          'preferences': language === 'en' ? 'Preferences' : 'Préférences',
          'documents': language === 'en' ? 'Documents' : 'Documents',
          'applications': language === 'en' ? 'Applications' : 'Candidatures',
          'shortlist': language === 'en' ? 'Shortlist' : 'Liste de Souhaits',
          'orders': language === 'en' ? 'Orders' : 'Commandes',
          'payments': language === 'en' ? 'Payments' : 'Paiements',
          'complaints': language === 'en' ? 'Complaints' : 'Réclamations',
          'faq': language === 'en' ? 'FAQ' : 'FAQ',
          'suggestions': language === 'en' ? 'Suggestions' : 'Suggestions',
          'ambassador': language === 'en' ? 'Ambassador Program' : 'Programme Ambassadeur'
        };

        breadcrumbs.push({
          label: sectionMap[pathSegments[1]] || pathSegments[1],
          href: `/profile/${pathSegments[1]}`,
          icon: null
        });

        if (pathSegments[2]) {
          const subsectionMap = {
            'academic': language === 'en' ? 'Academic Qualifications' : 'Qualifications Académiques',
            'english': language === 'en' ? 'English Language Tests' : 'Tests de Langue Anglaise',
            'standardized': language === 'en' ? 'Standardized Tests' : 'Tests Standardisés'
          };

          breadcrumbs.push({
            label: subsectionMap[pathSegments[2]] || pathSegments[2],
            href: `/profile/${pathSegments[1]}/${pathSegments[2]}`,
            icon: null
          });
        }
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => {
            const Icon = breadcrumb.icon;
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <div className="flex items-center space-x-1">
                  {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                  {isLast ? (
                    <span className="font-medium text-gray-900">
                      {breadcrumb.label}
                    </span>
                  ) : (
                    <Link
                      to={breadcrumb.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {breadcrumb.label}
                    </Link>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </nav>

        {/* URL Display and Copy */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {location.pathname}
            </span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={language === 'en' ? 'Copy URL' : 'Copier l\'URL'}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">
                  {language === 'en' ? 'Copied!' : 'Copié!'}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {language === 'en' ? 'Copy URL' : 'Copier l\'URL'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBreadcrumbs;

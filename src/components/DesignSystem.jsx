import React from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Component, 
  Smartphone, 
  Monitor,
  Tablet,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const DesignSystem = () => {
  const colorPalette = [
    { name: 'Primary Blue', class: 'bg-blue-600', hex: '#2563eb', usage: 'Boutons principaux, liens actifs' },
    { name: 'Primary Blue Hover', class: 'bg-blue-700', hex: '#1d4ed8', usage: 'États hover' },
    { name: 'Secondary Emerald', class: 'bg-emerald-500', hex: '#10b981', usage: 'Succès, confirmations' },
    { name: 'Accent Purple', class: 'bg-violet-600', hex: '#7c3aed', usage: 'Accents, highlights' },
    { name: 'Gray 50', class: 'bg-gray-50', hex: '#f9fafb', usage: 'Backgrounds légers' },
    { name: 'Gray 100', class: 'bg-gray-100', hex: '#f3f4f6', usage: 'Backgrounds neutres' },
    { name: 'Gray 200', class: 'bg-gray-200', hex: '#e5e7eb', usage: 'Bordures légères' },
    { name: 'Gray 700', class: 'bg-gray-700', hex: '#374151', usage: 'Texte principal' },
    { name: 'Gray 900', class: 'bg-gray-900', hex: '#111827', usage: 'Texte sombre' },
  ];

  const typography = [
    { element: 'H1', class: 'text-4xl font-bold', size: '36px', usage: 'Titres principaux' },
    { element: 'H2', class: 'text-3xl font-bold', size: '30px', usage: 'Sections principales' },
    { element: 'H3', class: 'text-2xl font-semibold', size: '24px', usage: 'Sous-sections' },
    { element: 'H4', class: 'text-xl font-semibold', size: '20px', usage: 'Titres de cartes' },
    { element: 'H5', class: 'text-lg font-medium', size: '18px', usage: 'Titres de listes' },
    { element: 'H6', class: 'text-base font-medium', size: '16px', usage: 'Labels' },
    { element: 'Body', class: 'text-base font-normal', size: '16px', usage: 'Texte principal' },
    { element: 'Small', class: 'text-sm font-normal', size: '14px', usage: 'Texte secondaire' },
  ];

  const components = [
    {
      name: 'Bouton Principal',
      class: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
      usage: 'Actions principales'
    },
    {
      name: 'Bouton Secondaire',
      class: 'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors',
      usage: 'Actions secondaires'
    },
    {
      name: 'Input Standard',
      class: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      usage: 'Champs de saisie'
    },
    {
      name: 'Card Standard',
      class: 'bg-white rounded-2xl shadow-sm border border-gray-200 p-6',
      usage: 'Conteneurs de contenu'
    },
    {
      name: 'Header Principal',
      class: 'bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 h-24',
      usage: 'En-tête des pages publiques'
    },
    {
      name: 'Header Système',
      class: 'bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 h-16',
      usage: 'En-tête des pages système'
    }
  ];

  const breakpoints = [
    { name: 'Mobile', size: '< 640px', class: 'sm:hidden', usage: 'Téléphones' },
    { name: 'Tablet', size: '640px - 1024px', class: 'md:block', usage: 'Tablettes' },
    { name: 'Desktop', size: '> 1024px', class: 'lg:block', usage: 'Ordinateurs' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            E-TAWJIHI Design System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Charte graphique et composants de l'application E-TAWJIHI Global
          </p>
        </div>

        {/* Logo Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Component className="w-6 h-6 mr-3 text-blue-600" />
            Logo et Identité
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo Principal</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <img 
                  src="https://cdn.e-tawjihi.ma/logo-rectantgle-simple-nobg.png" 
                  alt="E-TAWJIHI Logo" 
                  className="h-20 w-auto mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Utilisé sur toutes les pages publiques et dans le header principal
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo Système</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Utilisé dans les pages d'authentification et système interne
              </p>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Palette className="w-6 h-6 mr-3 text-blue-600" />
            Palette de Couleurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorPalette.map((color, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className={`w-12 h-12 ${color.class} rounded-lg shadow-sm`}></div>
                <div>
                  <h3 className="font-semibold text-gray-900">{color.name}</h3>
                  <p className="text-sm text-gray-600">{color.hex}</p>
                  <p className="text-xs text-gray-500">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Type className="w-6 h-6 mr-3 text-blue-600" />
            Typographie
          </h2>
          <div className="space-y-4">
            {typography.map((type, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">{type.element}</h3>
                  <p className="text-sm text-gray-600">{type.usage}</p>
                </div>
                <div className="text-right">
                  <p className={`${type.class} text-gray-900`}>
                    {type.element === 'Body' ? 'Lorem ipsum dolor sit amet' : 
                     type.element === 'Small' ? 'Texte secondaire' : 
                     'Titre de niveau'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{type.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Components */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Component className="w-6 h-6 mr-3 text-blue-600" />
            Composants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {components.map((component, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{component.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{component.usage}</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <code className="text-sm text-gray-700 break-all">{component.class}</code>
                </div>
                <div className="flex justify-center">
                  {component.name.includes('Bouton') ? (
                    <button className={component.class}>
                      {component.name.includes('Principal') ? 'Bouton Principal' : 'Bouton Secondaire'}
                    </button>
                  ) : component.name.includes('Input') ? (
                    <input 
                      type="text" 
                      placeholder="Exemple d'input" 
                      className={component.class}
                      disabled
                    />
                  ) : component.name.includes('Card') ? (
                    <div className={component.class}>
                      <p className="text-gray-900">Exemple de carte</p>
                    </div>
                  ) : component.name.includes('Header') ? (
                    <div className={`${component.class} w-full`}>
                      <div className="flex items-center justify-between h-full px-4">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive Design */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Layout className="w-6 h-6 mr-3 text-blue-600" />
            Design Responsive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {breakpoints.map((breakpoint, index) => (
              <div key={index} className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {breakpoint.name === 'Mobile' ? (
                    <Smartphone className="w-8 h-8 text-blue-600" />
                  ) : breakpoint.name === 'Tablet' ? (
                    <Tablet className="w-8 h-8 text-blue-600" />
                  ) : (
                    <Monitor className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{breakpoint.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{breakpoint.size}</p>
                <p className="text-xs text-gray-500">{breakpoint.usage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 mr-3 text-blue-600" />
            Règles de Cohérence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Logo Cohérent</h3>
                  <p className="text-sm text-gray-600">Utiliser le même logo sur toutes les pages publiques</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Couleurs Uniformes</h3>
                  <p className="text-sm text-gray-600">Respecter la palette de couleurs définie</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Typographie</h3>
                  <p className="text-sm text-gray-600">Maintenir la hiérarchie typographique</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Espacement</h3>
                  <p className="text-sm text-gray-600">Utiliser des espacements cohérents</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Animations</h3>
                  <p className="text-sm text-gray-600">Appliquer les transitions standard</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Responsive</h3>
                  <p className="text-sm text-gray-600">Assurer la compatibilité mobile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystem;

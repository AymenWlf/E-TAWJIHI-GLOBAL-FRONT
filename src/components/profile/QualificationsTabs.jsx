import React, { useState } from 'react';
import { Plus, GraduationCap, Globe, Award, Calendar, Download } from 'lucide-react';
import QualificationModal from './QualificationModal';
import EnglishTestModal from './EnglishTestModal';
import StandardizedTestModal from './StandardizedTestModal';
import { useAllParameters } from '../../hooks/useAllParameters';
import profileService from '../../services/profileService';

const QualificationsTabs = ({ degrees = [], onAddDegree, onDeleteDegree, onRefreshQualifications, language, activeSubsection, onSubsectionChange, applications = [] }) => {
  const [activeTab, setActiveTab] = useState(activeSubsection || 'academic');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('academic');
  const [editingDegree, setEditingDegree] = useState(null);

  // Load parameters for translations
  const { parameters: allParams } = useAllParameters();

  // Helper functions to get translations
  const getFieldTranslation = (fieldCode) => {
    if (!allParams?.fields) return fieldCode;
    const field = allParams.fields.find(f => f.code === fieldCode);
    return field ? (language === 'en' ? field.labelEn : field.labelFr) : fieldCode;
  };

  const getAcademicDegreeTranslation = (degreeCode) => {
    if (!allParams?.degrees) return degreeCode;
    const degree = allParams.degrees.find(d => d.code === degreeCode);
    return degree ? (language === 'en' ? degree.labelEn : degree.labelFr) : degreeCode;
  };

  const getScoreTypeTranslation = (scoreTypeCode) => {
    if (!allParams?.gradeSystems) return scoreTypeCode;
    const scoreType = allParams.gradeSystems.find(gs => gs.code === scoreTypeCode);
    return scoreType ? (language === 'en' ? scoreType.labelEn : scoreType.labelFr) : scoreTypeCode;
  };

  const tabs = [
    {
      id: 'academic',
      label: language === 'en' ? 'Academic Degrees' : 'Diplômes Académiques',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      id: 'english',
      label: language === 'en' ? 'Language Tests' : 'Tests de Langue',
      icon: Globe,
      color: 'emerald'
    },
    {
      id: 'standardized',
      label: language === 'en' ? 'Standardized Tests' : 'Tests Standardisés',
      icon: Award,
      color: 'purple'
    }
  ];

  // Update active tab when prop changes
  React.useEffect(() => {
    if (activeSubsection) {
      setActiveTab(activeSubsection);
    }
  }, [activeSubsection]);

  const filteredDegrees = (degrees || []).filter(q => {
    if (activeTab === 'academic') return q.type === 'academic';
    if (activeTab === 'english') {
      // Filter for language tests (English and French) - check type and field
      return q.type === 'language' && (
        q.field?.toLowerCase().includes('english') || 
        q.field?.toLowerCase().includes('french') ||
        q.title?.toLowerCase().includes('ielts') ||
        q.title?.toLowerCase().includes('toefl') ||
        q.title?.toLowerCase().includes('pte') ||
        q.title?.toLowerCase().includes('duolingo') ||
        q.title?.toLowerCase().includes('oet') ||
        q.title?.toLowerCase().includes('cae') ||
        q.title?.toLowerCase().includes('cael') ||
        q.title?.toLowerCase().includes('languagecert') ||
        q.title?.toLowerCase().includes('goethe') ||
        q.title?.toLowerCase().includes('testdaf') ||
        q.title?.toLowerCase().includes('tcf') ||
        q.title?.toLowerCase().includes('delf') ||
        q.title?.toLowerCase().includes('dalf')
      );
    }
    if (activeTab === 'standardized') {
      // Filter for standardized tests using dynamic parameters
      const standardizedTestCodes = allParams?.standardizedTests?.map(test => test.code.toLowerCase()) || [];
      return q.type === 'professional' || 
        standardizedTestCodes.some(code => 
          q.title?.toLowerCase().includes(code) ||
          q.scoreType?.toLowerCase().includes(code)
        );
    }
    return false;
  });

  const handleAddDegree = (type) => {
    setModalType(type);
    setEditingDegree(null); // Reset editing degree
    setIsModalOpen(true);
  };

  const handleEditDegree = (degree) => {
    console.log('handleEditDegree called with:', degree);
    setModalType(activeTab);
    setEditingDegree(degree);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('handleCloseModal called');
    setIsModalOpen(false);
    setEditingDegree(null);
  };

  const handleAddDefaultQualifications = async () => {
    try {
      // Check if Baccalauréat already exists
      const hasBaccalaureat = degrees.some(degree => 
        degree.type === 'academic' && 
        (degree.academicQualification === 'high-school' || 
         degree.title?.toLowerCase().includes('baccalauréat') ||
         degree.title?.toLowerCase().includes('baccalaureat'))
      );
      
      // Check if TCF already exists
      const hasTCF = degrees.some(degree => 
        degree.type === 'language' && 
        (degree.title?.toLowerCase().includes('tcf') ||
         degree.scoreType?.toLowerCase().includes('tcf'))
      );
      
      // Only add missing qualifications
      if (!hasBaccalaureat || !hasTCF) {
        const updatedQualifications = await profileService.addSimpleCommonQualifications();
        // Call the refresh function passed as prop to update qualifications without page reload
        if (onRefreshQualifications) {
          onRefreshQualifications(updatedQualifications);
        }
        console.log('Simple qualifications added successfully');
      } else {
        console.log('All required qualifications already exist');
      }
    } catch (error) {
      console.error('Error adding simple qualifications:', error);
    }
  };

  const getTabColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200'
    };
    return colors[color] || colors.blue;
  };

  const getActiveTabColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-300',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      purple: 'bg-purple-50 text-purple-700 border-purple-300'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(tab.id);
                  if (onSubsectionChange) {
                    onSubsectionChange(tab.id);
                  }
                }}
                className={`flex items-center justify-center sm:justify-start space-x-2 py-3 sm:py-4 px-3 sm:px-1 border-b-2 font-medium text-sm transition-colors w-full sm:w-auto ${
                  isActive
                    ? `border-${tab.color}-500 text-${tab.color}-600`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {language === 'en' 
                ? 'Manage your degrees and test scores' 
                : 'Gérez vos diplômes et scores de tests'}
            </p>
          </div>
          <button
            onClick={() => handleAddDegree(activeTab)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
              activeTab === 'academic' 
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : activeTab === 'english'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === 'academic' 
                ? (language === 'en' ? 'Add Degree' : 'Ajouter un Diplôme')
                : activeTab === 'english'
                ? (language === 'en' ? 'Add Language Test' : 'Ajouter un Test de Langue')
                : (language === 'en' ? 'Add Standard Test' : 'Ajouter un Test Standard')
              }
            </span>
          </button>
        </div>

        {/* Add Default Qualifications Button - Conditional based on applications */}
        {(() => {
          // Check if user has any France or China applications
          const hasFranceApplication = applications.some(app => app.isFrance);
          const hasChinaApplication = applications.some(app => app.isChina);
          
          if (!hasFranceApplication && !hasChinaApplication) {
            return null; // Don't show button if no France/China applications
          }

          return (
            <div className="mt-4 flex flex-col items-center gap-3">
              {/* France Applications - Show Baccalauréat & TCF */}
              {hasFranceApplication && (() => {
                // Check if Baccalauréat already exists
                const hasBaccalaureat = degrees.some(degree => 
                  degree.type === 'academic' && 
                  (degree.academicQualification === 'high-school' || 
                   degree.title?.toLowerCase().includes('baccalauréat') ||
                   degree.title?.toLowerCase().includes('baccalaureat'))
                );
                
                // Check if TCF already exists
                const hasTCF = degrees.some(degree => 
                  degree.type === 'language' && 
                  (degree.title?.toLowerCase().includes('tcf') ||
                   degree.scoreType?.toLowerCase().includes('tcf'))
                );
                
                // Only show button if at least one qualification is missing
                if (hasBaccalaureat && hasTCF) {
                  return null;
                }
                
                return (
                  <button
                    onClick={handleAddDefaultQualifications}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {language === 'en' ? 'Add Baccalauréat & TCF' : 'Ajouter Baccalauréat & TCF'}
                    </span>
                  </button>
                );
              })()}
              
              {/* China Applications - Show Baccalauréat & CSCA */}
              {hasChinaApplication && (() => {
                // Check if Baccalauréat already exists
                const hasBaccalaureat = degrees.some(degree => 
                  degree.type === 'academic' && 
                  (degree.academicQualification === 'high-school' || 
                   degree.title?.toLowerCase().includes('baccalauréat') ||
                   degree.title?.toLowerCase().includes('baccalaureat'))
                );
                
                // Check if CSCA already exists
                const hasCSCA = degrees.some(degree => 
                  degree.type === 'professional' && 
                  (degree.title?.toLowerCase().includes('csca') ||
                   degree.scoreType?.toLowerCase().includes('csca'))
                );
                
                // Only show button if at least one qualification is missing
                if (hasBaccalaureat && hasCSCA) {
                  return null;
                }
                
                return (
                  <button
                    onClick={async () => {
                      try {
                        // Add Baccalauréat only if it doesn't exist
                        if (!hasBaccalaureat) {
                          const bacQualification = {
                            type: 'academic',
                            title: language === 'en' ? 'Baccalauréat' : 'Baccalauréat',
                            academicQualification: 'high-school'
                          };
                          await onAddDegree(bacQualification);
                        }
                        
                        // Add CSCA only if it doesn't exist
                        if (!hasCSCA) {
                          const cscaQualification = {
                            type: 'professional',
                            title: 'CSCA',
                            scoreType: 'CSCA',
                            field: allParams?.standardizedTests?.find(test => test.code === 'CSCA')?.code || 'CSCA'
                          };
                          await onAddDegree(cscaQualification);
                        }
                        
                        // Refresh qualifications to ensure UI is updated
                        if (onRefreshQualifications) {
                          const updatedQualifications = await profileService.getQualifications();
                          onRefreshQualifications(updatedQualifications);
                        }
                        console.log('China qualifications added successfully');
                      } catch (error) {
                        console.error('Error adding China qualifications:', error);
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {language === 'en' ? 'Add Baccalauréat & CSCA' : 'Ajouter Baccalauréat & CSCA'}
                    </span>
                  </button>
                );
              })()}
            </div>
          );
        })()}

        {/* Instructions Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">i</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                {language === 'en' ? 'Important Instructions' : 'Instructions Importantes'}
              </h4>
              <div className="text-sm text-blue-800">
                {activeTab === 'academic' && (
                  <p>
                    {language === 'en' 
                      ? 'Please add your baccalaureate information if available, and for higher education, add information for all diplomas obtained.'
                      : 'Veuillez ajouter vos informations du baccalauréat si disponible, et pour l\'enseignement supérieur, ajoutez les informations de tous les diplômes obtenus.'}
                  </p>
                )}
                {activeTab === 'english' && (
                  <p>
                    {language === 'en' 
                      ? 'Add all language tests you have taken (English or French). Include all test results and certificates you possess.'
                      : 'Ajoutez tous les tests de langue que vous avez passés (Anglais ou Français). Incluez tous les résultats de tests et certificats que vous possédez.'}
                  </p>
                )}
                {activeTab === 'standardized' && (
                  <p>
                    {language === 'en' 
                      ? 'If you have already taken SAT or other standardized tests, you can add the information here.'
                      : 'Si vous avez déjà passé le SAT ou d\'autres tests standardisés, vous pouvez ajouter les informations ici.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Degrees List */}
        <div className="space-y-4">
          {filteredDegrees.map((degree) => (
            <div key={degree.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${getTabColor(tabs.find(tab => tab.id === activeTab)?.color)}`}>
                      {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon, { className: "w-5 h-5" })}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">
                        {degree.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{degree.institution}</p>
                      
                      {/* Academic Degree Details */}
                      {activeTab === 'academic' && (
                        <div className="mt-2 space-y-1">
                          {degree.academicQualification && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">{language === 'en' ? 'Degree:' : 'Diplôme:'}</span> {getAcademicDegreeTranslation(degree.academicQualification)}
                            </p>
                          )}
                          {degree.exactQualificationName && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">{language === 'en' ? 'Exact Name:' : 'Nom Exact:'}</span> {degree.exactQualificationName}
                            </p>
                          )}
                          {degree.field && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">{language === 'en' ? 'Field of Study:' : 'Domaine d\'Études:'}</span> {getFieldTranslation(degree.field)}
                            </p>
                          )}
                          {/* Baccalaureate Stream - Only show if degree is Baccalauréat */}
                          {degree.baccalaureateStream && (() => {
                            const val = (degree.academicQualification || '').toLowerCase();
                            const isBac = val === 'high-school' || val === 'baccalaureat' || val === 'baccalauréat' || val === 'baccalaureate' || val === 'bac';
                            return isBac ? (
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">{language === 'en' ? 'Baccalaureate Stream:' : 'Filière du Baccalauréat:'}</span> {degree.baccalaureateStream}
                              </p>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      {language === 'en' ? 'Valid' : 'Valide'}
                    </span>
                  </div>
                  
                  {/* Score Details */}
                  {degree.score && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
                        <span className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-lg">
                          <Award className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">
                            {degree.score} {degree.scoreType && (
                              <span className="text-blue-600 font-medium">
                                ({getScoreTypeTranslation(degree.scoreType)})
                              </span>
                            )}
                          </span>
                        </span>
                        {degree.grade && (
                          <span className="flex items-center space-x-1 bg-emerald-100 text-emerald-700 px-2 sm:px-3 py-1 rounded-lg">
                            <GraduationCap className="w-4 h-4" />
                            <span className="text-xs sm:text-sm">{degree.grade}</span>
                          </span>
                        )}
                      </div>
                      
                      {/* Detailed Scores for Language Tests */}
                      {activeTab === 'english' && degree.detailedScores && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="text-sm font-semibold text-gray-700 mb-3">
                            {language === 'en' ? 'Detailed Scores' : 'Scores Détaillés'}
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {Object.entries(degree.detailedScores).map(([key, value]) => {
                              if (!value) return null;
                              const scoreLabels = {
                                overall: language === 'en' ? 'Overall' : 'Global',
                                listening: language === 'en' ? 'Listening' : 'Écoute',
                                reading: language === 'en' ? 'Reading' : 'Lecture',
                                writing: language === 'en' ? 'Writing' : 'Écriture',
                                speaking: language === 'en' ? 'Speaking' : 'Expression Orale',
                                production: language === 'en' ? 'Production' : 'Production',
                                comprehension: language === 'en' ? 'Comprehension' : 'Compréhension',
                                conversation: language === 'en' ? 'Conversation' : 'Conversation',
                                literacy: language === 'en' ? 'Literacy' : 'Littératie',
                                useOfEnglish: language === 'en' ? 'Use of English' : 'Usage de l\'Anglais'
                              };
                              return (
                                <div key={key} className="bg-white rounded-lg p-3 text-center border border-gray-200">
                                  <div className="text-xs text-gray-500 mb-1">
                                    {scoreLabels[key] || key}
                                  </div>
                                  <div className="text-lg font-bold text-gray-900">
                                    {value}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Date Information */}
                  {(degree.startDate || degree.endDate) && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {degree.startDate && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{language === 'en' ? 'Start Year:' : 'Année de Début:'}</span>
                            <span>{new Date(degree.startDate).getFullYear()}</span>
                          </div>
                        )}
                        {degree.endDate && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{language === 'en' ? 'End Year:' : 'Année de Fin:'}</span>
                            <span>{new Date(degree.endDate).getFullYear()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Description */}
                  {degree.description && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {degree.description}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-end lg:justify-start space-x-2 lg:ml-4">
                  <button
                    onClick={() => handleEditDegree(degree)}
                    className="p-2 sm:p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title={language === 'en' ? 'Edit degree' : 'Modifier le diplôme'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteDegree(degree.id)}
                    className="p-2 sm:p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title={language === 'en' ? 'Delete degree' : 'Supprimer le diplôme'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredDegrees.length === 0 && (
            <div className="text-center py-12">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                activeTab === 'academic' 
                  ? 'bg-blue-100'
                  : activeTab === 'english'
                  ? 'bg-emerald-100'
                  : 'bg-purple-100'
              }`}>
                {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon, { 
                  className: `w-8 h-8 ${
                    activeTab === 'academic' 
                      ? 'text-blue-600'
                      : activeTab === 'english'
                      ? 'text-emerald-600'
                      : 'text-purple-600'
                  }`
                })}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'No degrees yet' : 'Aucun diplôme pour le moment'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'en' 
                  ? 'Add your first degree to get started' 
                  : 'Ajoutez votre premier diplôme pour commencer'}
              </p>
              <button
                onClick={() => handleAddDegree(activeTab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                  activeTab === 'academic' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : activeTab === 'english'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {activeTab === 'academic' 
                  ? (language === 'en' ? 'Add Your First Degree' : 'Ajouter votre Premier Diplôme')
                  : activeTab === 'english'
                  ? (language === 'en' ? 'Add Your First Language Test' : 'Ajouter votre Premier Test de Langue')
                  : (language === 'en' ? 'Add Your First Standard Test' : 'Ajouter votre Premier Test Standard')
                }
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modalType === 'academic' && (
        <QualificationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingDegree ? onAddDegree : onAddDegree}
          language={language}
          qualification={editingDegree}
        />
      )}
      
      {modalType === 'english' && (
        <EnglishTestModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={onAddDegree}
          language={language}
          qualification={editingDegree}
        />
      )}
      
      {modalType === 'standardized' && (
        <StandardizedTestModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={onAddDegree}
          language={language}
          qualification={editingDegree}
        />
      )}
    </div>
  );
};

export default QualificationsTabs;

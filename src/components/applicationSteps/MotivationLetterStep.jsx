import React, { useState, useEffect } from 'react';
import { FileText, Save, Eye, AlertCircle, CheckCircle, Clock, Lightbulb } from 'lucide-react';

const MotivationLetterStep = ({ data, onSave, language }) => {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    loadExistingData();
  }, []);

  useEffect(() => {
    // Auto-save every 30 seconds
    if (autoSave && content.trim()) {
      const interval = setInterval(() => {
        handleSave();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [content, autoSave]);

  const loadExistingData = () => {
    if (data) {
      setContent(data.content || '');
      setLastSaved(data.lastSaved || null);
    }
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    setWordCount(newContent.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const stepData = {
        content,
        wordCount,
        lastSaved: new Date().toISOString()
      };
      await onSave(stepData);
      setLastSaved(new Date().toISOString());
    } catch (error) {
      console.error('Failed to save motivation letter:', error);
    } finally {
      setSaving(false);
    }
  };

  const getWordCountStatus = () => {
    if (wordCount < 100) return { color: 'text-red-600', message: language === 'fr' ? 'Trop court' : 'Too short' };
    if (wordCount < 200) return { color: 'text-yellow-600', message: language === 'fr' ? 'Acceptable' : 'Acceptable' };
    if (wordCount < 500) return { color: 'text-green-600', message: language === 'fr' ? 'Bon' : 'Good' };
    return { color: 'text-green-600', message: language === 'fr' ? 'Excellent' : 'Excellent' };
  };

  const wordCountStatus = getWordCountStatus();

  const getTips = () => {
    return language === 'fr' ? [
      'Expliquez pourquoi vous êtes intéressé par ce programme spécifique',
      'Décrivez vos objectifs académiques et professionnels',
      'Mentionnez vos expériences pertinentes et compétences',
      'Expliquez comment ce programme vous aidera à atteindre vos objectifs',
      'Soyez authentique et personnel dans votre approche'
    ] : [
      'Explain why you are interested in this specific program',
      'Describe your academic and professional goals',
      'Mention your relevant experiences and skills',
      'Explain how this program will help you achieve your goals',
      'Be authentic and personal in your approach'
    ];
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FileText className="w-10 h-10 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {language === 'fr' ? 'Lettre de Motivation' : 'Motivation Letter'}
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'fr' 
            ? 'Rédigez une lettre de motivation convaincante qui reflète votre passion et vos objectifs. Cette lettre est cruciale pour votre candidature.' 
            : 'Write a compelling motivation letter that reflects your passion and goals. This letter is crucial for your application.'
          }
        </p>
      </div>

      {/* Writing Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-blue-600" />
          </div>
          {language === 'fr' ? 'Conseils pour votre Lettre' : 'Writing Tips'}
        </h4>
        <ul className="text-sm text-blue-700 space-y-2">
          {getTips().map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">
            {language === 'fr' ? 'Votre Lettre de Motivation' : 'Your Motivation Letter'}
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {language === 'fr' ? 'Mots:' : 'Words:'}
              </span>
              <span className={`font-medium ${wordCountStatus.color}`}>
                {wordCount}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${wordCountStatus.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                {wordCountStatus.message}
              </span>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
                autoSave 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Clock className="w-3 h-3" />
              {language === 'fr' ? 'Auto-sauvegarde' : 'Auto-save'}
            </button>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={language === 'fr' 
              ? 'Commencez à rédiger votre lettre de motivation ici...\n\nChère/Dear [Nom du Programme/Program Name],\n\nJe vous écris pour exprimer mon intérêt...'
              : 'Start writing your motivation letter here...\n\nDear [Program Name],\n\nI am writing to express my interest...'
            }
            className="w-full h-96 p-6 border-0 resize-none focus:ring-0 focus:outline-none text-gray-700 leading-relaxed"
            style={{ fontFamily: 'inherit' }}
          />
        </div>

        {/* Word Count Requirements */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {language === 'fr' ? 'Minimum recommandé: 200 mots' : 'Recommended minimum: 200 words'}
            </span>
            {wordCount < 200 && (
              <span className="text-yellow-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {language === 'fr' ? 'Considérez ajouter plus de détails' : 'Consider adding more details'}
              </span>
            )}
          </div>
          {lastSaved && (
            <span className="text-gray-500 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {language === 'fr' ? 'Sauvegardé' : 'Saved'} {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {content.trim() && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {language === 'fr' ? 'Aperçu' : 'Preview'}
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="prose max-w-none">
              {content.split('\n').map((line, index) => (
                <p key={index} className="mb-2">
                  {line || '\u00A0'} {/* Non-breaking space for empty lines */}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {language === 'fr' ? 'Sauvegarde...' : 'Saving...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {language === 'fr' ? 'Sauvegarder' : 'Save'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MotivationLetterStep;

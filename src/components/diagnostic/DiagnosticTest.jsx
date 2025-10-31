import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Circle, ChevronRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import diagnosticService from '../../services/diagnosticService';
/**
 * Formate le texte avec support des astérisques WhatsApp (*texte* = gras)
 */
function formatWhatsAppText(text) {
  if (!text) return '';
  
  const regex = /\*([^*]+)\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.substring(lastIndex, match.index)}</span>);
    }
    parts.push(<strong key={key++}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.substring(lastIndex)}</span>);
  }
  
  return parts.length > 0 ? parts : text;
}

function InputRenderer({ question, value, onChange, onAnswer }) {
  const handleChange = (newValue) => {
    onChange(newValue);
    onAnswer?.(newValue);
  };

  if (question.type === 'select') {
    return (
      <div className="space-y-2">
        {question.options.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
              value === opt.value
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => handleChange(opt.value)}
          >
            <div className="flex items-center gap-3">
              {value === opt.value ? (
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
              <span>{opt.label}</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (question.type === 'multiselect') {
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {question.options.map(opt => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => {
                const newValues = isSelected
                  ? selectedValues.filter(v => v !== opt.value)
                  : [...selectedValues, opt.value];
                handleChange(newValues);
              }}
            >
              <div className="flex items-center gap-3">
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span>{opt.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === 'scale') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Pas du tout</span>
          <span>Complètement</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <button
              key={num}
              type="button"
              className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
                value === num
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
              onClick={() => handleChange(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'number') {
    return (
      <input
        type="number"
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        value={value || ''}
        onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
        placeholder="Entrez un nombre"
      />
    );
  }

  // text par défaut
  return (
    <textarea
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 resize-none"
      rows={4}
      value={value || ''}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Votre réponse..."
    />
  );
}

export default function DiagnosticTest({ language = 'fr', onComplete }) {
  const [questions, setQuestions] = useState({});
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  // Flatten questions par ordre
  const flattenedQuestions = useMemo(() => {
    const flat = [];
    const categories = Object.keys(questions).sort();
    
    categories.forEach(category => {
      questions[category]?.forEach(q => {
        flat.push({ ...q, category });
      });
    });
    
    return flat;
  }, [questions]);

  const currentQuestion = flattenedQuestions[currentQuestionIndex];
  const totalQuestions = flattenedQuestions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Charger les questions et la session
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [questionsRes, sessionRes] = await Promise.all([
          diagnosticService.getQuestions(),
          diagnosticService.getSession(),
        ]);

        if (questionsRes.success) {
          setQuestions(questionsRes.data.data);
        }

        if (sessionRes.success) {
          setSession(sessionRes.data.data);
          setAnswers(sessionRes.data.data.answers || {});
          setCurrentQuestionIndex(sessionRes.data.data.currentQuestionIndex || 0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAnswer = async (value) => {
    if (!currentQuestion || saving) return;

    setSaving(true);
    try {
      const newAnswers = { ...answers, [currentQuestion.id]: value };
      setAnswers(newAnswers);

      await diagnosticService.saveAnswer(currentQuestion.id, value);

      // Passer à la question suivante
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Toutes les questions sont complétées, générer le diagnostic
        await generateDiagnostic();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const generateDiagnostic = async () => {
    setGenerating(true);
    try {
      const response = await diagnosticService.generateDiagnostic();
      if (response.success) {
        setDiagnosticResult(response.data);
        onComplete?.(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (diagnosticResult) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Diagnostic Complet</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {formatWhatsAppText(diagnosticResult.diagnostic)}
            </div>
          </div>
          
          {diagnosticResult.scores && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4">📊 Scores par Catégorie</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(diagnosticResult.scores).map(([category, score]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1 capitalize">{category}</div>
                    <div className="text-2xl font-bold text-blue-600">{score.toFixed(0)}/100</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Génération de votre diagnostic personnalisé...</p>
          <p className="text-sm text-gray-500 mt-2">Cela peut prendre quelques instants</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Aucune question disponible</p>
      </div>
    );
  }

  const categoryQuestions = questions[currentQuestion.category] || [];
  const categoryQuestionIndex = categoryQuestions.findIndex(q => q.id === currentQuestion.id);
  const categoryProgress = categoryQuestions.length > 0 
    ? ((categoryQuestionIndex + 1) / categoryQuestions.length) * 100 
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Category Header */}
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-1 uppercase tracking-wide">
          {currentQuestion.category}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${categoryProgress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {currentQuestion.questionText}
        </h2>

        {currentQuestion.description && (
          <p className="text-gray-600 mb-6">{currentQuestion.description}</p>
        )}

        <InputRenderer
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0 || saving}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Précédent
        </button>

        <div className="text-sm text-gray-500">
          {currentQuestionIndex + 1} / {totalQuestions}
        </div>

        <button
          onClick={goToNext}
          disabled={currentQuestionIndex >= totalQuestions - 1 || saving}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Suivant
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}


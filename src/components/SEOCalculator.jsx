import React from 'react';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Target, Search } from 'lucide-react';

const SEOCalculator = ({ establishment }) => {
  const calculateSEOScore = () => {
    let score = 0;
    let maxScore = 0;
    const issues = [];
    const recommendations = [];

    // Title SEO (20 points)
    maxScore += 20;
    if (establishment.seoTitle && establishment.seoTitle.length > 0) {
      if (establishment.seoTitle.length >= 30 && establishment.seoTitle.length <= 60) {
        score += 20;
      } else if (establishment.seoTitle.length > 0) {
        score += 10;
        issues.push('Le titre SEO devrait faire entre 30 et 60 caractères');
      }
    } else {
      issues.push('Titre SEO manquant');
      recommendations.push('Ajoutez un titre SEO optimisé');
    }

    // Description SEO (20 points)
    maxScore += 20;
    if (establishment.seoDescription && establishment.seoDescription.length > 0) {
      if (establishment.seoDescription.length >= 120 && establishment.seoDescription.length <= 160) {
        score += 20;
      } else if (establishment.seoDescription.length > 0) {
        score += 10;
        issues.push('La description SEO devrait faire entre 120 et 160 caractères');
      }
    } else {
      issues.push('Description SEO manquante');
      recommendations.push('Ajoutez une description SEO optimisée');
    }

    // Keywords (15 points)
    maxScore += 15;
    if (establishment.seoKeywords && Array.isArray(establishment.seoKeywords) && establishment.seoKeywords.length > 0) {
      const keywordCount = establishment.seoKeywords.length;
      if (keywordCount >= 3 && keywordCount <= 10) {
        score += 15;
      } else if (keywordCount > 0) {
        score += 8;
        issues.push('Recommandé: 3-10 mots-clés sélectionnés');
      }
    } else {
      issues.push('Mots-clés SEO manquants');
      recommendations.push('Ajoutez des mots-clés pertinents');
    }


    // Basic Information (15 points)
    maxScore += 15;
    if (establishment.name && establishment.name.length > 0) {
      score += 5;
    } else {
      issues.push('Nom de l\'établissement manquant');
    }
    if (establishment.description && establishment.description.length > 100) {
      score += 5;
    } else {
      issues.push('Description de base trop courte (minimum 100 caractères)');
    }
    if (establishment.country && establishment.country.length > 0) {
      score += 5;
    } else {
      issues.push('Pays manquant');
    }

    // Content Quality (10 points)
    maxScore += 10;
    if (establishment.description && establishment.description.length > 200) {
      score += 5;
    } else {
      issues.push('Description trop courte pour un bon SEO');
    }
    if (establishment.programs && establishment.programs > 0) {
      score += 5;
    } else {
      issues.push('Aucun programme associé');
    }

    // Media Content (10 points)
    maxScore += 10;
    let mediaScore = 0;
    if (establishment.logo && establishment.logo.length > 0) {
      mediaScore += 2;
    }
    if (establishment.campusPhotos && establishment.campusPhotos.length > 0) {
      mediaScore += 3;
    }
    if (establishment.youtubeVideos && establishment.youtubeVideos.length > 0) {
      mediaScore += 3;
    }
    if (establishment.brochures && establishment.brochures.length > 0) {
      mediaScore += 2;
    }
    score += mediaScore;

    if (mediaScore < 5) {
      issues.push('Contenu multimédia insuffisant');
      recommendations.push('Ajoutez des photos, vidéos ou brochures');
    }

    const percentage = Math.round((score / maxScore) * 100);
    
    return {
      score,
      maxScore,
      percentage,
      issues,
      recommendations
    };
  };

  const seoData = calculateSEOScore();

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreIcon = (percentage) => {
    if (percentage >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (percentage >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Search className="w-5 h-5 mr-2 text-blue-600" />
          Analyse SEO
        </h3>
        <div className={`flex items-center px-3 py-1 rounded-full ${getScoreBgColor(seoData.percentage)}`}>
          {getScoreIcon(seoData.percentage)}
          <span className={`ml-2 font-semibold ${getScoreColor(seoData.percentage)}`}>
            {seoData.percentage}%
          </span>
        </div>
      </div>

      {/* Score Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Score SEO</span>
          <span>{seoData.score}/{seoData.maxScore} points</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              seoData.percentage >= 80 ? 'bg-green-500' :
              seoData.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${seoData.percentage}%` }}
          />
        </div>
      </div>

      {/* Issues */}
      {seoData.issues.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <XCircle className="w-4 h-4 mr-2 text-red-500" />
            Problèmes détectés ({seoData.issues.length})
          </h4>
          <div className="space-y-2">
            {seoData.issues.map((issue, index) => (
              <div key={index} className="flex items-start text-sm text-red-700">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {seoData.recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
            Recommandations ({seoData.recommendations.length})
          </h4>
          <div className="space-y-2">
            {seoData.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start text-sm text-blue-700">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Tips */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Conseils SEO
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Utilisez des mots-clés pertinents dans le titre et la description</li>
          <li>• Ajoutez des images avec des textes alternatifs descriptifs</li>
          <li>• Créez du contenu riche et informatif</li>
          <li>• Optimisez la longueur des titres (30-60 caractères)</li>
          <li>• Rédigez des descriptions attractives (120-160 caractères)</li>
        </ul>
      </div>
    </div>
  );
};

export default SEOCalculator;

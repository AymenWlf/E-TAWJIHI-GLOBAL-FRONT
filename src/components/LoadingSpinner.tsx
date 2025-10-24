import React from 'react';
import { Globe, BookOpen } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showLogo?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Chargement...', 
  showLogo = true 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {showLogo && (
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">E-TAWJIHI Global</span>
        </div>
      )}
      
      <div className="relative">
        {/* Spinner principal */}
        <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        
        {/* Spinner secondaire pour effet de profondeur */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-purple-400 rounded-full animate-spin`} 
             style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      
      {/* Icône au centre */}
      <div className="absolute flex items-center justify-center">
        <BookOpen className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'} text-blue-600 animate-pulse`} />
      </div>
      
      {/* Texte de chargement */}
      <div className="text-center">
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </p>
        <div className="flex items-center justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

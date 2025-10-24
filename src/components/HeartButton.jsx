import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useShortlist } from '../hooks/useShortlist';
import { useToastContext } from '../contexts/ToastContext';

const HeartButton = ({ 
  type, // 'program' or 'establishment'
  id, 
  isShortlisted: propIsShortlisted, // Boolean from API response
  className = '', 
  size = 'w-4 h-4',
  showText = false,
  language = 'en'
}) => {
  const { 
    isProgramShortlisted, 
    isEstablishmentShortlisted, 
    toggleProgram, 
    toggleEstablishment, 
    loading 
  } = useShortlist();
  
  const { showError, showSuccess } = useToastContext();

  // Local state for optimistic updates
  const [localIsShortlisted, setLocalIsShortlisted] = useState(propIsShortlisted);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLocalIsShortlisted(propIsShortlisted);
  }, [propIsShortlisted]);

  // Use local state if available, otherwise fallback to hook
  const isShortlisted = localIsShortlisted !== undefined 
    ? localIsShortlisted 
    : (type === 'program' 
        ? isProgramShortlisted(id) 
        : isEstablishmentShortlisted(id));

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple clicks while processing
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    // Optimistic update - immediately update the UI
    const newShortlistedState = !isShortlisted;
    setLocalIsShortlisted(newShortlistedState);
    
    try {
      if (type === 'program') {
        await toggleProgram(id);
      } else {
        await toggleEstablishment(id);
      }
      
      // Show success message
      const successMessage = newShortlistedState 
        ? (language === 'fr' ? 'Ajouté aux favoris !' : 'Added to favorites!')
        : (language === 'fr' ? 'Retiré des favoris !' : 'Removed from favorites!');
      showSuccess(successMessage);
      
    } catch (error) {
      console.error('Error toggling shortlist:', error);
      
      // Revert optimistic update on error
      setLocalIsShortlisted(!newShortlistedState);
      
      // Show user-friendly error message in toast
      let errorMessage;
      if (error.message.includes('Authentication failed') || error.message.includes('No authentication token')) {
        errorMessage = language === 'fr' 
          ? 'Vous devez être connecté pour ajouter des favoris. Veuillez vous connecter.' 
          : 'You must be logged in to add favorites. Please log in.';
      } else {
        errorMessage = language === 'fr' 
          ? 'Erreur lors de l\'ajout aux favoris. Veuillez réessayer.' 
          : 'Error adding to favorites. Please try again.';
      }
      
      // Show error toast
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const buttonClasses = `
    ${className}
    ${(loading || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    transition-all duration-200
    ${isShortlisted 
      ? 'text-red-500 hover:text-red-600' 
      : 'text-gray-400 hover:text-red-500'
    }
  `;

  return (
    <button
      onClick={handleToggle}
      disabled={loading || isProcessing}
      className={buttonClasses}
      title={isShortlisted 
        ? (language === 'fr' ? 'Retirer des favoris' : 'Remove from favorites')
        : (language === 'fr' ? 'Ajouter aux favoris' : 'Add to favorites')
      }
    >
      <Heart 
        className={`${size} ${isShortlisted ? 'fill-current' : ''}`}
      />
      {showText && (
        <span className="ml-1 text-sm">
          {isShortlisted 
            ? (language === 'fr' ? 'Favori' : 'Favorited')
            : (language === 'fr' ? 'Favoris' : 'Favorite')
          }
        </span>
      )}
    </button>
  );
};

export default HeartButton;

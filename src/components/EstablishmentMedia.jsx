import React, { useState } from 'react';
import { Play, Download, MapPin, Image, FileText, Youtube, ExternalLink, Share2, MessageCircle, Copy, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const EstablishmentMedia = ({ establishment, program, language = 'en' }) => {
  // Use program data if available, otherwise fall back to establishment
  const data = program || establishment;
  
  // Gallery state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gallery functions
  const openGallery = (index) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % data.campusPhotos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + data.campusPhotos.length) % data.campusPhotos.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  };

  const renderPhotos = () => {
    if (!data.campusPhotos || data.campusPhotos.length === 0) {
      return (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === 'fr' ? 'Aucune photo disponible' : 'No photos available'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.campusPhotos.map((photo, index) => (
          <div 
            key={photo.id || index} 
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openGallery(index)}
          >
            <div className="aspect-w-16 aspect-h-12 bg-gray-100">
              <img
                src={photo.url}
                alt={photo.alt || data.seoImageAlt || `${data.name} photo ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                <div className="text-center">
                  <div className="text-gray-400 mb-1">📷</div>
                  <div>Image non trouvée</div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100">
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderShareButtons = () => {
    const currentUrl = window.location.href;
    const shareText = `${data.name} - ${data.country}`;
    
    const shareToFacebook = () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    };

    const shareToTwitter = () => {
      const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank', 'width=600,height=400');
    };

    const shareToLinkedIn = () => {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    };

    const shareToWhatsApp = () => {
      const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} - ${currentUrl}`)}`;
      window.open(url, '_blank');
    };

    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(currentUrl);
        // You could add a toast notification here
        alert(language === 'fr' ? 'Lien copié dans le presse-papiers!' : 'Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Share2 className="w-6 h-6 text-blue-600" />
          {language === 'fr' ? 'Partager' : 'Share'}
        </h3>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={shareToFacebook}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>

          <button
            onClick={shareToTwitter}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </button>

          <button
            onClick={shareToLinkedIn}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>

          <button
            onClick={shareToWhatsApp}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </button>

          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Copy className="w-5 h-5" />
            {language === 'fr' ? 'Copier le lien' : 'Copy Link'}
          </button>
        </div>
      </div>
    );
  };

  const downloadBrochure = async (brochure) => {
    if (!brochure.file || !brochure.file.url) return;
    
    try {
      const url = brochure.file.url;
      const filename = brochure.file.name || brochure.name || 'brochure';
      
      // Handle blob URLs differently
      if (url.startsWith('blob:')) {
        // For blob URLs, try to create a direct download link
        try {
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        } catch (error) {
          console.error('Blob URL is no longer valid:', error);
          alert('Le fichier n\'est plus disponible. Veuillez re-uploader la brochure depuis l\'interface d\'administration.');
          return;
        }
      }
      
      // For regular URLs, fetch and download
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading brochure:', error);
      // Fallback to opening in new tab
      window.open(brochure.file.url, '_blank');
    }
  };

  const renderLocations = () => {
    if (!data.campusLocations || data.campusLocations.length === 0) {
      return (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === 'fr' ? 'Aucune localisation disponible' : 'No locations available'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.campusLocations.map((location, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{location.name}</h4>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
              </div>
              
              {location.googleMapsEmbed && (
                <div className="mt-4">
                  <div 
                    className="w-full h-64 rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: location.googleMapsEmbed }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderVideos = () => {
    if (!data.youtubeVideos || data.youtubeVideos.length === 0) {
      return (
        <div className="text-center py-12">
          <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === 'fr' ? 'Aucune vidéo disponible' : 'No videos available'}
          </p>
        </div>
      );
    }

    // Function to extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    // Function to generate YouTube embed URL
    const getYouTubeEmbedUrl = (url) => {
      const videoId = getYouTubeVideoId(url);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.youtubeVideos.map((video, index) => {
          const embedUrl = getYouTubeEmbedUrl(video.url);
          
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Video Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{video.title}</h4>
                    {video.description && (
                      <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Embed */}
              {embedUrl ? (
                <div className="px-6 pb-6">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={embedUrl}
                      title={video.title}
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <div className="px-6 pb-6">
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <Youtube className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-4">
                      {language === 'fr' ? 'URL YouTube invalide' : 'Invalid YouTube URL'}
                    </p>
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {language === 'fr' ? 'Ouvrir le lien' : 'Open Link'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderBrochures = () => {
    if (!data.brochures || data.brochures.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === 'fr' ? 'Aucune brochure disponible' : 'No brochures available'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.brochures.map((brochure, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                    {language === 'fr' ? brochure.nameFr || brochure.name : brochure.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      PDF
                    </span>
                    {brochure.file && brochure.file.size && (
                      <span className="text-xs text-gray-500">
                        {(brochure.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'fr' 
                    ? 'Téléchargez cette brochure pour obtenir des informations détaillées sur nos programmes et services.'
                    : 'Download this brochure to get detailed information about our programs and services.'
                  }
                </p>
                
                {/* File Info */}
                {brochure.file && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'fr' ? 'Fichier' : 'File'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {brochure.file.name || 'brochure.pdf'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => downloadBrochure(brochure)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  {language === 'fr' ? 'Télécharger' : 'Download'}
                </button>
                {brochure.file && (
                  <button
                    onClick={() => window.open(brochure.file.url, '_blank')}
                    className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                    title={language === 'fr' ? 'Ouvrir dans un nouvel onglet' : 'Open in new tab'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };


  // Gallery modal component
  const renderGalleryModal = () => {
    if (!galleryOpen || !data.campusPhotos || data.campusPhotos.length === 0) return null;

    const currentPhoto = data.campusPhotos[currentImageIndex];

    return (
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
        onClick={closeGallery}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Close button */}
        <button
          onClick={closeGallery}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation buttons */}
        {data.campusPhotos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Main image */}
        <div className="relative max-w-7xl max-h-[90vh] w-full mx-4">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.alt || data.seoImageAlt || `${data.name} photo ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain mx-auto"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
          {currentImageIndex + 1} / {data.campusPhotos.length}
        </div>

        {/* Thumbnail strip */}
        {data.campusPhotos.length > 1 && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
            {data.campusPhotos.map((photo, index) => (
              <button
                key={photo.id || index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex 
                    ? 'border-white' 
                    : 'border-transparent hover:border-gray-400'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.alt || `${data.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Check if there's any media content
  const hasMedia = 
    (data.campusPhotos && data.campusPhotos.length > 0) ||
    (data.campusLocations && data.campusLocations.length > 0) ||
    (data.youtubeVideos && data.youtubeVideos.length > 0) ||
    (data.brochures && data.brochures.length > 0);

  if (!hasMedia) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Photos Section */}
      {data.campusPhotos && data.campusPhotos.length > 0 && (
        <div id="photos" className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Image className="w-6 h-6 text-blue-600" />
            {language === 'fr' ? 'Photos' : 'Photos'}
          </h3>
          {renderPhotos()}
        </div>
      )}

      {/* Locations Section */}
      {data.campusLocations && data.campusLocations.length > 0 && (
        <div id="locations" className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-red-600" />
            {language === 'fr' ? 'Localisations' : 'Locations'}
          </h3>
          {renderLocations()}
        </div>
      )}

      {/* Videos Section */}
      {data.youtubeVideos && data.youtubeVideos.length > 0 && (
        <div id="videos" className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-600" />
            {language === 'fr' ? 'Vidéos' : 'Videos'}
          </h3>
          {renderVideos()}
        </div>
      )}

      {/* Brochures Section */}
      {data.brochures && data.brochures.length > 0 && (
        <div id="brochures" className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            {language === 'fr' ? 'Brochures' : 'Brochures'}
          </h3>
          {renderBrochures()}
        </div>
      )}

      {/* Share Buttons Section */}
      <div id="share-section">
        {renderShareButtons()}
      </div>

      {/* Gallery Modal */}
      {renderGalleryModal()}
    </div>
  );
};

export default EstablishmentMedia;

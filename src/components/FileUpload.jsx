import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, Eye, Download } from 'lucide-react';
import adminService from '../services/adminService';

const FileUpload = ({ 
  files = [], 
  onChange, 
  accept = "*/*", 
  multiple = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  label = "Télécharger des fichiers",
  description = "Glissez-déposez vos fichiers ici ou cliquez pour sélectionner",
  uploadType = "campus-photo" // "campus-photo" or "brochure"
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (selectedFiles) => {
    setUploading(true);
    
    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        // Check file size
        if (file.size > maxSize) {
          throw new Error(`Le fichier ${file.name} dépasse la taille maximale de ${maxSize / (1024 * 1024)}MB`);
        }

        // Upload file to server
        let uploadResponse;
        if (uploadType === "campus-photo") {
          uploadResponse = await adminService.uploadCampusPhoto(file);
        } else if (uploadType === "brochure") {
          uploadResponse = await adminService.uploadBrochure(file);
        } else {
          throw new Error('Type d\'upload non supporté');
        }

        if (!uploadResponse.success) {
          throw new Error(uploadResponse.message || 'Erreur lors de l\'upload');
        }

        const rawUrl = (uploadResponse && uploadResponse.data && uploadResponse.data.url) ? uploadResponse.data.url : '';
        const normalizedUrl = rawUrl
          ? (rawUrl.startsWith('http') ? rawUrl : `${window.location.origin}${rawUrl}`)
          : '';

        return {
          id: Date.now() + Math.random(),
          name: uploadResponse?.data?.originalName || file.name,
          size: uploadResponse?.data?.fileSize ?? file.size ?? 0,
          type: uploadResponse?.data?.mimeType || file.type || '',
          url: normalizedUrl,
          fileName: uploadResponse?.data?.fileName || file.name,
          uploaded: true
        };
      });

      const newFiles = await Promise.all(uploadPromises);
      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      
      // Limit number of files
      if (updatedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} fichiers autorisés`);
        return;
      }

      onChange(updatedFiles);
    } catch (error) {
      alert(`Erreur lors de l'upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    onChange(updatedFiles);
  };

  const getFileIcon = (type) => {
    if (typeof type === 'string' && type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (typeof type === 'string' && (type.includes('pdf') || type.includes('document'))) {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else {
      return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    if (bytes == null || isNaN(bytes)) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-xs text-gray-500 mb-4">{description}</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Upload en cours...' : 'Sélectionner des fichiers'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Fichiers sélectionnés ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name || 'Sans nom'}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {typeof file.type === 'string' && file.type.startsWith('image/') && (
                    <button
                      onClick={() => { if (file.url) window.open(file.url, '_blank'); }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Aperçu"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Supprimer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

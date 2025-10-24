import React, { useState } from 'react';
import { Eye, Code, Save, Undo, Redo, Bold, Italic, List, Link, Image, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const HTMLEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Saisissez votre contenu...',
  height = '300px',
  showPreview = true 
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [history, setHistory] = useState([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleContentChange = (newValue) => {
    onChange(newValue);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const insertTag = (tag, placeholder = '') => {
    const textarea = document.getElementById('html-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText;
    if (tag === 'img') {
      newText = `<img src="${placeholder}" alt="Image" class="w-full h-auto rounded-lg" />`;
    } else if (tag === 'a') {
      newText = `<a href="${placeholder}" class="text-blue-600 hover:underline">${selectedText || 'Lien'}</a>`;
    } else {
      newText = `<${tag}>${selectedText || placeholder}</${tag}>`;
    }
    
    const newValue = value.substring(0, start) + newText + value.substring(end);
    handleContentChange(newValue);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  const formatText = (format) => {
    const textarea = document.getElementById('html-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText;
    switch (format) {
      case 'bold':
        newText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        newText = `<em>${selectedText}</em>`;
        break;
      case 'ul':
        newText = `<ul><li>${selectedText}</li></ul>`;
        break;
      case 'ol':
        newText = `<ol><li>${selectedText}</li></ol>`;
        break;
      default:
        newText = selectedText;
    }
    
    const newValue = value.substring(0, start) + newText + value.substring(end);
    handleContentChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
              title="Annuler"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
              title="Refaire"
            >
              <Redo className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <button
              onClick={() => formatText('bold')}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded"
              title="Gras"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded"
              title="Italique"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('ul')}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded"
              title="Liste à puces"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertTag('a', 'https://example.com')}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded"
              title="Lien"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertTag('img', 'https://example.com/image.jpg')}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded"
              title="Image"
            >
              <Image className="w-4 h-4" />
            </button>
          </div>
          
          {showPreview && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 text-sm rounded ${
                  activeTab === 'edit' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Code className="w-4 h-4 mr-1 inline" />
                Éditer
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-sm rounded ${
                  activeTab === 'preview' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4 mr-1 inline" />
                Aperçu
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {activeTab === 'edit' ? (
          <textarea
            id="html-editor"
            value={value}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 border-0 resize-none focus:ring-0 focus:outline-none font-mono text-sm"
            style={{ height }}
          />
        ) : (
          <div 
            className="p-4 prose prose-sm max-w-none"
            style={{ height, overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-500 italic">Aucun contenu à prévisualiser</p>' }}
          />
        )}
      </div>

      {/* Quick Help */}
      <div className="bg-gray-50 border-t border-gray-300 p-3 text-xs text-gray-600">
        <div className="flex flex-wrap gap-4">
          <span><strong>Gras:</strong> &lt;strong&gt;texte&lt;/strong&gt;</span>
          <span><strong>Italique:</strong> &lt;em&gt;texte&lt;/em&gt;</span>
          <span><strong>Titre:</strong> &lt;h1&gt;titre&lt;/h1&gt;</span>
          <span><strong>Liste:</strong> &lt;ul&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ul&gt;</span>
          <span><strong>Lien:</strong> &lt;a href="url"&gt;texte&lt;/a&gt;</span>
          <span><strong>Image:</strong> &lt;img src="url" alt="alt" /&gt;</span>
        </div>
      </div>
    </div>
  );
};

export default HTMLEditor;

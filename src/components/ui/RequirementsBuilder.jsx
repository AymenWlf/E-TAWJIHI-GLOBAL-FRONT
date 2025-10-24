import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { useAllParameters } from '../../hooks/useAllParameters';

const RequirementsBuilder = ({ items = [], onChange, standardizedTestOptions = [], englishTestOptions = [], gradeSystemOptions = [] }) => {
  const { parameters: allParams } = useAllParameters();
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItem, setNewItem] = useState({
    name: { en: '', fr: '' },
    description: { en: '', fr: '' },
    required: true,
    type: 'document',
    standardizedTestType: '',
    englishTestType: '',
    testValue: '',
    testScore: '',
    // GPA fields
    gradeSystem: '',
    minimumScore: ''
  });

  const requirementTypes = [
    { value: 'document', label: 'Document', icon: '📄' },
    { value: 'test', label: 'Test', icon: '📝' },
    { value: 'grade', label: 'Grade/GPA', icon: '📊' },
    { value: 'experience', label: 'Experience', icon: '💼' },
    { value: 'language', label: 'Language', icon: '🌐' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  const handleAddItem = () => {
    if (newItem.name.en.trim() && newItem.name.fr.trim()) {
      const updatedItems = [...items, { ...newItem }];
      onChange(updatedItems);
      setNewItem({
        name: { en: '', fr: '' },
        description: { en: '', fr: '' },
        required: true,
        type: 'document',
        standardizedTestType: '',
        englishTestType: '',
        testValue: '',
        testScore: '',
        // GPA fields
        gradeSystem: '',
        minimumScore: ''
      });
    }
  };

  const handleEditItem = (index, field, value) => {
    const updatedItems = [...items];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedItems[index][parent][child] = value;
    } else {
      updatedItems[index][field] = value;
    }
    onChange(updatedItems);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  const handleStandardizedTestChange = (testType) => {
    const selectedTest = standardizedTestOptions.find(test => test.value === testType);
    if (selectedTest) {
      setNewItem(prev => ({
        ...prev,
        standardizedTestType: testType,
        name: { en: selectedTest.label, fr: selectedTest.label },
        testScore: selectedTest.scoreRange || ''
      }));
    }
  };

  const handleEnglishTestChange = (testType) => {
    const selectedTest = englishTestOptions.find(test => test.value === testType);
    if (selectedTest) {
      setNewItem(prev => ({
        ...prev,
        englishTestType: testType,
        name: { en: selectedTest.label, fr: selectedTest.label },
        testScore: selectedTest.scoreRange || ''
      }));
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
  };

  const stopEditing = () => {
    setEditingIndex(null);
  };

  const getTypeIcon = (type) => {
    const typeObj = requirementTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : '📋';
  };

  const getTypeLabel = (type) => {
    const typeObj = requirementTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : 'Other';
  };

  return (
    <div className="space-y-4">
      {/* Existing Items */}
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {editingIndex === index ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name (EN)</label>
                  <input
                    type="text"
                    value={item.name.en}
                    onChange={(e) => handleEditItem(index, 'name.en', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Requirement name in English"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name (FR)</label>
                  <input
                    type="text"
                    value={item.name.fr}
                    onChange={(e) => handleEditItem(index, 'name.fr', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom de l'exigence en français"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description (EN)</label>
                  <input
                    type="text"
                    value={item.description.en}
                    onChange={(e) => handleEditItem(index, 'description.en', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description in English"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description (FR)</label>
                  <input
                    type="text"
                    value={item.description.fr}
                    onChange={(e) => handleEditItem(index, 'description.fr', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description en français"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.required}
                      onChange={(e) => handleEditItem(index, 'required', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-1 text-xs text-gray-600">Required</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">Type:</label>
                  <select
                    value={item.type}
                    onChange={(e) => handleEditItem(index, 'type', e.target.value)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {requirementTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Test Value and Score Fields */}
              {(item.standardizedTestType || item.englishTestType || item.testValue || item.testScore) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Test Value/Score</label>
                    <input
                      type="text"
                      value={item.testValue || ''}
                      onChange={(e) => handleEditItem(index, 'testValue', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 6.5, 100, 300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Score Range/Description</label>
                    <input
                      type="text"
                      value={item.testScore || ''}
                      onChange={(e) => handleEditItem(index, 'testScore', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 1-9, 0-120, 200-800"
                    />
                  </div>
                </div>
              )}
              {/* GPA Fields */}
              {item.type === 'grade' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Grade System</label>
                    <select
                      value={item.gradeSystem || ''}
                      onChange={(e) => handleEditItem(index, 'gradeSystem', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select grade system...</option>
                      {(gradeSystemOptions || []).map(system => (
                        <option key={system.value} value={system.value}>
                          {system.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Minimum Score</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.minimumScore || ''}
                      onChange={(e) => handleEditItem(index, 'minimumScore', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 3.0, 2.5, 85"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={stopEditing}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Check className="w-3 h-3" />
                  Save
                </button>
                <button
                  onClick={stopEditing}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getTypeIcon(item.type)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{item.name.en}</h4>
                    <p className="text-xs text-gray-600">{item.name.fr}</p>
                  </div>
                  {item.required && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      Required
                    </span>
                  )}
                  {!item.required && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                {item.description.en && (
                  <div className="text-xs text-gray-600 mb-1">
                    <strong>EN:</strong> {item.description.en}
                  </div>
                )}
                {item.description.fr && (
                  <div className="text-xs text-gray-600">
                    <strong>FR:</strong> {item.description.fr}
                  </div>
                )}
                {(item.testValue || item.testScore) && (
                  <div className="text-xs text-blue-600 mt-1">
                    <strong>Test Details:</strong> {item.testValue && `Score: ${item.testValue}`} {item.testScore && `(${item.testScore})`}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Type: {getTypeLabel(item.type)}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => startEditing(index)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add New Item */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Requirement</h4>
        <div className="space-y-3">
          {/* Standardized Test Selection */}
          {standardizedTestOptions.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Select Standardized Test</label>
              <select
                value={newItem.standardizedTestType}
                onChange={(e) => handleStandardizedTestChange(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a standardized test...</option>
                {standardizedTestOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* English Test Selection */}
          {englishTestOptions.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Select English Test</label>
              <select
                value={newItem.englishTestType}
                onChange={(e) => handleEnglishTestChange(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose an English test...</option>
                {englishTestOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Test Value and Score */}
          {(newItem.standardizedTestType || newItem.englishTestType) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Test Value/Score</label>
                <input
                  type="text"
                  value={newItem.testValue}
                  onChange={(e) => setNewItem(prev => ({ ...prev, testValue: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 6.5, 100, 300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Score Range/Description</label>
                <input
                  type="text"
                  value={newItem.testScore}
                  onChange={(e) => setNewItem(prev => ({ ...prev, testScore: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1-9, 0-120, 200-800"
                />
              </div>
            </div>
          )}
          {/* GPA Fields for new item */}
          {newItem.type === 'grade' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Grade System</label>
                <select
                  value={newItem.gradeSystem}
                  onChange={(e) => setNewItem(prev => ({ ...prev, gradeSystem: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select grade system...</option>
                  {(gradeSystemOptions || []).map(system => (
                    <option key={system.value} value={system.value}>
                      {system.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Minimum Score</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.minimumScore}
                  onChange={(e) => setNewItem(prev => ({ ...prev, minimumScore: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 3.0, 2.5, 85"
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name (EN)</label>
              <input
                type="text"
                value={newItem.name.en}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: { ...prev.name, en: e.target.value } }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Requirement name in English"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name (FR)</label>
              <input
                type="text"
                value={newItem.name.fr}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: { ...prev.name, fr: e.target.value } }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom de l'exigence en français"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description (EN)</label>
              <input
                type="text"
                value={newItem.description.en}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description in English"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description (FR)</label>
              <input
                type="text"
                value={newItem.description.fr}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: { ...prev.description, fr: e.target.value } }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description en français"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newItem.required}
                  onChange={(e) => setNewItem(prev => ({ ...prev, required: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-1 text-xs text-gray-600">Required</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">Type:</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {requirementTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddItem}
              disabled={!newItem.name.en.trim() || !newItem.name.fr.trim()}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
              Add Requirement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementsBuilder;

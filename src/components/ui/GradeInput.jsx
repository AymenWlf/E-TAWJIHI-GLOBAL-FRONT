import React, { useState, useEffect } from 'react';
import { useAllParameters } from '../../hooks/useAllParameters';

const GradeInput = ({ 
  value, 
  onChange, 
  gradeSystem, 
  onGradeSystemChange, 
  placeholder = "Enter grade",
  className = "",
  disabled = false,
  language = 'en'
}) => {
  const [localGradeSystem, setLocalGradeSystem] = useState(gradeSystem || 'cgpa-4');
  const [localValue, setLocalValue] = useState(value || '');
  
  // Load grade systems from centralized parameters
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();
  const [gradeSystems, setGradeSystems] = useState([]);

  useEffect(() => {
    if (allParams?.gradeSystems) {
      setGradeSystems(allParams.gradeSystems);
    } else {
      // Fallback to hardcoded systems
      setGradeSystems([
        { code: 'cgpa-4', labelEn: 'CGPA (4.0 Scale)', labelFr: 'CGPA (Échelle 4.0)', descriptionEn: '4.0 scale', descriptionFr: 'Échelle 4.0' },
        { code: 'gpa-5', labelEn: 'GPA (5.0 Scale)', labelFr: 'GPA (Échelle 5.0)', descriptionEn: '5.0 scale', descriptionFr: 'Échelle 5.0' },
        { code: 'cgpa-7', labelEn: 'CGPA (7.0 Scale)', labelFr: 'CGPA (Échelle 7.0)', descriptionEn: '7.0 scale', descriptionFr: 'Échelle 7.0' },
        { code: 'gpa-10', labelEn: 'GPA (10.0 Scale)', labelFr: 'GPA (Échelle 10.0)', descriptionEn: '10.0 scale', descriptionFr: 'Échelle 10.0' },
        { code: 'cgpa-20', labelEn: 'CGPA (20.0 Scale)', labelFr: 'CGPA (Échelle 20.0)', descriptionEn: '20.0 scale', descriptionFr: 'Échelle 20.0' },
        { code: 'percentage', labelEn: 'Percentage (%)', labelFr: 'Pourcentage (%)', descriptionEn: 'Percentage', descriptionFr: 'Pourcentage' }
      ]);
    }
  }, [allParams]);

  const getSystemConfig = (systemCode) => {
    const configs = {
      'cgpa-4': { min: 0, max: 4.0, step: 0.01, placeholder: 'e.g., 3.75' },
      'gpa-5': { min: 0, max: 5.0, step: 0.01, placeholder: 'e.g., 4.2' },
      'cgpa-7': { min: 0, max: 7.0, step: 0.01, placeholder: 'e.g., 6.25' },
      'gpa-10': { min: 0, max: 10.0, step: 0.01, placeholder: 'e.g., 8.5' },
      'cgpa-20': { min: 0, max: 20, step: 0.1, placeholder: 'e.g., 15.5' },
      'percentage': { min: 0, max: 100, step: 0.1, placeholder: 'e.g., 85.5' }
    };
    return configs[systemCode] || configs['cgpa-4'];
  };

  useEffect(() => {
    if (gradeSystem && gradeSystem !== localGradeSystem) {
      setLocalGradeSystem(gradeSystem);
    }
  }, [gradeSystem]);

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  const handleGradeSystemChange = (newSystem) => {
    setLocalGradeSystem(newSystem);
    if (onGradeSystemChange) {
      onGradeSystemChange(newSystem);
    }
  };

  const handleValueChange = (newValue) => {
    setLocalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const currentSystem = gradeSystems.find(s => s.code === localGradeSystem);
  const systemConfig = getSystemConfig(localGradeSystem);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Grade System Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'en' ? 'Grade System' : 'Système de Notation'}
        </label>
        <select
          value={localGradeSystem}
          onChange={(e) => handleGradeSystemChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {gradeSystems.map((system) => (
            <option key={system.code} value={system.code}>
              {language === 'fr' ? system.labelFr : system.labelEn}
            </option>
          ))}
        </select>
        {currentSystem && currentSystem.descriptionEn && (
          <p className="mt-1 text-xs text-gray-500">
            {language === 'fr' ? currentSystem.descriptionFr : currentSystem.descriptionEn}
          </p>
        )}
      </div>

      {/* Grade Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'en' ? 'Grade' : 'Note'}
        </label>
        <input
          type="number"
          value={localValue}
          onChange={(e) => handleValueChange(e.target.value)}
          min={systemConfig.min}
          max={systemConfig.max}
          step={systemConfig.step}
          placeholder={systemConfig.placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">
          {language === 'en' ? 'Range' : 'Plage'}: {systemConfig.min} - {systemConfig.max}
        </p>
      </div>
    </div>
  );
};

export default GradeInput;

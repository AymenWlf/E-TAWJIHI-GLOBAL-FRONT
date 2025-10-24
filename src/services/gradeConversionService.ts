// Service for converting grades between different systems
// Standard system: 10-point scale (0-10)

export interface GradeSystem {
  code: string;
  labelEn: string;
  labelFr: string;
  maxValue: number;
  minValue: number;
}

export interface GradeConversion {
  fromSystem: string;
  toSystem: string;
  value: number;
  convertedValue: number;
}

class GradeConversionService {
  // Grade system definitions
  private gradeSystems: Record<string, GradeSystem> = {
    'cgpa-4': {
      code: 'cgpa-4',
      labelEn: 'CGPA (4.0 Scale)',
      labelFr: 'CGPA (Échelle 4.0)',
      maxValue: 4.0,
      minValue: 0.0
    },
    'gpa-5': {
      code: 'gpa-5',
      labelEn: 'GPA (5.0 Scale)',
      labelFr: 'GPA (Échelle 5.0)',
      maxValue: 5.0,
      minValue: 0.0
    },
    'cgpa-7': {
      code: 'cgpa-7',
      labelEn: 'CGPA (7.0 Scale)',
      labelFr: 'CGPA (Échelle 7.0)',
      maxValue: 7.0,
      minValue: 0.0
    },
    'gpa-10': {
      code: 'gpa-10',
      labelEn: 'GPA (10.0 Scale)',
      labelFr: 'GPA (Échelle 10.0)',
      maxValue: 10.0,
      minValue: 0.0
    },
    'cgpa-20': {
      code: 'cgpa-20',
      labelEn: 'CGPA (20.0 Scale)',
      labelFr: 'CGPA (Échelle 20.0)',
      maxValue: 20.0,
      minValue: 0.0
    },
    'percentage': {
      code: 'percentage',
      labelEn: 'Percentage (%)',
      labelFr: 'Pourcentage (%)',
      maxValue: 100,
      minValue: 0
    },
    'standard-10': {
      code: 'standard-10',
      labelEn: 'Standard (10-point)',
      labelFr: 'Standard (10 points)',
      maxValue: 10.0,
      minValue: 0.0
    }
  };

  // Convert any grade to standard 10-point scale
  convertToStandard(value: number, fromSystem: string): number {
    const system = this.gradeSystems[fromSystem];
    if (!system) {
      console.warn(`Unknown grade system: ${fromSystem}`);
      return value; // Return original value if system unknown
    }

    // Special case for percentage: direct conversion to 10-point scale
    if (fromSystem === 'percentage') {
      return value / 10; // 85% = 8.5/10
    }

    // For other systems: convert to percentage first, then to 10-point scale
    const percentage = ((value - system.minValue) / (system.maxValue - system.minValue)) * 100;
    return (percentage / 100) * 10;
  }

  // Convert from standard 10-point scale to any system
  convertFromStandard(value: number, toSystem: string): number {
    const system = this.gradeSystems[toSystem];
    if (!system) {
      console.warn(`Unknown grade system: ${toSystem}`);
      return value; // Return original value if system unknown
    }

    // Convert from 10-point scale to percentage, then to target system
    const percentage = (value / 10) * 100;
    return system.minValue + (percentage / 100) * (system.maxValue - system.minValue);
  }

  // Convert between any two systems
  convert(value: number, fromSystem: string, toSystem: string): number {
    if (fromSystem === toSystem) {
      return value;
    }

    // Convert to standard first, then to target system
    const standardValue = this.convertToStandard(value, fromSystem);
    return this.convertFromStandard(standardValue, toSystem);
  }

  // Get grade system info
  getGradeSystem(code: string): GradeSystem | null {
    return this.gradeSystems[code] || null;
  }

  // Get all grade systems
  getAllGradeSystems(): GradeSystem[] {
    return Object.values(this.gradeSystems);
  }

  // Check if a grade meets minimum requirement
  meetsMinimumRequirement(grade: number, gradeSystem: string, minimumGrade: number, minimumSystem: string): boolean {
    const standardGrade = this.convertToStandard(grade, gradeSystem);
    const standardMinimum = this.convertToStandard(minimumGrade, minimumSystem);
    return standardGrade >= standardMinimum;
  }

  // Format grade for display
  formatGrade(value: number, system: string): string {
    const systemInfo = this.getGradeSystem(system);
    if (!systemInfo) {
      return value.toString();
    }

    if (system === 'percentage') {
      return `${value.toFixed(1)}%`;
    } else {
      return value.toFixed(2);
    }
  }

  // Get grade comparison description
  getComparisonDescription(grade: number, gradeSystem: string, minimumGrade: number, minimumSystem: string): string {
    const meets = this.meetsMinimumRequirement(grade, gradeSystem, minimumGrade, minimumSystem);
    const standardGrade = this.convertToStandard(grade, gradeSystem);
    const standardMinimum = this.convertToStandard(minimumGrade, minimumSystem);
    
    if (meets) {
      return `✅ Meets requirement (${this.formatGrade(standardGrade, 'standard-10')}/10 ≥ ${this.formatGrade(standardMinimum, 'standard-10')}/10)`;
    } else {
      return `❌ Below requirement (${this.formatGrade(standardGrade, 'standard-10')}/10 < ${this.formatGrade(standardMinimum, 'standard-10')}/10)`;
    }
  }
}

export const gradeConversionService = new GradeConversionService();
export default gradeConversionService;

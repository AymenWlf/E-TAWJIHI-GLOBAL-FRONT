import parameterService, { ParameterItem } from './parameterService';

export interface AllParameters {
  countries: ParameterItem[];
  cities: ParameterItem[];
  languages: ParameterItem[];
  studyLevels: ParameterItem[];
  degrees: ParameterItem[];
  currencies: ParameterItem[];
  schoolTypes: ParameterItem[];
  procedureTypes: ParameterItem[];
  fieldCategories: ParameterItem[];
  fields: ParameterItem[];
  gradeSystems: ParameterItem[];
  englishTests: ParameterItem[];
  standardizedTests: ParameterItem[];
  universityTypes: ParameterItem[];
  studyTypes: ParameterItem[];
}

const allParametersService = {
  async loadAll(): Promise<AllParameters> {
    try {
      // Use the new optimized backend endpoint (public route)
      const response = await fetch('/api/public/parameters/all?activeOnly=true');
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to load parameters');
      }
    } catch (error) {
      console.error('Error loading all parameters:', error);
      // Fallback to individual calls if the new endpoint fails
      const [
        countries,
        cities,
        languages,
        studyLevels,
        degrees,
        currencies,
        schoolTypes,
        procedureTypes,
        fieldCategories,
        fields,
        gradeSystems,
        englishTests,
        standardizedTests,
        universityTypes,
        studyTypes
      ] = await Promise.all([
        parameterService.list('country'),
        parameterService.list('city'),
        parameterService.list('language'),
        parameterService.list('studyLevel'),
        parameterService.list('degree'),
        parameterService.list('currency'),
        parameterService.list('schoolType'),
        parameterService.list('procedureType'),
        parameterService.list('fieldCategory'),
        parameterService.list('field'),
        parameterService.list('gradeSystem'),
        parameterService.list('englishTest'),
        parameterService.list('standardizedTest'),
        parameterService.list('universityType'),
        parameterService.list('studyType')
      ]);
      
      return {
        countries: countries.data || [],
        cities: cities.data || [],
        languages: languages.data || [],
        studyLevels: studyLevels.data || [],
        degrees: degrees.data || [],
        currencies: currencies.data || [],
        schoolTypes: schoolTypes.data || [],
        procedureTypes: procedureTypes.data || [],
        fieldCategories: fieldCategories.data || [],
        fields: fields.data || [],
        gradeSystems: gradeSystems.data || [],
        englishTests: englishTests.data || [],
        standardizedTests: standardizedTests.data || [],
        universityTypes: universityTypes.data || [],
        studyTypes: studyTypes.data || []
      };
    }
  }
};

export default allParametersService;

import api from '../config/api';

export const userProfileService = {
  // Get current user profile data
  async getProfile() {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Return default profile structure if API fails
      return {
        id: null,
        firstName: '',
        lastName: '',
        fullName: '',
        country: '',
        city: '',
        nationality: '',
        phone: '',
        whatsapp: '',
        phoneCountry: '',
        whatsappCountry: '',
        passportNumber: '',
        address: '',
        postalCode: '',
        dateOfBirth: '',
        avatar: null,
        studyLevel: '',
        fieldOfStudy: '',
        preferredCountry: '',
        startDate: '',
        preferredCurrency: '',
        annualBudget: null,
        scholarshipRequired: false,
        languagePreferences: [],
        onboardingProgress: 0,
        preferredDestinations: [],
        preferredIntakes: [],
        preferredSubjects: [],
        createdAt: null,
        updatedAt: null
      };
    }
  },

  // Update user profile data
  async updateProfile(profileData) {
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Get user's personal information
  async getPersonalInfo() {
    try {
      const profile = await this.getProfile();
      return {
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        dateOfBirth: profile?.dateOfBirth || '',
        nationality: profile?.nationality || '',
        address: profile?.address || '',
        city: profile?.city || '',
        country: profile?.country || '',
        postalCode: profile?.postalCode || '',
        gender: profile?.gender || '',
        maritalStatus: profile?.maritalStatus || '',
        emergencyContact: profile?.emergencyContact || {
          name: '',
          relationship: '',
          phone: '',
          email: ''
        }
      };
    } catch (error) {
      console.error('Error getting personal info:', error);
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        nationality: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        gender: '',
        maritalStatus: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
          email: ''
        }
      };
    }
  },

  // Get user's academic qualifications
  async getAcademicInfo() {
    try {
      const profile = await this.getProfile();
      return {
        highestEducation: profile?.studyLevel || '',
        currentInstitution: profile?.currentInstitution || '',
        graduationYear: profile?.graduationYear || '',
        gpa: profile?.gpa || '',
        academicAchievements: profile?.academicAchievements || [],
        languageProficiency: profile?.languageProficiency || {
          english: { level: '', certificate: '', score: '' },
          french: { level: '', certificate: '', score: '' },
          other: { language: '', level: '', certificate: '', score: '' }
        }
      };
    } catch (error) {
      console.error('Error getting academic info:', error);
      return {
        highestEducation: '',
        currentInstitution: '',
        graduationYear: '',
        gpa: '',
        academicAchievements: [],
        languageProficiency: {
          english: { level: '', certificate: '', score: '' },
          french: { level: '', certificate: '', score: '' },
          other: { language: '', level: '', certificate: '', score: '' }
        }
      };
    }
  },

  // Get user's work experience
  async getWorkExperience() {
    const profile = await this.getProfile();
    return {
      workExperience: profile.workExperience || [],
      internships: profile.internships || [],
      volunteerWork: profile.volunteerWork || [],
      skills: profile.skills || [],
      certifications: profile.certifications || []
    };
  },

  // Get user's references
  async getReferences() {
    try {
      const profile = await this.getProfile();
      return {
        academicReferences: profile?.academicReferences || [],
        professionalReferences: profile?.professionalReferences || [],
        personalReferences: profile?.personalReferences || []
      };
    } catch (error) {
      console.error('Error getting references:', error);
      return {
        academicReferences: [],
        professionalReferences: [],
        personalReferences: []
      };
    }
  },

  // Update personal information
  async updatePersonalInfo(personalData) {
    const profile = await this.getProfile();
    const updatedProfile = {
      ...profile,
      ...personalData
    };
    return await this.updateProfile(updatedProfile);
  },

  // Update academic information
  async updateAcademicInfo(academicData) {
    const profile = await this.getProfile();
    const updatedProfile = {
      ...profile,
      ...academicData
    };
    return await this.updateProfile(updatedProfile);
  },

  // Update work experience
  async updateWorkExperience(workData) {
    const profile = await this.getProfile();
    const updatedProfile = {
      ...profile,
      ...workData
    };
    return await this.updateProfile(updatedProfile);
  },

  // Update references
  async updateReferences(referencesData) {
    const profile = await this.getProfile();
    const updatedProfile = {
      ...profile,
      ...referencesData
    };
    return await this.updateProfile(updatedProfile);
  },

  // Check if profile is complete
  async isProfileComplete() {
    const profile = await this.getProfile();
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
      'nationality', 'address', 'city', 'country'
    ];
    
    return requiredFields.every(field => profile[field] && profile[field].trim() !== '');
  },

  // Get missing profile fields
  async getMissingProfileFields() {
    const profile = await this.getProfile();
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
      'nationality', 'address', 'city', 'country'
    ];
    
    return requiredFields.filter(field => !profile[field] || profile[field].trim() === '');
  }
};

export default userProfileService;

import api from '../config/api';

export interface Document {
  id?: number;
  type: string;
  category: string;
  title: string; // Clé unique de l'input (ex: 'passport', 'nationalId') - sert aussi d'identifiant
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  status: string;
  validationStatus?: string;
  validationNotes?: string;
  validatedBy?: string;
  validatedAt?: string;
  rejectionReason?: string;
  expiryDate?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  originalLanguage?: string;
  etawjihiNotes?: string;
}

class DocumentService {

  async getDocuments(): Promise<Document[]> {
    try {
      const response = await api.get('/profile/documents');
      return response.data.documents || response.data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async uploadDocument(file: File, documentData: {
    type: string;
    category: string;
    docKey: string; // Clé unique de l'input (obligatoire) - ex: 'passport', 'nationalId'
    description?: string;
    originalLanguage?: string;
    expiryDate?: string;
  }): Promise<Document> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', documentData.type);
      formData.append('category', documentData.category);
      
      // Normaliser la clé pour garantir qu'elle soit en camelCase sans espaces
      const normalizedKey = this.normalizeDocumentKey(documentData.docKey);
      formData.append('docKey', normalizedKey);
      
      if (documentData.description) {
        formData.append('description', documentData.description);
      }
      if (documentData.originalLanguage) {
        formData.append('originalLanguage', documentData.originalLanguage);
      }
      if (documentData.expiryDate) {
        formData.append('expiryDate', documentData.expiryDate);
      }

      const response = await api.post('/profile/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.document || response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async updateDocument(id: number, updateData: Partial<Document>): Promise<Document> {
    try {
      const response = await api.put(`/profile/documents/${id}`, updateData);
      return response.data.document || response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async deleteDocument(id: number): Promise<void> {
    try {
      await api.delete(`/profile/documents/${id}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async getDocumentContent(id: number): Promise<Blob> {
    try {
      const response = await api.get(`/profile/documents/${id}/view`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching document content:', error);
      throw error;
    }
  }

  // Helper method to map document key to type and category
  getDocumentTypeAndCategory(docKey: string): { type: string; category: string } {
    const typeMapping: { [key: string]: { type: string; category: string } } = {
      // Personal Documents
      'passport': { type: 'personal', category: 'identity' },
      'nationalId': { type: 'personal', category: 'identity' },
      'cv': { type: 'personal', category: 'cv' },
      'guardian1NationalId': { type: 'personal', category: 'guardian' },
      'guardian2NationalId': { type: 'personal', category: 'guardian' },
      
      // Academic Documents
      'transcript': { type: 'academic', category: 'transcript' },
      'englishTest': { type: 'academic', category: 'language_test' },
      'frenchTest': { type: 'academic', category: 'language_test' },
      'portfolio': { type: 'academic', category: 'portfolio' },
      'baccalaureate': { type: 'academic', category: 'diploma' },
      'bac2': { type: 'academic', category: 'diploma' },
      'bac3': { type: 'academic', category: 'diploma' },
      'bac5': { type: 'academic', category: 'diploma' },
      'enrollmentCertificate': { type: 'academic', category: 'certificate' },
      
      // Application Documents
      'recommendationLetter1': { type: 'application', category: 'recommendation' },
      'recommendationLetter2': { type: 'application', category: 'recommendation' },
      'motivationLetter': { type: 'application', category: 'motivation' },
      
      // China-specific Documents
      'medicalHealthCheck': { type: 'application', category: 'medical' },
      'anthropometricRecord': { type: 'application', category: 'official' }
    };

    return typeMapping[docKey] || { type: 'other', category: 'other' };
  }

  // Helper method to normalize document key to camelCase (no spaces)
  // Recognizes known variants and converts them to standard keys
  normalizeDocumentKey(key: string): string {
    if (!key) return key;
    
    const trimmed = key.trim();
    
    // Mapping des variantes connues vers les clés standard
    const variantToKeyMap: { [key: string]: string } = {
      // Enrollment Certificate / Attestation de Scolarité
      'attestationdescolarite': 'enrollmentCertificate',
      'attestation_de_scolarite': 'enrollmentCertificate',
      'attestation-de-scolarite': 'enrollmentCertificate',
      'attestationdescolarité': 'enrollmentCertificate',
      'attestation_de_scolarité': 'enrollmentCertificate',
      'enrollmentcertificate': 'enrollmentCertificate',
      'enrollment_certificate': 'enrollmentCertificate',
      'enrollment-certificate': 'enrollmentCertificate',
      
      // Medical Health Check
      'certificatmedicaldesante': 'medicalHealthCheck',
      'certificat_medical_de_sante': 'medicalHealthCheck',
      'certificat-medical-de-sante': 'medicalHealthCheck',
      'certificatmedicaldesanté': 'medicalHealthCheck',
      'certificat_médical_de_santé': 'medicalHealthCheck',
      'medicalhealthcheck': 'medicalHealthCheck',
      'medical_health_check': 'medicalHealthCheck',
      'medical-health-check': 'medicalHealthCheck',
      
      // Anthropometric Record
      'ficheanthropometrique': 'anthropometricRecord',
      'fiche_anthropometrique': 'anthropometricRecord',
      'fiche-anthropometrique': 'anthropometricRecord',
      'ficheanthropométrique': 'anthropometricRecord',
      'fiche_anthropométrique': 'anthropometricRecord',
      'anthropometricrecord': 'anthropometricRecord',
      'anthropometric_record': 'anthropometricRecord',
      'anthropometric-record': 'anthropometricRecord',
      'goodconduct': 'anthropometricRecord',
      'good_conduct': 'anthropometricRecord',
      'good-conduct': 'anthropometricRecord',
      'bonneconduite': 'anthropometricRecord',
      'bonne_conduite': 'anthropometricRecord',
      
      // National ID
      'nationalid': 'nationalId',
      'national_id': 'nationalId',
      'national-id': 'nationalId',
      'cartenationale': 'nationalId',
      'carte_nationale': 'nationalId',
      
      // Guardian IDs
      'guardian1nationalid': 'guardian1NationalId',
      'guardian1_national_id': 'guardian1NationalId',
      'guardian1nationalidcard': 'guardian1NationalId',
      'guardian2nationalid': 'guardian2NationalId',
      'guardian2_national_id': 'guardian2NationalId',
      'guardian2nationalidcard': 'guardian2NationalId',
      
      // Transcripts
      'generaltranscript': 'generalTranscript',
      'general_transcript': 'generalTranscript',
      'general-transcript': 'generalTranscript',
      'relevedenotes': 'generalTranscript',
      'releve_de_notes': 'generalTranscript',
      'transcript': 'transcript',
      
      // Tests
      'englishtest': 'englishTest',
      'english_test': 'englishTest',
      'english-test': 'englishTest',
      'frenchtest': 'frenchTest',
      'french_test': 'frenchTest',
      'french-test': 'frenchTest',
      
      // Diplomas
      'baccalaureate': 'baccalaureate',
      'baccalauréat': 'baccalaureate',
      'baccalaureatediploma': 'baccalaureate',
      'bac2diploma': 'bac2',
      'bac2': 'bac2',
      'bac3diploma': 'bac3',
      'bac3': 'bac3',
      'bac5diploma': 'bac5',
      'bac5': 'bac5',
      
      // Letters
      'recommendationletter1': 'recommendationLetter1',
      'recommendation_letter_1': 'recommendationLetter1',
      'recommendationletter2': 'recommendationLetter2',
      'recommendation_letter_2': 'recommendationLetter2',
      'motivationletter': 'motivationLetter',
      'motivation_letter': 'motivationLetter',
    };
    
    // Normaliser la clé pour la comparaison (enlever accents, espaces, tout en minuscules)
    const normalizedForComparison = trimmed
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[\s\-_]/g, '');
    
    // Vérifier si c'est une variante connue
    if (variantToKeyMap[normalizedForComparison]) {
      return variantToKeyMap[normalizedForComparison];
    }
    
    // Vérifier aussi avec matching partiel pour certaines variantes
    for (const [variant, standardKey] of Object.entries(variantToKeyMap)) {
      if (normalizedForComparison.includes(variant) || variant.includes(normalizedForComparison)) {
        return standardKey;
      }
    }
    
    // Matching partiel spécialisé pour certaines variantes courantes
    // Enrollment Certificate / Attestation de Scolarité
    if (normalizedForComparison.includes('attestation') && 
        (normalizedForComparison.includes('scolarite') || normalizedForComparison.includes('school'))) {
      return 'enrollmentCertificate';
    }
    if (normalizedForComparison.includes('enrollment') && normalizedForComparison.includes('certificate')) {
      return 'enrollmentCertificate';
    }
    
    // Medical Health Check
    if ((normalizedForComparison.includes('certificat') || normalizedForComparison.includes('certificate')) &&
        (normalizedForComparison.includes('medical') || normalizedForComparison.includes('sante') || normalizedForComparison.includes('health'))) {
      return 'medicalHealthCheck';
    }
    
    // Anthropometric Record
    if ((normalizedForComparison.includes('fiche') || normalizedForComparison.includes('record')) &&
        (normalizedForComparison.includes('anthropometrique') || normalizedForComparison.includes('anthropometric') ||
         normalizedForComparison.includes('conduite') || normalizedForComparison.includes('conduct'))) {
      return 'anthropometricRecord';
    }
    
    // Si la clé est déjà valide, la retourner telle quelle
    const validKeys = [
      'passport', 'nationalId', 'cv', 'guardian1NationalId', 'guardian2NationalId',
      'transcript', 'generalTranscript', 'englishTest', 'frenchTest', 'portfolio',
      'baccalaureate', 'bac2', 'bac3', 'bac5', 'enrollmentCertificate',
      'recommendationLetter1', 'recommendationLetter2', 'motivationLetter',
      'medicalHealthCheck', 'anthropometricRecord'
    ];
    if (validKeys.includes(trimmed)) {
      return trimmed;
    }
    
    // Sinon, normaliser en camelCase
    // Replace spaces, hyphens, underscores with a temporary separator
    const normalized = trimmed.replace(/[\s\-_]+/g, '_');
    
    // Split by separator
    const parts = normalized.split('_').filter(part => part.length > 0);
    
    if (parts.length === 0) return trimmed;
    
    // First word in lowercase, following words with first letter uppercase
    let camelCase = parts[0].toLowerCase();
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part.length > 0) {
        camelCase += part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      }
    }
    
    // Vérifier si la clé normalisée est valide
    if (validKeys.includes(camelCase)) {
      return camelCase;
    }
    
    return camelCase;
  }

  // Helper method to get document title
  getDocumentTitle(docKey: string, language: string = 'en'): string {
    const titleMapping: { [key: string]: { en: string; fr: string } } = {
      'passport': { en: 'Passport', fr: 'Passeport' },
      'nationalId': { en: 'National ID Card', fr: 'Carte Nationale' },
      'cv': { en: 'Curriculum Vitae (CV)', fr: 'Curriculum Vitae (CV)' },
      'guardian1NationalId': { en: 'Guardian 1 National ID', fr: 'Carte Nationale Tuteur 1' },
      'guardian2NationalId': { en: 'Guardian 2 National ID', fr: 'Carte Nationale Tuteur 2' },
      'transcript': { en: 'General Transcript', fr: 'Relevé de note général' },
      'englishTest': { en: 'English Test Certificate', fr: 'Certificat de Test d\'Anglais' },
      'frenchTest': { en: 'French Test Certificate', fr: 'Certificat de Test de Français' },
      'portfolio': { en: 'Portfolio', fr: 'Portfolio' },
      'baccalaureate': { en: 'Baccalaureate Diploma', fr: 'Diplôme du Baccalauréat' },
      'bac2': { en: 'BAC+2 Diploma', fr: 'Diplôme BAC+2' },
      'bac3': { en: 'BAC+3 Diploma', fr: 'Diplôme BAC+3' },
      'bac5': { en: 'BAC+5 Diploma', fr: 'Diplôme BAC+5' },
      'enrollmentCertificate': { en: 'Enrollment Certificate', fr: 'Attestation de Scolarité' },
      'recommendationLetter1': { en: 'Recommendation Letter 1', fr: 'Lettre de Recommandation 1' },
      'recommendationLetter2': { en: 'Recommendation Letter 2', fr: 'Lettre de Recommandation 2' },
      'motivationLetter': { en: 'Motivation Letter', fr: 'Lettre de Motivation' },
      
      // China-specific Documents
      'medicalHealthCheck': { en: 'Medical Health Check', fr: 'Certificat Médical de Santé' },
      'anthropometricRecord': { en: 'Anthropometric Record (Good Conduct)', fr: 'Fiche Anthropométrique (Bonne Conduite)' }
    };

    return titleMapping[docKey]?.[language] || docKey;
  }
}

const documentService = new DocumentService();
export default documentService;
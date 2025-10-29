import { Qualification } from './profileService';

export interface DefaultQualification {
  type: string;
  title: string;
  institution?: string;
  field?: string;
  scoreType?: string;
  description?: string;
  academicQualification?: string;
  exactQualificationName?: string;
  detailedScores?: { [key: string]: string };
}

export const defaultQualifications: DefaultQualification[] = [
  // Tests de langue français
  {
    type: 'language',
    title: 'TCF - Test de Connaissance du Français',
    institution: 'CIEP',
    field: 'french-language',
    scoreType: 'TCF',
    description: 'Test de Connaissance du Français - Test standardisé pour évaluer le niveau de français'
  },
  {
    type: 'language',
    title: 'DELF - Diplôme d\'Études en Langue Française',
    institution: 'CIEP',
    field: 'french-language',
    scoreType: 'DELF',
    description: 'Diplôme d\'Études en Langue Française - Diplôme officiel de français'
  },
  {
    type: 'language',
    title: 'DALF - Diplôme Approfondi de Langue Française',
    institution: 'CIEP',
    field: 'french-language',
    scoreType: 'DALF',
    description: 'Diplôme Approfondi de Langue Française - Diplôme avancé de français'
  },

  // Tests de langue anglais
  {
    type: 'language',
    title: 'IELTS - International English Language Testing System',
    institution: 'British Council',
    field: 'english-language',
    scoreType: 'IELTS',
    description: 'Test international d\'anglais reconnu mondialement'
  },
  {
    type: 'language',
    title: 'TOEFL - Test of English as a Foreign Language',
    institution: 'ETS',
    field: 'english-language',
    scoreType: 'TOEFL',
    description: 'Test d\'anglais américain pour les études supérieures'
  },
  {
    type: 'language',
    title: 'Duolingo English Test',
    institution: 'Duolingo',
    field: 'english-language',
    scoreType: 'Duolingo',
    description: 'Test d\'anglais en ligne reconnu par de nombreuses universités'
  },

  // Diplômes académiques marocains
  {
    type: 'academic',
    title: 'Baccalauréat Marocain',
    institution: 'Ministère de l\'Éducation Nationale',
    field: 'general-education',
    academicQualification: 'baccalaureat',
    exactQualificationName: 'Baccalauréat',
    description: 'Diplôme de fin d\'études secondaires marocain'
  },
  {
    type: 'academic',
    title: 'Baccalauréat Sciences Expérimentales',
    institution: 'Ministère de l\'Éducation Nationale',
    field: 'sciences',
    academicQualification: 'baccalaureat',
    exactQualificationName: 'Baccalauréat Sciences Expérimentales',
    description: 'Baccalauréat spécialisé en sciences expérimentales'
  },
  {
    type: 'academic',
    title: 'Baccalauréat Sciences Mathématiques',
    institution: 'Ministère de l\'Éducation Nationale',
    field: 'mathematics',
    academicQualification: 'baccalaureat',
    exactQualificationName: 'Baccalauréat Sciences Mathématiques',
    description: 'Baccalauréat spécialisé en sciences mathématiques'
  },
  {
    type: 'academic',
    title: 'Baccalauréat Sciences Économiques',
    institution: 'Ministère de l\'Éducation Nationale',
    field: 'economics',
    academicQualification: 'baccalaureat',
    exactQualificationName: 'Baccalauréat Sciences Économiques',
    description: 'Baccalauréat spécialisé en sciences économiques'
  },
  {
    type: 'academic',
    title: 'Baccalauréat Lettres',
    institution: 'Ministère de l\'Éducation Nationale',
    field: 'literature',
    academicQualification: 'baccalaureat',
    exactQualificationName: 'Baccalauréat Lettres',
    description: 'Baccalauréat spécialisé en lettres et sciences humaines'
  },

  // Diplômes techniques marocains
  {
    type: 'academic',
    title: 'Technicien Spécialisé',
    institution: 'OFPPT',
    field: 'technical-education',
    academicQualification: 'technicien-specialise',
    exactQualificationName: 'Technicien Spécialisé',
    description: 'Diplôme de technicien spécialisé de l\'OFPPT'
  },
  {
    type: 'academic',
    title: 'BTS - Brevet de Technicien Supérieur',
    institution: 'Ministère de l\'Éducation Nationale',
    field: 'technical-education',
    academicQualification: 'bts',
    exactQualificationName: 'BTS',
    description: 'Brevet de Technicien Supérieur - Formation technique courte'
  },
  {
    type: 'academic',
    title: 'DUT - Diplôme Universitaire de Technologie',
    institution: 'Université',
    field: 'technical-education',
    academicQualification: 'dut',
    exactQualificationName: 'DUT',
    description: 'Diplôme Universitaire de Technologie - Formation technique universitaire'
  },

  // Diplômes universitaires
  {
    type: 'academic',
    title: 'Licence',
    institution: 'Université',
    field: 'higher-education',
    academicQualification: 'licence',
    exactQualificationName: 'Licence',
    description: 'Diplôme de licence universitaire'
  },
  {
    type: 'academic',
    title: 'Master',
    institution: 'Université',
    field: 'higher-education',
    academicQualification: 'master',
    exactQualificationName: 'Master',
    description: 'Diplôme de master universitaire'
  },
  {
    type: 'academic',
    title: 'Doctorat',
    institution: 'Université',
    field: 'higher-education',
    academicQualification: 'doctorat',
    exactQualificationName: 'Doctorat',
    description: 'Diplôme de doctorat universitaire'
  },

  // Tests standardisés
  {
    type: 'professional',
    title: 'GMAT - Graduate Management Admission Test',
    institution: 'GMAC',
    field: 'business-education',
    scoreType: 'GMAT',
    description: 'Test d\'admission aux programmes de gestion et MBA'
  },
  {
    type: 'professional',
    title: 'GRE - Graduate Record Examinations',
    institution: 'ETS',
    field: 'graduate-education',
    scoreType: 'GRE',
    description: 'Test d\'admission aux programmes d\'études supérieures'
  },
  {
    type: 'professional',
    title: 'SAT - Scholastic Assessment Test',
    institution: 'College Board',
    field: 'undergraduate-education',
    scoreType: 'SAT',
    description: 'Test d\'admission aux universités américaines'
  }
];

export const getDefaultQualificationsByType = (type: string): DefaultQualification[] => {
  return defaultQualifications.filter(qual => qual.type === type);
};

export const getDefaultQualificationsByField = (field: string): DefaultQualification[] => {
  return defaultQualifications.filter(qual => qual.field === field);
};

export const getDefaultQualificationByTitle = (title: string): DefaultQualification | undefined => {
  return defaultQualifications.find(qual => 
    qual.title.toLowerCase().includes(title.toLowerCase()) ||
    title.toLowerCase().includes(qual.title.toLowerCase())
  );
};

export const getAllDefaultQualifications = (): DefaultQualification[] => {
  return defaultQualifications;
};

// Qualifications essentielles seulement (Baccalauréat et TCF)
export const getEssentialQualifications = (): DefaultQualification[] => {
  return [
    // Test de langue français essentiel
    {
      type: 'language',
      title: 'TCF - Test de Connaissance du Français',
      institution: null,
      field: 'french-language',
      scoreType: 'TCF',
      description: 'Test de Connaissance du Français - Test standardisé pour évaluer le niveau de français'
    },
    // Diplôme académique essentiel
    {
      type: 'academic',
      title: 'Baccalauréat Marocain',
      institution: null,
      field: 'general-education',
      academicQualification: 'baccalaureat',
      exactQualificationName: 'Baccalauréat',
      description: 'Diplôme de fin d\'études secondaires marocain'
    }
  ];
};

// Qualifications courantes simples (pour le bouton manuel)
export const getSimpleCommonQualifications = (): DefaultQualification[] => {
  return [
    // Test de langue français simple
    {
      type: 'language',
      title: 'TCF',
      institution: null,
      field: 'french-language',
      scoreType: 'TCF',
      description: 'Test de Connaissance du Français'
    },
    // Diplôme académique simple
    {
      type: 'academic',
      title: 'Baccalauréat',
      institution: null,
      field: 'general-education',
      academicQualification: 'baccalaureat',
      exactQualificationName: 'Baccalauréat',
      description: 'Diplôme de fin d\'études secondaires'
    }
  ];
};

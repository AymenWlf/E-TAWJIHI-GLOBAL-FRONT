import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, MapPin, ExternalLink, CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import eadvisorService from '../../services/eadvisorService';
import diagnosticService from '../../services/diagnosticService';

const LOCAL_KEY = 'eadvisor_session_v1';

// Structure des questions avec logique conditionnelle
const buildQuestionFlow = (answers) => {
  const flow = [];

  // ÉTAPE 1 - Informations personnelles
  flow.push({
    id: 'step1_header',
    type: 'info',
    content: '🧩 Étape 1 — Informations personnelles (profil de base)',
  });

  flow.push({
    id: 'fullName',
    label: '👋 Bonjour ! Pour commencer, peux-tu me donner ton nom complet ?',
    type: 'text',
  });

  flow.push({
    id: 'email',
    label: '✉️ Quelle est ton adresse e-mail ?',
    type: 'email',
  });

  flow.push({
    id: 'phone',
    label: '📞 Peux-tu partager ton numéro de téléphone (WhatsApp) ?',
    type: 'tel',
  });

  flow.push({
    id: 'currentLevel',
    label: '🎓 Quel est ton niveau d\'étude actuel ?',
    type: 'select',
    options: [
      { value: 'terminal', label: 'Terminale' },
      { value: 'bac', label: 'Bac' },
      { value: 'bac1', label: 'Bac+1' },
      { value: 'bac2', label: 'Bac+2' },
      { value: 'licence', label: 'Licence' },
      { value: 'master', label: 'Master' },
      { value: 'other', label: 'Autre' },
    ],
  });

  flow.push({
    id: 'bacFiliere',
    label: '📚 Quelle est ta filière du baccalauréat ?',
    type: 'select',
    options: [
      { value: 'sciences_math', label: 'Sciences Mathématiques' },
      { value: 'sciences_physiques', label: 'Physiques' },
      { value: 'economie', label: 'Économie' },
      { value: 'lettres', label: 'Lettres' },
      { value: 'other', label: 'Autre' },
    ],
  });

  flow.push({
    id: 'countryResidence',
    label: '🌍 Dans quel pays résides-tu actuellement ?',
    type: 'text',
  });

  // ÉTAPE 2 - Préférences d'études
  flow.push({
    id: 'step2_header',
    type: 'info',
    content: '🎯 Étape 2 — Préférences d\'études (choix du parcours)',
  });

  flow.push({
    id: 'studyDestination',
    label: 'Souhaites-tu poursuivre tes études au Maroc, en France ou en Chine ? (Choix multiple possible)',
    type: 'multiselect',
    options: [
      { value: 'FR', label: '🇫🇷 France' },
      { value: 'CN', label: '🇨🇳 Chine' },
      { value: 'MA', label: '🇲🇦 Maroc' },
    ],
  });

  // ÉTAPE 3 - Parcours conditionnel
  const destinations = answers.studyDestination || [];
  const hasFrance = destinations.includes('FR');
  const hasChina = destinations.includes('CN');
  const hasMorocco = destinations.includes('MA');

  if (hasFrance) {
    flow.push({
      id: 'step3a_header',
      type: 'info',
      content: '🇫🇷 Étape 3A — France\n\nTrès bon choix ! 🇫🇷\n\nE-TAWJIHI propose un accompagnement complet pour les études en France, couvrant :\n• Campus France\n• Parcoursup\n• Aide au choix des universités\n• Préparation du dossier complet (CV, projet d\'étude, TCF, etc.)',
    });

    flow.push({
      id: 'france_investQuality',
      label: '💬 Souhaites-tu investir sur la qualité de ton accompagnement pour maximiser tes chances d\'admission ?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Oui' },
        { value: 'no', label: 'Non' },
        { value: 'more_info', label: 'Je veux en savoir plus' },
      ],
    });

    flow.push({
      id: 'france_helpDossier',
      label: 'Souhaites-tu que nous t\'aidions à préparer ton dossier Campus France et Parcoursup ?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Oui' },
        { value: 'no', label: 'Non' },
      ],
    });

    flow.push({
      id: 'france_budget',
      label: '💰 As-tu une idée de ton budget annuel pour les études en France ? (en EUR)',
      type: 'number',
      note: '⚠️ Si inférieur à 8 000 €/an, nous conseillerons les alternatives Maroc/Chine',
    });
  }

  if (hasChina) {
    flow.push({
      id: 'step3b_header',
      type: 'info',
      content: '🇨🇳 Étape 3B — Chine\n\nExcellent ! 🇨🇳\n\nE-TAWJIHI propose un accompagnement complet pour les études en Chine, incluant :\n• Sélection d\'universités partenaires\n• Procédure CSCA\n• Préparation des bourses (possibles jusqu\'à 100 %)\n• Suivi complet du dossier d\'admission et visa',
    });

    flow.push({
      id: 'china_investQuality',
      label: '📈 Le budget minimum pour étudier en Chine est d\'environ 30 000 Dhs/an. Souhaites-tu investir sur la qualité de ton accompagnement ?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Oui' },
        { value: 'no', label: 'Non' },
      ],
    });

    flow.push({
      id: 'china_helpDossier',
      label: '💬 Souhaites-tu qu\'on t\'aide à préparer ton dossier d\'admission et la procédure CSCA ?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Oui' },
        { value: 'no', label: 'Non' },
        { value: 'more_info', label: 'Je veux plus d\'informations' },
      ],
    });

    flow.push({
      id: 'china_budgetType',
      label: '💸 As-tu un budget fixe ou souhaites-tu candidater pour une bourse ?',
      type: 'select',
      options: [
        { value: 'fixed', label: 'Budget fixe' },
        { value: 'scholarship', label: 'Candidater pour une bourse' },
      ],
    });
  }

  if (hasMorocco) {
    flow.push({
      id: 'step3c_header',
      type: 'info',
      content: '🇲🇦 Étape 3C — Maroc\n\nTrès bien ! 🇲🇦\n\nE-TAWJIHI t\'accompagne dans la procédure d\'inscription aux 75 écoles publiques marocaines, ainsi que dans les écoles privées partenaires si tu souhaites plus de choix.',
    });

    flow.push({
      id: 'morocco_helpDossier',
      label: '🧾 Notre service est payant. Souhaites-tu qu\'on s\'occupe de ton dossier et de ton suivi jusqu\'à l\'inscription finale ?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Oui' },
        { value: 'no', label: 'Non' },
      ],
    });

    flow.push({
      id: 'morocco_schoolType',
      label: '💬 Préfères-tu qu\'on t\'oriente vers :',
      type: 'select',
      options: [
        { value: 'public', label: 'Les écoles publiques marocaines' },
        { value: 'private', label: 'Les écoles privées' },
        { value: 'both', label: 'Les deux options' },
      ],
    });

    flow.push({
      id: 'morocco_budget',
      label: '💸 As-tu déjà une idée du budget annuel que tu peux investir pour tes études au Maroc ? (en Dhs)',
      type: 'select',
      options: [
        { value: 'under_20k', label: '-20 000 Dhs' },
        { value: '20_50k', label: '20-50 000 Dhs' },
        { value: '50_100k', label: '50-100 000 Dhs' },
        { value: 'over_100k', label: '+100 000 Dhs' },
      ],
    });
  }

  // ÉTAPE 4 - Finalisation
  flow.push({
    id: 'step4_header',
    type: 'info',
    content: '💬 Étape 4 — Finalisation et motivation',
  });

  flow.push({
    id: 'motivation',
    label: 'Pour terminer, quelle est ta motivation principale ?',
    type: 'select',
    options: [
      { value: 'job', label: 'Trouver un bon emploi' },
      { value: 'abroad', label: 'Étudier à l\'étranger' },
      { value: 'passion', label: 'Suivre ma passion' },
      { value: 'skills', label: 'Améliorer mes compétences' },
    ],
  });

  flow.push({
    id: 'contactWhatsApp',
    label: 'Souhaites-tu qu\'un conseiller E-TAWJIHI te contacte sur WhatsApp pour t\'expliquer les démarches ?',
    type: 'select',
    options: [
      { value: 'yes', label: 'Oui' },
      { value: 'no', label: 'Non' },
    ],
  });

  // Conditionnel si contact souhaité
  if (answers.contactWhatsApp === 'yes') {
    flow.push({
      id: 'contactTime',
      label: '📅 À quelle heure souhaites-tu être contacté(e) ?',
      type: 'select',
      options: [
        { value: '12_14', label: '12h-14h' },
        { value: '17_20', label: '17h-20h' },
        { value: 'other', label: 'Autre créneau' },
      ],
    });
  }

  // Question finale - SEULEMENT après contactTime si WhatsApp = yes, sinon après contactWhatsApp
  // Vérifier qu'on a bien répondu à contactTime si contactWhatsApp = yes
  const hasAnsweredContactTime = answers.contactWhatsApp === 'yes' ? answers.contactTime !== undefined : true;
  
  if (hasAnsweredContactTime) {
    flow.push({
      id: 'userType',
      label: 'Es-tu l\'étudiant ou le tuteur ?',
      type: 'select',
      options: [
        { value: 'student', label: 'Étudiant' },
        { value: 'tutor', label: 'Tuteur' },
      ],
    });
  }

  return flow;
};

// Structure statique des questions du test de diagnostic (50+ questions)
const buildDiagnosticQuestions = () => {
  const questions = [];
  let questionId = 1;

  // CATÉGORIE : Academic (10 questions)
  questions.push({ id: questionId++, category: 'academic', questionText: 'Quel est ton niveau d\'étude actuel ?', type: 'select', options: [
    { value: 'terminal', label: 'Terminale', score: 3 },
    { value: 'bac', label: 'Bac', score: 5 },
    { value: 'bac1', label: 'Bac+1', score: 6 },
    { value: 'bac2', label: 'Bac+2', score: 7 },
    { value: 'licence', label: 'Licence', score: 8 },
    { value: 'master', label: 'Master', score: 9 },
  ]});
  
  questions.push({ id: questionId++, category: 'academic', questionText: 'Quelle est ta moyenne générale au baccalauréat ?', type: 'select', options: [
    { value: 'under_12', label: 'Moins de 12/20', score: 2 },
    { value: '12_14', label: '12-14/20', score: 5 },
    { value: '14_16', label: '14-16/20', score: 7 },
    { value: '16_18', label: '16-18/20', score: 9 },
    { value: 'over_18', label: 'Plus de 18/20', score: 10 },
  ]});

  questions.push({ id: questionId++, category: 'academic', questionText: 'Quelle est ta filière du baccalauréat ?', type: 'select', options: [
    { value: 'sciences_math', label: 'Sciences Mathématiques', score: 8 },
    { value: 'sciences_physiques', label: 'Sciences Physiques', score: 8 },
    { value: 'sciences_life', label: 'Sciences de la Vie', score: 7 },
    { value: 'economie', label: 'Économie', score: 6 },
    { value: 'lettres', label: 'Lettres', score: 5 },
    { value: 'other', label: 'Autre', score: 5 },
  ]});

  questions.push({ id: questionId++, category: 'academic', questionText: 'Quelles sont tes matières préférées ?', type: 'multiselect', options: [
    { value: 'mathematics', label: 'Mathématiques', score: 8 },
    { value: 'physics', label: 'Physique', score: 8 },
    { value: 'chemistry', label: 'Chimie', score: 7 },
    { value: 'biology', label: 'Biologie', score: 7 },
    { value: 'computer', label: 'Informatique', score: 8 },
    { value: 'languages', label: 'Langues', score: 6 },
    { value: 'economics', label: 'Économie', score: 6 },
  ]});

  questions.push({ id: questionId++, category: 'academic', questionText: 'Comment évalues-tu ta capacité à travailler en équipe ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'academic', questionText: 'Combien d\'heures par jour consacres-tu à tes études en dehors des cours ?', type: 'select', options: [
    { value: 'under_2', label: 'Moins de 2h', score: 3 },
    { value: '2_4', label: '2-4h', score: 6 },
    { value: '4_6', label: '4-6h', score: 8 },
    { value: 'over_6', label: 'Plus de 6h', score: 9 },
  ]});

  questions.push({ id: questionId++, category: 'academic', questionText: 'As-tu déjà suivi des cours ou formations supplémentaires ?', type: 'multiselect', options: [
    { value: 'cours_particuliers', label: 'Cours particuliers', score: 5 },
    { value: 'preparation_bac', label: 'Préparation au bac', score: 6 },
    { value: 'langues', label: 'Cours de langues', score: 7 },
    { value: 'none', label: 'Aucune', score: 4 },
  ]});

  questions.push({ id: questionId++, category: 'academic', questionText: 'Comment te sens-tu face aux examens et évaluations ?', type: 'select', options: [
    { value: 'very_stressed', label: 'Très stressé(e)', score: 3 },
    { value: 'stressed', label: 'Stressé(e)', score: 5 },
    { value: 'calm', label: 'Calme', score: 7 },
    { value: 'very_calm', label: 'Très calme', score: 9 },
  ]});

  questions.push({ id: questionId++, category: 'academic', questionText: 'Quel est ton objectif académique principal ?', type: 'select', options: [
    { value: 'excellence', label: 'Atteindre l\'excellence académique', score: 9 },
    { value: 'pass', label: 'Obtenir mon diplôme', score: 6 },
    { value: 'learn', label: 'Apprendre de nouvelles choses', score: 8 },
    { value: 'career', label: 'Préparer ma carrière', score: 7 },
  ]});

  questions.push({ id: questionId++, category: 'academic', questionText: 'As-tu déjà participé à des projets académiques ou concours ?', type: 'select', options: [
    { value: 'yes_many', label: 'Oui, plusieurs fois', score: 9 },
    { value: 'yes_few', label: 'Oui, quelques fois', score: 7 },
    { value: 'no', label: 'Non', score: 4 },
  ]});

  // CATÉGORIE : Career (10 questions)
  questions.push({ id: questionId++, category: 'career', questionText: 'Quel domaine professionnel t\'intéresse le plus ?', type: 'multiselect', options: [
    { value: 'engineering', label: 'Ingénierie', score: 8 },
    { value: 'medicine', label: 'Médecine', score: 9 },
    { value: 'business', label: 'Commerce/Gestion', score: 7 },
    { value: 'it', label: 'Informatique', score: 8 },
    { value: 'law', label: 'Droit', score: 6 },
    { value: 'arts', label: 'Arts/Lettres', score: 5 },
    { value: 'education', label: 'Enseignement', score: 6 },
  ]});

  questions.push({ id: questionId++, category: 'career', questionText: 'Dans quel type d\'environnement professionnel te vois-tu ?', type: 'select', options: [
    { value: 'corporate', label: 'Entreprise/Corporation', score: 7 },
    { value: 'startup', label: 'Start-up/Innovation', score: 8 },
    { value: 'public', label: 'Secteur public', score: 6 },
    { value: 'research', label: 'Recherche/Université', score: 8 },
    { value: 'freelance', label: 'Travail indépendant', score: 7 },
  ]});

  questions.push({ id: questionId++, category: 'career', questionText: 'Quel est ton objectif de carrière à 5 ans ?', type: 'select', options: [
    { value: 'manager', label: 'Devenir manager/Chef d\'équipe', score: 8 },
    { value: 'expert', label: 'Devenir expert dans mon domaine', score: 9 },
    { value: 'entrepreneur', label: 'Créer ma propre entreprise', score: 8 },
    { value: 'travel', label: 'Travailler à l\'étranger', score: 7 },
    { value: 'balance', label: 'Équilibre travail/vie personnelle', score: 6 },
  ]});

  questions.push({ id: questionId++, category: 'career', questionText: 'Quelle importance accordes-tu au salaire dans ton choix de carrière ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'career', questionText: 'Es-tu intéressé(e) par le leadership et la gestion d\'équipe ?', type: 'select', options: [
    { value: 'very', label: 'Beaucoup', score: 9 },
    { value: 'somewhat', label: 'Un peu', score: 6 },
    { value: 'not_really', label: 'Pas vraiment', score: 4 },
  ]});

  questions.push({ id: questionId++, category: 'career', questionText: 'Préfères-tu un travail stable ou un travail avec des défis variés ?', type: 'select', options: [
    { value: 'stable', label: 'Travail stable', score: 5 },
    { value: 'varied', label: 'Défis variés', score: 8 },
    { value: 'both', label: 'Les deux', score: 7 },
  ]});

  questions.push({ id: questionId++, category: 'career', questionText: 'As-tu déjà une idée précise de ton métier de rêve ?', type: 'select', options: [
    { value: 'yes_precise', label: 'Oui, très précise', score: 9 },
    { value: 'yes_vague', label: 'Oui, mais vague', score: 6 },
    { value: 'no', label: 'Non, pas encore', score: 4 },
  ]});

  questions.push({ id: questionId++, category: 'career', questionText: 'Quelle importance accordes-tu à la reconnaissance professionnelle ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'career', questionText: 'Serais-tu prêt(e) à déménager pour une opportunité professionnelle ?', type: 'select', options: [
    { value: 'yes_anywhere', label: 'Oui, n\'importe où', score: 9 },
    { value: 'yes_certain', label: 'Oui, dans certains pays', score: 7 },
    { value: 'no', label: 'Non', score: 3 },
  ]});

  questions.push({ id: questionId++, category: 'career', questionText: 'Comment évalues-tu ton ambition professionnelle ?', type: 'scale', options: []});

  // CATÉGORIE : Personality (10 questions)
  questions.push({ id: questionId++, category: 'personality', questionText: 'Comment te décrirais-tu ?', type: 'multiselect', options: [
    { value: 'analytical', label: 'Analytique', score: 7 },
    { value: 'creative', label: 'Créatif(ve)', score: 6 },
    { value: 'leadership', label: 'Leader', score: 8 },
    { value: 'team_player', label: 'Esprit d\'équipe', score: 7 },
    { value: 'independent', label: 'Indépendant(e)', score: 6 },
    { value: 'detail_oriented', label: 'Méticuleux(se)', score: 7 },
    { value: 'adaptable', label: 'Adaptable', score: 8 },
  ]});

  questions.push({ id: questionId++, category: 'personality', questionText: 'Préfères-tu travailler seul(e) ou en équipe ?', type: 'select', options: [
    { value: 'alone', label: 'Seul(e)', score: 5 },
    { value: 'team', label: 'En équipe', score: 7 },
    { value: 'both', label: 'Les deux selon le contexte', score: 8 },
  ]});

  questions.push({ id: questionId++, category: 'personality', questionText: 'Comment réagis-tu face à l\'échec ?', type: 'select', options: [
    { value: 'give_up', label: 'Je tends à abandonner', score: 2 },
    { value: 'learn', label: 'J\'apprends de mes erreurs', score: 8 },
    { value: 'persist', label: 'Je persiste jusqu\'au succès', score: 9 },
    { value: 'analyze', label: 'J\'analyse et je réessaie', score: 8 },
  ]});

  questions.push({ id: questionId++, category: 'personality', questionText: 'Comment évalues-tu ta confiance en toi ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'personality', questionText: 'Es-tu plutôt introverti(e) ou extraverti(e) ?', type: 'select', options: [
    { value: 'very_introvert', label: 'Très introverti(e)', score: 4 },
    { value: 'introvert', label: 'Plutôt introverti(e)', score: 5 },
    { value: 'balanced', label: 'Équilibré(e)', score: 7 },
    { value: 'extrovert', label: 'Plutôt extraverti(e)', score: 7 },
    { value: 'very_extrovert', label: 'Très extraverti(e)', score: 8 },
  ]});

  questions.push({ id: questionId++, category: 'personality', questionText: 'Comment gères-tu le stress ?', type: 'select', options: [
    { value: 'poorly', label: 'Pas très bien', score: 3 },
    { value: 'okay', label: 'Assez bien', score: 6 },
    { value: 'well', label: 'Bien', score: 8 },
    { value: 'very_well', label: 'Très bien', score: 9 },
  ]});

  questions.push({ id: questionId++, category: 'personality', questionText: 'Préfères-tu la routine ou les nouveautés ?', type: 'select', options: [
    { value: 'routine', label: 'La routine', score: 5 },
    { value: 'novelty', label: 'Les nouveautés', score: 8 },
    { value: 'both', label: 'Un mélange des deux', score: 7 },
  ]});

  questions.push({ id: questionId++, category: 'personality', questionText: 'Comment évalues-tu ta capacité d\'adaptation ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'personality', questionText: 'Es-tu plutôt organisé(e) ou spontané(e) ?', type: 'select', options: [
    { value: 'very_organized', label: 'Très organisé(e)', score: 8 },
    { value: 'organized', label: 'Organisé(e)', score: 7 },
    { value: 'balanced', label: 'Équilibré(e)', score: 6 },
    { value: 'spontaneous', label: 'Spontané(e)', score: 5 },
  ]});

  questions.push({ id: questionId++, category: 'personality', questionText: 'Comment évalues-tu ta motivation personnelle ?', type: 'scale', options: []});

  // CATÉGORIE : Skills (10 questions)
  questions.push({ id: questionId++, category: 'skills', questionText: 'Évalue ta maîtrise de l\'anglais', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'skills', questionText: 'Évalue ta maîtrise du français', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'skills', questionText: 'Quelles compétences techniques maîtrises-tu ?', type: 'multiselect', options: [
    { value: 'programming', label: 'Programmation', score: 8 },
    { value: 'design', label: 'Design', score: 6 },
    { value: 'marketing', label: 'Marketing', score: 6 },
    { value: 'data', label: 'Analyse de données', score: 7 },
    { value: 'languages', label: 'Langues étrangères', score: 7 },
    { value: 'none', label: 'Aucune technique spécifique', score: 3 },
  ]});

  questions.push({ id: questionId++, category: 'skills', questionText: 'Comment évalues-tu tes compétences en communication ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'skills', questionText: 'As-tu des compétences en leadership ou gestion d\'équipe ?', type: 'select', options: [
    { value: 'yes_experienced', label: 'Oui, j\'ai de l\'expérience', score: 9 },
    { value: 'yes_basic', label: 'Oui, mais basique', score: 6 },
    { value: 'no', label: 'Non', score: 3 },
  ]});

  questions.push({ id: questionId++, category: 'skills', questionText: 'Comment évalues-tu ta capacité à résoudre des problèmes complexes ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'skills', questionText: 'Es-tu à l\'aise avec la présentation devant un public ?', type: 'select', options: [
    { value: 'very', label: 'Très à l\'aise', score: 9 },
    { value: 'somewhat', label: 'Assez à l\'aise', score: 6 },
    { value: 'not', label: 'Pas très à l\'aise', score: 3 },
  ]});

  questions.push({ id: questionId++, category: 'skills', questionText: 'Comment évalues-tu tes compétences numériques (informatique, outils digitaux) ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'skills', questionText: 'As-tu des certifications ou diplômes supplémentaires ?', type: 'select', options: [
    { value: 'yes_many', label: 'Oui, plusieurs', score: 8 },
    { value: 'yes_few', label: 'Oui, quelques-uns', score: 6 },
    { value: 'no', label: 'Non', score: 4 },
  ]});

  questions.push({ id: questionId++, category: 'skills', questionText: 'Comment évalues-tu ta capacité d\'apprentissage rapide ?', type: 'scale', options: []});

  // CATÉGORIE : Preferences (10 questions)
  questions.push({ id: questionId++, category: 'preferences', questionText: 'Dans quel(s) pays souhaites-tu étudier ?', type: 'multiselect', options: [
    { value: 'france', label: 'France', score: 8 },
    { value: 'china', label: 'Chine', score: 7 },
    { value: 'morocco', label: 'Maroc', score: 6 },
    { value: 'canada', label: 'Canada', score: 9 },
    { value: 'usa', label: 'États-Unis', score: 9 },
    { value: 'uk', label: 'Royaume-Uni', score: 8 },
    { value: 'germany', label: 'Allemagne', score: 7 },
  ]});

  questions.push({ id: questionId++, category: 'preferences', questionText: 'Quel type d\'établissement préfères-tu ?', type: 'select', options: [
    { value: 'public', label: 'Public', score: 7 },
    { value: 'private', label: 'Privé', score: 6 },
    { value: 'both', label: 'Les deux', score: 7 },
  ]});

  questions.push({ id: questionId++, category: 'preferences', questionText: 'Quel est ton budget annuel approximatif pour les études ?', type: 'select', options: [
    { value: 'under_20k', label: 'Moins de 20 000 Dhs', score: 4 },
    { value: '20_50k', label: '20 000 - 50 000 Dhs', score: 6 },
    { value: '50_100k', label: '50 000 - 100 000 Dhs', score: 7 },
    { value: 'over_100k', label: 'Plus de 100 000 Dhs', score: 8 },
  ]});

  questions.push({ id: questionId++, category: 'preferences', questionText: 'Préfères-tu étudier dans une grande ville ou une petite ville ?', type: 'select', options: [
    { value: 'big_city', label: 'Grande ville', score: 7 },
    { value: 'small_city', label: 'Petite ville', score: 6 },
    { value: 'no_preference', label: 'Aucune préférence', score: 5 },
  ]});

  questions.push({ id: questionId++, category: 'preferences', questionText: 'Es-tu intéressé(e) par des programmes en anglais, français ou les deux ?', type: 'multiselect', options: [
    { value: 'english', label: 'Anglais', score: 8 },
    { value: 'french', label: 'Français', score: 7 },
    { value: 'both', label: 'Les deux', score: 8 },
  ]});

  questions.push({ id: questionId++, category: 'preferences', questionText: 'Quelle importance accordes-tu au classement de l\'université ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'preferences', questionText: 'As-tu besoin d\'un logement étudiant ?', type: 'select', options: [
    { value: 'yes', label: 'Oui', score: 7 },
    { value: 'no', label: 'Non', score: 5 },
    { value: 'maybe', label: 'Peut-être', score: 6 },
  ]});

  questions.push({ id: questionId++, category: 'preferences', questionText: 'Préfères-tu un programme généraliste ou spécialisé ?', type: 'select', options: [
    { value: 'general', label: 'Généraliste', score: 6 },
    { value: 'specialized', label: 'Spécialisé', score: 8 },
    { value: 'both', label: 'Les deux selon le contexte', score: 7 },
  ]});

  questions.push({ id: questionId++, category: 'preferences', questionText: 'Quelle importance accordes-tu aux opportunités de stage pendant tes études ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'preferences', questionText: 'Es-tu intéressé(e) par des programmes avec des échanges internationaux ?', type: 'select', options: [
    { value: 'yes', label: 'Oui, beaucoup', score: 8 },
    { value: 'maybe', label: 'Peut-être', score: 6 },
    { value: 'no', label: 'Non', score: 4 },
  ]});

  // CATÉGORIE : Motivation (5 questions)
  questions.push({ id: questionId++, category: 'motivation', questionText: 'Quelle est ta motivation principale pour poursuivre des études ?', type: 'select', options: [
    { value: 'career', label: 'Carrière professionnelle', score: 8 },
    { value: 'passion', label: 'Passion pour le domaine', score: 9 },
    { value: 'salary', label: 'Salaire élevé', score: 6 },
    { value: 'family', label: 'Attentes familiales', score: 5 },
    { value: 'travel', label: 'Voyage/Découverte', score: 7 },
    { value: 'skills', label: 'Développement de compétences', score: 8 },
  ]});

  questions.push({ id: questionId++, category: 'motivation', questionText: 'Comment évalues-tu ta motivation générale pour les études ?', type: 'scale', options: []});

  questions.push({ id: questionId++, category: 'motivation', questionText: 'Qu\'est-ce qui te motive le plus dans tes études ?', type: 'multiselect', options: [
    { value: 'challenge', label: 'Le défi intellectuel', score: 8 },
    { value: 'knowledge', label: 'L\'acquisition de connaissances', score: 8 },
    { value: 'recognition', label: 'La reconnaissance', score: 6 },
    { value: 'future', label: 'Mon avenir professionnel', score: 8 },
    { value: 'satisfaction', label: 'La satisfaction personnelle', score: 7 },
  ]});

  questions.push({ id: questionId++, category: 'motivation', questionText: 'As-tu des modèles ou mentors qui t\'inspirent ?', type: 'select', options: [
    { value: 'yes_many', label: 'Oui, plusieurs', score: 8 },
    { value: 'yes_few', label: 'Oui, quelques-uns', score: 6 },
    { value: 'no', label: 'Non', score: 4 },
  ]});

  questions.push({ id: questionId++, category: 'motivation', questionText: 'Comment évalues-tu ta détermination à réussir tes études ?', type: 'scale', options: []});

  return questions;
};

const DIAGNOSTIC_QUESTIONS = buildDiagnosticQuestions();

function InputRenderer({ question, value, onChange, onQuickSelect, onAnswer }) {
  if (question.type === 'select') {
    return (
      <div className="flex flex-wrap gap-2">
        {question.options.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`px-3 py-1.5 rounded-full text-sm border transition ${value === opt.value ? 'bg-blue-800 text-white border-blue-800 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            onClick={() => {
              onChange?.(opt.value);
              onAnswer?.(opt.value);
              onQuickSelect?.();
            }}
          >{opt.label}</button>
        ))}
      </div>
    );
  }
  if (question.type === 'multiselect') {
    return (
      <div className="flex flex-wrap gap-2">
        {question.options.map(opt => {
          const active = Array.isArray(value) && value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              className={`px-3 py-1.5 rounded-full text-sm border transition ${active ? 'bg-blue-800 text-white border-blue-800 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              onClick={() => {
                const arr = Array.isArray(value) ? [...value] : [];
                const idx = arr.indexOf(opt.value);
                if (idx >= 0) arr.splice(idx, 1); else arr.push(opt.value);
                onChange(arr);
              }}
            >{opt.label}</button>
          );
        })}
        {Array.isArray(value) && value.length > 0 && (
          <button
            type="button"
            onClick={() => onAnswer?.(value)}
            className="px-4 py-1.5 rounded-full text-sm bg-green-600 text-white hover:bg-green-700 transition-colors mt-2"
          >
            ✓ Valider
          </button>
        )}
      </div>
    );
  }
  if (question.type === 'scale') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>1</span>
          <span>10</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <button
              key={num}
              type="button"
              className={`flex-1 min-w-[40px] py-2 rounded-lg border-2 font-semibold text-sm transition-all ${
                value === num
                  ? 'border-blue-600 bg-blue-600 text-white scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
              onClick={() => {
                onChange(num);
                onAnswer?.(num);
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (question.type === 'number') {
    return (
      <div className="space-y-1">
        {question.note && (
          <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">{question.note}</div>
        )}
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
            {question.label?.includes('EUR') ? 'EUR' : question.label?.includes('Dhs') ? 'Dhs' : 'EUR'}
          </span>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ex: 8000"
          />
        </div>
      </div>
    );
  }
  return (
    <input
      type={question.type === 'email' ? 'email' : question.type === 'tel' ? 'tel' : 'text'}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.type === 'email' ? 'exemple@email.com' : question.type === 'tel' ? '+212 6XX XXX XXX' : ''}
    />
  );
}

export default function EAdvisorWidget({ language = 'fr' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [establishments, setEstablishments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searching, setSearching] = useState(false);
  // États pour le test de diagnostic
  const [isDiagnosticMode, setIsDiagnosticMode] = useState(false);
  const [diagnosticQuestionIndex, setDiagnosticQuestionIndex] = useState(0);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
  const [diagnosticGenerating, setDiagnosticGenerating] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const scrollRef = useRef(null);

  const questionFlow = useMemo(() => buildQuestionFlow(answers), [answers]);
  const currentQuestion = questionFlow[currentQuestionIndex];

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages || []);
        setAnswers(parsed.answers || {});
        setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
      } else {
        const initialFlow = buildQuestionFlow({});
        let index = 0;
        const initialMessages = [
          { role: 'assistant', content: '👋 Bonjour ! Bienvenue sur E-DVISOR. Je vais te poser quelques questions pour mieux comprendre tes besoins et t\'orienter.' }
        ];
        
        // Afficher le header si présent
        if (initialFlow[index]?.type === 'info') {
          initialMessages.push({ role: 'assistant', content: initialFlow[index].content });
          index = 1;
        }
        
        // Afficher la première question
        if (initialFlow[index]?.label) {
          initialMessages.push({ role: 'assistant', content: initialFlow[index].label });
        }
        
        setMessages(initialMessages);
        setCurrentQuestionIndex(index);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ messages, answers, currentQuestionIndex }));
  }, [messages, answers, currentQuestionIndex]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open, typing]);

  // Rebuild flow when answers change (for conditional logic)
  useEffect(() => {
    const newFlow = buildQuestionFlow(answers);
    if (currentQuestionIndex >= newFlow.length) {
      return;
    }
    // Recalculate flow index if needed
  }, [answers]);

  const pushAssistant = (text) => {
    setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    scrollToBottom();
  };

  const pushUser = (text) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    scrollToBottom();
  };

  // Détecte une demande de recherche d'établissements ou de programmes dans un message
  const detectSearchRequest = (text) => {
    const lowerText = text.toLowerCase();
    const searchKeywords = [
      'cherche', 'recherche', 'trouve', 'recommand', 'suggère', 'université', 'école', 'établissement',
      'programme', 'établissements', 'universités', 'écoles', 'programmes', 'formation', 'cursus'
    ];
    
    const hasSearchKeyword = searchKeywords.some(keyword => lowerText.includes(keyword));
    if (!hasSearchKeyword) return null;

    // Déterminer si c'est une recherche de programmes ou d'établissements
    const isProgramSearch = lowerText.includes('programme') || 
                           lowerText.includes('formation') || 
                           lowerText.includes('cursus') ||
                           lowerText.includes('master') ||
                           lowerText.includes('licence') ||
                           lowerText.includes('bachelor') ||
                           lowerText.includes('degree');

    // Extraire les filtres potentiels
    const filters = {
      type: isProgramSearch ? 'program' : 'establishment'
    };
    
    // Pays
    if (lowerText.includes('france') || lowerText.includes('français')) filters.country = 'France';
    if (lowerText.includes('chine') || lowerText.includes('chinois')) filters.country = 'China';
    if (lowerText.includes('maroc') || lowerText.includes('marocain')) filters.country = 'Morocco';
    
    // Domaine/Subject (recherche basique)
    const subjects = ['informatique', 'médecine', 'ingénierie', 'commerce', 'droit', 'sciences'];
    subjects.forEach(subject => {
      if (lowerText.includes(subject.toLowerCase())) {
        filters.search = subject;
      }
    });

    return Object.keys(filters).length > 1 ? filters : { ...filters, search: text }; // Si pas de filtres spécifiques, utiliser le texte complet
  };

  // Recherche d'établissements avec filtres
  const searchEstablishments = async (filters) => {
    if (!filters || Object.keys(filters).length === 0) return;
    
    setSearching(true);
    try {
      const response = await eadvisorService.searchEstablishments(filters);
      if (response.success && response.data && response.data.length > 0) {
        setEstablishments(response.data);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Voici ${response.data.length} établissement${response.data.length > 1 ? 's' : ''} qui pourraient t'intéresser :`,
          establishments: response.data
        }]);
      } else {
        pushAssistant('Je n\'ai trouvé aucun établissement correspondant à ta recherche. Essaie avec d\'autres critères.');
      }
    } catch (error) {
      console.error('Error searching establishments:', error);
      pushAssistant('Erreur lors de la recherche. Réessaie plus tard.');
    } finally {
      setSearching(false);
      scrollToBottom();
    }
  };

  // Recherche de programmes avec filtres
  const searchPrograms = async (filters) => {
    if (!filters || Object.keys(filters).length === 0) return;
    
    setSearching(true);
    try {
      const response = await eadvisorService.searchPrograms(filters);
      if (response.success && response.data && response.data.length > 0) {
        setPrograms(response.data);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Voici ${response.data.length} programme${response.data.length > 1 ? 's' : ''} qui pourraient t'intéresser :`,
          programs: response.data
        }]);
      } else {
        pushAssistant('Je n\'ai trouvé aucun programme correspondant à ta recherche. Essaie avec d\'autres critères.');
      }
    } catch (error) {
      console.error('Error searching programs:', error);
      pushAssistant('Erreur lors de la recherche. Réessaie plus tard.');
    } finally {
      setSearching(false);
      scrollToBottom();
    }
  };

  // Fonction pour démarrer le test de diagnostic
  const startDiagnosticTest = () => {
    setIsDiagnosticMode(true);
    setDiagnosticQuestionIndex(0);
    setDiagnosticAnswers({});
    setDiagnosticResult(null);
    
    // Afficher le message de démarrage
    pushAssistant('🔍 Excellent ! Je vais te faire passer un test de diagnostic complet avec plus de 50 questions. Cela m\'aidera à mieux comprendre ton profil et à te donner des recommandations personnalisées.\n\nLe test couvre plusieurs aspects : académique, carrière, personnalité, compétences, préférences et motivation.\n\nCommençons !');
    
    // Afficher la première question après un court délai
    setTimeout(() => {
      showDiagnosticQuestion(0);
    }, 1500);
  };

  // Afficher une question du diagnostic
  const showDiagnosticQuestion = (index) => {
    if (index >= DIAGNOSTIC_QUESTIONS.length) {
      // Toutes les questions sont complétées, générer le diagnostic
      generateDiagnosticResult();
      return;
    }

    const question = DIAGNOSTIC_QUESTIONS[index];
    const categoryLabel = {
      'academic': '📚 Académique',
      'career': '💼 Carrière',
      'personality': '🎭 Personnalité',
      'skills': '🛠️ Compétences',
      'preferences': '🌍 Préférences',
      'motivation': '💪 Motivation'
    };

    // Afficher le header de catégorie si c'est la première question de la catégorie
    const previousQuestion = index > 0 ? DIAGNOSTIC_QUESTIONS[index - 1] : null;
    setTyping(true);
    
    setTimeout(() => {
      setTyping(false);
      
      if (!previousQuestion || previousQuestion.category !== question.category) {
        // Nouvelle catégorie
        pushAssistant(`${categoryLabel[question.category] || question.category}\n\n${question.questionText}\n\n📊 Question ${index + 1}/${DIAGNOSTIC_QUESTIONS.length}`);
      } else {
        // Même catégorie
        pushAssistant(`${question.questionText}\n\n📊 Question ${index + 1}/${DIAGNOSTIC_QUESTIONS.length}`);
      }
      
      setDiagnosticQuestionIndex(index);
      scrollToBottom();
    }, 500);
  };

  // Gérer une réponse au test de diagnostic
  const handleDiagnosticAnswer = async (answer) => {
    const currentQuestion = DIAGNOSTIC_QUESTIONS[diagnosticQuestionIndex];
    if (!currentQuestion) return;

    // Afficher la réponse de l'utilisateur
    const answerText = Array.isArray(answer) 
      ? answer.map(v => {
          const option = currentQuestion.options?.find(o => o.value === v);
          return option ? option.label : v;
        }).join(', ')
      : currentQuestion.type === 'scale'
      ? `${answer}/10`
      : currentQuestion.options?.find(o => o.value === answer)?.label || answer;
    
    pushUser(answerText);

    // Sauvegarder la réponse localement
    const newAnswers = { ...diagnosticAnswers, [currentQuestion.id]: answer };
    setDiagnosticAnswers(newAnswers);

    // Sauvegarder via l'API
    try {
      await diagnosticService.saveAnswer(currentQuestion.id, answer);
    } catch (error) {
      console.error('Error saving diagnostic answer:', error);
      // Continuer même si la sauvegarde échoue
    }

    // Passer à la question suivante avec un délai pour l'animation
    setTimeout(() => {
      const nextIndex = diagnosticQuestionIndex + 1;
      if (nextIndex < DIAGNOSTIC_QUESTIONS.length) {
        showDiagnosticQuestion(nextIndex);
      } else {
        // Toutes les questions sont complétées
        generateDiagnosticResult();
      }
    }, 800);
  };

  // Générer le diagnostic final
  const generateDiagnosticResult = async () => {
    setDiagnosticGenerating(true);
    pushAssistant('✅ Excellent ! Tu as complété toutes les questions. Je génère ton diagnostic personnalisé...\n\n⏳ Cela peut prendre quelques instants.');
    
    try {
      const response = await diagnosticService.generateDiagnostic();
      
      if (response.success && response.data) {
        setDiagnosticResult(response.data);
        pushAssistant('🎯 Voici ton diagnostic complet :\n\n' + response.data.diagnostic);
        
        // Afficher les scores
        if (response.data.scores) {
          setTimeout(() => {
            const scoresText = Object.entries(response.data.scores)
              .map(([category, score]) => {
                const labels = {
                  'academic': '📚 Académique',
                  'career': '💼 Carrière',
                  'personality': '🎭 Personnalité',
                  'skills': '🛠️ Compétences',
                  'preferences': '🌍 Préférences',
                  'motivation': '💪 Motivation'
                };
                return `${labels[category] || category}: *${score.toFixed(0)}/100*`;
              })
              .join('\n');
            
            pushAssistant('📊 Scores par catégorie :\n\n' + scoresText);
          }, 1000);
        }
      } else {
        pushAssistant('Désolé, une erreur est survenue lors de la génération du diagnostic. Réessaie plus tard.');
      }
    } catch (error) {
      console.error('Error generating diagnostic:', error);
      pushAssistant('Désolé, une erreur est survenue lors de la génération du diagnostic. Réessaie plus tard.');
    } finally {
      setDiagnosticGenerating(false);
    }
  };

  // Fonction pour générer le slug d'un programme (similaire à EstablishmentsListing)
  const generateProgramSlug = (program) => {
    if (!program) return '';
    
    const establishmentName = program.establishment?.name || 'university';
    const programName = program.name || 'program';
    
    const establishmentSlug = establishmentName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const programSlug = programName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return `${establishmentSlug}/${programSlug}`;
  };

  const proceedNext = () => {
    // Rebuild flow with updated answers
    const newFlow = buildQuestionFlow(answers);
    let nextIndex = currentQuestionIndex + 1;

    // Skip info headers and add them as messages, then show next question
    while (nextIndex < newFlow.length && newFlow[nextIndex]?.type === 'info') {
      const headerContent = newFlow[nextIndex].content;
      nextIndex++; // Move past the header
      
      if (headerContent) {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          pushAssistant(headerContent);
          
          // After header, find and show next question
          if (nextIndex < newFlow.length) {
            const nextQ = newFlow[nextIndex];
            if (nextQ?.label) {
              setCurrentQuestionIndex(nextIndex);
              setTimeout(() => {
                pushAssistant(nextQ.label);
              }, 300);
            } else {
              // If next is also a header, continue
              proceedNext();
            }
          }
        }, 400);
        return;
      }
    }

    if (nextIndex < newFlow.length) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setCurrentQuestionIndex(nextIndex);
        const nextQ = newFlow[nextIndex];
        if (nextQ?.label) {
          pushAssistant(nextQ.label);
        }
      }, 350);
    } else {
      // Completed
      const prefs = buildPreferences(answers);
      localStorage.setItem('eadvisor_preferences', JSON.stringify(prefs));
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        pushAssistant('✅ Merci ! Nous avons toutes les informations nécessaires. Un conseiller E-TAWJIHI te contactera bientôt !');
        setIsCompleted(true);
      }, 400);
    }
  };

  const handleAnswer = (value) => {
    if (!currentQuestion || currentQuestion.type === 'info') return;
    const qid = currentQuestion.id;
    setAnswers(prev => {
      const updated = { ...prev, [qid]: value };
      return updated;
    });
    pushUser(formatAnswerPreview(currentQuestion, value));
    
    // Rebuild flow after answer to handle conditional logic
    setTimeout(() => {
      proceedNext();
    }, 200);
  };

  const handleRestart = () => {
    setMessages([
      { role: 'assistant', content: '👋 Repartons de zéro !' }
    ]);
    setAnswers({});
    setIsCompleted(false);
    const initialFlow = buildQuestionFlow({});
    let index = 0;
    
    // Afficher le header si présent
    if (initialFlow[index]?.type === 'info') {
      pushAssistant(initialFlow[index].content);
      index = 1;
    }
    
    // Afficher la première question
    setCurrentQuestionIndex(index);
    if (initialFlow[index]?.label) {
      setTimeout(() => {
        pushAssistant(initialFlow[index].label);
      }, 400);
    }
    scrollToBottom();
  };

  return (
    <div>
      <button
        type="button"
        aria-label="Open E-DVISOR"
        onClick={() => setOpen(!open)}
        className="fixed left-4 bottom-6 z-40 w-14 h-14 rounded-full bg-blue-800 text-white shadow-xl flex items-center justify-center hover:bg-blue-900 border border-white/20"
      >
        <Bot className="w-7 h-7 text-white" />
      </button>

      {open && (
        <div className="fixed left-4 bottom-24 z-40 w-[380px] max-w-[92vw] rounded-3xl shadow-2xl border border-gray-100 overflow-hidden bg-white">
          <div className="px-4 sm:px-6 py-3 bg-blue-800 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-white">E-DVISOR</h3>
                <p className="text-blue-100 text-[11px] sm:text-xs">AI Study Assistant</p>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm">Online</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 h-64 sm:h-80 overflow-y-auto bg-gray-50" ref={scrollRef}>
            {messages.map((m, idx) => (
              <div key={idx}>
                <div className={`mb-4 flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  {m.role === 'assistant' ? (
                    <div className="bg-white border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-md max-w-xs shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        <span className="text-xs font-medium text-gray-500">E-DVISOR</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap">
                        {formatWhatsAppText(m.content)}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-blue-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-br-md max-w-xs">
                      <p className="text-xs sm:text-sm text-white">{m.content}</p>
                    </div>
                  )}
                </div>
                
                {/* Afficher les établissements si présents dans le message */}
                {m.establishments && m.establishments.length > 0 && (
                  <div className="mb-4 space-y-2 max-w-xs">
                    {m.establishments.map((establishment) => (
                      <Link
                        key={establishment.id}
                        to={`/establishments/${establishment.slug || establishment.id}`}
                        className="block bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                      >
                        <div className="flex items-start gap-3">
                          {establishment.logo && (
                            <img
                              src={establishment.logo}
                              alt={establishment.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(establishment.name)}&size=48&background=3B82F6&color=fff`;
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">{establishment.name}</h4>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">
                                {establishment.city && `${establishment.city}, `}
                                {establishment.country}
                              </span>
                            </div>
                            {establishment.universityType && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {establishment.universityType}
                              </span>
                            )}
                            <div className="flex items-center mt-2 text-blue-600 text-xs">
                              <span>Voir les détails</span>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Afficher les programmes si présents dans le message */}
                {m.programs && m.programs.length > 0 && (
                  <div className="mb-4 space-y-2 max-w-xs">
                    {m.programs.map((program) => (
                      <Link
                        key={program.id}
                        to={`/${generateProgramSlug(program)}`}
                        className="block bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={program.establishment?.logo || program.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(program.establishment?.name || program.name)}&size=48&background=3B82F6&color=fff`}
                            alt={program.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(program.name)}&size=48&background=3B82F6&color=fff`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">{program.name}</h4>
                            <div className="text-xs text-gray-600 mt-1 truncate">
                              {program.establishment?.name || 'University'}
                            </div>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">
                                {program.establishment?.city && `${program.establishment.city}, `}
                                {program.establishment?.country || program.country}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {program.degree && (
                                <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                                  {program.degree}
                                </span>
                              )}
                              {program.duration && (
                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  {program.duration}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center mt-2 text-blue-600 text-xs">
                              <span>Voir les détails</span>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-md max-w-xs shadow-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '120ms' }}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '240ms' }}></span>
                  </span>
                </div>
              </div>
            )}

            {/* Afficher la question du diagnostic si en mode diagnostic - les inputs sont affichés dans une bulle séparée */}
            {isDiagnosticMode && !diagnosticGenerating && diagnosticQuestionIndex < DIAGNOSTIC_QUESTIONS.length && (
              <div className="mb-4">
                <div className="bg-white border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-md max-w-xs shadow-sm">
                  <InputRenderer
                    question={DIAGNOSTIC_QUESTIONS[diagnosticQuestionIndex]}
                    value={diagnosticAnswers[DIAGNOSTIC_QUESTIONS[diagnosticQuestionIndex]?.id]}
                    onChange={(val) => setDiagnosticAnswers({ ...diagnosticAnswers, [DIAGNOSTIC_QUESTIONS[diagnosticQuestionIndex]?.id]: val })}
                    onAnswer={handleDiagnosticAnswer}
                  />
                </div>
              </div>
            )}

            {/* Affichage du diagnostic généré */}
            {diagnosticResult && (
              <div className="mb-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 max-w-xs shadow-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Diagnostic Complet</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {formatWhatsAppText(diagnosticResult.diagnostic)}
                  </div>
                  {diagnosticResult.scores && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="text-xs font-semibold text-blue-900 mb-2">📊 Scores par catégorie</div>
                      <div className="space-y-1">
                        {Object.entries(diagnosticResult.scores).map(([category, score]) => {
                          const labels = {
                            'academic': '📚 Académique',
                            'career': '💼 Carrière',
                            'personality': '🎭 Personnalité',
                            'skills': '🛠️ Compétences',
                            'preferences': '🌍 Préférences',
                            'motivation': '💪 Motivation'
                          };
                          return (
                            <div key={category} className="flex justify-between text-xs">
                              <span className="text-gray-700">{labels[category] || category}</span>
                              <span className="font-semibold text-blue-600">{score.toFixed(0)}/100</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentQuestion && currentQuestion.type !== 'info' && !isCompleted && !isDiagnosticMode && (
              <div className="space-y-2">
                <InputRenderer
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  onChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }))}
                  onQuickSelect={() => {/* handled by onAnswer -> proceedNext */}}
                  onAnswer={(val) => handleAnswer(val)}
                />
                {currentQuestion.type !== 'select' && (
                  <div>
                    <button
                      onClick={() => {
                        const value = answers[currentQuestion.id];
                        // Pour multiselect, vérifier qu'au moins une option est sélectionnée
                        if (currentQuestion.type === 'multiselect') {
                          if (Array.isArray(value) && value.length > 0) {
                            handleAnswer(value);
                          }
                        } else if (value) {
                          handleAnswer(value);
                        }
                      }}
                      className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-800 text-white hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        currentQuestion.type === 'multiselect'
                          ? !Array.isArray(answers[currentQuestion.id]) || answers[currentQuestion.id].length === 0
                          : !answers[currentQuestion.id]
                      }
                    >Continuer</button>
                  </div>
                )}
              </div>
            )}

          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  id="eadvisor-chat-input"
                  placeholder={
                    isDiagnosticMode ? "Réponds à la question ci-dessus..." :
                    isCompleted ? "Posez-moi une question..." : 
                    "Demandez n'importe quoi à E-DVISOR..."
                  }
                  className="w-full bg-transparent text-sm focus:outline-none"
                  disabled={isDiagnosticMode || (!isCompleted && currentQuestion?.type !== 'text')}
                  onKeyDown={async (e) => {
                    const input = e.currentTarget;
                    const question = input.value.trim();
                    
                    if (e.key === 'Enter' && question) {
                      // Détecter si l'utilisateur demande le test de diagnostic
                      const lowerQuestion = question.toLowerCase();
                      if (lowerQuestion.includes('test') && (lowerQuestion.includes('diagnostic') || lowerQuestion.includes('complet') || lowerQuestion.includes('évaluation') || lowerQuestion.includes('evaluation'))) {
                        input.value = '';
                        startDiagnosticTest();
                        return;
                      }

                      // Si le questionnaire n'est pas terminé et c'est une question text, gérer normalement
                      if (!isCompleted && currentQuestion?.type === 'text') {
                        handleAnswer(question);
                        input.value = '';
                        return;
                      }
                      
                      // Si le questionnaire est terminé, envoyer à l'IA
                      if (isCompleted && !isDiagnosticMode) {
                        pushUser(question);
                        input.value = '';
                        input.disabled = true;
                        
                        setTyping(true);
                        try {
                          // Préparer l'historique de conversation
                          const conversationHistory = messages
                            .filter(m => m.role === 'assistant' || m.role === 'user')
                            .map(m => ({
                              role: m.role === 'assistant' ? 'assistant' : 'user',
                              content: m.content
                            }));
                          
                          // Appeler l'API Grok
                          const response = await eadvisorService.chat(
                            question,
                            conversationHistory,
                            answers
                          );
                          
                          if (response.success && response.response) {
                            const responseText = response.response.toLowerCase();
                            
                            // Détecter si l'utilisateur demande le test de diagnostic
                            if (responseText.includes('test') && (responseText.includes('diagnostic') || responseText.includes('complet') || responseText.includes('évaluation'))) {
                              startDiagnosticTest();
                            } else {
                              pushAssistant(response.response);
                              
                              // Détecter une demande de recherche dans la question ou la réponse
                              const searchFilters = detectSearchRequest(question) || detectSearchRequest(response.response);
                              if (searchFilters) {
                                setTimeout(() => {
                                  // Extraire le type et l'utiliser pour décider quoi chercher
                                  const searchType = searchFilters.type;
                                  const filtersWithoutType = { ...searchFilters };
                                  delete filtersWithoutType.type;
                                  
                                  if (searchType === 'program') {
                                    searchPrograms(filtersWithoutType);
                                  } else {
                                    searchEstablishments(filtersWithoutType);
                                  }
                                }, 500);
                              }
                            }
                          } else {
                            const errorMsg = response.error 
                              ? `Erreur: ${response.error}` 
                              : response.message || 'Erreur inconnue';
                            pushAssistant(`Désolé, je n'ai pas pu traiter ta question. ${errorMsg}`);
                            console.error('E-DVISOR Chat Error:', response);
                          }
                        } catch (error) {
                          console.error('Error calling Grok API:', error);
                          pushAssistant('Désolé, une erreur est survenue. Vérifie ta connexion et réessaie.');
                        } finally {
                          setTyping(false);
                          input.disabled = false;
                          input.focus();
                        }
                      }
                    }
                  }}
                />
              </div>
              <button
                className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isCompleted || searching || isDiagnosticMode}
                onClick={async () => {
                  const input = document.getElementById('eadvisor-chat-input');
                  if (!input) return;
                  
                  const question = input.value.trim();
                  if (!question) return;
                  
                  // Détecter si l'utilisateur demande le test de diagnostic
                  const lowerQuestion = question.toLowerCase();
                  if (lowerQuestion.includes('test') && (lowerQuestion.includes('diagnostic') || lowerQuestion.includes('complet') || lowerQuestion.includes('évaluation') || lowerQuestion.includes('evaluation'))) {
                    input.value = '';
                    startDiagnosticTest();
                    return;
                  }
                  
                  if (isCompleted && !isDiagnosticMode) {
                    pushUser(question);
                    input.value = '';
                    input.disabled = true;
                    
                    setTyping(true);
                    try {
                      const conversationHistory = messages
                        .filter(m => m.role === 'assistant' || m.role === 'user')
                        .map(m => ({
                          role: m.role === 'assistant' ? 'assistant' : 'user',
                          content: m.content
                        }));
                      
                      const response = await eadvisorService.chat(
                        question,
                        conversationHistory,
                        answers
                      );
                      
                      if (response.success && response.response) {
                        const responseText = response.response.toLowerCase();
                        
                        // Détecter si l'utilisateur demande le test de diagnostic
                        if (responseText.includes('test') && (responseText.includes('diagnostic') || responseText.includes('complet') || responseText.includes('évaluation'))) {
                          startDiagnosticTest();
                        } else {
                          pushAssistant(response.response);
                          
                          // Détecter une demande de recherche dans la question ou la réponse
                          const searchFilters = detectSearchRequest(question) || detectSearchRequest(response.response);
                          if (searchFilters) {
                            setTimeout(() => {
                              // Extraire le type et l'utiliser pour décider quoi chercher
                              const searchType = searchFilters.type;
                              const filtersWithoutType = { ...searchFilters };
                              delete filtersWithoutType.type;
                              
                              if (searchType === 'program') {
                                searchPrograms(filtersWithoutType);
                              } else {
                                searchEstablishments(filtersWithoutType);
                              }
                            }, 500);
                          }
                        }
                      } else {
                        const errorMsg = response.error 
                          ? `Erreur: ${response.error}` 
                          : response.message || 'Erreur inconnue';
                        pushAssistant(`Désolé, je n'ai pas pu traiter ta question. ${errorMsg}`);
                        console.error('E-DVISOR Chat Error:', response);
                      }
                    } catch (error) {
                      console.error('Error calling Grok API:', error);
                      pushAssistant('Désolé, une erreur est survenue. Vérifie ta connexion et réessaie.');
                    } finally {
                      setTyping(false);
                      input.disabled = false;
                      input.focus();
                    }
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </div>
            <div className="mt-2 flex justify-start">
              <button onClick={handleRestart} className="text-xs px-2 py-1.5 border rounded-lg hover:bg-gray-50">Recommencer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildPreferences(answers) {
  return {
    personalInfo: {
      fullName: answers.fullName,
      email: answers.email,
      phone: answers.phone,
      currentLevel: answers.currentLevel,
      bacFiliere: answers.bacFiliere,
      countryResidence: answers.countryResidence,
      userType: answers.userType,
    },
    preferences: {
      studyDestination: answers.studyDestination || [],
      motivation: answers.motivation,
      contactWhatsApp: answers.contactWhatsApp,
      contactTime: answers.contactTime,
    },
    france: {
      investQuality: answers.france_investQuality,
      helpDossier: answers.france_helpDossier,
      budget: answers.france_budget,
    },
    china: {
      investQuality: answers.china_investQuality,
      helpDossier: answers.china_helpDossier,
      budgetType: answers.china_budgetType,
    },
    morocco: {
      helpDossier: answers.morocco_helpDossier,
      schoolType: answers.morocco_schoolType,
      budget: answers.morocco_budget,
    },
    completedAt: new Date().toISOString(),
  };
}

function formatAnswerPreview(question, value) {
  if (question.type === 'multiselect') {
    const map = new Map(question.options.map(o => [o.value, o.label]));
    const labels = (value || []).map(v => map.get(v) || v).join(', ');
    return labels || 'Aucun';
  }
  if (question.type === 'select') {
    const found = (question.options || []).find(o => o.value === value);
    return found ? found.label : value;
  }
  return String(value ?? '');
}

/**
 * Formate le texte avec support des astérisques WhatsApp (*texte* = gras)
 */
function formatWhatsAppText(text) {
  if (!text) return '';
  
  // Regex pour trouver *texte* (non-greedy pour éviter les conflits)
  const regex = /\*([^*]+)\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  
  while ((match = regex.exec(text)) !== null) {
    // Ajouter le texte avant l'astérisque
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.substring(lastIndex, match.index)}</span>);
    }
    // Ajouter le texte en gras
    parts.push(<strong key={key++}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }
  
  // Ajouter le texte restant
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.substring(lastIndex)}</span>);
  }
  
  return parts.length > 0 ? parts : text;
}

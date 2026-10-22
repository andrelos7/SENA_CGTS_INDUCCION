export interface LessonSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  regulatoryReference?: string; // e.g. "Acuerdo 009 de 2024 - Artículo 8"
  highlights?: string[];
  interactiveElement?: {
    type: 'comparison' | 'timeline' | 'key-takeaways' | 'checklist' | 'audio-hymn';
    data: any;
  };
}

export interface LiveActivityFeedItem {
  id: string;
  timestamp: string;
  apprenticeName: string;
  action: string;
  type: 'quiz_passed' | 'module_completed' | 'badge_earned' | 'certificate_issued';
  detail: string;
}

export interface InductionModule {
  id: string;
  number: number;
  title: string;
  tagline: string;
  estimatedMinutes: number;
  iconName: string;
  color: string;
  summary: string;
  officialAgreement: string;
  sections: LessonSection[];
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  context?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  articleCitation: string;
  xpReward: number;
  difficulty: 'básico' | 'intermedio' | 'avanzado';
}

export interface CaseScenario {
  id: string;
  title: string;
  situation: string;
  character: string;
  role: string;
  options: {
    text: string;
    isCorrect: boolean;
    consequence: string;
    regulatoryOutcome: string;
  }[];
}

export interface ApprenticeProgress {
  apprenticeName: string;
  documentId: string;
  programName: string;
  fichaNumber: string;
  regional: string;
  centerName: string;
  completedModules: string[]; // module ids
  moduleScores: Record<string, number>; // moduleId -> score %
  totalXP: number;
  streakDays: number;
  badges: string[];
  finalQuizPassed: boolean;
  finalQuizScore?: number;
  inductionCompletedAt?: string;
  certificateId?: string;
}

export interface CohortStudent {
  id: string;
  name: string;
  documentId: string;
  email: string;
  program: string;
  ficha: string;
  regional: string;
  progressPercent: number;
  scoreAvg: number;
  status: 'completado' | 'en_progreso' | 'iniciado' | 'en_riesgo';
  lastActive: string;
  completedModulesCount: number;
}

export interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAtModule?: number;
}

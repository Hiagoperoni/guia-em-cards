export interface Subject {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  icon: string;
  active: boolean;
  topicCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  description?: string | null;
  order: number;
  active: boolean;
  subjectId: string;
  cardCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GlossaryItem {
  name: string;
  explanation: string;
}

export interface Card {
  id: string;
  topicId: string;
  question: string;
  answer: string;
  summary?: string | null;
  glossary?: GlossaryItem[] | null;
  options?: string[] | null;
  difficulty?: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CardListItem {
  id: string;
  question: string;
  order: number;
  difficulty?: string | null;
}

export interface SubjectDetail extends Subject {
  topics: Topic[];
}

export interface CreateSubjectInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export type UpdateSubjectInput = Partial<CreateSubjectInput> & {
  active?: boolean;
};

export interface CreateTopicInput {
  name: string;
  description?: string;
  order?: number;
}

export type UpdateTopicInput = Partial<CreateTopicInput> & {
  active?: boolean;
};

export interface CreateCardInput {
  question: string;
  answer: string;
  summary?: string;
  glossary?: GlossaryItem[];
  options?: string[];
  difficulty?: string;
  order?: number;
}

export type UpdateCardInput = Partial<CreateCardInput> & {
  active?: boolean;
};

// Sessions
export type ResultType = 'CORRECT' | 'INCORRECT';

export interface CardResultInput {
  cardId: string;
  result: ResultType;
  timeSpentMs?: number;
}

export interface StudySession {
  id: string;
  topicId: string;
  userId: string;
  startedAt: string;
  finishedAt?: string | null;
  totalCards: number;
  totalCorrect: number;
  totalIncorrect: number;
  topic?: { name: string };
}

// Progress
export interface ProgressSummary {
  totalSessions: number;
  totalSubjectsStudied: number;
  totalCardsStudied: number;
  overallAccuracy: number;
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  subjectIcon: string;
  sessionsCount: number;
  lastSessionAt: string;
  lastSessionAccuracy: number;
  overallAccuracy: number;
  totalCardsStudied: number;
}

// Glossary (grouped by subject -> topic)
export interface GlossaryTerm {
  name: string;
  explanation: string;
  cardId: string;
  question: string;
}

export interface GlossaryTopic {
  topicId: string;
  topicName: string;
  terms: GlossaryTerm[];
}

export interface GlossarySubject {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  subjectIcon: string;
  topics: GlossaryTopic[];
}

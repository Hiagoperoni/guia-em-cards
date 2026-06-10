import { api } from './axios';
import type { ProgressSummary, StudySession, SubjectProgress } from '@/types/content';

export async function getProgressSummary(): Promise<ProgressSummary> {
  const { data } = await api.get('/progress/me');
  return data;
}

export async function getSubjectProgress(): Promise<SubjectProgress[]> {
  const { data } = await api.get('/progress/me/subjects');
  return data;
}

export async function listSessions(): Promise<StudySession[]> {
  const { data } = await api.get('/sessions');
  return data;
}

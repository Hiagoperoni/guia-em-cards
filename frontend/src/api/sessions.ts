import { api } from './axios';
import type { CardResultInput, StudySession } from '@/types/content';

export async function createSession(topicId: string): Promise<StudySession> {
  const { data } = await api.post('/sessions', { topicId });
  return data;
}

export async function finishSession(
  sessionId: string,
  results: CardResultInput[],
): Promise<StudySession> {
  const { data } = await api.post(`/sessions/${sessionId}/finish`, { results });
  return data;
}

export async function getSession(sessionId: string): Promise<StudySession> {
  const { data } = await api.get(`/sessions/${sessionId}`);
  return data;
}

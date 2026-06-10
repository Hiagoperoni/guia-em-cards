import { api } from './axios';
import type { GlossarySubject } from '@/types/content';

export async function getGlossary(): Promise<GlossarySubject[]> {
  const { data } = await api.get('/glossary');
  return data;
}

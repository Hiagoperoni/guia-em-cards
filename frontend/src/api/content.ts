import { api } from './axios';
import type {
  Card,
  CardListItem,
  CreateCardInput,
  CreateSubjectInput,
  CreateTopicInput,
  Subject,
  SubjectDetail,
  Topic,
  UpdateCardInput,
  UpdateSubjectInput,
  UpdateTopicInput,
} from '@/types/content';

// Subjects
export async function listSubjects(): Promise<Subject[]> {
  const { data } = await api.get('/subjects');
  return data;
}

export async function getSubject(id: string): Promise<SubjectDetail> {
  const { data } = await api.get(`/subjects/${id}`);
  return data;
}

export async function createSubject(input: CreateSubjectInput): Promise<Subject> {
  const { data } = await api.post('/subjects', input);
  return data;
}

export async function updateSubject(id: string, input: UpdateSubjectInput): Promise<Subject> {
  const { data } = await api.patch(`/subjects/${id}`, input);
  return data;
}

export async function archiveSubject(id: string): Promise<Subject> {
  const { data } = await api.delete(`/subjects/${id}`);
  return data;
}

// Topics
export async function listTopics(subjectId: string): Promise<Topic[]> {
  const { data } = await api.get(`/subjects/${subjectId}/topics`);
  return data;
}

export async function getTopic(id: string): Promise<Topic> {
  const { data } = await api.get(`/topics/${id}`);
  return data;
}

export async function createTopic(subjectId: string, input: CreateTopicInput): Promise<Topic> {
  const { data } = await api.post(`/subjects/${subjectId}/topics`, input);
  return data;
}

export async function updateTopic(id: string, input: UpdateTopicInput): Promise<Topic> {
  const { data } = await api.patch(`/topics/${id}`, input);
  return data;
}

export async function archiveTopic(id: string): Promise<Topic> {
  const { data } = await api.delete(`/topics/${id}`);
  return data;
}

// Cards
export async function listCards(topicId: string): Promise<CardListItem[]> {
  const { data } = await api.get(`/topics/${topicId}/cards`);
  return data;
}

export async function getCard(id: string): Promise<Card> {
  const { data } = await api.get(`/cards/${id}`);
  return data;
}

export async function createCard(topicId: string, input: CreateCardInput): Promise<Card> {
  const { data } = await api.post(`/topics/${topicId}/cards`, input);
  return data;
}

export async function updateCard(id: string, input: UpdateCardInput): Promise<Card> {
  const { data } = await api.patch(`/cards/${id}`, input);
  return data;
}

export async function archiveCard(id: string): Promise<Card> {
  const { data } = await api.delete(`/cards/${id}`);
  return data;
}

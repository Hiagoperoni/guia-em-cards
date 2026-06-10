import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TopicFormModal } from '@/components/admin/TopicFormModal';
import {
  archiveTopic,
  createTopic,
  getSubject,
  listTopics,
  updateTopic,
} from '@/api/content';
import type { CreateTopicInput, Topic } from '@/types/content';

export function TopicsAdminPage() {
  const { subjectId = '' } = useParams();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);

  const { data: subject } = useQuery({
    queryKey: ['subject', subjectId],
    queryFn: () => getSubject(subjectId),
    enabled: !!subjectId,
  });

  const { data: topics, isLoading } = useQuery({
    queryKey: ['topics', subjectId],
    queryFn: () => listTopics(subjectId),
    enabled: !!subjectId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['topics', subjectId] });

  const saveMutation = useMutation({
    mutationFn: (input: CreateTopicInput) =>
      editing ? updateTopic(editing.id, input) : createTopic(subjectId, input),
    onSuccess: () => {
      invalidate();
      setModalOpen(false);
      setEditing(null);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveTopic(id),
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (topic: Topic) => {
    setEditing(topic);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        breadcrumbs={[
          { label: 'Matérias', to: '/admin/subjects' },
          { label: subject?.name ?? 'Tópicos' },
        ]}
      />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-base text-eightbit-ink">
            Tópicos {subject ? `· ${subject.name}` : ''}
          </h1>
          <button onClick={openCreate} className="eightbit-btn eightbit-btn--sm">
            + Novo tópico
          </button>
        </div>

        {isLoading ? (
          <p className="text-eightbit-green-shadow">Carregando...</p>
        ) : !topics?.length ? (
          <p className="text-eightbit-green-shadow">Nenhum tópico cadastrado.</p>
        ) : (
          <ul className="space-y-4">
            {topics.map((topic) => (
              <li key={topic.id} className="eightbit-box flex items-center justify-between p-4">
                <Link to={`/admin/topics/${topic.id}/cards`}>
                  <span className="block text-sm text-eightbit-ink">
                    {topic.order}. {topic.name}
                  </span>
                  <span className="text-xs text-eightbit-green-shadow">{topic.cardCount ?? 0} card(s)</span>
                </Link>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(topic)} className="eightbit-btn eightbit-btn--blue eightbit-btn--sm">
                    Editar
                  </button>
                  <button onClick={() => archiveMutation.mutate(topic.id)} className="eightbit-btn eightbit-btn--reset eightbit-btn--sm">
                    Arquivar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <TopicFormModal
        open={modalOpen}
        topic={editing}
        saving={saveMutation.isPending}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={(input) => saveMutation.mutate(input)}
      />
    </div>
  );
}

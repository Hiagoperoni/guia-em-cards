import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CardFormModal } from '@/components/admin/CardFormModal';
import {
  archiveCard,
  createCard,
  getCard,
  getTopic,
  listCards,
  updateCard,
} from '@/api/content';
import type { Card, CreateCardInput } from '@/types/content';

export function CardsAdminPage() {
  const { topicId = '' } = useParams();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Card | null>(null);

  const { data: topic } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => getTopic(topicId),
    enabled: !!topicId,
  });

  const { data: cards, isLoading } = useQuery({
    queryKey: ['cards', topicId],
    queryFn: () => listCards(topicId),
    enabled: !!topicId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['cards', topicId] });

  const saveMutation = useMutation({
    mutationFn: (input: CreateCardInput) =>
      editing ? updateCard(editing.id, input) : createCard(topicId, input),
    onSuccess: () => {
      invalidate();
      setModalOpen(false);
      setEditing(null);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveCard(id),
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = async (id: string) => {
    const full = await getCard(id);
    setEditing(full);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        breadcrumbs={[
          { label: 'Matérias', to: '/admin/subjects' },
          topic
            ? { label: 'Tópicos', to: `/admin/subjects/${topic.subjectId}/topics` }
            : { label: 'Tópicos' },
          { label: topic?.name ?? 'Cards' },
        ]}
      />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-base text-eightbit-ink">
            Cards {topic ? `· ${topic.name}` : ''}
          </h1>
          <button onClick={openCreate} className="eightbit-btn eightbit-btn--sm">
            + Novo card
          </button>
        </div>

        {isLoading ? (
          <p className="text-eightbit-green-shadow">Carregando...</p>
        ) : !cards?.length ? (
          <p className="text-eightbit-green-shadow">Nenhum card cadastrado.</p>
        ) : (
          <ul className="space-y-4">
            {cards.map((card) => (
              <li key={card.id} className="eightbit-box flex items-center justify-between gap-4 p-4">
                <span className="min-w-0 flex-1 truncate text-sm text-eightbit-ink">
                  <span className="mr-2 text-eightbit-green-shadow">{card.order}.</span>
                  {card.question}
                </span>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => openEdit(card.id)} className="eightbit-btn eightbit-btn--blue eightbit-btn--sm">
                    Editar
                  </button>
                  <button onClick={() => archiveMutation.mutate(card.id)} className="eightbit-btn eightbit-btn--reset eightbit-btn--sm">
                    Arquivar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <CardFormModal
        open={modalOpen}
        card={editing}
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

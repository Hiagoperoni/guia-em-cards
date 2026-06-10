import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SubjectFormModal } from '@/components/admin/SubjectFormModal';
import {
  archiveSubject,
  createSubject,
  listSubjects,
  updateSubject,
} from '@/api/content';
import type { CreateSubjectInput, Subject } from '@/types/content';

export function SubjectsAdminPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: listSubjects,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['subjects'] });

  const saveMutation = useMutation({
    mutationFn: (input: CreateSubjectInput) =>
      editing ? updateSubject(editing.id, input) : createSubject(input),
    onSuccess: () => {
      invalidate();
      setModalOpen(false);
      setEditing(null);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveSubject(id),
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (subject: Subject) => {
    setEditing(subject);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader breadcrumbs={[{ label: 'Matérias' }]} />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-base text-eightbit-ink">Matérias</h1>
          <button onClick={openCreate} className="eightbit-btn eightbit-btn--sm">
            + Nova matéria
          </button>
        </div>

        {isLoading ? (
          <p className="text-eightbit-green-shadow">Carregando...</p>
        ) : !subjects?.length ? (
          <p className="text-eightbit-green-shadow">Nenhuma matéria cadastrada.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {subjects.map((subject) => (
              <li key={subject.id} className="eightbit-box flex items-center justify-between p-4">
                <Link
                  to={`/admin/subjects/${subject.id}/topics`}
                  className="flex items-center gap-3"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center text-xl"
                    style={{ backgroundColor: `${subject.color}33` }}
                  >
                    {subject.icon}
                  </span>
                  <span>
                    <span className="block text-sm text-eightbit-ink">{subject.name}</span>
                    <span className="text-xs text-eightbit-green-shadow">
                      {subject.topicCount ?? 0} tópico(s)
                    </span>
                  </span>
                </Link>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(subject)} className="eightbit-btn eightbit-btn--blue eightbit-btn--sm">
                    Editar
                  </button>
                  <button onClick={() => archiveMutation.mutate(subject.id)} className="eightbit-btn eightbit-btn--reset eightbit-btn--sm">
                    Arquivar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <SubjectFormModal
        open={modalOpen}
        subject={editing}
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

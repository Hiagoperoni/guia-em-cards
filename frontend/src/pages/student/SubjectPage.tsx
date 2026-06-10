import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSubject, listTopics } from '@/api/content';
import { getGlossary } from '@/api/glossary';
import { Modal } from '@/components/ui/Modal';

export function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [glossaryTopicId, setGlossaryTopicId] = useState<string | null>(null);
  const [glossarySearch, setGlossarySearch] = useState('');

  const { data: subject } = useQuery({
    queryKey: ['subject', id],
    queryFn: () => getSubject(id!),
    enabled: !!id,
  });

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics', id],
    queryFn: () => listTopics(id!),
    enabled: !!id,
  });

  const { data: glossarySubjects = [] } = useQuery({
    queryKey: ['glossary'],
    queryFn: getGlossary,
    enabled: glossaryTopicId !== null,
  });

  const glossaryTopicName = topics.find((t) => t.id === glossaryTopicId)?.name ?? '';

  const filteredTerms = useMemo(() => {
    if (!glossaryTopicId) return [];
    const topic = glossarySubjects
      .flatMap((s) => s.topics)
      .find((t) => t.topicId === glossaryTopicId);
    const terms = topic?.terms ?? [];
    const q = glossarySearch.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.explanation.toLowerCase().includes(q),
    );
  }, [glossarySubjects, glossaryTopicId, glossarySearch]);

  function openGlossary(topicId: string) {
    setGlossarySearch('');
    setGlossaryTopicId(topicId);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b-4 border-eightbit-ink bg-eightbit-panel px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="eightbit-btn eightbit-btn--blue eightbit-btn--sm"
          >
            ←
          </button>
          {subject && (
            <span className="text-2xl">{subject.icon}</span>
          )}
          <h1 className="text-base text-eightbit-ink">
            {subject?.name ?? 'Matéria'}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {subject?.description && (
          <p className="mb-6 text-base text-eightbit-blue">{subject.description}</p>
        )}

        <h2 className="mb-6 text-lg text-eightbit-ink">Tópicos</h2>

        {isLoading && <p className="text-base text-eightbit-blue">Carregando...</p>}

        {!isLoading && topics.length === 0 && (
          <div className="eightbit-box p-10 text-center text-base text-eightbit-green-shadow">
            Nenhum tópico disponível nesta matéria.
          </div>
        )}

        <div className="space-y-5">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="eightbit-box flex items-center justify-between gap-4 px-6 py-4"
            >
              <div>
                <h3 className="text-xs leading-relaxed text-eightbit-ink">{topic.name}</h3>
                {topic.description && (
                  <p className="mt-2 text-base text-eightbit-green-shadow">{topic.description}</p>
                )}
                {topic.cardCount !== undefined && (
                  <p className="mt-1 text-sm text-eightbit-ink/60">
                    {topic.cardCount} card{topic.cardCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="flex flex-shrink-0 flex-col gap-2">
                <Link
                  to={`/study/${topic.id}`}
                  className="eightbit-btn eightbit-btn--sm"
                >
                  Estudar
                </Link>
                <button
                  type="button"
                  onClick={() => openGlossary(topic.id)}
                  className="eightbit-btn eightbit-btn--blue eightbit-btn--sm"
                >
                  Glossário
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Modal
        open={glossaryTopicId !== null}
        title={`Glossário — ${glossaryTopicName}`}
        onClose={() => setGlossaryTopicId(null)}
      >
        <div className="space-y-4">
          <input
            type="text"
            value={glossarySearch}
            onChange={(e) => setGlossarySearch(e.target.value)}
            placeholder="Pesquisar termo..."
            className="eightbit-input w-full"
            autoFocus
          />
          <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
            {filteredTerms.length === 0 ? (
              <p className="text-base text-eightbit-ink/70">
                Nenhum termo encontrado para este tópico.
              </p>
            ) : (
              <dl className="space-y-3">
                {filteredTerms.map((term, i) => (
                  <div
                    key={`${term.cardId}-${i}`}
                    className="border-l-4 border-eightbit-yellow pl-3"
                  >
                    <dt className="text-eightbit-blue">{term.name}</dt>
                    <dd className="text-base text-eightbit-ink">{term.explanation}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

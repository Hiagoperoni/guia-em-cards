import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getGlossary } from '@/api/glossary';

export function GlossaryPage() {
  const navigate = useNavigate();

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['glossary'],
    queryFn: getGlossary,
  });

  const isEmpty = !isLoading && subjects.length === 0;

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
          <h1 className="text-base text-eightbit-ink">Glossário</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-12 px-6 py-10">
        {isLoading && <p className="text-base text-eightbit-blue">Carregando...</p>}

        {isEmpty && (
          <div className="eightbit-box py-16 text-center">
            <span className="text-5xl">📖</span>
            <p className="mt-4 text-sm leading-relaxed text-eightbit-ink">
              Nenhum conceito cadastrado ainda
            </p>
            <p className="mt-3 text-base text-eightbit-blue">
              Os conceitos adicionados aos cards aparecerão aqui, agrupados por matéria e tópico.
            </p>
          </div>
        )}

        {subjects.map((subject) => (
          <section key={subject.subjectId}>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-2xl">{subject.subjectIcon}</span>
              <h2
                className="text-sm leading-relaxed"
                style={{ color: subject.subjectColor }}
              >
                {subject.subjectName}
              </h2>
            </div>

            <div className="space-y-6">
              {subject.topics.map((topic) => (
                <div key={topic.topicId} className="eightbit-box p-5">
                  <h3 className="mb-4 font-pixel text-[10px] uppercase tracking-widest text-eightbit-blue">
                    {topic.topicName}
                  </h3>
                  <dl className="space-y-3">
                    {topic.terms.map((term, i) => (
                      <div key={`${term.cardId}-${i}`} className="border-l-4 border-eightbit-yellow pl-3">
                        <dt className="text-[18px] font-bold text-eightbit-ink">{term.name}</dt>
                        <dd className="text-base text-eightbit-blue">{term.explanation}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

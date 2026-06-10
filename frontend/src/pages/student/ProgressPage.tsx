import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getProgressSummary, getSubjectProgress, listSessions } from '@/api/progress';

function pct(v: number) {
  return `${Math.round(v * 100)}%`;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export function ProgressPage() {
  const navigate = useNavigate();

  const { data: summary, isLoading: loadSummary } = useQuery({
    queryKey: ['progress-summary'],
    queryFn: getProgressSummary,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['progress-subjects'],
    queryFn: getSubjectProgress,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: listSessions,
  });

  const isEmpty = !loadSummary && summary?.totalSessions === 0;

  return (
    <div className="min-h-screen">
      <header className="border-b-4 border-eightbit-ink bg-eightbit-panel px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button onClick={() => navigate('/home')} className="eightbit-btn eightbit-btn--blue eightbit-btn--sm">←</button>
          <h1 className="text-base text-eightbit-ink">Meu Progresso</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 space-y-12">

        {/* Empty state */}
        {isEmpty && (
          <div className="eightbit-box flex flex-col items-center gap-4 py-16 text-center">
            <span className="text-5xl">📖</span>
            <p className="text-sm leading-relaxed text-eightbit-ink">Você ainda não estudou nenhum tópico</p>
            <p className="text-base text-eightbit-green-shadow">Comece uma sessão de estudo para ver seu progresso aqui.</p>
            <Link to="/home" className="eightbit-btn eightbit-btn--sm mt-2">
              Começar a estudar
            </Link>
          </div>
        )}

        {/* Summary stats */}
        {!isEmpty && summary && (
          <section>
            <h2 className="mb-6 text-lg text-eightbit-ink">Resumo geral</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { label: 'Sessões', value: summary.totalSessions },
                { label: 'Matérias', value: summary.totalSubjectsStudied },
                { label: 'Cards estudados', value: summary.totalCardsStudied },
                { label: '% Acerto geral', value: pct(summary.overallAccuracy) },
              ].map(({ label, value }) => (
                <div key={label} className="eightbit-box p-5 text-center">
                  <p className="font-pixel text-xl text-eightbit-blue">{value}</p>
                  <p className="mt-2 text-sm text-eightbit-green-shadow">{label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Per-subject breakdown */}
        {subjects.length > 0 && (
          <section>
            <h2 className="mb-6 text-lg text-eightbit-ink">Por matéria</h2>
            <div className="space-y-5">
              {subjects.map((s) => (
                <div key={s.subjectId} className="eightbit-box flex items-center gap-4 px-5 py-4">
                  <span className="text-2xl">{s.subjectIcon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed" style={{ color: s.subjectColor }}>{s.subjectName}</p>
                    <p className="mt-1 text-sm text-eightbit-ink/60">{s.sessionsCount} sessão(ões) · última em {fmt(s.lastSessionAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base text-eightbit-green-shadow">{pct(s.overallAccuracy)} acerto</p>
                    <p className="text-sm text-eightbit-ink/60">{s.totalCardsStudied} cards</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Session history */}
        {sessions.length > 0 && (
          <section>
            <h2 className="mb-6 text-lg text-eightbit-ink">Histórico de sessões</h2>
            <div className="eightbit-box overflow-hidden">
              <table className="w-full text-base">
                <thead className="bg-eightbit-yellow/30 font-pixel text-[10px] uppercase text-eightbit-ink">
                  <tr>
                    <th className="px-5 py-3 text-left">Tópico</th>
                    <th className="px-5 py-3 text-left">Data</th>
                    <th className="px-5 py-3 text-right">Cards</th>
                    <th className="px-5 py-3 text-right">Acerto</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-eightbit-ink/10">
                  {sessions.filter(s => s.finishedAt).map((s) => (
                    <tr key={s.id} className="hover:bg-eightbit-yellow/10">
                      <td className="px-5 py-3 text-eightbit-ink">{s.topic?.name ?? s.topicId}</td>
                      <td className="px-5 py-3 text-eightbit-green-shadow">{fmt(s.finishedAt!)}</td>
                      <td className="px-5 py-3 text-right text-eightbit-ink">{s.totalCards}</td>
                      <td className="px-5 py-3 text-right text-eightbit-green-shadow">
                        {s.totalCards > 0 ? pct(s.totalCorrect / s.totalCards) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTopic, listCards, getCard } from '@/api/content';
import { createSession, finishSession } from '@/api/sessions';
import { FlashCard } from '@/components/content/FlashCard';
import type { Card, CardResultInput } from '@/types/content';

type Phase = 'loading' | 'studying' | 'finished' | 'error';

export function StudyPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('loading');
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<CardResultInput[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const cardStartRef = useRef<number>(Date.now());

  const { data: topic } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => getTopic(topicId!),
    enabled: !!topicId,
  });

  // Initialize: fetch cards + create session
  useEffect(() => {
    if (!topicId) return;
    (async () => {
      try {
        const items = await listCards(topicId);
        if (items.length === 0) { setPhase('error'); return; }
        const full = await Promise.all(items.map((c) => getCard(c.id)));
        // Fisher-Yates shuffle — ordem aleatória sem repetição
        for (let i = full.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [full[i], full[j]] = [full[j], full[i]];
        }
        setCards(full);
        const session = await createSession(topicId);
        setSessionId(session.id);
        cardStartRef.current = Date.now();
        setPhase('studying');
      } catch {
        setPhase('error');
      }
    })();
  }, [topicId]);

  const handleAnswer = useCallback(
    async (result: CardResultInput['result']) => {
      const timeSpentMs = Date.now() - cardStartRef.current;
      const newResults = [...results, { cardId: cards[index].id, result, timeSpentMs }];
      setResults(newResults);

      if (index + 1 < cards.length) {
        setIndex(index + 1);
        setFlipped(false);
        cardStartRef.current = Date.now();
      } else {
        // Finish session
        if (sessionId) {
          try { await finishSession(sessionId, newResults); } catch { /* best-effort */ }
        }
        setPhase('finished');
      }
    },
    [results, cards, index, sessionId],
  );

  // Keyboard shortcuts (v=virar, x=errado, c=certo)
  // Ignored when focus is inside a textarea or input (draft field)
  useEffect(() => {
    if (phase !== 'studying') return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      if (e.key === 'v' || e.key === 'V') { e.preventDefault(); setFlipped((f) => !f); }
      if ((e.key === 'x' || e.key === 'X') && flipped) handleAnswer('INCORRECT');
      if ((e.key === 'c' || e.key === 'C') && flipped) handleAnswer('CORRECT');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, flipped, handleAnswer]);

  const correct = results.filter((r) => r.result === 'CORRECT').length;
  const incorrect = results.filter((r) => r.result === 'INCORRECT').length;
  const pct = results.length > 0 ? Math.round((correct / results.length) * 100) : 0;

  if (phase === 'loading') return <Screen>Preparando sessão...</Screen>;
  if (phase === 'error') return <Screen>Nenhum card disponível neste tópico.</Screen>;

  if (phase === 'finished') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
        <h2 className="text-center text-lg leading-relaxed text-eightbit-ink">Sessão concluída!</h2>
        <div className="eightbit-box flex gap-10 px-10 py-6 text-center">
          <Stat label="Acertos" value={correct} color="text-eightbit-green-shadow" />
          <Stat label="Erros" value={incorrect} color="text-eightbit-red-hover" />
          <Stat label="% Acerto" value={`${pct}%`} color="text-eightbit-blue" />
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={() => navigate('/home')} className="eightbit-btn eightbit-btn--blue eightbit-btn--sm">Voltar para home</button>
          <button onClick={() => window.location.reload()} className="eightbit-btn eightbit-btn--sm">Estudar de novo</button>
        </div>
      </div>
    );
  }

  const card = cards[index];
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-4 border-eightbit-ink bg-eightbit-panel px-6 py-3">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2">
          <button onClick={() => navigate(-1)} className="eightbit-btn eightbit-btn--reset eightbit-btn--sm">← Sair</button>
          <span className="text-base text-eightbit-ink">
            {topic?.name} — {index + 1} / {cards.length}
          </span>
          <span className="text-sm text-eightbit-blue">V=virar · X=Erro · C=Acerto</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <FlashCard
          question={card.question}
          answer={card.answer}
          summary={card.summary ?? undefined}
          glossary={card.glossary ?? undefined}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          onCorrect={() => handleAnswer('CORRECT')}
          onIncorrect={() => handleAnswer('INCORRECT')}
        />
      </main>
    </div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center text-base text-eightbit-blue">{children}</div>;
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div>
      <p className={`font-pixel text-2xl ${color}`}>{value}</p>
      <p className="mt-2 text-sm text-eightbit-green-shadow">{label}</p>
    </div>
  );
}

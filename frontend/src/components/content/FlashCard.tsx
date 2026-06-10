// flipped is now controlled by the parent
import { useEffect, useState } from 'react';
import { RichContent } from './RichContent';
import type { GlossaryItem } from '@/types/content';

export interface FlashCardProps {
  question: string;
  answer: string;
  summary?: string;
  glossary?: GlossaryItem[];
  flipped: boolean;
  onFlip: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export function FlashCard({ question, answer, summary, glossary, flipped, onFlip, onCorrect, onIncorrect }: FlashCardProps) {
  const [draft, setDraft] = useState('');

  // Clear draft whenever a new card is shown
  useEffect(() => {
    setDraft('');
  }, [question]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card container */}
      <div
        className="relative w-full max-w-2xl cursor-pointer"
        style={{ perspective: '1200px', minHeight: '320px' }}
        onClick={onFlip}
        role="button"
        aria-label={flipped ? 'Virar para pergunta' : 'Revelar resposta'}
      >
        {/* Inner wrapper that rotates */}
        <div
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'relative',
            width: '100%',
            minHeight: '320px',
          }}
        >
          {/* Front — question */}
          <div
            className="eightbit-box absolute inset-0 flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="mb-4 font-pixel text-[10px] uppercase tracking-widest text-eightbit-blue">
              Pergunta
            </span>
            <div className="w-full text-center">
              <RichContent content={question} />
            </div>
            <p className="mt-6 text-sm text-eightbit-ink/60">Clique para revelar a resposta</p>
          </div>

          {/* Back — answer + summary */}
          <div
            className="eightbit-box absolute inset-0 flex flex-col p-8"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: '#4a4a4a' }}
          >
            <span className="mb-3 font-pixel text-[10px] uppercase tracking-widest text-eightbit-blue-shadow">
              Resposta
            </span>
            <div className="flex-1 overflow-y-auto">
              <RichContent content={answer} />
              {summary && (
                <>
                  <hr className="my-4 border-t-4 border-eightbit-ink/20" />
                  <p className="mb-1 font-pixel text-[10px] uppercase tracking-widest text-eightbit-blue">
                    Resumo
                  </p>
                  <RichContent content={summary} className="text-base" />
                </>
              )}
              {glossary && glossary.length > 0 && (
                <>
                  <hr className="my-4 border-t-4 border-eightbit-ink/20" />
                  <p className="mb-2 font-pixel text-[10px] uppercase tracking-widest text-eightbit-blue">
                    Glossário
                  </p>
                  <dl className="space-y-2 text-base">
                    {glossary.map((item, i) => (
                      <div key={i} className="border-l-4 border-eightbit-yellow pl-3">
                        <dt className="text-[18px] text-eightbit-blue">{item.name}</dt>
                        <dd className="text-eightbit-blue">{item.explanation}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons — only enabled after flip */}
      <div className="flex gap-6">
        <button
          onClick={onIncorrect}
          disabled={!flipped}
          className="eightbit-btn eightbit-btn--reset eightbit-btn--sm"
        >
          ✗ Errei
        </button>
        <button
          onClick={onCorrect}
          disabled={!flipped}
          className="eightbit-btn eightbit-btn--sm"
        >
          ✓ Acertei
        </button>
      </div>

      {/* Draft textarea */}
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <label
          htmlFor="draft-answer"
          className="mb-2 block font-pixel text-[10px] uppercase tracking-widest text-eightbit-ink"
        >
          Rascunho da Resposta
        </label>
        <textarea
          id="draft-answer"
          rows={4}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Esse campo serve para escrever sua resposta e apenas para VOCÊ verificar se acertou, errou ou passou perto. Nada daqui é obrigatório ou será avaliado"
          className="eightbit-input w-full resize-y"
          style={{ fontFamily: "'VT323', monospace", color: '#1a1a1a', background: '#ffffff' }}
        />
      </div>
    </div>
  );
}

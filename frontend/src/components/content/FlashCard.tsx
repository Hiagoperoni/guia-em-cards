// flipped is now controlled by the parent
import { useEffect, useState } from 'react';
import { RichContent } from './RichContent';
import type { GlossaryItem } from '@/types/content';

export interface FlashCardProps {
  question: string;
  answer: string;
  summary?: string;
  glossary?: GlossaryItem[];
  options?: string[] | null;
  flipped: boolean;
  onFlip: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export function FlashCard({ question, answer, summary, glossary, options, flipped, onFlip, onCorrect, onIncorrect }: FlashCardProps) {
  const [draft, setDraft] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());

  function toggleOption(opt: string) {
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
  }

  // Clear draft + selections whenever a new card is shown
  useEffect(() => {
    setDraft('');
    setSelectedOptions(new Set());
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
            display: 'grid',
            width: '100%',
            minHeight: '320px',
          }}
        >
          {/* Front — question */}
          <div
            className="eightbit-box flex flex-col items-center justify-center p-5 sm:p-8"
            style={{ backfaceVisibility: 'hidden', gridArea: '1 / 1' }}
          >
            <span className="mb-4 font-pixel text-[10px] uppercase tracking-widest text-eightbit-blue">
              Pergunta
            </span>
            <div className="w-full text-center">
              <RichContent content={question} />
            </div>
            {options && options.length > 0 && (
              <div
                className="mt-4 w-full space-y-2 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {options.map((opt, i) => {
                  const checked = selectedOptions.has(opt);
                  return (
                    <label
                      key={i}
                      className={`flex cursor-pointer items-center gap-3 rounded border-2 px-4 py-2 transition-colors ${
                        checked
                          ? 'border-eightbit-blue bg-eightbit-blue/10 font-bold text-eightbit-blue'
                          : 'border-eightbit-ink/20 hover:border-eightbit-blue/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOption(opt)}
                        className="h-4 w-4 accent-eightbit-blue"
                      />
                      <RichContent content={opt} />
                    </label>
                  );
                })}
              </div>
            )}
            {!(options && options.length > 0) && (
              <p className="mt-6 text-sm text-eightbit-ink/60">Clique para revelar a resposta</p>
            )}
            {options && options.length > 0 && (
              <p className="mt-4 text-sm text-eightbit-ink/60">Marque sua(s) resposta(s) e clique para revelar</p>
            )}
          </div>

          {/* Back — answer + summary */}
          <div
            className="eightbit-box flex flex-col p-5 sm:p-8"
            style={{ backfaceVisibility: 'hidden', gridArea: '1 / 1', transform: 'rotateY(180deg)', background: '#4a4a4a' }}
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
                        <dt className="text-[18px] font-bold text-white">{item.name}</dt>
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

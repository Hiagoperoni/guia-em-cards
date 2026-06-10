import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { RichContent } from '@/components/content/RichContent';
import { useDebounce } from '@/hooks/useDebounce';
import type { Card, CreateCardInput, GlossaryItem } from '@/types/content';

interface Props {
  open: boolean;
  card?: Card | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (input: CreateCardInput) => void;
}

function LivePreview({ question, answer, summary }: { question: string; answer: string; summary: string }) {
  const debouncedQuestion = useDebounce(question);
  const debouncedAnswer = useDebounce(answer);
  const debouncedSummary = useDebounce(summary);

  if (!debouncedQuestion && !debouncedAnswer) return null;

  const combined =
    `**Pergunta**\n\n${debouncedQuestion}` +
    (debouncedAnswer ? `\n\n---\n\n**Resposta**\n\n${debouncedAnswer}` : '') +
    (debouncedSummary ? `\n\n---\n\n**Resumo**\n\n${debouncedSummary}` : '');

  return (
    <div className="eightbit-box p-3">
      <p className="mb-2 font-pixel text-[9px] uppercase tracking-wide text-eightbit-green-shadow">Preview</p>
      <RichContent content={combined} />
    </div>
  );
}

const inputClass = 'eightbit-input w-full';

export function CardFormModal({ open, card, saving, onClose, onSubmit }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [summary, setSummary] = useState('');
  const [glossary, setGlossary] = useState<GlossaryItem[]>([]);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    setQuestion(card?.question ?? '');
    setAnswer(card?.answer ?? '');
    setSummary(card?.summary ?? '');
    setGlossary(card?.glossary ?? []);
    setOrder(card?.order ?? 0);
  }, [card, open]);

  const updateGlossaryItem = (index: number, field: keyof GlossaryItem, value: string) => {
    setGlossary((items) =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addGlossaryItem = () => setGlossary((items) => [...items, { name: '', explanation: '' }]);

  const removeGlossaryItem = (index: number) =>
    setGlossary((items) => items.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedGlossary = glossary
      .map((item) => ({ name: item.name.trim(), explanation: item.explanation.trim() }))
      .filter((item) => item.name && item.explanation);
    onSubmit({
      question,
      answer,
      summary: summary || undefined,
      glossary: cleanedGlossary,
      order,
    });
  };

  return (
    <Modal open={open} title={card ? 'Editar card' : 'Novo card'} onClose={onClose}>
      <form className="max-h-[70vh] space-y-4 overflow-y-auto pr-1" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm text-eightbit-ink">Pergunta (Markdown)</label>
          <textarea
            className={`${inputClass} font-mono`}
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-eightbit-ink">Resposta (Markdown)</label>
          <textarea
            className={`${inputClass} font-mono`}
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-eightbit-ink">Resumo (Markdown)</label>
          <textarea
            className={`${inputClass} font-mono`}
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-eightbit-ink">Ordem</label>
          <input
            type="number"
            className={inputClass}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </div>
        {/* Glossary editor */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm text-eightbit-ink">Glossário</label>
            <button
              type="button"
              onClick={addGlossaryItem}
              className="eightbit-btn eightbit-btn--blue eightbit-btn--sm"
            >
              + Adicionar conceito
            </button>
          </div>
          {glossary.length === 0 && (
            <p className="text-xs text-eightbit-ink/60">Nenhum conceito adicionado.</p>
          )}
          <div className="space-y-2">
            {glossary.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  placeholder="Conceito"
                  value={item.name}
                  onChange={(e) => updateGlossaryItem(index, 'name', e.target.value)}
                />
                <input
                  className={`${inputClass} flex-[2]`}
                  placeholder="Explicação"
                  value={item.explanation}
                  onChange={(e) => updateGlossaryItem(index, 'explanation', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeGlossaryItem(index)}
                  className="eightbit-btn eightbit-btn--reset eightbit-btn--sm"
                  aria-label="Remover conceito"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Live preview */}
        <LivePreview question={question} answer={answer} summary={summary} />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="eightbit-btn eightbit-btn--reset eightbit-btn--sm">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="eightbit-btn eightbit-btn--sm">
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

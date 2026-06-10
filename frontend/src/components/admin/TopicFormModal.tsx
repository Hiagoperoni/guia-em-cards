import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import type { CreateTopicInput, Topic } from '@/types/content';

interface Props {
  open: boolean;
  topic?: Topic | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTopicInput) => void;
}

const inputClass = 'eightbit-input w-full';

export function TopicFormModal({ open, topic, saving, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    setName(topic?.name ?? '');
    setDescription(topic?.description ?? '');
    setOrder(topic?.order ?? 0);
  }, [topic, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description: description || undefined, order });
  };

  return (
    <Modal open={open} title={topic ? 'Editar tópico' : 'Novo tópico'} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm text-eightbit-ink">Nome</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm text-eightbit-ink">Descrição</label>
          <textarea
            className={inputClass}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import type { CreateSubjectInput, Subject } from '@/types/content';

interface Props {
  open: boolean;
  subject?: Subject | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (input: CreateSubjectInput) => void;
}

const inputClass = 'eightbit-input w-full';

export function SubjectFormModal({ open, subject, saving, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('📚');

  useEffect(() => {
    setName(subject?.name ?? '');
    setDescription(subject?.description ?? '');
    setColor(subject?.color ?? '#6366f1');
    setIcon(subject?.icon ?? '📚');
  }, [subject, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description: description || undefined, color, icon });
  };

  return (
    <Modal open={open} title={subject ? 'Editar matéria' : 'Nova matéria'} onClose={onClose}>
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
        <div className="flex gap-4">
          <div>
            <label className="mb-1 block text-sm text-eightbit-ink">Cor</label>
            <input
              type="color"
              className="h-10 w-16 cursor-pointer border-4 border-eightbit-ink-dark"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm text-eightbit-ink">Ícone (emoji)</label>
            <input
              className={inputClass}
              maxLength={4}
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>
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

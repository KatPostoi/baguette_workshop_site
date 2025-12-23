import { useState } from 'react';
import type { FrameItem } from '../../api/types';
import { TopicSection } from '../common/TopicSection';
import { TopicSectionTitle } from '../common/TopicSection/TopicSectionTitle';
import { CatalogCard } from '../common/Catalog/CatalogCard';
import { Modal } from '../ui-kit/Modal/Modal';
import './CustomFramesSection.css';

type CustomFramesSectionProps = {
  title: string;
  frames: FrameItem[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onDelete?: (id: string) => Promise<void>;
};

export const CustomFramesSection = ({
  title,
  frames,
  isLoading = false,
  error,
  emptyMessage = 'Кастомных рам пока нет.',
  onDelete,
}: CustomFramesSectionProps) => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!pendingId || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingId);
    } finally {
      setDeleting(false);
      setPendingId(null);
    }
  };

  return (
    <TopicSection className="custom-frames-section">
      <TopicSectionTitle>{title}</TopicSectionTitle>
      {isLoading ? <p className="custom-frames__info">Загрузка…</p> : null}
      {error ? <p className="custom-frames__info custom-frames__info--error">{error}</p> : null}
      {!isLoading && !error && frames.length === 0 ? (
        <p className="custom-frames__info">{emptyMessage}</p>
      ) : null}
      <div className="custom-frames__grid">
        {frames.map((frame) => (
          <div key={frame.id} className="custom-frame-card">
            {onDelete ? (
              <button
                type="button"
                className="custom-frame-card__delete"
                aria-label="Удалить раму"
                onClick={() => setPendingId(frame.id)}
              >
                ×
              </button>
            ) : null}
            <CatalogCard frameData={frame} />
          </div>
        ))}
      </div>

      <Modal
        isOpen={Boolean(pendingId)}
        onClose={() => {
          if (!deleting) setPendingId(null);
        }}
        className="custom-frame-delete-modal"
      >
        <div className="custom-frame-delete-modal__content">
          <h3 className="custom-frame-delete-modal__title">Удалить раму?</h3>
          <p className="custom-frame-delete-modal__text">
            Она исчезнет из ваших рам и корзины, если была добавлена.
          </p>
          <div className="custom-frame-delete-modal__actions">
            <button
              type="button"
              className="custom-frame-delete-modal__button custom-frame-delete-modal__button--secondary"
              onClick={() => setPendingId(null)}
              disabled={deleting}
            >
              Отмена
            </button>
            <button
              type="button"
              className="custom-frame-delete-modal__button custom-frame-delete-modal__button--danger"
              onClick={() => void handleConfirmDelete()}
              disabled={deleting}
            >
              {deleting ? 'Удаляем…' : 'Удалить'}
            </button>
          </div>
        </div>
      </Modal>
    </TopicSection>
  );
};

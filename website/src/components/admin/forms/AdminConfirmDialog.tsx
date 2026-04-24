import type { ReactNode } from 'react';
import { Modal } from '../../ui-kit/Modal/Modal';
import { Button } from '../../ui-kit/Button';
import './AdminDialogs.css';

type AdminConfirmDialogProps = {
  isOpen: boolean;
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const AdminConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  loading = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) => (
  <Modal isOpen={isOpen} onClose={onCancel} className="admin-dialog admin-dialog_confirm">
    <div className="admin-dialog__header">
      <div className="admin-dialog__header-copy">
        <h2 className="admin-dialog__title">{title}</h2>
      </div>
      <button
        type="button"
        className="admin-dialog__close"
        onClick={onCancel}
        aria-label="Закрыть"
      >
        ×
      </button>
    </div>

    <div className="admin-dialog__body">
      <p className="admin-dialog__description">{description}</p>
    </div>

    <div className="admin-dialog__footer">
      <span />
      <div className="admin-dialog__footer-actions">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          className="admin-dialog__danger-button"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

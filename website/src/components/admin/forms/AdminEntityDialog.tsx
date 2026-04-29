import type { PropsWithChildren, ReactNode } from 'react';
import { Modal } from '../../ui-kit/Modal/Modal';
import { Button } from '../../ui-kit/Button';
import './AdminDialogs.css';

type AdminEntityDialogProps = PropsWithChildren<{
  isOpen: boolean;
  title: ReactNode;
  submitLabel: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  submitLoading?: boolean;
  submitDisabled?: boolean;
}>;

export const AdminEntityDialog = ({
  isOpen,
  title,
  submitLabel,
  onClose,
  onSubmit,
  submitLoading = false,
  submitDisabled = false,
  children,
}: AdminEntityDialogProps) => (
  <Modal isOpen={isOpen} onClose={onClose} className="admin-dialog">
    <div className="admin-dialog__header">
      <div className="admin-dialog__header-copy">
        <h2 className="admin-dialog__title">{title}</h2>
      </div>
      <button
        type="button"
        className="admin-dialog__close"
        onClick={onClose}
        aria-label="Закрыть"
      >
        ×
      </button>
    </div>

    <div className="admin-dialog__body">{children}</div>

    <div className="admin-dialog__footer admin-dialog__footer_single">
      <div className="admin-dialog__footer-actions">
        <Button
          onClick={onSubmit}
          loading={submitLoading}
          disabled={submitDisabled}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

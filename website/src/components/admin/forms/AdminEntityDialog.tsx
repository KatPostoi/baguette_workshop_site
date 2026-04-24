import type { PropsWithChildren, ReactNode } from 'react';
import { Modal } from '../../ui-kit/Modal/Modal';
import { Button } from '../../ui-kit/Button';
import './AdminDialogs.css';

type AdminEntityDialogProps = PropsWithChildren<{
  isOpen: boolean;
  title: ReactNode;
  description?: ReactNode;
  submitLabel: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  submitLoading?: boolean;
  submitDisabled?: boolean;
  cancelLabel?: ReactNode;
  footerStart?: ReactNode;
}>;

export const AdminEntityDialog = ({
  isOpen,
  title,
  description,
  submitLabel,
  onClose,
  onSubmit,
  submitLoading = false,
  submitDisabled = false,
  cancelLabel = 'Отмена',
  footerStart,
  children,
}: AdminEntityDialogProps) => (
  <Modal isOpen={isOpen} onClose={onClose} className="admin-dialog">
    <div className="admin-dialog__header">
      <div className="admin-dialog__header-copy">
        <h2 className="admin-dialog__title">{title}</h2>
        {description ? (
          <p className="admin-dialog__description">{description}</p>
        ) : null}
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

    <div className="admin-dialog__footer">
      {footerStart ? (
        <div className="admin-dialog__footer-start">{footerStart}</div>
      ) : (
        <span />
      )}
      <div className="admin-dialog__footer-actions">
        <Button variant="secondary" onClick={onClose} disabled={submitLoading}>
          {cancelLabel}
        </Button>
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

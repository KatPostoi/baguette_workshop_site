import classNames from 'classnames';
import type { ReactNode } from 'react';

type AuthCardProps = {
  title: string;
  subtitle?: string;
  side?: ReactNode;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
};

export const AuthCard = ({
  title,
  subtitle,
  side,
  onClose,
  children,
  className,
}: AuthCardProps) => {
  const [firstLine, secondLine] = title.split('\n');

  return (
    <div className={classNames('auth-card', className)}>
      <div className="auth-card__header">
        <div>
          <h1 className="auth-card__title">
            {firstLine}
            {secondLine ? <br /> : null}
            {secondLine ? (
              <span className="auth-card__title auth-card__title_accent">
                {secondLine}
              </span>
            ) : null}
          </h1>
          {subtitle ? <p className="auth-card__subtitle">{subtitle}</p> : null}
          {side ? <div className="auth-side">{side}</div> : null}
        </div>
        {onClose ? (
          <button
            type="button"
            className="auth-card__close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        ) : null}
      </div>

      <div className="auth-card__body">{children}</div>
    </div>
  );
};

import classNames from 'classnames';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './button.css';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
};

export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      type={type}
      className={classNames('ui-button', `ui-button_variant_${variant}`, `ui-button_size_${size}`, className, {
        'ui-button_full-width': fullWidth,
        'ui-button_loading': loading,
      })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      <span className="ui-button__label">{children}</span>
      {loading && (
        <span className="ui-button__icon" aria-hidden="true">
          <span className="ui-button__spinner" />
        </span>
      )}
    </button>
  );
};

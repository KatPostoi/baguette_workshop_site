import type {
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import classNames from 'classnames';
import './AdminField.css';

type BaseProps = {
  label: ReactNode;
  className?: string;
};

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'children' | 'type'> & {
    type?: string;
  };

type TextareaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'children'>;

type SelectProps = BaseProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'children'>;

export const AdminInput = ({ label, className, type = 'text', ...rest }: InputProps) => (
  <label className={classNames('admin-field', className)}>
    <span className="admin-field__label">{label}</span>
    <input className="auth-input" type={type} {...rest} />
  </label>
);

export const AdminTextarea = ({ label, className, ...rest }: TextareaProps) => (
  <label className={classNames('admin-field', className)}>
    <span className="admin-field__label">{label}</span>
    <textarea className="auth-input" {...rest} />
  </label>
);

export const AdminSelect = ({
  label,
  className,
  children,
  ...rest
}: PropsWithChildren<SelectProps>) => (
  <label className={classNames('admin-field', className)}>
    <span className="admin-field__label">{label}</span>
    <select className="auth-input" {...rest}>
      {children}
    </select>
  </label>
);

import type {
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import './AdminField.css';

type BaseProps = {
  label: ReactNode;
  helper?: ReactNode;
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

export const AdminInput = ({ label, helper, className, type = 'text', ...rest }: InputProps) => (
  <label className={className}>
    <span>{label}</span>
    <input className="auth-input" type={type} {...rest} />
    {helper ? <small>{helper}</small> : null}
  </label>
);

export const AdminTextarea = ({ label, helper, className, ...rest }: TextareaProps) => (
  <label className={className}>
    <span>{label}</span>
    <textarea className="auth-input" {...rest} />
    {helper ? <small>{helper}</small> : null}
  </label>
);

export const AdminSelect = ({
  label,
  helper,
  className,
  children,
  ...rest
}: PropsWithChildren<SelectProps>) => (
  <label className={className}>
    <span>{label}</span>
    <select className="auth-input" {...rest}>
      {children}
    </select>
    {helper ? <small>{helper}</small> : null}
  </label>
);

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '../ui-kit/Button';
import './AuthLoginForm.css';

export type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

type AuthLoginFormProps = {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  loading?: boolean;
  serverError?: string | null;
  initialEmail?: string;
};

export const AuthLoginForm = ({
  onSubmit,
  loading = false,
  serverError,
  initialEmail = '',
}: AuthLoginFormProps) => {
  const [values, setValues] = useState<LoginFormValues>({
    email: initialEmail,
    password: '',
    remember: true,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});

  const isSubmitDisabled = useMemo(() => loading, [loading]);

  const handleChange =
    (field: keyof LoginFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = field === 'remember' ? event.target.checked : event.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
    };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof LoginFormValues, string>> = {};
    if (!values.email.trim()) {
      nextErrors.email = 'Укажите email';
    }
    if (!values.password.trim()) {
      nextErrors.password = 'Укажите пароль';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    await onSubmit(values);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-field">
        <label className="auth-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange('email')}
          required
        />
        {errors.email ? (
          <span className="auth-error">1{errors.email}</span>
        ) : null}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="login-password">
          Пароль
        </label>
        <input
          id="login-password"
          name="password"
          className="auth-input"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange('password')}
          required
        />
        {errors.password ? (
          <span className="auth-error">2{errors.password}</span>
        ) : null}
      </div>

      <label className="auth-checkbox auth-checkbox--remember">
        <input
          type="checkbox"
          name="remember"
          checked={values.remember}
          onChange={handleChange('remember')}
        />
        <span className="auth-checkbox__text">Запомнить меня</span>
      </label>

      {serverError ? <div className="auth-error">4{serverError}</div> : null}

      <div className="auth-actions">
        <Button type="submit" disabled={isSubmitDisabled}>
          {loading ? 'Входим…' : 'Войти'}
        </Button>
      </div>
    </form>
  );
};

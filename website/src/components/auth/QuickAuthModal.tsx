import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui-kit/Modal/Modal';
import { AuthLoginForm, type LoginFormValues } from './AuthLoginForm';
import { AuthRegisterForm, type RegisterFormValues } from './AuthRegisterForm';
import { useAuth } from '../../state/AuthContext';
import { useAuthModal } from '../../state/AuthModalContext';
import { ApiError } from '../../api/httpClient';
import { AuthSwitchLink } from './AuthSwitchLink';
import './QuickAuthModal.css';

export const QuickAuthModal = () => {
  const { isOpen, mode, close, redirectTo, open } = useAuthModal();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title =
    mode === 'login'
      ? 'Вход в личный\nкабинет'
      : 'Зарегистрируйтесь\nдля совершения покупок!';

  const setMode = (nextMode: 'login' | 'register') => {
    setError(null);
    setLoading(false);
    open(nextMode, redirectTo ?? undefined);
  };

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await login({
        email: values.email.trim(),
        password: values.password.trim(),
        remember: values.remember ?? true,
      });
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }
      close();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Не удалось войти. Попробуйте ещё раз.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await register({
        email: values.email.trim(),
        password: values.password.trim(),
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        gender: values.gender?.trim() || undefined,
        remember: values.remember ?? true,
      });
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }
      close();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Не удалось зарегистрироваться. Попробуйте ещё раз.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} className="quick-auth">
      <div className="quick-auth__header">
        <div>
          <h1 className="quick-auth__title">
            {title.split('\n').map((line, idx) => (
              <span key={line}>
                {line}
                {idx === 0 ? <br /> : null}
              </span>
            ))}
          </h1>
          <AuthSwitchLink mode={mode} onSwitch={setMode} />
        </div>
        <button type="button" className="quick-auth__close" onClick={close} aria-label="Закрыть">
          ×
        </button>
      </div>
      <div className="quick-auth__body">
        {mode === 'login' ? (
          <AuthLoginForm onSubmit={handleLogin} loading={loading} serverError={error} />
        ) : (
          <AuthRegisterForm onSubmit={handleRegister} loading={loading} serverError={error} />
        )}
      </div>
    </Modal>
  );
};

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthCard } from '../components/auth/AuthCard';
import { AuthLoginForm, type LoginFormValues } from '../components/auth/AuthLoginForm';
import { useAuth } from '../state/AuthContext';
import { ApiError } from '../api/httpClient';
import { AuthSwitchLink } from '../components/auth/AuthSwitchLink';
import { AuthPage } from '../components/auth/AuthPage';

type LoginPageProps = {
  redirectTo?: string;
};

export const LoginPage = ({ redirectTo: redirectOverride }: LoginPageProps) => {
  const { login, status, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTo = useMemo(
    () => redirectOverride ?? searchParams.get('redirect') ?? '/account',
    [redirectOverride, searchParams]
  );

  useEffect(() => {
    if (status === 'authenticated' && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [status, user, redirectTo, navigate]);

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await login({
        email: values.email.trim(),
        password: values.password.trim(),
        remember: values.remember,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.log(err);
      const message =
        err instanceof ApiError
          ? err.message
          : 'Не удалось войти. Попробуйте ещё раз.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const title = 'Вход в личный\nкабинет';

  return (
    <AuthPage>
      <AuthCard
        title={title}
        subtitle="Добро пожаловать"
        side={<AuthSwitchLink mode="login" />}
        onClose={() => window.history.back()}
      >
        <AuthLoginForm
          onSubmit={handleSubmit}
          loading={loading}
          serverError={error}
        />
      </AuthCard>
    </AuthPage>
  );
};

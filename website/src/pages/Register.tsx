import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthCard } from '../components/auth/AuthCard';
import { AuthRegisterForm, type RegisterFormValues } from '../components/auth/AuthRegisterForm';
import { useAuth } from '../state/AuthContext';
import { ApiError } from '../api/httpClient';
import { AuthSwitchLink } from '../components/auth/AuthSwitchLink';
import { AuthPage } from '../components/auth/AuthPage';

type RegisterPageProps = {
  redirectTo?: string;
};

export const RegisterPage = ({ redirectTo: redirectOverride }: RegisterPageProps) => {
  const { register, status, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTo = useMemo(
    () => redirectOverride ?? searchParams.get('redirect') ?? '/account',
    [redirectOverride, searchParams],
  );

  useEffect(() => {
    if (status === 'authenticated' && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [status, user, redirectTo, navigate]);

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await register({
        email: values.email.trim(),
        password: values.password.trim(),
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        gender: values.gender?.trim() || undefined,
        remember: values.remember,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Не удалось зарегистрироваться. Попробуйте ещё раз.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const title = 'Зарегистрируйтесь\nдля совершения покупок!';

  return (
    <AuthPage>
      <AuthCard
        title={title}
        subtitle="Создайте аккаунт, чтобы оформить заказ"
        side={<AuthSwitchLink mode="register" />}
        onClose={() => window.history.back()}
      >
        <AuthRegisterForm onSubmit={handleSubmit} loading={loading} serverError={error} />
      </AuthCard>
    </AuthPage>
  );
};

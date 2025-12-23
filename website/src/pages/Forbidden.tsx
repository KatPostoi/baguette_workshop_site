import { LinkAsButton } from '../components/ui-kit/LinkAsButton';
import { AuthPage } from '../components/auth/AuthPage';
import { AuthCard } from '../components/auth/AuthCard';

export const ForbiddenPage = () => (
  <AuthPage>
    <AuthCard title="Нет доступа">
      <p className="auth-card__subtitle">У вас нет прав для просмотра этой страницы.</p>
      <div className="auth-actions">
        <LinkAsButton href="/account" variant="secondary">
          В личный кабинет
        </LinkAsButton>
        <LinkAsButton href="/">На главную</LinkAsButton>
        <LinkAsButton href="/login">Войти под другим пользователем</LinkAsButton>
      </div>
    </AuthCard>
  </AuthPage>
);

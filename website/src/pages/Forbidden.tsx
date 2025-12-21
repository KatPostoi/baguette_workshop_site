import { LinkAsButton } from '../components/ui-kit/LinkAsButton';

export const ForbiddenPage = () => (
  <div className="auth-page">
    <div className="auth-card">
      <div className="auth-card__header">
        <h1 className="auth-card__title">Нет доступа</h1>
      </div>
      <div className="auth-card__body">
        <p className="auth-card__subtitle">У вас нет прав для просмотра этой страницы.</p>
        <div className="auth-actions">
          <LinkAsButton href="/account" variant="secondary">
            В личный кабинет
          </LinkAsButton>
          <LinkAsButton href="/">На главную</LinkAsButton>
        </div>
      </div>
    </div>
  </div>
);

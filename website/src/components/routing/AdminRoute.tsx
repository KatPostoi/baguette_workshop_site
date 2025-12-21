import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import { hasAdminAccess } from '../../state/permissions';
import { ForbiddenPage } from '../../pages/Forbidden';

export const AdminRoute = ({ children }: { children: ReactElement }) => {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return <div className="auth-page">Загружаем профиль…</div>;
  }

  if (!user) {
    const search = new URLSearchParams({ redirect: location.pathname }).toString();
    return <Navigate to={`/login?${search}`} replace />;
  }

  if (!hasAdminAccess(user.role)) {
    return <ForbiddenPage />;
  }

  return children;
};

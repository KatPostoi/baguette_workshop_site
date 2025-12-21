import type { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import CatalogPage from './pages/Catalog';
import { ProcessPage } from './pages/Process';
import { DesignPage } from './pages/Design';
import { ContactsPage } from './pages/Contacts';
import BasketPage from './pages/Basket';
import { PersonalAccountPage } from './pages/PersonalAccount';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { BasketProvider } from './state/BasketContext';
import { FavoritesProvider } from './state/FavoritesContext';
import { AuthProvider, useAuth } from './state/AuthContext';
import { AuthModalProvider } from './state/AuthModalContext';
import { QuickAuthModal } from './components/auth/QuickAuthModal';
import { AdminRoute } from './components/routing/AdminRoute';
import { AdminDashboardPage } from './pages/AdminDashboard';
import { ForbiddenPage } from './pages/Forbidden';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return <div className="auth-page">Загружаем профиль…</div>;
  }

  if (!user) {
    const search = new URLSearchParams({ redirect: location.pathname }).toString();
    return <Navigate to={`/login?${search}`} replace />;
  }

  return children;
};

const RoutedApp = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/design" element={<DesignPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route
          path="/basket"
          element={
            <ProtectedRoute>
              <BasketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <PersonalAccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <QuickAuthModal />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <FavoritesProvider>
          <BasketProvider>
            <BrowserRouter>
              <RoutedApp />
            </BrowserRouter>
          </BasketProvider>
        </FavoritesProvider>
      </AuthModalProvider>
    </AuthProvider>
  );
};

export default App;

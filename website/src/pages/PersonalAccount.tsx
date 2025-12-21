import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MainWrapper } from '../components/common/MainWrapper';
import { SelectedSection } from '../components/common/Favourites/SelectedSection';
import { PersonalDataSection } from '../components/common/PersonalData/PersonalDataSection';
import { useAuth } from '../state/AuthContext';
import { Button } from '../components/ui-kit/Button';
import { UserOrdersSection } from '../components/orders/UserOrdersSection';

export const PersonalAccountPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="PersonalAccountPage">
      <Menu />
      <MainWrapper>
        <Header />
        {user ? (
          <div className="auth-card" style={{ width: '100%' }}>
            <div className="auth-card__header">
              <div>
                <h2 className="auth-card__title">Профиль</h2>
                <p className="auth-card__subtitle">{user.fullName}</p>
                <p className="auth-card__subtitle">{user.email}</p>
                {user.phone ? <p className="auth-card__subtitle">{user.phone}</p> : null}
              </div>
              <Button onClick={logout}>Выйти</Button>
            </div>
          </div>
        ) : null}
        <PersonalDataSection />
        <UserOrdersSection />
        <SelectedSection />
      </MainWrapper>
      <Footer />
    </div>
  );
};

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/Catalog';
import { ProcessPage } from './pages/Process';
import { DesignPage } from './pages/Design';
import { ContactsPage } from './pages/Contacts';
import { BasketPage } from './pages/Basket';
import { PersonalAccountPage } from './pages/PersonalAccount';
import { BasketProvider } from './state/BasketContext';
import { FavoritesProvider } from './state/FavoritesContext';

const getPage = (path: string) => {
  console.log(path);

  switch (path) {
    case '':
    case '/':
    case '/home': {
      return <HomePage />;
    }

    case '/catalog': {
      return <CatalogPage />;
    }

    case '/process': {
      return <ProcessPage />;
    }

    case '/basket': {
      return <BasketPage />;
    }

    case '/contacts': {
      return <ContactsPage />;
    }

    case '/account': {
      return <PersonalAccountPage />;
    }

    case '/design': {
      return <DesignPage />;
    }

    default:
      return <div>DEFAULT</div>;
  }
};

const App = () => {
  const path = (typeof window !== 'undefined' && window.location.pathname) || '';
  return (
    <FavoritesProvider>
      <BasketProvider>{getPage(path)}</BasketProvider>
    </FavoritesProvider>
  );
};

export default App;

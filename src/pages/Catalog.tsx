import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MainWrapper } from '../components/common/MainWrapper';
import { CatalogSection } from '../components/common/Catalog/CatalogSection';
import { useFramesCatalog } from '../hooks/useFramesCatalog';

export const CatalogPage = () => {
  const [frames] = useFramesCatalog();

  return (
    <div className="CatalogPage">
      <Menu />
      <MainWrapper>
        <Header />
        <CatalogSection items={frames} />
      </MainWrapper>
      <Footer />
    </div>
  );
};

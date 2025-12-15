import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MainWrapper } from '../components/common/MainWrapper';
import { MaterialsSection } from '../components/common/Materials/MaterialsSection';
import { ProductionSection } from '../components/common/Production/ProductionSection';
import { productionSectionContent } from '../components/common/Production/productionData.ts';
import { useFrameMaterials } from '../hooks/useFrameMaterials.ts';

export const ProcessPage = () => {
  const { materials, isLoading, error } = useFrameMaterials();
  return (
    <div className="ProcessPage">
      <Menu />
      <MainWrapper>
        <Header />
        <ProductionSection {...productionSectionContent} />
        {isLoading ? (
          <p className="anonymous-pro-bold home-text-block__md__left">Материалы загружаются...</p>
        ) : error ? (
          <p className="anonymous-pro-bold home-text-block__md__left">{error}</p>
        ) : (
          <MaterialsSection items={materials} />
        )}
      </MainWrapper>
      <Footer />
    </div>
  );
};

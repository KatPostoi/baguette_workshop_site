import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MainWrapper } from '../components/common/MainWrapper';
import { MaterialsSection } from '../components/common/Materials/MaterialsSection';
import { ProductionSection } from '../components/common/Production/ProductionSection';
import { productionSectionContent } from '../components/common/Production/productionData.ts';
import { useMaterials } from '../hooks/useMaterials.ts';

export const ProcessPage = () => {
  const [materials] = useMaterials();
  return (
    <div className="ProcessPage">
      <Menu />
      <MainWrapper>
        <Header />
        <ProductionSection {...productionSectionContent} />
        <MaterialsSection items={materials} />
      </MainWrapper>
      <Footer />
    </div>
  );
};

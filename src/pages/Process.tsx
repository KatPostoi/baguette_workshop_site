import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MainWrapper } from '../components/common/MainWrapper';
import { MaterialsSection } from '../components/common/Materials/MaterialsSection';
import { materialsSectionContent } from '../components/common/Materials/materialsData.ts';
import { ProductionSection } from '../components/common/Production/ProductionSection';
import { productionSectionContent } from '../components/common/Production/productionData.ts';

export const ProcessPage = () => {
  return (
    <div className="ProcessPage">
      <Menu />
      <MainWrapper>
        <Header />

        <ProductionSection {...productionSectionContent} />

        <MaterialsSection {...materialsSectionContent} />
      </MainWrapper>
      <Footer />
    </div>
  );
};

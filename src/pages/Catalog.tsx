import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MainWrapper } from '../components/common/MainWrapper';
import { CatalogSection } from '../components/common/Catalog/CatalogSection';
import { сatalogSectionContent } from '../DB/catalog.data.ts';
// import { TopicSection } from '../components/common/TopicSection';
// import { useState } from 'react';

export const CatalogPage = () => {
  // const [isFavoriteActive, setIsFavoriteActive] = useState(false);
  // const [isBasketActive, setIsBasketActive] = useState(false);

  // const handleFavoriteToggle = () => {
  //   setIsFavoriteActive((prev) => !prev);
  // };

  // const handleBasketToggle = () => {
  //   setIsBasketActive((prev) => !prev);
  // };

  return (
    <div className="CatalogPage">
      <Menu />
      <MainWrapper>
        <Header />
        <CatalogSection {...сatalogSectionContent} />
      </MainWrapper>
      <Footer />
    </div>
  );
};

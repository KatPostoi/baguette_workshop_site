import { Menu } from '../components/common/Menu';
import { Footer } from '../components/common/Footer';
import './catalog-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';

export const CatalogPage = () => {
  return (
    <div className="CatalogPage">
      <Menu />
      <MainWrapper>
        <div className="process-header">
          <img className="process-header_image" src="../src/assets/images/block_header.png" alt="HeaderWallpaper" />
        </div>

        {/* <ProcessSection {...processSectionData}/> */}

        <TopicSection title="Каталог" className="catalog-section">
          <div className="filter-wrapper">
            <div className="filter-wrapper_button">
              <h2 className="anonymous-pro-bold home-text-block__xl ">Избранное</h2>
            </div>
            <div className="filter-wrapper_button">
              <h2 className="anonymous-pro-bold home-text-block__xl ">Материал</h2>
            </div>
            <div className="filter-wrapper_button">
              <h2 className="anonymous-pro-bold home-text-block__xl ">Стиль</h2>
            </div>
            <div className="filter-wrapper_button">
              <h2 className="anonymous-pro-bold home-text-block__xl ">Форма</h2>
            </div>
          </div>
          <div className="catalog-wrapper"></div>
        </TopicSection>
      </MainWrapper>
      <Footer />
    </div>
  );
};

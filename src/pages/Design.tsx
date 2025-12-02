import { Menu } from '../components/common/Menu';
import { Footer } from '../components/common/Footer';
import './design-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
// import { TopicSection } from '../components/common/TopicSection';
// import { MaterialsSection } from '../features/materials/MaterialsSection';
// import { materialsSectionContent } from '../features/materials/materialsData';

export const DesignPage = () => {
  return (
    <div className="DesignPage">
      <Menu />
      <MainWrapper>
        <div className="process-header">
          <img className="process-header_image" src="../src/assets/images/block_header.png" alt="HeaderWallpaper" />
        </div>

        <div className="design-constructor-text">
          <h2 className="anonymous-pro-bold home-text-block__md ">
            Дизайн-конструктор багета позволит Вам создать свою, уникальную раму. После оформления заказа специалист
            свяжется с Вами для уточнения деталей, предложит возможные варианты и эскизы выполнения.
          </h2>
        </div>

        <div className="design-constructor-wrapper">
          <div className="design-constructor_block-wrapper">
            <div className="design-constructor_title">
              <h2 className="anonymous-pro-bold home-text-block__xl ">Дизайн-</h2>
              <h2 className="anonymous-pro-bold home-text-block__xl_white ">конструктор</h2>
            </div>
            <div className="icon-image-container">
              <div className="icon-image">
                <img src="../src/assets/images/favorites.svg" alt="IconFavorites" />
              </div>
            </div>
          </div>

          <div className="design-constructor_block-wrapper">
            <div className="design-constructor_content-wrapper_text">
              <div className="design-constructor_content-wrapper_text_double">
                <div className="design-constructor_content-wrapper_text_single">
                  <input
                    type="text"
                    className="anonymous-pro-bold home-text-block__md__left data-text-input"
                    placeholder={'Ширина (мм)'}
                  />
                </div>
                <div className="design-constructor_content-wrapper_text_single">
                  <input
                    type="text"
                    className="anonymous-pro-bold home-text-block__md__left data-text-input"
                    placeholder={'Высота (см)'}
                  />
                </div>
              </div>
              <div className="design-constructor_content-wrapper_text_single">
                <h2 className="anonymous-pro-bold home-text-block__md_white ">Материал</h2>
                <div className="filter-container_arrow"></div>
              </div>
              <div className="design-constructor_content-wrapper_text_single">
                <h2 className="anonymous-pro-bold home-text-block__md_white ">Стиль</h2>
                <div className="filter-container_arrow"></div>
              </div>
            </div>
            <div className="icon-image">
              <img src="../src/assets/images/basket.svg" alt="IconBasket" />
            </div>
          </div>

          <div className="design-constructor_block-wrapper">
            <h2 className="anonymous-pro-bold home-text-block__md__left ">Итого:</h2>
            <h2 className="anonymous-pro-bold home-text-block__md__left ">0 Р</h2>
          </div>
        </div>
      </MainWrapper>
      <Footer />
    </div>
  );
};

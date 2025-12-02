import { Menu } from '../components/common/Menu';
import { Footer } from '../components/common/Footer';
import './basket-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';
// import { MaterialsSection } from '../features/materials/MaterialsSection';
// import { materialsSectionContent } from '../features/materials/materialsData';
import { LinkAsButton } from '../components/ui-kit/LinkAsButton';

export const BasketPage = () => {
  return (
    <div className="BasketPage">
      <Menu />
      <MainWrapper>
        <div className="process-header">
          <img className="process-header_image" src="../src/assets/images/block_header.png" alt="HeaderWallpaper" />
        </div>

        {/* <ProcessSection {...processSectionData}/> */}

        <TopicSection title="Корзина" className="basket-section">
          <div className="basket-wrapper">
            <div className="change-selection">
              <div className="change-selection_button">
                <h2 className="anonymous-pro-bold home-text-block__md  ">Удалить выбранные</h2>
              </div>
              <div className="change-selection_button">
                <h2 className="anonymous-pro-bold home-text-block__md  ">Выбрать все</h2>
              </div>
            </div>
            <div className="goods-in-basket_wrapper">
              <div className="goods-in-basket_wrapper_image"></div>
              <div className="goods-in-basket_wrapper_content">
                <div className="goods-in-basket_wrapper_content_description">
                  <div className="icon-image">
                    <img src="../src/assets/images/favorites.svg" alt="IconFavorites" />
                  </div>
                  <div className="goods-in-basket_wrapper_content_description_text">
                    <h2 className="anonymous-pro-bold home-text-block__sm">Пластиковый багет</h2>
                    <div>
                      <h2 className="anonymous-pro-bold home-text-block__vsm_grey">Цвет: бежевый; Стиль:классика;</h2>
                      <h2 className="anonymous-pro-bold home-text-block__vsm_grey">Ширина: 6,5 см; Высота: 3,5 см</h2>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="Выбрать товар"
                    className="goods-in-basket_wrapper_content_description_square"
                  />
                </div>
                <div className="goods-in-basket_wrapper_content_counting">
                  <div className="goods-in-basket_wrapper_content_counting_box">
                    <h2 className="anonymous-pro-bold home-text-block__md">-</h2>
                    <h2 className="anonymous-pro-bold home-text-block__md">1</h2>
                    <h2 className="anonymous-pro-bold home-text-block__md">+</h2>
                  </div>
                  <h2 className="anonymous-pro-bold home-text-block__md">2675 Р</h2>
                </div>
              </div>
            </div>
            {/* <div className="goods-in-basket_wrapper">
              <div></div>
              <div></div>
            </div> */}
            <div className="delivery-wrapper">
              <div className="delivery-wrapper_agree">
                <h2 className="anonymous-pro-bold home-text-block__md__left  ">Доставка по адресу:</h2>
                <div className="delivery-wrapper_agree_square"></div>
              </div>
              <div className="delivery-wrapper_price">
                <div className="delivery-wrapper_price_data">
                  <h2 className="anonymous-pro-bold home-text-block__md_grey  ">Город,улица,дом</h2>
                </div>
                <h2 className="anonymous-pro-bold home-text-block__md__left  ">300 Р</h2>
              </div>
            </div>
            <div className="total-wrapper">
              <h2 className="anonymous-pro-bold home-text-block__md__left  ">Итого:</h2>
              <h2 className="anonymous-pro-bold home-text-block__md__left  ">5650 Р</h2>
            </div>

            <div className="basket-wrapper_button">
              <LinkAsButton href="#">Оплатить</LinkAsButton>
            </div>
          </div>
        </TopicSection>
      </MainWrapper>
      <Footer />
    </div>
  );
};

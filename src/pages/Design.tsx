import { useState } from 'react';
import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import './design-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { ButtonFavourites } from '../components/ui-kit/ButtonFavourites';
import { useIsFavoriteActive } from '../hooks/useIsFavoriteActive';
import { useSessionId } from '../hooks/useSessionId';

export const DesignPage = () => {
  const sessionId = useSessionId();

  const [isFavoriteActive, handleFavoriteToggle] = useIsFavoriteActive(sessionId || 'default');

  const [isBasketActive, setIsBasketActive] = useState(false);

  const handleBasketToggle = () => {
    setIsBasketActive((prev) => !prev);
  };

  return (
    <div className="DesignPage">
      <Menu />
      <MainWrapper>
        <Header />

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

            <ButtonFavourites isActive={isFavoriteActive} onClick={handleFavoriteToggle} />
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
            <button
              type="button"
              className="icon-image-container"
              onClick={handleBasketToggle}
              aria-pressed={isBasketActive}
            >
              <div className="icon-image">
                <img
                  src={isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'}
                  alt="IconBasket"
                />
              </div>
            </button>
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

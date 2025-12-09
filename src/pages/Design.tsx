import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MainWrapper } from '../components/common/MainWrapper';
// import { ButtonFavorites } from '../components/ui-kit/ButtonFavorites';
// import { ButtonBasket } from '../components/ui-kit/ButtonBasket';
// import { useSessionId } from '../hooks/useSessionId';

import './design-style.css';

export const DesignPage = () => {
  // const sessionId = useSessionId();

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

            {/* <ButtonFavorites frameData={frameData} /> */}
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
            {/* <ButtonBasket frameData={frameData}  /> */}
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

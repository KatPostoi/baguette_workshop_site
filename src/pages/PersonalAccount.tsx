import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import './personalaccount-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';
import { Button } from '../components/ui-kit/Button';

export const PersonalAccountPage = () => {
  return (
    <div className="PersonalAccountPage">
      <Menu />
      <MainWrapper>
        <Header />

        {/* <ProcessSection {...processSectionData}/> */}

        <TopicSection title="Личный кабинет" className="personal-account-section">
          <div className="personal-data-wrapper">
            <div className="design-constructor_content-wrapper_text_double">
              <div className="design-constructor_content-wrapper_text_single">
                <input
                  type="text"
                  className="anonymous-pro-bold home-text-block__md__left data-text-input"
                  placeholder={'ФИО'}
                />
              </div>
              <div className="design-constructor_content-wrapper_text_single">
                <h2 className="anonymous-pro-bold home-text-block__md_grey ">Пол</h2>
                <div className="filter-container_arrow"></div>
              </div>
            </div>
            <div className="design-constructor_content-wrapper_text_single">
              <input
                type="text"
                className="anonymous-pro-bold home-text-block__md__left data-text-input"
                placeholder={'Телефон'}
              />
            </div>
            <div className="design-constructor_content-wrapper_text_single">
              <input
                type="text"
                className="anonymous-pro-bold home-text-block__md__left data-text-input"
                placeholder={'Email'}
              />
            </div>
            <div className="agreement-block">
              <input type="checkbox" className="square-agreement" />
              <h2 className="anonymous-pro-bold home-text-block__vsm ">
                Нажимая на кнопку, Вы даете согласие на обработку персональных данных. Подробную информацию об условиях
                обработки Ваших данных и Ваших правах можно найти в Политике конфиденциальности.
              </h2>
            </div>

            <Button>Сохранить</Button>
          </div>
        </TopicSection>

        {/* <ProcessSection {...processSectionData}/> */}

        <TopicSection title="Избранное" className="favorites-section">
          <div className="favorites-wrapper"></div>
        </TopicSection>
      </MainWrapper>
      <Footer />
    </div>
  );
};

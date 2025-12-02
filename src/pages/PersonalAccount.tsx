import { Menu } from '../components/common/Menu';
import { Footer } from '../components/common/Footer';
import './personalaccount-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';
import { LinkAsButton } from '../components/ui-kit/LinkAsButton';
// import { MaterialsSection } from '../features/materials/MaterialsSection';
// import { materialsSectionContent } from '../features/materials/materialsData';

export const PersonalAccountPage = () => {
  return (
    <div className="PersonalAccountPage">
      <Menu />
      <MainWrapper>
        <div className="process-header">
          <img className="process-header_image" src="../src/assets/images/block_header.png" alt="HeaderWallpaper" />
        </div>

        {/* <ProcessSection {...processSectionData}/> */}

        <TopicSection title="Личный кабинет" className="personal-account-section">
          <div className="personal-data-wrapper">
            <div className="design-constructor_content-wrapper_text_double">
              <div className="design-constructor_content-wrapper_text_single">
                <h2 className="anonymous-pro-bold home-text-block__md_grey  ">ФИО</h2>
              </div>
              <div className="design-constructor_content-wrapper_text_single">
                <h2 className="anonymous-pro-bold home-text-block__md_grey ">Пол</h2>
                <div className="filter-container_arrow"></div>
              </div>
            </div>
            <div className="design-constructor_content-wrapper_text_single">
              <h2 className="anonymous-pro-bold home-text-block__md_grey ">Телефон</h2>
            </div>
            <div className="design-constructor_content-wrapper_text_single">
              <h2 className="anonymous-pro-bold home-text-block__md_grey ">Email</h2>
            </div>
            <div className="agreement-block">
              <div className="square-agreement"></div>
              <h2 className="anonymous-pro-bold home-text-block__vsm ">
                Нажимая на кнопку, Вы даете согласие на обработку персональных данных. Подробную информацию об условиях
                обработки Ваших данных и Ваших правах можно найти в Политике конфиденциальности.
              </h2>
            </div>

            <LinkAsButton href="#">Сохранить</LinkAsButton>
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

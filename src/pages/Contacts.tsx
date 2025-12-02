import { Menu } from '../components/common/Menu';
import { Footer } from '../components/common/Footer';
import './contacts-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';

export const ContactsPage = () => {
  return (
    <div className="ContactsPage">
      <Menu />
      <MainWrapper>
        <div className="process-header">
          <img className="process-header_image" src="../src/assets/images/block_header.png" alt="HeaderWallpaper" />
        </div>

        {/* <ContactsSection {...contactsSectionData}/> */}

        <TopicSection title="Контакты" className="contacts-section">
          <div></div>
        </TopicSection>

        {/* <AddressSection {...addressSectionData}/> */}

        <TopicSection title="Наш адрес" className="address-section">
          <div></div>
        </TopicSection>
      </MainWrapper>
      <Footer />
    </div>
  );
};

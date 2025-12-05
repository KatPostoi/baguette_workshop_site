import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import './contacts-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';

export const ContactsPage = () => {
  return (
    <div className="ContactsPage">
      <Menu />
      <MainWrapper>
        <Header />

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

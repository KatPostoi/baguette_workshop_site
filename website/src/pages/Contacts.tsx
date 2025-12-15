import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import './contacts-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';
import { TopicSectionTitle } from '../components/common/TopicSection/TopicSectionTitle';

export const ContactsPage = () => {
  return (
    <div className="ContactsPage">
      <Menu />
      <MainWrapper>
        <Header />

        {/* <ContactsSection {...contactsSectionData}/> */}

        <TopicSection className="contacts-section">
          <TopicSectionTitle>Контакты</TopicSectionTitle>
          <div></div>
        </TopicSection>

        {/* <AddressSection {...addressSectionData}/> */}

        <TopicSection className="address-section">
          <TopicSectionTitle>Наш адрес</TopicSectionTitle>
          <div></div>
        </TopicSection>
      </MainWrapper>
      <Footer />
    </div>
  );
};

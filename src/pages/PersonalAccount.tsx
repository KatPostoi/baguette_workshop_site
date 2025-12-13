import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MainWrapper } from '../components/common/MainWrapper';
import { SelectedSection } from '../components/common/Favourites/SelectedSection';
import { useLikedFrames } from '../hooks/useLikedFrames.ts';
import { PersonalDataSection } from '../components/common/PersonalData/PersonalDataSection';

export const PersonalAccountPage = () => {
  const likedFrames = useLikedFrames();
  return (
    <div className="PersonalAccountPage">
      <Menu />
      <MainWrapper>
        <Header />
        <PersonalDataSection />
        <SelectedSection likedFrames={likedFrames} />
      </MainWrapper>
      <Footer />
    </div>
  );
};

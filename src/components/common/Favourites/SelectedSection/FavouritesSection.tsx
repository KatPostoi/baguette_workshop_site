import { TopicSection } from '../../TopicSection';
import { CatalogCard } from '../../Catalog/CatalogCard';
import './selected-section-style.css';
import { TopicSectionTitle } from '../../TopicSection/TopicSectionTitle';
import { TEXT_POSITION } from '../../TopicSection/types';
import { useLikedFrames } from '../../../../hooks/useLikedFrames';

export const SelectedSection = () => {
  const likedFrames = useLikedFrames();
  return (
    <TopicSection className="favorites-section">
      <TopicSectionTitle textPosition={TEXT_POSITION.LEFT}>Избранное</TopicSectionTitle>
      <div className="favorites-wrapper">
        {likedFrames.map((item) => (
          <CatalogCard key={item.id} frameData={item} />
        ))}
      </div>
    </TopicSection>
  );
};

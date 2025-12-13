import { TopicSection } from '../../TopicSection';
import { CatalogCard } from '../../Catalog/CatalogCard';
import './selected-section-style.css';
import type { FrameData } from '../../../../DB/types';
import { TopicSectionTitle } from '../../TopicSection/TopicSectionTitle';
import { TEXT_POSITION } from '../../TopicSection/types';

type SelectedSectionProps = {
  likedFrames: FrameData[];
};

export const SelectedSection = ({ likedFrames }: SelectedSectionProps) => {
  return (
    <TopicSection className="favorites-section">
      <TopicSectionTitle textPosition={TEXT_POSITION.LEFT}>Избранное</TopicSectionTitle>
      <div className="favorites-wrapper">
        {/* TODO */}
        {likedFrames.map((item) => (
          <CatalogCard key={item.id} frameData={item} />
        ))}
      </div>
    </TopicSection>
  );
};

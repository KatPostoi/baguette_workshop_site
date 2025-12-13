import { TopicSection } from '../../../common/TopicSection';
import { TopicSectionTitle } from '../../TopicSection/TopicSectionTitle';
import { MaterialCard } from '../MaterialCard';
import type { MaterialItem } from '../types';
import './material-section-style.css';

type MaterialsSectionProps = {
  items: MaterialItem[];
};

export const MaterialsSection = ({ items }: MaterialsSectionProps) => {
  return (
    <TopicSection className="materials-section">
      <TopicSectionTitle>Материалы</TopicSectionTitle>
      <div className="materials-section__cards-wrapper">
        {items.map((item) => (
          <MaterialCard key={item.id} item={item} />
        ))}
      </div>
    </TopicSection>
  );
};

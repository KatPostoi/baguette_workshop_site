import { TopicSection } from '../../../common/TopicSection';
import { MaterialCard } from '../MaterialCard';
import type { MaterialCardContent } from '../types';
import './style.css';

type MaterialsSectionProps = {
  title: string;
  items: MaterialCardContent[];
};

export const MaterialsSection = ({ title, items }: MaterialsSectionProps) => {
  return (
    <TopicSection title={title} className="materials-section">
      <div className="materials-section__cards-wrapper">
        {items.map((item) => (
          <MaterialCard key={item.id} {...item} />
        ))}
      </div>
    </TopicSection>
  );
};

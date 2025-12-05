import { TopicSection } from '../../../common/TopicSection';
import { ProductionCard } from '../ProductionCard';
import type { ProductionCardContent } from '../types';
import './production-section-style.css';

type ProductionSectionProps = {
  title: string;
  items: ProductionCardContent[];
};

export const ProductionSection = ({ title, items }: ProductionSectionProps) => {
  return (
    <TopicSection title={title} className="process-section">
      <div className="process-section_cards-wrapper">
        <div className="process-section_card">
          {items.map((item) => (
            <ProductionCard key={item.id} {...item} />
          ))}
        </div>
        <div className="process-section_card">
          <img className="process-section_image" src="../src/assets/images/half_frame.png" alt="ProcessSectionImage" />
        </div>
      </div>
    </TopicSection>
  );
};

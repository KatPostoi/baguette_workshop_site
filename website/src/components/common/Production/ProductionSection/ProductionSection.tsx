import { useState } from 'react';

import { TopicSection } from '../../../common/TopicSection';
import { TopicSectionTitle } from '../../TopicSection/TopicSectionTitle';
import { ProductionCard } from '../ProductionCard';
import type { ProductionCardContent } from '../types';
import './production-section-style.css';

type ProductionSectionProps = {
  items: ProductionCardContent[];
};

export const ProductionSection = ({ items }: ProductionSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setExpandedId((current) => (current === id ? current : id));
  };

  return (
    <TopicSection title-text-po className="process-section">
      <TopicSectionTitle>Процесс изготовления</TopicSectionTitle>
      <div className="process-section_cards-wrapper">
        <div className="process-section_card">
          {items.map((item) => (
            <ProductionCard
              key={item.id}
              {...item}
              isExpanded={expandedId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
        <div className="process-section_card process-section_card-image">
          <img className="process-section_image" src="../src/assets/images/half_frame.png" alt="ProcessSectionImage" />
        </div>
      </div>
    </TopicSection>
  );
};

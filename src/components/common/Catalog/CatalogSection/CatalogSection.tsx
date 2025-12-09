import type { FrameData } from '../../../../pages/basket.types';
import { TopicSection } from '../../../common/TopicSection';
import { CatalogCard } from '../CatalogCard';

import './catalog-section-style.css';

type CatalogSectionProps = {
  title: string;
  items: FrameData[];
};

export const CatalogSection = ({ title, items }: CatalogSectionProps) => {
  // const likedIds = ['3', '4', '1'];

  return (
    <TopicSection title={title} className="catalog-section">
      <div className="filter-wrapper">
        <div className="filter-wrapper_button">
          <h2 className="anonymous-pro-bold home-text-block__md__left">Избранное</h2>
          <div className="filter-container_arrow"></div>
        </div>
        <div className="filter-wrapper_button">
          <h2 className="anonymous-pro-bold home-text-block__md__left">Материал</h2>
          <div className="filter-container_arrow"></div>
        </div>
        <div className="filter-wrapper_button">
          <h2 className="anonymous-pro-bold home-text-block__md__left">Стиль</h2>
          <div className="filter-container_arrow"></div>
        </div>
        <div className="filter-wrapper_button">
          <h2 className="anonymous-pro-bold home-text-block__md__left">Форма</h2>
          <div className="filter-container_arrow"></div>
        </div>
      </div>
      <div className="catalog-wrapper">
        {items.map((item) => (
          <CatalogCard key={item.id} frameData={item} />
        ))}
      </div>
    </TopicSection>
  );
};

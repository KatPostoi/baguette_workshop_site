// import classNames from 'classnames';
import type { ProductionCardContent } from '../types';
// import { LinkAsButton } from '../../../ui-kit/LinkAsButton';
import './production-card-style.css';

export const ProductionCard = ({ title, text, textnumber }: ProductionCardContent) => {
  return (
    <article className="process-section_card-facts">
      <div className="process-section_card-facts_text">
        <h2 className="anonymous-pro-bold home-text-block__sm_white">{text}</h2>
        <h2 className="anonymous-pro-bold home-text-block__sm_white">{title}</h2>
      </div>
      <div className="process-section_card-number">
        <h2 className="anonymous-pro-bold home-text-block__md">{textnumber}</h2>
      </div>
    </article>
  );
};

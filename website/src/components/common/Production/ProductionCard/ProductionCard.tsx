import classNames from 'classnames';
import type { KeyboardEvent } from 'react';

import type { ProductionCardContent } from '../types';
import './production-card-style.css';

type ProductionCardProps = ProductionCardContent & {
  isExpanded: boolean;
  onToggle: () => void;
};

export const ProductionCard = ({ title, text, textnumber, isExpanded, onToggle }: ProductionCardProps) => {
  const isInteractive = !isExpanded;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <article
      className={classNames('process-section_card-facts', {
        'process-section_card-facts_collapsed': !isExpanded,
      })}
    >
      <div className="process-section_card-facts__text">
        {isExpanded && (
          <h2
            className={classNames('anonymous-pro-bold', 'home-text-block__sm_white', {
              'process-section_card-facts__text-description_active': isExpanded,
            })}
          >
            {text}
          </h2>
        )}
        <h2
          className={classNames('anonymous-pro-bold', 'home-text-block__sm_white', {
            'process-section_card-facts__text-title_active': isExpanded,
          })}
        >
          {title}
        </h2>
      </div>
      <div
        className={classNames('process-section_card-number', { 'process-section_card-number_active': isExpanded })}
        role="button"
        tabIndex={isInteractive ? 0 : -1}
        onClick={isInteractive ? onToggle : undefined}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-label={`Подробнее о шаге ${textnumber}`}
        aria-disabled={!isInteractive}
      >
        <h2 className="anonymous-pro-bold home-text-block__md">{textnumber}</h2>
      </div>
    </article>
  );
};

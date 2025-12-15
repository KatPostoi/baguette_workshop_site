import classNames from 'classnames';
import type { ReactNode } from 'react';
import './topic-section-title.css';
import { TEXT_POSITION } from './types';

type TopicSectionProps = {
  children: ReactNode;
  textPosition?: TEXT_POSITION;
};

export const TopicSectionTitle = ({ textPosition = TEXT_POSITION.CENTER, children }: TopicSectionProps) => {
  return (
    <h2
      className={classNames(
        'topic-section__title',
        'anonymous-pro-bold',
        'home-text-block__xl',
        `text-position-title-${textPosition}`
      )}
    >
      {children}
    </h2>
  );
};

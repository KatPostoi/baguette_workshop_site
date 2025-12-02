import classNames from 'classnames';
import type { ReactNode } from 'react';
import './topic-section.css';

type TopicSectionProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

export const TopicSection = ({ title, children, className }: TopicSectionProps) => {
  return (
    <section className={classNames('topic-section', className)}>
      <h2 className={classNames('topic-section__title', 'anonymous-pro-bold', 'home-text-block__xl')}>{title}</h2>
      {children}
    </section>
  );
};

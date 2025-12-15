import classNames from 'classnames';
import type { ReactNode } from 'react';
import './topic-section.css';

type TopicSectionProps = {
  children: ReactNode;
  className?: string;
};

export const TopicSection = ({ children, className }: TopicSectionProps) => {
  return <section className={classNames('topic-section', className)}>{children}</section>;
};

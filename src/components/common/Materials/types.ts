import type { HTMLAttributeAnchorTarget } from 'react';

export type MaterialCardContent = {
  id: string;
  title: string;
  text: string;
  image: {
    src: string;
    alt: string;
    className?: string;
  };
  cta: {
    label: string;
    href: string;
    target?: HTMLAttributeAnchorTarget;
    rel?: string;
  };
};

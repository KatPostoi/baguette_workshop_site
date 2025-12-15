import classNames from 'classnames';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import './link-as-button.css';

type LinkAsButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

export const LinkAsButton = ({
  children,
  className,
  variant = 'primary',
  target,
  rel,
  href,
  ...rest
}: LinkAsButtonProps) => {
  const computedRel = target === '_blank' ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : rel;

  return (
    <a
      {...rest}
      href={href}
      target={target}
      rel={computedRel || undefined}
      className={classNames('link-as-button', `link-as-button_${variant}`, className)}
    >
      {children}
    </a>
  );
};

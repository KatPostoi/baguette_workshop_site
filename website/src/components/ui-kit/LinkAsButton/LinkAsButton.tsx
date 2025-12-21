import classNames from 'classnames';
import { Link } from 'react-router-dom';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import './link-as-button.css';

type LinkAsButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

const isInternal = (href: string) => href.startsWith('/');

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

  if (isInternal(href) && target !== '_blank') {
    return (
      <Link
        to={href}
        className={classNames('link-as-button', `link-as-button_${variant}`, className)}
        {...rest}
      >
        {children}
      </Link>
    );
  }

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

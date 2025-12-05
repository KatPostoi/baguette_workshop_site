import classNames from 'classnames';
import type { MaterialCardContent } from '../types';
import { LinkAsButton } from '../../../ui-kit/LinkAsButton';
import './material-card-style.css';

export const MaterialCard = ({ title, text, image, cta }: MaterialCardContent) => {
  return (
    <article className="materials-card">
      <h2 className="anonymous-pro-bold home-text-block__md__left">{title}</h2>
      <div className="materials-card__content">
        <div className="anonymous-pro-bold home-text-block__sm_white">{text}</div>
        <div>
          <img className={classNames('materials-card__image', image.className)} src={image.src} alt={image.alt} />
        </div>
      </div>
      <div className="button-position-wrapper">
        <LinkAsButton
          variant="secondary"
          className="materials-card__cta"
          href={cta.href}
          target={cta.target}
          rel={cta.rel}
        >
          {cta.label}
        </LinkAsButton>
      </div>
    </article>
  );
};

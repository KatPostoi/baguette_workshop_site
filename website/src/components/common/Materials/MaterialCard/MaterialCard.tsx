import type { FrameMaterial } from '../../../../api/types';
import { LinkAsButton } from '../../../ui-kit/LinkAsButton';

import './material-card-style.css';

type MaterialCardProps = {
  item: FrameMaterial;
};

export const MaterialCard = ({ item }: MaterialCardProps) => {
  return (
    <div className="materials-card">
      <div className="anonymous-pro-bold home-text-block__md__left ">
        {item.title}
      </div>
      <div className="materials-card__content ">
        <div className="anonymous-pro-bold home-text-block__sm_white">
          {item.description}
        </div>
        <img
          className="materials-card__image"
          src={item.image.src}
          alt={item.image.alt}
        />
      </div>
      <div className="button-position-wrapper">
        <LinkAsButton
          variant="secondary"
          className="materials-card__cta"
          href={`/design?materialId=${encodeURIComponent(item.id.toString())}`}
        >
          Создать свой дизайн
        </LinkAsButton>
      </div>
    </div>
  );
};

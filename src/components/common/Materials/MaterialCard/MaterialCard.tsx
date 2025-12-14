import type { MaterialItem } from '../../../../DB/types';
import { LinkAsButton } from '../../../ui-kit/LinkAsButton';
import './material-card-style.css';

type MaterialCardProps = {
  item: MaterialItem;
};

export const MaterialCard = (props: MaterialCardProps) => {
  const { item } = props;
  return (
    <article className="materials-card">
      <h2 className="anonymous-pro-bold home-text-block__md__left">{item.title}</h2>
      <div className="materials-card__content">
        <div className="anonymous-pro-bold home-text-block__sm_white">{item.description}</div>
        <div>
          <img className="materials-card__image" src={item.image.src} alt={item.image.alt} />
        </div>
      </div>
      <div className="button-position-wrapper">
        <LinkAsButton variant="secondary" className="materials-card__cta" href={`/design?materialId=${item.id}`}>
          Создать свой дизайн
        </LinkAsButton>
      </div>
    </article>
  );
};

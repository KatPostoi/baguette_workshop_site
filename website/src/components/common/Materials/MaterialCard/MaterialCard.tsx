import type { FrameMaterial } from '../../../../api/types';
import './material-card-style.css';

type MaterialCardProps = {
  item: FrameMaterial;
};

export const MaterialCard = ({ item }: MaterialCardProps) => {
  return (
    <div className="material-card">
      <img className="material-card__image" src={item.image.src} alt={item.image.alt} />
      <div className="material-card__body">
        <div className="material-card__title">{item.title}</div>
        <div className="material-card__subtitle">{item.material}</div>
        <div className="material-card__desc">{item.description}</div>
        <div className="material-card__price">{item.pricePerCm} ₽/см</div>
      </div>
    </div>
  );
};

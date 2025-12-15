import { ButtonFavorites } from '../../../ui-kit/ButtonFavorites';

import './catalog-card-style.css';
import { ButtonBasket } from '../../../ui-kit/ButtonBasket';
import type { FrameItem } from '../../../../api/types';
import { formatCurrency } from '../../../../utils/currency';

export const CatalogCard = ({ frameData }: { frameData: FrameItem }) => {
  const priceLabel = formatCurrency(frameData.price);

  return (
    <div className="catalog-wrapper_card">
      <ButtonFavorites frameData={frameData} />
      <div className="catalog-wrapper_card_goods-image">
        <img src={frameData.image.src} alt={frameData.image.alt} />
      </div>
      <div className="catalog-wrapper_card_description">
        <div className="catalog-wrapper_card_description_text">
          <h2 className="anonymous-pro-bold home-text-block__sm">{frameData.title}</h2>
          <h2 className="anonymous-pro-bold home-text-block__vsm_white">{priceLabel}</h2>
        </div>
        <ButtonBasket frameData={frameData} />
      </div>
    </div>
  );
};

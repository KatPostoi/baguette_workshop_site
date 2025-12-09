import classNames from 'classnames';
import { ButtonFavorites } from '../../../ui-kit/ButtonFavorites';
import type { FrameData } from '../../../../pages/basket.types';

import './catalog-card-style.css';
import { ButtonBasket } from '../../../ui-kit/ButtonBasket';

export const CatalogCard = ({ frameData }: { frameData: FrameData }) => {
  return (
    <div className="catalog-wrapper_card">
      <ButtonFavorites frameData={frameData} />
      <img
        className={classNames(`catalog-wrapper_card_goods-image`)}
        src={frameData.image.src}
        alt={frameData.image.alt}
      />
      <div className="catalog-wrapper_card_description">
        <div className="catalog-wrapper_card_description_text">
          <h2 className="anonymous-pro-bold home-text-block__sm">{frameData.title}</h2>
          <h2 className="anonymous-pro-bold home-text-block__vsm_white">{frameData.text}</h2>
        </div>
        <ButtonBasket frameData={frameData} />
      </div>
    </div>
  );
};

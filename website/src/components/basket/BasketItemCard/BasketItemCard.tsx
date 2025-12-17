import type { ChangeEvent } from 'react';
import { ButtonFavorites } from '../../ui-kit/ButtonFavorites';
import { formatCurrency } from '../../../utils/currency';
import type { BasketViewItem } from '../../../hooks/useBasket';
import { IconPlus } from '../../ui-kit/Icons/IconPlus';
import { IconMinus } from '../../ui-kit/Icons/IconMinus';

type BasketItemCardProps = {
  item: BasketViewItem;
  onIncrement: (frameId: string) => void;
  onDecrement: (frameId: string) => void;
  onRemove: (frameId: string) => void;
  onSelectChange: (frameId: string, checked: boolean) => void;
  isSelected: boolean;
  disableActions?: boolean;
};

export const BasketItemCard = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onSelectChange,
  isSelected,
  disableActions = false,
}: BasketItemCardProps) => {
  const handleIncrement = () => onIncrement(item.id);
  const handleDecrement = () => onDecrement(item.id);
  const handleRemove = () => onRemove(item.id);
  const handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectChange(item.id, event.target.checked);
  };

  return (
    <div className="goods-in-basket_wrapper">
      <div className="goods-in-basket_wrapper_image-container">
        <img
          className="goods-in-basket_wrapper_image"
          src={item.frame.image.src}
          alt={item.frame.image.alt}
        />
      </div>

      <div className="goods-in-basket_wrapper_content">
        <div className="goods-in-basket_wrapper_content_description">
          <ButtonFavorites frameData={item.frame} />

          <div className="goods-in-basket_wrapper_content_description_text">
            <h2 className="anonymous-pro-bold home-text-block__sm">{item.frame.title}</h2>
            <div>
              <h2 className="anonymous-pro-bold home-text-block__vsm_grey">
                Цвет: {item.frame.color}; Стиль: {item.frame.style?.name ?? '-'}
              </h2>
              <h2 className="anonymous-pro-bold home-text-block__vsm_grey">
                Ширина: {item.frame.size.widthCm} см; Высота: {item.frame.size.heightCm} см
              </h2>
            </div>
          </div>

          <button
            type='button'
            className='basket-item__remove-button anonymous-pro-bold home-text-block__sm_orange'
            onClick={handleRemove}
            disabled={disableActions}
          >
            Удалить
          </button>

          <div className="basket-item__select-control">
            <input
              type="checkbox"
              className="square-agreement"
              checked={isSelected}
              onChange={handleSelectChange}
              aria-label={`Выбрать товар ${item.frame.title} для заказа`}
            />
          </div>
        </div>

        <div className="goods-in-basket_wrapper_content_counting">
          <div className="goods-in-basket_wrapper_content_counting_box">
            <button
              type="button"
              className="basket-item__quantity-button"
              onClick={handleDecrement}
              disabled={item.quantity <= 1 || disableActions}
              aria-label="Уменьшить количество"
            >
              <IconMinus />
            </button>
            <h2 className="anonymous-pro-bold home-text-block__md">{item.quantity}</h2>
            <button
              type="button"
              className="basket-item__quantity-button"
              onClick={handleIncrement}
              disabled={disableActions}
              aria-label="Увеличить количество"
            >
              <IconPlus />
            </button>
          </div>

          <h2 className="anonymous-pro-bold home-text-block__md">{formatCurrency(item.subtotal)}</h2>
        </div>
      </div>
    </div>
  );
};

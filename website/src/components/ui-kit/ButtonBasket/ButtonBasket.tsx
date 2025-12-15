import classNames from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import './button-basket.css';
import { useIsBasketActive } from '../../../hooks/useIsBasketActive';
import type { FrameItem } from '../../../api/types';
type ButtonBasketProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  frameData: FrameItem;
  className?: string;
};

export const ButtonBasket = ({ frameData, className, disabled, ...rest }: ButtonBasketProps) => {
  const { isBasketActive, toggle, isMutating } = useIsBasketActive(frameData);
  return (
    <button
      type="button"
      className={classNames('icon-image-container', className)}
      onClick={toggle}
      aria-pressed={isBasketActive}
      disabled={isMutating || disabled}
      {...rest}
    >
      <div className="icon-image">
        <img
          src={isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'}
          alt="IconBasket"
        />
      </div>
    </button>
  );
};

import classNames from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import './button-basket.css';
import { useIsBasketActive } from '../../../hooks/useIsBasketActive';
import type { FrameData } from '../../../DB/types';

type ButtonBasketProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  frameData: FrameData;
  className?: string;
};

export const ButtonBasket = ({ frameData, className, ...rest }: ButtonBasketProps) => {
  const [isBasketActive, handleBasketToggle] = useIsBasketActive(frameData);
  return (
    <button
      type="button"
      className={classNames('icon-image-container', className)}
      onClick={handleBasketToggle}
      aria-pressed={isBasketActive}
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

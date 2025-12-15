import classNames from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import './button-favorites.css';
import { useIsFavoriteActive } from '../../../hooks/useIsFavoriteActive';
import type { FrameItem } from '../../../api/types';

type ButtonFavoritesProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  frameData: FrameItem;
  className?: string;
};

export const ButtonFavorites = ({
  frameData,
  className,
  disabled,
  ...rest
}: ButtonFavoritesProps) => {
  const { isFavorite, toggle, isMutating } = useIsFavoriteActive(frameData);
  return (
    <button
      type="button"
      className={classNames('icon-image-container', className)}
      onClick={toggle}
      aria-pressed={isFavorite}
      disabled={isMutating || disabled}
      {...rest}
    >
      <div className="icon-image">
        <img
          src={isFavorite ? '../src/assets/images/favorites-active.svg' : '../src/assets/images/favorites.svg'}
          alt="IconFavorites"
        />
      </div>
    </button>
  );
};

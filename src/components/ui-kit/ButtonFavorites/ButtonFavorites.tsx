import classNames from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import './button-favorites.css';
import { useIsFavoriteActive } from '../../../hooks/useIsFavoriteActive';
import type { FrameItem } from '../../../DB/types';

type ButtonFavoritesProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  frameData: FrameItem;
  className?: string;
};

export const ButtonFavorites = ({ frameData, className, ...rest }: ButtonFavoritesProps) => {
  const [isFavoriteActive, handleFavoriteToggle] = useIsFavoriteActive(frameData);
  return (
    <button
      type="button"
      className={classNames('icon-image-container', className)}
      onClick={handleFavoriteToggle}
      aria-pressed={isFavoriteActive}
      {...rest}
    >
      <div className="icon-image">
        <img
          src={isFavoriteActive ? '../src/assets/images/favorites-active.svg' : '../src/assets/images/favorites.svg'}
          alt="IconFavorites"
        />
      </div>
    </button>
  );
};

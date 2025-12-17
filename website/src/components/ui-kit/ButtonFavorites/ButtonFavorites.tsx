import classNames from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import './button-favorites.css';
import { useIsFavoriteActive } from '../../../hooks/useIsFavoriteActive';
import type { FrameItem } from '../../../api/types';
import favoritesIcon from '../../../assets/images/favorites.svg';
import favoritesActiveIcon from '../../../assets/images/favorites-active.svg';

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
        <img src={isFavorite ? favoritesActiveIcon : favoritesIcon} alt="IconFavorites" />
      </div>
    </button>
  );
};

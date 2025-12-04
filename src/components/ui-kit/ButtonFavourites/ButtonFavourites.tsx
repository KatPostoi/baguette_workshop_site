import classNames from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import './button-favourites.css';

type ButtonFavouritesProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  onClick: () => void;
  isActive: boolean;
  className?: string;
};

export const ButtonFavourites = ({ onClick, isActive, className, ...rest }: ButtonFavouritesProps) => {
  return (
    <button
      type="button"
      className={classNames('icon-image-container', className)}
      onClick={onClick}
      aria-pressed={isActive}
      {...rest}
    >
      <div className="icon-image">
        <img
          src={isActive ? '../src/assets/images/favorites-active.svg' : '../src/assets/images/favorites.svg'}
          alt="IconFavorites"
        />
      </div>
    </button>
  );
};

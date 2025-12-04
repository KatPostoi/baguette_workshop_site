import classNames from 'classnames';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './button-favourites.css';

type ButtonFavouritesProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
};

export const ButtonFavourites = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  type = 'button',
  ...rest
}: ButtonFavouritesProps) => {
  return (
    // <button
    //   {...rest}
    //   type={type}
    //   className={classNames('ui-button', `ui-button_variant_${variant}`, `ui-button_size_${size}`, className, {
    //     'ui-button_full-width': fullWidth,
    //     'ui-button_loading': loading,
    //   })}
    //   disabled={disabled || loading}
    //   aria-busy={loading || undefined}
    // >
    //   <span className="ui-button__label">{children}</span>
    //   {loading && (
    //     <span className="ui-button__icon" aria-hidden="true">
    //       <span className="ui-button__spinner" />
    //     </span>
    //   )}
    // </button>
    <button
      type="button"
      className="icon-image-container"
      onClick={handleFavoriteToggle}
      aria-pressed={isFavoriteActive}
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

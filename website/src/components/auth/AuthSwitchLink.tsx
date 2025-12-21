import { Link } from 'react-router-dom';
import type { MouseEventHandler } from 'react';
import classNames from 'classnames';

type AuthSwitchLinkProps =
  | {
      mode: 'login' | 'register';
      className?: string;
      onSwitch: (mode: 'login' | 'register') => void;
    }
  | {
      mode: 'login' | 'register';
      className?: string;
      onSwitch?: undefined;
    };

export const AuthSwitchLink = ({ mode, className, onSwitch }: AuthSwitchLinkProps) => {
  const isLogin = mode === 'login';
  const targetMode = isLogin ? 'register' : 'login';
  const label = isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти';

  if (onSwitch) {
    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.preventDefault();
      onSwitch(targetMode);
    };

    return (
      <button type="button" className={classNames('auth-footer-link', className)} onClick={handleClick}>
        {label}
      </button>
    );
  }

  const to = isLogin ? '/register' : '/login';

  return (
    <Link to={to} className={classNames('auth-footer-link', className)}>
      {label}
    </Link>
  );
};

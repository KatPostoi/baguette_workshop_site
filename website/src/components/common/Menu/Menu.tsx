import classNames from 'classnames';
import './menu.css';
import { useEffect, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LinkAsButton } from '../../ui-kit/LinkAsButton';
import logoImg from '../../../assets/images/logo.png';
import { useAuth } from '../../../state/AuthContext';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const items: NavItem[] = [
  { id: 'home', label: 'О нас', href: '/' },
  { id: 'catalog', label: 'Каталог', href: '/catalog' },
  { id: 'process', label: 'Процесс изготовления', href: '/process' },
  { id: 'contacts', label: 'Контакты', href: '/contacts' },
  { id: 'basket', label: 'Корзина', href: '/basket' },
  { id: 'account', label: 'Личный кабинет', href: '/account' },
];

export const Menu = () => {
  const { user, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const normalized = location.pathname.replace(/\/+$/, '') || '/';
    const menuItems =
      user?.role === 'ADMIN' ? [...items, { id: 'admin', label: 'Админка', href: '/admin/orders' }] : items;
    const match =
      menuItems.find((item) => item.href === normalized) ??
      menuItems.find((item) => normalized.startsWith(item.href) && item.href !== '/');
    setActiveId(match?.id ?? null);
  }, [location.pathname, user?.role]);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (!user && status === 'unauthenticated' && (item.id === 'basket' || item.id === 'account' || item.id === 'admin')) {
      event.preventDefault();
      navigate(`/login?redirect=${encodeURIComponent(item.href)}`);
    }
  };

  return (
    <div>
      <div className="menu-wrapper">
        <nav className="nav-menu">
          {(user?.role === 'ADMIN' ? [...items, { id: 'admin', label: 'Админка', href: '/admin/orders' }] : items).map((item) => (
            <Link
              to={item.href}
              key={item.id}
              className={classNames('nav-menu__item', 'anonymous-pro-bold', {
                'nav-menu__item_active': item.id === activeId,
              })}
              onClick={(event) => handleNavClick(event, item)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-menu__logo-wrapper ">
          <img className="nav-menu__logo" src={logoImg} alt="Logo" />
        </div>

        <LinkAsButton href="/design">Создать свой дизайн</LinkAsButton>
      </div>
    </div>
  );
};

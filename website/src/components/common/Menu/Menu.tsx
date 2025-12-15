import classNames from 'classnames';
import './menu.css';
import { useEffect, useState } from 'react';
import { LinkAsButton } from '../../ui-kit/LinkAsButton';

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

const normalizePathname = (pathname: string) => {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed.length ? trimmed : '/';
};

const getActiveIdFromPath = (pathname: string) => {
  const normalizedPath = normalizePathname(pathname);
  const exactMatch = items.find((item) => item.href === normalizedPath);

  if (exactMatch) {
    return exactMatch.id;
  }

  const prefixMatch = items.find((item) =>
    normalizedPath.startsWith(item.href.endsWith('/') ? item.href : `${item.href}/`)
  );

  return prefixMatch?.id ?? null;
};

export const Menu = () => {
  const [activeId, setActiveId] = useState(() => {
    if (typeof window === 'undefined') {
      return items[0].id;
    }

    return getActiveIdFromPath(window.location.pathname);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleLocationChange = () => {
      setActiveId(getActiveIdFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  return (
    <div>
      <div className="menu-wrapper">
        <nav className="nav-menu">
          {items.map((item) => (
            <a
              href={item.href}
              key={item.id}
              className={classNames('nav-menu__item', 'anonymous-pro-bold', {
                'nav-menu__item_active': item.id === activeId,
              })}
            >
              <p>{item.label}</p>
            </a>
          ))}
        </nav>

        <div className="nav-menu__logo">
          <img src="../src/assets/images/logo.png" alt="Logo" />
        </div>

        <LinkAsButton href="http://localhost:5173/design">Создать свой дизайн</LinkAsButton>
      </div>
    </div>
  );
};

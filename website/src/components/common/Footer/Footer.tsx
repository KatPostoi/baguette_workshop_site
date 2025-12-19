import classNames from 'classnames';
import './footer.css';

type FooterItem = {
  id: string;
  label: string;
  href: string;
};

const items: FooterItem[] = [
  { id: 'home', label: 'О нас', href: '/home' },
  { id: 'contacts', label: 'Контакты', href: '/contacts' },
  { id: 'politics', label: 'Политика конфиденциальности', href: '/politics' },
  { id: 'telephone', label: '+7 903 777 17 90', href: '/telephone' },
  { id: 'offer', label: 'Публичная оферта', href: '/offer' },
  { id: 'email', label: 'info@frame.ru', href: '/email' },
  {
    id: 'recommendations',
    label: 'Рекомендации по уходу и гарантия',
    href: '/recommendations',
  },
  {
    id: 'address',
    label: 'г. Ростов-на-Дону, ул. Текучёва 189, стр. 1',
    href: '/address',
  },
];

export const Footer = () => {
  return (
    <div className="footer-all">
      <div className="social">
        <h2 className="anonymous-pro-bold home-text-block__md_white">
          Мы в социальных сетях
        </h2>
        <a href="https://t.me/brrro_ru" target="_blank">
          <div className="social-link-tg "></div>
        </a>
        <a href="https://vk.com/brrro_ru" target="_blank">
          <div className="social-link-vk "></div>
        </a>
      </div>
      <nav className="footer-wrapper">
        {items.map((item) => (
          <a
            href={item.href}
            key={item.id}
            className={classNames(
              'footer__item',
              'anonymous-pro-bold',
              'home-text-block__md_white'
            )}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

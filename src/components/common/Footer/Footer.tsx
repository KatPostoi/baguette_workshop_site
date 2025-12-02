import classNames from 'classnames';
import './footer.css';

interface FooterItem {
  id: string;
  label: string;
  href: string;
}

const items: FooterItem[] = [
  { id: 'home', label: 'О нас', href: '/home' },
  { id: 'politics', label: 'Политика конфиденциальности', href: '/politics' },
  { id: 'offer', label: 'Публичная оферта', href: '/offer' },
  { id: 'recommendations', label: 'Рекомендации по уходу и гарантия', href: '/recommendations' },
  { id: 'contacts', label: 'Контакты', href: '/contacts' },
  { id: 'telephone', label: '+7 903 777 17 90', href: '/telephone' },
  { id: 'email', label: 'info@frame.ru', href: '/email' },
  { id: 'address', label: 'г. Ростов-на-Дону, ул. Текучёва 189, стр. 1', href: '/address' },
];

export const Footer = () => {
  return (
    <div className="footer-all">
      <div className="social">
        <h2 className="anonymous-pro-bold home-text-block__md_white">Мы в социальных сетях</h2>
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
            className={classNames('footer__item', 'anonymous-pro-bold', 'home-text-block__md_white')}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

// export const Footer = () => {
//   const [activeId, setActiveId] = useState(items[0].id);
//   return (
//     <div className="footer-wrapper">
//       <div className="info"></div>
//       <div className="info">
//         <nav className="nav-menu">
//           {items.map((item) => (
//             <button
//               key={item.id}
//               className={classNames('nav-menu__item', 'anonymous-pro-bold', {
//                 'nav-menu__item_active': item.id === activeId,
//               })}
//               onClick={() => setActiveId(item.id)}
//             >
//               {item.label}
//             </button>
//           ))}
//         </nav>
//       </div>
//       <div className="info"></div>
//     </div>
//   );
// };

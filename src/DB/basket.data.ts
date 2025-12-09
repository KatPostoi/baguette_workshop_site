import goodsFrameImg21 from '../assets/images/catalog/2.1.png';
import type { FrameData, UslugaData } from '../pages/basket.types';
import { CatalogItemType } from './catalog.data';
import goodsFrameImg22 from '../assets/images/catalog/2.2.png';
// import goodsFrameImg23 from '../../../assets/images/catalog/2.3.png';
// import goodsFrameImg24 from '../../../assets/images/catalog/2.4.png';
// import goodsFrameImg25 from '../../../assets/images/catalog/2.5.png';
// import goodsFrameImg26 from '../../../assets/images/catalog/2.6.png';
// import goodsFrameImg27 from '../../../assets/images/catalog/2.7.png';
// import goodsFrameImg28 from '../../../assets/images/catalog/2.8.png';
// import goodsFrameImg29 from '../../../assets/images/catalog/2.9.png';
// import goodsFrameImg210 from '../../../assets/images/catalog/2.10.png';
// import goodsFrameImg211 from '../../../assets/images/catalog/2.11.png';
// import goodsFrameImg212 from '../../../assets/images/catalog/2.12.png';

export const DATA_FROM_DB: Array<FrameData | UslugaData> = [
  {
    id: '1',
    title: 'Деревянный багет',
    text: "6144 руб./м.п",
    image: {
      src: goodsFrameImg21,
      alt: 'goodsFrame',
    },

    material: 'Дерево',
    type: CatalogItemType.CUSTOM,
    color: 'Коричневый',
    style: 'Минимализм',
    width: '250 мм',
    height: '250 мм',
    price: 6144,
    count: 1,
  },
  {
    id: '2',
    title: 'Деревянный багет',
    text: "11700 руб./м.п",
    image: {
      src: goodsFrameImg22,
      alt: 'goodsFrame',
    },
    material: 'Дерево',
    type: CatalogItemType.CUSTOM,
    color: 'Золотой',
    style: 'Барокко',
    width: '250 мм',
    height: '250 мм',
    price: 11700,
    count: 1,
  },
  {
    id: 3,
    type: 'dostavka',
    price: 300,
  },
];
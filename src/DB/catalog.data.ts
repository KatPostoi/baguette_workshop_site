import goodsFrameImg21 from '../assets/images/catalog/2.1.png';
import goodsFrameImg22 from '../assets/images/catalog/2.2.png';
import goodsFrameImg23 from '../assets/images/catalog/2.3.png';
import goodsFrameImg24 from '../assets/images/catalog/2.4.png';
import goodsFrameImg25 from '../assets/images/catalog/2.5.png';
import goodsFrameImg26 from '../assets/images/catalog/2.6.png';
import goodsFrameImg27 from '../assets/images/catalog/2.7.png';
import goodsFrameImg28 from '../assets/images/catalog/2.8.png';
import goodsFrameImg29 from '../assets/images/catalog/2.9.png';
import goodsFrameImg210 from '../assets/images/catalog/2.10.png';
import goodsFrameImg211 from '../assets/images/catalog/2.11.png';
import goodsFrameImg212 from '../assets/images/catalog/2.12.png';
import type { FrameData } from './types';

export enum CatalogItemType {
  DEFAULT = 'default',
  CUSTOM = 'custom'
}


export const FRAMES_DATA: FrameData[] = [
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
    id: '3',
    title: 'Деревянный багет',
    text: "11250 руб./м.п",
    image: {
      src: goodsFrameImg23,
      alt: 'goodsFrame',
    },
    material: 'Дерево',
    type: CatalogItemType.CUSTOM,
    color: 'Бронзовый',
    style: 'Рококо',
    width: '250 мм',
    height: '250 мм',
    price: 11250,
    count: 1,
  },
  {
    id: '4',
    title: 'Деревянный багет',
    text: "2300 руб./м.п",
    image: {
      src: goodsFrameImg24,
      alt: 'goodsFrame',
    },
    material: 'Дерево',
    type: CatalogItemType.CUSTOM,
    color: 'Коричневый',
    style: 'Классицизм',
    width: '250 мм',
    height: '250 мм',
    price: 2300,
    count: 1,
  },
  {
    id: '5',
    title: 'Пластиковый багет',
    text: "2865 руб./м.п",
    image: {
      src: goodsFrameImg25,
      alt: 'goodsFrame',
    },
    material: 'Пластик',
    type: CatalogItemType.CUSTOM,
    color: 'Черный',
    style: 'Минимализм',
    width: '250 мм',
    height: '250 мм',
    price: 2865,
    count: 1,
  },
  {
    id: '6',
    title: 'Пластиковый багет',
    text: "1350 руб./м.п",
    image: {
      src: goodsFrameImg26,
      alt: 'goodsFrame',
    },
    material: 'Пластик',
    type: CatalogItemType.CUSTOM,
    color: 'Черно-золотой',
    style: 'Ар-деко',
    width: '250 мм',
    height: '250 мм',
    price: 1350,
    count: 1,
  },
  {
    id: '7',
    title: 'Пластиковый багет',
    text: "2675 руб./м.п",
    image: {
      src: goodsFrameImg27,
      alt: 'goodsFrame',
    },
    material: 'Пластик',
    type: CatalogItemType.CUSTOM,
    color: 'Молочный',
    style: 'Минимализм',
    width: '250 мм',
    height: '250 мм',
    price: 2675,
    count: 1,
  },
  {
    id: '8',
    title: 'Пластиковый багет',
    text: "2675 руб./м.п",
    image: {
      src: goodsFrameImg28,
      alt: 'goodsFrame',
    },
    material: 'Пластик',
    type: CatalogItemType.CUSTOM,
    color: 'Коричневый',
    style: 'Минимализм',
    width: '250 мм',
    height: '250 мм',
    price: 2675,
    count: 1,
  },
  {
    id: '9',
    title: 'Деревянный багет',
    text: "2800 руб./м.п",
    image: {
      src: goodsFrameImg29,
      alt: 'goodsFrame',
    },
    material: 'Дерево',
    type: CatalogItemType.CUSTOM,
    color: 'Розовый',
    style: 'Минимализм',
    width: '250 мм',
    height: '250 мм',
    price: 2800,
    count: 1,
  },
  {
    id: '10',
    title: 'Алюминиевый багет',
    text: "2800 руб./м.п",
    image: {
      src: goodsFrameImg210,
      alt: 'goodsFrame',
    },
    material: 'Алюминий',
    type: CatalogItemType.CUSTOM,
    color: 'Белый',
    style: 'Минимализм',
    width: '250 мм',
    height: '250 мм',
    price: 2800,
    count: 1,
  },
  {
    id: '11',
    title: 'Алюминиевый багет',
    text: "1200 руб./м.п",
    image: {
      src: goodsFrameImg211,
      alt: 'goodsFrame',
    },
    material: 'Алюминий',
    type: CatalogItemType.CUSTOM,
    color: 'Коричневый',
    style: 'Минимализм',
    width: '250 мм',
    height: '250 мм',
    price: 1200,
    count: 1,
  },
  {
    id: '12',
    title: 'Алюминиевый багет',
    text: "2600 руб./м.п",
    image: {
      src: goodsFrameImg212,
      alt: 'goodsFrame',
    },
    material: 'Алюминий',
    type: CatalogItemType.CUSTOM,
    color: 'Золотой',
    style: 'Минимализм',
    width: '250 мм',
    height: '250 мм',
    price: 2600,
    count: 1,
  },

]

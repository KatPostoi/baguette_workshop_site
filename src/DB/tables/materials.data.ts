import frameWoodImg from '../../assets/images/frame_wood.png';
import framePlasticImg from '../../assets/images/frame_plastic.png';
import frameMdfImg from '../../assets/images/frame_mdf.png';
import frameAluminumImg from '../../assets/images/frame_aluminum.png';
import type { MaterialItem } from '../types';

export const MATERIALS_DATA: Array<MaterialItem> = [
  {
    id: 'wood',
    title: 'Деревянный багет',
    material: 'Дерево',
    description: "Изготавливается из различных пород дерева (сосна, ель, дуб, бук, берёза и др.). Характеризуется естественной текстурой, теплотой и благородным видом.",
    image: {
      src: frameWoodImg,
      alt: 'FrameWood',
    },
    pricePerCm: 20,
  },
  {
    id: 'plastic',
    title: 'Пластиковый багет',
    material: 'Пластик',
    description: "Изготавливается из полимеров (полистирол, полиуретан). Лёгкий, недорогой, устойчив к влаге и перепадам температур.",
    image: {
      src: framePlasticImg,
      alt: 'PlasticWood',
    },
    pricePerCm: 10,
  },
  {
    id: 'mdf',
    title: 'МДФ багет',
    material: 'МДФ',
    description: "Изготавливается из мелкодисперсной древесноволокнистой плиты, спрессованной под высоким давлением. Обладает плотностью, прочностью и стабильностью формы.",
    image: {
      src: frameMdfImg,
      alt: 'MDFWood',
    },
    pricePerCm: 12,
  },
  {
    id: 'aluminum',
    title: 'Алюминиевый багет',
    material: 'Алюминий',
    description: "Изготавливается из экструдированного алюминия. Лёгкий, прочный, устойчивый к коррозии.",
    image: {
      src: frameAluminumImg,
      alt: 'AluminiumWood',
    },
    pricePerCm: 18,
  },
];

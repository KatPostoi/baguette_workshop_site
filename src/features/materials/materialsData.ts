import frameWoodImg from '../../assets/images/frame_wood.png';
import framePlasticImg from '../../assets/images/frame_plastic.png';
import frameMdfImg from '../../assets/images/frame_mdf.png';
import frameAluminumImg from '../../assets/images/frame_aluminum.png';
import type { MaterialCardContent } from './types';


export const materialsSectionContent: {
  title: string;
  items: MaterialCardContent[];
} = {
  title: 'Материалы',
  items: [
    {
      id: 'wood',
      title: 'Деревянный багет',
      text: "Изготавливается из различных пород дерева (сосна, ель, дуб, бук, берёза и др.). Характеризуется естественной текстурой, теплотой и благородным видом.",
      image: {
        src: frameWoodImg,
        alt: 'FrameWood',
      },
      cta: {
        label: 'Создать свой дизайн',
        href: '#',
      },
    },
    {
      id: 'plastic',
      title: 'Пластиковый багет',
      text: "Изготавливается из полимеров (полистирол, полиуретан). Лёгкий, недорогой, устойчив к влаге и перепадам температур.",
      image: {
        src: framePlasticImg,
        alt: 'PlasticWood',
      },
      cta: {
        label: 'Создать свой дизайн',
        href: '#',
      },
    },
    {
      id: 'mdf',
      title: 'МДФ багет',
      text: "Изготавливается из мелкодисперсной древесноволокнистой плиты, спрессованной под высоким давлением. Обладает плотностью, прочностью и стабильностью формы.",
      image: {
        src: frameMdfImg,
        alt: 'MDFWood',
      },
      cta: {
        label: 'Создать свой дизайн',
        href: '#',
      },
    },
    {
      id: 'aluminum',
      title: 'Алюминиевый багет',
      text: "Изготавливается из экструдированного алюминия. Лёгкий, прочный, устойчивый к коррозии.",
      image: {
        src: frameAluminumImg,
        alt: 'AluminiumWood',
      },
      cta: {
        label: 'Создать свой дизайн',
        href: '#',
      },
    },
  ],
};

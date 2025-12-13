type ImgData = {
  alt: string;
  src: string;
};

export type FrameData = {
  id: string;
  material: string;
  type: string;
  title: string;
  text: string;
  color: string;
  style: string;
  width: string;
  height: string;
  price: number;
  count: number;
  image: ImgData;
};

export type ServiceData = {
  id: number;
  type: string;
  price: number;
};

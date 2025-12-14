type ImgData = {
  alt: string;
  src: string;
};

export type FrameItem = {
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

export type BasketStoredItem = {
  frameId: string;
  quantity: number;
};

export type BasketItem = {
  frame: FrameItem;
  quantity: number;
};

export type ServiceItem = {
  id: number;
  type: string;
  price: number;
};


export type MaterialItem = {
  id: string;
  title: string;
  material: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  pricePerCm: number;
};


export type StyleItem = {
  id: string;
  style: string;
  coefficient: number;
};

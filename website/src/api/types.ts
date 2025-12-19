export interface CatalogImage {
  src: string;
  alt: string;
}

export interface CatalogMaterial {
  id: number;
  title: string;
  material: string;
  description: string;
  pricePerCm: number;
  image: CatalogImage;
}

export interface CatalogStyle {
  id: string;
  name: string;
  coefficient: number;
}

export type CatalogItemType = 'default' | 'custom';

export interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  color: string;
  type: CatalogItemType;
  size: {
    widthCm: number;
    heightCm: number;
  };
  price: number;
  stock: number;
  image: CatalogImage;
  material: CatalogMaterial;
  style: CatalogStyle | null;
}

export type FrameItem = CatalogItem;
export type FrameMaterial = CatalogMaterial;
export type FrameStyle = CatalogStyle;

export interface BasketItem {
  id: string;
  catalogItemId: string;
  quantity: number;
  catalogItem: CatalogItem;
}

export interface FavoriteItem {
  id: string;
  catalogItemId: string;
  catalogItem: CatalogItem;
}

export interface ServiceItem {
  id: number;
  type: string;
  title: string;
  price: number;
}

export type BasketItemResponse = BasketItem;
export type FavoriteItemResponse = FavoriteItem;

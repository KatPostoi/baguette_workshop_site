export interface CatalogImageResponse {
  src: string;
  alt: string;
}

export interface CatalogSizeResponse {
  widthCm: number;
  heightCm: number;
}

export interface CatalogMaterialResponse {
  id: number;
  title: string;
  material: string;
  description: string;
  pricePerCm: number;
  image: CatalogImageResponse;
}

export interface CatalogStyleResponse {
  id: string;
  name: string;
  coefficient: number;
}

export type CatalogItemTypeResponse = 'default' | 'custom';

export interface CatalogItemSummaryResponse {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: CatalogImageResponse;
}

export interface CatalogItemResponse {
  id: string;
  slug: string;
  title: string;
  description: string;
  color: string;
  type: CatalogItemTypeResponse;
  source?: 'default' | 'custom';
  size: CatalogSizeResponse;
  price: number;
  stock: number;
  image: CatalogImageResponse;
  material: CatalogMaterialResponse;
  style: CatalogStyleResponse | null;
}

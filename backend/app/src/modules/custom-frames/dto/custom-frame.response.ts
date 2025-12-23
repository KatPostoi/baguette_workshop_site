import { FrameStyle, FrameMaterial } from '@prisma/client';
import {
  CatalogItemResponse,
  CatalogMaterialResponse,
  CatalogStyleResponse,
} from '../../catalog/dto/catalog-item.response';

export type CustomFrameResponse = CatalogItemResponse & {
  source: 'custom';
};

export type FrameResponse = CustomFrameResponse;

export const mapMaterial = (
  material: FrameMaterial,
): CatalogMaterialResponse => ({
  id: Number(material.id),
  title: material.title,
  material: material.material,
  description: material.description,
  pricePerCm: material.pricePerCm,
  image: {
    src: material.imageUrl,
    alt: material.imageAlt,
  },
});

export const mapStyle = (style: FrameStyle): CatalogStyleResponse => ({
  id: style.id,
  name: style.name,
  coefficient: style.coefficient,
});

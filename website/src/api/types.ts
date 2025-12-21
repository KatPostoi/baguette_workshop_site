export type AuthTokenProvider = () => string | null;

export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string | null;
  fullName: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: UserProfile;
}

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'ASSEMBLY'
  | 'READY_FOR_PICKUP'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Team {
  id: string;
  name: string;
  active: boolean;
}

export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  comment?: string | null;
  createdAt: string;
  changedBy?: {
    id: string;
    fullName: string;
    role: UserRole;
  } | null;
}

export interface OrderItem {
  id: string;
  catalogItemId: string;
  title: string;
  slug: string;
  quantity: number;
  price: number;
  image: {
    src: string;
    alt: string;
  };
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  deliveryAddress?: string | null;
  createdAt: string;
  team?: {
    id: string;
    name: string;
  } | null;
  history?: OrderStatusHistory[];
  items: OrderItem[];
}

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

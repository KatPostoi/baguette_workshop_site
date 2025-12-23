export type AuthTokenProvider = () => string | null;

export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string | null;
  fullName: string;
  gender?: string | null;
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

export type FrameSource = 'default' | 'custom';

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
  catalogItemId?: string;
  customFrameId?: string;
  title: string;
  slug: string;
  quantity: number;
  price: number;
  source: FrameSource;
  size: {
    widthCm: number;
    heightCm: number;
  };
  color?: string | null;
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
export type CustomFrameType = 'custom';

export interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  color: string;
  type: CatalogItemType;
  source?: FrameSource;
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
  catalogItemId?: string;
  customFrameId?: string;
  quantity: number;
  source: FrameSource;
  frame: CatalogItem;
}

export interface FavoriteItem {
  id: string;
  catalogItemId?: string;
  customFrameId?: string;
  source: FrameSource;
  frame: CatalogItem;
}

export interface ServiceItem {
  id: number;
  type: string;
  title: string;
  price: number;
}

export type BasketItemResponse = BasketItem;
export type FavoriteItemResponse = FavoriteItem;

export interface NotificationItem {
  id: string;
  orderId: string;
  type: string;
  message: string;
  createdAt: string;
}

export interface OrderTimeline {
  orderId: string;
  notifications: NotificationItem[];
  history: OrderStatusHistory[];
}

export interface AuditEvent {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  meta?: unknown;
  createdAt: string;
  actor?: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
  } | null;
}

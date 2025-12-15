import { CatalogItemType, OrderStatus, PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const PASSWORD_HASH = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZ2uVH54camzatoorktrENcGukd1m.'; // bcrypt("password")

const frameMaterialsSeed = [
  {
    id: 'wood',
    title: 'Oak frame',
    material: 'Wood',
    description: 'Natural oak profile with warm texture for classic art.',
    imageUrl: '/images/materials/wood.png',
    imageAlt: 'Oak frame',
    pricePerCm: 20,
  },
  {
    id: 'plastic',
    title: 'Plastic frame',
    material: 'Plastic',
    description: 'Affordable lightweight profile resistant to humidity.',
    imageUrl: '/images/materials/plastic.png',
    imageAlt: 'Plastic frame',
    pricePerCm: 10,
  },
  {
    id: 'mdf',
    title: 'MDF frame',
    material: 'MDF',
    description: 'Dense engineered wood that keeps its shape and paints well.',
    imageUrl: '/images/materials/mdf.png',
    imageAlt: 'MDF frame',
    pricePerCm: 12,
  },
  {
    id: 'aluminum',
    title: 'Aluminum frame',
    material: 'Aluminum',
    description: 'Modern anodized profile for posters and photography.',
    imageUrl: '/images/materials/aluminum.png',
    imageAlt: 'Aluminum frame',
    pricePerCm: 18,
  },
];

const frameStylesSeed = [
  { id: 'baroque', name: 'Baroque', coefficient: 1.8 },
  { id: 'minimal', name: 'Minimal', coefficient: 1.0 },
  { id: 'rococo', name: 'Rococo', coefficient: 1.6 },
  { id: 'classic', name: 'Classic', coefficient: 1.4 },
  { id: 'art-deco', name: 'Art Deco', coefficient: 1.5 },
];

const catalogItemsSeed = [
  {
    id: 'frame-wood-classic',
    slug: 'wood-classic-30x40',
    title: 'Classic oak 30x40',
    description: 'Warm oak frame with subtle gold trim for portraits and oil paintings.',
    imageUrl: '/images/catalog/wood-classic.png',
    imageAlt: 'Classic oak frame',
    materialId: 'wood',
    styleId: 'classic',
    color: 'Walnut',
    type: CatalogItemType.CUSTOM,
    widthCm: 30,
    heightCm: 40,
    price: 6200,
    stock: 8,
  },
  {
    id: 'frame-wood-gold',
    slug: 'wood-gold-40x50',
    title: 'Gold carving 40x50',
    description: 'Decorative carved profile with light patina for statement pieces.',
    imageUrl: '/images/catalog/wood-gold.png',
    imageAlt: 'Gold frame',
    materialId: 'wood',
    styleId: 'baroque',
    color: 'Gold',
    type: CatalogItemType.CUSTOM,
    widthCm: 40,
    heightCm: 50,
    price: 8200,
    stock: 5,
  },
  {
    id: 'frame-plastic-white',
    slug: 'plastic-white-30x45',
    title: 'White minimal 30x45',
    description: 'Smooth matte white profile for posters and typography.',
    imageUrl: '/images/catalog/plastic-white.png',
    imageAlt: 'White plastic frame',
    materialId: 'plastic',
    styleId: 'minimal',
    color: 'White',
    type: CatalogItemType.DEFAULT,
    widthCm: 30,
    heightCm: 45,
    price: 3200,
    stock: 15,
  },
  {
    id: 'frame-mdf-graphite',
    slug: 'mdf-graphite-21x30',
    title: 'Graphite MDF 21x30',
    description: 'Matte graphite profile for modern interiors.',
    imageUrl: '/images/catalog/mdf-graphite.png',
    imageAlt: 'Graphite MDF frame',
    materialId: 'mdf',
    styleId: 'art-deco',
    color: 'Graphite',
    type: CatalogItemType.DEFAULT,
    widthCm: 21,
    heightCm: 30,
    price: 2800,
    stock: 20,
  },
  {
    id: 'frame-aluminum-gallery',
    slug: 'aluminum-gallery-50x70',
    title: 'Gallery aluminum 50x70',
    description: 'Thin anodized frame that highlights photography and graphics.',
    imageUrl: '/images/catalog/aluminum-gallery.png',
    imageAlt: 'Gallery aluminum frame',
    materialId: 'aluminum',
    styleId: 'minimal',
    color: 'Silver',
    type: CatalogItemType.DEFAULT,
    widthCm: 50,
    heightCm: 70,
    price: 5400,
    stock: 10,
  },
];

const serviceItemsSeed = [
  { id: 1, type: 'delivery-city', title: 'City delivery', price: 300 },
  { id: 2, type: 'mounting', title: 'On-site mounting', price: 1500 },
];

const usersSeed = [
  {
    id: '017e0d6a-2d9d-45e2-989c-f2f04fc3a1c0',
    email: 'admin@baguette.local',
    phone: '+79990000001',
    fullName: 'Baguette Admin',
    passwordHash: PASSWORD_HASH,
    role: UserRole.ADMIN,
  },
  {
    id: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    email: 'customer@baguette.local',
    phone: '+79990000002',
    fullName: 'Demo Customer',
    passwordHash: PASSWORD_HASH,
    role: UserRole.CUSTOMER,
  },
];

const constructorPresetsSeed = [
  {
    id: 'preset-classic-portrait',
    name: 'Classic portrait 30x40',
    description: 'Ready-to-use portrait preset in a classic style.',
    thumbnail: '/images/presets/classic-portrait.png',
    config: {
      widthCm: 30,
      heightCm: 40,
      materialId: 'wood',
      styleId: 'classic',
      color: 'Walnut',
      extras: { glass: 'museum' },
    },
    userId: null,
  },
  {
    id: 'preset-minimal-poster',
    name: 'Minimal poster 50x70',
    description: 'Thin aluminum combo for contemporary posters.',
    thumbnail: '/images/presets/minimal-poster.png',
    config: {
      widthCm: 50,
      heightCm: 70,
      materialId: 'aluminum',
      styleId: 'minimal',
      color: 'Silver',
      extras: { spacer: true },
    },
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
  },
];

const favoritesSeed = [
  {
    id: 'f0b2b091-63c4-4a4b-8b62-9d9ef15a77d7',
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    catalogItemId: 'frame-wood-classic',
  },
];

const basketItemsSeed = [
  {
    id: 'b4b0a4da-4742-4db1-869a-79f37a9874f2',
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    catalogItemId: 'frame-plastic-white',
    quantity: 2,
  },
];

const ordersSeed = [
  {
    id: 'b06d7a6c-6e62-4a9d-a4f5-7adfd67551c5',
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    customerName: 'Demo Customer',
    customerEmail: 'customer@baguette.local',
    customerPhone: '+79990000002',
    deliveryAddress: '123 Demo Street, Apt 5',
    status: OrderStatus.PENDING,
    total: 9400,
    items: [
      {
        catalogItemId: 'frame-wood-classic',
        title: 'Classic oak 30x40',
        slug: 'wood-classic-30x40',
        price: 6200,
        quantity: 1,
        imageUrl: '/images/catalog/wood-classic.png',
        imageAlt: 'Classic oak frame',
      },
      {
        catalogItemId: 'frame-plastic-white',
        title: 'White minimal 30x45',
        slug: 'plastic-white-30x45',
        price: 3200,
        quantity: 1,
        imageUrl: '/images/catalog/plastic-white.png',
        imageAlt: 'White plastic frame',
      },
    ],
  },
];

const notificationsSeed = [
  {
    id: 'c7b1f0de-0a5a-4d39-97a0-184a99a9c001',
    orderId: 'b06d7a6c-6e62-4a9d-a4f5-7adfd67551c5',
    type: 'order_created',
    message: 'Order was created and is awaiting payment.',
  },
];

async function resetDatabase() {
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.basketItem.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.constructorPreset.deleteMany();
  await prisma.catalogItem.deleteMany();
  await prisma.serviceItem.deleteMany();
  await prisma.frameStyle.deleteMany();
  await prisma.frameMaterial.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await resetDatabase();

  await prisma.frameMaterial.createMany({ data: frameMaterialsSeed });
  await prisma.frameStyle.createMany({ data: frameStylesSeed });
  await prisma.catalogItem.createMany({ data: catalogItemsSeed });
  await prisma.serviceItem.createMany({ data: serviceItemsSeed });

  for (const user of usersSeed) {
    await prisma.user.create({ data: user });
  }

  await prisma.constructorPreset.createMany({ data: constructorPresetsSeed });
  await prisma.favorite.createMany({ data: favoritesSeed });
  await prisma.basketItem.createMany({ data: basketItemsSeed });

  for (const order of ordersSeed) {
    await prisma.order.create({
      data: {
        id: order.id,
        userId: order.userId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        deliveryAddress: order.deliveryAddress,
        status: order.status,
        total: order.total,
        items: {
          createMany: {
            data: order.items,
          },
        },
        notifications: {
          createMany: {
            data: notificationsSeed.filter((note) => note.orderId === order.id),
          },
        },
      },
    });
  }

  console.info('Database seed completed');
}

main()
  .catch((error) => {
    console.error('Database seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { CatalogItemType, OrderStatus, PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const PASSWORD_HASH = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZ2uVH54camzatoorktrENcGukd1m.'; // bcrypt("password")

const frameMaterialsSeed = [
  {
    id: 'wood',
    title: 'Дубовая рама',
    material: 'Дерево',
    description: 'Профиль из натурального дуба с тёплой текстурой для классических работ.',
    imageUrl: '/images/materials/wood.png',
    imageAlt: 'Дубовая рама',
    pricePerCm: 20,
  },
  {
    id: 'plastic',
    title: 'Пластиковая рама',
    material: 'Пластик',
    description: 'Лёгкий недорогой профиль, устойчивый к влажности.',
    imageUrl: '/images/materials/plastic.png',
    imageAlt: 'Пластиковая рама',
    pricePerCm: 10,
  },
  {
    id: 'mdf',
    title: 'Рама из МДФ',
    material: 'МДФ',
    description: 'Плотная древесина, держит форму и хорошо красится.',
    imageUrl: '/images/materials/mdf.png',
    imageAlt: 'Рама из МДФ',
    pricePerCm: 12,
  },
  {
    id: 'aluminum',
    title: 'Алюминиевая рама',
    material: 'Алюминий',
    description: 'Современный анодированный профиль для постеров и фотографий.',
    imageUrl: '/images/materials/aluminum.png',
    imageAlt: 'Алюминиевая рама',
    pricePerCm: 18,
  },
];

const frameStylesSeed = [
  { id: 'baroque', name: 'Барокко', coefficient: 1.8 },
  { id: 'minimal', name: 'Минимализм', coefficient: 1.0 },
  { id: 'rococo', name: 'Рококо', coefficient: 1.6 },
  { id: 'classic', name: 'Классика', coefficient: 1.4 },
  { id: 'art-deco', name: 'Арт-деко', coefficient: 1.5 },
];

const catalogItemsSeed = [
  {
    id: 'frame-wood-classic',
    slug: 'wood-classic-30x40',
    title: 'Классический дуб 30x40',
    description: 'Тёплая дубовая рама с лёгкой золотой патиной для портретов и масляной живописи.',
    imageUrl: '/images/catalog/wood-classic.png',
    imageAlt: 'Классическая дубовая рама',
    materialId: 'wood',
    styleId: 'classic',
    color: 'Орех',
    type: CatalogItemType.CUSTOM,
    widthCm: 30,
    heightCm: 40,
    price: 6200,
    stock: 8,
  },
  {
    id: 'frame-wood-gold',
    slug: 'wood-gold-40x50',
    title: 'Золотая резная 40x50',
    description: 'Декоративный резной профиль с лёгкой патиной для акцентных работ.',
    imageUrl: '/images/catalog/wood-gold.png',
    imageAlt: 'Золотая рама',
    materialId: 'wood',
    styleId: 'baroque',
    color: 'Золото',
    type: CatalogItemType.CUSTOM,
    widthCm: 40,
    heightCm: 50,
    price: 8200,
    stock: 5,
  },
  {
    id: 'frame-plastic-white',
    slug: 'plastic-white-30x45',
    title: 'Белый минимализм 30x45',
    description: 'Матовый белый профиль для постеров и типографики.',
    imageUrl: '/images/catalog/plastic-white.png',
    imageAlt: 'Белая пластиковая рама',
    materialId: 'plastic',
    styleId: 'minimal',
    color: 'Белый',
    type: CatalogItemType.DEFAULT,
    widthCm: 30,
    heightCm: 45,
    price: 3200,
    stock: 15,
  },
  {
    id: 'frame-mdf-graphite',
    slug: 'mdf-graphite-21x30',
    title: 'Графитовый МДФ 21x30',
    description: 'Матовый графитовый профиль для современных интерьеров.',
    imageUrl: '/images/catalog/mdf-graphite.png',
    imageAlt: 'Графитовая рама из МДФ',
    materialId: 'mdf',
    styleId: 'art-deco',
    color: 'Графит',
    type: CatalogItemType.DEFAULT,
    widthCm: 21,
    heightCm: 30,
    price: 2800,
    stock: 20,
  },
  {
    id: 'frame-aluminum-gallery',
    slug: 'aluminum-gallery-50x70',
    title: 'Галерейный алюминий 50x70',
    description: 'Тонкая анодированная рама, подчёркивающая фото и графику.',
    imageUrl: '/images/catalog/aluminum-gallery.png',
    imageAlt: 'Галерейная алюминиевая рама',
    materialId: 'aluminum',
    styleId: 'minimal',
    color: 'Серебро',
    type: CatalogItemType.DEFAULT,
    widthCm: 50,
    heightCm: 70,
    price: 5400,
    stock: 10,
  },
];

const serviceItemsSeed = [
  { id: 1, type: 'delivery-city', title: 'Доставка по городу', price: 300 },
  { id: 2, type: 'mounting', title: 'Монтаж на месте', price: 1500 },
];

const usersSeed = [
  {
    id: '017e0d6a-2d9d-45e2-989c-f2f04fc3a1c0',
    email: 'admin@baguette.local',
    phone: '+79990000001',
    fullName: 'Администратор мастерской',
    passwordHash: PASSWORD_HASH,
    role: UserRole.ADMIN,
  },
  {
    id: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    email: 'customer@baguette.local',
    phone: '+79990000002',
    fullName: 'Демо клиент',
    passwordHash: PASSWORD_HASH,
    role: UserRole.CUSTOMER,
  },
];

const constructorPresetsSeed = [
  {
    id: 'preset-classic-portrait',
    name: 'Классический портрет 30x40',
    description: 'Готовый портретный пресет в классическом стиле.',
    thumbnail: '/images/presets/classic-portrait.png',
    config: {
      widthCm: 30,
      heightCm: 40,
      materialId: 'wood',
      styleId: 'classic',
      color: 'Орех',
      extras: { glass: 'museum' },
    },
    userId: null,
  },
  {
    id: 'preset-minimal-poster',
    name: 'Минималистичный постер 50x70',
    description: 'Тонкий алюминиевый вариант для современных постеров.',
    thumbnail: '/images/presets/minimal-poster.png',
    config: {
      widthCm: 50,
      heightCm: 70,
      materialId: 'aluminum',
      styleId: 'minimal',
      color: 'Серебро',
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
    customerName: 'Демо клиент',
    customerEmail: 'customer@baguette.local',
    customerPhone: '+79990000002',
    deliveryAddress: 'г. Москва, ул. Примерная, д. 123, кв. 5',
    status: OrderStatus.PENDING,
    total: 9400,
    items: [
      {
        catalogItemId: 'frame-wood-classic',
        title: 'Классический дуб 30x40',
        slug: 'wood-classic-30x40',
        price: 6200,
        quantity: 1,
        imageUrl: '/images/catalog/wood-classic.png',
        imageAlt: 'Классическая дубовая рама',
      },
      {
        catalogItemId: 'frame-plastic-white',
        title: 'Белый минимализм 30x45',
        slug: 'plastic-white-30x45',
        price: 3200,
        quantity: 1,
        imageUrl: '/images/catalog/plastic-white.png',
        imageAlt: 'Белая пластиковая рама',
      },
    ],
  },
];

const notificationsSeed = [
  {
    id: 'c7b1f0de-0a5a-4d39-97a0-184a99a9c001',
    orderId: 'b06d7a6c-6e62-4a9d-a4f5-7adfd67551c5',
    type: 'order_created',
    message: 'Заказ создан и ожидает оплаты.',
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
            // orderId связывается автоматически через вложенное создание, передаем только полезные поля
            data: notificationsSeed
              .filter((note) => note.orderId === order.id)
              .map((note) => ({
                id: note.id,
                type: note.type,
                message: note.message,
              })),
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

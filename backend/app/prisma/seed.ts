import {
  CatalogItemType,
  OrderStatus,
  PrismaClient,
  UserRole,
} from '@prisma/client';

const prisma = new PrismaClient();

const PASSWORD_HASH =
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZ2uVH54camzatoorktrENcGukd1m.'; // bcrypt("password")

const frameMaterialsSeed = [
  {
    id: 'wood',
    title: 'Деревянный багет',
    material: 'Дерево',
    description:
      'Изготавливается из различных пород дерева (сосна, ель, дуб, бук, берёза и др.). Характеризуется естественной текстурой, теплотой и благородным видом.',
    imageUrl: '/images/materials/frame_wood.png',
    imageAlt: 'Деревянный багет',
    pricePerCm: 20,
  },
  {
    id: 'plastic',
    title: 'Пластиковый багет',
    material: 'Пластик',
    description:
      'Изготавливается из полимеров (полистирол, полиуретан). Лёгкий, недорогой, устойчив к влаге и перепадам температур.',
    imageUrl: '/images/materials/frame_plastic.png',
    imageAlt: 'Пластиковый багет',
    pricePerCm: 10,
  },
  {
    id: 'mdf',
    title: 'МДФ багет',
    material: 'МДФ',
    description:
      'Изготавливается из мелкодисперсной древесноволокнистой плиты, спрессованной под высоким давлением. Обладает плотностью, прочностью и стабильностью формы.',
    imageUrl: '/images/materials/frame_mdf.png',
    imageAlt: 'МДФ багет',
    pricePerCm: 12,
  },
  {
    id: 'aluminum',
    title: 'Алюминиевый багет',
    material: 'Алюминий',
    description:
      'Изготавливается из экструдированного алюминия. Лёгкий, прочный, устойчивый к коррозии.',
    imageUrl: '/images/materials/frame_aluminum.png',
    imageAlt: 'Алюминиевый багет',
    pricePerCm: 18,
  },
];

const frameStylesSeed = [
  { id: 'baroque', name: 'Барокко', coefficient: 1.8 },
  { id: 'minimalism', name: 'Минимализм', coefficient: 1.0 },
  { id: 'rococo', name: 'Рококо', coefficient: 1.6 },
  { id: 'classicism', name: 'Классицизм', coefficient: 1.4 },
  { id: 'art-deco', name: 'Ар-деко', coefficient: 1.5 },
];

const catalogItemsSeed = [
  {
    id: 'frame-1',
    slug: 'baguette-1',
    title: 'Деревянный багет',
    description: '6144 руб./м.п',
    imageUrl: '/images/catalog/2.1.png',
    imageAlt: 'goodsFrame',
    materialId: 'wood',
    styleId: 'minimalism',
    color: 'Коричневый',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 6144,
    stock: 1,
  },
  {
    id: 'frame-2',
    slug: 'baguette-2',
    title: 'Деревянный багет',
    description: '11700 руб./м.п',
    imageUrl: '/images/catalog/2.2.png',
    imageAlt: 'goodsFrame',
    materialId: 'wood',
    styleId: 'baroque',
    color: 'Золотой',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 11700,
    stock: 1,
  },
  {
    id: 'frame-3',
    slug: 'baguette-3',
    title: 'Деревянный багет',
    description: '11250 руб./м.п',
    imageUrl: '/images/catalog/2.3.png',
    imageAlt: 'goodsFrame',
    materialId: 'wood',
    styleId: 'rococo',
    color: 'Бронзовый',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 11250,
    stock: 1,
  },
  {
    id: 'frame-4',
    slug: 'baguette-4',
    title: 'Деревянный багет',
    description: '2300 руб./м.п',
    imageUrl: '/images/catalog/2.4.png',
    imageAlt: 'goodsFrame',
    materialId: 'wood',
    styleId: 'classicism',
    color: 'Коричневый',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 2300,
    stock: 1,
  },
  {
    id: 'frame-5',
    slug: 'baguette-5',
    title: 'Пластиковый багет',
    description: '2865 руб./м.п',
    imageUrl: '/images/catalog/2.5.png',
    imageAlt: 'goodsFrame',
    materialId: 'plastic',
    styleId: 'minimalism',
    color: 'Черный',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 2865,
    stock: 1,
  },
  {
    id: 'frame-6',
    slug: 'baguette-6',
    title: 'Пластиковый багет',
    description: '1350 руб./м.п',
    imageUrl: '/images/catalog/2.6.png',
    imageAlt: 'goodsFrame',
    materialId: 'plastic',
    styleId: 'art-deco',
    color: 'Черно-золотой',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 1350,
    stock: 1,
  },
  {
    id: 'frame-7',
    slug: 'baguette-7',
    title: 'Пластиковый багет',
    description: '2675 руб./м.п',
    imageUrl: '/images/catalog/2.7.png',
    imageAlt: 'goodsFrame',
    materialId: 'plastic',
    styleId: 'minimalism',
    color: 'Молочный',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 2675,
    stock: 1,
  },
  {
    id: 'frame-8',
    slug: 'baguette-8',
    title: 'Пластиковый багет',
    description: '2675 руб./м.п',
    imageUrl: '/images/catalog/2.8.png',
    imageAlt: 'goodsFrame',
    materialId: 'plastic',
    styleId: 'minimalism',
    color: 'Коричневый',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 2675,
    stock: 1,
  },
  {
    id: 'frame-9',
    slug: 'baguette-9',
    title: 'Деревянный багет',
    description: '2800 руб./м.п',
    imageUrl: '/images/catalog/2.9.png',
    imageAlt: 'goodsFrame',
    materialId: 'wood',
    styleId: 'minimalism',
    color: 'Розовый',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 2800,
    stock: 1,
  },
  {
    id: 'frame-10',
    slug: 'baguette-10',
    title: 'Алюминиевый багет',
    description: '2800 руб./м.п',
    imageUrl: '/images/catalog/2.10.png',
    imageAlt: 'goodsFrame',
    materialId: 'aluminum',
    styleId: 'minimalism',
    color: 'Белый',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 2800,
    stock: 1,
  },
  {
    id: 'frame-11',
    slug: 'baguette-11',
    title: 'Алюминиевый багет',
    description: '1200 руб./м.п',
    imageUrl: '/images/catalog/2.11.png',
    imageAlt: 'goodsFrame',
    materialId: 'aluminum',
    styleId: 'minimalism',
    color: 'Коричневый',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 1200,
    stock: 1,
  },
  {
    id: 'frame-12',
    slug: 'baguette-12',
    title: 'Алюминиевый багет',
    description: '2600 руб./м.п',
    imageUrl: '/images/catalog/2.12.png',
    imageAlt: 'goodsFrame',
    materialId: 'aluminum',
    styleId: 'minimalism',
    color: 'Золотой',
    type: CatalogItemType.CUSTOM,
    widthCm: 25,
    heightCm: 25,
    price: 2600,
    stock: 1,
  },
];

const serviceItemsSeed = [
  { id: 1, type: 'dostavka', title: 'Доставка', price: 300 },
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
      styleId: 'classicism',
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
      styleId: 'minimalism',
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
    catalogItemId: 'frame-2',
  },
];

const basketItemsSeed = [
  {
    id: 'b4b0a4da-4742-4db1-869a-79f37a9874f2',
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    catalogItemId: 'frame-5',
    quantity: 1,
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
    total: 8844,
    items: [
      {
        catalogItemId: 'frame-1',
        title: 'Деревянный багет',
        slug: 'baguette-1',
        price: 6144,
        quantity: 1,
        imageUrl: '/images/catalog/2.1.png',
        imageAlt: 'goodsFrame',
      },
      {
        catalogItemId: 'frame-6',
        title: 'Пластиковый багет',
        slug: 'baguette-6',
        price: 1350,
        quantity: 2,
        imageUrl: '/images/catalog/2.6.png',
        imageAlt: 'goodsFrame',
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

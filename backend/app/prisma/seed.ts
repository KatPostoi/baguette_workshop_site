import {
  CatalogItemType,
  PrismaClient,
  UserRole,
  Prisma,
  OrderStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

const PASSWORD_HASH =
  '$2b$10$uHp25QSrO4ZfHCQp6VZMw.TOGmVgszBBeFIwjQAjtj/M/r55UqDmC'; // bcrypt("password")

type FrameMaterialSeed = Omit<
  Prisma.FrameMaterialCreateManyInput,
  'id' | 'createdAt' | 'updatedAt'
> & { id: number };

type CatalogItemSeed = Omit<
  Prisma.CatalogItemCreateManyInput,
  'materialId' | 'createdAt' | 'updatedAt'
> & { materialId: number };

const frameMaterialsSeed: FrameMaterialSeed[] = [
  {
    id: 1,
    title: 'Деревянный багет',
    material: 'Дерево',
    description:
      'Изготавливается из различных пород дерева (сосна, ель, дуб, бук, берёза и др.). Характеризуется естественной текстурой, теплотой и благородным видом.',
    imageUrl: '/images/materials/frame_wood.png',
    imageAlt: 'Деревянный багет',
    pricePerCm: 20,
  },
  {
    id: 2,
    title: 'Пластиковый багет',
    material: 'Пластик',
    description:
      'Изготавливается из полимеров (полистирол, полиуретан). Лёгкий, недорогой, устойчив к влаге и перепадам температур.',
    imageUrl: '/images/materials/frame_plastic.png',
    imageAlt: 'Пластиковый багет',
    pricePerCm: 10,
  },
  {
    id: 3,
    title: 'МДФ багет',
    material: 'МДФ',
    description:
      'Изготавливается из мелкодисперсной древесноволокнистой плиты, спрессованной под высоким давлением. Обладает плотностью, прочностью и стабильностью формы.',
    imageUrl: '/images/materials/frame_mdf.png',
    imageAlt: 'МДФ багет',
    pricePerCm: 12,
  },
  {
    id: 4,
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

const catalogItemsSeed: CatalogItemSeed[] = [
  {
    id: 'frame-1',
    slug: 'baguette-1',
    title: 'Деревянный багет',
    description: '6144 руб./м.п',
    imageUrl: '/images/catalog/2.1.png',
    imageAlt: 'goodsFrame',
    materialId: 1,
    styleId: 'minimalism',
    color: 'Коричневый',
    type: CatalogItemType.DEFAULT,
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
    materialId: 1,
    styleId: 'baroque',
    color: 'Золотой',
    type: CatalogItemType.DEFAULT,
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
    materialId: 1,
    styleId: 'rococo',
    color: 'Бронзовый',
    type: CatalogItemType.DEFAULT,
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
    materialId: 1,
    styleId: 'classicism',
    color: 'Коричневый',
    type: CatalogItemType.DEFAULT,
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
    materialId: 2,
    styleId: 'minimalism',
    color: 'Черный',
    type: CatalogItemType.DEFAULT,
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
    materialId: 2,
    styleId: 'art-deco',
    color: 'Черно-золотой',
    type: CatalogItemType.DEFAULT,
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
    materialId: 2,
    styleId: 'minimalism',
    color: 'Молочный',
    type: CatalogItemType.DEFAULT,
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
    materialId: 2,
    styleId: 'minimalism',
    color: 'Коричневый',
    type: CatalogItemType.DEFAULT,
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
    materialId: 1,
    styleId: 'minimalism',
    color: 'Розовый',
    type: CatalogItemType.DEFAULT,
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
    materialId: 4,
    styleId: 'minimalism',
    color: 'Белый',
    type: CatalogItemType.DEFAULT,
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
    materialId: 4,
    styleId: 'minimalism',
    color: 'Коричневый',
    type: CatalogItemType.DEFAULT,
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
    materialId: 4,
    styleId: 'minimalism',
    color: 'Золотой',
    type: CatalogItemType.DEFAULT,
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
    email: 'admin1@baguette.local',
    phone: '+78120000001',
    fullName: 'Администратор Невский',
    gender: 'M',
    passwordHash: PASSWORD_HASH,
    role: UserRole.ADMIN,
  },
  {
    id: '1c2d3e4f-1111-2222-3333-444455556666',
    email: 'admin2@baguette.local',
    phone: '+78120000002',
    fullName: 'Администратор Петроградский',
    gender: 'M',
    passwordHash: PASSWORD_HASH,
    role: UserRole.ADMIN,
  },
  {
    id: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    email: 'customer1@baguette.local',
    phone: '+78120000003',
    fullName: 'Ирина Морозова',
    gender: 'F',
    passwordHash: PASSWORD_HASH,
    role: UserRole.CUSTOMER,
  },
  {
    id: '7a7b7c7d-aaaa-bbbb-cccc-ddddeeeeffff',
    email: 'customer2@baguette.local',
    phone: '+78120000004',
    fullName: 'Дмитрий Климов',
    gender: 'M',
    passwordHash: PASSWORD_HASH,
    role: UserRole.CUSTOMER,
  },
  {
    id: '88888888-9999-0000-aaaa-bbbbbbbbbbbb',
    email: 'customer3@baguette.local',
    phone: '+78120000005',
    fullName: 'Екатерина Белова',
    gender: 'F',
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
      materialId: 1,
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
      materialId: 4,
      styleId: 'minimalism',
      color: 'Серебро',
      extras: { spacer: true },
    },
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
  },
];

const customFramesSeed = [
  // Ирина Морозова
  {
    id: 'cf-1-irinam',
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    title: 'Портрет 40x50, классика',
    description: 'Теплый классический вариант для семейного портрета',
    materialId: 1,
    styleId: 'classicism',
    color: 'Орех',
    widthCm: 40,
    heightCm: 50,
    price: 4800,
    previewUrl: '/images/custom/portrait-classic-40x50.png',
  },
  {
    id: 'cf-2-irinam',
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    title: 'Минимал 30x40',
    description: 'Лаконичный алюминий под светлый интерьер',
    materialId: 4,
    styleId: 'minimalism',
    color: 'Серебро',
    widthCm: 30,
    heightCm: 40,
    price: 3600,
    previewUrl: '/images/custom/minimal-30x40.png',
  },
  {
    id: 'cf-3-irinam',
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    title: 'Постер 50x70 барокко',
    description: 'Акцентный вариант с золотым профилем',
    materialId: 1,
    styleId: 'baroque',
    color: 'Золото',
    widthCm: 50,
    heightCm: 70,
    price: 9800,
    previewUrl: '/images/custom/baroque-50x70.png',
  },
  // Дмитрий Климов
  {
    id: 'cf-1-klimov',
    userId: '7a7b7c7d-aaaa-bbbb-cccc-ddddeeeeffff',
    title: 'Спортпостер 60x80',
    description: 'Черный матовый пластик под минимализм',
    materialId: 2,
    styleId: 'minimalism',
    color: 'Черный матовый',
    widthCm: 60,
    heightCm: 80,
    price: 5400,
    previewUrl: '/images/custom/sport-60x80.png',
  },
  {
    id: 'cf-2-klimov',
    userId: '7a7b7c7d-aaaa-bbbb-cccc-ddddeeeeffff',
    title: 'Панорама 90x30',
    description: 'Алюминиевый профиль под серию панорам',
    materialId: 4,
    styleId: 'minimalism',
    color: 'Черный',
    widthCm: 90,
    heightCm: 30,
    price: 4100,
    previewUrl: '/images/custom/panorama-90x30.png',
  },
  {
    id: 'cf-3-klimov',
    userId: '7a7b7c7d-aaaa-bbbb-cccc-ddddeeeeffff',
    title: 'Графика 30x30 ар-деко',
    description: 'Контрастный профиль с золотой кромкой',
    materialId: 2,
    styleId: 'art-deco',
    color: 'Черно-золотой',
    widthCm: 30,
    heightCm: 30,
    price: 2700,
    previewUrl: '/images/custom/artdeco-30x30.png',
  },
  // Екатерина Белова
  {
    id: 'cf-1-belova',
    userId: '88888888-9999-0000-aaaa-bbbbbbbbbbbb',
    title: 'Акварель 25x35',
    description: 'Светлый молочный пластик для акварельных работ',
    materialId: 2,
    styleId: 'minimalism',
    color: 'Молочный',
    widthCm: 25,
    heightCm: 35,
    price: 2400,
    previewUrl: '/images/custom/watercolor-25x35.png',
  },
  {
    id: 'cf-2-belova',
    userId: '88888888-9999-0000-aaaa-bbbbbbbbbbbb',
    title: 'Диплом 30x40 премиум',
    description: 'Премиальный деревянный профиль для документов',
    materialId: 1,
    styleId: 'classicism',
    color: 'Темный орех',
    widthCm: 30,
    heightCm: 40,
    price: 4300,
    previewUrl: '/images/custom/diploma-30x40.png',
  },
  {
    id: 'cf-3-belova',
    userId: '88888888-9999-0000-aaaa-bbbbbbbbbbbb',
    title: 'Свадебное фото 50x60',
    description: 'Легкий алюминий под современный интерьер',
    materialId: 4,
    styleId: 'minimalism',
    color: 'Белый',
    widthCm: 50,
    heightCm: 60,
    price: 5200,
    previewUrl: '/images/custom/wedding-50x60.png',
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

const teamsSeed = [
  {
    id: 'aaa11111-1111-1111-1111-111111111111',
    name: 'Сборка «Классика»',
    active: true,
  },
  {
    id: 'bbb22222-2222-2222-2222-222222222222',
    name: 'Сборка «Современный стиль»',
    active: true,
  },
  {
    id: 'ccc33333-3333-3333-3333-333333333333',
    name: 'Сборка «Премиум»',
    active: true,
  },
  {
    id: 'ddd44444-4444-4444-4444-444444444444',
    name: 'Доставка «Курьер-экспресс»',
    active: true,
  },
];

const ordersSeed = [
  {
    id: 'b06d7a6c-6e62-4a9d-a4f5-7adfd67551c5',
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    customerName: 'Ирина Морозова',
    customerEmail: 'customer1@baguette.local',
    customerPhone: '+78120000003',
    deliveryAddress: 'Санкт-Петербург, пр-т Большевиков, д. 12, кв. 45',
    status: OrderStatus.PENDING,
    total: 11700,
    items: [
      {
        catalogItemId: 'frame-2',
        title: 'Деревянный багет (барокко)',
        slug: 'baguette-2',
        price: 11700,
        quantity: 1,
        imageUrl: '/images/catalog/2.2.png',
        imageAlt: 'goodsFrame',
        widthCm: 25,
        heightCm: 25,
        color: 'Золотой',
      },
    ],
    history: [
      {
        status: OrderStatus.PENDING,
        comment: 'Создан, ожидает оплаты',
        changedBy: null,
      },
    ],
  },
  {
    id: '8e3cc3d0-0c39-4a87-9c5d-6eac5d1a0002',
    userId: '7a7b7c7d-aaaa-bbbb-cccc-ddddeeeeffff',
    customerName: 'Дмитрий Климов',
    customerEmail: 'customer2@baguette.local',
    customerPhone: '+78120000004',
    deliveryAddress: 'Санкт-Петербург, наб. Карповки, 21',
    teamId: 'bbb22222-2222-2222-2222-222222222222',
    status: OrderStatus.ASSEMBLY,
    total: 4025,
    items: [
      {
        catalogItemId: 'frame-3',
        title: 'Деревянный багет',
        slug: 'baguette-3',
        price: 11250,
        quantity: 1,
        imageUrl: '/images/catalog/2.3.png',
        imageAlt: 'goodsFrame',
        widthCm: 25,
        heightCm: 25,
        color: 'Бронзовый',
      },
      {
        catalogItemId: 'frame-6',
        title: 'Пластиковый багет',
        slug: 'baguette-6',
        price: 1350,
        quantity: 1,
        imageUrl: '/images/catalog/2.6.png',
        imageAlt: 'goodsFrame',
        widthCm: 25,
        heightCm: 25,
        color: 'Черно-золотой',
      },
    ],
    history: [
      {
        status: OrderStatus.PENDING,
        comment: 'Создан, ожидает оплаты',
        changedBy: null,
      },
      { status: OrderStatus.PAID, comment: 'Оплачен картой', changedBy: null },
      {
        status: OrderStatus.ASSEMBLY,
        comment: 'Передан в сборку, комплектуем заказ',
        changedBy: '017e0d6a-2d9d-45e2-989c-f2f04fc3a1c0',
      },
    ],
  },
  {
    id: '9f4dd4e1-1d49-4b98-8d6e-7fbd6e2b0003',
    userId: '88888888-9999-0000-aaaa-bbbbbbbbbbbb',
    customerName: 'Екатерина Белова',
    customerEmail: 'customer3@baguette.local',
    customerPhone: '+78120000005',
    deliveryAddress: null,
    teamId: 'aaa11111-1111-1111-1111-111111111111',
    status: OrderStatus.READY_FOR_PICKUP,
    total: 2300,
    items: [
      {
        catalogItemId: 'frame-4',
        title: 'Деревянный багет',
        slug: 'baguette-4',
        price: 2300,
        quantity: 1,
        imageUrl: '/images/catalog/2.4.png',
        imageAlt: 'goodsFrame',
        widthCm: 25,
        heightCm: 25,
        color: 'Коричневый',
      },
    ],
    history: [
      {
        status: OrderStatus.PENDING,
        comment: 'Создан, ожидает оплаты',
        changedBy: null,
      },
      { status: OrderStatus.PAID, comment: 'Оплачен картой', changedBy: null },
      {
        status: OrderStatus.ASSEMBLY,
        comment: 'Передан в сборку',
        changedBy: '017e0d6a-2d9d-45e2-989c-f2f04fc3a1c0',
      },
      {
        status: OrderStatus.READY_FOR_PICKUP,
        comment: 'Готов к выдаче в мастерской',
        changedBy: '017e0d6a-2d9d-45e2-989c-f2f04fc3a1c0',
      },
    ],
  },
  {
    id: '12aa12aa-12aa-12aa-12aa-12aa12aa1204',
    userId: '32c9b77a-5fe8-4efc-9d62-9ce5c6290321',
    customerName: 'Ирина Морозова',
    customerEmail: 'customer1@baguette.local',
    customerPhone: '+78120000003',
    deliveryAddress: 'Кудрово, Европейский пр-т, 10',
    teamId: 'ddd44444-4444-4444-4444-444444444444',
    status: OrderStatus.IN_TRANSIT,
    total: 5475,
    items: [
      {
        catalogItemId: 'frame-7',
        title: 'Пластиковый багет молочный',
        slug: 'baguette-7',
        price: 2675,
        quantity: 1,
        imageUrl: '/images/catalog/2.7.png',
        imageAlt: 'goodsFrame',
        widthCm: 25,
        heightCm: 25,
        color: 'Молочный',
      },
      {
        catalogItemId: 'frame-6',
        title: 'Пластиковый багет',
        slug: 'baguette-6',
        price: 1350,
        quantity: 1,
        imageUrl: '/images/catalog/2.6.png',
        imageAlt: 'goodsFrame',
        widthCm: 25,
        heightCm: 25,
        color: 'Черно-золотой',
      },
      {
        catalogItemId: 'frame-12',
        title: 'Алюминиевый багет',
        slug: 'baguette-12',
        price: 1450,
        quantity: 1,
        imageUrl: '/images/catalog/2.12.png',
        imageAlt: 'goodsFrame',
        widthCm: 25,
        heightCm: 25,
        color: 'Золотой',
      },
    ],
    history: [
      {
        status: OrderStatus.PENDING,
        comment: 'Создан, ожидает оплаты',
        changedBy: null,
      },
      { status: OrderStatus.PAID, comment: 'Оплачен', changedBy: null },
      { status: OrderStatus.ASSEMBLY, comment: 'Сборка', changedBy: null },
      {
        status: OrderStatus.READY_FOR_PICKUP,
        comment: 'Готов к отправке со склада',
        changedBy: '1c2d3e4f-1111-2222-3333-444455556666',
      },
      {
        status: OrderStatus.IN_TRANSIT,
        comment: 'Передан курьеру, в пути',
        changedBy: '1c2d3e4f-1111-2222-3333-444455556666',
      },
    ],
  },
  {
    id: '21bb21bb-21bb-21bb-21bb-21bb21bb2105',
    userId: '7a7b7c7d-aaaa-bbbb-cccc-ddddeeeeffff',
    customerName: 'Дмитрий Климов',
    customerEmail: 'customer2@baguette.local',
    customerPhone: '+78120000004',
    deliveryAddress: null,
    teamId: 'ccc33333-3333-3333-3333-333333333333',
    status: OrderStatus.COMPLETED,
    total: 2300,
    items: [
      {
        catalogItemId: 'frame-4',
        title: 'Деревянный багет',
        slug: 'baguette-4',
        price: 2300,
        quantity: 1,
        imageUrl: '/images/catalog/2.4.png',
        imageAlt: 'goodsFrame',
        widthCm: 25,
        heightCm: 25,
        color: 'Коричневый',
      },
    ],
    history: [
      {
        status: OrderStatus.PENDING,
        comment: 'Создан, ожидает оплаты',
        changedBy: null,
      },
      { status: OrderStatus.PAID, comment: 'Оплачен', changedBy: null },
      { status: OrderStatus.ASSEMBLY, comment: 'В работе', changedBy: null },
      {
        status: OrderStatus.READY_FOR_PICKUP,
        comment: 'Ждёт клиента в мастерской',
        changedBy: null,
      },
      {
        status: OrderStatus.RECEIVED,
        comment: 'Выдан клиенту',
        changedBy: null,
      },
      { status: OrderStatus.COMPLETED, comment: 'Закрыт', changedBy: null },
    ],
  },
  {
    id: '31cc31cc-31cc-31cc-31cc-31cc31cc3106',
    userId: '88888888-9999-0000-aaaa-bbbbbbbbbbbb',
    customerName: 'Екатерина Белова',
    customerEmail: 'customer3@baguette.local',
    customerPhone: '+78120000005',
    deliveryAddress: 'Пушкин, Софийская ул., 18',
    teamId: 'ddd44444-4444-4444-4444-444444444444',
    status: OrderStatus.CANCELLED,
    total: 2800,
    items: [
      {
        catalogItemId: 'frame-10',
        title: 'Алюминиевый багет',
        slug: 'baguette-10',
        price: 2800,
        quantity: 1,
        imageUrl: '/images/catalog/2.10.png',
        imageAlt: 'goodsFrame',
        widthCm: 25,
        heightCm: 25,
        color: 'Белый',
      },
    ],
    history: [
      {
        status: OrderStatus.PENDING,
        comment: 'Создан, ожидает оплаты',
        changedBy: null,
      },
      { status: OrderStatus.PAID, comment: 'Оплачен', changedBy: null },
      {
        status: OrderStatus.ASSEMBLY,
        comment: 'Передан мастерам',
        changedBy: null,
      },
      {
        status: OrderStatus.CANCELLED,
        comment: 'Отменён по просьбе клиента',
        changedBy: '88888888-9999-0000-aaaa-bbbbbbbbbbbb',
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
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.basketItem.deleteMany();
  await prisma.customFrame.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.constructorPreset.deleteMany();
  await prisma.catalogItem.deleteMany();
  await prisma.serviceItem.deleteMany();
  await prisma.frameStyle.deleteMany();
  await prisma.frameMaterial.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await resetDatabase();

  await prisma.frameMaterial.createMany({
    data: frameMaterialsSeed.map((material) => ({
      ...material,
      id: material.id as unknown as Prisma.FrameMaterialCreateManyInput['id'],
    })),
  });
  await prisma.frameStyle.createMany({ data: frameStylesSeed });
  await prisma.catalogItem.createMany({
    data: catalogItemsSeed.map((item) => ({
      ...item,
      materialId:
        item.materialId as unknown as Prisma.CatalogItemCreateManyInput['materialId'],
    })),
  });
  await prisma.serviceItem.createMany({ data: serviceItemsSeed });
  await prisma.team.createMany({ data: teamsSeed });

  for (const user of usersSeed) {
    await prisma.user.create({ data: user });
  }

  await prisma.constructorPreset.createMany({ data: constructorPresetsSeed });
  await prisma.favorite.createMany({ data: favoritesSeed });
  await prisma.basketItem.createMany({ data: basketItemsSeed });
  await prisma.customFrame.createMany({ data: customFramesSeed });

  for (const order of ordersSeed) {
    await prisma.order.create({
      data: {
        id: order.id,
        userId: order.userId,
        teamId: order.teamId,
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
        history: {
          createMany: {
            data: (order.history ?? []).map((h) => ({
              status: h.status,
              comment: h.comment,
              changedBy: h.changedBy,
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

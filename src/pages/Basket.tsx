import { Menu } from '../components/common/Menu';
import { Footer } from '../components/common/Footer';
import './basket-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui-kit/Button';

type FrameData = {
  id: number;
  type: string;
  title: string;
  color: string;
  style: string;
  width: string;
  height: string;
  price: number;
  count: number;
  isLiked: boolean;
  image: string;
};

type UslugaData = {
  id: number;
  type: string;
  price: number;
};

const DATA_FROM_DB: Array<FrameData | UslugaData> = [
  {
    id: 1,
    type: 'rama',
    title: 'Пластиковый багет',
    color: 'бежевый',
    style: 'классика',
    width: '6,5',
    height: '3,5',
    price: 2675,
    count: 1,
    isLiked: false,
    image: '',
  },
  {
    id: 2,
    type: 'rama',
    title: 'Дубовая багет',
    color: 'коричневый',
    style: 'классика',
    width: '6,5',
    height: '3,5',
    price: 7775,
    count: 1,
    isLiked: false,
    image: '',
  },
  {
    id: 3,
    type: 'dostavka',
    price: 300,
  },
];

const FrameItem = (props: { data: FrameData }) => {
  const { data } = props;
  return (
    <div className="goods-in-basket_wrapper">
      <div className="goods-in-basket_wrapper_image"></div>
      <div className="goods-in-basket_wrapper_content">
        <div className="goods-in-basket_wrapper_content_description">
          <div className="icon-image">
            <img src="../src/assets/images/favorites.svg" alt="IconFavorites" />
          </div>
          <div className="goods-in-basket_wrapper_content_description_text">
            <h2 className="anonymous-pro-bold home-text-block__sm">{data.title}</h2>
            <div>
              <h2 className="anonymous-pro-bold home-text-block__vsm_grey">
                Цвет: {data.color}; Стиль:{data.style};
              </h2>
              <h2 className="anonymous-pro-bold home-text-block__vsm_grey">
                Ширина: {data.width} см; Высота: {data.height} см
              </h2>
            </div>
          </div>
          <input type="checkbox" className="square-agreement" />
        </div>
        <div className="goods-in-basket_wrapper_content_counting">
          <div className="goods-in-basket_wrapper_content_counting_box">
            <h2 className="anonymous-pro-bold home-text-block__md">-</h2>
            <h2 className="anonymous-pro-bold home-text-block__md">1</h2>
            <h2 className="anonymous-pro-bold home-text-block__md">+</h2>
          </div>
          <h2 className="anonymous-pro-bold home-text-block__md">{data.price} Р</h2>
        </div>
      </div>
    </div>
  );
};

const DostavkaItem = (props: {
  data: UslugaData;
  setAddressText: (newAddressText: string) => void;
  addressText: string;
}) => {
  const { data, addressText, setAddressText } = props;

  return (
    <div className="delivery-wrapper">
      <div className="delivery-wrapper_agree">
        <h2 className="anonymous-pro-bold home-text-block__md__left  ">Доставка по адресу:</h2>
        <input type="checkbox" className="square-agreement" />
      </div>
      <div className="delivery-wrapper_price">
        <div className="delivery-wrapper_price_data">
          <input
            type="text"
            className="anonymous-pro-bold home-text-block__md__left data-text-input"
            placeholder={'Адрес доставки'}
            value={addressText}
            onChange={(e) => {
              setAddressText(e.target.value);
            }}
          />
        </div>
        <h2 className="anonymous-pro-bold home-text-block__md__left  ">{data.price} Р</h2>
      </div>
    </div>
  );
};

const calculateSum = (items: Array<FrameData | UslugaData>) => {
  const s = items.reduce((totalPrice, val) => {
    totalPrice += val.price;
    return totalPrice;
  }, 0);

  return s;
};

const TotalPrice = (props: {
  selectedItems: Array<FrameData | UslugaData>;
  summ: number;
  setSumm: (newSum: number) => void;
}) => {
  const { selectedItems, summ, setSumm } = props;

  useEffect(() => {
    const s = calculateSum(selectedItems);
    setSumm(s);
  }, [selectedItems]);

  return (
    <div className="total-wrapper">
      <h2 className="anonymous-pro-bold home-text-block__md__left  ">Итого:</h2>
      <h2 className="anonymous-pro-bold home-text-block__md__left  ">{summ} Р</h2>
    </div>
  );
};

export const BasketPage = () => {
  // DATA_FROM_DB
  const [selectedItems, setSelectedItems] = useState([]);

  const [addressText, setAddressText] = useState('');

  const [summ, setSumm] = useState(0);

  const dostavkaData = DATA_FROM_DB.filter((item) => item.type === 'dostavka')[0] as UslugaData;

  const frames = DATA_FROM_DB.filter((item) => item.type === 'rama') as Array<FrameData>;

  const frameItems = frames.map((frameData) => {
    return <FrameItem key={frameData.id} data={frameData} />;
  });

  const onPay = () => {
    console.log(addressText);
    console.log(summ);
  };

  return (
    <div className="BasketPage">
      <Menu />
      <MainWrapper>
        <div className="process-header">
          <img className="process-header_image" src="../src/assets/images/block_header.png" alt="HeaderWallpaper" />
        </div>

        {/* <ProcessSection {...processSectionData}/> */}

        <TopicSection title="Корзина" className="basket-section">
          <div className="basket-wrapper">
            <div className="change-selection">
              <div className="change-selection_button">
                <h2 className="anonymous-pro-bold home-text-block__md  ">Удалить выбранные</h2>
              </div>
              <div className="change-selection_button">
                <h2 className="anonymous-pro-bold home-text-block__md  ">Выбрать все</h2>
              </div>
            </div>

            {frameItems}

            {!!dostavkaData && (
              <DostavkaItem data={dostavkaData} addressText={addressText} setAddressText={setAddressText} />
            )}

            <TotalPrice selectedItems={selectedItems} summ={summ} setSumm={setSumm} />
            <div className="basket-wrapper_button">
              <Button onClick={onPay}>Оплатить</Button>
            </div>
          </div>
        </TopicSection>
      </MainWrapper>
      <Footer />
    </div>
  );
};

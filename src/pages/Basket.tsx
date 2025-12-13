import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import './basket-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui-kit/Button';
import { ButtonFavorites } from '../components/ui-kit/ButtonFavorites';
import type { FrameData, ServiceData } from '../DB/types';
import { useServicesData } from '../hooks/useServicesData';
import { useBasketFrames } from '../hooks/useBasketFrames';
import { TopicSectionTitle } from '../components/common/TopicSection/TopicSectionTitle';
import { TEXT_POSITION } from '../components/common/TopicSection/types';

const FrameItem = ({
  data,
  isSelected,
  setSelectedItem,
}: {
  data: FrameData;
  isSelected: boolean;
  setSelectedItem: (item: FrameData, checked: boolean) => void;
}) => (
  <div className="goods-in-basket_wrapper">
    <div className="goods-in-basket_wrapper_image-container">
      <img className="goods-in-basket_wrapper_image" src={data.image.src} alt={data.image.alt} />
    </div>
    <div className="goods-in-basket_wrapper_content">
      <div className="goods-in-basket_wrapper_content_description">
        <ButtonFavorites frameData={data} />
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
        <input
          type="checkbox"
          className="square-agreement"
          checked={isSelected}
          onChange={(e) => setSelectedItem(data, e.target.checked)}
        />
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

const DeliveryItem = (props: {
  data: ServiceData;
  setAddressText: (newAddressText: string) => void;
  addressText: string;
  isSelected: boolean;
  setSelectedItem: (item: ServiceData, checked: boolean) => void;
}) => {
  const { data, addressText, setAddressText, isSelected, setSelectedItem } = props;

  return (
    <div className="delivery-wrapper">
      <div className="delivery-wrapper_agree">
        <h2 className="anonymous-pro-bold home-text-block__md__left  ">Доставка по адресу:</h2>
        <input
          type="checkbox"
          className="square-agreement"
          checked={isSelected}
          onChange={(e) => setSelectedItem(data, e.target.checked)}
        />
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

const calculateSum = (items: Array<FrameData | ServiceData>) => {
  const s = items.reduce((totalPrice, val) => {
    totalPrice += val.price;
    return totalPrice;
  }, 0);

  return s;
};

const TotalPrice = (props: {
  selectedItems: Array<FrameData | ServiceData>;
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

const getItemKey = (item: FrameData | ServiceData) => `${item.type}-${item.id}`;

export const BasketPage = () => {
  const [selectedItems, setSelectedItems] = useState<Array<FrameData | ServiceData>>([]);
  const [addressText, setAddressText] = useState('');
  const [summ, setSumm] = useState(0);

  const [frames] = useBasketFrames();
  const [services] = useServicesData();

  const toggleSelectedItem = (item: FrameData | ServiceData, isSelected: boolean) => {
    setSelectedItems((prev) => {
      const filtered = prev.filter((prevItem) => getItemKey(prevItem) !== getItemKey(item));
      if (isSelected) {
        return [...filtered, item];
      }
      return filtered;
    });
  };

  const isItemSelected = (item: FrameData | ServiceData) =>
    selectedItems.some((selected) => getItemKey(selected) === getItemKey(item));

  const onPay = () => {
    console.log(addressText);
    console.log(summ);
  };

  const frameItems = frames.map((frameData) => {
    return (
      <FrameItem
        key={`frame-${frameData.id}`}
        data={frameData}
        isSelected={isItemSelected(frameData)}
        setSelectedItem={toggleSelectedItem}
      />
    );
  });

  const servicesItems = services.map((deliveryData) => {
    return (
      <DeliveryItem
        key={`delivery-${deliveryData.id}`}
        data={deliveryData}
        addressText={addressText}
        setAddressText={setAddressText}
        isSelected={isItemSelected(deliveryData)}
        setSelectedItem={toggleSelectedItem}
      />
    );
  });

  return (
    <div className="BasketPage">
      <Menu />
      <MainWrapper>
        <Header />

        {/* <ProcessSection {...processSectionData}/> */}

        <TopicSection className="basket-section">
          <TopicSectionTitle textPosition={TEXT_POSITION.LEFT}>Корзина</TopicSectionTitle>
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
            {servicesItems}

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

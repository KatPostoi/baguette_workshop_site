import { useEffect, useMemo, useState } from 'react';
import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import './basket-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';
import { TopicSectionTitle } from '../components/common/TopicSection/TopicSectionTitle';
import { TEXT_POSITION } from '../components/common/TopicSection/types';
import { useServicesData } from '../hooks/useServicesData';
import { useBasket } from '../hooks/useBasket';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { createOrder } from '../api/orders';
import {
  BasketEmptyState,
  BasketItemCard,
  BasketSummary,
  DeliveryOption,
} from '../components/basket';

const BasketPage = () => {
  const {
    items,
    isLoading,
    isProcessing,
    error,
    incrementItem,
    decrementItem,
    removeItem,
    clear,
  } = useBasket();
  const {
    services,
    isLoading: isServicesLoading,
    error: servicesError,
  } = useServicesData();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectionMap, setSelectionMap] = useState<Record<string, boolean>>({});
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    if (
      selectedServiceId &&
      !services.some((service) => String(service.id) === selectedServiceId)
    ) {
      setSelectedServiceId(null);
      setDeliveryAddress('');
    }
  }, [selectedServiceId, services]);

  useEffect(() => {
    setSelectionMap((prev) => {
      const next: Record<string, boolean> = {};
      items.forEach((item) => {
        next[item.id] = prev[item.id] ?? true;
      });
      return next;
    });
  }, [items]);

  const selectedService = useMemo(
    () => services.find((service) => String(service.id) === selectedServiceId) ?? null,
    [selectedServiceId, services],
  );

  const selectedItems = useMemo(
    () => items.filter((item) => selectionMap[item.id] ?? true),
    [items, selectionMap],
  );

  const deliveryPrice = selectedService?.price ?? 0;
  const selectedItemsTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.subtotal, 0),
    [selectedItems],
  );
  const totalPrice = selectedItemsTotal + deliveryPrice;

  const handleItemSelectChange = (itemId: string, checked: boolean) => {
    setSelectionMap((prev) => ({
      ...prev,
      [itemId]: checked,
    }));
  };

  const handleServiceSelect = (serviceId: string, checked: boolean) => {
    setSelectedServiceId(checked ? serviceId : null);
    if (!checked) {
      setDeliveryAddress('');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setOrderError('Требуется авторизация');
      return;
    }
    setOrderError(null);
    setOrderLoading(true);
    try {
      const payload = {
        customerName: user.fullName || user.email,
        customerEmail: user.email,
        customerPhone: user.phone ?? undefined,
        deliveryAddress: selectedService ? deliveryAddress.trim() || undefined : undefined,
        clearBasketAfterOrder: true,
        items: selectedItems.map((item) =>
          item.source === 'custom'
            ? {
                customFrameId: item.customFrameId ?? item.frame.id,
                quantity: item.quantity,
              }
            : {
                catalogItemId: item.catalogItemId ?? item.frame.id,
                quantity: item.quantity,
              },
        ),
      };
      await createOrder(payload);
      success('Заказ создан');
      await clear();
    } catch (err) {
      console.error(err);
      setOrderError('Не удалось оформить заказ. Попробуйте позже.');
      toastError('Ошибка при создании заказа');
    } finally {
      setOrderLoading(false);
    }
  };

  const disableCheckout =
    selectedItems.length === 0 ||
    isProcessing ||
    orderLoading ||
    (selectedService != null && deliveryAddress.trim().length === 0);

  return (
    <div className="BasketPage">
      <Menu />
      <MainWrapper>
        <Header />

        <TopicSection className="basket-section">
          <TopicSectionTitle textPosition={TEXT_POSITION.LEFT}>Корзина</TopicSectionTitle>

          <div className="basket-wrapper">
            <div className="change-selection">
              {items.length > 0 && (
                <button
                  type="button"
                  className="change-selection_button anonymous-pro-bold home-text-block__sm"
                  onClick={clear}
                  disabled={isProcessing}
                >
                  Очистить корзину
                </button>
              )}
              <button
                type="button"
                className="change-selection_button anonymous-pro-bold home-text-block__sm"
                onClick={() => {
                  setSelectionMap(
                    items.reduce<Record<string, boolean>>((acc, item) => {
                      acc[item.id] = true;
                      return acc;
                    }, {}),
                  );
                }}
                disabled={isProcessing || items.length === 0}
              >
                Выбрать все
              </button>
            </div>

            {error && (
              <p className="anonymous-pro-bold home-text-block__vsm_grey">
                {error}. Попробуйте обновить страницу.
              </p>
            )}

            {orderError ? (
              <p className="anonymous-pro-bold home-text-block__vsm_red">{orderError}</p>
            ) : null}

            {servicesError && (
              <p className="anonymous-pro-bold home-text-block__vsm_grey">
                {servicesError}. Попробуйте обновить страницу.
              </p>
            )}

            {isLoading ? (
              <p className="anonymous-pro-bold home-text-block__md__left">Загрузка корзины…</p>
            ) : items.length === 0 ? (
              <BasketEmptyState />
            ) : (
              <>
                {items.map((item) => (
                  <BasketItemCard
                    key={item.id}
                    item={item}
                    onIncrement={incrementItem}
                    onDecrement={decrementItem}
                    onRemove={removeItem}
                    onSelectChange={handleItemSelectChange}
                    isSelected={selectionMap[item.id] ?? true}
                    disableActions={isProcessing}
                  />
                ))}

                {isServicesLoading ? (
                  <p className="anonymous-pro-bold home-text-block__md__left">
                    Загружаем услуги доставки…
                  </p>
                ) : (
                  services.map((service) => (
                    <DeliveryOption
                      key={service.id}
                      service={service}
                      isSelected={selectedServiceId === String(service.id)}
                      address={deliveryAddress}
                      onSelect={handleServiceSelect}
                      onAddressChange={setDeliveryAddress}
                    />
                  ))
                )}

                <BasketSummary
                  totalPrice={totalPrice}
                  onCheckout={handleCheckout}
                  isCheckoutDisabled={disableCheckout}
                  isProcessing={isProcessing || orderLoading}
                />
              </>
            )}
          </div>
        </TopicSection>
      </MainWrapper>
      <Footer />
    </div>
  );
};

export default BasketPage;

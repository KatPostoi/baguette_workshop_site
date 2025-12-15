import type { ChangeEvent } from 'react';
import type { ServiceItem } from '../../../api/types';
import { formatCurrency } from '../../../utils/currency';

type DeliveryOptionProps = {
  service: ServiceItem;
  isSelected: boolean;
  address: string;
  onSelect: (serviceId: string, checked: boolean) => void;
  onAddressChange: (value: string) => void;
};

export const DeliveryOption = ({
  service,
  isSelected,
  address,
  onSelect,
  onAddressChange,
}: DeliveryOptionProps) => {
  const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
    onSelect(String(service.id), event.target.checked);
  };

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    onAddressChange(event.target.value);
  };

  return (
    <div className="delivery-wrapper">
      <div className="delivery-wrapper_agree">
        <h2 className="anonymous-pro-bold home-text-block__md__left">{service.title}</h2>
        <input
          type="checkbox"
          className="square-agreement"
          checked={isSelected}
          onChange={handleToggle}
          aria-label={`Выбрать услугу ${service.title}`}
        />
      </div>

      <div className="delivery-wrapper_price">
        <div className="delivery-wrapper_price_data">
          <input
            type="text"
            className="anonymous-pro-bold home-text-block__md__left data-text-input"
            placeholder="Адрес доставки"
            value={address}
            onChange={handleAddressChange}
            disabled={!isSelected}
          />
        </div>

        <h2 className="anonymous-pro-bold home-text-block__md">
          {formatCurrency(service.price)}
        </h2>
      </div>
    </div>
  );
};

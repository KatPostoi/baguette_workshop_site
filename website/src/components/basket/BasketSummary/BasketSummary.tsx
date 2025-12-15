import { Button } from "../../ui-kit/Button";
import { formatCurrency } from "../../../utils/currency";

type BasketSummaryProps = {
  totalPrice: number;
  onCheckout: () => void;
  isCheckoutDisabled: boolean;
  isProcessing?: boolean;
};

export const BasketSummary = ({
  totalPrice,
  onCheckout,
  isCheckoutDisabled,
  isProcessing = false,
}: BasketSummaryProps) => (
  <div className="basket-summary">
    <div className="total-wrapper total-wrapper_final">
      <h2 className="anonymous-pro-bold home-text-block__md__left">Итого:</h2>
      <h2 className="anonymous-pro-bold home-text-block__md__left">{formatCurrency(totalPrice)}</h2>
    </div>

    <div className="basket-wrapper_button">
      <Button onClick={onCheckout} disabled={isCheckoutDisabled || isProcessing}>
        Оформить заказ
      </Button>
    </div>
  </div>
);

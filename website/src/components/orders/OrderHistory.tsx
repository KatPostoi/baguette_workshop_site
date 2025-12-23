import type { OrderStatusHistory } from '../../api/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import './OrderHistory.css';

const roleLabel: Record<string, string> = {
  ADMIN: 'Администратор',
  CUSTOMER: 'Покупатель',
};

export const OrderHistory = ({ history }: { history: OrderStatusHistory[] }) => {
  if (!history.length) return null;
  return (
    <div className="order-history">
      <h4>История статусов</h4>
      <ul>
        {history.map((entry) => (
          <li key={entry.id} className="order-history__item">
            <div className="order-history__row">
              <OrderStatusBadge status={entry.status} />
              <span className="order-history__date">{new Date(entry.createdAt).toLocaleString()}</span>
            </div>
            {entry.comment ? <div className="order-history__comment">{entry.comment}</div> : null}
            {entry.changedBy ? (
              <div className="order-history__actor">
                {entry.changedBy.fullName} ({roleLabel[entry.changedBy.role] ?? entry.changedBy.role})
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

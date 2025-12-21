import { NotificationResponse } from '../../notifications/dto/notification.response';
import { OrderStatusHistoryResponse } from './order.response';

export interface OrderTimelineResponse {
  orderId: string;
  notifications: NotificationResponse[];
  history: OrderStatusHistoryResponse[];
}

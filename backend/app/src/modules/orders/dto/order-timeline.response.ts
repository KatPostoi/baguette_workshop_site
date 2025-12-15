import { NotificationResponse } from '../../notifications/dto/notification.response';

export interface OrderTimelineResponse {
  orderId: string;
  notifications: NotificationResponse[];
}

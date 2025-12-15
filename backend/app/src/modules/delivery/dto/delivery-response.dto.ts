export interface DeliveryBookingResponse {
  orderId: string;
  status: 'scheduled';
  trackingCode: string;
  courierService: string;
  eta: string;
}

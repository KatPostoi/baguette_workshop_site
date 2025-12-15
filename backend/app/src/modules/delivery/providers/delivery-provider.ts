export interface DeliveryBooking {
  orderId: string;
  trackingCode: string;
  courierService: string;
  eta: string;
}

export interface DeliveryProvider {
  schedule(orderId: string, courierService?: string): Promise<DeliveryBooking>;
}

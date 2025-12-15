export interface PaymentReceipt {
  orderId: string;
  amount: number;
  transactionId: string;
  processedAt: Date;
  method: string;
}

export interface PaymentGateway {
  charge(orderId: string, amount: number): Promise<PaymentReceipt>;
}

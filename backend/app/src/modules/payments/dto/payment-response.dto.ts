export interface PaymentReceiptResponse {
  orderId: string;
  status: 'success';
  transactionId: string;
  processedAt: string;
  amount: number;
  method: string;
}

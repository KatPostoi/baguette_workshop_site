import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MockPaymentDto } from './dto/mock-payment.dto';
import { PaymentReceiptResponse } from './dto/payment-response.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mock')
  mockPayment(@Body() dto: MockPaymentDto): Promise<PaymentReceiptResponse> {
    return this.paymentsService.processMockPayment(dto);
  }
}

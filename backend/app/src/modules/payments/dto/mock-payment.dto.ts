import { IsPositive, IsUUID } from 'class-validator';

export class MockPaymentDto {
  @IsUUID()
  orderId!: string;

  @IsPositive()
  amount!: number;
}

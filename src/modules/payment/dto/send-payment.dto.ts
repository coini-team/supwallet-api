import { IsString } from 'class-validator';

export class SendPaymentDto {
  @IsString()
  sender: string;

  @IsString()
  amount: string;

  @IsString()
  token: string;
}

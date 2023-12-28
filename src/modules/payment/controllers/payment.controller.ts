import { Body, Controller, Post, Query } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { SendPaymentDto } from '../dto/send-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('send')
  async sendTokens(
    @Body() sendPayment: SendPaymentDto,
    @Query('chain') chain: string,
  ) {
    return await this.paymentService.sendERC20tokens(
      chain,
      sendPayment
    );
  }
}

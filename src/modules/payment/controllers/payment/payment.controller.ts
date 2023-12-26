import { Body, Controller, Post, Query} from '@nestjs/common';
import { PaymentService } from '../../services/payment/payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('send')
    async sendTokens(
        @Body('sender') sender: string,
        @Body('amount') amount: string,
        @Body('token') token: string,
        @Query('chain') chain: string,
    ) {
        return await this.paymentService.sendERC20tokens(chain, token, amount, sender);
    }
}

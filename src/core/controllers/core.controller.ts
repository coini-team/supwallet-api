import { Body, Controller, Post, Get } from '@nestjs/common';
import { CoreService } from '../services/core.service';
import { UserDto } from '../dto/user.dto';
import { SendPaymentDto } from '../dto/send-payment.dto';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Post('qr')
  async receivePayment(@Body() payload: Partial<UserDto>) {
    const { phone } = payload;
    console.log('=> receivePayment');
    return await this.coreService.getWallet(phone);
  }

  @Post('network')
  async getNetwork(@Body() payload: Partial<UserDto>) {
    const { phone } = payload;
    console.log('=> getNetwork:', payload);
    return await this.coreService.getNetwork(phone);
  }

  @Post('tokens')
  async getTokens(@Body() payload: Partial<UserDto>) {
    const { phone, network } = payload;
    console.log('=> getTokens:', payload);
    return await this.coreService.getTokens(phone, network);
  }

  @Post('balance')
  async balanceByToken(@Body() payload: UserDto) {
    console.log('=> getBalance');
    return await this.coreService.balanceByToken(payload);
  }

  @Post('make-payment')
  async makePayment(@Body() payload: SendPaymentDto) {
    return await this.coreService.makePayment(payload);
  }
}

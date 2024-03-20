import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
import { CoreService } from '../services/core.service';
import { UserDto } from '../dto/user.dto';
import { TokensDto } from '../dto/token.dto';

@Controller('core')
export class CoreController {
    constructor(private readonly coreService: CoreService) { }

    @Post('qr')
    async receivePayment(@Body() payload: UserDto) {
        const { phone } = payload;
        console.log('=> receivePayment');
        return await this.coreService.getWallet(phone);
    }

    @Post('balance')
    async balance(@Body() payload: UserDto) {
        const { phone } = payload;
        return await this.coreService.balance(phone);
    }

    @Post('balance/tokens')
    async balanceByToken(@Body() payload: TokensDto) {
        return await this.coreService.balanceByToken(payload);
    }
}

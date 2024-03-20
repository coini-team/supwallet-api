import {
    Body,
    Controller,
    Post,
    Get,
  } from '@nestjs/common';
import { CoreService } from '../services/core.service';
import { UserDto } from '../dto/user.dto';

@Controller('core')
export class CoreController {
    constructor(private readonly coreService: CoreService) { }

    @Post('qr')
    async receivePayment(@Body() payload: Partial<UserDto>) {
        const { phone } = payload;
        console.log('=> receivePayment');
        return await this.coreService.getWallet(phone);
    }

    @Get('network')
    async getNetwork(@Body() payload: Partial<UserDto>) {
        const { phone } = payload;
        return await this.coreService.getNetwork(phone);
    }

    @Get('tokens')
    async getTokens(@Body() payload: Partial<UserDto>) {
        const { phone, network } = payload;
        return await this.coreService.getTokens(phone, network);
    }

    @Get('balance')
    async balanceByToken(@Body() payload: UserDto) {
        return await this.coreService.balanceByToken(payload);
    }
}

import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
import { CoreService } from '../services/core.service';
import { UserDto } from '../dto/user.dto';

@Controller('core')
export class CoreController {
    constructor(private readonly coreService: CoreService) { }

    @Post('qr')
    async receivePayment(@Body() payload: UserDto) {
        const { phone } = payload;
        console.log('=> receivePayment');
        return await this.coreService.getWallet(phone);
    }
}

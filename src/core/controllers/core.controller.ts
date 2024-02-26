import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
import { CoreService } from '../services/core.service';

@Controller('core')
export class CoreController {
    constructor(private readonly coreService: CoreService) { }

    @Post('qr')
    async receivePayment() {
        console.log('=> receivePayment');
        // await this.coreService.generateQR();
        return {
            success: true,
            wallet: '0x8f8e8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f',
            imageQR: 'http://localhost:4002/qr.png',
        };
    }
}

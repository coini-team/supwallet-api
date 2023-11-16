import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { DappService } from './dapp.service';

@Controller('dapp')
export class DappController {
  constructor(private readonly dappService: DappService) {}
  @Get()
  getDapp() {
    return 'First dApp';
  }

  @Get(':id')
  getParam(@Param('id') id: string): string {
    return `Get params ${id}`;
  }

  @Post()
  createWallet(@Body('token') token: string) {
    if (token) {
      console.log('Auth Token validation here');
    }
    const wallet = this.dappService.createRandomWallet();
    const res = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      seedphrase: wallet.mnemonic.phrase,
    };
    return res;
  }
}

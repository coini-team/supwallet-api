import { Body, Controller, Post, HttpException } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Post()
  createWallet(@Body('token') token: string) {
    if (token) {
      console.log('Auth Token validation here');
    }
    const wallet = this.walletService.createRandomWallet();
    const res = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      seedphrase: wallet.mnemonic.phrase,
    };
    return res;
  }

  public getWallet(): any {
    return this.walletService.getWallet();
  }

  @Post('send')
  async sendTokens(
    @Body('to') to: string, 
    @Body('amount') amount: string, 
    @Body('token') token: string
  ) {
      return await this.walletService.sendERC20tokens(to, token, amount);
  }
}

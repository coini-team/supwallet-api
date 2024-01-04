import { Body, Controller, Post, Query } from '@nestjs/common';
import { WalletService } from 'src/modules/wallet/services/wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  createWallet() {
    try {
      const wallet = this.walletService.createRandomWallet();
      const res = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        seedphrase: wallet.mnemonic.phrase,
      };
      return res;
    } catch (error) {
      throw error;
    }
  }

  @Post('smart-account')
  async createSmartAccount() {
    try {
      const smartAccount = await this.walletService.createSmartAccount();
      return {
        success: true,
        smartAccountAddress: smartAccount,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('send-op')
  async sendUserOperation() {
    try {
      const { uoHash, txHash } = await this.walletService.sendUserOperation();
      return {
        success: true,
        uoHash,
        txHash,
      };
    } catch (error) {
      throw error;
    }
  
  }

}

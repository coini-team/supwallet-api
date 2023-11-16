import { Injectable } from '@nestjs/common';
import { HDNodeWallet, Wallet } from 'ethers';

@Injectable()
export class DappService {
  createRandomWallet(): HDNodeWallet {
    const randomWallet = Wallet.createRandom();
    console.log(`New Wallet Address: ${randomWallet.address}`);
    console.log(`Private Key: ${randomWallet.privateKey}`);

    return randomWallet;
  }
}

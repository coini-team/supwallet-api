// Third Party Dependencies.
import { Injectable } from '@nestjs/common';
import { ethers, HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers';

// Local Dependencies.
import { ConfigService } from '../../../config/config.service';
import { Blockchain } from '../../../config/config.keys';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class WalletService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  public getWallet(): Wallet {
    const provider: JsonRpcProvider = new ethers.JsonRpcProvider(
      this.configService.get(Blockchain.MUMBAI_TESTNET_URL),
    );
    const wallet: Wallet = new Wallet(
      this.configService.get(Blockchain.WALLET_PRIVATE_KEY),
      provider,
    );
    return wallet;
  }

  /**
   * @memberof WalletService
   * @description This method is used to get all wallets from database.
   * @returns {Promise<Wallet[]>}
   */
  public getAllWallets(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  public createRandomWallet(): HDNodeWallet {
    const randomWallet = Wallet.createRandom();
    console.log(`New Wallet Address: ${randomWallet.address}`);
    console.log(`Private Key: ${randomWallet.privateKey}`);

    return randomWallet;
  }
}

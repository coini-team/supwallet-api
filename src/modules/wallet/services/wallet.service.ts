// Third Party Dependencies.
import { Injectable } from '@nestjs/common';
import { ethers, HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers';

// Alchemy dependencies
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Address, LocalAccountSigner, type Hex } from "@alchemy/aa-core";
import { arbitrumSepolia } from "viem/chains";

// Local Dependencies.
import { ConfigService } from '../../../config/config.service';
import { Blockchain, Alchemy } from '../../../config/config.keys';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Network } from 'src/modules/chain/entities/network.entity';

@Injectable()
export class WalletService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
  ) { }

  public getWallet(rpcUrl: string): Wallet {
    const provider: JsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet: Wallet = new Wallet(
      this.configService.get(Blockchain.WALLET_PRIVATE_KEY),
      provider,
    );
    return wallet;
  }

  // traer network url
  public async getRpcUrl(chain: string): Promise<string> {
    const network = await this.networkRepository.findOne({ name: chain });
    return network.rpc_url;
  }

  /**
   * @memberof WalletService
   * @description This method is used to get all wallets from database.
   * @returns {Promise<Wallet[]>}
   */
  public getAllWallets(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  /**
   * create random wallet
   * @returns wallet info
   */
  public createRandomWallet(): HDNodeWallet {
    const randomWallet = Wallet.createRandom();
    console.log(`New Wallet Address: ${randomWallet.address}`);
    console.log(`Private Key: ${randomWallet.privateKey}`);

    return randomWallet;
  }

  /**
   * create and return Alchemy provider
   * @returns provider
   */
  public getAlchemyProvider() {
    const chain = arbitrumSepolia;
    const apiKey = this.configService.get(Alchemy.ALCHEMY_API_KEY);
    const privateKey = `0x${this.configService.get(Blockchain.WALLET_PRIVATE_KEY)}` as Hex;
    const owner = LocalAccountSigner.privateKeyToAccountSigner(privateKey);
    const provider = new AlchemyProvider({
      apiKey,
      chain,
    }).connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          rpcClient,
          owner,
          chain,
          factoryAddress: getDefaultLightAccountFactoryAddress(chain),
        })
    );
    return provider;
  }

  /**
   * create smart account based on EOA
   * @returns smart account address
   */
  public async createSmartAccount() {
    const provider = this.getAlchemyProvider();
    const smartAccountAddress = await provider.getAddress();
    console.log("Smart account address: ", smartAccountAddress);
    return smartAccountAddress;
  }

  /**
   * send user operation to arbitrum blockchain
   * @returns {
   *  user operation hash
   *  transaction hash
   * }
   */
  public async sendUserOperation() {
    const provider = this.getAlchemyProvider();
    const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address;
    const usdcAddress = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' as Address; // USDC address
    const { hash: uoHash } = await provider.sendUserOperation({
      target: usdcAddress,
      data: '0xa9059cbb000000000000000000000000407a51f7566bf81d6553ca9de5f920aa64ae194200000000000000000000000000000000000000000000000000000000000f4240',
      value: 0n,
    });
    console.log("UserOperation hash: ", uoHash);
    const txHash = await provider.waitForUserOperationTransaction(uoHash);
    console.log("Transaction hash: ", txHash);
    return {
      uoHash,
      txHash,
    };
  }

}

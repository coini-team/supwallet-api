// Third Party Dependencies.
import { Injectable } from '@nestjs/common';
import { ethers, HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers';

// Alchemy dependencies
import {
  Address,
  LocalAccountSigner,
  type Hex,
  createSmartAccountClient,
  SmartAccountClient,
  UserOperationCallData,
  UserOperationRequest,
} from '@alchemy/aa-core';
import { arbitrumSepolia } from '@alchemy/aa-core';
import erc20TokenABI from 'src/contracts/abis/ERC20_ABI.json';

import {
  getDefaultLightAccountFactoryAddress,
  createLightAccount,
  lightAccountClientActions,
} from '@alchemy/aa-accounts';

// Local Dependencies.
import { ConfigService } from '../../../config/config.service';
import { Blockchain, Alchemy } from '../../../config/config.keys';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Network } from 'src/modules/chain/entities/network.entity';
import { encodeFunctionData, http, RpcTransactionRequest } from 'viem';
import { encodeABI } from '../../../shared/utils/encode.util';

@Injectable()
export class WalletService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
  ) {}

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
  public async getAlchemyProvider() {
    const chain = arbitrumSepolia;

    const privateKey = `0x${this.configService.get(
      Blockchain.WALLET_PRIVATE_KEY,
    )}` as Hex;

    const signer = LocalAccountSigner.privateKeyToAccountSigner(privateKey);

    const rpcTransport = http(
      'https://arb-sepolia.g.alchemy.com/v2/T_04foLWeOb92-OTugF6MroIVv2EM2cn',
    );

    return createSmartAccountClient({
      transport: rpcTransport,
      chain,
      account: await createLightAccount({
        transport: rpcTransport,
        chain,
        signer,
        // salt: 0n,
      }),
    }).extend(lightAccountClientActions);
  }

  /**
   * create smart account based on EOA
   * @returns smart account address
   */
  public async createSmartAccount() {
    const provider = await this.getAlchemyProvider();
    const smartAccountAddress = provider.account.address;
    console.log('=> Smart account address: ', smartAccountAddress);
    // console.log('=> smartAccountAddress:', smartAccountAddress);
    // console.log('=> provider:', provider);
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
    // const smartAccountClient = createSmartAccountClient({
    //   transport: rpcTransport,
    //   chain,
    //   account: await createLightAccount({
    //     transport: rpcTransport,
    //     chain,
    //     signer,
    //     salt: 1n,
    //   }),
    // }).extend(lightAccountClientActions);
    //
    // const uo: UserOperationCallData = {
    //   data: '0xa9059cbb000000000000000000000000407a51f7566bf81d6553ca9de5f920aa64ae194200000000000000000000000000000000000000000000000000000000000f4240' as Hex,
    //   target: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' as Address,
    //   value: 0n,
    // };
    //
    const usdcAddress = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' as Address; // USDC address
    //
    // const transaction = await smartAccountClient.sendUserOperation({
    //   uo: {
    //     data: '0xa9059cbb000000000000000000000000407a51f7566bf81d6553ca9de5f920aa64ae194200000000000000000000000000000000000000000000000000000000000f4240' as Hex,
    //     target: usdcAddress,
    //     value: 0n,
    //   },
    //   account: undefined,
    // });
    //

    const smartAccountClient = await this.getAlchemyProvider();

    // console.log('=> smartAccountClient:', smartAccountClient);
    // console.log('=> smartAccountClient Type:', typeof smartAccountClient);

    const userOperation = await smartAccountClient.sendUserOperation({
      uo: {
        target: usdcAddress,
        data: '0xa9059cbb000000000000407a51f7566bf81d6553ca9de5f920aa64ae194200000000000000000000000000000000000000000000000000000000000f4240' as Hex,
      },
      account: smartAccountClient.account,
    });

    console.log('=> userOperation:', userOperation);

    // const result = await smartAccountClient.sendUserOperation({
    //   uo: { target: "0xaddress", data: "0x", value: 0n },
    //   // if you didn't pass in an account above then:
    //   account: await createLightAccount(lightAccountParams),
    // });

    // const tx: RpcTransactionRequest = {
    //   from: '0xB2A48F75EA97235C74709CF25f57E9f13DA25bBA' as Hex,
    //   to: '0x407a51f7566bf81D6553CA9DE5F920aa64aE1942' as Hex,
    //   data: '0xa9059cbb000000000000000000000000407a51f7566bf81d6553ca9de5f920aa64ae194200000000000000000000000000000000000000000000000000000000000f4240' as Hex,
    // };

    // // @ts-ignore
    // const txHash = await smartAccountClient.sendUserOperation(
    //
    // )

    // console.log('Transaction Data: ', transaction);
    // // const txHash = await provider.waitForUserOperationTransaction(uoHash);
    // // console.log('Transaction hash: ', txHash);
    // return {
    //   transaction,
    // };
  }
}

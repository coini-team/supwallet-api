// Third Party Dependencies.
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';

// Local Dependencies.
import { WalletService } from '../../wallet/services/wallet.service';
import { TokenService } from '../../token/services/token.service';
import { ConfigService } from '../../../config/config.service';
import { Network } from '../../chain/entities/network.entity';
import { ChainService } from '../../chain/services/chain.service';
import erc20TokenABI from 'src/contracts/abis/ERC20_ABI.json';
import { CryptoNetwork } from '../../chain/entities/crypto-network.entity';


@Injectable()
export class NotificationsService {
  constructor(
    private readonly walletService: WalletService,
    private readonly chainService: ChainService,
  ) {}

  /**
   * @memberof NotificationsService
   * @description Listen for contract events.
   * @returns {Promise<void>}
   */
  async listenForEvent() {
    // console.log(':::Listening for contract events:::');
    // const contractERC721 = await this.nftService.getERC721Contract(
    //   this.walletService.getWallet(),
    // );
    // contractERC721.on('NewContract', (contractAddress) => {
    //   console.log('Event received:', contractAddress);
    // });
    // const contractERC20 = this.tokenService.getFactoryERC20Contract(
    //   this.walletService.getWallet(),
    // );
    // contractERC20.on('NewERC20TokenContract', (erc20TokenAddress, index) => {
    //   console.log('Event received:', erc20TokenAddress);
    //   console.log('Array index:', index);
    // });
  }

  /**
   * @memberof NotificationsService
   * @description Listen for contract events.
   * @returns {Promise<void>}
   */
  async processTransferEvents() {
    // Get All Networks from Database.
    const networks: Network[] = await this.chainService.getAllNetworks();
    // Map Networks and Create Providers.
    const providers = await Promise.all(
      networks.map(async (network) => {
        return {
          id: network.id,
          name: network.name,
          provider: new ethers.WebSocketProvider(network.rpc_ws, network.name),
        };
      }),
    );
    // Get All Crypto Networks from Database.
    const cryptoNetworks: CryptoNetwork[] =
      await this.chainService.getCryptoNetworks();
    // Get All Wallets from Database.
    const wallets = await this.walletService.getAllWallets();
    // Escuchar transacciones relacionadas con cada billetera en cada red.
    providers.forEach(({ provider }) => {
      wallets.forEach((wallet) => {
        cryptoNetworks.forEach((cryptoNetwork) => {
          const contract = new ethers.Contract(
            cryptoNetwork.contract,
            erc20TokenABI,
            provider,
          );
          // Filter to only get Transfer events from the wallet.
          const filter = contract.filters.Transfer(null, wallet.address);
          // Listen for events on the contract.
          contract.on(filter, async (event) => {
            console.log('event: ', event);
          });
        });
      });
    });
  }
}

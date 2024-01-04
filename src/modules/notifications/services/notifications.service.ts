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
  ) { }

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
    // Get all networks
    const networks: Network[] = await this.chainService.getAllNetworks();

    // Map networks and create providers
    const providers = await Promise.all(
      networks.map(async (network) => {
        return {
          id: network.id,
          name: network.rpc_chain_name,
          provider: new ethers.WebSocketProvider(
            network.rpc_ws,
            network.rpc_chain_name,
          ),
        };
      }),
    );

    // Get all crypto networks
    const cryptoNetworks: CryptoNetwork[] = await this.chainService.getCryptoNetworks();

    // Get all wallets
    const wallets = await this.walletService.getAllWallets();

    // Map Crypto Networks and Create Contracts
    cryptoNetworks.forEach((cryptoNetwork) => {
      // For each wallet, listen for Transfer events
      wallets.forEach((wallet) => {
        
        // Create ERC20 contract
        const contract = new ethers.Contract(
          cryptoNetwork.contract,
          erc20TokenABI,
          providers.find(
            (provider) => provider.id === cryptoNetwork.network.id,
          ),
        );

        // Filter to only income transfer events into the wallet
        const filter = contract.filters.Transfer(null, wallet.address);
        contract.on(filter, async (event) => {
          console.log('=> processTransferEvents: ', event);
          console.log('=> network:', `${cryptoNetwork.network.id} - ${cryptoNetwork.network.name}`);
          console.log('=> contract:', cryptoNetwork.contract);
          // TODO: actualizar status en el API de coini
          // TODO: move token to recognized or no recognized wallet
        });
      });
    });
  }
}

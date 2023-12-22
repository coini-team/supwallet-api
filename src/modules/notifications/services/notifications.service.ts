// Third Party Dependencies.
import { Injectable } from '@nestjs/common';

// Local Dependencies.
import { WalletService } from '../../wallet/services/wallet.service';
import { TokenService } from '../../token/services/token.service';
import { NftService } from '../../nft/services/nft.service';
import { ethers } from 'ethers';
import erc20TokenABI from 'src/contracts/abis/ERC20_ABI.json';
import { ConfigService } from '../../../config/config.service';
import { Blockchain } from '../../../config/config.keys';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly nftService: NftService,
    private readonly tokenService: TokenService,
    private readonly walletService: WalletService,
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
  smartContractEvent(): void {
    // Contract Creation Event.
    const wsAlchemyURL = this.configService.get(Blockchain.MUMBAI_TESTNET_WS);
    console.log('wsAlchemyURL: ', wsAlchemyURL);
    const contractAddress = this.configService.get(
      Blockchain.ERC20_FACTORY_ADDRESS,
    );
    // Create a Websocket Provider.
    const webSocketProvider = new ethers.WebSocketProvider(
      wsAlchemyURL,
      'maticmum',
    );
    // ERC20 Token Address.
    const erc20TokenAddress = this.configService.get(Blockchain.ERC20_TOKEN_ADDRESS);
    // Create a Contract Instance.
    const contract = new ethers.Contract(
      erc20TokenAddress,
      erc20TokenABI,
      webSocketProvider,
    );
    // Listen for Transfer Event.
    const filter = contract.filters.Transfer(null, contractAddress);
    // Listen for events.
    contract.on(filter, (event) => {
      console.log('=> event: ', event);
    });
  }
}

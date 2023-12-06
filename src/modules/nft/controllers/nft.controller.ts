// Third Party Dependencies.
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

// Local Dependencies.
import { NftService } from '../services/nft.service';
import { WalletService } from '../../wallet/services/wallet.service';

@Controller('nft')
export class NftController {
  constructor(
    private readonly nftService: NftService,
    private readonly walletService: WalletService,
  ) {}

  /**
   * @memberof NftController
   * @description Deploy an ERC721 Token.
   * @param {Object} tokenParams - Token Parameters.
   * @returns {string} - Contract Address.
   */
  @Post('deploy')
  @HttpCode(HttpStatus.CREATED)
  public async deployERC721Token(
    @Body()
    tokenParams: {
      type: string;
      name: string;
      symbol: string;
      supply: number;
    },
  ): Promise<string> {
    // Get Wallet to Sign.
    const wallet = this.walletService.getWallet();

    //call method to deploy the ERC20 token
    const contractAddress = await this.nftService.deployERC721Token(
      wallet,
      tokenParams,
    );

    return contractAddress;
  }
}

// Third Party Dependencies.
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

// Local Dependencies.
import { WalletService } from '../../wallet/services/wallet.service';
import { TokenService } from '../services/token.service';

@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly walletService: WalletService,
  ) {}

  /**
   * @memberof TokenController
   * @description Deploy an ERC20 Token.
   * @param {Object} tokenParams - Token Parameters.
   * @returns {string} - Contract Address.
   */
  @Post('deploy')
  @HttpCode(HttpStatus.CREATED)
  async deployERC20Token(
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
    const contractAddress = await this.tokenService.deployERC20Token(
      wallet,
      tokenParams,
    );

    return contractAddress;
  }

  @Post('transfer')
  public async transferERC20Token(
    @Body('addressERC20') addressERC20: string,
    @Body('to') to: string,
    @Body('value') value: number,
  ) {
    const wallet = this.walletService.getWallet();
    console.log('addressERC20 Init: ' + addressERC20);
    console.log('to Init: ' + to);
    console.log('value Init: ' + value);
    await this.tokenService.transferERC20Token(wallet, addressERC20, to, value);
    return {};
  }

  @Post('balanceOf')
  async balanceOfERC20Token(
    @Body('addressERC20') addressERC20: string,
    @Body('account') account: string,
  ) {
    const wallet = this.walletService.getWallet();
    console.log('addressERC20 Init: ' + addressERC20);
    console.log('account Init: ' + account);
    let balance = await this.tokenService.balanceOfERC20Token(
      wallet,
      addressERC20,
      account,
    );
    console.log('balanceController: ' + balance);
    console.log(typeof balance);
    balance = balance.toString();
    return { balance };
  }
}

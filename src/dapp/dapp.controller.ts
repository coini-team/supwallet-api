import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { DappService } from './dapp.service';

@Controller('dapp')
export class DappController {
  constructor(private readonly dappService: DappService) {}
  @Get()
  getDapp() {
    return 'First dApp';
  }

  @Get(':id')
  getParam(@Param('id') id: string): string {
    return `Get params ${id}`;
  }

  @Post('api/wallet')
  createWallet(@Body('token') token: string) {
    if (token) {
      console.log('Auth Token validation here');
    }
    const wallet = this.dappService.createRandomWallet();
    const res = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      seedphrase: wallet.mnemonic.phrase,
    };
    return res;
  }

  @Post('api/token')
  @HttpCode(HttpStatus.CREATED)
  async deployToken(
    @Body()
    tokenParams: {
      type: string;
      name: string;
      symbol: string;
      supply: number;
    },
  ) {
    //authentication logic

    //get wallet to sign
    const wallet = this.getWallet();
    let contractAddress: Promise<string>;
    if (tokenParams.type == 'ERC20') {
      contractAddress = this.deployERC20Token(tokenParams, wallet);
    } else if (tokenParams.type == 'ERC721') {
      contractAddress = this.deployERC721Token(tokenParams, wallet);
    }

    return { contractAddress };
  }

  async deployERC20Token(tokenParams: any, wallet: any) {
    //call method to deploy the ERC20 token
    const contractAddress = await this.dappService.deployERC20Token(
      wallet,
      tokenParams,
    );

    return contractAddress;
  }

  async deployERC721Token(tokenParams: any, wallet: any) {
    //call method to deploy the ERC20 token
    const contractAddress = await this.dappService.deployERC721Token(
      wallet,
      tokenParams,
    );

    return contractAddress;
  }

  private getWallet(): any {
    // implement logic to retrieve wallet of the user
    // now it creates with random method
    return this.dappService.createRandomWallet();
  }
}

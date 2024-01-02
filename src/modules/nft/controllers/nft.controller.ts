// Third Party Dependencies.
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

// Local Dependencies.
import { NftService } from '../services/nft.service';
import { WalletService } from '../../wallet/services/wallet.service';
import { CreateNftDto } from '../dto/create-nft.dto';

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
  @Post()
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  public async deployERC721Token(
    @Body() CreateNft: CreateNftDto,
    @Query('chain') chain: string,
  ): Promise<any> {
    try {
      // Get Wallet to Sign.
      const wallet = this.walletService.getWallet();

      //call method to deploy the ERC721 token
      const result = await this.nftService.deployERC721Token(
        wallet,
        CreateNft,
        chain,
      );
      return { success: true, data: result };
    } catch (error) {
      throw error;
    }
  }

  @Get('owner/:tokenId')
  async getOwnerOfERC721Token(@Param('tokenId') tokenId: string) {
    const owner = await this.nftService.ownerOfERC721(tokenId);
    return { owner };
  }

  @Get('token_URI/:tokenId')
  async getUriOfToken(@Param('tokenId') tokenId: string) {
    const tokenURI = await this.nftService.getTokenURI(tokenId);
    return { tokenURI };
  }

  @Post(':tokenId/set-uri')
  async setTokenURI(
    @Param('tokenId') tokenId: number,
    @Body('tokenURI') tokenURI: string,
  ): Promise<void> {
    await this.nftService.setTokenURI(tokenId, tokenURI);
  }

  @Get(':tokenId/owner')
  async getOwnerOfToken(@Param('tokenId') tokenId: number): Promise<string> {
    return this.nftService.getOwnerOfToken(tokenId);
  }
}

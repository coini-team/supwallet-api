import { Injectable } from '@nestjs/common';
import { HDNodeWallet, Wallet, ethers } from 'ethers';

@Injectable()
export class DappService {
  private readonly ERC20FactoryAddress = '0x123456';
  private readonly ERC721FactoryAddress = '0x123456';
  createRandomWallet(): HDNodeWallet {
    const randomWallet = Wallet.createRandom();
    console.log(`New Wallet Address: ${randomWallet.address}`);
    console.log(`Private Key: ${randomWallet.privateKey}`);

    return randomWallet;
  }

  async deployERC20Token(
    wallet: Wallet,
    tokenParams: { name: string; symbol: string; supply: number },
  ): Promise<string> {
    const { name, symbol, supply } = tokenParams;

    const methodName = 'CreateNewERC20(string,string,uint256)';

    const contract = new ethers.Contract(
      this.ERC20FactoryAddress,
      methodName,
      wallet,
    );

    try {
      const result = await contract[methodName](name, symbol, supply);
      console.log(`Smart Contract Method "${methodName}" Result:`, result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deployERC721Token(
    wallet: Wallet,
    tokenParams: { name: string; symbol: string },
  ): Promise<string> {
    const { name, symbol } = tokenParams;

    const methodName = 'CreateNewContract(string,string)';

    const contract = new ethers.Contract(
      this.ERC721FactoryAddress,
      methodName,
      wallet,
    );

    try {
      const result = await contract[methodName](name, symbol);
      console.log(`Smart Contract Method "${methodName}" Result:`, result);

      return result;
    } catch (error) {
      throw error;
    }
  }
}

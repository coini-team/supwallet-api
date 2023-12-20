// Third Party Dependencies.
import { Injectable } from '@nestjs/common';
import { ethers, HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers';

// Local Dependencies.
import { ConfigService } from '../../../config/config.service';
import { Blockchain } from '../../../config/config.keys';

@Injectable()
export class WalletService {
  constructor(private readonly configService: ConfigService) {}

  public getWallet(): Wallet {
    const provider: JsonRpcProvider = new ethers.JsonRpcProvider(
      this.configService.get(Blockchain.MUMBAI_TESTNET_URL),
    );
    const wallet: Wallet = new Wallet(
      this.configService.get(Blockchain.WALLET_PRIVATE_KEY),
      provider,
    );
    return wallet;
  }

  public createRandomWallet(): HDNodeWallet {
    const randomWallet = Wallet.createRandom();
    console.log(`New Wallet Address: ${randomWallet.address}`);
    console.log(`Private Key: ${randomWallet.privateKey}`);

    return randomWallet;
  }

  async sendERC20tokens(to: string,token: string, amount: string) {
    try {
      // provider
      const wallet = this.getWallet();
      // Create a contract instance for the ERC-20 token
      const erc20Contract = new ethers.Contract(token, ["function transfer(address to, uint256 amount)"], wallet);
      
      const decimalAmount = ethers.parseUnits(amount, 18);

      
      const transaction = await erc20Contract.transfer(to, amount);
      console.log("Transaction hash:", transaction.hash);
      await transaction.wait();
      console.log("Transaction confirmed");
    } catch (error) {
      console.error("Error sending tokens:", error.message);
    }
  }
}

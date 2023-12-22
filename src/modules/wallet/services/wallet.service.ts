// Third Party Dependencies.
import { Injectable, NotFoundException } from '@nestjs/common';
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
//public getWallet(provider: JsonRpcProvider): Wallet {
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

  async sendERC20tokens(chain: string, to: string,token: string, amount: string) {
  //async sendERC20tokens(to: string,token: string, amount: string) {
    try{
if (!chain){
        throw new NotFoundException('Falta el parametro chain, que es un string.');
      }

      if (!to){
        throw new NotFoundException('Falta el parametro to, que es un string.');
      }
      if (!token){
        throw new NotFoundException('Falta el parametro token, que es un string.');
      }
      if (!amount){
        throw new NotFoundException('Falta el parametro amount, que es un string.');
      }

      const numericAmount = parseFloat(amount);

      if (isNaN(numericAmount) || numericAmount < 0.0000001 || amount.length > 8) {
        throw new NotFoundException('El valor de de envio no es válido.');
      }

      // Add network-specific configurations based on the 'chain' parameter
      let network;
      switch (chain) {
        case 'polygon':
          network = 'https://polygon-rpc.com/';
          break;
        case 'mainnet':
          network = 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
          break;
        case 'polygon-test':
          network = 'https://rpc.ankr.com/polygon_mumbai';
          break;
         // Add cases for other networks as needed

        default:
          throw new NotFoundException('Invalid chain parameter.');
      }

      // use default wallet wit provider already set 
      //const wallet = this.getWallet();

      const provider = new ethers.JsonRpcProvider(network);
      const wallet = new ethers.Wallet(
        this.configService.get(Blockchain.WALLET_PRIVATE_KEY),
        provider
        );

      // Create a contract instance for the ERC-20 token

      const erc20Contract = new ethers.Contract(
        token, 
        ["function transfer(address to, uint256 amount)"], 
        wallet
      );
    
      const decimalAmount = ethers.parseUnits(amount, 6);

      const transaction = await erc20Contract.transfer(to, decimalAmount);
      console.log("Transaction hash:", transaction.hash);
      await transaction.wait();
      console.log("Transaction confirmed");
      console.log(chain);

      return 'monto: '+decimalAmount+'. Transaccíon realizada con exito'
    } catch (error) {
      // Personaliza el manejo de errores según tus necesidades
      console.error('Error sending tokens:', error.message);
      console.error(Number(amount))
      throw new NotFoundException('Error al enviar tokens: ' + error.message);
    }
  }
}

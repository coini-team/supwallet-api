import { Injectable } from '@nestjs/common';
import { ContractFactory, HDNodeWallet, Wallet } from 'ethers';

@Injectable()
export class DappService {
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

    //Bytecode del contrato generador
    const erc20Bytecode = '0x606060...'; //reemplazar

    const factory = new ContractFactory(
      ['constructor(string,string,uint256)'],
      erc20Bytecode,
      wallet,
    );
    const contract = await factory.deploy(name, symbol, supply);

    //wait contract deploy
    await contract.waitForDeployment();

    //contract address
    const contractAddress = contract.getAddress();

    console.log(`Deployed ERC-20 Contract Address: ${contractAddress}`);
    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);
    console.log(`Total Supply: ${supply}`);

    return contractAddress;
  }

  async deployERC721Token(
    wallet: Wallet,
    tokenParams: { name: string; symbol: string },
  ): Promise<string> {
    const { name, symbol } = tokenParams;

    const erc721Bytecode = '0x606060...';

    const factory = new ContractFactory(
      ['constructor(string,string)'],
      erc721Bytecode,
      wallet,
    );
    const contract = await factory.deploy(name, symbol);

    //wait contract deploy
    await contract.waitForDeployment();

    //contract address
    const contractAddress = contract.getAddress();

    console.log(`Deployed ERC-721 Contract Address: ${contractAddress}`);
    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);

    // Return the contract address
    return contractAddress;
  }
}

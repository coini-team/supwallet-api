import { Injectable } from '@nestjs/common';
import { HDNodeWallet, Wallet, ethers } from 'ethers';

@Injectable()
export class DappService {
  private readonly ERC20FactoryAddress =
    '0x07f6F71394109e191728d9d23b8e230F2FcA743E';
  private readonly ERC721FactoryAddress =
    '0x7665ca8bDf738423BE54736c4796E1505D74d09d';
  private readonly walletPrivateKey: string;

  getWallet(): Wallet {
    const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_TESNET_URL);
    const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    return wallet;
  }

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
    const abi = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_symbol",
            "type": "string"
          },
          {
            "name": "_supply",
            "type": "uint256"
          }
        ],
        "name": "CreateNewERC20",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    typeof methodName;
    console.log('wallet', wallet);
    const contract = new ethers.Contract(this.ERC20FactoryAddress, abi, wallet);

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

    const abi = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_symbol",
            "type": "string"
          },
        ],
        "name": "createNewContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    const methodName = 'createNewContract(string,string)';

    const contract = new ethers.Contract(
      this.ERC721FactoryAddress,
      abi,
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

import { Injectable } from '@nestjs/common';
import { Contract, HDNodeWallet, Wallet, ethers } from 'ethers';

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

    const contract = await this.getERC20Contract(wallet);

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

    const methodName = 'createNewContract(string,string)';

    const contract = await this.getERC721Contract(wallet);

    try {
      const result = await contract[methodName](name, symbol);
      console.log(`Smart Contract Method "${methodName}" Result:`, result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getERC721Contract(wallet: Wallet): Promise<Contract> {
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
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "contractAddress",
            "type": "address"
          }
        ],
        "name": "NewContract",
        "type": "event"
      },
    ];

    const contract = new ethers.Contract(
      this.ERC721FactoryAddress,
      abi,
      wallet,
    );

    return contract;
  }

  async getERC20Contract(wallet: Wallet): Promise<Contract> {
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

    const contract = new ethers.Contract(this.ERC20FactoryAddress, abi, wallet);

    return contract;
  }

  async listenForEvent() {
    const contract = await this.getERC721Contract(this.getWallet());
    contract.on('NewContract', (contractAddress) => {
      console.log('Event received:', contractAddress);
    });
  }
}

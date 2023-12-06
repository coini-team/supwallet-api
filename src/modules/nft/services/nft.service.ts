// Third Party Dependencies.
import { Contract, ethers, Wallet } from 'ethers';
import { Injectable } from '@nestjs/common';

// Local Dependencies.
import contractERC721_ABI from '../../../contracts/abis/contractERC721_ABI.json';
import { ConfigService } from '../../../config/config.service';
import { Blockchain } from '../../../config/config.keys';

@Injectable()
export class NftService {
  constructor(private readonly configService: ConfigService) {}

  async deployERC721Token(
    wallet: Wallet,
    tokenParams: { name: string; symbol: string },
  ): Promise<string> {
    const { name, symbol } = tokenParams;
    const methodName = 'createNewContract(string,string)';

    const contract = new ethers.Contract(
      this.configService.get(Blockchain.ERC721_FACTORY_ADDRESS),
      contractERC721_ABI,
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

  async getERC721Contract(wallet: Wallet): Promise<Contract> {
    const abi = [
      {
        constant: false,
        inputs: [
          {
            name: '_name',
            type: 'string',
          },
          {
            name: '_symbol',
            type: 'string',
          },
        ],
        name: 'createNewContract',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'contractAddress',
            type: 'address',
          },
        ],
        name: 'NewContract',
        type: 'event',
      },
    ];

    const contract = new ethers.Contract(
      this.configService.get(Blockchain.ERC721_FACTORY_ADDRESS),
      abi,
      wallet,
    );

    return contract;
  }
}

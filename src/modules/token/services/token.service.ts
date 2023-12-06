// Third Party Dependencies.
import { Contract, ethers, Wallet } from 'ethers';
import { Injectable } from '@nestjs/common';

// Local Dependencies.
import contractERC20_ABI from '../../../contracts/abis/contractERC20_ABI.json';
import { ConfigService } from '../../../config/config.service';
import { Blockchain } from '../../../config/config.keys';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  async deployERC20Token(
    wallet: Wallet,
    tokenParams: { name: string; symbol: string; supply: number },
  ): Promise<string> {
    const { name, symbol, supply } = tokenParams;
    const methodName = 'CreateNewERC20Token(string,string,uint256)';
    console.log('wallet', wallet);
    const contract = new ethers.Contract(
      this.configService.get(Blockchain.ERC20_FACTORY_ADDRESS),
      contractERC20_ABI,
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

  async getERC20Contract(wallet: Wallet): Promise<Contract> {
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
          {
            name: '_supply',
            type: 'uint256',
          },
        ],
        name: 'CreateNewERC20',
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
            indexed: false,
            name: 'erc20TokenAddress',
            type: 'address',
          },
          {
            indexed: false,
            name: 'index',
            type: 'uint256',
          },
        ],
        name: 'NewERC20TokenContract',
        type: 'event',
      },
    ];

    const contract = new ethers.Contract(
      this.configService.get(Blockchain.ERC20_FACTORY_ADDRESS),
      abi,
      wallet,
    );

    return contract;
  }

  async balanceOfERC20Token(
    wallet: Wallet,
    addressERC20: string,
    account: string,
  ): Promise<string> {
    const abi = [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    console.log('wallet', wallet);
    const contract = new ethers.Contract(addressERC20, abi, wallet);
    const balance = await contract.balanceOf(account);

    console.log(
      'addressERC20: ' +
        addressERC20 +
        '\n' +
        'account: ' +
        account +
        '\n' +
        'balance: ' +
        balance,
    );

    return balance;
  }

  async transferERC20Token(
    wallet: Wallet,
    addressERC20: string,
    to: string,
    value: number,
  ): Promise<void> {
    const abi = [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];

    console.log('wallet: ', wallet);
    const contract = new ethers.Contract(addressERC20, abi, wallet);
    await contract.transfer(to, value);
    console.log(
      'addressERC20: ' +
        addressERC20 +
        '\n' +
        'to: ' +
        to +
        '\n' +
        'value: ' +
        value,
    );

    return;
  }
}

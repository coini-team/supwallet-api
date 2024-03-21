import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/modules/user/entities/user.entity';
import { Tokens } from '../entities/tokens.entity';
import { UserDto } from '../dto/user.dto';
import { Network } from 'src/modules/chain/entities/network.entity';
import { SendPaymentDto } from '../dto/send-payment.dto';

@Injectable()
export class CoreService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(Tokens)
    private readonly _tokensRepository: Repository<Tokens>,
    @InjectRepository(Network)
    private readonly _networkRepository: Repository<Network>,
  ) {}

  async getWallet(phone: string) {
    const userExist: User = await this._userRepository.findOne({
      where: { phone },
    });
    if (!userExist) throw new Error('User not found');
    console.log('=> result:', `imageQR: ${userExist.qrCode}`);
    return {
      success: true,
      wallet: userExist.wallet,
      imageQR: userExist.qrCode,
    };
  }

  async getNetwork(phone: string) {
    const userExist: User = await this._userRepository.findOne({
      where: { phone },
    });
    if (!userExist) throw new Error('User not found');
    const networkRows = await this._networkRepository.find({
      where: { user: userExist },
    });
    const networkNames = networkRows.map((network) => network.name);
    return { success: true, network: networkNames };
  }

  async getTokens(phone: string, network: string) {
    const userExist: User = await this._userRepository.findOne({
      where: { phone },
    });
    if (!userExist) throw new Error('User not found');
    const networkExist: Network = await this._networkRepository.findOne({
      where: { user: userExist, name: network },
    });
    if (!networkExist) throw new Error('Network not found for the user');
    const tokens: Tokens[] = await this._tokensRepository.find({
      where: { user: userExist, network: networkExist },
    });

    // Mapear los tokens para incluir solo el campo 'name'
    const simplifiedTokens = tokens.map((token) => token.name);

    return { success: true, tokens: simplifiedTokens };
  }

  async balanceByToken(userDto: UserDto) {
    const userExist: User = await this._userRepository.findOne({
      where: { phone: userDto.phone },
    });
    if (!userExist) throw new Error('User not found');
    const networkExist: Network = await this._networkRepository.findOne({
      where: { user: userExist, name: userDto.network },
    });
    if (!networkExist) throw new Error('Network not found for the user');
    const tokens: Tokens[] = await this._tokensRepository.find({
      where: { user: userExist, network: networkExist, symbol: userDto.token },
    });
    if (tokens.length === 0) throw new Error('No tokens found for the user');
    const amount = tokens[0].amount;
    return { success: true, amount };
  }

  async makePayment(sendPayment: SendPaymentDto) {
    // Destructuring the sendPayment object.
    const { phone, token, receiver, amount, network } = sendPayment;

    // Parse the amount to a numeric value.
    const numericAmount = parseFloat(amount);

    // Check if the amount is invalid.
    if (
      isNaN(numericAmount) ||
      numericAmount < 0.0000001 ||
      amount.length > 8
    ) {
      throw new UnauthorizedException('Invalid amount');
    }

    // Get Network URL from Database.
    // const { rpc_url } = await this.NetworkRepository.findOne({
    //   name: network,
    // });

    // Get the sender wallet from the database.
    // const { wallet } = await this._userRepository.findOne({
    //   where: { phone },
    // });

    // TODO: Implement Get Private Key from Wallet.
    // const senderPrivateKey =
    //   '0x1234567890123456789012345678901234567890123456789012345678901234';
    //
    // // Configures the provider and wallet using ethers.js
    // const provider = new ethers.JsonRpcProvider(rpc_url);
    // const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
    //
    // // Create a new contract instance.
    // const erc20Contract = new ethers.Contract(
    //   token,
    //   ['function transfer(address to, uint256 amount)'],
    //   senderWallet,
    // );
    //
    // // TODO: Implement Get Balance of ERC20 Token.
    //
    // // Convert the amount to a decimal value.
    // const decimalAmount = ethers.parseUnits(amount, 6);
    //
    // // Make the payment.
    // const transaction = await erc20Contract.transfer(receiver, decimalAmount);
    //
    // console.log('Transaction hash:', transaction.hash);
    // await transaction.wait();
    // console.log('Transaction confirmed');

    // Return the result.
    return {
      success: true,
      // message: `Transaction confirmed: ${transaction.hash}, Amount: ${amount} ${token} sent to ${receiver} from ${phone} wallet.`,
      message: 'Transaction confirmed',
    };
  }
}

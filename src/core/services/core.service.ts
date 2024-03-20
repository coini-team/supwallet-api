import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/modules/user/entities/user.entity';
import { Tokens } from '../entities/tokens.entity';
import { TokensDto } from '../dto/token.dto';

@Injectable()
export class CoreService {
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>,
        @InjectRepository(Tokens)
        private readonly _tokensRepository: Repository<Tokens>,
    ) { }

    async getWallet(phone: string) {
        const userExist: User = await this._userRepository.findOne({
            where: { phone },
        });
        if (!userExist) throw new Error('User not found');
        console.log('=> result:', `imageQR: ${userExist.qrCode}`);
        return { success: true, wallet: userExist.wallet, imageQR: userExist.qrCode };
    }

    async balance(phone: string) {
        const userExist: User = await this._userRepository.findOne({
            where: { phone },
        });
        if (!userExist) throw new Error('User not found');
        const tokens: Tokens[] = await this._tokensRepository.find({
            where: { user: userExist },
        });

        // Mapear los tokens para incluir solo los campos 'name' y 'amount'
        const simplifiedTokens = tokens.map(token => ({
            name: token.name,
            amount: token.amount,
        }));

        return { success: true, tokens: simplifiedTokens };
    }


    async balanceByToken(tokensDto: TokensDto) {
        const userExist: User = await this._userRepository.findOne({
            where: { phone: tokensDto.phone },
        });
        if (!userExist) throw new Error('User not found');
        const tokens: Tokens[] = await this._tokensRepository.find({
            where: { user: userExist, symbol: tokensDto.token },
        });
        if (tokens.length === 0) throw new Error('No tokens found for the user');
        const amount = tokens[0].amount;
        return { success: true, amount };
    }
}

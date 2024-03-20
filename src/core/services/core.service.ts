import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/modules/user/entities/user.entity';
import { Tokens } from '../entities/tokens.entity';
import { UserDto } from '../dto/user.dto';
import { Network } from 'src/modules/chain/entities/network.entity';

@Injectable()
export class CoreService {
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>,
        @InjectRepository(Tokens)
        private readonly _tokensRepository: Repository<Tokens>,
        @InjectRepository(Network)
        private readonly _networkRepository: Repository<Network>,
    ) { }

    async getWallet(phone: string) {
        const userExist: User = await this._userRepository.findOne({
            where: { phone },
        });
        if (!userExist) throw new Error('User not found');
        console.log('=> result:', `imageQR: ${userExist.qrCode}`);
        return { success: true, wallet: userExist.wallet, imageQR: userExist.qrCode };
    }

    async getNetwork(phone: string) {
        const userExist: User = await this._userRepository.findOne({
            where: { phone },
        });
        if (!userExist) throw new Error('User not found');
        const networkRows = await this._networkRepository.find({
            where: { user: userExist },
        });
        const networkNames = networkRows.map(network => network.name);
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
        const simplifiedTokens = tokens.map(token => token.name);

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
}

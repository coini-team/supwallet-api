import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class CoreService {
    constructor(@InjectRepository(User)
    private readonly _userRepository: Repository<User>) {}

    async getWallet(phone: string) {
        const userExist: User = await this._userRepository.findOne({
            where: { phone },
        });
        if (!userExist) throw new Error('User not found');
        console.log('=> result:', `imageQR: ${userExist.qrCode}`);
        return { success: true, wallet: userExist.wallet, imageQR: userExist.qrCode };
    }

}

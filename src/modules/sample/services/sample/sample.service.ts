import { Injectable } from '@nestjs/common';

import { encrypt, decrypt } from '../../../../shared/security/crypto.security';
import { ConfigService } from '../../../../config/config.service';
import { Security } from '../../../../config/config.keys';

@Injectable()
export class SampleService {
    constructor(private readonly configService: ConfigService) {}

    encrypt(value) {
        const key = this.configService.get(Security.SECURE_ENCRYPTION_KEY);
        return encrypt(key, value);
    }

    decrypt(value) {
        const key = this.configService.get(Security.SECURE_ENCRYPTION_KEY);
        return decrypt(key, value);
    } 
}

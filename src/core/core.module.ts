import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreService } from './services/core.service';
import { CoreController } from './controllers/core.controller';
import { User } from 'src/modules/user/entities/user.entity';
import { Tokens } from './entities/tokens.entity';
import { Network } from 'src/modules/chain/entities/network.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tokens, Network])],
  controllers: [CoreController],
  providers: [CoreService]
})
export class CoreModule { }

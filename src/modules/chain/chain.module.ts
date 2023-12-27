import { Module } from '@nestjs/common';
import { ChainService } from './services/chain.service';
import { ChainController } from './controllers/chain.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chain } from './entities/chain.entity';
import { Network } from './entities/network.entity';
import { CryptoNetwork } from './entities/crypto-network.entity';
import { Crypto } from './entities/crypto.entity';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chain, Network, Crypto, CryptoNetwork]),
    ConfigModule,
  ],
  controllers: [ChainController],
  providers: [ChainService],
  exports: [ChainService],
})
export class ChainModule {}

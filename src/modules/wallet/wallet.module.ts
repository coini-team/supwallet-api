// Third Party Dependencies.
import { Module } from '@nestjs/common';

// Local Dependencies.
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';
import { ConfigModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), ConfigModule],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}

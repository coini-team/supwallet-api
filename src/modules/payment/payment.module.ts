import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentController } from 'src/modules/payment/controllers/payment.controller';
import { PaymentService } from 'src/modules/payment/services/payment.service';

import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { ReceiverWallet } from 'src/modules/wallet/entities/receiver-wallet.entity';
import { Network } from '../chain/entities/network.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wallet,
      ReceiverWallet,
      Network,
    ])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

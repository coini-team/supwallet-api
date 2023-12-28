import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentController } from './controllers/payment/payment.controller';
import { PaymentService } from './services/payment/payment.service';

import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { ReceiverWallet } from 'src/modules/wallet/entities/receiver-wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, ReceiverWallet])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

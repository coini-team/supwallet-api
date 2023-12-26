import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentController } from './controllers/payment/payment.controller';
import { PaymentService } from './services/payment/payment.service';

import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { ReceivingWallet } from 'src/modules/wallet/entities/receiving-wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wallet,
      ReceivingWallet,
    ])],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }

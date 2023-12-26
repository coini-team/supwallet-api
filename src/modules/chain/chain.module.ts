import { Module } from '@nestjs/common';
import { ChainService } from './services/chain.service';
import { ChainController } from './controllers/chain.controller';

@Module({
  controllers: [ChainController],
  providers: [ChainService],
})
export class ChainModule {}

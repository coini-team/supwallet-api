import { Module } from '@nestjs/common';
import { CoreService } from './services/core.service';
import { CoreController } from './controllers/core.controller';

@Module({
  controllers: [CoreController],
  providers: [CoreService]
})
export class CoreModule {}

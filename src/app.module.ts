import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DappController } from './dapp/dapp.controller';
import { DappService } from './dapp/dapp.service';

@Module({
  imports: [],
  controllers: [AppController, DappController],
  providers: [AppService, DappService],
})
export class AppModule {}

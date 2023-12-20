// Third Party Dependencies.
import { initClient } from 'messagebird';
import { Module } from '@nestjs/common';

// Local Dependencies.
import { MessageService } from './services/message.service';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [
    MessageService,
    {
      provide: 'MessageBirdClient',
      useFactory: async () => {
        const client = initClient(process.env.MESSAGEBIRD_ACCESS_KEY);
        return client;
      },
    },
  ],
  exports: [MessageService],
})
export class MessageModule {}

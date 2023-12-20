// Third Party Dependencies.
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Local Dependencies.
import { MessageModule } from '../modules/message/message.module';
import { ConfigModule } from '../config/config.module';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    MessageModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_REFRESH_SECRET,
    }),
  ],
  controllers: [],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

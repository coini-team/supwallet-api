import { Module } from '@nestjs/common';
import { SampleController } from './controllers/sample/sample.controller';
import { SampleService } from './services/sample/sample.service';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [SampleController],
  providers: [SampleService]
})
export class SampleModule {}

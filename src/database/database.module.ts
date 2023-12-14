import { Module } from '@nestjs/common';
import { databaseProviders } from './services/database.service';

@Module({
  imports: [...databaseProviders],
  controllers: [],
  providers: [],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

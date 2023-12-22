// Third Party Dependencies.
import { Global, Module } from '@nestjs/common';

// Local Dependencies.
import { databaseProviders } from './services/database.service';

@Global()
@Module({
  imports: [...databaseProviders],
  controllers: [],
  providers: [],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

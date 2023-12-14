// Third Party Dependencies.
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';

// Local Dependencies.
import { ConfigService } from 'src/config/config.service';
import { ConfigModule } from 'src/config/config.module';
import { Configuration } from 'src/config/config.keys';

export const databaseProviders = [
  // Provide the Database Connection.
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    // Provide the Config Service.
    async useFactory(config: ConfigService) {
      return {
        ssl: config.get(Configuration.DB_SSL) === 'true',
        type: 'mysql',
        host: config.get(Configuration.DB_HOST),
        port: +config.get(Configuration.DB_PORT),
        username: config.get(Configuration.DB_USERNAME),
        password: config.get(Configuration.DB_PASSWORD),
        database: config.get(Configuration.DB_NAME),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      } as ConnectionOptions;
    },
  }),
];

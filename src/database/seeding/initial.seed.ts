import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, Repository } from 'typeorm';

import { Wallet } from 'src/modules/wallet/entities/wallet.entity'

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // ...
    // const walletRepository: Repository<Wallet>;
    // return await this.walletRepository.save(test);
  }
}
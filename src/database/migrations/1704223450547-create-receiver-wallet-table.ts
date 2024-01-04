import { MigrationInterface, QueryRunner } from 'typeorm';

export class createReceiverWalletTable1704223450547
  implements MigrationInterface
{
  name = 'createReceiverWalletTable1704223450547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`receiver_wallet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`address\` varchar(50) NOT NULL, \`type\` enum ('recognized_tx', 'no_recognized_tx') NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`receiver_wallet\``);
  }
}

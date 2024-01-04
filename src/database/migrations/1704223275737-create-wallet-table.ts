import { MigrationInterface, QueryRunner } from 'typeorm';

export class createWalletTable1704223275737 implements MigrationInterface {
  name = 'createWalletTable1704223275737';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`wallet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`address\` varchar(50) NOT NULL, \`private_key\` varchar(70) NOT NULL, \`seedphrase\` varchar(200) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`wallet\``);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class cryptoNetworkTableCreate1703621132671
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`crypto_network\` (
        \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        \`contract\` VARCHAR(50) NOT NULL,
        \`status\` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        \`network_id\` INT UNSIGNED,
        \`crypto_id\` INT UNSIGNED,
        CONSTRAINT \`FK_network_crypto_network\` FOREIGN KEY (\`network_id\`) REFERENCES \`network\`(\`id\`),
        CONSTRAINT \`FK_crypto_crypto_network\` FOREIGN KEY (\`crypto_id\`) REFERENCES \`crypto\`(\`id\`)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`crypto_network\``);
  }
}

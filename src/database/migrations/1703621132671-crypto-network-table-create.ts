import { MigrationInterface, QueryRunner } from 'typeorm';

export class cryptoNetworkTableCreate1703621132671
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`crypto_network\` (
        \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`contract\` VARCHAR(50) NOT NULL,
        \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        \`network_id\` INT NOT NULL,
        \`crypto_id\` INT NOT NULL,
        CONSTRAINT \`FK_network_crypto_network\` FOREIGN KEY (\`network_id\`) REFERENCES \`network\`(\`id\`),
        CONSTRAINT \`FK_crypto_crypto_network\` FOREIGN KEY (\`crypto_id\`) REFERENCES \`crypto\`(\`id\`)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`crypto_network\``);
  }
}

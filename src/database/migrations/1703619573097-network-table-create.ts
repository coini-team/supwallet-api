import { MigrationInterface, QueryRunner } from 'typeorm';

export class networkTableCreate1703619573097 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`network\` (
        \`id\` INT UNSIGNED PRIMARY KEY,
        \`name\` VARCHAR(25) NOT NULL,
        \`icon\` VARCHAR(50) NOT NULL,
        \`rpc_chain_name\` VARCHAR(20) NOT NULL,
        \`rpc_chain_id\` VARCHAR(10) NOT NULL,
        \`status\` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        \`chain_id\` INT UNSIGNED,
        CONSTRAINT \`FK_chain_network\` FOREIGN KEY (\`chain_id\`) REFERENCES \`chain\`(\`id\`)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`network\``);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class networkTableCreate1703619573097 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`network\` (
        \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(25) NOT NULL,
        \`icon\` VARCHAR(50) NOT NULL,
        \`rpc_chain_name\` VARCHAR(20) NOT NULL,
        \`rpc_chain_id\` VARCHAR(10) NOT NULL,
        \`rpc_url\` VARCHAR(150) NOT NULL,
        \`rpc_ws\` VARCHAR(150) NOT NULL,
        \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        \`chain_id\` INT NOT NULL,
        CONSTRAINT \`FK_chain_network\` FOREIGN KEY (\`chain_id\`) REFERENCES \`chain\`(\`id\`)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`network\``);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class createChainAndNetworkTable1704223725438
  implements MigrationInterface
{
  name = 'createChainAndNetworkTable1704223725438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`network\` (\`id\` int NOT NULL, \`name\` varchar(25) NOT NULL, \`icon\` varchar(50) NOT NULL, \`rpc_chain_name\` varchar(20) NOT NULL, \`rpc_chain_id\` varchar(10) NOT NULL, \`rpc_url\` varchar(100) NOT NULL, \`rpc_ws\` varchar(100) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`chain_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`chain\` (\`id\` int NOT NULL, \`name\` varchar(25) NOT NULL, \`icon\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`network\` ADD CONSTRAINT \`FK_14acb3b79a9403cf22b74349b7a\` FOREIGN KEY (\`chain_id\`) REFERENCES \`chain\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`network\` DROP FOREIGN KEY \`FK_14acb3b79a9403cf22b74349b7a\``,
    );
    await queryRunner.query(`DROP TABLE \`chain\``);
    await queryRunner.query(`DROP TABLE \`network\``);
  }
}

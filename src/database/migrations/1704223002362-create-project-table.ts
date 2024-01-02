import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProjectTable1704223002362 implements MigrationInterface {
  name = 'createProjectTable1704223002362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`project\` (\`id\` int NOT NULL AUTO_INCREMENT, \`organization_id\` int NOT NULL, \`name\` varchar(500) NOT NULL, \`mode\` varchar(255) NOT NULL, \`api_key\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`project\``);
  }
}

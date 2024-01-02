import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1704224333823 implements MigrationInterface {
  name = 'createUserTable1704224333823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(45) NOT NULL, \`last_name\` varchar(45) NULL, \`email\` varchar(45) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}

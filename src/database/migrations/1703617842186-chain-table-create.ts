import { MigrationInterface, QueryRunner } from "typeorm";

export class chainTableCreate1703617842186 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`chain\` (
        \`id\` INT UNSIGNED PRIMARY KEY,
        \`name\` VARCHAR(25) NOT NULL,
        \`icon\` VARCHAR(50) NOT NULL
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`chain\``);
  }
}

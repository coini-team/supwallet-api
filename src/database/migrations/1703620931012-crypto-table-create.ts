import { MigrationInterface, QueryRunner } from 'typeorm';

export class cryptoTableCreate1703620931012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`crypto\` (
        \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(20) NOT NULL,
        \`icon\` VARCHAR(50) NOT NULL,
        \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active'
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`crypto\``);
  }
}

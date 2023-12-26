import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProjectTable1703040077601 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE project (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                organization_id INT NOT NULL,
                name VARCHAR(500) NOT NULL,
                mode VARCHAR(255) NOT NULL,
                project_id INT NOT NULL,
                private_key VARCHAR(255) NOT NULL,
                api_key VARCHAR(255) NOT NULL,
                status VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE project`);
  }
}

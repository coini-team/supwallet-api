import {MigrationInterface, QueryRunner} from "typeorm";

export class walletTables1703268962001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE wallet (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                address VARCHAR(50) NOT NULL,
                private_key VARCHAR(70) NOT NULL,
                seedphrase VARCHAR(200) NOT NULL,
                status ENUM('active', 'inactive') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        await queryRunner.query(`
        CREATE TABLE receiver_wallet (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            address VARCHAR(50) NOT NULL,
            type ENUM('recognized_tx', 'no_recognized_tx') NOT NULL,
            status ENUM('active', 'inactive') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE wallet`);
        await queryRunner.query(`DROP TABLE receiver_wallet`);
    }

}

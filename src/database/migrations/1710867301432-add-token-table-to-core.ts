import {MigrationInterface, QueryRunner} from "typeorm";

export class addTokenTableToCore1710867301432 implements MigrationInterface {
    name = 'addTokenTableToCore1710867301432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tokens\` (\`id\` int NOT NULL, \`address\` varchar(255) NOT NULL, \`symbol\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tokens\` ADD CONSTRAINT \`FK_d417e5d35f2434afc4bd48cb4d2\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tokens\` DROP FOREIGN KEY \`FK_d417e5d35f2434afc4bd48cb4d2\``);
        await queryRunner.query(`DROP TABLE \`tokens\``);
    }

}

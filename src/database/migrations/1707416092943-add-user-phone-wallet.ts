import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserPhoneWallet1707416092943 implements MigrationInterface {
    name = 'addUserPhoneWallet1707416092943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`wallet\` varchar(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`wallet\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
    }

}

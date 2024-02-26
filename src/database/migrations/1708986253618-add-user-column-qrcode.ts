import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserColumnQrcode1708986253618 implements MigrationInterface {
    name = 'addUserColumnQrcode1708986253618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`qr_code\` varchar(150) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`qr_code\``);
    }

}

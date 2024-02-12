import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserAccessToken1707771152890 implements MigrationInterface {
    name = 'addUserAccessToken1707771152890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`access_token\` varchar(200) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`access_token\``);
    }

}

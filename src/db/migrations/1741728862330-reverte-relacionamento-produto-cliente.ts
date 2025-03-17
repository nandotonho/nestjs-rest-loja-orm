import { MigrationInterface, QueryRunner } from "typeorm";

export class ReverteRelacionamentoProdutoCliente1741728862330 implements MigrationInterface {
    name = 'ReverteRelacionamentoProdutoCliente1741728862330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "produtos" DROP CONSTRAINT "FK_f3d1aa828c6fc9cbdb5b728f855"`);
        await queryRunner.query(`ALTER TABLE "produtos" DROP COLUMN "usuario_id"`);
        await queryRunner.query(`ALTER TABLE "produtos" DROP COLUMN "usuarioIdId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "produtos" ADD "usuarioIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "produtos" ADD "usuario_id" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "produtos" ADD CONSTRAINT "FK_f3d1aa828c6fc9cbdb5b728f855" FOREIGN KEY ("usuarioIdId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

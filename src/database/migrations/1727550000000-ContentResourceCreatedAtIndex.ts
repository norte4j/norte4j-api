import {MigrationInterface, QueryRunner} from 'typeorm';

export class ContentResourceCreatedAtIndex1727550000000 implements MigrationInterface {
  name = 'ContentResourceCreatedAtIndex1727550000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE INDEX `IDX_content_resource_created_at` ON `content_resources` (`resource`, `createdAt`)');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_content_resource_created_at` ON `content_resources`');
  }
}
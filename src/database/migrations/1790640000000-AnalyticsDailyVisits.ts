import {MigrationInterface, QueryRunner} from 'typeorm';

export class AnalyticsDailyVisits1790640000000 implements MigrationInterface {
  name = 'AnalyticsDailyVisits1790640000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`analytics_daily_visits\` (
      \`id\` varchar(36) NOT NULL,
      \`visitor_hash\` char(64) NOT NULL,
      \`visit_date\` date NOT NULL,
      \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      UNIQUE INDEX \`uq_analytics_daily_visitor\` (\`visitor_hash\`, \`visit_date\`),
      INDEX \`idx_analytics_daily_visits_created_at\` (\`created_at\`),
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `analytics_daily_visits`');
  }
}

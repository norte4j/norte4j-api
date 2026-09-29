import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MetricsModule} from '../metrics/metrics.module';
import {AnalyticsController} from './analytics.controller';
import {AnalyticsService} from './analytics.service';
import {AnalyticsDailyVisit} from './analytics-visit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsDailyVisit]), MetricsModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

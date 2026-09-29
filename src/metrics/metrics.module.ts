import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {MetricsController} from './metrics.controller';
import {MetricsInterceptor} from './metrics.interceptor';
import {MetricsApiKeyGuard} from './metrics-api-key.guard';
import {MetricsService} from './metrics.service';

@Module({
  imports: [ConfigModule],
  controllers: [MetricsController],
  providers: [
    MetricsService,
    MetricsApiKeyGuard,
    {provide: APP_INTERCEPTOR, useClass: MetricsInterceptor},
  ],
  exports: [MetricsService],
})
export class MetricsModule {}

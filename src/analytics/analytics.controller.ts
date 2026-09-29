import {Body, Controller, HttpCode, Post} from '@nestjs/common';
import {AnalyticsEventDto} from './analytics.dto';
import {AnalyticsService} from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Post('events')
  @HttpCode(202)
  track(@Body() event: AnalyticsEventDto) {
    return this.analytics.track(event);
  }
}

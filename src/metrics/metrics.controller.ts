import {Controller, Get, Res, UseGuards} from '@nestjs/common';
import {Response} from 'express';
import {MetricsApiKeyGuard} from './metrics-api-key.guard';
import {MetricsService} from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @UseGuards(MetricsApiKeyGuard)
  async metrics(@Res() response: Response) {
    response.setHeader('Content-Type', this.metricsService.registry.contentType);
    response.send(await this.metricsService.metrics());
  }
}

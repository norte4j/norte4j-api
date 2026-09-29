import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {InjectRepository} from '@nestjs/typeorm';
import {createHmac} from 'crypto';
import {Repository} from 'typeorm';
import {MetricsService} from '../metrics/metrics.service';
import {AnalyticsEventDto} from './analytics.dto';
import {AnalyticsDailyVisit} from './analytics-visit.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsDailyVisit) private readonly visits: Repository<AnalyticsDailyVisit>,
    private readonly metrics: MetricsService,
    private readonly config: ConfigService,
  ) {}

  async track(event: AnalyticsEventDto) {
    const path = this.normalizePath(event.path);

    if (event.event === 'page_view') {
      this.metrics.pageViews.inc({path, device: event.device, referrer: event.referrer});
      await this.countUniqueVisit(event);
    } else if (event.event === 'session_start') {
      this.metrics.sessions.inc({device: event.device, referrer: event.referrer});
    } else if (event.event === 'click' && event.tag) {
      this.metrics.clicks.inc({tag: event.tag, path, kind: event.outbound ? 'outbound' : 'internal'});
    } else if (event.event === 'scroll_depth' && event.depth) {
      this.metrics.scrollDepth.inc({path, depth: String(event.depth)});
    } else if (event.event === 'engagement' && event.durationSeconds !== undefined) {
      this.metrics.engagementDuration.observe({path}, event.durationSeconds);
    }

    return {accepted: true};
  }

  private async countUniqueVisit(event: AnalyticsEventDto) {
    const secret = this.config.get<string>('ANALYTICS_SALT') || this.config.get<string>('JWT_SECRET') || 'norte4j-analytics';
    const visitorHash = createHmac('sha256', secret).update(event.visitorId).digest('hex');
    const visitDate = new Date().toISOString().slice(0, 10);
    try {
      await this.visits.insert({visitorHash, visitDate});
      this.metrics.uniqueVisits.inc({device: event.device, referrer: event.referrer});
    } catch (error) {
      if ((error as {code?: string}).code !== 'ER_DUP_ENTRY') throw error;
    }
  }

  private normalizePath(value: string) {
    const path = value.split('?')[0].split('#')[0].toLowerCase();
    if (/^\/evento\/[^/]+$/.test(path)) return '/evento/:slug';
    if (path === '/') return '/';
    return ['/404'].includes(path) ? path : '/other';
  }
}

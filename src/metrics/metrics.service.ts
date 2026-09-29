import {Injectable} from '@nestjs/common';
import {Counter, Gauge, Histogram, Registry, collectDefaultMetrics} from '@prometheus-io/client';

@Injectable()
export class MetricsService {
  readonly registry = new Registry();
  readonly httpRequestsTotal: Counter<'method' | 'route' | 'status_code'>;
  readonly httpRequestDuration: Histogram<'method' | 'route' | 'status_code'>;
  readonly httpRequestsInFlight: Gauge<'method' | 'route'>;
  readonly httpResponseSize: Histogram<'method' | 'route' | 'status_code'>;
  readonly uniqueVisits: Counter<'device' | 'referrer'>;
  readonly pageViews: Counter<'path' | 'device' | 'referrer'>;
  readonly sessions: Counter<'device' | 'referrer'>;
  readonly clicks: Counter<'tag' | 'path' | 'kind'>;
  readonly scrollDepth: Counter<'path' | 'depth'>;
  readonly engagementDuration: Histogram<'path'>;

  constructor() {
    this.registry.setDefaultLabels({
      application: 'norte4j-api',
      environment: process.env.NODE_ENV || 'development',
    });
    collectDefaultMetrics({register: this.registry, prefix: 'norte4j_'});

    this.httpRequestsTotal = new Counter({
      name: 'norte4j_http_requests_total',
      help: 'Total de requisições HTTP processadas pela API.',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });
    this.httpRequestDuration = new Histogram({
      name: 'norte4j_http_request_duration_seconds',
      help: 'Duração das requisições HTTP em segundos.',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });
    this.httpRequestsInFlight = new Gauge({
      name: 'norte4j_http_requests_in_flight',
      help: 'Quantidade de requisições HTTP atualmente em processamento.',
      labelNames: ['method', 'route'],
      registers: [this.registry],
    });
    this.httpResponseSize = new Histogram({
      name: 'norte4j_http_response_size_bytes',
      help: 'Tamanho das respostas HTTP em bytes quando Content-Length está disponível.',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000],
      registers: [this.registry],
    });
    this.uniqueVisits = new Counter({
      name: 'norte4j_analytics_unique_visits_total',
      help: 'Total de visitantes únicos por dia, deduplicados no backend.',
      labelNames: ['device', 'referrer'],
      registers: [this.registry],
    });
    this.pageViews = new Counter({
      name: 'norte4j_analytics_page_views_total',
      help: 'Total de visualizações de páginas públicas.',
      labelNames: ['path', 'device', 'referrer'],
      registers: [this.registry],
    });
    this.sessions = new Counter({
      name: 'norte4j_analytics_sessions_total',
      help: 'Total de sessões iniciadas no site.',
      labelNames: ['device', 'referrer'],
      registers: [this.registry],
    });
    this.clicks = new Counter({
      name: 'norte4j_analytics_clicks_total',
      help: 'Total de cliques em elementos com tag analítica.',
      labelNames: ['tag', 'path', 'kind'],
      registers: [this.registry],
    });
    this.scrollDepth = new Counter({
      name: 'norte4j_analytics_scroll_depth_total',
      help: 'Total de visitantes que alcançaram cada profundidade da página.',
      labelNames: ['path', 'depth'],
      registers: [this.registry],
    });
    this.engagementDuration = new Histogram({
      name: 'norte4j_analytics_engagement_duration_seconds',
      help: 'Tempo de engajamento por página em segundos.',
      labelNames: ['path'],
      buckets: [5, 15, 30, 60, 120, 300, 600, 1200, 1800, 3600],
      registers: [this.registry],
    });
  }

  metrics() {
    return this.registry.metrics();
  }
}

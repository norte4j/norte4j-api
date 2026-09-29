import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Request, Response} from 'express';
import {Observable} from 'rxjs';
import {MetricsService} from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const method = request.method;
    const route = this.route(request);

    if (request.originalUrl.split('?')[0] === '/api/metrics') return next.handle();

    const startedAt = process.hrtime.bigint();
    this.metrics.httpRequestsInFlight.inc({method, route});

    response.once('finish', () => {
      const statusCode = String(response.statusCode);
      const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
      const labels = {method, route, status_code: statusCode};

      this.metrics.httpRequestsTotal.inc(labels);
      this.metrics.httpRequestDuration.observe(labels, durationSeconds);
      this.metrics.httpRequestsInFlight.dec({method, route});

      const contentLength = Number(response.getHeader('content-length'));
      if (Number.isFinite(contentLength) && contentLength >= 0) {
        this.metrics.httpResponseSize.observe(labels, contentLength);
      }
    });

    return next.handle();
  }

  private route(request: Request) {
    const routePath = request.route?.path;
    if (!routePath) return 'unmatched';
    return `${request.baseUrl || ''}${routePath}`.replace(/\/+/g, '/');
  }
}

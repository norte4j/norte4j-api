import {CanActivate, ExecutionContext, Injectable, ServiceUnavailableException, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {timingSafeEqual} from 'crypto';
import {Request} from 'express';

@Injectable()
export class MetricsApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const expectedKey = this.config.get<string>('METRICS_API_KEY');
    if (!expectedKey) throw new ServiceUnavailableException('Métricas não configuradas');

    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = this.extractKey(request);
    if (!providedKey || !this.matches(providedKey, expectedKey)) {
      throw new UnauthorizedException('Chave de métricas inválida');
    }
    return true;
  }

  private extractKey(request: Request) {
    const headerKey = request.header('x-api-key');
    if (headerKey) return headerKey;

    const authorization = request.header('authorization');
    const match = authorization?.match(/^ApiKey\s+(.+)$/i);
    return match?.[1];
  }

  private matches(provided: string, expected: string) {
    const providedBuffer = Buffer.from(provided);
    const expectedBuffer = Buffer.from(expected);
    return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
  }
}

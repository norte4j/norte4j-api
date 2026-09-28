import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {SiteConfig} from './site-config.entity';

@Injectable()
export class ConfigStoreService {
  constructor(@InjectRepository(SiteConfig) private readonly repository: Repository<SiteConfig>) {}

  async all() {
    const rows = await this.repository.find({order: {key: 'ASC'}});
    return Object.fromEntries(rows.map((row) => [row.key, this.parse(row.value)]));
  }

  async set(key: string, value: unknown) {
    const row = await this.repository.save({key, value: typeof value === 'string' ? value : JSON.stringify(value)});
    return {key: row.key, value: this.parse(row.value)};
  }

  private parse(value: string) {
    try { return JSON.parse(value); } catch { return value; }
  }
}

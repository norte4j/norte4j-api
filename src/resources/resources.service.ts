import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ContentResource} from './resource.entity';

@Injectable()
export class ResourcesService {
  private readonly listCache = new Map<string, {expiresAt: number; value: unknown[]}>();
  private readonly cacheTtlMs = 15000;
  constructor(@InjectRepository(ContentResource) private readonly repository: Repository<ContentResource>) {
  }

  async all(resource: string) {
    const cached = this.listCache.get(resource);
    if (cached && cached.expiresAt > Date.now()) return cached.value;
    const rows = await this.repository.find({where: {resource}, order: {createdAt: 'DESC'}});
    if (resource === 'gallery') {
      rows.sort((a, b) => {
        const aOrder = typeof a.data.sortOrder === 'number' ? a.data.sortOrder : Number.MAX_SAFE_INTEGER;
        const bOrder = typeof b.data.sortOrder === 'number' ? b.data.sortOrder : Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder || b.createdAt.getTime() - a.createdAt.getTime();
      });
    }
    const value = rows.map((row) => this.serialize(row));
    this.listCache.set(resource, {expiresAt: Date.now() + this.cacheTtlMs, value});
    return value;
  }

  async one(resource: string, idOrSlug: string) {
    const row = await this.repository.findOne({where: [{resource, id: idOrSlug}, {resource, slug: idOrSlug}]});
    if (!row) throw new NotFoundException('Registro não encontrado');
    return this.serialize(row);
  }

  async create(resource: string, input: object) {
    const data = input as Record<string, any>;
    const row = await this.repository.save(this.repository.create({resource, slug: data.slug, data}));
    this.invalidate(resource);
    return this.serialize(row);
  }

  async update(resource: string, id: string, input: object) {
    const data = input as Record<string, any>;
    const row = await this.repository.findOneBy({resource, id});
    if (!row) throw new NotFoundException('Registro não encontrado');
    row.data = {...row.data, ...data};
    row.slug = (row.data.slug as string) || row.slug;
    this.invalidate(resource);
    return this.serialize(await this.repository.save(row));
  }

  async remove(resource: string, id: string) {
    const result = await this.repository.delete({resource, id});
    if (!result.affected) throw new NotFoundException('Registro não encontrado');
    this.invalidate(resource);
    return {deleted: true};
  }

  invalidate(resource: string) {
    this.listCache.delete(resource);
  }

  private serialize(row: ContentResource) {
    return {id: row.id, ...row.data, createdAt: row.createdAt, updatedAt: row.updatedAt};
  }
}

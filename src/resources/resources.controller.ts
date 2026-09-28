import {Body, Controller, Delete, Get, Header, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/auth.guard';
import {ResourceDto} from './resource.dto';
import {ResourcesService} from './resources.service';

const ALLOWED = ['events', 'workshops', 'gallery', 'partners', 'texts'];

@Controller()
export class ResourcesController {
  constructor(private readonly resources: ResourcesService) {
  }

  private collection(value: string) {
    if (!ALLOWED.includes(value)) throw new Error('Recurso inválido');
    return value;
  }

  @Get(':resource') @Header('Cache-Control', 'private, max-age=15') all(@Param('resource') resource: string) {
    return this.resources.all(this.collection(resource));
  }

  @Get(':resource/:id') @Header('Cache-Control', 'private, max-age=15') one(@Param('resource') resource: string, @Param('id') id: string) {
    return this.resources.one(this.collection(resource), id);
  }

  @Post(':resource') @UseGuards(JwtAuthGuard)
  create(@Param('resource') resource: string, @Body() data: ResourceDto) {
    return this.resources.create(this.collection(resource), data);
  }

  @Patch(':resource/:id') @UseGuards(JwtAuthGuard)
  update(@Param('resource') resource: string, @Param('id') id: string, @Body() data: ResourceDto) {
    return this.resources.update(this.collection(resource), id, data);
  }

  @Delete(':resource/:id') @UseGuards(JwtAuthGuard)
  remove(@Param('resource') resource: string, @Param('id') id: string) {
    return this.resources.remove(this.collection(resource), id);
  }
}

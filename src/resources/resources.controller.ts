import {Body, Controller, Delete, Get, Header, NotFoundException, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import {JwtAuthGuard} from '../auth/auth.guard';
import {ResourceDto} from './resource.dto';
import {ResourcesService} from './resources.service';

const ALLOWED = ['events', 'workshops', 'gallery', 'partners', 'texts', 'team'];
const ITEM_PATHS = ALLOWED.map((resource) => `${resource}/:id`);

@Controller()
export class ResourcesController {
  constructor(private readonly resources: ResourcesService) {}

  private collection(request: Request) {
    const resource = request.path.split('/').find((segment) => ALLOWED.includes(segment));
    if (!resource) throw new NotFoundException('Recurso inválido');
    return resource;
  }

  @Get(ALLOWED) @Header('Cache-Control', 'private, max-age=15')
  all(@Req() request: Request) {
    return this.resources.all(this.collection(request));
  }

  @Get(ITEM_PATHS) @Header('Cache-Control', 'private, max-age=15')
  one(@Req() request: Request, @Param('id') id: string) {
    return this.resources.one(this.collection(request), id);
  }

  @Post(ALLOWED) @UseGuards(JwtAuthGuard)
  create(@Req() request: Request, @Body() data: ResourceDto) {
    return this.resources.create(this.collection(request), data);
  }

  @Patch(ITEM_PATHS) @UseGuards(JwtAuthGuard)
  update(@Req() request: Request, @Param('id') id: string, @Body() data: ResourceDto) {
    return this.resources.update(this.collection(request), id, data);
  }

  @Delete(ITEM_PATHS) @UseGuards(JwtAuthGuard)
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.resources.remove(this.collection(request), id);
  }
}

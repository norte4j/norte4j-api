import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/auth.guard';
import {ResourceDto} from './resource.dto';
import {ResourcesService} from './resources.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly resources: ResourcesService) {
  }

  @Post() create(@Body() data: ResourceDto) {
    return this.resources.create('contacts', {...data, status: 'new'});
  }

  @Get() @UseGuards(JwtAuthGuard) all() {
    return this.resources.all('contacts');
  }
}

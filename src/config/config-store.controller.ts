import {Body, Controller, Get, Param, Put, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/auth.guard';
import {ConfigStoreService} from './config-store.service';

@Controller('config')
export class ConfigStoreController {
  constructor(private readonly config: ConfigStoreService) {}

  @Get()
  all() { return this.config.all(); }

  @Put(':key')
  @UseGuards(JwtAuthGuard)
  set(@Param('key') key: string, @Body('value') value: unknown) {
    return this.config.set(key, value);
  }
}
